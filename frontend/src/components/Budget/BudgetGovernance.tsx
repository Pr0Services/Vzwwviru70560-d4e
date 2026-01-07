// CHE·NU™ Budget & Governance Components
// Token budget management, governance rules, and cost tracking

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type BudgetStatus = 'healthy' | 'warning' | 'critical' | 'exceeded';
type AllocationCategory = 'threads' | 'agents' | 'meetings' | 'analysis' | 'encoding' | 'other';
type GovernanceLevel = 'permissive' | 'balanced' | 'strict' | 'custom';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface TokenAllocation {
  id: string;
  category: AllocationCategory;
  name: string;
  allocated: number;
  used: number;
  remaining: number;
  color?: string;
}

interface BudgetPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  usedBudget: number;
  allocations: TokenAllocation[];
  status: BudgetStatus;
}

interface TokenTransaction {
  id: string;
  type: 'allocation' | 'usage' | 'refund' | 'transfer';
  amount: number;
  category: AllocationCategory;
  description: string;
  entityId?: string;
  entityType?: string;
  userId: string;
  userName: string;
  timestamp: Date;
  balance: number;
}

interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  type: 'budget' | 'approval' | 'scope' | 'time' | 'custom';
  enabled: boolean;
  priority: number;
  conditions: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
    value: unknown;
  }>;
  actions: Array<{
    type: 'approve' | 'reject' | 'require_approval' | 'notify' | 'limit';
    params?: Record<string, any>;
  }>;
}

interface ApprovalRequest {
  id: string;
  type: 'budget' | 'scope' | 'agent' | 'execution';
  title: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  amount?: number;
  metadata?: Record<string, any>;
}

interface BudgetDashboardProps {
  period: BudgetPeriod;
  transactions?: TokenTransaction[];
  onAllocate?: (category: AllocationCategory, amount: number) => void;
  onTransfer?: (from: AllocationCategory, to: AllocationCategory, amount: number) => void;
  className?: string;
}

interface AllocationCardProps {
  allocation: TokenAllocation;
  onClick?: () => void;
  onAdjust?: (amount: number) => void;
  className?: string;
}

interface TransactionListProps {
  transactions: TokenTransaction[];
  onTransactionClick?: (transaction: TokenTransaction) => void;
  maxItems?: number;
  showFilters?: boolean;
  className?: string;
}

interface GovernanceSettingsProps {
  level: GovernanceLevel;
  rules: GovernanceRule[];
  onLevelChange?: (level: GovernanceLevel) => void;
  onRuleToggle?: (ruleId: string, enabled: boolean) => void;
  onRuleEdit?: (rule: GovernanceRule) => void;
  className?: string;
}

interface ApprovalQueueProps {
  requests: ApprovalRequest[];
  onApprove?: (requestId: string, notes?: string) => void;
  onReject?: (requestId: string, notes?: string) => void;
  onRequestClick?: (request: ApprovalRequest) => void;
  className?: string;
}

interface CostBreakdownProps {
  allocations: TokenAllocation[];
  showPercentages?: boolean;
  showChart?: boolean;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const BUDGET_STATUS_CONFIG: Record<BudgetStatus, { color: string; label: string; icon: string }> = {
  healthy: { color: '#38A169', label: 'Healthy', icon: '✅' },
  warning: { color: BRAND.sacredGold, label: 'Warning', icon: '⚠️' },
  critical: { color: '#DD6B20', label: 'Critical', icon: '🔶' },
  exceeded: { color: '#E53E3E', label: 'Exceeded', icon: '🚫' },
};

const CATEGORY_CONFIG: Record<AllocationCategory, { color: string; label: string; icon: string }> = {
  threads: { color: BRAND.cenoteTurquoise, label: 'Threads', icon: '💬' },
  agents: { color: '#805AD5', label: 'Agents', icon: '🤖' },
  meetings: { color: '#3182CE', label: 'Meetings', icon: '📅' },
  analysis: { color: BRAND.sacredGold, label: 'Analysis', icon: '📊' },
  encoding: { color: BRAND.jungleEmerald, label: 'Encoding', icon: '🔐' },
  other: { color: BRAND.ancientStone, label: 'Other', icon: '📦' },
};

const GOVERNANCE_LEVEL_CONFIG: Record<GovernanceLevel, { color: string; label: string; description: string }> = {
  permissive: {
    color: '#38A169',
    label: 'Permissive',
    description: 'Minimal restrictions, maximum autonomy',
  },
  balanced: {
    color: BRAND.cenoteTurquoise,
    label: 'Balanced',
    description: 'Reasonable controls with flexibility',
  },
  strict: {
    color: '#DD6B20',
    label: 'Strict',
    description: 'Strong controls, approval required for most actions',
  },
  custom: {
    color: '#805AD5',
    label: 'Custom',
    description: 'Custom rules configured manually',
  },
};

const APPROVAL_STATUS_CONFIG: Record<ApprovalStatus, { color: string; label: string; icon: string }> = {
  pending: { color: BRAND.sacredGold, label: 'Pending', icon: '⏳' },
  approved: { color: '#38A169', label: 'Approved', icon: '✅' },
  rejected: { color: '#E53E3E', label: 'Rejected', icon: '❌' },
  expired: { color: BRAND.ancientStone, label: 'Expired', icon: '⌛' },
};

// ============================================================
// UTILITIES
// ============================================================

function formatTokens(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toLocaleString();
}

function getBudgetStatus(used: number, total: number): BudgetStatus {
  const percent = (used / total) * 100;
  if (percent >= 100) return 'exceeded';
  if (percent >= 90) return 'critical';
  if (percent >= 70) return 'warning';
  return 'healthy';
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Budget dashboard
  budgetDashboard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  budgetHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  budgetOverview: {
    flex: 1,
  },

  budgetTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  budgetPeriod: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginBottom: '20px',
  },

  budgetProgress: {
    marginBottom: '16px',
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  progressLabel: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  progressValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  progressBar: {
    height: '12px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '6px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.3s',
  },

  budgetStats: {
    display: 'flex',
    gap: '24px',
  },

  budgetStat: {
    textAlign: 'center' as const,
  },

  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  statLabel: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  budgetStatus: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '12px',
  },

  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 500,
  },

  allocateButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  allocateButtonHover: {
    backgroundColor: BRAND.earthEmber,
  },

  // Allocation cards
  allocationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },

  allocationCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  allocationCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  allocationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },

  allocationIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },

  allocationInfo: {
    flex: 1,
  },

  allocationName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  allocationCategory: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  allocationProgress: {
    marginBottom: '12px',
  },

  allocationProgressBar: {
    height: '6px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '3px',
    overflow: 'hidden',
  },

  allocationProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s',
  },

  allocationStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },

  allocationUsed: {
    color: BRAND.uiSlate,
    fontWeight: 500,
  },

  allocationRemaining: {
    color: BRAND.ancientStone,
  },

  // Transaction list
  transactionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}10`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  transactionItemHover: {
    borderColor: BRAND.sacredGold,
    backgroundColor: BRAND.softSand,
  },

  transactionIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  transactionContent: {
    flex: 1,
    minWidth: 0,
  },

  transactionDescription: {
    fontSize: '14px',
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  transactionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  transactionAmount: {
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'right' as const,
  },

  transactionAmountPositive: {
    color: '#38A169',
  },

  transactionAmountNegative: {
    color: '#E53E3E',
  },

  transactionBalance: {
    fontSize: '11px',
    color: BRAND.ancientStone,
  },

  // Governance settings
  governanceSettings: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  levelSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },

  levelOption: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: BRAND.softSand,
    border: `2px solid transparent`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center' as const,
  },

  levelOptionSelected: {
    borderColor: BRAND.sacredGold,
    backgroundColor: `${BRAND.sacredGold}10`,
  },

  levelIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    backgroundColor: '#ffffff',
  },

  levelName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  levelDescription: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
  },

  rulesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  ruleContent: {
    flex: 1,
  },

  ruleName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  ruleDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.4,
  },

  ruleToggle: {
    width: '44px',
    height: '24px',
    borderRadius: '100px',
    backgroundColor: `${BRAND.ancientStone}30`,
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
  },

  ruleToggleEnabled: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  ruleToggleKnob: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },

  ruleToggleKnobEnabled: {
    transform: 'translateX(20px)',
  },

  ruleEditButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Approval queue
  approvalQueue: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  approvalItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    transition: 'all 0.15s',
  },

  approvalItemHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },

  approvalIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },

  approvalContent: {
    flex: 1,
    minWidth: 0,
  },

  approvalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },

  approvalTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  approvalStatusBadge: {
    padding: '2px 8px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: 500,
  },

  approvalDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    marginBottom: '8px',
    lineHeight: 1.4,
  },

  approvalMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  approvalAmount: {
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  approvalActions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  approveButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#38A169',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  rejectButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#E53E3E',
    backgroundColor: 'transparent',
    border: `1px solid #E53E3E`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Cost breakdown
  costBreakdown: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    padding: '20px',
  },

  breakdownTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '16px',
  },

  breakdownChart: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginBottom: '20px',
  },

  donutChart: {
    width: '120px',
    height: '120px',
    flexShrink: 0,
  },

  breakdownLegend: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
    flexShrink: 0,
  },

  legendLabel: {
    flex: 1,
    fontSize: '13px',
    color: BRAND.uiSlate,
  },

  legendValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  legendPercent: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    minWidth: '40px',
    textAlign: 'right' as const,
  },

  // Section
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  sectionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  sectionContent: {
    padding: '20px',
  },

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },
};

// ============================================================
// ALLOCATION CARD COMPONENT
// ============================================================

export function AllocationCard({
  allocation,
  onClick,
  onAdjust,
  className,
}: AllocationCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[allocation.category];
  const usagePercent = (allocation.used / allocation.allocated) * 100;
  const status = getBudgetStatus(allocation.used, allocation.allocated);
  const statusConfig = BUDGET_STATUS_CONFIG[status];

  return (
    <div
      style={{
        ...styles.allocationCard,
        ...(isHovered && styles.allocationCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.allocationHeader}>
        <div
          style={{
            ...styles.allocationIcon,
            backgroundColor: `${categoryConfig.color}15`,
            color: categoryConfig.color,
          }}
        >
          {categoryConfig.icon}
        </div>
        <div style={styles.allocationInfo}>
          <div style={styles.allocationName}>{allocation.name}</div>
          <div style={styles.allocationCategory}>{categoryConfig.label}</div>
        </div>
      </div>

      <div style={styles.allocationProgress}>
        <div style={styles.allocationProgressBar}>
          <div
            style={{
              ...styles.allocationProgressFill,
              width: `${Math.min(usagePercent, 100)}%`,
              backgroundColor: statusConfig.color,
            }}
          />
        </div>
      </div>

      <div style={styles.allocationStats}>
        <span style={styles.allocationUsed}>
          {formatTokens(allocation.used)} used
        </span>
        <span style={styles.allocationRemaining}>
          {formatTokens(allocation.remaining)} left
        </span>
      </div>
    </div>
  );
}

// ============================================================
// TRANSACTION LIST COMPONENT
// ============================================================

export function TransactionList({
  transactions,
  onTransactionClick,
  maxItems = 20,
  showFilters = false,
  className,
}: TransactionListProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayedTransactions = transactions.slice(0, maxItems);

  if (displayedTransactions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>💳</div>
        <div style={styles.emptyText}>No transactions yet</div>
      </div>
    );
  }

  return (
    <div style={styles.transactionList} className={className}>
      {displayedTransactions.map((transaction) => {
        const categoryConfig = CATEGORY_CONFIG[transaction.category];
        const isHovered = hoveredId === transaction.id;
        const isPositive = transaction.type === 'allocation' || transaction.type === 'refund';

        return (
          <div
            key={transaction.id}
            style={{
              ...styles.transactionItem,
              ...(isHovered && styles.transactionItemHover),
            }}
            onClick={() => onTransactionClick?.(transaction)}
            onMouseEnter={() => setHoveredId(transaction.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              style={{
                ...styles.transactionIcon,
                backgroundColor: `${categoryConfig.color}15`,
                color: categoryConfig.color,
              }}
            >
              {categoryConfig.icon}
            </div>

            <div style={styles.transactionContent}>
              <div style={styles.transactionDescription}>
                {transaction.description}
              </div>
              <div style={styles.transactionMeta}>
                <span>{transaction.userName}</span>
                <span>•</span>
                <span>{formatRelativeTime(transaction.timestamp)}</span>
              </div>
            </div>

            <div>
              <div
                style={{
                  ...styles.transactionAmount,
                  ...(isPositive
                    ? styles.transactionAmountPositive
                    : styles.transactionAmountNegative),
                }}
              >
                {isPositive ? '+' : '-'}{formatTokens(transaction.amount)}
              </div>
              <div style={styles.transactionBalance}>
                Balance: {formatTokens(transaction.balance)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// GOVERNANCE SETTINGS COMPONENT
// ============================================================

export function GovernanceSettings({
  level,
  rules,
  onLevelChange,
  onRuleToggle,
  onRuleEdit,
  className,
}: GovernanceSettingsProps): JSX.Element {
  return (
    <div style={styles.governanceSettings} className={className}>
      {/* Level selector */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Governance Level</span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.levelSelector}>
            {Object.entries(GOVERNANCE_LEVEL_CONFIG).map(([key, config]) => (
              <div
                key={key}
                style={{
                  ...styles.levelOption,
                  ...(level === key && styles.levelOptionSelected),
                }}
                onClick={() => onLevelChange?.(key as GovernanceLevel)}
              >
                <div
                  style={{
                    ...styles.levelIcon,
                    border: `2px solid ${config.color}`,
                    color: config.color,
                  }}
                >
                  {key === 'permissive' && '🌿'}
                  {key === 'balanced' && '⚖️'}
                  {key === 'strict' && '🔒'}
                  {key === 'custom' && '⚙️'}
                </div>
                <div style={styles.levelName}>{config.label}</div>
                <div style={styles.levelDescription}>{config.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Governance Rules ({rules.length})</span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.rulesList}>
            {rules.map((rule) => (
              <div key={rule.id} style={styles.ruleItem}>
                <div style={styles.ruleContent}>
                  <div style={styles.ruleName}>{rule.name}</div>
                  <div style={styles.ruleDescription}>{rule.description}</div>
                </div>

                <button
                  style={styles.ruleEditButton}
                  onClick={() => onRuleEdit?.(rule)}
                >
                  Edit
                </button>

                <div
                  style={{
                    ...styles.ruleToggle,
                    ...(rule.enabled && styles.ruleToggleEnabled),
                  }}
                  onClick={() => onRuleToggle?.(rule.id, !rule.enabled)}
                >
                  <div
                    style={{
                      ...styles.ruleToggleKnob,
                      ...(rule.enabled && styles.ruleToggleKnobEnabled),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APPROVAL QUEUE COMPONENT
// ============================================================

export function ApprovalQueue({
  requests,
  onApprove,
  onReject,
  onRequestClick,
  className,
}: ApprovalQueueProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  if (pendingRequests.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>✅</div>
        <div style={styles.emptyText}>No pending approvals</div>
      </div>
    );
  }

  return (
    <div style={styles.approvalQueue} className={className}>
      {pendingRequests.map((request) => {
        const statusConfig = APPROVAL_STATUS_CONFIG[request.status];
        const isHovered = hoveredId === request.id;

        return (
          <div
            key={request.id}
            style={{
              ...styles.approvalItem,
              ...(isHovered && styles.approvalItemHover),
            }}
            onMouseEnter={() => setHoveredId(request.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              style={{
                ...styles.approvalIcon,
                backgroundColor: BRAND.softSand,
                color: BRAND.sacredGold,
              }}
            >
              ⏳
            </div>

            <div
              style={styles.approvalContent}
              onClick={() => onRequestClick?.(request)}
            >
              <div style={styles.approvalHeader}>
                <span style={styles.approvalTitle}>{request.title}</span>
                <span
                  style={{
                    ...styles.approvalStatusBadge,
                    backgroundColor: `${statusConfig.color}15`,
                    color: statusConfig.color,
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>
              <div style={styles.approvalDescription}>
                {request.description}
              </div>
              <div style={styles.approvalMeta}>
                <span>By {request.requestedByName}</span>
                <span>•</span>
                <span>{formatRelativeTime(request.requestedAt)}</span>
                {request.amount && (
                  <>
                    <span>•</span>
                    <span style={styles.approvalAmount}>
                      {formatTokens(request.amount)} tokens
                    </span>
                  </>
                )}
              </div>
            </div>

            <div style={styles.approvalActions}>
              <button
                style={styles.approveButton}
                onClick={() => onApprove?.(request.id)}
              >
                Approve
              </button>
              <button
                style={styles.rejectButton}
                onClick={() => onReject?.(request.id)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// COST BREAKDOWN COMPONENT
// ============================================================

export function CostBreakdown({
  allocations,
  showPercentages = true,
  showChart = true,
  className,
}: CostBreakdownProps): JSX.Element {
  const total = allocations.reduce((sum, a) => sum + a.used, 0);

  // Calculate pie chart segments
  let currentAngle = -90;
  const segments = allocations.map((allocation) => {
    const percent = (allocation.used / total) * 100;
    const angle = (percent / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const categoryConfig = CATEGORY_CONFIG[allocation.category];
    const radius = 50;
    const cx = 60;
    const cy = 60;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      allocation,
      percent,
      color: categoryConfig.color,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div style={styles.costBreakdown} className={className}>
      <div style={styles.breakdownTitle}>Cost Breakdown</div>

      <div style={styles.breakdownChart}>
        {showChart && (
          <svg style={styles.donutChart} viewBox="0 0 120 120">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
            <circle cx="60" cy="60" r="30" fill="#ffffff" />
            <text
              x="60"
              y="60"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="700"
              fill={BRAND.uiSlate}
            >
              {formatTokens(total)}
            </text>
          </svg>
        )}

        <div style={styles.breakdownLegend}>
          {allocations.map((allocation) => {
            const categoryConfig = CATEGORY_CONFIG[allocation.category];
            const percent = ((allocation.used / total) * 100).toFixed(1);

            return (
              <div key={allocation.id} style={styles.legendItem}>
                <div
                  style={{
                    ...styles.legendDot,
                    backgroundColor: categoryConfig.color,
                  }}
                />
                <span style={styles.legendLabel}>{allocation.name}</span>
                <span style={styles.legendValue}>
                  {formatTokens(allocation.used)}
                </span>
                {showPercentages && (
                  <span style={styles.legendPercent}>{percent}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BUDGET DASHBOARD COMPONENT
// ============================================================

export function BudgetDashboard({
  period,
  transactions = [],
  onAllocate,
  onTransfer,
  className,
}: BudgetDashboardProps): JSX.Element {
  const [allocateHovered, setAllocateHovered] = useState(false);

  const usagePercent = (period.usedBudget / period.totalBudget) * 100;
  const statusConfig = BUDGET_STATUS_CONFIG[period.status];

  return (
    <div style={styles.budgetDashboard} className={className}>
      {/* Header with overview */}
      <div style={styles.budgetHeader}>
        <div style={styles.budgetOverview}>
          <div style={styles.budgetTitle}>{period.name}</div>
          <div style={styles.budgetPeriod}>
            {formatDate(period.startDate)} - {formatDate(period.endDate)}
          </div>

          <div style={styles.budgetProgress}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Token Usage</span>
              <span style={styles.progressValue}>
                {formatTokens(period.usedBudget)} / {formatTokens(period.totalBudget)}
              </span>
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.min(usagePercent, 100)}%`,
                  backgroundColor: statusConfig.color,
                }}
              />
            </div>
          </div>

          <div style={styles.budgetStats}>
            <div style={styles.budgetStat}>
              <div style={styles.statValue}>{usagePercent.toFixed(1)}%</div>
              <div style={styles.statLabel}>Used</div>
            </div>
            <div style={styles.budgetStat}>
              <div style={styles.statValue}>
                {formatTokens(period.totalBudget - period.usedBudget)}
              </div>
              <div style={styles.statLabel}>Remaining</div>
            </div>
            <div style={styles.budgetStat}>
              <div style={styles.statValue}>{period.allocations.length}</div>
              <div style={styles.statLabel}>Allocations</div>
            </div>
          </div>
        </div>

        <div style={styles.budgetStatus}>
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: `${statusConfig.color}15`,
              color: statusConfig.color,
            }}
          >
            {statusConfig.icon} {statusConfig.label}
          </div>
          {onAllocate && (
            <button
              style={{
                ...styles.allocateButton,
                ...(allocateHovered && styles.allocateButtonHover),
              }}
              onClick={() => onAllocate('other', 0)}
              onMouseEnter={() => setAllocateHovered(true)}
              onMouseLeave={() => setAllocateHovered(false)}
            >
              ➕ Allocate Tokens
            </button>
          )}
        </div>
      </div>

      {/* Allocations grid */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>
            Allocations ({period.allocations.length})
          </span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.allocationGrid}>
            {period.allocations.map((allocation) => (
              <AllocationCard key={allocation.id} allocation={allocation} />
            ))}
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <CostBreakdown allocations={period.allocations} />

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Recent Transactions</span>
          </div>
          <div style={styles.sectionContent}>
            <TransactionList transactions={transactions} maxItems={10} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  BudgetStatus,
  AllocationCategory,
  GovernanceLevel,
  ApprovalStatus,
  TokenAllocation,
  BudgetPeriod,
  TokenTransaction,
  GovernanceRule,
  ApprovalRequest,
  BudgetDashboardProps,
  AllocationCardProps,
  TransactionListProps,
  GovernanceSettingsProps,
  ApprovalQueueProps,
  CostBreakdownProps,
};

export {
  BUDGET_STATUS_CONFIG,
  CATEGORY_CONFIG,
  GOVERNANCE_LEVEL_CONFIG,
  APPROVAL_STATUS_CONFIG,
  formatTokens,
  getBudgetStatus,
  formatDate,
  formatDateTime,
  formatRelativeTime,
};

export default {
  BudgetDashboard,
  AllocationCard,
  TransactionList,
  GovernanceSettings,
  ApprovalQueue,
  CostBreakdown,
};
