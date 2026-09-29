export type PlatformType = 'meta' | 'google' | 'tiktok' | 'chatgpt' | 'trendyol' | 'amazon' | 'hepsiburada' | 'idefix' | 'n11';

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'tiktok' | 'chatgpt';
  status: 'active' | 'paused' | 'fatigued' | 'learning';
  dailyBudget: number;
  spent: number;
  revenue: number;
  roas: number;
  poas: number; // Profit on Ad Spend (Net Kâr / Reklam Harcaması)
  cpc: number;
  ctr: number;
  fatigueScore: number; // 0-100 (80+ = acil revize gerekli)
  linkedProduct?: string;
  targetMarketplaceStock?: number;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  sku: string;
  image: string;
  salesChannels: {
    channel: 'trendyol' | 'amazon' | 'hepsiburada' | 'idefix' | 'n11';
    price: number;
    stock: number;
    commissionRate: number; // örn %18
    sales30Days: number;
  }[];
  cogs: number; // Ürün Maliyeti
  shippingCost: number;
  netMargin: number; // Net Kalan Kâr (TL)
  netMarginPercentage: number;
  activeAdCampaignsCount: number;
  autoHaltAdsOnLowStock: boolean;
}

export interface CompetitorAd {
  id: string;
  brand: string;
  platform: 'meta' | 'tiktok' | 'google';
  firstSeen: string;
  estimatedSpend: string;
  headline: string;
  body: string;
  format: 'Video / Reels' | 'Carousel' | 'Tek Görsel';
  detectedSector?: string;
  metaAdLibraryUrl?: string;
  googleTransparencyUrl?: string;
  aiCounterStrategy: {
    hook: string;
    valueProposition: string;
    suggestedCampaign: string;
  };
}

export interface ContentCalendarItem {
  id: string;
  day: number;
  date: string;
  platform: 'Instagram Reels' | 'TikTok' | 'Story' | 'Google PMax' | 'Meta Feed';
  title: string;
  hook: string;
  scriptOutline: string;
  callToAction: string;
  status: 'ready' | 'scheduled' | 'draft';
  targetAudience: string;
}

export interface RemarketingFlow {
  id: string;
  name: string;
  channel: 'whatsapp' | 'sms' | 'email';
  trigger: 'abandoned_cart' | 'post_purchase_cross_sell' | 'vip_winback' | 'stock_replenish' | string;
  delay?: string;
  openRate?: number;
  conversionRate?: number;
  revenueGenerated: number;
  status: 'active' | 'paused';
  messageTemplate: string;
  sentCount?: number;
  convertedCount?: number;
}

export interface GhostMarketerInsight {
  id: string;
  timestamp: string;
  type: 'urgent_stock' | 'budget_shift' | 'creative_burnout' | 'competitor_threat' | 'geo_ranking';
  title: string;
  description: string;
  actionText: string;
  impactScore: '+ ₺14.200 Ciro' | 'Kayıp Önleme' | '+%34 ROAS' | 'Tasarruf';
  executed?: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  timesTriggered: number;
  lastRun: string;
  category: 'stock_guard' | 'budget_shift' | 'budget_guard' | 'fatigue_defense' | 'creative_guard' | 'competitor_alert';
}

export interface IntegrationAccount {
  id: string;
  platform: string;
  category: 'ads' | 'marketplace' | 'messaging';
  connected: boolean;
  accountName: string;
  lastSync: string;
  badgeColor: string;
  syncFrequency: string;
  fields: { label: string; placeholder: string; isSecret?: boolean; value?: string }[];
}

export interface BuyboxItem {
  id: string;
  productTitle: string;
  platform: 'trendyol' | 'amazon' | 'hepsiburada';
  myPrice: number;
  buyboxPrice: number;
  buyboxOwner: string;
  hasBuybox: boolean;
  minAllowedPrice: number;
  strategy: 'match_lowest' | 'profit_maximize' | 'manual';
  autoRepriceEnabled: boolean;
  salesLostEstimate: string;
}

export interface InfluencerPartner {
  id: string;
  name: string;
  handle: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Spotify / Apple' | 'Podcast';
  followers: string;
  engagementRate: string;
  promoCode: string;
  ordersDriven: number;
  revenueGenerated: number;
  cost: number;
  roi: number; // örn 4.5x
  status: 'active' | 'negotiating' | 'completed';
}


