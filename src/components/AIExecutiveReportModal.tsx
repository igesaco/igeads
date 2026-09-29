'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Sliders, 
  Calendar,
  MessageCircle,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AIExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClientSlug?: string;
  clients?: Array<{ id: string; name: string; slug: string; sector: string }>;
}

export default function AIExecutiveReportModal({
  isOpen,
  onClose,
  defaultClientSlug = 'mandalinclean',
  clients = []
}: AIExecutiveReportModalProps) {
  const [selectedSlug, setSelectedSlug] = useState(defaultClientSlug);
  const [period, setPeriod] = useState('Haftalık Büyüme & ROAS Raporu');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (defaultClientSlug) {
      setSelectedSlug(defaultClientSlug);
    }
  }, [defaultClientSlug]);

  useEffect(() => {
    if (isOpen && selectedSlug) {
      handleGenerateReport();
    }
  }, [isOpen, selectedSlug]);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug: selectedSlug,
          period
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setReportData(json.data);
      }
    } catch (e) {
      console.error('Report generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (!reportData?.report?.whatsAppMessage) return;
    navigator.clipboard.writeText(reportData.report.whatsAppMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    if (!reportData?.report?.whatsAppMessage) return;
    const phone = (reportData.client?.contactPhone || '905551234567').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(reportData.report.whatsAppMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const clientInfo = reportData?.client;
  const metrics = reportData?.metrics;
  const report = reportData?.report;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-cyan-500/30 bg-[#0a0f1d] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#1b253b] flex items-center justify-between bg-gradient-to-r from-[#10172b] to-[#0a0f1d] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  GEMINI AI YÖNETİCİ RAPORU
                </span>
                <span className="text-xs text-slate-400">• Canlı Ajans Masası</span>
              </div>
              <h2 className="text-lg font-black text-white">
                Müşteri Yönetici Özeti & WhatsApp İletişim Masası
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#141d30] hover:bg-[#1f2d4a] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-3.5 bg-[#0e1424] border-b border-[#1b253b] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Hedef Marka:</span>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="bg-[#141b2e] border border-[#212c47] rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {clients.length > 0 ? (
                clients.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.sector})
                  </option>
                ))
              ) : (
                <>
                  <option value="mandalinclean">Mandalin Clean (Koltuk & Ev Temizliği)</option>
                  <option value="igesaturkiye">İgeAds / igesaturkiye (B2B & Büyüme)</option>
                  <option value="velvetcouture">Velvet Couture (Deri Giyim)</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Dönem:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-[#141b2e] border border-[#212c47] rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Haftalık Büyüme & ROAS Raporu">Haftalık Büyüme & ROAS</option>
              <option value="Aylık Yönetim ve Kârlılık Değerlendirmesi">Aylık Kârlılık Değerlendirmesi</option>
              <option value="Çeyreklik Strateji ve Bütçe Planı">Çeyreklik Strateji</option>
            </select>

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Üretiliyor...' : 'Yeniden Üret'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-white">Gemini 3.1 Flash Lite Raporu Derliyor...</p>
              <p className="text-xs text-slate-400">Canlı kampanya harcamaları, ROAS verileri ve onaylanan kreatifler taranıyor.</p>
            </div>
          ) : report ? (
            <>
              {/* Executive Summary Glow Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/40 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    BÜYÜME DİREKTÖRÜ DEĞERLENDİRMESİ
                  </span>
                  <span className="text-xs text-slate-400">• {clientInfo?.name}</span>
                </div>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">
                  {report.executiveSummary}
                </p>
              </div>

              {/* 4 Financial KPI Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0f1526] border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Reklam Yatırımı</span>
                  <span className="text-base font-black text-cyan-300">
                    ₺{(metrics?.totalSpent || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1526] border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Üretilen Ciro</span>
                  <span className="text-base font-black text-white">
                    ₺{(metrics?.totalRevenue || 0).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1526] border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Net ROAS</span>
                  <span className="text-base font-black text-amber-400">
                    {metrics?.roas}x
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1526] border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block font-semibold">Net Kasa Katkısı (POAS)</span>
                  <span className="text-base font-black text-emerald-400">
                    ₺{Math.round(metrics?.netProfit || 0).toLocaleString('tr-TR')} ({metrics?.poas}x)
                  </span>
                </div>
              </div>

              {/* 3 Pillars Grid: Wins, Optimizations, Next Week */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Wins */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Haftanın Kazanımları</span>
                  </h4>
                  <ul className="space-y-2">
                    {report.performanceWins?.map((win: string, i: number) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Optimizations */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-cyan-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Yapılan Optimizasyonlar</span>
                  </h4>
                  <ul className="space-y-2">
                    {report.optimizationsDone?.map((opt: string, i: number) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Next Week */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-purple-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Gelecek Hafta Planı</span>
                  </h4>
                  <ul className="space-y-2">
                    {report.nextWeekPlan?.map((plan: string, i: number) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                        <ArrowRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                        <span>{plan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ready-to-send WhatsApp Box */}
              <div className="p-5 rounded-2xl bg-[#090e1a] border border-[#1b253b] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Tek Tıkla WhatsApp Müşteri Mesajı</h4>
                      <p className="text-[10px] text-slate-400">Müşterinin WhatsApp hattına hazır profesyonel format</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyMessage}
                      className="px-3 py-1.5 rounded-lg border border-[#1e2a44] hover:bg-[#141b2a] text-slate-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>

                    <button
                      onClick={handleWhatsAppSend}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/25"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp ile Gönder</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060a12] border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {report.whatsAppMessage}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Rapor oluşturulamadı. Lütfen tekrar deneyin.
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-[#1b253b] bg-[#0c1120] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            Otomatik Raporlama Tarihi: <span className="text-white font-medium">{new Date().toLocaleDateString('tr-TR')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl border border-[#212c47] hover:bg-[#141b2e] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Al</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#1c2438] hover:bg-[#25304a] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
