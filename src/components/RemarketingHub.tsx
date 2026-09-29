'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquareShare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { mockRemarketingFlows } from '../data/mockData';
import { RemarketingFlow } from '../types';

interface RemarketingHubProps {
  activeClientName?: string;
}

export default function RemarketingHub({ activeClientName = '' }: RemarketingHubProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [flows, setFlows] = useState<RemarketingFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<RemarketingFlow | null>(null);
  const [simulatedPhone, setSimulatedPhone] = useState('0532 000 00 00');

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setClients(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeClientName && activeClientName !== 'all') {
      setSelectedBrand(activeClientName);
    }
  }, [activeClientName]);

  const totalRev = flows.reduce((acc, f) => acc + (f.revenueGenerated || 0), 0);
  const totalSent = flows.reduce((acc, f) => acc + (f.sentCount || 0), 0);
  const totalConv = flows.reduce((acc, f) => acc + (f.convertedCount || 0), 0);
  const avgConvRate = totalSent > 0 ? ((totalConv / totalSent) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              REMARKETING OTONOMİ
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand !== 'all' ? `${selectedBrand} Sadakat & Kurtarma Akışları` : 'Tüm Portföy Konsolide'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-emerald-400" />
            <span>Omni Remarketing (WhatsApp, SMS & E-Posta)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sepette bırakanları, pazaryeri müşterilerini ve sadık alıcıları yüksek dönüşümlü akıllı mesajlarla yeniden kazanın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto gap-1">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            {clients.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedBrand(c.name)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  selectedBrand === c.name
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <Zap className="w-3.5 h-3.5" />
            <span>Yeni Akış Başlat</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-slate-400">Kurtarılan Toplam Ciro</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-emerald-400">₺{totalRev.toLocaleString('tr-TR')}</span>
            <span className="text-xs font-bold text-emerald-400">+{flows.length} Aktif Akış</span>
          </div>
          <p className="text-[11px] text-slate-400">Terk edilen sepet ve sadakat mesajlarından geri dönen ciro.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama Mesaj Açılma Oranı</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-white">%88.3</span>
            <span className="text-xs font-bold text-indigo-400">WhatsApp & SMS</span>
          </div>
          <p className="text-[11px] text-slate-400">Klasik e-postaya göre 4.5 kat daha yüksek etkileşim.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Geri Kazanım Dönüşüm Oranı</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-white">%{avgConvRate}</span>
            <span className="text-xs font-bold text-emerald-400">Siparişe Dönüştü</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Toplam {totalSent.toLocaleString('tr-TR')} mesajdan {totalConv.toLocaleString('tr-TR')} sipariş/randevu kazanıldı.
          </p>
        </div>
      </div>

      {/* Split: Flows List & Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Flows List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Aktif Remarketing Akışları</h2>

          <div className="space-y-3">
            {flows.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0e1320]/40">
                <MessageSquareShare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Henüz Aktif Remarketing veya Mesajlaşma Akışı Yok</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                  Terk edilmiş sepet kurtarma, teslimat sonrası çapraz satış veya VIP sadakat mesajları göndermek için WhatsApp Cloud API veya Netgsm SMS entegrasyonunuzu bağlayın.
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">
                  API anahtarlarınızı tanımlamak için sol menüden &quot;Entegrasyonlar&quot; sekmesine gidin.
                </p>
              </div>
            ) : (
              flows.map((flow) => {
                const isSelected = selectedFlow?.id === flow.id;

                return (
                  <div 
                    key={flow.id}
                    onClick={() => setSelectedFlow(flow)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#151c2e] border-emerald-500/50 ring-1 ring-emerald-500/20' 
                        : 'bg-[#121624] border-[#1e273b] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          flow.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-400' :
                          flow.channel === 'sms' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {flow.channel === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> :
                           flow.channel === 'sms' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-white">{flow.name}</h3>
                          <p className="text-[11px] text-slate-400">Tetikleyici: {flow.delay}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border cursor-pointer ${
                          flow.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {flow.status === 'active' ? <><Play className="w-2.5 h-2.5" /> Aktif</> : <><Pause className="w-2.5 h-2.5" /> Duraklatıldı</>}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1a2338] text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Açılma Oranı</span>
                        <span className="font-bold text-white">%{flow.openRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dönüşüm</span>
                        <span className="font-bold text-indigo-400">%{flow.conversionRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kazanılan Gelir</span>
                        <span className="font-bold text-emerald-400">₺{(flow.revenueGenerated || 0).toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Interactive Smartphone Preview */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center">
          {selectedFlow ? (
            <>
              <div className="w-full mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Canlı Mesaj Simülatörü</span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold">{selectedFlow.channel}</span>
              </div>

              {/* Phone Frame */}
              <div className="w-64 bg-[#0a0d14] border-4 border-[#222b40] rounded-[32px] p-3 shadow-2xl relative overflow-hidden">
                <div className="w-20 h-3 bg-[#222b40] rounded-full mx-auto mb-3"></div>

                <div className="bg-[#121b2d] rounded-2xl p-3.5 border border-[#1f2c47] text-xs text-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{selectedBrand !== 'all' ? selectedBrand : 'Doğrulanmış İşletme'}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-200">
                    {selectedFlow.messageTemplate
                      .replace('{{isim}}', 'Müşteri')
                      .replace('{{urun_adi}}', 'Siparişiniz')}
                  </p>

                  <span className="text-[9px] text-slate-400 block text-right">Şimdi iletildi • Okundu ✓✓</span>
                </div>

                <div className="mt-3">
                  <div className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-center text-[10px] shadow-sm">
                    Siparişi Tamamla & Fırsatı Yakala
                  </div>
                </div>

                <div className="w-24 h-1 bg-[#374151] rounded-full mx-auto mt-6"></div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center my-auto">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <MessageSquareShare className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Canlı Mesaj Simülatörü</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Mesaj şablonunun telefonda nasıl görüneceğini test etmek için soldan bir akış seçin veya yeni bir akış başlatın.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
