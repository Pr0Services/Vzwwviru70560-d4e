/**
 * CHE·NU™ Governance & XR Hooks
 * 
 * TanStack Query hooks for:
 * - Thread lobby data
 * - Maturity fetching
 * - XR blueprints
 * - Governance signals and decisions
 * - Backlog management
 * 
 * R&D Compliance:
 * - Rule #1: All mutations respect human gates
 * - Rule #6: All operations are traceable
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ThreadLobbyData,
  MaturityResult,
  XRBlueprint,
  XRPreflightData,
  GovernanceSignal,
  OrchestratorDecisionResult,
  BacklogItem,
  GovernanceDashboardData,
  BacklogSeverity,
  BacklogType,
  ThreadEntryMode,
  XRActionUpdatePayload,
  XRActionCreatePayload,
  XRNotePayload,
  ApiResponse,
  CheckpointResponse,
} from '../types/governance-xr.types';

// =============================================================================
// API CLIENT (would be imported from a shared module in production)
// =============================================================================

const API_BASE = '/api/v2';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  // Handle HTTP 423 (checkpoint required)
  if (response.status === 423) {
    const checkpoint = await response.json();
    throw { type: 'checkpoint', data: checkpoint as CheckpointResponse };
  }

  // Handle HTTP 403 (identity boundary)
  if (response.status === 403) {
    const error = await response.json();
    throw { type: 'forbidden', data: error };
  }

  if (!response.ok) {
    const error = await response.json();
    throw { type: 'error', data: error };
  }

  return response.json();
}

// =============================================================================
// QUERY KEYS
// =============================================================================

export const governanceKeys = {
  all: ['governance'] as const,
  signals: (threadId: string) => [...governanceKeys.all, 'signals', threadId] as const,
  decisions: (threadId: string) => [...governanceKeys.all, 'decisions', threadId] as const,
  backlog: (threadId: string) => [...governanceKeys.all, 'backlog', threadId] as const,
  dashboard: (threadId: string) => [...governanceKeys.all, 'dashboard', threadId] as const,
};

export const maturityKeys = {
  all: ['maturity'] as const,
  thread: (threadId: string) => [...maturityKeys.all, threadId] as const,
};

export const xrKeys = {
  all: ['xr'] as const,
  lobby: (threadId: string) => [...xrKeys.all, 'lobby', threadId] as const,
  preflight: (threadId: string) => [...xrKeys.all, 'preflight', threadId] as const,
  blueprint: (threadId: string) => [...xrKeys.all, 'blueprint', threadId] as const,
};

// =============================================================================
// THREAD LOBBY HOOKS
// =============================================================================

/**
 * Fetch thread lobby data including maturity, summary, and mode recommendations
 */
export function useThreadLobby(threadId: string) {
  return useQuery({
    queryKey: xrKeys.lobby(threadId),
    queryFn: async () => {
      const response = await fetchApi<ThreadLobbyData>(
        `/threads/${threadId}/lobby`
      );
      return response.data!;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// =============================================================================
// MATURITY HOOKS
// =============================================================================

/**
 * Fetch thread maturity score and signals
 */
export function useThreadMaturity(threadId: string) {
  return useQuery({
    queryKey: maturityKeys.thread(threadId),
    queryFn: async () => {
      const response = await fetchApi<MaturityResult>(
        `/threads/${threadId}/maturity`
      );
      return response.data!;
    },
    staleTime: 60 * 1000, // 1 minute (maturity is cached server-side)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Force recompute maturity (useful after significant changes)
 */
export function useRecomputeMaturity(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetchApi<MaturityResult>(
        `/threads/${threadId}/maturity/recompute`,
        { method: 'POST' }
      );
      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(maturityKeys.thread(threadId), data);
    },
  });
}

// =============================================================================
// XR HOOKS
// =============================================================================

/**
 * Fetch XR preflight data (requirements, permissions, privacy)
 */
export function useXRPreflight(threadId: string) {
  return useQuery({
    queryKey: xrKeys.preflight(threadId),
    queryFn: async () => {
      const response = await fetchApi<XRPreflightData>(
        `/threads/${threadId}/xr/preflight`
      );
      return response.data!;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Generate XR blueprint for thread
 */
export function useXRBlueprint(threadId: string, enabled = true) {
  return useQuery({
    queryKey: xrKeys.blueprint(threadId),
    queryFn: async () => {
      const response = await fetchApi<XRBlueprint>(
        `/threads/${threadId}/xr/blueprint`
      );
      return response.data!;
    },
    enabled,
    staleTime: 30 * 1000, // Blueprint should refresh more often
  });
}

/**
 * Update action status from XR interaction
 * Creates ACTION_UPDATED event
 */
export function useXRActionUpdate(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: XRActionUpdatePayload) => {
      const response = await fetchApi<{ event_id: string }>(
        `/threads/${threadId}/xr/actions/${payload.action_id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      );
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate blueprint to reflect changes
      queryClient.invalidateQueries({ queryKey: xrKeys.blueprint(threadId) });
      // Also invalidate maturity (action completion affects score)
      queryClient.invalidateQueries({ queryKey: maturityKeys.thread(threadId) });
    },
  });
}

/**
 * Create new action from XR interaction
 * Creates ACTION_CREATED event
 */
export function useXRActionCreate(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: XRActionCreatePayload) => {
      const response = await fetchApi<{ event_id: string; action_id: string }>(
        `/threads/${threadId}/xr/actions`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: xrKeys.blueprint(threadId) });
      queryClient.invalidateQueries({ queryKey: maturityKeys.thread(threadId) });
    },
  });
}

/**
 * Add note from XR interaction
 * Creates MESSAGE_POSTED event
 */
export function useXRNoteAdd(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: XRNotePayload) => {
      const response = await fetchApi<{ event_id: string; note_id: string }>(
        `/threads/${threadId}/xr/notes`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: xrKeys.blueprint(threadId) });
    },
  });
}

// =============================================================================
// GOVERNANCE HOOKS
// =============================================================================

/**
 * Fetch recent governance signals for thread
 */
export function useGovernanceSignals(threadId: string, limit = 20) {
  return useQuery({
    queryKey: [...governanceKeys.signals(threadId), limit],
    queryFn: async () => {
      const response = await fetchApi<GovernanceSignal[]>(
        `/threads/${threadId}/governance/signals?limit=${limit}`
      );
      return response.data!;
    },
    staleTime: 10 * 1000, // 10 seconds
  });
}

/**
 * Fetch recent orchestrator decisions for thread
 */
export function useOrchestratorDecisions(threadId: string, limit = 20) {
  return useQuery({
    queryKey: [...governanceKeys.decisions(threadId), limit],
    queryFn: async () => {
      const response = await fetchApi<OrchestratorDecisionResult[]>(
        `/threads/${threadId}/governance/decisions?limit=${limit}`
      );
      return response.data!;
    },
    staleTime: 10 * 1000,
  });
}

/**
 * Fetch governance dashboard data (aggregated view)
 */
export function useGovernanceDashboard(threadId: string) {
  return useQuery({
    queryKey: governanceKeys.dashboard(threadId),
    queryFn: async () => {
      const response = await fetchApi<GovernanceDashboardData>(
        `/threads/${threadId}/governance/dashboard`
      );
      return response.data!;
    },
    staleTime: 30 * 1000,
  });
}

// =============================================================================
// BACKLOG HOOKS
// =============================================================================

interface BacklogFilters {
  type?: BacklogType;
  severity?: BacklogSeverity;
  status?: 'open' | 'resolved' | 'all';
}

/**
 * Fetch backlog items for thread
 */
export function useBacklogItems(threadId: string, filters: BacklogFilters = {}) {
  return useQuery({
    queryKey: [...governanceKeys.backlog(threadId), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.status) params.set('status', filters.status);

      const response = await fetchApi<BacklogItem[]>(
        `/threads/${threadId}/governance/backlog?${params}`
      );
      return response.data!;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Resolve a backlog item
 */
export function useResolveBacklogItem(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      resolution,
    }: {
      itemId: string;
      resolution: string;
    }) => {
      const response = await fetchApi<BacklogItem>(
        `/threads/${threadId}/governance/backlog/${itemId}/resolve`,
        {
          method: 'POST',
          body: JSON.stringify({ resolution }),
        }
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.backlog(threadId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.dashboard(threadId) });
    },
  });
}

/**
 * Create manual backlog item
 */
export function useCreateBacklogItem(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      description?: string;
      type: BacklogType;
      severity: BacklogSeverity;
    }) => {
      const response = await fetchApi<BacklogItem>(
        `/threads/${threadId}/governance/backlog`,
        {
          method: 'POST',
          body: JSON.stringify(item),
        }
      );
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.backlog(threadId) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.dashboard(threadId) });
    },
  });
}

// =============================================================================
// CHECKPOINT HOOKS
// =============================================================================

/**
 * Approve a checkpoint (HTTP 423 resolution)
 */
export function useApproveCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkpointId: string) => {
      const response = await fetchApi<{ success: boolean }>(
        `/checkpoints/${checkpointId}/approve`,
        { method: 'POST' }
      );
      return response.data!;
    },
    onSuccess: () => {
      // Invalidate all queries as checkpoint resolution can affect many things
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Reject a checkpoint
 */
export function useRejectCheckpoint() {
  return useMutation({
    mutationFn: async ({
      checkpointId,
      reason,
    }: {
      checkpointId: string;
      reason?: string;
    }) => {
      const response = await fetchApi<{ success: boolean }>(
        `/checkpoints/${checkpointId}/reject`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
        }
      );
      return response.data!;
    },
  });
}

// =============================================================================
// MODE ENTRY HOOK
// =============================================================================

/**
 * Enter a thread in a specific mode
 * This doesn't fetch data but tracks the entry for analytics
 */
export function useEnterThreadMode(threadId: string) {
  return useMutation({
    mutationFn: async (mode: ThreadEntryMode) => {
      const response = await fetchApi<{ session_id: string }>(
        `/threads/${threadId}/enter`,
        {
          method: 'POST',
          body: JSON.stringify({ mode }),
        }
      );
      return response.data!;
    },
  });
}

// =============================================================================
// PREFETCH UTILITIES
// =============================================================================

/**
 * Prefetch thread lobby data (useful for link hover)
 */
export function usePrefetchThreadLobby() {
  const queryClient = useQueryClient();

  return (threadId: string) => {
    queryClient.prefetchQuery({
      queryKey: xrKeys.lobby(threadId),
      queryFn: async () => {
        const response = await fetchApi<ThreadLobbyData>(
          `/threads/${threadId}/lobby`
        );
        return response.data!;
      },
      staleTime: 30 * 1000,
    });
  };
}

/**
 * Prefetch XR blueprint (useful before entering XR mode)
 */
export function usePrefetchXRBlueprint() {
  const queryClient = useQueryClient();

  return (threadId: string) => {
    queryClient.prefetchQuery({
      queryKey: xrKeys.blueprint(threadId),
      queryFn: async () => {
        const response = await fetchApi<XRBlueprint>(
          `/threads/${threadId}/xr/blueprint`
        );
        return response.data!;
      },
      staleTime: 30 * 1000,
    });
  };
}

// =============================================================================
// DECISION POINT HOOKS
// =============================================================================

import type {
  DecisionPoint,
  AgingLevel,
  DecisionPointType,
  UserResponseType,
} from '../types/governance-xr.types';

export const decisionPointKeys = {
  all: ['decision-points'] as const,
  list: (filters?: {
    threadId?: string;
    userId?: string;
    agingLevel?: AgingLevel;
    pointType?: DecisionPointType;
  }) => [...decisionPointKeys.all, 'list', filters] as const,
  summary: (userId?: string) => [...decisionPointKeys.all, 'summary', userId] as const,
  urgent: (userId?: string) => [...decisionPointKeys.all, 'urgent', userId] as const,
  detail: (pointId: string) => [...decisionPointKeys.all, 'detail', pointId] as const,
};

/**
 * Fetch decision points with optional filters
 */
export function useDecisionPoints(options?: {
  threadId?: string;
  userId?: string;
  pointType?: DecisionPointType;
  agingLevel?: AgingLevel;
  includeArchived?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: decisionPointKeys.list(options),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.threadId) params.set('thread_id', options.threadId);
      if (options?.userId) params.set('user_id', options.userId);
      if (options?.pointType) params.set('point_type', options.pointType);
      if (options?.agingLevel) params.set('aging_level', options.agingLevel);
      if (options?.includeArchived) params.set('include_archived', 'true');
      if (options?.limit) params.set('limit', options.limit.toString());
      
      const response = await fetchApi<{
        points: DecisionPoint[];
        archived: DecisionPoint[];
        count: number;
      }>(`/governance/decision-points?${params.toString()}`);
      return response.data!;
    },
    staleTime: 10 * 1000, // 10 seconds - decision points change frequently
    refetchInterval: 30 * 1000, // Refetch every 30s to update aging
  });
}

/**
 * Get decision points summary (counts by aging level)
 */
export function useDecisionPointsSummary(userId?: string) {
  return useQuery({
    queryKey: decisionPointKeys.summary(userId),
    queryFn: async () => {
      const params = userId ? `?user_id=${userId}` : '';
      const response = await fetchApi<{
        summary: {
          counts: Record<AgingLevel, number>;
          total_active: number;
          urgent_count: number;
          has_urgent: boolean;
          has_critical: boolean;
        };
      }>(`/governance/decision-points/summary${params}`);
      return response.data!.summary;
    },
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000, // Keep badge counts fresh
  });
}

/**
 * Get urgent decision points only (RED and BLINK)
 */
export function useUrgentDecisionPoints(userId?: string) {
  return useQuery({
    queryKey: decisionPointKeys.urgent(userId),
    queryFn: async () => {
      const params = userId ? `?user_id=${userId}` : '';
      const response = await fetchApi<{
        points: DecisionPoint[];
        count: number;
        has_critical: boolean;
      }>(`/governance/decision-points/urgent${params}`);
      return response.data!;
    },
    staleTime: 5 * 1000, // 5 seconds - urgent items need fresh data
    refetchInterval: 15 * 1000, // Refetch every 15s
  });
}

/**
 * Get a single decision point
 */
export function useDecisionPoint(pointId: string) {
  return useQuery({
    queryKey: decisionPointKeys.detail(pointId),
    queryFn: async () => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}`
      );
      return response.data!.point;
    },
    enabled: !!pointId,
  });
}

/**
 * Create a new decision point
 */
export function useCreateDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      point_type: DecisionPointType;
      thread_id: string;
      title: string;
      description?: string;
      context?: Record<string, unknown>;
      user_id: string;
      generate_suggestion?: boolean;
    }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        '/governance/decision-points',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response.data!.point;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.all });
    },
  });
}

/**
 * Validate (accept) AI suggestion
 */
export function useValidateDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pointId, userId }: { pointId: string; userId: string }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}/validate`,
        {
          method: 'POST',
          body: JSON.stringify({ user_id: userId }),
        }
      );
      return response.data!.point;
    },
    onSuccess: (_, { pointId }) => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.all });
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.detail(pointId) });
    },
  });
}

/**
 * Redirect to alternative action
 */
export function useRedirectDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pointId,
      alternative,
      userId,
      comment,
    }: {
      pointId: string;
      alternative: string;
      userId: string;
      comment?: string;
    }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}/redirect`,
        {
          method: 'POST',
          body: JSON.stringify({ alternative, user_id: userId, comment }),
        }
      );
      return response.data!.point;
    },
    onSuccess: (_, { pointId }) => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.all });
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.detail(pointId) });
    },
  });
}

/**
 * Add comment to decision point
 */
export function useCommentDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pointId,
      comment,
      userId,
    }: {
      pointId: string;
      comment: string;
      userId: string;
    }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}/comment`,
        {
          method: 'POST',
          body: JSON.stringify({ comment, user_id: userId }),
        }
      );
      return response.data!.point;
    },
    onSuccess: (_, { pointId }) => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.detail(pointId) });
    },
  });
}

/**
 * Defer decision point (reset aging to GREEN)
 */
export function useDeferDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pointId, userId }: { pointId: string; userId: string }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}/defer`,
        {
          method: 'POST',
          body: JSON.stringify({ user_id: userId }),
        }
      );
      return response.data!.point;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.all });
    },
  });
}

/**
 * Archive decision point
 */
export function useArchiveDecisionPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pointId,
      userId,
      reason = 'manual',
    }: {
      pointId: string;
      userId: string;
      reason?: string;
    }) => {
      const response = await fetchApi<{ point: DecisionPoint }>(
        `/governance/decision-points/${pointId}/archive`,
        {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, reason }),
        }
      );
      return response.data!.point;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: decisionPointKeys.all });
    },
  });
}

/**
 * Combined hook for decision point actions
 * 
 * Usage:
 * const { validate, redirect, comment, defer, archive, isLoading } = useDecisionPointActions();
 * validate({ pointId: '123', userId: 'user1' });
 */
export function useDecisionPointActions() {
  const validateMutation = useValidateDecisionPoint();
  const redirectMutation = useRedirectDecisionPoint();
  const commentMutation = useCommentDecisionPoint();
  const deferMutation = useDeferDecisionPoint();
  const archiveMutation = useArchiveDecisionPoint();

  return {
    validate: validateMutation.mutate,
    validateAsync: validateMutation.mutateAsync,
    redirect: redirectMutation.mutate,
    redirectAsync: redirectMutation.mutateAsync,
    comment: commentMutation.mutate,
    commentAsync: commentMutation.mutateAsync,
    defer: deferMutation.mutate,
    deferAsync: deferMutation.mutateAsync,
    archive: archiveMutation.mutate,
    archiveAsync: archiveMutation.mutateAsync,
    isLoading:
      validateMutation.isPending ||
      redirectMutation.isPending ||
      commentMutation.isPending ||
      deferMutation.isPending ||
      archiveMutation.isPending,
    error:
      validateMutation.error ||
      redirectMutation.error ||
      commentMutation.error ||
      deferMutation.error ||
      archiveMutation.error,
  };
}
