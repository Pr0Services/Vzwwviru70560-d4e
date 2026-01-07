// CHE·NU™ Budget & Governance Section — Bureau Budget Management
// Tokens are INTERNAL utility credits — NOT cryptocurrency

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface BudgetAllocation {
  id: string;
  name: string;
  type: 'sphere' | 'project' | 'agent' | 'thread';
  total_tokens: number;
  used_tokens: number;
  reserved_tokens: number;
  period: string;
}

interface GovernanceLaw {
  id: number;
  code: string;
  name: string;
  description: string;
  enforcement_level: 'strict' | 'standard' | 'permissive';
  is_active: boolean;
}

interface TokenTransaction {
  id: string;
  type: 'debit' | 'credit' | 'reserve' | 'refund';
  tokens: number;
  reference: string;
  description: string;
  timestamp: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockAllocations: BudgetAllocation[] = [
  { id: '1', name: 'Personal Sphere', type: 'sphere', total_tokens: 25000, used_tokens: 8500, reserved_tokens: 2000, period: 'Monthly' },
  { id: '2', name: 'Business Sphere', type: 'sphere', total_tokens: 50000, used_tokens: 32000, reserved_tokens: 5000, period: 'Monthly' },
  { id: '3', name: 'Q4 Strategy Project', type: 'project', total_tokens: 15000, used_tokens: 9800, reserved_tokens: 1000, period: 'Project' },
  { id: '4', name: 'DOC_ANALYZER Agent', type: 'agent', total_tokens: 5000, used_tokens: 3200, reserved_tokens: 500, period: 'Monthly' },
];

const mockLaws: GovernanceLaw[] = [
  { id: 1, code: 'CONSENT_PRIMACY', name: 'Consent Primacy', description: 'No data processing without explicit user consent', enforcement_level: 'strict', is_active: true },
  { id: 2, code: 'TEMPORAL_SOVEREIGNTY', name: 'Temporal Sovereignty', description: 'User controls data lifetime and expiration', enforcement_level: 'strict', is_active: true },
  { id: 3, code: 'CONTEXTUAL_FIDELITY', name: 'Contextual Fidelity', description: 'Data stays within declared sphere context', enforcement_level: 'strict', is_active: true },
  { id: 4, code: 'HIERARCHICAL_RESPECT', name: 'Hierarchical Respect', description: 'Strict access levels and inheritance rules', enforcement_level: 'standard', is_active: true },
  { id: 5, code: 'AUDIT_COMPLETENESS', name: 'Audit Completeness', description: 'Every action logged and traceable', enforcement_level: 'strict', is_active: true },
  { id: 6, code: 'ENCODING_TRANSPARENCY', name: 'Encoding Transparency', description: 'Encoding rules visible and reversible', enforcement_level: 'standard', is_active: true },
  { id: 7, code: 'AGENT_NON_AUTONOMY', name: 'Agent Non-Autonomy', description: 'No self-directed agent learning or action', enforcement_level: 'strict', is_active: true },
  { id: 8, code: 'BUDGET_ACCOUNTABILITY', name: 'Budget Accountability', description: 'Token usage tracked and governed', enforcement_level: 'strict', is_active: true },
  { id: 9, code: 'CROSS_SPHERE_ISOLATION', name: 'Cross-Sphere Isolation', description: 'Strict separation between sphere data', enforcement_level: 'strict', is_active: true },
  { id: 10, code: 'DELETION_COMPLETENESS', name: 'Deletion Completeness', description: 'Complete data removal on request', enforcement_level: 'strict', is_active: true },
];

const mockTransactions: TokenTransaction[] = [
  { id: 't1', type: 'debit', tokens: 245, reference: 'DOC_ANALYZER', description: 'Document analysis execution', timestamp: '2024-01-15T14:30:00Z' },
  { id: 't2', type: 'debit', tokens: 180, reference: 'Thread #42', description: 'AI response generation', timestamp: '2024-01-15T13:45:00Z' },
  { id: 't3', type: 'reserve', tokens: 500, reference: 'Meeting #12', description: 'Reserved for upcoming meeting', timestamp: '2024-01-15T12:00:00Z' },
  { id: 't4', type: 'refund', tokens: 50, reference: 'Thread #40', description: 'Unused tokens returned', timestamp: '2024-01-15T11:30:00Z' },
  { id: 't5', type: 'credit', tokens: 10000, reference: 'Monthly Allocation', description: 'Monthly token credit', timestamp: '2024-01-01T00:00:00Z' },
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
  // Overview section
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  overviewCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  overviewValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.sacredGold,
    marginBottom: '4px',
  },
  overviewLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  // Allocations
  allocationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  allocationCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  allocationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  allocationName: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  allocationType: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
    textTransform: 'uppercase' as const,
  },
  progressSection: {
    marginBottom: '12px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  progressValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
  },
  progressUsed: (percent: number, isHigh: boolean) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: isHigh ? '#e74c3c' : CHENU_COLORS.sacredGold,
    transition: 'width 0.3s ease',
  }),
  progressReserved: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: CHENU_COLORS.ancientStone,
    transition: 'width 0.3s ease',
  }),
  allocationStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  // Laws section
  lawsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  lawCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  lawNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  lawContent: {
    flex: 1,
  },
  lawName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '2px',
  },
  lawDescription: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  lawEnforcement: (level: string) => {
    const colors: Record<string, string> = {
      strict: CHENU_COLORS.jungleEmerald,
      standard: CHENU_COLORS.cenoteTurquoise,
      permissive: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[level] + '22',
      color: colors[level],
      textTransform: 'uppercase' as const,
    };
  },
  lawStatus: (isActive: boolean) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isActive ? CHENU_COLORS.jungleEmerald : CHENU_COLORS.ancientStone,
  }),
  // Transactions
  transactionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  transactionIcon: (type: string) => {
    const colors: Record<string, string> = {
      debit: '#e74c3c',
      credit: CHENU_COLORS.jungleEmerald,
      reserve: CHENU_COLORS.cenoteTurquoise,
      refund: CHENU_COLORS.sacredGold,
    };
    return {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: colors[type] + '22',
      color: colors[type],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      flexShrink: 0,
    };
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  transactionReference: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  transactionAmount: (type: string) => ({
    fontSize: '14px',
    fontWeight: 600,
    color: type === 'credit' || type === 'refund' ? CHENU_COLORS.jungleEmerald : '#e74c3c',
  }),
  transactionTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    whiteSpace: 'nowrap' as const,
  },
  // Notice
  notice: {
    padding: '16px 20px',
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.sacredGold}33`,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  noticeIcon: {
    fontSize: '20px',
  },
  noticeText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  noticeHighlight: {
    color: CHENU_COLORS.sacredGold,
    fontWeight: 600,
  },
};

// ============================================================
// COMPONENTS
// ============================================================

const formatTokens = (tokens: number) => {
  return tokens.toLocaleString();
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getTransactionIcon = (type: string) => {
  const icons: Record<string, string> = {
    debit: '↓',
    credit: '↑',
    reserve: '⏸',
    refund: '↩',
  };
  return icons[type] || '•';
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const BudgetGovernanceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budget' | 'governance' | 'transactions'>('budget');
  const [allocations] = useState<BudgetAllocation[]>(mockAllocations);
  const [laws] = useState<GovernanceLaw[]>(mockLaws);
  const [transactions] = useState<TokenTransaction[]>(mockTransactions);

  // Calculate totals
  const totalTokens = allocations.reduce((sum, a) => sum + a.total_tokens, 0);
  const usedTokens = allocations.reduce((sum, a) => sum + a.used_tokens, 0);
  const reservedTokens = allocations.reduce((sum, a) => sum + a.reserved_tokens, 0);
  const availableTokens = totalTokens - usedTokens - reservedTokens;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Budget & Governance</h2>
      </div>

      <div style={styles.notice}>
        <span style={styles.noticeIcon}>💡</span>
        <span style={styles.noticeText}>
          CHE·NU Tokens are <span style={styles.noticeHighlight}>INTERNAL utility credits</span> — 
          NOT cryptocurrency. They represent intelligence energy for AI operations.
        </span>
      </div>

      <div style={styles.tabs}>
        <button
          style={styles.tab(activeTab === 'budget')}
          onClick={() => setActiveTab('budget')}
        >
          💰 Budget
        </button>
        <button
          style={styles.tab(activeTab === 'governance')}
          onClick={() => setActiveTab('governance')}
        >
          ⚖️ 10 Laws
        </button>
        <button
          style={styles.tab(activeTab === 'transactions')}
          onClick={() => setActiveTab('transactions')}
        >
          📜 Transactions
        </button>
      </div>

      {activeTab === 'budget' && (
        <>
          <div style={styles.overviewGrid}>
            <div style={styles.overviewCard}>
              <div style={styles.overviewValue}>{formatTokens(totalTokens)}</div>
              <div style={styles.overviewLabel}>Total Budget</div>
            </div>
            <div style={styles.overviewCard}>
              <div style={{ ...styles.overviewValue, color: '#e74c3c' }}>{formatTokens(usedTokens)}</div>
              <div style={styles.overviewLabel}>Used</div>
            </div>
            <div style={styles.overviewCard}>
              <div style={{ ...styles.overviewValue, color: CHENU_COLORS.cenoteTurquoise }}>{formatTokens(reservedTokens)}</div>
              <div style={styles.overviewLabel}>Reserved</div>
            </div>
            <div style={styles.overviewCard}>
              <div style={{ ...styles.overviewValue, color: CHENU_COLORS.jungleEmerald }}>{formatTokens(availableTokens)}</div>
              <div style={styles.overviewLabel}>Available</div>
            </div>
          </div>

          <div style={styles.allocationsGrid}>
            {allocations.map(allocation => {
              const usedPercent = (allocation.used_tokens / allocation.total_tokens) * 100;
              const reservedPercent = (allocation.reserved_tokens / allocation.total_tokens) * 100;
              const isHigh = usedPercent > 80;

              return (
                <div key={allocation.id} style={styles.allocationCard}>
                  <div style={styles.allocationHeader}>
                    <span style={styles.allocationName}>{allocation.name}</span>
                    <span style={styles.allocationType}>{allocation.type}</span>
                  </div>

                  <div style={styles.progressSection}>
                    <div style={styles.progressHeader}>
                      <span style={styles.progressLabel}>Usage</span>
                      <span style={styles.progressValue}>
                        {formatTokens(allocation.used_tokens)} / {formatTokens(allocation.total_tokens)}
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressUsed(usedPercent, isHigh)} />
                      <div style={styles.progressReserved(reservedPercent)} />
                    </div>
                  </div>

                  <div style={styles.allocationStats}>
                    <span>{allocation.period}</span>
                    <span>{Math.round(usedPercent)}% used • {Math.round(reservedPercent)}% reserved</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'governance' && (
        <div style={styles.lawsGrid}>
          {laws.map(law => (
            <div key={law.id} style={styles.lawCard}>
              <div style={styles.lawNumber}>{law.id}</div>
              <div style={styles.lawContent}>
                <div style={styles.lawName}>{law.name}</div>
                <div style={styles.lawDescription}>{law.description}</div>
              </div>
              <span style={styles.lawEnforcement(law.enforcement_level)}>
                {law.enforcement_level}
              </span>
              <div style={styles.lawStatus(law.is_active)} title={law.is_active ? 'Active' : 'Inactive'} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div style={styles.transactionsList}>
          {transactions.map(tx => (
            <div key={tx.id} style={styles.transactionItem}>
              <div style={styles.transactionIcon(tx.type)}>
                {getTransactionIcon(tx.type)}
              </div>
              <div style={styles.transactionContent}>
                <div style={styles.transactionDescription}>{tx.description}</div>
                <div style={styles.transactionReference}>{tx.reference}</div>
              </div>
              <span style={styles.transactionAmount(tx.type)}>
                {tx.type === 'credit' || tx.type === 'refund' ? '+' : '-'}{formatTokens(tx.tokens)}
              </span>
              <span style={styles.transactionTime}>{formatTimestamp(tx.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetGovernanceSection;
