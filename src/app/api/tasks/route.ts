import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    const where: any = {};
    if (clientSlug && clientSlug !== 'all') {
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

    const task = await prisma.agencyTask.create({
      data: {
        title: title.trim(),
        description: description || null,
        clientSlug,
        clientName: clientName || clientSlug,
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

    const updated = await prisma.agencyTask.update({
      where: { id },
      data: {
        ...(stage && { stage }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(priority && { priority }),
        ...(body.description !== undefined && { description: body.description })
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görev güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Görev ID zorunludur' }, { status: 400 });
    }

    await prisma.agencyTask.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Görev başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Görev silinemedi' }, { status: 500 });
  }
}

