// Rule options shared by the rules engine (server) and the rules screen (client)
export const RULE_METRICS = {
  product_stock_below: { label: 'Ürün stoğu şu değerin altına düşerse', unit: 'adet' },
  campaign_roas_below: { label: 'Kampanya ROAS şu değerin altına düşerse', unit: 'x' },
  campaign_roas_above: { label: 'Kampanya ROAS şu değerin üstüne çıkarsa', unit: 'x' }
} as const;

export const RULE_ACTIONS = {
  notify: 'Bildirim gönder',
  pause_campaign: 'Meta kampanyasını duraklat'
} as const;

export type RuleMetric = keyof typeof RULE_METRICS;
export type RuleAction = keyof typeof RULE_ACTIONS;

export function isRuleMetric(v: unknown): v is RuleMetric {
  return typeof v === 'string' && v in RULE_METRICS;
}

export function isRuleAction(v: unknown): v is RuleAction {
  return typeof v === 'string' && v in RULE_ACTIONS;
}
