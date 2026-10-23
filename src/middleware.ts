import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyPortalKey, verifySessionToken } from '@/lib/auth';

const PUBLIC_API = ['/api/auth/login', '/api/auth/logout', '/api/auth/me', '/api/auth/register'];
const PORTAL_CLIENT_HEADER = 'x-portal-verified-client';
const PORTAL_ORG_HEADER = 'x-portal-verified-org';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Never trust verified-portal headers coming from the browser
  const headers = new Headers(request.headers);
  headers.delete(PORTAL_CLIENT_HEADER);
  headers.delete(PORTAL_ORG_HEADER);

  if (PUBLIC_API.includes(pathname)) {
    return NextResponse.next({ request: { headers } });
  }

  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (user) {
    return NextResponse.next({ request: { headers } });
  }

  // Client portal: limited, read-mostly access for one brand of one organization with its portal key
  const portalClient = request.headers.get('x-portal-client');
  const portalKey = request.headers.get('x-portal-key');
  const portalOrg = portalClient ? await verifyPortalKey(portalClient, portalKey) : null;
  if (portalClient && portalOrg) {
    const method = request.method;
    const allowed =
      (method === 'GET' && pathname === `/api/clients/${portalClient}`) ||
      (method === 'GET' && pathname === '/api/tasks' && searchParams.get('clientSlug') === portalClient) ||
      (method === 'PATCH' && pathname === '/api/tasks');

    if (allowed) {
      headers.set(PORTAL_CLIENT_HEADER, portalClient);
      headers.set(PORTAL_ORG_HEADER, portalOrg);
      return NextResponse.next({ request: { headers } });
    }
  }

  return NextResponse.json({ success: false, error: 'Bu işlem için giriş yapmanız gerekiyor' }, { status: 401 });
}

export const config = {
  matcher: '/api/:path*'
};
