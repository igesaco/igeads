'use client';

import React, { useState } from 'react';
import ClientsHub, { ClientData } from './ClientsHub';
import AgencyTeamWorkflowHub from './AgencyTeamWorkflowHub';
import AgencyBillingHub from './AgencyBillingHub';
import { Sparkles, Globe, ShieldCheck, Building2, Users, DollarSign } from 'lucide-react';

interface AgencyHubProps {
  activeClientName?: string;
  onSelectClient?: (clientName: string) => void;
  onSwitchUser?: (member: any) => void;
}

export default function AgencyHub({ activeClientName = '', onSelectClient, onSwitchUser }: AgencyHubProps) {
  const [agencySection, setAgencySection] = useState<'clients' | 'team' | 'billing'>('clients');

  const handleSelectClient = (client: ClientData) => {
    if (onSelectClient) {
      onSelectClient(client.name);
    }
    window.dispatchEvent(new CustomEvent('client_selected', { detail: client }));
  };

  return (
    <div className="space-y-6">
      {/* Agency Navigation Header */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#090d16] border border-white/5 w-fit">
        <button
          onClick={() => setAgencySection('clients')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            agencySection === 'clients'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Marka & Müşteri Portföyü</span>
        </button>

        <button
          onClick={() => setAgencySection('team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            agencySection === 'team'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ekip Rolleri & Onay Masası (Kanban)</span>
        </button>

        <button
          onClick={() => setAgencySection('billing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            agencySection === 'billing'
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Gelirler, Retainer & Hakediş Masası</span>
        </button>
      </div>

      {agencySection === 'clients' ? (
        <ClientsHub 
          activeClientSlug={activeClientName.toLowerCase().replace(/[^a-z0-9]/g, '')}
          onSelectClient={handleSelectClient}
        />
      ) : agencySection === 'team' ? (
        <AgencyTeamWorkflowHub 
          activeClientName={activeClientName}
          onSwitchUser={onSwitchUser}
        />
      ) : (
        <AgencyBillingHub 
          activeClientName={activeClientName}
        />
      )}

      {/* White-Label Settings & Client Portal Strip */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-[#0e1422] to-indigo-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">White-Label Ajans & Müşteri Portalı Özelleştirme</h3>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            ✓ AJANS LİSANSI AKTİF
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mb-4">
          Ajans müşterileriniz canlı rapor panellerini incelerken İgeAds adı görmez; sizin logonuzu, özel alan adınızı (örn: <span className="font-mono text-cyan-300">rapor.ajansiniz.com</span>) ve marka renklerinizi görür.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141b2b] border border-[#212b42] text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Özel Rapor Portalı URL:</span>
            <span className="font-mono font-bold text-white">rapor.igeajans.com/portal/[marka]</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141b2b] border border-[#212b42] text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Müşteri İzolasyonu:</span>
            <span className="font-semibold text-emerald-400">Şifreli & Bağımsız Veri Katmanı</span>
          </div>
        </div>
      </div>
    </div>
  );
}
