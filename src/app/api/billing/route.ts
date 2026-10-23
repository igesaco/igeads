import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['paid', 'pending', 'due'];

function isoDate(d: Date) {
  return d.toISOString().split('T')[0];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    const contracts = await prisma.agencyContract.findMany({ orderBy: { createdAt: 'desc' } });
    const filtered = clientSlug && clientSlug !== 'all'
      ? contracts.filter(c => c.clientSlug === clientSlug)
      : contracts;

    const totalMRR = contracts.reduce((acc, c) => acc + c.totalMonthlyFee, 0);
    const totalPaid = contracts.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.totalMonthlyFee, 0);
    const totalPending = contracts.filter(c => c.status !== 'paid').reduce((acc, c) => acc + c.totalMonthlyFee, 0);

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      summary: {
        totalMRR,
        projectedARR: totalMRR * 12,
        totalCollected: totalPaid,
        totalPending
      },
      data: filtered
    });
  } catch (error) {
    console.error('Contracts fetch error:', error);
    return NextResponse.json({ success: false, error: 'Sözleşmeler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const monthlyRetainer = Number(body.monthlyRetainer) || 30000;
    const commissionRate = Number(body.commissionRate) || 10;
    const currentMonthAdSpend = Number(body.currentMonthAdSpend) || 50000;
    const calculatedCommission = Math.round((currentMonthAdSpend * commissionRate) / 100);

    const now = new Date();
    const due = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const renewal = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const newContract = await prisma.agencyContract.create({
      data: {
        clientSlug: body.clientSlug || 'newclient',
        clientName: body.clientName || 'Yeni Müşteri',
        planType: body.planType || 'retainer_commission',
        planTitle: body.planTitle || 'Özel Ajans Yönetim Sözleşmesi',
        monthlyRetainer,
        commissionRate,
        currentMonthAdSpend,
        calculatedCommission,
        totalMonthlyFee: monthlyRetainer + calculatedCommission,
        status: 'pending',
        dueDate: body.dueDate || isoDate(due),
        contractStartDate: isoDate(now),
        contractRenewalDate: isoDate(renewal),
        invoiceNumber: `İGE-${now.getFullYear()}-${Date.now().toString().slice(-6)}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Yeni ajans sözleşmesi başarıyla kaydedildi',
      data: newContract
    }, { status: 201 });
  } catch (error) {
    console.error('Contract creation error:', error);
    return NextResponse.json({ success: false, error: 'Sözleşme oluşturulamadı' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || (status && !VALID_STATUSES.includes(status))) {
      return NextResponse.json({ success: false, error: 'Geçersiz sözleşme ID veya durum' }, { status: 400 });
    }

    const existing = await prisma.agencyContract.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Sözleşme bulunamadı' }, { status: 404 });
    }

    const updated = await prisma.agencyContract.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(status === 'paid' && { lastPaymentDate: isoDate(new Date()) })
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Contract update error:', error);
    return NextResponse.json({ success: false, error: 'Sözleşme güncellenemedi' }, { status: 500 });
  }
}
