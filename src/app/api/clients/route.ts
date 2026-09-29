import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { campaigns: true, products: true }
        },
        campaigns: {
          select: { spent: true, revenue: true, dailyBudget: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const enriched = clients.map(client => {
      const totalSpent = client.campaigns.reduce((acc, c) => acc + c.spent, 0);
      const totalRevenue = client.campaigns.reduce((acc, c) => acc + c.revenue, 0);
      const totalDailyBudget = client.campaigns.reduce((acc, c) => acc + c.dailyBudget, 0);
      const avgRoas = totalSpent > 0 ? Number((totalRevenue / totalSpent).toFixed(2)) : 0;

      return {
        id: client.id,
        name: client.name,
        slug: client.slug,
        sector: client.sector,
        description: client.description,
        targetAudience: client.targetAudience,
        monthlyBudget: client.monthlyBudget,
        currency: client.currency,
        status: client.status,
        contactPerson: client.contactPerson,
        contactPhone: client.contactPhone,
        metaAccountId: client.metaAccountId,
        googleAdsId: client.googleAdsId,
        createdAt: client.createdAt,
        campaignCount: client._count.campaigns,
        productCount: client._count.products,
        totalSpent,
        totalRevenue,
        totalDailyBudget,
        roas: avgRoas
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: error.message || 'Müşteriler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      sector, 
      description, 
      targetAudience, 
      monthlyBudget = 25000, 
      contactPerson, 
      contactPhone,
      metaAccountId,
      googleAdsId
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Marka / Müşteri adı zorunludur' }, { status: 400 });
    }

    // Auto-generate clean slug
    let slug = name.toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '');

    if (!slug) slug = 'client-' + Date.now();

    // Check unique slug collision
    const existing = await prisma.client.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        slug,
        sector: sector || 'Genel Ticaret & Hizmet',
        description: description || null,
        targetAudience: targetAudience || null,
        monthlyBudget: Number(monthlyBudget) || 25000,
        contactPerson: contactPerson || null,
        contactPhone: contactPhone || null,
        metaAccountId: metaAccountId || null,
        googleAdsId: googleAdsId || null,
        status: 'active'
      }
    });

    // Automatically create a starter campaign for this new client
    await prisma.campaign.create({
      data: {
        clientId: client.id,
        name: `Meta - ${client.name} | Lansman & Satış Kampanyası`,
        platform: 'meta',
        status: 'active',
        dailyBudget: Math.round(Number(monthlyBudget) / 30) || 500,
        spent: 0,
        revenue: 0,
        roas: 0,
        poas: 0,
        cpc: 0,
        ctr: 0,
        fatigueScore: 0,
        targetMarketplaceStock: 100
      }
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: error.message || 'Müşteri eklenirken hata oluştu' }, { status: 500 });
  }
}
