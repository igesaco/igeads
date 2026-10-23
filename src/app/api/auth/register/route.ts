import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword } from '@/lib/password';
import { TRIAL_DAYS } from '@/lib/plans';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { sessionResponse, toSessionUser } from '@/lib/tenant';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    if (!rateLimit(`register:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ success: false, error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const orgName = String(body?.organizationName || '').trim();
    const type = body?.accountType === 'business' ? 'business' : 'agency';

    if (!name || !orgName) {
      return NextResponse.json({ success: false, error: 'Ad soyad ve ajans / marka adı zorunludur' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: 'Geçerli bir e-posta adresi girin' }, { status: 400 });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ success: false, error: passwordError }, { status: 400 });
    }
    if (!body?.acceptTerms) {
      return NextResponse.json({ success: false, error: 'Devam etmek için kullanım koşullarını ve KVKK aydınlatma metnini onaylayın' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        type,
        plan: 'trial',
        planStatus: 'trialing',
        trialEndsAt,
        users: {
          create: { email, name, passwordHash, role: 'owner', lastLoginAt: new Date() }
        }
      },
      include: { users: true }
    });

    return sessionResponse(toSessionUser(org.users[0], org), org, 201);
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: 'Hesap oluşturulamadı' }, { status: 500 });
  }
}
