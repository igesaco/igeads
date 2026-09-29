'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Calendar as CalendarIcon, 
  Target, 
  Copy, 
  Check, 
  Video, 
  Zap, 
  Clock, 
  Flame, 
  Lightbulb,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { mockCompetitorAds, mockContentCalendar } from '../data/mockData';
import { CompetitorAd, ContentCalendarItem } from '../types';

export default function IntelligenceHub() {
  const [activeSubTab, setActiveSubTab] = useState<'competitors' | 'calendar' | 'creator'>('competitors');
  const [competitorQuery, setCompetitorQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isSearchingCompetitor, setIsSearchingCompetitor] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorAd[]>(mockCompetitorAds);

  // AI Content Generator State
  const [genProduct, setGenProduct] = useState('Mandalin Clean Koltuk & Ev Temizliği');
  const [genVibe, setGenVibe] = useState('Merak & Lüks Hissi');
  const [isGeneratingCreator, setIsGeneratingCreator] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    hook: string;
    script: string[];
    cta: string;
    visualPrompt: string;
  } | null>({
    hook: '"Evinizi temizlemek için hafta sonunuzu harcamayı bırakın. Mandalin Clean ile 2 saatte otel konforu."',
    script: [
      '0-3 sn: Koltuktaki görünmeyen toz ve alerjenlerin mikroskobik/yakın çekimi.',
      '3-8 sn: Profesyonel vakumlu yıkama makinesinin suyu çekerken çıkardığı tatmin edici an.',
      '8-15 sn: Kuruyan kumaşın pırıl pırıl dokusu ve evin ferah havası.',
      '15-20 sn: Aynı gün randevu ve müşteri memnuniyet garantisi bildirimi.'
    ],
    cta: 'Bugüne özel %20 tanışma indirimiyle hemen randevu oluştur.',
    visualPrompt: 'Cinematic hyper-realistic commercial of deep carpet and upholstery cleaning, water extraction satisfying moment, sparkling clean living room, warm daylight, 8k resolution.'
  });

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSearchCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorQuery.trim()) return;
    const targetBrand = competitorQuery.trim();
    setIsSearchingCompetitor(true);

    try {
      const res = await fetch('/api/competitors/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: targetBrand })
      });
      const json = await res.json();
      if (json?.data) {
        setCompetitors(prev => [json.data, ...prev]);
      }
    } catch (err) {
      console.error('Competitor analysis error:', err);
    } finally {
      setIsSearchingCompetitor(false);
      setCompetitorQuery('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI İstihbarat & İçerik Takvimi & Rakip Radarı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Rakiplerin reklam kütüphanelerini 7/24 izleyin, anında AI karşı hamlesi üretin ve 30 günlük kanca/senaryo takviminizi yönetin.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-xl border border-[#1f293d]">
          <button
            onClick={() => setActiveSubTab('competitors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'competitors' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tersine Rakip Radarı
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'calendar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Günlük İçerik & Reklam Takvimi
          </button>
          <button
            onClick={() => setActiveSubTab('creator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'creator' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Senaryo & Görsel Stüdyosu
          </button>
        </div>
      </div>

      {/* 1. Tersine Rakip Reklam Radarı */}
      {activeSubTab === 'competitors' && (
        <div className="space-y-5">
          {/* Search / Add Competitor Radar Bar */}
          <div className="glass-panel p-4 rounded-2xl">
            <form onSubmit={handleSearchCompetitor} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={competitorQuery}
                  onChange={(e) => setCompetitorQuery(e.target.value)}
                  placeholder="Rakip Marka Adı, Instagram Kullanıcı Adı veya Web Sitesi (Örn: LüksGiyim, TrendyTrend)..."
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingCompetitor}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
              >
                <Zap className={`w-3.5 h-3.5 ${isSearchingCompetitor ? 'animate-spin' : ''}`} />
                <span>{isSearchingCompetitor ? 'Ad Library Taranıyor...' : 'Radara Ekle & AI Analizi Çıkar'}</span>
              </button>
            </form>
          </div>

          {/* Competitor Ad Cards with AI Counter Campaign */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {competitors.map((comp) => (
              <div 
                key={comp.id} 
                className="glass-panel rounded-2xl p-5 border-[#1f293d] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{comp.brand}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                          comp.platform === 'meta' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {comp.platform} Ads
                        </span>
                        {comp.detectedSector && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {comp.detectedSector}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        İlk tespit: <strong className="text-slate-300">{comp.firstSeen}</strong> • Tahmini Harcama: <strong className="text-amber-400">{comp.estimatedSpend}</strong>
                      </p>
                    </div>

                    <span className="text-[10px] px-2 py-1 rounded bg-[#182033] text-slate-300 border border-[#2b3752] font-semibold">
                      {comp.format}
                    </span>
                  </div>

                  {/* Intercepted Ad Preview */}
                  <div className="bg-[#101422] p-3.5 rounded-xl border border-[#1a2338] mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Rakibin Yayındaki Reklamı:
                    </span>
                    <p className="text-xs font-semibold text-slate-200 italic mb-1">
                      {comp.headline}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {comp.body}
                    </p>
                  </div>

                  {/* AI Counter-Strategy Box (Game Changer) */}
                  <div className="bg-gradient-to-br from-purple-950/40 via-[#151c2e] to-indigo-950/40 p-4 rounded-xl border border-purple-500/30 mb-2">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>İgeAds AI Karşı Hamle Stratejisi:</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Önerilen Kanca (Hook):</span>
                        <p className="text-slate-100 font-medium italic">&quot;{comp.aiCounterStrategy.hook}&quot;</p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] block">Değer Teklifi Farklılaşması:</span>
                        <p className="text-slate-300 text-[11px]">{comp.aiCounterStrategy.valueProposition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1a2338] mt-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {comp.aiCounterStrategy.suggestedCampaign}
                  </span>
                  <div className="flex items-center gap-2">
                    {comp.metaAdLibraryUrl && (
                      <a
                        href={comp.metaAdLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#141b2a] hover:bg-[#1a2338] text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
                      >
                        <span>Meta Ad Library&apos;de Canlı Gör</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-sm cursor-pointer flex items-center gap-1">
                      <span>Karşı Kampanyayı Başlat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 30 Günlük İçerik & Reklam Takvimi */}
      {activeSubTab === 'calendar' && (
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-400" />
                <span>AI Tarafından Oluşturulmuş Dinamik İçerik Takvimi</span>
              </h2>
              <p className="text-xs text-slate-400">
                Hedef kitlenizi satın almaya yönlendiren her gün için hazır kancalar, Reels ve PMax kurguları
              </p>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gelecek Ayı Yeniden Planla</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockContentCalendar.map((item) => (
              <div 
                key={item.id}
                className="bg-[#121624] border border-[#1e273b] hover:border-purple-500/40 p-4 rounded-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-white">Gün {item.day}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 mb-2">
                    {item.platform}
                  </span>

                  <h4 className="text-xs font-bold text-white mb-2 line-clamp-1">{item.title}</h4>

                  <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338] mb-3">
                    <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Vurucu Kanca (İlk 2 Sn):</span>
                    <p className="text-xs text-purple-200 italic line-clamp-2">{item.hook}</p>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 mb-2">
                    <strong>Kurgu:</strong> {item.scriptOutline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1a2338]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">{item.status === 'scheduled' ? '🟢 Planlandı' : '🟡 Yayına Hazır'}</span>
                    <button 
                      onClick={() => copyText(`${item.hook}\n\nKurgu: ${item.scriptOutline}\n\nCTA: ${item.callToAction}`)}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold text-xs cursor-pointer"
                    >
                      {copiedItem ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Senaryoyu Al</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AI Senaryo & Görsel Stüdyosu */}
      {activeSubTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Yapay Zeka Prompt & Kurgu Motoru</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Hedef Ürün:</label>
              <input 
                type="text"
                value={genProduct}
                onChange={(e) => setGenProduct(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Psikolojik Tetikleyici & Ton:</label>
              <select 
                value={genVibe}
                onChange={(e) => setGenVibe(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Merak & Lüks Hissi">✨ Merak & Lüks Hissi</option>
                <option value="Aciliyet & Fırsatı Kaçırma (FOMO)">🔥 Aciliyet & Fırsatı Kaçırma (FOMO)</option>
                <option value="Karşılaştırma & Rakip Ezme">⚔️ Karşılaştırma & Mantıksal Kanıt</option>
                <option value="Samimi Paketleme & ASMR">📦 Samimi Paketleme & Kamera Arkası</option>
              </select>
            </div>

            <button 
              disabled={isGeneratingCreator}
              onClick={async () => {
                setIsGeneratingCreator(true);
                try {
                  const res = await fetch('/api/creative-generator', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      productName: genProduct,
                      platform: 'TikTok / Instagram Reels (9:16)',
                      tone: genVibe
                    })
                  });
                  const json = await res.json();
                  if (json?.data) {
                    const hooks = Array.isArray(json.data.hooks) ? json.data.hooks : [json.data.headline || ''];
                    setGeneratedResult({
                      hook: hooks[0] || `"${genProduct} ile tanışın!"`,
                      script: [
                        `0-3 sn: Dikkat çekici açılış: ${hooks[0] || genProduct}`,
                        `3-8 sn: ${json.data.primaryText ? json.data.primaryText.slice(0, 80) + '...' : 'Ürün detayları ve fark yaratan çözümler.'}`,
                        `8-14 sn: Müşteri memnuniyet kanıtı ve kaliteli uygulama anı.`,
                        `14-20 sn: Hızlı harekete geçirici çağrı ve teklif.`
                      ],
                      cta: json.data.cta || 'Hemen Keşfet / Randevu Al',
                      visualPrompt: `High-end commercial cinematic shot of ${genProduct}, professional soft lighting, aesthetic framing, ultra photorealistic 8k.`
                    });
                  }
                } catch (e) {
                  console.error('Creator generation failed:', e);
                } finally {
                  setIsGeneratingCreator(false);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingCreator ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCreator ? 'Yapay Zeka Üretiyor...' : 'Senaryo ve Görsel Promptu Üret'}</span>
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            {generatedResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#1a2338] pb-3">
                  <span className="text-xs font-bold text-white">Yapay Zeka Tarafından Üretilen Reklam Senaryosu</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Viral Potansiyel: Yüksek
                  </span>
                </div>

                {/* Hook */}
                <div className="bg-[#121828] p-3.5 rounded-xl border border-indigo-500/30">
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-1">
                    Kanca (Reels / TikTok İlk 2 Saniye):
                  </span>
                  <p className="text-sm font-semibold text-white italic">
                    {generatedResult.hook}
                  </p>
                </div>

                {/* Script outline */}
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-2">Video Akış Senaryosu (Timeline):</span>
                  <div className="space-y-2">
                    {generatedResult.script.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#141b2a] border border-[#1f293d] text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Midjourney / FLUX visual prompt */}
                <div className="bg-[#0e1320] p-3 rounded-xl border border-[#1a2338]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide">
                      Midjourney / FLUX AI Görsel Promptu:
                    </span>
                    <button 
                      onClick={() => copyText(generatedResult.visualPrompt)}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Kopyala
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300">
                    {generatedResult.visualPrompt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
                Sol taraftan ayarları seçip &quot;Senaryo Üret&quot; butonuna basın.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#1a2338] flex justify-end gap-2.5">
              <button 
                onClick={() => generatedResult && copyText(`${generatedResult.hook}\n\n${generatedResult.script.join('\n')}\n\nCTA: ${generatedResult.cta}`)}
                className="px-4 py-2 rounded-xl bg-[#141b2a] hover:bg-[#1a2338] border border-[#212b42] text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>Metni Kopyala</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
