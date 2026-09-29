'use client';

import React from 'react';
import { 
  Bell, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  TrendingUp, 
  ExternalLink,
  Search
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  activeClient: string;
  currentUser: { name: string; email: string; role: string; type: 'agency' | 'business' } | null;
  onOpenGhostModal: () => void;
  onNewCampaign: () => void;
  onOpenAuthModal: () => void;
  onOpenReportModal: () => void;
  onOpenNotificationDrawer: () => void;
}

export default function Navbar({
  activeTab,
  activeClient,
  currentUser,
  onOpenGhostModal,
  onNewCampaign,
  onOpenAuthModal,
  onOpenReportModal,
  onOpenNotificationDrawer
}: NavbarProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Genel Büyüme & POAS Paneli';
      case 'war_room': return 'Canlı Satış & War Room';
      case 'ads': return 'Bütünleşik Reklam Yönetimi & Otonom Bütçe';
      case 'creative_studio': return 'AI Reklam Tasarım & Mockup Stüdyosu';
      case 'autonomous_buyer': return 'AI Otonom Medya Satın Alıcı (1-Click Multi-Ads)';
      case 'marketplace': return 'Pazaryeri & Stok & Net Kâr Matrisi';
      case 'buybox': return 'AI Buybox & Dinamik Fiyatlandırma Casusu';
      case 'return_radar': return 'Kargo & İade Zarar Kalkanı (Profit Shield)';
      case 'whatsapp_commerce': return 'WhatsApp Satış Masası & Canlı Ticaret';
      case 'automations': return 'Otonom Kural & Otomasyon Motoru';
      case 'attribution': return 'Çok Kanallı Atıf (Attribution) & LTV Analitiği';
      case 'influencer': return 'AI Influencer & UGC Doğrudan ROI Masası';
      case 'video_vision': return 'Tersine Reklam Röntgeni (Video Vision AI)';
      case 'intelligence': return 'AI İçerik Takvimi & Tersine Rakip Radarı';
      case 'seogeo': return 'SEO & GEO (Yapay Zeka Arama Görünürlüğü)';
      case 'remarketing': return 'Omni Remarketing (WhatsApp, SMS & VIP)';
      case 'integrations': return 'Canlı API & Platform Entegrasyonları';
      case 'agency': return 'Ajans Yönetimi & White-Label Portalı';
      case 'pricing': return 'SaaS Fiyatlandırma & Abonelik Paketleri';
      default: return 'İgeAds Yönetim Konsolu';
    }
  };






  return (
    <header className="h-16 border-b border-[#1a2338] bg-[#0c101a]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">{activeClient}</span>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-sm font-bold text-white tracking-wide">{getTabTitle()}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tüm API Senkronizasyonları Aktif (Son Veri: 2 dk önce)
          </span>
        </div>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-3.5">
        {/* Quick Sync Button */}
        <button 
          title="Tüm Pazaryeri ve Reklam Verilerini Canlı Eşle"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2b] border border-[#212b42] text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Canlı Eşitle</span>
        </button>

        {/* Export Report Button */}
        <button 
          onClick={onOpenReportModal}
          title="PDF ve Excel Raporu İndir"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2b] border border-cyan-500/30 text-xs text-cyan-300 hover:text-white hover:bg-cyan-950/40 transition-all cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Rapor İndir</span>
        </button>

        {/* Ghost Marketer Trigger */}

        <button 
          onClick={onOpenGhostModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-200 hover:text-white transition-all shadow-sm hover:shadow-indigo-500/20 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Ghost AI Brifingi</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-[10px] text-white font-extrabold">3</span>
        </button>

        {/* Create Campaign */}
        <button 
          onClick={onNewCampaign}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Hızlı Kampanya Başlat</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={onOpenNotificationDrawer}
            title="Canlı Bildirimler"
            className="w-9 h-9 rounded-lg bg-[#141b2b] border border-[#212b42] flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0c101a] animate-ping"></span>
          </button>
        </div>


        {/* User / Agency Avatar or Login Button */}
        {currentUser ? (
          <div 
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 pl-2 border-l border-[#1a2338] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#0c101a] flex items-center justify-center text-xs font-bold text-white">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-emerald-400">{currentUser.role}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#182033] hover:bg-[#202b44] text-xs font-bold text-white border border-[#2b3752] transition-all cursor-pointer"
          >
            Giriş Yap
          </button>
        )}
      </div>
    </header>
  );
}

