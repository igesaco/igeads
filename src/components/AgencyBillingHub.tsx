'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Send, 
  Download, 
  FileText, 
  Percent, 
  Building2,
  Sparkles,
  CreditCard,
  Check
} from 'lucide-react';

interface AgencyContract {
  id: string;
  clientSlug: string;
  clientName: string;
  planType: 'retainer_commission' | 'fixed_retainer' | 'performance_fee';
  planTitle: string;
  monthlyRetainer: number;
  commissionRate: number;
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

interface AgencyBillingHubProps {
  activeClientName?: string;
}

export default function AgencyBillingHub({ activeClientName = '' }: AgencyBillingHubProps) {
  const [contracts, setContracts] = useState<AgencyContract[]>([]);
  const [summary, setSummary] = useState({
    totalMRR: 210300,
    projectedARR: 2523600,
    totalCollected: 0,
    totalPending: 0
  });
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderSentMsg, setReminderSentMsg] = useState<string | null>(null);

  // New Contract Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientSlug: '',
    planTitle: 'Performans Büyüme & Lead Retainer',
    monthlyRetainer: 25000,
    commissionRate: 10,
    currentMonthAdSpend: 50000,
    dueDate: '2026-10-10'
  });

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const [res, clientRes] = await Promise.all([
        fetch('/api/billing'),
        fetch('/api/clients')
      ]);
      const json = await res.json();
      const clientJson = await clientRes.json();
      if (json.success) {
        setContracts(json.data);
        if (json.summary) setSummary(json.summary);
      }
      if (clientJson.success && Array.isArray(clientJson.data)) {
        setAvailableClients(clientJson.data);
        if (clientJson.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            clientSlug: prev.clientSlug || clientJson.data[0].slug,
            clientName: prev.clientName || clientJson.data[0].name
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load billing data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'due' : 'paid';
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

    try {
      await fetch('/api/billing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchBilling();
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  const handleSendReminder = (contract: AgencyContract) => {
    const text = `Merhaba ${contract.clientName} Yetkilisi,\n\nİgeAds Ajansı tarafından yürütülen performans pazarlaması çalışmalarınıza ait ${contract.invoiceNumber} numaralı aylık hakediş faturanız (₺${contract.totalMonthlyFee.toLocaleString('tr-TR')}) hazırlanmıştır.\n\nVade Tarihi: ${contract.dueDate}\n\nDetaylı hesap dökümünüzü canlı müşteri portalınızdan inceleyebilirsiniz.\n\nİyi çalışmalar dileriz,\nİgeAds Muhasebe & Operasyon`;
    
    // Simulating WhatsApp trigger
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');

    setReminderSentMsg(`${contract.clientName} için fatura hatırlatması WhatsApp'a aktarıldı.`);
    setTimeout(() => setReminderSentMsg(null), 4000);
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchBilling();
      }
    } catch (e) {
      console.error('Contract creation error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              FİNANS & SÖZLEŞMELER
            </span>
            <span className="text-xs text-slate-400">| Ajans Nakit Akışı & Otomatik Hakediş</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Ajans Gelirleri, Retainer Sözleşmeleri & Komisyon Masası</span>
          </h1>
          <p className="text-xs text-slate-400">
            Müşterilerinizin sabit retainer bedellerini, reklam harcama komisyonlarını ve ciro primlerini tek ekrandan yönetin; vadesi gelen faturaları 1-tıkla hatırlatın.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri Sözleşmesi Tanımla</span>
        </button>
      </div>

      {reminderSentMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{reminderSentMsg}</span>
        </div>
      )}

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-slate-400">Ajans MRR (Aylık Tekrarlayan Ciro)</span>
          <p className="text-2xl font-black text-white mt-1">₺{summary.totalMRR.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-emerald-400 font-bold">3 Aktif Retainer Sözleşmesi</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Tahmini Yıllık ARR</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">₺{summary.projectedARR.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-slate-400">12 Aylık Projeksiyon</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30">
          <span className="text-xs font-semibold text-cyan-300">Bu Ay Tahsil Edilen</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">₺{summary.totalCollected.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-emerald-400 font-bold">Hesaba Geçen Tutar</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/30">
          <span className="text-xs font-semibold text-amber-300">Bekleyen / Vadesi Gelen</span>
          <p className="text-2xl font-black text-amber-400 mt-1">₺{summary.totalPending.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-amber-400 font-semibold">1 Fatura Ödeme Bekliyor</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Müşteri Hakediş & Sözleşme Dökümü</span>
            </h2>
            <p className="text-xs text-slate-400">
              Sabit Retainer + Harcama Komisyonu bazlı dinamik gelir hesaplamaları
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#141b2b] border border-[#212b42] text-slate-300">
            Dönem: Eylül 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f293d] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-3">Marka / Müşteri</th>
                <th className="pb-3">Paket & Model</th>
                <th className="pb-3 text-right">Sabit Retainer</th>
                <th className="pb-3 text-right">Reklam Harcaması</th>
                <th className="pb-3 text-right">Komisyon (% / ₺)</th>
                <th className="pb-3 text-right">Toplam Hakediş</th>
                <th className="pb-3 text-center">Vade Tarihi</th>
                <th className="pb-3 text-center">Fatura Durumu</th>
                <th className="pb-3 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182236]">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#151c2e]/60 transition-colors">
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{c.clientName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{c.invoiceNumber}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <p className="font-semibold text-slate-200">{c.planTitle}</p>
                    <span className="text-[10px] text-slate-400">Yenilenme: {c.contractRenewalDate}</span>
                  </td>

                  <td className="py-4 text-right font-medium text-slate-300">
                    ₺{c.monthlyRetainer.toLocaleString('tr-TR')}
                  </td>

                  <td className="py-4 text-right font-medium text-slate-400">
                    ₺{c.currentMonthAdSpend.toLocaleString('tr-TR')}
                  </td>

                  <td className="py-4 text-right font-semibold text-cyan-400">
                    %{c.commissionRate}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      +₺{c.calculatedCommission.toLocaleString('tr-TR')}
                    </span>
                  </td>

                  <td className="py-4 text-right font-black text-emerald-400 text-sm">
                    ₺{c.totalMonthlyFee.toLocaleString('tr-TR')}
                  </td>

                  <td className="py-4 text-center text-slate-300 font-mono text-[11px]">
                    {c.dueDate}
                  </td>

                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        c.status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : c.status === 'due'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {c.status === 'paid' ? '✓ Ödendi' : c.status === 'due' ? '⏳ Vadesi Geldi' : 'Beklemede'}
                    </button>
                  </td>

                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendReminder(c)}
                        title="WhatsApp Fatura Hatırlatması Gönder"
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 max-w-lg w-full bg-[#0c111d] shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Yeni Ajans Sözleşmesi Tanımla</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Müşterinize ait sabit retainer ve komisyon oranını belirleyin.
            </p>

            <form onSubmit={handleCreateContract} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Müşteri / Marka</label>
                <select
                  value={formData.clientSlug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    const found = availableClients.find(c => c.slug === slug);
                    setFormData({ 
                      ...formData, 
                      clientSlug: slug, 
                      clientName: found ? found.name : slug 
                    });
                  }}
                  className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  {availableClients.length > 0 ? (
                    availableClients.map(c => (
                      <option key={c.id} value={c.slug}>{c.name} ({c.sector})</option>
                    ))
                  ) : (
                    <option value="">Henüz marka eklenmedi (Önce marka ekleyin)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Paket & Sözleşme Başlığı</label>
                <input
                  type="text"
                  value={formData.planTitle}
                  onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
                  className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Aylık Sabit Retainer (₺)</label>
                  <input
                    type="number"
                    value={formData.monthlyRetainer}
                    onChange={(e) => setFormData({ ...formData, monthlyRetainer: Number(e.target.value) })}
                    className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Reklam Komisyon Oranı (%)</label>
                  <input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tahmini Reklam Bütçesi (₺)</label>
                  <input
                    type="number"
                    value={formData.currentMonthAdSpend}
                    onChange={(e) => setFormData({ ...formData, currentMonthAdSpend: Number(e.target.value) })}
                    className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Fatura Vade Tarihi</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-[#141b2a] border border-[#212b42] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1a2338]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  Sözleşmeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
