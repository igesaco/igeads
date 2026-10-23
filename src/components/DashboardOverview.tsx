'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, ShoppingCart, AlertTriangle, ArrowUpRight, Sparkles, Store, BarChart3, Megaphone } from 'lucide-react';
import { AdCampaign } from '../types';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenGhostModal: () => void;
  activeClientName?: string;
}

interface ProductRow {
  id: string;
  name: string;
  marketplace: string;
  stock: number;
  price: number;
  cogs: number | null;
  shippingCost: number | null;
  commissionRate: number | null;
}

const LOW_STOCK = 5;

/** Unit profit only when the seller entered their own costs */
function unitProfit(p: ProductRow): number | null {
  if (p.cogs === null || p.shippingCost === null || p.commissionRate === null) return null;
  return Math.round(p.price - p.cogs - p.shippingCost - (p.price * p.commissionRate) / 100);
}

export default function DashboardOverview({ onNavigateTab, onOpenGhostModal, activeClientName = '' }: DashboardOverviewProps) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);

  const fetchLiveMetrics = async () => {
    try {
      // The brand selector holds a client name; filter campaigns by that client's slug when it exists
      let query = '';
      if (activeClientName) {
        const clientsRes = await fetch('/api/clients').then(r => r.json()).catch(() => null);
        const match = Array.isArray(clientsRes?.data) ? clientsRes.data.find((c: any) => c.name === activeClientName) : null;
        if (match?.slug) query = `?clientSlug=${encodeURIComponent(match.slug)}`;
      }

      const [campRes, prodRes] = await Promise.all([
        fetch(`/api/campaigns${query}`).then(r => r.json()),
        fetch('/api/products').then(r => r.json())
      ]);

      if (Array.isArray(campRes?.data)) setCampaigns(campRes.data);
      if (Array.isArray(prodRes?.data)) {
        setProducts(prodRes.data.map((p: any) => ({
          id: p.id,
          name: p.name || 'Pazaryeri Ürünü',
          marketplace: p.marketplace || '',
          stock: Number(p.stock) || 0,
          price: Number(p.price) || 0,
          cogs: p.cogs ?? null,
          shippingCost: p.shippingCost ?? null,
          commissionRate: p.commissionRate ?? null
        })));
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
    const handleUpdate = () => fetchLiveMetrics();
    window.addEventListener('campaign_updated', handleUpdate);
    window.addEventListener('product_updated', handleUpdate);
    return () => {
      window.removeEventListener('campaign_updated', handleUpdate);
      window.removeEventListener('product_updated', handleUpdate);
    };
  }, [activeClientName]);

  const totalSpend = campaigns.reduce((acc, c) => acc + (c.spent || 0), 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0);
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : null;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const lowStock = products.filter(p => p.stock < LOW_STOCK);
  const shownProducts = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);

  const kpis = [
    { label: 'Reklam Harcaması', value: `₺${totalSpend.toLocaleString('tr-TR')}`, icon: DollarSign, color: 'text-purple-400 bg-purple-500/15' },
    { label: 'Reklamdan Gelen Ciro', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: ShoppingCart, color: 'text-emerald-400 bg-emerald-500/15' },
    { label: 'ROAS', value: roas ? `${roas}x` : '—', icon: Percent, color: 'text-cyan-400 bg-cyan-500/15' },
    { label: 'Aktif Kampanya', value: String(activeCampaigns), icon: Megaphone, color: 'text-indigo-400 bg-indigo-500/15' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#131b2e] to-cyan-950/60 border border-indigo-500/40 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              {activeClientName ? `${activeClientName} genel durumu` : 'Genel durum'}
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl">
              {lowStock.length
                ? `${lowStock.length} üründe stok ${LOW_STOCK} adedin altında. Günlük özette ayrıntılar var.`
                : 'Kampanya, stok ve Buybox durumunun özetini günlük özette görebilirsiniz.'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenGhostModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 cursor-pointer shrink-0"
        >
          Günlük Özeti Aç
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{k.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">{k.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Kampanyalar</span>
              </h2>
              <p className="text-xs text-slate-400">Bağlı reklam hesaplarından son eşitlenen veriler</p>
            </div>
            <button
              onClick={() => onNavigateTab('ads')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Reklam Paneli</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f293d] text-slate-400 font-semibold">
                  <th className="pb-3">Platform & Kampanya</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3 text-right">Harcama</th>
                  <th className="pb-3 text-right">Ciro</th>
                  <th className="pb-3 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182236]">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
                        <BarChart3 className="w-8 h-8 text-slate-600" />
                        <p className="text-xs font-semibold text-slate-300">Henüz kampanya yok</p>
                        <p className="text-[11px] text-slate-500">Meta reklam hesabınızı bağlayıp &quot;Canlı Eşitle&quot;ye bastığınızda kampanyalarınız burada listelenir.</p>
                        <button
                          onClick={() => onNavigateTab('integrations')}
                          className="mt-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Entegrasyonlara Git
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-[#151c2e]/50">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          camp.platform === 'meta' ? 'bg-blue-500' : camp.platform === 'google' ? 'bg-emerald-400' : camp.platform === 'tiktok' ? 'bg-rose-500' : 'bg-cyan-400'
                        }`}></span>
                        <div>
                          <p className="font-semibold text-white">{camp.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {camp.platform} • Günlük ₺{camp.dailyBudget.toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        camp.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {camp.status === 'active' ? 'Aktif' : camp.status === 'paused' ? 'Duraklatıldı' : camp.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-medium text-slate-200">₺{camp.spent.toLocaleString('tr-TR')}</td>
                    <td className="py-3.5 text-right font-bold text-white">₺{camp.revenue.toLocaleString('tr-TR')}</td>
                    <td className="py-3.5 text-right font-bold text-indigo-400">{camp.spent > 0 ? `${camp.roas}x` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-cyan-400" />
                <span>Stok Durumu</span>
              </h2>
              <p className="text-xs text-slate-400">Stoğu en az olan ürünler</p>
            </div>
            <button onClick={() => onNavigateTab('marketplace')} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer">
              Tümü
            </button>
          </div>

          <div className="space-y-3">
            {shownProducts.length === 0 ? (
              <div className="py-8 text-center text-xs border border-dashed border-[#1f293d] rounded-xl space-y-2">
                <Store className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">Henüz ürün yok</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Trendyol veya Hepsiburada mağazanızı bağladığınızda ürünleriniz listelenir.</p>
              </div>
            ) : shownProducts.map(prod => {
              const critical = prod.stock < LOW_STOCK;
              const profit = unitProfit(prod);
              return (
                <div key={prod.id} className={`p-3 rounded-xl border ${critical ? 'bg-rose-950/20 border-rose-500/30' : 'bg-[#141b2b]/60 border-[#1f293d]'}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-white text-xs line-clamp-1">{prod.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 rounded shrink-0 ${critical ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
                      {prod.stock} adet
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prod.marketplace} · ₺{prod.price.toLocaleString('tr-TR')}</span>
                    <span>{profit !== null ? <>Birim kâr: <strong className={profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>₺{profit.toLocaleString('tr-TR')}</strong></> : 'Maliyet girilmedi'}</span>
                  </div>
                  {critical && (
                    <p className="mt-1.5 text-[10px] text-rose-300 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stok azaldı
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
