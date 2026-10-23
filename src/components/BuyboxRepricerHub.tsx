'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle2, Zap, HelpCircle } from 'lucide-react';

interface BuyboxRow {
  id: string;
  title: string;
  platform: string;
  myPrice: number;
  buyboxPrice: number | null; // null = not reported by the marketplace
  hasBuybox: boolean | null; // null = unknown
  cogs: number | null;
  shippingCost: number | null;
  commissionRate: number | null;
}

/** Lowest price that still leaves a profit, when the seller has entered their costs */
function floorPrice(row: BuyboxRow): number | null {
  if (row.cogs === null || row.shippingCost === null) return null;
  const commission = (row.commissionRate ?? 20) / 100;
  return Math.ceil((row.cogs + row.shippingCost) / (1 - commission));
}

export default function BuyboxRepricerHub() {
  const [items, setItems] = useState<BuyboxRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; ok: boolean; text: string } | null>(null);

  const fetchBuyboxProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (Array.isArray(json?.data)) {
        setItems(json.data
          .filter((p: any) => /trendyol|hepsiburada/i.test(p.marketplace || ''))
          .map((p: any) => ({
            id: p.id,
            title: p.name,
            platform: p.marketplace,
            myPrice: p.price,
            // Buybox data exists only for products whose marketplace actually reported it
            buyboxPrice: p.buyboxCheckedAt ? p.buyboxPrice : null,
            hasBuybox: p.buyboxCheckedAt ? Boolean(p.isBuybox) : null,
            cogs: p.cogs ?? null,
            shippingCost: p.shippingCost ?? null,
            commissionRate: p.commissionRate ?? null
          })));
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

  const handleReprice = async (row: BuyboxRow, targetPrice: number) => {
    const floor = floorPrice(row);
    if (floor !== null && targetPrice < floor) {
      setMessage({ id: row.id, ok: false, text: `₺${targetPrice} maliyetinizin altında kalıyor (en az ₺${floor}).` });
      return;
    }
    if (!window.confirm(`${row.title} fiyatı ${row.platform} üzerinde ₺${targetPrice} olarak güncellensin mi?`)) return;

    setBusyId(row.id);
    setMessage(null);
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, price: targetPrice })
      });
      const json = await res.json();
      setMessage({ id: row.id, ok: Boolean(json.success), text: json.success ? json.message : (json.error || 'Fiyat güncellenemedi') });
      if (json.success) {
        setItems(prev => prev.map(i => i.id === row.id ? { ...i, myPrice: targetPrice } : i));
        window.dispatchEvent(new CustomEvent('product_updated'));
      }
    } catch (err: any) {
      setMessage({ id: row.id, ok: false, text: err.message || 'Sunucuya ulaşılamadı' });
    } finally {
      setBusyId(null);
    }
  };

  const known = items.filter(i => i.hasBuybox !== null);
  const winning = known.filter(i => i.hasBuybox).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span>Buybox & Fiyat Takibi</span>
        </h1>
        <p className="text-xs text-slate-400">
          Trendyol ve Hepsiburada ürünlerinizin Buybox durumunu izleyin, fiyatı buradan doğrudan pazaryerinde güncelleyin.
          Buybox bilgisi her &quot;Canlı Eşitle&quot;de pazaryerinden yeniden okunur.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Takip Edilen Ürün</span>
          <p className="text-2xl font-black text-white mt-1">{items.length}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-300">Buybox Sizde</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{known.length ? `${winning}/${known.length}` : '—'}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-rose-300">Buybox Kaybedilen</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{known.length ? known.length - winning : '—'}</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        {items.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Henüz pazaryeri ürünü yok</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Entegrasyonlar sayfasından Trendyol veya Hepsiburada mağazanızı bağlayıp &quot;Canlı Eşitle&quot;ye bastığınızda ürünleriniz burada listelenir.
            </p>
          </div>
        ) : items.map(item => {
          const floor = floorPrice(item);
          const suggested = item.buyboxPrice !== null && item.hasBuybox === false ? Math.max(item.buyboxPrice - 1, floor ?? 0) : null;
          return (
            <div key={item.id} className={`p-4 rounded-xl border ${
              item.hasBuybox === false ? 'border-rose-500/40 bg-rose-950/10' : item.hasBuybox ? 'border-emerald-500/20' : 'border-[#1f293d]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/30">{item.platform}</span>
                  <h3 className="text-xs font-bold text-white">{item.title}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  item.hasBuybox === null ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : item.hasBuybox ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {item.hasBuybox === null ? <HelpCircle className="w-3.5 h-3.5" /> : item.hasBuybox ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{item.hasBuybox === null ? 'Buybox bilgisi yok' : item.hasBuybox ? 'Buybox sizde' : 'Buybox başkasında'}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1a2338] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Sizin fiyatınız</span>
                  <span className="font-bold text-white">₺{item.myPrice.toLocaleString('tr-TR')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Buybox fiyatı</span>
                  <span className="font-bold text-white">{item.buyboxPrice !== null ? `₺${item.buyboxPrice.toLocaleString('tr-TR')}` : '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Zarar etmeyeceğiniz en düşük fiyat</span>
                  <span className="font-semibold text-slate-300">{floor !== null ? `₺${floor.toLocaleString('tr-TR')}` : 'Maliyet girilmedi'}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#1a2338] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                {suggested !== null ? (
                  <button
                    disabled={busyId === item.id}
                    onClick={() => handleReprice(item, suggested)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{busyId === item.id ? 'Gönderiliyor...' : `Fiyatı ₺${suggested.toLocaleString('tr-TR')} yap`}</span>
                  </button>
                ) : <span className="text-slate-500 text-[11px]">Fiyat değişikliği için Pazaryeri & Stok ekranındaki &quot;Düzenle&quot;yi kullanabilirsiniz.</span>}

                {message?.id === item.id && (
                  <span className={`text-[11px] font-bold ${message.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{message.text}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
