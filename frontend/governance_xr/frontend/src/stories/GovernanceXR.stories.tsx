/**
 * STORYBOOK: Governance & XR Components
 * Stories for GovernanceSignalCard, BacklogItemCard, XRPreflightModal
 * 
 * @module stories/governance-xr
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  GovernanceSignalCard,
  GovernanceSignalList,
  BacklogItemCard,
  BacklogList,
} from '../components/governance';
import { XRPreflightModal } from '../components/xr';
import {
  GovernanceSignal,
  GovernanceSignalLevel,
  GovernanceCriterion,
  BacklogItem,
  BacklogType,
  BacklogSeverity,
  BacklogStatus,
  XRPreflightData,
  ZoneType,
} from '../types/governance-xr.types';

// =============================================================================
// STORYBOOK SETUP
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

const withQueryClient = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

// =============================================================================
// GOVERNANCE SIGNAL CARD STORIES
// =============================================================================

const signalCardMeta: Meta<typeof GovernanceSignalCard> = {
  title: 'Governance/GovernanceSignalCard',
  component: GovernanceSignalCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Displays a CEA (Continuous Evaluation Array) governance signal.

## Signal Levels
- **WARN**: Informational warning, no action required
- **CORRECT**: Auto-correctable issue with patch instruction
- **PAUSE**: Review required before continuing
- **BLOCK**: Action blocked, checkpoint created (HTTP 423)
- **ESCALATE**: Requires human intervention

## Criteria
Each signal comes from a specific guard:
- canon_guard: Validates against Thread V2 rules
- security_guard: Detects security issues
- budget_guard: Monitors token/cost budgets
- identity_guard: Enforces identity boundaries
- etc.
        `,
      },
    },
  },
  argTypes: {
    signal: {
      control: 'object',
    },
  },
};

export default signalCardMeta;

type SignalCardStory = StoryObj<typeof GovernanceSignalCard>;

const baseSignal: GovernanceSignal = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  thread_id: '456e4567-e89b-12d3-a456-426614174000',
  event_id: '789e4567-e89b-12d3-a456-426614174000',
  level: GovernanceSignalLevel.WARN,
  criterion: GovernanceCriterion.BUDGET_GUARD,
  message: 'Token usage at 75% of budget',
  details: { current_usage: 7500, budget: 10000, percentage: 75 },
  processed: false,
  created_at: new Date().toISOString(),
};

export const WarnSignal: SignalCardStory = {
  args: {
    signal: baseSignal,
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const CorrectSignal: SignalCardStory = {
  args: {
    signal: {
      ...baseSignal,
      level: GovernanceSignalLevel.CORRECT,
      criterion: GovernanceCriterion.CANON_GUARD,
      message: 'Event payload missing required field: parent_event_id',
      patch_instruction: {
        action: 'add',
        target: 'payload.parent_event_id',
        value: 'auto_generated_uuid',
        reason: 'ThreadEvent requires parent reference for causal ordering',
      },
    },
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const PauseSignal: SignalCardStory = {
  args: {
    signal: {
      ...baseSignal,
      level: GovernanceSignalLevel.PAUSE,
      criterion: GovernanceCriterion.QUALITY_GUARD,
      message: 'Response quality score below threshold (RQ=0.72, threshold=0.75)',
      details: {
        quality_score: 0.72,
        threshold: 0.75,
        factors: ['low_coherence', 'missing_citations'],
      },
    },
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const BlockSignal: SignalCardStory = {
  args: {
    signal: {
      ...baseSignal,
      level: GovernanceSignalLevel.BLOCK,
      criterion: GovernanceCriterion.SECURITY_GUARD,
      message: 'Potential SQL injection detected in user input',
      details: {
        input: "'; DROP TABLE users; --",
        detected_pattern: 'sql_injection',
        risk_score: 0.95,
      },
    },
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const EscalateSignal: SignalCardStory = {
  args: {
    signal: {
      ...baseSignal,
      level: GovernanceSignalLevel.ESCALATE,
      criterion: GovernanceCriterion.IDENTITY_GUARD,
      message: 'Cross-identity access attempt detected',
      details: {
        requester_identity: 'user_123',
        resource_identity: 'user_456',
        resource_type: 'thread',
        action: 'read',
      },
    },
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const ProcessedSignal: SignalCardStory = {
  args: {
    signal: {
      ...baseSignal,
      processed: true,
    },
    onAcknowledge: (id) => console.log('Acknowledged:', id),
  },
};

export const SignalList: StoryObj<typeof GovernanceSignalList> = {
  render: () => {
    const signals: GovernanceSignal[] = [
      {
        ...baseSignal,
        id: '1',
        level: GovernanceSignalLevel.BLOCK,
        criterion: GovernanceCriterion.SECURITY_GUARD,
        message: 'Security violation detected',
      },
      {
        ...baseSignal,
        id: '2',
        level: GovernanceSignalLevel.WARN,
        criterion: GovernanceCriterion.BUDGET_GUARD,
        message: 'Budget at 80%',
      },
      {
        ...baseSignal,
        id: '3',
        level: GovernanceSignalLevel.CORRECT,
        criterion: GovernanceCriterion.CANON_GUARD,
        message: 'Auto-corrected field',
        patch_instruction: {
          action: 'replace',
          target: 'status',
          value: 'active',
          reason: 'Invalid status value',
        },
      },
    ];

    return (
      <GovernanceSignalList
        signals={signals}
        onAcknowledge={(id) => console.log('Acknowledged:', id)}
      />
    );
  },
};

export const EmptySignalList: StoryObj<typeof GovernanceSignalList> = {
  render: () => (
    <GovernanceSignalList
      signals={[]}
      onAcknowledge={(id) => console.log('Acknowledged:', id)}
    />
  ),
};

// =============================================================================
// BACKLOG ITEM CARD STORIES
// =============================================================================

const backlogCardMeta: Meta<typeof BacklogItemCard> = {
  title: 'Governance/BacklogItemCard',
  component: BacklogItemCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Displays a backlog item from the governance error backlog.

## Types
- **error**: Runtime errors or exceptions
- **signal**: Unprocessed governance signals
- **decision**: Decisions requiring review
- **cost**: Cost overruns or budget issues
- **governance_debt**: Technical debt in governance

## Severity
- **low**: Minor issue, can be deferred
- **medium**: Should be addressed soon
- **high**: Important, address this sprint
- **critical**: Urgent, address immediately
        `,
      },
    },
  },
};

export const BacklogCardStories: Meta<typeof BacklogItemCard> = backlogCardMeta;

const baseBacklogItem: BacklogItem = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  thread_id: '456e4567-e89b-12d3-a456-426614174000',
  identity_id: '789e4567-e89b-12d3-a456-426614174000',
  backlog_type: BacklogType.ERROR,
  severity: BacklogSeverity.HIGH,
  title: 'Failed to process ThreadEvent',
  description: 'Event processing failed due to missing parent_event_id reference',
  context: {
    event_type: 'action.created',
    error_code: 'MISSING_PARENT_REF',
    stack_trace: 'at ThreadService.process_event...',
  },
  source_spec: 'ThreadService:process_event',
  status: BacklogStatus.OPEN,
  linked_events: [
    { event_id: 'event_1', relation: 'source' },
  ],
  created_at: new Date().toISOString(),
  created_by: '789e4567-e89b-12d3-a456-426614174000',
  updated_at: new Date().toISOString(),
};

export const OpenError: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: baseBacklogItem,
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const CriticalSignal: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: {
      ...baseBacklogItem,
      backlog_type: BacklogType.SIGNAL,
      severity: BacklogSeverity.CRITICAL,
      title: 'Blocked security signal unresolved',
      description: 'A BLOCK-level security signal has been pending for 24+ hours',
      source_spec: 'CEA:security_guard',
    },
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const MediumCost: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: {
      ...baseBacklogItem,
      backlog_type: BacklogType.COST,
      severity: BacklogSeverity.MEDIUM,
      title: 'Token budget exceeded by 15%',
      description: 'Thread exceeded allocated token budget during LLM operations',
      context: {
        allocated_budget: 10000,
        actual_usage: 11500,
        overage_percentage: 15,
      },
      source_spec: 'BudgetService:check_usage',
    },
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const LowGovernanceDebt: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: {
      ...baseBacklogItem,
      backlog_type: BacklogType.GOVERNANCE_DEBT,
      severity: BacklogSeverity.LOW,
      title: 'Missing audit trail for bulk operation',
      description: 'Bulk action created 50 events without individual audit entries',
      source_spec: 'AuditService:validate_coverage',
    },
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const ResolvedItem: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: {
      ...baseBacklogItem,
      status: BacklogStatus.RESOLVED,
      resolution: 'Fixed missing parent_event_id by updating event creation logic to require parent reference.',
    },
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const InProgressItem: StoryObj<typeof BacklogItemCard> = {
  args: {
    item: {
      ...baseBacklogItem,
      status: BacklogStatus.IN_PROGRESS,
    },
    onResolve: (id, resolution) => console.log('Resolve:', id, resolution),
    onEscalate: (id) => console.log('Escalate:', id),
  },
};

export const BacklogListView: StoryObj<typeof BacklogList> = {
  render: () => {
    const items: BacklogItem[] = [
      {
        ...baseBacklogItem,
        id: '1',
        severity: BacklogSeverity.CRITICAL,
        title: 'Critical security issue',
      },
      {
        ...baseBacklogItem,
        id: '2',
        severity: BacklogSeverity.HIGH,
        backlog_type: BacklogType.SIGNAL,
        title: 'Unprocessed block signal',
      },
      {
        ...baseBacklogItem,
        id: '3',
        severity: BacklogSeverity.MEDIUM,
        backlog_type: BacklogType.COST,
        title: 'Budget overage',
      },
      {
        ...baseBacklogItem,
        id: '4',
        severity: BacklogSeverity.LOW,
        backlog_type: BacklogType.GOVERNANCE_DEBT,
        status: BacklogStatus.RESOLVED,
        title: 'Resolved debt item',
      },
    ];

    return (
      <BacklogList
        items={items}
        onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
        onEscalate={(id) => console.log('Escalate:', id)}
      />
    );
  },
};

export const EmptyBacklogList: StoryObj<typeof BacklogList> = {
  render: () => (
    <BacklogList
      items={[]}
      onResolve={(id, resolution) => console.log('Resolve:', id, resolution)}
      onEscalate={(id) => console.log('Escalate:', id)}
    />
  ),
};

// =============================================================================
// XR PREFLIGHT MODAL STORIES
// =============================================================================

const xrPreflightMeta: Meta<typeof XRPreflightModal> = {
  title: 'XR/XRPreflightModal',
  component: XRPreflightModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Pre-flight modal shown before entering XR mode.

Displays:
- Availability status
- Visible zones
- Enabled features
- Device requirements
- Privacy notice
- **Important**: Reminder that XR is PROJECTION only

## Human Gate
User must explicitly confirm to enter XR mode.
        `,
      },
    },
  },
};

export const XRPreflightStories: Meta<typeof XRPreflightModal> = xrPreflightMeta;

const basePreflightData: XRPreflightData = {
  thread_id: '123e4567-e89b-12d3-a456-426614174000',
  available: true,
  zones: [
    ZoneType.INTENT_WALL,
    ZoneType.DECISION_WALL,
    ZoneType.ACTION_TABLE,
    ZoneType.MEMORY_KIOSK,
    ZoneType.TIMELINE_STRIP,
    ZoneType.RESOURCE_SHELF,
  ],
  features: {
    can_create_actions: true,
    can_update_actions: true,
    can_add_notes: true,
    can_view_decisions: true,
    can_access_memory: true,
  },
  device_requirements: {
    webxr_required: false,
    recommended_device: 'Desktop browser with WebGL 2.0',
  },
  estimated_load_time_ms: 2500,
  privacy_notice: 'XR session data is stored locally. No external tracking.',
};

export const Available: StoryObj<typeof XRPreflightModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open XR Preflight
        </button>
        <XRPreflightModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          preflightData={basePreflightData}
          onProceed={() => {
            console.log('Proceeding to XR');
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

export const LimitedFeatures: StoryObj<typeof XRPreflightModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open XR Preflight
        </button>
        <XRPreflightModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          preflightData={{
            ...basePreflightData,
            zones: [ZoneType.INTENT_WALL, ZoneType.ACTION_TABLE],
            features: {
              can_create_actions: false,
              can_update_actions: true,
              can_add_notes: true,
              can_view_decisions: false,
              can_access_memory: false,
            },
          }}
          onProceed={() => {
            console.log('Proceeding to XR');
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

export const WebXRRequired: StoryObj<typeof XRPreflightModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open XR Preflight
        </button>
        <XRPreflightModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          preflightData={{
            ...basePreflightData,
            device_requirements: {
              webxr_required: true,
              recommended_device: 'Meta Quest 3 or compatible WebXR headset',
            },
            estimated_load_time_ms: 5000,
          }}
          onProceed={() => {
            console.log('Proceeding to XR');
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

export const Unavailable: StoryObj<typeof XRPreflightModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open XR Preflight
        </button>
        <XRPreflightModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          preflightData={{
            ...basePreflightData,
            available: false,
            unavailable_reason: 'Thread maturity level too low. XR requires Workshop level (25+ score).',
            zones: [],
            features: {
              can_create_actions: false,
              can_update_actions: false,
              can_add_notes: false,
              can_view_decisions: false,
              can_access_memory: false,
            },
          }}
          onProceed={() => {
            console.log('Proceeding to XR');
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

export const Loading: StoryObj<typeof XRPreflightModal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open XR Preflight
        </button>
        <XRPreflightModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          preflightData={null}
          loading={true}
          onProceed={() => {
            console.log('Proceeding to XR');
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};
