import React, { useState, useMemo } from 'react';
import { Check, Clock, AlertCircle, ChevronDown, ChevronRight, Search, Filter, BarChart3, Calendar, Users, Zap, Building2, Shield, Brain, Camera, Mail, DollarSign, Package, MessageSquare, TrendingUp, Target, Award, RefreshCw } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHENU V22+ - FEUILLE DE SUIVI INTERACTIVE
// ═══════════════════════════════════════════════════════════════════════════════

const initialTasks = [
  // PHASE 1: FONDATIONS
  { id: 'F1-01', phase: 1, sprint: '1.1', title: 'Réorganiser sidebar en 5 catégories', module: 'Navigation', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F1-02', phase: 1, sprint: '1.1', title: 'Section "Épinglés" personnalisable', module: 'Navigation', priority: 'high', effort: 3, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F1-03', phase: 1, sprint: '1.1', title: 'Breadcrumbs dynamiques', module: 'Navigation', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F1-04', phase: 1, sprint: '1.1', title: 'Spotlight Search amélioré (⌘K)', module: 'Navigation', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F1-05', phase: 1, sprint: '1.1', title: 'Page "Récents" historique', module: 'Navigation', priority: 'medium', effort: 3, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F2-01', phase: 1, sprint: '1.2', title: 'Widgets drag & drop', module: 'Dashboard', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F2-02', phase: 1, sprint: '1.2', title: 'Widgets redimensionnables', module: 'Dashboard', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F2-03', phase: 1, sprint: '1.2', title: 'Sauvegarde layout utilisateur', module: 'Dashboard', priority: 'high', effort: 3, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F2-04', phase: 1, sprint: '1.2', title: 'Widget Alertes Critiques', module: 'Dashboard', priority: 'high', effort: 3, status: 'todo', assignee: '', dueDate: '' },
  { id: 'F2-05', phase: 1, sprint: '1.2', title: 'Widget Météo multi-sites', module: 'Dashboard', priority: 'medium', effort: 4, status: 'todo', assignee: '', dueDate: '' },

  // PHASE 2: MODULES CORE
  { id: 'P1-01', phase: 2, sprint: '2.1', title: 'Templates projets (Résidentiel, Commercial, Réno)', module: 'Projects', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'P1-02', phase: 2, sprint: '2.1', title: 'Système sous-projets / Phases', module: 'Projects', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'P1-03', phase: 2, sprint: '2.1', title: 'Budget tracking par projet', module: 'Projects', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'P1-04', phase: 2, sprint: '2.1', title: 'Comparaison Estimé vs Réel', module: 'Projects', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'P1-05', phase: 2, sprint: '2.1', title: 'Import Excel/CSV projets', module: 'Projects', priority: 'medium', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'C1-01', phase: 2, sprint: '2.2', title: 'Intégration Google Calendar API', module: 'Calendar', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'C1-02', phase: 2, sprint: '2.2', title: 'Intégration Microsoft Outlook API', module: 'Calendar', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'C1-03', phase: 2, sprint: '2.2', title: 'Vue Équipe calendriers superposés', module: 'Calendar', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'C1-04', phase: 2, sprint: '2.2', title: 'Réservation ressources', module: 'Calendar', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'T1-01', phase: 2, sprint: '2.3', title: 'Organigramme visuel interactif', module: 'Team', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'T1-02', phase: 2, sprint: '2.3', title: 'Charge de travail par agent', module: 'Team', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'T1-03', phase: 2, sprint: '2.3', title: 'Profil compétences/certifications', module: 'Team', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'T1-04', phase: 2, sprint: '2.3', title: 'Intégration CCQ API', module: 'Team', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },

  // PHASE 3: COMMUNICATION
  { id: 'E1-01', phase: 3, sprint: '3.1', title: 'Intégration Gmail API', module: 'Email', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'E1-02', phase: 3, sprint: '3.1', title: 'Intégration Outlook API', module: 'Email', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'E1-03', phase: 3, sprint: '3.1', title: 'Composer email éditeur riche', module: 'Email', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'E1-04', phase: 3, sprint: '3.1', title: 'Templates emails construction', module: 'Email', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'COM-01', phase: 3, sprint: '3.2', title: 'Intégration Slack API', module: 'Communication', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'COM-02', phase: 3, sprint: '3.2', title: 'Intégration Teams API', module: 'Communication', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'COM-03', phase: 3, sprint: '3.2', title: 'Intégration WhatsApp Business', module: 'Communication', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'COM-04', phase: 3, sprint: '3.2', title: 'Centre notifications unifié', module: 'Communication', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },

  // PHASE 4: FINANCE
  { id: 'FIN-01', phase: 4, sprint: '4.1', title: 'Intégration QuickBooks Online', module: 'Finance', priority: 'high', effort: 10, status: 'todo', assignee: '', dueDate: '' },
  { id: 'FIN-02', phase: 4, sprint: '4.1', title: 'Intégration Sage API', module: 'Finance', priority: 'high', effort: 10, status: 'todo', assignee: '', dueDate: '' },
  { id: 'FIN-03', phase: 4, sprint: '4.1', title: 'Cash flow forecast', module: 'Finance', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'FIN-04', phase: 4, sprint: '4.1', title: 'Rapprochement bancaire auto', module: 'Finance', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'SUP-01', phase: 4, sprint: '4.2', title: 'Intégration RONA Pro API', module: 'Suppliers', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'SUP-02', phase: 4, sprint: '4.2', title: 'Intégration Home Depot Pro', module: 'Suppliers', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'SUP-03', phase: 4, sprint: '4.2', title: 'Comparateur prix multi-fournisseurs', module: 'Suppliers', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },

  // PHASE 5: CONFORMITÉ QC
  { id: 'GOV-01', phase: 5, sprint: '5.1', title: 'Intégration CCQ API compétences', module: 'Conformité', priority: 'high', effort: 10, status: 'todo', assignee: '', dueDate: '' },
  { id: 'GOV-02', phase: 5, sprint: '5.1', title: 'Intégration CNESST API', module: 'Conformité', priority: 'high', effort: 10, status: 'todo', assignee: '', dueDate: '' },
  { id: 'GOV-03', phase: 5, sprint: '5.1', title: 'Intégration RBQ API licences', module: 'Conformité', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'GOV-04', phase: 5, sprint: '5.1', title: 'Vérification conformité auto', module: 'Conformité', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'GOV-05', phase: 5, sprint: '5.1', title: 'Alertes expiration', module: 'Conformité', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },

  // PHASE 6: IA
  { id: 'AI-01', phase: 6, sprint: '6.1', title: 'Mode comparaison multi-modèles', module: 'AI Lab', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'AI-02', phase: 6, sprint: '6.1', title: 'Bibliothèque prompts construction', module: 'AI Lab', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
  { id: 'AI-03', phase: 6, sprint: '6.1', title: 'Génération documents auto', module: 'AI Lab', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'AI-04', phase: 6, sprint: '6.1', title: 'Intégration Whisper transcription', module: 'AI Lab', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'PHO-01', phase: 6, sprint: '6.2', title: 'Intégration Google Cloud Vision', module: 'Photos', priority: 'high', effort: 6, status: 'todo', assignee: '', dueDate: '' },
  { id: 'PHO-02', phase: 6, sprint: '6.2', title: 'Détection IA défauts', module: 'Photos', priority: 'high', effort: 8, status: 'todo', assignee: '', dueDate: '' },
  { id: 'PHO-03', phase: 6, sprint: '6.2', title: 'Comparaison avant/après slider', module: 'Photos', priority: 'high', effort: 4, status: 'todo', assignee: '', dueDate: '' },
];

const phases = [
  { id: 1, name: 'Fondations', icon: Building2, color: '#3b82f6', weeks: '1-4' },
  { id: 2, name: 'Modules Core', icon: Zap, color: '#8b5cf6', weeks: '5-10' },
  { id: 3, name: 'Communication', icon: MessageSquare, color: '#10b981', weeks: '11-14' },
  { id: 4, name: 'Finance & Business', icon: DollarSign, color: '#f59e0b', weeks: '15-18' },
  { id: 5, name: 'Conformité QC', icon: Shield, color: '#ef4444', weeks: '19-20' },
  { id: 6, name: 'IA & Automatisation', icon: Brain, color: '#ec4899', weeks: '21-24' },
];

const modules = ['Navigation', 'Dashboard', 'Projects', 'Calendar', 'Team', 'Email', 'Communication', 'Finance', 'Suppliers', 'Conformité', 'AI Lab', 'Photos'];

export default function TaskTracker() {
  const [tasks, setTasks] = useState(initialTasks);
  const [expandedPhases, setExpandedPhases] = useState([1]);
  const [filterModule, setFilterModule] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const T = {
    bg: { main: '#0a0a0f', card: '#12121a', hover: '#1a1a25' },
    text: { primary: '#ffffff', secondary: '#a0a0b0', muted: '#6b7280' },
    border: '#2a2a3a',
    accent: { primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' }
  };

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) ? prev.filter(p => p !== phaseId) : [...prev, phaseId]
    );
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterModule !== 'all' && task.module !== filterModule) return false;
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && !task.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterModule, filterStatus, filterPriority, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const totalHours = tasks.reduce((sum, t) => sum + t.effort, 0);
    const doneHours = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + t.effort, 0);
    return { total, done, inProgress, todo, totalHours, doneHours, percent: Math.round((done / total) * 100) };
  }, [tasks]);

  const statusColors = {
    todo: { bg: T.bg.hover, text: T.text.muted, label: 'À faire' },
    progress: { bg: `${T.accent.warning}20`, text: T.accent.warning, label: 'En cours' },
    done: { bg: `${T.accent.success}20`, text: T.accent.success, label: 'Terminé' },
    blocked: { bg: `${T.accent.danger}20`, text: T.accent.danger, label: 'Bloqué' }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, fontFamily: 'system-ui, -apple-system, sans-serif', color: T.text.primary }}>
      {/* Header */}
      <div style={{ padding: 24, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>📊 CHENU V22+ - Suivi des Tâches</h1>
            <p style={{ color: T.text.muted, marginTop: 4 }}>Plan d'amélioration complet • {stats.total} tâches • {stats.totalHours}h estimées</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setTasks(initialTasks)} style={{ padding: '10px 16px', background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.secondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: T.bg.card, padding: 20, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.accent.primary }}>{stats.percent}%</div>
            <div style={{ color: T.text.muted, fontSize: 14 }}>Progression</div>
            <div style={{ height: 4, background: T.bg.hover, borderRadius: 2, marginTop: 8 }}>
              <div style={{ height: '100%', width: `${stats.percent}%`, background: T.accent.primary, borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ background: T.bg.card, padding: 20, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.accent.success }}>{stats.done}</div>
            <div style={{ color: T.text.muted, fontSize: 14 }}>Terminées</div>
          </div>
          <div style={{ background: T.bg.card, padding: 20, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.accent.warning }}>{stats.inProgress}</div>
            <div style={{ color: T.text.muted, fontSize: 14 }}>En cours</div>
          </div>
          <div style={{ background: T.bg.card, padding: 20, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.text.muted }}>{stats.todo}</div>
            <div style={{ color: T.text.muted, fontSize: 14 }}>À faire</div>
          </div>
          <div style={{ background: T.bg.card, padding: 20, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.accent.primary }}>{stats.doneHours}h</div>
            <div style={{ color: T.text.muted, fontSize: 14 }}>/ {stats.totalHours}h</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.text.muted }} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher..." style={{ width: '100%', padding: '10px 10px 10px 40px', background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary, outline: 'none' }} />
          </div>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} style={{ padding: 10, background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}>
            <option value="all">Tous modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: 10, background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}>
            <option value="all">Tous status</option>
            <option value="todo">À faire</option>
            <option value="progress">En cours</option>
            <option value="done">Terminé</option>
            <option value="blocked">Bloqué</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: 10, background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary }}>
            <option value="all">Toutes priorités</option>
            <option value="high">🔴 Haute</option>
            <option value="medium">🟡 Moyenne</option>
          </select>
        </div>
      </div>

      {/* Phases & Tasks */}
      <div style={{ padding: 24 }}>
        {phases.map(phase => {
          const phaseTasks = filteredTasks.filter(t => t.phase === phase.id);
          const phaseDone = phaseTasks.filter(t => t.status === 'done').length;
          const phasePercent = phaseTasks.length > 0 ? Math.round((phaseDone / phaseTasks.length) * 100) : 0;
          const PhaseIcon = phase.icon;

          return (
            <div key={phase.id} style={{ marginBottom: 16 }}>
              {/* Phase Header */}
              <div onClick={() => togglePhase(phase.id)} style={{ background: T.bg.card, padding: 16, borderRadius: 12, border: `1px solid ${T.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {expandedPhases.includes(phase.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${phase.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhaseIcon size={20} style={{ color: phase.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Phase {phase.id}: {phase.name}</div>
                    <div style={{ fontSize: 13, color: T.text.muted }}>Semaines {phase.weeks} • {phaseTasks.length} tâches</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 100, height: 8, background: T.bg.hover, borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${phasePercent}%`, background: phase.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontWeight: 600, color: phase.color }}>{phasePercent}%</span>
                </div>
              </div>

              {/* Tasks */}
              {expandedPhases.includes(phase.id) && phaseTasks.length > 0 && (
                <div style={{ marginTop: 8, marginLeft: 24 }}>
                  {phaseTasks.map(task => (
                    <div key={task.id} style={{ background: T.bg.card, padding: 16, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                      {/* Status Toggle */}
                      <button onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : task.status === 'todo' ? 'progress' : 'done')} style={{ width: 32, height: 32, borderRadius: 8, border: `2px solid ${statusColors[task.status].text}`, background: task.status === 'done' ? T.accent.success : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {task.status === 'done' && <Check size={18} color="#fff" />}
                        {task.status === 'progress' && <Clock size={16} style={{ color: T.accent.warning }} />}
                      </button>

                      {/* Task Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, color: task.status === 'done' ? T.text.muted : T.text.primary, textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</span>
                          {task.priority === 'high' && <span style={{ padding: '2px 6px', background: `${T.accent.danger}20`, color: T.accent.danger, borderRadius: 4, fontSize: 10 }}>🔴 Haute</span>}
                        </div>
                        <div style={{ fontSize: 12, color: T.text.muted, marginTop: 4 }}>
                          <span style={{ marginRight: 12 }}>{task.id}</span>
                          <span style={{ marginRight: 12 }}>📁 {task.module}</span>
                          <span>⏱️ {task.effort}h</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span style={{ padding: '6px 12px', borderRadius: 6, background: statusColors[task.status].bg, color: statusColors[task.status].text, fontSize: 12, fontWeight: 500 }}>
                        {statusColors[task.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
