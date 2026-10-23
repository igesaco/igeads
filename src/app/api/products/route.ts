import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const products = await prisma.product.findMany({
      where: { organizationId: tenant.orgId },
      orderBy: { stock: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ success: false, error: 'Ürünler alınamadı' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { id, price, buyboxPrice, isBuybox, stock } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID belirtilmedi' }, { status: 400 });
    }

    const existing = await prisma.product.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!existing) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(buyboxPrice !== undefined && { buyboxPrice: Number(buyboxPrice) }),
        ...(isBuybox !== undefined && { isBuybox: Boolean(isBuybox) }),
        ...(stock !== undefined && { stock: Number(stock) })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ürün ve Buybox durumu başarıyla güncellendi.',
      data: updated
    });
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { name, sku, marketplace, price, stock, clientId } = body;

    if (!name || !sku) {
      return NextResponse.json({ error: 'Ürün adı ve SKU zorunludur' }, { status: 400 });
    }

    const duplicate = await prisma.product.findFirst({ where: { sku, organizationId: tenant.orgId } });
    if (duplicate) {
      return NextResponse.json({ error: 'Bu SKU ile kayıtlı bir ürün zaten var' }, { status: 409 });
    }

    let ownerId: string | null = null;
    if (clientId) {
      const owner = await prisma.client.findFirst({ where: { id: clientId, organizationId: tenant.orgId }, select: { id: true } });
      ownerId = owner?.id ?? null;
    }

    const newProd = await prisma.product.create({
      data: {
        organizationId: tenant.orgId,
        name,
        sku,
        marketplace: marketplace || 'Hepsiburada',
        price: Number(price) || 500,
        buyboxPrice: Number(price) || 500,
        stock: Number(stock) || 10,
        isBuybox: true,
        returnRate: 1.5,
        clientId: ownerId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Yeni ürün başarıyla eklendi.',
      data: newProd
    });
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: error.message || 'Ürün oluşturulamadı' }, { status: 500 });
  }
}
