'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Search,
  Sparkles,
  Phone,
  User,
  Copy,
  Check,
  BarChart3,
  FileText
} from 'lucide-react';
import AIExecutiveReportModal from './AIExecutiveReportModal';

export interface ClientData {
  id: string;
  name: string;
  slug: string;
  sector: string;
  description?: string;
  targetAudience?: string;
  monthlyBudget: number;
  currency: string;
  status: string;
  contactPerson?: string;
  contactPhone?: string;
  metaAccountId?: string;
  googleAdsId?: string;
  campaignCount: number;
  productCount: number;
  totalSpent: number;
  totalRevenue: number;
  roas: number;
}

interface ClientsHubProps {
  activeClientSlug: string;
  onSelectClient: (client: ClientData) => void;
  onNavigateToPortal?: (slug: string) => void;
}

export default function ClientsHub({ activeClientSlug, onSelectClient, onNavigateToPortal }: ClientsHubProps) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportClientSlug, setReportClientSlug] = useState('mandalinclean');

  // Form State for New Client
  const [formData, setFormData] = useState({
    name: '',
    sector: 'E-Ticaret & Perakende',
    description: '',
    targetAudience: '',
    monthlyBudget: '30000',
    contactPerson: '',
    contactPhone: '',
    metaAccountId: '',
    googleAdsId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setClients(json.data);
      }
    } catch (e) {
      console.error('Clients fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Lütfen marka veya müşteri adını girin.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          sector: 'E-Ticaret & Perakende',
          description: '',
          targetAudience: '',
          monthlyBudget: '30000',
          contactPerson: '',
          contactPhone: '',
          metaAccountId: '',
          googleAdsId: ''
        });
        await fetchClients();
        if (json.data) {
          onSelectClient(json.data);
        }
      } else {
        setFormError(json.error || 'Müşteri eklenirken hata oluştu.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Sunucu hatası.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`"${name}" markasını ve bağlı tüm kampanya verilerini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      await fetchClients();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const copyPortalLink = (slug: string) => {
    const url = `${window.location.origin}/portal/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalManagedBudget = clients.reduce((acc, c) => acc + c.monthlyBudget, 0);
  const totalSpent = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalRevenue = clients.reduce((acc, c) => acc + c.totalRevenue, 0);
  const overallRoas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AJANS İŞLETİM SİSTEMİ
            </span>
            <span className="text-xs text-slate-400">| Çoklu Marka & Müşteri Portföyü</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Müşteri & Marka Yönetim Merkezi</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ajansınızın yönettiği tüm markaları tek ekrandan izleyin, yeni müşteri ekleyin ve çalışanlarınız için hesapları anında izole edin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setReportClientSlug(activeClientSlug || 'mandalinclean');
              setIsReportModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#131b2e] hover:bg-[#1c2844] border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-950/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>✨ AI Yönetici Raporu Üret</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yeni Marka / Müşteri Ekle</span>
          </button>
        </div>
      </div>

      {/* Agency Portfolio KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Toplam Portföy</span>
          </div>
          <div className="text-xl font-extrabold text-white">{clients.length} Aktif Marka</div>
          <div className="text-[10px] text-cyan-400 font-medium">Bütün çalışanlar erişebilir</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yönetilen Aylık Bütçe</span>
          </div>
          <div className="text-xl font-extrabold text-white">₺{totalManagedBudget.toLocaleString('tr-TR')}</div>
          <div className="text-[10px] text-emerald-400 font-medium">Hedeflenen toplam reklam hacmi</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Oluşturulan Toplam Ciro</span>
          </div>
          <div className="text-xl font-extrabold text-white">₺{totalRevenue.toLocaleString('tr-TR')}</div>
          <div className="text-[10px] text-purple-400 font-medium">Tüm markaların toplam getirisi</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Ajans Ortalama ROAS</span>
          </div>
          <div className="text-xl font-extrabold text-amber-400">{overallRoas}x</div>
          <div className="text-[10px] text-amber-400/80 font-medium">Yüksek verimli portföy</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 glass-panel p-3 rounded-xl">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Marka adı veya sektör ile ara (Örn: Mandalin, Temizlik, Moda, Diş Kliniği)..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-white mr-2">
            Temizle
          </button>
        )}
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Markalar yükleniyor...</span>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 space-y-4 max-w-lg mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {clients.length === 0 ? 'Ajansınızın İlk Markasını Ekleyin' : 'Eşleşen Marka Bulunamadı'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {clients.length === 0 
                ? 'Sisteminiz tamamen sıfırlandı. Kendi ajans müşterilerinizi ekleyerek yapay zeka reklam, bütçe ve hakediş yönetimini hemen başlatabilirsiniz.' 
                : 'Aramanızla eşleşen marka yok. Arama filtrenizi temizleyebilir veya yeni marka ekleyebilirsiniz.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-cyan-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ İlk Markanızı / Müşterinizi Ekleyin</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const isActive = client.slug === activeClientSlug;
            return (
              <div 
                key={client.id}
                className={`glass-panel p-5 rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between border ${
                  isActive 
                    ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-[#141d30]' 
                    : 'border-white/5 hover:border-slate-700 bg-[#0e1422]'
                }`}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ŞU AN YÖNETİLEN</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Title & Sector */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {client.sector}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {client.campaignCount} Kampanya
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      <span>{client.name}</span>
                    </h3>
                    {client.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {client.description}
                      </p>
                    )}
                  </div>

                  {/* Financials Strip */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#090d16] border border-white/5 text-center">
                    <div>
                      <span className="text-[9px] text-slate-500 block">Aylık Bütçe</span>
                      <span className="text-xs font-bold text-slate-200">
                        ₺{(client.monthlyBudget / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">Harcanan</span>
                      <span className="text-xs font-bold text-cyan-400">
                        ₺{(client.totalSpent / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">Canlı ROAS</span>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {client.roas > 0 ? `${client.roas}x` : 'Yeni'}
                      </span>
                    </div>
                  </div>

                  {/* Contact & Integration Meta */}
                  <div className="space-y-1 text-[11px] text-slate-400 border-t border-white/5 pt-2.5">
                    {client.contactPerson && (
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{client.contactPerson}</span>
                      </div>
                    )}
                    {client.contactPhone && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{client.contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                      <span>Meta: {client.metaAccountId || 'Tanımlanmadı'}</span>
                      <span>•</span>
                      <span>Google: {client.googleAdsId || 'Tanımlanmadı'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectClient(client)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-600/20'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isActive ? 'Aktif Seçili' : 'Bu Markayı Yönet'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReportClientSlug(client.slug);
                      setIsReportModalOpen(true);
                    }}
                    title="Bu Marka İçin Gemini AI Yönetici Raporu Üret"
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">AI Raporu</span>
                  </button>

                  <button
                    onClick={() => copyPortalLink(client.slug)}
                    title="Müşteri Canlı Rapor Linkini Kopyala"
                    className="p-2 rounded-xl bg-[#141b2a] hover:bg-[#1c253b] text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer relative"
                  >
                    {copiedSlug === client.slug ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    title="Markayı Sil"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Yeni Müşteri / Marka Ekle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel bg-[#0d1322] border border-cyan-500/30 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 to-indigo-950/40">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Yeni Marka / Müşteri Ekle (Onboarding)</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Marka / İşletme Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Duru Diş Kliniği, Bella Home..."
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Sektör *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Temizlik & Koltuk Yıkama">Temizlik & Koltuk Yıkama</option>
                    <option value="E-Ticaret & Moda">E-Ticaret & Moda (Giyim/Aksesuar)</option>
                    <option value="Sağlık, Diş & Estetik Kliniği">Sağlık, Diş & Estetik Kliniği</option>
                    <option value="Mobilya & Ev Dekorasyon">Mobilya & Ev Dekorasyon</option>
                    <option value="B2B, Yazılım & Ajans">B2B, Yazılım & Ajans</option>
                    <option value="Güzellik Merkezi & Kuaför">Güzellik Merkezi & Kuaför</option>
                    <option value="Restoran & Gıda">Restoran & Gıda</option>
                    <option value="Gayrimenkul & İnşaat">Gayrimenkul & İnşaat</option>
                    <option value="Otomotiv & Yedek Parça">Otomotiv & Yedek Parça</option>
                    <option value="Diğer Hizmet Sektörü">Diğer Hizmet Sektörü</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Marka / Hizmet Özeti</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Markanın sattığı ürünler veya sunduğu hizmetin öne çıkan tarafları (Yapay zeka bu veriyi kanca ve reklam üretirken kullanacaktır)..."
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Aylık Reklam Bütçesi (₺)</label>
                  <input
                    type="number"
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Hedef Kitle Özeti</label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Örn: Kadınlar 25-45 yaş, İstanbul sakinleri..."
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Müşteri Yetkilisi Adı</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Örn: Ahmet Bey"
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">İletişim / WhatsApp Telefonu</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="Örn: +90 532 000 00 00"
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Meta Reklam Hesabı ID (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    value={formData.metaAccountId}
                    onChange={(e) => setFormData({ ...formData, metaAccountId: e.target.value })}
                    placeholder="Örn: act_987654321"
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Google Ads Müşteri ID (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    value={formData.googleAdsId}
                    onChange={(e) => setFormData({ ...formData, googleAdsId: e.target.value })}
                    placeholder="Örn: 123-456-7890"
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Kaydediliyor...' : 'Markayı Portföye Ekle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Executive Report Modal */}
      <AIExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultClientSlug={reportClientSlug}
        clients={clients}
      />
    </div>
  );
}
