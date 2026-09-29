'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Play, 
  Pause,
  ArrowRight,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { useEffect } from 'react';
import { mockAutomationRules } from '../data/mockData';
import { AutomationRule } from '../types';

interface AutomationRulesHubProps {
  activeClientName?: string;
}

export default function AutomationRulesHub({ activeClientName = '' }: AutomationRulesHubProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // Sync with prop if provided
  useEffect(() => {
    if (!activeClientName || activeClientName === 'Tüm Müşteriler' || activeClientName === 'all') {
      setSelectedBrand('all');
    } else {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin')) setSelectedBrand('mandalinclean');
      else if (lower.includes('ige') || lower.includes('danışmanlık')) setSelectedBrand('igesaturkiye');
      else if (lower.includes('velvet') || lower.includes('couture')) setSelectedBrand('velvetcouture');
      else setSelectedBrand(lower);
    }
  }, [activeClientName]);

  // Brand-tailored rules
  const brandRulesMap: Record<string, AutomationRule[]> = {
    mandalinclean: [
      {
        id: 'rule-mc-1',
        name: '🌧️ Yağmurlu Günlerde Randevu & Bütçe Artışı',
        trigger: 'Hava Durumu API (Bursa/Osmangazi = Yağmurlu)',
        condition: 'Yağmur ihtimali > %70 olduğunda',
        action: 'Koltuk & Yatak Yıkama Google & Meta bütçesini %35 artır',
        enabled: true,
        timesTriggered: 18,
        lastRun: 'Dün 14:20',
        category: 'budget_guard'
      },
      {
        id: 'rule-mc-2',
        name: '🛑 Günlük 25 Randevu Kapasite Doluluk Kalkanı',
        trigger: 'Randevu Yönetim Sistemi (Slot Doluluk)',
        condition: 'Mevcut gün için boş slot sayısı = 0 olduğunda',
        action: 'Meta Lead Form ve WhatsApp reklamlarını anında duraklat',
        enabled: true,
        timesTriggered: 12,
        lastRun: '3 gün önce',
        category: 'stock_guard'
      },
      {
        id: 'rule-mc-3',
        name: '🌙 Gece WhatsApp Otonom Randevu Rezervasyonu',
        trigger: 'Gelen WhatsApp Mesajı (22:00 - 08:00)',
        condition: 'Müşteri "fiyat" veya "randevu" sorduğunda',
        action: 'AI Auto-Closer ertesi gün saat 10:00 ve 14:00 slotunu teklif edip depozito linki göndersin',
        enabled: true,
        timesTriggered: 29,
        lastRun: 'Dün gece 23:45',
        category: 'creative_guard'
      }
    ],
    igesaturkiye: [
      {
        id: 'rule-ige-1',
        name: '🎯 Amazon Danışmanlığı CAPI Lead Maliyeti Kalkanı',
        trigger: 'Meta B2B Lead Kampanyası CPL',
        condition: 'Form başı maliyet > ₺220 olduğunda',
        action: 'Geniş kitleyi durdur, İhracatçı Birlikleri LAL %1 kitlesine odaklan',
        enabled: true,
        timesTriggered: 8,
        lastRun: '2 gün önce',
        category: 'budget_guard'
      },
      {
        id: 'rule-ige-2',
        name: '📅 Kurucu Strateji Takvimi Boşluk Doldurucu',
        trigger: 'Cal.com Ajans Randevu Takvimi',
        condition: 'Gelecek 3 gün boş slot oranı > %30 olduğunda',
        action: 'Google Search "Amazon FBA Danışmanlığı" bütçesini %25 ölçeklendir',
        enabled: true,
        timesTriggered: 14,
        lastRun: 'Dün 11:30',
        category: 'budget_guard'
      },
      {
        id: 'rule-ige-3',
        name: '🚨 VIP B2B İhracatçı Lead Anlık WhatsApp Bildirimi',
        trigger: 'Gelen B2B Form (Ciro > $100.000/yıl)',
        condition: 'Yıllık ihracat veya yurt içi ciro beyanı yüksek ise',
        action: 'Ajans Kurucusuna ve Kıdemli Stratejiste anında öncelikli WhatsApp alarmı düşür',
        enabled: true,
        timesTriggered: 31,
        lastRun: 'Bugün 15:10',
        category: 'creative_guard'
      }
    ],
    velvetcouture: [
      {
        id: 'rule-vc-1',
        name: '🧥 Trendyol & İkas Beden/Stok Tükendi Kalkanı',
        trigger: 'Trendyol & İkas Envanter API (S/M Beden)',
        condition: 'Hakiki Deri Biker Ceket stok adedi < 3 olduğunda',
        action: 'Meta DPA dinamik katalog reklamından bu varyantı kaldır',
        enabled: true,
        timesTriggered: 24,
        lastRun: 'Bugün 12:40',
        category: 'stock_guard'
      },
      {
        id: 'rule-vc-2',
        name: '🚀 Gün İçi ROAS Patlaması Bütçe Ölçeklendirici',
        trigger: 'Meta Ads Manager Gerçek Zamanlı ROAS',
        condition: 'Son 6 saatlik kümülatif ROAS > 6.0x olduğunda',
        action: 'Günlük kampanya bütçesini otomatik olarak %20 artır',
        enabled: true,
        timesTriggered: 19,
        lastRun: 'Dün 19:15',
        category: 'budget_guard'
      },
      {
        id: 'rule-vc-3',
        name: '🔄 Kreatif Frekans & Yorulma Dedektörü',
        trigger: 'Reels Reklam Frekansı & CTR',
        condition: 'Frekans > 3.8 ve CTR < %1.10 olduğunda',
        action: 'Yorulan videoyu duraklat ve B-Roll yedek varyantı yayına al',
        enabled: true,
        timesTriggered: 16,
        lastRun: '3 gün önce',
        category: 'creative_guard'
      }
    ]
  };

  // Combine or filter rules
  const displayedRules = selectedBrand === 'all' 
    ? (rules.length > 0 ? rules : mockAutomationRules)
    : (brandRulesMap[selectedBrand] || rules);

  // New Rule Builder State
  const [newRuleName, setNewRuleName] = useState('');
  const [triggerSource, setTriggerSource] = useState('trendyol_stock');
  const [conditionValue, setConditionValue] = useState('5');
  const [actionTarget, setActionTarget] = useState('pause_ads');

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/rules');
      const data = await res.json();
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const mapped = data.data.map((r: any) => ({
          id: r.id,
          name: r.title || r.name,
          trigger: r.trigger,
          condition: r.condition || 'Otomatik koşul sağlandığında',
          action: r.action,
          enabled: r.enabled,
          timesTriggered: r.timesTriggered || 12,
          lastRun: r.lastTriggered || 'Az önce',
          category: r.category || 'stock_guard'
        }));
        setRules(mapped);
      }
    } catch (e) {
      console.warn('Could not load live rules, using fallback', e);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id: string) => {
    const current = displayedRules.find(r => r.id === id);
    const newEnabled = !current?.enabled;

    setRules(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, enabled: newEnabled };
      }
      return r;
    }));

    try {
      await fetch('/api/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: newEnabled })
      });
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const ruleTitle = newRuleName || 'Özel Otonom Kural';
    const ruleTrigger = triggerSource === 'trendyol_stock' ? 'Stok / Envanter Seviyesi' : 
                        triggerSource === 'meta_roas' ? 'Meta Kampanya ROAS' : 'TikTok Reklam Frekansı';
    const ruleCondition = `Değer < ${conditionValue} olduğunda`;
    const ruleAction = actionTarget === 'pause_ads' ? 'İlgili reklam setlerini duraklat' :
                       actionTarget === 'scale_budget' ? 'Günlük bütçeyi %25 artır' : 'WhatsApp Bildirimi Gönder';

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: ruleTitle,
      trigger: ruleTrigger,
      condition: ruleCondition,
      action: ruleAction,
      enabled: true,
      timesTriggered: 0,
      lastRun: 'Yeni Oluşturuldu',
      category: 'stock_guard'
    };
    
    setRules([newRule, ...rules]);
    setIsCreatingRule(false);
    setNewRuleName('');

    try {
      await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ruleTitle,
          trigger: `${ruleTrigger} (${ruleCondition})`,
          action: ruleAction,
          category: 'stock_guard',
          enabled: true
        })
      });
    } catch (err) {
      console.error('Failed to save rule to API:', err);
    }
  };

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
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean (Yerel Hizmet / Koltuk Yıkama)' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds (B2B E-İhracat / Danışmanlık)' :
               selectedBrand === 'velvetcouture' ? 'Velvet Couture (Lüks Giyim & Deri Moda)' :
               'Tüm Müşteri Portföyü (Konsolide)'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Otonom Kural & Otomasyon Motoru (Rules Engine)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Siz uyurken stok durumuna, kârlılığa ve hava durumu/randevu doluluğuna göre reklamlarınızı yöneten yapay zeka kuralları.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10">
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
            <button
              onClick={() => setSelectedBrand('mandalinclean')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'mandalinclean'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mandalin Clean
            </button>
            <button
              onClick={() => setSelectedBrand('igesaturkiye')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'igesaturkiye'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              İgeAds
            </button>
            <button
              onClick={() => setSelectedBrand('velvetcouture')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'velvetcouture'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Velvet Couture
            </button>
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
            {displayedRules.filter(r => r.enabled).length} Kural 7/24 Nöbette
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tüm Webhook ve Sektörel tetikleyiciler devrede
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Önlenen Bütçe İsrafı / Kurtarılan Ciro</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {selectedBrand === 'mandalinclean' ? '₺18.400' :
             selectedBrand === 'igesaturkiye' ? '₺82.500' :
             selectedBrand === 'velvetcouture' ? '₺54.200' : '₺155.100'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Kapasite aşımı, stok tükenmesi veya yüksek maliyetli tıklamalara karşı korundu.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Toplam Otonom Müdahale</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">
            {displayedRules.reduce((acc, r) => acc + (r.timesTriggered || 0), 0)} Kez
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            İnsan müdahalesi olmadan 7/24 otomatik gerçekleştirilen eylemler.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">
          Mevcut Kurallar & Otonom Tetikleyiciler ({selectedBrand === 'all' ? 'Tüm Portföy' : selectedBrand.toUpperCase()})
        </h2>

        <div className="space-y-3.5">
          {displayedRules.map((rule) => (
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
                  placeholder="Örn: Stok 5 altına inince Meta Ceket reklamını durdur"
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
