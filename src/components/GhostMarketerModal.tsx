'use client';

import React, { useState, useEffect } from 'react';
import { Bot, X, Play, Pause, Volume2, ArrowRight, RefreshCw } from 'lucide-react';

interface BriefingItem {
  id: string;
  level: 'alert' | 'warning' | 'info';
  title: string;
  description: string;
  tab?: string;
}

interface GhostMarketerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

const LEVEL_DOT: Record<BriefingItem['level'], string> = {
  alert: 'bg-rose-500',
  warning: 'bg-amber-400',
  info: 'bg-indigo-400'
};

export default function GhostMarketerModal({ isOpen, onClose, onNavigate }: GhostMarketerModalProps) {
  const [items, setItems] = useState<BriefingItem[]>([]);
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/briefing');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Özet alınamadı');
      setItems(json.data.items);
      setSpeech(json.data.speech);
    } catch (err: any) {
      setError(err.message || 'Özet alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !speech) return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speech);
    utterance.lang = 'tr-TR';
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis?.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0e1322] border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[#1c263c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Günlük Özet</h2>
              <p className="text-xs text-slate-400">Bağlı hesaplarınızdan son eşitlenen veriye göre hazırlanır.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#182033] hover:bg-[#202b44] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-[#141b2e] border border-indigo-500/30 flex items-center gap-3">
          <button
            onClick={handleToggleAudio}
            disabled={!speech}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isPlayingAudio ? 'Seslendiriliyor...' : 'Özeti sesli dinle'}</span>
          </p>
        </div>

        <div className="p-6 space-y-3.5 max-h-[420px] overflow-y-auto">
          {loading && <p className="text-xs text-slate-400">Özet hazırlanıyor...</p>}
          {error && <p className="text-xs text-rose-400">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="text-xs text-slate-400">Bugün için dikkat edilmesi gereken bir durum yok.</p>
          )}
          {items.map(item => (
            <div key={item.id} className="p-4 rounded-2xl border bg-[#121828] border-[#1e2940]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[item.level]}`}></span>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              {item.tab && onNavigate && (
                <button
                  onClick={() => { onNavigate(item.tab as string); handleClose(); }}
                  className="mt-2.5 text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  İlgili ekrana git <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#0a0e1a] border-t border-[#1c263c] flex items-center justify-end gap-2.5">
          <button onClick={load} className="px-4 py-2 rounded-xl bg-[#141b2a] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Yenile
          </button>
          <button onClick={handleClose} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
