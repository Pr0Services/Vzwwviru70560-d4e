/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENT HOOKS                                     ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
} from '@tanstack/react-query'
import { apiGet, apiPost, queryKeys } from './client'
import type {
  Agent,
  AgentFilters,
  HiredAgent,
  HireAgentRequest,
  HireAgentResponse,
  AgentTask,
  PaginatedResponse,
  UUID,
} from '@/types/api.generated'

// ============================================================================
// AGENT LIST HOOKS
// ============================================================================

/**
 * Get available agents with filters
 */
export function useAgents(filters?: AgentFilters) {
  return useQuery({
    queryKey: queryKeys.agents.list(filters),
    queryFn: () => apiGet<PaginatedResponse<Agent>>('/agents', { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes - agent catalog doesn't change often
  })
}

/**
 * Get single agent details
 */
export function useAgent(agentId: UUID | undefined) {
  return useQuery({
    queryKey: queryKeys.agents.detail(agentId || ''),
    queryFn: () => apiGet<Agent>(`/agents/${agentId}`),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get user's hired agents
 */
export function useHiredAgents() {
  return useQuery({
    queryKey: queryKeys.agents.hired(),
    queryFn: () => apiGet<HiredAgent[]>('/agents/hired'),
    staleTime: 30 * 1000, // 30 seconds - hired status changes
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Get tasks for a hired agent
 */
export function useAgentTasks(hiredAgentId: UUID | undefined) {
  return useQuery({
    queryKey: queryKeys.agents.tasks(hiredAgentId || ''),
    queryFn: () => apiGet<AgentTask[]>(`/agents/hired/${hiredAgentId}/tasks`),
    enabled: !!hiredAgentId,
    staleTime: 10 * 1000, // 10 seconds
  })
}

// ============================================================================
// AGENT ACTION HOOKS
// ============================================================================

/**
 * Hire an agent
 */
export function useHireAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ agentId, ...data }: HireAgentRequest & { agentId: UUID }) => 
      apiPost<HireAgentResponse>(`/agents/${agentId}/hire`, data),
    onSuccess: (response) => {
      // Add to hired agents
      queryClient.setQueryData<HiredAgent[]>(
        queryKeys.agents.hired(),
        (old) => old ? [...old, response.hired_agent] : [response.hired_agent]
      )
      
      // Invalidate token balance (tokens were reserved)
      queryClient.invalidateQueries({ queryKey: ['user', 'tokens'] })
    },
  })
}

/**
 * Pause a hired agent
 */
export function usePauseAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (hiredAgentId: UUID) => 
      apiPost<HiredAgent>(`/agents/hired/${hiredAgentId}/pause`),
    // Optimistic update
    onMutate: async (hiredAgentId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.agents.hired() })
      
      const previousAgents = queryClient.getQueryData<HiredAgent[]>(
        queryKeys.agents.hired()
      )
      
      if (previousAgents) {
        queryClient.setQueryData<HiredAgent[]>(
          queryKeys.agents.hired(),
          previousAgents.map(a => 
            a.id === hiredAgentId ? { ...a, status: 'paused' } : a
          )
        )
      }
      
      return { previousAgents }
    },
    onError: (_err, _id, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(queryKeys.agents.hired(), context.previousAgents)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.hired() })
    },
  })
}

/**
 * Resume a paused agent
 */
export function useResumeAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (hiredAgentId: UUID) => 
      apiPost<HiredAgent>(`/agents/hired/${hiredAgentId}/resume`),
    onMutate: async (hiredAgentId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.agents.hired() })
      
      const previousAgents = queryClient.getQueryData<HiredAgent[]>(
        queryKeys.agents.hired()
      )
      
      if (previousAgents) {
        queryClient.setQueryData<HiredAgent[]>(
          queryKeys.agents.hired(),
          previousAgents.map(a => 
            a.id === hiredAgentId ? { ...a, status: 'active' } : a
          )
        )
      }
      
      return { previousAgents }
    },
    onError: (_err, _id, context) => {
      if (context?.previousAgents) {
        queryClient.setQueryData(queryKeys.agents.hired(), context.previousAgents)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.hired() })
    },
  })
}

/**
 * Fire (terminate) a hired agent
 */
export function useFireAgent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (hiredAgentId: UUID) => 
      apiPost<{ refund: number }>(`/agents/hired/${hiredAgentId}/fire`),
    onSuccess: (_data, hiredAgentId) => {
      // Remove from hired agents
      queryClient.setQueryData<HiredAgent[]>(
        queryKeys.agents.hired(),
        (old) => old?.filter(a => a.id !== hiredAgentId) || []
      )
      
      // Invalidate token balance (refund issued)
      queryClient.invalidateQueries({ queryKey: ['user', 'tokens'] })
    },
  })
}

// ============================================================================
// AGENT UTILITIES
// ============================================================================

/**
 * Filter agents by level
 */
export function useAgentsByLevel(level: Agent['level']) {
  const { data: agents, ...rest } = useAgents({ level })
  return { data: agents?.items, ...rest }
}

/**
 * Get active hired agents only
 */
export function useActiveHiredAgents() {
  const { data: hiredAgents, ...rest } = useHiredAgents()
  
  return {
    data: hiredAgents?.filter(a => a.status === 'active'),
    ...rest,
  }
}

/**
 * Check if an agent is hired
 */
export function useIsAgentHired(agentId: UUID) {
  const { data: hiredAgents } = useHiredAgents()
  return hiredAgents?.some(a => a.agent_id === agentId) || false
}

/**
 * Get hired agent by agent ID
 */
export function useHiredAgentByAgentId(agentId: UUID | undefined) {
  const { data: hiredAgents } = useHiredAgents()
  return hiredAgents?.find(a => a.agent_id === agentId)
}

/**
 * Prefetch agent catalog
 */
export async function prefetchAgents(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.agents.list({}),
    queryFn: () => apiGet<PaginatedResponse<Agent>>('/agents'),
  })
}

/**
 * Calculate estimated cost for hiring
 */
export function useEstimatedCost(agentId: UUID | undefined, tokenBudget: number) {
  const { data: agent } = useAgent(agentId)
  
  if (!agent) return null
  
  return {
    tokens: tokenBudget,
    cost: agent.cost_per_token * tokenBudget,
    duration_estimate: Math.round(tokenBudget / agent.average_response_time),
  }
}
