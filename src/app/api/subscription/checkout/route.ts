import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isPlanId, PLANS, planPrice, type BillingCycle } from '@/lib/plans';
import { iyzicoConfig, initializeCheckoutForm } from '@/lib/iyzico';
import { clientIp } from '@/lib/rate-limit';
import { requireTenant } from '@/lib/tenant';

/** Starts an iyzico hosted payment for one billing period of the chosen plan */
export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request, { allowExpired: true, roles: ['owner', 'admin'] });
    if (tenant instanceof NextResponse) return tenant;

    const body = await request.json().catch(() => ({}));
    const plan = body?.plan;
    const cycle: BillingCycle = body?.cycle === 'annual' ? 'annual' : 'monthly';
    if (!isPlanId(plan)) {
      return NextResponse.json({ success: false, error: 'Geçersiz paket' }, { status: 400 });
    }

    if (!iyzicoConfig()) {
      return NextResponse.json({
        success: false,
        error: 'Online ödeme henüz aktif değil. Lütfen bizimle iletişime geçin.'
      }, { status: 503 });
    }

    const billing = body?.billing || {};
    const fullName = String(billing.fullName || tenant.session.name || '').trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const address = String(billing.address || '').trim();
    const city = String(billing.city || '').trim();
    const identityNumber = String(billing.identityNumber || '').replace(/\D/g, '');
    const gsmNumber = String(billing.phone || '').replace(/[^\d+]/g, '');

    if (!firstName || rest.length === 0) {
      return NextResponse.json({ success: false, error: 'Fatura için ad ve soyad girin' }, { status: 400 });
    }
    if (!address || !city) {
      return NextResponse.json({ success: false, error: 'Fatura adresi ve şehir zorunludur' }, { status: 400 });
    }
    if (identityNumber && identityNumber.length !== 10 && identityNumber.length !== 11) {
      return NextResponse.json({ success: false, error: 'T.C. kimlik no 11, vergi no 10 haneli olmalıdır' }, { status: 400 });
    }

    const amount = planPrice(plan, cycle);
    const payment = await prisma.payment.create({
      data: { organizationId: tenant.orgId, plan, billingCycle: cycle, amount, currency: 'TRY', status: 'pending' }
    });

    const origin = process.env.APP_URL?.replace(/\/$/, '') || new URL(request.url).origin;
    try {
      const { token, paymentPageUrl } = await initializeCheckoutForm({
        conversationId: payment.id,
        basketId: payment.id,
        price: amount,
        itemName: `İgeAds ${PLANS[plan].name} (${cycle === 'annual' ? 'Yıllık' : 'Aylık'})`,
        callbackUrl: `${origin}/api/subscription/callback`,
        buyer: {
          id: tenant.session.userId,
          name: firstName,
          surname: rest.join(' '),
          email: tenant.session.email,
          gsmNumber: gsmNumber || undefined,
          // iyzico requires an identity number; individuals without one may use its documented placeholder
          identityNumber: identityNumber || '11111111111',
          address,
          city,
          ip: clientIp(request) === 'local' ? '127.0.0.1' : clientIp(request)
        }
      });
      await prisma.payment.update({ where: { id: payment.id }, data: { token } });
      return NextResponse.json({ success: true, data: { paymentPageUrl } });
    } catch (err: any) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'failed', errorMessage: String(err.message).slice(0, 500) } });
      return NextResponse.json({ success: false, error: err.message || 'Ödeme başlatılamadı' }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: 'Ödeme başlatılamadı' }, { status: 500 });
  }
}
