/**
 * CHE·NU V51 — MEMORY INSPECTOR CONTRACT
 * =======================================
 * 
 * Transparent inspection of .chenu memory.
 * READ-ONLY module for governance and audit.
 * 
 * PRINCIPLE: "Inspect everything. Change nothing."
 */

import {
  ModuleActivationContract,
  ModuleState,
  validateModuleActivationContract,
  ContractValidationResult
} from './ModuleActivationContract';

// ============================================
// MEMORY INSPECTOR CONTRACT (FROZEN)
// ============================================

export const MEMORY_INSPECTOR_CONTRACT: ModuleActivationContract = {
  module_id: 'memory_inspector',
  module_type: ['governance', 'audit'],

  activation: {
    trigger: 'user_entry',
    lifecycle: 'on_demand'
  },

  loops: {
    allowed: [
      'system_trace',  // Emit visible events
      'incident'       // Forensic mode support
    ],
    forbidden: [
      'auto_memory_write',    // NEVER write memory
      'autonomous_decision',  // NEVER decide
      'memory_proposal',      // No proposals from inspector
      'structure_adaptation'  // No structure changes
    ]
  },

  memory: {
    access: 'read',
    write: 'none',        // Strictly read-only
    extraction: 'forbidden' // Cannot extract/copy
  },

  governance: {
    audit: 'enabled',
    incident_mode: 'supported',
    trace_level: 'forensic'
  },

  ui: {
    modes_supported: ['light', 'dark_strict', 'incident', 'print'],
    xr_supported: false
  }
};

// ============================================
// MEMORY INSPECTOR STATE
// ============================================

export interface MemoryInspectorState {
  module_state: ModuleState;
  session_id: string;
  
  /** Currently viewed memory library */
  active_library?: 'library' | 'workspace' | 'archive';
  
  /** Currently selected unit */
  selected_unit_id?: string;
  
  /** Filter settings */
  filters: MemoryInspectorFilters;
  
  /** View mode */
  view_mode: 'list' | 'detail' | 'timeline';
  
  /** UI mode */
  ui_mode: 'light' | 'dark_strict' | 'incident' | 'print';
}

export interface MemoryInspectorFilters {
  category?: string[];
  volatility?: string[];
  priority?: string[];
  spheres?: string[];
  projects?: string[];
  date_range?: {
    from?: string;
    to?: string;
  };
  search_query?: string;
}

// ============================================
// MEMORY UNIT DISPLAY (READ-ONLY)
// ============================================

export interface MemoryUnitDisplay {
  unit_id: string;
  memory_system: 'library' | 'workspace';
  category: string;
  volatility: string;
  priority: string;
  canonical_summary: string;
  tags: string[];
  projects: string[];
  spheres: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  
  /** Audit trail */
  audit_entries: AuditEntry[];
  
  /** Related units */
  related_units: string[];
}

export interface AuditEntry {
  entry_id: string;
  timestamp: string;
  action: 'created' | 'updated' | 'archived' | 'compacted';
  actor: 'user' | 'system';
  details?: string;
}

// ============================================
// MEMORY INSPECTOR EVENTS
// ============================================

export type MemoryInspectorEventType =
  | 'memory_inspector_entered'
  | 'memory_inspector_exited'
  | 'library_switched'
  | 'unit_selected'
  | 'unit_deselected'
  | 'filters_applied'
  | 'filters_cleared'
  | 'view_mode_changed'
  | 'print_triggered';

// ============================================
// VALIDATION
// ============================================

export function validateMemoryInspectorContract(): ContractValidationResult {
  return validateModuleActivationContract(MEMORY_INSPECTOR_CONTRACT);
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

export function createMemoryInspectorState(session_id: string): MemoryInspectorState {
  return {
    module_state: ModuleState.LATENT,
    session_id,
    active_library: undefined,
    selected_unit_id: undefined,
    filters: {},
    view_mode: 'list',
    ui_mode: 'dark_strict'
  };
}
