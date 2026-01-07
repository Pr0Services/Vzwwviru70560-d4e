/**
 * CHE·NU — First 10 Minutes Hook
 * ============================================================
 * Manages the state machine for user's first 10 minutes.
 * 
 * States:
 * - ARRIVED: Just logged in, silence
 * - SILENT_OBSERVATION: Watching user, no interaction
 * - FREE_ACTION: User is doing things
 * - OPTIONAL_SIGNAL: Pattern detected, offer help
 * - PROPOSAL_OFFERED: User asked to see options
 * - ORIENTED: User has made a decision
 * 
 * @version 1.0.0
 * @frozen true
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

export type First10MinState =
  | 'ARRIVED'
  | 'SILENT_OBSERVATION'
  | 'FREE_ACTION'
  | 'OPTIONAL_SIGNAL'
  | 'PROPOSAL_OFFERED'
  | 'ORIENTED';

export interface First10MinContext {
  state: First10MinState;
  minutesSinceLogin: number;
  userActionCount: number;
  wordCount: number;
  hasSeenSignal: boolean;
  hasAcceptedProposal: boolean | null;
}

export interface NovaMessage {
  id: string;
  text: string;
  buttons?: Array<{
    label: string;
    action: string;
    isDefault?: boolean;
  }>;
}

export interface First10MinActions {
  recordUserAction: (actionType: string, metadata?: Record<string, unknown>) => void;
  recordWordCount: (count: number) => void;
  handleSignalResponse: (response: 'do_nothing' | 'show_options') => void;
  handleProposalResponse: (response: 'accept' | 'reject') => void;
  dismissNova: () => void;
}

export interface UseFirst10MinutesReturn {
  context: First10MinContext;
  novaMessage: NovaMessage | null;
  actions: First10MinActions;
  isOriented: boolean;
}

// ============================================================
// NOVA MESSAGES (CANONICAL)
// ============================================================

const NOVA_MESSAGES: Record<string, NovaMessage> = {
  GREETING: {
    id: 'greeting',
    text: `You're in.
Nothing is running.
Nothing is shared.

Start by writing, pasting, or opening a sphere.`
  },
  
  OPTIONAL_SIGNAL: {
    id: 'optional_signal',
    text: 'If you want, I can help structure this.',
    buttons: [
      { label: 'Do nothing', action: 'do_nothing', isDefault: true },
      { label: 'Show options', action: 'show_options' }
    ]
  },
  
  PROPOSAL_EXPLANATION: {
    id: 'proposal_explanation',
    text: `This would prepare a proposal.
Nothing will be changed unless you accept.`
  },
  
  CONCLUSION: {
    id: 'conclusion',
    text: 'You can always work without assistance.'
  }
};

// ============================================================
// THRESHOLDS
// ============================================================

const WORD_COUNT_THRESHOLD = 300;  // Words needed to trigger optional signal
const SIGNAL_DELAY_MINUTES = 3;    // Minutes before signal can appear
const MAX_MINUTES = 10;            // After this, user is considered oriented

// ============================================================
// HOOK
// ============================================================

export function useFirst10Minutes(isLoggedIn: boolean): UseFirst10MinutesReturn {
  // Core state
  const [state, setState] = useState<First10MinState>('ARRIVED');
  const [minutesSinceLogin, setMinutesSinceLogin] = useState(0);
  const [userActionCount, setUserActionCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [hasSeenSignal, setHasSeenSignal] = useState(false);
  const [hasAcceptedProposal, setHasAcceptedProposal] = useState<boolean | null>(null);
  const [currentNovaMessage, setCurrentNovaMessage] = useState<NovaMessage | null>(null);
  
  // Refs for timers
  const loginTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize on login
  useEffect(() => {
    if (isLoggedIn && !loginTimeRef.current) {
      loginTimeRef.current = Date.now();
      setCurrentNovaMessage(NOVA_MESSAGES.GREETING);
      
      // Start minute counter
      timerRef.current = setInterval(() => {
        if (loginTimeRef.current) {
          const elapsed = Math.floor((Date.now() - loginTimeRef.current) / 60000);
          setMinutesSinceLogin(elapsed);
        }
      }, 30000); // Check every 30 seconds
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoggedIn]);
  
  // State machine transitions
  useEffect(() => {
    // After 1 minute, move to silent observation
    if (state === 'ARRIVED' && minutesSinceLogin >= 1) {
      setState('SILENT_OBSERVATION');
      setCurrentNovaMessage(null); // Clear greeting
    }
    
    // After user action, move to free action
    if (state === 'SILENT_OBSERVATION' && userActionCount > 0) {
      setState('FREE_ACTION');
    }
    
    // After enough words and time, show optional signal
    if (
      state === 'FREE_ACTION' &&
      wordCount >= WORD_COUNT_THRESHOLD &&
      minutesSinceLogin >= SIGNAL_DELAY_MINUTES &&
      !hasSeenSignal
    ) {
      setState('OPTIONAL_SIGNAL');
      setCurrentNovaMessage(NOVA_MESSAGES.OPTIONAL_SIGNAL);
      setHasSeenSignal(true);
    }
    
    // Auto-orient after max time
    if (minutesSinceLogin >= MAX_MINUTES && state !== 'ORIENTED') {
      setState('ORIENTED');
      setCurrentNovaMessage(null);
    }
  }, [state, minutesSinceLogin, userActionCount, wordCount, hasSeenSignal]);
  
  // ============================================================
  // ACTIONS
  // ============================================================
  
  const recordUserAction = useCallback((actionType: string, metadata?: Record<string, unknown>) => {
    setUserActionCount(prev => prev + 1);
    
    // Log for analytics (internal only, no PII)
    // logger.debug('[First10Min] Action:', actionType, metadata);
  }, []);
  
  const recordWordCount = useCallback((count: number) => {
    setWordCount(prev => prev + count);
  }, []);
  
  const handleSignalResponse = useCallback((response: 'do_nothing' | 'show_options') => {
    if (response === 'do_nothing') {
      setState('ORIENTED');
      setCurrentNovaMessage(NOVA_MESSAGES.CONCLUSION);
      
      // Clear message after 3 seconds
      setTimeout(() => setCurrentNovaMessage(null), 3000);
    } else if (response === 'show_options') {
      setState('PROPOSAL_OFFERED');
      setCurrentNovaMessage(NOVA_MESSAGES.PROPOSAL_EXPLANATION);
    }
  }, []);
  
  const handleProposalResponse = useCallback((response: 'accept' | 'reject') => {
    setHasAcceptedProposal(response === 'accept');
    setState('ORIENTED');
    setCurrentNovaMessage(NOVA_MESSAGES.CONCLUSION);
    
    // Clear message after 3 seconds
    setTimeout(() => setCurrentNovaMessage(null), 3000);
  }, []);
  
  const dismissNova = useCallback(() => {
    setCurrentNovaMessage(null);
  }, []);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    context: {
      state,
      minutesSinceLogin,
      userActionCount,
      wordCount,
      hasSeenSignal,
      hasAcceptedProposal
    },
    novaMessage: currentNovaMessage,
    actions: {
      recordUserAction,
      recordWordCount,
      handleSignalResponse,
      handleProposalResponse,
      dismissNova
    },
    isOriented: state === 'ORIENTED'
  };
}

export default useFirst10Minutes;
