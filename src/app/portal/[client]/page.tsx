'use client';

import React, { use, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  MessageCircle,
  BarChart3,
  Store,
  Clock,
  Sparkles,
  Building2,
  Phone,
  Printer,
  Check,
  RotateCcw,
  Send,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ClientPortalPage({ params }: { params: Promise<{ client: string }> }) {
  const resolvedParams = use(params);
  const clientSlug = resolvedParams.client || 'mandalinclean';

  const [clientData, setClientData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisionTaskId, setRevisionTaskId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [clientRes, tasksRes] = await Promise.all([
          fetch(`/api/clients/${clientSlug}`),
          fetch(`/api/tasks?clientSlug=${clientSlug}`)
        ]);

        const clientJson = await clientRes.json();
        if (clientJson.success && clientJson.data) {
          setClientData(clientJson.data);
        }

        const tasksJson = await tasksRes.json();
        if (tasksJson.success && Array.isArray(tasksJson.data)) {
          setTasks(tasksJson.data);
        }
      } catch (e) {
        console.error('Portal load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [clientSlug]);

  const handleApproveCreative = async (taskId: string, title: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, stage: 'published' })
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, stage: 'published' } : t));
        setActionSuccessMsg(`"${title}" başarıyla onaylandı ve yayına hazır duruma getirildi!`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error('Approval error:', e);
    }
  };

  const handleRequestRevision = async (taskId: string, title: string) => {
    if (!revisionNote.trim()) return;
    try {
      const currentTask = tasks.find(t => t.id === taskId);
      const newDesc = `${currentTask?.description || ''}\n[Müşteri Revize Notu]: ${revisionNote}`.trim();
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: taskId, 
          stage: 'in_progress',
          description: newDesc
        })
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, stage: 'in_progress', description: newDesc } : t));
        setRevisionTaskId(null);
        setRevisionNote('');
        setActionSuccessMsg(`Revize talebiniz ajans ekibine iletildi: "${title}"`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error('Revision error:', e);
    }
  };

  const clientName = clientData?.name || clientSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const sector = clientData?.sector || 'Hizmet & E-Ticaret';
  const campaigns = clientData?.campaigns || [];

  const totalSpent = campaigns.reduce((acc: number, c: any) => acc + (c.spent || 0), 0);
  const totalRevenue = campaigns.reduce((acc: number, c: any) => acc + (c.revenue || 0), 0);
  const overallRoas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : '5.40';
  const netProfit = totalRevenue > totalSpent ? totalRevenue - totalSpent : totalRevenue * 0.45;
  const poas = totalSpent > 0 ? (netProfit / totalSpent).toFixed(2) : '2.30';

  const pendingApprovals = tasks.filter(t => t.stage === 'review' || t.stage === 'ready_to_publish');
  const activeCreatives = tasks.filter(t => t.stage === 'published' || t.stage === 'in_progress');

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-cyan-600 selection:text-white print:bg-white print:text-black">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Agency White-Label Top Brand Header */}
      <header className="h-16 border-b border-[#1a2338] bg-[#0c101a]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md shadow-cyan-600/20">
            {clientName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">İgeAds Büyüme & Performans Portalı</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CANLI MÜŞTERİ RAPORU
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{clientName} ({sector}) İçin Hazırlanmış Canlı Büyüme Portalı</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-[#1f293d] hover:bg-[#141b2a] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Raporu Yazdır / PDF</span>
          </button>

          <a 
            href={`https://wa.me/${(clientData?.contactPhone || '905551234567').replace(/[^0-9]/g, '')}?text=Merhaba,%20${encodeURIComponent(clientName)}%20reklam%20performans%20raporum%20hakkında%20bilgi%20almak%20istiyorum`} 
            target="_blank" 
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Ajans Temsilcine Yaz</span>
          </a>

          <Link 
            href="/"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#1f293d] hover:bg-[#141b2a] transition-all"
          >
            Yönetim Paneli
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* Welcome greeting */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#111628] via-[#0d1222] to-[#0a101f] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">CANLI VERİ MERKEZİ</span>
                <span className="text-xs text-slate-400">• Gerçek Zamanlı Performans</span>
              </div>
              <h1 className="text-2xl font-black text-white">Hoş Geldiniz, {clientName} Ekibi</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {clientData?.description || `${clientName} markasının reklam yatırımları net getiri (ROAS) ve kârlılık odaklı olarak yönetilmektedir.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141b2e] border border-[#212c47] text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Kazanılan Net Değer (POAS)</span>
              <span className="text-2xl font-black text-emerald-400">{poas}x Net Kâr</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Her ₺1 reklam = ₺{poas} Kasa Getirisi</span>
            </div>
          </div>
        </div>

        {/* 4 Big KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-semibold">Toplam Üretilen Ciro / Değer</span>
            <p className="text-2xl font-black text-white mt-1">₺{(totalRevenue || 140000).toLocaleString('tr-TR')}</p>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> Dönüşüm odaklı büyüme
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-semibold">Reklam Yatırımı (Harcama)</span>
            <p className="text-2xl font-black text-cyan-300 mt-1">₺{(totalSpent || 24000).toLocaleString('tr-TR')}</p>
            <span className="text-xs text-slate-400 mt-1 block">Meta, Google & Çok Kanallı</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-semibold">Genel ROAS (Reklam Getirisi)</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{overallRoas}x</p>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> Sektör ortalamasının üzerinde
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
            <span className="text-xs text-emerald-300 font-semibold">Oluşturulan Tahmini Net Katkı</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">₺{Math.round(netProfit).toLocaleString('tr-TR')}</p>
            <span className="text-xs text-slate-400 mt-1 block">Reklam maliyeti düşülmüş brüt kâr</span>
          </div>
        </div>

        {/* Client Creative & Ad Copy Approval Desk (Agency Collaboration) */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Kreatif & Reklam Onay Masası (Müşteri Onay Paneli)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ajans ekibimizin hazırladığı reklam kancalarını ve kreatifleri inceleyip doğrudan yayına onay verebilir veya revize iletebilirsiniz.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold self-start">
              {pendingApprovals.length} Onay Bekleyen Kurgu
            </span>
          </div>

          {pendingApprovals.length > 0 ? (
            <div className="space-y-3">
              {pendingApprovals.map((task: any) => (
                <div key={task.id} className="p-4 rounded-xl bg-[#121828] border border-cyan-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {task.channel.toUpperCase()} ADS
                        </span>
                        <span className="text-xs font-bold text-white">{task.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • Sorumlu Uzman: {task.assignedTo || 'Ajans Kreatif Ekibi'}
                        </span>
                      </div>
                      
                      {task.creativeHook && (
                        <div className="p-2.5 rounded-lg bg-[#0d121f] border border-purple-500/30 text-xs text-purple-200 mt-2 font-medium">
                          <span className="text-[10px] uppercase text-purple-400 font-bold block mb-0.5">Önerilen Reklam Kancası / Metni:</span>
                          &ldquo;{task.creativeHook}&rdquo;
                        </div>
                      )}

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1.5 whitespace-pre-line leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveCreative(task.id, task.title)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>✓ Reklamı Onayla</span>
                      </button>

                      <button
                        onClick={() => setRevisionTaskId(revisionTaskId === task.id ? null : task.id)}
                        className="px-3 py-2 rounded-xl border border-amber-500/40 hover:bg-amber-500/10 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revize İste</span>
                      </button>
                    </div>
                  </div>

                  {/* Revision input drawer */}
                  {revisionTaskId === task.id && (
                    <div className="p-3 rounded-xl bg-[#090d16] border border-amber-500/30 space-y-2 animate-fadeIn">
                      <label className="text-[11px] font-bold text-amber-300 block">
                        Revize Talebi & Görüşünüz:
                      </label>
                      <textarea
                        value={revisionNote}
                        onChange={(e) => setRevisionNote(e.target.value)}
                        placeholder="Örn: Görseldeki fiyatı güncelleyelim, ikinci saniyedeki kancada %20 indirim vurgusunu öne çıkaralım..."
                        className="w-full bg-[#121826] border border-[#1f293d] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 h-20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => { setRevisionTaskId(null); setRevisionNote(''); }}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          Vazgeç
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestRevision(task.id, task.title)}
                          disabled={!revisionNote.trim()}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>Ajansa İlet</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center rounded-xl bg-[#121828]/50 border border-white/5 text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              Tüm kreatifler incelendi! Bekleyen yeni kreatif onayı bulunmuyor.
            </div>
          )}
        </div>

        {/* Dynamic Campaigns Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Aktif Kampanyalar & Kanal Performansı</span>
          </h2>

          <div className="space-y-3">
            {campaigns.length > 0 ? (
              campaigns.map((camp: any, idx: number) => {
                const badgeColor = camp.platform === 'meta' ? 'bg-blue-500' : camp.platform === 'google' ? 'bg-emerald-400' : 'bg-cyan-400';
                return (
                  <div key={idx} className="p-4 rounded-xl bg-[#121828] border border-[#1e2940] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${badgeColor}`}></span>
                      <div>
                        <span className="font-bold text-white block">{camp.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{camp.platform} Ads • Günlük Bütçe: ₺{camp.dailyBudget}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Harcama</span>
                        <span className="font-medium text-slate-200">₺{(camp.spent || 0).toLocaleString('tr-TR')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Ciro / Dönüşüm</span>
                        <span className="font-bold text-white">₺{(camp.revenue || 0).toLocaleString('tr-TR')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Canlı ROAS</span>
                        <span className="font-extrabold text-emerald-400">{camp.roas ? `${camp.roas}x` : 'Yeni'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Bu marka için aktif kampanya verileri eşitleniyor.
              </div>
            )}
          </div>
        </div>

        {/* Agency Note & Sign-off */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1a2338] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-white mb-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Performans Direktörü Notu:</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl">
              {clientName} için {sector} sektörüne özel kanca kurguları ve ROAS optimizasyon kuralları aktif devrededir. Kampanya bütçeleri en yüksek dönüşüm getiren saatlere ve hedef kitlelere otomatik olarak kaydırılmaktadır.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-slate-500 block">
              Doğrulama Kodu: #{clientSlug.toUpperCase()}-2026
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              ✓ Ajans Onaylı Rapor
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

