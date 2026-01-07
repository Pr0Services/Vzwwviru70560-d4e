/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — USE GOVERNANCE HOOK                         ║
 * ║                    Complete Governance Integration Hook                       ║
 * ║                    Task A+10: Alpha+ Roadmap                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * HOOK FEATURES:
 * - Checkpoint management
 * - Audit trail logging
 * - Rule enforcement
 * - Violation tracking
 * - Governance metrics
 */

import { useCallback, useMemo } from 'react'
import {
  useGovernanceStore,
  type Checkpoint,
  type CheckpointStatus,
  type CheckpointPriority,
  type ActionType,
  type AuditAction,
  type AuditSeverity,
  type GovernanceRule,
  type RuleViolation,
} from '../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernanceMetrics {
  pending_checkpoints: number
  critical_checkpoints: number
  approval_rate: number
  average_response_time: number // in minutes
  violations_today: number
  violations_week: number
  active_rules: number
}

export interface CreateCheckpointOptions {
  title: string
  description: string
  action_type: ActionType
  priority?: CheckpointPriority
  identity_id: string
  sphere_id?: string
  agent_id?: string
  thread_id?: string
  payload?: Record<string, unknown>
  tokens_required?: number
  estimated_impact?: string
  expires_in_minutes?: number
  auto_approve_if_low_risk?: boolean
}

export interface LogAuditOptions {
  action: AuditAction
  severity?: AuditSeverity
  identity_id: string
  actor_type?: 'user' | 'agent' | 'system' | 'nova'
  sphere_id?: string
  agent_id?: string
  thread_id?: string
  checkpoint_id?: string
  tokens_consumed?: number
  details?: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useGovernance(identityId?: string) {
  // Store selectors
  const checkpoints = useGovernanceStore(state => state.checkpoints)
  const auditTrail = useGovernanceStore(state => state.audit_trail)
  const rules = useGovernanceStore(state => state.rules)
  const violations = useGovernanceStore(state => state.violations)
  
  // Store actions
  const createCheckpointAction = useGovernanceStore(state => state.createCheckpoint)
  const approveCheckpointAction = useGovernanceStore(state => state.approveCheckpoint)
  const rejectCheckpointAction = useGovernanceStore(state => state.rejectCheckpoint)
  const logAuditAction = useGovernanceStore(state => state.logAudit)
  const addRuleAction = useGovernanceStore(state => state.addRule)
  const updateRuleAction = useGovernanceStore(state => state.updateRule)
  const removeRuleAction = useGovernanceStore(state => state.removeRule)
  const checkRulesAction = useGovernanceStore(state => state.checkRules)
  const reportViolationAction = useGovernanceStore(state => state.reportViolation)
  const resolveViolationAction = useGovernanceStore(state => state.resolveViolation)
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Filtered Data
  // ─────────────────────────────────────────────────────────────────────────────
  
  const myCheckpoints = useMemo(() => {
    if (!identityId) return Object.values(checkpoints)
    return Object.values(checkpoints).filter(c => c.identity_id === identityId)
  }, [checkpoints, identityId])
  
  const pendingCheckpoints = useMemo(() => {
    return myCheckpoints.filter(c => c.status === 'pending')
  }, [myCheckpoints])
  
  const criticalCheckpoints = useMemo(() => {
    return pendingCheckpoints.filter(c => c.priority === 'critical')
  }, [pendingCheckpoints])
  
  const myAuditTrail = useMemo(() => {
    if (!identityId) return auditTrail
    return auditTrail.filter(e => e.identity_id === identityId)
  }, [auditTrail, identityId])
  
  const myViolations = useMemo(() => {
    if (!identityId) return violations
    return violations.filter(v => v.identity_id === identityId)
  }, [violations, identityId])
  
  const activeRules = useMemo(() => {
    return rules.filter(r => r.is_active)
  }, [rules])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Metrics
  // ─────────────────────────────────────────────────────────────────────────────
  
  const metrics: GovernanceMetrics = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    // Approval rate
    const resolved = myCheckpoints.filter(c => 
      c.status === 'approved' || c.status === 'rejected' || c.status === 'auto_approved'
    )
    const approved = resolved.filter(c => 
      c.status === 'approved' || c.status === 'auto_approved'
    )
    const approvalRate = resolved.length > 0 
      ? Math.round((approved.length / resolved.length) * 100) 
      : 100
    
    // Average response time
    const responseTimesMs = resolved
      .filter(c => c.resolved_at)
      .map(c => new Date(c.resolved_at!).getTime() - new Date(c.created_at).getTime())
    const avgResponseTime = responseTimesMs.length > 0
      ? Math.round((responseTimesMs.reduce((a, b) => a + b, 0) / responseTimesMs.length) / 60000)
      : 0
    
    // Violations
    const violationsToday = myViolations.filter(v => 
      new Date(v.occurred_at) >= todayStart
    ).length
    const violationsWeek = myViolations.filter(v => 
      new Date(v.occurred_at) >= weekAgo
    ).length
    
    return {
      pending_checkpoints: pendingCheckpoints.length,
      critical_checkpoints: criticalCheckpoints.length,
      approval_rate: approvalRate,
      average_response_time: avgResponseTime,
      violations_today: violationsToday,
      violations_week: violationsWeek,
      active_rules: activeRules.length,
    }
  }, [myCheckpoints, pendingCheckpoints, criticalCheckpoints, myViolations, activeRules])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Checkpoint Actions
  // ─────────────────────────────────────────────────────────────────────────────
  
  const createCheckpoint = useCallback((options: CreateCheckpointOptions): Checkpoint => {
    const expiresAt = options.expires_in_minutes
      ? new Date(Date.now() + options.expires_in_minutes * 60000).toISOString()
      : undefined
    
    return createCheckpointAction({
      title: options.title,
      description: options.description,
      action_type: options.action_type,
      priority: options.priority || 'medium',
      identity_id: options.identity_id,
      sphere_id: options.sphere_id,
      agent_id: options.agent_id,
      thread_id: options.thread_id,
      payload: options.payload || {},
      tokens_required: options.tokens_required || 0,
      estimated_impact: options.estimated_impact,
      expires_at: expiresAt,
    })
  }, [createCheckpointAction])
  
  const approveCheckpoint = useCallback((
    checkpointId: string, 
    resolvedBy: string = identityId || 'unknown'
  ): void => {
    approveCheckpointAction(checkpointId, resolvedBy)
  }, [approveCheckpointAction, identityId])
  
  const rejectCheckpoint = useCallback((
    checkpointId: string, 
    reason: string,
    resolvedBy: string = identityId || 'unknown'
  ): void => {
    rejectCheckpointAction(checkpointId, resolvedBy, reason)
  }, [rejectCheckpointAction, identityId])
  
  const getCheckpoint = useCallback((id: string): Checkpoint | undefined => {
    return checkpoints[id]
  }, [checkpoints])
  
  const getCheckpointsByStatus = useCallback((status: CheckpointStatus): Checkpoint[] => {
    return myCheckpoints.filter(c => c.status === status)
  }, [myCheckpoints])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Audit Actions
  // ─────────────────────────────────────────────────────────────────────────────
  
  const logAudit = useCallback((options: LogAuditOptions): void => {
    logAuditAction({
      action: options.action,
      severity: options.severity || 'info',
      identity_id: options.identity_id,
      actor_id: options.identity_id,
      actor_type: options.actor_type || 'user',
      sphere_id: options.sphere_id,
      agent_id: options.agent_id,
      thread_id: options.thread_id,
      checkpoint_id: options.checkpoint_id,
      tokens_consumed: options.tokens_consumed,
      details: options.details || {},
    })
  }, [logAuditAction])
  
  const getRecentActivity = useCallback((limit: number = 10) => {
    return myAuditTrail.slice(0, limit)
  }, [myAuditTrail])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Rule Actions
  // ─────────────────────────────────────────────────────────────────────────────
  
  const addRule = useCallback((rule: Omit<GovernanceRule, 'id' | 'created_at' | 'updated_at'>): GovernanceRule => {
    return addRuleAction(rule)
  }, [addRuleAction])
  
  const updateRule = useCallback((ruleId: string, data: Partial<GovernanceRule>): void => {
    updateRuleAction(ruleId, data)
  }, [updateRuleAction])
  
  const removeRule = useCallback((ruleId: string): void => {
    removeRuleAction(ruleId)
  }, [removeRuleAction])
  
  const checkRules = useCallback((
    actionType: ActionType, 
    context: Record<string, unknown> = {}
  ): { allowed: boolean; violations: RuleViolation[] } => {
    return checkRulesAction(actionType, context)
  }, [checkRulesAction])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Violation Actions
  // ─────────────────────────────────────────────────────────────────────────────
  
  const reportViolation = useCallback((
    ruleId: string,
    identity_id: string,
    details: Record<string, unknown> = {}
  ): RuleViolation => {
    return reportViolationAction(ruleId, identity_id, details)
  }, [reportViolationAction])
  
  const resolveViolation = useCallback((violationId: string, resolvedBy: string): void => {
    resolveViolationAction(violationId, resolvedBy)
  }, [resolveViolationAction])
  
  const getUnresolvedViolations = useCallback((): RuleViolation[] => {
    return myViolations.filter(v => !v.resolved)
  }, [myViolations])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Convenience Methods
  // ─────────────────────────────────────────────────────────────────────────────
  
  const requiresCheckpoint = useCallback((actionType: ActionType): boolean => {
    // Check if any active rule requires checkpoint for this action
    return activeRules.some(r => 
      r.is_active && 
      (r.action_types.includes(actionType) || r.action_types.length === 0) &&
      r.requires_checkpoint
    )
  }, [activeRules])
  
  const canProceed = useCallback((
    actionType: ActionType, 
    context: Record<string, unknown> = {}
  ): { allowed: boolean; reason?: string; checkpoint?: Checkpoint } => {
    // Check rules
    const ruleCheck = checkRules(actionType, context)
    if (!ruleCheck.allowed) {
      return {
        allowed: false,
        reason: 'Action blocked by governance rules',
      }
    }
    
    // Check if checkpoint required
    if (requiresCheckpoint(actionType)) {
      return {
        allowed: false,
        reason: 'This action requires a governance checkpoint',
      }
    }
    
    return { allowed: true }
  }, [checkRules, requiresCheckpoint])
  
  const hasUrgentPending = useMemo((): boolean => {
    return criticalCheckpoints.length > 0
  }, [criticalCheckpoints])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────────
  
  return {
    // Data
    checkpoints: myCheckpoints,
    pendingCheckpoints,
    criticalCheckpoints,
    auditTrail: myAuditTrail,
    rules: activeRules,
    violations: myViolations,
    metrics,
    
    // Checkpoint actions
    createCheckpoint,
    approveCheckpoint,
    rejectCheckpoint,
    getCheckpoint,
    getCheckpointsByStatus,
    
    // Audit actions
    logAudit,
    getRecentActivity,
    
    // Rule actions
    addRule,
    updateRule,
    removeRule,
    checkRules,
    
    // Violation actions
    reportViolation,
    resolveViolation,
    getUnresolvedViolations,
    
    // Convenience
    requiresCheckpoint,
    canProceed,
    hasUrgentPending,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for checkpoint-specific operations
 */
export function useCheckpoint(checkpointId: string) {
  const checkpoint = useGovernanceStore(state => state.checkpoints[checkpointId])
  const approve = useGovernanceStore(state => state.approveCheckpoint)
  const reject = useGovernanceStore(state => state.rejectCheckpoint)
  
  const isPending = checkpoint?.status === 'pending'
  const isExpired = checkpoint?.expires_at 
    ? new Date(checkpoint.expires_at) < new Date() 
    : false
  
  return {
    checkpoint,
    isPending,
    isExpired,
    approve: (resolvedBy: string) => approve(checkpointId, resolvedBy),
    reject: (resolvedBy: string, reason: string) => reject(checkpointId, resolvedBy, reason),
  }
}

/**
 * Hook for governance metrics
 */
export function useGovernanceMetrics(identityId?: string) {
  const governance = useGovernance(identityId)
  return governance.metrics
}

/**
 * Hook for pending checkpoints badge
 */
export function usePendingCheckpoints(identityId?: string) {
  const governance = useGovernance(identityId)
  
  return {
    count: governance.pendingCheckpoints.length,
    criticalCount: governance.criticalCheckpoints.length,
    hasUrgent: governance.hasUrgentPending,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  GovernanceMetrics,
  CreateCheckpointOptions,
  LogAuditOptions,
}

export default useGovernance
