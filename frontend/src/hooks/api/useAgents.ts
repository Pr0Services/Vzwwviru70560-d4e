/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — AGENTS HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type AgentStatus = 'available' | 'hired' | 'active' | 'paused' | 'system';

export interface Agent {
  id: string;
  name: string;
  name_fr: string;
  level: AgentLevel;
  domain: string;
  sphere_id?: string;
  sphere_name?: string;
  description: string;
  description_fr: string;
  avatar: string;
  capabilities: string[];
  base_cost: number;
  is_system: boolean;
  is_hireable: boolean;
  status: AgentStatus;
  hired_at?: string;
  last_active_at?: string;
  total_tasks_completed?: number;
  tokens_consumed?: number;
}

export interface AgentSuggestion {
  agent: Agent;
  reason: string;
  confidence: number;
  context?: string;
}

export interface AgentFilters {
  sphere_id?: string;
  level?: AgentLevel;
  domain?: string;
  status?: AgentStatus;
  search?: string;
  is_hireable?: boolean;
}

export interface HireAgentInput {
  agent_id: string;
  thread_id?: string;
  budget_limit?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all agents with optional filters
 */
export function useAgents(filters?: AgentFilters) {
  return useQuery<Agent[]>({
    queryKey: [...QUERY_KEYS.AGENTS, filters],
    queryFn: () => apiClient.get<Agent[]>(API_CONFIG.ENDPOINTS.AGENTS.LIST, {
      params: filters as Record<string, string | number | boolean | undefined>
    }),
    staleTime: STALE_TIMES.STATIC,
  });
}

/**
 * Fetch single agent by ID
 */
export function useAgent(agentId: string | undefined) {
  return useQuery<Agent>({
    queryKey: QUERY_KEYS.AGENT(agentId || ''),
    queryFn: () => apiClient.get<Agent>(API_CONFIG.ENDPOINTS.AGENTS.DETAIL(agentId!)),
    enabled: !!agentId,
    staleTime: STALE_TIMES.STATIC,
  });
}

/**
 * Fetch hired agents
 */
export function useHiredAgents() {
  return useQuery<Agent[]>({
    queryKey: QUERY_KEYS.AGENTS_HIRED,
    queryFn: () => apiClient.get<Agent[]>(API_CONFIG.ENDPOINTS.AGENTS.HIRED),
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch available agents (not hired)
 */
export function useAvailableAgents() {
  return useQuery<Agent[]>({
    queryKey: [...QUERY_KEYS.AGENTS, 'available'],
    queryFn: () => apiClient.get<Agent[]>(API_CONFIG.ENDPOINTS.AGENTS.AVAILABLE),
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch suggested agents based on context
 */
export function useSuggestedAgents(threadId?: string) {
  return useQuery<AgentSuggestion[]>({
    queryKey: [...QUERY_KEYS.AGENTS_SUGGESTED, { threadId }],
    queryFn: () => apiClient.get<AgentSuggestion[]>(
      API_CONFIG.ENDPOINTS.AGENTS.SUGGESTED,
      { params: threadId ? { thread_id: threadId } : undefined }
    ),
    staleTime: STALE_TIMES.FREQUENT,
  });
}

/**
 * Fetch agents by sphere
 */
export function useAgentsBySphere(sphereId: string | undefined) {
  return useAgents(sphereId ? { sphere_id: sphereId } : undefined);
}

/**
 * Fetch agents by level
 */
export function useAgentsByLevel(level: AgentLevel) {
  return useAgents({ level });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hire an agent
 */
export function useHireAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HireAgentInput) =>
      apiClient.post<Agent>(API_CONFIG.ENDPOINTS.AGENTS.HIRE, {
        agent_id: input.agent_id,
        thread_id: input.thread_id,
        budget_limit: input.budget_limit,
      }),
    onSuccess: (_, { agent_id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENT(agent_id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS_HIRED });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

/**
 * Fire (release) an agent
 */
export function useFireAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) =>
      apiClient.post<Agent>(API_CONFIG.ENDPOINTS.AGENTS.FIRE(agentId)),
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENT(agentId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS_HIRED });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get agent counts by status
 */
export function useAgentCounts() {
  const { data: hired } = useHiredAgents();
  const { data: all } = useAgents();

  return {
    hired: hired?.length ?? 0,
    available: all?.filter(a => a.is_hireable && a.status === 'available').length ?? 0,
    total: all?.length ?? 0,
    system: all?.filter(a => a.is_system).length ?? 0,
  };
}
