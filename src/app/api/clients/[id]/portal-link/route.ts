import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPortalKey } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { slug: true }
    });

    if (!client) {
      return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
    }

    const key = await createPortalKey(client.slug);
    if (!key) {
      return NextResponse.json({ error: 'Sunucuda AUTH_SECRET tanımlı değil' }, { status: 500 });
    }

    const origin = new URL(request.url).origin;
    return NextResponse.json({
      success: true,
      data: { slug: client.slug, key, url: `${origin}/portal/${client.slug}?key=${key}` }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
