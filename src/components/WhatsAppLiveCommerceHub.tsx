'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, CheckCheck, Check, AlertTriangle, RefreshCw, Zap, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  direction: 'in' | 'out';
  text: string;
  status: string;
  errorMessage?: string | null;
  createdAt: string;
}

interface ChatConversation {
  id: string;
  phone: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: string;
  canReply: boolean;
  messages: ChatMessage[];
}

interface WhatsAppLiveCommerceHubProps {
  activeClientName?: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'failed') return <AlertTriangle className="w-3 h-3 text-rose-400" />;
  if (status === 'read') return <CheckCheck className="w-3 h-3 text-cyan-400" />;
  if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-slate-400" />;
  return <Check className="w-3 h-3 text-slate-400" />;
}

export default function WhatsAppLiveCommerceHub(_props: WhatsAppLiveCommerceHubProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [connected, setConnected] = useState(false);
  const [webhookConfigured, setWebhookConfigured] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp-inbox');
      const json = await res.json();
      if (json.success && json.data) {
        setConversations(json.data.conversations || []);
        setConnected(Boolean(json.data.connected));
        setWebhookConfigured(Boolean(json.data.webhookConfigured));
        setActiveChatId(prev => prev || json.data.conversations?.[0]?.id || '');
      }
    } catch (e) {
      console.warn('Failed to load WhatsApp inbox:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchChats();
    // New messages arrive through the webhook; poll so they show up without a reload
    const timer = setInterval(fetchChats, 15000);
    return () => clearInterval(timer);
  }, [fetchChats]);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChat || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/whatsapp-inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: activeChat.id, text: inputText })
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Mesaj gönderilemedi');
        return;
      }
      setInputText('');
      await fetchChats();
    } catch (err: any) {
      setError(err.message || 'Sunucuya ulaşılamadı');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              connected ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Zap className="w-3 h-3" />
              {connected ? 'WhatsApp bağlı' : 'WhatsApp bağlı değil'}
            </span>
            <span className="text-xs text-slate-400">Meta WhatsApp Cloud API</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">WhatsApp Gelen Kutusu</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Müşterilerinizden gelen WhatsApp mesajlarını görün ve buradan cevaplayın.
          </p>
        </div>
        <button
          onClick={fetchChats}
          className="px-3 py-2 rounded-xl bg-[#101524] border border-[#1f293d] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Yenile
        </button>
      </div>

      {loaded && conversations.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-dashed border-[#1f293d] text-center bg-[#0c101a]/60">
          <MessageCircle className="w-14 h-14 text-emerald-500/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Henüz WhatsApp mesajı yok</h3>
          <div className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed space-y-1 text-left">
            <p className={connected ? 'text-emerald-400' : ''}>1. Entegrasyonlar sayfasından WhatsApp Phone Number ID ve System User Token girip bağlantıyı test edin.{connected && ' ✓'}</p>
            <p className={webhookConfigured ? 'text-emerald-400' : ''}>
              2. Meta uygulamanızda Webhook adresi olarak <code className="text-slate-200">{typeof window !== 'undefined' ? window.location.origin : ''}/api/whatsapp/webhook</code> girin ve &quot;messages&quot; alanına abone olun.{webhookConfigured && ' ✓'}
            </p>
            <p>3. Müşteriniz işletme numaranıza yazdığında sohbet burada görünür.</p>
          </div>
        </div>
      ) : activeChat && (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[640px] bg-[#0c101a] border border-[#1a2338] rounded-2xl overflow-hidden shadow-2xl">
          <div className="lg:col-span-4 border-r border-[#1a2338] flex flex-col bg-[#0e1322]">
            <div className="p-3 border-b border-[#1c263c] text-[11px] font-semibold text-slate-400">
              Sohbetler ({conversations.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#161f33]">
              {conversations.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => { setActiveChatId(chat.id); setError(null); }}
                  className={`p-3.5 cursor-pointer transition-all ${
                    activeChat.id === chat.id ? 'bg-[#162035] border-l-4 border-emerald-500' : 'hover:bg-[#121828]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{chat.customerName}</span>
                    <span className="text-[10px] text-slate-500">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{chat.lastMessage}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col bg-[#0b0f19] min-h-0">
            <div className="p-3.5 border-b border-[#1a2338] bg-[#0e1322] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs">
                {activeChat.customerName.replace('+', '').charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{activeChat.customerName}</div>
                <div className="text-[10px] text-slate-400">{activeChat.phone}</div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.direction === 'in' ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-md p-3 rounded-2xl text-xs ${
                    msg.direction === 'in'
                      ? 'bg-[#182135] text-slate-100 rounded-tl-none border border-[#232f48]'
                      : 'bg-emerald-800/60 text-white rounded-tr-none border border-emerald-500/30'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.errorMessage && <p className="text-[10px] text-rose-300 mt-1">{msg.errorMessage}</p>}
                    <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                      <span>{formatTime(msg.createdAt)}</span>
                      {msg.direction === 'out' && <StatusIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!activeChat.canReply && (
              <div className="px-3 py-2 bg-amber-950/30 border-t border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Müşteri son 24 saatte yazmadığı için WhatsApp kuralları gereği serbest mesaj gönderilemez.
              </div>
            )}
            {error && (
              <div className="px-3 py-2 bg-rose-950/30 border-t border-rose-500/20 text-[11px] text-rose-300">{error}</div>
            )}

            <div className="p-3 bg-[#0c101a] border-t border-[#1a2338] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                disabled={!activeChat.canReply || sending}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Mesajınızı yazın... (Enter ile gönder)"
                className="flex-1 bg-[#141b2c] border border-[#212b42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!activeChat.canReply || sending}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
