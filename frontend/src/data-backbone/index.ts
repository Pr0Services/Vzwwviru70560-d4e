// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — DATA BACKBONE INDEX
// Unified exports for data backbone & memory unification
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// CORE TYPES & FUNCTIONS
// =============================================================================

export {
  // Access control
  canAccessMemory,
  isPurposeAllowed,

  // Query engine
  queryMemoryForAgent,

  // Decision tracing
  createDecisionTrace,

  // Export validation
  validateExportRequest,

  // Retention
  getExpiredEntries,
  DEFAULT_RETENTION_RULES,

  // Law
  DATA_BACKBONE_LAW,

  // Types - Sphere
  type SphereId,
  type VisibilityLevel,
  type EncryptionLevel,
  type RetentionPolicy,
  type SphereDatabaseMeta,
  type SphereRecord,
  type SphereDatabase,

  // Types - Memory
  type MemoryLayer,
  type MemoryEntry,
  type MemoryIndex,
  type MemoryIndexPointer,
  type AccessPurpose,
  type AccessContext,

  // Types - Agent Query
  type AgentQueryIntent,
  type AgentMemoryQuery,
  type AgentMemoryResponse,
  type AgentMemorySummary,

  // Types - Decision
  type DecisionTrace,
  type DecisionLedger,

  // Types - Export
  type ExportScope,
  type ExportFormat,
  type ExportRequest,
  type ExportValidation,

  // Types - Retention
  type RetentionRule,
} from "./DataBackboneCore";

// =============================================================================
// SPHERE DATABASE MANAGER
// =============================================================================

export { SphereDatabaseManager, default as SphereDatabaseManagerClass } from "./SphereDatabaseManager";

// =============================================================================
// MEMORY MANAGER
// =============================================================================

export { MemoryManager, default as MemoryManagerClass } from "./MemoryManager";

// =============================================================================
// CONVENIENCE FACTORIES
// =============================================================================

import { SphereDatabaseManager } from "./SphereDatabaseManager";
import { MemoryManager } from "./MemoryManager";

/**
 * Create a new sphere database manager
 */
export function createSphereDatabaseManager<T = unknown>(): SphereDatabaseManager<T> {
  return new SphereDatabaseManager<T>();
}

/**
 * Create a new memory manager
 */
export function createMemoryManager(): MemoryManager {
  return new MemoryManager();
}

/**
 * Create a complete data backbone (both managers)
 */
export function createDataBackbone<T = unknown>(): {
  sphereDb: SphereDatabaseManager<T>;
  memory: MemoryManager;
} {
  return {
    sphereDb: new SphereDatabaseManager<T>(),
    memory: new MemoryManager(),
  };
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  createSphereDatabaseManager,
  createMemoryManager,
  createDataBackbone,
};
