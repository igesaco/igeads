import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalContext, requireTenant } from '@/lib/tenant';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Portal visitors are limited by middleware to their own brand of their own organization
    const portal = getPortalContext(request);
    let orgId: string;
    if (portal) {
      orgId = portal.orgId;
    } else {
      const tenant = await requireTenant(request);
      if (tenant instanceof NextResponse) return tenant;
      orgId = tenant.orgId;
    }

    const client = await prisma.client.findFirst({
      where: {
        organizationId: orgId,
        ...(portal ? { slug: portal.clientSlug } : { OR: [{ id }, { slug: id }] })
      },
      include: {
        campaigns: true,
        products: true
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.client.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!existing) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
    }

    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        sector: body.sector,
        description: body.description,
        targetAudience: body.targetAudience,
        monthlyBudget: body.monthlyBudget ? Number(body.monthlyBudget) : undefined,
        status: body.status,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        metaAccountId: body.metaAccountId,
        googleAdsId: body.googleAdsId
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const { id } = await params;
    const { count } = await prisma.client.deleteMany({ where: { id, organizationId: tenant.orgId } });
    if (count === 0) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Müşteri ve bağlı veriler başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
