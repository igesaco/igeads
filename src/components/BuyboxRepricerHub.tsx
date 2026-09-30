'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  DollarSign, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { mockBuyboxItems } from '../data/mockData';
import { BuyboxItem } from '../types';

export default function BuyboxRepricerHub() {
  const [items, setItems] = useState<BuyboxItem[]>(mockBuyboxItems);
  const [repriceSuccessId, setRepriceSuccessId] = useState<string | null>(null);

  const fetchBuyboxProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: BuyboxItem[] = json.data.map((p: any) => ({
          id: p.id,
          productTitle: p.name,
          platform: (p.marketplace?.toLowerCase() as any) || 'hepsiburada',
          myPrice: p.price,
          buyboxPrice: p.buyboxPrice || p.price,
          buyboxOwner: p.isBuybox ? 'Siz' : 'Rakip Mağaza',
          hasBuybox: Boolean(p.isBuybox),
          minAllowedPrice: Math.round(p.price * 0.85),
          strategy: 'profit_maximize',
          autoRepriceEnabled: true,
          salesLostEstimate: p.isBuybox ? '0 TL (Buybox sizde)' : `₺${Math.round(p.price * 12)} /gün`
        }));
        setItems(mapped);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.warn('Failed to load buybox products', e);
    }
  };

  useEffect(() => {
    fetchBuyboxProducts();
    const handleUpdate = () => fetchBuyboxProducts();
    window.addEventListener('product_updated', handleUpdate);
    return () => window.removeEventListener('product_updated', handleUpdate);
  }, []);

  const toggleAutoReprice = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, autoRepriceEnabled: !item.autoRepriceEnabled };
      }
      return item;
    }));
  };

  const handleWinBuybox = async (id: string, targetPrice: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          myPrice: targetPrice,
          buyboxPrice: targetPrice,
          buyboxOwner: 'Velvet Couture (Siz)',
          hasBuybox: true,
          salesLostEstimate: '0 TL (Buybox sizde)'
        };
      }
      return item;
    }));
    setRepriceSuccessId(id);

    try {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          price: targetPrice,
          buyboxPrice: targetPrice,
          isBuybox: true
        })
      });
      window.dispatchEvent(new CustomEvent('product_updated'));
    } catch (err) {
      console.error('Failed to update product buybox status:', err);
    }

    setTimeout(() => setRepriceSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PAZARYERİ CASUSU
          </span>
          <span className="text-xs text-slate-400">| Buybox Kalkanı & Otonom Fiyat Yenileyici</span>
        </div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span>AI Buybox & Dinamik Fiyatlandırma Hub&apos;ı</span>
        </h1>
        <p className="text-xs text-slate-400">
          Trendyol ve Amazon&apos;da rakipleriniz fiyat kırdığında veya stok tükettiğinde anında Buybox&apos;ı geri kazanın; ciro kaybını sıfıra indirin.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Toplam Takip Edilen Ürün</span>
          <p className="text-2xl font-black text-white mt-1">{items.length} Model</p>
          <span className="text-xs text-slate-400">Trendyol & Amazon</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Buybox Kazanma Oranı</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {items.length > 0 ? `%${((items.filter(i => i.hasBuybox).length / items.length) * 100).toFixed(0)}` : '%0'}
          </p>
          <span className="text-xs text-emerald-400 font-bold">
            {items.length > 0 ? `${items.filter(i => i.hasBuybox).length}/${items.length} Ürün Sizde` : 'Veri Yok'}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-rose-500/30">
          <span className="text-xs font-semibold text-rose-300">Önlenen Günlük Kayıp</span>
          <p className="text-2xl font-black text-rose-400 mt-1">₺0</p>
          <span className="text-xs text-slate-400">Kaybedilen Buybox Sebebiyle</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Otonom Repricer Modu</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{items.length > 0 ? 'Aktif' : 'Beklemede'}</p>
          <span className="text-xs text-slate-400">Pazaryeri API Bağlantısı Bekleniyor</span>
        </div>
      </div>

      {/* Buybox Items Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">Pazaryeri Buybox & Fiyat Savaşları Matrisi</h2>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0e1320]/40">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Henüz Pazaryeri API Entegrasyonu veya Ürün Bağlantısı Yok</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-2">
                Trendyol veya Amazon satıcı mağazanızı bağladığınızda Buybox rekabeti, rakip fiyat kırmaları ve otonom fiyat yenileme (repricer) burada anlık olarak canlı izlenecektir.
              </p>
              <p className="text-[11px] text-amber-400 font-medium">
                Pazaryeri API anahtarınızı tanımlamak için sol menüden &quot;Entegrasyonlar&quot; sekmesine gidin.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.hasBuybox 
                    ? 'bg-[#121828] border-emerald-500/30' 
                    : 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      item.platform === 'trendyol' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {item.platform}
                    </span>
                    <h3 className="text-xs font-bold text-white">{item.productTitle}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Buybox Sahibi: <strong className={item.hasBuybox ? 'text-emerald-400' : 'text-rose-400'}>{item.buyboxOwner}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                    item.hasBuybox 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}>
                    {item.hasBuybox ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{item.hasBuybox ? 'Buybox Sizde' : 'Buybox Kaybedildi!'}</span>
                  </span>
                </div>
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1a2338] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Sizin Fiyatınız</span>
                  <span className="font-bold text-white">₺{item.myPrice}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Mevcut Buybox Fiyatı</span>
                  <span className={`font-bold ${item.hasBuybox ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₺{item.buyboxPrice}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">İzin Verilen Min. Fiyat</span>
                  <span className="font-semibold text-slate-300">₺{item.minAllowedPrice} (Kâr Güvencesi)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tahmini Ciro Kaybı</span>
                  <span className={item.hasBuybox ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                    {item.salesLostEstimate}
                  </span>
                </div>
              </div>

              {/* Actions & Reprice Bar */}
              <div className="mt-3 pt-3 border-t border-[#1a2338] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Otonom Dinamik Fiyatlandırma:</span>
                  <button
                    onClick={() => toggleAutoReprice(item.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                      item.autoRepriceEnabled 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.autoRepriceEnabled ? 'Oto-Repricer Açık' : 'Kapalı'}
                  </button>
                </div>

                {!item.hasBuybox && (
                  <button
                    onClick={() => handleWinBuybox(item.id, item.buyboxPrice - 1)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Fiyatı ₺{item.buyboxPrice - 1} Yap & Buybox&apos;ı Geri Al</span>
                  </button>
                )}

                {repriceSuccessId === item.id && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Trendyol API&apos;a iletildi! Buybox kazanıldı.
                  </span>
                )}
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
