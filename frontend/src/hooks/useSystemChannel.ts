/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — USE SYSTEM CHANNEL HOOK (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STRICT RULES:
 * - NOT a chat
 * - Explicit states: IDLE → INTENT → PROPOSAL
 * - System NEVER initiates
 * - Intent reformulation REQUIRED
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';
import {
  SystemChannelState,
  UserInput,
  IntentReformulation,
  SystemProposal,
  STATE_TRANSITIONS,
  CHANNEL_COMPLIANCE
} from '../canonical/SYSTEM_CHANNEL_CANONICAL';
import { MeetingType } from '../canonical/MEETING_TYPES_CANONICAL';
import { SphereId } from '../canonical/SPHERES_CANONICAL_V2';

interface UseSystemChannelReturn {
  // State
  isOpen: boolean;
  state: SystemChannelState;
  currentInput: UserInput | null;
  currentIntent: IntentReformulation | null;
  currentProposal: SystemProposal | null;
  
  // Actions
  open: () => void;
  close: () => void;
  submitInput: (raw: string, activeSphere: SphereId) => void;
  confirmIntent: () => void;
  cancelIntent: () => void;
  acceptProposal: () => void;
  rejectProposal: () => void;
  
  // Validation
  canTransitionTo: (newState: SystemChannelState) => boolean;
}

export function useSystemChannel(
  onMeetingStart?: (type: MeetingType, spheres: SphereId[]) => void
): UseSystemChannelReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<SystemChannelState>('idle');
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [currentIntent, setCurrentIntent] = useState<IntentReformulation | null>(null);
  const [currentProposal, setCurrentProposal] = useState<SystemProposal | null>(null);

  /**
   * Check if transition is allowed
   */
  const canTransitionTo = useCallback((newState: SystemChannelState): boolean => {
    const allowed = STATE_TRANSITIONS[state];
    return allowed.includes(newState);
  }, [state]);

  /**
   * Transition state (with validation)
   */
  const transitionTo = useCallback((newState: SystemChannelState) => {
    if (!canTransitionTo(newState)) {
      logger.warn(`Invalid transition: ${state} → ${newState}`);
      return false;
    }
    setState(newState);
    return true;
  }, [state, canTransitionTo]);

  /**
   * Open channel
   */
  const open = useCallback(() => {
    setIsOpen(true);
    setState('idle');
  }, []);

  /**
   * Close channel
   */
  const close = useCallback(() => {
    setIsOpen(false);
    transitionTo('closed');
    // Reset all data
    setCurrentInput(null);
    setCurrentIntent(null);
    setCurrentProposal(null);
  }, [transitionTo]);

  /**
   * Submit user input (IDLE → INTENT)
   */
  const submitInput = useCallback((raw: string, activeSphere: SphereId) => {
    if (state !== 'idle' || !raw.trim()) return;

    // Create input
    const input: UserInput = {
      id: `input-${Date.now()}`,
      timestamp: Date.now(),
      raw: raw.trim(),
      activeSphere
    };
    setCurrentInput(input);

    // Generate intent reformulation
    const intent = generateIntentReformulation(input);
    setCurrentIntent(intent);

    // Transition to intent state
    transitionTo('intent');
  }, [state, transitionTo]);

  /**
   * Generate intent reformulation
   * System reformulates, does NOT chat
   */
  const generateIntentReformulation = (input: UserInput): IntentReformulation => {
    const lower = input.raw.toLowerCase();
    
    let actionType: 'simple' | 'meeting' | 'none' = 'none';
    let reformulated = '';

    // Detect intent type
    if (lower.includes('décision') || lower.includes('decision') || lower.includes('décider')) {
      actionType = 'meeting';
      reformulated = `Start decision meeting in ${input.activeSphere}`;
    } else if (lower.includes('réfléchir') || lower.includes('reflect') || lower.includes('explorer')) {
      actionType = 'meeting';
      reformulated = `Start reflection meeting in ${input.activeSphere}`;
    } else if (lower.includes('aligner') || lower.includes('align') || lower.includes('équipe')) {
      actionType = 'meeting';
      reformulated = `Start alignment meeting in ${input.activeSphere}`;
    } else if (lower.includes('audit') || lower.includes('review') || lower.includes('vérifier')) {
      actionType = 'meeting';
      reformulated = `Start review meeting in ${input.activeSphere}`;
    } else {
      reformulated = input.raw; // Echo back for confirmation
    }

    return {
      id: `intent-${Date.now()}`,
      inputId: input.id,
      timestamp: Date.now(),
      reformulated,
      scope: [input.activeSphere],
      actionType,
      confirmed: false
    };
  };

  /**
   * Confirm intent (INTENT → PROPOSAL or IDLE)
   */
  const confirmIntent = useCallback(() => {
    if (state !== 'intent' || !currentIntent) return;

    // Mark as confirmed
    const confirmed: IntentReformulation = {
      ...currentIntent,
      confirmed: true,
      confirmedAt: Date.now()
    };
    setCurrentIntent(confirmed);

    // If action needed, create proposal
    if (confirmed.actionType === 'meeting') {
      const proposal: SystemProposal = {
        id: `proposal-${Date.now()}`,
        intentId: confirmed.id,
        timestamp: Date.now(),
        type: 'meeting',
        meetingType: detectMeetingType(confirmed.reformulated),
        meetingScope: confirmed.scope,
        meetingObjective: confirmed.reformulated,
        status: 'pending'
      };
      setCurrentProposal(proposal);
      transitionTo('proposal');
    } else {
      // No action, return to idle
      resetToIdle();
    }
  }, [state, currentIntent, transitionTo]);

  /**
   * Cancel intent (INTENT → IDLE)
   */
  const cancelIntent = useCallback(() => {
    if (state !== 'intent') return;
    resetToIdle();
  }, [state]);

  /**
   * Accept proposal (PROPOSAL → execute and close)
   */
  const acceptProposal = useCallback(() => {
    if (state !== 'proposal' || !currentProposal) return;

    // Execute
    if (currentProposal.type === 'meeting' && 
        currentProposal.meetingType && 
        currentProposal.meetingScope &&
        onMeetingStart) {
      onMeetingStart(currentProposal.meetingType, currentProposal.meetingScope);
    }

    // Update status
    setCurrentProposal({
      ...currentProposal,
      status: 'accepted',
      decidedAt: Date.now()
    });

    // Close
    close();
  }, [state, currentProposal, onMeetingStart, close]);

  /**
   * Reject proposal (PROPOSAL → IDLE)
   */
  const rejectProposal = useCallback(() => {
    if (state !== 'proposal') return;

    if (currentProposal) {
      setCurrentProposal({
        ...currentProposal,
        status: 'rejected',
        decidedAt: Date.now()
      });
    }

    resetToIdle();
  }, [state, currentProposal]);

  /**
   * Reset to idle
   */
  const resetToIdle = () => {
    setState('idle');
    setCurrentInput(null);
    setCurrentIntent(null);
    setCurrentProposal(null);
  };

  /**
   * Detect meeting type from text
   */
  const detectMeetingType = (text: string): MeetingType => {
    const lower = text.toLowerCase();
    if (lower.includes('decision')) return 'decision';
    if (lower.includes('reflection')) return 'reflection';
    if (lower.includes('alignment')) return 'team_alignment';
    if (lower.includes('review') || lower.includes('audit')) return 'review_audit';
    return 'reflection';
  };

  return {
    isOpen,
    state,
    currentInput,
    currentIntent,
    currentProposal,
    open,
    close,
    submitInput,
    confirmIntent,
    cancelIntent,
    acceptProposal,
    rejectProposal,
    canTransitionTo
  };
}

export default useSystemChannel;
