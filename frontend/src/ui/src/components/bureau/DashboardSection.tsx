// CHE·NU™ Dashboard Section — Bureau Overview & Quick Actions
// Dashboard provides overview of all Bureau sections for active Sphere

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface DashboardStats {
  notes: { total: number; recent: number };
  tasks: { total: number; pending: number; overdue: number };
  projects: { total: number; active: number; progress: number };
  threads: { total: number; active: number; tokens_used: number };
  meetings: { upcoming: number; today: number };
  data: { records: number; storage_mb: number };
  agents: { available: number; executions_today: number };
  budget: { total: number; used: number; available: number };
}

interface RecentActivity {
  id: string;
  type: 'note' | 'task' | 'thread' | 'meeting' | 'decision' | 'agent';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  section: string;
  color: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockStats: DashboardStats = {
  notes: { total: 47, recent: 5 },
  tasks: { total: 23, pending: 8, overdue: 2 },
  projects: { total: 6, active: 4, progress: 68 },
  threads: { total: 12, active: 5, tokens_used: 4520 },
  meetings: { upcoming: 3, today: 1 },
  data: { records: 156, storage_mb: 45.2 },
  agents: { available: 5, executions_today: 12 },
  budget: { total: 50000, used: 32450, available: 17550 },
};

const mockActivity: RecentActivity[] = [
  { id: 'a1', type: 'task', title: 'Complete Q4 Report', description: 'Task marked as done', timestamp: '2024-01-15T14:30:00Z', icon: '✅' },
  { id: 'a2', type: 'thread', title: 'Strategy Discussion', description: 'New message from Nova', timestamp: '2024-01-15T14:15:00Z', icon: '💬' },
  { id: 'a3', type: 'meeting', title: 'Weekly Sync', description: 'Meeting starting in 30 min', timestamp: '2024-01-15T14:00:00Z', icon: '📅' },
  { id: 'a4', type: 'agent', title: 'DOC_ANALYZER', description: 'Analysis completed', timestamp: '2024-01-15T13:45:00Z', icon: '🤖' },
  { id: 'a5', type: 'note', title: 'Meeting Notes', description: 'New note created', timestamp: '2024-01-15T13:30:00Z', icon: '📝' },
  { id: 'a6', type: 'decision', title: 'Budget Allocation', description: 'Decision pending approval', timestamp: '2024-01-15T13:00:00Z', icon: '⚖️' },
];

const quickActions: QuickAction[] = [
  { id: 'q1', label: 'New Note', icon: '📝', section: 'notes', color: CHENU_COLORS.sacredGold },
  { id: 'q2', label: 'Add Task', icon: '✅', section: 'tasks', color: CHENU_COLORS.jungleEmerald },
  { id: 'q3', label: 'Start Thread', icon: '💬', section: 'threads', color: CHENU_COLORS.cenoteTurquoise },
  { id: 'q4', label: 'Schedule Meeting', icon: '📅', section: 'meetings', color: '#9b59b6' },
  { id: 'q5', label: 'Run Agent', icon: '🤖', section: 'agents', color: '#e74c3c' },
  { id: 'q6', label: 'View Reports', icon: '📈', section: 'reports', color: CHENU_COLORS.earthEmber },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, color: CHENU_COLORS.softSand },
  subtitle: { fontSize: '13px', color: CHENU_COLORS.ancientStone, marginTop: '4px' },
  
  // Quick Actions
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  quickAction: (color: string) => ({
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${color}33`,
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  quickActionIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  quickActionLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  statLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  statSubtext: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },

  // Two Column Layout
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },

  // Activity Section
  activitySection: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#111113',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  activityDesc: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  activityTime: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },

  // Budget Overview
  budgetSection: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  budgetBar: {
    height: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  budgetFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
    borderRadius: '6px',
    transition: 'width 0.3s ease',
  }),
  budgetStats: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  budgetStat: {
    textAlign: 'center' as const,
  },
  budgetValue: (color: string) => ({
    fontSize: '18px',
    fontWeight: 'bold',
    color: color,
  }),
  budgetLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },

  // Nova Status
  novaStatus: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    borderRadius: '12px',
    padding: '16px 20px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  novaIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  novaInfo: {
    flex: 1,
  },
  novaTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  novaDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  novaAction: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.cenoteTurquoise,
    fontSize: '12px',
    cursor: 'pointer',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

interface DashboardSectionProps {
  sphereName?: string;
  onNavigate?: (section: string) => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  sphereName = 'Personal',
  onNavigate 
}) => {
  const [stats] = useState<DashboardStats>(mockStats);
  const [activity] = useState<RecentActivity[]>(mockActivity);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const budgetPercent = (stats.budget.used / stats.budget.total) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Dashboard</h2>
          <p style={styles.subtitle}>{sphereName} Sphere Overview</p>
        </div>
      </div>

      {/* Nova Status */}
      <div style={styles.novaStatus}>
        <div style={styles.novaIcon}>🌟</div>
        <div style={styles.novaInfo}>
          <div style={styles.novaTitle}>Nova — System Intelligence</div>
          <div style={styles.novaDesc}>Ready to assist. 3 pending suggestions available.</div>
        </div>
        <button style={styles.novaAction}>Talk to Nova</button>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionsGrid}>
        {quickActions.map(action => (
          <div 
            key={action.id} 
            style={styles.quickAction(action.color)}
            onClick={() => onNavigate?.(action.section)}
          >
            <div style={styles.quickActionIcon}>{action.icon}</div>
            <div style={styles.quickActionLabel}>{action.label}</div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>✅</div>
            <span style={styles.statLabel}>Tasks</span>
          </div>
          <div style={styles.statValue}>{stats.tasks.pending}</div>
          <div style={styles.statSubtext}>
            {stats.tasks.overdue > 0 && <span style={{ color: '#e74c3c' }}>{stats.tasks.overdue} overdue • </span>}
            {stats.tasks.total} total
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>📁</div>
            <span style={styles.statLabel}>Projects</span>
          </div>
          <div style={styles.statValue}>{stats.projects.active}</div>
          <div style={styles.statSubtext}>{stats.projects.progress}% avg progress</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>💬</div>
            <span style={styles.statLabel}>Threads</span>
          </div>
          <div style={styles.statValue}>{stats.threads.active}</div>
          <div style={styles.statSubtext}>{stats.threads.tokens_used.toLocaleString()} tokens used</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.statIcon}>📅</div>
            <span style={styles.statLabel}>Meetings</span>
          </div>
          <div style={styles.statValue}>{stats.meetings.today}</div>
          <div style={styles.statSubtext}>{stats.meetings.upcoming} upcoming</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={styles.twoColumn}>
        {/* Recent Activity */}
        <div style={styles.activitySection}>
          <div style={styles.sectionTitle}>
            <span>📋</span> Recent Activity
          </div>
          <div style={styles.activityList}>
            {activity.slice(0, 5).map(item => (
              <div key={item.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>{item.icon}</div>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>{item.title}</div>
                  <div style={styles.activityDesc}>{item.description}</div>
                </div>
                <div style={styles.activityTime}>{formatTime(item.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div style={styles.budgetSection}>
          <div style={styles.sectionTitle}>
            <span>💰</span> Token Budget
          </div>
          <div style={styles.budgetBar}>
            <div style={styles.budgetFill(budgetPercent)} />
          </div>
          <div style={styles.budgetStats}>
            <div style={styles.budgetStat}>
              <div style={styles.budgetValue(CHENU_COLORS.softSand)}>{stats.budget.total.toLocaleString()}</div>
              <div style={styles.budgetLabel}>Total</div>
            </div>
            <div style={styles.budgetStat}>
              <div style={styles.budgetValue('#e74c3c')}>{stats.budget.used.toLocaleString()}</div>
              <div style={styles.budgetLabel}>Used</div>
            </div>
            <div style={styles.budgetStat}>
              <div style={styles.budgetValue(CHENU_COLORS.jungleEmerald)}>{stats.budget.available.toLocaleString()}</div>
              <div style={styles.budgetLabel}>Available</div>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${CHENU_COLORS.ancientStone}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Agent Executions Today</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>{stats.agents.executions_today}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Data Records</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>{stats.data.records}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
