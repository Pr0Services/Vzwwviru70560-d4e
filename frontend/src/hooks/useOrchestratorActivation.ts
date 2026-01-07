/**
 * CHE·NU — Orchestrator Activation Hook
 * ============================================================
 * Manages when and how to propose the orchestrator.
 * 
 * Principles:
 * - Proposed only after repeated patterns
 * - Never forced
 * - Single proposal, respectful
 * - Fully reversible
 * 
 * @version 1.0.0
 * @frozen true
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface OrchestratorConditions {
  repeatedActions: number;        // Count of similar actions
  multipleContexts: boolean;      // Multiple docs/spheres open
  expandedScope: boolean;         // User requested broader scope
  longSession: boolean;           // Session > 15-20 min
  collaboration: boolean;         // Sharing/meeting/comments active
}

export interface OrchestratorState {
  isActivated: boolean;
  wasProposed: boolean;
  wasDeclined: boolean;
  activatedAt: number | null;
  declinedAt: number | null;
}

export interface OrchestratorProposal {
  id: string;
  message: string;
  buttons: Array<{
    label: string;
    action: 'activate' | 'decline';
    isDefault?: boolean;
  }>;
}

export interface UseOrchestratorActivationReturn {
  // State
  state: OrchestratorState;
  conditions: OrchestratorConditions;
  
  // Computed
  shouldPropose: boolean;
  isReady: boolean;
  conditionsMet: number;
  
  // Proposal
  proposal: OrchestratorProposal | null;
  
  // Actions
  recordAction: (actionType: string) => void;
  recordContextChange: (contexts: number) => void;
  recordScopeExpansion: () => void;
  recordCollaboration: () => void;
  
  handleActivate: () => void;
  handleDecline: () => void;
  deactivate: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const MIN_CONDITIONS_REQUIRED = 2;
const REPEATED_ACTION_THRESHOLD = 2;
const LONG_SESSION_MINUTES = 15;

const STORAGE_KEY = 'chenu_orchestrator_state';

// ============================================================
// CANONICAL PROPOSAL
// ============================================================

const CANONICAL_PROPOSAL: OrchestratorProposal = {
  id: 'orchestrator_proposal',
  message: `You're doing similar actions repeatedly.
You can activate an orchestrator to prepare options faster — or keep working as you are.`,
  buttons: [
    { label: 'Activate orchestrator', action: 'activate' },
    { label: 'Not now', action: 'decline', isDefault: true }
  ]
};

// ============================================================
// HOOK
// ============================================================

export function useOrchestratorActivation(
  sessionStartTime: number,
  isOriented: boolean = false
): UseOrchestratorActivationReturn {
  
  // ============================================================
  // STATE
  // ============================================================
  
  const [state, setState] = useState<OrchestratorState>(() => {
    // Load from storage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    
    return {
      isActivated: false,
      wasProposed: false,
      wasDeclined: false,
      activatedAt: null,
      declinedAt: null
    };
  });
  
  const [conditions, setConditions] = useState<OrchestratorConditions>({
    repeatedActions: 0,
    multipleContexts: false,
    expandedScope: false,
    longSession: false,
    collaboration: false
  });
  
  // Track action types for repetition detection
  const [actionHistory, setActionHistory] = useState<Map<string, number>>(new Map());
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // ============================================================
  // SESSION TIME TRACKING
  // ============================================================
  
  useEffect(() => {
    const checkSessionLength = () => {
      const elapsed = (Date.now() - sessionStartTime) / 60000;
      if (elapsed >= LONG_SESSION_MINUTES) {
        setConditions(prev => ({ ...prev, longSession: true }));
      }
    };
    
    const interval = setInterval(checkSessionLength, 60000);
    checkSessionLength(); // Check immediately
    
    return () => clearInterval(interval);
  }, [sessionStartTime]);
  
  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  
  const conditionsMet = useMemo(() => {
    let count = 0;
    if (conditions.repeatedActions >= REPEATED_ACTION_THRESHOLD) count++;
    if (conditions.multipleContexts) count++;
    if (conditions.expandedScope) count++;
    if (conditions.longSession) count++;
    if (conditions.collaboration) count++;
    return count;
  }, [conditions]);
  
  const shouldPropose = useMemo(() => {
    // Don't propose if already activated, proposed, or declined
    if (state.isActivated || state.wasProposed || state.wasDeclined) {
      return false;
    }
    
    // Don't propose if user isn't oriented yet
    if (!isOriented) {
      return false;
    }
    
    // Propose only if minimum conditions met
    return conditionsMet >= MIN_CONDITIONS_REQUIRED;
  }, [state, isOriented, conditionsMet]);
  
  const isReady = useMemo(() => {
    return state.isActivated;
  }, [state.isActivated]);
  
  const proposal = useMemo(() => {
    if (shouldPropose) {
      return CANONICAL_PROPOSAL;
    }
    return null;
  }, [shouldPropose]);
  
  // ============================================================
  // ACTIONS - Recording
  // ============================================================
  
  const recordAction = useCallback((actionType: string) => {
    setActionHistory(prev => {
      const newMap = new Map(prev);
      const count = (newMap.get(actionType) || 0) + 1;
      newMap.set(actionType, count);
      
      // Check for repetition
      if (count >= REPEATED_ACTION_THRESHOLD) {
        setConditions(c => ({ 
          ...c, 
          repeatedActions: Math.max(c.repeatedActions, count) 
        }));
      }
      
      return newMap;
    });
  }, []);
  
  const recordContextChange = useCallback((contexts: number) => {
    setConditions(prev => ({
      ...prev,
      multipleContexts: contexts > 1
    }));
  }, []);
  
  const recordScopeExpansion = useCallback(() => {
    setConditions(prev => ({
      ...prev,
      expandedScope: true
    }));
  }, []);
  
  const recordCollaboration = useCallback(() => {
    setConditions(prev => ({
      ...prev,
      collaboration: true
    }));
  }, []);
  
  // ============================================================
  // ACTIONS - Orchestrator
  // ============================================================
  
  const handleActivate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActivated: true,
      wasProposed: true,
      activatedAt: Date.now()
    }));
    
    // logger.debug('[Orchestrator] Activated by user');
  }, []);
  
  const handleDecline = useCallback(() => {
    setState(prev => ({
      ...prev,
      wasProposed: true,
      wasDeclined: true,
      declinedAt: Date.now()
    }));
    
    // logger.debug('[Orchestrator] Declined by user');
  }, []);
  
  const deactivate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActivated: false,
      activatedAt: null
    }));
    
    // logger.debug('[Orchestrator] Deactivated by user');
  }, []);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    state,
    conditions,
    shouldPropose,
    isReady,
    conditionsMet,
    proposal,
    recordAction,
    recordContextChange,
    recordScopeExpansion,
    recordCollaboration,
    handleActivate,
    handleDecline,
    deactivate
  };
}

export default useOrchestratorActivation;
