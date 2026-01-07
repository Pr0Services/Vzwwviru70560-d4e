/**
 * CHE·NU™ - CORE LOOP CONFIGURATION
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * REQUIRED SEQUENCE:
 * 1. THINK   - Agent analyzes, plans
 * 2. WORK    - Agent executes in isolation
 * 3. ASSIST  - Agent provides output
 * 4. STAGING - Output goes to staging (NEVER direct to workspace)
 * 5. REVIEW  - User reviews staged output
 * 6. VERSION - Immutable version created after approval
 * 
 * RULES:
 * - Agent output NEVER writes directly to workspace
 * - ALL agent outputs go to staging first
 * - Review step is MANDATORY before version creation
 * - Versions are IMMUTABLE once created
 */

// ═══════════════════════════════════════════════════════════════
// CORE LOOP STEPS
// ═══════════════════════════════════════════════════════════════

export type CoreLoopStep = 
  | 'THINK'
  | 'WORK'
  | 'ASSIST'
  | 'STAGING'
  | 'REVIEW'
  | 'VERSION';

export const CORE_LOOP_SEQUENCE: CoreLoopStep[] = [
  'THINK',
  'WORK',
  'ASSIST',
  'STAGING',
  'REVIEW',
  'VERSION',
];

export interface CoreLoopStepConfig {
  id: CoreLoopStep;
  name: string;
  description: string;
  icon: string;
  actor: 'agent' | 'user' | 'system';
  isBlocking: boolean;
  requiresApproval: boolean;
}

export const CORE_LOOP_STEPS: Record<CoreLoopStep, CoreLoopStepConfig> = {
  THINK: {
    id: 'THINK',
    name: 'Think',
    description: 'Agent analyzes context, creates execution plan',
    icon: '🧠',
    actor: 'agent',
    isBlocking: false,
    requiresApproval: false,
  },
  WORK: {
    id: 'WORK',
    name: 'Work',
    description: 'Agent executes task in isolated environment',
    icon: '⚙️',
    actor: 'agent',
    isBlocking: false,
    requiresApproval: false,
  },
  ASSIST: {
    id: 'ASSIST',
    name: 'Assist',
    description: 'Agent provides output and recommendations',
    icon: '💡',
    actor: 'agent',
    isBlocking: false,
    requiresApproval: false,
  },
  STAGING: {
    id: 'STAGING',
    name: 'Staging',
    description: 'Output placed in staging area for review',
    icon: '📦',
    actor: 'system',
    isBlocking: true,
    requiresApproval: false,
  },
  REVIEW: {
    id: 'REVIEW',
    name: 'Review',
    description: 'User reviews and decides on staged output',
    icon: '👁️',
    actor: 'user',
    isBlocking: true,
    requiresApproval: true,
  },
  VERSION: {
    id: 'VERSION',
    name: 'Version',
    description: 'Immutable version created after approval',
    icon: '📌',
    actor: 'system',
    isBlocking: false,
    requiresApproval: false,
  },
};

// ═══════════════════════════════════════════════════════════════
// CORE LOOP RULES - FROZEN
// ═══════════════════════════════════════════════════════════════

export const CORE_LOOP_RULES = {
  // CL-001: Agent output never writes directly to workspace
  AGENT_DIRECT_WRITE: false,
  
  // CL-002: All agent outputs go to staging first
  STAGING_REQUIRED: true,
  
  // CL-003: Review step is mandatory before version creation
  REVIEW_MANDATORY: true,
  
  // CL-004: Versions are immutable once created
  VERSIONS_IMMUTABLE: true,
  
  // Additional rules
  PLAN_REQUIRED_BEFORE_EXECUTION: true,
  APPROVAL_REQUIRED_FOR_EXECUTION: true,
  APPROVAL_TOKEN_REQUIRED: true,
  EXECUTION_REVERSIBLE: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// EXECUTION STATE
// ═══════════════════════════════════════════════════════════════

export interface ExecutionState {
  id: string;
  currentStep: CoreLoopStep;
  steps: CoreLoopStepStatus[];
  startedAt: string;
  agentId: string;
  threadId?: string;
  plan?: ExecutionPlan;
  stagedOutput?: StagedOutput;
  versionId?: string;
}

export interface CoreLoopStepStatus {
  step: CoreLoopStep;
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ExecutionPlan {
  id: string;
  description: string;
  steps: PlanStep[];
  estimatedTokens: number;
  estimatedDuration: number;
  approvedAt?: string;
  approvedBy?: string;
}

export interface PlanStep {
  id: string;
  action: string;
  description: string;
  order: number;
}

export interface StagedOutput {
  id: string;
  type: string;
  content: unknown;
  preview: string;
  tokensUsed: number;
  createdAt: string;
  expiresAt: string;
}

// ═══════════════════════════════════════════════════════════════
// REVIEW ACTIONS
// ═══════════════════════════════════════════════════════════════

export type ReviewAction = 
  | 'approve'      // Accept and create version
  | 'reject'       // Discard output completely
  | 'modify'       // User edits before approval
  | 'keep_both'    // Keep user draft AND agent version
  | 'request_redo' // Ask agent to redo with feedback;

export interface ReviewDecision {
  action: ReviewAction;
  feedback?: string;
  modifications?: unknown;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function getNextStep(current: CoreLoopStep): CoreLoopStep | null {
  const currentIndex = CORE_LOOP_SEQUENCE.indexOf(current);
  if (currentIndex === -1 || currentIndex === CORE_LOOP_SEQUENCE.length - 1) {
    return null;
  }
  return CORE_LOOP_SEQUENCE[currentIndex + 1];
}

export function getPreviousStep(current: CoreLoopStep): CoreLoopStep | null {
  const currentIndex = CORE_LOOP_SEQUENCE.indexOf(current);
  if (currentIndex <= 0) {
    return null;
  }
  return CORE_LOOP_SEQUENCE[currentIndex - 1];
}

export function canProceedToStep(
  current: CoreLoopStep, 
  target: CoreLoopStep, 
  hasApproval: boolean
): boolean {
  const currentIndex = CORE_LOOP_SEQUENCE.indexOf(current);
  const targetIndex = CORE_LOOP_SEQUENCE.indexOf(target);
  
  // Can't skip steps
  if (targetIndex !== currentIndex + 1) return false;
  
  // Review requires approval to proceed to VERSION
  if (current === 'REVIEW' && target === 'VERSION' && !hasApproval) {
    return false;
  }
  
  return true;
}

export function validateExecution(state: ExecutionState): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check staging requirement
  if (state.currentStep === 'REVIEW' && !state.stagedOutput) {
    errors.push('Cannot review without staged output (CL-002)');
  }
  
  // Check plan requirement
  if (state.currentStep !== 'THINK' && !state.plan) {
    errors.push('Cannot proceed without execution plan (AG-001)');
  }
  
  return { valid: errors.length === 0, errors };
}

export default CORE_LOOP_STEPS;
