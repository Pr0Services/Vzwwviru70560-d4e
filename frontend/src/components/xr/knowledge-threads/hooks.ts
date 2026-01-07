/**
 * CHE·NU™ Knowledge Threads - Custom Hooks
 * 
 * Reusable hooks for thread management:
 * - useThread: Load and manage single thread
 * - useThreadList: Load and filter thread list
 * - useThreadNavigation: Navigate between threads
 * - useEntityThreads: Find threads related to an entity
 * - useThreadTimeline: Manage timeline filtering
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  KnowledgeThread,
  ThreadSummary,
  ThreadListState,
  ThreadViewFilters,
  LinkedEntity,
  LinkType,
  LinkedEntityType,
  AgentThreadSuggestion,
  ThreadCreationForm,
  LinkEntityAction,
} from './knowledge-threads.types';
import { DEFAULT_VIEW_FILTERS } from './knowledge-threads.types';

// ============================================================================
// useThread - Single Thread Management
// ============================================================================

interface UseThreadOptions {
  threadId: string;
  userId: string;
  autoLoad?: boolean;
}

interface UseThreadReturn {
  thread: KnowledgeThread | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updateThread: (updates: Partial<KnowledgeThread>) => Promise<void>;
  linkEntity: (link: Omit<LinkedEntity, 'id' | 'timestamp' | 'linked_by'>) => Promise<void>;
  unlinkEntity: (linkedEntityId: string) => Promise<void>;
}

export function useThread(options: UseThreadOptions): UseThreadReturn {
  const { threadId, userId, autoLoad = true } = options;
  
  const [thread, setThread] = useState<KnowledgeThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, fetch from API
      // const response = await api.getThread(threadId);
      // setThread(response);
      
      setThread(null); // Placeholder
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const updateThread = useCallback(async (updates: Partial<KnowledgeThread>) => {
    if (!thread) return;
    
    try {
      // Optimistic update
      setThread(prev => prev ? { ...prev, ...updates } : null);
      
      // API call
      // await api.updateThread(threadId, updates);
    } catch (e) {
      // Rollback on error
      reload();
      throw e;
    }
  }, [thread, reload]);

  const linkEntity = useCallback(async (link: Omit<LinkedEntity, 'id' | 'timestamp' | 'linked_by'>) => {
    if (!thread) return;
    
    const newLink: LinkedEntity = {
      ...link,
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      linked_by: userId,
    };
    
    // Optimistic update
    setThread(prev => prev ? {
      ...prev,
      linked_entities: [...prev.linked_entities, newLink],
      entity_count: prev.entity_count + 1,
    } : null);
    
    // API call would go here
  }, [thread, userId]);

  const unlinkEntity = useCallback(async (linkedEntityId: string) => {
    if (!thread) return;
    
    // Optimistic update
    setThread(prev => prev ? {
      ...prev,
      linked_entities: prev.linked_entities.filter(e => e.id !== linkedEntityId),
      entity_count: prev.entity_count - 1,
    } : null);
    
    // API call would go here
  }, [thread]);

  useEffect(() => {
    if (autoLoad && threadId) {
      reload();
    }
  }, [threadId, autoLoad, reload]);

  return {
    thread,
    loading,
    error,
    reload,
    updateThread,
    linkEntity,
    unlinkEntity,
  };
}

// ============================================================================
// useThreadList - Thread List Management
// ============================================================================

interface UseThreadListOptions {
  userId: string;
  initialPageSize?: number;
}

interface UseThreadListReturn {
  state: ThreadListState;
  setStatusFilter: (status: ThreadListState['status_filter']) => void;
  setSearch: (query: string) => void;
  setSortBy: (sortBy: ThreadListState['sort_by']) => void;
  loadMore: () => Promise<void>;
  reload: () => Promise<void>;
}

export function useThreadList(options: UseThreadListOptions): UseThreadListReturn {
  const { userId, initialPageSize = 20 } = options;
  
  const [state, setState] = useState<ThreadListState>({
    threads: [],
    loading: true,
    error: null,
    status_filter: 'all',
    visibility_filter: 'all',
    sort_by: 'recent',
    sort_order: 'desc',
    search_query: '',
    page: 1,
    page_size: initialPageSize,
    total_count: 0,
  });

  const reload = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // API call would go here
      setState(prev => ({ ...prev, loading: false }));
    } catch (e) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: (e as Error).message 
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading) return;
    setState(prev => ({ ...prev, page: prev.page + 1 }));
    // Would fetch next page
  }, [state.loading]);

  const setStatusFilter = useCallback((status: ThreadListState['status_filter']) => {
    setState(prev => ({ ...prev, status_filter: status, page: 1 }));
  }, []);

  const setSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, search_query: query, page: 1 }));
  }, []);

  const setSortBy = useCallback((sortBy: ThreadListState['sort_by']) => {
    setState(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'desc' ? 'asc' : 'desc',
      page: 1,
    }));
  }, []);

  useEffect(() => {
    reload();
  }, [reload, state.status_filter, state.search_query, state.sort_by, state.sort_order]);

  return {
    state,
    setStatusFilter,
    setSearch,
    setSortBy,
    loadMore,
    reload,
  };
}

// ============================================================================
// useEntityThreads - Find Threads Related to Entity
// ============================================================================

interface UseEntityThreadsOptions {
  entityType: LinkedEntityType;
  entityId: string;
  userId: string;
}

interface UseEntityThreadsReturn {
  threads: ThreadSummary[];
  loading: boolean;
  error: string | null;
}

export function useEntityThreads(options: UseEntityThreadsOptions): UseEntityThreadsReturn {
  const { entityType, entityId, userId } = options;
  
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        // API: Find threads that link to this entity
        // const response = await api.findThreadsForEntity(entityType, entityId);
        setThreads([]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [entityType, entityId, userId]);

  return { threads, loading, error };
}

// ============================================================================
// useThreadSuggestions - Agent Suggestions
// ============================================================================

interface UseThreadSuggestionsOptions {
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseThreadSuggestionsReturn {
  suggestions: AgentThreadSuggestion[];
  pendingCount: number;
  loading: boolean;
  accept: (suggestionId: string) => Promise<void>;
  reject: (suggestionId: string, reason?: string) => Promise<void>;
  dismiss: (suggestionId: string) => void;
}

export function useThreadSuggestions(options: UseThreadSuggestionsOptions): UseThreadSuggestionsReturn {
  const { userId, autoRefresh = true, refreshInterval = 60000 } = options;
  
  const [suggestions, setSuggestions] = useState<AgentThreadSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  const pendingCount = useMemo(() => 
    suggestions.filter(s => s.status === 'pending').length
  , [suggestions]);

  const accept = useCallback(async (suggestionId: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === suggestionId
        ? { ...s, status: 'accepted' as const, user_response_at: new Date().toISOString() }
        : s
    ));
    // API call to create the link
  }, []);

  const reject = useCallback(async (suggestionId: string, reason?: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === suggestionId
        ? { 
            ...s, 
            status: 'rejected' as const, 
            user_response_at: new Date().toISOString(),
            user_response_reason: reason,
          }
        : s
    ));
  }, []);

  const dismiss = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        // API call
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    load();

    if (autoRefresh) {
      intervalRef.current = setInterval(load, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userId, autoRefresh, refreshInterval]);

  return {
    suggestions,
    pendingCount,
    loading,
    accept,
    reject,
    dismiss,
  };
}

// ============================================================================
// useThreadTimeline - Timeline Management
// ============================================================================

interface UseThreadTimelineOptions {
  thread: KnowledgeThread | null;
}

interface UseThreadTimelineReturn {
  filteredEvents: KnowledgeThread['timeline'];
  filters: ThreadViewFilters;
  setFilters: (filters: Partial<ThreadViewFilters>) => void;
  resetFilters: () => void;
}

export function useThreadTimeline(options: UseThreadTimelineOptions): UseThreadTimelineReturn {
  const { thread } = options;
  
  const [filters, setFiltersState] = useState<ThreadViewFilters>(DEFAULT_VIEW_FILTERS);

  const filteredEvents = useMemo(() => {
    if (!thread) return [];
    
    let events = [...thread.timeline];

    // Date range filter
    if (filters.date_range) {
      const start = new Date(filters.date_range.start);
      const end = new Date(filters.date_range.end);
      events = events.filter(e => {
        const date = new Date(e.timestamp);
        return date >= start && date <= end;
      });
    }

    // Entity type filter
    if (filters.entity_types.length > 0) {
      events = events.filter(e =>
        !e.entity_reference || filters.entity_types.includes(e.entity_reference.type)
      );
    }

    // Sort by timestamp descending
    events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return events;
  }, [thread, filters]);

  const setFilters = useCallback((updates: Partial<ThreadViewFilters>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_VIEW_FILTERS);
  }, []);

  return {
    filteredEvents,
    filters,
    setFilters,
    resetFilters,
  };
}

// ============================================================================
// useThreadCreation - Thread Creation Flow
// ============================================================================

interface UseThreadCreationReturn {
  isOpen: boolean;
  open: (options?: { entity?: { type: LinkedEntityType; id: string; title: string } }) => void;
  close: () => void;
  submit: (form: ThreadCreationForm) => Promise<void>;
  preselectedEntity: { type: LinkedEntityType; id: string; title: string } | null;
  isSubmitting: boolean;
}

export function useThreadCreation(userId: string): UseThreadCreationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preselectedEntity, setPreselectedEntity] = useState<{
    type: LinkedEntityType;
    id: string;
    title: string;
  } | null>(null);

  const open = useCallback((options?: { entity?: { type: LinkedEntityType; id: string; title: string } }) => {
    setPreselectedEntity(options?.entity || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPreselectedEntity(null);
  }, []);

  const submit = useCallback(async (form: ThreadCreationForm) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // API call to create thread
      close();
    } finally {
      setIsSubmitting(false);
    }
  }, [close]);

  return {
    isOpen,
    open,
    close,
    submit,
    preselectedEntity,
    isSubmitting,
  };
}

// ============================================================================
// useDebounce - Debounce Value
// ============================================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useThread,
  useThreadList,
  useEntityThreads,
  useThreadSuggestions,
  useThreadTimeline,
  useThreadCreation,
  useDebounce,
};
