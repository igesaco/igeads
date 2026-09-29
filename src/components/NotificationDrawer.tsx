'use client';

import React from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  activeClientName?: string;
}

export default function NotificationDrawer({ isOpen, onClose, onNavigateTab, activeClientName = '' }: NotificationDrawerProps) {
  if (!isOpen) return null;

  const clientLower = (activeClientName || '').toLowerCase();
  let notifications = [
    {
      id: 'notif-1',
      type: 'buybox',
      title: 'Trendyol Buybox Kaybedildi!',
      desc: 'TrendStyle Store fiyatı 849 TL\'ye çekti. Kaşmir Kazak Buybox\'ını kaybettiniz.',
      time: '12 dakika önce',
      tab: 'buybox',
      actionText: 'Fiyatı Düşür & Geri Al',
      color: 'border-rose-500/40 bg-rose-950/20'
    },
    {
      id: 'notif-2',
      type: 'fatigue',
      title: 'TikTok Reklam Yorgunluğu (Burnout)',
      desc: 'TikTok "Viral Ceket" reklamının izlenme doyumuna ulaştığı tespit edildi. CTR: %0.98.',
      time: '45 dakika önce',
      tab: 'ads',
      actionText: 'AI Kancaları İncele',
      color: 'border-amber-500/40 bg-amber-950/20'
    },
    {
      id: 'notif-3',
      type: 'influencer',
      title: 'Yeni Influencer Satışı (#SELIN20)',
      desc: 'Selin Aksoy iş birliğinden 3 yeni Hakiki Deri Ceket siparişi geldi (+₺6.597 Ciro).',
      time: '1 saat önce',
      tab: 'influencer',
      actionText: 'ROI Tablosuna Git',
      color: 'border-emerald-500/40 bg-emerald-950/20'
    },
    {
      id: 'notif-4',
      type: 'stock',
      title: 'Otonom Stok Kalkanı Çalıştı',
      desc: 'Oversize Kazak stoğu 6 adede düştüğü için bağlı TikTok reklam seti otomatik donduruldu.',
      time: '2 saat önce',
      tab: 'automations',
      actionText: 'Kuralı İncele',
      color: 'border-indigo-500/40 bg-indigo-950/20'
    }
  ];

  if (clientLower.includes('mandalin') || clientLower.includes('temizlik') || clientLower.includes('koltuk')) {
    notifications = [
      {
        id: 'notif-mc-1',
        type: 'whatsapp',
        title: 'Yeni Koltuk Yıkama Randevusu',
        desc: 'Kadıköy/Moda lokasyonundan 3\'lü koltuk + 2 berjer yıkama talebi WhatsApp onay bekliyor.',
        time: '8 dakika önce',
        tab: 'whatsapp_commerce',
        actionText: 'WhatsApp Canlı Ekrana Git',
        color: 'border-emerald-500/40 bg-emerald-950/20'
      },
      {
        id: 'notif-mc-2',
        type: 'ads',
        title: 'Meta Yerel Lead CPA Düşüşü',
        desc: 'Instagram Reels "Leke Çıkarma Testi" reklamında form başı maliyet ₺24.50\'ye geriledi (ROAS: 6.8x).',
        time: '26 dakika önce',
        tab: 'ads',
        actionText: 'Reklam Setini İncele',
        color: 'border-cyan-500/40 bg-cyan-950/20'
      },
      {
        id: 'notif-mc-3',
        type: 'creative',
        title: 'Ajans Masasında Müşteri Onayı Bekleniyor',
        desc: '"Bahar Temizliği %25 İndirim" video kancaları müşteri onay portalına iletildi.',
        time: '1 saat önce',
        tab: 'creative_studio',
        actionText: 'Kreatif Stüdyoyu Aç',
        color: 'border-amber-500/40 bg-amber-950/20'
      },
      {
        id: 'notif-mc-4',
        type: 'seo',
        title: 'Google Haritalar Yerel Arama Zirvesi',
        desc: '"Koltuk Yıkama Kadıköy" anahtar kelimesinde yerel pakette 1. sıraya yükselindi.',
        time: '2 saat önce',
        tab: 'seogeo',
        actionText: 'SEO & Geo Radarını Gör',
        color: 'border-indigo-500/40 bg-indigo-950/20'
      }
    ];
  } else if (clientLower.includes('ige') || clientLower.includes('igesa') || clientLower.includes('ajans') || clientLower.includes('b2b')) {
    notifications = [
      {
        id: 'notif-ige-1',
        type: 'lead',
        title: 'Yeni B2B Danışmanlık Başvurusu',
        desc: 'Yıllık 10M+ ciro hedefleyen e-ihracat markasından Büyüme & Ads Danışmanlığı formu alındı.',
        time: '14 dakika önce',
        tab: 'whatsapp_commerce',
        actionText: 'Lead Detayını Gör',
        color: 'border-emerald-500/40 bg-emerald-950/20'
      },
      {
        id: 'notif-ige-2',
        type: 'budget',
        title: 'Otonom Bütçe Dengeleme Devrede',
        desc: 'Google Search B2B kampanyasına bütçe aktarıldı, toplantı başına maliyet %30 düştü.',
        time: '35 dakika önce',
        tab: 'automations',
        actionText: 'Kural Geçmişini İncele',
        color: 'border-cyan-500/40 bg-cyan-950/20'
      },
      {
        id: 'notif-ige-3',
        type: 'report',
        title: 'Haftalık AI Müşteri Raporu Hazır',
        desc: 'Mandalin Clean & Velvet Couture için haftalık ROI/POAS özetleri tek tıkla WhatsApp gönderimine hazır.',
        time: '50 dakika önce',
        tab: 'agency',
        actionText: 'Ajans Rapor Sihirbazını Aç',
        color: 'border-purple-500/40 bg-purple-950/20'
      },
      {
        id: 'notif-ige-4',
        type: 'retargeting',
        title: 'B2B Case Study Retargeting Zirvede',
        desc: 'Vaka analizi video kreatifleri 1.8k e-ticaret kurucusuna erişti (CTR: %3.42).',
        time: '3 saat önce',
        tab: 'ads',
        actionText: 'Kampanyaları Yönet',
        color: 'border-indigo-500/40 bg-indigo-950/20'
      }
    ];
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0c101a] border-l border-[#1f293d] h-full flex flex-col shadow-2xl animate-slide-left relative">
        {/* Header */}
        <div className="p-5 border-b border-[#1c263c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Canlı Alarmlar & Bildirimler</h3>
              <p className="text-[11px] text-slate-400">Pazaryeri ve reklam botu etkinlikleri</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#182033] hover:bg-[#202b44] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs">
          {notifications.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${item.color}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-white text-xs">{item.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                {item.desc}
              </p>

              <button
                onClick={() => {
                  onNavigateTab(item.tab);
                  onClose();
                }}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1c263c] bg-[#101524] flex items-center justify-between text-xs text-slate-400">
          <span>Tüm bildirimler okundu sayıldı</span>
          <button 
            onClick={onClose}
            className="text-white hover:underline cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
