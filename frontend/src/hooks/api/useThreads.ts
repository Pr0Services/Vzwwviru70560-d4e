/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — THREAD & MESSAGE HOOKS                          ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { apiGet, apiPost, apiPatch, apiDelete, queryKeys } from './client'
import type {
  Thread,
  ThreadDetail,
  ThreadFilters,
  CreateThreadRequest,
  UpdateThreadRequest,
  Message,
  SendMessageRequest,
  SendMessageResponse,
  PaginatedResponse,
  UUID,
} from '@/types/api.generated'

// ============================================================================
// THREAD HOOKS
// ============================================================================

/**
 * Get paginated threads with filters
 */
export function useThreads(filters?: ThreadFilters) {
  return useQuery({
    queryKey: queryKeys.threads.list(filters),
    queryFn: () => apiGet<PaginatedResponse<Thread>>('/threads', { params: filters }),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Get infinite scrolling threads
 */
export function useInfiniteThreads(filters?: Omit<ThreadFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.threads.list(filters), 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      apiGet<PaginatedResponse<Thread>>('/threads', { 
        params: { ...filters, page: pageParam } 
      }),
    getNextPageParam: (lastPage) => 
      lastPage.has_next ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30 * 1000,
  })
}

/**
 * Get single thread with details
 */
export function useThread(threadId: UUID | undefined) {
  return useQuery({
    queryKey: queryKeys.threads.detail(threadId || ''),
    queryFn: () => apiGet<ThreadDetail>(`/threads/${threadId}`),
    enabled: !!threadId,
    staleTime: 10 * 1000, // 10 seconds - threads update frequently
  })
}

/**
 * Create new thread
 */
export function useCreateThread() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateThreadRequest) => 
      apiPost<Thread>('/threads', data),
    onSuccess: (newThread) => {
      // Invalidate thread lists
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.list() })
      
      // Add to cache
      queryClient.setQueryData(
        queryKeys.threads.detail(newThread.id),
        newThread
      )
    },
  })
}

/**
 * Update thread
 */
export function useUpdateThread(threadId: UUID) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateThreadRequest) => 
      apiPatch<Thread>(`/threads/${threadId}`, data),
    // Optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.threads.detail(threadId) })
      
      const previousThread = queryClient.getQueryData<ThreadDetail>(
        queryKeys.threads.detail(threadId)
      )
      
      if (previousThread) {
        queryClient.setQueryData(
          queryKeys.threads.detail(threadId),
          { ...previousThread, ...data }
        )
      }
      
      return { previousThread }
    },
    onError: (_err, _data, context) => {
      // Rollback on error
      if (context?.previousThread) {
        queryClient.setQueryData(
          queryKeys.threads.detail(threadId),
          context.previousThread
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.list() })
    },
  })
}

/**
 * Delete thread
 */
export function useDeleteThread() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (threadId: UUID) => 
      apiDelete<{ success: boolean }>(`/threads/${threadId}`),
    onSuccess: (_data, threadId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.threads.detail(threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.list() })
    },
  })
}

/**
 * Archive thread
 */
export function useArchiveThread() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (threadId: UUID) => 
      apiPost<Thread>(`/threads/${threadId}/archive`),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(
        queryKeys.threads.detail(updatedThread.id),
        (old: ThreadDetail | undefined) => old ? { ...old, ...updatedThread } : undefined
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.list() })
    },
  })
}

// ============================================================================
// MESSAGE HOOKS
// ============================================================================

/**
 * Get messages for a thread (paginated)
 */
export function useMessages(threadId: UUID | undefined, page = 1, limit = 50) {
  return useQuery({
    queryKey: queryKeys.threads.messages(threadId || '', page),
    queryFn: () => apiGet<PaginatedResponse<Message>>(
      `/threads/${threadId}/messages`,
      { params: { page, limit } }
    ),
    enabled: !!threadId,
    staleTime: 10 * 1000,
  })
}

/**
 * Get infinite scrolling messages
 */
export function useInfiniteMessages(threadId: UUID | undefined) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.threads.messages(threadId || ''), 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      apiGet<PaginatedResponse<Message>>(
        `/threads/${threadId}/messages`,
        { params: { page: pageParam, limit: 50 } }
      ),
    getNextPageParam: (lastPage) => 
      lastPage.has_next ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!threadId,
    staleTime: 10 * 1000,
  })
}

/**
 * Send message to thread
 */
export function useSendMessage(threadId: UUID) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: SendMessageRequest) => 
      apiPost<SendMessageResponse>(`/threads/${threadId}/messages`, data),
    // Optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.threads.messages(threadId) 
      })
      
      // Create optimistic message
      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        thread_id: threadId,
        role: 'user',
        content: data.content,
        status: 'sending',
        created_by: 'current-user',
        created_at: new Date().toISOString(),
        metadata: {},
        attachments: [],
      }
      
      // Add to messages cache
      const previousMessages = queryClient.getQueryData<PaginatedResponse<Message>>(
        queryKeys.threads.messages(threadId, 1)
      )
      
      if (previousMessages) {
        queryClient.setQueryData(
          queryKeys.threads.messages(threadId, 1),
          {
            ...previousMessages,
            items: [...previousMessages.items, optimisticMessage],
            total: previousMessages.total + 1,
          }
        )
      }
      
      return { previousMessages, optimisticMessage }
    },
    onError: (_err, _data, context) => {
      // Rollback
      if (context?.previousMessages) {
        queryClient.setQueryData(
          queryKeys.threads.messages(threadId, 1),
          context.previousMessages
        )
      }
    },
    onSuccess: (response, _data, context) => {
      // Replace optimistic message with real one
      queryClient.setQueryData<PaginatedResponse<Message>>(
        queryKeys.threads.messages(threadId, 1),
        (old) => {
          if (!old) return old
          
          const items = old.items.map(msg => 
            msg.id === context?.optimisticMessage.id 
              ? response.user_message 
              : msg
          )
          
          // Add assistant response if present
          if (response.assistant_message) {
            items.push(response.assistant_message)
          }
          
          return { ...old, items }
        }
      )
      
      // Update thread's last_message_at
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
    },
  })
}

// ============================================================================
// THREAD UTILITIES
// ============================================================================

/**
 * Prefetch thread data
 */
export async function prefetchThread(
  queryClient: ReturnType<typeof useQueryClient>,
  threadId: UUID
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.threads.detail(threadId),
    queryFn: () => apiGet<ThreadDetail>(`/threads/${threadId}`),
  })
}

/**
 * Get thread from cache
 */
export function useThreadFromCache(threadId: UUID | undefined) {
  const queryClient = useQueryClient()
  return queryClient.getQueryData<ThreadDetail>(
    queryKeys.threads.detail(threadId || '')
  )
}

/**
 * Invalidate all thread queries (after WebSocket update)
 */
export function useInvalidateThreads() {
  const queryClient = useQueryClient()
  
  return {
    invalidateThread: (threadId: UUID) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(threadId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.messages(threadId) })
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all })
    },
  }
}
