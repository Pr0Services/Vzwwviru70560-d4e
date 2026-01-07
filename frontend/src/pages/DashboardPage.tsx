/**
 * CHE·NU — DASHBOARD PAGE
 * =======================
 * Vue d'ensemble principale avec KPIs, activité, et accès rapide
 * 
 * @version 2.0.0
 * @safe true
 */

import React, { useState, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  teamMembers: number;
  activeAgents: number;
  budgetUsed: number;
  budgetTotal: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'task' | 'agent' | 'team' | 'finance';
  title: string;
  description: string;
  timestamp: Date;
  user?: { name: string };
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'deadline' | 'milestone' | 'review';
  project?: string;
}

interface ProjectProgress {
  name: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'ahead';
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockStats: DashboardStats = {
  totalProjects: 24,
  activeProjects: 8,
  completedTasks: 156,
  pendingTasks: 42,
  teamMembers: 12,
  activeAgents: 168,
  budgetUsed: 847500,
  budgetTotal: 1250000,
};

const mockActivities: RecentActivity[] = [
  { id: '1', type: 'project', title: 'Nouveau projet créé', description: 'Résidence Mont-Royal Phase 2', timestamp: new Date(Date.now() - 1800000), user: { name: 'Jo Parent' }, status: 'success' },
  { id: '2', type: 'task', title: 'Tâche complétée', description: 'Inspection fondations - Lot 14', timestamp: new Date(Date.now() - 3600000), user: { name: 'Marc Tremblay' }, status: 'success' },
  { id: '3', type: 'agent', title: 'Agent activé', description: 'ConstructionSupervisorAgent L2 déployé', timestamp: new Date(Date.now() - 7200000), status: 'info' },
  { id: '4', type: 'finance', title: 'Paiement reçu', description: 'Facture #INV-2024-156 - 45 000 $', timestamp: new Date(Date.now() - 14400000), status: 'success' },
  { id: '5', type: 'team', title: 'Nouveau membre', description: 'Sophie Martin a rejoint l\'équipe', timestamp: new Date(Date.now() - 28800000), user: { name: 'Sophie Martin' }, status: 'info' },
];

const mockEvents: UpcomingEvent[] = [
  { id: '1', title: 'Réunion de chantier', date: new Date(Date.now() + 86400000), type: 'meeting', project: 'Résidence Mont-Royal' },
  { id: '2', title: 'Livraison béton', date: new Date(Date.now() + 172800000), type: 'deadline', project: 'Tour Viger' },
  { id: '3', title: 'Inspection CNESST', date: new Date(Date.now() + 259200000), type: 'review', project: 'Centre Commercial Laval' },
  { id: '4', title: 'Fin Phase 1', date: new Date(Date.now() + 604800000), type: 'milestone', project: 'Résidence Mont-Royal' },
];

const mockProjectProgress: ProjectProgress[] = [
  { name: 'Résidence Mont-Royal', progress: 72, status: 'on-track' },
  { name: 'Tour Viger', progress: 45, status: 'on-track' },
  { name: 'Centre Commercial Laval', progress: 28, status: 'delayed' },
  { name: 'Condos Fleury', progress: 91, status: 'on-track' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString('fr-CA');
}

function formatFutureDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  if (days < 7) return `Dans ${days} jours`;
  return date.toLocaleDateString('fr-CA', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(value);
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// =============================================================================
// STYLES (Tailwind-like CSS-in-JS)
// =============================================================================

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
    padding: '24px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  } as React.CSSProperties,
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  } as React.CSSProperties,
  
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: '4px 0 0',
  } as React.CSSProperties,
  
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  } as React.CSSProperties,
  
  kpiCard: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  } as React.CSSProperties,
  
  card: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
  } as React.CSSProperties,
  
  cardBody: {
    padding: '20px 24px',
  } as React.CSSProperties,
  
  button: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  buttonGhost: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#9ca3af',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
  } as React.CSSProperties,
  
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  progressFill: (percent: number, color: string) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  }) as React.CSSProperties,
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: number; direction: 'up' | 'down' };
  color: string;
}

function KPICard({ label, value, icon, trend, color }: KPICardProps) {
  return (
    <div style={styles.kpiCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            ...styles.badge,
            background: trend.direction === 'up' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: trend.direction === 'up' ? '#10b981' : '#ef4444',
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>{value}</div>
        <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  );
}

function ProjectProgressCard({ project }: { project: ProjectProgress }) {
  const color = project.status === 'delayed' ? '#f59e0b' : '#10b981';
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>{project.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{project.progress}%</span>
          {project.status === 'delayed' && (
            <span style={{ ...styles.badge, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '11px' }}>
              En retard
            </span>
          )}
        </div>
      </div>
      <div style={styles.progressBar}>
        <div style={styles.progressFill(project.progress, color)} />
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const icons: Record<string, string> = {
    project: '📁', task: '✅', agent: '🤖', team: '👥', finance: '💰',
  };
  const colors: Record<string, string> = {
    success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6',
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: `${colors[activity.status || 'info']}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
      }}>
        {icons[activity.type]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>{activity.title}</div>
        <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{activity.description}</div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          {activity.user && <span>{activity.user.name} • </span>}
          {formatRelativeTime(activity.timestamp)}
        </div>
      </div>
    </div>
  );
}

function EventItem({ event }: { event: UpcomingEvent }) {
  const colors: Record<string, string> = {
    meeting: '#3b82f6', deadline: '#f59e0b', milestone: '#10b981', review: '#8b5cf6',
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: colors[event.type],
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>{event.title}</div>
        {event.project && (
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{event.project}</div>
        )}
      </div>
      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
        {formatFutureDate(event.date)}
      </span>
    </div>
  );
}

function AgentLevelCard({ level, label, count, color }: { level: string; label: string; count: number; color: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '16px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 700, color }}>{count}</div>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{level} - {label}</div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsRefreshing(false);
  }, []);
  
  const budgetPercent = Math.round((mockStats.budgetUsed / mockStats.budgetTotal) * 100);
  
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={{ fontSize: '32px' }}>📊</span>
              Tableau de Bord
            </h1>
            <p style={styles.subtitle}>Vue d'ensemble de vos projets et activités</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              style={styles.buttonGhost}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? '⟳ ...' : '↻ Actualiser'}
            </button>
            <button style={styles.button}>
              <span>+</span> Nouveau Projet
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={styles.kpiGrid}>
          <KPICard
            label="Projets Actifs"
            value={mockStats.activeProjects}
            icon="📁"
            trend={{ value: 33, direction: 'up' }}
            color="#3b82f6"
          />
          <KPICard
            label="Tâches Complétées"
            value={mockStats.completedTasks}
            icon="✅"
            trend={{ value: 9.8, direction: 'up' }}
            color="#10b981"
          />
          <KPICard
            label="Agents Actifs"
            value={mockStats.activeAgents}
            icon="🤖"
            color="#8b5cf6"
          />
          <KPICard
            label="Budget Utilisé"
            value={formatCurrency(mockStats.budgetUsed)}
            icon="💰"
            color={budgetPercent > 80 ? '#f59e0b' : '#10b981'}
          />
        </div>

        {/* Main Content */}
        <div style={styles.mainGrid}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Project Progress */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Progression des Projets</h3>
                <button style={styles.buttonGhost}>Voir tout →</button>
              </div>
              <div style={styles.cardBody}>
                {mockProjectProgress.map((project) => (
                  <ProjectProgressCard key={project.name} project={project} />
                ))}
              </div>
            </div>

            {/* Agent Status */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Agents CHE·NU</h3>
                <span style={{ ...styles.badge, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
                  {mockStats.activeAgents} actifs
                </span>
              </div>
              <div style={styles.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <AgentLevelCard level="L0" label="Nova" count={1} color="#10b981" />
                  <AgentLevelCard level="L1" label="Sphères" count={10} color="#3b82f6" />
                  <AgentLevelCard level="L2" label="Domaines" count={47} color="#8b5cf6" />
                  <AgentLevelCard level="L3" label="Workers" count={110} color="#f59e0b" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Actions Rapides</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { icon: '📁', label: 'Nouveau Projet', color: '#3b82f6' },
                    { icon: '✅', label: 'Nouvelle Tâche', color: '#10b981' },
                    { icon: '📅', label: 'Planifier', color: '#8b5cf6' },
                    { icon: '📄', label: 'Créer Devis', color: '#f59e0b' },
                  ].map((action, i) => (
                    <button key={i} style={{
                      background: `${action.color}15`,
                      border: `1px solid ${action.color}30`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}>
                      <span style={{ fontSize: '24px' }}>{action.icon}</span>
                      <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 500 }}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Upcoming Events */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>À Venir</h3>
                <span style={{ fontSize: '18px' }}>📅</span>
              </div>
              <div style={{ padding: '8px 24px 16px' }}>
                {mockEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Activité Récente</h3>
                <button style={styles.buttonGhost}>Tout voir</button>
              </div>
              <div style={{ padding: '8px 24px 16px' }}>
                {mockActivities.slice(0, 5).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Budget Global</h3>
              </div>
              <div style={styles.cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>
                      {formatCurrency(mockStats.budgetUsed)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      sur {formatCurrency(mockStats.budgetTotal)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#10b981' }}>
                      {formatCurrency(mockStats.budgetTotal - mockStats.budgetUsed)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Disponible</div>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div style={styles.progressFill(budgetPercent, budgetPercent > 80 ? '#f59e0b' : '#10b981')} />
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: '#9ca3af' }}>
                  {budgetPercent}% utilisé
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
