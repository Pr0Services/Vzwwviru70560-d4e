// =============================================================================
// CHE·NU™ — MEETING UI (NON-XR)
// =============================================================================
// STATUS: CANONICAL / LOCKED
// 
// Un meeting dans CHE·NU n'est PAS un chat.
// C'est un espace de raisonnement gouverné.
// =============================================================================

import { MeetingType, MeetingStatus, MeetingAgent, MeetingOutput } from './MEETING_TYPES_CANONICAL';
import { SphereId } from './SPHERES_CANONICAL_V2';

// -----------------------------------------------------------------------------
// CORE PRINCIPLE
// -----------------------------------------------------------------------------

/**
 * Un meeting dans CHE·NU:
 * - N'exécute PAS
 * - Ne décide PAS seul
 * - Produit des PROPOSITIONS
 * - L'humain valide les résultats
 */
export const MEETING_PRINCIPLES = {
  noExecution: true,
  noAutonomousDecision: true,
  producesProposals: true,
  humanValidates: true
} as const;

// -----------------------------------------------------------------------------
// MEETING UI STATES
// -----------------------------------------------------------------------------

export type MeetingUIState = 
  | 'open'            // Raisonnement en cours
  | 'proposal_ready'  // Propositions disponibles
  | 'validated'       // Utilisateur a approuvé
  | 'closed';         // Archivé

// -----------------------------------------------------------------------------
// MEETING TIMELINE ENTRY
// -----------------------------------------------------------------------------

export type TimelineEntryType = 
  | 'user_input'
  | 'agent_response'
  | 'clarification'
  | 'proposal';

export interface MeetingTimelineEntry {
  id: string;
  timestamp: number;
  type: TimelineEntryType;
  
  // Pour agent_response
  agentId?: string;
  agentRole?: string;
  
  // Contenu
  content: string;
  
  // Metadata
  isProposal?: boolean;
  proposalId?: string;
}

// -----------------------------------------------------------------------------
// PROPOSAL
// -----------------------------------------------------------------------------

export type ProposalStatus = 
  | 'pending'     // En attente de validation
  | 'accepted'    // Acceptée
  | 'rejected'    // Rejetée
  | 'modified';   // Modifiée par l'utilisateur

export interface MeetingProposal {
  id: string;
  title: string;
  content: string;
  
  // Source
  sourceAgentId: string;
  sourceAgentRole: string;
  
  // Status
  status: ProposalStatus;
  
  // Validation
  validatedAt?: number;
  modifiedContent?: string;
  rejectionReason?: string;
}

// -----------------------------------------------------------------------------
// MEETING UI PROPS
// -----------------------------------------------------------------------------

export interface MeetingUIProps {
  // Identité
  meetingId: string;
  meetingType: MeetingType;
  
  // État
  uiState: MeetingUIState;
  
  // Contexte
  context: {
    spheres: SphereId[];
    objective: string;
    scope: string;
  };
  
  // Participants
  participants: MeetingAgent[];
  
  // Timeline
  timeline: MeetingTimelineEntry[];
  
  // Propositions
  proposals: MeetingProposal[];
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

// -----------------------------------------------------------------------------
// MEETING UI LAYOUT (CANONICAL)
// -----------------------------------------------------------------------------

/**
 * ┌─────────────────────────────────────────────┐
 * │ MEETING HEADER                              │
 * │ Type · Context · Participants · Status      │
 * ├─────────────────────────────────────────────┤
 * │ MEETING TIMELINE                            │
 * │                                             │
 * │ • User input                                │
 * │ • Agent responses (role-tagged)             │
 * │ • Clarifications                            │
 * │ • Proposals                                 │
 * │                                             │
 * ├─────────────────────────────────────────────┤
 * │ PROPOSALS PANEL                             │
 * │                                             │
 * │ [ ] Proposal A                              │
 * │ [ ] Proposal B                              │
 * │                                             │
 * ├─────────────────────────────────────────────┤
 * │ ACTION BAR                                  │
 * │ [Validate] [Request change] [Close]         │
 * └─────────────────────────────────────────────┘
 */
export const MEETING_UI_LAYOUT = {
  sections: [
    {
      id: 'header',
      name: 'Meeting Header',
      contains: ['type', 'context', 'participants', 'status']
    },
    {
      id: 'timeline',
      name: 'Meeting Timeline',
      contains: ['user_inputs', 'agent_responses', 'clarifications', 'proposals']
    },
    {
      id: 'proposals',
      name: 'Proposals Panel',
      contains: ['proposal_list', 'selection_controls']
    },
    {
      id: 'actions',
      name: 'Action Bar',
      contains: ['validate_button', 'request_change_button', 'close_button']
    }
  ]
} as const;

// -----------------------------------------------------------------------------
// MEETING UI RULES (CANONICAL)
// -----------------------------------------------------------------------------

export const MEETING_UI_RULES = {
  // Chaque message agent est taggé par rôle
  agentMessagesTaggedByRole: true,
  
  // Pas de sortie système libre
  noFreeFormSystemOutput: true,
  
  // Propositions explicitement séparées
  proposalsExplicitlySeparated: true,
  
  // Aucune proposition finale sans validation
  noProposalFinalWithoutValidation: true,
  
  // Feeling de l'UI
  uiFeeling: {
    deliberate: true,
    slowEnoughToThink: true,
    structured: true
  }
} as const;

// -----------------------------------------------------------------------------
// MEETING UI INTERACTIONS
// -----------------------------------------------------------------------------

export interface MeetingUIInteractions {
  // Timeline
  onSendMessage: (content: string) => void;
  
  // Propositions
  onSelectProposal: (proposalId: string) => void;
  onValidateProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string, reason: string) => void;
  onModifyProposal: (proposalId: string, newContent: string) => void;
  
  // Actions
  onValidateMeeting: () => void;
  onRequestChange: () => void;
  onCloseMeeting: () => void;
}

// -----------------------------------------------------------------------------
// ACTION BAR BUTTONS
// -----------------------------------------------------------------------------

export const MEETING_ACTION_BUTTONS = {
  validate: {
    id: 'validate',
    label: { en: 'Validate', fr: 'Valider' },
    action: 'validate_meeting',
    requiresProposal: true,
    primary: true
  },
  requestChange: {
    id: 'request_change',
    label: { en: 'Request change', fr: 'Demander modification' },
    action: 'request_change',
    requiresProposal: true,
    primary: false
  },
  close: {
    id: 'close',
    label: { en: 'Close', fr: 'Fermer' },
    action: 'close_meeting',
    requiresProposal: false,
    primary: false
  }
} as const;

// -----------------------------------------------------------------------------
// VALIDATION
// -----------------------------------------------------------------------------

export const validateMeetingUI = (props: MeetingUIProps): boolean => {
  // Must have meeting ID
  if (!props.meetingId) return false;
  
  // Must have valid state
  if (!['open', 'proposal_ready', 'validated', 'closed'].includes(props.uiState)) return false;
  
  // Must have objective and scope
  if (!props.context.objective || !props.context.scope) return false;
  
  // Must have at least one participant
  if (!props.participants || props.participants.length === 0) return false;
  
  return true;
};

// -----------------------------------------------------------------------------
// ERRORS
// -----------------------------------------------------------------------------

export const MEETING_UI_ERRORS = {
  FREE_FORM_OUTPUT: 'Free-form system output detected',
  UNTAGGED_AGENT: 'Agent message without role tag',
  MIXED_PROPOSALS: 'Proposals not separated from timeline',
  AUTO_VALIDATION: 'Proposal validated without user action',
  MISSING_CONTEXT: 'Meeting missing objective or scope'
} as const;
