import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyPortalKey, verifySessionToken } from '@/lib/auth';

const PUBLIC_API = ['/api/auth/login', '/api/auth/logout', '/api/auth/me'];
const PORTAL_CLIENT_HEADER = 'x-portal-verified-client';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Never trust a verified-client header coming from the browser
  const headers = new Headers(request.headers);
  headers.delete(PORTAL_CLIENT_HEADER);

  if (PUBLIC_API.includes(pathname)) {
    return NextResponse.next({ request: { headers } });
  }

  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (user) {
    return NextResponse.next({ request: { headers } });
  }

  // Client portal: limited, read-mostly access for one brand with its portal key
  const portalClient = request.headers.get('x-portal-client');
  const portalKey = request.headers.get('x-portal-key');
  if (portalClient && await verifyPortalKey(portalClient, portalKey)) {
    const method = request.method;
    const allowed =
      (method === 'GET' && pathname === `/api/clients/${portalClient}`) ||
      (method === 'GET' && pathname === '/api/tasks' && searchParams.get('clientSlug') === portalClient) ||
      (method === 'PATCH' && pathname === '/api/tasks');

    if (allowed) {
      headers.set(PORTAL_CLIENT_HEADER, portalClient);
      return NextResponse.next({ request: { headers } });
    }
  }

  return NextResponse.json({ success: false, error: 'Bu işlem için giriş yapmanız gerekiyor' }, { status: 401 });
}

export const config = {
  matcher: '/api/:path*'
};
