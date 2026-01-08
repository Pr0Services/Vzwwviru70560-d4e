/**
 * CHE·NU™ V75 — useActivity Hook
 * 
 * Activity Feed API Hook
 * GOUVERNANCE > EXÉCUTION
 * 
 * NOTE: Activity feed uses CHRONOLOGICAL order only (R&D Rule #5)
 * NO ranking algorithms allowed.
 */

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Activity {
  id: string;
  activity_type: ActivityType;
  actor: {
    type: 'user' | 'agent' | 'system';
    id: string;
    name: string;
    avatar_url?: string;
  };
  target: {
    type: string;
    id: string;
    name: string;
  };
  action: string;
  description: string;
  metadata: Record<string, unknown>;
  sphere_id?: string;
  thread_id?: string;
  // CHRONOLOGICAL ORDER ONLY - No ranking score
  created_at: string;
}

export type ActivityType = 
  | 'thread_created'
  | 'thread_updated'
  | 'decision_recorded'
  | 'agent_hired'
  | 'agent_dismissed'
  | 'checkpoint_approved'
  | 'checkpoint_rejected'
  | 'file_uploaded'
  | 'note_added'
  | 'comment_added'
  | 'mention'
  | 'system_event';

export interface ActivityStats {
  total_today: number;
  total_week: number;
  by_type: Record<ActivityType, number>;
  most_active_threads: Array<{ thread_id: string; count: number }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const activityKeys = {
  all: ['activity'] as const,
  feed: () => [...activityKeys.all, 'feed'] as const,
  feedFiltered: (filters: Record<string, unknown>) => [...activityKeys.feed(), filters] as const,
  byThread: (threadId: string) => [...activityKeys.all, 'thread', threadId] as const,
  bySphere: (sphereId: string) => [...activityKeys.all, 'sphere', sphereId] as const,
  stats: () => [...activityKeys.all, 'stats'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch activity feed (CHRONOLOGICAL ORDER - NO RANKING)
 * 
 * R&D RULE #5 COMPLIANCE: This feed ALWAYS returns activities
 * sorted by created_at DESC (newest first). No engagement-based
 * ranking is allowed.
 */
export function useActivityFeed(filters?: {
  type?: ActivityType;
  sphere_id?: string;
  thread_id?: string;
  actor_type?: 'user' | 'agent' | 'system';
  limit?: number;
}) {
  return useQuery({
    queryKey: activityKeys.feedFiltered(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.sphere_id) params.append('sphere_id', filters.sphere_id);
      if (filters?.thread_id) params.append('thread_id', filters.thread_id);
      if (filters?.actor_type) params.append('actor_type', filters.actor_type);
      if (filters?.limit) params.append('limit', String(filters.limit));
      
      // IMPORTANT: Server MUST order by created_at DESC
      // No ranking parameter allowed
      const response = await apiClient.get(`/activity?${params.toString()}`);
      return response.data as { activities: Activity[]; total: number };
    },
  });
}

/**
 * Infinite scroll activity feed (CHRONOLOGICAL)
 */
export function useInfiniteActivityFeed(filters?: {
  type?: ActivityType;
  sphere_id?: string;
}) {
  return useInfiniteQuery({
    queryKey: [...activityKeys.feedFiltered(filters || {}), 'infinite'],
    queryFn: async ({ pageParam = undefined }) => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.sphere_id) params.append('sphere_id', filters.sphere_id);
      if (pageParam) params.append('cursor', pageParam);
      params.append('limit', '20');
      
      const response = await apiClient.get(`/activity?${params.toString()}`);
      return response.data as { 
        activities: Activity[]; 
        next_cursor?: string;
        has_more: boolean;
      };
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    initialPageParam: undefined,
  });
}

/**
 * Fetch activity for specific thread (CHRONOLOGICAL)
 */
export function useThreadActivity(threadId: string) {
  return useQuery({
    queryKey: activityKeys.byThread(threadId),
    queryFn: async () => {
      const response = await apiClient.get(`/activity?thread_id=${threadId}`);
      return response.data as { activities: Activity[]; total: number };
    },
    enabled: !!threadId,
  });
}

/**
 * Fetch activity for specific sphere (CHRONOLOGICAL)
 */
export function useSphereActivity(sphereId: string) {
  return useQuery({
    queryKey: activityKeys.bySphere(sphereId),
    queryFn: async () => {
      const response = await apiClient.get(`/activity?sphere_id=${sphereId}`);
      return response.data as { activities: Activity[]; total: number };
    },
    enabled: !!sphereId,
  });
}

/**
 * Fetch activity stats
 */
export function useActivityStats() {
  return useQuery({
    queryKey: activityKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/activity/stats');
      return response.data as ActivityStats;
    },
  });
}

/**
 * Fetch recent activity (last 24 hours, CHRONOLOGICAL)
 */
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: [...activityKeys.feed(), 'recent', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/activity/recent?limit=${limit}`);
      return response.data as { activities: Activity[] };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export default {
  useActivityFeed,
  useInfiniteActivityFeed,
  useThreadActivity,
  useSphereActivity,
  useActivityStats,
  useRecentActivity,
};
