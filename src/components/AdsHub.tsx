'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  Play, 
  Pause, 
  RefreshCw,
  Copy,
  Check,
  Zap,
  Info,
  Layers,
  X,
  DollarSign
} from 'lucide-react';
import { useEffect } from 'react';
import { mockCampaigns } from '../data/mockData';
import { AdCampaign } from '../types';

interface AdsHubProps {
  activeClientName?: string;
  onOpenNewCampaign?: () => void;
}

export default function AdsHub({ activeClientName = '', onOpenNewCampaign }: AdsHubProps) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(mockCampaigns);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('all');
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [selectedCampaignForAI, setSelectedCampaignForAI] = useState<AdCampaign | null>(null);
  const [copiedHook, setCopiedHook] = useState<string | null>(null);
  const [isNewCampModalOpen, setIsNewCampModalOpen] = useState(false);
  const [isSubmittingCamp, setIsSubmittingCamp] = useState(false);
  const [newCampForm, setNewCampForm] = useState({
    name: '',
    platform: 'meta',
    dailyBudget: '1500',
    clientSlug: ''
  });

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          setAvailableClients(d.data);
          if (d.data.length > 0) {
            setNewCampForm(prev => ({ ...prev, clientSlug: prev.clientSlug || d.data[0].slug }));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeClientName) {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin') || lower.includes('koltuk') || lower.includes('temizlik')) {
        setSelectedBrandSlug('mandalinclean');
      } else if (lower.includes('ige') || lower.includes('ajans') || lower.includes('roas')) {
        setSelectedBrandSlug('igesaturkiye');
      } else if (lower.includes('velvet')) {
        setSelectedBrandSlug('velvetcouture');
      }
    }
  }, [activeClientName]);

  const fetchCampaigns = async () => {
    try {
      const query = selectedBrandSlug !== 'all' ? `?clientSlug=${selectedBrandSlug}` : '';
      const res = await fetch(`/api/campaigns${query}`);
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        setCampaigns(data.data);
      }
    } catch (e) {
      console.warn('Could not load live campaigns, using fallback', e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    const handleUpdate = () => fetchCampaigns();
    window.addEventListener('campaign_updated', handleUpdate);
    return () => window.removeEventListener('campaign_updated', handleUpdate);
  }, [selectedBrandSlug]);

  const filteredCampaigns = filterPlatform === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.platform === filterPlatform);

  const toggleCampaignStatus = async (id: string) => {
    const current = campaigns.find(c => c.id === id);
    const newStatus = current?.status === 'active' ? 'paused' : 'active';
    
    // Optimistic UI update
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus
        };
      }
      return c;
    }));

    try {
      await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to toggle status on server:', err);
    }
  };

  const generatedHooks = selectedBrandSlug === 'mandalinclean' ? [
    {
      hook: '"POV: Koltuğunuzu en son ne zaman yıkattınız? İçinden çıkan suyu görünce şok olacaksınız..."',
      angle: 'Görsel Şok & Hijyen Farkındalığı',
      ctrPrediction: '%4.80 (Tahmini +%40 artış)'
    },
    {
      hook: '"Evinize temizlik ekibi çağırmadan önce bu 3 kuralı mutlaka bilin!"',
      angle: 'Otorite & Güven / Hata Önleme Kancası',
      ctrPrediction: '%3.90 (Tahmini +%25 artış)'
    },
    {
      hook: '"Bize bu koltuğu çöpe atılacak diye verdiler, ama sonuç..."',
      angle: 'Öncesi / Sonrası Dönüşüm Hikayesi',
      ctrPrediction: '%4.65 (Tahmini +%45 artış)'
    }
  ] : selectedBrandSlug === 'igesaturkiye' ? [
    {
      hook: '"Reklam bütçenizi yakmadan cironuzu 3 katına çıkarmanın formülü..."',
      angle: 'ROAS & Kârlılık Kancası',
      ctrPrediction: '%4.50 (Tahmini +%35 artış)'
    },
    {
      hook: '"Neden çoğu e-ticaret markası 2. ayda batıyor? İşte kimsenin söylemediği gerçek."',
      angle: 'Merak & Problem-Çözüm Kancası',
      ctrPrediction: '%4.10 (Tahmini +%30 artış)'
    },
    {
      hook: '"Her ₺1 reklam harcaması kasanıza ₺5 olarak nasıl döner? Canlı vaka analizi."',
      angle: 'Sosyal Kanıt & Matematiksel Güven',
      ctrPrediction: '%4.90 (Tahmini +%50 artış)'
    }
  ] : [
    {
      hook: '"Neden herkes aynı polyester ceketi giyiyor? İşte 10 yıl dayanan hakiki derinin sırrı."',
      angle: 'Farklılaşma & Dayanıklılık (Anti-Hızlı Moda)',
      ctrPrediction: '%3.85 (Tahmini +%40 artış)'
    },
    {
      hook: '"Deri ceket alırken dolandırılmamak için bu 3 testi mutlaka yapın!"',
      angle: 'Eğitici Merak Kancası (Authority Hook)',
      ctrPrediction: '%4.10 (Tahmini +%52 artış)'
    },
    {
      hook: '"POV: Paket eline ulaştığında çıkan o gerçek deri kokusu..."',
      angle: 'Duyusal & ASMR / Samimiyet Kancası',
      ctrPrediction: '%3.40 (Tahmini +%25 artış)'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(text);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <span>Bütünleşik Reklam & Otonom Bütçe Hub&apos;ı</span>
          </h1>
          <p className="text-xs text-slate-400">
            Meta, Google, TikTok ve ChatGPT Ads kampanyalarını tek merkezden yönetin, stok durumuna göre otonom bütçe dağıtın.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setSelectedCampaignForAI(campaigns[0] || null)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-xs font-semibold text-purple-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Reklam Varyasyon Motoru</span>
          </button>

          <button 
            onClick={() => {
              if (onOpenNewCampaign) onOpenNewCampaign();
              else {
                setNewCampForm(prev => ({
                  ...prev,
                  clientSlug: selectedBrandSlug !== 'all' ? selectedBrandSlug : 'mandalinclean'
                }));
                setIsNewCampModalOpen(true);
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kampanya Aç</span>
          </button>
        </div>
      </div>

      {/* Platform Tabs & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c263c] pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Brand Selector Pill */}
          <select
            value={selectedBrandSlug}
            onChange={(e) => setSelectedBrandSlug(e.target.value)}
            className="bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
          >
            <option value="all">🏢 Tüm Ajans Portföyü</option>
            {availableClients.map(c => (
              <option key={c.id} value={c.slug}>🏢 {c.name} ({c.sector})</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-[#121826] p-1 rounded-xl border border-[#1f293d]">
            {[
              { id: 'all', label: 'Tüm Platformlar' },
              { id: 'meta', label: 'Meta Ads (FB/IG)' },
              { id: 'google', label: 'Google Ads (PMax)' },
              { id: 'tiktok', label: 'TikTok Ads' },
              { id: 'chatgpt', label: 'ChatGPT Ads (AI)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPlatform(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterPlatform === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#182033]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Otonom Kural: <strong>ROAS &lt; 2.5x</strong> olduğunda bütçe kârlı kanallara aktarılır.</span>
        </div>
      </div>

      {/* Campaigns Data Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f293d] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Platform</th>
                <th className="pb-3">Kampanya Adı</th>
                <th className="pb-3">Durum</th>
                <th className="pb-3 text-right">Günlük Bütçe</th>
                <th className="pb-3 text-right">Harcama</th>
                <th className="pb-3 text-right">Ciro</th>
                <th className="pb-3 text-right">ROAS</th>
                <th className="pb-3 text-right">POAS (Net Kâr)</th>
                <th className="pb-3 text-center">Yorgunluk</th>
                <th className="pb-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182236]">
              {filteredCampaigns.map((camp) => {
                const isFatigued = camp.fatigueScore > 75;

                return (
                  <tr key={camp.id} className="hover:bg-[#151c2e]/60 transition-colors">
                    {/* Platform Badge */}
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                        camp.platform === 'meta' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        camp.platform === 'google' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        camp.platform === 'tiktok' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {camp.platform}
                      </span>
                    </td>

                    {/* Campaign Name & Linked Product */}
                    <td className="py-4 max-w-xs pr-4">
                      <p className="font-semibold text-white truncate text-xs">{camp.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>Hedef Stok:</span>
                        <span className={`font-bold ${camp.targetMarketplaceStock && camp.targetMarketplaceStock < 20 ? 'text-rose-400' : 'text-slate-300'}`}>
                          {camp.targetMarketplaceStock} Adet
                        </span>
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          camp.status === 'active' 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' 
                            : camp.status === 'fatigued'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {camp.status === 'active' ? (
                          <><Play className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> Aktif</>
                        ) : camp.status === 'fatigued' ? (
                          <><AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Yoruldu</>
                        ) : (
                          <><Pause className="w-2.5 h-2.5" /> Duraklatıldı</>
                        )}
                      </button>
                    </td>

                    {/* Budgets & Metrics */}
                    <td className="py-4 text-right font-medium text-slate-300">
                      ₺{camp.dailyBudget.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-4 text-right font-medium text-slate-200">
                      ₺{camp.spent.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-4 text-right font-bold text-white">
                      ₺{camp.revenue.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-4 text-right font-bold text-indigo-400">
                      {camp.roas}x
                    </td>
                    <td className="py-4 text-right font-bold text-emerald-400">
                      {camp.poas}x
                    </td>

                    {/* Fatigue Score */}
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-[#1a2338] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              camp.fatigueScore > 75 ? 'bg-rose-500' :
                              camp.fatigueScore > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${camp.fatigueScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-bold ${
                          camp.fatigueScore > 75 ? 'text-rose-400' : 'text-slate-300'
                        }`}>
                          %{camp.fatigueScore}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right">
                      {isFatigued ? (
                        <button 
                          onClick={() => setSelectedCampaignForAI(camp)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[10px] font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-300" />
                          <span>AI Hook Yenile</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedCampaignForAI(camp)}
                          className="px-2 py-1 rounded-lg bg-[#141b2a] hover:bg-[#1a2338] text-slate-300 border border-[#212b42] text-[10px] font-medium transition-all ml-auto cursor-pointer"
                        >
                          Optimize Et
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Creative Fatigue & Hook Generation Modal / Section */}
      {selectedCampaignForAI && (
        <div className="glass-panel rounded-2xl p-6 border-indigo-500/40 bg-gradient-to-br from-[#121626] to-[#0d1220] shadow-2xl relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  AI Reklam Kurtarma & Yeni Nesil Varyasyon Stüdyosu
                </h3>
                <p className="text-xs text-slate-400">
                  Seçilen Kampanya: <strong className="text-indigo-300">{selectedCampaignForAI.name}</strong> ({selectedCampaignForAI.platform.toUpperCase()})
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCampaignForAI(null)}
              className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-[#182033] border border-[#2b3752] cursor-pointer"
            >
              Kapat
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Bu reklam son 7 günde 4.2x frekansa ulaştı, tıklama oranı (CTR) %0.98 seviyesine geriledi. Yapay zeka, kitleyi canlandırmak için 3 yeni psikolojik kanca üretti:
            </span>
          </div>

          {/* Generated Hooks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {generatedHooks.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-[#141b2a] border border-[#212b42] hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                      Varyasyon #{idx + 1}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {item.ctrPrediction}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white italic mb-2 leading-relaxed">
                    {item.hook}
                  </p>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Strateji: {item.angle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1e2840]">
                  <button 
                    onClick={() => copyToClipboard(item.hook)}
                    className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHook === item.hook ? (
                      <><Check className="w-3 h-3 text-emerald-400" /> Kopyalandı</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Metni Al</>
                    )}
                  </button>

                  <button className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                    <Zap className="w-3 h-3" />
                    <span>Reklam Setine Enjekte Et</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
              Tüm Varyasyonları Otomatik A/B Testine Gönder
            </button>
          </div>
        </div>
      )}

      {/* Yeni Kampanya Başlatma Modalı */}
      {isNewCampModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0d1322] border border-indigo-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                <span>Yeni Çok Kanallı Kampanya Başlat</span>
              </h3>
              <button 
                onClick={() => setIsNewCampModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCampForm.name.trim()) return;
                setIsSubmittingCamp(true);
                try {
                  const res = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCampForm)
                  });
                  if (res.ok) {
                    setIsNewCampModalOpen(false);
                    setNewCampForm({
                      name: '',
                      platform: 'meta',
                      dailyBudget: '1500',
                      clientSlug: selectedBrandSlug !== 'all' ? selectedBrandSlug : 'mandalinclean'
                    });
                    await fetchCampaigns();
                    window.dispatchEvent(new CustomEvent('campaign_updated'));
                  }
                } catch (err) {
                  console.error('Error creating campaign in AdsHub:', err);
                } finally {
                  setIsSubmittingCamp(false);
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Hedef Marka:</label>
                <select
                  value={newCampForm.clientSlug}
                  onChange={(e) => setNewCampForm({ ...newCampForm, clientSlug: e.target.value })}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  {availableClients.length > 0 ? (
                    availableClients.map(c => (
                      <option key={c.id} value={c.slug}>🏢 {c.name} ({c.sector})</option>
                    ))
                  ) : (
                    <option value="">Henüz marka eklenmedi (Önce marka ekleyin)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kampanya Adı:</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy Koltuk Yıkama / B2B İhracat Demo"
                  value={newCampForm.name}
                  onChange={(e) => setNewCampForm({ ...newCampForm, name: e.target.value })}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Reklam Platformu:</label>
                  <select
                    value={newCampForm.platform}
                    onChange={(e) => setNewCampForm({ ...newCampForm, platform: e.target.value })}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="meta">Meta (Instagram & Facebook)</option>
                    <option value="google">Google Ads (Arama & PMax)</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="whatsapp">WhatsApp Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Günlük Bütçe (₺):</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={newCampForm.dailyBudget}
                    onChange={(e) => setNewCampForm({ ...newCampForm, dailyBudget: e.target.value })}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsNewCampModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCamp}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isSubmittingCamp ? 'Oluşturuluyor...' : 'Kampanyayı Canlıya Al'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
