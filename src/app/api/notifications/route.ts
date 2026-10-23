import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const notifications = await prisma.notification.findMany({
      where: { organizationId: tenant.orgId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return NextResponse.json({ success: true, unreadCount, data: notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bildirimler alınamadı' }, { status: 500 });
  }
}

/** Marks one notification (body.id) or all of them as read */
export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant(request, { allowExpired: true });
    if (tenant instanceof NextResponse) return tenant;

    const body = await request.json().catch(() => ({}));
    await prisma.notification.updateMany({
      where: { organizationId: tenant.orgId, ...(body?.id ? { id: String(body.id) } : {}) },
      data: { read: true }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Bildirim güncellenemedi' }, { status: 500 });
  }
}
