'use client';

import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import { mockInfluencers } from '../data/mockData';
import { InfluencerPartner } from '../types';

interface InfluencerRoiHubProps {
  activeClientName?: string;
}

export default function InfluencerRoiHub({ activeClientName = '' }: InfluencerRoiHubProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [showAiMatch, setShowAiMatch] = useState(false);

  // Sync with prop if provided
  React.useEffect(() => {
    if (!activeClientName || activeClientName === 'Tüm Müşteriler' || activeClientName === 'all') {
      setSelectedBrand('all');
    } else {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin')) setSelectedBrand('mandalinclean');
      else if (lower.includes('ige') || lower.includes('danışmanlık')) setSelectedBrand('igesaturkiye');
      else if (lower.includes('velvet') || lower.includes('couture')) setSelectedBrand('velvetcouture');
      else setSelectedBrand(lower);
    }
  }, [activeClientName]);

  // Brand-specific influencer datasets
  const brandInfluencersMap: Record<string, InfluencerPartner[]> = {
    all: mockInfluencers,
    mandalinclean: [
      {
        id: 'inf-mc-1',
        name: 'Bursa Anneleri & Yaşam',
        handle: '@bursa_anneleri',
        platform: 'Instagram',
        followers: '45K',
        engagementRate: '%7.8',
        promoCode: 'BURSAEV15',
        cost: 8000,
        revenueGenerated: 52000,
        ordersDriven: 38,
        roi: 6.5,
        status: 'active'
      },
      {
        id: 'inf-mc-2',
        name: 'Ev Düzeni & Temizlik Püf Noktaları',
        handle: '@ev_duzeni_pufnoktalari',
        platform: 'TikTok',
        followers: '85K',
        engagementRate: '%8.6',
        promoCode: 'MANDALIN10',
        cost: 12000,
        revenueGenerated: 68400,
        ordersDriven: 52,
        roi: 5.7,
        status: 'active'
      },
      {
        id: 'inf-mc-3',
        name: 'Bursa Yaşam Rehberi',
        handle: '@bursayasam',
        platform: 'Instagram',
        followers: '120K',
        engagementRate: '%5.4',
        promoCode: 'TEMIZLIK20',
        cost: 15000,
        revenueGenerated: 84000,
        ordersDriven: 65,
        roi: 5.6,
        status: 'completed'
      }
    ],
    igesaturkiye: [
      {
        id: 'inf-ige-1',
        name: 'E-İhracat & Amazon Rehberi',
        handle: '@eihracat_rehberi',
        platform: 'YouTube',
        followers: '38K',
        engagementRate: '%9.2',
        promoCode: 'IGESAT2026',
        cost: 25000,
        revenueGenerated: 280000,
        ordersDriven: 8,
        roi: 11.2,
        status: 'active'
      },
      {
        id: 'inf-ige-2',
        name: 'Amazon FBA Podcast',
        handle: '@amazon_fba_podcast',
        platform: 'Spotify / Apple',
        followers: '18K',
        engagementRate: '%12.4',
        promoCode: 'GLOBAL10',
        cost: 15000,
        revenueGenerated: 165000,
        ordersDriven: 5,
        roi: 11.0,
        status: 'active'
      },
      {
        id: 'inf-ige-3',
        name: 'Startup Türkiye & B2B Ekosistemi',
        handle: '@startup_turkiye',
        platform: 'LinkedIn',
        followers: '55K',
        engagementRate: '%6.7',
        promoCode: 'AMAZONB2B',
        cost: 30000,
        revenueGenerated: 310000,
        ordersDriven: 9,
        roi: 10.3,
        status: 'completed'
      }
    ],
    velvetcouture: [
      {
        id: 'inf-vc-1',
        name: 'Selin Gökmen Couture',
        handle: '@selin_couture',
        platform: 'Instagram',
        followers: '110K',
        engagementRate: '%7.2',
        promoCode: 'SELIN20',
        cost: 20000,
        revenueGenerated: 142000,
        ordersDriven: 48,
        roi: 7.1,
        status: 'active'
      },
      {
        id: 'inf-vc-2',
        name: 'Emirhan Deri & Stil',
        handle: '@emirhan_style',
        platform: 'Instagram',
        followers: '85K',
        engagementRate: '%6.8',
        promoCode: 'EMIRHAN15',
        cost: 16000,
        revenueGenerated: 98000,
        ordersDriven: 34,
        roi: 6.1,
        status: 'active'
      },
      {
        id: 'inf-vc-3',
        name: 'Damla Kombin Önerileri',
        handle: '@damla_kombinler',
        platform: 'TikTok',
        followers: '140K',
        engagementRate: '%8.4',
        promoCode: 'DAMLA10',
        cost: 18000,
        revenueGenerated: 114000,
        ordersDriven: 42,
        roi: 6.3,
        status: 'completed'
      }
    ]
  };

  const influencers = brandInfluencersMap[selectedBrand] || brandInfluencersMap.all;

  const totalSpent = influencers.reduce((acc, i) => acc + i.cost, 0);
  const totalRev = influencers.reduce((acc, i) => acc + i.revenueGenerated, 0);
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
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean (Ev & Yerel Hizmet Odaklı)' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds (B2B E-İhracat / Girişimcilik Odaklı)' :
               selectedBrand === 'velvetcouture' ? 'Velvet Couture (Lüks Moda & Deri Odaklı)' :
               'Tüm Portföy Konsolide'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            <span>AI Influencer & UGC ROI Hub&apos;ı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Hangi Influencer&apos;ın gerçekten satış getirdiğini promo kodları ve sepet ilişkilendirmesiyle takip edin; zarar ettiren iş birliklerini anında tespit edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
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
            <button
              onClick={() => setSelectedBrand('mandalinclean')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'mandalinclean'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mandalin Clean
            </button>
            <button
              onClick={() => setSelectedBrand('igesaturkiye')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'igesaturkiye'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              İgeAds
            </button>
            <button
              onClick={() => setSelectedBrand('velvetcouture')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'velvetcouture'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Velvet Couture
            </button>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Toplam Influencer Bütçesi</span>
          <p className="text-2xl font-black text-white mt-1">₺{totalSpent.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-slate-400">{influencers.length} İş Birliği</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Üretilen Doğrudan Ciro</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₺{totalRev.toLocaleString('tr-TR')}</p>
          <span className="text-xs text-emerald-400 font-bold">
            {influencers.reduce((acc, i) => acc + i.ordersDriven, 0)} Sipariş / Randevu
          </span>
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
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean İçin AI Ev & Yaşam Influencer Önerileri' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds İçin AI E-İhracat & B2B İçerik Üretici Önerileri' :
               'Velvet Couture İçin AI Lüks Moda & Deri Influencer Önerileri'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            {selectedBrand === 'mandalinclean'
              ? 'Bursa yerel hedef kitlesinde anneler ve ev düzeni ilgisine sahip, etkileşim oranı sektör ortalamasının 2 katı üreticiler:'
              : selectedBrand === 'igesaturkiye'
              ? 'Amazon satıcıları, KOBİ ihracatçıları ve Amazon FBA girişimcileri tarafından takip edilen B2B kanaat önderleri:'
              : 'Takipçi kitlesi %78 oranında "Lüks Giyim ve Hakiki Deri" ilgisine sahip ve etkileşim oranı sektör ortalamasının 2.4 katı olan üreticiler:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#141b2a] border border-[#212b42] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    {selectedBrand === 'mandalinclean' ? '@bursa_ev_mimari' :
                     selectedBrand === 'igesaturkiye' ? '@ihracat_toplulugu' : '@emirhan_style'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold">
                    {selectedBrand === 'igesaturkiye' ? 'LinkedIn' : 'Instagram'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedBrand === 'mandalinclean' ? '54K Takipçi • %7.4 Etkileşim • Ev Dekorasyonu' :
                   selectedBrand === 'igesaturkiye' ? '42K Takipçi • %9.1 Etkileşim • İhracat Otoritesi' :
                   '85K Takipçi • %6.8 Etkileşim • Erkek Giyim Otoritesi'}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                  Tahmini ROI Potansiyeli: {selectedBrand === 'igesaturkiye' ? '12.5x' : '7.2x'}
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer">
                Teklif Gönder
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#141b2a] border border-[#212b42] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    {selectedBrand === 'mandalinclean' ? '@temizlik_avcilari_tr' :
                     selectedBrand === 'igesaturkiye' ? '@genc_girisimci_fba' : '@damla_kombinler'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">
                    {selectedBrand === 'igesaturkiye' ? 'YouTube' : 'TikTok'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedBrand === 'mandalinclean' ? '92K Takipçi • %8.1 Etkileşim • Viral Temizlik Videoları' :
                   selectedBrand === 'igesaturkiye' ? '28K Abone • %14.2 Etkileşim • Amazon Satıcı Topluluğu' :
                   '140K Takipçi • %8.4 Etkileşim • Viral Video Üreticisi'}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                  Tahmini ROI Potansiyeli: {selectedBrand === 'igesaturkiye' ? '10.8x' : '6.8x'}
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer">
                Teklif Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Influencers Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Aktif Influencer & Kod Performans Listesi</h2>

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
      </div>
    </div>
  );
}
