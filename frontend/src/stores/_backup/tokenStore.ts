/**
 * CHE·NU™ - TOKEN STORE
 * 
 * CHE·NU Tokens are:
 * - INTERNAL utility credits
 * - NOT a cryptocurrency
 * - NOT speculative
 * - NOT market-based
 * 
 * Tokens represent INTELLIGENCE ENERGY.
 * Tokens are: budgeted, traceable, governed, transferable with rules
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface TokenBudget {
  id: string;
  name: string;
  sphereId: SphereId;
  totalAllocated: number;
  totalUsed: number;
  remaining: number;
  period: 'daily' | 'weekly' | 'monthly' | 'unlimited';
  resetAt?: string;
  rules: TokenRule[];
}

export interface TokenRule {
  id: string;
  name: string;
  type: 'limit' | 'alert' | 'block' | 'approve';
  threshold: number;
  action: string;
  enabled: boolean;
}

export interface TokenTransaction {
  id: string;
  type: 'allocation' | 'consumption' | 'transfer' | 'refund';
  amount: number;
  budgetId: string;
  threadId?: string;
  agentId?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface TokenUsageByAgent {
  agentId: string;
  agentName: string;
  tokensUsed: number;
  transactionCount: number;
  averagePerTransaction: number;
}

export interface TokenAnalytics {
  totalUsedToday: number;
  totalUsedThisWeek: number;
  totalUsedThisMonth: number;
  averageDailyUsage: number;
  topAgents: TokenUsageByAgent[];
  topSpheres: { sphereId: SphereId; tokensUsed: number }[];
  efficiency: number; // 0-100
}

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface TokenState {
  // State
  budgets: Record<string, TokenBudget>;
  transactions: TokenTransaction[];
  globalBalance: number;
  isLoading: boolean;
  
  // Budget Operations
  createBudget: (data: CreateBudgetData) => TokenBudget;
  getBudget: (id: string) => TokenBudget | undefined;
  updateBudget: (id: string, data: Partial<TokenBudget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetsBySphere: (sphereId: SphereId) => TokenBudget[];
  
  // Token Operations
  allocateTokens: (budgetId: string, amount: number, description: string) => boolean;
  consumeTokens: (params: ConsumeTokensParams) => TokenTransactionResult;
  transferTokens: (fromBudgetId: string, toBudgetId: string, amount: number) => boolean;
  refundTokens: (budgetId: string, amount: number, reason: string) => boolean;
  
  // Rule Operations
  addRule: (budgetId: string, rule: Omit<TokenRule, 'id'>) => void;
  updateRule: (budgetId: string, ruleId: string, data: Partial<TokenRule>) => void;
  removeRule: (budgetId: string, ruleId: string) => void;
  checkRules: (budgetId: string, amount: number) => RuleCheckResult;
  
  // Analytics
  getAnalytics: () => TokenAnalytics;
  getTransactionHistory: (filters?: TransactionFilters) => TokenTransaction[];
  
  // Governance
  requestBudgetIncrease: (budgetId: string, amount: number, justification: string) => Promise<boolean>;
  approveBudgetIncrease: (requestId: string) => void;
}

interface CreateBudgetData {
  name: string;
  sphereId: SphereId;
  totalAllocated: number;
  period: TokenBudget['period'];
}

interface ConsumeTokensParams {
  budgetId: string;
  amount: number;
  threadId?: string;
  agentId?: string;
  description: string;
}

interface TokenTransactionResult {
  success: boolean;
  transaction?: TokenTransaction;
  error?: string;
  ruleViolation?: TokenRule;
}

interface RuleCheckResult {
  allowed: boolean;
  warnings: TokenRule[];
  blockers: TokenRule[];
}

interface TransactionFilters {
  budgetId?: string;
  threadId?: string;
  agentId?: string;
  type?: TokenTransaction['type'];
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `tkn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createEmptyBudget = (data: CreateBudgetData): TokenBudget => ({
  id: generateId(),
  name: data.name,
  sphereId: data.sphereId,
  totalAllocated: data.totalAllocated,
  totalUsed: 0,
  remaining: data.totalAllocated,
  period: data.period,
  resetAt: data.period !== 'unlimited' 
    ? new Date(Date.now() + getPeriodMs(data.period)).toISOString()
    : undefined,
  rules: [
    { id: 'default_warn', name: 'Warning at 80%', type: 'alert', threshold: 0.8, action: 'notify', enabled: true },
    { id: 'default_block', name: 'Block at 100%', type: 'block', threshold: 1.0, action: 'block', enabled: true },
  ],
});

const getPeriodMs = (period: TokenBudget['period']): number => {
  switch (period) {
    case 'daily': return 24 * 60 * 60 * 1000;
    case 'weekly': return 7 * 24 * 60 * 60 * 1000;
    case 'monthly': return 30 * 24 * 60 * 60 * 1000;
    default: return 0;
  }
};

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      // Initial State
      budgets: {},
      transactions: [],
      globalBalance: 50000, // Starting global balance
      isLoading: false,

      // ─────────────────────────────────────────────────────────
      // Budget Operations
      // ─────────────────────────────────────────────────────────
      createBudget: (data: CreateBudgetData): TokenBudget => {
        const budget = createEmptyBudget(data);
        set((state) => ({
          budgets: { ...state.budgets, [budget.id]: budget },
          globalBalance: state.globalBalance - data.totalAllocated,
        }));
        return budget;
      },

      getBudget: (id: string): TokenBudget | undefined => {
        return get().budgets[id];
      },

      updateBudget: (id: string, data: Partial<TokenBudget>): void => {
        set((state) => {
          const budget = state.budgets[id];
          if (!budget) return state;
          
          return {
            budgets: {
              ...state.budgets,
              [id]: { ...budget, ...data },
            },
          };
        });
      },

      deleteBudget: (id: string): void => {
        set((state) => {
          const budget = state.budgets[id];
          if (!budget) return state;
          
          const { [id]: deleted, ...remaining } = state.budgets;
          return {
            budgets: remaining,
            globalBalance: state.globalBalance + budget.remaining,
          };
        });
      },

      getBudgetsBySphere: (sphereId: SphereId): TokenBudget[] => {
        return Object.values(get().budgets).filter((b) => b.sphereId === sphereId);
      },

      // ─────────────────────────────────────────────────────────
      // Token Operations
      // ─────────────────────────────────────────────────────────
      allocateTokens: (budgetId: string, amount: number, description: string): boolean => {
        const { globalBalance } = get();
        if (amount > globalBalance) return false;
        
        set((state) => {
          const budget = state.budgets[budgetId];
          if (!budget) return state;
          
          const transaction: TokenTransaction = {
            id: generateId(),
            type: 'allocation',
            amount,
            budgetId,
            description,
            timestamp: new Date().toISOString(),
          };
          
          return {
            budgets: {
              ...state.budgets,
              [budgetId]: {
                ...budget,
                totalAllocated: budget.totalAllocated + amount,
                remaining: budget.remaining + amount,
              },
            },
            transactions: [...state.transactions, transaction],
            globalBalance: state.globalBalance - amount,
          };
        });
        
        return true;
      },

      consumeTokens: (params: ConsumeTokensParams): TokenTransactionResult => {
        const budget = get().budgets[params.budgetId];
        if (!budget) {
          return { success: false, error: 'Budget not found' };
        }
        
        // Check rules
        const ruleCheck = get().checkRules(params.budgetId, params.amount);
        if (!ruleCheck.allowed) {
          return { 
            success: false, 
            error: 'Blocked by governance rule',
            ruleViolation: ruleCheck.blockers[0],
          };
        }
        
        // Check balance
        if (params.amount > budget.remaining) {
          return { success: false, error: 'Insufficient token balance' };
        }
        
        const transaction: TokenTransaction = {
          id: generateId(),
          type: 'consumption',
          amount: params.amount,
          budgetId: params.budgetId,
          threadId: params.threadId,
          agentId: params.agentId,
          description: params.description,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          budgets: {
            ...state.budgets,
            [params.budgetId]: {
              ...budget,
              totalUsed: budget.totalUsed + params.amount,
              remaining: budget.remaining - params.amount,
            },
          },
          transactions: [...state.transactions, transaction],
        }));
        
        return { success: true, transaction };
      },

      transferTokens: (fromBudgetId: string, toBudgetId: string, amount: number): boolean => {
        const fromBudget = get().budgets[fromBudgetId];
        const toBudget = get().budgets[toBudgetId];
        
        if (!fromBudget || !toBudget) return false;
        if (amount > fromBudget.remaining) return false;
        
        set((state) => {
          const transaction: TokenTransaction = {
            id: generateId(),
            type: 'transfer',
            amount,
            budgetId: fromBudgetId,
            description: `Transfer to ${toBudget.name}`,
            timestamp: new Date().toISOString(),
            metadata: { toBudgetId },
          };
          
          return {
            budgets: {
              ...state.budgets,
              [fromBudgetId]: {
                ...fromBudget,
                remaining: fromBudget.remaining - amount,
              },
              [toBudgetId]: {
                ...toBudget,
                totalAllocated: toBudget.totalAllocated + amount,
                remaining: toBudget.remaining + amount,
              },
            },
            transactions: [...state.transactions, transaction],
          };
        });
        
        return true;
      },

      refundTokens: (budgetId: string, amount: number, reason: string): boolean => {
        const budget = get().budgets[budgetId];
        if (!budget) return false;
        
        set((state) => {
          const transaction: TokenTransaction = {
            id: generateId(),
            type: 'refund',
            amount,
            budgetId,
            description: reason,
            timestamp: new Date().toISOString(),
          };
          
          return {
            budgets: {
              ...state.budgets,
              [budgetId]: {
                ...budget,
                totalUsed: Math.max(0, budget.totalUsed - amount),
                remaining: budget.remaining + amount,
              },
            },
            transactions: [...state.transactions, transaction],
          };
        });
        
        return true;
      },

      // ─────────────────────────────────────────────────────────
      // Rule Operations
      // ─────────────────────────────────────────────────────────
      addRule: (budgetId: string, rule: Omit<TokenRule, 'id'>): void => {
        const budget = get().budgets[budgetId];
        if (!budget) return;
        
        const newRule: TokenRule = { ...rule, id: generateId() };
        get().updateBudget(budgetId, { rules: [...budget.rules, newRule] });
      },

      updateRule: (budgetId: string, ruleId: string, data: Partial<TokenRule>): void => {
        const budget = get().budgets[budgetId];
        if (!budget) return;
        
        const updatedRules = budget.rules.map((r) =>
          r.id === ruleId ? { ...r, ...data } : r
        );
        get().updateBudget(budgetId, { rules: updatedRules });
      },

      removeRule: (budgetId: string, ruleId: string): void => {
        const budget = get().budgets[budgetId];
        if (!budget) return;
        
        get().updateBudget(budgetId, { rules: budget.rules.filter((r) => r.id !== ruleId) });
      },

      checkRules: (budgetId: string, amount: number): RuleCheckResult => {
        const budget = get().budgets[budgetId];
        if (!budget) return { allowed: true, warnings: [], blockers: [] };
        
        const usageAfter = (budget.totalUsed + amount) / budget.totalAllocated;
        const warnings: TokenRule[] = [];
        const blockers: TokenRule[] = [];
        
        budget.rules.forEach((rule) => {
          if (!rule.enabled) return;
          
          if (usageAfter >= rule.threshold) {
            if (rule.type === 'block') {
              blockers.push(rule);
            } else if (rule.type === 'alert') {
              warnings.push(rule);
            }
          }
        });
        
        return {
          allowed: blockers.length === 0,
          warnings,
          blockers,
        };
      },

      // ─────────────────────────────────────────────────────────
      // Analytics
      // ─────────────────────────────────────────────────────────
      getAnalytics: (): TokenAnalytics => {
        const { transactions, budgets } = get();
        const now = new Date();
        const dayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const weekStart = new Date(now.setDate(now.getDate() - 7)).toISOString();
        const monthStart = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        
        const consumptions = transactions.filter((t) => t.type === 'consumption');
        
        const totalUsedToday = consumptions
          .filter((t) => t.timestamp >= dayStart)
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalUsedThisWeek = consumptions
          .filter((t) => t.timestamp >= weekStart)
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalUsedThisMonth = consumptions
          .filter((t) => t.timestamp >= monthStart)
          .reduce((sum, t) => sum + t.amount, 0);
        
        // Agent usage
        const agentUsage: Record<string, TokenUsageByAgent> = {};
        consumptions.forEach((t) => {
          if (t.agentId) {
            if (!agentUsage[t.agentId]) {
              agentUsage[t.agentId] = {
                agentId: t.agentId,
                agentName: t.agentId, // Would be looked up
                tokensUsed: 0,
                transactionCount: 0,
                averagePerTransaction: 0,
              };
            }
            agentUsage[t.agentId].tokensUsed += t.amount;
            agentUsage[t.agentId].transactionCount += 1;
          }
        });
        
        const topAgents = Object.values(agentUsage)
          .map((a) => ({
            ...a,
            averagePerTransaction: a.tokensUsed / a.transactionCount,
          }))
          .sort((a, b) => b.tokensUsed - a.tokensUsed)
          .slice(0, 5);
        
        // Sphere usage
        const sphereUsage: Record<string, number> = {};
        Object.values(budgets).forEach((b) => {
          if (!sphereUsage[b.sphereId]) sphereUsage[b.sphereId] = 0;
          sphereUsage[b.sphereId] += b.totalUsed;
        });
        
        const topSpheres = Object.entries(sphereUsage)
          .map(([sphereId, tokensUsed]) => ({ sphereId: sphereId as SphereId, tokensUsed }))
          .sort((a, b) => b.tokensUsed - a.tokensUsed);
        
        return {
          totalUsedToday,
          totalUsedThisWeek,
          totalUsedThisMonth,
          averageDailyUsage: totalUsedThisMonth / 30,
          topAgents,
          topSpheres,
          efficiency: 85, // Would be calculated based on encoding effectiveness
        };
      },

      getTransactionHistory: (filters?: TransactionFilters): TokenTransaction[] => {
        let result = [...get().transactions];
        
        if (filters) {
          if (filters.budgetId) result = result.filter((t) => t.budgetId === filters.budgetId);
          if (filters.threadId) result = result.filter((t) => t.threadId === filters.threadId);
          if (filters.agentId) result = result.filter((t) => t.agentId === filters.agentId);
          if (filters.type) result = result.filter((t) => t.type === filters.type);
          if (filters.startDate) result = result.filter((t) => t.timestamp >= filters.startDate!);
          if (filters.endDate) result = result.filter((t) => t.timestamp <= filters.endDate!);
        }
        
        result.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        
        if (filters?.limit) {
          result = result.slice(0, filters.limit);
        }
        
        return result;
      },

      // ─────────────────────────────────────────────────────────
      // Governance
      // ─────────────────────────────────────────────────────────
      requestBudgetIncrease: async (budgetId: string, amount: number, justification: string): Promise<boolean> => {
        // In production, this would create a governance request
        console.log('Budget increase requested:', { budgetId, amount, justification });
        return true;
      },

      approveBudgetIncrease: (requestId: string): void => {
        // In production, this would approve a pending request
        console.log('Budget increase approved:', requestId);
      },
    }),
    {
      name: 'chenu-tokens-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useGlobalBalance = () => useTokenStore((state) => state.globalBalance);
export const useBudgets = () => useTokenStore((state) => Object.values(state.budgets));
export const useTokenAnalytics = () => useTokenStore((state) => state.getAnalytics());

export default useTokenStore;
