/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SYSTEM CHANNEL CANONICAL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLES STRICTES:
 * - NOT a chat interface
 * - Explicit states: IDLE → INTENT → PROPOSAL
 * - Intent reformulation REQUIRED before any proposal
 * - System NEVER initiates
 * - System proposes ONLY after user input
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { SphereId } from './SPHERES_CANONICAL_V2';
import { MeetingType } from './MEETING_TYPES_CANONICAL';

/**
 * EXPLICIT CHANNEL STATES
 * The channel MUST be in one of these states.
 * No ambiguous or intermediate states allowed.
 */
export type SystemChannelState = 
  | 'idle'           // Waiting for user input. System does NOTHING.
  | 'intent'         // User has provided input. System reformulates intent.
  | 'proposal'       // Intent confirmed. System presents proposal.
  | 'closed';        // Channel closed.

/**
 * STATE TRANSITIONS (STRICT)
 * Only these transitions are allowed.
 */
export const STATE_TRANSITIONS = {
  idle: ['intent'],           // User input triggers intent
  intent: ['idle', 'proposal'], // User confirms or cancels
  proposal: ['idle', 'closed'], // User accepts or rejects
  closed: ['idle']            // User reopens
} as const;

/**
 * COMPLIANCE RULES - SYSTEM CHANNEL
 */
export const CHANNEL_COMPLIANCE = {
  // Channel is NOT a chat
  IS_NOT_CHAT: true,
  
  // System NEVER initiates
  SYSTEM_NEVER_INITIATES: true,
  
  // Intent reformulation REQUIRED
  INTENT_REFORMULATION_REQUIRED: true,
  
  // Proposal only after intent confirmation
  PROPOSAL_AFTER_INTENT_ONLY: true,
  
  // No small talk or conversational responses
  NO_CONVERSATIONAL_RESPONSES: true
} as const;

/**
 * User Input - Raw user expression
 */
export interface UserInput {
  id: string;
  timestamp: number;
  raw: string;              // Raw user input
  activeSphere: SphereId;   // Current context
}

/**
 * Intent Reformulation - System's understanding
 * User MUST confirm before proposal.
 */
export interface IntentReformulation {
  id: string;
  inputId: string;          // Reference to user input
  timestamp: number;
  
  // Reformulated intent
  reformulated: string;     // Clear statement of intent
  scope: SphereId[];        // Identified spheres
  actionType: 'simple' | 'meeting' | 'none';
  
  // Status
  confirmed: boolean;       // User must confirm
  confirmedAt?: number;
}

/**
 * System Proposal - Only after confirmed intent
 */
export interface SystemProposal {
  id: string;
  intentId: string;         // Reference to confirmed intent
  timestamp: number;
  
  type: 'action' | 'meeting';
  
  // For meeting proposals
  meetingType?: MeetingType;
  meetingScope?: SphereId[];
  meetingObjective?: string;
  
  // For action proposals
  actionDescription?: string;
  
  // Status - User MUST decide
  status: 'pending' | 'accepted' | 'rejected';
  decidedAt?: number;
}

/**
 * Channel Session - Complete state
 */
export interface ChannelSession {
  id: string;
  userId: string;
  state: SystemChannelState;
  
  // Current data (only one active at a time)
  currentInput?: UserInput;
  currentIntent?: IntentReformulation;
  currentProposal?: SystemProposal;
  
  // Timestamps
  openedAt: number;
  lastActivityAt: number;
  closedAt?: number;
}

/**
 * ORCHESTRATOR BEHAVIOR (STRICT)
 * Defines what the orchestrator can and cannot do.
 */
export const ORCHESTRATOR_BEHAVIOR = {
  // What orchestrator DOES
  does: [
    'Wait for user input',
    'Reformulate user intent',
    'Ask for intent confirmation',
    'Present proposals after confirmation',
    'Execute ONLY validated proposals'
  ],
  
  // What orchestrator NEVER does
  never: [
    'Initiate conversations',
    'Start meetings automatically',
    'Execute without validation',
    'Make assumptions about intent',
    'Engage in chat or small talk',
    'Provide unsolicited suggestions'
  ]
} as const;

/**
 * RESPONSE TEMPLATES (MINIMAL, NOT CHAT-LIKE)
 */
export const RESPONSE_TEMPLATES = {
  // When idle and user opens channel
  onOpen: {
    en: 'Ready.',
    fr: 'Prêt.'
  },
  
  // Intent reformulation (not a question, a statement to confirm)
  intentReformulation: {
    en: 'Intent: {intent}. Confirm?',
    fr: 'Intention: {intent}. Confirmer?'
  },
  
  // Proposal presentation
  proposal: {
    en: 'Proposal: {proposal}. Accept or Reject.',
    fr: 'Proposition: {proposal}. Accepter ou Rejeter.'
  },
  
  // On rejection
  onReject: {
    en: 'Rejected. Ready.',
    fr: 'Rejeté. Prêt.'
  },
  
  // On acceptance
  onAccept: {
    en: 'Accepted. Executing.',
    fr: 'Accepté. Exécution.'
  }
} as const;

export default CHANNEL_COMPLIANCE;
