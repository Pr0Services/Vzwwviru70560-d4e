/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — DASHBOARD STATS HOOK
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  decisions: {
    total: number;
    pending: number;
    byAging: {
      GREEN: number;
      YELLOW: number;
      RED: number;
      BLINK: number;
    };
  };
  threads: {
    active: number;
    total: number;
    recent: number;
  };
  agents: {
    hired: number;
    available: number;
    active: number;
  };
  tokens: {
    used: number;
    budget: number;
    remaining: number;
    percentUsed: number;
  };
  checkpoints: {
    pending: number;
    approved: number;
    rejected: number;
  };
  memory: {
    items: number;
    sizeKb: number;
    hotItems: number;
    warmItems: number;
    coldItems: number;
  };
  spheres: {
    active: number;
    total: number;
    mostActive: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'thread' | 'decision' | 'agent' | 'checkpoint' | 'memory';
  action: string;
  description: string;
  timestamp: string;
  threadId?: string;
  sphereId?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  shortcut?: string;
  enabled: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: () => apiClient.get<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD.STATS),
    staleTime: STALE_TIMES.FREQUENT,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Fetch recent activity
 */
export function useRecentActivity(limit: number = 10) {
  return useQuery<RecentActivity[]>({
    queryKey: [...QUERY_KEYS.DASHBOARD_ACTIVITY, { limit }],
    queryFn: () => apiClient.get<RecentActivity[]>(
      API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITY,
      { params: { limit } }
    ),
    staleTime: STALE_TIMES.REALTIME,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Fetch quick actions
 */
export function useQuickActions() {
  return useQuery<QuickAction[]>({
    queryKey: ['dashboard', 'quick-actions'],
    queryFn: () => apiClient.get<QuickAction[]>(API_CONFIG.ENDPOINTS.DASHBOARD.QUICK_ACTIONS),
    staleTime: STALE_TIMES.STATIC,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all dashboard data at once
 */
export function useDashboardData() {
  const stats = useDashboardStats();
  const activity = useRecentActivity();
  const quickActions = useQuickActions();

  return {
    stats: stats.data,
    activity: activity.data,
    quickActions: quickActions.data,
    isLoading: stats.isLoading || activity.isLoading || quickActions.isLoading,
    isError: stats.isError || activity.isError || quickActions.isError,
    error: stats.error || activity.error || quickActions.error,
    refetch: () => {
      stats.refetch();
      activity.refetch();
      quickActions.refetch();
    },
  };
}
