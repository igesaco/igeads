'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  CornerDownLeft,
  Check
} from 'lucide-react';

interface CopilotWidgetProps {
  activeClientName?: string;
}

export default function CopilotWidget({ activeClientName = '' }: CopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; actionBtn?: string; engine?: string }>>([
    {
      sender: 'bot',
      text: 'Merhaba! Ben İgeAds Growth Copilot. Reklam bütçelerinizi kaydırabilir, rakip analizleri yapabilir veya pazaryeri kârınızı hesaplayabilirim. Bugün ne yapmak istersiniz?',
      time: '02:22'
    }
  ]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const prompt = customPrompt || inputMsg;
    if (!prompt.trim() || isThinking) return;

    const userMessage = {
      sender: 'user' as const,
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          clientName: activeClientName 
        })
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data?.reply || 'Talebiniz analiz edildi.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionBtn: data?.action,
        engine: data?.engine
      }]);
    } catch (err) {
      console.error('Copilot request failed:', err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Üzgünüm, şu an AI sunucusuna ulaşılamadı. Lütfen tekrar deneyin.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const clientLower = activeClientName.toLowerCase();
  const isMandalin = clientLower.includes('mandalin') || clientLower.includes('temizlik');
  const isIge = clientLower.includes('ige') || clientLower.includes('danışmanlık');

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="tracking-wide">İgeAds Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[520px] bg-[#0c101a] border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-950/80 flex flex-col overflow-hidden animate-fade-in relative">
          {/* Top glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="p-4 border-b border-[#1c263c] bg-[#101524]/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <span>İgeAds Copilot</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                    {activeClientName && activeClientName !== 'Tüm Müşteriler' ? activeClientName : 'PORTFÖY AI'}
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Pazaryeri & Reklam API&apos;larına Bağlı
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-[#182033] hover:bg-[#202b44] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 border-b border-[#1a2338] bg-[#0e1322] flex items-center gap-1.5 overflow-x-auto text-[10px]">
            {isMandalin ? (
              <>
                <button 
                  onClick={() => handleSend(undefined, 'Yağmurlu günlerde koltuk yıkama reklam bütçesini nasıl yönetmeliyiz?')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-amber-500/40 transition-all"
                >
                  🌧️ Yağmur Bütçe Kuralı
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'Bursa için yeni viral koltuk temizliği kancası yaz')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-amber-500/40 transition-all"
                >
                  ✨ Koltuk Kancası Yaz
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'WhatsApp randevu dönüşüm oranını nasıl artırırız?')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-amber-500/40 transition-all"
                >
                  💬 WhatsApp Dönüşümü
                </button>
              </>
            ) : isIge ? (
              <>
                <button 
                  onClick={() => handleSend(undefined, 'Amazon Amerika FBA danışmanlık bütçesini nasıl optimize edelim?')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  🌐 Amazon ROAS Stratejisi
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'B2B e-ihracat lead maliyetini düşürmek için 3 kanca yaz')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  🎯 B2B Lead Kancası
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'Cal.com randevusu almayan lead takip mesajı oluştur')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  📅 Randevu Takip Metni
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleSend(undefined, 'TikTok bütçesini Meta\'ya kaydır')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  🔄 Bütçeyi Kaydır
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'Deri ceket için yeni viral kanca yaz')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  ✨ Reels Kancası Yaz
                </button>
                <button 
                  onClick={() => handleSend(undefined, 'Stok ve Buybox durumumu özetle')}
                  className="px-2.5 py-1 rounded-full bg-[#141b2b] text-slate-300 hover:text-white border border-[#212b42] whitespace-nowrap cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  📦 Stok & Buybox
                </button>
              </>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-md'
                      : 'bg-[#141b2a] border border-[#212b42] text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}

                  {m.actionBtn && (
                    <button className="mt-2.5 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all">
                      <Zap className="w-3 h-3" />
                      <span>{m.actionBtn}</span>
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-start gap-2">
                <div className="bg-[#141b2a] border border-[#212b42] p-3 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                  <span className="text-[11px] text-slate-300">Yapay Zeka Analiz Ediyor...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#1c263c] bg-[#101524] flex items-center gap-2">
            <input 
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Copilot'a sorun veya talimat verin..."
              className="flex-1 bg-[#161e31] border border-[#232f4a] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit"
              className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
