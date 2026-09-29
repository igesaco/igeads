'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Building2, 
  Store,
  CheckCircle2
} from 'lucide-react';

export default function PricingHub() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter KOBİ',
      badge: 'Giriş Seviyesi',
      monthlyPrice: 1490,
      annualPrice: 1190,
      description: 'Tek bir pazaryeri veya web mağazası olan butik işletmeler için.',
      features: [
        '1 E-Ticaret Mağazası (Trendyol veya Site)',
        'Meta Ads & Google Ads Entegrasyonu',
        'Temel Stok Kalkanı (Stok < 5 Reklamı Durdur)',
        'Klasik ROAS ve Ciro Takibi',
        'E-Posta Desteği'
      ],
      cta: 'Starter Planı Seç',
      popular: false
    },
    {
      id: 'growth',
      name: 'Growth Pro',
      badge: 'EN ÇOK TERCİH EDİLEN',
      monthlyPrice: 3990,
      annualPrice: 3190,
      description: 'Hızla ölçeklenen e-ticaret markaları ve agresif büyüyen mağazalar için.',
      features: [
        'Tüm Pazaryerleri (Trendyol, Amazon, HB, İdefix, N11)',
        'Tüm Reklam Ağları (Meta, Google, TikTok, ChatGPT Ads)',
        'POAS (Net Kâr / Reklam Harcaması) Motoru',
        'Tersine Rakip Reklam Radarı & AI Karşı Hamle',
        '30 Günlük Dinamik İçerik Takvimi & AI Kancalar',
        'Ghost Marketer AI Sabah Brifingi (Sesli)',
        'WhatsApp & SMS Omni Remarketing Akışları'
      ],
      cta: 'Growth Pro İle Ölçeklen',
      popular: true
    },
    {
      id: 'agency',
      name: 'Agency Scale & White-Label',
      badge: 'AJANSLAR İÇİN ÖZEL',
      monthlyPrice: 8990,
      annualPrice: 7190,
      description: 'Birden çok müşterisi olan dijital pazarlama ajansları ve medya ekipleri için.',
      features: [
        'Sınırsız Müşteri / Marka Çalışma Alanı (Multi-Tenant)',
        'Özel Domainli White-Label Canlı Müşteri Portalları',
        'Ajans Logonuz ve Kurumsal Renklerinizle Raporlama',
        'Gelişmiş Otonom Kural Motoru (Sınırsız Kural)',
        'AI Otonom Medya Satın Alıcı (1-Click Multi-Ads)',
        'Öncelikli API Çağrı Limiti & Özel Müşteri Temsilcisi'
      ],
      cta: 'Ajans Lisansını Başlat',
      popular: false
    }
  ];

  const handleCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlan(null);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          ESNEK SAAS PLANLARI
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          İşletmenizi ve Ajansınızı Otonom Yapay Zeka ile Büyütün
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Tek bir aracın fiyatına; reklam yöneticisi, pazaryeri entegratörü, rakip casusu ve yapay zeka içerik ekibine sahip olun.
        </p>

        {/* Annual / Monthly Toggle */}
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
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
              %20 İNDİRİM
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {paymentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-center gap-2 animate-fade-in shadow-xl shadow-emerald-950/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">Aboneliğiniz Başarıyla Aktifleştirildi! İgeAds PRO yetkileriniz tanımlandı.</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const price = isAnnual ? p.annualPrice : p.monthlyPrice;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'bg-gradient-to-b from-[#161c30] to-[#0f1424] border-2 border-indigo-500 shadow-2xl shadow-indigo-950/60 ring-2 ring-indigo-500/20'
                  : 'glass-panel border-[#1f293d] hover:border-slate-600'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                  {!p.popular && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">
                  {p.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 pb-5 border-b border-[#1c263c]">
                  <span className="text-3xl font-black text-white">₺{price.toLocaleString('tr-TR')}</span>
                  <span className="text-xs text-slate-400">/ ay</span>
                  {isAnnual && (
                    <span className="text-[10px] text-emerald-400 font-semibold ml-2">
                      (Yıllık Faturalandırılır)
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 my-6 text-xs text-slate-300">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-slate-200">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => handleCheckout(p.id)}
                disabled={selectedPlan === p.id}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  p.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-[#182033] hover:bg-[#202b44] text-white border border-[#2b3752]'
                }`}
              >
                {selectedPlan === p.id ? (
                  <span>Ödeme İşleniyor...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{p.cta}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-5 rounded-2xl bg-[#0e1320] border border-[#1a2338] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>
            <strong>14 Gün Koşulsuz İade Garantisi:</strong> İgeAds ile reklam kârlılığınızı artıramazsanız tek tıkla tam iade alabilirsiniz.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span>İyzico 3D Secure / Stripe Güvenli Ödeme</span>
        </div>
      </div>
    </div>
  );
}
