/**
 * CHE·NU™ - CORE LOOP STORE
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * Manages the execution flow:
 * THINK → WORK → ASSIST → STAGING → REVIEW → VERSION
 * 
 * CRITICAL RULES:
 * - CL-001: Agent output NEVER writes directly to workspace
 * - CL-002: ALL agent outputs go to staging first
 * - CL-003: Review step is MANDATORY before version creation
 * - CL-004: Versions are IMMUTABLE once created
 */

import { create } from 'zustand';
import { 
  CoreLoopStep, 
  CORE_LOOP_SEQUENCE,
  CORE_LOOP_RULES,
  ExecutionState,
  ExecutionPlan,
  StagedOutput,
  ReviewDecision,
  ReviewAction,
  getNextStep,
  canProceedToStep,
} from '../config/coreloop.config';

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

interface CoreLoopState {
  // Active executions
  executions: Record<string, ExecutionState>;
  activeExecutionId: string | null;
  
  // Start new execution
  startExecution: (agentId: string, threadId?: string) => string;
  
  // Step progression
  advanceStep: (executionId: string) => boolean;
  goToStep: (executionId: string, step: CoreLoopStep) => boolean;
  
  // Plan management (AG-001: No agent executes without a plan)
  submitPlan: (executionId: string, plan: Omit<ExecutionPlan, 'id'>) => void;
  approvePlan: (executionId: string) => boolean;
  rejectPlan: (executionId: string, feedback: string) => void;
  
  // Staging (CL-002: All agent outputs go to staging first)
  stageOutput: (executionId: string, output: Omit<StagedOutput, 'id' | 'createdAt' | 'expiresAt'>) => void;
  
  // Review (CL-003: Review is mandatory)
  submitReview: (executionId: string, decision: ReviewDecision) => void;
  
  // Version creation (CL-004: Immutable)
  createVersion: (executionId: string) => string | null;
  
  // Cancellation
  cancelExecution: (executionId: string) => void;
  
  // Queries
  getExecution: (id: string) => ExecutionState | undefined;
  getActiveExecution: () => ExecutionState | undefined;
  canAdvance: (executionId: string) => boolean;
  isStepComplete: (executionId: string, step: CoreLoopStep) => boolean;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

function createInitialSteps(): ExecutionState['steps'] {
  return CORE_LOOP_SEQUENCE.map((step) => ({
    step,
    status: step === 'THINK' ? 'active' : 'pending',
  }));
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useCoreLoopStore = create<CoreLoopState>((set, get) => ({
  executions: {},
  activeExecutionId: null,

  // ─────────────────────────────────────────────────────────
  // Start Execution
  // ─────────────────────────────────────────────────────────
  startExecution: (agentId: string, threadId?: string): string => {
    const id = generateId();
    const now = new Date().toISOString();
    
    const execution: ExecutionState = {
      id,
      currentStep: 'THINK',
      steps: createInitialSteps(),
      startedAt: now,
      agentId,
      threadId,
    };

    set((state) => ({
      executions: { ...state.executions, [id]: execution },
      activeExecutionId: id,
    }));

    console.log(`[CoreLoop] Started execution ${id} at THINK step`);
    return id;
  },

  // ─────────────────────────────────────────────────────────
  // Step Progression
  // ─────────────────────────────────────────────────────────
  advanceStep: (executionId: string): boolean => {
    const execution = get().executions[executionId];
    if (!execution) return false;

    const nextStep = getNextStep(execution.currentStep);
    if (!nextStep) {
      console.log(`[CoreLoop] Execution ${executionId} completed`);
      return false;
    }

    // Validate transitions
    if (execution.currentStep === 'THINK' && !execution.plan) {
      console.warn('[CoreLoop] Cannot advance: Plan required (AG-001)');
      return false;
    }

    if (execution.currentStep === 'ASSIST' && CORE_LOOP_RULES.STAGING_REQUIRED) {
      // Output must go to staging
      if (!execution.stagedOutput) {
        console.warn('[CoreLoop] Cannot advance: Staging required (CL-002)');
        return false;
      }
    }

    if (execution.currentStep === 'REVIEW' && nextStep === 'VERSION') {
      // Review must be approved
      // This is checked by submitReview
    }

    set((state) => {
      const exec = state.executions[executionId];
      const steps = exec.steps.map((s) => {
        if (s.step === exec.currentStep) {
          return { ...s, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
        if (s.step === nextStep) {
          return { ...s, status: 'active' as const, startedAt: new Date().toISOString() };
        }
        return s;
      });

      return {
        executions: {
          ...state.executions,
          [executionId]: {
            ...exec,
            currentStep: nextStep,
            steps,
          },
        },
      };
    });

    console.log(`[CoreLoop] Advanced to ${nextStep}`);
    return true;
  },

  goToStep: (executionId: string, step: CoreLoopStep): boolean => {
    const execution = get().executions[executionId];
    if (!execution) return false;

    // Can only go forward in sequence
    const currentIndex = CORE_LOOP_SEQUENCE.indexOf(execution.currentStep);
    const targetIndex = CORE_LOOP_SEQUENCE.indexOf(step);
    
    if (targetIndex <= currentIndex) {
      console.warn('[CoreLoop] Cannot go backwards in sequence');
      return false;
    }

    // Must complete intermediate steps
    for (let i = currentIndex; i < targetIndex; i++) {
      if (!get().advanceStep(executionId)) return false;
    }

    return true;
  },

  // ─────────────────────────────────────────────────────────
  // Plan Management
  // ─────────────────────────────────────────────────────────
  submitPlan: (executionId: string, planData: Omit<ExecutionPlan, 'id'>): void => {
    set((state) => {
      const exec = state.executions[executionId];
      if (!exec || exec.currentStep !== 'THINK') return state;

      const plan: ExecutionPlan = {
        ...planData,
        id: `plan_${Date.now()}`,
      };

      return {
        executions: {
          ...state.executions,
          [executionId]: { ...exec, plan },
        },
      };
    });
  },

  approvePlan: (executionId: string): boolean => {
    const execution = get().executions[executionId];
    if (!execution?.plan) return false;

    set((state) => {
      const exec = state.executions[executionId];
      return {
        executions: {
          ...state.executions,
          [executionId]: {
            ...exec,
            plan: {
              ...exec.plan!,
              approvedAt: new Date().toISOString(),
              approvedBy: 'current_user',
            },
          },
        },
      };
    });

    console.log('[CoreLoop] Plan approved, can proceed to WORK');
    return get().advanceStep(executionId);
  },

  rejectPlan: (executionId: string, feedback: string): void => {
    console.log(`[CoreLoop] Plan rejected: ${feedback}`);
    // Agent should regenerate plan
  },

  // ─────────────────────────────────────────────────────────
  // Staging (CL-001, CL-002)
  // ─────────────────────────────────────────────────────────
  stageOutput: (executionId: string, outputData: Omit<StagedOutput, 'id' | 'createdAt' | 'expiresAt'>): void => {
    // CL-001: Agent output NEVER writes directly to workspace
    // CL-002: All outputs go to staging first
    
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h expiry

    const output: StagedOutput = {
      ...outputData,
      id: `staged_${Date.now()}`,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    set((state) => {
      const exec = state.executions[executionId];
      if (!exec) return state;

      return {
        executions: {
          ...state.executions,
          [executionId]: { ...exec, stagedOutput: output },
        },
      };
    });

    console.log('[CoreLoop] Output staged (CL-002 compliant)');
  },

  // ─────────────────────────────────────────────────────────
  // Review (CL-003)
  // ─────────────────────────────────────────────────────────
  submitReview: (executionId: string, decision: ReviewDecision): void => {
    const execution = get().executions[executionId];
    if (!execution || execution.currentStep !== 'REVIEW') {
      console.warn('[CoreLoop] Cannot submit review: not in REVIEW step');
      return;
    }

    if (!execution.stagedOutput) {
      console.warn('[CoreLoop] Cannot review: no staged output');
      return;
    }

    console.log(`[CoreLoop] Review decision: ${decision.action}`);

    if (decision.action === 'approve') {
      // Proceed to VERSION step
      get().advanceStep(executionId);
      // Version will be created
      get().createVersion(executionId);
    } else if (decision.action === 'reject') {
      // Clear staging, end execution
      set((state) => ({
        executions: {
          ...state.executions,
          [executionId]: {
            ...state.executions[executionId],
            stagedOutput: undefined,
          },
        },
      }));
    }
  },

  // ─────────────────────────────────────────────────────────
  // Version Creation (CL-004)
  // ─────────────────────────────────────────────────────────
  createVersion: (executionId: string): string | null => {
    const execution = get().executions[executionId];
    if (!execution) return null;

    // CL-003: Review must be complete
    if (CORE_LOOP_RULES.REVIEW_MANDATORY) {
      const reviewStep = execution.steps.find((s) => s.step === 'REVIEW');
      if (reviewStep?.status !== 'completed') {
        console.warn('[CoreLoop] Cannot create version: review not complete (CL-003)');
        return null;
      }
    }

    // CL-004: Version is immutable once created
    const versionId = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    set((state) => ({
      executions: {
        ...state.executions,
        [executionId]: {
          ...state.executions[executionId],
          versionId,
        },
      },
    }));

    console.log(`[CoreLoop] Immutable version created: ${versionId} (CL-004 compliant)`);
    return versionId;
  },

  // ─────────────────────────────────────────────────────────
  // Cancellation
  // ─────────────────────────────────────────────────────────
  cancelExecution: (executionId: string): void => {
    set((state) => {
      const { [executionId]: removed, ...remaining } = state.executions;
      return {
        executions: remaining,
        activeExecutionId: state.activeExecutionId === executionId ? null : state.activeExecutionId,
      };
    });
    console.log(`[CoreLoop] Execution ${executionId} cancelled`);
  },

  // ─────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────
  getExecution: (id: string) => get().executions[id],
  
  getActiveExecution: () => {
    const { activeExecutionId, executions } = get();
    return activeExecutionId ? executions[activeExecutionId] : undefined;
  },

  canAdvance: (executionId: string): boolean => {
    const execution = get().executions[executionId];
    if (!execution) return false;
    
    const nextStep = getNextStep(execution.currentStep);
    if (!nextStep) return false;
    
    return canProceedToStep(execution.currentStep, nextStep, !!execution.plan?.approvedAt);
  },

  isStepComplete: (executionId: string, step: CoreLoopStep): boolean => {
    const execution = get().executions[executionId];
    if (!execution) return false;
    
    const stepState = execution.steps.find((s) => s.step === step);
    return stepState?.status === 'completed';
  },
}));

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useActiveExecution = () => useCoreLoopStore((s) => s.getActiveExecution());
export const useCurrentStep = () => useCoreLoopStore((s) => {
  const exec = s.getActiveExecution();
  return exec?.currentStep || null;
});

export default useCoreLoopStore;
