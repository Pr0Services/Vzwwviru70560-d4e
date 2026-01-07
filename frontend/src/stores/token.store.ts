/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — TOKEN STORE                                 ║
 * ║                    Internal Credits with Governance                           ║
 * ║                    Task A+5: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * TOKEN PRINCIPLES:
 * - Tokens are INTERNAL utility credits
 * - NOT a cryptocurrency
 * - NOT speculative
 * - NOT market-based
 * - Represent INTELLIGENCE ENERGY
 * - Budgeted, traceable, governed
 *
 * GOVERNANCE INTEGRATION:
 * - Budget changes require checkpoints
 * - Large transactions require approval
 * - Complete audit trail
 * - Identity-scoped budgets
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sphere ID type
 */
export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'team'
  | 'scholar'

/**
 * Budget period
 */
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unlimited'

/**
 * Transaction type
 */
export type TransactionType = 
  | 'allocation'
  | 'consumption'
  | 'reservation'
  | 'release'
  | 'transfer'
  | 'refund'
  | 'adjustment'
  | 'bonus'

/**
 * Rule type
 */
export type RuleType = 'limit' | 'alert' | 'block' | 'approve' | 'notify'

/**
 * Token budget rule
 */
export interface TokenRule {
  id: string
  name: string
  type: RuleType
  threshold: number // 0-1 (percentage) or absolute number
  threshold_type: 'percentage' | 'absolute'
  action: string
  message: string
  enabled: boolean
  requires_checkpoint: boolean
}

/**
 * Token budget definition
 */
export interface TokenBudget {
  id: string
  name: string
  description: string | null
  
  // Ownership
  identity_id: string
  sphere_id: SphereId
  
  // Amounts
  total_allocated: number
  total_used: number
  total_reserved: number
  remaining: number
  
  // Period
  period: BudgetPeriod
  period_start: string
  period_end: string | null
  reset_at: string | null
  
  // Rules
  rules: TokenRule[]
  
  // Status
  is_active: boolean
  is_locked: boolean
  locked_reason: string | null
  
  // Audit
  created_at: string
  updated_at: string
  created_by: string
}

/**
 * Token transaction
 */
export interface TokenTransaction {
  id: string
  type: TransactionType
  amount: number
  
  // Context
  budget_id: string
  identity_id: string
  sphere_id: SphereId
  thread_id: string | null
  agent_id: string | null
  checkpoint_id: string | null
  
  // Details
  description: string
  
  // Balance tracking
  balance_before: number
  balance_after: number
  
  // Audit
  timestamp: string
  created_by: string
  
  // Metadata
  metadata: Record<string, unknown>
}

/**
 * Transaction result
 */
export interface TransactionResult {
  success: boolean
  transaction: TokenTransaction | null
  error: string | null
  warnings: string[]
  blocked_by_rule: TokenRule | null
}

/**
 * Rule check result
 */
export interface RuleCheckResult {
  allowed: boolean
  warnings: TokenRule[]
  blockers: TokenRule[]
  requires_checkpoint: boolean
}

/**
 * Token analytics
 */
export interface TokenAnalytics {
  // Usage
  total_used_today: number
  total_used_week: number
  total_used_month: number
  average_daily: number
  
  // Efficiency
  efficiency_score: number // 0-100
  
  // By agent
  usage_by_agent: Array<{
    agent_id: string
    agent_name: string
    tokens_used: number
    transaction_count: number
    average_per_transaction: number
  }>
  
  // By sphere
  usage_by_sphere: Array<{
    sphere_id: SphereId
    tokens_used: number
    budget_total: number
    utilization: number
  }>
  
  // Trends
  daily_trend: Array<{
    date: string
    tokens_used: number
  }>
}

/**
 * Budget increase request
 */
export interface BudgetIncreaseRequest {
  id: string
  budget_id: string
  identity_id: string
  requested_amount: number
  justification: string
  status: 'pending' | 'approved' | 'rejected'
  checkpoint_id: string | null
  created_at: string
  decided_at: string | null
  decided_by: string | null
  decision_reason: string | null
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface TokenState {
  // Budgets
  budgets: Record<string, TokenBudget>
  
  // Transactions
  transactions: TokenTransaction[]
  
  // Global balance (pool)
  global_balance: number
  global_reserved: number
  
  // Increase requests
  increase_requests: BudgetIncreaseRequest[]
  
  // Loading
  is_loading: boolean
  error: string | null
}

interface TokenActions {
  // Budget CRUD
  createBudget: (params: CreateBudgetParams) => TokenBudget
  getBudget: (id: string) => TokenBudget | undefined
  updateBudget: (id: string, data: Partial<TokenBudget>) => void
  deleteBudget: (id: string) => boolean
  lockBudget: (id: string, reason: string) => void
  unlockBudget: (id: string) => void
  
  // Budget queries
  getBudgetsByIdentity: (identityId: string) => TokenBudget[]
  getBudgetsBySphere: (sphereId: SphereId) => TokenBudget[]
  getBudgetByIdentityAndSphere: (identityId: string, sphereId: SphereId) => TokenBudget | undefined
  
  // Token operations
  allocateTokens: (budgetId: string, amount: number, description: string, createdBy: string) => TransactionResult
  consumeTokens: (params: ConsumeTokensParams) => TransactionResult
  reserveTokens: (budgetId: string, amount: number, description: string, createdBy: string) => TransactionResult
  releaseTokens: (budgetId: string, amount: number, description: string, createdBy: string) => TransactionResult
  transferTokens: (fromBudgetId: string, toBudgetId: string, amount: number, createdBy: string) => TransactionResult
  refundTokens: (budgetId: string, amount: number, reason: string, createdBy: string) => TransactionResult
  
  // Rule operations
  addRule: (budgetId: string, rule: Omit<TokenRule, 'id'>) => void
  updateRule: (budgetId: string, ruleId: string, data: Partial<TokenRule>) => void
  removeRule: (budgetId: string, ruleId: string) => void
  checkRules: (budgetId: string, amount: number) => RuleCheckResult
  
  // Analytics
  getAnalytics: (identityId?: string) => TokenAnalytics
  getTransactionHistory: (filters?: TransactionFilters) => TokenTransaction[]
  
  // Budget increase requests
  requestBudgetIncrease: (budgetId: string, amount: number, justification: string, identityId: string) => BudgetIncreaseRequest
  approveBudgetIncrease: (requestId: string, decidedBy: string) => boolean
  rejectBudgetIncrease: (requestId: string, decidedBy: string, reason: string) => boolean
  getPendingRequests: (identityId?: string) => BudgetIncreaseRequest[]
  
  // Period reset
  checkAndResetPeriods: () => number
  
  // Global pool
  getGlobalBalance: () => { total: number; reserved: number; available: number }
  addToGlobalPool: (amount: number, reason: string) => void
  
  // Reset
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CreateBudgetParams {
  name: string
  description?: string
  identity_id: string
  sphere_id: SphereId
  total_allocated: number
  period: BudgetPeriod
  created_by: string
}

interface ConsumeTokensParams {
  budget_id: string
  amount: number
  description: string
  created_by: string
  thread_id?: string
  agent_id?: string
  checkpoint_id?: string
  metadata?: Record<string, unknown>
}

interface TransactionFilters {
  budget_id?: string
  identity_id?: string
  sphere_id?: SphereId
  thread_id?: string
  agent_id?: string
  type?: TransactionType
  start_date?: string
  end_date?: string
  limit?: number
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

const getPeriodEnd = (period: BudgetPeriod, start: Date): Date | null => {
  const end = new Date(start)
  switch (period) {
    case 'daily':
      end.setDate(end.getDate() + 1)
      return end
    case 'weekly':
      end.setDate(end.getDate() + 7)
      return end
    case 'monthly':
      end.setMonth(end.getMonth() + 1)
      return end
    case 'yearly':
      end.setFullYear(end.getFullYear() + 1)
      return end
    case 'unlimited':
      return null
  }
}

const DEFAULT_RULES: Omit<TokenRule, 'id'>[] = [
  {
    name: 'Warning at 80%',
    type: 'alert',
    threshold: 0.8,
    threshold_type: 'percentage',
    action: 'notify',
    message: 'Budget utilization at 80%',
    enabled: true,
    requires_checkpoint: false,
  },
  {
    name: 'Approval at 95%',
    type: 'approve',
    threshold: 0.95,
    threshold_type: 'percentage',
    action: 'checkpoint',
    message: 'Budget nearly exhausted, requires approval',
    enabled: true,
    requires_checkpoint: true,
  },
  {
    name: 'Block at 100%',
    type: 'block',
    threshold: 1.0,
    threshold_type: 'percentage',
    action: 'block',
    message: 'Budget exhausted',
    enabled: true,
    requires_checkpoint: false,
  },
]

const INITIAL_GLOBAL_BALANCE = 100000

// ═══════════════════════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useTokenStore = create<TokenState & TokenActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ─────────────────────────────────────────────────────────────────────
        // Initial State
        // ─────────────────────────────────────────────────────────────────────
        budgets: {},
        transactions: [],
        global_balance: INITIAL_GLOBAL_BALANCE,
        global_reserved: 0,
        increase_requests: [],
        is_loading: false,
        error: null,

        // ─────────────────────────────────────────────────────────────────────
        // Budget CRUD
        // ─────────────────────────────────────────────────────────────────────

        createBudget: (params) => {
          const state = get()
          
          // Check global balance
          if (params.total_allocated > state.global_balance - state.global_reserved) {
            throw new Error('Insufficient global balance')
          }
          
          const timestamp = now()
          const periodStart = new Date()
          const periodEnd = getPeriodEnd(params.period, periodStart)
          
          const budget: TokenBudget = {
            id: generateId('budget'),
            name: params.name,
            description: params.description ?? null,
            identity_id: params.identity_id,
            sphere_id: params.sphere_id,
            total_allocated: params.total_allocated,
            total_used: 0,
            total_reserved: 0,
            remaining: params.total_allocated,
            period: params.period,
            period_start: periodStart.toISOString(),
            period_end: periodEnd?.toISOString() ?? null,
            reset_at: periodEnd?.toISOString() ?? null,
            rules: DEFAULT_RULES.map(r => ({ ...r, id: generateId('rule') })),
            is_active: true,
            is_locked: false,
            locked_reason: null,
            created_at: timestamp,
            updated_at: timestamp,
            created_by: params.created_by,
          }
          
          set((s) => {
            s.budgets[budget.id] = budget
            s.global_balance -= params.total_allocated
          })
          
          return budget
        },

        getBudget: (id) => get().budgets[id],

        updateBudget: (id, data) => {
          set((s) => {
            const budget = s.budgets[id]
            if (!budget) return
            
            Object.assign(budget, data, { updated_at: now() })
          })
        },

        deleteBudget: (id) => {
          const budget = get().budgets[id]
          if (!budget) return false
          
          set((s) => {
            // Return remaining to global pool
            s.global_balance += budget.remaining
            delete s.budgets[id]
          })
          
          return true
        },

        lockBudget: (id, reason) => {
          set((s) => {
            const budget = s.budgets[id]
            if (!budget) return
            
            budget.is_locked = true
            budget.locked_reason = reason
            budget.updated_at = now()
          })
        },

        unlockBudget: (id) => {
          set((s) => {
            const budget = s.budgets[id]
            if (!budget) return
            
            budget.is_locked = false
            budget.locked_reason = null
            budget.updated_at = now()
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Budget Queries
        // ─────────────────────────────────────────────────────────────────────

        getBudgetsByIdentity: (identityId) => {
          return Object.values(get().budgets).filter(b => b.identity_id === identityId)
        },

        getBudgetsBySphere: (sphereId) => {
          return Object.values(get().budgets).filter(b => b.sphere_id === sphereId)
        },

        getBudgetByIdentityAndSphere: (identityId, sphereId) => {
          return Object.values(get().budgets).find(
            b => b.identity_id === identityId && b.sphere_id === sphereId
          )
        },

        // ─────────────────────────────────────────────────────────────────────
        // Token Operations
        // ─────────────────────────────────────────────────────────────────────

        allocateTokens: (budgetId, amount, description, createdBy) => {
          const budget = get().budgets[budgetId]
          if (!budget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          if (budget.is_locked) {
            return { success: false, transaction: null, error: budget.locked_reason ?? 'Budget is locked', warnings: [], blocked_by_rule: null }
          }
          
          const state = get()
          if (amount > state.global_balance - state.global_reserved) {
            return { success: false, transaction: null, error: 'Insufficient global balance', warnings: [], blocked_by_rule: null }
          }
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'allocation',
            amount,
            budget_id: budgetId,
            identity_id: budget.identity_id,
            sphere_id: budget.sphere_id,
            thread_id: null,
            agent_id: null,
            checkpoint_id: null,
            description,
            balance_before: budget.remaining,
            balance_after: budget.remaining + amount,
            timestamp: now(),
            created_by: createdBy,
            metadata: {},
          }
          
          set((s) => {
            s.budgets[budgetId].total_allocated += amount
            s.budgets[budgetId].remaining += amount
            s.budgets[budgetId].updated_at = now()
            s.global_balance -= amount
            s.transactions.push(transaction)
          })
          
          return { success: true, transaction, error: null, warnings: [], blocked_by_rule: null }
        },

        consumeTokens: (params) => {
          const budget = get().budgets[params.budget_id]
          if (!budget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          if (budget.is_locked) {
            return { success: false, transaction: null, error: budget.locked_reason ?? 'Budget is locked', warnings: [], blocked_by_rule: null }
          }
          
          // Check rules
          const ruleCheck = get().checkRules(params.budget_id, params.amount)
          if (!ruleCheck.allowed) {
            return { 
              success: false, 
              transaction: null, 
              error: 'Blocked by rule', 
              warnings: ruleCheck.warnings.map(r => r.message), 
              blocked_by_rule: ruleCheck.blockers[0] 
            }
          }
          
          const available = budget.remaining - budget.total_reserved
          if (params.amount > available) {
            return { success: false, transaction: null, error: 'Insufficient tokens', warnings: [], blocked_by_rule: null }
          }
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'consumption',
            amount: params.amount,
            budget_id: params.budget_id,
            identity_id: budget.identity_id,
            sphere_id: budget.sphere_id,
            thread_id: params.thread_id ?? null,
            agent_id: params.agent_id ?? null,
            checkpoint_id: params.checkpoint_id ?? null,
            description: params.description,
            balance_before: budget.remaining,
            balance_after: budget.remaining - params.amount,
            timestamp: now(),
            created_by: params.created_by,
            metadata: params.metadata ?? {},
          }
          
          set((s) => {
            s.budgets[params.budget_id].total_used += params.amount
            s.budgets[params.budget_id].remaining -= params.amount
            s.budgets[params.budget_id].updated_at = now()
            s.transactions.push(transaction)
          })
          
          return { 
            success: true, 
            transaction, 
            error: null, 
            warnings: ruleCheck.warnings.map(r => r.message), 
            blocked_by_rule: null 
          }
        },

        reserveTokens: (budgetId, amount, description, createdBy) => {
          const budget = get().budgets[budgetId]
          if (!budget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          const available = budget.remaining - budget.total_reserved
          if (amount > available) {
            return { success: false, transaction: null, error: 'Insufficient tokens', warnings: [], blocked_by_rule: null }
          }
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'reservation',
            amount,
            budget_id: budgetId,
            identity_id: budget.identity_id,
            sphere_id: budget.sphere_id,
            thread_id: null,
            agent_id: null,
            checkpoint_id: null,
            description,
            balance_before: budget.total_reserved,
            balance_after: budget.total_reserved + amount,
            timestamp: now(),
            created_by: createdBy,
            metadata: {},
          }
          
          set((s) => {
            s.budgets[budgetId].total_reserved += amount
            s.budgets[budgetId].updated_at = now()
            s.transactions.push(transaction)
          })
          
          return { success: true, transaction, error: null, warnings: [], blocked_by_rule: null }
        },

        releaseTokens: (budgetId, amount, description, createdBy) => {
          const budget = get().budgets[budgetId]
          if (!budget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          const releaseAmount = Math.min(amount, budget.total_reserved)
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'release',
            amount: releaseAmount,
            budget_id: budgetId,
            identity_id: budget.identity_id,
            sphere_id: budget.sphere_id,
            thread_id: null,
            agent_id: null,
            checkpoint_id: null,
            description,
            balance_before: budget.total_reserved,
            balance_after: budget.total_reserved - releaseAmount,
            timestamp: now(),
            created_by: createdBy,
            metadata: {},
          }
          
          set((s) => {
            s.budgets[budgetId].total_reserved -= releaseAmount
            s.budgets[budgetId].updated_at = now()
            s.transactions.push(transaction)
          })
          
          return { success: true, transaction, error: null, warnings: [], blocked_by_rule: null }
        },

        transferTokens: (fromBudgetId, toBudgetId, amount, createdBy) => {
          const fromBudget = get().budgets[fromBudgetId]
          const toBudget = get().budgets[toBudgetId]
          
          if (!fromBudget || !toBudget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          const available = fromBudget.remaining - fromBudget.total_reserved
          if (amount > available) {
            return { success: false, transaction: null, error: 'Insufficient tokens', warnings: [], blocked_by_rule: null }
          }
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'transfer',
            amount,
            budget_id: fromBudgetId,
            identity_id: fromBudget.identity_id,
            sphere_id: fromBudget.sphere_id,
            thread_id: null,
            agent_id: null,
            checkpoint_id: null,
            description: `Transfer to ${toBudget.name}`,
            balance_before: fromBudget.remaining,
            balance_after: fromBudget.remaining - amount,
            timestamp: now(),
            created_by: createdBy,
            metadata: { to_budget_id: toBudgetId },
          }
          
          set((s) => {
            s.budgets[fromBudgetId].remaining -= amount
            s.budgets[fromBudgetId].updated_at = now()
            s.budgets[toBudgetId].total_allocated += amount
            s.budgets[toBudgetId].remaining += amount
            s.budgets[toBudgetId].updated_at = now()
            s.transactions.push(transaction)
          })
          
          return { success: true, transaction, error: null, warnings: [], blocked_by_rule: null }
        },

        refundTokens: (budgetId, amount, reason, createdBy) => {
          const budget = get().budgets[budgetId]
          if (!budget) {
            return { success: false, transaction: null, error: 'Budget not found', warnings: [], blocked_by_rule: null }
          }
          
          const refundAmount = Math.min(amount, budget.total_used)
          
          const transaction: TokenTransaction = {
            id: generateId('txn'),
            type: 'refund',
            amount: refundAmount,
            budget_id: budgetId,
            identity_id: budget.identity_id,
            sphere_id: budget.sphere_id,
            thread_id: null,
            agent_id: null,
            checkpoint_id: null,
            description: reason,
            balance_before: budget.remaining,
            balance_after: budget.remaining + refundAmount,
            timestamp: now(),
            created_by: createdBy,
            metadata: {},
          }
          
          set((s) => {
            s.budgets[budgetId].total_used -= refundAmount
            s.budgets[budgetId].remaining += refundAmount
            s.budgets[budgetId].updated_at = now()
            s.transactions.push(transaction)
          })
          
          return { success: true, transaction, error: null, warnings: [], blocked_by_rule: null }
        },

        // ─────────────────────────────────────────────────────────────────────
        // Rule Operations
        // ─────────────────────────────────────────────────────────────────────

        addRule: (budgetId, rule) => {
          set((s) => {
            const budget = s.budgets[budgetId]
            if (!budget) return
            
            budget.rules.push({ ...rule, id: generateId('rule') })
            budget.updated_at = now()
          })
        },

        updateRule: (budgetId, ruleId, data) => {
          set((s) => {
            const budget = s.budgets[budgetId]
            if (!budget) return
            
            const ruleIdx = budget.rules.findIndex(r => r.id === ruleId)
            if (ruleIdx !== -1) {
              Object.assign(budget.rules[ruleIdx], data)
              budget.updated_at = now()
            }
          })
        },

        removeRule: (budgetId, ruleId) => {
          set((s) => {
            const budget = s.budgets[budgetId]
            if (!budget) return
            
            budget.rules = budget.rules.filter(r => r.id !== ruleId)
            budget.updated_at = now()
          })
        },

        checkRules: (budgetId, amount) => {
          const budget = get().budgets[budgetId]
          if (!budget) {
            return { allowed: true, warnings: [], blockers: [], requires_checkpoint: false }
          }
          
          const usageAfter = (budget.total_used + amount) / budget.total_allocated
          const warnings: TokenRule[] = []
          const blockers: TokenRule[] = []
          let requires_checkpoint = false
          
          budget.rules.forEach((rule) => {
            if (!rule.enabled) return
            
            const threshold = rule.threshold_type === 'percentage' 
              ? rule.threshold 
              : rule.threshold / budget.total_allocated
            
            if (usageAfter >= threshold) {
              if (rule.type === 'block') {
                blockers.push(rule)
              } else if (rule.type === 'alert' || rule.type === 'notify') {
                warnings.push(rule)
              } else if (rule.type === 'approve') {
                requires_checkpoint = true
                warnings.push(rule)
              }
              
              if (rule.requires_checkpoint) {
                requires_checkpoint = true
              }
            }
          })
          
          return {
            allowed: blockers.length === 0,
            warnings,
            blockers,
            requires_checkpoint,
          }
        },

        // ─────────────────────────────────────────────────────────────────────
        // Analytics
        // ─────────────────────────────────────────────────────────────────────

        getAnalytics: (identityId) => {
          const { transactions, budgets } = get()
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          
          let consumptions = transactions.filter(t => t.type === 'consumption')
          if (identityId) {
            consumptions = consumptions.filter(t => t.identity_id === identityId)
          }
          
          const total_used_today = consumptions
            .filter(t => new Date(t.timestamp) >= today)
            .reduce((sum, t) => sum + t.amount, 0)
          
          const total_used_week = consumptions
            .filter(t => new Date(t.timestamp) >= weekAgo)
            .reduce((sum, t) => sum + t.amount, 0)
          
          const total_used_month = consumptions
            .filter(t => new Date(t.timestamp) >= monthAgo)
            .reduce((sum, t) => sum + t.amount, 0)
          
          // By agent
          const agentUsage: Record<string, { tokens: number; count: number }> = {}
          consumptions.forEach(t => {
            if (t.agent_id) {
              if (!agentUsage[t.agent_id]) {
                agentUsage[t.agent_id] = { tokens: 0, count: 0 }
              }
              agentUsage[t.agent_id].tokens += t.amount
              agentUsage[t.agent_id].count++
            }
          })
          
          const usage_by_agent = Object.entries(agentUsage)
            .map(([agent_id, data]) => ({
              agent_id,
              agent_name: agent_id,
              tokens_used: data.tokens,
              transaction_count: data.count,
              average_per_transaction: data.tokens / data.count,
            }))
            .sort((a, b) => b.tokens_used - a.tokens_used)
            .slice(0, 10)
          
          // By sphere
          let budgetList = Object.values(budgets)
          if (identityId) {
            budgetList = budgetList.filter(b => b.identity_id === identityId)
          }
          
          const sphereUsage: Record<SphereId, { used: number; total: number }> = {} as Record<SphereId, { used: number; total: number }>
          budgetList.forEach(b => {
            if (!sphereUsage[b.sphere_id]) {
              sphereUsage[b.sphere_id] = { used: 0, total: 0 }
            }
            sphereUsage[b.sphere_id].used += b.total_used
            sphereUsage[b.sphere_id].total += b.total_allocated
          })
          
          const usage_by_sphere = Object.entries(sphereUsage)
            .map(([sphere_id, data]) => ({
              sphere_id: sphere_id as SphereId,
              tokens_used: data.used,
              budget_total: data.total,
              utilization: data.total > 0 ? (data.used / data.total) * 100 : 0,
            }))
            .sort((a, b) => b.tokens_used - a.tokens_used)
          
          // Daily trend (last 7 days)
          const daily_trend: Array<{ date: string; tokens_used: number }> = []
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)
            
            const dayTokens = consumptions
              .filter(t => {
                const tDate = new Date(t.timestamp)
                return tDate >= date && tDate < nextDate
              })
              .reduce((sum, t) => sum + t.amount, 0)
            
            daily_trend.push({ date: dateStr, tokens_used: dayTokens })
          }
          
          return {
            total_used_today,
            total_used_week,
            total_used_month,
            average_daily: total_used_month / 30,
            efficiency_score: 85, // Would be calculated based on encoding effectiveness
            usage_by_agent,
            usage_by_sphere,
            daily_trend,
          }
        },

        getTransactionHistory: (filters) => {
          let result = [...get().transactions]
          
          if (filters) {
            if (filters.budget_id) result = result.filter(t => t.budget_id === filters.budget_id)
            if (filters.identity_id) result = result.filter(t => t.identity_id === filters.identity_id)
            if (filters.sphere_id) result = result.filter(t => t.sphere_id === filters.sphere_id)
            if (filters.thread_id) result = result.filter(t => t.thread_id === filters.thread_id)
            if (filters.agent_id) result = result.filter(t => t.agent_id === filters.agent_id)
            if (filters.type) result = result.filter(t => t.type === filters.type)
            if (filters.start_date) result = result.filter(t => t.timestamp >= filters.start_date!)
            if (filters.end_date) result = result.filter(t => t.timestamp <= filters.end_date!)
          }
          
          result.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          
          if (filters?.limit) {
            result = result.slice(0, filters.limit)
          }
          
          return result
        },

        // ─────────────────────────────────────────────────────────────────────
        // Budget Increase Requests
        // ─────────────────────────────────────────────────────────────────────

        requestBudgetIncrease: (budgetId, amount, justification, identityId) => {
          const request: BudgetIncreaseRequest = {
            id: generateId('req'),
            budget_id: budgetId,
            identity_id: identityId,
            requested_amount: amount,
            justification,
            status: 'pending',
            checkpoint_id: null,
            created_at: now(),
            decided_at: null,
            decided_by: null,
            decision_reason: null,
          }
          
          set((s) => {
            s.increase_requests.push(request)
          })
          
          return request
        },

        approveBudgetIncrease: (requestId, decidedBy) => {
          const request = get().increase_requests.find(r => r.id === requestId)
          if (!request || request.status !== 'pending') return false
          
          const result = get().allocateTokens(
            request.budget_id,
            request.requested_amount,
            `Budget increase approved: ${request.justification}`,
            decidedBy
          )
          
          if (!result.success) return false
          
          set((s) => {
            const idx = s.increase_requests.findIndex(r => r.id === requestId)
            if (idx !== -1) {
              s.increase_requests[idx].status = 'approved'
              s.increase_requests[idx].decided_at = now()
              s.increase_requests[idx].decided_by = decidedBy
            }
          })
          
          return true
        },

        rejectBudgetIncrease: (requestId, decidedBy, reason) => {
          set((s) => {
            const idx = s.increase_requests.findIndex(r => r.id === requestId)
            if (idx !== -1) {
              s.increase_requests[idx].status = 'rejected'
              s.increase_requests[idx].decided_at = now()
              s.increase_requests[idx].decided_by = decidedBy
              s.increase_requests[idx].decision_reason = reason
            }
          })
          
          return true
        },

        getPendingRequests: (identityId) => {
          let requests = get().increase_requests.filter(r => r.status === 'pending')
          if (identityId) {
            requests = requests.filter(r => r.identity_id === identityId)
          }
          return requests
        },

        // ─────────────────────────────────────────────────────────────────────
        // Period Reset
        // ─────────────────────────────────────────────────────────────────────

        checkAndResetPeriods: () => {
          const currentTime = now()
          let resetCount = 0
          
          set((s) => {
            Object.values(s.budgets).forEach(budget => {
              if (budget.reset_at && budget.reset_at <= currentTime) {
                // Reset budget
                budget.total_used = 0
                budget.total_reserved = 0
                budget.remaining = budget.total_allocated
                
                // Calculate new period end
                const periodEnd = getPeriodEnd(budget.period, new Date())
                budget.period_start = currentTime
                budget.period_end = periodEnd?.toISOString() ?? null
                budget.reset_at = periodEnd?.toISOString() ?? null
                budget.updated_at = currentTime
                
                resetCount++
              }
            })
          })
          
          return resetCount
        },

        // ─────────────────────────────────────────────────────────────────────
        // Global Pool
        // ─────────────────────────────────────────────────────────────────────

        getGlobalBalance: () => {
          const { global_balance, global_reserved } = get()
          return {
            total: global_balance,
            reserved: global_reserved,
            available: global_balance - global_reserved,
          }
        },

        addToGlobalPool: (amount, reason) => {
          set((s) => {
            s.global_balance += amount
            s.transactions.push({
              id: generateId('txn'),
              type: 'bonus',
              amount,
              budget_id: 'global',
              identity_id: 'system',
              sphere_id: 'personal',
              thread_id: null,
              agent_id: null,
              checkpoint_id: null,
              description: reason,
              balance_before: s.global_balance - amount,
              balance_after: s.global_balance,
              timestamp: now(),
              created_by: 'system',
              metadata: {},
            })
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Reset
        // ─────────────────────────────────────────────────────────────────────

        reset: () => {
          set({
            budgets: {},
            transactions: [],
            global_balance: INITIAL_GLOBAL_BALANCE,
            global_reserved: 0,
            increase_requests: [],
            is_loading: false,
            error: null,
          })
        },
      })),
      {
        name: 'chenu-tokens-v55',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          budgets: state.budgets,
          global_balance: state.global_balance,
        }),
      }
    ),
    { name: 'TokenStore' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const selectAllBudgets = (state: TokenState) => Object.values(state.budgets)
export const selectGlobalBalance = (state: TokenState) => state.global_balance
export const selectTransactions = (state: TokenState) => state.transactions
export const selectPendingRequests = (state: TokenState) => 
  state.increase_requests.filter(r => r.status === 'pending')

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export const useBudgets = () => useTokenStore(selectAllBudgets)
export const useGlobalBalance = () => useTokenStore(selectGlobalBalance)
export const useTransactions = () => useTokenStore(selectTransactions)
export const usePendingIncreaseRequests = () => useTokenStore(selectPendingRequests)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  TokenState,
  TokenActions,
  CreateBudgetParams,
  ConsumeTokensParams,
  TransactionFilters,
}

export default useTokenStore
