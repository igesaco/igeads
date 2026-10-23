/**
 * Evaluates an account's structured automation rules against the data from the last integration sync.
 * Runs daily from the Vercel cron (/api/cron/rules) and on demand from the rules screen.
 */
import { prisma } from '@/lib/prisma';
import { metaCredentials, parseStoredCredentials } from '@/lib/integrations/credentials';
import { pauseMetaCampaign } from '@/lib/integrations/meta';

export { RULE_METRICS, RULE_ACTIONS, isRuleMetric, isRuleAction } from '@/lib/rule-definitions';
export type { RuleMetric, RuleAction } from '@/lib/rule-definitions';

export interface RuleRunResult {
  ruleId: string;
  title: string;
  matched: number;
  messages: string[];
}

/** Campaign ids are stored as meta-<orgId>-<metaId> (or legacy meta-<metaId>) */
function metaCampaignId(id: string, orgId: string): string | null {
  if (id.startsWith(`meta-${orgId}-`)) return id.slice(`meta-${orgId}-`.length);
  if (id.startsWith('meta-')) return id.slice('meta-'.length);
  return null;
}

export async function runRulesForOrganization(orgId: string): Promise<RuleRunResult[]> {
  const rules = await prisma.automationRule.findMany({
    where: { organizationId: orgId, enabled: true, metric: { not: null }, threshold: { not: null } }
  });
  const results: RuleRunResult[] = [];
  if (!rules.length) return results;

  let metaToken: string | null | undefined;
  const getMetaToken = async () => {
    if (metaToken !== undefined) return metaToken;
    const config = await prisma.integrationConfig.findFirst({ where: { organizationId: orgId, provider: 'meta', connected: true } });
    metaToken = config ? metaCredentials(parseStoredCredentials(config.credentials)).accessToken || null : null;
    return metaToken;
  };

  for (const rule of rules) {
    const threshold = rule.threshold as number;
    const messages: string[] = [];
    let matched = 0;

    if (rule.metric === 'product_stock_below') {
      const products = await prisma.product.findMany({
        where: { organizationId: orgId, stock: { lt: threshold } },
        select: { name: true, stock: true, marketplace: true },
        take: 50
      });
      matched = products.length;
      if (matched) {
        messages.push(`${matched} üründe stok ${threshold} altında: ` +
          products.slice(0, 5).map(p => `${p.name} (${p.marketplace}, ${p.stock} adet)`).join(', ') +
          (matched > 5 ? ` ve ${matched - 5} ürün daha` : ''));
      }
    } else if (rule.metric === 'campaign_roas_below' || rule.metric === 'campaign_roas_above') {
      const below = rule.metric === 'campaign_roas_below';
      const campaigns = await prisma.campaign.findMany({
        where: {
          organizationId: orgId,
          status: 'active',
          spent: { gt: 0 },
          roas: below ? { lt: threshold } : { gt: threshold }
        },
        select: { id: true, name: true, roas: true, platform: true },
        take: 50
      });
      matched = campaigns.length;
      if (matched) {
        messages.push(`${matched} kampanyada ROAS ${below ? 'altında' : 'üstünde'} (${threshold}x): ` +
          campaigns.slice(0, 5).map(c => `${c.name} (${c.roas.toFixed(2)}x)`).join(', '));
      }

      if (matched && rule.actionType === 'pause_campaign') {
        const token = await getMetaToken();
        for (const c of campaigns) {
          const metaId = c.platform === 'meta' ? metaCampaignId(c.id, orgId) : null;
          if (!metaId || !token) {
            messages.push(`${c.name}: Meta bağlantısı olmadığı için duraklatılamadı.`);
            continue;
          }
          try {
            await pauseMetaCampaign(token, metaId);
            await prisma.campaign.update({ where: { id: c.id }, data: { status: 'paused' } });
            messages.push(`${c.name} Meta'da duraklatıldı.`);
          } catch (err: any) {
            messages.push(`${c.name} duraklatılamadı: ${err.message}`);
          }
        }
      }
    }

    if (matched) {
      await prisma.notification.create({
        data: {
          organizationId: orgId,
          title: `Kural tetiklendi: ${rule.title}`,
          message: messages.join(' ').slice(0, 1000),
          type: rule.actionType === 'pause_campaign' ? 'alert' : 'warning'
        }
      });
    }

    await prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        lastRunAt: new Date(),
        ...(matched && { timesTriggered: { increment: 1 }, lastTriggered: new Date().toISOString() })
      }
    });

    results.push({ ruleId: rule.id, title: rule.title, matched, messages });
  }

  return results;
}
