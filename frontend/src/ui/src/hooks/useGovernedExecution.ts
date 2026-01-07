/**
 * CHE·NU™ — useGovernedExecution Hook
 * 
 * Hook React pour exécuter le Governed Execution Pipeline.
 * Intègre le pipeline avec le store et les callbacks UI.
 * 
 * Usage:
 * ```tsx
 * const { executeIntent, state, isExecuting, error } = useGovernedExecution();
 * 
 * await executeIntent("Analyse mes finances", {
 *   sphere_id: 'personnel',
 *   onApprovalRequired: async (encoding) => {
 *     return await showApprovalDialog(encoding);
 *   }
 * });
 * ```
 */

import { useState, useCallback, useRef } from 'react';
import { GovernedExecutionPipeline, PipelineState } from '../services/governedPipeline.service';
import { useChenuStore } from './useChenuStore';
import type { 
  ChenuEncoding, 
  ChenuThread, 
  Agent, 
  PipelineStage,
  CapturedResult 
} from '../types';

export interface ExecutionOptions {
  sphere_id: string;
  project_id?: string;
  thread_id?: string;
  
  // Callbacks
  onApprovalRequired?: (encoding: ChenuEncoding, estimate: { tokens: number; cost: number }) => Promise<boolean>;
  onAgentSelection?: (compatibleAgents: string[], recommended: string) => Promise<string>;
  onProgress?: (stage: PipelineStage, progress: number) => void;
  onComplete?: (result: CapturedResult) => void;
  onError?: (error: string) => void;
  
  // Options
  skipApproval?: boolean;
  autoSelectAgent?: boolean;
  dryRun?: boolean;
}

export interface ExecutionState {
  stage: PipelineStage;
  progress: number;
  encoding?: ChenuEncoding;
  estimatedTokens?: number;
  estimatedCost?: number;
  selectedAgent?: string;
  result?: CapturedResult;
  error?: string;
}

export interface UseGovernedExecutionReturn {
  // State
  state: ExecutionState;
  isExecuting: boolean;
  isIdle: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  
  // Actions
  executeIntent: (rawInput: string, options: ExecutionOptions) => Promise<{ success: boolean; thread?: ChenuThread; error?: string }>;
  cancelExecution: () => void;
  reset: () => void;
  
  // Pipeline access
  getPipelineState: () => PipelineState;
}

const initialState: ExecutionState = {
  stage: 'IDLE',
  progress: 0,
};

const STAGE_PROGRESS: Record<PipelineStage, number> = {
  IDLE: 0,
  INTENT_CAPTURE: 10,
  SEMANTIC_ENCODING: 20,
  ENCODING_VALIDATION: 30,
  COST_ESTIMATION: 40,
  SCOPE_LOCKING: 50,
  BUDGET_VERIFICATION: 60,
  ACM_CHECK: 70,
  EXECUTION: 85,
  RESULT_CAPTURE: 95,
  THREAD_UPDATE: 98,
  COMPLETED: 100,
  FAILED: 0,
};

export function useGovernedExecution(): UseGovernedExecutionReturn {
  const [state, setState] = useState<ExecutionState>(initialState);
  const pipelineRef = useRef<GovernedExecutionPipeline | null>(null);
  const cancelledRef = useRef(false);

  // Store access
  const {
    selectedSphereId,
    spheres,
    agents,
    threads,
    addThread,
    updateThread,
    setPipelineStage,
    updateGovernance,
  } = useChenuStore();

  // Create pipeline instance
  const createPipeline = useCallback(() => {
    return new GovernedExecutionPipeline({
      onStageChange: (stage) => {
        if (cancelledRef.current) return;
        setState(prev => ({
          ...prev,
          stage,
          progress: STAGE_PROGRESS[stage],
        }));
        setPipelineStage(stage);
      },
      onError: (error) => {
        if (cancelledRef.current) return;
        setState(prev => ({
          ...prev,
          stage: 'FAILED',
          error,
          progress: 0,
        }));
      },
      onComplete: (result) => {
        if (cancelledRef.current) return;
        setState(prev => ({
          ...prev,
          stage: 'COMPLETED',
          result,
          progress: 100,
        }));
      },
    });
  }, [setPipelineStage]);

  // Main execution function
  const executeIntent = useCallback(async (
    rawInput: string,
    options: ExecutionOptions
  ): Promise<{ success: boolean; thread?: ChenuThread; error?: string }> => {
    cancelledRef.current = false;
    
    // Create new pipeline instance
    const pipeline = createPipeline();
    pipelineRef.current = pipeline;

    // Reset state
    setState({
      stage: 'IDLE',
      progress: 0,
    });

    try {
      // Get sphere budget
      const sphere = spheres.find(s => s.id === options.sphere_id);
      if (!sphere) {
        throw new Error(`Sphère non trouvée: ${options.sphere_id}`);
      }

      // Create or get thread
      let thread: ChenuThread;
      if (options.thread_id) {
        const existingThread = threads.find(t => t.id === options.thread_id);
        if (!existingThread) {
          throw new Error(`Thread non trouvé: ${options.thread_id}`);
        }
        thread = existingThread;
      } else {
        thread = {
          id: crypto.randomUUID(),
          title: rawInput.substring(0, 50),
          type: 'personal',
          sphere_id: options.sphere_id,
          project_id: options.project_id,
          original_intent: rawInput,
          status: 'draft',
          audit_trail: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user',
          xr_compatible: false,
        };
        addThread(thread);
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 1-2: Intent Capture & Semantic Encoding
      // ═══════════════════════════════════════════════════════════
      const intent = await pipeline.captureIntent(rawInput, {
        sphere_id: options.sphere_id,
        project_id: options.project_id,
      });

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      const encoding = await pipeline.generateEncoding(intent, thread.id);
      setState(prev => ({ ...prev, encoding }));

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 3: Validation
      // ═══════════════════════════════════════════════════════════
      const validation = pipeline.validateEncoding(encoding);
      if (!validation.valid) {
        return { success: false, error: `Validation échouée: ${validation.errors.join(', ')}` };
      }

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 4: Cost Estimation
      // ═══════════════════════════════════════════════════════════
      const estimate = pipeline.estimateCost(encoding);
      setState(prev => ({
        ...prev,
        estimatedTokens: estimate.token_estimate,
        estimatedCost: estimate.cost_usd,
      }));

      // ═══════════════════════════════════════════════════════════
      // APPROVAL CHECK (if required)
      // ═══════════════════════════════════════════════════════════
      if (!options.skipApproval && options.onApprovalRequired) {
        const approved = await options.onApprovalRequired(encoding, {
          tokens: estimate.token_estimate,
          cost: estimate.cost_usd,
        });
        if (!approved) {
          setState(prev => ({ ...prev, stage: 'IDLE', progress: 0 }));
          return { success: false, error: 'Exécution refusée par l\'utilisateur' };
        }
      }

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 5: Scope Locking
      // ═══════════════════════════════════════════════════════════
      pipeline.lockScope(encoding);

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 6: Budget Verification
      // ═══════════════════════════════════════════════════════════
      // Get current budget from store
      const currentBudget = {
        allocated: sphere.defaultBudget,
        used: sphere.defaultBudget - (useChenuStore.getState().hubCenter.governanceIndicators.budgetRemaining),
      };

      const budget = await pipeline.verifyBudget(
        options.sphere_id,
        estimate,
        currentBudget
      );

      if (!budget.approved) {
        return { success: false, error: 'Budget insuffisant' };
      }

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 7: Agent Compatibility Check
      // ═══════════════════════════════════════════════════════════
      const sphereAgents = agents.filter(a => 
        a.sphere_id === options.sphere_id && 
        a.status === 'available'
      );

      const acm = pipeline.checkAgentCompatibility(encoding, sphereAgents);

      if (!acm.recommended_agent) {
        return { success: false, error: 'Aucun agent compatible disponible' };
      }

      // Agent selection callback
      let selectedAgent = acm.recommended_agent;
      if (!options.autoSelectAgent && options.onAgentSelection) {
        selectedAgent = await options.onAgentSelection(
          acm.compatible_agents,
          acm.recommended_agent
        );
      }
      setState(prev => ({ ...prev, selectedAgent }));

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // DRY RUN CHECK
      // ═══════════════════════════════════════════════════════════
      if (options.dryRun) {
        setState(prev => ({ ...prev, stage: 'COMPLETED', progress: 100 }));
        return { 
          success: true, 
          thread: {
            ...thread,
            encoding_optimized: encoding,
            status: 'pending',
          }
        };
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 8: Controlled Execution
      // ═══════════════════════════════════════════════════════════
      const execution = await pipeline.execute(
        encoding,
        selectedAgent,
        async (enc, agentId) => {
          // TODO: Connect to actual AI execution service
          // For now, simulate execution
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            result: `Exécution simulée par agent ${agentId}`,
            tokens_used: estimate.token_estimate,
          };
        }
      );

      if (!execution.success) {
        return { success: false, error: execution.error };
      }

      if (cancelledRef.current) return { success: false, error: 'Cancelled' };

      // ═══════════════════════════════════════════════════════════
      // STAGE 9: Result Capture
      // ═══════════════════════════════════════════════════════════
      const result = pipeline.captureResult(execution);
      setState(prev => ({ ...prev, result }));

      // ═══════════════════════════════════════════════════════════
      // STAGE 10: Thread Update
      // ═══════════════════════════════════════════════════════════
      const updatedThread = await pipeline.updateThread(thread, encoding, result);
      updateThread(thread.id, updatedThread);

      // Update governance indicators
      updateGovernance({
        tokensUsed: (useChenuStore.getState().hubCenter.governanceIndicators.tokensUsed) + result.tokens_used,
        budgetRemaining: (useChenuStore.getState().hubCenter.governanceIndicators.budgetRemaining) - result.tokens_used,
      });

      // Call completion callback
      options.onComplete?.(result);

      return { success: true, thread: updatedThread };

    } catch (error: unknown) {
      const errorMessage = error.message || 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        stage: 'FAILED',
        error: errorMessage,
        progress: 0,
      }));
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [
    createPipeline,
    spheres,
    threads,
    agents,
    addThread,
    updateThread,
    updateGovernance,
  ]);

  // Cancel execution
  const cancelExecution = useCallback(() => {
    cancelledRef.current = true;
    setState(prev => ({
      ...prev,
      stage: 'IDLE',
      progress: 0,
      error: 'Annulé',
    }));
    setPipelineStage('IDLE');
  }, [setPipelineStage]);

  // Reset state
  const reset = useCallback(() => {
    cancelledRef.current = false;
    pipelineRef.current = null;
    setState(initialState);
    setPipelineStage('IDLE');
  }, [setPipelineStage]);

  // Get pipeline state
  const getPipelineState = useCallback((): PipelineState => {
    return pipelineRef.current?.getState() || {
      stage: 'IDLE',
      thread_id: '',
      started_at: new Date().toISOString(),
    };
  }, []);

  return {
    // State
    state,
    isExecuting: !['IDLE', 'COMPLETED', 'FAILED'].includes(state.stage),
    isIdle: state.stage === 'IDLE',
    isCompleted: state.stage === 'COMPLETED',
    isFailed: state.stage === 'FAILED',
    
    // Actions
    executeIntent,
    cancelExecution,
    reset,
    
    // Pipeline access
    getPipelineState,
  };
}

export default useGovernedExecution;
