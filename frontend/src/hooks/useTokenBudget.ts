/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — USE TOKEN BUDGET HOOK                       ║
 * ║                    Token Budget Management Integration                        ║
 * ║                    Task A+11: Alpha+ Roadmap                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * HOOK FEATURES:
 * - Budget CRUD operations
 * - Token consumption with validation
 * - Budget analytics
 * - Rule enforcement
 * - Reservation management
 */

import { useCallback, useMemo } from 'react'
import {
  useTokenStore,
  type TokenBudget,
  type TokenTransaction,
  type TokenAnalytics,
  type BudgetPeriod,
  type TransactionResult,
  type RuleCheckResult,
  type SphereId,
} from '../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface TokenUsageStats {
  total_allocated: number
  total_used: number
  total_reserved: number
  total_remaining: number
  usage_percentage: number
  budget_count: number
}

export interface ConsumeOptions {
  amount: number
  description: string
  thread_id?: string
  agent_id?: string
  checkpoint_id?: string
  metadata?: Record<string, unknown>
}

export interface CreateBudgetOptions {
  name: string
  description?: string
  sphere_id: SphereId
  total_allocated: number
  period: BudgetPeriod
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useTokenBudget(identityId: string, sphereId?: SphereId) {
  // Store selectors
  const budgets = useTokenStore(state => state.budgets)
  const transactions = useTokenStore(state => state.transactions)
  const globalBalance = useTokenStore(state => state.getGlobalBalance())
  
  // Store actions
  const createBudgetAction = useTokenStore(state => state.createBudget)
  const deleteBudgetAction = useTokenStore(state => state.deleteBudget)
  const allocateTokensAction = useTokenStore(state => state.allocateTokens)
  const consumeTokensAction = useTokenStore(state => state.consumeTokens)
  const reserveTokensAction = useTokenStore(state => state.reserveTokens)
  const releaseTokensAction = useTokenStore(state => state.releaseTokens)
  const transferTokensAction = useTokenStore(state => state.transferTokens)
  const refundTokensAction = useTokenStore(state => state.refundTokens)
  const checkRulesAction = useTokenStore(state => state.checkRules)
  const getAnalyticsAction = useTokenStore(state => state.getAnalytics)
  const getTransactionHistoryAction = useTokenStore(state => state.getTransactionHistory)
  const requestBudgetIncreaseAction = useTokenStore(state => state.requestBudgetIncrease)
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Filtered Budgets
  // ─────────────────────────────────────────────────────────────────────────────
  
  const myBudgets = useMemo(() => {
    let result = Object.values(budgets).filter(b => b.identity_id === identityId)
    if (sphereId) {
      result = result.filter(b => b.sphere_id === sphereId)
    }
    return result
  }, [budgets, identityId, sphereId])
  
  const activeBudgets = useMemo(() => {
    return myBudgets.filter(b => b.is_active && !b.is_locked)
  }, [myBudgets])
  
  const primaryBudget = useMemo(() => {
    // Get the first active budget for the current sphere (or any sphere if not specified)
    return activeBudgets[0]
  }, [activeBudgets])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Usage Statistics
  // ─────────────────────────────────────────────────────────────────────────────
  
  const usageStats: TokenUsageStats = useMemo(() => {
    const stats = myBudgets.reduce(
      (acc, b) => ({
        total_allocated: acc.total_allocated + b.total_allocated,
        total_used: acc.total_used + b.total_used,
        total_reserved: acc.total_reserved + b.total_reserved,
        total_remaining: acc.total_remaining + b.remaining,
      }),
      { total_allocated: 0, total_used: 0, total_reserved: 0, total_remaining: 0 }
    )
    
    return {
      ...stats,
      usage_percentage: stats.total_allocated > 0
        ? Math.round((stats.total_used / stats.total_allocated) * 100)
        : 0,
      budget_count: myBudgets.length,
    }
  }, [myBudgets])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Budget Operations
  // ─────────────────────────────────────────────────────────────────────────────
  
  const createBudget = useCallback((options: CreateBudgetOptions): TokenBudget => {
    return createBudgetAction({
      name: options.name,
      description: options.description,
      identity_id: identityId,
      sphere_id: options.sphere_id,
      total_allocated: options.total_allocated,
      period: options.period,
      created_by: identityId,
    })
  }, [createBudgetAction, identityId])
  
  const deleteBudget = useCallback((budgetId: string): boolean => {
    return deleteBudgetAction(budgetId)
  }, [deleteBudgetAction])
  
  const getBudget = useCallback((budgetId: string): TokenBudget | undefined => {
    return budgets[budgetId]
  }, [budgets])
  
  const getBudgetForSphere = useCallback((targetSphereId: SphereId): TokenBudget | undefined => {
    return myBudgets.find(b => b.sphere_id === targetSphereId && b.is_active)
  }, [myBudgets])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Token Operations
  // ─────────────────────────────────────────────────────────────────────────────
  
  const consume = useCallback((
    budgetId: string | undefined, 
    options: ConsumeOptions
  ): TransactionResult => {
    const targetBudgetId = budgetId || primaryBudget?.id
    
    if (!targetBudgetId) {
      return {
        success: false,
        transaction: null,
        error: 'No budget available',
        warnings: [],
        blocked_by_rule: null,
      }
    }
    
    return consumeTokensAction({
      budget_id: targetBudgetId,
      amount: options.amount,
      description: options.description,
      created_by: identityId,
      thread_id: options.thread_id,
      agent_id: options.agent_id,
      checkpoint_id: options.checkpoint_id,
      metadata: options.metadata,
    })
  }, [consumeTokensAction, primaryBudget, identityId])
  
  const allocate = useCallback((
    budgetId: string, 
    amount: number, 
    description: string
  ): TransactionResult => {
    return allocateTokensAction(budgetId, amount, description, identityId)
  }, [allocateTokensAction, identityId])
  
  const reserve = useCallback((
    budgetId: string | undefined,
    amount: number,
    description: string
  ): TransactionResult => {
    const targetBudgetId = budgetId || primaryBudget?.id
    
    if (!targetBudgetId) {
      return {
        success: false,
        transaction: null,
        error: 'No budget available',
        warnings: [],
        blocked_by_rule: null,
      }
    }
    
    return reserveTokensAction(targetBudgetId, amount, description, identityId)
  }, [reserveTokensAction, primaryBudget, identityId])
  
  const release = useCallback((
    budgetId: string | undefined,
    amount: number,
    description: string
  ): TransactionResult => {
    const targetBudgetId = budgetId || primaryBudget?.id
    
    if (!targetBudgetId) {
      return {
        success: false,
        transaction: null,
        error: 'No budget available',
        warnings: [],
        blocked_by_rule: null,
      }
    }
    
    return releaseTokensAction(targetBudgetId, amount, description, identityId)
  }, [releaseTokensAction, primaryBudget, identityId])
  
  const transfer = useCallback((
    fromBudgetId: string,
    toBudgetId: string,
    amount: number
  ): TransactionResult => {
    return transferTokensAction(fromBudgetId, toBudgetId, amount, identityId)
  }, [transferTokensAction, identityId])
  
  const refund = useCallback((
    budgetId: string,
    amount: number,
    reason: string
  ): TransactionResult => {
    return refundTokensAction(budgetId, amount, reason, identityId)
  }, [refundTokensAction, identityId])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────────
  
  const canConsume = useCallback((
    budgetId: string | undefined,
    amount: number
  ): { allowed: boolean; reason?: string; warnings: string[] } => {
    const targetBudgetId = budgetId || primaryBudget?.id
    
    if (!targetBudgetId) {
      return { allowed: false, reason: 'No budget available', warnings: [] }
    }
    
    const budget = budgets[targetBudgetId]
    if (!budget) {
      return { allowed: false, reason: 'Budget not found', warnings: [] }
    }
    
    if (budget.is_locked) {
      return { allowed: false, reason: budget.locked_reason || 'Budget is locked', warnings: [] }
    }
    
    if (!budget.is_active) {
      return { allowed: false, reason: 'Budget is inactive', warnings: [] }
    }
    
    const available = budget.remaining - budget.total_reserved
    if (amount > available) {
      return { allowed: false, reason: `Insufficient tokens (available: ${available})`, warnings: [] }
    }
    
    // Check rules
    const ruleCheck = checkRulesAction(targetBudgetId, amount)
    if (!ruleCheck.allowed) {
      return {
        allowed: false,
        reason: ruleCheck.blockers[0]?.message || 'Blocked by budget rules',
        warnings: ruleCheck.warnings.map(w => w.message),
      }
    }
    
    return {
      allowed: true,
      warnings: ruleCheck.warnings.map(w => w.message),
    }
  }, [budgets, primaryBudget, checkRulesAction])
  
  const checkRules = useCallback((budgetId: string, amount: number): RuleCheckResult => {
    return checkRulesAction(budgetId, amount)
  }, [checkRulesAction])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Analytics & History
  // ─────────────────────────────────────────────────────────────────────────────
  
  const analytics: TokenAnalytics = useMemo(() => {
    return getAnalyticsAction(identityId)
  }, [getAnalyticsAction, identityId])
  
  const getTransactions = useCallback((
    budgetId?: string,
    limit: number = 50
  ): TokenTransaction[] => {
    return getTransactionHistoryAction({
      identity_id: identityId,
      budget_id: budgetId,
      limit,
    })
  }, [getTransactionHistoryAction, identityId])
  
  const getRecentTransactions = useCallback((limit: number = 10): TokenTransaction[] => {
    return getTransactions(undefined, limit)
  }, [getTransactions])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Budget Increase
  // ─────────────────────────────────────────────────────────────────────────────
  
  const requestIncrease = useCallback((
    budgetId: string,
    amount: number,
    justification: string
  ) => {
    return requestBudgetIncreaseAction(budgetId, amount, justification, identityId)
  }, [requestBudgetIncreaseAction, identityId])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Convenience
  // ─────────────────────────────────────────────────────────────────────────────
  
  const hasTokens = useMemo((): boolean => {
    return usageStats.total_remaining > 0
  }, [usageStats])
  
  const isLowBalance = useMemo((): boolean => {
    return usageStats.usage_percentage >= 80
  }, [usageStats])
  
  const isCriticalBalance = useMemo((): boolean => {
    return usageStats.usage_percentage >= 95
  }, [usageStats])
  
  const availableTokens = useMemo((): number => {
    return usageStats.total_remaining - usageStats.total_reserved
  }, [usageStats])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────────
  
  return {
    // Data
    budgets: myBudgets,
    activeBudgets,
    primaryBudget,
    usageStats,
    analytics,
    globalBalance,
    
    // Budget operations
    createBudget,
    deleteBudget,
    getBudget,
    getBudgetForSphere,
    
    // Token operations
    consume,
    allocate,
    reserve,
    release,
    transfer,
    refund,
    
    // Validation
    canConsume,
    checkRules,
    
    // History
    getTransactions,
    getRecentTransactions,
    
    // Increase
    requestIncrease,
    
    // Convenience
    hasTokens,
    isLowBalance,
    isCriticalBalance,
    availableTokens,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for a specific budget
 */
export function useBudget(budgetId: string) {
  const budget = useTokenStore(state => state.budgets[budgetId])
  const checkRules = useTokenStore(state => state.checkRules)
  const consume = useTokenStore(state => state.consumeTokens)
  
  const usagePercentage = budget?.total_allocated 
    ? Math.round((budget.total_used / budget.total_allocated) * 100) 
    : 0
  
  const availableTokens = budget 
    ? budget.remaining - budget.total_reserved 
    : 0
  
  return {
    budget,
    usagePercentage,
    availableTokens,
    isLocked: budget?.is_locked ?? false,
    isActive: budget?.is_active ?? false,
    checkRules: (amount: number) => checkRules(budgetId, amount),
    consume: (amount: number, description: string, createdBy: string) => 
      consume({ budget_id: budgetId, amount, description, created_by: createdBy }),
  }
}

/**
 * Hook for token balance display
 */
export function useTokenBalance(identityId: string, sphereId?: SphereId) {
  const tokenBudget = useTokenBudget(identityId, sphereId)
  
  return {
    total: tokenBudget.usageStats.total_allocated,
    used: tokenBudget.usageStats.total_used,
    remaining: tokenBudget.usageStats.total_remaining,
    reserved: tokenBudget.usageStats.total_reserved,
    available: tokenBudget.availableTokens,
    percentage: tokenBudget.usageStats.usage_percentage,
    isLow: tokenBudget.isLowBalance,
    isCritical: tokenBudget.isCriticalBalance,
  }
}

/**
 * Hook for token consumption with automatic budget selection
 */
export function useConsumeTokens(identityId: string, sphereId?: SphereId) {
  const tokenBudget = useTokenBudget(identityId, sphereId)
  
  return {
    consume: tokenBudget.consume,
    canConsume: tokenBudget.canConsume,
    available: tokenBudget.availableTokens,
    primaryBudget: tokenBudget.primaryBudget,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  TokenUsageStats,
  ConsumeOptions,
  CreateBudgetOptions,
}

export default useTokenBudget
