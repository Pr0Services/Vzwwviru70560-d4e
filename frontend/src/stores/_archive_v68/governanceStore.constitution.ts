/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — GOVERNANCE CONSTITUTION BRIDGE                  ║
 * ║                    Re-exports from governance.store.ts                        ║
 * ║                    CONSTITUTION COMPLIANT                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file provides Constitution-compliant hooks for governance.
 * All governance logic is centralized in governance.store.ts
 */

import { useGovernanceStore } from './governance.store';
import type { Checkpoint } from './governance.store';

// Re-export the main store
export { useGovernanceStore };
export type { Checkpoint };

/**
 * Hook to get current active checkpoint
 * Constitution Law #1: Consent Primacy
 */
export const useCheckpoint = () => {
  const activeCheckpoint = useGovernanceStore(state => 
    state.checkpoints.find(cp => cp.status === 'pending')
  );
  const approveCheckpoint = useGovernanceStore(state => state.approveCheckpoint);
  const rejectCheckpoint = useGovernanceStore(state => state.rejectCheckpoint);
  
  return {
    checkpoint: activeCheckpoint,
    approve: approveCheckpoint,
    reject: rejectCheckpoint,
    hasPending: !!activeCheckpoint,
  };
};

/**
 * Hook for depth suggestions
 * Constitution Law #3: Depth suggestions are intellectual only (NO budget/cost)
 */
export interface DepthSuggestion {
  id: string;
  type: 'expand' | 'deepen' | 'refine' | 'clarify';
  label: string;
  description: string;
  intellectualValue: 'low' | 'medium' | 'high';
  // ❌ FORBIDDEN: cost, budget, tokens
}

export const useDepthSuggestion = () => {
  // Depth suggestions are managed by Nova, not governance
  // This hook provides the interface expected by components
  return {
    suggestions: [] as DepthSuggestion[],
    selectSuggestion: (_id: string) => {
      // Will be connected to Nova pipeline
    },
    isLoading: false,
  };
};

/**
 * Hook for governance status
 */
export const useGovernanceStatus = () => {
  const checkpoints = useGovernanceStore(state => state.checkpoints);
  const violations = useGovernanceStore(state => state.violations);
  
  return {
    pendingCheckpoints: checkpoints.filter(cp => cp.status === 'pending').length,
    activeViolations: violations.filter(v => !v.resolved).length,
    isCompliant: violations.filter(v => !v.resolved).length === 0,
  };
};
