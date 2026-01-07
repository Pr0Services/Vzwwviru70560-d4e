// CHE·NU™ Reports Section — Bureau Reports & History

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Report {
  id: string;
  title: string;
  description: string;
  report_type: 'activity' | 'budget' | 'agent' | 'thread' | 'decision' | 'custom';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  data_summary: {
    total_items: number;
    key_metrics: Record<string, number | string>;
  };
  generated_at: string;
  status: 'ready' | 'generating' | 'failed';
}

interface HistoryEntry {
  id: string;
  action_type: string;
  description: string;
  actor: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, any>;
  timestamp: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockReports: Report[] = [
  {
    id: 'r1',
    title: 'Weekly Activity Summary',
    description: 'Overview of all activities from the past week',
    report_type: 'activity',
    period: 'weekly',
    data_summary: {
      total_items: 156,
      key_metrics: {
        threads_created: 12,
        messages_sent: 89,
        tasks_completed: 23,
        decisions_made: 8,
      },
    },
    generated_at: '2024-01-15T08:00:00Z',
    status: 'ready',
  },
  {
    id: 'r2',
    title: 'Token Usage Report',
    description: 'Detailed breakdown of token consumption',
    report_type: 'budget',
    period: 'monthly',
    data_summary: {
      total_items: 1,
      key_metrics: {
        total_used: 45230,
        total_budget: 100000,
        utilization: '45.2%',
        top_consumer: 'Agent Executions',
      },
    },
    generated_at: '2024-01-14T12:00:00Z',
    status: 'ready',
  },
  {
    id: 'r3',
    title: 'Agent Performance Report',
    description: 'Analysis of AI agent efficiency and usage',
    report_type: 'agent',
    period: 'monthly',
    data_summary: {
      total_items: 168,
      key_metrics: {
        total_executions: 234,
        avg_tokens_per_execution: 193,
        success_rate: '98.3%',
        most_used: 'DOC_ANALYZER',
      },
    },
    generated_at: '2024-01-13T10:00:00Z',
    status: 'ready',
  },
];

const mockHistory: HistoryEntry[] = [
  {
    id: 'h1',
    action_type: 'thread_created',
    description: 'Created new thread "Q4 Planning Discussion"',
    actor: 'John Doe',
    target_type: 'thread',
    target_id: 't1',
    metadata: { sphere: 'business' },
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: 'h2',
    action_type: 'decision_made',
    description: 'Made decision on "Budget Allocation"',
    actor: 'John Doe',
    target_type: 'decision',
    target_id: 'd1',
    metadata: { choice: 'Option B' },
    timestamp: '2024-01-15T13:45:00Z',
  },
  {
    id: 'h3',
    action_type: 'agent_executed',
    description: 'Executed DOC_ANALYZER agent',
    actor: 'Nova',
    target_type: 'agent',
    target_id: 'doc-analyzer',
    metadata: { tokens_used: 245 },
    timestamp: '2024-01-15T12:00:00Z',
  },
  {
    id: 'h4',
    action_type: 'task_completed',
    description: 'Completed task "Review Documentation"',
    actor: 'Jane Smith',
    target_type: 'task',
    target_id: 'task1',
    metadata: {},
    timestamp: '2024-01-15T11:30:00Z',
  },
  {
    id: 'h5',
    action_type: 'project_updated',
    description: 'Updated project "Product Redesign" progress to 45%',
    actor: 'John Doe',
    target_type: 'project',
    target_id: 'p2',
    metadata: { previous: 40, current: 45 },
    timestamp: '2024-01-15T10:15:00Z',
  },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  generateButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    backgroundColor: '#0a0a0b',
    padding: '4px',
    borderRadius: '10px',
    width: 'fit-content',
  },
  tab: (isActive: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  reportCard: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  reportType: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
    textTransform: 'uppercase' as const,
  },
  reportDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  metric: {
    padding: '12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: CHENU_COLORS.sacredGold,
  },
  metricLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  reportFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  reportDate: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  viewButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.sacredGold,
    fontSize: '12px',
    cursor: 'pointer',
  },
  // History styles
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  historyIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  historyContent: {
    flex: 1,
  },
  historyDescription: {
    fontSize: '14px',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  historyMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  historyTime: {
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
  },
  loadMore: {
    marginTop: '20px',
    textAlign: 'center' as const,
  },
  loadMoreButton: {
    padding: '12px 32px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
};

// ============================================================
// COMPONENTS
// ============================================================

const getActionIcon = (actionType: string) => {
  const icons: Record<string, string> = {
    thread_created: '💬',
    decision_made: '⚡',
    agent_executed: '🤖',
    task_completed: '✅',
    project_updated: '📁',
    note_created: '📝',
    meeting_scheduled: '📅',
    file_uploaded: '📎',
    default: '📌',
  };
  return icons[actionType] || icons.default;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface ReportCardProps {
  report: Report;
  onView: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onView }) => {
  const metrics = Object.entries(report.data_summary.key_metrics).slice(0, 4);

  return (
    <div style={styles.reportCard}>
      <div style={styles.reportHeader}>
        <h3 style={styles.reportTitle}>{report.title}</h3>
        <span style={styles.reportType}>{report.report_type}</span>
      </div>

      <p style={styles.reportDescription}>{report.description}</p>

      <div style={styles.metricsGrid}>
        {metrics.map(([key, value]) => (
          <div key={key} style={styles.metric}>
            <div style={styles.metricValue}>{value}</div>
            <div style={styles.metricLabel}>{key.replace(/_/g, ' ')}</div>
          </div>
        ))}
      </div>

      <div style={styles.reportFooter}>
        <span style={styles.reportDate}>
          Generated {formatTimestamp(report.generated_at)}
        </span>
        <button style={styles.viewButton} onClick={onView}>
          View Report
        </button>
      </div>
    </div>
  );
};

interface HistoryItemProps {
  entry: HistoryEntry;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ entry }) => {
  return (
    <div style={styles.historyItem}>
      <div style={styles.historyIcon}>
        {getActionIcon(entry.action_type)}
      </div>
      <div style={styles.historyContent}>
        <p style={styles.historyDescription}>{entry.description}</p>
        <div style={styles.historyMeta}>
          <span>by {entry.actor}</span>
          <span>•</span>
          <span>{entry.target_type}</span>
        </div>
      </div>
      <span style={styles.historyTime}>{formatTimestamp(entry.timestamp)}</span>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ReportsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'history'>('reports');
  const [reports] = useState<Report[]>(mockReports);
  const [history] = useState<HistoryEntry[]>(mockHistory);

  const handleViewReport = (report: Report) => {
    console.log('Viewing report:', report.id);
  };

  const handleGenerateReport = () => {
    console.log('Generating new report...');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Reports & History</h2>
        {activeTab === 'reports' && (
          <button style={styles.generateButton} onClick={handleGenerateReport}>
            + Generate Report
          </button>
        )}
      </div>

      <div style={styles.tabs}>
        <button
          style={styles.tab(activeTab === 'reports')}
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports
        </button>
        <button
          style={styles.tab(activeTab === 'history')}
          onClick={() => setActiveTab('history')}
        >
          🕐 History
        </button>
      </div>

      {activeTab === 'reports' && (
        <div style={styles.reportsGrid}>
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => handleViewReport(report)}
            />
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <>
          <div style={styles.historyList}>
            {history.map(entry => (
              <HistoryItem key={entry.id} entry={entry} />
            ))}
          </div>
          <div style={styles.loadMore}>
            <button style={styles.loadMoreButton}>Load More</button>
          </div>
        </>
      )}

      {activeTab === 'reports' && reports.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📊</p>
          <p>No reports generated yet</p>
          <button
            style={{ ...styles.generateButton, marginTop: '16px' }}
            onClick={handleGenerateReport}
          >
            Generate your first report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
export { ReportCard, HistoryItem };
