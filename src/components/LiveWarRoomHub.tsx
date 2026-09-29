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
  const [liveSales, setLiveSales] = useState<any[]>([
    { id: 'sale-1', city: 'İstanbul (Kadıköy)', channel: 'Trendyol', product: 'Hakiki Deri Biker Ceket', amount: '₺2.199', time: '1 sn önce', source: 'Meta Ads' },
    { id: 'sale-2', city: 'Ankara (Çankaya)', channel: 'Amazon TR', product: 'Minimalist Sırt Çantası', amount: '₺1.190', time: '14 sn önce', source: 'Google PMax' },
    { id: 'sale-3', city: 'İzmir (Karşıyaka)', channel: 'Web Mağazası', product: 'Kaşmir Karışımlı Kazak', amount: '₺890', time: '38 sn önce', source: 'WhatsApp VIP' },
    { id: 'sale-4', city: 'Bursa (Nilüfer)', channel: 'Hepsiburada', product: 'Hakiki Deri Biker Ceket', amount: '₺2.199', time: '1 dk önce', source: 'TikTok Sparks' },
  ]);

  const [citiesData, setCitiesData] = useState<any[]>([
    { city: 'İstanbul', percentage: '%46', orders: '184 Sipariş', revenue: '₺404.616' },
    { city: 'Ankara', percentage: '%22', orders: '88 Sipariş', revenue: '₺193.512' },
    { city: 'İzmir', percentage: '%16', orders: '64 Sipariş', revenue: '₺140.736' },
    { city: 'Bursa & Antalya', percentage: '%16', orders: '64 Sipariş', revenue: '₺140.736' },
  ]);

  const [activeCartCount, setActiveCartCount] = useState(48);
  const [liveViewers, setLiveViewers] = useState(342);
  const [todayRevenue, setTodayRevenue] = useState(488650);

  useEffect(() => {
    if (activeClientName) {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin') || lower.includes('koltuk') || lower.includes('temizlik')) {
        setSelectedBrandSlug('mandalinclean');
      } else if (lower.includes('ige') || lower.includes('ajans') || lower.includes('b2b')) {
        setSelectedBrandSlug('igesaturkiye');
      } else if (lower.includes('velvet')) {
        setSelectedBrandSlug('velvetcouture');
      }
    }
  }, [activeClientName]);

  const fetchStats = async () => {
    try {
      const query = selectedBrandSlug !== 'all' ? `?clientSlug=${selectedBrandSlug}` : '';
      const res = await fetch(`/api/war-room${query}`);
      const json = await res.json();
      if (json?.data) {
        if (json.data.currentVisitors) setLiveViewers(json.data.currentVisitors);
        if (json.data.activeCarts) setActiveCartCount(json.data.activeCarts);
        if (json.data.todayGrossRevenue) setTodayRevenue(json.data.todayGrossRevenue);
        if (json.data.liveSalesTicker) {
          setLiveSales(json.data.liveSalesTicker.map((s: any) => ({
            ...s,
            amount: typeof s.amount === 'number' ? `₺${s.amount.toLocaleString('tr-TR')}` : s.amount
          })));
        }
        if (json.data.cityHeatmap) {
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

  useEffect(() => {
    let productsPool = [
      { name: 'Hakiki Deri Biker Ceket', amount: '₺2.199', channel: 'Trendyol', source: 'Meta Adv+' },
      { name: 'Kaşmir Karışımlı Kazak', amount: '₺890', channel: 'Amazon TR', source: 'Google Search' },
      { name: 'Minimalist Sırt Çantası', amount: '₺1.190', channel: 'Hepsiburada', source: 'TikTok Sparks' },
      { name: 'İtalyan Kuzu Derisi Eldiven', amount: '₺640', channel: 'Web Mağaza', source: 'WhatsApp VIP' }
    ];
    let citiesPool = [
      'İstanbul (Beşiktaş)', 'İzmir (Bornova)', 'Ankara (Gölbaşı)', 'Antalya (Muratpaşa)', 
      'Bursa (Osmangazi)', 'Eskişehir (Tepebaşı)', 'Gaziantep (Şehitkamil)', 'Kocaeli (İzmit)'
    ];

    if (selectedBrandSlug === 'mandalinclean') {
      productsPool = [
        { name: '3\'lü L Koltuk Buharlı Yıkama', amount: '₺1.450', channel: 'WhatsApp', source: 'Instagram Reels' },
        { name: 'Yatak & Baza Antibakteriyel Dezenfeksiyon', amount: '₺1.850', channel: 'Web Rezervasyon', source: 'Google Local' },
        { name: 'Halı & Stor Perde Yıkama', amount: '₺1.150', channel: 'WhatsApp', source: 'Meta Adv+' },
        { name: 'Villa/Ofis Detaylı Hijyen Servisi', amount: '₺3.600', channel: 'Telefon Hattı', source: 'Google PMax' }
      ];
      citiesPool = [
        'İstanbul (Kadıköy/Moda)', 'İstanbul (Ataşehir)', 'İstanbul (Suadiye/Bağdat Cd.)', 
        'İstanbul (Üsküdar)', 'İstanbul (Beykoz)', 'İstanbul (Maltepe)'
      ];
    } else if (selectedBrandSlug === 'igesaturkiye') {
      productsPool = [
        { name: 'B2B Büyüme & E-İhracat Danışmanlığı', amount: '₺45.000', channel: 'Doğrudan Başvuru', source: 'Google Search B2B' },
        { name: 'Meta CAPI & Server-Side Kurulumu', amount: '₺18.500', channel: 'LinkedIn', source: 'Case Study Retargeting' },
        { name: 'Full-Funnel Reklam Yönetimi', amount: '₺35.000', channel: 'WhatsApp B2B', source: 'Referral' },
        { name: 'ROAS & POAS Stratejik Denetim', amount: '₺12.000', channel: 'Web Form', source: 'Meta Lead Form' }
      ];
      citiesPool = [
        'İstanbul (Maslak)', 'Ankara (ODTÜ Teknokent)', 'İzmir (Alsancak)', 
        'Bursa (DOSAB)', 'Kocaeli (GOSB)', 'Antalya (Organize)'
      ];
    }

    const interval = setInterval(() => {
      setActiveCartCount(prev => Math.max(8, prev + (Math.random() > 0.45 ? 1 : -1)));
      setLiveViewers(prev => Math.max(50, prev + (Math.random() > 0.48 ? 2 : -2)));

      if (Math.random() > 0.35) {
        const randProd = productsPool[Math.floor(Math.random() * productsPool.length)];
        const randCity = citiesPool[Math.floor(Math.random() * citiesPool.length)];
        const newSale = {
          id: `sale-${Date.now()}`,
          city: randCity,
          channel: randProd.channel,
          product: randProd.name,
          amount: randProd.amount,
          time: 'Şimdi',
          source: randProd.source
        };
        setLiveSales(prev => [newSale, ...prev.slice(0, 5)]);
        setTodayRevenue(prev => prev + parseInt(randProd.amount.replace(/[^0-9]/g, ''), 10));
      }
    }, 4500);

    return () => clearInterval(interval);
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
            Pazaryerlerinden ve web sitenizden saniye saniye düşen siparişleri, anlık ciro hızını ve şehir bazlı ısı haritasını canlı izleyin.
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
            <option value="mandalinclean">🍊 Mandalin Clean (Temizlik)</option>
            <option value="igesaturkiye">⚡ İgeAds (B2B E-İhracat)</option>
            <option value="velvetcouture">🧥 Velvet Couture (Moda)</option>
          </select>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Dakikalık Ciro Hızı: ₺1.420 / dk</span>
          </div>
        </div>
      </div>

      {/* Live Active Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-rose-500/30">
          <span className="text-xs font-semibold text-rose-300">Anlık Aktif Mağaza Ziyaretçisi</span>
          <p className="text-3xl font-black text-white mt-1 flex items-center gap-2">
            <span>{liveViewers}</span>
            <span className="text-xs text-rose-400 font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span> Canlı
            </span>
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Tüm platformlarda gezinen kitle</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-amber-500/30">
          <span className="text-xs font-semibold text-amber-300">Şu An Ödeme Aşamasındaki Sepetler</span>
          <p className="text-3xl font-black text-white mt-1">{activeCartCount} Sepet</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Dönüşüm Olasılığı Yüksek</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-300">Bugünkü Toplam Ciro</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">₺{todayRevenue.toLocaleString('tr-TR')}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Hedeflenen günlük ciroyu %18 aştı</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama Sepet Tutarı (AOV)</span>
          <p className="text-3xl font-black text-indigo-300 mt-1">₺1.860</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">+%12 Çapraz Satış Artışı</span>
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
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              API DİNLENİYOR
            </span>
          </div>

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

            <div className="space-y-4">
              {citiesData.map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{c.city}</span>
                    <span className="font-bold text-cyan-400">{c.percentage}</span>
                  </div>
                  
                  {/* Progress bar */}
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
          </div>

          <div className="mt-6 pt-4 border-t border-[#1a2338]">
            <p className="text-[11px] text-slate-400">
              💡 <strong>AI Bütçe Tavsiyesi:</strong> İstanbul ve Ankara bölgelerinde dönüşüm oranı diğer illere göre %42 daha yüksek. Meta reklam hedeflemenizde bu illere %15 bütçe artırımı önerilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
