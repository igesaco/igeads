import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchMetaCampaigns } from '@/lib/integrations/meta';
import { fetchTrendyolProducts } from '@/lib/integrations/trendyol';
import { fetchHepsiburadaProducts } from '@/lib/integrations/hepsiburada';
import { requireTenant } from '@/lib/tenant';
import { hepsiburadaCredentials, metaCredentials, parseStoredCredentials, trendyolCredentials } from '@/lib/integrations/credentials';

/** Products are unique per organization by SKU */
async function upsertProduct(organizationId: string, sku: string, update: Record<string, any>, create: Record<string, any>) {
  const existing = await prisma.product.findFirst({ where: { organizationId, sku }, select: { id: true } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: update });
  } else {
    await prisma.product.create({ data: { ...create, sku, organizationId } as any });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const orgId = tenant.orgId;

    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider belirtilmedi' }, { status: 400 });
    }

    const cleanProvider = provider.replace(/^int-/, '').toLowerCase();
    const config = await prisma.integrationConfig.findFirst({
      where: { provider: cleanProvider, organizationId: orgId }
    });

    if (!config || !config.credentials) {
      return NextResponse.json({
        success: false,
        error: `${provider} için kayıtlı API anahtarı bulunamadı. Lütfen önce Entegrasyonlar sekmesinden bilgilerinizi kaydedin.`
      }, { status: 404 });
    }

    const credentials = parseStoredCredentials(config.credentials);

    if (cleanProvider === 'meta') {
      const { accessToken, adAccountId } = metaCredentials(credentials);

      if (!accessToken || !adAccountId) {
        return NextResponse.json({ success: false, error: 'Meta Access Token veya Ad Account ID eksik.' }, { status: 400 });
      }

      const metaCampaigns = await fetchMetaCampaigns({ accessToken, adAccountId });

      // Attach synced campaigns to the brand whose Meta ad account matches
      const cleanAccountId = adAccountId.replace(/^act_/, '');
      const owner = await prisma.client.findFirst({
        where: { organizationId: orgId, metaAccountId: { in: [cleanAccountId, `act_${cleanAccountId}`] } },
        select: { id: true }
      });
      
      // Save or update campaigns in Prisma
      let savedCount = 0;
      for (const mc of metaCampaigns) {
        // Missing metrics stay 0 instead of being filled with made-up values
        const dailyBudget = mc.daily_budget ? parseFloat(mc.daily_budget) / 100 : 0;
        const insights = mc.insights?.data?.[0] || {};
        const spent = insights.spend ? parseFloat(insights.spend) : 0;
        const roas = insights.purchase_roas?.[0]?.value ? parseFloat(insights.purchase_roas[0].value) : 0;
        const ctr = insights.ctr ? parseFloat(insights.ctr) : 0;
        const cpc = insights.cpc ? parseFloat(insights.cpc) : 0;
        const revenue = Math.round(spent * roas * 100) / 100;

        // Ids are prefixed with the organization so two accounts syncing the same ad account do not collide
        const existing = await prisma.campaign.findFirst({
          where: { organizationId: orgId, id: { in: [`meta-${mc.id}`, `meta-${orgId}-${mc.id}`] } },
          select: { id: true }
        });
        const fields = {
          name: mc.name,
          status: mc.status === 'ACTIVE' ? 'active' : 'paused',
          dailyBudget,
          spent,
          revenue,
          roas,
          ctr,
          cpc,
          ...(owner && { clientId: owner.id })
        };
        if (existing) {
          await prisma.campaign.update({ where: { id: existing.id }, data: fields });
        } else {
          await prisma.campaign.create({
            data: {
              ...fields,
              id: `meta-${orgId}-${mc.id}`,
              organizationId: orgId,
              platform: 'meta',
              fatigueScore: 0,
              targetMarketplaceStock: 100
            }
          });
        }
        savedCount++;
      }

      await prisma.integrationConfig.update({
        where: { id: config.id },
        data: { lastSync: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: `Meta'dan ${savedCount} adet canlı kampanya başarıyla eşitlendi.`,
        syncedCount: savedCount
      });
    }

    if (cleanProvider === 'trendyol') {
      const { supplierId, apiKey, apiSecret } = trendyolCredentials(credentials);

      if (!supplierId || !apiKey || !apiSecret) {
        return NextResponse.json({ success: false, error: 'Trendyol Satıcı ID, API Key veya Secret eksik.' }, { status: 400 });
      }

      const tyProducts = await fetchTrendyolProducts({ supplierId, apiKey, apiSecret });

      let savedCount = 0;
      for (const p of tyProducts) {
        const sku = p.barcode;
        const name = p.stockCode || p.productMainId || `Trendyol Ürünü (${p.barcode})`;
        const price = Number(p.salePrice || p.listPrice) || 0;
        const stock = Number(p.quantity) || 0;

        await upsertProduct(orgId, sku, { price, stock }, {
          name,
          marketplace: 'Trendyol',
          price,
          stock,
          buyboxPrice: price,
          isBuybox: true,
          returnRate: 0
        });
        savedCount++;
      }

      await prisma.integrationConfig.update({
        where: { id: config.id },
        data: { lastSync: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: `Trendyol'dan ${savedCount} adet canlı ürün ve stok veritabanına eşitlendi.`,
        syncedCount: savedCount
      });
    }

    if (cleanProvider === 'hepsiburada') {
      const { merchantId, secretKey, serviceUsername } = hepsiburadaCredentials(credentials);

      if (!merchantId || !secretKey) {
        return NextResponse.json({ success: false, error: 'Hepsiburada Merchant ID veya Gizli Anahtarı eksik.' }, { status: 400 });
      }

      let hbListings: any[] = [];
      try {
        hbListings = await fetchHepsiburadaProducts({ merchantId, secretKey, serviceUsername });
      } catch (hbErr: any) {
        return NextResponse.json({
          success: false,
          error: hbErr.message || 'Hepsiburada API servisi ile iletişim kurulamadı.'
        }, { status: 400 });
      }

      let savedCount = 0;
      for (const item of hbListings) {
        // Skip listings without a stable identifier; a counter-based key would overwrite other products
        const sku = item.hepsiburadaSku || item.merchantSku || item.listingId;
        if (!sku) continue;
        const name = item.productName || item.merchantSku || item.hepsiburadaSku || `Hepsiburada Ürünü (${sku})`;
        const price = Number(item.price) || 0;
        const stock = Number(item.availableStock) || 0;
        const isSalable = item.isSalable !== undefined ? Boolean(item.isSalable) : true;

        await upsertProduct(orgId, sku, { name, price, stock, marketplace: 'Hepsiburada' }, {
          name,
          marketplace: 'Hepsiburada',
          price,
          stock,
          buyboxPrice: price,
          isBuybox: isSalable,
          returnRate: 0
        });
        savedCount++;
      }

      await prisma.integrationConfig.update({
        where: { id: config.id },
        data: { lastSync: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: `Hepsiburada'dan ${savedCount} adet canlı ürün ve stok veritabanına eşitlendi.`,
        syncedCount: savedCount
      });
    }

    return NextResponse.json({
      success: false,
      error: `${provider} için veri eşitleme henüz desteklenmiyor.`
    }, { status: 400 });
  } catch (err: any) {
    console.error('Integration sync error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
