'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClient: string;
}

export default function ReportExportModal({ isOpen, onClose, activeClient }: ReportExportModalProps) {
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState('Son 30 Gün (Eylül 2026)');
  const [includeAIInsights, setIncludeAIInsights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let campaigns = [];
      try {
        const res = await fetch('/api/campaigns');
        const json = await res.json();
        if (json?.data) campaigns = json.data;
      } catch (err) {
        console.warn('Could not fetch live campaigns for report:', err);
      }

      const clientLower = (activeClient || '').toLowerCase();
      let aiInsight1 = '1. Meta Advantage+ ve Google reklamları en yüksek kârlılık marjıyla ölçekleniyor.';
      let aiInsight2 = '2. Düşük performanslı reklam setleri otonom olarak durdurularak net kâr korundu.';

      if (clientLower.includes('mandalin') || clientLower.includes('temizlik')) {
        aiInsight1 = '1. Mandalin Clean yerel temizlik ve koltuk yıkama taleplerinde hafta sonu bütçesi %25 artırıldı.';
        aiInsight2 = '2. WhatsApp doğrudan randevu kurguları en düşük maliyetle en yüksek müşteri dönüşümünü sağladı.';
      } else if (clientLower.includes('ige') || clientLower.includes('ajans')) {
        aiInsight1 = '1. İgeAds B2B büyüme kancaları hedef kitlede yüksek etkileşim sağlayarak CPA maliyetini %30 düşürdü.';
        aiInsight2 = '2. Çok kanallı yeniden pazarlama ile ajans teklif talepleri ve ROAS istikrarlı yükselişte.';
      } else if (clientLower.includes('velvet')) {
        aiInsight1 = '1. Lüks deri koleksiyonunda dinamik katalog reklamları 5.4x ROAS ile en yüksek verimlilikte çalışıyor.';
        aiInsight2 = '2. Pazaryeri stok koruma kuralı aktif devrede tutularak bütçe israfı engellendi.';
      }

      // Generate CSV with UTF-8 BOM for Excel Turkish character compatibility
      let fileContent = '\uFEFF';
      if (reportFormat === 'excel') {
        fileContent += `İgeAds Büyüme ve Performans Raporu - ${activeClient}\n`;
        fileContent += `Tarih: ${new Date().toLocaleDateString('tr-TR')} | Dönem: ${dateRange}\n\n`;
        fileContent += 'Kampanya Adı;Platform;Durum;Günlük Bütçe (TL);Harcama (TL);Ciro (TL);ROAS;POAS;CTR (%);CPC (TL);Yorgunluk Skoru\n';
        
        campaigns.forEach((c: any) => {
          fileContent += `"${c.name}";"${c.platform}";"${c.status}";${c.dailyBudget};${c.spent};${c.revenue};${c.roas};${c.poas};${c.ctr};${c.cpc};${c.fatigueScore}%\n`;
        });

        if (includeAIInsights) {
          fileContent += '\nAI Büyüme ve Performans İçgörüleri:\n';
          fileContent += `- ${aiInsight1}\n`;
          fileContent += `- ${aiInsight2}\n`;
        }
      } else {
        fileContent += `=======================================================\n`;
        fileContent += `   İGEADS YÖNETİCİ & AJANS BÜYÜME RAPORU (PDF ÖZETİ)\n`;
        fileContent += `=======================================================\n`;
        fileContent += `Marka: ${activeClient}\n`;
        fileContent += `Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}\n`;
        fileContent += `Dönem: ${dateRange}\n\n`;
        fileContent += `KAMPANYA PERFORMANS VERİLERİ:\n`;
        fileContent += `-------------------------------------------------------\n`;
        campaigns.forEach((c: any, i: number) => {
          fileContent += `${i + 1}. ${c.name} [${c.platform.toUpperCase()}]\n`;
          fileContent += `   Bütçe: ₺${c.dailyBudget}/gün | Harcama: ₺${c.spent} | Ciro: ₺${c.revenue}\n`;
          fileContent += `   ROAS: ${c.roas}x | POAS: ${c.poas}x | Durum: ${c.status}\n\n`;
        });
        if (includeAIInsights) {
          fileContent += `-------------------------------------------------------\n`;
          fileContent += `GHOST MARKETER AI STRATEJİK İÇGÖRÜLERİ:\n`;
          fileContent += `${aiInsight1}\n`;
          fileContent += `${aiInsight2}\n`;
        }
      }

      const mimeType = reportFormat === 'excel' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
      const extension = reportFormat === 'excel' ? 'csv' : 'txt';
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IgeAds_${activeClient.replace(/[^a-zA-Z0-9]/g, '_')}_Rapor_${new Date().toISOString().slice(0, 10)}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 1800);
    } catch (e) {
      console.error('Export failed:', e);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0c101a] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#161c2c] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Yönetici Performans Raporunu İndir</h3>
          </div>
          <p className="text-xs text-slate-400">
            {activeClient} için kurumsal, şık ve detaylı büyüme raporu oluşturun.
          </p>
        </div>

        {exported ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Rapor Başarıyla İndirildi!</h4>
            <p className="text-xs text-slate-400">
              {reportFormat === 'pdf' ? 'İgeAds_Executive_Report_2026.pdf' : 'İgeAds_Data_Export_2026.xlsx'} dosyanız hazırlandı.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Format Selector */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Rapor Formatı:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReportFormat('pdf')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    reportFormat === 'pdf'
                      ? 'bg-rose-500/10 border-rose-500/50 text-white ring-1 ring-rose-500/20'
                      : 'bg-[#121826] border-[#1f293d] text-slate-400'
                  }`}
                >
                  <FileText className="w-5 h-5 text-rose-400" />
                  <div className="text-left">
                    <span className="font-bold block text-xs">Kurumsal PDF</span>
                    <span className="text-[10px] text-slate-400">Grafikler & Sunum</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReportFormat('excel')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    reportFormat === 'excel'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-1 ring-emerald-500/20'
                      : 'bg-[#121826] border-[#1f293d] text-slate-400'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <span className="font-bold block text-xs">Excel / CSV</span>
                    <span className="text-[10px] text-slate-400">Ham Veri Tablosu</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Tarih Aralığı:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Son 7 Gün">Son 7 Gün (Haftalık Değerlendirme)</option>
                <option value="Son 30 Gün (Eylül 2026)">Son 30 Gün (Eylül 2026 - Standart)</option>
                <option value="Son Çeyrek (Q3 2026)">Son Çeyrek (Q3 2026 - Üç Aylık)</option>
                <option value="Yıl Başından Bugüne (YTD)">Yıl Başından Bugüne (2026 YTD)</option>
              </select>
            </div>

            {/* AI Toggle */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121826] border border-[#1f293d] cursor-pointer">
              <input
                type="checkbox"
                checked={includeAIInsights}
                onChange={(e) => setIncludeAIInsights(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 bg-[#0c101a] border-slate-700"
              />
              <div>
                <span className="font-bold text-white block text-[11px]">Ghost Marketer AI Özetini Dahil Et</span>
                <span className="text-[10px] text-slate-400">Rapora yapay zeka tarafından yazılmış yönetici tavsiyeleri eklenir.</span>
              </div>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1c263c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#141b2a] text-slate-400 hover:text-white cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold text-white shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Oluşturuluyor...' : 'Raporu İndir'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
