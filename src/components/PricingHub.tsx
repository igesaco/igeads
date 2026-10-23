'use client';

import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck, CreditCard, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PLANS, type PlanId } from '../lib/plans';

interface SubscriptionInfo {
  organization: {
    name: string;
    plan: string;
    planStatus: 'trialing' | 'active' | 'expired';
    billingCycle: string;
    daysLeft: number | null;
    endsAt: string | null;
  };
  payments: { id: string; plan: string; billingCycle: string; amount: number; status: string; createdAt: string }[];
  paymentsEnabled: boolean;
  canManageBilling: boolean;
}

const PLAN_ORDER: PlanId[] = ['starter', 'growth', 'agency'];

export default function PricingHub() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null);
  const [billing, setBilling] = useState({ fullName: '', phone: '', identityNumber: '', city: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result of the iyzico redirect (?odeme=basarili|basarisiz)
  const [paymentResult] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const result = params.get('odeme');
    return result ? { ok: result === 'basarili', reason: params.get('neden') } : null;
  });

  useEffect(() => {
    fetch('/api/subscription')
      .then(r => r.json())
      .then(json => { if (json.success) setInfo(json.data); })
      .catch(() => {});
  }, []);

  const startCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPlan) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: checkoutPlan, cycle: isAnnual ? 'annual' : 'monthly', billing })
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Ödeme başlatılamadı');
        return;
      }
      window.location.href = json.data.paymentPageUrl;
    } catch (err: any) {
      setError(err.message || 'Sunucuya ulaşılamadı');
    } finally {
      setSubmitting(false);
    }
  };

  const org = info?.organization;
  const statusText = !org ? '' :
    org.planStatus === 'trialing' ? `Ücretsiz deneme: ${org.daysLeft ?? 0} gün kaldı` :
    org.planStatus === 'active' ? `${PLANS[org.plan as PlanId]?.name || org.plan} aktif${org.endsAt ? ` (${new Date(org.endsAt).toLocaleDateString('tr-TR')} tarihine kadar)` : ''}` :
    'Deneme süresi veya abonelik sona erdi';

  return (
    <div className="space-y-8 animate-fade-in">
      {paymentResult && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
          paymentResult.ok ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
        }`}>
          {paymentResult.ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="font-bold">
            {paymentResult.ok ? 'Ödemeniz alındı, paketiniz aktif.' : `Ödeme tamamlanmadı${paymentResult.reason ? `: ${paymentResult.reason}` : '.'}`}
          </span>
        </div>
      )}

      <div className="text-center space-y-3">
        {org && (
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold border ${
            org.planStatus === 'expired' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
          }`}>
            {statusText}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-black text-white">Paketler & Abonelik</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Fiyatlara KDV dahildir. Abonelik kendiliğinden yenilenmez; dönem bitince yeniden ödeme yaparak devam edersiniz.
        </p>

        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-[#121828] border border-[#1f293d] mt-2">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isAnnual ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aylık Ödeme
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAnnual ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Yıllık Ödeme</span>
            <span className="text-[10px] px-1.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">%20 İNDİRİM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_ORDER.map(id => {
          const p = PLANS[id];
          const popular = id === 'growth';
          const monthly = isAnnual ? p.annualMonthlyPrice : p.monthlyPrice;
          const isCurrent = org?.planStatus === 'active' && org.plan === id;

          return (
            <div
              key={id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                popular
                  ? 'bg-gradient-to-b from-[#161c30] to-[#0f1424] border-2 border-indigo-500 shadow-2xl shadow-indigo-950/60'
                  : 'glass-panel border-[#1f293d]'
              }`}
            >
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  En çok tercih edilen
                </div>
              )}

              <div>
                <h3 className="text-base font-extrabold text-white mb-2">{p.name}</h3>
                <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">{p.description}</p>

                <div className="pb-5 border-b border-[#1c263c]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white">₺{monthly.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-slate-400">/ ay</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Yıllık ₺{(p.annualMonthlyPrice * 12).toLocaleString('tr-TR')} tek ödeme
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 my-6 text-xs text-slate-300">
                  {p.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-slate-200">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => { setCheckoutPlan(id); setError(null); }}
                disabled={!info?.canManageBilling}
                title={info && !info.canManageBilling ? 'Paketi yalnızca hesap sahibi veya yönetici değiştirebilir' : undefined}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  popular
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white'
                    : 'bg-[#182033] hover:bg-[#202b44] text-white border border-[#2b3752]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isCurrent ? 'Süreyi Uzat' : 'Bu Paketi Seç'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={startCheckout} className="w-full max-w-md bg-[#0e1322] border border-indigo-500/40 rounded-2xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white">
              {PLANS[checkoutPlan].name} · {isAnnual ? 'Yıllık' : 'Aylık'} · ₺{(isAnnual ? PLANS[checkoutPlan].annualMonthlyPrice * 12 : PLANS[checkoutPlan].monthlyPrice).toLocaleString('tr-TR')}
            </h3>
            <p className="text-slate-400">Fatura bilgileriniz. Kart bilgilerinizi bir sonraki adımda iyzico&apos;nun güvenli sayfasına gireceksiniz.</p>
            {([
              ['fullName', 'Ad Soyad / Yetkili', true],
              ['phone', 'Telefon', false],
              ['identityNumber', 'T.C. Kimlik No veya Vergi No', false],
              ['city', 'Şehir', true],
              ['address', 'Fatura Adresi', true]
            ] as const).map(([key, label, required]) => (
              <div key={key}>
                <label className="block text-slate-400 mb-1">{label}{required ? ' *' : ''}</label>
                <input
                  required={required}
                  value={billing[key]}
                  onChange={e => setBilling({ ...billing, [key]: e.target.value })}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
            <p className="text-[11px] text-slate-500">
              Devam ederek <a href="/yasal/mesafeli-satis" target="_blank" className="text-indigo-400 hover:underline">mesafeli satış sözleşmesini</a> ve{' '}
              <a href="/yasal/iade" target="_blank" className="text-indigo-400 hover:underline">iptal ve iade koşullarını</a> kabul etmiş olursunuz.
            </p>
            {error && <p className="text-rose-400 font-medium">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCheckoutPlan(null)} className="px-4 py-2 rounded-xl bg-[#141b2b] text-slate-400 hover:text-white cursor-pointer">
                İptal
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white disabled:opacity-60 cursor-pointer">
                {submitting ? 'Yönlendiriliyor...' : 'Ödemeye Geç'}
              </button>
            </div>
          </form>
        </div>
      )}

      {info && info.payments.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 text-xs">
          <h3 className="text-sm font-bold text-white mb-3">Ödeme Geçmişi</h3>
          <table className="w-full text-left">
            <thead className="text-slate-500">
              <tr><th className="py-1">Tarih</th><th>Paket</th><th>Dönem</th><th>Tutar</th><th>Durum</th></tr>
            </thead>
            <tbody className="text-slate-300">
              {info.payments.map(p => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="py-1.5">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>{PLANS[p.plan as PlanId]?.name || p.plan}</td>
                  <td>{p.billingCycle === 'annual' ? 'Yıllık' : 'Aylık'}</td>
                  <td>₺{p.amount.toLocaleString('tr-TR')}</td>
                  <td className={p.status === 'paid' ? 'text-emerald-400' : 'text-rose-400'}>{p.status === 'paid' ? 'Ödendi' : 'Başarısız'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1a2338] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>Yeni hesaplar 14 gün ücretsiz deneme ile başlar; deneme için kart gerekmez.</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span>{info?.paymentsEnabled === false ? 'Online ödeme yakında' : 'iyzico 3D Secure güvenli ödeme'}</span>
        </div>
      </div>
    </div>
  );
}
