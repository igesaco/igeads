/** SaaS paketleri: fiyatlar (TL, KDV dahil, aylık) ve sınırlar. Hem sunucu hem arayüz buradan okur. */

export type PlanId = 'starter' | 'growth' | 'agency';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  annualMonthlyPrice: number; // yıllık ödemede aylık karşılığı
  maxClients: number | null; // null = sınırsız
  maxUsers: number | null;
  description: string;
  features: string[];
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: 'starter', name: 'Starter KOBİ', monthlyPrice: 1490, annualMonthlyPrice: 1190, maxClients: 1, maxUsers: 2,
    description: 'Tek markası olan e-ticaret işletmeleri için.',
    features: [
      '1 marka, 2 kullanıcı',
      'Meta Ads, Trendyol ve Hepsiburada bağlantısı',
      'Kampanya, ürün ve stok takibi',
      'AI reklam metni, kanca ve ürün görseli üretimi',
      'E-posta desteği'
    ]
  },
  growth: {
    id: 'growth', name: 'Growth Pro', monthlyPrice: 3990, annualMonthlyPrice: 3190, maxClients: 5, maxUsers: 5,
    description: 'Birden fazla markayı veya mağazayı yöneten ekipler için.',
    features: [
      '5 marka, 5 kullanıcı',
      'Starter paketindeki her şey',
      'AI yönetici raporu ve WhatsApp özet mesajı',
      'Rakip reklam analizi ve AI Copilot',
      'Ekip görev panosu ve müşteri onay portalı'
    ]
  },
  agency: {
    id: 'agency', name: 'Agency Scale', monthlyPrice: 8990, annualMonthlyPrice: 7190, maxClients: null, maxUsers: null,
    description: 'Çok sayıda müşterisi olan dijital pazarlama ajansları için.',
    features: [
      'Sınırsız marka ve kullanıcı',
      'Growth Pro paketindeki her şey',
      'Müşteri sözleşme ve hakediş takibi',
      'Her müşteriye özel şifreli rapor portalı',
      'Öncelikli destek'
    ]
  }
};

/** Deneme süresince Growth Pro sınırları geçerlidir */
export const TRIAL_PLAN: PlanId = 'growth';
export const TRIAL_DAYS = 14;

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && value in PLANS;
}

/** Charged amount for one billing period */
export function planPrice(plan: PlanId, cycle: BillingCycle): number {
  const def = PLANS[plan];
  return cycle === 'annual' ? def.annualMonthlyPrice * 12 : def.monthlyPrice;
}

export function limitsFor(plan: string): PlanDefinition {
  return isPlanId(plan) ? PLANS[plan] : PLANS[TRIAL_PLAN];
}
