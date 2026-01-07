// CHE·NU™ Agents Section — Bureau AI Agents Management
// Agents have costs, scopes, encoding compatibility
// Agents act ONLY when authorized (Law 7: No Self-Directed Learning)

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Agent {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'analysis' | 'generation' | 'automation' | 'research' | 'communication';
  status: 'available' | 'busy' | 'disabled' | 'maintenance';
  tier: 1 | 2 | 3;
  cost_per_execution: number;
  avg_tokens_per_run: number;
  total_executions: number;
  success_rate: number;
  encoding_compatible: boolean;
  sphere_access: string[];
  last_used: string | null;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockAgents: Agent[] = [
  {
    id: 'a1',
    code: 'DOC_ANALYZER',
    name: 'Document Analyzer',
    description: 'Analyzes documents, extracts key information, and generates summaries',
    category: 'analysis',
    status: 'available',
    tier: 2,
    cost_per_execution: 50,
    avg_tokens_per_run: 245,
    total_executions: 156,
    success_rate: 98.5,
    encoding_compatible: true,
    sphere_access: ['personal', 'business', 'studio'],
    last_used: '2024-01-15T14:30:00Z',
  },
  {
    id: 'a2',
    code: 'CONTENT_GEN',
    name: 'Content Generator',
    description: 'Generates various types of content based on specifications',
    category: 'generation',
    status: 'available',
    tier: 2,
    cost_per_execution: 75,
    avg_tokens_per_run: 380,
    total_executions: 89,
    success_rate: 96.2,
    encoding_compatible: true,
    sphere_access: ['personal', 'business', 'design_studio', 'social'],
    last_used: '2024-01-15T12:00:00Z',
  },
  {
    id: 'a3',
    code: 'TASK_AUTO',
    name: 'Task Automator',
    description: 'Automates repetitive tasks based on defined rules',
    category: 'automation',
    status: 'available',
    tier: 1,
    cost_per_execution: 25,
    avg_tokens_per_run: 120,
    total_executions: 234,
    success_rate: 99.1,
    encoding_compatible: true,
    sphere_access: ['personal', 'business'],
    last_used: '2024-01-15T10:00:00Z',
  },
  {
    id: 'a4',
    code: 'RESEARCH_ASSIST',
    name: 'Research Assistant',
    description: 'Conducts research, gathers information, and compiles findings',
    category: 'research',
    status: 'busy',
    tier: 3,
    cost_per_execution: 100,
    avg_tokens_per_run: 520,
    total_executions: 45,
    success_rate: 94.8,
    encoding_compatible: true,
    sphere_access: ['personal', 'business', 'design_studio', 'government'],
    last_used: '2024-01-15T16:00:00Z',
  },
  {
    id: 'a5',
    code: 'MEETING_SUMM',
    name: 'Meeting Summarizer',
    description: 'Summarizes meetings, extracts action items and decisions',
    category: 'analysis',
    status: 'available',
    tier: 2,
    cost_per_execution: 60,
    avg_tokens_per_run: 280,
    total_executions: 78,
    success_rate: 97.5,
    encoding_compatible: true,
    sphere_access: ['personal', 'business', 'team'],
    last_used: '2024-01-14T18:00:00Z',
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
  notice: {
    padding: '16px 20px',
    backgroundColor: '#e74c3c11',
    borderRadius: '10px',
    border: '1px solid #e74c3c33',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  noticeText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
  },
  agentCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  agentIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  agentInfo: {
    flex: 1,
    marginLeft: '12px',
  },
  agentCode: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    fontFamily: 'monospace',
  },
  agentName: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      available: CHENU_COLORS.jungleEmerald,
      busy: CHENU_COLORS.sacredGold,
      disabled: CHENU_COLORS.ancientStone,
      maintenance: '#e74c3c',
    };
    return {
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },
  tierBadge: (tier: number) => ({
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
  }),
  agentDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  stat: {
    padding: '10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  sphereAccess: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    marginBottom: '16px',
  },
  sphereTag: {
    padding: '3px 8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.softSand,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  executeButton: (isAvailable: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isAvailable ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
    color: isAvailable ? '#000' : '#666',
    fontSize: '13px',
    fontWeight: 600,
    cursor: isAvailable ? 'pointer' : 'not-allowed',
  }),
  encodingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: CHENU_COLORS.jungleEmerald,
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const AgentsSection: React.FC = () => {
  const [agents] = useState<Agent[]>(mockAgents);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredAgents = agents
    .filter(a => !categoryFilter || a.category === categoryFilter)
    .filter(a => !statusFilter || a.status === statusFilter)
    .sort((a, b) => b.total_executions - a.total_executions);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      analysis: '🔍',
      generation: '✨',
      automation: '⚡',
      research: '📚',
      communication: '💬',
    };
    return icons[category] || '🤖';
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Agents</h2>
      </div>

      <div style={styles.notice}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <span style={styles.noticeText}>
          <strong>Law 7 - Agent Non-Autonomy:</strong> Agents act ONLY when authorized. 
          No self-directed learning or autonomous actions permitted.
        </span>
      </div>

      <div style={styles.filters}>
        <button style={styles.filterButton(!categoryFilter)} onClick={() => setCategoryFilter(null)}>All</button>
        <button style={styles.filterButton(categoryFilter === 'analysis')} onClick={() => setCategoryFilter('analysis')}>🔍 Analysis</button>
        <button style={styles.filterButton(categoryFilter === 'generation')} onClick={() => setCategoryFilter('generation')}>✨ Generation</button>
        <button style={styles.filterButton(categoryFilter === 'automation')} onClick={() => setCategoryFilter('automation')}>⚡ Automation</button>
        <button style={styles.filterButton(categoryFilter === 'research')} onClick={() => setCategoryFilter('research')}>📚 Research</button>
        <span style={{ width: '1px', backgroundColor: CHENU_COLORS.ancientStone + '44', margin: '0 8px' }} />
        <button style={styles.filterButton(statusFilter === 'available')} onClick={() => setStatusFilter(statusFilter === 'available' ? null : 'available')}>Available</button>
      </div>

      <div style={styles.grid}>
        {filteredAgents.map(agent => (
          <div key={agent.id} style={styles.agentCard}>
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={styles.agentIcon}>{getCategoryIcon(agent.category)}</div>
                <div style={styles.agentInfo}>
                  <div style={styles.agentCode}>{agent.code}</div>
                  <div style={styles.agentName}>{agent.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <span style={styles.statusBadge(agent.status)}>{agent.status}</span>
                <span style={styles.tierBadge(agent.tier)}>Tier {agent.tier}</span>
              </div>
            </div>

            <p style={styles.agentDescription}>{agent.description}</p>

            <div style={styles.statsGrid}>
              <div style={styles.stat}>
                <div style={styles.statValue}>{agent.cost_per_execution}</div>
                <div style={styles.statLabel}>Cost/Run</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statValue}>{agent.total_executions}</div>
                <div style={styles.statLabel}>Executions</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statValue}>{agent.success_rate}%</div>
                <div style={styles.statLabel}>Success</div>
              </div>
            </div>

            <div style={styles.sphereAccess}>
              <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>Access:</span>
              {agent.sphere_access.map((sphere, idx) => (
                <span key={idx} style={styles.sphereTag}>{sphere}</span>
              ))}
            </div>

            <div style={styles.cardFooter}>
              <div>
                {agent.encoding_compatible && (
                  <span style={styles.encodingBadge}>✓ Encoding Compatible</span>
                )}
                <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                  Last used: {formatTime(agent.last_used)}
                </div>
              </div>
              <button style={styles.executeButton(agent.status === 'available')}>
                Execute
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</p>
          <p>No agents found</p>
        </div>
      )}
    </div>
  );
};

export default AgentsSection;
