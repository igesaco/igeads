import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientSlug = searchParams.get('clientSlug') || 'all';

  let liveStats = {
    timestamp: new Date().toISOString(),
    status: 'online',
    currentVisitors: 342,
    activeCarts: 48,
    todaySalesCount: 418,
    todayGrossRevenue: 488650,
    todayNetMargin: 198420,
    liveSalesTicker: [
      { id: 'sale-1', city: 'İstanbul (Kadıköy)', channel: 'Trendyol', product: 'Hakiki Deri Biker Ceket', amount: 2199, time: '1 sn önce', source: 'Meta Ads' },
      { id: 'sale-2', city: 'Ankara (Çankaya)', channel: 'Amazon TR', product: 'Minimalist Sırt Çantası', amount: 1190, time: '14 sn önce', source: 'Google PMax' },
      { id: 'sale-3', city: 'İzmir (Karşıyaka)', channel: 'Web Mağazası', product: 'Kaşmir Karışımlı Kazak', amount: 890, time: '38 sn önce', source: 'WhatsApp VIP' },
      { id: 'sale-4', city: 'Bursa (Nilüfer)', channel: 'Hepsiburada', product: 'Hakiki Deri Biker Ceket', amount: 2199, time: '1 dk önce', source: 'TikTok Sparks' }
    ],
    cityHeatmap: [
      { city: 'İstanbul', percentage: 46, orders: 184, revenue: 404616 },
      { city: 'Ankara', percentage: 22, orders: 88, revenue: 193512 },
      { city: 'İzmir', percentage: 16, orders: 64, revenue: 140736 },
      { city: 'Bursa & Antalya', percentage: 16, orders: 82, revenue: 180320 }
    ],
    alerts: [
      { id: 'al-1', type: 'critical', title: 'Trendyol Buybox Kaybı', message: 'Hakiki Deri Biker Ceket rakip ₺2.149 yaptı.' },
      { id: 'al-2', type: 'warning', title: 'Beden İade Riski', message: 'Son 5 sipariş XL bedende %88 iade riski tespit edildi.' }
    ]
  };

  if (clientSlug.includes('mandalin')) {
    liveStats = {
      timestamp: new Date().toISOString(),
      status: 'online',
      currentVisitors: 184,
      activeCarts: 18,
      todaySalesCount: 42,
      todayGrossRevenue: 64500,
      todayNetMargin: 41200,
      liveSalesTicker: [
        { id: 'sale-mc-1', city: 'İstanbul (Kadıköy/Moda)', channel: 'WhatsApp', product: 'Buharlı Koltuk Yıkama Paketi', amount: 1450, time: '2 sn önce', source: 'Instagram Reels' },
        { id: 'sale-mc-2', city: 'İstanbul (Ataşehir)', channel: 'Web Rezervasyon', product: 'Yatak & Halı Dezenfeksiyonu', amount: 2200, time: '18 sn önce', source: 'Google Local Ads' },
        { id: 'sale-mc-3', city: 'İstanbul (Suadiye)', channel: 'WhatsApp', product: 'Bahar Temizliği Villa Paketi', amount: 3800, time: '45 sn önce', source: 'Meta Adv+' }
      ],
      cityHeatmap: [
        { city: 'Kadıköy', percentage: 42, orders: 18, revenue: 27090 },
        { city: 'Ataşehir', percentage: 28, orders: 12, revenue: 18060 },
        { city: 'Üsküdar & Maltepe', percentage: 20, orders: 8, revenue: 12900 },
        { city: 'Beykoz & Çekmeköy', percentage: 10, orders: 4, revenue: 6450 }
      ],
      alerts: [
        { id: 'al-mc-1', type: 'warning', title: 'Kadıköy Ekip Kapasitesi Dolmak Üzere', message: 'Yarın öğleden sonra için kalan slot sayısı: 2' }
      ]
    };
  } else if (clientSlug.includes('ige') || clientSlug.includes('ajans')) {
    liveStats = {
      timestamp: new Date().toISOString(),
      status: 'online',
      currentVisitors: 215,
      activeCarts: 12,
      todaySalesCount: 8,
      todayGrossRevenue: 285000,
      todayNetMargin: 198000,
      liveSalesTicker: [
        { id: 'sale-ige-1', city: 'İstanbul (Maslak)', channel: 'Doğrudan Başvuru', product: 'B2B Büyüme & E-İhracat Danışmanlığı', amount: 45000, time: '4 sn önce', source: 'Google Search B2B' },
        { id: 'sale-ige-2', city: 'Ankara (ODTÜ Teknokent)', channel: 'LinkedIn', product: 'Meta CAPI & Server-Side Tracking', amount: 18500, time: '1 dk önce', source: 'Case Study Retargeting' },
        { id: 'sale-ige-3', city: 'İzmir (Alsancak)', channel: 'WhatsApp', product: 'Full-Funnel Reklam Yönetimi', amount: 35000, time: '3 dk önce', source: 'Referral' }
      ],
      cityHeatmap: [
        { city: 'İstanbul (Plazalar)', percentage: 55, orders: 5, revenue: 156750 },
        { city: 'Ankara & İzmir', percentage: 30, orders: 2, revenue: 85500 },
        { city: 'Bursa & Kocaeli', percentage: 15, orders: 1, revenue: 42750 }
      ],
      alerts: [
        { id: 'al-ige-1', type: 'warning', title: 'Toplantı Takvimi Yoğunluğu', message: 'Gelecek 48 saat için boş demo görüşme slotu: 3' }
      ]
    };
  }

  return NextResponse.json({
    success: true,
    data: liveStats
  });
}
