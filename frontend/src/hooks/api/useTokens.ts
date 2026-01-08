/**
 * CHE·NU™ V75 — useTokens Hook
 * 
 * Token Management API Hook
 * GOUVERNANCE > EXÉCUTION
 * 
 * Tokens = Internal currency for AI operations
 * NOT cryptocurrency - governance resource only
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface TokenBalance {
  total: number;
  available: number;
  reserved: number;
  spent_today: number;
  spent_this_month: number;
  daily_limit: number;
  monthly_limit: number;
}

export interface TokenTransaction {
  id: string;
  type: 'credit' | 'debit' | 'reserve' | 'release';
  amount: number;
  balance_after: number;
  description: string;
  source: {
    type: 'agent' | 'nova' | 'system' | 'purchase' | 'bonus';
    id?: string;
    name?: string;
  };
  thread_id?: string;
  agent_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface TokenBudget {
  id: string;
  name: string;
  budget_type: 'agent' | 'thread' | 'sphere' | 'daily' | 'monthly';
  target_id?: string;
  limit: number;
  used: number;
  remaining: number;
  reset_at?: string;
  created_at: string;
}

export interface TokenUsageStats {
  total_spent: number;
  total_credited: number;
  by_agent: Array<{ agent_id: string; agent_name: string; tokens: number }>;
  by_sphere: Array<{ sphere_id: string; sphere_name: string; tokens: number }>;
  by_day: Array<{ date: string; tokens: number }>;
  average_daily: number;
  projected_monthly: number;
}

export interface TokenPricing {
  packages: Array<{
    id: string;
    name: string;
    tokens: number;
    price: number;
    currency: string;
    bonus_tokens: number;
    popular: boolean;
  }>;
  subscription_tiers: Array<{
    id: string;
    name: string;
    monthly_tokens: number;
    price_monthly: number;
    price_yearly: number;
    features: string[];
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const tokenKeys = {
  all: ['tokens'] as const,
  balance: () => [...tokenKeys.all, 'balance'] as const,
  transactions: () => [...tokenKeys.all, 'transactions'] as const,
  transactionsList: (filters: Record<string, unknown>) => [...tokenKeys.transactions(), filters] as const,
  budgets: () => [...tokenKeys.all, 'budgets'] as const,
  budget: (id: string) => [...tokenKeys.budgets(), id] as const,
  stats: () => [...tokenKeys.all, 'stats'] as const,
  pricing: () => [...tokenKeys.all, 'pricing'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch current token balance
 */
export function useTokenBalance() {
  return useQuery({
    queryKey: tokenKeys.balance(),
    queryFn: async () => {
      const response = await apiClient.get('/tokens/balance');
      return response.data as TokenBalance;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Fetch token transactions
 */
export function useTokenTransactions(filters?: {
  type?: 'credit' | 'debit';
  source_type?: string;
  thread_id?: string;
  agent_id?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: tokenKeys.transactionsList(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.source_type) params.append('source_type', filters.source_type);
      if (filters?.thread_id) params.append('thread_id', filters.thread_id);
      if (filters?.agent_id) params.append('agent_id', filters.agent_id);
      if (filters?.from_date) params.append('from_date', filters.from_date);
      if (filters?.to_date) params.append('to_date', filters.to_date);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      
      const response = await apiClient.get(`/tokens/transactions?${params.toString()}`);
      return response.data as { transactions: TokenTransaction[]; total: number };
    },
  });
}

/**
 * Fetch token budgets
 */
export function useTokenBudgets() {
  return useQuery({
    queryKey: tokenKeys.budgets(),
    queryFn: async () => {
      const response = await apiClient.get('/tokens/budgets');
      return response.data as { budgets: TokenBudget[] };
    },
  });
}

/**
 * Fetch single budget
 */
export function useTokenBudget(budgetId: string) {
  return useQuery({
    queryKey: tokenKeys.budget(budgetId),
    queryFn: async () => {
      const response = await apiClient.get(`/tokens/budgets/${budgetId}`);
      return response.data as TokenBudget;
    },
    enabled: !!budgetId,
  });
}

/**
 * Create token budget
 */
export function useCreateTokenBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      name: string;
      budget_type: 'agent' | 'thread' | 'sphere' | 'daily' | 'monthly';
      target_id?: string;
      limit: number;
    }) => {
      const response = await apiClient.post('/tokens/budgets', data);
      return response.data as TokenBudget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.budgets() });
    },
  });
}

/**
 * Update token budget
 */
export function useUpdateTokenBudget(budgetId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name?: string; limit?: number }) => {
      const response = await apiClient.patch(`/tokens/budgets/${budgetId}`, data);
      return response.data as TokenBudget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.budgets() });
    },
  });
}

/**
 * Delete token budget
 */
export function useDeleteTokenBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (budgetId: string) => {
      await apiClient.delete(`/tokens/budgets/${budgetId}`);
      return budgetId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.budgets() });
    },
  });
}

/**
 * Fetch token usage stats
 */
export function useTokenStats(period?: 'day' | 'week' | 'month' | 'year') {
  return useQuery({
    queryKey: [...tokenKeys.stats(), period],
    queryFn: async () => {
      const params = period ? `?period=${period}` : '';
      const response = await apiClient.get(`/tokens/stats${params}`);
      return response.data as TokenUsageStats;
    },
  });
}

/**
 * Fetch token pricing
 */
export function useTokenPricing() {
  return useQuery({
    queryKey: tokenKeys.pricing(),
    queryFn: async () => {
      const response = await apiClient.get('/tokens/pricing');
      return response.data as TokenPricing;
    },
    staleTime: Infinity, // Pricing doesn't change often
  });
}

/**
 * Reserve tokens for operation
 */
export function useReserveTokens() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { amount: number; purpose: string; thread_id?: string; agent_id?: string }) => {
      const response = await apiClient.post('/tokens/reserve', data);
      return response.data as { reservation_id: string; amount: number; expires_at: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.balance() });
    },
  });
}

/**
 * Release reserved tokens
 */
export function useReleaseTokens() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await apiClient.post(`/tokens/release/${reservationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.balance() });
    },
  });
}

export default {
  useTokenBalance,
  useTokenTransactions,
  useTokenBudgets,
  useTokenBudget,
  useCreateTokenBudget,
  useUpdateTokenBudget,
  useDeleteTokenBudget,
  useTokenStats,
  useTokenPricing,
  useReserveTokens,
  useReleaseTokens,
};
