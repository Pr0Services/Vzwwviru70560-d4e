/**
 * CHE·NU V51 — REFLECTION ROOM CONTRACT
 * ======================================
 * 
 * The Reflection Room is the HEART of CHE·NU.
 * It is the ONLY space where:
 * - the user starts without defining context
 * - thinking is free-form
 * - structure emerges progressively
 * - intelligence is staged, not executed
 * 
 * The Reflection Room is NOT:
 * - a chat
 * - a task form
 * - a wizard
 * - a dashboard
 * 
 * It is a cognitive workspace.
 * 
 * PRINCIPLE: "Reflection first. Structure later. Memory last."
 */

import {
  ModuleActivationContract,
  ModuleState,
  validateModuleActivationContract,
  ContractValidationResult
} from './ModuleActivationContract';

// ============================================
// REFLECTION ROOM CONTRACT (FROZEN)
// ============================================

export const REFLECTION_ROOM_CONTRACT: ModuleActivationContract = {
  module_id: 'reflection_room',
  module_type: ['cognitive', 'spatial', 'integrative'],

  activation: {
    trigger: 'user_entry',
    lifecycle: 'session_bound'
  },

  loops: {
    allowed: [
      'profile_continuity',    // Remember HOW user uses the room
      'system_trace',          // Emit visible events
      'memory_proposal',       // Prepare proposals (NEVER auto-apply)
      'cognitive_load',        // Monitor density
      'structure_adaptation'   // Adapt based on user actions
    ],
    forbidden: [
      'auto_memory_write',     // NEVER write memory automatically
      'autonomous_decision'    // NEVER decide without human
    ]
  },

  memory: {
    access: 'read',
    write: 'human_validated_only',
    extraction: 'allowed'  // Proposals only
  },

  governance: {
    audit: 'enabled',
    incident_mode: 'supported',
    trace_level: 'standard'
  },

  ui: {
    modes_supported: ['light', 'dark_strict', 'incident'],
    xr_supported: true
  }
};

// ============================================
// REFLECTION ROOM SPECIAL RULES
// ============================================

export const REFLECTION_ROOM_RULES = {
  /**
   * User is never forced to choose a sphere.
   * Context-free entry is the default.
   */
  CONTEXT_FREE_ENTRY: true,

  /**
   * System NEVER auto-classifies without user review.
   * All classification is proposal-based.
   */
  NO_AUTO_CLASSIFICATION: true,

  /**
   * All extracted information is presented as DRAFT PROPOSALS.
   * Nothing is applied automatically.
   */
  PROPOSALS_ONLY: true,

  /**
   * User can reassign data to spheres at any time.
   */
  USER_REASSIGNMENT: true,

  /**
   * User can split, merge, or discard proposals.
   */
  USER_FULL_CONTROL: true
} as const;

// ============================================
// REFLECTION ROOM DATA FLOW
// ============================================

/**
 * Data flow in Reflection Room:
 * 
 * User Actions
 *    ↓
 * Unstructured Inputs (text / voice / spatial)
 *    ↓
 * STRUCTURAL SIGNAL EXTRACTION
 *    (topics, references, density, links)
 *    ↓
 * DRAFT PROPOSALS
 *    - memory proposals (.chenu draft)
 *    - sphere update proposals
 *    - structure suggestions
 *    ↓
 * USER REVIEW PANEL
 *    - accept
 *    - edit
 *    - split
 *    - discard
 *    ↓
 * Approved proposals ONLY
 *    → sent to Memory Companion / Nova
 * 
 * AT NO POINT IS MEMORY WRITTEN WITHOUT APPROVAL.
 */

export type ReflectionDataFlowStage =
  | 'user_input'
  | 'signal_extraction'
  | 'draft_proposal'
  | 'user_review'
  | 'approved_output';

// ============================================
// REFLECTION PROPOSAL TYPES
// ============================================

export type ReflectionProposalType =
  | 'memory_unit'      // .chenu draft
  | 'sphere_update'    // Update sphere metadata
  | 'structure_change'; // Modify structure

export interface ReflectionProposal {
  proposal_id: string;
  source: 'reflection_room';
  proposal_type: ReflectionProposalType;
  
  /** For memory proposals */
  draft_chenu_unit?: DraftChenuUnit;
  
  /** Affected spheres */
  affected_spheres: string[];
  
  /** User-settable confidence */
  confidence: 'low' | 'medium' | 'high';
  
  /** Always true - validation is mandatory */
  requires_validation: true;
  
  /** Creation timestamp */
  created_at: string;
  
  /** Proposal status */
  status: 'pending' | 'approved' | 'discarded' | 'edited';
}

export interface DraftChenuUnit {
  category: string;
  volatility: string;
  priority: string;
  canonical_summary: string;
  tags: string[];
  projects: string[];
  spheres: string[];
}

// ============================================
// REFLECTION ROOM STATE
// ============================================

export interface ReflectionRoomState {
  /** Current module state */
  module_state: ModuleState;
  
  /** Session ID */
  session_id: string;
  
  /** Active proposals awaiting review */
  pending_proposals: ReflectionProposal[];
  
  /** Canvas blocks */
  canvas_blocks: CanvasBlock[];
  
  /** Canvas links */
  canvas_links: CanvasLink[];
  
  /** Currently focused sphere (optional) */
  focused_sphere?: string;
  
  /** Current UI mode */
  ui_mode: 'light' | 'dark_strict' | 'incident';
  
  /** XR mode active */
  xr_active: boolean;
  
  /** Cognitive load signals */
  cognitive_load: CognitiveLoadSignals;
}

export interface CanvasBlock {
  block_id: string;
  block_type: 'text' | 'voice_placeholder' | 'reference' | 'sphere_snippet';
  content: string;
  position: { x: number; y: number };
  created_at: string;
}

export interface CanvasLink {
  link_id: string;
  from_block_id: string;
  to_block_id: string;
  link_type: 'reference' | 'sequence' | 'association';
}

export interface CognitiveLoadSignals {
  active_blocks: number;
  estimated_tokens: number;
  open_spheres: number;
  pending_proposals: number;
  load_state: 'closed' | 'open' | 'loaded';
}

// ============================================
// REFLECTION ROOM EVENTS
// ============================================

export type ReflectionRoomEventType =
  | 'reflection_room_entered'
  | 'reflection_room_exited'
  | 'canvas_block_created'
  | 'canvas_block_deleted'
  | 'canvas_link_created'
  | 'canvas_link_deleted'
  | 'sphere_focused'
  | 'sphere_unfocused'
  | 'proposal_generated'
  | 'proposal_reviewed'
  | 'proposal_approved'
  | 'proposal_discarded'
  | 'proposal_edited'
  | 'xr_mode_toggled'
  | 'cognitive_load_warning';

export interface ReflectionRoomEvent {
  event_type: ReflectionRoomEventType;
  timestamp: string;
  session_id: string;
  actor: 'user' | 'system';
  payload?: Record<string, unknown>;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validates the Reflection Room contract.
 * This should always pass for the frozen contract.
 */
export function validateReflectionRoomContract(): ContractValidationResult {
  return validateModuleActivationContract(REFLECTION_ROOM_CONTRACT);
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Creates a new Reflection Room state for a session.
 */
export function createReflectionRoomState(session_id: string): ReflectionRoomState {
  return {
    module_state: ModuleState.LATENT,
    session_id,
    pending_proposals: [],
    canvas_blocks: [],
    canvas_links: [],
    focused_sphere: undefined,
    ui_mode: 'dark_strict',
    xr_active: false,
    cognitive_load: {
      active_blocks: 0,
      estimated_tokens: 0,
      open_spheres: 0,
      pending_proposals: 0,
      load_state: 'closed'
    }
  };
}

/**
 * Creates a new reflection proposal.
 */
export function createReflectionProposal(
  proposal_type: ReflectionProposalType,
  affected_spheres: string[],
  draft_chenu_unit?: DraftChenuUnit
): ReflectionProposal {
  return {
    proposal_id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    source: 'reflection_room',
    proposal_type,
    draft_chenu_unit,
    affected_spheres,
    confidence: 'medium',
    requires_validation: true,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
}

/**
 * Creates a reflection room event.
 */
export function createReflectionRoomEvent(
  event_type: ReflectionRoomEventType,
  session_id: string,
  actor: 'user' | 'system' = 'user',
  payload?: Record<string, unknown>
): ReflectionRoomEvent {
  return {
    event_type,
    timestamp: new Date().toISOString(),
    session_id,
    actor,
    payload
  };
}

// ============================================
// COMPONENT TREE (REFERENCE)
// ============================================

/**
 * Official component tree for Reflection Room:
 * 
 * ReflectionRoomPage
 * ├── SystemHeader          (Nova visibility only, no interaction)
 * ├── LayoutGrid
 * │   ├── SphereRing        (LEFT — contextual structure)
 * │   │   └── SphereNode[]
 * │   ├── FreeCanvas        (CENTER — cognitive staging)
 * │   │   ├── CanvasBlock[]
 * │   │   └── CanvasLink[]
 * │   └── ProposalDrawer    (RIGHT — governance gate)
 * │       └── ProposalCard[]
 * ├── SystemFooter          (trace strip)
 * └── ModeController        (CSS-only: light/dark/incident)
 */

export const REFLECTION_ROOM_COMPONENT_TREE = {
  root: 'ReflectionRoomPage',
  children: [
    {
      name: 'SystemHeader',
      role: 'Nova visibility only, no interaction',
      interactive: false
    },
    {
      name: 'LayoutGrid',
      children: [
        {
          name: 'SphereRing',
          position: 'left',
          role: 'contextual structure',
          children: ['SphereNode[]']
        },
        {
          name: 'FreeCanvas',
          position: 'center',
          role: 'cognitive staging',
          children: ['CanvasBlock[]', 'CanvasLink[]']
        },
        {
          name: 'ProposalDrawer',
          position: 'right',
          role: 'governance gate',
          children: ['ProposalCard[]']
        }
      ]
    },
    {
      name: 'SystemFooter',
      role: 'trace strip'
    },
    {
      name: 'ModeController',
      role: 'CSS-only mode switching'
    }
  ]
} as const;

// ============================================
// FAILURE CONDITIONS
// ============================================

/**
 * Implementation is INVALID if:
 */
export const REFLECTION_ROOM_FAILURE_CONDITIONS = [
  'System writes memory automatically',
  'Reflection Room behaves like chat',
  'XR adds hidden logic',
  'Proposals are auto-applied',
  'User cannot fully review changes',
  'Canvas forces a structure',
  'Nova "speaks" or suggests unprompted',
  'User loses control'
] as const;
