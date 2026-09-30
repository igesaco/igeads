import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
    const body = await request.json();
    const { id, price, buyboxPrice, isBuybox, stock } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID belirtilmedi' }, { status: 400 });
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
    const body = await request.json();
    const { name, sku, marketplace, price, stock, clientId } = body;

    if (!name || !sku) {
      return NextResponse.json({ error: 'Ürün adı ve SKU zorunludur' }, { status: 400 });
    }

    const newProd = await prisma.product.create({
      data: {
        name,
        sku,
        marketplace: marketplace || 'Hepsiburada',
        price: Number(price) || 500,
        buyboxPrice: Number(price) || 500,
        stock: Number(stock) || 10,
        isBuybox: true,
        returnRate: 1.5,
        clientId: clientId || null
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
