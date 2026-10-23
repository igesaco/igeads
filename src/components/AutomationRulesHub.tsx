'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Plus, Trash2, RefreshCw, Info } from 'lucide-react';
import { RULE_ACTIONS, RULE_METRICS, type RuleAction, type RuleMetric } from '../lib/rule-definitions';

interface StoredRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  enabled: boolean;
  metric: RuleMetric | null;
  threshold: number | null;
  actionType: RuleAction | null;
  timesTriggered: number;
  lastTriggered: string;
  lastRunAt: string | null;
}

interface AutomationRulesHubProps {
  activeClientName?: string;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AutomationRulesHub(_props: AutomationRulesHubProps) {
  const [rules, setRules] = useState<StoredRule[]>([]);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const [newRuleName, setNewRuleName] = useState('');
  const [metric, setMetric] = useState<RuleMetric>('product_stock_below');
  const [threshold, setThreshold] = useState('5');
  const [actionType, setActionType] = useState<RuleAction>('notify');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/rules');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setRules(json.data);
    } catch (e) {
      console.warn('Failed to load rules', e);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (rule: StoredRule) => {
    const res = await fetch('/api/rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rule.id, enabled: !rule.enabled })
    });
    if (res.ok) setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
    else setStatus({ ok: false, text: 'Kural güncellenemedi' });
  };

  const deleteRule = async (rule: StoredRule) => {
    if (!window.confirm(`"${rule.title}" kuralı silinsin mi?`)) return;
    const res = await fetch(`/api/rules?id=${encodeURIComponent(rule.id)}`, { method: 'DELETE' });
    if (res.ok) setRules(prev => prev.filter(r => r.id !== rule.id));
    else setStatus({ ok: false, text: 'Kural silinemedi' });
  };

  const runNow = async () => {
    setRunning(true);
    setStatus(null);
    try {
      const res = await fetch('/api/rules/run', { method: 'POST' });
      const json = await res.json();
      if (!json.success) {
        setStatus({ ok: false, text: json.error || 'Kurallar çalıştırılamadı' });
      } else {
        const hits = (json.data as any[]).filter(r => r.matched > 0);
        setStatus({
          ok: true,
          text: hits.length
            ? `${hits.length} kural tetiklendi. Ayrıntılar bildirimlerde.`
            : 'Kurallar kontrol edildi, şu an koşulu sağlayan bir durum yok.'
        });
        if (hits.length) window.dispatchEvent(new CustomEvent('notifications_updated'));
        fetchRules();
      }
    } catch (err: any) {
      setStatus({ ok: false, text: err.message || 'Sunucuya ulaşılamadı' });
    } finally {
      setRunning(false);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const res = await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newRuleName, metric, threshold: Number(threshold), actionType })
    });
    const json = await res.json();
    if (!json.success) {
      setFormError(json.error || 'Kural kaydedilemedi');
      return;
    }
    setRules(prev => [...prev, json.data]);
    setIsCreatingRule(false);
    setNewRuleName('');
  };

  const activeCount = rules.filter(r => r.enabled && r.metric).length;
  const stockMetric = metric === 'product_stock_below';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Otomasyon Kuralları</span>
          </h1>
          <p className="text-xs text-slate-400">
            Stok ve ROAS koşullarına göre bildirim alın veya Meta kampanyasını otomatik duraklatın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runNow}
            disabled={running || activeCount === 0}
            className="px-3.5 py-2 rounded-xl bg-[#141b2b] border border-[#212b42] text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            <span>Şimdi Kontrol Et</span>
          </button>
          <button
            onClick={() => { setIsCreatingRule(true); setFormError(null); }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kural</span>
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          Aktif kurallar her sabah 09:00&apos;da (TSİ) otomatik kontrol edilir; &quot;Şimdi Kontrol Et&quot; ile istediğiniz an çalıştırabilirsiniz.
          Kurallar, entegrasyonlardan son eşitlenen stok ve kampanya verisine bakar. Kampanya duraklatmak için Meta token&apos;ınızda
          ads_management izni olmalıdır.
        </span>
      </div>

      {status && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${status.ok ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-300 border border-rose-500/20'}`}>
          {status.text}
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Kurallarınız ({activeCount} aktif)</h2>

        {rules.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-[#1f293d] rounded-2xl text-xs text-slate-400">
            Henüz kural yok. Örneğin &quot;Stok 5&apos;in altına düşerse bildirim gönder&quot; kuralıyla başlayabilirsiniz.
          </div>
        ) : (
          <div className="space-y-3.5">
            {rules.map(rule => {
              const lastHit = formatDate(rule.lastTriggered);
              const lastRun = formatDate(rule.lastRunAt);
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border ${rule.enabled && rule.metric ? 'bg-[#121624] border-[#1e273b]' : 'bg-[#0e121c] border-[#171e2e] opacity-60'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-white">{rule.title}</h3>
                      <p className="text-[11px] text-slate-400">
                        {rule.metric
                          ? `Son kontrol: ${lastRun || 'henüz yok'} · Son tetiklenme: ${lastHit || 'henüz yok'} · ${rule.timesTriggered} kez tetiklendi`
                          : 'Eski kural: otomatik çalışmaz, yeniden oluşturun.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {rule.metric && <button
                        onClick={() => toggleRule(rule)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border ${
                          rule.enabled ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {rule.enabled ? <><Play className="w-2.5 h-2.5" /> Aktif</> : <><Pause className="w-2.5 h-2.5" /> Pasif</>}
                      </button>}
                      <button onClick={() => deleteRule(rule)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer" title="Sil">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-[#1a2338] text-xs">
                    <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338]">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Koşul</span>
                      <span className="font-semibold text-slate-200">{rule.trigger}</span>
                    </div>
                    <div className="bg-[#0e1320] p-2.5 rounded-lg border border-[#1a2338]">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Eylem</span>
                      <span className="font-semibold text-emerald-300">{rule.action}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCreatingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1322] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Yeni Kural</span>
            </h3>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kural adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Stok azalınca haber ver"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Koşul</label>
                  <select
                    value={metric}
                    onChange={e => {
                      const m = e.target.value as RuleMetric;
                      setMetric(m);
                      if (m === 'product_stock_below') setActionType('notify');
                    }}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {(Object.keys(RULE_METRICS) as RuleMetric[]).map(m => (
                      <option key={m} value={m}>{RULE_METRICS[m].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Eşik ({RULE_METRICS[metric].unit})</label>
                  <input
                    type="number"
                    min="0"
                    step={stockMetric ? '1' : '0.1'}
                    required
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Eylem</label>
                <select
                  value={actionType}
                  onChange={e => setActionType(e.target.value as RuleAction)}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {(Object.keys(RULE_ACTIONS) as RuleAction[])
                    .filter(a => !(stockMetric && a === 'pause_campaign'))
                    .map(a => <option key={a} value={a}>{RULE_ACTIONS[a]}</option>)}
                </select>
              </div>

              {formError && <p className="text-rose-400 font-semibold">{formError}</p>}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1c263c]">
                <button type="button" onClick={() => setIsCreatingRule(false)} className="px-4 py-2 rounded-xl bg-[#141b2b] text-slate-400 hover:text-white cursor-pointer">
                  İptal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white cursor-pointer">
                  Kuralı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
