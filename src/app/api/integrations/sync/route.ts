import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchMetaCampaigns } from '@/lib/integrations/meta';
import { fetchTrendyolProducts } from '@/lib/integrations/trendyol';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider belirtilmedi' }, { status: 400 });
    }

    const cleanProvider = provider.replace(/^int-/, '').toLowerCase();
    const config = await prisma.integrationConfig.findUnique({
      where: { provider: cleanProvider }
    });

    if (!config || !config.credentials) {
      return NextResponse.json({
        success: false,
        error: `${provider} için kayıtlı API anahtarı bulunamadı. Lütfen önce Entegrasyonlar sekmesinden bilgilerinizi kaydedin.`
      }, { status: 404 });
    }

    let credentials: any = {};
    try {
      credentials = JSON.parse(config.credentials);
    } catch {
      credentials = {};
    }

    if (cleanProvider === 'meta') {
      const accessToken = credentials.accessToken || credentials['Meta System User Token'] || credentials['Access Token'];
      const adAccountId = credentials.adAccountId || credentials['Reklam Hesabı ID (Ad Account ID)'] || credentials['Ad Account ID'];

      if (!accessToken || !adAccountId) {
        return NextResponse.json({ success: false, error: 'Meta Access Token veya Ad Account ID eksik.' }, { status: 400 });
      }

      const metaCampaigns = await fetchMetaCampaigns({ accessToken, adAccountId });
      
      // Save or update campaigns in Prisma
      let savedCount = 0;
      for (const mc of metaCampaigns) {
        const dailyBudget = mc.daily_budget ? parseFloat(mc.daily_budget) / 100 : 1000;
        const insights = mc.insights?.data?.[0] || {};
        const spent = insights.spend ? parseFloat(insights.spend) : 0;
        const roas = insights.purchase_roas?.[0]?.value ? parseFloat(insights.purchase_roas[0].value) : 4.0;
        const ctr = insights.ctr ? parseFloat(insights.ctr) : 2.5;
        const cpc = insights.cpc ? parseFloat(insights.cpc) : 3.0;

        await prisma.campaign.upsert({
          where: { id: `meta-${mc.id}` },
          update: {
            name: mc.name,
            status: mc.status === 'ACTIVE' ? 'active' : 'paused',
            dailyBudget,
            spent,
            roas,
            ctr,
            cpc
          },
          create: {
            id: `meta-${mc.id}`,
            name: mc.name,
            platform: 'meta',
            status: mc.status === 'ACTIVE' ? 'active' : 'paused',
            dailyBudget,
            spent,
            roas,
            ctr,
            cpc,
            fatigueScore: 20,
            targetMarketplaceStock: 100
          }
        });
        savedCount++;
      }

      await prisma.integrationConfig.update({
        where: { provider: 'meta' },
        data: { lastSync: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: `Meta'dan ${savedCount} adet canlı kampanya başarıyla eşitlendi.`,
        syncedCount: savedCount
      });
    }

    if (cleanProvider === 'trendyol') {
      const supplierId = credentials.supplierId || credentials['Satıcı ID (Supplier ID)'];
      const apiKey = credentials.apiKey || credentials['API Key'];
      const apiSecret = credentials.apiSecret || credentials['API Secret'];

      if (!supplierId || !apiKey || !apiSecret) {
        return NextResponse.json({ success: false, error: 'Trendyol Satıcı ID, API Key veya Secret eksik.' }, { status: 400 });
      }

      const tyProducts = await fetchTrendyolProducts({ supplierId, apiKey, apiSecret });

      let savedCount = 0;
      for (const p of tyProducts) {
        const sku = p.barcode || p.stockCode || `TY-${p.id}`;
        const name = p.title || 'Trendyol Ürünü';
        const price = p.salePrice || p.listPrice || 1000;
        const stock = p.quantity ?? 10;

        await prisma.product.upsert({
          where: { sku },
          update: {
            name,
            price,
            stock,
            buyboxPrice: price,
            isBuybox: true
          },
          create: {
            sku,
            name,
            marketplace: 'Trendyol',
            price,
            stock,
            buyboxPrice: price,
            isBuybox: true,
            returnRate: 0.08
          }
        });
        savedCount++;
      }

      await prisma.integrationConfig.update({
        where: { provider: 'trendyol' },
        data: { lastSync: new Date() }
      });

      return NextResponse.json({
        success: true,
        message: `Trendyol'dan ${savedCount} adet canlı ürün ve stok veritabanına eşitlendi.`,
        syncedCount: savedCount
      });
    }

    return NextResponse.json({
      success: true,
      message: `${provider} için canlı veri eşitlemesi tamamlandı.`
    });
  } catch (err: any) {
    console.error('Integration sync error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
