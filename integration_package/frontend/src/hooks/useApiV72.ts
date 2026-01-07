/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — API HOOKS                                   ║
 * ║                                                                              ║
 * ║  React hooks for API integration with caching and state management          ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface UseApiOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  cacheKey?: string;
  cacheTTL?: number;
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  mutate: (newData: T | ((prev: T | null) => T)) => void;
}

interface UseMutationResult<TData, TVariables> {
  data: TData | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, any>;
}

// Cache store
const cache = new Map<string, { data: any; timestamp: number }>();

// ═══════════════════════════════════════════════════════════════════════════════
// BASE FETCH FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('chenu_access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || `HTTP ${response.status}`,
      status: response.status,
      details: error.details,
    } as ApiError;
  }

  const result = await response.json();
  return result.data ?? result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE API HOOK (GET)
// ═══════════════════════════════════════════════════════════════════════════════

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    cacheKey,
    cacheTTL = CACHE_TTL,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache
    const key = cacheKey || endpoint;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTTL) {
      setData(cached.data);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFetch<T>(endpoint);
      
      if (mountedRef.current) {
        setData(result);
        cache.set(key, { data: result, timestamp: Date.now() });
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const apiError = err as ApiError;
        setError(apiError);
        onError?.(apiError);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [endpoint, enabled, cacheKey, cacheTTL, onSuccess, onError]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(fetchData, refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchData]);

  const mutate = useCallback((newData: T | ((prev: T | null) => T)) => {
    setData(prev => typeof newData === 'function' ? (newData as Function)(prev) : newData);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    mutate,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE MUTATION HOOK (POST/PUT/DELETE)
// ═══════════════════════════════════════════════════════════════════════════════

export function useMutation<TData, TVariables = any>(
  endpoint: string | ((variables: TVariables) => string),
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: ApiError, variables: TVariables) => void;
    invalidateCache?: string[];
  } = {}
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);

    const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;

    try {
      const result = await apiFetch<TData>(url, {
        method,
        body: method !== 'DELETE' ? JSON.stringify(variables) : undefined,
      });

      setData(result);
      
      // Invalidate cache
      options.invalidateCache?.forEach(key => cache.delete(key));
      
      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options.onError?.(apiError, variables);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, method, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, mutate, reset };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIFIC API HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

// Dashboard Stats
export function useDashboardStats() {
  return useApi<{
    decisions_pending: number;
    threads_active: number;
    agents_hired: number;
    checkpoints_pending: number;
    governance_score: number;
  }>('/dashboard/stats', {
    cacheKey: 'dashboard-stats',
    refetchInterval: 30000, // 30 seconds
  });
}

// Spheres
export function useSpheres() {
  return useApi<Array<{
    id: string;
    name_fr: string;
    icon: string;
    color: string;
    stats: {
      threads_count: number;
      decisions_count: number;
    };
  }>>('/spheres', {
    cacheKey: 'spheres',
    cacheTTL: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSphere(id: string) {
  return useApi(`/spheres/${id}`, {
    enabled: !!id,
    cacheKey: `sphere-${id}`,
  });
}

// Threads
export function useThreads(params?: {
  sphere_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = params 
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';
  
  return useApi<Array<{
    id: string;
    title: string;
    founding_intent: string;
    sphere_id: string;
    status: string;
    maturity_level: string;
    maturity_score: number;
    updated_at: string;
  }>>(`/threads${queryString}`, {
    cacheKey: `threads-${JSON.stringify(params)}`,
  });
}

export function useThread(id: string) {
  return useApi(`/threads/${id}`, {
    enabled: !!id,
    cacheKey: `thread-${id}`,
  });
}

export function useCreateThread() {
  return useMutation<any, {
    title: string;
    founding_intent: string;
    sphere_id: string;
  }>('/threads', 'POST', {
    invalidateCache: ['threads'],
  });
}

// Decisions
export function useDecisions(params?: {
  sphere_id?: string;
  status?: string;
  aging_level?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';

  return useApi<Array<{
    id: string;
    title: string;
    description: string;
    sphere_id: string;
    status: string;
    priority: string;
    aging_level: string;
    deadline?: string;
    options: any[];
    ai_suggestions: any[];
    created_at: string;
  }>>(`/decisions${queryString}`, {
    cacheKey: `decisions-${JSON.stringify(params)}`,
    refetchInterval: 60000, // 1 minute (aging updates)
  });
}

export function useDecision(id: string) {
  return useApi(`/decisions/${id}`, {
    enabled: !!id,
    cacheKey: `decision-${id}`,
  });
}

export function useMakeDecision() {
  return useMutation<any, {
    decision_id: string;
    selected_option_id: string;
    notes?: string;
  }>('/decisions/make', 'POST', {
    invalidateCache: ['decisions', 'dashboard-stats'],
  });
}

// Agents
export function useAgents(params?: {
  level?: number;
  domain?: string;
  hired_only?: boolean;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';

  return useApi<Array<{
    id: string;
    name_fr: string;
    level: number;
    domain: string;
    capabilities: string[];
    description_fr: string;
    cost: number;
    is_hired: boolean;
  }>>(`/agents${queryString}`, {
    cacheKey: `agents-${JSON.stringify(params)}`,
  });
}

export function useAgent(id: string) {
  return useApi(`/agents/${id}`, {
    enabled: !!id,
    cacheKey: `agent-${id}`,
  });
}

export function useHireAgent() {
  return useMutation<any, { agent_id: string; sphere_id?: string }>(
    '/agents/hire',
    'POST',
    {
      invalidateCache: ['agents', 'dashboard-stats'],
    }
  );
}

export function useAgentSuggestions(context: {
  sphere_id?: string;
  thread_id?: string;
  task_description?: string;
}) {
  return useApi<Array<{
    agent_id: string;
    reason: string;
    relevance_score: number;
  }>>(`/agents/suggestions?${new URLSearchParams(context as Record<string, string>)}`, {
    enabled: !!(context.sphere_id || context.thread_id || context.task_description),
    cacheKey: `agent-suggestions-${JSON.stringify(context)}`,
    cacheTTL: 2 * 60 * 1000, // 2 minutes
  });
}

// Checkpoints
export function useCheckpoints(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';

  return useApi<Array<{
    id: string;
    action_type: string;
    description: string;
    requested_by: string;
    status: string;
    risk_level: string;
    created_at: string;
  }>>(`/checkpoints${queryString}`, {
    cacheKey: `checkpoints-${JSON.stringify(params)}`,
    refetchInterval: 30000, // 30 seconds
  });
}

export function usePendingCheckpoints() {
  return useApi<Array<any>>('/checkpoints/pending', {
    cacheKey: 'checkpoints-pending',
    refetchInterval: 15000, // 15 seconds
  });
}

export function useResolveCheckpoint() {
  return useMutation<any, {
    checkpoint_id: string;
    action: 'approve' | 'reject';
    notes?: string;
  }>('/checkpoints/resolve', 'POST', {
    invalidateCache: ['checkpoints', 'checkpoints-pending', 'dashboard-stats'],
  });
}

// Nova Chat
export function useNovaChat() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'nova' | 'system';
    content: string;
    timestamp: string;
    checkpoint?: any;
  }>>([]);

  const sendMessage = useMutation<{
    message: any;
    suggestions?: any[];
    checkpoint?: any;
  }, { message: string; context?: any }>(
    '/nova/chat',
    'POST'
  );

  const send = useCallback(async (content: string, context?: any) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage.mutate({ message: content, context });
      
      // Add Nova response
      setMessages(prev => [...prev, response.message]);
      
      return response;
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'system' as const,
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date().toISOString(),
      }]);
      throw error;
    }
  }, [sendMessage]);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    send,
    clear,
    isLoading: sendMessage.isLoading,
    error: sendMessage.error,
  };
}

// Governance
export function useGovernanceMetrics() {
  return useApi<{
    checkpoints: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      approval_rate: number;
      avg_response_time_hours: number;
    };
    agents: {
      total_hired: number;
      active: number;
      actions_today: number;
      blocked_actions: number;
    };
    decisions: {
      total_pending: number;
      blink_count: number;
      avg_aging_days: number;
    };
  }>('/governance/metrics', {
    cacheKey: 'governance-metrics',
    refetchInterval: 60000, // 1 minute
  });
}

export function useGovernanceSignals(resolved?: boolean) {
  const params = resolved !== undefined ? `?resolved=${resolved}` : '';
  return useApi<Array<{
    id: string;
    level: string;
    title: string;
    description: string;
    source: string;
    timestamp: string;
    resolved: boolean;
  }>>(`/governance/signals${params}`, {
    cacheKey: `governance-signals-${resolved}`,
    refetchInterval: 30000, // 30 seconds
  });
}

export function useAuditLog(params?: {
  type?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';

  return useApi<Array<{
    id: string;
    type: string;
    action: string;
    actor: string;
    target?: string;
    timestamp: string;
  }>>(`/governance/audit${queryString}`, {
    cacheKey: `audit-log-${JSON.stringify(params)}`,
  });
}

// Notifications
export function useNotifications(unreadOnly = false) {
  return useApi<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
  }>>(`/notifications${unreadOnly ? '?unread_only=true' : ''}`, {
    cacheKey: `notifications-${unreadOnly}`,
    refetchInterval: 30000, // 30 seconds
  });
}

export function useUnreadNotificationCount() {
  return useApi<{ count: number }>('/notifications/unread-count', {
    cacheKey: 'unread-count',
    refetchInterval: 15000, // 15 seconds
  });
}

export function useMarkNotificationRead() {
  return useMutation<any, string>(
    (id) => `/notifications/${id}/read`,
    'POST',
    {
      invalidateCache: ['notifications', 'unread-count'],
    }
  );
}

// Search
export function useGlobalSearch(query: string) {
  return useApi<{
    threads: any[];
    decisions: any[];
    agents: any[];
    files: any[];
  }>(`/search?q=${encodeURIComponent(query)}`, {
    enabled: query.length >= 2,
    cacheKey: `search-${query}`,
    cacheTTL: 30000, // 30 seconds
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export function invalidateCache(pattern?: string | RegExp): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (typeof pattern === 'string' && key.includes(pattern)) {
      cache.delete(key);
    } else if (pattern instanceof RegExp && pattern.test(key)) {
      cache.delete(key);
    }
  }
}

export function prefetchData<T>(endpoint: string, cacheKey: string): Promise<T> {
  return apiFetch<T>(endpoint).then(data => {
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET HOOK (REAL-TIME UPDATES)
// ═══════════════════════════════════════════════════════════════════════════════

export function useWebSocket(
  onMessage: (event: { type: string; data: any }) => void
): { isConnected: boolean; send: (data: any) => void } {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const wsUrl = API_BASE_URL.replace('http', 'ws').replace('/api/v1', '/ws');
    
    const connect = () => {
      const token = localStorage.getItem('chenu_access_token');
      wsRef.current = new WebSocket(`${wsUrl}?token=${token}`);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('[WS] Connected');
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('[WS] Disconnected, reconnecting...');
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('[WS] Error:', error);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
          
          // Auto-invalidate cache based on event type
          if (data.type === 'checkpoint_update') {
            invalidateCache('checkpoints');
          } else if (data.type === 'decision_update') {
            invalidateCache('decisions');
          } else if (data.type === 'notification') {
            invalidateCache('notifications');
          }
        } catch (err) {
          console.error('[WS] Parse error:', err);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onMessage]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, send };
}

export default {
  useApi,
  useMutation,
  useDashboardStats,
  useSpheres,
  useSphere,
  useThreads,
  useThread,
  useCreateThread,
  useDecisions,
  useDecision,
  useMakeDecision,
  useAgents,
  useAgent,
  useHireAgent,
  useAgentSuggestions,
  useCheckpoints,
  usePendingCheckpoints,
  useResolveCheckpoint,
  useNovaChat,
  useGovernanceMetrics,
  useGovernanceSignals,
  useAuditLog,
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useGlobalSearch,
  useWebSocket,
  invalidateCache,
  prefetchData,
};
