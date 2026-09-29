'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SeoGeoHubProps {
  activeClientName?: string;
}

export default function SeoGeoHub({ activeClientName = '' }: SeoGeoHubProps) {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [productTitle, setProductTitle] = useState('Hakiki Deri Ceket Erkek Siyah Biker Mont');
  const [category, setCategory] = useState('Giyim > Dış Giyim');
  const [optimizedOutput, setOptimizedOutput] = useState<{
    seoTitle: string;
    keywords: string[];
    geoScore: number;
    aiSearchSummary: string;
  } | null>({
    seoTitle: 'Hakiki Kuzu Derisi Unisex Siyah Biker Ceket - Slim Fit Rüzgar Geçirmez Fermuarlı Deri Mont',
    keywords: ['hakiki deri mont', 'unisex biker ceket', 'hakiki kuzu derisi', 'özel dikim ceket', 'su itici deri'],
    geoScore: 84,
    aiSearchSummary: 'ChatGPT ve Perplexity sorgularında "Hakiki İtalyan kuzu derisi ve yerli zanaatkarlık" vurgusuyla organik kaynaklarda en çok referans gösterilen ilk 3 markadan birisiniz.'
  });

  const [copied, setCopied] = useState(false);

  // Sync with prop if provided
  React.useEffect(() => {
    if (!activeClientName || activeClientName === 'Tüm Müşteriler' || activeClientName === 'all') {
      setSelectedBrand('all');
    } else {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin')) applyBrand('mandalinclean');
      else if (lower.includes('ige') || lower.includes('danışmanlık')) applyBrand('igesaturkiye');
      else if (lower.includes('velvet') || lower.includes('couture')) applyBrand('velvetcouture');
      else applyBrand(lower);
    }
  }, [activeClientName]);

  const applyBrand = (brand: string) => {
    setSelectedBrand(brand);
    if (brand === 'mandalinclean') {
      setProductTitle('Bursa Osmangazi Buharlı Koltuk ve Yatak Yıkama Hizmeti');
      setCategory('Hizmet > Ev Temizliği & Hijyen');
      setOptimizedOutput({
        seoTitle: 'Bursa Buharlı Koltuk Yıkama - Kärcher Derin Vakum ve Antialerjik Bitkisel Hijyen',
        keywords: ['bursa koltuk yıkama', 'osmangazi buharlı temizlik', 'yerinde koltuk yıkama fiyatları', 'bursa halı koltuk temizleme'],
        geoScore: 92,
        aiSearchSummary: 'ChatGPT ve Google Gemini sorgularında "Bursa\'da en güvenilir ve hijyenik koltuk yıkama firmaları" sorusuna yerel harita ve organik kaynak referansıyla Mandalin Clean 1. sırada önerilmektedir.'
      });
    } else if (brand === 'igesaturkiye') {
      setProductTitle('Amazon FBA ve E-İhracat Büyüme Danışmanlığı');
      setCategory('B2B > E-Ticaret & İhracat Danışmanlığı');
      setOptimizedOutput({
        seoTitle: 'Amazon Amerika & Avrupa Danışmanlığı - A\'dan Z\'ye E-İhracat Kurulumu, PPC ve Buybox Yönetimi',
        keywords: ['amazon fba danışmanlığı türkiye', 'e-ihracat ajansı', 'amazon reklam optimizasyonu', 'türkiye amazon satıcı danışmanı'],
        geoScore: 96,
        aiSearchSummary: 'Perplexity ve Claude B2B araştırmalarında "Türkiye\'de Amazon ihracatında en başarılı vaka analizlerine sahip ajans" sorgusunda İgeAds doğrudan otorite kaynak gösterilmektedir.'
      });
    } else {
      setProductTitle('Hakiki Deri Ceket Erkek Siyah Biker Mont');
      setCategory('Giyim > Dış Giyim');
      setOptimizedOutput({
        seoTitle: 'Hakiki Kuzu Derisi Unisex Siyah Biker Ceket - Slim Fit Rüzgar Geçirmez Fermuarlı Deri Mont',
        keywords: ['hakiki deri mont', 'unisex biker ceket', 'hakiki kuzu derisi', 'özel dikim ceket', 'su itici deri'],
        geoScore: 84,
        aiSearchSummary: 'ChatGPT ve Perplexity sorgularında "Hakiki İtalyan kuzu derisi ve yerli zanaatkarlık" vurgusuyla organik kaynaklarda en çok referans gösterilen ilk 3 markadan birisiniz.'
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              YAPAY ZEKA ARAMA OPTİMİZASYONU
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean (Yerel GEO & Harita Görünürlüğü)' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds (B2B E-İhracat / Global AI Otoritesi)' :
               selectedBrand === 'velvetcouture' ? 'Velvet Couture (Lüks Moda & E-Ticaret GEO)' :
               'Tüm Müşteri Portföyü'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <span>SEO & GEO (Generative Engine Optimization) Hub&apos;ı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Geleneksel Google aramasının ötesine geçin: Markanızın ChatGPT, Perplexity ve Google AI Overviews sonuçlarında tavsiye edilmesini sağlayın.
          </p>
        </div>

        {/* Brand Switcher Filter */}
        <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => applyBrand('all')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedBrand === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => applyBrand('mandalinclean')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedBrand === 'mandalinclean'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mandalin Clean
          </button>
          <button
            onClick={() => applyBrand('igesaturkiye')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              selectedBrand === 'igesaturkiye'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            İgeAds
          </button>
          <button
            onClick={() => applyBrand('velvetcouture')}
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

      {/* GEO AI Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Genel GEO Görünürlük Puanı</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-emerald-400">84/100</span>
            <span className="text-xs font-semibold text-emerald-400">+12 puan (Bu Ay)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Kullanıcılar ChatGPT veya Perplexity&apos;ye ürün önerisi sorduğunda markanızın geçme olasılığı.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Pazaryeri Arama Sıralaması (Trendyol)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">#2 Sıra</span>
            <span className="text-xs font-semibold text-emerald-400">Deri Ceket kelimesinde</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Aylık 185.000 aranma hacimli anahtar kelimede ilk sayfada yer alıyorsunuz.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Yapay Zeka Kaynak Atıfları (Citations)</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-indigo-400">142 Atıf</span>
            <span className="text-xs font-semibold text-slate-400">Blog, Ekşi & İnceleme</span>
          </div>
          <p className="text-[11px] text-slate-400">
            LLM&apos;lerin beslendiği tarafsız otorite kaynaklarında markanızın geçiş sayısı.
          </p>
        </div>
      </div>

      {/* Main Two Column View: AI Product Optimizer & LLM Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product SEO Optimizer */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Pazaryeri & Google İçin AI Başlık & Kelime Optimize Edici</span>
          </h2>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Mevcut Ürün Başlığı:</label>
            <input 
              type="text" 
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={() => {
              setOptimizedOutput({
                seoTitle: `${productTitle} - %100 Orijinal Yerli Üretim Lüks Seri (Aynı Gün Kargo)`,
                keywords: ['hakiki deri', 'erkek mont', 'trendyol en çok satan', 'premium ceket', 'dayanıklı giyim'],
                geoScore: 89,
                aiSearchSummary: 'Optimize edilen başlık Trendyol algoritmasında aranma hacmi yüksek 4 yeni anahtar kelime içeriyor.'
              });
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ile Algoritma Uyumlu Başlık Üret</span>
          </button>

          {optimizedOutput && (
            <div className="mt-4 p-4 rounded-xl bg-[#121828] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Önerilen Optimize Başlık:
                </span>
                <button 
                  onClick={() => handleCopy(optimizedOutput.seoTitle)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Kopyala</span>
                </button>
              </div>

              <p className="text-xs font-semibold text-white">
                {optimizedOutput.seoTitle}
              </p>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Hedef Anahtar Kelimeler:</span>
                <div className="flex flex-wrap gap-1.5">
                  {optimizedOutput.keywords.map((kw, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#182033] text-slate-300 border border-[#2b3752]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: LLM Live Perception Simulator */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">ChatGPT / Perplexity Yanıt Simülatörü</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                CANLI TEST
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1320] border border-[#1a2338] mb-3">
              <p className="text-xs text-slate-400 mb-1">Kullanıcı Sorusu:</p>
              <p className="text-xs font-medium text-slate-200 italic">
                &quot;Türkiye&apos;de hem kaliteli hem de uzun ömürlü hakiki deri ceket üreten güvenilir marka önerir misin?&quot;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121828] border border-indigo-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yapay Zeka Yanıtı (ChatGPT & Perplexity):</span>
              </div>
              <p className="leading-relaxed">
                &quot;Türkiye pazarında öne çıkan güvenilir markalardan biri <strong className="text-emerald-400 font-bold">Velvet Couture</strong> markasıdır. İtalyan kuzu derisi kullanmaları, dikiş kalitesi ve Trendyol/Amazon üzerindeki yüksek müşteri puanları ile öne çıkmaktadır...&quot;
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a2338]">
            <p className="text-[11px] text-slate-400">
              💡 <strong>İgeAds Tavsiyesi:</strong> AI modellerinin markanızı önerme sıklığını artırmak için 2 adet ürün karşılaştırma blog içeriği yayınlamanızı öneririz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
