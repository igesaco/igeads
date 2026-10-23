'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  canClose?: boolean;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout, canClose = true, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [accountType, setAccountType] = useState<'agency' | 'business'>('business');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin
          ? { email, password }
          : { name, email, password, organizationName: brandName, accountType, acceptTerms })
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Giriş yapılamadı');
        return;
      }
      setPassword('');
      onLoginSuccess(json.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sunucuya ulaşılamadı');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-sm bg-[#0c101a] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#161c2c] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black text-white">Oturum açık</h2>
          </div>
          <p className="text-xs text-slate-300">{currentUser.name}</p>
          <p className="text-xs text-slate-500 mb-5">{currentUser.email}</p>
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 font-bold text-white text-xs cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0c101a] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        {canClose && <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#161c2c] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-white">İgeAds SaaS</span>
          </div>
          <h2 className="text-lg font-black text-white">
            {isLogin ? 'Hesabınıza Giriş Yapın' : 'Büyümeye Bugün Başlayın'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isLogin ? 'Pazaryeri ve reklam yönetim konsolunuza erişin' : '14 gün ücretsiz deneyin, kart gerekmez'}
          </p>
        </div>

        {/* Account Type Toggle */}
        {!isLogin && (
        <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-[#121828] rounded-xl border border-[#1f2a40]">
          <button
            type="button"
            onClick={() => setAccountType('business')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              accountType === 'business'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>E-Ticaret / İşletme</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('agency')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              accountType === 'agency'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Dijital Ajans</span>
          </button>
        </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {!isLogin && (
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Adınız Soyadınız:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {accountType === 'agency' ? 'Ajans Adı:' : 'Marka / Mağaza Adı:'}
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder={accountType === 'agency' ? 'Nova Medya Ajansı' : 'Velvet Couture'}
                  className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1 font-medium">E-Posta Adresi:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmet@sirketiniz.com"
                className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Şifre:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141b2b] border border-[#212b42] rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {!isLogin && (
            <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 accent-indigo-500"
              />
              <span>
                <a href="/yasal/kullanim-kosullari" target="_blank" className="text-indigo-400 hover:underline">Kullanım koşullarını</a> ve{' '}
                <a href="/yasal/kvkk" target="_blank" className="text-indigo-400 hover:underline">KVKK aydınlatma metnini</a> okudum, kabul ediyorum.
              </span>
            </label>
          )}

          {!isLogin && password.length > 0 && password.length < 8 && (
            <p className="text-amber-400 text-[11px]">Şifre en az 8 karakter olmalı.</p>
          )}

          {error && (
            <p className="text-rose-400 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>{isLogin ? 'Giriş Yapılıyor...' : 'Hesap Oluşturuluyor...'}</span>
            ) : (
              <>
                <span>{isLogin ? 'Konsola Giriş Yap' : 'Hesabımı Oluştur'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle login / signup */}
        <div className="mt-5 pt-4 border-t border-[#1c263c] text-center text-xs text-slate-400">
          {isLogin ? (
            <span>
              Hesabınız yok mu?{' '}
              <button 
                onClick={() => { setIsLogin(false); setError(null); }} 
                className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                Hemen Ücretsiz Kayıt Olun
              </button>
            </span>
          ) : (
            <span>
              Zaten hesabınız var mı?{' '}
              <button 
                onClick={() => { setIsLogin(true); setError(null); }} 
                className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                Giriş Yapın
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
