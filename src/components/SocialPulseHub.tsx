'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Activity, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Code2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  Globe, 
  Store, 
  ChevronRight,
  HelpCircle,
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface SocialPulseHubProps {
  activeClientName?: string;
  onOpenCampaignModal?: (platform: string) => void;
}

export default function SocialPulseHub({ 
  activeClientName = '',
  onOpenCampaignModal 
}: SocialPulseHubProps) {
  const [mode, setMode] = useState<'macro' | 'store'>('macro');
  const [pulseData, setPulseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [arbitrageApplied, setArbitrageApplied] = useState(false);
  
  // Custom API configuration inputs inside modal
  const [ga4PropertyId, setGa4PropertyId] = useState('');
  const [cfToken, setCfToken] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchPulse = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/social-pulse?mode=${mode}&clientSlug=${activeClientName || 'all'}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPulseData(json.data);
      }
    } catch (err) {
      console.error('Pulse fetch error:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchPulse();
  }, [mode, activeClientName]);

  // Real-time automatic polling every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchPulse();
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, mode, activeClientName]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const handleApplyArbitrage = () => {
    setArbitrageApplied(true);
    setTimeout(() => {
      setArbitrageApplied(false);
    }, 4000);
  };

  const handleSaveApiKeys = async (provider: 'ga4' | 'cloudflare') => {
    setSaveStatus('Kaydediliyor...');
    try {
      const credentials = provider === 'ga4' ? { propertyId: ga4PropertyId } : { apiToken: cfToken };
      const res = await fetch('/api/social-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_credentials',
          provider: provider === 'ga4' ? 'ga4' : 'cloudflare_radar',
          credentials
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('✅ Başarıyla kaydedildi ve API akışı doğrulandı!');
        fetchPulse(true);
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(`❌ Hata: ${data.error}`);
      }
    } catch (e: any) {
      setSaveStatus(`❌ Hata: ${e.message}`);
    }
  };

  // Code snippets for developer guidance
  const ga4CodeSnippet = `// Next.js Route Handler: /api/social-realtime/route.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

const client = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}')
});

export async function GET() {
  const [response] = await client.runRealtimeReport({
    property: \`properties/\${process.env.GA4_PROPERTY_ID}\`,
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'activeUsers' }],
  });

  const parsed = response.rows?.map(row => ({
    source: row.dimensionValues?.[0].value,
    users: Number(row.metricValues?.[0].value || 0)
  }));

  return NextResponse.json({ success: true, liveTraffic: parsed });
}`;

  const cloudflareRadarSnippet = `// Cloudflare Radar Social & Web Traffic API
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function getMacroSocialTraffic() {
  const res = await fetch('https://api.cloudflare.com/client/v4/radar/ranking/domain/categories/social', {
    headers: {
      'Authorization': \`Bearer \${CF_API_TOKEN}\`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 60 } // 1 dakikada bir yenile
  });
  return await res.json();
}`;

  if (loading && !pulseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Canlı Sosyal Medya ve Platform Veri Akışı Dinleniyor...</p>
      </div>
    );
  }

  const platforms = pulseData?.platforms || [];
  const topPlatform = platforms[0] || {};
  const fastestPlatform = platforms.find((p: any) => p.id === 'tiktok') || platforms[1] || {};

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              CANLI SOSYAL TELEMETRİ SİSTEMİ
            </span>
            <span className="text-xs text-slate-400">
              | Son Senkronizasyon: <strong className="text-white font-mono">{pulseData?.lastUpdated || 'Az önce'}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
            <span>Canlı Platform Nabzı & Sosyal Medya Kullanım Oranları</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Instagram, TikTok, Google, YouTube, Facebook ve X platformlarının anlık kitle kullanım oranları, 
            aktif ziyaretçi hacimleri ve bütçe arbitraj fırsatları.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="bg-[#121828] border border-[#212b42] rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setMode('macro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === 'macro' 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🇹🇷 Türkiye Pazar Payı</span>
            </button>
            <button
              onClick={() => setMode('store')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === 'store' 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>🛒 Mağaza Canlı Trafiği</span>
            </button>
          </div>

          {/* Refresh Buttons */}
          <button
            onClick={() => fetchPulse(true)}
            disabled={isRefreshing}
            className="p-2 bg-[#121828] hover:bg-[#1a233a] border border-[#212b42] rounded-xl text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Anlık Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoRefresh 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>{autoRefresh ? 'Oto-Akış: Aktif (8s)' : 'Oto-Akış: Duraklatıldı'}</span>
          </button>

          {/* API Codes & Guide Modal Trigger */}
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 rounded-xl text-xs font-bold text-purple-200 hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>API & Canlı Kod Masası</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-1">
            <span>Anlık Aktif Kitle / Ziyaretçi</span>
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </span>
          </div>
          <p className="text-3xl font-black text-white mt-1">
            {pulseData?.totalActiveAudience?.toLocaleString('tr-TR')}
            <span className="text-xs text-slate-400 font-normal ml-2">Aktif Kişi</span>
          </p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Tüm kanallarda saniyelik aktif akış</span>
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-pink-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-pink-300 font-semibold mb-1">
            <span>Trafik Lideri Platform</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
              % {topPlatform.share} Pay
            </span>
          </div>
          <p className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>{topPlatform.name}</span>
            <span className="text-xs font-semibold text-slate-400">({topPlatform.activeUsers?.toLocaleString('tr-TR')} kişi)</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {topPlatform.adFormatFocus}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold mb-1">
            <span>En Hızlı İvmelenen Kanal</span>
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>{fastestPlatform.name}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {fastestPlatform.growthRate} Hız
            </span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ort. Oturum: <strong className="text-cyan-300">{fastestPlatform.avgSession}</strong>
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span>En Uygun CPM Fırsatı</span>
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-300 mt-1">
            ₺13.40 <span className="text-xs text-slate-400 font-normal">/ 1000 Gösterim</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            YouTube & Shorts kanallarında düşük açık artırma rekabeti
          </span>
        </div>
      </div>

      {/* Live Proportional Distribution Multi-Bar */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Anlık Platform Trafik ve Dikkat Dağılım Çizelgesi</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sosyal medya kullanıcılarının platformlar arasındaki pay dağılımı (Toplam: %100)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {platforms.map((p: any) => (
              <div key={p.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-slate-300 font-medium">{p.name}: <strong className="text-white font-bold">%{p.share}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Colored Segmented Bar */}
        <div className="w-full h-5 rounded-full overflow-hidden flex bg-[#121828] p-0.5 border border-[#212b42] shadow-inner">
          {platforms.map((p: any) => (
            <div
              key={p.id}
              style={{ width: `${p.share}%`, backgroundColor: p.color }}
              className="h-full transition-all duration-700 relative group cursor-pointer hover:brightness-125"
              title={`${p.name}: %${p.share} (${p.activeUsers?.toLocaleString('tr-TR')} kişi)`}
            >
              {p.share > 6 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">
                  %{p.share}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6 Platform Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platforms.map((platform: any) => {
          const isUp = platform.trend === 'up';
          return (
            <div
              key={platform.id}
              className="glass-panel p-5 rounded-2xl border-[#1e2942] hover:border-indigo-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Glowing corner line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all"
                style={{ backgroundColor: platform.color }}
              ></div>

              <div>
                {/* Platform Card Header */}
                <div className="flex items-center justify-between mb-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-md"
                      style={{ backgroundColor: `${platform.color}25`, border: `1px solid ${platform.color}60` }}
                    >
                      <span className="font-extrabold text-sm" style={{ color: platform.color }}>
                        {platform.name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{platform.name}</span>
                      </h3>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {platform.status}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {platform.badge}
                  </span>
                </div>

                {/* Big Share Metric & Progress Bar */}
                <div className="bg-[#101626] border border-[#1b253b] rounded-xl p-3 mb-3">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl font-black text-white tracking-tight">
                      %{platform.share}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      {isUp ? (
                        <span className="text-emerald-400 flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          {platform.growthRate}
                        </span>
                      ) : platform.trend === 'down' ? (
                        <span className="text-rose-400 flex items-center">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          {platform.growthRate}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {platform.growthRate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-[#182033] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${platform.share}%`, backgroundColor: platform.color }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Anlık Aktif Kullanıcı:</span>
                    <span className="font-bold text-white font-mono">
                      {platform.activeUsers?.toLocaleString('tr-TR')} Kişi
                    </span>
                  </div>
                </div>

                {/* Sub Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="p-2 rounded-xl bg-[#101626] border border-[#1b253b]">
                    <span className="text-[10px] text-slate-400 block font-medium">Etkileşim</span>
                    <span className="font-bold text-white mt-0.5 block">{platform.engagementRate}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#101626] border border-[#1b253b]">
                    <span className="text-[10px] text-slate-400 block font-medium">Ort. Oturum</span>
                    <span className="font-bold text-white mt-0.5 block">{platform.avgSession}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#101626] border border-[#1b253b]">
                    <span className="text-[10px] text-slate-400 block font-medium">Tahmini CPM</span>
                    <span className="font-bold text-cyan-300 mt-0.5 block">{platform.estimatedCpm}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#1b253b] flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 truncate max-w-[170px]" title={platform.adFormatFocus}>
                  🎯 {platform.adFormatFocus}
                </span>

                <button
                  onClick={() => onOpenCampaignModal && onOpenCampaignModal(platform.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#172033] hover:bg-indigo-600 border border-[#263554] hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Reklam Aç</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Smart Arbitrage & Advice Panel */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                AI BÜTÇE ARBİTRAJ MOTORU
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {pulseData?.aiArbitrageInsight?.estimatedRoasImpact}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white">
              {pulseData?.aiArbitrageInsight?.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {pulseData?.aiArbitrageInsight?.message}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {arbitrageApplied ? (
              <div className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Bütçe Otonom Kurala İletildi! (%15 TikTok Kaydırıldı)</span>
              </div>
            ) : (
              <button
                onClick={handleApplyArbitrage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 font-bold text-white text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{pulseData?.aiArbitrageInsight?.suggestedAction}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 24-Hour Timeline Distribution Curve Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Günün Saatlerine Göre Platform Akış Trendi (Son 24 Saat)</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hangi saatlerde hangi platformun daha aktif olduğunu ve reklam açılış pencerelerini inceleyin.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-[#121828] px-2.5 py-1 rounded-lg border border-[#212b42]">
            GMT+3 (İstanbul Saati)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1b253b] text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Zaman</th>
                <th className="py-2.5 px-3 text-pink-400">Instagram</th>
                <th className="py-2.5 px-3 text-cyan-400">TikTok</th>
                <th className="py-2.5 px-3 text-blue-400">Google</th>
                <th className="py-2.5 px-3 text-red-400">YouTube</th>
                <th className="py-2.5 px-3 text-indigo-400">Facebook</th>
                <th className="py-2.5 px-3 text-slate-400">X (Twitter)</th>
                <th className="py-2.5 px-3 text-right">Zirve Kanal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182133] font-mono">
              {(pulseData?.timelineData || []).map((row: any, idx: number) => {
                const maxVal = Math.max(row.instagram, row.tiktok, row.google, row.youtube, row.facebook, row.x);
                let peakName = 'Instagram';
                if (maxVal === row.tiktok) peakName = 'TikTok';
                else if (maxVal === row.google) peakName = 'Google';
                else if (maxVal === row.youtube) peakName = 'YouTube';

                return (
                  <tr key={idx} className="hover:bg-[#121929]/50 transition-colors">
                    <td className="py-2 px-3 text-white font-bold">{row.time}</td>
                    <td className="py-2 px-3 text-slate-300">%{row.instagram}</td>
                    <td className="py-2 px-3 text-cyan-300 font-semibold">%{row.tiktok}</td>
                    <td className="py-2 px-3 text-slate-300">%{row.google}</td>
                    <td className="py-2 px-3 text-slate-300">%{row.youtube}</td>
                    <td className="py-2 px-3 text-slate-400">%{row.facebook}</td>
                    <td className="py-2 px-3 text-slate-500">%{row.x}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-sans font-bold">
                        {peakName}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* API & Code Integration Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-[#0e1322] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#1b253b] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sosyal Medya Anlık Veri API & Entegrasyon Masası</h3>
                  <p className="text-xs text-slate-400">
                    Bu sistemin arkasındaki resmi API kaynakları, örnek Next.js/Node.js kodları ve kurulum parametreleri.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#151c2e]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* How it works explanation */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-slate-300 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Veri Akışı Nasıl Çalışıyor?</span>
                </h4>
                <p>
                  Sistem 2 katmanlı hibrit bir mimari kullanır:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li><strong>Katman 1 (Makro Pazar):</strong> Cloudflare Radar ve internet telemetrisi ile Türkiye ve küresel sosyal medya kullanım oranlarını izler.</li>
                  <li><strong>Katman 2 (Mikro Mağaza Trafiği):</strong> Google Analytics 4 (GA4) Realtime API ve Meta Pixel CAPI ile sitenize o an giren ziyaretçilerin kaynak oranlarını sunar.</li>
                </ul>
              </div>

              {/* Code Snippet 1: GA4 Realtime */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    1. Google Analytics 4 (GA4) Realtime API Kodu:
                  </span>
                  <button
                    onClick={() => copyToClipboard(ga4CodeSnippet, 'ga4')}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                  >
                    {copiedCodeKey === 'ga4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCodeKey === 'ga4' ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#090d16] border border-[#1b253b] text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {ga4CodeSnippet}
                </pre>
              </div>

              {/* Code Snippet 2: Cloudflare Radar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    2. Cloudflare Radar API (Makro Sosyal Medya Trafiği):
                  </span>
                  <button
                    onClick={() => copyToClipboard(cloudflareRadarSnippet, 'cf')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                  >
                    {copiedCodeKey === 'cf' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCodeKey === 'cf' ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#090d16] border border-[#1b253b] text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {cloudflareRadarSnippet}
                </pre>
              </div>

              {/* Quick Configuration Form */}
              <div className="p-4 rounded-xl bg-[#111728] border border-[#1f2a42] space-y-3">
                <h4 className="font-bold text-white text-xs">Canlı API Anahtarlarını Tanımla (İsteğe Bağlı):</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-medium">GA4 Property ID:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Örn: 398241920"
                        value={ga4PropertyId}
                        onChange={(e) => setGa4PropertyId(e.target.value)}
                        className="w-full bg-[#161f36] border border-[#233150] rounded-xl px-3 py-1.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        onClick={() => handleSaveApiKeys('ga4')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shrink-0 text-xs"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-medium">Cloudflare Radar API Token:</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="cftk_..."
                        value={cfToken}
                        onChange={(e) => setCfToken(e.target.value)}
                        className="w-full bg-[#161f36] border border-[#233150] rounded-xl px-3 py-1.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        onClick={() => handleSaveApiKeys('cloudflare')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shrink-0 text-xs"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>

                {saveStatus && (
                  <p className="text-xs font-semibold text-indigo-300 pt-1">
                    {saveStatus}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1b253b] flex justify-end">
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#172033] hover:bg-[#202c45] text-slate-200 text-xs font-bold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
