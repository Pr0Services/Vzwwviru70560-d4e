/**
 * CHE·NU™ Agent Contract — Main Components
 * 
 * Components for viewing, creating, and managing agent contracts.
 * Contracts make agent behavior explicit, bounded, and accountable.
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  AgentContract,
  ContractSummary,
  ContractStatus,
  ContractCreationForm,
  AllowedAction,
  ForbiddenAction,
  ContractViolation,
  CONTRACT_STATUS_META,
  ACTION_TYPE_META,
  DECISION_TYPE_META,
  VIOLATION_RESPONSE_META,
  DEFAULT_CONTRACT_FORM,
  DEFAULT_PERMISSIONS,
  DEFAULT_DECISION_BOUNDARIES,
  DEFAULT_DATA_ACCESS,
  DEFAULT_INTERACTION_RULES,
  DEFAULT_LEARNING_CONSTRAINTS,
  DEFAULT_ENFORCEMENT,
  CONTRACT_COLORS,
  AgentActionType,
} from './agent-contract.types';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CONTRACTS: ContractSummary[] = [
  {
    id: 'contract_nova_001',
    agent_id: 'nova',
    agent_name: 'Nova',
    agent_role: 'System Intelligence',
    owner: 'user_001',
    status: 'active',
    version: '1.2.0',
    mission_statement: 'Provide system-wide insights and suggestions while respecting human authority.',
    allowed_action_count: 5,
    forbidden_action_count: 4,
    violation_count: 0,
    last_activity: '2025-12-28T15:00:00Z',
  },
  {
    id: 'contract_creative_001',
    agent_id: 'creative_agent',
    agent_name: 'Creative Assistant',
    agent_role: 'Creative Studio Agent',
    owner: 'user_001',
    status: 'active',
    version: '1.0.0',
    mission_statement: 'Assist with creative tasks within the Studio sphere only.',
    allowed_action_count: 4,
    forbidden_action_count: 6,
    violation_count: 2,
    last_activity: '2025-12-27T10:30:00Z',
  },
  {
    id: 'contract_research_001',
    agent_id: 'research_agent',
    agent_name: 'Research Helper',
    agent_role: 'Scholar Agent',
    owner: 'user_001',
    status: 'draft',
    version: '0.1.0',
    mission_statement: 'Help organize and summarize research materials.',
    allowed_action_count: 3,
    forbidden_action_count: 8,
    violation_count: 0,
    last_activity: '2025-12-25T09:00:00Z',
  },
  {
    id: 'contract_scheduler_001',
    agent_id: 'scheduler_agent',
    agent_name: 'Schedule Manager',
    agent_role: 'Personal Agent',
    owner: 'user_001',
    status: 'suspended',
    version: '1.1.0',
    mission_statement: 'Manage calendar and scheduling with user oversight.',
    allowed_action_count: 4,
    forbidden_action_count: 5,
    violation_count: 3,
    last_activity: '2025-12-20T14:00:00Z',
  },
];

const MOCK_FULL_CONTRACT: AgentContract = {
  id: 'contract_nova_001',
  agent_id: 'nova',
  agent_role: 'System Intelligence',
  agent_name: 'Nova',
  owner: 'user_001',
  version: '1.2.0',
  status: 'active',
  purpose: {
    mission_statement: 'Provide system-wide insights and suggestions while respecting human authority.',
    success_definition: 'Users feel informed without being overwhelmed. Suggestions are helpful, not intrusive.',
    non_goals: [
      'Making autonomous decisions',
      'Modifying user data without explicit consent',
      'Optimizing for engagement',
      'Learning user behavior patterns silently',
    ],
  },
  permissions: {
    allowed_actions: [
      {
        action_type: 'read_data',
        scope: ['personal', 'business', 'studio'],
        conditions: [{ type: 'user_present', parameters: {}, description: 'User must be active' }],
        description: 'Can read data for analysis across main spheres',
      },
      {
        action_type: 'suggest_action',
        scope: ['*'],
        conditions: [],
        description: 'Can suggest actions in any sphere',
      },
      {
        action_type: 'escalate_issue',
        scope: ['*'],
        conditions: [],
        description: 'Can flag issues for human review',
      },
      {
        action_type: 'create_snapshot',
        scope: ['*'],
        conditions: [{ type: 'approval_required', parameters: {}, description: 'User must approve' }],
        description: 'Can propose context snapshots',
      },
    ],
    forbidden_actions: [
      { action_type: 'delete_data', reason: 'Data deletion requires human action' },
      { action_type: 'contact_external', reason: 'External communication not permitted' },
      { action_type: 'make_decision', reason: 'Autonomous decisions forbidden' },
      { action_type: 'modify_own_behavior', reason: 'Self-modification forbidden' },
    ],
  },
  decision_boundaries: {
    may_decide: false,
    decision_types_allowed: [],
    must_request_human_for: ['prioritization', 'categorization', 'scheduling', 'content_filtering'],
    max_decision_impact: 'none',
    requires_explanation: true,
  },
  data_access: {
    readable_scopes: ['user_data', 'thread_data', 'decision_data'],
    writable_scopes: [],
    restricted_scopes: ['system_data', 'agent_data'],
  },
  interaction_rules: {
    may_contact_user: true,
    contact_frequency_limit: 'max 5 per hour',
    escalation_conditions: [
      { trigger: 'anomaly_detected', description: 'Unusual pattern found', response: 'notify' },
      { trigger: 'security_concern', description: 'Potential security issue', response: 'pause' },
    ],
    interruption_required_on: [
      { trigger: 'user_request', description: 'User explicitly requests pause', action: 'immediate_stop' },
    ],
    may_request_clarification: true,
    must_explain_actions: true,
  },
  learning_constraints: {
    learning_allowed: false,
    approval_required: 'always',
    visible_learning_log: true,
    learning_scope: [],
    forbidden_learning: ['user_preferences', 'private_data', 'behavioral_patterns'],
  },
  enforcement: {
    violation_response: 'block',
    logging_level: 'full',
    audit_frequency: 'realtime',
    alert_on_violation: true,
    auto_suspend_threshold: 5,
  },
  creation_context: {
    created_at: '2025-12-01T10:00:00Z',
    created_by: 'user_001',
    creation_reason: 'Initial system intelligence configuration',
  },
  approval_timestamp: '2025-12-01T10:30:00Z',
  approved_by: 'user_001',
  last_modified: '2025-12-15T14:00:00Z',
  last_modified_by: 'user_001',
  violation_count: 0,
  last_audit: '2025-12-28T00:00:00Z',
};

const MOCK_VIOLATIONS: ContractViolation[] = [
  {
    id: 'vio_001',
    contract_id: 'contract_creative_001',
    agent_id: 'creative_agent',
    timestamp: '2025-12-26T14:30:00Z',
    action_attempted: 'access_cross_sphere',
    violation_type: 'scope_exceeded',
    description: 'Attempted to read business sphere data while configured for studio only.',
    context: { target_sphere: 'business', source_sphere: 'design_studio' },
    response_taken: 'block',
    resolved: true,
    resolved_by: 'user_001',
    resolved_at: '2025-12-26T15:00:00Z',
    resolution_notes: 'Confirmed scope limitation is correct. No contract change needed.',
  },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    minHeight: '100vh',
    background: CONTRACT_COLORS.obsidianBlack,
    padding: '24px',
    color: CONTRACT_COLORS.templeWhite,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    color: CONTRACT_COLORS.sacredGold,
    margin: 0,
    fontSize: '24px',
    fontWeight: 500,
  },
  card: {
    background: CONTRACT_COLORS.cardBg,
    border: `1px solid ${CONTRACT_COLORS.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  button: {
    padding: '10px 20px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: `1px solid ${CONTRACT_COLORS.sacredGold}`,
    borderRadius: '8px',
    color: CONTRACT_COLORS.sacredGold,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  buttonSecondary: {
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderRadius: '6px',
    color: CONTRACT_COLORS.templeWhite,
    cursor: 'pointer',
    fontSize: '13px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CONTRACT_COLORS.sacredGold,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
    marginBottom: '6px',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CONTRACT_COLORS.border}`,
    borderRadius: '8px',
    color: CONTRACT_COLORS.templeWhite,
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CONTRACT_COLORS.border}`,
    borderRadius: '8px',
    color: CONTRACT_COLORS.templeWhite,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '80px',
  },
};

// ============================================================================
// CONTRACT LIST COMPONENT
// ============================================================================

export interface AgentContractsProps {
  userId: string;
  onSelectContract?: (contractId: string) => void;
  onCreateContract?: () => void;
}

export const AgentContracts: React.FC<AgentContractsProps> = ({
  userId,
  onSelectContract,
  onCreateContract,
}) => {
  const [contracts] = useState<ContractSummary[]>(MOCK_CONTRACTS);
  const [filterStatus, setFilterStatus] = useState<ContractStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'violations'>('name');

  const filteredContracts = useMemo(() => {
    let result = contracts;
    
    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.agent_name.toLowerCase().includes(q) ||
        c.agent_role.toLowerCase().includes(q) ||
        c.mission_statement.toLowerCase().includes(q)
      );
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.agent_name.localeCompare(b.agent_name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'violations':
          return b.violation_count - a.violation_count;
        default:
          return 0;
      }
    });
    
    return result;
  }, [contracts, filterStatus, searchQuery, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: contracts.length,
      active: contracts.filter(c => c.status === 'active').length,
      draft: contracts.filter(c => c.status === 'draft').length,
      suspended: contracts.filter(c => c.status === 'suspended').length,
      retired: contracts.filter(c => c.status === 'retired').length,
    };
  }, [contracts]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📜 Agent Contracts</h1>
          <p style={{ color: CONTRACT_COLORS.dimmed, margin: '4px 0 0 0', fontSize: '14px' }}>
            Explicit boundaries for agent behavior. Contracts constrain, not empower.
          </p>
        </div>
        <button style={styles.button} onClick={onCreateContract}>
          + New Contract
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...styles.card, display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'active', 'draft', 'suspended', 'retired'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.buttonSecondary,
                background: filterStatus === status 
                  ? 'rgba(212, 175, 55, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                borderColor: filterStatus === status 
                  ? CONTRACT_COLORS.sacredGold 
                  : 'rgba(255, 255, 255, 0.1)',
                color: filterStatus === status 
                  ? CONTRACT_COLORS.sacredGold 
                  : CONTRACT_COLORS.templeWhite,
              }}
            >
              {status === 'all' ? 'All' : CONTRACT_STATUS_META[status].icon} {status === 'all' ? '' : CONTRACT_STATUS_META[status].label}
              <span style={{ 
                marginLeft: '6px', 
                opacity: 0.7,
                fontSize: '11px',
              }}>
                ({statusCounts[status]})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ ...styles.input, maxWidth: '250px' }}
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          style={{ ...styles.input, maxWidth: '150px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
          <option value="violations">Sort by Violations</option>
        </select>
      </div>

      {/* Contract Grid */}
      <div style={styles.grid}>
        {filteredContracts.map(contract => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onClick={() => onSelectContract?.(contract.id)}
          />
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: CONTRACT_COLORS.dimmed }}>
          No contracts found
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CONTRACT CARD COMPONENT
// ============================================================================

interface ContractCardProps {
  contract: ContractSummary;
  onClick: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onClick }) => {
  const statusMeta = CONTRACT_STATUS_META[contract.status];
  
  return (
    <div 
      style={{ 
        ...styles.card, 
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = CONTRACT_COLORS.sacredGold;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = CONTRACT_COLORS.border;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', color: CONTRACT_COLORS.templeWhite }}>
            🤖 {contract.agent_name}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: CONTRACT_COLORS.dimmed }}>
            {contract.agent_role}
          </p>
        </div>
        <span style={{
          ...styles.badge,
          background: `${statusMeta.color}20`,
          color: statusMeta.color,
        }}>
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* Mission */}
      <p style={{ 
        fontSize: '13px', 
        color: 'rgba(250, 249, 246, 0.8)',
        margin: '0 0 16px 0',
        lineHeight: 1.5,
      }}>
        {contract.mission_statement}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: CONTRACT_COLORS.dimmed }}>
        <span style={{ color: CONTRACT_COLORS.active }}>
          ✓ {contract.allowed_action_count} allowed
        </span>
        <span style={{ color: CONTRACT_COLORS.highRisk }}>
          ✕ {contract.forbidden_action_count} forbidden
        </span>
        {contract.violation_count > 0 && (
          <span style={{ color: '#E74C3C' }}>
            ⚠ {contract.violation_count} violations
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '12px', 
        paddingTop: '12px', 
        borderTop: `1px solid ${CONTRACT_COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: CONTRACT_COLORS.dimmed,
      }}>
        <span>v{contract.version}</span>
        <span>Last activity: {new Date(contract.last_activity).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// ============================================================================
// CONTRACT DETAIL VIEW
// ============================================================================

export interface ContractViewProps {
  contractId: string;
  userId: string;
  onClose: () => void;
  onEdit?: () => void;
  onSuspend?: () => void;
  onRetire?: () => void;
}

export const ContractView: React.FC<ContractViewProps> = ({
  contractId,
  userId,
  onClose,
  onEdit,
  onSuspend,
  onRetire,
}) => {
  const [contract] = useState<AgentContract>(MOCK_FULL_CONTRACT);
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'violations'>('overview');
  const [violations] = useState<ContractViolation[]>(MOCK_VIOLATIONS);

  const statusMeta = CONTRACT_STATUS_META[contract.status];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onClose} style={styles.buttonSecondary}>
            ← Back
          </button>
          <div>
            <h1 style={{ ...styles.title, display: 'flex', alignItems: 'center', gap: '12px' }}>
              🤖 {contract.agent_name}
              <span style={{
                ...styles.badge,
                background: `${statusMeta.color}20`,
                color: statusMeta.color,
              }}>
                {statusMeta.icon} {statusMeta.label}
              </span>
            </h1>
            <p style={{ color: CONTRACT_COLORS.dimmed, margin: '4px 0 0 0', fontSize: '14px' }}>
              {contract.agent_role} • v{contract.version} • Contract ID: {contract.id}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {contract.status === 'active' && (
            <button onClick={onSuspend} style={{ ...styles.buttonSecondary, color: CONTRACT_COLORS.suspended }}>
              ⏸️ Suspend
            </button>
          )}
          {contract.status === 'draft' && (
            <button style={styles.button}>
              ✓ Activate
            </button>
          )}
          <button onClick={onEdit} style={styles.buttonSecondary}>
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['overview', 'permissions', 'violations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.buttonSecondary,
              background: activeTab === tab 
                ? 'rgba(212, 175, 55, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeTab === tab 
                ? CONTRACT_COLORS.sacredGold 
                : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === tab 
                ? CONTRACT_COLORS.sacredGold 
                : CONTRACT_COLORS.templeWhite,
            }}
          >
            {tab === 'overview' && '📋 Overview'}
            {tab === 'permissions' && '🔐 Permissions'}
            {tab === 'violations' && `⚠️ Violations (${contract.violation_count})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={styles.grid}>
          {/* Purpose Section */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🎯 Purpose</div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '4px' }}>
                Mission Statement
              </label>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                {contract.purpose.mission_statement}
              </p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '4px' }}>
                Success Definition
              </label>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                {contract.purpose.success_definition}
              </p>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '8px' }}>
                Non-Goals (What this agent does NOT do)
              </label>
              <ul style={{ ...styles.list }}>
                {contract.purpose.non_goals.map((goal, i) => (
                  <li key={i} style={{ ...styles.listItem, color: CONTRACT_COLORS.highRisk }}>
                    ✕ {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decision Boundaries */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>⚖️ Decision Boundaries</div>
            <div style={{ 
              padding: '12px', 
              background: contract.decision_boundaries.may_decide 
                ? 'rgba(39, 174, 96, 0.1)' 
                : 'rgba(231, 76, 60, 0.1)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <strong>
                {contract.decision_boundaries.may_decide 
                  ? '✓ May make limited autonomous decisions' 
                  : '✕ No autonomous decisions allowed'}
              </strong>
            </div>
            
            {contract.decision_boundaries.must_request_human_for.length > 0 && (
              <div>
                <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '8px' }}>
                  Must request human approval for:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {contract.decision_boundaries.must_request_human_for.map(dt => (
                    <span key={dt} style={{
                      ...styles.badge,
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: CONTRACT_COLORS.sacredGold,
                    }}>
                      {DECISION_TYPE_META[dt].label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interaction Rules */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>💬 Interaction Rules</div>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                {contract.interaction_rules.may_contact_user ? '✓' : '✕'} May contact user
                {contract.interaction_rules.contact_frequency_limit && (
                  <span style={{ color: CONTRACT_COLORS.dimmed, marginLeft: '8px' }}>
                    ({contract.interaction_rules.contact_frequency_limit})
                  </span>
                )}
              </li>
              <li style={styles.listItem}>
                {contract.interaction_rules.may_request_clarification ? '✓' : '✕'} May request clarification
              </li>
              <li style={styles.listItem}>
                {contract.interaction_rules.must_explain_actions ? '✓' : '✕'} Must explain actions
              </li>
            </ul>
            
            {contract.interaction_rules.escalation_conditions.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '8px' }}>
                  Escalation triggers:
                </label>
                {contract.interaction_rules.escalation_conditions.map((ec, i) => (
                  <div key={i} style={{ ...styles.listItem, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{ec.description}</span>
                    <span style={{
                      ...styles.badge,
                      background: ec.response === 'terminate' 
                        ? 'rgba(231, 76, 60, 0.2)' 
                        : 'rgba(243, 156, 18, 0.2)',
                      color: ec.response === 'terminate' ? '#E74C3C' : '#F39C12',
                      fontSize: '10px',
                    }}>
                      {ec.response}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Constraints */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🧠 Learning Constraints</div>
            <div style={{ 
              padding: '12px', 
              background: contract.learning_constraints.learning_allowed 
                ? 'rgba(243, 156, 18, 0.1)' 
                : 'rgba(231, 76, 60, 0.1)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <strong>
                {contract.learning_constraints.learning_allowed 
                  ? '⚠ Learning allowed (with constraints)' 
                  : '✕ No learning allowed'}
              </strong>
            </div>
            
            {contract.learning_constraints.forbidden_learning.length > 0 && (
              <div>
                <label style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed, display: 'block', marginBottom: '8px' }}>
                  Forbidden learning areas:
                </label>
                <ul style={styles.list}>
                  {contract.learning_constraints.forbidden_learning.map((area, i) => (
                    <li key={i} style={{ ...styles.listItem, color: CONTRACT_COLORS.highRisk }}>
                      ✕ {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Enforcement */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>🛡️ Enforcement</div>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Violation Response:</strong>{' '}
                <span style={{
                  color: VIOLATION_RESPONSE_META[contract.enforcement.violation_response].severity === 3 
                    ? CONTRACT_COLORS.highRisk 
                    : CONTRACT_COLORS.mediumRisk,
                }}>
                  {VIOLATION_RESPONSE_META[contract.enforcement.violation_response].label}
                </span>
              </li>
              <li style={styles.listItem}>
                <strong>Logging:</strong> {contract.enforcement.logging_level}
              </li>
              <li style={styles.listItem}>
                <strong>Audit Frequency:</strong> {contract.enforcement.audit_frequency}
              </li>
              <li style={styles.listItem}>
                <strong>Alert on Violation:</strong> {contract.enforcement.alert_on_violation ? 'Yes' : 'No'}
              </li>
              {contract.enforcement.auto_suspend_threshold && (
                <li style={styles.listItem}>
                  <strong>Auto-suspend after:</strong> {contract.enforcement.auto_suspend_threshold} violations
                </li>
              )}
            </ul>
          </div>

          {/* Audit Info */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>📊 Audit Information</div>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Created:</strong> {new Date(contract.creation_context.created_at).toLocaleString()}
              </li>
              <li style={styles.listItem}>
                <strong>Approved:</strong> {contract.approval_timestamp 
                  ? new Date(contract.approval_timestamp).toLocaleString() 
                  : 'Not yet approved'}
              </li>
              <li style={styles.listItem}>
                <strong>Last Modified:</strong> {new Date(contract.last_modified).toLocaleString()}
              </li>
              <li style={styles.listItem}>
                <strong>Last Audit:</strong> {new Date(contract.last_audit).toLocaleString()}
              </li>
              <li style={styles.listItem}>
                <strong>Total Violations:</strong>{' '}
                <span style={{ color: contract.violation_count > 0 ? CONTRACT_COLORS.highRisk : CONTRACT_COLORS.active }}>
                  {contract.violation_count}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div style={styles.grid}>
          {/* Allowed Actions */}
          <div style={styles.card}>
            <div style={{ ...styles.sectionTitle, color: CONTRACT_COLORS.active }}>
              ✓ Allowed Actions ({contract.permissions.allowed_actions.length})
            </div>
            <ul style={styles.list}>
              {contract.permissions.allowed_actions.map((action, i) => (
                <li key={i} style={{ 
                  ...styles.listItem, 
                  borderLeft: `3px solid ${CONTRACT_COLORS.active}`,
                  paddingLeft: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{ACTION_TYPE_META[action.action_type].label}</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: CONTRACT_COLORS.dimmed }}>
                        {action.description}
                      </p>
                    </div>
                    <span style={{
                      ...styles.badge,
                      background: `${ACTION_TYPE_META[action.action_type].risk === 'low' 
                        ? CONTRACT_COLORS.lowRisk 
                        : ACTION_TYPE_META[action.action_type].risk === 'medium'
                          ? CONTRACT_COLORS.mediumRisk
                          : CONTRACT_COLORS.highRisk}20`,
                      color: ACTION_TYPE_META[action.action_type].risk === 'low' 
                        ? CONTRACT_COLORS.lowRisk 
                        : ACTION_TYPE_META[action.action_type].risk === 'medium'
                          ? CONTRACT_COLORS.mediumRisk
                          : CONTRACT_COLORS.highRisk,
                      fontSize: '10px',
                    }}>
                      {ACTION_TYPE_META[action.action_type].risk} risk
                    </span>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: CONTRACT_COLORS.dimmed }}>Scope:</span>
                    {action.scope.map(s => (
                      <span key={s} style={{
                        ...styles.badge,
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: CONTRACT_COLORS.templeWhite,
                        fontSize: '10px',
                      }}>
                        {s === '*' ? 'All Spheres' : s}
                      </span>
                    ))}
                  </div>
                  {action.conditions.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '11px', color: CONTRACT_COLORS.dimmed }}>
                      Conditions: {action.conditions.map(c => c.description).join(', ')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Forbidden Actions */}
          <div style={styles.card}>
            <div style={{ ...styles.sectionTitle, color: CONTRACT_COLORS.highRisk }}>
              ✕ Forbidden Actions ({contract.permissions.forbidden_actions.length})
            </div>
            <ul style={styles.list}>
              {contract.permissions.forbidden_actions.map((action, i) => (
                <li key={i} style={{ 
                  ...styles.listItem, 
                  borderLeft: `3px solid ${CONTRACT_COLORS.highRisk}`,
                  paddingLeft: '12px',
                }}>
                  <strong>{ACTION_TYPE_META[action.action_type].label}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: CONTRACT_COLORS.dimmed }}>
                    Reason: {action.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Access */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>📁 Data Access</div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.active, display: 'block', marginBottom: '6px' }}>
                ✓ Readable
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {contract.data_access.readable_scopes.map(scope => (
                  <span key={scope} style={{
                    ...styles.badge,
                    background: 'rgba(39, 174, 96, 0.15)',
                    color: CONTRACT_COLORS.active,
                  }}>
                    {scope}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.mediumRisk, display: 'block', marginBottom: '6px' }}>
                ✎ Writable
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {contract.data_access.writable_scopes.length > 0 ? (
                  contract.data_access.writable_scopes.map(scope => (
                    <span key={scope} style={{
                      ...styles.badge,
                      background: 'rgba(243, 156, 18, 0.15)',
                      color: CONTRACT_COLORS.mediumRisk,
                    }}>
                      {scope}
                    </span>
                  ))
                ) : (
                  <span style={{ color: CONTRACT_COLORS.dimmed, fontSize: '12px' }}>None</span>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: CONTRACT_COLORS.highRisk, display: 'block', marginBottom: '6px' }}>
                ⊘ Restricted
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {contract.data_access.restricted_scopes.map(scope => (
                  <span key={scope} style={{
                    ...styles.badge,
                    background: 'rgba(231, 76, 60, 0.15)',
                    color: CONTRACT_COLORS.highRisk,
                  }}>
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'violations' && (
        <div>
          {violations.length > 0 ? (
            violations.map(violation => (
              <div key={violation.id} style={{
                ...styles.card,
                borderLeft: `4px solid ${violation.resolved ? CONTRACT_COLORS.active : CONTRACT_COLORS.highRisk}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>
                      {ACTION_TYPE_META[violation.action_attempted]?.label || violation.action_attempted}
                    </h3>
                    <p style={{ margin: '4px 0', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                      {violation.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      ...styles.badge,
                      background: violation.resolved 
                        ? 'rgba(39, 174, 96, 0.15)' 
                        : 'rgba(231, 76, 60, 0.15)',
                      color: violation.resolved ? CONTRACT_COLORS.active : CONTRACT_COLORS.highRisk,
                    }}>
                      {violation.resolved ? '✓ Resolved' : '⚠ Unresolved'}
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: CONTRACT_COLORS.dimmed }}>
                      {new Date(violation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <span>
                    <strong>Type:</strong> {violation.violation_type.replace('_', ' ')}
                  </span>
                  <span>
                    <strong>Response:</strong>{' '}
                    <span style={{ color: CONTRACT_COLORS.mediumRisk }}>
                      {VIOLATION_RESPONSE_META[violation.response_taken].label}
                    </span>
                  </span>
                </div>

                {violation.resolved && violation.resolution_notes && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '10px', 
                    background: 'rgba(39, 174, 96, 0.1)',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}>
                    <strong>Resolution:</strong> {violation.resolution_notes}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: CONTRACT_COLORS.dimmed }}>
              ✓ No violations recorded
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CONTRACT CREATION MODAL
// ============================================================================

export interface ContractCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ContractCreationForm) => void;
  userId: string;
}

export const ContractCreation: React.FC<ContractCreationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
}) => {
  const [form, setForm] = useState<ContractCreationForm>(DEFAULT_CONTRACT_FORM);
  const [step, setStep] = useState<1 | 2>(1);
  const [nonGoalInput, setNonGoalInput] = useState('');

  const handleChange = useCallback((field: keyof ContractCreationForm, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const addNonGoal = useCallback(() => {
    if (nonGoalInput.trim()) {
      setForm(prev => ({ ...prev, non_goals: [...prev.non_goals, nonGoalInput.trim()] }));
      setNonGoalInput('');
    }
  }, [nonGoalInput]);

  const removeNonGoal = useCallback((index: number) => {
    setForm(prev => ({ 
      ...prev, 
      non_goals: prev.non_goals.filter((_, i) => i !== index) 
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(form);
    onClose();
    setForm(DEFAULT_CONTRACT_FORM);
    setStep(1);
  }, [form, onSubmit, onClose]);

  const isStep1Valid = form.agent_id && form.agent_name && form.agent_role;
  const isStep2Valid = form.mission_statement && form.creation_reason;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: CONTRACT_COLORS.nightSlate,
        borderRadius: '16px',
        border: `1px solid ${CONTRACT_COLORS.border}`,
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${CONTRACT_COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: 0, color: CONTRACT_COLORS.sacredGold, fontSize: '18px' }}>
              📜 Create Agent Contract
            </h2>
            <p style={{ margin: '4px 0 0 0', color: CONTRACT_COLORS.dimmed, fontSize: '13px' }}>
              Step {step} of 2: {step === 1 ? 'Agent Identity' : 'Purpose & Boundaries'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: CONTRACT_COLORS.dimmed,
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {step === 1 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Agent ID *
                </label>
                <input
                  type="text"
                  value={form.agent_id}
                  onChange={e => handleChange('agent_id', e.target.value)}
                  placeholder="e.g., research_assistant"
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={form.agent_name}
                  onChange={e => handleChange('agent_name', e.target.value)}
                  placeholder="e.g., Research Assistant"
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Agent Role *
                </label>
                <input
                  type="text"
                  value={form.agent_role}
                  onChange={e => handleChange('agent_role', e.target.value)}
                  placeholder="e.g., Scholar Sphere Agent"
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Template (Optional)
                </label>
                <select
                  value={form.template_id || ''}
                  onChange={e => handleChange('template_id', e.target.value || undefined)}
                  style={styles.input}
                >
                  <option value="">No template (start from scratch)</option>
                  <option value="read_only">Read-Only Agent</option>
                  <option value="assistant">Basic Assistant</option>
                  <option value="analyzer">Data Analyzer</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Mission Statement * (What is this agent's purpose?)
                </label>
                <textarea
                  value={form.mission_statement}
                  onChange={e => handleChange('mission_statement', e.target.value)}
                  placeholder="Describe what this agent is designed to do..."
                  style={styles.textarea}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Success Definition (How do we know it's working well?)
                </label>
                <textarea
                  value={form.success_definition}
                  onChange={e => handleChange('success_definition', e.target.value)}
                  placeholder="Define what success looks like..."
                  style={styles.textarea}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Non-Goals (What this agent should NOT do)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={nonGoalInput}
                    onChange={e => setNonGoalInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addNonGoal()}
                    placeholder="Add a non-goal..."
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <button onClick={addNonGoal} style={styles.buttonSecondary}>
                    Add
                  </button>
                </div>
                {form.non_goals.length > 0 && (
                  <ul style={styles.list}>
                    {form.non_goals.map((goal, i) => (
                      <li key={i} style={{ 
                        ...styles.listItem, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{ color: CONTRACT_COLORS.highRisk }}>✕ {goal}</span>
                        <button
                          onClick={() => removeNonGoal(i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: CONTRACT_COLORS.dimmed,
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: CONTRACT_COLORS.dimmed }}>
                  Creation Reason * (Why are you creating this contract?)
                </label>
                <textarea
                  value={form.creation_reason}
                  onChange={e => handleChange('creation_reason', e.target.value)}
                  placeholder="Explain why this contract is being created..."
                  style={styles.textarea}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${CONTRACT_COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {step === 1 ? (
            <>
              <button onClick={onClose} style={styles.buttonSecondary}>
                Cancel
              </button>
              <button 
                onClick={() => setStep(2)} 
                disabled={!isStep1Valid}
                style={{
                  ...styles.button,
                  opacity: isStep1Valid ? 1 : 0.5,
                  cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                }}
              >
                Next →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!isStep2Valid}
                style={{
                  ...styles.button,
                  opacity: isStep2Valid ? 1 : 0.5,
                  cursor: isStep2Valid ? 'pointer' : 'not-allowed',
                }}
              >
                Create Draft Contract
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AgentContracts;
