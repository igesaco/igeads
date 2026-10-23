import { NextResponse } from 'next/server';
import { createSessionToken, getAdminCredentials, safeEqual, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    const admin = getAdminCredentials();
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Sunucuda ADMIN_EMAIL / ADMIN_PASSWORD tanımlı değil. Lütfen ortam değişkenlerini ekleyin.'
      }, { status: 500 });
    }

    if (!email || !password || !safeEqual(email, admin.email) || !safeEqual(password, admin.password)) {
      return NextResponse.json({ success: false, error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    const user = {
      email: admin.email,
      name: process.env.ADMIN_NAME || 'Ajans Yöneticisi',
      role: 'Ajans Yöneticisi & Media Buyer',
      type: 'agency' as const
    };

    const token = await createSessionToken(user);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Sunucuda AUTH_SECRET tanımlı değil' }, { status: 500 });
    }

    const res = NextResponse.json({ success: true, data: user });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS
    });
    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Giriş yapılamadı' }, { status: 500 });
  }
}
