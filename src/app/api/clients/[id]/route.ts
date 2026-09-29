import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        campaigns: true,
        products: true
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        sector: body.sector,
        description: body.description,
        targetAudience: body.targetAudience,
        monthlyBudget: body.monthlyBudget ? Number(body.monthlyBudget) : undefined,
        status: body.status,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        metaAccountId: body.metaAccountId,
        googleAdsId: body.googleAdsId
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Müşteri ve bağlı veriler başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
