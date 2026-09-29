'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Zap, 
  Flame,
  ShieldCheck,
  Store
} from 'lucide-react';

interface LiveWarRoomHubProps {
  activeClientName?: string;
}

export default function LiveWarRoomHub({ activeClientName = '' }: LiveWarRoomHubProps) {
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('all');
  const [liveSales, setLiveSales] = useState<any[]>([]);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [activeCartCount, setActiveCartCount] = useState(0);
  const [liveViewers, setLiveViewers] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [availableClients, setAvailableClients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          setAvailableClients(d.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeClientName && activeClientName !== 'all') {
      const match = availableClients.find(c => c.name.toLowerCase() === activeClientName.toLowerCase());
      if (match) setSelectedBrandSlug(match.slug);
    }
  }, [activeClientName, availableClients]);

  const fetchStats = async () => {
    try {
      const query = selectedBrandSlug !== 'all' ? `?clientSlug=${selectedBrandSlug}` : '';
      const res = await fetch(`/api/war-room${query}`);
      const json = await res.json();
      if (json?.data) {
        setLiveViewers(json.data.currentVisitors || 0);
        setActiveCartCount(json.data.activeCarts || 0);
        setTodayRevenue(json.data.todayGrossRevenue || 0);
        if (Array.isArray(json.data.liveSalesTicker)) {
          setLiveSales(json.data.liveSalesTicker.map((s: any) => ({
            ...s,
            amount: typeof s.amount === 'number' ? `₺${s.amount.toLocaleString('tr-TR')}` : s.amount
          })));
        }
        if (Array.isArray(json.data.cityHeatmap)) {
          setCitiesData(json.data.cityHeatmap.map((c: any) => ({
            city: c.city,
            percentage: `%${c.percentage}`,
            orders: `${c.orders} Sipariş/Talep`,
            revenue: `₺${c.revenue.toLocaleString('tr-TR')}`
          })));
        }
      }
    } catch (err) {
      console.warn('War room fetch:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedBrandSlug]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              CANLI YAYIN (LIVE WAR ROOM)
            </span>
            <span className="text-xs text-slate-400">| Gerçek Zamanlı Sipariş & Ciro Radarı</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            <span>E-Ticaret Canlı Satış & Ciro Haritası</span>
          </h1>
          <p className="text-xs text-slate-400">
            Pazaryerlerinden ve web sitenizden düşen siparişleri, anlık ciro hızını ve şehir bazlı ısı haritasını canlı izleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Selector */}
          <select
            value={selectedBrandSlug}
            onChange={(e) => setSelectedBrandSlug(e.target.value)}
            className="bg-[#121828] border border-rose-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-400 cursor-pointer shadow-md"
          >
            <option value="all">🏢 Tüm Portföy</option>
            {availableClients.map(c => (
              <option key={c.id} value={c.slug}>🏢 {c.name} ({c.sector})</option>
            ))}
          </select>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/50 text-slate-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>API Dinleniyor</span>
          </div>
        </div>
      </div>

      {/* Live Active Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-rose-500/30">
          <span className="text-xs font-semibold text-rose-300">Anlık Aktif Mağaza Ziyaretçisi</span>
          <p className="text-3xl font-black text-white mt-1 flex items-center gap-2">
            <span>{liveViewers}</span>
            <span className="text-xs text-slate-400 font-normal">Kişi</span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Tüm platformlarda gezinen kitle</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/30">
          <span className="text-xs font-semibold text-amber-300">Şu An Ödeme Aşamasındaki Sepetler</span>
          <p className="text-3xl font-black text-white mt-1">{activeCartCount} Sepet</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Aktif Sepet Hareketleri</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Bugünkü Toplam Ciro</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">₺{todayRevenue.toLocaleString('tr-TR')}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Canlı Entegrasyon Siparişleri</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama Sepet Tutarı (AOV)</span>
          <p className="text-3xl font-black text-indigo-300 mt-1">₺0</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Sipariş Kaydı Bekleniyor</span>
        </div>
      </div>

      {/* Main Split: Live Order Feed & City Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Order Stream Ticker */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Canlı Sipariş Akışı (Gerçek Zamanlı Ticker)</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              API DİNLENİYOR
            </span>
          </div>

          {liveSales.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0e1320]/40">
              <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Henüz Canlı Sipariş Akışı Yok</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                Trendyol, Amazon veya web mağazanız API entegrasyonu ile bağlandığında saniye saniye düşen siparişler, sepet tutarları ve atıf kanalları burada canlı olarak akacaktır.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveSales.map((sale) => (
                <div 
                  key={sale.id}
                  className="p-3.5 rounded-xl bg-[#121828] border border-[#1e2940] hover:border-rose-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      <Store className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sale.product}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#182033] text-slate-300 border border-[#2b3752]">
                          {sale.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{sale.city}</span>
                        <span>•</span>
                        <span>Atıf Kaynağı: <strong className="text-indigo-400">{sale.source}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-emerald-400">{sale.amount}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{sale.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Top Cities Heatmap Breakdown */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Şehir Bazlı Satış Isı Dağılımı</span>
              </h2>
            </div>

            {citiesData.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">Bölgesel Sipariş Verisi Bekleniyor</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Siparişler geldikçe şehir bazlı satış oranları ve bütçe optimizasyon önerileri burada haritalanacaktır.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {citiesData.map((c, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{c.city}</span>
                      <span className="font-bold text-cyan-400">{c.percentage}</span>
                    </div>
                    
                    <div className="w-full bg-[#161e31] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full"
                        style={{ width: c.percentage }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{c.orders}</span>
                      <span className="font-semibold text-slate-300">{c.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1a2338]">
            <p className="text-[11px] text-slate-400">
              💡 <strong>AI Bütçe Tavsiyesi:</strong> Satış hacminiz oluştukça yapay zeka en yüksek dönüşüm getiren illeri tespit edip bütçe dağıtım önerisi sunacaktır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
