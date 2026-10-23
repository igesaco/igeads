'use client';

import React from 'react';
import { Clock } from 'lucide-react';

// Modules that do not have a real data source yet; shown as "coming soon" instead of sample numbers
export const COMING_SOON_TABS = ['war_room', 'social_pulse', 'autonomous_buyer', 'return_radar', 'attribution', 'influencer', 'seogeo', 'remarketing'];

export default function ComingSoon() {
  return (
    <div className="glass-panel p-12 rounded-2xl border border-dashed border-[#1f293d] text-center">
      <Clock className="w-12 h-12 text-indigo-400/60 mx-auto mb-3" />
      <h2 className="text-base font-bold text-white mb-2">Bu modül yakında</h2>
      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
        Bu ekranı gerçek verinizle çalışır hale getiriyoruz. Hazır olduğunda burada göreceksiniz; o zamana kadar örnek veri göstermiyoruz.
      </p>
    </div>
  );
}
