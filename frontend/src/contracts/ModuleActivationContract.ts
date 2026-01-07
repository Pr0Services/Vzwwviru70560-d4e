/**
 * CHE·NU V51 — MODULE ACTIVATION CONTRACT
 * ========================================
 * 
 * FROZEN ARCHITECTURE — NO INTERPRETATION
 * 
 * Every module in CHE·NU MUST declare this contract.
 * Without it, the module MUST remain inactive.
 * 
 * CORE PRINCIPLE:
 * Modules are LATENT by default.
 * A module becomes FUNCTIONAL only when:
 * - a user explicitly enters it
 * - its activation contract is validated
 * - its allowed loops are armed
 * 
 * NO AUTONOMOUS INTELLIGENCE.
 * NO AUTO-MEMORY WRITES.
 * PROPOSALS ONLY.
 */

// ============================================
// MODULE STATE MACHINE (NON-NEGOTIABLE)
// ============================================

export enum ModuleState {
  /**
   * LATENT: Module is visible in UI but inactive
   * - Zero loops active
   * - Zero memory activity
   * - No background execution
   */
  LATENT = 'LATENT',

  /**
   * ACTIVE: Module entered by user
   * - Allowed loops armed
   * - Memory access governed
   * - User is present
   */
  ACTIVE = 'ACTIVE',

  /**
   * PAUSED: Module temporarily suspended
   * - Loops disarmed
   * - State preserved
   * - No background execution
   */
  PAUSED = 'PAUSED',

  /**
   * CLOSED: Session ended
   * - No residual execution
   * - State may be persisted (if approved)
   * - Module returns to LATENT
   */
  CLOSED = 'CLOSED'
}

// ============================================
// ACTIVATION TRIGGER TYPES
// ============================================

export type ActivationTrigger = 'user_entry' | 'explicit_action';

export type ActivationLifecycle = 'on_demand' | 'session_bound';

// ============================================
// LOOP TYPES (ALLOWED vs FORBIDDEN)
// ============================================

export type AllowedLoop =
  | 'profile_continuity'      // Remember HOW user uses CHE·NU, not WHAT they think
  | 'system_trace'            // Emit visible system events
  | 'memory_proposal'         // Prepare proposals (NEVER auto-apply)
  | 'cognitive_load'          // Monitor density, not meaning
  | 'structure_adaptation'    // Adapt structure based on user actions
  | 'integration_readiness'   // Check external connection status
  | 'incident';               // Forensic mode loops

export type ForbiddenLoop =
  | 'auto_memory_write'       // NEVER write memory without human approval
  | 'autonomous_decision';    // NEVER decide without human validation

// ============================================
// MEMORY ACCESS LEVELS
// ============================================

export type MemoryAccessLevel = 'none' | 'read' | 'read+propose';

export type MemoryWriteLevel = 'none' | 'human_validated_only';

export type MemoryExtractionLevel = 'allowed' | 'forbidden';

// ============================================
// GOVERNANCE SETTINGS
// ============================================

export type AuditSetting = 'enabled' | 'disabled' | 'mandatory';

export type IncidentModeSupport = 'supported' | 'unsupported' | 'enforced';

export type TraceLevel = 'minimal' | 'standard' | 'forensic';

// ============================================
// UI MODE SUPPORT
// ============================================

export type UIMode = 'light' | 'dark_strict' | 'incident' | 'print';

// ============================================
// MODULE TYPE CLASSIFICATION
// ============================================

export type ModuleType =
  | 'cognitive'           // Thinking/reflection spaces
  | 'spatial'             // XR-enabled spaces
  | 'integrative'         // Cross-module coordination
  | 'governance'          // Audit/compliance
  | 'audit'               // Inspection/review
  | 'assisted_reasoning'  // Agent-assisted work
  | 'system_governance'   // Admin/system control
  | 'forensic';           // Crisis/investigation

// ============================================
// MODULE ACTIVATION CONTRACT
// ============================================

export interface ModuleActivationContract {
  /** Unique module identifier */
  module_id: string;

  /** Module type classification */
  module_type: ModuleType | ModuleType[];

  /** Activation configuration */
  activation: {
    trigger: ActivationTrigger;
    lifecycle: ActivationLifecycle;
  };

  /** Loop configuration */
  loops: {
    allowed: AllowedLoop[];
    forbidden: ForbiddenLoop[];
  };

  /** Memory access configuration */
  memory: {
    access: MemoryAccessLevel;
    write: MemoryWriteLevel;
    extraction: MemoryExtractionLevel;
  };

  /** Governance configuration */
  governance: {
    audit: AuditSetting;
    incident_mode: IncidentModeSupport;
    trace_level: TraceLevel;
  };

  /** UI configuration */
  ui: {
    modes_supported: UIMode[];
    xr_supported: boolean;
  };
}

// ============================================
// VALIDATION ERRORS
// ============================================

export interface ContractValidationError {
  code: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ContractValidationResult {
  is_valid: boolean;
  errors: ContractValidationError[];
  warnings: ContractValidationError[];
}

// ============================================
// VALIDATION FUNCTION
// ============================================

/**
 * Validates a ModuleActivationContract against CHE·NU V51 rules.
 * 
 * ENFORCEMENT RULES:
 * 1. auto_memory_write MUST be in forbidden loops
 * 2. autonomous_decision MUST be in forbidden loops
 * 3. Memory write MUST be 'none' or 'human_validated_only'
 * 4. If memory.write is not 'none', memory_proposal MUST be in allowed loops
 * 5. Audit MUST be enabled or mandatory (never disabled for governed modules)
 * 6. Incident mode MUST be supported or enforced
 * 
 * @param contract - The contract to validate
 * @returns Validation result with errors and warnings
 */
export function validateModuleActivationContract(
  contract: ModuleActivationContract
): ContractValidationResult {
  const errors: ContractValidationError[] = [];
  const warnings: ContractValidationError[] = [];

  // ----------------------------------------
  // RULE 1: auto_memory_write MUST be forbidden
  // ----------------------------------------
  if (!contract.loops.forbidden.includes('auto_memory_write')) {
    errors.push({
      code: 'E001_AUTO_WRITE_NOT_FORBIDDEN',
      field: 'loops.forbidden',
      message: 'auto_memory_write MUST be in forbidden loops. CHE·NU never writes memory automatically.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 2: autonomous_decision MUST be forbidden
  // ----------------------------------------
  if (!contract.loops.forbidden.includes('autonomous_decision')) {
    errors.push({
      code: 'E002_AUTONOMOUS_DECISION_NOT_FORBIDDEN',
      field: 'loops.forbidden',
      message: 'autonomous_decision MUST be in forbidden loops. CHE·NU never decides autonomously.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 3: Memory write level validation
  // ----------------------------------------
  if (contract.memory.write !== 'none' && contract.memory.write !== 'human_validated_only') {
    errors.push({
      code: 'E003_INVALID_WRITE_LEVEL',
      field: 'memory.write',
      message: 'Memory write MUST be "none" or "human_validated_only". No other modes are permitted.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 4: If writing is possible, memory_proposal must be allowed
  // ----------------------------------------
  if (
    contract.memory.write === 'human_validated_only' &&
    !contract.loops.allowed.includes('memory_proposal')
  ) {
    errors.push({
      code: 'E004_WRITE_WITHOUT_PROPOSAL',
      field: 'loops.allowed',
      message: 'If memory.write is "human_validated_only", memory_proposal MUST be in allowed loops.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 5: Audit should not be disabled
  // ----------------------------------------
  if (contract.governance.audit === 'disabled') {
    warnings.push({
      code: 'W001_AUDIT_DISABLED',
      field: 'governance.audit',
      message: 'Audit is disabled. This reduces traceability. Consider enabling audit.',
      severity: 'warning'
    });
  }

  // ----------------------------------------
  // RULE 6: Incident mode should be supported
  // ----------------------------------------
  if (contract.governance.incident_mode === 'unsupported') {
    warnings.push({
      code: 'W002_INCIDENT_UNSUPPORTED',
      field: 'governance.incident_mode',
      message: 'Incident mode is unsupported. This reduces forensic capabilities.',
      severity: 'warning'
    });
  }

  // ----------------------------------------
  // RULE 7: Module ID must be non-empty
  // ----------------------------------------
  if (!contract.module_id || contract.module_id.trim() === '') {
    errors.push({
      code: 'E005_EMPTY_MODULE_ID',
      field: 'module_id',
      message: 'module_id MUST be a non-empty string.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 8: At least one UI mode must be supported
  // ----------------------------------------
  if (!contract.ui.modes_supported || contract.ui.modes_supported.length === 0) {
    errors.push({
      code: 'E006_NO_UI_MODES',
      field: 'ui.modes_supported',
      message: 'At least one UI mode MUST be supported.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 9: Forensic modules MUST have incident mode enforced or supported
  // ----------------------------------------
  const moduleTypes = Array.isArray(contract.module_type) 
    ? contract.module_type 
    : [contract.module_type];
  
  if (
    moduleTypes.includes('forensic') &&
    contract.governance.incident_mode === 'unsupported'
  ) {
    errors.push({
      code: 'E007_FORENSIC_WITHOUT_INCIDENT',
      field: 'governance.incident_mode',
      message: 'Forensic modules MUST support incident mode.',
      severity: 'error'
    });
  }

  // ----------------------------------------
  // RULE 10: XR modules must support at least light or dark_strict
  // ----------------------------------------
  if (
    contract.ui.xr_supported &&
    !contract.ui.modes_supported.some(m => m === 'light' || m === 'dark_strict')
  ) {
    warnings.push({
      code: 'W003_XR_NO_STANDARD_MODE',
      field: 'ui.modes_supported',
      message: 'XR-enabled modules should support light or dark_strict mode.',
      severity: 'warning'
    });
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================
// STATE TRANSITION VALIDATION
// ============================================

/**
 * Valid state transitions in the module state machine.
 * 
 * LATENT -> ACTIVE   (user enters)
 * ACTIVE -> PAUSED   (user switches away)
 * ACTIVE -> CLOSED   (session ends)
 * PAUSED -> ACTIVE   (user returns)
 * PAUSED -> CLOSED   (session ends)
 * CLOSED -> LATENT   (reset for next session)
 */
export const VALID_STATE_TRANSITIONS: Record<ModuleState, ModuleState[]> = {
  [ModuleState.LATENT]: [ModuleState.ACTIVE],
  [ModuleState.ACTIVE]: [ModuleState.PAUSED, ModuleState.CLOSED],
  [ModuleState.PAUSED]: [ModuleState.ACTIVE, ModuleState.CLOSED],
  [ModuleState.CLOSED]: [ModuleState.LATENT]
};

/**
 * Validates if a state transition is allowed.
 */
export function isValidStateTransition(
  from: ModuleState,
  to: ModuleState
): boolean {
  return VALID_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Creates a state transition event for system trace.
 */
export function createStateTransitionEvent(
  module_id: string,
  from: ModuleState,
  to: ModuleState,
  actor: 'user' | 'system' = 'user'
): {
  event_type: string;
  module_id: string;
  from_state: ModuleState;
  to_state: ModuleState;
  actor: string;
  timestamp: string;
  is_valid: boolean;
} {
  return {
    event_type: 'module_state_transition',
    module_id,
    from_state: from,
    to_state: to,
    actor,
    timestamp: new Date().toISOString(),
    is_valid: isValidStateTransition(from, to)
  };
}

// ============================================
// CONTRACT FACTORY HELPERS
// ============================================

/**
 * Creates a base contract with mandatory forbidden loops.
 * Use this to ensure compliance with CHE·NU governance.
 */
export function createBaseContract(
  module_id: string,
  module_type: ModuleType | ModuleType[]
): Partial<ModuleActivationContract> {
  return {
    module_id,
    module_type,
    loops: {
      allowed: [],
      // MANDATORY: These loops are ALWAYS forbidden
      forbidden: ['auto_memory_write', 'autonomous_decision']
    },
    memory: {
      access: 'none',
      write: 'none',
      extraction: 'forbidden'
    },
    governance: {
      audit: 'enabled',
      incident_mode: 'supported',
      trace_level: 'standard'
    }
  };
}

// ============================================
// TYPE GUARDS
// ============================================

export function isModuleActivationContract(obj: unknown): obj is ModuleActivationContract {
  if (!obj || typeof obj !== 'object') return false;
  
  const contract = obj as Record<string, unknown>;
  
  return (
    typeof contract.module_id === 'string' &&
    contract.activation !== undefined &&
    contract.loops !== undefined &&
    contract.memory !== undefined &&
    contract.governance !== undefined &&
    contract.ui !== undefined
  );
}
