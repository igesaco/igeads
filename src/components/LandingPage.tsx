'use client';

import React from 'react';
import { Zap, Megaphone, Store, Sparkles, Users, FileText, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { PLANS, TRIAL_DAYS, type PlanId } from '../lib/plans';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const FEATURES = [
  { icon: Megaphone, title: 'Reklam hesapları tek ekranda', text: 'Meta reklam hesabınızı bağlayın; kampanya harcaması, ciro ve ROAS otomatik gelsin.' },
  { icon: Store, title: 'Pazaryeri stok ve fiyat', text: 'Trendyol ve Hepsiburada ürünlerinizi, stok ve fiyatlarıyla tek listede izleyin.' },
  { icon: Sparkles, title: 'Yapay zeka ile kreatif', text: 'Ürününüz için reklam metni, video kancası ve ürün görseli dakikalar içinde hazır.' },
  { icon: FileText, title: 'Tek tıkla müşteri raporu', text: 'Harcama ve ciro verisinden yönetici özeti ve WhatsApp mesajı hazırlanır.' },
  { icon: Users, title: 'Ekip ve onay akışı', text: 'Görevleri ekibinize atayın, kreatifleri müşteriniz kendi portalından onaylasın.' },
  { icon: ShieldCheck, title: 'Her hesap ayrı ve güvenli', text: 'Verileriniz ve API anahtarlarınız yalnızca sizin hesabınızda, şifreli oturumla korunur.' }
];

const PLAN_ORDER: PlanId[] = ['starter', 'growth', 'agency'];

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-lg text-white">İgeAds</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={onLogin} className="px-4 py-2 rounded-xl text-slate-300 hover:text-white cursor-pointer">Giriş Yap</button>
          <button onClick={onRegister} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white cursor-pointer">
            Ücretsiz Dene
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          Reklam, pazaryeri ve kreatif işleriniz tek panelde
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
          E-ticaret markaları ve dijital ajanslar için: Meta reklamlarınızı, Trendyol ve Hepsiburada mağazanızı izleyin,
          yapay zeka ile kreatif üretin, müşterinize hazır rapor gönderin.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={onRegister} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white text-sm flex items-center gap-2 cursor-pointer">
            {TRIAL_DAYS} gün ücretsiz başla <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500">Kart gerekmez</span>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="glass-panel rounded-2xl p-5 space-y-2">
              <Icon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.text}</p>
            </div>
          );
        })}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-6">
        <h2 className="text-2xl font-black text-white text-center">Paketler</h2>
        <p className="text-xs text-slate-400 text-center">Aylık fiyatlar, KDV dahil. Yıllık ödemede %20 indirim.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_ORDER.map(id => {
            const p = PLANS[id];
            return (
              <div key={id} className={`rounded-2xl p-6 space-y-4 ${id === 'growth' ? 'border-2 border-indigo-500 bg-[#11172a]' : 'glass-panel'}`}>
                <div>
                  <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                  <p className="text-[11px] text-slate-400">{p.description}</p>
                </div>
                <div className="text-3xl font-black text-white">₺{p.monthlyPrice.toLocaleString('tr-TR')}<span className="text-xs text-slate-400 font-normal"> / ay</span></div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {p.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />{feat}</li>
                  ))}
                </ul>
                <button onClick={onRegister} className="w-full py-2.5 rounded-xl bg-[#182033] hover:bg-indigo-600 border border-[#2b3752] font-bold text-white text-xs cursor-pointer">
                  Ücretsiz Dene
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} İgeAds</span>
          <nav className="flex flex-wrap gap-4">
            <a href="/yasal/kullanim-kosullari" className="hover:text-white">Kullanım Koşulları</a>
            <a href="/yasal/kvkk" className="hover:text-white">KVKK</a>
            <a href="/yasal/mesafeli-satis" className="hover:text-white">Mesafeli Satış Sözleşmesi</a>
            <a href="/yasal/iade" className="hover:text-white">İptal ve İade</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
