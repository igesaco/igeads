'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/DashboardOverview';
import CreativeStudioHub from '../components/CreativeStudioHub';
import AdsHub from '../components/AdsHub';
import MarketplaceHub from '../components/MarketplaceHub';
import BuyboxRepricerHub from '../components/BuyboxRepricerHub';
import WhatsAppLiveCommerceHub from '../components/WhatsAppLiveCommerceHub';
import AutomationRulesHub from '../components/AutomationRulesHub';
import VideoVisionDecoder from '../components/VideoVisionDecoder';
import IntelligenceHub from '../components/IntelligenceHub';
import IntegrationsHub from '../components/IntegrationsHub';
import AgencyHub from '../components/AgencyHub';
import PricingHub from '../components/PricingHub';
import GhostMarketerModal from '../components/GhostMarketerModal';
import AuthModal from '../components/AuthModal';
import ReportExportModal from '../components/ReportExportModal';
import NotificationDrawer from '../components/NotificationDrawer';
import CopilotWidget from '../components/CopilotWidget';
import LandingPage from '../components/LandingPage';
import ComingSoon, { COMING_SOON_TABS } from '../components/ComingSoon';
import { X, Sparkles, Check, Zap } from 'lucide-react';






export default function Home() {
  // After the iyzico redirect (?odeme=...) open the subscription page to show the result
  const [activeTab, setActiveTab] = useState<string>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('odeme') ? 'pricing' : 'dashboard'
  );
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [activeClient, setActiveClient] = useState<string>('');
  const [isGhostModalOpen, setIsGhostModalOpen] = useState<boolean>(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  
  // Signed-in user and their organization (restored from the httpOnly session cookie)
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    type: 'agency' | 'business';
    organization?: {
      name: string;
      plan: string;
      planStatus: 'trialing' | 'active' | 'expired';
      daysLeft: number | null;
    };
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const loadClients = () => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setActiveClient(json.data[0].name);
        } else {
          setActiveClient('Yeni Marka Ekleyin');
        }
      })
      .catch(() => {
        setActiveClient('Yeni Marka Ekleyin');
      });
  };

  React.useEffect(() => {
    // Restore the server-side session (httpOnly cookie)
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setCurrentUser(json.data);
          loadClients();
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const handleUserLogin = (userData: any) => {
    setCurrentUser(userData);
    loadClients();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsAuthModalOpen(false);
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
          dailyBudget: campBudget,
          clientName: activeClient
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

  // Visitors see the product page; signing in or signing up opens the auth dialog
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080B11]">
        {authChecked && <LandingPage onLogin={() => setAuthMode('login')} onRegister={() => setAuthMode('register')} />}
        {authMode && (
          <AuthModal
            key={authMode}
            isOpen
            initialMode={authMode}
            onClose={() => setAuthMode(null)}
            onLoginSuccess={(user) => { setAuthMode(null); handleUserLogin(user); }}
          />
        )}
      </div>
    );
  }

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
          {currentUser.organization?.planStatus === 'expired' && (
            <div className="mb-6 p-4 rounded-2xl border border-rose-500/40 bg-rose-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-rose-200">
                <strong>Deneme süreniz veya aboneliğiniz sona erdi.</strong> Verilerinizi görebilirsiniz, ancak değişiklik yapmak için bir paket seçmeniz gerekiyor.
              </span>
              <button onClick={() => setActiveTab('pricing')} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shrink-0 cursor-pointer">
                Paket Seç
              </button>
            </div>
          )}
          {currentUser.organization?.planStatus === 'trialing' && currentUser.organization.daysLeft !== null && (
            <div className="mb-6 p-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-indigo-200">
                Ücretsiz denemenizin bitmesine <strong>{currentUser.organization.daysLeft} gün</strong> kaldı.
              </span>
              <button onClick={() => setActiveTab('pricing')} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shrink-0 cursor-pointer">
                Paketleri Gör
              </button>
            </div>
          )}

          {COMING_SOON_TABS.includes(activeTab) && <ComingSoon />}

          {activeTab === 'dashboard' && (
            <DashboardOverview 
              activeClientName={activeClient}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenGhostModal={() => setIsGhostModalOpen(true)}
            />
          )}


          {activeTab === 'ads' && <AdsHub activeClientName={activeClient} />}

          {activeTab === 'creative_studio' && <CreativeStudioHub activeClientName={activeClient} />}

          {activeTab === 'marketplace' && <MarketplaceHub />}

          {activeTab === 'buybox' && <BuyboxRepricerHub />}

          {activeTab === 'whatsapp_commerce' && <WhatsAppLiveCommerceHub activeClientName={activeClient} />}

          {activeTab === 'automations' && <AutomationRulesHub activeClientName={activeClient} />}

          {activeTab === 'video_vision' && <VideoVisionDecoder />}

          {activeTab === 'intelligence' && <IntelligenceHub />}

          {activeTab === 'integrations' && <IntegrationsHub />}

          {activeTab === 'agency' && (
            <AgencyHub 
              activeClientName={activeClient} 
              onSelectClient={(name) => setActiveClient(name)} 
            />
          )}

          {activeTab === 'pricing' && <PricingHub />}
        </main>
      </div>

      {/* Her Zaman Aktif AI Büyüme Copilot'ı */}
      <CopilotWidget 
        activeClientName={activeClient} 
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

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
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Ghost Marketer Sabah Brifingi Modalı */}
      <GhostMarketerModal
        isOpen={isGhostModalOpen}
        onClose={() => setIsGhostModalOpen(false)}
        onNavigate={setActiveTab}
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
