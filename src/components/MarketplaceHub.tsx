'use client';

import React, { useState } from 'react';
import { 
  Store, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Calculator,
  Zap,
  Sliders
} from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { MarketplaceProduct } from '../types';

export default function MarketplaceHub() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const toggleAutoHalt = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, autoHaltAdsOnLowStock: !p.autoHaltAdsOnLowStock };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            <span>Pazaryeri & Stok & Net Kâr Matrisi</span>
          </h1>
          <p className="text-xs text-slate-400">
            Trendyol, Amazon, Hepsiburada, İdefix ve N11 envanterini anlık eşitleyin; komisyon, kargo ve COGS sonrası net kârınızı koruyun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleSyncAll}
            className="px-4 py-2 rounded-xl bg-[#141b2a] hover:bg-[#1a2338] text-xs font-semibold text-slate-200 hover:text-white border border-[#212b42] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Tüm Pazaryerlerini Eşitle'}</span>
          </button>
        </div>
      </div>

      {/* Platform Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { name: 'Trendyol', color: 'border-amber-500/40 text-amber-400', active: products.length > 0, products: `${products.length} Aktif İlan`, ordersToday: '0 Sipariş' },
          { name: 'Amazon TR', color: 'border-yellow-500/40 text-yellow-400', active: products.length > 0, products: `${products.length} Aktif İlan`, ordersToday: '0 Sipariş' },
          { name: 'Hepsiburada', color: 'border-orange-500/40 text-orange-400', active: products.length > 0, products: `${products.length} Aktif İlan`, ordersToday: '0 Sipariş' },
          { name: 'İdefix', color: 'border-blue-500/40 text-blue-400', active: products.length > 0, products: `${products.length} Aktif İlan`, ordersToday: '0 Sipariş' },
          { name: 'N11', color: 'border-rose-500/40 text-rose-400', active: products.length > 0, products: `${products.length} Aktif İlan`, ordersToday: '0 Sipariş' },
        ].map((plat, idx) => (
          <div key={idx} className="glass-panel p-3.5 rounded-xl border border-[#1f293d]">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-extrabold ${plat.color}`}>{plat.name}</span>
              <span className={`w-2 h-2 rounded-full ${plat.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
            </div>
            <p className="text-xs font-bold text-white mb-0.5">{plat.ordersToday}</p>
            <p className="text-[10px] text-slate-400">{plat.products}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Products Table & Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Products & Channels Stock */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Çok Kanallı Ürün & Stok Listesi</h2>
              <p className="text-xs text-slate-400">Ürün seçerek sağdaki Net Kâr & Komisyon simülatörünü çalıştırın.</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Toplam {products.length} Model Listeleniyor
            </span>
          </div>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-[#1e273b] rounded-xl bg-[#0e1320]/40">
                <Store className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">Henüz Listelenen Pazaryeri Ürünü Yok</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Trendyol, Amazon veya Hepsiburada mağazanızı bağladığınızda ürünler ve stoklar burada anlık listelenecektir.
                </p>
              </div>
            ) : (
              products.map((prod) => {
                const totalStock = prod.salesChannels.reduce((acc, c) => acc + c.stock, 0);
                const isCritical = totalStock < 20;
                const isSelected = selectedProduct?.id === prod.id;

                return (
                  <div 
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#151c2e] border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-lg' 
                        : 'bg-[#121624] border-[#1e273b] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white">{prod.title}</h3>
                          <p className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-emerald-400">Net Kâr: ₺{prod.netMargin}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Kâr Marjı: %{prod.netMarginPercentage}</p>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          isCritical 
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {totalStock} Adet Stok
                        </span>
                      </div>
                    </div>

                    {/* Marketplace Badges Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#1a2338] text-[11px]">
                      {prod.salesChannels.map((ch, idx) => (
                        <div key={idx} className="bg-[#0e1320] p-2 rounded-lg border border-[#1a2338]">
                          <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="capitalize font-semibold text-slate-300">{ch.channel}</span>
                            <span className="text-[10px] text-amber-400">%{ch.commissionRate} Kom.</span>
                          </div>
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-white">₺{ch.price}</span>
                            <span className={ch.stock <= 5 ? 'text-rose-400' : 'text-slate-300'}>
                              {ch.stock} Adet
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Auto-Halt Ad Toggle */}
                    <div className="flex items-center justify-between mt-3 pt-2 text-xs">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span>Stok &lt; 10 Adet Düştüğünde Bağlı Reklamları Otomatik Durdur</span>
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAutoHalt(prod.id);
                        }}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer ${
                          prod.autoHaltAdsOnLowStock 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {prod.autoHaltAdsOnLowStock ? 'Otonom Kural Aktif' : 'Devre Dışı'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Net Profit & Commission Breakdown Calculator */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          {selectedProduct ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Gerçek Net Kâr Analizörü (POAS)</h3>
                  <p className="text-[11px] text-slate-400">Pazaryeri komisyonu ve giderlerin net dökümü</p>
                </div>
              </div>

              <div className="bg-[#121828] border border-[#1f293d] rounded-xl p-3.5 mb-4">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">İncelenen Ürün:</span>
                <p className="text-xs font-bold text-white line-clamp-1">{selectedProduct.title}</p>
              </div>

              {/* Financial Line Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#1a2338]">
                  <span className="text-slate-400">Ortalama Satış Fiyatı:</span>
                  <span className="font-bold text-white">₺{selectedProduct.salesChannels[0]?.price || 0}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#1a2338]">
                  <span className="text-slate-400">Pazaryeri Komisyonu (Ort. %18):</span>
                  <span className="font-semibold text-rose-400">
                    -₺{((selectedProduct.salesChannels[0]?.price || 0) * 0.18).toFixed(0)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#1a2338]">
                  <span className="text-slate-400">Ürün Maliyeti (COGS):</span>
                  <span className="font-semibold text-rose-400">-₺{selectedProduct.cogs}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#1a2338]">
                  <span className="text-slate-400">Kargo & Paketleme Masrafı:</span>
                  <span className="font-semibold text-rose-400">-₺{selectedProduct.shippingCost}</span>
                </div>

                <div className="flex items-center justify-between py-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 px-3 mt-3">
                  <span className="text-emerald-300 font-bold">Birim Başına Net Cebe Kalan:</span>
                  <span className="text-base font-black text-emerald-400">
                    +₺{selectedProduct.netMargin}
                  </span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Yapay Zeka Fiyat & Reklam Önerisi:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bu üründe en düşük komisyon <strong>İdefix (%14)</strong> ve <strong>Amazon (%15)</strong> kanallarında. Meta reklam trafiğinizi Trendyol yerine doğrudan kendi sitenize veya Amazon&apos;a yönlendirirseniz sipariş başına <strong>₺88 daha fazla net kâr</strong> elde edersiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center my-auto">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Gerçek Net Kâr Analizörü (POAS)</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Pazaryeri komisyonu ve giderlerin net dökümünü hesaplamak için soldan bir ürün seçin veya mağazanızı bağlayın.
              </p>
            </div>
          )}

          <button className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-cyan-600/25 transition-all cursor-pointer">
            Fiyat ve Komisyon Ayarlarını Güncelle
          </button>
        </div>
      </div>
    </div>
  );
}
