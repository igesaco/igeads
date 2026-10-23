import { NextResponse } from 'next/server';
import { getAdminCredentials, safeEqual } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { claimUnownedRows, sessionResponse, toSessionUser } from '@/lib/tenant';

const INVALID = 'E-posta veya şifre hatalı';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!rateLimit(`login:${clientIp(request)}`, 10, 10 * 60 * 1000) || !rateLimit(`login:${email}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json({ success: false, error: 'Çok fazla deneme yapıldı. Lütfen 10 dakika sonra tekrar deneyin.' }, { status: 429 });
    }
    if (!email || !password) {
      return NextResponse.json({ success: false, error: INVALID }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { organization: true } });
    if (user) {
      if (!(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ success: false, error: INVALID }, { status: 401 });
      }
      await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
      return sessionResponse(toSessionUser(user, user.organization), user.organization);
    }

    // First sign-in of the platform owner (ADMIN_EMAIL / ADMIN_PASSWORD): create their account, which keeps
    // all data entered before accounts existed
    const admin = getAdminCredentials();
    if (admin && safeEqual(email, admin.email) && safeEqual(password, admin.password)) {
      const org = await prisma.organization.create({
        data: {
          name: process.env.ADMIN_ORG_NAME || 'İgeAds Ajans',
          type: 'agency',
          plan: 'agency',
          planStatus: 'active'
        }
      });
      const owner = await prisma.user.create({
        data: {
          email: admin.email,
          name: process.env.ADMIN_NAME || 'Ajans Yöneticisi',
          passwordHash: await hashPassword(password),
          role: 'owner',
          organizationId: org.id,
          lastLoginAt: new Date()
        }
      });
      await claimUnownedRows(org.id);
      return sessionResponse(toSessionUser(owner, org), org);
    }

    return NextResponse.json({ success: false, error: INVALID }, { status: 401 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Giriş yapılamadı' }, { status: 500 });
  }
}
