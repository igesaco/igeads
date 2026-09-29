'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquareShare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { mockRemarketingFlows } from '../data/mockData';
import { RemarketingFlow } from '../types';

interface RemarketingHubProps {
  activeClientName?: string;
}

export default function RemarketingHub({ activeClientName = '' }: RemarketingHubProps) {
  const [selectedBrand, setSelectedBrand] = useState('all');

  const brandFlowsMap: Record<string, RemarketingFlow[]> = {
    all: mockRemarketingFlows,
    mandalinclean: [
      {
        id: 'flow-mc-1',
        name: '🌧️ 6 Ay Öncesi Koltuk Temizliği Sadakat Hatırlatması',
        channel: 'whatsapp',
        trigger: 'Son Hizmet Tarihi > 180 Gün',
        sentCount: 1420,
        convertedCount: 312,
        revenueGenerated: 87400,
        status: 'active',
        messageTemplate: 'Merhaba {{isim}}, Mandalin Clean olarak koltuklarınızı en son 6 ay önce yıkamıştık! Kış öncesi evinizde ferah ve mikropsuz bir hava için eski müşterilerimize özel %15 indirim kuponunuz tanımlandı: TEMIZ15. Hemen randevu almak için bu mesaja "RANDEVU" yazabilirsiniz.'
      },
      {
        id: 'flow-mc-2',
        name: '⏳ Teklif Alıp Randevu Seçmeyenler (Eksik Slot Takibi)',
        channel: 'sms',
        trigger: 'Web Sitesi Fiyat Hesaplandı Ancak Randevu Onaylanmadı (3 Saat Sonra)',
        sentCount: 890,
        convertedCount: 178,
        revenueGenerated: 49800,
        status: 'active',
        messageTemplate: 'Mandalin Clean: Koltuk yikama fiyat teklifinizi aldiniz ancak randevunuz tamamlanmadi. Yarin icin mobil ekibimiz bolgenizde! Ucretsiz servis avantajini kacirmamak icin: https://mandalinclean.com/r'
      },
      {
        id: 'flow-mc-3',
        name: '⭐ Hizmet Sonrası 5 Yıldız Google Yorum Talebi',
        channel: 'whatsapp',
        trigger: 'Randevu Tamamlandıktan 2 Saat Sonra',
        sentCount: 650,
        convertedCount: 240,
        revenueGenerated: 24000,
        status: 'active',
        messageTemplate: 'Değerli müşterimiz, bugünkü buharlı koltuk yıkama hizmetimizden memnun kaldınız mı? Hizmet kalitemizi değerlendirmeniz bizim için çok kıymetli. Google Maps profilimize 30 saniyelik yorum yaparak bir sonraki temizliğinizde ₺200 hediye çeki kazanın: https://g.page/mandalin-clean/review'
      }
    ],
    igesaturkiye: [
      {
        id: 'flow-ige-1',
        name: '🎯 Amazon FBA Vaka Analizi İndiren B2B Takip Akışı',
        channel: 'email',
        trigger: 'Web Sitesinden PDF Vaka Raporu İndirildi (24 Saat Sonra)',
        sentCount: 420,
        convertedCount: 68,
        revenueGenerated: 340000,
        status: 'active',
        messageTemplate: 'Sayın {{isim}}, İndirdiğiniz "Türk Üreticilerin Amazon Amerika Başarı Hikayesi" rehberini incelediniz mi? Şirketinizin mevcut ürün kataloğunun Amazon ve Avrupa pazaryerlerindeki satış potansiyelini 15 dakikalık ücretsiz strateji görüşmemizde masaya yatıralım. Randevu: https://igeads.agency/cal'
      },
      {
        id: 'flow-ige-2',
        name: '📅 E-İhracat Semineri Sonrası Hızlı Başlangıç WhatsApp',
        channel: 'whatsapp',
        trigger: 'Canlı B2B Webinara Katılım Sağlandı (Ertesi Gün 10:00)',
        sentCount: 310,
        convertedCount: 52,
        revenueGenerated: 260000,
        status: 'active',
        messageTemplate: 'Merhaba {{isim}}, Dünkü e-ihracat ve Amazon büyüme webinarımıza katılımınız için teşekkürler. Etkinliğe özel ilk 3 ay %30 indirimli ajans yönetim kotamız açılmıştır. Kurucu ekibimizle öncelikli tanışma toplantısı planlamak için "BİLGİ" yazabilirsiniz.'
      },
      {
        id: 'flow-ige-3',
        name: '💼 Teklif Gönderilen Şirketler İçin Karar Destek SMS',
        channel: 'sms',
        trigger: 'Ajans Teklifi Gönderildi (3 Gün Yanıtsız Kaldı)',
        sentCount: 180,
        convertedCount: 38,
        revenueGenerated: 190000,
        status: 'active',
        messageTemplate: 'IgeAds: Sirketinize ozel hazirlanan Amazon FBA Buyume Stratejisi teklifimiz gunceldir. Sorularinizi cevaplamak ve yol haritasini baslatmak icin dogrudan kurucu hattimiz: 0850 888 44 32'
      }
    ],
    velvetcouture: [
      {
        id: 'flow-vc-1',
        name: '🧥 Terk Edilen Sepet - Hakiki Deri Ceket %10 VIP Kurtarma',
        channel: 'whatsapp',
        trigger: 'Sepete Eklendi Ancak 30 Dk İçinde Satın Alınmadı',
        sentCount: 2450,
        convertedCount: 512,
        revenueGenerated: 153600,
        status: 'active',
        messageTemplate: 'Merhaba {{isim}}, Velvet Couture sepetinizde unuttuğunuz Hakiki Kuzu Derisi Biker Ceket tükenmek üzere! Son 3 adet stok kaldı. Size özel %10 indirim kuponunuzu hemen tanımladık: VIPDERI10. Siparişinizi tamamlamak için tıklayın: https://velvetcouture.com/checkout'
      },
      {
        id: 'flow-vc-2',
        name: '📏 Beden Kararsızlığı Yaşayan Müşteriye Stil Danışmanı',
        channel: 'whatsapp',
        trigger: 'Ürün Sayfasında 3 Kez Beden Tablosu Tıklandı',
        sentCount: 1100,
        convertedCount: 280,
        revenueGenerated: 84000,
        status: 'active',
        messageTemplate: 'Stiliniz için en doğru bedeni bulmakta kararsız mı kaldınız? Boy ve kilonuzu bu mesaja yazın, Velvet Couture stil danışmanımız size özel en kusursuz kalıbı ve ölçüyü 2 dakikada önersin!'
      },
      {
        id: 'flow-vc-3',
        name: '✨ Sipariş Sonrası Özel Deri Bakım Kiti Çapraz Satış',
        channel: 'sms',
        trigger: 'Sipariş Kargoya Verildikten 24 Saat Sonra',
        sentCount: 1850,
        convertedCount: 420,
        revenueGenerated: 42000,
        status: 'active',
        messageTemplate: 'Velvet Couture: Hakiki deri montunuzun omur boyu ilk gunku parlakligini korumasi icin ozel Alman deri bakim cilamiz kargonuzla birlikte yari fiyatina! Kupon: CILA50 https://velvetcouture.com/care'
      }
    ]
  };

  useEffect(() => {
    if (!activeClientName || activeClientName === 'Tüm Müşteriler' || activeClientName === 'all') {
      setSelectedBrand('all');
    } else {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin')) setSelectedBrand('mandalinclean');
      else if (lower.includes('ige') || lower.includes('danışmanlık')) setSelectedBrand('igesaturkiye');
      else if (lower.includes('velvet') || lower.includes('couture')) setSelectedBrand('velvetcouture');
      else setSelectedBrand(lower);
    }
  }, [activeClientName]);

  const flows = brandFlowsMap[selectedBrand] || brandFlowsMap.all;
  const [selectedFlow, setSelectedFlow] = useState<RemarketingFlow>(flows[0]);
  const [simulatedPhone, setSimulatedPhone] = useState('0532 111 22 33');

  useEffect(() => {
    if (flows.length > 0) {
      setSelectedFlow(flows[0]);
    }
  }, [selectedBrand]);

  const toggleStatus = (id: string) => {
    // toggle local status
  };

  const totalRev = flows.reduce((acc, f) => acc + f.revenueGenerated, 0);
  const totalSent = flows.reduce((acc, f) => acc + (f.sentCount || 0), 0);
  const totalConv = flows.reduce((acc, f) => acc + (f.convertedCount || 0), 0);
  const avgConvRate = totalSent > 0 ? ((totalConv / totalSent) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              REMARKETING OTONOMİ
            </span>
            <span className="text-xs text-slate-400">
              {selectedBrand === 'mandalinclean' ? 'Mandalin Clean (Yerel Hizmet / Sadakat Akışları)' :
               selectedBrand === 'igesaturkiye' ? 'İgeAds (B2B E-İhracat / Danışmanlık Akışları)' :
               selectedBrand === 'velvetcouture' ? 'Velvet Couture (Lüks Giyim / Sepet Kurtarma)' :
               'Tüm Portföy Konsolide'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-emerald-400" />
            <span>Omni Remarketing (WhatsApp, SMS & E-Posta)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sepette bırakanları, pazaryeri müşterilerini ve sadık alıcıları yüksek dönüşümlü akıllı mesajlarla yeniden kazanın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Switcher Filter */}
          <div className="flex items-center bg-[#0d121f] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedBrand('mandalinclean')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'mandalinclean'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mandalin Clean
            </button>
            <button
              onClick={() => setSelectedBrand('igesaturkiye')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'igesaturkiye'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              İgeAds
            </button>
            <button
              onClick={() => setSelectedBrand('velvetcouture')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                selectedBrand === 'velvetcouture'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Velvet Couture
            </button>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
            <Zap className="w-3.5 h-3.5" />
            <span>Yeni Akış Başlat</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30">
          <span className="text-xs font-semibold text-slate-400">Kurtarılan Toplam Ciro</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-emerald-400">₺{totalRev.toLocaleString('tr-TR')}</span>
            <span className="text-xs font-bold text-emerald-400">+{flows.length} Aktif Akış</span>
          </div>
          <p className="text-[11px] text-slate-400">Terk edilen sepet ve sadakat mesajlarından geri dönen ciro.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Ortalama Mesaj Açılma Oranı</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-white">%88.3</span>
            <span className="text-xs font-bold text-indigo-400">WhatsApp & SMS</span>
          </div>
          <p className="text-[11px] text-slate-400">Klasik e-postaya göre 4.5 kat daha yüksek etkileşim.</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Geri Kazanım Dönüşüm Oranı</span>
          <div className="flex items-baseline gap-2 mt-1 mb-1">
            <span className="text-2xl font-black text-white">%{avgConvRate}</span>
            <span className="text-xs font-bold text-emerald-400">Siparişe Dönüştü</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Toplam {totalSent.toLocaleString('tr-TR')} mesajdan {totalConv.toLocaleString('tr-TR')} sipariş/randevu kazanıldı.
          </p>
        </div>
      </div>

      {/* Split: Flows List & Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Flows List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-4">Aktif Remarketing Akışları</h2>

          <div className="space-y-3">
            {flows.map((flow) => {
              const isSelected = selectedFlow.id === flow.id;

              return (
                <div 
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#151c2e] border-emerald-500/50 ring-1 ring-emerald-500/20' 
                      : 'bg-[#121624] border-[#1e273b] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        flow.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-400' :
                        flow.channel === 'sms' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {flow.channel === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> :
                         flow.channel === 'sms' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-white">{flow.name}</h3>
                        <p className="text-[11px] text-slate-400">Tetikleyici: {flow.delay}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(flow.id);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border cursor-pointer ${
                        flow.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {flow.status === 'active' ? <><Play className="w-2.5 h-2.5" /> Aktif</> : <><Pause className="w-2.5 h-2.5" /> Duraklatıldı</>}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1a2338] text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Açılma Oranı</span>
                      <span className="font-bold text-white">%{flow.openRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dönüşüm</span>
                      <span className="font-bold text-indigo-400">%{flow.conversionRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kazanılan Gelir</span>
                      <span className="font-bold text-emerald-400">₺{flow.revenueGenerated.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Smartphone Preview */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
          <div className="w-full mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Canlı Mesaj Simülatörü</span>
            <span className="text-[10px] text-emerald-400 uppercase font-bold">{selectedFlow.channel}</span>
          </div>

          {/* Phone Frame */}
          <div className="w-64 bg-[#0a0d14] border-4 border-[#222b40] rounded-[32px] p-3 shadow-2xl relative overflow-hidden">
            {/* Top Notch */}
            <div className="w-20 h-3 bg-[#222b40] rounded-full mx-auto mb-3"></div>

            {/* Message Bubble */}
            <div className="bg-[#121b2d] rounded-2xl p-3.5 border border-[#1f2c47] text-xs text-slate-100 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Velvet Couture (Doğrulanmış İşletme)</span>
              </div>

              <p className="text-xs leading-relaxed text-slate-200">
                {selectedFlow.messageTemplate
                  .replace('{{isim}}', 'Ahmet')
                  .replace('{{urun_adi}}', 'Hakiki Deri Biker Ceket')}
              </p>

              <span className="text-[9px] text-slate-400 block text-right">Şimdi iletildi • Okundu ✓✓</span>
            </div>

            {/* Action simulation */}
            <div className="mt-3">
              <div className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-center text-[10px] shadow-sm">
                Siparişi Tamamla & Kuponu Kullan
              </div>
            </div>

            {/* Bottom bar */}
            <div className="w-24 h-1 bg-[#374151] rounded-full mx-auto mt-6"></div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Pazaryeri ve sitenizdeki tüm terk edilmiş sepetlere bu mesaj otonom olarak iletilir.
          </p>
        </div>
      </div>
    </div>
  );
}
