import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';
import { RULE_ACTIONS, RULE_METRICS, isRuleAction, isRuleMetric } from '@/lib/rules-engine';

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const rules = await prisma.automationRule.findMany({
      where: { organizationId: tenant.orgId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      totalCount: rules.length,
      data: rules
    });
  } catch (error) {
    console.error('Rules fetch error:', error);
    return NextResponse.json({ success: false, error: 'Kurallar alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const title = String(body.title || '').trim();
    const threshold = Number(body.threshold);
    if (!title || !isRuleMetric(body.metric) || !isRuleAction(body.actionType) || !Number.isFinite(threshold) || threshold < 0) {
      return NextResponse.json({ success: false, error: 'Kural adı, koşul, eşik değeri ve aksiyon zorunludur' }, { status: 400 });
    }
    if (body.actionType === 'pause_campaign' && body.metric === 'product_stock_below') {
      return NextResponse.json({ success: false, error: 'Stok kuralı kampanya duraklatamaz; ürünler kampanyalara bağlı değil' }, { status: 400 });
    }
    const metric = RULE_METRICS[body.metric as keyof typeof RULE_METRICS];
    const newRule = await prisma.automationRule.create({
      data: {
        organizationId: tenant.orgId,
        title,
        category: body.metric === 'product_stock_below' ? 'stock' : 'budget',
        trigger: `${metric.label}: ${threshold} ${metric.unit}`,
        action: RULE_ACTIONS[body.actionType as keyof typeof RULE_ACTIONS],
        metric: body.metric,
        threshold,
        actionType: body.actionType,
        enabled: body.enabled ?? true,
        lastTriggered: ''
      }
    });

    return NextResponse.json({
      success: true,
      data: newRule
    }, { status: 201 });
  } catch (error) {
    console.error('Rule creation error:', error);
    return NextResponse.json({ success: false, error: 'Kural oluşturulamadı' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { id, enabled } = body;

    if (!id) {
      return NextResponse.json({ error: 'Kural ID belirtilmedi' }, { status: 400 });
    }

    const existing = await prisma.automationRule.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!existing) {
      return NextResponse.json({ error: 'Kural bulunamadı' }, { status: 404 });
    }

    const updated = await prisma.automationRule.update({
      where: { id },
      data: {
        ...(enabled !== undefined && { enabled: Boolean(enabled) })
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Rule update error:', error);
    return NextResponse.json({ error: 'Kural güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Kural ID belirtilmedi' }, { status: 400 });
    const { count } = await prisma.automationRule.deleteMany({ where: { id, organizationId: tenant.orgId } });
    if (count === 0) return NextResponse.json({ error: 'Kural bulunamadı' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Kural silindi' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kural silinemedi' }, { status: 500 });
  }
}
