import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const user = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Oturum bulunamadı' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: user });
}
