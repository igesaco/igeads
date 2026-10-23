import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const clientSlug = searchParams.get('clientSlug');

    const where: any = { organizationId: tenant.orgId };
    if (clientId && clientId !== 'all') {
      where.clientId = clientId;
    } else if (clientSlug && clientSlug !== 'all') {
      where.client = { slug: clientSlug };
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        client: {
          select: { name: true, slug: true, sector: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      totalCount: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error('Campaigns fetch error:', error);
    return NextResponse.json({ success: false, error: 'Kampanyalar alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    
    let clientId: string | undefined;
    if (body.clientId) {
      const client = await prisma.client.findFirst({ where: { id: body.clientId, organizationId: tenant.orgId } });
      if (client) clientId = client.id;
    }
    if (!clientId && body.clientSlug) {
      const client = await prisma.client.findFirst({ where: { slug: body.clientSlug, organizationId: tenant.orgId } });
      if (client) clientId = client.id;
    }
    if (!clientId && body.clientName) {
      const client = await prisma.client.findFirst({
        where: {
          organizationId: tenant.orgId,
          name: { contains: body.clientName, mode: 'insensitive' }
        }
      });
      if (client) clientId = client.id;
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        organizationId: tenant.orgId,
        name: body.name || 'Yeni Kampanya',
        platform: body.platform || 'meta',
        status: 'active',
        dailyBudget: Number(body.dailyBudget) || 1000,
        spent: Number(body.spent) || 0,
        revenue: Number(body.revenue) || 0,
        roas: Number(body.roas) || 0,
        poas: Number(body.poas) || 0,
        cpc: Number(body.cpc) || 0,
        ctr: Number(body.ctr) || 0,
        fatigueScore: 0,
        targetMarketplaceStock: 100,
        ...(clientId && { clientId })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kampanya başarıyla veritabanına kaydedildi ve kuyruğa alındı.',
      campaign: newCampaign
    }, { status: 201 });
  } catch (error) {
    console.error('Campaign create error:', error);
    return NextResponse.json({
      success: false,
      error: 'Geçersiz veri veya veritabanı kayıt hatası'
    }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { id, status, dailyBudget } = body;

    if (!id) {
      return NextResponse.json({ error: 'Kampanya ID gerekli' }, { status: 400 });
    }

    const existing = await prisma.campaign.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!existing) {
      return NextResponse.json({ error: 'Kampanya bulunamadı' }, { status: 404 });
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(dailyBudget !== undefined && { dailyBudget: Number(dailyBudget) })
      }
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Campaign update error:', error);
    return NextResponse.json({ error: 'Kampanya güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Kampanya ID gerekli' }, { status: 400 });
    }

    const { count } = await prisma.campaign.deleteMany({ where: { id, organizationId: tenant.orgId } });
    if (count === 0) {
      return NextResponse.json({ error: 'Kampanya bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Kampanya başarıyla silindi' });
  } catch (error) {
    console.error('Campaign delete error:', error);
    return NextResponse.json({ error: 'Kampanya silinemedi' }, { status: 500 });
  }
}

