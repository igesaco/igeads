import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rules = await prisma.automationRule.findMany({
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
    const body = await request.json();
    const newRule = await prisma.automationRule.create({
      data: {
        title: body.title,
        category: body.category || 'budget',
        trigger: body.trigger,
        action: body.action,
        enabled: body.enabled ?? true,
        impactScore: Number(body.impactScore) || 85,
        lastTriggered: 'Yeni oluşturuldu'
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
    const body = await request.json();
    const { id, enabled } = body;

    if (!id) {
      return NextResponse.json({ error: 'Kural ID belirtilmedi' }, { status: 400 });
    }

    const updated = await prisma.automationRule.update({
      where: { id },
      data: {
        ...(enabled !== undefined && { enabled })
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Rule update error:', error);
    return NextResponse.json({ error: 'Kural güncellenemedi' }, { status: 500 });
  }
}
