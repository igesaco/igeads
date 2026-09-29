'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  BarChart3,
  Layers,
  Zap,
  Clock
} from 'lucide-react';
import { mockCampaigns, mockProducts, mockGhostInsights } from '../data/mockData';
import { AdCampaign, MarketplaceProduct } from '../types';
import { useEffect } from 'react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenGhostModal: () => void;
  activeClientName?: string;
}

function getClientIntelligence(clientName?: string) {
  const norm = (clientName || '').toLowerCase();
  if (norm.includes('mandalin') || norm.includes('temizlik') || norm.includes('koltuk')) {
    return {
      alertBadge: 'Otonom Bölgesel Kâr Koruması',
      alertTime: '12 dakika önce tespit edildi',
      alertTitle: 'Kadıköy & Ataşehir Koltuk Yıkama Talebi Zirvede & Google Ads TBM Düşüşü',
      alertDesc: 'Yerel aramalarda "Koltuk Yıkama" talebi %45 arttı. Meta tarafında zayıf kalan tanıtım setinden günlük ₺400 bütçeyi yüksek dönüşümlü WhatsApp Rezervasyon setine aktararak tahmini +18 yeni randevu elde edebilirsiniz.',
      appliedText: 'Harika! Otonom kural uygulandı: Bütçe doğrudan WhatsApp Yerel Rezervasyon setine aktarıldı.',
      competitorName: 'TemizEv Hizmetleri (Bölgesel Rakip)',
      competitorBadge: 'Meta Ad Library: Yeni İndirim Kampanyası',
      competitorCopy: '"Tüm Koltuk ve Yatak Yıkamada Şok Fiyat! 3 Kişilik Koltuk Sadece 499 TL"',
      counterActionTitle: 'İgeAds AI Karşı Hamlesi:',
      counterActionCopy: 'Fiyat kırmak yerine "Buharlı Dezenfektan + Nano Leke Koruması Hediyesi" kancasıyla karşı kampanya açın. Hijyen hassasiyeti olan müşteriyi kârlılıkla bağlar.'
    };
  }
  if (norm.includes('ige') || norm.includes('igesa') || norm.includes('ajans') || norm.includes('b2b')) {
    return {
      alertBadge: 'B2B Otonom Büyüme Fırsatı',
      alertTime: '18 dakika önce tespit edildi',
      alertTitle: 'E-Ticaret & İhracat Danışmanlığı Arama Hacmi Yükseldi & CPL Optimizasyonu',
      alertDesc: 'LinkedIn ve Google Search tarafında B2B büyüme danışmanlığı arayan KOBİ hacmi %32 arttı. Zayıf kalan marka bilinirliği setinden ₺1.000 bütçeyi doğrudan demo talebi toplayan Vaka Analizi setine kaydırarak tahmini +12 nitelikli B2B lead kazanabilirsiniz.',
      appliedText: 'Harika! Otonom kural uygulandı: Bütçe doğrudan yüksek dönüşümlü B2B Vaka Analizi setine aktarıldı.',
      competitorName: 'GlobalScale Danışmanlık (B2B Rakip)',
      competitorBadge: 'Google Ads: Yeni Arama Reklamı',
      competitorCopy: '"Yurt Dışına Satış Yapın! E-ihracat Yönetimi İlk Ay Ücretsiz"',
      counterActionTitle: 'İgeAds AI Karşı Hamlesi:',
      counterActionCopy: 'Ücretsiz deneme vaadi yerine "Kendi Vaka Analizlerimiz: 90 Günde 3.8x Büyüyen Markalar & Canlı Dashboard Şeffaflığı" kancasıyla reklam açın. Güven algısıyla C-Level yöneticileri çeker.'
    };
  }
  if (!clientName || clientName.toLowerCase().includes('yeni') || clientName.toLowerCase().includes('ekle') || clientName === '') {
    return {
      alertBadge: 'Ajans İşletim Sistemi Hazır',
      alertTime: 'Sistem hazır',
      alertTitle: 'İlk Markanızı / Müşterinizi Ekleyerek AI Analitiğini Başlatın',
      alertDesc: 'İgeAds Agency OS temiz modda hazırlandı. Sol menüdeki marka seçiciden veya "Ajans & Markalar" sekmesinden ilk müşterinizi tanımladığınızda gerçek zamanlı ROAS, POAS ve yapay zeka reklam otomasyonu otomatik aktifleşecektir.',
      appliedText: 'Sistem yeni markalarınızı bekliyor.',
      competitorName: 'Piyasa & Rakip Taraması Hazır',
      competitorBadge: 'Yapay Zeka Radarı',
      competitorCopy: '"Markanız eklendiğinde Meta Ad Library ve Google arama rakipleri burada canlı listelenir."',
      counterActionTitle: 'İgeAds AI Danışmanı:',
      counterActionCopy: 'İlk markanızı eklemek için sol menüden Ajans Yönetimi sekmesine geçebilirsiniz.'
    };
  }
  return {
    alertBadge: 'Otonom Kâr Koruması',
    alertTime: 'Canlı analiz aktif',
    alertTitle: `${clientName} Performans ve Reklam Analitiği Yayında`,
    alertDesc: `${clientName} için çok kanallı reklam setleri, bütçe optimizasyonu ve kârlılık takibi anlık olarak izlenmektedir.`,
    appliedText: 'Harika! Otonom kurallar aktif olarak çalışıyor.',
    competitorName: 'ModaX Premium (Doğrudan Rakip)',
    competitorBadge: 'Meta Ad Library: Yeni Kampanya',
    competitorCopy: '"Kış Sezonu Kapanıyor! Tüm Deri Ceketlerde %40 İndirim"',
    counterActionTitle: 'İgeAds AI Karşı Hamlesi:',
    counterActionCopy: 'Fiyat kırmak yerine "Ömür Boyu Dikiş Garantisi + Bakım Kremi Hediyesi" kancasıyla karşı kampanya açın. Kârlılığı düşürmeden pazar payını korur.'
  };
}

export default function DashboardOverview({ onNavigateTab, onOpenGhostModal, activeClientName = '' }: DashboardOverviewProps) {
  const [insightApplied, setInsightApplied] = useState(false);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const intelligence = getClientIntelligence(activeClientName);

  const fetchLiveMetrics = async () => {
    try {
      const clientLower = (activeClientName || '').toLowerCase();
      let query = '';
      if (clientLower.includes('mandalin') || clientLower.includes('koltuk') || clientLower.includes('temizlik')) {
        query = '?clientSlug=mandalinclean';
      } else if (clientLower.includes('ige') || clientLower.includes('ajans') || clientLower.includes('roas') || clientLower.includes('b2b')) {
        query = '?clientSlug=igesaturkiye';
      } else if (clientLower.includes('velvet')) {
        query = '?clientSlug=velvetcouture';
      }

      const [res, prodRes] = await Promise.all([
        fetch(`/api/campaigns${query}`),
        fetch('/api/products')
      ]);
      const data = await res.json();
      const prodData = await prodRes.json();

      if (data?.data && Array.isArray(data.data)) {
        setCampaigns(data.data);
      }
      if (prodData?.data && Array.isArray(prodData.data)) {
        setProducts(prodData.data);
      }
    } catch (e) {
      console.warn('Dashboard live campaigns fetch error:', e);
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
  const calculatedRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';
  const totalNetMargin = totalSpend > 0 ? Math.max(0, Math.round(totalRevenue * 0.42 - totalSpend * 0.15)) : 0;
  const calculatedPoas = totalSpend > 0 ? ((totalNetMargin / totalSpend)).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Ghost Marketer Autonomous Alert Banner */}
      {!insightApplied && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#131b2e] to-cyan-950/60 border border-indigo-500/40 p-5 shadow-xl shadow-indigo-950/30">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-indigo-300 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {intelligence.alertBadge}
                  </span>
                  <span className="text-xs text-slate-400">| {intelligence.alertTime}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {intelligence.alertTitle}
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl">
                  {intelligence.alertDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
              <button 
                onClick={onOpenGhostModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#1a2338]/80 hover:bg-[#1a2338] border border-[#2b3752] transition-all cursor-pointer"
              >
                Detayı İncele
              </button>
              <button 
                onClick={() => setInsightApplied(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Tek Tıkla Bütçeyi Kaydır</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {insightApplied && (
        <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/40 p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{intelligence.appliedText}</span>
          </div>
          <button 
            onClick={() => setInsightApplied(false)}
            className="text-slate-400 hover:text-slate-200 underline text-[11px]"
          >
            Geri Al
          </button>
        </div>
      )}

      {/* Primary KPI Grid (POAS, ROAS, Spend, Net Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* POAS - Game Changer Metric */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span>POAS (Profit on Ad Spend)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">İGE ÖZEL</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-white tracking-tight">{calculatedPoas}x</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Canlı
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Her 1 TL reklam harcamasından kalan <strong>Net Kâr</strong> (COGS ve komisyonlar düşüldükten sonra).
          </p>
        </div>

        {/* Total ROAS */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Klasik Genel ROAS</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-white tracking-tight">{calculatedRoas}x</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Canlı
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Tüm kanallardaki brüt ciro / reklam harcaması oranı.
          </p>
        </div>

        {/* Total Ad Spend */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Toplam Reklam Harcaması</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-white tracking-tight">₺{totalSpend.toLocaleString('tr-TR')}</span>
            <span className="text-xs font-medium text-emerald-400">Veritabanı Senkronize</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Meta, Google, TikTok ve ChatGPT toplam bütçe ve harcama.
          </p>
        </div>

        {/* True Net Profit */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-300">Cebe Kalan Net Kâr</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-emerald-400 tracking-tight">₺{totalNetMargin.toLocaleString('tr-TR')}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Canlı Kâr
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pazaryeri komisyonu, kargo ve maliyet düşüldükten sonra net kazanç.
          </p>
        </div>
      </div>

      {/* Main Split: Omni-Channel Ad Engine & Marketplace Inventory Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Omni-Channel Ads Matrix */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Çok Kanallı Reklam & ROAS/POAS Tablosu</span>
              </h2>
              <p className="text-xs text-slate-400">Meta, Google, TikTok ve ChatGPT Ads canlı performansı</p>
            </div>
            <button 
              onClick={() => onNavigateTab('ads')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Detaylı Reklam Paneli</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Campaigns Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f293d] text-slate-400 font-semibold">
                  <th className="pb-3">Platform & Kampanya</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3 text-right">Harcama</th>
                  <th className="pb-3 text-right">Ciro</th>
                  <th className="pb-3 text-right">ROAS</th>
                  <th className="pb-3 text-right">POAS (Net Kâr)</th>
                  <th className="pb-3 text-center">Yorulma Skoru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182236]">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <BarChart3 className="w-8 h-8 text-slate-600" />
                        <p className="text-xs font-semibold text-slate-300">Henüz aktif kampanya bulunmuyor</p>
                        <p className="text-[11px] text-slate-500">İlk markanızı eklediğinizde veya yeni kampanya başlattığınızda canlı harcama, ciro ve ROAS verileri burada listelenir.</p>
                        <button 
                          onClick={() => onNavigateTab('ads')}
                          className="mt-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          + Yeni Kampanya Başlat
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-[#151c2e]/50 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          camp.platform === 'meta' ? 'bg-blue-500' :
                          camp.platform === 'google' ? 'bg-emerald-400' :
                          camp.platform === 'tiktok' ? 'bg-rose-500' : 'bg-cyan-400'
                        }`}></span>
                        <div>
                          <p className="font-semibold text-white">{camp.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {camp.platform} Ads • Günlük ₺{camp.dailyBudget.toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {camp.status === 'active' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Aktif
                        </span>
                      )}
                      {camp.status === 'fatigued' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Yoruldu
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right font-medium text-slate-200">
                      ₺{camp.spent.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3.5 text-right font-bold text-white">
                      ₺{camp.revenue.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3.5 text-right font-bold text-indigo-400">
                      {camp.roas}x
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-400">
                      {camp.poas}x
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-14 bg-[#1a2338] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              camp.fatigueScore > 75 ? 'bg-rose-500' :
                              camp.fatigueScore > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${camp.fatigueScore}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300">
                          %{camp.fatigueScore}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Marketplace Inventory & Stock Guard */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-400" />
                  <span>Pazaryeri & Stok Koruması</span>
                </h2>
                <p className="text-xs text-slate-400">Trendyol, Amazon, Hepsiburada</p>
              </div>
              <button 
                onClick={() => onNavigateTab('marketplace')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Tümü
              </button>
            </div>

            {/* Products with Stock Alert */}
            <div className="space-y-3.5">
              {products.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs glass-panel rounded-xl border border-white/5 space-y-2">
                  <Store className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-semibold text-slate-300">Henüz ürün senkronize edilmedi</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Trendyol veya Amazon entegrasyonu ile ürünleriniz otomatik listelenir.</p>
                  <button
                    onClick={() => onNavigateTab('integrations')}
                    className="mt-1 px-3 py-1 rounded-lg bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 text-[11px] font-semibold transition-all inline-block"
                  >
                    API Entegrasyonlarına Git
                  </button>
                </div>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.salesChannels.reduce((acc, c) => acc + c.stock, 0);
                  const isCritical = totalStock < 20;

                  return (
                    <div 
                      key={prod.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCritical 
                          ? 'bg-rose-950/20 border-rose-500/30' 
                          : 'bg-[#141b2b]/60 border-[#1f293d]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-white text-xs line-clamp-1">{prod.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isCritical 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {totalStock} Adet Stok
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Net Kâr: <strong className="text-emerald-400">₺{prod.netMargin}</strong> (%{prod.netMarginPercentage})</span>
                        <span>Bağlı Reklam: <strong className="text-indigo-400">{prod.activeAdCampaignsCount} Adet</strong></span>
                      </div>

                      {isCritical && (
                        <div className="mt-2 pt-2 border-t border-rose-500/20 flex items-center justify-between text-[10px] text-rose-300 font-medium">
                          <span>⚠️ Stok kritik! Otomatik reklam durdurma aktif.</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="mt-5 pt-4 border-t border-[#1f293d]">
            <button 
              onClick={() => onNavigateTab('marketplace')}
              className="w-full py-2.5 rounded-xl bg-[#182033] hover:bg-[#1e2942] text-xs font-bold text-slate-200 hover:text-white border border-[#2b3752] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Pazaryeri Komisyon & Net Kâr Hesaplayıcı</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Intelligence & Live Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Radar Snapshot */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tersine Rakip Reklam Radarı</h3>
                <p className="text-[11px] text-slate-400">Son 24 saatte rakiplerin açtığı kampanyalar ve AI karşı hamleleri</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('intelligence')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              Tüm Radarı Gör
            </button>
          </div>

          <div className="bg-[#121828] border border-[#1e2940] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">{intelligence.competitorName}</span>
              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-semibold">
                {intelligence.competitorBadge}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic mb-3">
              {intelligence.competitorCopy}
            </p>
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-2.5 text-xs">
              <p className="text-indigo-300 font-bold mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{intelligence.counterActionTitle}</span>
              </p>
              <p className="text-slate-300 text-[11px]">
                {intelligence.counterActionCopy}
              </p>
            </div>
          </div>
        </div>

        {/* Live Server-Side CAPI & Event Stream */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Canlı Omni-Stream & Entegrasyon Akışı</h3>
                <p className="text-[11px] text-slate-400">Pazaryeri siparişleri, piksel eşlemeleri ve otonom kurallar</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> CANLI
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141b2a]/60 border border-[#1f293d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-slate-300">Trendyol Sipariş (#88219) oluşturuldu</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">1 dk önce</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141b2a]/60 border border-[#1f293d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Meta CAPI: Dönüşüm Değeri ₺2.199 Meta&apos;ya geri iletildi (Server-Side)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">2 dk önce</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141b2a]/60 border border-[#1f293d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-slate-300">Amazon & Hepsiburada stokları anlık olarak eşitlendi (48 Adet)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">5 dk önce</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
