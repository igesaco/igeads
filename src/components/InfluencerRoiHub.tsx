'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Search, 
  ArrowUpRight,
  Video,
  Award,
  Link as LinkIcon
} from 'lucide-react';
import { mockInfluencers } from '../data/mockData';
import { InfluencerPartner } from '../types';

interface InfluencerRoiHubProps {
  activeClientName?: string;
}

export default function InfluencerRoiHub({ activeClientName = '' }: InfluencerRoiHubProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [showAiMatch, setShowAiMatch] = useState(false);
  const [influencers, setInfluencers] = useState<InfluencerPartner[]>(mockInfluencers);

  // Fetch real clients
  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setClients(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync with prop if provided
  useEffect(() => {
    if (activeClientName && activeClientName !== 'Tüm Müşteriler' && activeClientName !== 'all') {
      setSelectedBrand(activeClientName);
    } else {
      setSelectedBrand('all');
    }
  }, [activeClientName]);

  const totalSpent = influencers.reduce((acc, i) => acc + (i.cost || 0), 0);
  const totalRev = influencers.reduce((acc, i) => acc + (i.revenueGenerated || 0), 0);
  const avgRoi = totalSpent > 0 ? (totalRev / totalSpent).toFixed(1) : '0';
  const topCode = influencers.length > 0 ? influencers.reduce((max, cur) => cur.ordersDriven > max.ordersDriven ? cur : max, influencers[0]).promoCode : '-';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              UGC & AFFILIATE
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand !== 'all' ? `${selectedBrand} İçerik Üretici & Kupon Takibi` : 'Tüm Portföy Konsolide'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            <span>AI Influencer & UGC ROI Hub&apos;ı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Hangi Influencer&apos;ın gerçekten satış getirdiğini promo kodları ve sepet ilişkilendirmesiyle takip edin; kârlı iş birliklerini ölçekleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto gap-1">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            {clients.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedBrand(c.name)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedBrand === c.name
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowAiMatch(!showAiMatch)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-xs font-bold text-white shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showAiMatch ? 'Listeye Dön' : 'AI Eşleştirici'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Toplam Influencer Bütçesi</span>
          <p className="text-2xl font-black text-white mt-1">₺{totalSpent.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-slate-400">{influencers.length} Kayıtlı Partner</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Üretilen Toplam Ciro</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₺{totalRev.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-emerald-400 font-bold">Kupon Kodu & Link Eşleşmesi</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-rose-500/30">
          <span className="text-xs font-semibold text-rose-300">Ortalama Kampanya ROI</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{avgRoi}x</p>
          <span className="text-xs text-emerald-400 font-bold">Harcanan her ₺1 = ₺{avgRoi} Satış</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">En Çok Satan Kod</span>
          <p className="text-2xl font-black text-purple-400 mt-1">{topCode}</p>
          <span className="text-xs text-slate-400">
            {influencers.find(i => i.promoCode === topCode)?.ordersDriven || 0} Adet
          </span>
        </div>
      </div>

      {/* AI Influencer Match Recommendation Box */}
      {showAiMatch && (
        <div className="glass-panel p-6 rounded-2xl border-purple-500/40 bg-gradient-to-br from-[#121628] to-[#0e1322] shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              {selectedBrand !== 'all' ? `${selectedBrand} İçin AI Üretici Önerileri` : 'Sektörel AI Üretici Önerileri'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Markanızın hedef kitlesine ve pazaryeri kategori dinamiklerine en uygun, yüksek dönüşümlü içerik üreticileri yapay zeka tarafından taranır.
          </p>

          <div className="p-8 text-center border border-dashed border-[#222b40] rounded-xl bg-[#0f1422]/50">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-white mb-1">Yeni Marka Taraması Başlatın</p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto mb-3">
              Müşteri listenizden bir marka seçtikten veya yeni bir kampanya tanımladıktan sonra yapay zeka kitleye özel influencer listesi oluşturacaktır.
            </p>
          </div>
        </div>
      )}

      {/* Influencers Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Aktif Influencer & Kod Performans Listesi</h2>
          <button className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Partner / Kupon Ekle</span>
          </button>
        </div>

        {influencers.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0e1320]/40">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Henüz Kayıtlı Influencer veya Kupon Kodu Yok</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
              Influencer ve içerik üreticilerine özel tanımladığınız indirim kodlarını veya referans linklerini ekleyerek net ciro ve sepet bazlı ROI takibi yapabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f293d] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="pb-3">İçerik Üreticisi</th>
                  <th className="pb-3">Platform</th>
                  <th className="pb-3">Kitle & Etkileşim</th>
                  <th className="pb-3">Kupon Kodu</th>
                  <th className="pb-3 text-right">Maliyet</th>
                  <th className="pb-3 text-right">Üretilen Satış</th>
                  <th className="pb-3 text-right">Net ROI</th>
                  <th className="pb-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182236]">
                {influencers.map((inf) => (
                  <tr key={inf.id} className="hover:bg-[#151c2e]/60 transition-colors">
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                          {inf.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{inf.name}</p>
                          <p className="text-[10px] text-slate-400">{inf.handle}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 font-semibold text-slate-300">
                      {inf.platform}
                    </td>

                    <td className="py-4 text-slate-300">
                      <span>{inf.followers} Takipçi</span>
                      <span className="text-[10px] text-emerald-400 block font-semibold">{inf.engagementRate} Etkileşim</span>
                    </td>

                    <td className="py-4">
                      <span className="px-2 py-1 rounded bg-[#182033] border border-[#2b3752] text-xs font-mono font-bold text-purple-300">
                        {inf.promoCode}
                      </span>
                    </td>

                    <td className="py-4 text-right font-medium text-slate-300">
                      ₺{inf.cost.toLocaleString('tr-TR')}
                    </td>

                    <td className="py-4 text-right font-bold text-emerald-400">
                      ₺{inf.revenueGenerated.toLocaleString('tr-TR')}
                      <span className="text-[10px] text-slate-400 block font-normal">{inf.ordersDriven} Sipariş</span>
                    </td>

                    <td className="py-4 text-right font-extrabold text-rose-400">
                      {inf.roi}x
                    </td>

                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inf.status === 'active' 
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {inf.status === 'active' ? 'Aktif Yayın' : 'Tamamlandı'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
