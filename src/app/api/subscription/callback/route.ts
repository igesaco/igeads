import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { retrieveCheckoutForm } from '@/lib/iyzico';

function redirectTo(request: Request, result: 'basarili' | 'basarisiz', reason?: string) {
  const origin = process.env.APP_URL?.replace(/\/$/, '') || new URL(request.url).origin;
  const url = new URL('/', origin);
  url.searchParams.set('odeme', result);
  if (reason) url.searchParams.set('neden', reason.slice(0, 200));
  return NextResponse.redirect(url, 303);
}

function addPeriod(from: Date, cycle: string): Date {
  const d = new Date(from);
  if (cycle === 'annual') d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

/**
 * iyzico posts the checkout token here after the customer pays. The result is always confirmed with iyzico
 * (never trusted from the browser) before the plan is activated.
 */
export async function POST(request: Request) {
  let token = '';
  try {
    const form = await request.formData();
    token = String(form.get('token') || '');
  } catch {
    // ignore, handled below
  }
  if (!token) return redirectTo(request, 'basarisiz', 'Ödeme bilgisi alınamadı');

  const payment = await prisma.payment.findUnique({ where: { token } });
  if (!payment) return redirectTo(request, 'basarisiz', 'Ödeme kaydı bulunamadı');
  if (payment.status === 'paid') return redirectTo(request, 'basarili');

  try {
    const result = await retrieveCheckoutForm(token, payment.id);
    const amountMatches = result.paidPrice !== undefined && Math.abs(result.paidPrice - payment.amount) < 0.01;

    if (!result.paid || result.basketId !== payment.id || !amountMatches) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed', errorMessage: result.errorMessage || 'Ödeme doğrulanamadı' }
      });
      return redirectTo(request, 'basarisiz', result.errorMessage || 'Ödeme tamamlanmadı');
    }

    const org = await prisma.organization.findUniqueOrThrow({ where: { id: payment.organizationId } });
    // A renewal before the end of a paid period adds on top of the remaining time
    const stillPaid = org.planStatus === 'active' && org.currentPeriodEnd && org.currentPeriodEnd > new Date();
    const periodEnd = addPeriod(stillPaid ? org.currentPeriodEnd! : new Date(), payment.billingCycle);

    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: 'paid', providerRef: result.paymentId || null } }),
      prisma.organization.update({
        where: { id: org.id },
        data: { plan: payment.plan, planStatus: 'active', billingCycle: payment.billingCycle, currentPeriodEnd: periodEnd }
      }),
      prisma.notification.create({
        data: {
          organizationId: org.id,
          title: 'Ödeme alındı',
          message: `${payment.amount.toLocaleString('tr-TR')} TL ödemeniz alındı. Paketiniz ${periodEnd.toLocaleDateString('tr-TR')} tarihine kadar aktif.`,
          type: 'success'
        }
      })
    ]);
    return redirectTo(request, 'basarili');
  } catch (err: any) {
    console.error('iyzico callback error:', err);
    return redirectTo(request, 'basarisiz', 'Ödeme doğrulanırken hata oluştu');
  }
}
