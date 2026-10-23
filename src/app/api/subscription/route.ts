import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plans';
import { iyzicoConfig } from '@/lib/iyzico';
import { publicOrganization, requireTenant } from '@/lib/tenant';

export async function GET(request: Request) {
  const tenant = await requireTenant(request, { allowExpired: true });
  if (tenant instanceof NextResponse) return tenant;

  const payments = await prisma.payment.findMany({
    where: { organizationId: tenant.orgId, status: { in: ['paid', 'failed'] } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, plan: true, billingCycle: true, amount: true, currency: true, status: true, createdAt: true }
  });

  return NextResponse.json({
    success: true,
    data: {
      organization: publicOrganization(tenant.org),
      plans: Object.values(PLANS),
      payments,
      paymentsEnabled: Boolean(iyzicoConfig()),
      canManageBilling: ['owner', 'admin'].includes(tenant.session.role)
    }
  });
}
