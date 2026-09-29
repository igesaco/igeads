'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  CheckCheck, 
  Phone, 
  User, 
  DollarSign, 
  Zap, 
  Tag, 
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface ChatConversation {
  id: string;
  customerName: string;
  phone: string;
  status: 'abandoned_cart' | 'product_inquiry' | 'vip' | 'shipping_query';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  cartProduct?: {
    name: string;
    price: string;
    size: string;
    stock: number;
  };
  messages: {
    sender: 'customer' | 'agent' | 'ai';
    text: string;
    time: string;
    hasPaymentLink?: boolean;
    paymentAmount?: string;
  }[];
}

interface WhatsAppLiveCommerceHubProps {
  activeClientName?: string;
}

export default function WhatsAppLiveCommerceHub({ activeClientName = '' }: WhatsAppLiveCommerceHubProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'chat-1',
      customerName: 'Melis Doğan',
      phone: '+90 533 *** ** 44',
      status: 'abandoned_cart',
      lastMessage: 'Merhaba ceket kalıbı dar mı acaba? Normalde M giyiyorum ama kararsız kaldım.',
      lastMessageTime: '12 sn önce',
      unreadCount: 1,
      cartProduct: {
        name: 'Hakiki Deri Biker Ceket',
        price: '₺2.199',
        size: 'Beden: M',
        stock: 3
      },
      messages: [
        { sender: 'agent', text: 'Merhaba Melis Hanım! Velvet Couture sepetinizdeki Hakiki Deri Ceket için size nasıl yardımcı olabiliriz?', time: '14:20' },
        { sender: 'customer', text: 'Merhaba ceket kalıbı dar mı acaba? Normalde M giyiyorum ama kararsız kaldım.', time: '14:22' }
      ]
    },
    {
      id: 'chat-2',
      customerName: 'Canberk Yılmaz',
      phone: '+90 542 *** ** 88',
      status: 'vip',
      lastMessage: 'Ödeme linki için teşekkürler, siparişi tamamladım!',
      lastMessageTime: '3 dk önce',
      unreadCount: 0,
      cartProduct: {
        name: 'Minimalist Deri Sırt Çantası',
        price: '₺1.190',
        size: 'Standart',
        stock: 8
      },
      messages: [
        { sender: 'customer', text: 'Tekrar merhaba, çanta için özel bir indirim tanımlayabilir misiniz?', time: '14:05' },
        { sender: 'ai', text: 'Canberk Bey, VIP üyemiz olduğunuz için size özel %10 indirimli hızlı ödeme linki oluşturdum: ₺1.071', time: '14:06', hasPaymentLink: true, paymentAmount: '₺1.071' },
        { sender: 'customer', text: 'Ödeme linki için teşekkürler, siparişi tamamladım!', time: '14:10' }
      ]
    },
    {
      id: 'chat-3',
      customerName: 'Ayşe Karaca',
      phone: '+90 505 *** ** 12',
      status: 'shipping_query',
      lastMessage: 'Kargom bugün yola çıkar mı?',
      lastMessageTime: '18 dk önce',
      unreadCount: 0,
      messages: [
        { sender: 'customer', text: 'Kargom bugün yola çıkar mı?', time: '13:58' },
        { sender: 'agent', text: 'Ayşe Hanım siparişiniz paketlendi, saat 16:30 Yurtiçi Kargo çıkışında takip kodunuz SMS ile iletilecektir.', time: '14:00' }
      ]
    }
  ]);

  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('all');
  const [weeklyRevenue, setWeeklyRevenue] = useState(142800);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [linkGenerated, setLinkGenerated] = useState(false);

  useEffect(() => {
    if (activeClientName) {
      const lower = activeClientName.toLowerCase();
      if (lower.includes('mandalin') || lower.includes('koltuk') || lower.includes('temizlik')) {
        setSelectedBrandSlug('mandalinclean');
      } else if (lower.includes('ige') || lower.includes('ajans') || lower.includes('roas') || lower.includes('b2b')) {
        setSelectedBrandSlug('igesaturkiye');
      } else if (lower.includes('velvet')) {
        setSelectedBrandSlug('velvetcouture');
      }
    }
  }, [activeClientName]);

  const fetchChats = async () => {
    try {
      const query = selectedBrandSlug !== 'all' ? `?clientSlug=${selectedBrandSlug}` : '';
      const res = await fetch(`/api/whatsapp-inbox${query}`);
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.conversations?.length > 0) {
          setConversations(json.data.conversations);
          setActiveChatId(json.data.conversations[0].id);
        }
        if (json.data.recoveredRevenueWeekly) {
          setWeeklyRevenue(json.data.recoveredRevenueWeekly);
        }
      }
    } catch (e) {
      console.warn('Failed to load WhatsApp inbox:', e);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [selectedBrandSlug]);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      sender: 'agent' as const,
      text: inputText,
      time: 'Şimdi'
    };

    setConversations(prev => prev.map(c => {
      if (c && c.id === activeChat?.id) {
        return {
          ...c,
          unreadCount: 0,
          messages: [...(c.messages || []), newMsg],
          lastMessage: inputText,
          lastMessageTime: 'Şimdi'
        };
      }
      return c;
    }));
    setInputText('');
  };

  const handleAiAutoCloser = () => {
    if (!activeChat) return;
    const firstName = activeChat.customerName.split(' ')[0] || 'Müşterimiz';
    let aiSuggestion = '';

    if (selectedBrandSlug === 'mandalinclean' || activeChat.cartProduct?.name.includes('Yıkama') || activeChat.cartProduct?.name.includes('Temizlik')) {
      aiSuggestion = `${firstName} Hanım/Bey merhaba! Mandalin Clean antibakteriyel buharlı vakum teknolojimiz kumaş liflerindeki lekeleri ve maytları %99.9 oranında temizler, kimyasal kalıntı bırakmaz. Yarın servis ekibimiz bölgenizde. Randevunuzu onaylayalım mı?`;
    } else if (selectedBrandSlug === 'igesaturkiye' || activeChat.cartProduct?.name.includes('B2B') || activeChat.cartProduct?.name.includes('Danışmanlık')) {
      aiSuggestion = `Merhaba ${firstName} Bey/Hanım! Markanızın reklam bütçesi ve POAS hedeflerini değerlendirdik. Kıdemli Medya Yöneticimiz ve Kurucumuzla 20 dakikalık canlı strateji toplantısı için bağlantımızı iletiyorum: https://calendly.com/igeads/b2b-growth`;
    } else {
      aiSuggestion = `${firstName} Hanım merhaba! Biker Ceketimiz İtalyan Slim-fit kalıptır. İçine triko veya kazakla rahat kombinlemek için kesinlikle bir beden büyük yani "L Beden" öneriyoruz. Şu an son 3 adet kaldı, sepetinize özel %5 ek indirim tanımlayabilirim. İster misiniz?`;
    }
    setInputText(aiSuggestion);
  };

  const handleCreateFastPaymentLink = () => {
    if (!activeChat) return;
    const firstName = activeChat.customerName.split(' ')[0] || 'Müşterimiz';
    let discountedPrice = '₺1.979';
    let label = 'Özel ödeme linki gönderildi';

    if (selectedBrandSlug === 'mandalinclean') {
      discountedPrice = '₺350 Kapora';
      label = 'Randevu kapora linki oluşturuldu';
    } else if (selectedBrandSlug === 'igesaturkiye') {
      discountedPrice = '₺15.000 Ön Avans';
      label = 'Stratejik danışmanlık avans linki oluşturuldu';
    }

    const linkMsg = {
      sender: 'ai' as const,
      text: `${firstName} Hanım/Bey, adınıza özel 24 saat geçerli güvenli ödeme bağlantınız hazır: https://paytr.com/v/ige-${Date.now().toString().slice(-5)} (Tutar: ${discountedPrice})`,
      time: 'Şimdi',
      hasPaymentLink: true,
      paymentAmount: discountedPrice
    };

    setConversations(prev => prev.map(c => {
      if (c && c.id === activeChat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), linkMsg],
          lastMessage: `${label} (${discountedPrice})`,
          lastMessageTime: 'Şimdi'
        };
      }
      return c;
    }));
    setLinkGenerated(true);
    setTimeout(() => setLinkGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              CANLI TİCARET & SATIŞ KAPATMA
            </span>
            <span className="text-xs text-slate-400">Resmi Meta WhatsApp Cloud API</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">WhatsApp Satış & Canlı Destek Masası</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Terk edilen sepetleri yapay zeka ile satışa dönüştürün, itirazları cevaplayın ve sohbet içinden tek tıkla güvenli ödeme linki gönderin.
          </p>
        </div>

        {/* Brand Selector & Live Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBrandSlug}
            onChange={(e) => setSelectedBrandSlug(e.target.value)}
            className="bg-[#101524] border border-emerald-500/40 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer shadow-md"
          >
            <option value="all">🏢 Tüm Ajans Müşterileri</option>
            <option value="mandalinclean">🍊 Mandalin Clean (Temizlik & Koltuk)</option>
            <option value="igesaturkiye">⚡ İgeAds (B2B E-İhracat & Büyüme)</option>
            <option value="velvetcouture">🧥 Velvet Couture (Lüks Giyim & Deri)</option>
          </select>

          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/40 via-[#101524] to-indigo-950/30 p-3 rounded-xl border border-emerald-500/30">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">WhatsApp&apos;tan Kapatılan Canlı Ciro</div>
              <div className="text-base font-extrabold text-emerald-400">
                ₺{weeklyRevenue.toLocaleString('tr-TR')} <span className="text-[10px] text-slate-400 font-normal">({conversations.length} Aktif Müşteri)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[640px] bg-[#0c101a] border border-[#1a2338] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left: Chat List (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#1a2338] flex flex-col bg-[#0e1322]">
          {/* Filter tabs */}
          <div className="p-3 border-b border-[#1c263c] space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-[#151c2e] text-slate-400 hover:text-white'}`}
              >
                Tümü ({conversations.length})
              </button>
              <button 
                onClick={() => setFilterType('abandoned_cart')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${filterType === 'abandoned_cart' ? 'bg-amber-600 text-white' : 'bg-[#151c2e] text-slate-400 hover:text-white'}`}
              >
                Terk Edilen Sepet (1)
              </button>
              <button 
                onClick={() => setFilterType('vip')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${filterType === 'vip' ? 'bg-emerald-600 text-white' : 'bg-[#151c2e] text-slate-400 hover:text-white'}`}
              >
                VIP (1)
              </button>
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#161f33]">
            {conversations
              .filter(c => filterType === 'all' || c.status === filterType)
              .map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setConversations(prev => prev.map(item => item.id === chat.id ? { ...item, unreadCount: 0 } : item));
                  }}
                  className={`p-3.5 cursor-pointer transition-all ${
                    activeChatId === chat.id 
                      ? 'bg-[#162035] border-l-4 border-emerald-500' 
                      : 'hover:bg-[#121828]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {chat.customerName}
                      {chat.status === 'abandoned_cart' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Sepet</span>
                      )}
                      {chat.status === 'vip' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">VIP</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500">{chat.lastMessageTime}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-1">{chat.lastMessage}</div>
                  {chat.cartProduct && (
                    <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{chat.cartProduct.name} ({chat.cartProduct.price})</span>
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-[#0b0f19]">
          
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#1a2338] bg-[#0e1322] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs">
                {activeChat.customerName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{activeChat.customerName}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    WhatsApp'ta Çevrimiçi
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">{activeChat.phone}</div>
              </div>
            </div>

            {/* Quick Action: Payment Link & Details */}
            {activeChat.cartProduct && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateFastPaymentLink}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                  title="Müşteriye özel indirimli anlık PayTR/iyzico linki üret"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Hızlı Ödeme Linki Üret (%10 İndirimli)</span>
                </button>
              </div>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#182138_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Abandoned Cart Top Info Card */}
            {activeChat.cartProduct && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-[#141b2c] border border-[#212b42] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Terk Edilmiş Sepet</div>
                    <div className="text-xs font-bold text-white">{activeChat.cartProduct.name}</div>
                    <div className="text-[11px] text-slate-400">{activeChat.cartProduct.size} • Kalan Stok: {activeChat.cartProduct.stock}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{activeChat.cartProduct.price}</div>
                  <span className="text-[10px] text-slate-400">32 dk önce</span>
                </div>
              </div>
            )}

            {activeChat.messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${msg.sender === 'customer' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-md p-3 rounded-2xl text-xs ${
                  msg.sender === 'customer' 
                    ? 'bg-[#182135] text-slate-100 rounded-tl-none border border-[#232f48]' 
                    : msg.sender === 'ai'
                    ? 'bg-gradient-to-br from-indigo-900/70 to-purple-900/70 text-white rounded-tr-none border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-emerald-800/60 text-white rounded-tr-none border border-emerald-500/30'
                }`}>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>İgeAds AI Satış Kapatıcı</span>
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  {msg.hasPaymentLink && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-emerald-300">Ödenecek Tutar: {msg.paymentAmount}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                        Güvenli 3D Ödeme <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                    <span>{msg.time}</span>
                    {msg.sender !== 'customer' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Sales Copilot Assistant Bar */}
          <div className="p-2.5 bg-[#101626] border-t border-[#1a2338] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Satış Asistanı:
              </span>
              <span className="text-[11px] text-slate-300 hidden md:inline">
                "Beden uyarısı yap & son 3 stok aciliyeti ile %5 kişisel kupon ver"
              </span>
            </div>
            <button
              onClick={handleAiAutoCloser}
              className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Yapay Zekayla Cevapla & Satışı Kapat</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0c101a] border-t border-[#1a2338] flex items-center gap-2">
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="WhatsApp mesajınızı yazın... (Enter ile gönder)"
              className="flex-1 bg-[#141b2c] border border-[#212b42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
