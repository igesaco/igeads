'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Store, 
  Sparkles, 
  Search, 
  MessageSquareShare, 
  Bot, 
  Building2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Key,
  Sliders,
  Cpu,
  Video,
  CreditCard,
  GitMerge,
  ShoppingBag,
  Users,
  Palette,
  Radio,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeClient: string;
  setActiveClient: (client: string) => void;
  onOpenGhostModal: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  count?: string;
  alert?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeClient,
  setActiveClient,
  onOpenGhostModal
}: SidebarProps) {
  const menuCategories: MenuCategory[] = [
    {
      id: 'core',
      title: 'Genel Bakış & Komuta',
      items: [
        { id: 'dashboard', label: 'Genel Bakış (Executive)', icon: LayoutDashboard, badge: 'Canlı' },
        { id: 'war_room', label: 'Canlı Satış & War Room', icon: Radio, badge: 'LIVE' },
      ]
    },
    {
      id: 'advertising',
      title: 'Reklam & Medya Satın Alma',
      items: [
        { id: 'ads', label: 'Reklam Hub\'ı', icon: Megaphone, count: '4 Kanal' },
        { id: 'autonomous_buyer', label: 'Otonom Medya Alıcı (AI)', icon: Cpu, badge: '1-CLICK' },
        { id: 'automations', label: 'Otonom Kural Motoru', icon: Sliders, badge: 'AUTO' },
        { id: 'attribution', label: 'Çok Kanallı Atıf & LTV', icon: GitMerge, badge: 'ANALİTİK' },
      ]
    },
    {
      id: 'social',
      title: 'Sosyal Medya & Kreatif AI',
      items: [
        { id: 'creative_studio', label: 'AI Tasarım & Mockup', icon: Palette, badge: '4K' },
        { id: 'video_vision', label: 'Rakip Video Röntgeni', icon: Video, badge: 'AI VISION' },
        { id: 'intelligence', label: 'AI İçerik & Rakip Radarı', icon: Sparkles, badge: 'YENİ' },
        { id: 'influencer', label: 'Influencer & UGC ROI', icon: Users, badge: 'ROI 6.9x' },
      ]
    },
    {
      id: 'marketing',
      title: 'Pazarlama & İletişim',
      items: [
        { id: 'whatsapp_commerce', label: 'WhatsApp Satış Masası', icon: MessageSquare, badge: 'CANLI' },
        { id: 'remarketing', label: 'Remarketing (WhatsApp/SMS)', icon: MessageSquareShare },
        { id: 'seogeo', label: 'SEO & GEO (AI Görünürlük)', icon: Search },
      ]
    },
    {
      id: 'ecommerce',
      title: 'E-Ticaret & Pazaryeri',
      items: [
        { id: 'marketplace', label: 'Pazaryeri & Stok', icon: Store, alert: '1 Kritik Stok' },
        { id: 'buybox', label: 'Buybox & Fiyat Casusu', icon: ShoppingBag, alert: '1 Kayıp' },
        { id: 'return_radar', label: 'Kargo & İade Kalkanı', icon: ShieldAlert, alert: '3 Riskli' },
      ]
    },
    {
      id: 'agency_settings',
      title: 'Ajans & Sistem',
      items: [
        { id: 'integrations', label: 'API & Entegrasyonlar', icon: Key, count: '7 Bağlı' },
        { id: 'agency', label: 'Ajans & Müşteri Portalı', icon: Building2, count: '3 Müşteri' },
        { id: 'pricing', label: 'Paketler & Abonelik', icon: CreditCard, badge: 'PRO' },
      ]
    }
  ];

  const [dynamicClients, setDynamicClients] = React.useState<Array<{ id: string; name: string; slug: string; sector: string }>>([]);

  const loadClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDynamicClients(json.data);
      }
    } catch (e) {
      console.error('Sidebar clients fetch error:', e);
    }
  };

  React.useEffect(() => {
    loadClients();
    const handleUpdate = () => loadClients();
    window.addEventListener('client_updated', handleUpdate);
    return () => window.removeEventListener('client_updated', handleUpdate);
  }, []);

  return (
    <aside className="w-72 bg-[#0c101a] border-r border-[#1a2338] flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 overflow-hidden">
      {/* Brand & Workspace Header (Pinned) */}
      <div className="p-4 pb-3 shrink-0 border-b border-[#1a2338]/60">
        {/* Logo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">İgeAds</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AJANS OS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Agency Operating System</p>
            </div>
          </div>
        </div>

        {/* Agency / Brand Switcher */}
        <div className="bg-[#121826] border border-[#1f293d] rounded-xl p-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
            <span>Aktif Marka:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Canlı
            </span>
          </div>
          <select 
            value={activeClient}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                setActiveTab('agency');
              } else {
                setActiveClient(e.target.value);
              }
            }}
            className="w-full bg-[#182033] border border-[#2b3752] text-xs font-semibold text-white rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
          >
            {dynamicClients.length > 0 ? (
              dynamicClients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.sector})
                </option>
              ))
            ) : (
              <option value="__add_new__" className="text-amber-400 font-semibold">
                ➕ Henüz Marka Yok (Yeni Ekle)
              </option>
            )}
            <option value="__add_new__" className="text-cyan-400 font-bold bg-[#0f172a]">
              ➕ Yeni Marka Ekle (Yönetim)...
            </option>
          </select>
        </div>
      </div>

      {/* Categorized Navigation (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {menuCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            {/* Category Header */}
            <div className="px-2 pt-1 pb-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {category.title}
              </span>
              <span className="text-[9px] text-slate-600 font-medium font-mono">
                {category.items.length}
              </span>
            </div>

            {/* Category Items */}
            <div className="space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/35 to-indigo-600/10 text-white border border-indigo-500/40 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121826]/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate text-left">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          item.badge === 'LIVE' || item.badge === 'CANLI' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                          {item.count}
                        </span>
                      )}
                      {item.alert && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                          {item.alert}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ghost Marketer AI Quick Trigger Widget */}
      <div className="p-4 border-t border-[#1a2338]">
        <div className="bg-gradient-to-br from-indigo-950/60 via-[#121826] to-cyan-950/40 border border-indigo-500/25 rounded-2xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">Ghost Marketer AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto animate-ping"></span>
          </div>
          
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
            Sabah brifingi hazır! 1 stok riski ve 1 rakip karşı hamlesi tespit edildi.
          </p>

          <button 
            onClick={onOpenGhostModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            <span>Brifingi Dinle & Uygula</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Integration Status Footer */}
        <div className="mt-3 pt-3 border-t border-[#1a2338]/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Entegre Ağlar:</span>
          <div className="flex items-center gap-1.5">
            <span title="Meta Ads: Bağlı" className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span title="Google Ads: Bağlı" className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span title="Trendyol: Bağlı" className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span title="TikTok: İncelemede" className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span title="Amazon: Bağlı" className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
