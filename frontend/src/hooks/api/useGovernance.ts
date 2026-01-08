/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — GOVERNANCE HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type CheckpointType = 'governance' | 'cost' | 'identity' | 'sensitive' | 'cross_sphere';
export type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type CheckpointPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Checkpoint {
  id: string;
  type: CheckpointType;
  status: CheckpointStatus;
  priority: CheckpointPriority;
  title: string;
  description: string;
  context?: Record<string, unknown>;
  thread_id?: string;
  thread_title?: string;
  agent_id?: string;
  agent_name?: string;
  requested_action: string;
  options: CheckpointOption[];
  created_at: string;
  expires_at?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_note?: string;
}

export interface CheckpointOption {
  id: string;
  label: string;
  action: 'approve' | 'reject' | 'defer' | 'modify';
  description?: string;
  is_default?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor_id: string;
  actor_name: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  timestamp: string;
  ip_address?: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  scope: 'global' | 'sphere' | 'thread';
  rules: PolicyRule[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'block' | 'warn' | 'checkpoint' | 'log';
  message: string;
}

export interface CheckpointFilters {
  status?: CheckpointStatus;
  type?: CheckpointType;
  priority?: CheckpointPriority;
  thread_id?: string;
  limit?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch checkpoints with optional filters
 */
export function useCheckpoints(filters?: CheckpointFilters) {
  return useQuery<Checkpoint[]>({
    queryKey: [...QUERY_KEYS.CHECKPOINTS, filters],
    queryFn: () => apiClient.get<Checkpoint[]>(
      API_CONFIG.ENDPOINTS.GOVERNANCE.CHECKPOINTS,
      { params: filters as Record<string, string | number | boolean | undefined> }
    ),
    staleTime: STALE_TIMES.REALTIME,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Fetch pending checkpoints only
 */
export function usePendingCheckpoints() {
  return useCheckpoints({ status: 'pending' });
}

/**
 * Fetch single checkpoint by ID
 */
export function useCheckpoint(checkpointId: string | undefined) {
  return useQuery<Checkpoint>({
    queryKey: QUERY_KEYS.CHECKPOINT(checkpointId || ''),
    queryFn: () => apiClient.get<Checkpoint>(
      API_CONFIG.ENDPOINTS.GOVERNANCE.CHECKPOINT_DETAIL(checkpointId!)
    ),
    enabled: !!checkpointId,
    staleTime: STALE_TIMES.REALTIME,
  });
}

/**
 * Fetch audit log
 */
export function useAuditLog(filters?: { limit?: number; actor_id?: string; target_type?: string }) {
  return useQuery<AuditLogEntry[]>({
    queryKey: [...QUERY_KEYS.AUDIT_LOG, filters],
    queryFn: () => apiClient.get<AuditLogEntry[]>(
      API_CONFIG.ENDPOINTS.GOVERNANCE.AUDIT_LOG,
      { params: filters as Record<string, string | number | boolean | undefined> }
    ),
    staleTime: STALE_TIMES.FREQUENT,
  });
}

/**
 * Fetch governance policies
 */
export function useGovernancePolicies() {
  return useQuery<GovernancePolicy[]>({
    queryKey: ['governance', 'policies'],
    queryFn: () => apiClient.get<GovernancePolicy[]>(API_CONFIG.ENDPOINTS.GOVERNANCE.POLICIES),
    staleTime: STALE_TIMES.STATIC,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Approve a checkpoint
 */
export function useApproveCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checkpoint_id, note }: { checkpoint_id: string; note?: string }) =>
      apiClient.post<Checkpoint>(API_CONFIG.ENDPOINTS.GOVERNANCE.RESOLVE, { 
        checkpoint_id, 
        decision: 'approve',
        note 
      }),
    onSuccess: (_, { checkpoint_id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKPOINT(checkpoint_id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKPOINTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOG });
    },
  });
}

/**
 * Reject a checkpoint
 */
export function useRejectCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checkpoint_id, reason }: { checkpoint_id: string; reason: string }) =>
      apiClient.post<Checkpoint>(API_CONFIG.ENDPOINTS.GOVERNANCE.RESOLVE, { 
        checkpoint_id, 
        decision: 'reject',
        note: reason 
      }),
    onSuccess: (_, { checkpoint_id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKPOINT(checkpoint_id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECKPOINTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOG });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get checkpoint counts by status
 */
export function useCheckpointCounts() {
  const { data: checkpoints } = useCheckpoints();

  if (!checkpoints) {
    return { pending: 0, approved: 0, rejected: 0, total: 0 };
  }

  return {
    pending: checkpoints.filter(c => c.status === 'pending').length,
    approved: checkpoints.filter(c => c.status === 'approved').length,
    rejected: checkpoints.filter(c => c.status === 'rejected').length,
    total: checkpoints.length,
  };
}

/**
 * Check if there are critical pending checkpoints
 */
export function useHasCriticalCheckpoints() {
  const { data: pending } = usePendingCheckpoints();
  return pending?.some(c => c.priority === 'critical') ?? false;
}
