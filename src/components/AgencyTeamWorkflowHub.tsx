'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Sparkles, 
  Plus, 
  Kanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Send, 
  Palette, 
  Megaphone, 
  DollarSign, 
  UserPlus, 
  Check, 
  MessageSquare,
  ChevronRight,
  FileText,
  ExternalLink,
  Trash2,
  RotateCcw
} from 'lucide-react';
import AIExecutiveReportModal from './AIExecutiveReportModal';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleTitle: string;
  phone?: string;
  assignedClients: string;
  status: string;
  avatarColor: string;
}

interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  clientSlug: string;
  clientName: string;
  assignedTo?: string;
  stage: 'idea' | 'in_progress' | 'review' | 'ready_to_publish' | 'published';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  creativeHook?: string;
  clientFeedback?: string;
  channel: string;
}

interface Props {
  activeClientName?: string;
  onSwitchUser?: (member: TeamMember) => void;
}

export default function AgencyTeamWorkflowHub({ activeClientName = '', onSwitchUser }: Props) {
  const [activeTab, setActiveTab] = useState<'team' | 'kanban'>('team');
  const [selectedClientFilter, setSelectedClientFilter] = useState<'all' | 'mandalinclean' | 'igesaturkiye' | 'velvetcouture'>('all');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<AgencyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportClientSlug, setReportClientSlug] = useState('mandalinclean');

  // New Member Modal State
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'media_buyer',
    roleTitle: '',
    phone: '',
    assignedClients: '*'
  });

  // New Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    clientName: activeClientName || 'Mandalin Clean',
    clientSlug: 'mandalinclean',
    assignedTo: 'Emre Kara',
    priority: 'high',
    channel: 'meta',
    dueDate: 'Bu hafta'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamRes, taskRes] = await Promise.all([
        fetch('/api/team'),
        fetch('/api/tasks')
      ]);
      const teamJson = await teamRes.json();
      const taskJson = await taskRes.json();
      if (teamJson.success) setMembers(teamJson.data);
      if (taskJson.success) setTasks(taskJson.data);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.email.trim()) return;

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      });
      const json = await res.json();
      if (json.success) {
        setIsMemberModalOpen(false);
        setMemberForm({
          name: '',
          email: '',
          role: 'media_buyer',
          roleTitle: '',
          phone: '',
          assignedClients: '*'
        });
        await fetchData();
      }
    } catch (e) {
      console.error('Error creating member:', e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const slug = taskForm.clientName.toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskForm, clientSlug: slug })
      });
      const json = await res.json();
      if (json.success) {
        setIsTaskModalOpen(false);
        setTaskForm({
          title: '',
          description: '',
          clientName: activeClientName || 'Mandalin Clean',
          clientSlug: 'mandalinclean',
          assignedTo: 'Emre Kara',
          priority: 'high',
          channel: 'meta',
          dueDate: 'Bu hafta'
        });
        await fetchData();
      }
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleAdvanceTask = async (task: AgencyTask) => {
    const stageFlow: Record<string, AgencyTask['stage']> = {
      idea: 'in_progress',
      in_progress: 'review',
      review: 'ready_to_publish',
      ready_to_publish: 'published',
      published: 'idea'
    };

    const nextStage = stageFlow[task.stage] || 'in_progress';
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, stage: nextStage })
      });
      await fetchData();
    } catch (e) {
      console.error('Error updating task stage:', e);
    }
  };

  const handleMoveTask = async (task: AgencyTask, newStage: AgencyTask['stage']) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, stage: newStage })
      });
      await fetchData();
    } catch (e) {
      console.error('Error updating task stage:', e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Bu kreatif görevini silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      });
      await fetchData();
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">YÖNETİCİ & STRATEJİ</span>;
      case 'media_buyer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">MEDYA SATIN ALICI</span>;
      case 'creative':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">KREATİF & METİN</span>;
      case 'account_manager':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">MÜŞTERİ YÖNETİCİSİ</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-500/20 text-slate-300">UZMAN</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'team'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ekip ve Rol Yönetimi ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kampanya & Kreatif Onay Masası ({tasks.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#141b2e] hover:bg-[#1f2945] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>✨ AI Müşteri Raporu</span>
          </button>

          {activeTab === 'team' ? (
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/25 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Yeni Çalışan Davet Et</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/25 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Yeni Kreatif Görevi Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <div 
                key={member.id}
                className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#0e1422] flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-md">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Aktif Görevde
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white">{member.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{member.roleTitle}</p>
                    <div className="mt-2">{getRoleBadge(member.role)}</div>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 border-t border-white/5 pt-2.5">
                    <p className="truncate">📧 {member.email}</p>
                    {member.phone && <p>📱 {member.phone}</p>}
                    <div className="pt-1 text-[10px] text-slate-500">
                      <span>Atanan Portföy: </span>
                      <span className="text-cyan-400 font-medium">
                        {member.assignedClients === '*' ? 'Tüm Ajans Markaları' : member.assignedClients}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSwitchUser) onSwitchUser(member);
                    alert(`"${member.name}" (${member.roleTitle}) kimliğiyle oturum simüle edildi.`);
                  }}
                  className="w-full py-2 rounded-xl bg-[#141b2a] hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-white/5 hover:border-indigo-500/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bu Rol Olarak Görüntüle</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KANBAN WORKFLOW */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          {/* Marka Filtresi Çubuğu */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f1422] border border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Marka Masası:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedClientFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClientFilter === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  🏢 Tüm Portföy ({tasks.length})
                </button>
                <button
                  onClick={() => setSelectedClientFilter('mandalinclean')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClientFilter === 'mandalinclean'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  🍊 Mandalin Clean ({tasks.filter(t => t.clientSlug === 'mandalinclean').length})
                </button>
                <button
                  onClick={() => setSelectedClientFilter('igesaturkiye')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClientFilter === 'igesaturkiye'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  ⚡ İgeAds ({tasks.filter(t => t.clientSlug === 'igesaturkiye').length})
                </button>
                <button
                  onClick={() => setSelectedClientFilter('velvetcouture')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClientFilter === 'velvetcouture'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  🧥 Velvet Couture ({tasks.filter(t => t.clientSlug === 'velvetcouture').length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Toplam: <strong className="text-white">{tasks.filter(t => selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter).length}</strong> aktif kreatif/görev</span>
            </div>
          </div>

          {/* 4 Kanban Kolonu */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Column 1: Fikir & Kanca */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Fikir & Kanca ({tasks.filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'idea').length})</span>
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks
                  .filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'idea')
                  .map((task) => (
                    <div key={task.id} className="glass-panel p-4 rounded-xl border border-white/5 bg-[#101626] space-y-2.5 hover:border-purple-500/30 transition-all">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-cyan-400">{task.clientName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">{task.priority}</span>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="Görevi Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                      {task.description && <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>👤 {task.assignedTo || 'Atanmadı'}</span>
                        <button 
                          onClick={() => handleAdvanceTask(task)}
                          className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Tasarım&apos;a Al</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: Tasarım & Kurguda */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30">
                <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>2. Tasarım & Kurguda ({tasks.filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'in_progress').length})</span>
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks
                  .filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'in_progress')
                  .map((task) => (
                    <div key={task.id} className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-[#12192c] space-y-2.5 hover:border-indigo-500/40 transition-all">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-cyan-400">{task.clientName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{task.channel.toUpperCase()}</span>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="Görevi Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>

                      {/* Müşteri Revize Notu Bildirimi */}
                      {task.clientFeedback && (
                        <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-200 font-medium space-y-1 animate-pulse">
                          <div className="flex items-center gap-1 font-bold text-rose-300 text-[10px] uppercase">
                            <MessageSquare className="w-3 h-3 text-rose-400" />
                            <span>Müşteri Revize İstedi:</span>
                          </div>
                          <p className="italic text-slate-100">&quot;{task.clientFeedback}&quot;</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>👤 {task.assignedTo || 'Atanmadı'}</span>
                        <button 
                          onClick={() => handleAdvanceTask(task)}
                          className="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Onay&apos;a Sun</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Yönetici & Müşteri Onayında */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>3. Onay Masasında ({tasks.filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'review').length})</span>
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks
                  .filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && t.stage === 'review')
                  .map((task) => (
                    <div key={task.id} className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-[#181a28] space-y-2.5 shadow-lg shadow-amber-500/5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-cyan-400">{task.clientName}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/portal/${task.clientSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-400 hover:text-white flex items-center gap-0.5 text-[9px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                            title="Müşteri Portalında Önizle"
                          >
                            <span>Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="Görevi Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                      {task.creativeHook && (
                        <div className="p-2 rounded bg-black/40 text-[10px] text-amber-200 italic font-medium border border-amber-500/20">
                          &quot;{task.creativeHook}&quot;
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <button 
                          onClick={() => handleMoveTask(task, 'in_progress')}
                          className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                          title="Tasarımcıya Revizeye Geri Gönder"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Revize İste</span>
                        </button>
                        <button 
                          onClick={() => handleMoveTask(task, 'published')}
                          className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Onayla & Yayınla</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 4: Canlı / Yayında */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>4. Canlı & Yayında ({tasks.filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && (t.stage === 'ready_to_publish' || t.stage === 'published')).length})</span>
                </span>
              </div>
              <div className="space-y-2.5">
                {tasks
                  .filter(t => (selectedClientFilter === 'all' || t.clientSlug === selectedClientFilter) && (t.stage === 'ready_to_publish' || t.stage === 'published'))
                  .map((task) => (
                    <div key={task.id} className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-[#0e1c24] space-y-2.5 hover:border-emerald-500/50 transition-all">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-cyan-400">{task.clientName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">YAYINDA</span>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="Görevi Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>👤 {task.assignedTo || 'Atanmadı'}</span>
                        <span className="text-emerald-400 font-semibold text-[9px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          ROAS Takibinde
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Yeni Çalışan Davet Et */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0d1322] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Ajansa Yeni Çalışan Ekle</span>
              </h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Örn: Canan Yıldız"
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  required
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="canan@ajansiniz.com"
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Ajans Rolü *</label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="media_buyer">Medya Satın Alıcı (Ads & Bütçe)</option>
                  <option value="creative">Kreatif Direktör & AI Metin Yazarı</option>
                  <option value="account_manager">Müşteri İlişkileri Yöneticisi</option>
                  <option value="admin">Ajans Yöneticisi & Ortak</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Telefon (WhatsApp)</label>
                <input
                  type="text"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  placeholder="+90 532 000 00 00"
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-4 py-2 text-slate-400">İptal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-md">Çalışanı Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Yeni Kreatif Görevi Ekle */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0d1322] border border-purple-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Yeni Kampanya / Kreatif Görevi Başlat</span>
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Görev / Kreatif Başlığı *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Örn: 3 Yeni Reels Kancası ve Story Seti"
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Hangi Marka İçin? *</label>
                <input
                  type="text"
                  required
                  value={taskForm.clientName}
                  onChange={(e) => setTaskForm({ ...taskForm, clientName: e.target.value })}
                  placeholder="Mandalin Clean, Duru Diş..."
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Kanal</label>
                  <select
                    value={taskForm.channel}
                    onChange={(e) => setTaskForm({ ...taskForm, channel: e.target.value })}
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="meta">Meta Ads</option>
                    <option value="google">Google Ads</option>
                    <option value="tiktok">TikTok / Reels</option>
                    <option value="whatsapp">WhatsApp Funnel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Atanan Uzman</label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.roleTitle})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-slate-400">İptal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-md">Görevi Başlat</button>
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
      />
    </div>
  );
}
