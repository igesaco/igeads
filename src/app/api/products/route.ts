import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';
import { pushProductUpdate, type PushResult } from '@/lib/integrations/marketplace-push';

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
    const { id, price, buyboxPrice, isBuybox, stock, cogs, shippingCost, commissionRate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID belirtilmedi' }, { status: 400 });
    }

    const existing = await prisma.product.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!existing) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    if ((price !== undefined && !(Number(price) > 0)) || (stock !== undefined && !(Number(stock) >= 0))) {
      return NextResponse.json({ error: 'Fiyat sıfırdan büyük, stok negatif olmayan bir sayı olmalıdır' }, { status: 400 });
    }

    // Price and stock go to the marketplace first; the local copy changes only if that succeeds
    const priceChanged = price !== undefined && Number(price) !== existing.price;
    const stockChanged = stock !== undefined && Number(stock) !== existing.stock;
    let push: PushResult | null = null;
    if (priceChanged || stockChanged) {
      try {
        push = await pushProductUpdate(tenant.orgId, existing, {
          ...(priceChanged && { price: Number(price) }),
          ...(stockChanged && { stock: Number(stock) })
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message || 'Pazaryerine gönderilemedi' }, { status: 502 });
      }
    }

    const optionalNumber = (v: unknown) => (v === null || v === '' ? null : Number(v));
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(buyboxPrice !== undefined && { buyboxPrice: Number(buyboxPrice) }),
        ...(isBuybox !== undefined && { isBuybox: Boolean(isBuybox) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(cogs !== undefined && { cogs: optionalNumber(cogs) }),
        ...(shippingCost !== undefined && { shippingCost: optionalNumber(shippingCost) }),
        ...(commissionRate !== undefined && { commissionRate: optionalNumber(commissionRate) })
      }
    });

    return NextResponse.json({
      success: true,
      pushed: push?.pushed ?? false,
      message: push?.message || 'Ürün güncellendi.',
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
        price: Number(price) || 0,
        buyboxPrice: Number(price) || 0,
        stock: Number(stock) || 0,
        isBuybox: true,
        returnRate: 0,
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
