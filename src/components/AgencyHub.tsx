'use client';

import React, { useState } from 'react';
import ClientsHub, { ClientData } from './ClientsHub';
import AgencyTeamWorkflowHub from './AgencyTeamWorkflowHub';
import AgencyBillingHub from './AgencyBillingHub';
import { Building2, Users, DollarSign } from 'lucide-react';

interface AgencyHubProps {
  activeClientName?: string;
  onSelectClient?: (clientName: string) => void;
}

export default function AgencyHub({ activeClientName = '', onSelectClient }: AgencyHubProps) {
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
        />
      ) : (
        <AgencyBillingHub 
          activeClientName={activeClientName}
        />
      )}

    </div>
  );
}
