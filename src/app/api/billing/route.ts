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

const initialContracts: AgencyContract[] = [
  {
    id: 'contract-1',
    clientSlug: 'mandalinclean',
    clientName: 'Mandalin Clean',
    planType: 'retainer_commission',
    planTitle: 'Yerel Büyüme & Lead Generation Paketi',
    monthlyRetainer: 35000,
    commissionRate: 8,
    currentMonthAdSpend: 75000,
    calculatedCommission: 6000,
    totalMonthlyFee: 41000,
    status: 'paid',
    dueDate: '2026-10-05',
    lastPaymentDate: '2026-09-25',
    contractStartDate: '2026-01-01',
    contractRenewalDate: '2026-12-31',
    invoiceNumber: 'İGE-2026-0901'
  },
  {
    id: 'contract-2',
    clientSlug: 'igesaturkiye',
    clientName: 'İgeAds Danışmanlık',
    planType: 'retainer_commission',
    planTitle: 'Global B2B E-İhracat & Amazon Danışmanlığı',
    monthlyRetainer: 65000,
    commissionRate: 5,
    currentMonthAdSpend: 110000,
    calculatedCommission: 42500, // %5 net ciro primi
    totalMonthlyFee: 107500,
    status: 'due',
    dueDate: '2026-10-02',
    lastPaymentDate: '2026-08-30',
    contractStartDate: '2025-11-01',
    contractRenewalDate: '2026-11-01',
    invoiceNumber: 'İGE-2026-0902'
  },
  {
    id: 'contract-3',
    clientSlug: 'velvetcouture',
    clientName: 'Velvet Couture',
    planType: 'retainer_commission',
    planTitle: 'E-Ticaret & DPA Katalog Ölçekleme Paketi',
    monthlyRetainer: 45000,
    commissionRate: 12,
    currentMonthAdSpend: 140000,
    calculatedCommission: 16800,
    totalMonthlyFee: 61800,
    status: 'paid',
    dueDate: '2026-10-08',
    lastPaymentDate: '2026-09-22',
    contractStartDate: '2026-02-15',
    contractRenewalDate: '2027-02-15',
    invoiceNumber: 'İGE-2026-0903'
  }
];

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
