'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Truck, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Search, 
  Sliders, 
  MessageSquare, 
  PhoneCall, 
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';

interface HighRiskOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  product: string;
  amount: string;
  paymentMethod: 'Kapıda Ödeme' | 'Kredi Kartı';
  riskScore: number;
  riskReason: string;
  status: 'pending' | 'verified' | 'cancelled';
}

export default function ReturnLossRadarHub() {
  const [activeSubTab, setActiveSubTab] = useState<'high_risk' | 'sku_analysis' | 'auto_shields'>('high_risk');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<HighRiskOrder[]>([]);

  const [shieldSettings, setShieldSettings] = useState({
    autoWaVerify: true,
    blockSerialReturners: true,
    sizeAdvisorPrompt: true,
    minRiskThreshold: 75
  });

  const handleAction = (id: string, newStatus: 'verified' | 'cancelled') => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              KÂR KORUMA SİSTEMİ
            </span>
            <span className="text-xs text-slate-400">Çift Yönlü Kargo & İade Zarar Radarı</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Kargo & İade Zarar Kalkanı</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kapıda ödeme suistimallerini, hatalı beden iadelerini ve teslim alınmayan kargoları yapay zeka ile kargoya verilmeden önce engelleyin.
          </p>
        </div>

        {/* Global Impact Metric */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-rose-950/40 via-[#101524] to-emerald-950/30 p-3 rounded-xl border border-rose-500/30">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Bu Ay Engellenen Zarar</div>
            <div className="text-base font-extrabold text-emerald-400">₺0 <span className="text-[10px] text-slate-400 font-normal">(0 Sipariş)</span></div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Ortalama İade Oranı</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">%0</div>
          <div className="text-[11px] text-slate-400 mt-1">Sipariş verisi bekleniyor</div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Aylık Çift Yönlü Kargo Maliyeti</span>
            <Truck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">₺0</div>
          <div className="text-[11px] text-slate-400 mt-1">İade kargo kaydı yok</div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Yüksek Riskli Siparişler</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">0 Bekleyen</div>
          <div className="text-[11px] text-slate-400 mt-1">Onay bekleyen sipariş yok</div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Otomatik WhatsApp Onayı</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">%0</div>
          <div className="text-[11px] text-slate-400 mt-1">Teyit botu devrede</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c263c] pb-3">
        <button
          onClick={() => setActiveSubTab('high_risk')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === 'high_risk' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Şüpheli & Yüksek Riskli Siparişler ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sku_analysis')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === 'sku_analysis' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ürün Bazlı İade & Zarar Analitiği</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auto_shields')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === 'auto_shields' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Otomatik Koruma Kuralları & Botlar</span>
        </button>
      </div>

      {/* Tab 1: High Risk Orders */}
      {activeSubTab === 'high_risk' && (
        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Sipariş no, müşteri veya ürün ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#141a29] border border-[#20293d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Tüm gelen siparişler risk motoru tarafından taranıyor</span>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0c101a]/50">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Henüz Şüpheli veya İade Riski Taşıyan Sipariş Yok</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Pazaryeri ve e-ticaret mağazanız bağlandığında teslim alınmama riski yüksek siparişler, kapıda ödeme suistimalleri ve hatalı adresler burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1c263c] text-[11px] text-slate-400">
                    <th className="pb-3 font-semibold">Sipariş & Müşteri</th>
                    <th className="pb-3 font-semibold">Ürün & Tutar</th>
                    <th className="pb-3 font-semibold">Ödeme Türü</th>
                    <th className="pb-3 font-semibold">Risk Skoru</th>
                    <th className="pb-3 font-semibold">Yapay Zeka Tespit Nedeni</th>
                    <th className="pb-3 font-semibold text-right">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182033] text-xs">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#121829]/60 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{order.orderNumber}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({order.city})</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{order.customerName} • {order.phone}</div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="text-slate-200 font-medium">{order.product}</div>
                        <div className="text-emerald-400 font-bold">{order.amount}</div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          order.paymentMethod === 'Kapıda Ödeme' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="text-xs font-extrabold text-amber-400">
                          %{order.riskScore}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 max-w-xs text-slate-300 text-[11px]">
                        <div className="flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{order.riskReason}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        {order.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(order.id, 'verified')}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]"
                            >
                              Kargola
                            </button>
                            <button
                              onClick={() => handleAction(order.id, 'cancelled')}
                              className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-[11px]"
                            >
                              İptal Et
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-semibold">
                            {order.status === 'verified' ? 'Doğrulandı' : 'İptal Edildi'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SKU Level Analysis */}
      {activeSubTab === 'sku_analysis' && (
        <div className="p-12 text-center border border-dashed border-[#1f293d] rounded-2xl bg-[#0c101a]/50">
          <RotateCcw className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Ürün & İade Verisi Bekleniyor</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Mağazanızdaki ürün satış ve iade verileri sisteme aktarıldığında kalıp uyumsuzluğu, renk sapması ve beden kaynaklı iadeler burada ürün bazında raporlanacaktır.
          </p>
        </div>
      )}

      {/* Tab 3: Autonomous Shields */}
      {activeSubTab === 'auto_shields' && (
        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Otomatik Kalkan & Doğrulama Ayarları</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141a29] border border-[#20293d] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white mb-1">Otomatik WhatsApp Kargo Teyit Botu</div>
                <p className="text-[11px] text-slate-400">
                  Risk skoru %70 üzeri olan veya Kapıda Ödeme seçen müşterilere kargoya verilmeden önce otomatik WhatsApp butonuyla &quot;Siparişinizi onaylıyor musunuz?&quot; mesajı atar.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={shieldSettings.autoWaVerify}
                onChange={e => setShieldSettings({ ...shieldSettings, autoWaVerify: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 cursor-pointer mt-1"
              />
            </div>

            <div className="p-4 bg-[#141a29] border border-[#20293d] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white mb-1">Seri İade / Sahte Sipariş Engelleyici (Kara Liste)</div>
                <p className="text-[11px] text-slate-400">
                  Geçmişte kargoyu teslim almayarak kargo zararına yol açmış telefon numarası ve TC kimliklerini tespit eder, otomatik olarak kapıda ödemeyi kapatır.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={shieldSettings.blockSerialReturners}
                onChange={e => setShieldSettings({ ...shieldSettings, blockSerialReturners: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 cursor-pointer mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
