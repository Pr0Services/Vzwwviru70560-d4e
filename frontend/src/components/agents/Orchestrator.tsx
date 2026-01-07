// CHE·NU™ Orchestrator Component — User's Hired Agent
// The Orchestrator is HIRED by the user
// It executes tasks, manages agents, respects scope, budget, and governance
// It can be replaced or customized

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface OrchestratorConfig {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'upgrading';
  tier: 1 | 2 | 3;
  capabilities: string[];
  sphere_access: string[];
  daily_budget: number;
  daily_used: number;
  total_executions: number;
  success_rate: number;
  created_at: string;
}

interface ExecutionPlan {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'cancelled';
  steps: ExecutionStep[];
  estimated_tokens: number;
  actual_tokens: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface ExecutionStep {
  id: string;
  order: number;
  action: string;
  agent_code: string | null;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'skipped';
  estimated_tokens: number;
  actual_tokens: number;
  result: string | null;
}

interface AgentSlot {
  id: string;
  agent_code: string;
  agent_name: string;
  status: 'idle' | 'assigned' | 'executing';
  current_task: string | null;
  executions_today: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockOrchestrator: OrchestratorConfig = {
  id: 'orch-1',
  name: 'Primary Orchestrator',
  description: 'Your main task execution and agent management system',
  status: 'active',
  tier: 2,
  capabilities: ['Task Decomposition', 'Agent Coordination', 'Budget Management', 'Scope Enforcement', 'Result Assembly'],
  sphere_access: ['personal', 'business', 'design_studio', 'team'],
  daily_budget: 5000,
  daily_used: 1234,
  total_executions: 456,
  success_rate: 97.8,
  created_at: '2024-01-01T00:00:00Z',
};

const mockPlans: ExecutionPlan[] = [
  {
    id: 'plan-1',
    title: 'Analyze Q4 Report and Generate Summary',
    status: 'completed',
    steps: [
      { id: 's1', order: 1, action: 'Extract document content', agent_code: 'DOC_ANALYZER', status: 'completed', estimated_tokens: 100, actual_tokens: 95, result: 'Content extracted successfully' },
      { id: 's2', order: 2, action: 'Analyze key metrics', agent_code: 'DOC_ANALYZER', status: 'completed', estimated_tokens: 150, actual_tokens: 142, result: '12 key metrics identified' },
      { id: 's3', order: 3, action: 'Generate executive summary', agent_code: 'CONTENT_GEN', status: 'completed', estimated_tokens: 200, actual_tokens: 187, result: 'Summary generated (450 words)' },
    ],
    estimated_tokens: 450,
    actual_tokens: 424,
    created_at: '2024-01-15T10:00:00Z',
    started_at: '2024-01-15T10:01:00Z',
    completed_at: '2024-01-15T10:05:00Z',
  },
  {
    id: 'plan-2',
    title: 'Schedule Team Meeting and Send Invites',
    status: 'executing',
    steps: [
      { id: 's1', order: 1, action: 'Check team availability', agent_code: null, status: 'completed', estimated_tokens: 50, actual_tokens: 48, result: 'All team members available Thursday 2pm' },
      { id: 's2', order: 2, action: 'Create meeting agenda', agent_code: 'CONTENT_GEN', status: 'executing', estimated_tokens: 100, actual_tokens: 0, result: null },
      { id: 's3', order: 3, action: 'Send calendar invites', agent_code: null, status: 'pending', estimated_tokens: 30, actual_tokens: 0, result: null },
    ],
    estimated_tokens: 180,
    actual_tokens: 48,
    created_at: '2024-01-15T14:00:00Z',
    started_at: '2024-01-15T14:01:00Z',
    completed_at: null,
  },
];

const mockAgentSlots: AgentSlot[] = [
  { id: 'slot-1', agent_code: 'DOC_ANALYZER', agent_name: 'Document Analyzer', status: 'idle', current_task: null, executions_today: 5 },
  { id: 'slot-2', agent_code: 'CONTENT_GEN', agent_name: 'Content Generator', status: 'executing', current_task: 'Creating meeting agenda', executions_today: 3 },
  { id: 'slot-3', agent_code: 'TASK_AUTO', agent_name: 'Task Automator', status: 'idle', current_task: null, executions_today: 8 },
  { id: 'slot-4', agent_code: 'RESEARCH_ASSIST', agent_name: 'Research Assistant', status: 'assigned', current_task: 'Queued: Market analysis', executions_today: 1 },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '24px',
    backgroundColor: CHENU_COLORS.uiSlate,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  headerLeft: {},
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      active: CHENU_COLORS.jungleEmerald,
      paused: '#f39c12',
      upgrading: CHENU_COLORS.cenoteTurquoise,
    };
    return {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },

  // Overview Cards
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
  cardLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  cardSubtext: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },
  budgetBar: {
    height: '8px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '12px',
  },
  budgetFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
  }),

  // Section
  section: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },

  // Execution Plans
  planCard: {
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    marginBottom: '12px',
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  planTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  planStatus: (status: string) => {
    const colors: Record<string, string> = {
      pending: CHENU_COLORS.ancientStone,
      approved: CHENU_COLORS.cenoteTurquoise,
      executing: CHENU_COLORS.sacredGold,
      completed: CHENU_COLORS.jungleEmerald,
      failed: '#e74c3c',
      cancelled: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      backgroundColor: colors[status] + '22',
      color: colors[status],
      textTransform: 'uppercase' as const,
    };
  },
  stepsContainer: {
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    paddingTop: '16px',
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  stepNumber: (status: string) => {
    const colors: Record<string, string> = {
      pending: CHENU_COLORS.ancientStone,
      executing: CHENU_COLORS.sacredGold,
      completed: CHENU_COLORS.jungleEmerald,
      failed: '#e74c3c',
      skipped: CHENU_COLORS.ancientStone,
    };
    return {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: colors[status] + '22',
      border: `2px solid ${colors[status]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      color: colors[status],
      flexShrink: 0,
    };
  },
  stepContent: {
    flex: 1,
  },
  stepAction: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  stepMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    gap: '12px',
  },
  stepResult: {
    fontSize: '12px',
    color: CHENU_COLORS.jungleEmerald,
    marginTop: '4px',
  },

  // Agent Slots
  agentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  agentSlot: {
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  agentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  agentName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  agentStatus: (status: string) => {
    const colors: Record<string, string> = {
      idle: CHENU_COLORS.ancientStone,
      assigned: CHENU_COLORS.cenoteTurquoise,
      executing: CHENU_COLORS.sacredGold,
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
  agentCode: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    fontFamily: 'monospace',
  },
  agentTask: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    marginTop: '8px',
  },

  // Capabilities
  capabilitiesGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '16px',
  },
  capability: {
    padding: '6px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '6px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },

  // Actions
  actions: {
    display: 'flex',
    gap: '12px',
  },
  actionButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.sacredGold,
    fontSize: '13px',
    cursor: 'pointer',
  },
  primaryButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Orchestrator: React.FC = () => {
  const [orchestrator] = useState<OrchestratorConfig>(mockOrchestrator);
  const [plans] = useState<ExecutionPlan[]>(mockPlans);
  const [agentSlots] = useState<AgentSlot[]>(mockAgentSlots);

  const budgetPercent = (orchestrator.daily_used / orchestrator.daily_budget) * 100;
  const activeAgents = agentSlots.filter(s => s.status !== 'idle').length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>🎯 {orchestrator.name}</h1>
          <p style={styles.subtitle}>{orchestrator.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={styles.statusBadge(orchestrator.status)}>{orchestrator.status}</span>
          <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Tier {orchestrator.tier}</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={styles.overviewGrid}>
        <div style={styles.overviewCard}>
          <div style={styles.cardLabel}>Daily Budget</div>
          <div style={styles.cardValue}>{orchestrator.daily_used.toLocaleString()}</div>
          <div style={styles.cardSubtext}>of {orchestrator.daily_budget.toLocaleString()} tokens</div>
          <div style={styles.budgetBar}>
            <div style={styles.budgetFill(budgetPercent)} />
          </div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardLabel}>Total Executions</div>
          <div style={styles.cardValue}>{orchestrator.total_executions}</div>
          <div style={styles.cardSubtext}>All time</div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardLabel}>Success Rate</div>
          <div style={styles.cardValue}>{orchestrator.success_rate}%</div>
          <div style={styles.cardSubtext}>Last 30 days</div>
        </div>
        <div style={styles.overviewCard}>
          <div style={styles.cardLabel}>Active Agents</div>
          <div style={styles.cardValue}>{activeAgents}</div>
          <div style={styles.cardSubtext}>of {agentSlots.length} assigned</div>
        </div>
      </div>

      {/* Execution Plans */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Execution Plans</span>
          <button style={styles.primaryButton}>+ New Plan</button>
        </div>
        {plans.map(plan => (
          <div key={plan.id} style={styles.planCard}>
            <div style={styles.planHeader}>
              <div>
                <div style={styles.planTitle}>{plan.title}</div>
                <div style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                  Est. {plan.estimated_tokens} tokens • Actual: {plan.actual_tokens} tokens
                </div>
              </div>
              <span style={styles.planStatus(plan.status)}>{plan.status}</span>
            </div>
            <div style={styles.stepsContainer}>
              {plan.steps.map(step => (
                <div key={step.id} style={styles.step}>
                  <div style={styles.stepNumber(step.status)}>
                    {step.status === 'completed' ? '✓' : step.status === 'executing' ? '●' : step.order}
                  </div>
                  <div style={styles.stepContent}>
                    <div style={styles.stepAction}>{step.action}</div>
                    <div style={styles.stepMeta}>
                      {step.agent_code && <span>🤖 {step.agent_code}</span>}
                      <span>{step.estimated_tokens} tokens</span>
                    </div>
                    {step.result && <div style={styles.stepResult}>✓ {step.result}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Slots */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Agent Slots</span>
          <button style={styles.actionButton}>Manage Agents</button>
        </div>
        <div style={styles.agentGrid}>
          {agentSlots.map(slot => (
            <div key={slot.id} style={styles.agentSlot}>
              <div style={styles.agentHeader}>
                <span style={styles.agentName}>{slot.agent_name}</span>
                <span style={styles.agentStatus(slot.status)}>{slot.status}</span>
              </div>
              <div style={styles.agentCode}>{slot.agent_code}</div>
              {slot.current_task && <div style={styles.agentTask}>📋 {slot.current_task}</div>}
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '8px' }}>
                {slot.executions_today} executions today
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Orchestrator Capabilities</div>
        <div style={styles.capabilitiesGrid}>
          {orchestrator.capabilities.map((cap, idx) => (
            <span key={idx} style={styles.capability}>✓ {cap}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orchestrator;
