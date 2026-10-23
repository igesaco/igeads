import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';

export interface BriefingItem {
  id: string;
  level: 'alert' | 'warning' | 'info';
  title: string;
  description: string;
  tab?: string; // screen where the user can act on it
}

const tl = (n: number) => `₺${Math.round(n).toLocaleString('tr-TR')}`;

/** Daily summary built only from the account's own synced data */
export async function GET(request: Request) {
  const tenant = await requireTenant(request);
  if (tenant instanceof NextResponse) return tenant;
  const orgId = tenant.orgId;

  const [campaigns, lowStock, lostBuybox, unread, connected] = await Promise.all([
    prisma.campaign.findMany({ where: { organizationId: orgId, status: 'active' } }),
    prisma.product.findMany({ where: { organizationId: orgId, stock: { lt: 5 } }, orderBy: { stock: 'asc' }, take: 5 }),
    prisma.product.findMany({ where: { organizationId: orgId, buyboxCheckedAt: { not: null }, isBuybox: false }, take: 5 }),
    prisma.notification.count({ where: { organizationId: orgId, read: false } }),
    prisma.integrationConfig.count({ where: { organizationId: orgId, connected: true } })
  ]);

  const items: BriefingItem[] = [];

  const spent = campaigns.reduce((a, c) => a + c.spent, 0);
  const revenue = campaigns.reduce((a, c) => a + c.revenue, 0);
  if (campaigns.length) {
    items.push({
      id: 'ads-summary',
      level: 'info',
      title: `${campaigns.length} aktif kampanya`,
      description: spent > 0
        ? `Toplam harcama ${tl(spent)}, ciro ${tl(revenue)}, ortalama ROAS ${(revenue / spent).toFixed(2)}x.`
        : 'Kampanyalarda henüz harcama verisi yok.',
      tab: 'ads'
    });
  }

  const weak = campaigns.filter(c => c.spent > 0 && c.roas < 1.5).sort((a, b) => a.roas - b.roas).slice(0, 3);
  if (weak.length) {
    items.push({
      id: 'weak-roas',
      level: 'warning',
      title: 'Düşük ROAS',
      description: weak.map(c => `${c.name}: ${c.roas.toFixed(2)}x (${tl(c.spent)} harcama)`).join(' · '),
      tab: 'ads'
    });
  }

  if (lowStock.length) {
    items.push({
      id: 'low-stock',
      level: 'alert',
      title: 'Stoğu azalan ürünler',
      description: lowStock.map(p => `${p.name} (${p.marketplace}): ${p.stock} adet`).join(' · '),
      tab: 'marketplace'
    });
  }

  if (lostBuybox.length) {
    items.push({
      id: 'buybox',
      level: 'warning',
      title: 'Buybox başkasında',
      description: lostBuybox.map(p => `${p.name}: sizin ${tl(p.price)}, Buybox ${tl(p.buyboxPrice)}`).join(' · '),
      tab: 'buybox'
    });
  }

  if (unread) {
    items.push({ id: 'notifications', level: 'info', title: `${unread} okunmamış bildirim`, description: 'Kural tetiklenmeleri ve ödeme bildirimleri bildirim panelinde.' });
  }

  if (!connected) {
    items.push({
      id: 'connect',
      level: 'info',
      title: 'Henüz entegrasyon bağlı değil',
      description: 'Meta reklam hesabınızı veya Trendyol/Hepsiburada mağazanızı bağladığınızda özet gerçek verinizle dolar.',
      tab: 'integrations'
    });
  }

  const speech = items.length
    ? items.map(i => `${i.title}. ${i.description}`).join(' ')
    : 'Bugün için dikkat edilmesi gereken bir durum yok.';

  return NextResponse.json({ success: true, data: { generatedAt: new Date().toISOString(), items, speech } });
}
