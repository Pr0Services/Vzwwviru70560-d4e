/**
 * CHE·NU V51 — AGENT WORKSPACE CONTRACT
 * ======================================
 * 
 * Interface to interact with specialized agents.
 * Assisted reasoning with human validation.
 * 
 * PRINCIPLE: "Agents assist. Humans decide."
 */

import {
  ModuleActivationContract,
  ModuleState,
  validateModuleActivationContract,
  ContractValidationResult
} from './ModuleActivationContract';

// ============================================
// AGENT WORKSPACE CONTRACT (FROZEN)
// ============================================

export const AGENT_WORKSPACE_CONTRACT: ModuleActivationContract = {
  module_id: 'agent_workspace',
  module_type: 'assisted_reasoning',

  activation: {
    trigger: 'explicit_action',
    lifecycle: 'session_bound'
  },

  loops: {
    allowed: [
      'profile_continuity',  // Remember user preferences
      'memory_proposal',     // Agents can propose
      'cognitive_load'       // Monitor complexity
    ],
    forbidden: [
      'auto_memory_write',    // NEVER auto-write
      'autonomous_decision',  // NEVER auto-decide
      'structure_adaptation'  // No structure changes
    ]
  },

  memory: {
    access: 'read',
    write: 'human_validated_only',
    extraction: 'allowed'  // Proposal-only extraction
  },

  governance: {
    audit: 'enabled',
    incident_mode: 'supported',
    trace_level: 'standard'
  },

  ui: {
    modes_supported: ['light', 'dark_strict'],
    xr_supported: true  // Optional XR support
  }
};

// ============================================
// AGENT WORKSPACE STATE
// ============================================

export interface AgentWorkspaceState {
  module_state: ModuleState;
  session_id: string;
  
  /** Currently active agent */
  active_agent_id?: string;
  
  /** Active sphere context */
  active_sphere_id?: string;
  
  /** Pending agent proposals */
  pending_proposals: AgentProposal[];
  
  /** Conversation history (session-scoped) */
  conversation_history: ConversationEntry[];
  
  /** UI mode */
  ui_mode: 'light' | 'dark_strict';
  
  /** XR active */
  xr_active: boolean;
}

export interface AgentProposal {
  proposal_id: string;
  agent_id: string;
  proposal_type: 'memory_unit' | 'action_suggestion' | 'information';
  content: unknown;
  confidence: 'low' | 'medium' | 'high';
  requires_validation: true;
  status: 'pending' | 'approved' | 'discarded';
  created_at: string;
}

export interface ConversationEntry {
  entry_id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agent_id?: string;
}

// ============================================
// AGENT WORKSPACE EVENTS
// ============================================

export type AgentWorkspaceEventType =
  | 'agent_workspace_entered'
  | 'agent_workspace_exited'
  | 'agent_selected'
  | 'agent_deselected'
  | 'sphere_context_set'
  | 'agent_proposal_received'
  | 'agent_proposal_approved'
  | 'agent_proposal_discarded'
  | 'conversation_message_sent'
  | 'conversation_message_received';

// ============================================
// VALIDATION
// ============================================

export function validateAgentWorkspaceContract(): ContractValidationResult {
  return validateModuleActivationContract(AGENT_WORKSPACE_CONTRACT);
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

export function createAgentWorkspaceState(session_id: string): AgentWorkspaceState {
  return {
    module_state: ModuleState.LATENT,
    session_id,
    active_agent_id: undefined,
    active_sphere_id: undefined,
    pending_proposals: [],
    conversation_history: [],
    ui_mode: 'dark_strict',
    xr_active: false
  };
}
