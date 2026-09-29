import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ekip üyeleri alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role = 'media_buyer', roleTitle, phone, assignedClients = '*' } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Ad ve e-posta zorunludur' }, { status: 400 });
    }

    const titleMap: Record<string, string> = {
      admin: 'Ajans Kurucusu & Strateji Direktörü',
      media_buyer: 'Medya Satın Alıcı (Performance Ads)',
      creative: 'Kreatif & AI Metin Yazarı',
      account_manager: 'Müşteri İlişkileri Yöneticisi'
    };

    const colorMap: Record<string, string> = {
      admin: 'indigo',
      media_buyer: 'cyan',
      creative: 'purple',
      account_manager: 'emerald'
    };

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        roleTitle: roleTitle || titleMap[role] || 'Performans Uzmanı',
        phone: phone || null,
        assignedClients: Array.isArray(assignedClients) ? assignedClients.join(',') : assignedClients,
        status: 'active',
        avatarColor: colorMap[role] || 'indigo'
      }
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ekip üyesi eklenemedi' }, { status: 500 });
  }
}
