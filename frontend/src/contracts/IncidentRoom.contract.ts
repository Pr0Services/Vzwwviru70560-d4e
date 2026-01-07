/**
 * CHE·NU V51 — INCIDENT ROOM CONTRACT
 * ====================================
 * 
 * Crisis, investigation, compliance review.
 * Forensic visibility module.
 * 
 * PRINCIPLE: "Everything visible. Nothing hidden."
 */

import {
  ModuleActivationContract,
  ModuleState,
  validateModuleActivationContract,
  ContractValidationResult
} from './ModuleActivationContract';

// ============================================
// INCIDENT ROOM CONTRACT (FROZEN)
// ============================================

export const INCIDENT_ROOM_CONTRACT: ModuleActivationContract = {
  module_id: 'incident_room',
  module_type: 'forensic',

  activation: {
    trigger: 'explicit_action',
    lifecycle: 'session_bound'
  },

  loops: {
    allowed: [
      'incident',      // Forensic mode (mandatory)
      'system_trace'   // Event emission
    ],
    forbidden: [
      'auto_memory_write',    // NEVER write
      'autonomous_decision',  // NEVER decide
      'memory_proposal',      // No proposals
      'structure_adaptation'  // No changes
    ]
  },

  memory: {
    access: 'read',
    write: 'none',
    extraction: 'forbidden'
  },

  governance: {
    audit: 'mandatory',      // Audit is MANDATORY here
    incident_mode: 'enforced', // Always in incident mode
    trace_level: 'forensic'
  },

  ui: {
    modes_supported: ['incident', 'print'],
    xr_supported: true  // Optional for spatial investigation
  }
};

// ============================================
// INCIDENT ROOM STATE
// ============================================

export interface IncidentRoomState {
  module_state: ModuleState;
  session_id: string;
  
  /** Current investigation */
  active_investigation?: Investigation;
  
  /** Event timeline */
  event_timeline: SystemEventEntry[];
  
  /** Filters */
  filters: IncidentFilters;
  
  /** View mode */
  view_mode: 'timeline' | 'list' | 'graph';
  
  /** UI mode (always incident or print) */
  ui_mode: 'incident' | 'print';
  
  /** XR active */
  xr_active: boolean;
}

export interface Investigation {
  investigation_id: string;
  title: string;
  description: string;
  started_at: string;
  status: 'active' | 'closed' | 'exported';
  event_range: {
    from: string;
    to: string;
  };
  flagged_events: string[];
  notes: InvestigationNote[];
}

export interface InvestigationNote {
  note_id: string;
  content: string;
  created_at: string;
  linked_event_id?: string;
}

export interface SystemEventEntry {
  event_id: string;
  event_type: string;
  timestamp: string;
  actor: 'user' | 'system' | 'agent';
  module_id?: string;
  severity: 'info' | 'warning' | 'critical';
  payload?: Record<string, unknown>;
  flagged: boolean;
}

export interface IncidentFilters {
  event_types?: string[];
  severity?: ('info' | 'warning' | 'critical')[];
  actors?: ('user' | 'system' | 'agent')[];
  modules?: string[];
  date_range?: {
    from?: string;
    to?: string;
  };
  flagged_only?: boolean;
  search_query?: string;
}

// ============================================
// INCIDENT ROOM EVENTS
// ============================================

export type IncidentRoomEventType =
  | 'incident_room_entered'
  | 'incident_room_exited'
  | 'investigation_started'
  | 'investigation_closed'
  | 'event_flagged'
  | 'event_unflagged'
  | 'note_added'
  | 'note_deleted'
  | 'filters_applied'
  | 'filters_cleared'
  | 'investigation_exported'
  | 'timeline_range_changed';

// ============================================
// VALIDATION
// ============================================

export function validateIncidentRoomContract(): ContractValidationResult {
  return validateModuleActivationContract(INCIDENT_ROOM_CONTRACT);
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

export function createIncidentRoomState(session_id: string): IncidentRoomState {
  return {
    module_state: ModuleState.LATENT,
    session_id,
    active_investigation: undefined,
    event_timeline: [],
    filters: {},
    view_mode: 'timeline',
    ui_mode: 'incident',
    xr_active: false
  };
}

export function createInvestigation(title: string, description: string): Investigation {
  const now = new Date().toISOString();
  return {
    investigation_id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    started_at: now,
    status: 'active',
    event_range: {
      from: now,
      to: now
    },
    flagged_events: [],
    notes: []
  };
}
