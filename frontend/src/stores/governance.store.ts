/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — GOVERNANCE STORE                            ║
 * ║                    Complete Checkpoint & Audit System                         ║
 * ║                    Task A+1: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * GOVERNANCE PRINCIPLES:
 * - GOUVERNANCE > EXÉCUTION (Governance before Execution)
 * - All actions require checkpoints based on sensitivity
 * - Complete audit trail for compliance
 * - Identity-scoped permissions
 * - Token budget enforcement
 *
 * 10 GOVERNANCE LAWS:
 * L1: Consent Primacy - Nothing without user approval
 * L2: Temporal Sovereignty - User controls timing
 * L3: Contextual Fidelity - Actions respect context
 * L4: Hierarchical Respect - Agent hierarchy maintained
 * L5: Audit Completeness - Everything logged
 * L6: Encoding Transparency - Visible and explainable
 * L7: Agent Non-Autonomy - Agents never act alone
 * L8: Budget Accountability - Token costs transparent
 * L9: Cross-Sphere Isolation - Spheres isolated
 * L10: Deletion Completeness - Deletions verifiable
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Checkpoint sensitivity levels
 */
export type CheckpointSensitivity = 'low' | 'medium' | 'high' | 'critical'

/**
 * Checkpoint status
 */
export type CheckpointStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'auto_approved'
  | 'escalated'

/**
 * Checkpoint type
 */
export type CheckpointType =
  | 'execution'      // Before action execution
  | 'budget'         // Budget threshold crossed
  | 'scope_change'   // Context/scope modification
  | 'agent_action'   // Agent-initiated action
  | 'data_access'    // Sensitive data access
  | 'external_call'  // External API/service
  | 'delete'         // Destructive action
  | 'cross_sphere'   // Cross-sphere operation

/**
 * Audit action types
 */
export type AuditActionType =
  | 'checkpoint_created'
  | 'checkpoint_approved'
  | 'checkpoint_rejected'
  | 'checkpoint_expired'
  | 'checkpoint_escalated'
  | 'execution_started'
  | 'execution_completed'
  | 'execution_failed'
  | 'tokens_consumed'
  | 'tokens_reserved'
  | 'tokens_released'
  | 'violation_detected'
  | 'violation_resolved'
  | 'scope_locked'
  | 'scope_unlocked'
  | 'settings_changed'

/**
 * Scope levels for context locking
 */
export type ScopeLevel = 
  | 'selection'
  | 'document'
  | 'thread'
  | 'project'
  | 'sphere'
  | 'global'

/**
 * Governance law codes
 */
export type GovernanceLawCode = 
  | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' 
  | 'L6' | 'L7' | 'L8' | 'L9' | 'L10'

/**
 * Checkpoint definition
 */
export interface Checkpoint {
  id: string
  type: CheckpointType
  status: CheckpointStatus
  sensitivity: CheckpointSensitivity
  
  // Context
  identity_id: string
  sphere_id: string
  thread_id?: string
  agent_id?: string
  encoding_id?: string
  
  // Details
  title: string
  description: string
  actions_summary: string[]
  
  // Tokens
  estimated_tokens: number
  reserved_tokens: number
  
  // Timing
  created_at: string
  expires_at: string
  decided_at?: string
  
  // Decision
  decided_by?: string
  decision_reason?: string
  modifications?: Record<string, unknown>
  
  // Escalation
  escalation_level: number
  escalated_to?: string
  
  // Metadata
  metadata: Record<string, unknown>
}

/**
 * Audit log entry
 */
export interface AuditEntry {
  id: string
  action: AuditActionType
  
  // Context
  identity_id: string
  sphere_id?: string
  thread_id?: string
  agent_id?: string
  checkpoint_id?: string
  
  // Details
  description: string
  details: Record<string, unknown>
  
  // Token tracking
  tokens_before?: number
  tokens_after?: number
  tokens_delta?: number
  
  // Compliance
  laws_checked: GovernanceLawCode[]
  laws_violated: GovernanceLawCode[]
  
  // Timing
  timestamp: string
  duration_ms?: number
  
  // Source
  source: 'user' | 'agent' | 'system' | 'nova'
  ip_address?: string
  user_agent?: string
}

/**
 * Governance violation
 */
export interface GovernanceViolation {
  id: string
  law_code: GovernanceLawCode
  severity: 'warning' | 'error' | 'critical'
  
  // Context
  identity_id: string
  sphere_id?: string
  checkpoint_id?: string
  
  // Details
  description: string
  expected: string
  actual: string
  
  // Status
  resolved: boolean
  resolved_at?: string
  resolved_by?: string
  resolution_notes?: string
  
  // Timing
  detected_at: string
}

/**
 * Scope lock state
 */
export interface ScopeLock {
  active: boolean
  level: ScopeLevel
  target_id: string | null
  target_name: string | null
  locked_at: string | null
  locked_by: string | null
  identity_id: string | null
  expires_at: string | null
}

/**
 * Governance settings
 */
export interface GovernanceSettings {
  enabled: boolean
  strict_mode: boolean
  auto_approve_low: boolean
  checkpoint_expiry_minutes: number
  max_pending_checkpoints: number
  require_scope_lock: boolean
  audit_retention_days: number
}

/**
 * Governance statistics
 */
export interface GovernanceStats {
  total_checkpoints: number
  approved_checkpoints: number
  rejected_checkpoints: number
  expired_checkpoints: number
  pending_checkpoints: number
  total_violations: number
  unresolved_violations: number
  tokens_consumed_today: number
  average_approval_time_ms: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10 GOVERNANCE LAWS
// ═══════════════════════════════════════════════════════════════════════════════

export const GOVERNANCE_LAWS: Record<GovernanceLawCode, {
  code: GovernanceLawCode
  name: string
  name_fr: string
  description: string
  enforcement: 'strict' | 'standard' | 'advisory'
}> = {
  L1: {
    code: 'L1',
    name: 'Consent Primacy',
    name_fr: 'Primauté du Consentement',
    description: 'Nothing happens without explicit user approval',
    enforcement: 'strict',
  },
  L2: {
    code: 'L2',
    name: 'Temporal Sovereignty',
    name_fr: 'Souveraineté Temporelle',
    description: 'User controls when and how actions happen',
    enforcement: 'strict',
  },
  L3: {
    code: 'L3',
    name: 'Contextual Fidelity',
    name_fr: 'Fidélité Contextuelle',
    description: 'Actions must respect current context and scope',
    enforcement: 'strict',
  },
  L4: {
    code: 'L4',
    name: 'Hierarchical Respect',
    name_fr: 'Respect Hiérarchique',
    description: 'Agent hierarchy and permissions are maintained',
    enforcement: 'standard',
  },
  L5: {
    code: 'L5',
    name: 'Audit Completeness',
    name_fr: 'Exhaustivité de l\'Audit',
    description: 'Every action is logged and traceable',
    enforcement: 'strict',
  },
  L6: {
    code: 'L6',
    name: 'Encoding Transparency',
    name_fr: 'Transparence de l\'Encodage',
    description: 'Semantic encoding is visible and explainable',
    enforcement: 'standard',
  },
  L7: {
    code: 'L7',
    name: 'Agent Non-Autonomy',
    name_fr: 'Non-Autonomie des Agents',
    description: 'Agents never act without explicit approval',
    enforcement: 'strict',
  },
  L8: {
    code: 'L8',
    name: 'Budget Accountability',
    name_fr: 'Responsabilité Budgétaire',
    description: 'Token costs are transparent and tracked',
    enforcement: 'strict',
  },
  L9: {
    code: 'L9',
    name: 'Cross-Sphere Isolation',
    name_fr: 'Isolation Inter-Sphères',
    description: 'Spheres are isolated by default',
    enforcement: 'strict',
  },
  L10: {
    code: 'L10',
    name: 'Deletion Completeness',
    name_fr: 'Exhaustivité de la Suppression',
    description: 'Deletions are complete and verifiable',
    enforcement: 'strict',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// SENSITIVITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const SENSITIVITY_CONFIG: Record<CheckpointSensitivity, {
  requires_approval: boolean
  max_auto_tokens: number
  expiry_minutes: number
  escalation_after_minutes: number
}> = {
  low: {
    requires_approval: false,
    max_auto_tokens: 500,
    expiry_minutes: 60,
    escalation_after_minutes: 30,
  },
  medium: {
    requires_approval: true,
    max_auto_tokens: 0,
    expiry_minutes: 30,
    escalation_after_minutes: 15,
  },
  high: {
    requires_approval: true,
    max_auto_tokens: 0,
    expiry_minutes: 15,
    escalation_after_minutes: 10,
  },
  critical: {
    requires_approval: true,
    max_auto_tokens: 0,
    expiry_minutes: 10,
    escalation_after_minutes: 5,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface GovernanceState {
  // Checkpoints
  checkpoints: Checkpoint[]
  active_checkpoint_id: string | null
  
  // Audit
  audit_log: AuditEntry[]
  
  // Violations
  violations: GovernanceViolation[]
  
  // Scope Lock
  scope_lock: ScopeLock
  
  // Settings
  settings: GovernanceSettings
  
  // Statistics (computed)
  stats: GovernanceStats
  
  // Loading states
  is_loading: boolean
  error: string | null
}

interface GovernanceActions {
  // Checkpoint Actions
  createCheckpoint: (params: CreateCheckpointParams) => Checkpoint
  approveCheckpoint: (checkpointId: string, decidedBy: string, reason?: string) => boolean
  rejectCheckpoint: (checkpointId: string, decidedBy: string, reason: string) => boolean
  escalateCheckpoint: (checkpointId: string, escalateTo: string) => boolean
  expireCheckpoints: () => number
  getCheckpoint: (checkpointId: string) => Checkpoint | undefined
  getPendingCheckpoints: (identityId?: string) => Checkpoint[]
  
  // Audit Actions
  logAudit: (params: LogAuditParams) => AuditEntry
  getAuditLog: (filters?: AuditFilters) => AuditEntry[]
  clearOldAudit: (beforeDate: string) => number
  exportAuditLog: (filters?: AuditFilters) => string
  
  // Violation Actions
  reportViolation: (params: ReportViolationParams) => GovernanceViolation
  resolveViolation: (violationId: string, resolvedBy: string, notes?: string) => boolean
  getUnresolvedViolations: (identityId?: string) => GovernanceViolation[]
  
  // Scope Lock Actions
  lockScope: (level: ScopeLevel, targetId: string, targetName: string, identityId: string, expiresInMinutes?: number) => void
  unlockScope: () => void
  isScopeLocked: () => boolean
  getScopeLock: () => ScopeLock
  
  // Validation
  validateExecution: (params: ValidateExecutionParams) => ValidationResult
  checkLawCompliance: (action: string, context: Record<string, unknown>) => LawComplianceResult
  
  // Settings
  updateSettings: (settings: Partial<GovernanceSettings>) => void
  resetSettings: () => void
  
  // Statistics
  computeStats: () => GovernanceStats
  
  // Reset
  reset: () => void
  resetCheckpoints: () => void
  resetAudit: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CreateCheckpointParams {
  type: CheckpointType
  sensitivity: CheckpointSensitivity
  identity_id: string
  sphere_id: string
  thread_id?: string
  agent_id?: string
  encoding_id?: string
  title: string
  description: string
  actions_summary: string[]
  estimated_tokens: number
  metadata?: Record<string, unknown>
}

interface LogAuditParams {
  action: AuditActionType
  identity_id: string
  sphere_id?: string
  thread_id?: string
  agent_id?: string
  checkpoint_id?: string
  description: string
  details?: Record<string, unknown>
  tokens_before?: number
  tokens_after?: number
  laws_checked?: GovernanceLawCode[]
  laws_violated?: GovernanceLawCode[]
  source?: 'user' | 'agent' | 'system' | 'nova'
  duration_ms?: number
}

interface ReportViolationParams {
  law_code: GovernanceLawCode
  severity: 'warning' | 'error' | 'critical'
  identity_id: string
  sphere_id?: string
  checkpoint_id?: string
  description: string
  expected: string
  actual: string
}

interface ValidateExecutionParams {
  identity_id: string
  sphere_id: string
  estimated_tokens: number
  sensitivity: CheckpointSensitivity
  agent_id?: string
  require_checkpoint?: boolean
}

interface ValidationResult {
  allowed: boolean
  requires_checkpoint: boolean
  checkpoint_id?: string
  reason?: string
  laws_checked: GovernanceLawCode[]
  warnings: string[]
}

interface LawComplianceResult {
  compliant: boolean
  violations: Array<{
    law: GovernanceLawCode
    reason: string
  }>
}

interface AuditFilters {
  identity_id?: string
  sphere_id?: string
  action?: AuditActionType
  from_date?: string
  to_date?: string
  limit?: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_SCOPE_LOCK: ScopeLock = {
  active: false,
  level: 'document',
  target_id: null,
  target_name: null,
  locked_at: null,
  locked_by: null,
  identity_id: null,
  expires_at: null,
}

const DEFAULT_SETTINGS: GovernanceSettings = {
  enabled: true,
  strict_mode: false,
  auto_approve_low: true,
  checkpoint_expiry_minutes: 30,
  max_pending_checkpoints: 10,
  require_scope_lock: false,
  audit_retention_days: 90,
}

const DEFAULT_STATS: GovernanceStats = {
  total_checkpoints: 0,
  approved_checkpoints: 0,
  rejected_checkpoints: 0,
  expired_checkpoints: 0,
  pending_checkpoints: 0,
  total_violations: 0,
  unresolved_violations: 0,
  tokens_consumed_today: 0,
  average_approval_time_ms: 0,
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`
}

const now = (): string => new Date().toISOString()

const addMinutes = (date: string, minutes: number): string => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d.toISOString()
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useGovernanceStore = create<GovernanceState & GovernanceActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ─────────────────────────────────────────────────────────────────────
        // Initial State
        // ─────────────────────────────────────────────────────────────────────
        checkpoints: [],
        active_checkpoint_id: null,
        audit_log: [],
        violations: [],
        scope_lock: DEFAULT_SCOPE_LOCK,
        settings: DEFAULT_SETTINGS,
        stats: DEFAULT_STATS,
        is_loading: false,
        error: null,

        // ─────────────────────────────────────────────────────────────────────
        // Checkpoint Actions
        // ─────────────────────────────────────────────────────────────────────

        createCheckpoint: (params) => {
          const state = get()
          const config = SENSITIVITY_CONFIG[params.sensitivity]
          const created_at = now()
          
          // Check if auto-approve is possible
          const canAutoApprove = 
            state.settings.auto_approve_low &&
            params.sensitivity === 'low' &&
            params.estimated_tokens <= config.max_auto_tokens
          
          const checkpoint: Checkpoint = {
            id: generateId('chkpt'),
            type: params.type,
            status: canAutoApprove ? 'auto_approved' : 'pending',
            sensitivity: params.sensitivity,
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            thread_id: params.thread_id,
            agent_id: params.agent_id,
            encoding_id: params.encoding_id,
            title: params.title,
            description: params.description,
            actions_summary: params.actions_summary,
            estimated_tokens: params.estimated_tokens,
            reserved_tokens: params.estimated_tokens,
            created_at,
            expires_at: addMinutes(created_at, config.expiry_minutes),
            escalation_level: 0,
            metadata: params.metadata || {},
          }
          
          set((state) => {
            state.checkpoints.push(checkpoint)
            if (!canAutoApprove) {
              state.active_checkpoint_id = checkpoint.id
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'checkpoint_created',
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            checkpoint_id: checkpoint.id,
            description: `Checkpoint created: ${params.title}`,
            details: { 
              type: params.type, 
              sensitivity: params.sensitivity,
              auto_approved: canAutoApprove,
            },
            laws_checked: ['L1', 'L7'],
            source: 'system',
          })
          
          return checkpoint
        },

        approveCheckpoint: (checkpointId, decidedBy, reason) => {
          const checkpoint = get().checkpoints.find(c => c.id === checkpointId)
          if (!checkpoint || checkpoint.status !== 'pending') return false
          
          const decided_at = now()
          
          set((state) => {
            const idx = state.checkpoints.findIndex(c => c.id === checkpointId)
            if (idx !== -1) {
              state.checkpoints[idx].status = 'approved'
              state.checkpoints[idx].decided_at = decided_at
              state.checkpoints[idx].decided_by = decidedBy
              state.checkpoints[idx].decision_reason = reason
            }
            if (state.active_checkpoint_id === checkpointId) {
              state.active_checkpoint_id = null
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'checkpoint_approved',
            identity_id: checkpoint.identity_id,
            sphere_id: checkpoint.sphere_id,
            checkpoint_id: checkpointId,
            description: `Checkpoint approved: ${checkpoint.title}`,
            details: { decided_by: decidedBy, reason },
            laws_checked: ['L1', 'L5'],
            source: 'user',
          })
          
          return true
        },

        rejectCheckpoint: (checkpointId, decidedBy, reason) => {
          const checkpoint = get().checkpoints.find(c => c.id === checkpointId)
          if (!checkpoint || checkpoint.status !== 'pending') return false
          
          set((state) => {
            const idx = state.checkpoints.findIndex(c => c.id === checkpointId)
            if (idx !== -1) {
              state.checkpoints[idx].status = 'rejected'
              state.checkpoints[idx].decided_at = now()
              state.checkpoints[idx].decided_by = decidedBy
              state.checkpoints[idx].decision_reason = reason
            }
            if (state.active_checkpoint_id === checkpointId) {
              state.active_checkpoint_id = null
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'checkpoint_rejected',
            identity_id: checkpoint.identity_id,
            sphere_id: checkpoint.sphere_id,
            checkpoint_id: checkpointId,
            description: `Checkpoint rejected: ${checkpoint.title}`,
            details: { decided_by: decidedBy, reason },
            laws_checked: ['L1', 'L5'],
            source: 'user',
          })
          
          return true
        },

        escalateCheckpoint: (checkpointId, escalateTo) => {
          const checkpoint = get().checkpoints.find(c => c.id === checkpointId)
          if (!checkpoint || checkpoint.status !== 'pending') return false
          
          set((state) => {
            const idx = state.checkpoints.findIndex(c => c.id === checkpointId)
            if (idx !== -1) {
              state.checkpoints[idx].status = 'escalated'
              state.checkpoints[idx].escalation_level += 1
              state.checkpoints[idx].escalated_to = escalateTo
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'checkpoint_escalated',
            identity_id: checkpoint.identity_id,
            sphere_id: checkpoint.sphere_id,
            checkpoint_id: checkpointId,
            description: `Checkpoint escalated: ${checkpoint.title}`,
            details: { escalated_to: escalateTo, level: checkpoint.escalation_level + 1 },
            laws_checked: ['L4'],
            source: 'system',
          })
          
          return true
        },

        expireCheckpoints: () => {
          const currentTime = now()
          let expiredCount = 0
          
          set((state) => {
            state.checkpoints.forEach((checkpoint, idx) => {
              if (checkpoint.status === 'pending' && checkpoint.expires_at < currentTime) {
                state.checkpoints[idx].status = 'expired'
                expiredCount++
              }
            })
            if (state.active_checkpoint_id) {
              const active = state.checkpoints.find(c => c.id === state.active_checkpoint_id)
              if (active?.status === 'expired') {
                state.active_checkpoint_id = null
              }
            }
          })
          
          return expiredCount
        },

        getCheckpoint: (checkpointId) => {
          return get().checkpoints.find(c => c.id === checkpointId)
        },

        getPendingCheckpoints: (identityId) => {
          return get().checkpoints.filter(c => 
            c.status === 'pending' && 
            (!identityId || c.identity_id === identityId)
          )
        },

        // ─────────────────────────────────────────────────────────────────────
        // Audit Actions
        // ─────────────────────────────────────────────────────────────────────

        logAudit: (params) => {
          const entry: AuditEntry = {
            id: generateId('audit'),
            action: params.action,
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            thread_id: params.thread_id,
            agent_id: params.agent_id,
            checkpoint_id: params.checkpoint_id,
            description: params.description,
            details: params.details || {},
            tokens_before: params.tokens_before,
            tokens_after: params.tokens_after,
            tokens_delta: params.tokens_before !== undefined && params.tokens_after !== undefined
              ? params.tokens_after - params.tokens_before
              : undefined,
            laws_checked: params.laws_checked || [],
            laws_violated: params.laws_violated || [],
            timestamp: now(),
            duration_ms: params.duration_ms,
            source: params.source || 'system',
          }
          
          set((state) => {
            state.audit_log.unshift(entry) // Newest first
            // Keep only last 10000 entries in memory
            if (state.audit_log.length > 10000) {
              state.audit_log = state.audit_log.slice(0, 10000)
            }
          })
          
          return entry
        },

        getAuditLog: (filters) => {
          let log = get().audit_log
          
          if (filters?.identity_id) {
            log = log.filter(e => e.identity_id === filters.identity_id)
          }
          if (filters?.sphere_id) {
            log = log.filter(e => e.sphere_id === filters.sphere_id)
          }
          if (filters?.action) {
            log = log.filter(e => e.action === filters.action)
          }
          if (filters?.from_date) {
            log = log.filter(e => e.timestamp >= filters.from_date!)
          }
          if (filters?.to_date) {
            log = log.filter(e => e.timestamp <= filters.to_date!)
          }
          if (filters?.limit) {
            log = log.slice(0, filters.limit)
          }
          
          return log
        },

        clearOldAudit: (beforeDate) => {
          const before = get().audit_log.length
          set((state) => {
            state.audit_log = state.audit_log.filter(e => e.timestamp >= beforeDate)
          })
          return before - get().audit_log.length
        },

        exportAuditLog: (filters) => {
          const log = get().getAuditLog(filters)
          return JSON.stringify(log, null, 2)
        },

        // ─────────────────────────────────────────────────────────────────────
        // Violation Actions
        // ─────────────────────────────────────────────────────────────────────

        reportViolation: (params) => {
          const violation: GovernanceViolation = {
            id: generateId('viol'),
            law_code: params.law_code,
            severity: params.severity,
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            checkpoint_id: params.checkpoint_id,
            description: params.description,
            expected: params.expected,
            actual: params.actual,
            resolved: false,
            detected_at: now(),
          }
          
          set((state) => {
            state.violations.push(violation)
          })
          
          // Log audit
          get().logAudit({
            action: 'violation_detected',
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            checkpoint_id: params.checkpoint_id,
            description: `Violation detected: ${GOVERNANCE_LAWS[params.law_code].name}`,
            details: { 
              law_code: params.law_code,
              severity: params.severity,
              expected: params.expected,
              actual: params.actual,
            },
            laws_checked: [params.law_code],
            laws_violated: [params.law_code],
            source: 'system',
          })
          
          return violation
        },

        resolveViolation: (violationId, resolvedBy, notes) => {
          const violation = get().violations.find(v => v.id === violationId)
          if (!violation || violation.resolved) return false
          
          set((state) => {
            const idx = state.violations.findIndex(v => v.id === violationId)
            if (idx !== -1) {
              state.violations[idx].resolved = true
              state.violations[idx].resolved_at = now()
              state.violations[idx].resolved_by = resolvedBy
              state.violations[idx].resolution_notes = notes
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'violation_resolved',
            identity_id: violation.identity_id,
            sphere_id: violation.sphere_id,
            description: `Violation resolved: ${GOVERNANCE_LAWS[violation.law_code].name}`,
            details: { resolved_by: resolvedBy, notes },
            source: 'user',
          })
          
          return true
        },

        getUnresolvedViolations: (identityId) => {
          return get().violations.filter(v => 
            !v.resolved && 
            (!identityId || v.identity_id === identityId)
          )
        },

        // ─────────────────────────────────────────────────────────────────────
        // Scope Lock Actions
        // ─────────────────────────────────────────────────────────────────────

        lockScope: (level, targetId, targetName, identityId, expiresInMinutes = 60) => {
          const locked_at = now()
          
          set((state) => {
            state.scope_lock = {
              active: true,
              level,
              target_id: targetId,
              target_name: targetName,
              locked_at,
              locked_by: identityId,
              identity_id: identityId,
              expires_at: addMinutes(locked_at, expiresInMinutes),
            }
          })
          
          // Log audit
          get().logAudit({
            action: 'scope_locked',
            identity_id: identityId,
            description: `Scope locked: ${level} - ${targetName}`,
            details: { level, target_id: targetId, target_name: targetName },
            laws_checked: ['L3'],
            source: 'user',
          })
        },

        unlockScope: () => {
          const lock = get().scope_lock
          if (!lock.active) return
          
          set((state) => {
            state.scope_lock = DEFAULT_SCOPE_LOCK
          })
          
          // Log audit
          if (lock.identity_id) {
            get().logAudit({
              action: 'scope_unlocked',
              identity_id: lock.identity_id,
              description: `Scope unlocked: ${lock.level} - ${lock.target_name}`,
              details: { level: lock.level, target_id: lock.target_id },
              source: 'user',
            })
          }
        },

        isScopeLocked: () => {
          const lock = get().scope_lock
          if (!lock.active) return false
          if (lock.expires_at && lock.expires_at < now()) {
            get().unlockScope()
            return false
          }
          return true
        },

        getScopeLock: () => get().scope_lock,

        // ─────────────────────────────────────────────────────────────────────
        // Validation
        // ─────────────────────────────────────────────────────────────────────

        validateExecution: (params) => {
          const state = get()
          const warnings: string[] = []
          const laws_checked: GovernanceLawCode[] = ['L1', 'L7', 'L8']
          
          // Check if governance is disabled
          if (!state.settings.enabled) {
            return {
              allowed: true,
              requires_checkpoint: false,
              laws_checked,
              warnings: ['Governance is disabled'],
            }
          }
          
          // Check pending checkpoints limit
          const pendingCount = state.checkpoints.filter(c => c.status === 'pending').length
          if (pendingCount >= state.settings.max_pending_checkpoints) {
            return {
              allowed: false,
              requires_checkpoint: true,
              reason: `Maximum pending checkpoints (${state.settings.max_pending_checkpoints}) reached`,
              laws_checked,
              warnings,
            }
          }
          
          // Check scope lock requirement
          if (state.settings.require_scope_lock && !state.scope_lock.active) {
            laws_checked.push('L3')
            return {
              allowed: false,
              requires_checkpoint: true,
              reason: 'Scope must be locked before execution',
              laws_checked,
              warnings,
            }
          }
          
          // Determine if checkpoint is required
          const config = SENSITIVITY_CONFIG[params.sensitivity]
          const requiresCheckpoint = config.requires_approval || params.require_checkpoint
          
          // Auto-approve for low sensitivity if enabled
          if (
            !requiresCheckpoint &&
            state.settings.auto_approve_low &&
            params.sensitivity === 'low' &&
            params.estimated_tokens <= config.max_auto_tokens
          ) {
            return {
              allowed: true,
              requires_checkpoint: false,
              laws_checked,
              warnings,
            }
          }
          
          // Checkpoint required
          return {
            allowed: !requiresCheckpoint,
            requires_checkpoint: requiresCheckpoint,
            laws_checked,
            warnings,
          }
        },

        checkLawCompliance: (action, context) => {
          const violations: Array<{ law: GovernanceLawCode; reason: string }> = []
          const state = get()
          
          // L1: Consent Primacy
          if (context.requires_consent && !context.consent_given) {
            violations.push({ law: 'L1', reason: 'User consent not obtained' })
          }
          
          // L7: Agent Non-Autonomy
          if (context.agent_initiated && !context.user_approved) {
            violations.push({ law: 'L7', reason: 'Agent action without user approval' })
          }
          
          // L9: Cross-Sphere Isolation
          if (context.cross_sphere && !context.cross_sphere_permitted) {
            violations.push({ law: 'L9', reason: 'Cross-sphere operation not permitted' })
          }
          
          return {
            compliant: violations.length === 0,
            violations,
          }
        },

        // ─────────────────────────────────────────────────────────────────────
        // Settings
        // ─────────────────────────────────────────────────────────────────────

        updateSettings: (newSettings) => {
          set((state) => {
            state.settings = { ...state.settings, ...newSettings }
          })
          
          get().logAudit({
            action: 'settings_changed',
            identity_id: 'system',
            description: 'Governance settings updated',
            details: newSettings,
            source: 'user',
          })
        },

        resetSettings: () => {
          set((state) => {
            state.settings = DEFAULT_SETTINGS
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Statistics
        // ─────────────────────────────────────────────────────────────────────

        computeStats: () => {
          const state = get()
          const checkpoints = state.checkpoints
          const violations = state.violations
          const today = new Date().toISOString().split('T')[0]
          
          const stats: GovernanceStats = {
            total_checkpoints: checkpoints.length,
            approved_checkpoints: checkpoints.filter(c => c.status === 'approved' || c.status === 'auto_approved').length,
            rejected_checkpoints: checkpoints.filter(c => c.status === 'rejected').length,
            expired_checkpoints: checkpoints.filter(c => c.status === 'expired').length,
            pending_checkpoints: checkpoints.filter(c => c.status === 'pending').length,
            total_violations: violations.length,
            unresolved_violations: violations.filter(v => !v.resolved).length,
            tokens_consumed_today: state.audit_log
              .filter(e => e.timestamp.startsWith(today) && e.tokens_delta && e.tokens_delta > 0)
              .reduce((sum, e) => sum + (e.tokens_delta || 0), 0),
            average_approval_time_ms: (() => {
              const approved = checkpoints.filter(c => c.status === 'approved' && c.decided_at)
              if (approved.length === 0) return 0
              const total = approved.reduce((sum, c) => {
                const created = new Date(c.created_at).getTime()
                const decided = new Date(c.decided_at!).getTime()
                return sum + (decided - created)
              }, 0)
              return Math.round(total / approved.length)
            })(),
          }
          
          set((state) => {
            state.stats = stats
          })
          
          return stats
        },

        // ─────────────────────────────────────────────────────────────────────
        // Reset
        // ─────────────────────────────────────────────────────────────────────

        reset: () => {
          set({
            checkpoints: [],
            active_checkpoint_id: null,
            audit_log: [],
            violations: [],
            scope_lock: DEFAULT_SCOPE_LOCK,
            settings: DEFAULT_SETTINGS,
            stats: DEFAULT_STATS,
            is_loading: false,
            error: null,
          })
        },

        resetCheckpoints: () => {
          set((state) => {
            state.checkpoints = []
            state.active_checkpoint_id = null
          })
        },

        resetAudit: () => {
          set((state) => {
            state.audit_log = []
          })
        },
      })),
      {
        name: 'chenu-governance-v55',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          settings: state.settings,
          scope_lock: state.scope_lock,
          // Don't persist checkpoints and audit (too large)
        }),
      }
    ),
    { name: 'GovernanceStore' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

// Checkpoint selectors
export const selectAllCheckpoints = (state: GovernanceState) => state.checkpoints
export const selectPendingCheckpoints = (state: GovernanceState) => 
  state.checkpoints.filter(c => c.status === 'pending')
export const selectActiveCheckpoint = (state: GovernanceState) => 
  state.checkpoints.find(c => c.id === state.active_checkpoint_id)

// Audit selectors
export const selectAuditLog = (state: GovernanceState) => state.audit_log
export const selectRecentAudit = (limit: number = 50) => (state: GovernanceState) => 
  state.audit_log.slice(0, limit)

// Violation selectors
export const selectAllViolations = (state: GovernanceState) => state.violations
export const selectUnresolvedViolations = (state: GovernanceState) => 
  state.violations.filter(v => !v.resolved)
export const selectCriticalViolations = (state: GovernanceState) => 
  state.violations.filter(v => !v.resolved && v.severity === 'critical')

// Settings selectors
export const selectSettings = (state: GovernanceState) => state.settings
export const selectIsGovernanceEnabled = (state: GovernanceState) => state.settings.enabled
export const selectIsStrictMode = (state: GovernanceState) => state.settings.strict_mode

// Scope selectors
export const selectScopeLock = (state: GovernanceState) => state.scope_lock
export const selectIsScopeLocked = (state: GovernanceState) => state.scope_lock.active

// Stats selectors
export const selectStats = (state: GovernanceState) => state.stats

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export const usePendingCheckpoints = () => 
  useGovernanceStore(selectPendingCheckpoints)

export const useActiveCheckpoint = () => 
  useGovernanceStore(selectActiveCheckpoint)

export const useUnresolvedViolations = () => 
  useGovernanceStore(selectUnresolvedViolations)

export const useGovernanceSettings = () => 
  useGovernanceStore(selectSettings)

export const useScopeLock = () => 
  useGovernanceStore(selectScopeLock)

export const useGovernanceStats = () => {
  const store = useGovernanceStore()
  return store.computeStats()
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  GovernanceState,
  GovernanceActions,
  CreateCheckpointParams,
  LogAuditParams,
  ReportViolationParams,
  ValidateExecutionParams,
  ValidationResult,
  LawComplianceResult,
  AuditFilters,
}

export default useGovernanceStore

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTION COMPLIANCE VALIDATORS (Added from ALPHA)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validates that a checkpoint is Constitution-compliant
 * NO budget/cost/token references allowed in UI
 */
export function validateCheckpointConstitutionCompliant(checkpoint: Record<string, unknown>): void {
  const forbiddenFields = [
    'budget', 'cost', 'token', 'tokens', 'price', 'prix', 
    'coût', 'cout', 'expense', 'spending', 'consumption'
  ];
  
  for (const field of forbiddenFields) {
    if (checkpoint[field] !== undefined) {
      throw new Error(`Constitution violation: checkpoint cannot contain '${field}' field`);
    }
  }
  
  const message = String(checkpoint.message || "")?.toLowerCase() || '';
  const description = String(checkpoint.description || "")?.toLowerCase() || '';
  const content = message + ' ' + description;
  
  const forbiddenTerms = ['$', '€', 'token', 'cost', 'budget', 'prix', 'coût', '%'];
  
  for (const term of forbiddenTerms) {
    if (content.includes(term.toLowerCase())) {
      throw new Error(`Constitution violation: checkpoint message cannot contain '${term}'`);
    }
  }
}

/**
 * Validates that a depth suggestion is Constitution-compliant
 */
export function validateDepthSuggestionConstitutionCompliant(suggestion: unknown): void {
  const forbiddenFields = [
    'budget', 'cost', 'token', 'tokens', 'price', 'estimatedCost'
  ];
  
  for (const field of forbiddenFields) {
    if (suggestion[field] !== undefined) {
      throw new Error(`Constitution violation: depth suggestion cannot contain '${field}' field`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// END CONSTITUTION COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════
