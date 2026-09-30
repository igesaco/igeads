import { AdCampaign, MarketplaceProduct, CompetitorAd, ContentCalendarItem, RemarketingFlow, GhostMarketerInsight } from '../types';

export const mockCampaigns: AdCampaign[] = [];

export const mockProducts: MarketplaceProduct[] = [];


export const mockCompetitorAds: CompetitorAd[] = [];

export const mockContentCalendar: ContentCalendarItem[] = [];

export const mockRemarketingFlows: RemarketingFlow[] = [];

export const mockGhostInsights: GhostMarketerInsight[] = [];

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
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Her 5 dakikada bir',
    fields: [
      { label: 'Pixel ID & CAPI Token', placeholder: 'EAAG...', value: '', isSecret: true },
      { label: 'Ad Account ID', placeholder: 'act_...', value: '' }
    ]
  },
  {
    id: 'int-google',
    platform: 'Google Ads (Search & PMax)',
    category: 'ads',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Her 10 dakikada bir',
    fields: [
      { label: 'Customer ID', placeholder: 'xxx-xxx-xxxx', value: '' },
      { label: 'OAuth Refresh Token', placeholder: '1//04...', value: '', isSecret: true }
    ]
  },
  {
    id: 'int-tiktok',
    platform: 'TikTok Business Ads',
    category: 'ads',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Her 15 dakikada bir',
    fields: [
      { label: 'Advertiser ID', placeholder: '7192841...', value: '' },
      { label: 'Access Token', placeholder: 'tt_app_...', value: '', isSecret: true }
    ]
  },
  {
    id: 'int-trendyol',
    platform: 'Trendyol Pazaryeri Entegrasyonu',
    category: 'marketplace',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Canlı Webhook (Anlık Stok & Sipariş)',
    fields: [
      { label: 'Satıcı ID (Supplier ID)', placeholder: '198421', value: '' },
      { label: 'API Key', placeholder: 'API Anahtarı', value: '', isSecret: true },
      { label: 'API Secret', placeholder: 'API Gizli Anahtarı', value: '', isSecret: true }
    ]
  },
  {
    id: 'int-amazon',
    platform: 'Amazon SP-API (Selling Partner)',
    category: 'marketplace',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Her 5 dakikada bir',
    fields: [
      { label: 'Merchant Token', placeholder: 'A218491...', value: '' },
      { label: 'LWA Refresh Token', placeholder: 'Atzr|...', value: '', isSecret: true }
    ]
  },
  {
    id: 'int-hepsiburada',
    platform: 'Hepsiburada Pazaryeri',
    category: 'marketplace',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Her 10 dakikada bir',
    fields: [
      { label: 'Merchant ID', placeholder: 'fbf7ec48-fd9c-4047-8a88-...', value: '' },
      { label: 'API Kullanıcı Adı (Username)', placeholder: 'Varsayılan: Merchant ID ile aynı', value: '' },
      { label: 'Entegratör Gizli Anahtarı', placeholder: 'hb_sec_... veya entegratör şifresi', value: '', isSecret: true }
    ]
  },
  {
    id: 'int-whatsapp',
    platform: 'WhatsApp Cloud API & Netgsm SMS',
    category: 'messaging',
    connected: false,
    accountName: 'Bağlı Değil',
    lastSync: 'Henüz Bağlanmadı',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    syncFrequency: 'Canlı Webhook',
    fields: [
      { label: 'WhatsApp Phone Number ID', placeholder: '10928419...', value: '' },
      { label: 'Meta System User Token', placeholder: 'EAA...', value: '', isSecret: true }
    ]
  }
];

export const mockBuyboxItems: any[] = [];

export const mockInfluencers: any[] = [];


