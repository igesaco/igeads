'use client';

import React, { useState } from 'react';
import { 
  GitMerge, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Sparkles,
  PieChart,
  Repeat,
  HeartHandshake
} from 'lucide-react';

interface AttributionLtvHubProps {
  activeClientName?: string;
}

export default function AttributionLtvHub({ activeClientName = '' }: AttributionLtvHubProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activeModel, setActiveModel] = useState<'ige_ai' | 'first_click' | 'last_click'>('ige_ai');

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

  // Brand Data Sets
  const brandData: Record<string, {
    cac: string;
    cacDiff: string;
    ltv: string;
    ltvPeriod: string;
    ltvCac: string;
    retention: string;
    retentionLabel: string;
    churnTitle: string;
    churnDesc: string;
    paths: Array<{
      id: string;
      path: string[];
      conversions: number;
      totalRevenue: string;
      avgDaysToConvert: string;
      aiAttributionShare: Record<string, string>;
    }>;
  }> = {
    all: {
      cac: '₺82',
      cacDiff: '-%14 (Daha ucuz)',
      ltv: '₺1.840',
      ltvPeriod: '12 Aylık Tahmin',
      ltvCac: '22.4x',
      retention: '%34.2',
      retentionLabel: 'Pazaryeri + Web Mağazası',
      churnTitle: '418 Müşteri "Kritik Ayrılma (Churn)" Eşiğinde!',
      churnDesc: 'Trendyol ve web sitenizden son 60 gündür sipariş vermeyen 418 müşteriye AI destekli %15 sadakat kuponlu WhatsApp mesajı göndererek tahmini ₺92.000 ciro geri kazanabilirsiniz.',
      paths: [
        {
          id: 'path-1',
          path: ['TikTok Spark Video Reklamı (İlk Temas)', 'Google Ads PMax Araması', 'Trendyol Mağazasından Satın Alma'],
          conversions: 342,
          totalRevenue: '₺752.400',
          avgDaysToConvert: '4.2 gün',
          aiAttributionShare: { tiktok: '%45', google: '%35', trendyol: '%20' }
        },
        {
          id: 'path-2',
          path: ['Instagram Reels Kancası (Organik / Ads)', 'WhatsApp Sepet Hatırlatması', 'Doğrudan Web Sitesinden Satın Alma'],
          conversions: 218,
          totalRevenue: '₺479.600',
          avgDaysToConvert: '1.5 gün',
          aiAttributionShare: { meta: '%60', whatsapp: '%40' }
        },
        {
          id: 'path-3',
          path: ['ChatGPT AI Ürün Tavsiyesi (GEO)', 'Google Arama', 'Amazon TR Satın Alma'],
          conversions: 94,
          totalRevenue: '₺211.500',
          avgDaysToConvert: '2.0 gün',
          aiAttributionShare: { chatgpt: '%55', google: '%25', amazon: '%20' }
        }
      ]
    },
    mandalinclean: {
      cac: '₺64',
      cacDiff: '-%22 (Harita Optimizasyonu)',
      ltv: '₺3.850',
      ltvPeriod: 'Yılda 2.4 Koltuk/Yatak Randevusu',
      ltvCac: '60.1x',
      retention: '%58.4',
      retentionLabel: 'Düzenli Müşteri Oranı',
      churnTitle: '240 Eski Müşterinin Bahar/Kış Temizlik Zamanı Geldi!',
      churnDesc: 'Son 6 aydır koltuk veya yatak yıkatmayan 240 müşteriye otomatik WhatsApp ile "Kış Öncesi Hijyen İndirimi" hatırlatılarak tahmini ₺48.000 ciro kazanılabilir.',
      paths: [
        {
          id: 'mc-path-1',
          path: ['Google Haritalar Yerel Arama ("koltuk yıkama osmangazi")', 'WhatsApp Canlı Randevu Hattı', 'Evde Hizmet Tamamlama'],
          conversions: 184,
          totalRevenue: '₺345.000',
          avgDaysToConvert: '0.8 gün',
          aiAttributionShare: { google_maps: '%65', whatsapp: '%35' }
        },
        {
          id: 'mc-path-2',
          path: ['Instagram Reels Öncesi / Sonrası Video Reklamı', 'Web Sitesi Fiyat Hesaplama', 'WhatsApp Onay & Rezervasyon'],
          conversions: 112,
          totalRevenue: '₺224.000',
          avgDaysToConvert: '1.8 gün',
          aiAttributionShare: { meta_reels: '%50', web_calculator: '%20', whatsapp: '%30' }
        },
        {
          id: 'mc-path-3',
          path: ['Yerel Tavsiye / Ağızdan Ağıza Referans', 'Google Search Doğrudan Arama', 'Telefonla Rezervasyon'],
          conversions: 78,
          totalRevenue: '₺168.000',
          avgDaysToConvert: '0.3 gün',
          aiAttributionShare: { organic_brand: '%70', call: '%30' }
        }
      ]
    },
    igesaturkiye: {
      cac: '₺850',
      cacDiff: '-%35 (Nitelikli B2B Lead)',
      ltv: '₺120.000',
      ltvPeriod: '14 Aylık Ortalama Retainer & Komisyon',
      ltvCac: '141.2x',
      retention: '%84.0',
      retentionLabel: 'Yıllık Sözleşme Devamlılığı',
      churnTitle: '42 İhracatçı Teklif Sonrası Beklemede!',
      churnDesc: 'Son 45 günde Amazon danışmanlık teklifi alıp henüz imzalamayan 42 şirkete AI destekli "2026 Q4 E-İhracat Yol Haritası" göndererek 3 yeni retainer sözleşmesi (₺135.000) kapatılabilir.',
      paths: [
        {
          id: 'ige-path-1',
          path: ['LinkedIn Kurucu Analiz Postu', 'YouTube Amazon FBA Başarı Vaka Videosu', 'B2B Strateji Görüşmesi (Cal.com)', 'Sözleşme & Onboarding'],
          conversions: 24,
          totalRevenue: '₺1.080.000',
          avgDaysToConvert: '11.4 gün',
          aiAttributionShare: { linkedin: '%40', youtube: '%35', calendar: '%25' }
        },
        {
          id: 'ige-path-2',
          path: ['Google Search "Amazon Danışmanlığı Türkiye"', 'Landing Page Vaka Analiz PDF İndirme', 'WhatsApp Kurumsal Tanışma'],
          conversions: 18,
          totalRevenue: '₺810.000',
          avgDaysToConvert: '5.2 gün',
          aiAttributionShare: { google_search: '%55', content_pdf: '%20', whatsapp: '%25' }
        },
        {
          id: 'ige-path-3',
          path: ['Meta B2B Lead Formu', 'AI SDR Ön Eleme Çağrısı', 'Teklif Sunumu & İhale'],
          conversions: 14,
          totalRevenue: '₺630.000',
          avgDaysToConvert: '4.0 gün',
          aiAttributionShare: { meta_b2b: '%60', ai_sdr: '%40' }
        }
      ]
    },
    velvetcouture: {
      cac: '₺185',
      cacDiff: '-%18 (DPA & LAL Kitle)',
      ltv: '₺7.400',
      ltvPeriod: 'Yılda 3.2 Lüks Hakiki Deri Parça',
      ltvCac: '40.0x',
      retention: '%36.2',
      retentionLabel: 'Sadık Moda Müşterisi',
      churnTitle: '418 Müşteri Son 60 Gündür Sipariş Vermedi!',
      churnDesc: 'Deri ceket satın alıp yeni sezon trençkot koleksiyonunu henüz görmeyen 418 müşteriye özel VIP %15 WhatsApp koduyla tahmini ₺92.000 ciro geri kazanılabilir.',
      paths: [
        {
          id: 'vc-path-1',
          path: ['TikTok Moda Fenomeni Reels (UGC)', 'Google Ads PMax Marka Araması', 'İkas Web Mağazası Sipariş'],
          conversions: 248,
          totalRevenue: '₺1.488.000',
          avgDaysToConvert: '3.4 gün',
          aiAttributionShare: { tiktok_ugc: '%50', pmax: '%30', ikas: '%20' }
        },
        {
          id: 'vc-path-2',
          path: ['Instagram Dinamik Katalog (DPA) Reklamı', 'WhatsApp Terk Edilen Sepet Kurtarma', 'Trendyol Mağazasından Satın Alma'],
          conversions: 196,
          totalRevenue: '₺1.176.000',
          avgDaysToConvert: '1.2 gün',
          aiAttributionShare: { instagram_dpa: '%55', whatsapp_recovery: '%45' }
        },
        {
          id: 'vc-path-3',
          path: ['ChatGPT AI Moda Tavsiyesi ("en iyi kadın deri ceket")', 'Google Organik', 'Web Sitesinden Satın Alma'],
          conversions: 84,
          totalRevenue: '₺504.000',
          avgDaysToConvert: '2.1 gün',
          aiAttributionShare: { chatgpt_geo: '%60', organic: '%40' }
        }
      ]
    }
  };

  const currentData = brandData[selectedBrand] || brandData.all;
  const journeyPaths = currentData.paths;

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              İLERİ DÜZEY ANALİTİK
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean (Yerel Hizmet / Koltuk Yıkama)' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds (B2B E-İhracat / Danışmanlık)' :
               selectedBrand === 'velvetcouture' ? 'Velvet Couture (Lüks Giyim & Deri Moda)' :
               'Tüm Müşteri Portföyü (Konsolide)'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-cyan-400" />
            <span>Omni-Channel Attribution (Atıf) & Müşteri LTV Hub&apos;ı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Müşterinin ilk temasından son siparişe kadar tüm yolculuğunu haritalandırın; bütçenizi gerçekten satış getiren ilk temasa göre paylaştırın.
          </p>
        </div>

        {/* Brand Switcher Filter */}
        <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedBrand === 'all'
                ? 'bg-cyan-600 text-white shadow-sm'
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
      </div>

      {/* Metric Cards (CAC vs LTV) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama CAC (Müşteri Edinme)</span>
          <p className="text-2xl font-black text-white mt-1">{currentData.cac}</p>
          <span className="text-xs text-emerald-400 font-bold">{currentData.cacDiff}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Ortalama LTV (Yaşam Boyu Değer)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{currentData.ltv}</p>
          <span className="text-xs text-slate-400">{currentData.ltvPeriod}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">LTV / CAC Oranı (Sağlık Skoru)</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{currentData.ltvCac}</p>
          <span className="text-xs text-emerald-400 font-bold">Mükemmel Kârlılık (&gt;3x ideal)</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Müşteri Sadakati / Devamlılık</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">{currentData.retention}</p>
          <span className="text-xs text-slate-400">{currentData.retentionLabel}</span>
        </div>
      </div>

      {/* Model Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c263c] pb-4">
        <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-xl border border-[#1f293d]">
          <button
            onClick={() => setActiveModel('ige_ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeModel === 'ige_ai' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ İgeAds AI Data-Driven Atıf (Önerilen)
          </button>
          <button
            onClick={() => setActiveModel('first_click')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeModel === 'first_click' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            İlk Tıklama (First Click)
          </button>
          <button
            onClick={() => setActiveModel('last_click')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeModel === 'last_click' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Son Tıklama (Last Click)
          </button>
        </div>

        <span className="text-xs text-slate-400">
          AI Modeli: <strong>Pazaryeri satışını başlatan gizli video reklamları ödüllendirir.</strong>
        </span>
      </div>

      {/* Customer Journey Paths Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-cyan-400" />
          <span>En Çok Ciro Getiren Müşteri Yolculukları (Top Conversion Paths)</span>
        </h2>

        <div className="space-y-4">
          {journeyPaths.map((path) => (
            <div 
              key={path.id}
              className="p-4 rounded-xl bg-[#121828] border border-[#1e2940] hover:border-cyan-500/40 transition-all"
            >
              {/* Path Steps */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {path.path.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      idx === 0 ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                      idx === path.path.length - 1 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                      'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    }`}>
                      {step}
                    </span>
                    {idx < path.path.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Path Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1a2338] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Dönüşüm Adedi</span>
                  <span className="font-bold text-white">{path.conversions} Sipariş</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Üretilen Ciro</span>
                  <span className="font-bold text-emerald-400">{path.totalRevenue}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Ort. Karar Süresi</span>
                  <span className="font-semibold text-slate-300">{path.avgDaysToConvert}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">AI Bütçe Hak Edişi</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {Object.entries(path.aiAttributionShare).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' • ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention & Win-Back AI Alert */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{currentData.churnTitle}</h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              {currentData.churnDesc}
            </p>
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-cyan-600/30 transition-all whitespace-nowrap cursor-pointer">
          Otomatik Sadakat Akışını Tetikle
        </button>
      </div>
    </div>
  );
}
