/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA HOOKS                                      ║
 * ║                    Sprint B3.2: TanStack Query                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
} from '@tanstack/react-query'
import { useState, useCallback, useRef } from 'react'
import { apiGet, apiPost, queryKeys } from './client'
import type {
  NovaState,
  NovaQueryRequest,
  NovaQueryResponse,
  NovaStreamChunk,
  SphereId,
  UUID,
} from '@/types/api.generated'

// ============================================================================
// NOVA STATUS HOOKS
// ============================================================================

/**
 * Get Nova system status
 */
export function useNovaStatus() {
  return useQuery({
    queryKey: queryKeys.nova.status(),
    queryFn: () => apiGet<NovaState>('/nova/status'),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Check if Nova is available
 */
export function useIsNovaAvailable() {
  const { data: status, isLoading } = useNovaStatus()
  
  return {
    isAvailable: status?.status === 'active',
    isDegraded: status?.status === 'degraded',
    isOffline: status?.status === 'offline' || status?.status === 'maintenance',
    isLoading,
    status: status?.status,
  }
}

// ============================================================================
// NOVA QUERY HOOKS
// ============================================================================

/**
 * Send query to Nova (non-streaming)
 */
export function useNovaQuery() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: NovaQueryRequest) => 
      apiPost<NovaQueryResponse>('/nova/query', { ...request, stream: false }),
    onSuccess: () => {
      // Invalidate token balance after query
      queryClient.invalidateQueries({ queryKey: ['user', 'tokens'] })
    },
  })
}

/**
 * Send streaming query to Nova
 */
export function useNovaStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [chunks, setChunks] = useState<string[]>([])
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const queryClient = useQueryClient()
  
  const stream = useCallback(async (request: NovaQueryRequest) => {
    // Reset state
    setIsStreaming(true)
    setChunks([])
    setResponse('')
    setError(null)
    
    // Create abort controller
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch('/api/v1/nova/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ ...request, stream: true }),
        signal: abortControllerRef.current.signal,
      })
      
      if (!response.ok) {
        throw new Error(`Nova query failed: ${response.status}`)
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }
      
      const decoder = new TextDecoder()
      let fullResponse = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '))
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6)) as NovaStreamChunk
            
            if (data.delta) {
              fullResponse += data.delta
              setChunks(prev => [...prev, data.delta])
              setResponse(fullResponse)
            }
            
            if (data.done) {
              // Invalidate token balance
              queryClient.invalidateQueries({ queryKey: ['user', 'tokens'] })
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
      
      return fullResponse
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
        throw err
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [queryClient])
  
  const abort = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }, [])
  
  const reset = useCallback(() => {
    setChunks([])
    setResponse('')
    setError(null)
  }, [])
  
  return {
    stream,
    abort,
    reset,
    isStreaming,
    chunks,
    response,
    error,
  }
}

// ============================================================================
// NOVA CONTEXT HOOKS
// ============================================================================

interface NovaContext {
  sphereId?: SphereId
  threadId?: UUID
  includeHistory?: boolean
  maxTokens?: number
}

/**
 * Create Nova query with context
 */
export function useNovaWithContext(context: NovaContext) {
  const mutation = useNovaQuery()
  const streaming = useNovaStream()
  
  const query = useCallback((query: string, stream = false) => {
    const request: NovaQueryRequest = {
      query,
      context: {
        sphere_id: context.sphereId,
        thread_id: context.threadId,
        include_history: context.includeHistory ?? true,
        max_tokens: context.maxTokens ?? 2000,
      },
      stream,
    }
    
    if (stream) {
      return streaming.stream(request)
    } else {
      return mutation.mutateAsync(request)
    }
  }, [context, mutation, streaming])
  
  return {
    query,
    // Non-streaming
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
    // Streaming
    stream: streaming.stream,
    abort: streaming.abort,
    isStreaming: streaming.isStreaming,
    streamResponse: streaming.response,
    streamChunks: streaming.chunks,
    streamError: streaming.error,
    resetStream: streaming.reset,
  }
}

// ============================================================================
// NOVA SUGGESTIONS HOOK
// ============================================================================

/**
 * Get query suggestions based on context
 */
export function useNovaSuggestions(sphereId?: SphereId) {
  return useQuery({
    queryKey: ['nova', 'suggestions', sphereId],
    queryFn: async () => {
      // This would call a suggestions endpoint
      // For now, return static suggestions based on sphere
      const suggestions: Record<SphereId, string[]> = {
        personal: [
          'Résume mes notes de la semaine',
          'Quelles sont mes tâches prioritaires?',
          'Analyse mes habitudes récentes',
        ],
        business: [
          'Montre-moi mes leads actifs',
          'Quel est le statut de mes projets?',
          'Génère un rapport de ventes',
        ],
        government: [
          'Vérifie la conformité réglementaire',
          'Quels documents doivent être renouvelés?',
        ],
        studio: [
          'Génère une image pour mon projet',
          'Aide-moi à éditer cette vidéo',
          'Crée une voix-off',
        ],
        community: [
          'Quels événements sont prévus?',
          'Résume les discussions récentes',
        ],
        social: [
          'Programme mes posts de la semaine',
          'Analyse mes statistiques',
        ],
        entertainment: [
          'Recommande-moi un film',
          'Qu\'est-ce qui est populaire?',
        ],
        team: [
          'Qui est disponible aujourd\'hui?',
          'Montre les tâches de l\'équipe',
        ],
        scholar: [
          'Recherche des articles sur ce sujet',
          'Aide-moi à rédiger cette section',
        ],
      }
      
      return sphereId ? suggestions[sphereId] || [] : []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!sphereId,
  })
}

// ============================================================================
// NOVA HISTORY HOOK
// ============================================================================

interface NovaHistoryEntry {
  id: string
  query: string
  response: string
  timestamp: string
  sphereId?: SphereId
}

/**
 * Track Nova query history (client-side)
 */
export function useNovaHistory(maxEntries = 50) {
  const [history, setHistory] = useState<NovaHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('nova_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  const addEntry = useCallback((entry: Omit<NovaHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: NovaHistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, maxEntries)
      localStorage.setItem('nova_history', JSON.stringify(updated))
      return updated
    })
  }, [maxEntries])
  
  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('nova_history')
  }, [])
  
  const removeEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id)
      localStorage.setItem('nova_history', JSON.stringify(updated))
      return updated
    })
  }, [])
  
  return {
    history,
    addEntry,
    clearHistory,
    removeEntry,
  }
}
