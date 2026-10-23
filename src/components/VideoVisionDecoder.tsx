'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Search, 
  Flame, 
  Copy, 
  Check, 
  Zap, 
  Play, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function VideoVisionDecoder() {
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [decodedData, setDecodedData] = useState<{
    hookAnalysis: string;
    hookScore: number;
    visualPacing: string;
    secretConversionFactor: string;
    antiScript: {
      hook: string;
      timeline: string[];
      soundSuggestion: string;
      callToAction: string;
    }
  } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/video-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, description, product })
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Analiz yapılamadı');
        return;
      }
      setDecodedData(json.data);
    } catch (err: any) {
      setError(err.message || 'Sunucuya ulaşılamadı');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyScript = () => {
    if (!decodedData) return;
    const text = `${decodedData.antiScript.hook}\n\nSenaryo:\n${decodedData.antiScript.timeline.join('\n')}\n\nCTA: ${decodedData.antiScript.callToAction}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AI VISION RÖNTGENİ
          </span>
          <span className="text-xs text-slate-400">| Rakip Video Deşifre Motoru</span>
        </div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-400" />
          <span>Tersine Reklam Röntgeni (Video Vision AI & Anti-Script)</span>
        </h1>
        <p className="text-xs text-slate-400">
          Rakiplerin en çok satan video reklamlarını yapay zeka ile deşifre edin; kancasını, psikolojik taktiğini çözüp onu alt edecek daha güçlü bir karşı senaryo üretin.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-4 rounded-2xl">
        <form onSubmit={handleAnalyze} className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Rakip videoda ne oluyor? Örn: İlk saniyede montun üstüne su dökülüyor, su akıp gidiyor. Sonra hızlı kesmelerle detay çekimleri, en sonda 'ilk 50 siparişe kargo bedava' yazısı..."
            className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Sizin ürününüz (isteğe bağlı)"
              className="flex-1 bg-[#121826] border border-[#1f293d] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Video bağlantısı (isteğe bağlı, not olarak)"
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analiz ediliyor...' : 'Çözümle & Karşı Senaryo Yaz'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Sosyal medya videoları dışarıdan indirilemediği için analiz, sizin anlattığınıza göre yapay zekayla yapılır.
          </p>
          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
        </form>
      </div>

      {/* Analysis Results */}
      {decodedData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Reverse Engineered Breakdown */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a2338] pb-3">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Rakip Reklamın Röntgen Çözümlemesi</span>
              </h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Kanca Gücü: {decodedData.hookScore}/100
              </span>
            </div>

            <div className="bg-[#121828] p-3.5 rounded-xl border border-[#1e2940]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                İlk 3 Saniye Kancası (Hook Taktik):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {decodedData.hookAnalysis}
              </p>
            </div>

            <div className="bg-[#121828] p-3.5 rounded-xl border border-[#1e2940]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Kamera & Tempo Ritmi:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {decodedData.visualPacing}
              </p>
            </div>

            <div className="bg-[#121828] p-3.5 rounded-xl border border-rose-500/30">
              <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                Gizli Dönüşüm Faktörü (Secret Weapon):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {decodedData.secretConversionFactor}
              </p>
            </div>
          </div>

          {/* Right: The Anti-Script (How to Outperform Them) */}
          <div className="glass-panel p-6 rounded-2xl border-purple-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#1a2338] pb-3 mb-4">
                <h2 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>İgeAds AI Karşı Hamle Senaryosu (Anti-Script)</span>
                </h2>
                <button 
                  onClick={handleCopyScript}
                  className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Senaryoyu Al'}</span>
                </button>
              </div>

              {/* Hook */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 mb-3">
                <span className="text-[10px] uppercase font-extrabold text-purple-300 block mb-1">
                  Önerilen Karşı Kanca (Daha Yüksek Şok Etkisi):
                </span>
                <p className="text-xs font-bold text-white italic">
                  {decodedData.antiScript.hook}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-2 mb-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Çekim Planı & Timeline:
                </span>
                {decodedData.antiScript.timeline.map((scene, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#141b2a] border border-[#1f293d] text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-600/30 text-purple-300 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{scene}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1320] border border-[#1a2338] text-[11px] text-slate-400">
                🎵 <strong>Önerilen Müzik:</strong> {decodedData.antiScript.soundSuggestion}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a2338] flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-semibold">
                Hedef: Rakibin CTR&apos;ını %40 ezme potansiyeli
              </span>
              <button className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/20 cursor-pointer">
                İçerik Takvimine Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
