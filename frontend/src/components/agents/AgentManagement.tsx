// CHE·NU™ Agent Management Components
// Complete AI agent orchestration, monitoring, and governance

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

type AgentStatus = 'active' | 'idle' | 'busy' | 'paused' | 'error' | 'offline';
type AgentRole = 'orchestrator' | 'specialist' | 'assistant' | 'analyzer' | 'executor';
type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  averageResponseTime: number;
  tokensUsed: number;
  tokenBudget: number;
  uptime: number;
  lastActive: Date;
}

interface Agent {
  id: string;
  name: string;
  description?: string;
  role: AgentRole;
  status: AgentStatus;
  avatar?: string;
  capabilities: AgentCapability[];
  metrics: AgentMetrics;
  sphereId?: string;
  parentAgentId?: string;
  childAgents?: string[];
  encodingCompatibility: number;
  costPerTask: number;
  isSystemAgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentExecution {
  id: string;
  agentId: string;
  taskId: string;
  status: ExecutionStatus;
  input: string;
  output?: string;
  tokensUsed: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  error?: string;
  steps?: Array<{
    id: string;
    name: string;
    status: ExecutionStatus;
    duration?: number;
    details?: string;
  }>;
}

interface AgentMessage {
  id: string;
  agentId: string;
  type: 'request' | 'response' | 'error' | 'notification';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface AgentListProps {
  agents: Agent[];
  view?: 'grid' | 'list';
  onAgentClick?: (agent: Agent) => void;
  onAgentToggle?: (agent: Agent, active: boolean) => void;
  showMetrics?: boolean;
  className?: string;
}

interface AgentCardProps {
  agent: Agent;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  onToggle?: (active: boolean) => void;
  className?: string;
}

interface AgentDetailProps {
  agent: Agent;
  executions?: AgentExecution[];
  messages?: AgentMessage[];
  onUpdateAgent?: (updates: Partial<Agent>) => void;
  onToggleCapability?: (capabilityId: string) => void;
  className?: string;
}

interface ExecutionLogProps {
  executions: AgentExecution[];
  onExecutionClick?: (execution: AgentExecution) => void;
  maxItems?: number;
  className?: string;
}

interface AgentChatProps {
  agent: Agent;
  messages: AgentMessage[];
  onSendMessage?: (content: string) => void;
  isTyping?: boolean;
  className?: string;
}

interface TokenBudgetProps {
  used: number;
  budget: number;
  showBreakdown?: boolean;
  breakdown?: Array<{
    label: string;
    amount: number;
  }>;
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

const STATUS_CONFIG: Record<AgentStatus, { color: string; label: string; icon: string }> = {
  active: { color: '#38A169', label: 'Active', icon: '🟢' },
  idle: { color: BRAND.sacredGold, label: 'Idle', icon: '🟡' },
  busy: { color: BRAND.cenoteTurquoise, label: 'Busy', icon: '🔵' },
  paused: { color: '#DD6B20', label: 'Paused', icon: '🟠' },
  error: { color: '#E53E3E', label: 'Error', icon: '🔴' },
  offline: { color: BRAND.ancientStone, label: 'Offline', icon: '⚫' },
};

const ROLE_CONFIG: Record<AgentRole, { color: string; label: string; icon: string }> = {
  orchestrator: { color: BRAND.sacredGold, label: 'Orchestrator', icon: '🎯' },
  specialist: { color: '#805AD5', label: 'Specialist', icon: '🔬' },
  assistant: { color: BRAND.cenoteTurquoise, label: 'Assistant', icon: '💬' },
  analyzer: { color: '#3182CE', label: 'Analyzer', icon: '📊' },
  executor: { color: BRAND.jungleEmerald, label: 'Executor', icon: '⚡' },
};

const EXECUTION_STATUS_CONFIG: Record<ExecutionStatus, { color: string; icon: string }> = {
  pending: { color: BRAND.ancientStone, icon: '○' },
  running: { color: BRAND.cenoteTurquoise, icon: '◐' },
  completed: { color: '#38A169', icon: '●' },
  failed: { color: '#E53E3E', icon: '✕' },
  cancelled: { color: '#DD6B20', icon: '◌' },
};

// ============================================================
// UTILITIES
// ============================================================

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function formatUptime(hours: number): string {
  if (hours < 24) return `${hours.toFixed(1)}h`;
  if (hours < 168) return `${(hours / 24).toFixed(1)}d`;
  return `${(hours / 168).toFixed(1)}w`;
}

function getTokenUsageColor(used: number, budget: number): string {
  const percent = (used / budget) * 100;
  if (percent >= 90) return '#E53E3E';
  if (percent >= 70) return '#DD6B20';
  if (percent >= 50) return BRAND.sacredGold;
  return '#38A169';
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Agent list
  agentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  agentListHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  agentListTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  agentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },

  // Agent card
  agentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  agentCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  agentCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  agentAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
    overflow: 'hidden',
  },

  agentInfo: {
    flex: 1,
    minWidth: 0,
  },

  agentName: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  agentRole: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
  },

  agentRoleBadge: {
    padding: '2px 8px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: 500,
  },

  agentStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  agentStatusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  agentToggle: {
    position: 'relative' as const,
    width: '40px',
    height: '24px',
    backgroundColor: `${BRAND.ancientStone}30`,
    borderRadius: '100px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  agentToggleActive: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  agentToggleKnob: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },

  agentToggleKnobActive: {
    transform: 'translateX(16px)',
  },

  agentCardBody: {
    padding: '16px',
  },

  agentDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
  },

  agentMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },

  metricItem: {
    textAlign: 'center' as const,
  },

  metricValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  metricLabel: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  agentCapabilities: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginTop: '12px',
  },

  capabilityTag: {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    borderRadius: '4px',
  },

  capabilityTagEnabled: {
    color: BRAND.cenoteTurquoise,
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
  },

  // Agent detail
  agentDetail: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  detailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  detailAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    flexShrink: 0,
    overflow: 'hidden',
  },

  detailInfo: {
    flex: 1,
  },

  detailName: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  detailDescription: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.6,
    marginBottom: '16px',
  },

  detailMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },

  detailMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  detailStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },

  statCard: {
    padding: '16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
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

  // Capabilities list
  capabilitiesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  capabilityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    transition: 'background-color 0.15s',
  },

  capabilityItemHover: {
    backgroundColor: `${BRAND.ancientStone}15`,
  },

  capabilityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  capabilityContent: {
    flex: 1,
  },

  capabilityName: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  capabilityDescription: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  capabilityToggle: {
    width: '36px',
    height: '20px',
    borderRadius: '100px',
    backgroundColor: `${BRAND.ancientStone}30`,
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
  },

  capabilityToggleEnabled: {
    backgroundColor: BRAND.cenoteTurquoise,
  },

  capabilityToggleKnob: {
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s',
  },

  capabilityToggleKnobEnabled: {
    transform: 'translateX(16px)',
  },

  // Execution log
  executionLog: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  executionItem: {
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

  executionItemHover: {
    borderColor: BRAND.sacredGold,
    backgroundColor: BRAND.softSand,
  },

  executionStatus: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
  },

  executionContent: {
    flex: 1,
    minWidth: 0,
  },

  executionTask: {
    fontSize: '14px',
    color: BRAND.uiSlate,
    marginBottom: '2px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  executionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  executionTokens: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  executionDuration: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Agent chat
  agentChat: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  chatHeaderAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  chatHeaderInfo: {
    flex: 1,
  },

  chatHeaderName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  chatHeaderStatus: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  chatMessages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  chatMessage: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: 1.5,
  },

  chatMessageRequest: {
    alignSelf: 'flex-end',
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },

  chatMessageResponse: {
    alignSelf: 'flex-start',
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    borderBottomLeftRadius: '4px',
  },

  chatMessageError: {
    alignSelf: 'flex-start',
    backgroundColor: '#FED7D7',
    color: '#822727',
  },

  chatMessageTime: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },

  chatTyping: {
    padding: '10px 14px',
    alignSelf: 'flex-start',
    backgroundColor: BRAND.softSand,
    borderRadius: '12px',
    color: BRAND.ancientStone,
    fontSize: '14px',
    fontStyle: 'italic',
  },

  chatInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}08`,
  },

  chatInputField: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
  },

  chatSendButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  chatSendButtonHover: {
    backgroundColor: BRAND.earthEmber,
  },

  // Token budget
  tokenBudget: {
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  tokenBudgetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  tokenBudgetTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  tokenBudgetValue: {
    fontSize: '14px',
    fontWeight: 600,
  },

  tokenBudgetBar: {
    height: '8px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px',
  },

  tokenBudgetFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },

  tokenBudgetBreakdown: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  tokenBreakdownItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
  },

  tokenBreakdownLabel: {
    color: BRAND.ancientStone,
  },

  tokenBreakdownValue: {
    fontWeight: 500,
    color: BRAND.uiSlate,
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
// AGENT CARD COMPONENT
// ============================================================

export function AgentCard({
  agent,
  variant = 'detailed',
  onClick,
  onToggle,
  className,
}: AgentCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = STATUS_CONFIG[agent.status];
  const roleConfig = ROLE_CONFIG[agent.role];
  const isActive = agent.status === 'active' || agent.status === 'busy';

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(!isActive);
  };

  return (
    <div
      style={{
        ...styles.agentCard,
        ...(isHovered && styles.agentCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.agentCardHeader}>
        <div style={styles.agentAvatar}>
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            roleConfig.icon
          )}
        </div>

        <div style={styles.agentInfo}>
          <div style={styles.agentName}>
            {agent.name}
            {agent.isSystemAgent && <span style={{ fontSize: '10px' }}>⚙️</span>}
          </div>
          <div style={styles.agentRole}>
            <span
              style={{
                ...styles.agentRoleBadge,
                backgroundColor: `${roleConfig.color}15`,
                color: roleConfig.color,
              }}
            >
              {roleConfig.label}
            </span>
            <span style={styles.agentStatus}>
              <span style={{ ...styles.agentStatusDot, backgroundColor: statusConfig.color }} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {onToggle && !agent.isSystemAgent && (
          <div
            style={{
              ...styles.agentToggle,
              ...(isActive && styles.agentToggleActive),
            }}
            onClick={handleToggle}
          >
            <div
              style={{
                ...styles.agentToggleKnob,
                ...(isActive && styles.agentToggleKnobActive),
              }}
            />
          </div>
        )}
      </div>

      {variant === 'detailed' && (
        <div style={styles.agentCardBody}>
          {agent.description && (
            <p style={styles.agentDescription}>{agent.description}</p>
          )}

          <div style={styles.agentMetrics}>
            <div style={styles.metricItem}>
              <div style={styles.metricValue}>{agent.metrics.tasksCompleted}</div>
              <div style={styles.metricLabel}>Completed</div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricValue}>
                {formatTokens(agent.metrics.tokensUsed)}
              </div>
              <div style={styles.metricLabel}>Tokens</div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricValue}>
                {agent.metrics.averageResponseTime.toFixed(1)}s
              </div>
              <div style={styles.metricLabel}>Avg Time</div>
            </div>
          </div>

          {agent.capabilities.length > 0 && (
            <div style={styles.agentCapabilities}>
              {agent.capabilities.slice(0, 4).map((cap) => (
                <span
                  key={cap.id}
                  style={{
                    ...styles.capabilityTag,
                    ...(cap.enabled && styles.capabilityTagEnabled),
                  }}
                >
                  {cap.name}
                </span>
              ))}
              {agent.capabilities.length > 4 && (
                <span style={styles.capabilityTag}>
                  +{agent.capabilities.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// AGENT LIST COMPONENT
// ============================================================

export function AgentList({
  agents,
  view = 'grid',
  onAgentClick,
  onAgentToggle,
  showMetrics = true,
  className,
}: AgentListProps): JSX.Element {
  if (agents.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🤖</div>
        <div style={styles.emptyText}>No agents configured</div>
      </div>
    );
  }

  return (
    <div style={styles.agentList} className={className}>
      <div style={styles.agentListHeader}>
        <span style={styles.agentListTitle}>Agents ({agents.length})</span>
      </div>
      <div style={view === 'grid' ? styles.agentGrid : styles.agentList}>
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            variant={showMetrics ? 'detailed' : 'compact'}
            onClick={() => onAgentClick?.(agent)}
            onToggle={(active) => onAgentToggle?.(agent, active)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXECUTION LOG COMPONENT
// ============================================================

export function ExecutionLog({
  executions,
  onExecutionClick,
  maxItems = 10,
  className,
}: ExecutionLogProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayedExecutions = executions.slice(0, maxItems);

  if (displayedExecutions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📋</div>
        <div style={styles.emptyText}>No executions yet</div>
      </div>
    );
  }

  return (
    <div style={styles.executionLog} className={className}>
      {displayedExecutions.map((execution) => {
        const statusConfig = EXECUTION_STATUS_CONFIG[execution.status];
        const isHovered = hoveredId === execution.id;

        return (
          <div
            key={execution.id}
            style={{
              ...styles.executionItem,
              ...(isHovered && styles.executionItemHover),
            }}
            onClick={() => onExecutionClick?.(execution)}
            onMouseEnter={() => setHoveredId(execution.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              style={{
                ...styles.executionStatus,
                backgroundColor: `${statusConfig.color}15`,
                color: statusConfig.color,
              }}
            >
              {statusConfig.icon}
            </div>

            <div style={styles.executionContent}>
              <div style={styles.executionTask}>{execution.input}</div>
              <div style={styles.executionMeta}>
                <div style={styles.executionTokens}>
                  🪙 {formatTokens(execution.tokensUsed)}
                </div>
                {execution.duration && (
                  <div style={styles.executionDuration}>
                    ⏱️ {formatDuration(execution.duration)}
                  </div>
                )}
                <span>
                  {new Date(execution.startedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// AGENT CHAT COMPONENT
// ============================================================

export function AgentChat({
  agent,
  messages,
  onSendMessage,
  isTyping = false,
  className,
}: AgentChatProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [sendHovered, setSendHovered] = useState(false);

  const statusConfig = STATUS_CONFIG[agent.status];
  const roleConfig = ROLE_CONFIG[agent.role];

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.agentChat} className={className}>
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderAvatar}>{roleConfig.icon}</div>
        <div style={styles.chatHeaderInfo}>
          <div style={styles.chatHeaderName}>{agent.name}</div>
          <div style={styles.chatHeaderStatus}>
            {statusConfig.icon} {statusConfig.label}
          </div>
        </div>
      </div>

      <div style={styles.chatMessages}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.chatMessage,
              ...(message.type === 'request' && styles.chatMessageRequest),
              ...(message.type === 'response' && styles.chatMessageResponse),
              ...(message.type === 'error' && styles.chatMessageError),
            }}
          >
            {message.content}
            <div style={styles.chatMessageTime}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={styles.chatTyping}>
            {agent.name} is typing...
          </div>
        )}
      </div>

      <div style={styles.chatInput}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${agent.name}...`}
          style={styles.chatInputField}
        />
        <button
          style={{
            ...styles.chatSendButton,
            ...(sendHovered && styles.chatSendButtonHover),
          }}
          onClick={handleSend}
          onMouseEnter={() => setSendHovered(true)}
          onMouseLeave={() => setSendHovered(false)}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================================
// TOKEN BUDGET COMPONENT
// ============================================================

export function TokenBudget({
  used,
  budget,
  showBreakdown = false,
  breakdown,
  className,
}: TokenBudgetProps): JSX.Element {
  const percent = (used / budget) * 100;
  const color = getTokenUsageColor(used, budget);

  return (
    <div style={styles.tokenBudget} className={className}>
      <div style={styles.tokenBudgetHeader}>
        <span style={styles.tokenBudgetTitle}>Token Budget</span>
        <span style={{ ...styles.tokenBudgetValue, color }}>
          {formatTokens(used)} / {formatTokens(budget)}
        </span>
      </div>

      <div style={styles.tokenBudgetBar}>
        <div
          style={{
            ...styles.tokenBudgetFill,
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {showBreakdown && breakdown && (
        <div style={styles.tokenBudgetBreakdown}>
          {breakdown.map((item, index) => (
            <div key={index} style={styles.tokenBreakdownItem}>
              <span style={styles.tokenBreakdownLabel}>{item.label}</span>
              <span style={styles.tokenBreakdownValue}>
                {formatTokens(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// AGENT DETAIL COMPONENT
// ============================================================

export function AgentDetail({
  agent,
  executions = [],
  messages = [],
  onUpdateAgent,
  onToggleCapability,
  className,
}: AgentDetailProps): JSX.Element {
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);

  const statusConfig = STATUS_CONFIG[agent.status];
  const roleConfig = ROLE_CONFIG[agent.role];

  return (
    <div style={styles.agentDetail} className={className}>
      {/* Header */}
      <div style={styles.detailHeader}>
        <div style={styles.detailAvatar}>
          {agent.avatar ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            roleConfig.icon
          )}
        </div>

        <div style={styles.detailInfo}>
          <div style={styles.detailName}>
            {agent.name}
            <span
              style={{
                ...styles.agentRoleBadge,
                backgroundColor: `${roleConfig.color}15`,
                color: roleConfig.color,
              }}
            >
              {roleConfig.label}
            </span>
            <span
              style={{
                ...styles.agentRoleBadge,
                backgroundColor: `${statusConfig.color}15`,
                color: statusConfig.color,
              }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>

          {agent.description && (
            <p style={styles.detailDescription}>{agent.description}</p>
          )}

          <div style={styles.detailMeta}>
            <div style={styles.detailMetaItem}>
              📊 Encoding: {agent.encodingCompatibility}%
            </div>
            <div style={styles.detailMetaItem}>
              💰 Cost: {agent.costPerTask} tokens/task
            </div>
            <div style={styles.detailMetaItem}>
              ⏱️ Uptime: {formatUptime(agent.metrics.uptime)}
            </div>
          </div>
        </div>

        <div style={styles.detailStats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{agent.metrics.tasksCompleted}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{agent.metrics.tasksInProgress}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{formatTokens(agent.metrics.tokensUsed)}</div>
            <div style={styles.statLabel}>Tokens</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{agent.metrics.averageResponseTime.toFixed(1)}s</div>
            <div style={styles.statLabel}>Avg Time</div>
          </div>
        </div>
      </div>

      {/* Token Budget */}
      <TokenBudget
        used={agent.metrics.tokensUsed}
        budget={agent.metrics.tokenBudget}
        showBreakdown
        breakdown={[
          { label: 'Executions', amount: Math.floor(agent.metrics.tokensUsed * 0.7) },
          { label: 'Analysis', amount: Math.floor(agent.metrics.tokensUsed * 0.2) },
          { label: 'Other', amount: Math.floor(agent.metrics.tokensUsed * 0.1) },
        ]}
      />

      {/* Capabilities */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Capabilities ({agent.capabilities.length})</span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.capabilitiesList}>
            {agent.capabilities.map((capability) => (
              <div
                key={capability.id}
                style={{
                  ...styles.capabilityItem,
                  ...(hoveredCapability === capability.id && styles.capabilityItemHover),
                }}
                onMouseEnter={() => setHoveredCapability(capability.id)}
                onMouseLeave={() => setHoveredCapability(null)}
              >
                <div style={styles.capabilityIcon}>🔧</div>
                <div style={styles.capabilityContent}>
                  <div style={styles.capabilityName}>{capability.name}</div>
                  <div style={styles.capabilityDescription}>{capability.description}</div>
                </div>
                <div
                  style={{
                    ...styles.capabilityToggle,
                    ...(capability.enabled && styles.capabilityToggleEnabled),
                  }}
                  onClick={() => onToggleCapability?.(capability.id)}
                >
                  <div
                    style={{
                      ...styles.capabilityToggleKnob,
                      ...(capability.enabled && styles.capabilityToggleKnobEnabled),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Executions */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent Executions</span>
        </div>
        <div style={styles.sectionContent}>
          <ExecutionLog executions={executions} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  AgentStatus,
  AgentRole,
  ExecutionStatus,
  AgentCapability,
  AgentMetrics,
  Agent,
  AgentExecution,
  AgentMessage,
  AgentListProps,
  AgentCardProps,
  AgentDetailProps,
  ExecutionLogProps,
  AgentChatProps,
  TokenBudgetProps,
};

export {
  STATUS_CONFIG,
  ROLE_CONFIG,
  EXECUTION_STATUS_CONFIG,
  formatTokens,
  formatDuration,
  formatUptime,
  getTokenUsageColor,
};

export default {
  AgentList,
  AgentCard,
  AgentDetail,
  ExecutionLog,
  AgentChat,
  TokenBudget,
};
