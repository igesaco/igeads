import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalContext, requireTenant } from '@/lib/tenant';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    // Portal visitors only reach this with their own brand's slug (checked in middleware)
    const portal = getPortalContext(request);
    let orgId: string;
    if (portal) {
      orgId = portal.orgId;
    } else {
      const tenant = await requireTenant(request);
      if (tenant instanceof NextResponse) return tenant;
      orgId = tenant.orgId;
    }

    const where: any = { organizationId: orgId };
    if (portal) {
      where.clientSlug = portal.clientSlug;
    } else if (clientSlug && clientSlug !== 'all') {
      where.clientSlug = clientSlug;
    }

    const tasks = await prisma.agencyTask.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görevler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const body = await request.json();
    const { 
      title, 
      description, 
      clientSlug, 
      clientName, 
      assignedTo, 
      priority = 'medium',
      stage = 'idea',
      dueDate,
      creativeHook,
      channel = 'meta'
    } = body;

    if (!title || !clientSlug) {
      return NextResponse.json({ error: 'Görev başlığı ve marka seçimi zorunludur' }, { status: 400 });
    }

    const client = await prisma.client.findFirst({ where: { slug: clientSlug, organizationId: tenant.orgId } });
    if (!client) {
      return NextResponse.json({ error: 'Seçilen marka bulunamadı' }, { status: 404 });
    }

    const task = await prisma.agencyTask.create({
      data: {
        organizationId: tenant.orgId,
        title: title.trim(),
        description: description || null,
        clientSlug,
        clientName: clientName || client.name,
        assignedTo: assignedTo || null,
        stage,
        priority,
        dueDate: dueDate || 'Bu hafta',
        creativeHook: creativeHook || null,
        channel
      }
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görev eklenirken hata oluştu' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, assignedTo, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'Görev ID zorunludur' }, { status: 400 });
    }

    // Portal visitors (set by middleware) may only approve or request a revision on their own brand's tasks
    const portal = getPortalContext(request);
    let orgId: string;
    if (portal) {
      orgId = portal.orgId;
      if (!['published', 'in_progress'].includes(stage) || assignedTo !== undefined || priority !== undefined || body.description !== undefined) {
        return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
      }
    } else {
      const tenant = await requireTenant(request);
      if (tenant instanceof NextResponse) return tenant;
      orgId = tenant.orgId;
    }

    const task = await prisma.agencyTask.findFirst({ where: { id, organizationId: orgId }, select: { clientSlug: true, description: true } });
    if (!task || (portal && task.clientSlug !== portal.clientSlug)) {
      return NextResponse.json({ error: 'Görev bulunamadı' }, { status: 404 });
    }

    // A client's revision request is appended to the brief, never replaces it
    const revisionNote = typeof body.revisionNote === 'string' ? body.revisionNote.trim().slice(0, 2000) : '';
    const description = revisionNote
      ? `${task.description || ''}\n[Müşteri Revize Notu]: ${revisionNote}`.trim()
      : (!portal && body.description !== undefined ? body.description : undefined);

    const updated = await prisma.agencyTask.update({
      where: { id },
      data: {
        ...(stage && { stage }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(priority && { priority }),
        ...(description !== undefined && { description })
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görev güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Görev ID zorunludur' }, { status: 400 });
    }

    const { count } = await prisma.agencyTask.deleteMany({ where: { id, organizationId: tenant.orgId } });
    if (count === 0) {
      return NextResponse.json({ error: 'Görev bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Görev başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görev silinemedi' }, { status: 500 });
  }
}
