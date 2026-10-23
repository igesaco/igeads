import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runRulesForOrganization } from '@/lib/rules-engine';

// Called by Vercel Cron (see vercel.json); Vercel sends "Authorization: Bearer <CRON_SECRET>"
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  const orgs = await prisma.automationRule.findMany({
    where: { enabled: true, metric: { not: null }, organizationId: { not: null } },
    select: { organizationId: true },
    distinct: ['organizationId']
  });

  let triggered = 0;
  for (const { organizationId } of orgs) {
    try {
      const results = await runRulesForOrganization(organizationId as string);
      triggered += results.filter(r => r.matched > 0).length;
    } catch (err) {
      console.error('Rules run failed for org', organizationId, err);
    }
  }

  return NextResponse.json({ success: true, organizations: orgs.length, triggered });
}
