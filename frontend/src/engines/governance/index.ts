/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — GOVERNANCE PIPELINE INDEX                             ║
 * ║              10 Étapes du Governed Execution Pipeline                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "No AI execution occurs until human intent has been clarified, encoded,    ║
 * ║   governed, validated, cost-estimated, scope-restricted, and matched        ║
 * ║   with compatible AI agents."                                               ║
 * ║                                                                              ║
 * ║  RÈGLE FONDAMENTALE: "Failure at any stage prevents execution."             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Pipeline Stages
  PipelineStage,
  StageStatus,
  
  // Stage 1: Intent Capture
  IntentSource,
  IntentCapture,
  
  // Stage 2: Semantic Encoding
  ActionType,
  DataSource,
  ScopeBoundary,
  OperationalMode,
  TraceabilityLevel,
  SensitivityLevel,
  FocusParameter,
  Permission,
  SemanticEncoding,
  
  // Stage 3: Encoding Validation
  ValidationResult,
  ValidationError,
  ValidationWarning,
  
  // Stage 4: Token & Cost Estimation
  TokenEstimation,
  
  // Stage 5: Scope Locking
  ScopeLock,
  
  // Stage 6: Budget Verification
  BudgetVerification,
  
  // Stage 7: Agent Compatibility
  AgentCompatibilityResult,
  
  // Stage 8: Controlled Execution
  ExecutionStatus,
  ControlledExecution,
  ExecutionCheckpoint,
  
  // Stage 9: Result Capture
  ResultCapture,
  
  // Stage 10: Thread Update
  ThreadUpdate,
  AuditEntry,
  
  // Pipeline State
  PipelineState,
  PipelineEvent,
  PipelineEventType,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  PIPELINE_STAGES_ORDER,
  STAGE_DESCRIPTIONS,
  STAGE_CAN_BLOCK,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { GovernedExecutionPipeline } from './GovernedExecutionPipeline';

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

import { GovernedExecutionPipeline } from './GovernedExecutionPipeline';

export default GovernedExecutionPipeline;
