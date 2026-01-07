/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — GOVERNANCE HOOKS                                ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { apiGet, apiPost, queryKeys } from './client'
import type {
  GovernanceCheckpoint,
  CheckpointStatus,
  ApproveCheckpointRequest,
  RejectCheckpointRequest,
  GovernanceStats,
  AuditLogEntry,
  AuditLogFilters,
  PaginatedResponse,
  UUID,
} from '@/types/api.generated'

// ============================================================================
// CHECKPOINT HOOKS
// ============================================================================

/**
 * Get governance checkpoints
 */
export function useCheckpoints(status?: CheckpointStatus) {
  return useQuery({
    queryKey: queryKeys.governance.checkpoints(status),
    queryFn: () => apiGet<GovernanceCheckpoint[]>('/governance/checkpoints', {
      params: status ? { status } : undefined,
    }),
    staleTime: 10 * 1000, // 10 seconds - checkpoints change frequently
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

/**
 * Get pending checkpoints only
 */
export function usePendingCheckpoints() {
  return useCheckpoints('pending')
}

/**
 * Get single checkpoint
 */
export function useCheckpoint(checkpointId: UUID | undefined) {
  return useQuery({
    queryKey: queryKeys.governance.checkpoint(checkpointId || ''),
    queryFn: () => apiGet<GovernanceCheckpoint>(`/governance/checkpoints/${checkpointId}`),
    enabled: !!checkpointId,
    staleTime: 10 * 1000,
  })
}

/**
 * Approve checkpoint
 */
export function useApproveCheckpoint() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ checkpointId, ...data }: ApproveCheckpointRequest & { checkpointId: UUID }) =>
      apiPost<GovernanceCheckpoint>(`/governance/checkpoints/${checkpointId}/approve`, data),
    // Optimistic update
    onMutate: async ({ checkpointId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.governance.checkpoints() })
      
      const previousCheckpoints = queryClient.getQueryData<GovernanceCheckpoint[]>(
        queryKeys.governance.checkpoints('pending')
      )
      
      // Remove from pending list optimistically
      if (previousCheckpoints) {
        queryClient.setQueryData<GovernanceCheckpoint[]>(
          queryKeys.governance.checkpoints('pending'),
          previousCheckpoints.filter(c => c.id !== checkpointId)
        )
      }
      
      return { previousCheckpoints }
    },
    onError: (_err, _data, context) => {
      if (context?.previousCheckpoints) {
        queryClient.setQueryData(
          queryKeys.governance.checkpoints('pending'),
          context.previousCheckpoints
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.all })
      queryClient.invalidateQueries({ queryKey: ['user', 'tokens'] })
    },
  })
}

/**
 * Reject checkpoint
 */
export function useRejectCheckpoint() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ checkpointId, ...data }: RejectCheckpointRequest & { checkpointId: UUID }) =>
      apiPost<GovernanceCheckpoint>(`/governance/checkpoints/${checkpointId}/reject`, data),
    onMutate: async ({ checkpointId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.governance.checkpoints() })
      
      const previousCheckpoints = queryClient.getQueryData<GovernanceCheckpoint[]>(
        queryKeys.governance.checkpoints('pending')
      )
      
      if (previousCheckpoints) {
        queryClient.setQueryData<GovernanceCheckpoint[]>(
          queryKeys.governance.checkpoints('pending'),
          previousCheckpoints.filter(c => c.id !== checkpointId)
        )
      }
      
      return { previousCheckpoints }
    },
    onError: (_err, _data, context) => {
      if (context?.previousCheckpoints) {
        queryClient.setQueryData(
          queryKeys.governance.checkpoints('pending'),
          context.previousCheckpoints
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.all })
    },
  })
}

// ============================================================================
// GOVERNANCE STATS HOOKS
// ============================================================================

/**
 * Get governance statistics
 */
export function useGovernanceStats() {
  return useQuery({
    queryKey: queryKeys.governance.stats(),
    queryFn: () => apiGet<GovernanceStats>('/governance/stats'),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Check if there are high-risk pending checkpoints
 */
export function useHasHighRiskPending() {
  const { data: stats } = useGovernanceStats()
  return stats?.high_risk_pending && stats.high_risk_pending > 0
}

// ============================================================================
// AUDIT LOG HOOKS
// ============================================================================

/**
 * Get audit log entries with filters
 */
export function useAuditLog(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: queryKeys.governance.audit(filters),
    queryFn: () => apiGet<PaginatedResponse<AuditLogEntry>>('/governance/audit', {
      params: filters,
    }),
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Get infinite scrolling audit log
 */
export function useInfiniteAuditLog(filters?: Omit<AuditLogFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.governance.audit(filters), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      apiGet<PaginatedResponse<AuditLogEntry>>('/governance/audit', {
        params: { ...filters, page: pageParam },
      }),
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000,
  })
}

// ============================================================================
// GOVERNANCE UTILITIES
// ============================================================================

/**
 * Count pending checkpoints by risk level
 */
export function useCheckpointsByRisk() {
  const { data: checkpoints } = usePendingCheckpoints()
  
  if (!checkpoints) return null
  
  return {
    critical: checkpoints.filter(c => c.risk_level === 'critical').length,
    high: checkpoints.filter(c => c.risk_level === 'high').length,
    medium: checkpoints.filter(c => c.risk_level === 'medium').length,
    low: checkpoints.filter(c => c.risk_level === 'low').length,
    total: checkpoints.length,
  }
}

/**
 * Get checkpoints requiring immediate attention
 */
export function useUrgentCheckpoints() {
  const { data: checkpoints, ...rest } = usePendingCheckpoints()
  
  const urgent = checkpoints?.filter(c => 
    c.risk_level === 'critical' || 
    c.risk_level === 'high' ||
    new Date(c.expires_at) < new Date(Date.now() + 60 * 60 * 1000) // Expires in < 1 hour
  )
  
  return { data: urgent, ...rest }
}

/**
 * Get checkpoint expiration status
 */
export function useCheckpointExpiration(checkpoint: GovernanceCheckpoint | undefined) {
  if (!checkpoint) return null
  
  const now = Date.now()
  const expiresAt = new Date(checkpoint.expires_at).getTime()
  const remaining = expiresAt - now
  
  return {
    expiresAt: new Date(checkpoint.expires_at),
    remainingMs: remaining,
    remainingMinutes: Math.floor(remaining / 60000),
    remainingHours: Math.floor(remaining / 3600000),
    isExpired: remaining <= 0,
    isUrgent: remaining > 0 && remaining < 3600000, // Less than 1 hour
    isWarning: remaining > 0 && remaining < 86400000, // Less than 24 hours
  }
}

/**
 * Invalidate all governance queries (after WebSocket update)
 */
export function useInvalidateGovernance() {
  const queryClient = useQueryClient()
  
  return {
    invalidateCheckpoints: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.checkpoints() })
    },
    invalidateStats: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.stats() })
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.all })
    },
  }
}
