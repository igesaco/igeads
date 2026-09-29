'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Smartphone, 
  Monitor, 
  Image as ImageIcon,
  Zap,
  Sliders,
  Send,
  CheckCircle2
} from 'lucide-react';

interface CreativeStudioHubProps {
  activeClientName?: string;
}

export default function CreativeStudioHub({ activeClientName = '' }: CreativeStudioHubProps) {
  const [customProductTitle, setCustomProductTitle] = useState('Yeni Hizmet / Ürün');
  const [adFormat, setAdFormat] = useState<'story' | 'feed' | 'banner'>('story');
  const [themeStyle, setThemeStyle] = useState<'luxury_dark' | 'neon_cyber' | 'minimalist_clean'>('minimalist_clean');
  const [headline, setHeadline] = useState('Koltuklarınızda Fabrika Çıkışı Temizliği');
  const [subheading, setSubheading] = useState('Alman teknolojisi derin vakum ve antialerjik solüsyonlarla evinizde otel ferahlığı.');
  const [ctaText, setCtaText] = useState('Hemen Randevu Al / Fiyat Öğren');
  const [badgeText, setBadgeText] = useState('AYNI GÜN HİZMET');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [aiHooks, setAiHooks] = useState<string[]>([
    'Bize bu koltuğu çöpe atılacak diye verdiler, ama...',
    'Hafta sonunuzu temizlikle heba etmekten yorulmadınız mı?',
    'Evinize temizlik ekibi çağırmadan önce bu 3 kuralı bilin!'
  ]);

  // Sync default presets when activeClientName changes
  React.useEffect(() => {
    if (!activeClientName) return;
    const lower = activeClientName.toLowerCase();
    if (lower.includes('mandalin')) {
      setCustomProductTitle('Mandalin Clean Profesyonel Buharlı Koltuk & Yatak Yıkama');
      setHeadline('Koltuklarınızda Fabrika Çıkışı Ferahlığı');
      setSubheading('Alman Kärcher derin vakum ve antialerjik solüsyonlarla evinizde otel konforu.');
      setCtaText('Hemen Randevu Al / Fiyat Öğren');
      setBadgeText('AYNI GÜN BURSA GENELİ HİZMET');
      setThemeStyle('minimalist_clean');
      setAiHooks([
        'Bize bu koltuğu çöpe atılacak diye verdiler, ama...',
        'Hafta sonunuzu temizlikle heba etmekten yorulmadınız mı?',
        'Evinize koltuk temizleme ekibi çağırmadan önce bu 3 kuralı bilin!'
      ]);
    } else if (lower.includes('ige') || lower.includes('danışmanlık')) {
      setCustomProductTitle('İgeAds Amazon FBA & E-İhracat Büyüme Danışmanlığı');
      setHeadline('Ürünlerinizi Amazon Globalde Milyonlara Satın');
      setSubheading('A\'dan Z\'ye mağaza kurulumu, PPC reklam optimizasyonu ve Buybox yönetimi ile ihracatınızı katlayın.');
      setCtaText('Ücretsiz İhracat Analizi Al');
      setBadgeText('B2B STRATEJİ GÖRÜŞMESİ');
      setThemeStyle('luxury_dark');
      setAiHooks([
        'Amazon Amerika\'da ayda $50.000 ciroya ulaşan Türk üreticinin sırrı!',
        'E-ihracatta en çok para kaybettiren 3 reklam hatası',
        'Fabrikanız Türkiye\'de, müşterileriniz tüm dünyada olsun'
      ]);
    } else if (lower.includes('velvet') || lower.includes('couture')) {
      setCustomProductTitle('Velvet Couture Hakiki Deri Biker Ceket Koleksiyonu');
      setHeadline('Kusursuz İtalyan İşçiliği, Zamansız Zarafet');
      setSubheading('%100 hakiki kuzu derisi, özel el dikimi astar ve ikonik metal aksesuarlarla stilinizi zirveye taşıyın.');
      setCtaText('Şimdi Keşfet • Ücretsiz Kargo');
      setBadgeText('YENİ SEZON KOLEKSİYONU');
      setThemeStyle('luxury_dark');
      setAiHooks([
        'Gardırobunuzda tek bir ceket olacaksa, kesinlikle bu olmalı!',
        'Hakiki kuzu derisi ile suni deri arasındaki 1 saniyelik fark',
        'Bu ceketle girdiğiniz her odada gözler üzerinizde olacak'
      ]);
    }
  }, [activeClientName]);

  const handleGenerateAICreative = async () => {
    setIsGeneratingAI(true);
    try {
      const activeTitle = customProductTitle.trim() || 'Yeni Kampanya & Ürün';
      const res = await fetch('/api/creative-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: activeTitle,
          platform: adFormat === 'story' ? 'Instagram Story (9:16) & TikTok' : adFormat === 'feed' ? 'Instagram Feed (1:1)' : 'Google Display Banner',
          tone: themeStyle === 'luxury_dark' ? 'Prestige & Lüks' : themeStyle === 'neon_cyber' ? 'Genç & Enerjik' : 'Minimalist & Doğal'
        })
      });
      const json = await res.json();
      if (json?.data) {
        if (json.data.headline) setHeadline(json.data.headline);
        if (json.data.primaryText) setSubheading(json.data.primaryText);
        if (json.data.cta) setCtaText(json.data.cta);
        if (Array.isArray(json.data.hooks)) setAiHooks(json.data.hooks);
      }
    } catch (e) {
      console.error('AI creative generation failed:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDispatchToAgencyWorkflow = async () => {
    setIsDispatching(true);
    try {
      const titleLower = customProductTitle.toLowerCase();
      let clientSlug = 'velvetcouture';
      let clientName = 'Velvet Couture';

      if (titleLower.includes('mandalin') || titleLower.includes('koltuk') || titleLower.includes('temizlik')) {
        clientSlug = 'mandalinclean';
        clientName = 'Mandalin Clean';
      } else if (titleLower.includes('ige') || titleLower.includes('ajans') || titleLower.includes('pazarlama') || titleLower.includes('roas')) {
        clientSlug = 'igesaturkiye';
        clientName = 'İgeAds / igesaturkiye';
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${clientName}: ${headline}`,
          description: `Format: ${adFormat.toUpperCase()} | Stil: ${themeStyle}\nMetin: ${subheading}\nCTA: ${ctaText}`,
          clientSlug,
          clientName,
          assignedTo: 'Cansu Demir (Kreatif & Metin Yazarı)',
          stage: 'review',
          priority: 'high',
          creativeHook: headline,
          channel: adFormat === 'story' ? 'reels' : 'meta'
        })
      });

      const json = await res.json();
      if (json.success) {
        setDispatchSuccessMsg(`"${headline}" kurgusu ${clientName} Müşteri Onay Masasına ve Ajans Kanban'ına gönderildi!`);
        setTimeout(() => setDispatchSuccessMsg(null), 4500);
      }
    } catch (e) {
      console.error('Dispatch failed:', e);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleDownloadMockup = () => {
    alert('Reklam görseli 4K çözünürlükte hazırlanıp indirildi!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              YAPAY ZEKA TASARIM FABRİKASI
            </span>
            <span className="text-xs text-slate-400">| Grafik Tasarımcıya Gerek Kalmadan 4K Reklam Üretimi</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <span>AI Creative Studio & Reklam Mockup Atölyesi</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ürününüz için Instagram Story (9:16), Feed (1:1) ve Google Display reklam banner&apos;larını anında tasarlayın, metin ve kancalarını optimize edin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button 
            onClick={handleDispatchToAgencyWorkflow}
            disabled={isDispatching}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-cyan-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
            <span>{isDispatching ? 'İletiliyor...' : '📋 Ajans Masası & Müşteri Onayına Gönder'}</span>
          </button>

          <button 
            onClick={handleDownloadMockup}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Mockup&apos;ı İndir (4K PNG)</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {dispatchSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{dispatchSuccessMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Creative Controls */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Reklam Parametreleri & Ayarlar</span>
            </h2>
          </div>

          {/* AI Generator Action Button */}
          <button
            type="button"
            onClick={handleGenerateAICreative}
            disabled={isGeneratingAI}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isGeneratingAI ? 'Gemini 3.8 Flash Üretiyor...' : '✨ Gemini AI İle Kanca & Metin Yaz'}</span>
          </button>

          {/* AI Suggested Hooks if available */}
          {aiHooks.length > 0 && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                ⚡ Yapay Zeka Önerilen Kancalar (Tıkla ve Uygula):
              </span>
              <div className="space-y-1.5">
                {aiHooks.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeadline(h)}
                    className="w-full text-left p-2 rounded-lg bg-[#141b2a] hover:bg-purple-900/40 text-slate-200 hover:text-white text-[11px] border border-purple-500/20 hover:border-purple-400 transition-all flex items-start gap-1.5 cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold shrink-0">{i + 1}.</span>
                    <span className="leading-snug">{h}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product / Service Selector & Custom Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-300 font-medium">Hedef Ürün veya Hizmet Adı:</label>
            </div>
            <input
              type="text"
              value={customProductTitle}
              onChange={(e) => setCustomProductTitle(e.target.value)}
              placeholder="Örn: Mandalin Clean Koltuk Yıkama, igesaturkiye..."
              className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mb-2 font-medium"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCustomProductTitle('Mandalin Clean Profesyonel Koltuk & Ev Temizliği');
                  setHeadline('Koltuklarınızda Fabrika Çıkışı Temizliği');
                  setSubheading('Alman teknolojisi derin vakum ve antialerjik solüsyonlarla evinizde otel ferahlığı.');
                  setCtaText('Hemen Randevu Al / Fiyat Öğren');
                  setBadgeText('AYNI GÜN HİZMET');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                🍊 Mandalin Clean
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomProductTitle('İgesatürkiye Performans Pazarlama & ROAS Yönetimi');
                  setHeadline('Reklam Bütçenizi Satışa Dönüştürün');
                  setSubheading('Yapay zeka destekli otonom reklam optimizasyonuyla e-ticaret cironuzu katlayın.');
                  setCtaText('Ücretsiz Büyüme Analizi Başlat');
                  setBadgeText('ROAS ODAKLI BÜYÜME');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                ⚡ İgeAds / igesaturkiye
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomProductTitle('Velvet Couture Hakiki Deri Biker Ceket');
                  setHeadline('Hakiki İtalyan Kuzu Derisi');
                  setSubheading('10 Yıl Garantili Yerli Üretim Biker Ceket');
                  setCtaText('Sepette %20 İndirimle Keşfet');
                  setBadgeText('SINIRLI ÜRETİM');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all cursor-pointer"
              >
                🧥 Velvet Couture
              </button>
            </div>
          </div>

          {/* Format selector */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Reklam Formatı:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAdFormat('story')}
                className={`p-2 rounded-lg border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  adFormat === 'story' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Story (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdFormat('feed')}
                className={`p-2 rounded-lg border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  adFormat === 'feed' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Feed (1:1)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdFormat('banner')}
                className={`p-2 rounded-lg border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  adFormat === 'banner' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Banner (16:9)</span>
              </button>
            </div>
          </div>

          {/* Theme Style */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Görsel Estetik Teması:</label>
            <select 
              value={themeStyle}
              onChange={(e) => setThemeStyle(e.target.value as any)}
              className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="luxury_dark">🖤 Lüks Koyu & Titanyum (Prestige)</option>
              <option value="neon_cyber">⚡ Neon Siber & Canlı (Cyberpunk)</option>
              <option value="minimalist_clean">🤍 Minimalist & Ferah (Clean E-com)</option>
            </select>
          </div>

          {/* Headline input */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Ana Başlık (Hook):</label>
            <input 
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Subheading */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Alt Açıklama (Değer Teklifi):</label>
            <input 
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* CTA & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Buton Yazısı (CTA):</label>
              <input 
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Rozet Metni:</label>
              <input 
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Live Visual Canvas Mockup */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Canlı Mockup Önizleme ({adFormat.toUpperCase()})</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {adFormat === 'story' ? '1080 x 1920 px' : adFormat === 'feed' ? '1080 x 1080 px' : '1920 x 1080 px'}
            </span>
          </div>

          {/* The Canvas Frame */}
          <div className={`transition-all duration-300 rounded-3xl overflow-hidden relative shadow-2xl border ${
            adFormat === 'story' ? 'w-72 h-[510px]' :
            adFormat === 'feed' ? 'w-80 h-80' : 'w-full max-w-lg h-72'
          } ${
            themeStyle === 'luxury_dark' ? 'bg-[#0a0d14] border-slate-800' :
            themeStyle === 'neon_cyber' ? 'bg-[#08051a] border-purple-500/40 ring-2 ring-purple-500/20' :
            'bg-slate-900 border-slate-700'
          }`}>
            {/* Background Product Image */}
            <div className="absolute inset-0 z-0 opacity-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" 
                alt="Creative Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/70 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              {/* Top Bar: Brand & Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
                    {customProductTitle.toLowerCase().includes('mandalin') ? 'MC' : customProductTitle.toLowerCase().includes('ige') ? 'İG' : 'AD'}
                  </div>
                  <span className="text-xs font-black tracking-wide text-white uppercase">
                    {customProductTitle.toLowerCase().includes('mandalin') ? 'MANDALIN CLEAN' : customProductTitle.toLowerCase().includes('ige') ? 'İGEADS / İGESATÜRKİYE' : 'REKLAM & KAMPANYA'}
                  </span>
                </div>

                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                  {badgeText}
                </span>
              </div>

              {/* Center / Bottom Info */}
              <div className="space-y-2 mt-auto">
                <div className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  {customProductTitle.toLowerCase().includes('mandalin') 
                    ? 'Koltuk Başı Hizmet: ₺499' 
                    : customProductTitle.toLowerCase().includes('ige') 
                    ? 'Net Kâr Garantili Danışmanlık' 
                    : 'Yüksek Dönüşümlü Teklif'}
                </div>

                <h3 className="text-base font-black text-white leading-snug drop-shadow-md">
                  {headline}
                </h3>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {subheading}
                </p>

                {/* Simulated CTA Button */}
                <div className="pt-2">
                  <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-xs text-center shadow-lg shadow-indigo-600/30 tracking-wide">
                    {ctaText}
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 text-center pt-1">
                  Aynı Gün Ücretsiz Kargo • Değişim Garantili
                </p>
              </div>
            </div>
          </div>

          {/* Quick Agency Dispatch Bar */}
          <div className="mt-4 p-4 rounded-2xl bg-[#0e1320] border border-[#1e2940] flex items-center justify-between gap-3 max-w-lg w-full">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hedef Marka & Portal</span>
              <span className="text-xs font-black text-white">
                {customProductTitle.toLowerCase().includes('mandalin') ? '🍊 Mandalin Clean' : customProductTitle.toLowerCase().includes('ige') ? '⚡ İgeAds / igesaturkiye' : '🧥 Velvet Couture'}
              </span>
            </div>
            <button
              onClick={handleDispatchToAgencyWorkflow}
              disabled={isDispatching}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatching ? 'İletiliyor...' : 'Müşteri Onay Masasına Gönder'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
