import { NextResponse } from 'next/server';
import { getTenant, publicOrganization } from '@/lib/tenant';

export async function GET() {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Oturum bulunamadı' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { ...tenant.session, organization: publicOrganization(tenant.org) } });
}
