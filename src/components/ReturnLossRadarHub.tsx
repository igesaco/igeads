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
  riskScore: number; // 0 - 100
  riskReason: string;
  status: 'pending' | 'verified' | 'cancelled';
}

export default function ReturnLossRadarHub() {
  const [activeSubTab, setActiveSubTab] = useState<'high_risk' | 'sku_analysis' | 'auto_shields'>('high_risk');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  const [orders, setOrders] = useState<HighRiskOrder[]>([
    {
      id: 'ord-101',
      orderNumber: '#TR-89421',
      customerName: 'B***** Y*****',
      phone: '+90 532 *** ** 19',
      city: 'Gaziantep / Şahinbey',
      product: 'Hakiki Deri Biker Ceket (Beden: XL)',
      amount: '₺2.199',
      paymentMethod: 'Kapıda Ödeme',
      riskScore: 88,
      riskReason: 'Son 6 ayda 4 teslim alınmayan kargo geçmişi + Kapıda nakit ödeme',
      status: 'pending'
    },
    {
      id: 'ord-102',
      orderNumber: '#TR-89422',
      customerName: 'E*** K***',
      phone: '+90 541 *** ** 84',
      city: 'Adana / Seyhan',
      product: 'Minimalist Deri Sırt Çantası',
      amount: '₺1.190',
      paymentMethod: 'Kapıda Ödeme',
      riskScore: 74,
      riskReason: 'Aynı adrese son 48 saatte 3 farklı isimle sipariş girildi',
      status: 'pending'
    },
    {
      id: 'ord-103',
      orderNumber: '#TR-89423',
      customerName: 'M**** S*****',
      phone: '+90 555 *** ** 41',
      city: 'İstanbul / Ümraniye',
      product: 'Kaşmir Karışımlı Kazak (Beden: M)',
      amount: '₺890',
      paymentMethod: 'Kredi Kartı',
      riskScore: 32,
      riskReason: 'Düşük risk. İlk sipariş, doğrulanmış 3D Secure işlemi',
      status: 'verified'
    },
    {
      id: 'ord-104',
      orderNumber: '#TR-89424',
      customerName: 'S**** A****',
      phone: '+90 505 *** ** 02',
      city: 'Diyarbakır / Bağlar',
      product: 'Hakiki Deri Biker Ceket (Beden: L)',
      amount: '₺2.199',
      paymentMethod: 'Kapıda Ödeme',
      riskScore: 92,
      riskReason: 'Kargo adresinde sokak/bina numarası eksik + Ulaşılamayan telefon',
      status: 'pending'
    }
  ]);

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
            <div className="text-base font-extrabold text-emerald-400">₺24.860 <span className="text-[10px] text-slate-400 font-normal">(142 Sipariş)</span></div>
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
          <div className="text-2xl font-black text-white">%8,4</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>↓ %3.8 Sektör ortalamasının altında (%14.2)</span>
          </div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Aylık Çift Yönlü Kargo Maliyeti</span>
            <Truck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">₺18.420</div>
          <div className="text-[11px] text-slate-400 mt-1">Ort. iade kargo maliyeti: ₺130/adet</div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Yüksek Riskli Siparişler</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">3 Bekleyen</div>
          <div className="text-[11px] text-slate-400 mt-1">Onay bekleyen toplam: ₺5.588</div>
        </div>

        <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Otomatik WhatsApp Onayı</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">%94,1</div>
          <div className="text-[11px] text-slate-400 mt-1">112 şüpheli sipariş doğrulandı</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c263c] pb-3">
        <button
          onClick={() => setActiveSubTab('high_risk')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'high_risk'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-[#141a29] text-slate-400 hover:text-white border border-[#20293d]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Şüpheli & Yüksek Riskli Siparişler ({orders.filter(o => o.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sku_analysis')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'sku_analysis'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-[#141a29] text-slate-400 hover:text-white border border-[#20293d]'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ürün Bazlı İade & Zarar Analitiği</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auto_shields')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'auto_shields'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-[#141a29] text-slate-400 hover:text-white border border-[#20293d]'
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
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Kargoya vermeden önce onaylanması gereken 3 şüpheli işlem var</span>
            </div>
          </div>

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
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold ${
                          order.riskScore > 75 ? 'text-rose-400' : order.riskScore > 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          %{order.riskScore}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${order.riskScore > 75 ? 'bg-rose-500' : order.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${order.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 max-w-xs text-slate-300 text-[11px]">
                      <div className="flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{order.riskReason}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      {order.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(order.id, 'verified')}
                            className="px-2.5 py-1 rounded bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1"
                            title="Siparişi Doğrula ve Kargola"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Kargola</span>
                          </button>
                          <button
                            onClick={() => handleAction(order.id, 'cancelled')}
                            className="px-2.5 py-1 rounded bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1"
                            title="Şüpheli Siparişi İptal Et (Kargo Zararını Önle)"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>İptal Et</span>
                          </button>
                        </div>
                      ) : order.status === 'verified' ? (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğrulandı
                        </span>
                      ) : (
                        <span className="text-[11px] text-rose-400 font-bold flex items-center justify-end gap-1">
                          <XCircle className="w-3.5 h-3.5" /> İptal Edildi
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: SKU Level Analysis */}
      {activeSubTab === 'sku_analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>En Çok İade Edilen ve Kargo Zararı Veren Ürünler</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#131929] rounded-xl border border-[#20293d] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Hakiki Deri Biker Ceket</div>
                  <div className="text-[11px] text-slate-400">Ana İade Nedeni: %68 Beden Uyumsuzluğu (Kalıp Dar)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-rose-400">%14.8 İade</div>
                  <div className="text-[10px] text-slate-400">₺11.440 Kargo Kaybı</div>
                </div>
              </div>

              <div className="p-3 bg-[#131929] rounded-xl border border-[#20293d] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Kaşmir Karışımlı Slim Kazak</div>
                  <div className="text-[11px] text-slate-400">Ana İade Nedeni: %42 Renk Tonu Farkı (Stüdyo Işığı)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-amber-400">%8.2 İade</div>
                  <div className="text-[10px] text-slate-400">₺4.160 Kargo Kaybı</div>
                </div>
              </div>

              <div className="p-3 bg-[#131929] rounded-xl border border-[#20293d] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Minimalist Sırt Çantası</div>
                  <div className="text-[11px] text-slate-400">Ana İade Nedeni: Beden sorunu yok, sadece %1.2 iade</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">%3.1 İade</div>
                  <div className="text-[10px] text-slate-400">₺1.820 Kargo Kaybı</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0e1322] border border-[#1d263b] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Yapay Zeka Aksiyon Önerileri (Kâr Artırıcı)</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
                <div className="text-xs font-bold text-indigo-300 mb-1">1. Biker Ceket İçin Beden Asistanı Pop-up'ı Aç</div>
                <p className="text-[11px] text-slate-300">
                  Kullanıcı ceket satın alırken "Boy & Kilo" sorarak 1 beden büyük almasını önerin. Bu aksiyon iade oranını %14.8'den %4.5'e indirecektir.
                </p>
                <button className="mt-2.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-all">
                  Beden Asistanını Aktif Et
                </button>
              </div>

              <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl">
                <div className="text-xs font-bold text-rose-300 mb-1">2. Kapıda Ödemede ₺49 Ek Hizmet Bedeli Koy</div>
                <p className="text-[11px] text-slate-300">
                  Kapıda ödemelerdeki teslim almama oranı %22.4. Ek ₺49 provizyon ücreti veya ön SMS onayı gerektirerek ciddiyetsiz siparişleri filtreleyin.
                </p>
                <button className="mt-2.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold transition-all">
                  Kuralı Uygula
                </button>
              </div>
            </div>
          </div>
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
                  Risk skoru %70 üzeri olan veya Kapıda Ödeme seçen müşterilere kargoya verilmeden önce otomatik WhatsApp butonuyla "Siparişinizi onaylıyor musunuz?" mesajı atar.
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
