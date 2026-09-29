import { NextResponse } from 'next/server';

export interface AgencyContract {
  id: string;
  clientSlug: string;
  clientName: string;
  planType: 'retainer_commission' | 'fixed_retainer' | 'performance_fee';
  planTitle: string;
  monthlyRetainer: number;
  commissionRate: number; // e.g. 8 for 8%
  currentMonthAdSpend: number;
  calculatedCommission: number;
  totalMonthlyFee: number;
  status: 'paid' | 'pending' | 'due';
  dueDate: string;
  lastPaymentDate?: string;
  contractStartDate: string;
  contractRenewalDate: string;
  invoiceNumber: string;
}

const initialContracts: AgencyContract[] = [];

let contractsStore = [...initialContracts];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientSlug = searchParams.get('clientSlug');

  let filtered = contractsStore;
  if (clientSlug && clientSlug !== 'all') {
    filtered = contractsStore.filter(c => c.clientSlug === clientSlug);
  }

  const totalMRR = contractsStore.reduce((acc, c) => acc + c.totalMonthlyFee, 0);
  const totalPaid = contractsStore.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.totalMonthlyFee, 0);
  const totalPending = contractsStore.filter(c => c.status !== 'paid').reduce((acc, c) => acc + c.totalMonthlyFee, 0);

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
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContract: AgencyContract = {
      id: `contract-${Date.now()}`,
      clientSlug: body.clientSlug || 'newclient',
      clientName: body.clientName || 'Yeni Müşteri',
      planType: body.planType || 'retainer_commission',
      planTitle: body.planTitle || 'Özel Ajans Yönetim Sözleşmesi',
      monthlyRetainer: Number(body.monthlyRetainer) || 30000,
      commissionRate: Number(body.commissionRate) || 10,
      currentMonthAdSpend: Number(body.currentMonthAdSpend) || 50000,
      calculatedCommission: Math.round(((Number(body.currentMonthAdSpend) || 50000) * (Number(body.commissionRate) || 10)) / 100),
      totalMonthlyFee: (Number(body.monthlyRetainer) || 30000) + Math.round(((Number(body.currentMonthAdSpend) || 50000) * (Number(body.commissionRate) || 10)) / 100),
      status: 'pending',
      dueDate: body.dueDate || '2026-10-15',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractRenewalDate: '2027-10-01',
      invoiceNumber: `İGE-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    contractsStore = [newContract, ...contractsStore];

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

    const contractIndex = contractsStore.findIndex(c => c.id === id);
    if (contractIndex === -1) {
      return NextResponse.json({ success: false, error: 'Sözleşme bulunamadı' }, { status: 404 });
    }

    contractsStore[contractIndex] = {
      ...contractsStore[contractIndex],
      ...(status && { status }),
      ...(status === 'paid' && { lastPaymentDate: new Date().toISOString().split('T')[0] })
    };

    return NextResponse.json({
      success: true,
      data: contractsStore[contractIndex]
    });
  } catch (error) {
    console.error('Contract update error:', error);
    return NextResponse.json({ success: false, error: 'Sözleşme güncellenemedi' }, { status: 500 });
  }
}
