'use client';

import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  activeClientName?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // warning, success, info, alert
  read: boolean;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  alert: 'border-rose-500/40 bg-rose-950/20',
  warning: 'border-amber-500/40 bg-amber-950/20',
  success: 'border-emerald-500/40 bg-emerald-950/20',
  info: 'border-indigo-500/40 bg-indigo-950/20'
};

function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'Şimdi';
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/notifications')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) setNotifications(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0c101a] border-l border-[#1f293d] h-full flex flex-col shadow-2xl animate-slide-left relative">
        {/* Header */}
        <div className="p-5 border-b border-[#1c263c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bildirimler</h3>
              <p className="text-[11px] text-slate-400">Entegrasyon ve otomasyon olayları</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#182033] hover:bg-[#202b44] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs">
          {loading && <p className="text-slate-500">Yükleniyor...</p>}
          {!loading && notifications.length === 0 && (
            <div className="text-center text-slate-500 py-12 space-y-1">
              <p className="font-semibold text-slate-400">Henüz bildirim yok</p>
              <p>Entegrasyonlarınız ve otomasyon kurallarınız çalıştıkça olaylar burada görünecek.</p>
            </div>
          )}
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${TYPE_COLORS[item.type] || TYPE_COLORS.info} ${item.read ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-white text-xs">{item.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{timeAgo(item.createdAt)}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1c263c] bg-[#101524] flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={markAllRead}
            disabled={notifications.every(n => n.read)}
            className="hover:text-white disabled:opacity-40 cursor-pointer"
          >
            Tümünü okundu işaretle
          </button>
          <button
            onClick={onClose}
            className="text-white hover:underline cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
