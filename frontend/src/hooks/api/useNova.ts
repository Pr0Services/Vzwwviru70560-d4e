/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — NOVA HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * Nova = Intelligence System Pipeline
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NovaLane = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type NovaStatus = 'idle' | 'processing' | 'waiting_approval' | 'executing' | 'completed' | 'error';

export interface NovaSystemStatus {
  status: NovaStatus;
  active_lanes: NovaLane[];
  current_task?: string;
  queue_length: number;
  tokens_used_today: number;
  tokens_budget: number;
  last_activity_at: string;
  uptime_seconds: number;
  version: string;
}

export interface NovaLaneStatus {
  lane: NovaLane;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'blocked';
  current_task?: string;
  last_result?: string;
}

export interface NovaQuery {
  query: string;
  context?: {
    thread_id?: string;
    sphere_id?: string;
    intent?: string;
  };
  options?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
  };
}

export interface NovaQueryResponse {
  id: string;
  query: string;
  response: string;
  lanes_used: NovaLane[];
  tokens_used: number;
  processing_time_ms: number;
  checkpoint_required: boolean;
  checkpoint_id?: string;
  suggestions?: NovaSuggestion[];
  created_at: string;
}

export interface NovaSuggestion {
  id: string;
  type: 'action' | 'question' | 'insight' | 'warning';
  title: string;
  description: string;
  confidence: number;
  action?: {
    type: string;
    payload: Record<string, unknown>;
  };
}

export interface NovaHistoryEntry {
  id: string;
  query: string;
  response_preview: string;
  tokens_used: number;
  thread_id?: string;
  sphere_id?: string;
  created_at: string;
}

export interface NovaAnalysis {
  thread_id: string;
  analysis_type: 'intent' | 'progress' | 'blockers' | 'next_steps';
  result: Record<string, unknown>;
  confidence: number;
  suggestions: NovaSuggestion[];
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch Nova system status
 */
export function useNovaStatus() {
  return useQuery<NovaSystemStatus>({
    queryKey: QUERY_KEYS.NOVA_STATUS,
    queryFn: () => apiClient.get<NovaSystemStatus>(API_CONFIG.ENDPOINTS.NOVA.STATUS),
    staleTime: STALE_TIMES.REALTIME,
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
}

/**
 * Fetch Nova query history
 */
export function useNovaHistory(limit: number = 20) {
  return useQuery<NovaHistoryEntry[]>({
    queryKey: [...QUERY_KEYS.NOVA_HISTORY, { limit }],
    queryFn: () => apiClient.get<NovaHistoryEntry[]>(
      API_CONFIG.ENDPOINTS.NOVA.HISTORY,
      { params: { limit } }
    ),
    staleTime: STALE_TIMES.FREQUENT,
  });
}

/**
 * Fetch Nova suggestions for current context
 */
export function useNovaSuggestions(threadId?: string) {
  return useQuery<NovaSuggestion[]>({
    queryKey: ['nova', 'suggestions', { threadId }],
    queryFn: () => apiClient.get<NovaSuggestion[]>(
      API_CONFIG.ENDPOINTS.NOVA.SUGGESTIONS,
      { params: threadId ? { thread_id: threadId } : undefined }
    ),
    staleTime: STALE_TIMES.FREQUENT,
    enabled: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send query to Nova
 */
export function useNovaQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NovaQuery) =>
      apiClient.post<NovaQueryResponse>(API_CONFIG.ENDPOINTS.NOVA.QUERY, input),
    onSuccess: () => {
      // Invalidate Nova history
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOVA_HISTORY });
      // Invalidate Nova status (tokens changed)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOVA_STATUS });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

/**
 * Request Nova analysis on a thread
 */
export function useNovaAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { thread_id: string; analysis_type: NovaAnalysis['analysis_type'] }) =>
      apiClient.post<NovaAnalysis>(API_CONFIG.ENDPOINTS.NOVA.ANALYZE, input),
    onSuccess: (_, { thread_id }) => {
      // Invalidate thread
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREAD(thread_id) });
      // Invalidate Nova history
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOVA_HISTORY });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if Nova is available
 */
export function useNovaAvailable() {
  const { data: status, isLoading, isError } = useNovaStatus();
  
  return {
    isAvailable: !isLoading && !isError && status?.status !== 'error',
    isProcessing: status?.status === 'processing' || status?.status === 'executing',
    isWaitingApproval: status?.status === 'waiting_approval',
    status: status?.status || 'unknown',
  };
}

/**
 * Get Nova token usage
 */
export function useNovaTokenUsage() {
  const { data: status } = useNovaStatus();
  
  if (!status) {
    return { used: 0, budget: 0, remaining: 0, percentUsed: 0 };
  }

  const remaining = status.tokens_budget - status.tokens_used_today;
  const percentUsed = status.tokens_budget > 0 
    ? Math.round((status.tokens_used_today / status.tokens_budget) * 100)
    : 0;

  return {
    used: status.tokens_used_today,
    budget: status.tokens_budget,
    remaining,
    percentUsed,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nova Lane descriptions
 */
export const NOVA_LANES: Record<NovaLane, { name: string; description: string }> = {
  A: { name: 'Intent Analysis', description: 'Comprendre ce que l\'utilisateur veut' },
  B: { name: 'Context Snapshot', description: 'Capturer l\'état actuel des Threads' },
  C: { name: 'Semantic Encoding', description: 'Encoder avant/après exécution AI' },
  D: { name: 'Governance Check', description: 'Vérifier règles et permissions' },
  E: { name: 'Checkpoint', description: 'BLOQUER si action sensible' },
  F: { name: 'Execution', description: 'Exécuter après approval' },
  G: { name: 'Audit', description: 'Logger dans audit trail' },
};
