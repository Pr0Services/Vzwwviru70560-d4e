/**
 * STORYBOOK: Governance.stories.tsx
 * COMPONENTS: GovernanceSignalCard, BacklogItemCard, XRPreflightModal
 * 
 * R&D COMPLIANCE: ✅
 * - Demonstrates all governance UI states
 * - Shows Human Gate patterns
 * - Documents checkpoint flows
 */

import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GovernanceSignalCard, GovernanceSignalList } from '../governance/GovernanceSignalCard';
import { BacklogItemCard, BacklogList } from '../governance/BacklogItemCard';
import { XRPreflightModal } from '../xr/XRPreflightModal';
import {
  GovernanceSignalLevel,
  GovernanceCriterion,
  BacklogType,
  BacklogSeverity,
  BacklogStatus,
  ZoneType,
  MaturityLevel,
  type GovernanceSignal,
  type BacklogItem,
  type XRPreflightData,
} from '../../types/governance-xr.types';

// ============================================================================
// STORYBOOK SETUP
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

const withQueryClient = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <div className="p-6 bg-gray-50 min-h-screen">
      <Story />
    </div>
  </QueryClientProvider>
);

// ============================================================================
// MOCK DATA - GOVERNANCE SIGNALS
// ============================================================================

const mockSignalWarn: GovernanceSignal = {
  id: 'signal-001',
  thread_id: 'thread-001',
  event_id: 'event-123',
  level: GovernanceSignalLevel.WARN,
  criterion: GovernanceCriterion.BUDGET_GUARD,
  message: 'Token budget at 82% capacity. Consider reviewing agent usage.',
  details: {
    current_usage: 8200,
    budget_limit: 10000,
    percentage: 82,
  },
  patch_instruction: null,
  created_at: new Date().toISOString(),
};

const mockSignalCorrect: GovernanceSignal = {
  id: 'signal-002',
  thread_id: 'thread-001',
  event_id: 'event-124',
  level: GovernanceSignalLevel.CORRECT,
  criterion: GovernanceCriterion.CANON_GUARD,
  message: 'Event payload missing required traceability fields.',
  details: {
    missing_fields: ['created_by', 'created_at'],
    event_type: 'action.created',
  },
  patch_instruction: {
    field: 'payload',
    action: 'merge',
    value: {
      created_by: '${current_user_id}',
      created_at: '${timestamp}',
    },
    reason: 'R&D Rule #6: Module Traceability',
  },
  created_at: new Date().toISOString(),
};

const mockSignalPause: GovernanceSignal = {
  id: 'signal-003',
  thread_id: 'thread-001',
  event_id: 'event-125',
  level: GovernanceSignalLevel.PAUSE,
  criterion: GovernanceCriterion.RATE_LIMITER,
  message: 'Rate limit approaching. 45 requests in last minute.',
  details: {
    current_rate: 45,
    limit: 60,
    window_seconds: 60,
  },
  patch_instruction: null,
  created_at: new Date().toISOString(),
};

const mockSignalBlock: GovernanceSignal = {
  id: 'signal-004',
  thread_id: 'thread-001',
  event_id: 'event-126',
  level: GovernanceSignalLevel.BLOCK,
  criterion: GovernanceCriterion.SECURITY_GUARD,
  message: 'Potential SQL injection detected in user input.',
  details: {
    input_field: 'search_query',
    pattern_matched: 'DROP TABLE',
    action_blocked: true,
  },
  patch_instruction: null,
  created_at: new Date().toISOString(),
};

const mockSignalEscalate: GovernanceSignal = {
  id: 'signal-005',
  thread_id: 'thread-001',
  event_id: 'event-127',
  level: GovernanceSignalLevel.ESCALATE,
  criterion: GovernanceCriterion.ESCALATION_TRIGGER,
  message: 'Multiple BLOCK signals detected. Human review required.',
  details: {
    block_count: 3,
    time_window_minutes: 5,
    affected_events: ['event-126', 'event-128', 'event-129'],
  },
  patch_instruction: null,
  created_at: new Date().toISOString(),
};

// ============================================================================
// MOCK DATA - BACKLOG ITEMS
// ============================================================================

const mockBacklogError: BacklogItem = {
  id: 'backlog-001',
  thread_id: 'thread-001',
  identity_id: 'identity-001',
  backlog_type: BacklogType.ERROR,
  severity: BacklogSeverity.HIGH,
  title: 'Agent execution timeout',
  description: 'Creative Studio agent failed to complete image generation within timeout limit.',
  context: {
    agent_id: 'agent-creative-001',
    operation: 'image_generation',
    timeout_ms: 30000,
    actual_ms: 45000,
  },
  source_spec: 'CreativeStudioAgent.generate()',
  status: BacklogStatus.OPEN,
  resolution: null,
  fed_to_policy_tuner: false,
  created_at: new Date(Date.now() - 86400000).toISOString(),
  created_by: 'system',
  updated_at: new Date().toISOString(),
};

const mockBacklogSignal: BacklogItem = {
  id: 'backlog-002',
  thread_id: 'thread-001',
  identity_id: 'identity-001',
  backlog_type: BacklogType.SIGNAL,
  severity: BacklogSeverity.MEDIUM,
  title: 'Repeated budget warnings',
  description: 'Budget Guard has triggered 5 warnings in the last 24 hours.',
  context: {
    warning_count: 5,
    time_period_hours: 24,
    average_usage_percent: 78,
  },
  source_spec: 'CEA.BudgetGuard',
  status: BacklogStatus.IN_PROGRESS,
  resolution: null,
  fed_to_policy_tuner: false,
  created_at: new Date(Date.now() - 172800000).toISOString(),
  created_by: 'system',
  updated_at: new Date().toISOString(),
};

const mockBacklogDecision: BacklogItem = {
  id: 'backlog-003',
  thread_id: 'thread-001',
  identity_id: 'identity-001',
  backlog_type: BacklogType.DECISION,
  severity: BacklogSeverity.LOW,
  title: 'Pending: LLM provider fallback strategy',
  description: 'User needs to decide fallback order when primary LLM provider is unavailable.',
  context: {
    primary_provider: 'anthropic',
    available_fallbacks: ['openai', 'google', 'mistral'],
  },
  source_spec: 'LLMRouter.configure()',
  status: BacklogStatus.OPEN,
  resolution: null,
  fed_to_policy_tuner: false,
  created_at: new Date(Date.now() - 259200000).toISOString(),
  created_by: 'user-001',
  updated_at: new Date().toISOString(),
};

const mockBacklogCost: BacklogItem = {
  id: 'backlog-004',
  thread_id: 'thread-001',
  identity_id: 'identity-001',
  backlog_type: BacklogType.COST,
  severity: BacklogSeverity.CRITICAL,
  title: 'Monthly budget exceeded',
  description: 'Token usage has exceeded the monthly budget allocation.',
  context: {
    budget_limit: 100000,
    current_usage: 115000,
    overage_percent: 15,
    days_remaining: 8,
  },
  source_spec: 'TokenBudgetService',
  status: BacklogStatus.OPEN,
  resolution: null,
  fed_to_policy_tuner: false,
  created_at: new Date().toISOString(),
  created_by: 'system',
  updated_at: new Date().toISOString(),
};

const mockBacklogResolved: BacklogItem = {
  id: 'backlog-005',
  thread_id: 'thread-001',
  identity_id: 'identity-001',
  backlog_type: BacklogType.GOVERNANCE_DEBT,
  severity: BacklogSeverity.MEDIUM,
  title: 'Missing audit logs for Q4',
  description: 'Audit log export was not completed for Q4 2025.',
  context: {
    period: 'Q4-2025',
    expected_exports: 3,
    completed_exports: 0,
  },
  source_spec: 'AuditService.export()',
  status: BacklogStatus.RESOLVED,
  resolution: 'Completed retroactive export on 2026-01-05. All logs verified.',
  fed_to_policy_tuner: true,
  created_at: new Date(Date.now() - 604800000).toISOString(),
  created_by: 'system',
  updated_at: new Date().toISOString(),
};

// ============================================================================
// MOCK DATA - XR PREFLIGHT
// ============================================================================

const mockXRPreflightAvailable: XRPreflightData = {
  thread_id: 'thread-001',
  is_available: true,
  maturity_level: MaturityLevel.WORKSHOP,
  visible_zones: [
    ZoneType.INTENT_WALL,
    ZoneType.DECISION_WALL,
    ZoneType.ACTION_TABLE,
    ZoneType.MEMORY_KIOSK,
  ],
  enabled_features: [
    'view_actions',
    'update_actions',
    'add_notes',
    'view_timeline',
  ],
  requirements: {
    webxr_supported: true,
    min_maturity: MaturityLevel.WORKSHOP,
    permissions_granted: true,
  },
  estimated_load_time_ms: 2500,
};

const mockXRPreflightUnavailable: XRPreflightData = {
  thread_id: 'thread-002',
  is_available: false,
  maturity_level: MaturityLevel.SPROUT,
  visible_zones: [ZoneType.INTENT_WALL],
  enabled_features: ['view_only'],
  requirements: {
    webxr_supported: true,
    min_maturity: MaturityLevel.WORKSHOP,
    permissions_granted: true,
  },
  unavailable_reason: 'Thread maturity level (Sprout) is below minimum required (Workshop).',
  estimated_load_time_ms: 0,
};

const mockXRPreflightNoWebXR: XRPreflightData = {
  thread_id: 'thread-003',
  is_available: false,
  maturity_level: MaturityLevel.STUDIO,
  visible_zones: [],
  enabled_features: [],
  requirements: {
    webxr_supported: false,
    min_maturity: MaturityLevel.WORKSHOP,
    permissions_granted: true,
  },
  unavailable_reason: 'WebXR is not supported on this device or browser.',
  estimated_load_time_ms: 0,
};

// ============================================================================
// GOVERNANCE SIGNAL STORIES
// ============================================================================

const governanceMeta: Meta<typeof GovernanceSignalCard> = {
  title: 'Governance/GovernanceSignalCard',
  component: GovernanceSignalCard,
  decorators: [withQueryClient],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default governanceMeta;

type SignalStory = StoryObj<typeof GovernanceSignalCard>;

export const WarnSignal: SignalStory = {
  args: {
    signal: mockSignalWarn,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const CorrectSignal: SignalStory = {
  args: {
    signal: mockSignalCorrect,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const PauseSignal: SignalStory = {
  args: {
    signal: mockSignalPause,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const BlockSignal: SignalStory = {
  args: {
    signal: mockSignalBlock,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const EscalateSignal: SignalStory = {
  args: {
    signal: mockSignalEscalate,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const SignalList: StoryObj<typeof GovernanceSignalList> = {
  render: () => (
    <div className="max-w-2xl">
      <GovernanceSignalList
        signals={[
          mockSignalEscalate,
          mockSignalBlock,
          mockSignalCorrect,
          mockSignalWarn,
        ]}
        onAcknowledge={(id) => console.log('Acknowledged:', id)}
      />
    </div>
  ),
};

export const SignalListEmpty: StoryObj<typeof GovernanceSignalList> = {
  render: () => (
    <div className="max-w-2xl">
      <GovernanceSignalList
        signals={[]}
        onAcknowledge={(id) => console.log('Acknowledged:', id)}
      />
    </div>
  ),
};

// ============================================================================
// BACKLOG ITEM STORIES
// ============================================================================

export const BacklogError: StoryObj<typeof BacklogItemCard> = {
  render: () => (
    <div className="max-w-2xl">
      <BacklogItemCard
        item={mockBacklogError}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

export const BacklogSignal: StoryObj<typeof BacklogItemCard> = {
  render: () => (
    <div className="max-w-2xl">
      <BacklogItemCard
        item={mockBacklogSignal}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

export const BacklogDecision: StoryObj<typeof BacklogItemCard> = {
  render: () => (
    <div className="max-w-2xl">
      <BacklogItemCard
        item={mockBacklogDecision}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

export const BacklogCostCritical: StoryObj<typeof BacklogItemCard> = {
  render: () => (
    <div className="max-w-2xl">
      <BacklogItemCard
        item={mockBacklogCost}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

export const BacklogResolved: StoryObj<typeof BacklogItemCard> = {
  render: () => (
    <div className="max-w-2xl">
      <BacklogItemCard
        item={mockBacklogResolved}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

export const BacklogListStory: StoryObj<typeof BacklogList> = {
  name: 'Backlog List',
  render: () => (
    <div className="max-w-3xl">
      <BacklogList
        items={[
          mockBacklogCost,
          mockBacklogError,
          mockBacklogSignal,
          mockBacklogDecision,
          mockBacklogResolved,
        ]}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    </div>
  ),
};

// ============================================================================
// XR PREFLIGHT MODAL STORIES
// ============================================================================

export const XRPreflightAvailable: StoryObj<typeof XRPreflightModal> = {
  render: () => (
    <XRPreflightModal
      isOpen={true}
      onClose={() => console.log('Modal closed')}
      preflight={mockXRPreflightAvailable}
      onProceed={() => console.log('Proceeding to XR')}
      isLoading={false}
    />
  ),
};

export const XRPreflightLowMaturity: StoryObj<typeof XRPreflightModal> = {
  render: () => (
    <XRPreflightModal
      isOpen={true}
      onClose={() => console.log('Modal closed')}
      preflight={mockXRPreflightUnavailable}
      onProceed={() => console.log('Proceeding to XR')}
      isLoading={false}
    />
  ),
};

export const XRPreflightNoWebXR: StoryObj<typeof XRPreflightModal> = {
  render: () => (
    <XRPreflightModal
      isOpen={true}
      onClose={() => console.log('Modal closed')}
      preflight={mockXRPreflightNoWebXR}
      onProceed={() => console.log('Proceeding to XR')}
      isLoading={false}
    />
  ),
};

export const XRPreflightLoading: StoryObj<typeof XRPreflightModal> = {
  render: () => (
    <XRPreflightModal
      isOpen={true}
      onClose={() => console.log('Modal closed')}
      preflight={null}
      onProceed={() => console.log('Proceeding to XR')}
      isLoading={true}
    />
  ),
};
