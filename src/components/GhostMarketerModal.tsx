'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  Zap, 
  Volume2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { mockGhostInsights } from '../data/mockData';
import { GhostMarketerInsight } from '../types';

interface GhostMarketerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GhostMarketerModal({ isOpen, onClose }: GhostMarketerModalProps) {
  const [insights, setInsights] = useState<GhostMarketerInsight[]>(mockGhostInsights);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [allApplied, setAllApplied] = useState(false);

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    if (typeof window === 'undefined') return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      const text = "Günaydın! Ghost Marketer sabah brifingine hoş geldiniz. Dün gece Trendyol satışları yüzde yirmi iki arttı, ancak TikTok reklam setiniz doygunluğa ulaştı. Kalan günlük bin iki yüz lira bütçeyi Meta Deri Ceket setine aktararak tahmini on dört bin iki yüz lira ciro kurtarabilirsiniz. Ayrıca Kaşmir Kazak ürününüzde altı adet stok kaldı, otonom stok koruması devrede.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis?.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  const executeAction = (id: string) => {
    setInsights(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, executed: true };
      }
      return item;
    }));
  };

  const executeAll = () => {
    setInsights(prev => prev.map(item => ({ ...item, executed: true })));
    setAllApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0e1322] border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-950/60 overflow-hidden relative">
        {/* Glow light effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="p-6 border-b border-[#1c263c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Ghost Marketer AI Sabah Brifingi</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-slate-400">
                Pazaryeri ve reklam motorlarının gece analiz özeti (09:00 Otomatik Raporu)
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#182033] hover:bg-[#202b44] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Briefing Simulated Player */}
        <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-[#141b2e] border border-indigo-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleAudio}
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sesli AI Özeti (2 dakika 14 saniye)</span>
              </p>
              <p className="text-[10px] text-slate-400">
                {isPlayingAudio ? '🔊 Seslendiriliyor: "Günaydın! Dün gece Trendyol satışları %22 arttı..."' : 'WhatsApp / Telegram sesli mesaj formatında dinle'}
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            AI VOICE
          </span>
        </div>

        {/* Insights Action Cards */}
        <div className="p-6 space-y-3.5 max-h-[420px] overflow-y-auto">
          {insights.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.executed 
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80' 
                  : 'bg-[#121828] border-[#1e2940] hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.type === 'urgent_stock' ? 'bg-rose-500' :
                    item.type === 'creative_burnout' ? 'bg-amber-400' : 'bg-purple-400'
                  }`}></span>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#1a2338]">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Beklenen Etki: {item.impactScore}
                </span>

                {item.executed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uygulandı
                  </span>
                ) : (
                  <button 
                    onClick={() => executeAction(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{item.actionText}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0a0e1a] border-t border-[#1c263c] flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Tüm işlemler Meta, Google ve Trendyol API&apos;ları üzerinden anlık yürütülür.
          </p>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141b2a] hover:bg-[#1a2338] text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            >
              Kapat
            </button>
            <button 
              onClick={executeAll}
              disabled={allApplied}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{allApplied ? 'Tümü Başarıyla Yürütüldü' : 'Tüm Önerileri Tek Tıkla Uygula'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
