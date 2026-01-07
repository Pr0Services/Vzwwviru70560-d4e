/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ANALYTICS HOOK
 * Phase 6: Analytics & Reporting
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';

export interface UsageMetrics {
  total_users: number;
  active_users: number;
  new_users: number;
  avg_session_duration_minutes: number;
  avg_sessions_per_user: number;
  total_events: number;
  sphere_usage: Record<string, number>;
  most_used_sphere: string;
  threads_created: number;
  threads_completed: number;
  avg_thread_duration_hours: number;
  agents_hired: number;
  agent_executions: number;
  agent_success_rate: number;
  total_tokens_spent: number;
  total_tokens_purchased: number;
  avg_tokens_per_user: number;
}

export interface AgentPerformance {
  agent_id: string;
  agent_level: string;
  total_executions: number;
  success_rate: number;
  avg_execution_time_seconds: number;
  total_tokens_consumed: number;
  efficiency_score: number;
}

export function useAnalytics() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [topAgents, setTopAgents] = useState<AgentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = useCallback(async (period: '7d' | '30d' | '90d' = '30d') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/analytics/metrics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTopAgents = useCallback(async (limit: number = 10) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/analytics/agents/top?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch top agents');

      const data = await response.json();
      setTopAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/v1/analytics/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to export report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chenu-analytics-${Date.now()}.${format}`;
      a.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  return {
    metrics,
    topAgents,
    isLoading,
    error,
    refreshMetrics,
    fetchTopAgents,
    exportReport,
  };
}
