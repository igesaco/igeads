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
  onLoginSuccess: (userData: { name: string; email: string; role: string; type: 'agency' | 'business' }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<'agency' | 'business'>('business');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: name || (isLogin ? 'Ahmet Yılmaz' : 'Yeni Kullanıcı'),
        email: email || 'ahmet@velvetcouture.com',
        role: accountType === 'agency' ? 'Ajans Direktörü' : 'E-Ticaret Yöneticisi',
        type: accountType
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0c101a] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#161c2c] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

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
            {isLogin ? 'Pazaryeri ve reklam yönetim konsolunuza erişin' : '30 gün ücretsiz deneyin, kart gerekmez'}
          </p>
        </div>

        {/* Account Type Toggle */}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Giriş Yapılıyor...</span>
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
                onClick={() => setIsLogin(false)} 
                className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                Hemen Ücretsiz Kayıt Olun
              </button>
            </span>
          ) : (
            <span>
              Zaten hesabınız var mı?{' '}
              <button 
                onClick={() => setIsLogin(true)} 
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
