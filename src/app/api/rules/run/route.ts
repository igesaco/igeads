import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { runRulesForOrganization } from '@/lib/rules-engine';

export async function POST(request: Request) {
  const tenant = await requireTenant(request);
  if (tenant instanceof NextResponse) return tenant;
  try {
    const results = await runRulesForOrganization(tenant.orgId);
    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error('Manual rules run failed:', err);
    return NextResponse.json({ success: false, error: 'Kurallar çalıştırılamadı' }, { status: 500 });
  }
}
