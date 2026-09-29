import { AdCampaign, MarketplaceProduct, CompetitorAd, ContentCalendarItem, RemarketingFlow, GhostMarketerInsight } from '../types';

export const mockCampaigns: AdCampaign[] = [
  {
    id: 'camp-1',
    name: 'Meta - Kış Koleksiyonu Dinamik Katalog (Instagram & FB)',
    platform: 'meta',
    status: 'active',
    dailyBudget: 2500,
    spent: 34850,
    revenue: 167280,
    roas: 4.8,
    poas: 2.35, // Net Kâr / Harcama
    cpc: 3.42,
    ctr: 2.85,
    fatigueScore: 24, // Düşük, taze
    linkedProduct: 'prod-1',
    targetMarketplaceStock: 142,
  },
  {
    id: 'camp-2',
    name: 'Google Ads - PMax | Deri Ceket & Aksesuar Genel',
    platform: 'google',
    status: 'active',
    dailyBudget: 1800,
    spent: 28400,
    revenue: 142000,
    roas: 5.0,
    poas: 2.65,
    cpc: 4.15,
    ctr: 3.12,
    fatigueScore: 40,
    linkedProduct: 'prod-1',
    targetMarketplaceStock: 142,
  },
  {
    id: 'camp-3',
    name: 'TikTok Ads - Viral Ceket Dönüşüm Spark Ads',
    platform: 'tiktok',
    status: 'fatigued', // Yorgunluk tespit edildi!
    dailyBudget: 1200,
    spent: 19500,
    revenue: 48750,
    roas: 2.5,
    poas: 0.95, // Zarar sınırında
    cpc: 5.80,
    ctr: 0.98,
    fatigueScore: 88, // Kritik yorulma!
    linkedProduct: 'prod-2',
    targetMarketplaceStock: 18,
  },
  {
    id: 'camp-4',
    name: 'ChatGPT Sponsored Brand Suggestion (AI Ads Alpha)',
    platform: 'chatgpt',
    status: 'active',
    dailyBudget: 650,
    spent: 4200,
    revenue: 33600,
    roas: 8.0,
    poas: 4.2,
    cpc: 8.40,
    ctr: 6.4,
    fatigueScore: 12,
    linkedProduct: 'prod-3',
    targetMarketplaceStock: 85,
  }
];

export const mockProducts: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    title: 'Hakiki Deri Unisex Biker Ceket (Siyah)',
    sku: 'JKT-LEATHER-001',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
    cogs: 850,
    shippingCost: 85,
    netMargin: 745,
    netMarginPercentage: 34.2,
    activeAdCampaignsCount: 3,
    autoHaltAdsOnLowStock: true,
    salesChannels: [
      { channel: 'trendyol', price: 2199, stock: 48, commissionRate: 19, sales30Days: 214 },
      { channel: 'hepsiburada', price: 2199, stock: 32, commissionRate: 18, sales30Days: 145 },
      { channel: 'amazon', price: 2249, stock: 50, commissionRate: 15, sales30Days: 188 },
      { channel: 'idefix', price: 2149, stock: 12, commissionRate: 14, sales30Days: 42 },
    ]
  },
  {
    id: 'prod-2',
    title: 'Oversize Kaşmir Karışımlı Triko Kazak',
    sku: 'KNT-CSHMR-042',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60',
    cogs: 290,
    shippingCost: 75,
    netMargin: 325,
    netMarginPercentage: 36.5,
    activeAdCampaignsCount: 2,
    autoHaltAdsOnLowStock: true,
    salesChannels: [
      { channel: 'trendyol', price: 890, stock: 6, commissionRate: 20, sales30Days: 420 }, // KRİTİK STOK!
      { channel: 'hepsiburada', price: 890, stock: 4, commissionRate: 19, sales30Days: 180 },
      { channel: 'amazon', price: 920, stock: 8, commissionRate: 16, sales30Days: 110 },
      { channel: 'n11', price: 890, stock: 0, commissionRate: 18, sales30Days: 65 },
    ]
  },
  {
    id: 'prod-3',
    title: 'Minimalist Su Geçirmez Sırt Çantası (Laptop Bölmeli)',
    sku: 'BAG-MIN-009',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    cogs: 380,
    shippingCost: 80,
    netMargin: 490,
    netMarginPercentage: 42.6,
    activeAdCampaignsCount: 1,
    autoHaltAdsOnLowStock: true,
    salesChannels: [
      { channel: 'trendyol', price: 1150, stock: 120, commissionRate: 17, sales30Days: 310 },
      { channel: 'amazon', price: 1190, stock: 85, commissionRate: 15, sales30Days: 240 },
      { channel: 'hepsiburada', price: 1150, stock: 95, commissionRate: 18, sales30Days: 190 },
      { channel: 'idefix', price: 1120, stock: 40, commissionRate: 13, sales30Days: 85 },
    ]
  }
];

export const mockCompetitorAds: CompetitorAd[] = [
  {
    id: 'comp-1',
    brand: 'ModaX Premium (Doğrudan Rakip)',
    platform: 'meta',
    firstSeen: '2 saat önce',
    estimatedSpend: '₺8.000 / gün',
    headline: '"Kış Sezonu Kapanıyor! Tüm Deri Ceketlerde %40 İndirim"',
    body: 'Sınırlı stok, kaçırma! İtalyan kuzu derisi ceketlerde bugün son fırsat.',
    format: 'Video / Reels',
    aiCounterStrategy: {
      hook: '"%40 sahte indirimlere aldanmayın: Hakiki deriyi ateşe tuttuğunuzda ne olur?" (Sosyal Kanıt & Kalite Kancası)',
      valueProposition: 'Fiyat indirimi yerine "Ömür Boyu Dikiş Garantisi + Ücretsiz Bakım Kremi Hediyesi" teklifiyle kârlılığı koruyarak vur.',
      suggestedCampaign: 'Meta Reels Karşı Kampanyası (Hedef Kitle: ModaX takipçileri ve Lüks Giyim ilgi alanı)'
    }
  },
  {
    id: 'comp-2',
    brand: 'TrendStyle Store',
    platform: 'tiktok',
    firstSeen: 'Dün',
    estimatedSpend: '₺4.500 / gün',
    headline: 'POV: Kombin yapamayan arkadaşına bunu hediye edersin',
    body: 'Oversize kazaklarımız tükendi tükenecek, link bioda!',
    format: 'Video / Reels',
    aiCounterStrategy: {
      hook: '"Neden herkes aynı polyester kazağı giyiyor? İşte %100 kaşmir hissinin 3 sırrı."',
      valueProposition: 'Rakip sentetik karışım kullanıyor; kumaş dokusu ve nefes alma testini yakın çekim gösteren 9 saniyelik mikro-video.',
      suggestedCampaign: 'TikTok Spark Ads (Kanca: İlk 1.5 saniye dokunma mikro-zoom)'
    }
  }
];

export const mockContentCalendar: ContentCalendarItem[] = [
  {
    id: 'cal-1',
    day: 1,
    date: '23 Eylül Salı',
    platform: 'Instagram Reels',
    title: 'Paketleme & Lüks Deneyim Arkası',
    hook: '"Müşterimize giden kargo paketine gizli bir hediye koyduk..."',
    scriptOutline: 'Kutulama süreci, özel mühürlü kart, koku sıkımı ve müşteri notu. Kamera arkası samimiyeti.',
    callToAction: 'Profildeki linkten ilk siparişe özel hediye kuponunu kap!',
    status: 'scheduled',
    targetAudience: 'Yeni Müşteri Edinimi (Top of Funnel)'
  },
  {
    id: 'cal-2',
    day: 2,
    date: '24 Eylül Çarşamba',
    platform: 'TikTok',
    title: 'Kıyafet Hilesi: 1 Ceket 4 Farklı Mekan',
    hook: '"Aynı ceketi iş görüşmesinde, akşam yemeğinde ve pazar kahvaltısında nasıl giyersin?"',
    scriptOutline: 'Hızlı geçişler (beat drop ile ceket değişmeden alt kombin ve aksesuar değişir).',
    callToAction: 'Favori kombinini yoruma yaz, ceketi çekilişle hediye edelim!',
    status: 'ready',
    targetAudience: 'Etkileşim & Viral Büyüme'
  },
  {
    id: 'cal-3',
    day: 3,
    date: '25 Eylül Perşembe',
    platform: 'Google PMax',
    title: 'Hafta Sonu Fırsatı Asset Grubu',
    hook: 'En Çok Satan Deri Ceketlerde Aynı Gün Ücretsiz Kargo',
    scriptOutline: 'Dinamik ürün akışı, yüksek çözünürlüklü stüdyo kareleri + 5 yıldızlı müşteri yorumları.',
    callToAction: 'Şimdi İncele ve Sipariş Ver',
    status: 'ready',
    targetAudience: 'Yüksek Satın Alma Niyeti Taşıyan Arama Kitlesi'
  },
  {
    id: 'cal-4',
    day: 4,
    date: '26 Eylül Cuma',
    platform: 'Story',
    title: 'Flash Sale: Gece 00:00\'a Kadar VIP İndirimi',
    hook: '"Sadece Hikayeyi Gören İlk 50 Kişiye Özel..."',
    scriptOutline: 'Geri sayım sayacı stickerı + doğrudan sepet linki.',
    callToAction: 'Yukarı Kaydır / Linke Tıkla',
    status: 'draft',
    targetAudience: 'Mevcut Sadık Takipçiler & Retargeting'
  }
];

export const mockRemarketingFlows: RemarketingFlow[] = [
  {
    id: 'flow-1',
    name: 'Terk Edilmiş Sepet - Akıllı WhatsApp Kurtarma',
    channel: 'whatsapp',
    trigger: 'abandoned_cart',
    delay: '30 dakika sonra',
    openRate: 92.4,
    conversionRate: 18.6,
    revenueGenerated: 84300,
    status: 'active',
    messageTemplate: 'Merhaba {{isim}}! {{urun_adi}} sepetinde seni bekliyor. Sana özel kargo bizden kuponun: FREESHIP24 🛍️ Tamamlamak ister misin?'
  },
  {
    id: 'flow-2',
    name: 'Pazaryeri Müşterisini Kendi Sitene Çekme (VIP Kart & SMS)',
    channel: 'sms',
    trigger: 'post_purchase_cross_sell',
    delay: 'Teslimattan 3 gün sonra',
    openRate: 88.0,
    conversionRate: 14.2,
    revenueGenerated: 62100,
    status: 'active',
    messageTemplate: 'Trendyol siparişiniz ulaştı mı? Paketinizdeki QR kodu okutarak sonraki siparişinizde net %20 indirim tanımlayın: igesite.com/vip'
  },
  {
    id: 'flow-3',
    name: 'Tükenen Stok Geri Geldiğinde Otomatik Alarm',
    channel: 'email',
    trigger: 'stock_replenish',
    delay: 'Stok girildiği an',
    openRate: 64.5,
    conversionRate: 22.8,
    revenueGenerated: 41500,
    status: 'active',
    messageTemplate: 'Müjde! Beklediğin Kaşmir Kazak yeniden stoklarımızda. Stoklar hızla eriyor, tükenmeden hemen kap.'
  }
];

export const mockGhostInsights: GhostMarketerInsight[] = [
  {
    id: 'ins-1',
    timestamp: 'Bugün 08:30',
    type: 'urgent_stock',
    title: 'Stok Uyarısı: Kazak Stoğu 6 Adede Düştü!',
    description: 'Trendyol\'da "Oversize Kaşmir Kazak" stoğu kritik seviyede. Ancak TikTok Ads günde 1.200 TL harcamaya devam ediyor.',
    actionText: 'TikTok Kampanyasını Durdur ve Bütçeyi Deri Ceket Meta Kampanyasına Aktar',
    impactScore: 'Kayıp Önleme'
  },
  {
    id: 'ins-2',
    timestamp: 'Dün 21:15',
    type: 'creative_burnout',
    title: 'TikTok Reklam Yorgunluğu Saptandı (CTR: %0.98)',
    description: 'TikTok "Viral Ceket" reklamının izlenme doyumuna ulaştığı tespit edildi. Frekans 4.2x üzerine çıktı.',
    actionText: 'AI Tarafından Üretilen 3 Yeni Mikro-Kancayı Reklam Setine Yükle',
    impactScore: '+%34 ROAS'
  },
  {
    id: 'ins-3',
    timestamp: 'Dün 14:00',
    type: 'competitor_threat',
    title: 'Rakip ModaX Agresif İndirim Başlattı',
    description: 'Rakibiniz Meta Ad Library\'de 4 yeni kampanya açtı ve %40 indirim vaat ediyor.',
    actionText: 'Hazırlanan "Ömür Boyu Garanti & Kalite" Karşı Kampanyasını Yayına Al',
    impactScore: '+ ₺14.200 Ciro'
  }
];

export const mockAutomationRules: any[] = [
  {
    id: 'rule-1',
    name: 'Kritik Pazaryeri Stoğunda Reklamı Dondur',
    trigger: 'Trendyol veya Amazon Stok Seviyesi',
    condition: 'Stok < 10 Adet olduğunda',
    action: 'Bağlı Meta & TikTok reklam setlerini duraklat',
    enabled: true,
    timesTriggered: 14,
    lastRun: 'Bugün 08:30',
    category: 'stock_guard'
  },
  {
    id: 'rule-2',
    name: 'Yüksek ROAS Bütçe Katlayıcı (Scale Rules)',
    trigger: 'Google PMax veya Meta Kampanyası',
    condition: 'Son 48 saatte ROAS > 5.5x ve Harcama > ₺1.000',
    action: 'Günlük bütçeyi otonom olarak %20 artır',
    enabled: true,
    timesTriggered: 8,
    lastRun: 'Dün 18:00',
    category: 'budget_shift'
  },
  {
    id: 'rule-3',
    name: 'Reklam Yorgunluğu (Burnout) Oto-Kalkanı',
    trigger: 'Meta / TikTok Kreatif Frekansı',
    condition: 'Frekans > 4.0x ve CTR < %1.2 olduğunda',
    action: 'AI ile 3 yeni kanca üret ve Telegram/WhatsApp bildirimi at',
    enabled: true,
    timesTriggered: 6,
    lastRun: 'Dün 21:15',
    category: 'fatigue_defense'
  },
  {
    id: 'rule-4',
    name: 'Rakip Karşı Taarruz Uyarısı',
    trigger: 'Tersine Rakip Reklam Radarı',
    condition: 'Takip edilen rakipler yeni video reklam açtığında',
    action: 'Rakip kurgusunu deşifre et ve anında karşı teklif taslağı hazırla',
    enabled: true,
    timesTriggered: 3,
    lastRun: '3 gün önce',
    category: 'competitor_alert'
  }
];

export const mockIntegrations: any[] = [
  {
    id: 'int-meta',
    platform: 'Meta Ads (Facebook & Instagram)',
    category: 'ads',
    connected: true,
    accountName: 'Velvet Couture Meta BM (ID: 94810294)',
    lastSync: '1 dakika önce',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    syncFrequency: 'Her 5 dakikada bir',
    fields: [
      { label: 'Pixel ID & CAPI Token', placeholder: 'EAAG...', value: 'EAAG941829... (Aktif)', isSecret: true },
      { label: 'Ad Account ID', placeholder: 'act_...', value: 'act_4910294819' }
    ]
  },
  {
    id: 'int-google',
    platform: 'Google Ads (Search & PMax)',
    category: 'ads',
    connected: true,
    accountName: 'Velvet Ads TR (ID: 412-894-1029)',
    lastSync: '4 dakika önce',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    syncFrequency: 'Her 10 dakikada bir',
    fields: [
      { label: 'Customer ID', placeholder: 'xxx-xxx-xxxx', value: '412-894-1029' },
      { label: 'OAuth Refresh Token', placeholder: '1//04...', value: '1//04918... (Bağlı)', isSecret: true }
    ]
  },
  {
    id: 'int-tiktok',
    platform: 'TikTok Business Ads',
    category: 'ads',
    connected: true,
    accountName: 'Velvet TikTok Sparks (ID: 7192841)',
    lastSync: '12 dakika önce',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    syncFrequency: 'Her 15 dakikada bir',
    fields: [
      { label: 'Advertiser ID', placeholder: '7192841...', value: '7192841928' },
      { label: 'Access Token', placeholder: 'tt_app_...', value: 'tt_app_8491... (Aktif)', isSecret: true }
    ]
  },
  {
    id: 'int-trendyol',
    platform: 'Trendyol Pazaryeri Entegrasyonu',
    category: 'marketplace',
    connected: true,
    accountName: 'Velvet Couture Mağaza (Satıcı ID: 198421)',
    lastSync: '30 saniye önce',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    syncFrequency: 'Canlı Webhook (Anlık Stok & Sipariş)',
    fields: [
      { label: 'Satıcı ID (Supplier ID)', placeholder: '198421', value: '198421' },
      { label: 'API Key', placeholder: 'API Anahtarı', value: 'ty_live_key_9182', isSecret: true },
      { label: 'API Secret', placeholder: 'API Gizli Anahtarı', value: 'ty_sec_99182...', isSecret: true }
    ]
  },
  {
    id: 'int-amazon',
    platform: 'Amazon SP-API (Selling Partner)',
    category: 'marketplace',
    connected: true,
    accountName: 'Velvet Amazon TR & EU (Merchant: A218491)',
    lastSync: '2 dakika önce',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    syncFrequency: 'Her 5 dakikada bir',
    fields: [
      { label: 'Merchant Token', placeholder: 'A218491...', value: 'A218491924' },
      { label: 'LWA Refresh Token', placeholder: 'Atzr|...', value: 'Atzr|IQE... (Aktif)', isSecret: true }
    ]
  },
  {
    id: 'int-hepsiburada',
    platform: 'Hepsiburada Pazaryeri',
    category: 'marketplace',
    connected: true,
    accountName: 'Velvet HB Partner (ID: hb-94182)',
    lastSync: '6 dakika önce',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    syncFrequency: 'Her 10 dakikada bir',
    fields: [
      { label: 'Merchant ID', placeholder: 'hb-94182', value: 'hb-94182' },
      { label: 'Entegratör Gizli Anahtarı', placeholder: 'hb_sec_...', value: 'hb_sec_19284...', isSecret: true }
    ]
  },
  {
    id: 'int-whatsapp',
    platform: 'WhatsApp Cloud API & Netgsm SMS',
    category: 'messaging',
    connected: true,
    accountName: '+90 850 308 00 00 (Doğrulanmış İşletme)',
    lastSync: 'Anlık Dinlemede',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    syncFrequency: 'Canlı Webhook',
    fields: [
      { label: 'WhatsApp Phone Number ID', placeholder: '10928419...', value: '1092841928471' },
      { label: 'Meta System User Token', placeholder: 'EAA...', value: 'EAAO8192... (Aktif)', isSecret: true }
    ]
  }
];

export const mockBuyboxItems: any[] = [

  {
    id: 'bb-1',
    productTitle: 'Hakiki Deri Unisex Biker Ceket (Siyah)',
    platform: 'trendyol',
    myPrice: 2199,
    buyboxPrice: 2199,
    buyboxOwner: 'Velvet Couture (Siz)',
    hasBuybox: true,
    minAllowedPrice: 1950,
    strategy: 'profit_maximize',
    autoRepriceEnabled: true,
    salesLostEstimate: '0 TL (Buybox sizde)'
  },
  {
    id: 'bb-2',
    productTitle: 'Oversize Kaşmir Karışımlı Triko Kazak',
    platform: 'trendyol',
    myPrice: 890,
    buyboxPrice: 849,
    buyboxOwner: 'TrendStyle Store (Rakip)',
    hasBuybox: false,
    minAllowedPrice: 780,
    strategy: 'match_lowest',
    autoRepriceEnabled: false,
    salesLostEstimate: 'Günde ~₺14.500 Ciro Kaybı'
  },
  {
    id: 'bb-3',
    productTitle: 'Minimalist Su Geçirmez Sırt Çantası',
    platform: 'amazon',
    myPrice: 1190,
    buyboxPrice: 1190,
    buyboxOwner: 'Velvet Couture (Siz)',
    hasBuybox: true,
    minAllowedPrice: 990,
    strategy: 'profit_maximize',
    autoRepriceEnabled: true,
    salesLostEstimate: '0 TL (Buybox sizde)'
  }
];

export const mockInfluencers: any[] = [
  {
    id: 'inf-1',
    name: 'Selin Aksoy',
    handle: '@selinaksoy_style',
    platform: 'Instagram',
    followers: '284K',
    engagementRate: '%4.8',
    promoCode: 'SELIN20',
    ordersDriven: 142,
    revenueGenerated: 312258,
    cost: 45000,
    roi: 6.9,
    status: 'active'
  },
  {
    id: 'inf-2',
    name: 'Berk & Kombinler',
    handle: '@berkombin',
    platform: 'TikTok',
    followers: '620K',
    engagementRate: '%7.2',
    promoCode: 'BERK15',
    ordersDriven: 210,
    revenueGenerated: 186900,
    cost: 35000,
    roi: 5.3,
    status: 'active'
  },
  {
    id: 'inf-3',
    name: 'Cansu Moda Vlog',
    handle: '@cansu_vlog',
    platform: 'Instagram',
    followers: '115K',
    engagementRate: '%3.9',
    promoCode: 'CANSU10',
    ordersDriven: 48,
    revenueGenerated: 105550,
    cost: 20000,
    roi: 5.2,
    status: 'completed'
  }
];


