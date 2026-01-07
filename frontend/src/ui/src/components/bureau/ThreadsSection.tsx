// CHE·NU™ Threads Section — Bureau Threads (.chenu) Management
// Threads are FIRST-CLASS OBJECTS with budget, encoding, and history

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Thread {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  owner: string;
  scope: 'personal' | 'shared' | 'project';
  token_budget: number;
  tokens_used: number;
  message_count: number;
  participants: string[];
  tags: string[];
  last_message_at: string;
  created_at: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockThreads: Thread[] = [
  {
    id: 't1',
    title: 'Q4 Strategy Planning',
    status: 'active',
    owner: 'John Doe',
    scope: 'shared',
    token_budget: 5000,
    tokens_used: 2340,
    message_count: 45,
    participants: ['John Doe', 'Jane Smith', 'Nova'],
    tags: ['strategy', 'q4', 'planning'],
    last_message_at: '2024-01-15T14:30:00Z',
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 't2',
    title: 'Product Roadmap Discussion',
    status: 'active',
    owner: 'Jane Smith',
    scope: 'project',
    token_budget: 3000,
    tokens_used: 1200,
    message_count: 28,
    participants: ['Jane Smith', 'Dev Team', 'Nova'],
    tags: ['product', 'roadmap'],
    last_message_at: '2024-01-15T12:00:00Z',
    created_at: '2024-01-08T09:00:00Z',
  },
  {
    id: 't3',
    title: 'Personal Notes & Ideas',
    status: 'active',
    owner: 'John Doe',
    scope: 'personal',
    token_budget: 1000,
    tokens_used: 450,
    message_count: 12,
    participants: ['John Doe', 'Nova'],
    tags: ['personal', 'ideas'],
    last_message_at: '2024-01-14T18:00:00Z',
    created_at: '2024-01-05T14:00:00Z',
  },
  {
    id: 't4',
    title: 'Budget Review 2024',
    status: 'completed',
    owner: 'John Doe',
    scope: 'shared',
    token_budget: 2000,
    tokens_used: 1890,
    message_count: 34,
    participants: ['John Doe', 'Finance Team', 'Nova'],
    tags: ['budget', 'finance'],
    last_message_at: '2024-01-12T16:00:00Z',
    created_at: '2024-01-02T11:00:00Z',
  },
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
  createButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  filterButton: (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  }),
  threadsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  threadCard: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  threadIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  threadContent: { flex: 1 },
  threadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  threadTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      active: CHENU_COLORS.jungleEmerald,
      paused: '#f39c12',
      completed: CHENU_COLORS.cenoteTurquoise,
      archived: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },
  threadMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  threadStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '8px',
  },
  tokenUsage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tokenBar: {
    width: '80px',
    height: '6px',
    backgroundColor: '#0a0a0b',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  tokenFill: (percent: number) => ({
    width: `${Math.min(percent, 100)}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
    transition: 'width 0.3s ease',
  }),
  tokenText: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    minWidth: '60px',
    textAlign: 'right' as const,
  },
  messageCount: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  tagsRow: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
  },
  tag: {
    padding: '2px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
  },
  scopeBadge: (scope: string) => {
    const colors: Record<string, string> = {
      personal: CHENU_COLORS.sacredGold,
      shared: CHENU_COLORS.cenoteTurquoise,
      project: CHENU_COLORS.jungleEmerald,
    };
    return {
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[scope] + '22',
      color: colors[scope],
    };
  },
  notice: {
    padding: '16px 20px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  noticeText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ThreadsSection: React.FC = () => {
  const [threads] = useState<Thread[]>(mockThreads);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string | null>(null);

  const filteredThreads = threads
    .filter(t => !statusFilter || t.status === statusFilter)
    .filter(t => !scopeFilter || t.scope === scopeFilter)
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Threads (.chenu)</h2>
        <button style={styles.createButton}>+ New Thread</button>
      </div>

      <div style={styles.notice}>
        <span style={{ fontSize: '20px' }}>💬</span>
        <span style={styles.noticeText}>
          Threads are <strong>FIRST-CLASS OBJECTS</strong> — persistent lines of thought with 
          token budgets, encoding rules, and complete audit history.
        </span>
      </div>

      <div style={styles.filters}>
        <button style={styles.filterButton(!statusFilter)} onClick={() => setStatusFilter(null)}>All</button>
        <button style={styles.filterButton(statusFilter === 'active')} onClick={() => setStatusFilter('active')}>Active</button>
        <button style={styles.filterButton(statusFilter === 'completed')} onClick={() => setStatusFilter('completed')}>Completed</button>
        <span style={{ width: '1px', backgroundColor: CHENU_COLORS.ancientStone + '44', margin: '0 8px' }} />
        <button style={styles.filterButton(scopeFilter === 'personal')} onClick={() => setScopeFilter(scopeFilter === 'personal' ? null : 'personal')}>Personal</button>
        <button style={styles.filterButton(scopeFilter === 'shared')} onClick={() => setScopeFilter(scopeFilter === 'shared' ? null : 'shared')}>Shared</button>
        <button style={styles.filterButton(scopeFilter === 'project')} onClick={() => setScopeFilter(scopeFilter === 'project' ? null : 'project')}>Project</button>
      </div>

      <div style={styles.threadsList}>
        {filteredThreads.map(thread => {
          const tokenPercent = (thread.tokens_used / thread.token_budget) * 100;
          return (
            <div key={thread.id} style={styles.threadCard(thread.status === 'active')}>
              <div style={styles.threadIcon}>💬</div>
              <div style={styles.threadContent}>
                <div style={styles.threadHeader}>
                  <span style={styles.threadTitle}>{thread.title}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={styles.scopeBadge(thread.scope)}>{thread.scope}</span>
                    <span style={styles.statusBadge(thread.status)}>{thread.status}</span>
                  </div>
                </div>
                <div style={styles.threadMeta}>
                  <span>👤 {thread.owner}</span>
                  <span>👥 {thread.participants.length} participants</span>
                  <span>📅 {formatTime(thread.last_message_at)}</span>
                </div>
                {thread.tags.length > 0 && (
                  <div style={styles.tagsRow}>
                    {thread.tags.map((tag, idx) => (
                      <span key={idx} style={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={styles.threadStats}>
                <div style={styles.tokenUsage}>
                  <div style={styles.tokenBar}>
                    <div style={styles.tokenFill(tokenPercent)} />
                  </div>
                  <span style={styles.tokenText}>{thread.tokens_used}/{thread.token_budget}</span>
                </div>
                <span style={styles.messageCount}>{thread.message_count} messages</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredThreads.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>💬</p>
          <p>No threads found</p>
        </div>
      )}
    </div>
  );
};

export default ThreadsSection;
