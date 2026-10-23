import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePassword } from '@/lib/password';
import { requireTenant, userLimitReached } from '@/lib/tenant';

const MANAGERS = ['owner', 'admin'];

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const [members, users] = await Promise.all([
      prisma.teamMember.findMany({ where: { organizationId: tenant.orgId }, orderBy: { createdAt: 'asc' } }),
      prisma.user.findMany({ where: { organizationId: tenant.orgId }, select: { email: true, role: true, lastLoginAt: true } })
    ]);
    const byEmail = new Map(users.map(u => [u.email, u]));
    const data = members.map(m => {
      const login = byEmail.get(m.email);
      return { ...m, hasLogin: Boolean(login), accountRole: login?.role ?? null, lastLoginAt: login?.lastLoginAt ?? null };
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ekip üyeleri alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request, { roles: MANAGERS });
    if (tenant instanceof NextResponse) return tenant;

    const body = await request.json();
    const { name, role = 'media_buyer', roleTitle, phone, assignedClients = '*' } = body;
    const email = String(body.email || '').trim().toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name || !email) {
      return NextResponse.json({ error: 'Ad ve e-posta zorunludur' }, { status: 400 });
    }

    const duplicate = await prisma.teamMember.findFirst({ where: { organizationId: tenant.orgId, email } });
    if (duplicate) {
      return NextResponse.json({ error: 'Bu e-posta ile bir ekip üyesi zaten var' }, { status: 409 });
    }

    // A password gives the member their own login to this organization
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });
      if (await prisma.user.findUnique({ where: { email } })) {
        return NextResponse.json({ error: 'Bu e-posta başka bir hesapta kayıtlı. Farklı bir e-posta kullanın.' }, { status: 409 });
      }
      const limit = await userLimitReached(tenant.org);
      if (limit.reached) {
        return NextResponse.json({
          code: 'plan_limit',
          error: `Paketiniz en fazla ${limit.max} kullanıcıya izin veriyor. Daha fazlası için paketinizi yükseltin.`
        }, { status: 402 });
      }
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
        organizationId: tenant.orgId,
        name: name.trim(),
        email,
        role,
        roleTitle: roleTitle || titleMap[role] || 'Performans Uzmanı',
        phone: phone || null,
        assignedClients: Array.isArray(assignedClients) ? assignedClients.join(',') : assignedClients,
        status: 'active',
        avatarColor: colorMap[role] || 'indigo'
      }
    });

    if (password) {
      await prisma.user.create({
        data: {
          email,
          name: name.trim(),
          passwordHash: await hashPassword(password),
          role: role === 'admin' ? 'admin' : 'member',
          organizationId: tenant.orgId
        }
      });
    }

    return NextResponse.json({ success: true, data: { ...member, hasLogin: Boolean(password) } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ekip üyesi eklenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const tenant = await requireTenant(request, { roles: MANAGERS, allowExpired: true });
    if (tenant instanceof NextResponse) return tenant;

    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Ekip üyesi ID zorunludur' }, { status: 400 });

    const member = await prisma.teamMember.findFirst({ where: { id, organizationId: tenant.orgId } });
    if (!member) return NextResponse.json({ error: 'Ekip üyesi bulunamadı' }, { status: 404 });
    if (member.email === tenant.session.email) {
      return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.teamMember.delete({ where: { id } }),
      // The account owner can never be removed by someone else
      prisma.user.deleteMany({ where: { email: member.email, organizationId: tenant.orgId, role: { not: 'owner' } } })
    ]);

    return NextResponse.json({ success: true, message: 'Ekip üyesi ve giriş hesabı silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ekip üyesi silinemedi' }, { status: 500 });
  }
}
