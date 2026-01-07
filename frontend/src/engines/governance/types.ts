/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — GOVERNED EXECUTION PIPELINE                           ║
 * ║              TYPES & INTERFACES                                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "No AI execution occurs until human intent has been clarified, encoded,    ║
 * ║   governed, validated, cost-estimated, scope-restricted, and matched        ║
 * ║   with compatible AI agents."                                               ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  RÈGLE FONDAMENTALE: "Failure at any stage prevents execution."             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PIPELINE STAGES (10 étapes strictes)
// ═══════════════════════════════════════════════════════════════════════════════

export type PipelineStage = 
  | 'INTENT_CAPTURE'           // 1. Capture de l'input humain brut
  | 'SEMANTIC_ENCODING'        // 2. Transformation en schéma structuré
  | 'ENCODING_VALIDATION'      // 3. Vérification syntaxe et cohérence
  | 'TOKEN_COST_ESTIMATION'    // 4. Calcul du coût computationnel
  | 'SCOPE_LOCKING'            // 5. Verrouillage du périmètre d'exécution
  | 'BUDGET_VERIFICATION'      // 6. Vérification budget utilisateur
  | 'AGENT_COMPATIBILITY'      // 7. Validation via Agent Compatibility Matrix
  | 'CONTROLLED_EXECUTION'     // 8. Exécution supervisée avec monitoring
  | 'RESULT_CAPTURE'           // 9. Capture du résultat et métadonnées
  | 'THREAD_UPDATE';           // 10. Mise à jour du thread avec audit trail

export type StageStatus = 
  | 'PENDING'      // En attente
  | 'IN_PROGRESS'  // En cours
  | 'PASSED'       // Validé
  | 'FAILED'       // Échec (bloque le pipeline)
  | 'SKIPPED';     // Sauté (avec justification)

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 1: INTENT CAPTURE
// ═══════════════════════════════════════════════════════════════════════════════

export type IntentSource = 'text' | 'voice' | 'gesture' | 'selection' | 'automation';

export interface IntentCapture {
  id: string;
  timestamp: string;
  source: IntentSource;
  raw_input: string;
  language: string;
  confidence: number; // 0-1
  context: {
    sphere_id?: string;
    dataspace_id?: string;
    thread_id?: string;
    previous_intent_id?: string;
  };
  user_id: string;
  session_id: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 2: SEMANTIC ENCODING
// ═══════════════════════════════════════════════════════════════════════════════

export type ActionType = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'analyze' | 'generate' | 'transform' | 'summarize'
  | 'search' | 'filter' | 'sort' | 'aggregate'
  | 'schedule' | 'notify' | 'share' | 'export';

export type DataSource = 'sphere' | 'dataspace' | 'external' | 'mixed';
export type ScopeBoundary = 'strict' | 'flexible' | 'expandable';
export type OperationalMode = 'draft' | 'production' | 'review' | 'approval';
export type TraceabilityLevel = 'full' | 'partial' | 'minimal';
export type SensitivityLevel = 'public' | 'internal' | 'confidential' | 'secret';

export interface FocusParameter {
  area: string;
  priority: 'high' | 'medium' | 'low';
  constraints?: string[];
}

export interface Permission {
  action: ActionType;
  resource: string;
  allowed: boolean;
  conditions?: string[];
}

export interface SemanticEncoding {
  id: string;
  version: string;
  timestamp: string;
  
  // Intent
  action_type: ActionType;
  data_source: DataSource;
  scope_boundary: ScopeBoundary;
  
  // Mode & Focus
  operational_mode: OperationalMode;
  focus_parameters: FocusParameter[];
  
  // Constraints
  permissions: Permission[];
  rewrite_constraints: boolean;
  
  // Audit
  traceability: TraceabilityLevel;
  sensitivity: SensitivityLevel;
  
  // Cost
  estimated_tokens: number;
  budget_limit?: number;
  
  // Quality Score (0-100)
  encoding_quality_score: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 3: ENCODING VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'critical' | 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 4: TOKEN & COST ESTIMATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface TokenEstimation {
  input_tokens: number;
  output_tokens_estimated: number;
  total_tokens: number;
  
  cost_breakdown: {
    input_cost: number;
    output_cost: number;
    total_cost: number;
    currency: 'CHE_TOKEN' | 'USD';
  };
  
  model_recommendation: string;
  confidence: number; // 0-1
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 5: SCOPE LOCKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface ScopeLock {
  locked_at: string;
  scope_hash: string;
  
  boundaries: {
    spheres: string[];
    dataspaces: string[];
    time_range?: { start: string; end: string };
    data_types: string[];
  };
  
  restrictions: {
    max_results?: number;
    max_depth?: number;
    excluded_patterns?: string[];
  };
  
  expansion_allowed: boolean;
  requires_approval_for_expansion: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 6: BUDGET VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface BudgetVerification {
  user_balance: number;
  required_amount: number;
  has_sufficient_budget: boolean;
  
  allocation: {
    from_personal: number;
    from_sphere?: number;
    from_organization?: number;
  };
  
  warnings?: string[];
  block_reason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 7: AGENT COMPATIBILITY (ACM)
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentCompatibilityResult {
  is_compatible: boolean;
  
  selected_agent: {
    id: string;
    name: string;
    level: 'L0' | 'L1' | 'L2' | 'L3';
    sphere?: string;
  };
  
  compatibility_score: number; // 0-100
  
  matrix_check: {
    action_compatible: boolean;
    scope_compatible: boolean;
    permission_compatible: boolean;
    budget_compatible: boolean;
  };
  
  alternatives?: Array<{
    agent_id: string;
    score: number;
    reason: string;
  }>;
  
  block_reason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 8: CONTROLLED EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

export type ExecutionStatus = 
  | 'QUEUED'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'TIMEOUT';

export interface ControlledExecution {
  execution_id: string;
  started_at: string;
  ended_at?: string;
  status: ExecutionStatus;
  
  monitoring: {
    tokens_used: number;
    time_elapsed_ms: number;
    checkpoints_passed: number;
    warnings: string[];
  };
  
  can_pause: boolean;
  can_cancel: boolean;
  requires_human_approval: boolean;
  
  checkpoint_history: ExecutionCheckpoint[];
}

export interface ExecutionCheckpoint {
  id: string;
  timestamp: string;
  stage: string;
  status: 'passed' | 'failed' | 'pending_approval';
  details?: string;
  approved_by?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 9: RESULT CAPTURE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ResultCapture {
  result_id: string;
  timestamp: string;
  
  output: {
    type: 'text' | 'structured' | 'file' | 'mixed';
    content: unknown;
    format?: string;
  };
  
  metadata: {
    tokens_actual: number;
    cost_actual: number;
    duration_ms: number;
    model_used: string;
  };
  
  quality: {
    confidence: number;
    completeness: number;
    accuracy_estimate: number;
  };
  
  artifacts_created?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGE 10: THREAD UPDATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ThreadUpdate {
  thread_id: string;
  version: number;
  updated_at: string;
  
  changes: {
    type: 'append' | 'modify_metadata' | 'add_result';
    content: unknown;
  };
  
  audit_entry: AuditEntry;
  
  hash_chain: {
    previous_hash: string;
    current_hash: string;
    algorithm: 'sha256';
  };
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: {
    type: 'user' | 'agent' | 'system';
    id: string;
  };
  details: Record<string, any>;
  integrity_hash: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIPELINE STATE (État complet du pipeline)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PipelineState {
  pipeline_id: string;
  created_at: string;
  updated_at: string;
  
  current_stage: PipelineStage;
  overall_status: 'active' | 'completed' | 'failed' | 'cancelled';
  
  stages: Record<PipelineStage, {
    status: StageStatus;
    started_at?: string;
    completed_at?: string;
    result?: unknown;
    error?: string;
  }>;
  
  // Data accumulated through pipeline
  intent?: IntentCapture;
  encoding?: SemanticEncoding;
  validation?: ValidationResult;
  token_estimation?: TokenEstimation;
  scope_lock?: ScopeLock;
  budget_verification?: BudgetVerification;
  agent_compatibility?: AgentCompatibilityResult;
  execution?: ControlledExecution;
  result?: ResultCapture;
  thread_update?: ThreadUpdate;
  
  // Metadata
  total_duration_ms?: number;
  total_cost?: number;
  requires_human_approval: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIPELINE EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

export type PipelineEventType = 
  | 'STAGE_STARTED'
  | 'STAGE_COMPLETED'
  | 'STAGE_FAILED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVAL_RECEIVED'
  | 'PIPELINE_COMPLETED'
  | 'PIPELINE_FAILED'
  | 'CHECKPOINT_REACHED';

export interface PipelineEvent {
  id: string;
  timestamp: string;
  type: PipelineEventType;
  pipeline_id: string;
  stage?: PipelineStage;
  data?: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PIPELINE_STAGES_ORDER: PipelineStage[] = [
  'INTENT_CAPTURE',
  'SEMANTIC_ENCODING',
  'ENCODING_VALIDATION',
  'TOKEN_COST_ESTIMATION',
  'SCOPE_LOCKING',
  'BUDGET_VERIFICATION',
  'AGENT_COMPATIBILITY',
  'CONTROLLED_EXECUTION',
  'RESULT_CAPTURE',
  'THREAD_UPDATE',
];

export const STAGE_DESCRIPTIONS: Record<PipelineStage, string> = {
  INTENT_CAPTURE: 'Capture de l\'input humain brut',
  SEMANTIC_ENCODING: 'Transformation en schéma structuré',
  ENCODING_VALIDATION: 'Vérification syntaxe et cohérence',
  TOKEN_COST_ESTIMATION: 'Calcul du coût computationnel',
  SCOPE_LOCKING: 'Verrouillage du périmètre d\'exécution',
  BUDGET_VERIFICATION: 'Vérification budget utilisateur',
  AGENT_COMPATIBILITY: 'Validation via Agent Compatibility Matrix',
  CONTROLLED_EXECUTION: 'Exécution supervisée avec monitoring',
  RESULT_CAPTURE: 'Capture du résultat et métadonnées',
  THREAD_UPDATE: 'Mise à jour du thread avec audit trail',
};

export const STAGE_CAN_BLOCK: Record<PipelineStage, boolean> = {
  INTENT_CAPTURE: false,
  SEMANTIC_ENCODING: false,
  ENCODING_VALIDATION: true,  // ❌ FAIL → Retour à l'étape 1
  TOKEN_COST_ESTIMATION: false,
  SCOPE_LOCKING: true,        // ❌ FAIL → Demande de réduction scope
  BUDGET_VERIFICATION: true,  // ❌ FAIL → Notification budget insuffisant
  AGENT_COMPATIBILITY: true,  // ❌ FAIL → Suggestion d'agent alternatif
  CONTROLLED_EXECUTION: true,
  RESULT_CAPTURE: false,
  THREAD_UPDATE: false,
};
