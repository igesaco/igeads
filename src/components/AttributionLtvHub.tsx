'use client';

import React, { useState, useEffect } from 'react';
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
  const [clients, setClients] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activeModel, setActiveModel] = useState<'ige_ai' | 'first_click' | 'last_click'>('ige_ai');

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

  // When no API or client conversions are ingested yet, journeyPaths is empty
  const journeyPaths: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              İLERİ DÜZEY ANALİTİK
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand !== 'all' ? `${selectedBrand} Atıf Analitiği` : 'Tüm Müşteri Portföyü (Konsolide)'}
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
        <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto gap-1">
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
      </div>

      {/* Metric Cards (CAC vs LTV) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama CAC (Müşteri Edinme)</span>
          <p className="text-2xl font-black text-white mt-1">₺0</p>
          <span className="text-xs text-slate-400">Pazaryeri & Reklam Verisi Bekleniyor</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Ortalama LTV (Yaşam Boyu Değer)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₺0</p>
          <span className="text-xs text-slate-400">12 Aylık Tahmin</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">LTV / CAC Oranı (Sağlık Skoru)</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">0.0x</p>
          <span className="text-xs text-slate-400">Metrikler Bağlantı Sonrası Hesaplanır</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Müşteri Sadakati / Devamlılık</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">%0</p>
          <span className="text-xs text-slate-400">Tekrar Eden Siparişler</span>
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
          AI Modeli: <strong>Pazaryeri satışını başlatan gizli video reklamları ve ilk temasları ödüllendirir.</strong>
        </span>
      </div>

      {/* Customer Journey Paths Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-cyan-400" />
          <span>En Çok Ciro Getiren Müşteri Yolculukları (Top Conversion Paths)</span>
        </h2>

        {journeyPaths.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0e1320]/40">
            <GitMerge className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Henüz Çok Kanallı Atıf Verisi Yok</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
              Meta Pixel, Google Ads ve Trendyol/Amazon sipariş verileri bağlandığında müşterilerinizin reklamdan siparişe tüm temas yolculukları burada otomatik haritalandırılacaktır.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {journeyPaths.map((path) => (
              <div 
                key={path.id}
                className="p-4 rounded-xl bg-[#121828] border border-[#1e2940] hover:border-cyan-500/40 transition-all"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {path.path.map((step: string, idx: number) => (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retention & Win-Back AI Alert */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Sadakat & Ayrılma (Churn) Koruması</h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              Müşteri sipariş geçmişi ve sepet verileri sisteme aktarıldığında, satın alma periyodu geciken müşteriler otonom olarak tespit edilir ve geri kazanım kampanyaları tetiklenir.
            </p>
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-cyan-600/30 transition-all whitespace-nowrap cursor-pointer">
          Otomatik Sadakat Akışını Yapılandır
        </button>
      </div>
    </div>
  );
}
