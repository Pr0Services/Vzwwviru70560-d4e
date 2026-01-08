/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — THREADS HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { API_CONFIG, QUERY_KEYS, STALE_TIMES } from '../../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ThreadStatus = 'active' | 'paused' | 'archived' | 'completed';
export type ThreadType = 'personal' | 'collective' | 'institutional';
export type ThreadVisibility = 'private' | 'semi_private' | 'public';

export interface Thread {
  id: string;
  title: string;
  founding_intent: string;
  thread_type: ThreadType;
  sphere_id: string;
  sphere_name?: string;
  parent_thread_id?: string;
  status: ThreadStatus;
  visibility: ThreadVisibility;
  event_count: number;
  decision_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  color?: string;
}

export interface ThreadEvent {
  id: string;
  thread_id: string;
  type: string;
  payload: Record<string, unknown>;
  created_by: string;
  created_at: string;
  parent_event_id?: string;
}

export interface CreateThreadInput {
  title: string;
  founding_intent: string;
  sphere_id: string;
  thread_type?: ThreadType;
  visibility?: ThreadVisibility;
  parent_thread_id?: string;
  tags?: string[];
  color?: string;
}

export interface UpdateThreadInput {
  title?: string;
  status?: ThreadStatus;
  visibility?: ThreadVisibility;
  tags?: string[];
  color?: string;
}

export interface ThreadFilters {
  sphere_id?: string;
  status?: ThreadStatus;
  thread_type?: ThreadType;
  search?: string;
  limit?: number;
  offset?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all threads with optional filters
 */
export function useThreads(filters?: ThreadFilters) {
  return useQuery<Thread[]>({
    queryKey: [...QUERY_KEYS.THREADS, filters],
    queryFn: () => apiClient.get<Thread[]>(API_CONFIG.ENDPOINTS.THREADS.LIST, { 
      params: filters as Record<string, string | number | boolean | undefined> 
    }),
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch single thread by ID
 */
export function useThread(threadId: string | undefined) {
  return useQuery<Thread>({
    queryKey: QUERY_KEYS.THREAD(threadId || ''),
    queryFn: () => apiClient.get<Thread>(API_CONFIG.ENDPOINTS.THREADS.DETAIL(threadId!)),
    enabled: !!threadId,
    staleTime: STALE_TIMES.STANDARD,
  });
}

/**
 * Fetch thread events
 */
export function useThreadEvents(threadId: string | undefined, limit: number = 50) {
  return useQuery<ThreadEvent[]>({
    queryKey: [...QUERY_KEYS.THREAD_EVENTS(threadId || ''), { limit }],
    queryFn: () => apiClient.get<ThreadEvent[]>(
      API_CONFIG.ENDPOINTS.THREADS.EVENTS(threadId!),
      { params: { limit } }
    ),
    enabled: !!threadId,
    staleTime: STALE_TIMES.FREQUENT,
  });
}

/**
 * Fetch threads by sphere
 */
export function useThreadsBySphere(sphereId: string | undefined) {
  return useThreads(sphereId ? { sphere_id: sphereId } : undefined);
}

/**
 * Fetch active threads only
 */
export function useActiveThreads() {
  return useThreads({ status: 'active' });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a new thread
 */
export function useCreateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateThreadInput) =>
      apiClient.post<Thread>(API_CONFIG.ENDPOINTS.THREADS.CREATE, data),
    onSuccess: (newThread) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREADS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPHERE(newThread.sphere_id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

/**
 * Update a thread
 */
export function useUpdateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateThreadInput }) =>
      apiClient.patch<Thread>(API_CONFIG.ENDPOINTS.THREADS.UPDATE(id), data),
    onSuccess: (updatedThread, { id }) => {
      queryClient.setQueryData(QUERY_KEYS.THREAD(id), updatedThread);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREADS });
    },
  });
}

/**
 * Archive a thread
 */
export function useArchiveThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) =>
      apiClient.post<Thread>(API_CONFIG.ENDPOINTS.THREADS.ARCHIVE(threadId)),
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREAD(threadId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREADS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

/**
 * Delete a thread
 */
export function useDeleteThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) =>
      apiClient.delete(API_CONFIG.ENDPOINTS.THREADS.DELETE(threadId)),
    onSuccess: (_, threadId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.THREAD(threadId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREADS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });
}

/**
 * Add event to thread
 */
export function useAddThreadEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, event }: { 
      threadId: string; 
      event: Omit<ThreadEvent, 'id' | 'thread_id' | 'created_at'> 
    }) =>
      apiClient.post<ThreadEvent>(API_CONFIG.ENDPOINTS.THREADS.ADD_EVENT(threadId), event),
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREAD_EVENTS(threadId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.THREAD(threadId) });
    },
  });
}
