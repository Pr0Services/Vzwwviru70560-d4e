/**
 * CHE·NU V51 — ADMIN PANEL CONTRACT
 * ==================================
 * 
 * System status, readiness, policies, connections (disabled in demo).
 * READ-ONLY governance module.
 * 
 * PRINCIPLE: "Observe the system. Do not interfere."
 */

import {
  ModuleActivationContract,
  ModuleState,
  validateModuleActivationContract,
  ContractValidationResult
} from './ModuleActivationContract';

// ============================================
// ADMIN PANEL CONTRACT (FROZEN)
// ============================================

export const ADMIN_PANEL_CONTRACT: ModuleActivationContract = {
  module_id: 'admin_panel',
  module_type: 'system_governance',

  activation: {
    trigger: 'explicit_action',
    lifecycle: 'on_demand'
  },

  loops: {
    allowed: [
      'system_trace',          // Emit visible events
      'integration_readiness', // Check connections
      'incident'               // Forensic support
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
    audit: 'enabled',
    incident_mode: 'supported',
    trace_level: 'forensic'
  },

  ui: {
    modes_supported: ['dark_strict', 'incident', 'print'],
    xr_supported: false
  }
};

// ============================================
// ADMIN PANEL STATE
// ============================================

export interface AdminPanelState {
  module_state: ModuleState;
  session_id: string;
  
  /** Current admin section */
  active_section: AdminSection;
  
  /** System status */
  system_status: SystemStatus;
  
  /** Integration status (all disabled in demo) */
  integration_status: IntegrationStatus[];
  
  /** Tree Laws status */
  tree_laws_status: TreeLawsStatus;
  
  /** UI mode */
  ui_mode: 'dark_strict' | 'incident' | 'print';
}

export type AdminSection =
  | 'overview'
  | 'agents'
  | 'memory'
  | 'spheres'
  | 'system'
  | 'logs'
  | 'integrations';

export interface SystemStatus {
  app_version: string;
  dataset_id: string;
  uptime_seconds: number;
  memory_units_count: number;
  active_sessions: number;
  cpu_usage_percent?: number;
  ram_usage_percent?: number;
}

export interface IntegrationStatus {
  integration_id: string;
  name: string;
  type: 'llm' | 'database' | 'external_api' | 'storage';
  status: 'disabled' | 'ready' | 'connected' | 'error';
  last_check: string;
  error_message?: string;
}

export interface TreeLawsStatus {
  laws_loaded: boolean;
  laws_count: number;
  last_validation: string;
  validation_passed: boolean;
  violations: TreeLawViolation[];
}

export interface TreeLawViolation {
  law_id: string;
  violation_type: string;
  detected_at: string;
  resolved: boolean;
}

// ============================================
// ADMIN PANEL EVENTS
// ============================================

export type AdminPanelEventType =
  | 'admin_panel_entered'
  | 'admin_panel_exited'
  | 'admin_section_changed'
  | 'integration_check_triggered'
  | 'tree_laws_validation_triggered'
  | 'logs_exported'
  | 'system_status_refreshed';

// ============================================
// VALIDATION
// ============================================

export function validateAdminPanelContract(): ContractValidationResult {
  return validateModuleActivationContract(ADMIN_PANEL_CONTRACT);
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

export function createAdminPanelState(session_id: string): AdminPanelState {
  return {
    module_state: ModuleState.LATENT,
    session_id,
    active_section: 'overview',
    system_status: {
      app_version: 'V51',
      dataset_id: 'chenu_demo_dataset_v51',
      uptime_seconds: 0,
      memory_units_count: 0,
      active_sessions: 1
    },
    integration_status: [
      {
        integration_id: 'llm_claude',
        name: 'Claude API',
        type: 'llm',
        status: 'disabled',
        last_check: new Date().toISOString()
      },
      {
        integration_id: 'llm_gpt4',
        name: 'GPT-4 API',
        type: 'llm',
        status: 'disabled',
        last_check: new Date().toISOString()
      },
      {
        integration_id: 'db_postgres',
        name: 'PostgreSQL',
        type: 'database',
        status: 'disabled',
        last_check: new Date().toISOString()
      }
    ],
    tree_laws_status: {
      laws_loaded: true,
      laws_count: 3,
      last_validation: new Date().toISOString(),
      validation_passed: true,
      violations: []
    },
    ui_mode: 'dark_strict'
  };
}
