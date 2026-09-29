'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/DashboardOverview';
import LiveWarRoomHub from '../components/LiveWarRoomHub';
import CreativeStudioHub from '../components/CreativeStudioHub';
import AdsHub from '../components/AdsHub';
import AutonomousMediaBuyer from '../components/AutonomousMediaBuyer';
import MarketplaceHub from '../components/MarketplaceHub';
import BuyboxRepricerHub from '../components/BuyboxRepricerHub';
import ReturnLossRadarHub from '../components/ReturnLossRadarHub';
import WhatsAppLiveCommerceHub from '../components/WhatsAppLiveCommerceHub';
import AutomationRulesHub from '../components/AutomationRulesHub';
import AttributionLtvHub from '../components/AttributionLtvHub';
import InfluencerRoiHub from '../components/InfluencerRoiHub';
import VideoVisionDecoder from '../components/VideoVisionDecoder';
import IntelligenceHub from '../components/IntelligenceHub';
import SeoGeoHub from '../components/SeoGeoHub';
import RemarketingHub from '../components/RemarketingHub';
import IntegrationsHub from '../components/IntegrationsHub';
import AgencyHub from '../components/AgencyHub';
import PricingHub from '../components/PricingHub';
import GhostMarketerModal from '../components/GhostMarketerModal';
import AuthModal from '../components/AuthModal';
import ReportExportModal from '../components/ReportExportModal';
import NotificationDrawer from '../components/NotificationDrawer';
import CopilotWidget from '../components/CopilotWidget';
import { X, Sparkles, Check, Zap } from 'lucide-react';






export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeClient, setActiveClient] = useState<string>('Mandalin Clean (Temizlik & Hijyen)');
  const [isGhostModalOpen, setIsGhostModalOpen] = useState<boolean>(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  
  // Current Logged in User State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    type: 'agency' | 'business';
  } | null>({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@velvetcouture.com',
    role: 'E-Ticaret Yöneticisi',
    type: 'business'
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('igeads_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {
      // ignore in SSR
    }
  }, []);

  const handleUserLogin = (userData: { name: string; email: string; role: string; type: 'agency' | 'business' }) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('igeads_user', JSON.stringify(userData));
    } catch {
      // ignore
    }
  };

  // New Campaign Form State
  const [campName, setCampName] = useState('');
  const [campPlatform, setCampPlatform] = useState('meta');
  const [campBudget, setCampBudget] = useState('1500');
  const [campCreated, setCampCreated] = useState(false);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampCreated(true);
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campName || 'Yeni Kampanya',
          platform: campPlatform,
          dailyBudget: campBudget
        })
      });
      window.dispatchEvent(new CustomEvent('campaign_updated'));
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
    setTimeout(() => {
      setCampCreated(false);
      setIsCampaignModalOpen(false);
      setCampName('');
      setActiveTab('ads');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-[#080B11] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeClient={activeClient}
        setActiveClient={setActiveClient}
        onOpenGhostModal={() => setIsGhostModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          activeClient={activeClient}
          currentUser={currentUser}
          onOpenGhostModal={() => setIsGhostModalOpen(true)}
          onNewCampaign={() => setIsCampaignModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenNotificationDrawer={() => setIsNotificationDrawerOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              activeClientName={activeClient}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenGhostModal={() => setIsGhostModalOpen(true)}
            />
          )}

          {activeTab === 'war_room' && <LiveWarRoomHub activeClientName={activeClient} />}

          {activeTab === 'ads' && <AdsHub activeClientName={activeClient} />}

          {activeTab === 'creative_studio' && <CreativeStudioHub activeClientName={activeClient} />}

          {activeTab === 'autonomous_buyer' && <AutonomousMediaBuyer activeClientName={activeClient} />}

          {activeTab === 'marketplace' && <MarketplaceHub />}

          {activeTab === 'buybox' && <BuyboxRepricerHub />}

          {activeTab === 'return_radar' && <ReturnLossRadarHub />}

          {activeTab === 'whatsapp_commerce' && <WhatsAppLiveCommerceHub activeClientName={activeClient} />}

          {activeTab === 'automations' && <AutomationRulesHub activeClientName={activeClient} />}

          {activeTab === 'attribution' && <AttributionLtvHub activeClientName={activeClient} />}

          {activeTab === 'influencer' && <InfluencerRoiHub activeClientName={activeClient} />}

          {activeTab === 'video_vision' && <VideoVisionDecoder />}

          {activeTab === 'intelligence' && <IntelligenceHub />}

          {activeTab === 'seogeo' && <SeoGeoHub activeClientName={activeClient} />}

          {activeTab === 'remarketing' && <RemarketingHub activeClientName={activeClient} />}

          {activeTab === 'integrations' && <IntegrationsHub />}

          {activeTab === 'agency' && (
            <AgencyHub 
              activeClientName={activeClient} 
              onSelectClient={(name) => setActiveClient(name)} 
              onSwitchUser={(member) => {
                handleUserLogin({
                  name: member.name,
                  email: member.email,
                  role: member.roleTitle || member.role,
                  type: 'agency'
                });
              }}
            />
          )}

          {activeTab === 'pricing' && <PricingHub />}
        </main>
      </div>

      {/* Her Zaman Aktif AI Büyüme Copilot'ı */}
      <CopilotWidget activeClientName={activeClient} />

      {/* Canlı Bildirim Drawer'ı */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        activeClientName={activeClient}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Rapor İndirme Modalı */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        activeClient={activeClient}
      />


      {/* Kimlik Doğrulama & Giriş Modalı */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleUserLogin}
      />

      {/* Ghost Marketer Sabah Brifingi Modalı */}
      <GhostMarketerModal
        isOpen={isGhostModalOpen}
        onClose={() => setIsGhostModalOpen(false)}
      />


      {/* Yeni Kampanya Sihirbazı Modalı */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e1322] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#1c263c] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Hızlı Çok Kanallı Reklam Kampanyası Başlat</span>
              </h3>
              <button 
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {campCreated ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Kampanya Oluşturuldu & API&apos;a İletildi!</h4>
                <p className="text-xs text-slate-400">Reklam Hub&apos;ına yönlendiriliyorsunuz...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Hedef Platform:</label>
                  <select 
                    value={campPlatform}
                    onChange={(e) => setCampPlatform(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="meta">Meta Ads (Instagram & Facebook Advantage+)</option>
                    <option value="google">Google Ads (Performance Max & Search)</option>
                    <option value="tiktok">TikTok Spark Ads (Dönüşüm Odaklı)</option>
                    <option value="chatgpt">ChatGPT Ads (AI Sponsored Recommendation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kampanya Adı:</label>
                  <input 
                    type="text"
                    required
                    placeholder="Örn: 2026 Bahar Koleksiyonu Lansmanı"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Günlük Bütçe (TL):</label>
                  <input 
                    type="number"
                    required
                    value={campBudget}
                    onChange={(e) => setCampBudget(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300 text-[11px]">
                  💡 <strong>Otonom Stok Güvencesi:</strong> İgeAds, seçtiğiniz ürünün pazaryeri stoğu 10&apos;un altına indiğinde bu reklamı otomatik durduracaktır.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsCampaignModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#141b2b] text-slate-400 hover:text-white"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white shadow-md shadow-indigo-600/30"
                  >
                    Kampanyayı Canlıya Al
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
