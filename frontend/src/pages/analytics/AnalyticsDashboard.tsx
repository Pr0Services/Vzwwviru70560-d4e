// CHE·NU™ Analytics Dashboard — Comprehensive Analytics View
// Cross-sphere analytics with governance and token tracking

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface AnalyticsOverview {
  total_tokens_used: number;
  total_tokens_budget: number;
  active_threads: number;
  completed_tasks: number;
  agent_executions: number;
  governance_score: number;
  encoding_savings: number;
}

interface SphereAnalytics {
  code: string;
  name: string;
  icon: string;
  tokens_used: number;
  threads_count: number;
  tasks_completed: number;
  activity_score: number;
}

interface TimeSeriesData {
  date: string;
  tokens: number;
  tasks: number;
  threads: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockOverview: AnalyticsOverview = {
  total_tokens_used: 125430,
  total_tokens_budget: 500000,
  active_threads: 23,
  completed_tasks: 156,
  agent_executions: 89,
  governance_score: 98,
  encoding_savings: 42350,
};

const mockSphereAnalytics: SphereAnalytics[] = [
  { code: 'business', name: 'Business', icon: '💼', tokens_used: 45230, threads_count: 8, tasks_completed: 45, activity_score: 92 },
  { code: 'personal', name: 'Personal', icon: '🏠', tokens_used: 23450, threads_count: 5, tasks_completed: 34, activity_score: 78 },
  { code: 'studio', name: 'Studio', icon: '🎨', tokens_used: 18760, threads_count: 4, tasks_completed: 28, activity_score: 85 },
  { code: 'team', name: 'My Team', icon: '🤝', tokens_used: 15340, threads_count: 3, tasks_completed: 22, activity_score: 71 },
  { code: 'community', name: 'Community', icon: '👥', tokens_used: 12650, threads_count: 2, tasks_completed: 15, activity_score: 65 },
  { code: 'government', name: 'Government', icon: '🏛️', tokens_used: 5200, threads_count: 1, tasks_completed: 8, activity_score: 45 },
  { code: 'social', name: 'Social', icon: '📱', tokens_used: 3200, threads_count: 0, tasks_completed: 3, activity_score: 32 },
  { code: 'entertainment', name: 'Entertainment', icon: '🎬', tokens_used: 1600, threads_count: 0, tasks_completed: 1, activity_score: 20 },
];

const mockTimeSeries: TimeSeriesData[] = [
  { date: '2024-01-09', tokens: 12500, tasks: 8, threads: 2 },
  { date: '2024-01-10', tokens: 15200, tasks: 12, threads: 3 },
  { date: '2024-01-11', tokens: 18900, tasks: 15, threads: 4 },
  { date: '2024-01-12', tokens: 14300, tasks: 10, threads: 2 },
  { date: '2024-01-13', tokens: 8700, tasks: 5, threads: 1 },
  { date: '2024-01-14', tokens: 9200, tasks: 6, threads: 1 },
  { date: '2024-01-15', tokens: 22100, tasks: 18, threads: 5 },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '24px 32px',
    backgroundColor: CHENU_COLORS.uiSlate,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  subtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  dateRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dateButton: (isActive: boolean) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : '#111113',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  }),

  // Overview Cards
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  overviewCard: {
    padding: '24px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  cardIcon: {
    fontSize: '24px',
    marginBottom: '12px',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  cardLabel: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
  },
  cardTrend: (positive: boolean) => ({
    fontSize: '12px',
    color: positive ? CHENU_COLORS.jungleEmerald : '#e74c3c',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),

  // Charts Section
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '20px',
  },
  chartArea: {
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    paddingTop: '20px',
  },
  chartBar: (height: number, color: string) => ({
    flex: 1,
    height: `${height}%`,
    backgroundColor: color,
    borderRadius: '4px 4px 0 0',
    minHeight: '4px',
    transition: 'height 0.3s ease',
  }),
  chartLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center' as const,
    marginTop: '8px',
  },

  // Sphere Analytics
  sphereAnalyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  sphereCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sphereHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  sphereIcon: {
    fontSize: '24px',
  },
  sphereName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  sphereStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  sphereStat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  sphereStatLabel: {
    color: CHENU_COLORS.ancientStone,
  },
  sphereStatValue: {
    color: CHENU_COLORS.softSand,
    fontWeight: 500,
  },
  activityBar: {
    height: '4px',
    backgroundColor: '#0a0a0b',
    borderRadius: '2px',
    marginTop: '12px',
    overflow: 'hidden',
  },
  activityFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: CHENU_COLORS.sacredGold,
    borderRadius: '2px',
  }),

  // Governance Section
  governanceSection: {
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    marginBottom: '24px',
  },
  governanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
  },
  lawCard: {
    padding: '16px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
  lawNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: CHENU_COLORS.jungleEmerald,
  },
  lawName: {
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.3,
  },
  lawStatus: {
    fontSize: '10px',
    color: CHENU_COLORS.jungleEmerald,
    marginTop: '4px',
  },

  // Token Savings
  savingsCard: {
    backgroundColor: CHENU_COLORS.jungleEmerald + '11',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.jungleEmerald}33`,
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  savingsIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
  },
  savingsInfo: {
    flex: 1,
  },
  savingsTitle: {
    fontSize: '14px',
    color: CHENU_COLORS.jungleEmerald,
    marginBottom: '4px',
  },
  savingsValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  savingsDesc: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },

  // Donut Chart
  donutContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  donut: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: `conic-gradient(
      ${CHENU_COLORS.sacredGold} 0deg 130deg,
      ${CHENU_COLORS.cenoteTurquoise} 130deg 200deg,
      ${CHENU_COLORS.jungleEmerald} 200deg 250deg,
      ${CHENU_COLORS.ancientStone} 250deg 360deg
    )`,
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#111113',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
  },
  donutValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  donutLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  legend: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  legendDot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const AnalyticsDashboard: React.FC = () => {
  const [overview] = useState<AnalyticsOverview>(mockOverview);
  const [sphereAnalytics] = useState<SphereAnalytics[]>(mockSphereAnalytics);
  const [timeSeries] = useState<TimeSeriesData[]>(mockTimeSeries);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  const maxTokens = Math.max(...timeSeries.map(d => d.tokens));
  const budgetPercent = (overview.total_tokens_used / overview.total_tokens_budget) * 100;

  const GOVERNANCE_LAWS = [
    'Consent Primacy', 'Temporal Sovereignty', 'Contextual Fidelity',
    'Hierarchical Respect', 'Audit Completeness', 'Encoding Transparency',
    'Agent Non-Autonomy', 'Budget Accountability', 'Cross-Sphere Isolation', 'Deletion Completeness'
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
          <p style={styles.subtitle}>Cross-sphere performance and governance metrics</p>
        </div>
        <div style={styles.dateRange}>
          <button style={styles.dateButton(dateRange === '7d')} onClick={() => setDateRange('7d')}>7 Days</button>
          <button style={styles.dateButton(dateRange === '30d')} onClick={() => setDateRange('30d')}>30 Days</button>
          <button style={styles.dateButton(dateRange === '90d')} onClick={() => setDateRange('90d')}>90 Days</button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={styles.overviewGrid}>
        <div style={styles.overviewCard}>
          <div style={styles.cardIcon}>🎫</div>
          <div style={styles.cardValue}>{overview.total_tokens_used.toLocaleString()}</div>
          <div style={styles.cardLabel}>Tokens Used</div>
          <div style={styles.cardTrend(true)}>↑ 12% vs last period</div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardIcon}>💬</div>
          <div style={styles.cardValue}>{overview.active_threads}</div>
          <div style={styles.cardLabel}>Active Threads</div>
          <div style={styles.cardTrend(true)}>↑ 3 new this week</div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardIcon}>✅</div>
          <div style={styles.cardValue}>{overview.completed_tasks}</div>
          <div style={styles.cardLabel}>Tasks Completed</div>
          <div style={styles.cardTrend(true)}>↑ 18% efficiency</div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardIcon}>🤖</div>
          <div style={styles.cardValue}>{overview.agent_executions}</div>
          <div style={styles.cardLabel}>Agent Executions</div>
          <div style={styles.cardTrend(true)}>97.8% success rate</div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Token Usage (Last 7 Days)</div>
          <div style={styles.chartArea}>
            {timeSeries.map((data, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={styles.chartBar((data.tokens / maxTokens) * 100, CHENU_COLORS.sacredGold)} />
                <div style={styles.chartLabel}>{new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Token Distribution</div>
          <div style={styles.donutContainer}>
            <div style={styles.donut}>
              <div style={styles.donutInner}>
                <div style={styles.donutValue}>{Math.round(budgetPercent)}%</div>
                <div style={styles.donutLabel}>Used</div>
              </div>
            </div>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={styles.legendDot(CHENU_COLORS.sacredGold)} />
                Business (36%)
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot(CHENU_COLORS.cenoteTurquoise)} />
                Personal (19%)
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot(CHENU_COLORS.jungleEmerald)} />
                Studio (15%)
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot(CHENU_COLORS.ancientStone)} />
                Others (30%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Savings */}
      <div style={styles.savingsCard}>
        <div style={styles.savingsIcon}>⚡</div>
        <div style={styles.savingsInfo}>
          <div style={styles.savingsTitle}>Encoding Savings</div>
          <div style={styles.savingsValue}>{overview.encoding_savings.toLocaleString()} tokens saved</div>
          <div style={styles.savingsDesc}>Your encoding rules saved 34% of token costs this period</div>
        </div>
      </div>

      {/* Sphere Analytics */}
      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <div style={styles.chartTitle}>Sphere Analytics</div>
      </div>
      <div style={styles.sphereAnalyticsGrid}>
        {sphereAnalytics.slice(0, 4).map(sphere => (
          <div key={sphere.code} style={styles.sphereCard}>
            <div style={styles.sphereHeader}>
              <span style={styles.sphereIcon}>{sphere.icon}</span>
              <span style={styles.sphereName}>{sphere.name}</span>
            </div>
            <div style={styles.sphereStats}>
              <div style={styles.sphereStat}>
                <span style={styles.sphereStatLabel}>Tokens</span>
                <span style={styles.sphereStatValue}>{sphere.tokens_used.toLocaleString()}</span>
              </div>
              <div style={styles.sphereStat}>
                <span style={styles.sphereStatLabel}>Threads</span>
                <span style={styles.sphereStatValue}>{sphere.threads_count}</span>
              </div>
              <div style={styles.sphereStat}>
                <span style={styles.sphereStatLabel}>Tasks</span>
                <span style={styles.sphereStatValue}>{sphere.tasks_completed}</span>
              </div>
            </div>
            <div style={styles.activityBar}>
              <div style={styles.activityFill(sphere.activity_score)} />
            </div>
          </div>
        ))}
      </div>

      {/* Governance Compliance */}
      <div style={styles.governanceSection}>
        <div style={styles.chartTitle}>⚖️ Governance Compliance — 10 Laws ({overview.governance_score}% Score)</div>
        <div style={styles.governanceGrid}>
          {GOVERNANCE_LAWS.slice(0, 5).map((law, idx) => (
            <div key={idx} style={styles.lawCard}>
              <div style={styles.lawNumber}>{idx + 1}</div>
              <div style={styles.lawName}>{law}</div>
              <div style={styles.lawStatus}>✓ Enforced</div>
            </div>
          ))}
        </div>
        <div style={{ ...styles.governanceGrid, marginTop: '12px' }}>
          {GOVERNANCE_LAWS.slice(5, 10).map((law, idx) => (
            <div key={idx} style={styles.lawCard}>
              <div style={styles.lawNumber}>{idx + 6}</div>
              <div style={styles.lawName}>{law}</div>
              <div style={styles.lawStatus}>✓ Enforced</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
