'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { AutomationRule } from '../types';

interface AutomationRulesHubProps {
  activeClientName?: string;
}

const defaultUniversalRules: AutomationRule[] = [
  {
    id: 'rule-def-1',
    name: '🛡️ Pazaryeri Stok Kalkanı & Kâr Güvencesi',
    trigger: 'Trendyol / Amazon Envanter API',
    condition: 'Ürün varyant stoğu < 5 kaldığında',
    action: 'Meta & Google Ads ilgili ürün reklam setini anında duraklat',
    enabled: true,
    timesTriggered: 0,
    lastRun: 'Hazır / Dinlemede',
    category: 'stock_guard'
  },
  {
    id: 'rule-def-2',
    name: '🔥 Yüksek ROAS Otomatik Bütçe Ölçekleme (Scale)',
    trigger: 'Meta Ads & Google Ads Günlük Raporu',
    condition: 'Son 3 günlük ROAS > 4.5x ve Harcama > ₺500 olduğunda',
    action: 'Kampanya günlük bütçesini %20 kademeli artır',
    enabled: true,
    timesTriggered: 0,
    lastRun: 'Hazır / Dinlemede',
    category: 'budget_guard'
  },
  {
    id: 'rule-def-3',
    name: '⚠️ Reklam Yorgunluğu (Ad Fatigue) Uyarısı',
    trigger: 'Kreatif Frekans Takip Modülü',
    condition: 'Haftalık frekans > 3.8 ve CTR < %0.8 olduğunda',
    action: 'AI Kreatif Stüdyosu yeni video/görsel varyasyonları üretsin',
    enabled: true,
    timesTriggered: 0,
    lastRun: 'Hazır / Dinlemede',
    category: 'creative_guard'
  }
];

export default function AutomationRulesHub({ activeClientName = '' }: AutomationRulesHubProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [rules, setRules] = useState<AutomationRule[]>(defaultUniversalRules);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // New rule form states
  const [newRuleName, setNewRuleName] = useState('');
  const [triggerSource, setTriggerSource] = useState('trendyol_stock');
  const [conditionValue, setConditionValue] = useState('10');
  const [actionTarget, setActionTarget] = useState('pause_ads');

  // Fetch real clients
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

  // Sync with prop if provided
  useEffect(() => {
    if (activeClientName && activeClientName !== 'Tüm Müşteriler' && activeClientName !== 'all') {
      setSelectedBrand(activeClientName);
    } else {
      setSelectedBrand('all');
    }
  }, [activeClientName]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    let triggerText = 'Pazaryeri Stok API';
    let condText = `Stok < ${conditionValue} olduğunda`;
    let actText = 'Reklamları duraklat';

    if (triggerSource === 'meta_roas') {
      triggerText = 'Meta Ads ROAS';
      condText = `ROAS < ${conditionValue}x olduğunda`;
      actText = 'Bütçeyi %20 azalt';
    } else if (triggerSource === 'tiktok_burnout') {
      triggerText = 'Kreatif Frekansı';
      condText = `Frekans > ${conditionValue} olduğunda`;
      actText = 'Yeni varyasyon yükle';
    }

    if (actionTarget === 'scale_budget') actText = 'Bütçeyi %25 artır';
    else if (actionTarget === 'notify_whatsapp') actText = 'WhatsApp acil uyarı gönder';

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      trigger: triggerText,
      condition: condText,
      action: actText,
      enabled: true,
      timesTriggered: 0,
      lastRun: 'Yeni eklendi',
      category: 'budget_guard'
    };

    setRules(prev => [newRule, ...prev]);
    setIsCreatingRule(false);
    setNewRuleName('');
  };

  const totalTriggered = rules.reduce((acc, r) => acc + (r.timesTriggered || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Otonom Bot 7/24
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand !== 'all' ? `${selectedBrand} Otomasyon Kuralları` : 'Tüm Müşteri Portföyü (Konsolide)'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Otonom Kural & Otomasyon Motoru (Rules Engine)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Siz uyurken stok durumuna, kârlılığa ve hedef metriklere göre reklamlarınızı yöneten yapay zeka kuralları.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto gap-1">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
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

          <button 
            onClick={() => setIsCreatingRule(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kural Tanımla</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/30">
          <span className="text-xs font-semibold text-slate-400">Aktif Otonom Kurallar</span>
          <p className="text-2xl font-black text-white mt-1">
            {rules.filter(r => r.enabled).length} Kural 7/24 Nöbette
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tüm Webhook ve Sektörel tetikleyiciler devrede
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Önlenen Bütçe İsrafı / Kurtarılan Ciro</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₺0</p>
          <span className="text-[11px] text-slate-400 mt-1">
            Canlı kural tetiklenmesi sonrası kurtarılan tutar burada raporlanır.
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Toplam Otonom Müdahale</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{totalTriggered} Kez</p>
          <span className="text-[11px] text-slate-400 mt-1">
            İnsan müdahalesi olmadan 7/24 otomatik gerçekleştirilen eylemler.
          </span>
        </div>
      </div>

      {/* Rules List */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">
          Mevcut Kurallar & Otonom Tetikleyiciler ({selectedBrand === 'all' ? 'Tüm Portföy' : selectedBrand})
        </h2>

        <div className="space-y-3.5">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.enabled 
                  ? 'bg-[#121624] border-[#1e273b] hover:border-indigo-500/40' 
                  : 'bg-[#0e121c] border-[#171e2e] opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    rule.enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{rule.name}</h3>
                    <p className="text-[11px] text-slate-400">Son Tetiklenme: {rule.lastRun}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] font-semibold text-slate-300">
                    <strong className="text-emerald-400">{rule.timesTriggered} kez</strong> tetiklendi
                  </span>

                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      rule.enabled 
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {rule.enabled ? (
                      <><Play className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> Aktif</>
                    ) : (
                      <><Pause className="w-2.5 h-2.5" /> Pasif</>
                    )}
                  </button>
                </div>
              </div>

              {/* Logic flow visualisation: IF -> THEN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-[#1a2338] text-xs">
                <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">TETİKLEYİCİ (IF)</span>
                  <span className="font-semibold text-white">{rule.trigger}</span>
                </div>

                <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338]">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">KOŞUL (CONDITION)</span>
                  <span className="font-semibold text-slate-200">{rule.condition}</span>
                </div>

                <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338]">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">OTONOM EYLEM (THEN)</span>
                  <span className="font-semibold text-emerald-300">{rule.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Rule Modal */}
      {isCreatingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1322] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Yeni Otonom Kural Sihirbazı</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Reklam platformları ve pazaryerleri arasında anlık kural kurgulayın.
            </p>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kural Başlığı:</label>
                <input 
                  type="text"
                  required
                  placeholder="Örn: Stok 5 altına inince reklamı durdur"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Tetikleyici Kaynak:</label>
                  <select 
                    value={triggerSource}
                    onChange={(e) => setTriggerSource(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="trendyol_stock">Trendyol / Amazon Stok Durumu</option>
                    <option value="meta_roas">Meta Ads ROAS Skoru</option>
                    <option value="tiktok_burnout">TikTok Reklam Frekansı (Burnout)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kritik Eşik Değeri:</label>
                  <input 
                    type="number"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Yürütülecek Otonom Eylem:</label>
                <select 
                  value={actionTarget}
                  onChange={(e) => setActionTarget(e.target.value)}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="pause_ads">Reklam Setini Otomatik Duraklat (Kâr Koruması)</option>
                  <option value="scale_budget">Bütçeyi %25 Artır (Scale Kazanç)</option>
                  <option value="notify_whatsapp">Telegram / WhatsApp Acil Bildirim Gönder</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1c263c]">
                <button 
                  type="button"
                  onClick={() => setIsCreatingRule(false)}
                  className="px-4 py-2 rounded-xl bg-[#141b2b] text-slate-400 hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Kuralı Aktif Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
