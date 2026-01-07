/**
 * CHE·NU™ Meaning Layer — Custom Hooks
 * 
 * Hooks for managing meaning entries, conflicts, and visualization.
 * 
 * Core principle: Meaning is DECLARED, never inferred.
 * 
 * @module meaning-layer
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  MeaningEntry,
  MeaningSummary,
  MeaningType,
  MeaningScope,
  MeaningStability,
  MeaningState,
  MeaningConflict,
  MeaningCreationForm,
  MeaningLayerState,
  MeaningVisual,
  MeaningPromptContext,
  LinkedEntity,
  ReviewReminder,
  DEFAULT_REVIEW_REMINDER,
  MEANING_TYPE_META,
} from './meaning-layer.types';

// ============================================================================
// useMeanings — List and filter meanings
// ============================================================================

interface UseMeaningsOptions {
  userId: string;
  initialFilter?: {
    type?: MeaningType;
    state?: MeaningState;
    scope?: MeaningScope;
  };
}

interface UseMeaningsReturn {
  meanings: MeaningSummary[];
  isLoading: boolean;
  error: string | null;
  filterByType: (type: MeaningType | 'all') => void;
  filterByState: (state: MeaningState | 'all') => void;
  filterByScope: (scope: MeaningScope | 'all') => void;
  search: (query: string) => void;
  refresh: () => void;
  counts: {
    total: number;
    byType: Record<MeaningType, number>;
    byState: Record<MeaningState, number>;
  };
}

export function useMeanings(options: UseMeaningsOptions): UseMeaningsReturn {
  const { userId, initialFilter } = options;
  const [allMeanings, setAllMeanings] = useState<MeaningSummary[]>([]);
  const [filteredMeanings, setFilteredMeanings] = useState<MeaningSummary[]>([]);
  const [filters, setFilters] = useState({
    type: initialFilter?.type || ('all' as MeaningType | 'all'),
    state: initialFilter?.state || ('active' as MeaningState | 'all'),
    scope: initialFilter?.scope || ('all' as MeaningScope | 'all'),
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeanings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data
      const mockMeanings: MeaningSummary[] = [
        {
          id: 'meaning_001',
          title: 'Technology for Connection',
          statement: 'I want technology to reduce isolation, not increase it.',
          type: 'value',
          scope: 'personal',
          stability: 'foundational',
          state: 'active',
          linked_count: 3,
          created_at: '2025-12-01T10:00:00Z',
          updated_at: '2025-12-20T15:00:00Z',
        },
        {
          id: 'meaning_002',
          title: 'Work-Life Harmony',
          statement: 'Success includes time for family and personal growth.',
          type: 'purpose',
          scope: 'personal',
          stability: 'foundational',
          state: 'active',
          linked_count: 5,
          created_at: '2025-11-15T09:00:00Z',
          updated_at: '2025-12-15T12:00:00Z',
        },
      ];
      
      setAllMeanings(mockMeanings);
    } catch (e) {
      setError('Failed to load meanings');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadMeanings();
  }, [loadMeanings]);

  useEffect(() => {
    let result = allMeanings;
    
    if (filters.type !== 'all') {
      result = result.filter(m => m.type === filters.type);
    }
    if (filters.state !== 'all') {
      result = result.filter(m => m.state === filters.state);
    }
    if (filters.scope !== 'all') {
      result = result.filter(m => m.scope === filters.scope);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(m =>
        m.statement.toLowerCase().includes(q) ||
        (m.title?.toLowerCase().includes(q) ?? false)
      );
    }
    
    setFilteredMeanings(result);
  }, [allMeanings, filters]);

  const counts = useMemo(() => {
    const byType: Record<MeaningType, number> = {
      purpose: 0, value: 0, intention: 0, belief: 0, commitment: 0,
    };
    const byState: Record<MeaningState, number> = {
      active: 0, dormant: 0, superseded: 0, obsolete: 0,
    };
    
    allMeanings.forEach(m => {
      byType[m.type]++;
      byState[m.state]++;
    });
    
    return { total: allMeanings.length, byType, byState };
  }, [allMeanings]);

  return {
    meanings: filteredMeanings,
    isLoading,
    error,
    filterByType: (type) => setFilters(f => ({ ...f, type })),
    filterByState: (state) => setFilters(f => ({ ...f, state })),
    filterByScope: (scope) => setFilters(f => ({ ...f, scope })),
    search: (query) => setFilters(f => ({ ...f, search: query })),
    refresh: loadMeanings,
    counts,
  };
}

// ============================================================================
// useMeaning — Single meaning entry operations
// ============================================================================

interface UseMeaningOptions {
  meaningId: string;
  userId: string;
}

interface UseMeaningReturn {
  meaning: MeaningEntry | null;
  isLoading: boolean;
  error: string | null;
  updateStatement: (statement: string, reason?: string) => Promise<boolean>;
  updateState: (state: MeaningState) => Promise<boolean>;
  addLinkedEntity: (entity: LinkedEntity) => Promise<boolean>;
  removeLinkedEntity: (entityId: string) => Promise<boolean>;
  markSuperseded: (newMeaningId: string) => Promise<boolean>;
  refresh: () => void;
}

export function useMeaning(options: UseMeaningOptions): UseMeaningReturn {
  const { meaningId, userId } = options;
  const [meaning, setMeaning] = useState<MeaningEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeaning = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock data
      const mockMeaning: MeaningEntry = {
        id: meaningId,
        author: userId,
        author_name: 'You',
        created_at: '2025-12-01T10:00:00Z',
        updated_at: '2025-12-20T15:00:00Z',
        title: 'Technology for Connection',
        statement: 'I want technology to reduce isolation, not increase it.',
        type: 'value',
        scope: 'personal',
        stability: 'foundational',
        state: 'active',
        linked_entities: [],
        review_reminder: DEFAULT_REVIEW_REMINDER,
        revisions: [],
      };
      
      setMeaning(mockMeaning);
    } catch (e) {
      setError('Failed to load meaning');
    } finally {
      setIsLoading(false);
    }
  }, [meaningId, userId]);

  useEffect(() => {
    loadMeaning();
  }, [loadMeaning]);

  const updateStatement = useCallback(async (
    statement: string, 
    reason?: string
  ): Promise<boolean> => {
    if (!meaning) return false;
    
    try {
      const revision = {
        revision: meaning.revisions.length + 1,
        timestamp: new Date().toISOString(),
        previous_statement: meaning.statement,
        new_statement: statement,
        change_reason: reason,
      };
      
      setMeaning(prev => prev ? {
        ...prev,
        statement,
        updated_at: new Date().toISOString(),
        revisions: [...prev.revisions, revision],
      } : null);
      
      return true;
    } catch {
      return false;
    }
  }, [meaning]);

  const updateState = useCallback(async (state: MeaningState): Promise<boolean> => {
    if (!meaning) return false;
    
    try {
      setMeaning(prev => prev ? {
        ...prev,
        state,
        updated_at: new Date().toISOString(),
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [meaning]);

  const addLinkedEntity = useCallback(async (entity: LinkedEntity): Promise<boolean> => {
    if (!meaning) return false;
    
    try {
      setMeaning(prev => prev ? {
        ...prev,
        linked_entities: [...prev.linked_entities, entity],
        updated_at: new Date().toISOString(),
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [meaning]);

  const removeLinkedEntity = useCallback(async (entityId: string): Promise<boolean> => {
    if (!meaning) return false;
    
    try {
      setMeaning(prev => prev ? {
        ...prev,
        linked_entities: prev.linked_entities.filter(e => e.entity_id !== entityId),
        updated_at: new Date().toISOString(),
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [meaning]);

  const markSuperseded = useCallback(async (newMeaningId: string): Promise<boolean> => {
    if (!meaning) return false;
    
    try {
      setMeaning(prev => prev ? {
        ...prev,
        state: 'superseded',
        superseded_by: newMeaningId,
        updated_at: new Date().toISOString(),
      } : null);
      return true;
    } catch {
      return false;
    }
  }, [meaning]);

  return {
    meaning,
    isLoading,
    error,
    updateStatement,
    updateState,
    addLinkedEntity,
    removeLinkedEntity,
    markSuperseded,
    refresh: loadMeaning,
  };
}

// ============================================================================
// useMeaningCreation — Create new meaning entry
// ============================================================================

interface UseMeaningCreationReturn {
  form: MeaningCreationForm;
  setField: <K extends keyof MeaningCreationForm>(field: K, value: MeaningCreationForm[K]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addLinkedEntity: (entity: LinkedEntity) => void;
  removeLinkedEntity: (entityId: string) => void;
  reset: () => void;
  isValid: boolean;
  submit: () => Promise<MeaningEntry | null>;
  isSubmitting: boolean;
}

export function useMeaningCreation(userId: string): UseMeaningCreationReturn {
  const [form, setForm] = useState<MeaningCreationForm>({
    title: '',
    statement: '',
    type: 'purpose',
    scope: 'personal',
    stability: 'evolving',
    linked_entities: [],
    review_reminder: DEFAULT_REVIEW_REMINDER,
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback(<K extends keyof MeaningCreationForm>(
    field: K,
    value: MeaningCreationForm[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !form.tags?.includes(trimmed)) {
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), trimmed] }));
    }
  }, [form.tags]);

  const removeTag = useCallback((tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) || [] }));
  }, []);

  const addLinkedEntity = useCallback((entity: LinkedEntity) => {
    setForm(prev => ({
      ...prev,
      linked_entities: [...prev.linked_entities, entity],
    }));
  }, []);

  const removeLinkedEntity = useCallback((entityId: string) => {
    setForm(prev => ({
      ...prev,
      linked_entities: prev.linked_entities.filter(e => e.entity_id !== entityId),
    }));
  }, []);

  const reset = useCallback(() => {
    setForm({
      title: '',
      statement: '',
      type: 'purpose',
      scope: 'personal',
      stability: 'evolving',
      linked_entities: [],
      review_reminder: DEFAULT_REVIEW_REMINDER,
      tags: [],
    });
  }, []);

  const isValid = useMemo(() => {
    return !!form.statement.trim();
  }, [form.statement]);

  const submit = useCallback(async (): Promise<MeaningEntry | null> => {
    if (!isValid) return null;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMeaning: MeaningEntry = {
        id: `meaning_${Date.now()}`,
        author: userId,
        author_name: 'You',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: form.title || undefined,
        statement: form.statement,
        type: form.type,
        scope: form.scope,
        stability: form.stability,
        state: 'active',
        linked_entities: form.linked_entities,
        review_reminder: form.review_reminder,
        revisions: [],
        tags: form.tags,
      };
      
      reset();
      return newMeaning;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isValid, userId, reset]);

  return {
    form,
    setField,
    addTag,
    removeTag,
    addLinkedEntity,
    removeLinkedEntity,
    reset,
    isValid,
    submit,
    isSubmitting,
  };
}

// ============================================================================
// useMeaningConflicts — Detect and manage conflicts
// ============================================================================

interface UseMeaningConflictsOptions {
  userId: string;
  contextEntityId?: string;
}

interface UseMeaningConflictsReturn {
  conflicts: MeaningConflict[];
  unresolvedCount: number;
  checkForConflicts: (action: { type: string; description: string }) => MeaningConflict[];
  acknowledge: (conflictId: string, response: MeaningConflict['user_response']) => void;
  dismissAll: () => void;
}

export function useMeaningConflicts(options: UseMeaningConflictsOptions): UseMeaningConflictsReturn {
  const { userId, contextEntityId } = options;
  const [conflicts, setConflicts] = useState<MeaningConflict[]>([]);

  const unresolvedCount = useMemo(() => 
    conflicts.filter(c => !c.acknowledged).length,
  [conflicts]);

  const checkForConflicts = useCallback((action: { type: string; description: string }): MeaningConflict[] => {
    // Mock conflict detection - would use real meaning matching
    return [];
  }, []);

  const acknowledge = useCallback((
    conflictId: string, 
    response: MeaningConflict['user_response']
  ) => {
    setConflicts(prev => prev.map(c =>
      c.id === conflictId
        ? { ...c, acknowledged: true, user_response: response }
        : c
    ));
  }, []);

  const dismissAll = useCallback(() => {
    setConflicts(prev => prev.map(c => ({
      ...c,
      acknowledged: true,
      user_response: 'dismiss' as const,
    })));
  }, []);

  return {
    conflicts,
    unresolvedCount,
    checkForConflicts,
    acknowledge,
    dismissAll,
  };
}

// ============================================================================
// useMeaningLayer — Visualization layer state
// ============================================================================

interface UseMeaningLayerReturn {
  state: MeaningLayerState;
  toggleVisibility: () => void;
  toggleType: (type: MeaningType) => void;
  setHovered: (meaningId: string | null) => void;
  setSelected: (meaningId: string | null) => void;
  getMeaningVisuals: () => MeaningVisual[];
}

export function useMeaningLayer(): UseMeaningLayerReturn {
  const [state, setState] = useState<MeaningLayerState>({
    visible: true,
    visible_types: ['purpose', 'value', 'intention', 'belief', 'commitment'],
    visible_scopes: ['personal', 'shared', 'team'],
    hovered_meaning_id: null,
    selected_meaning_id: null,
  });

  const toggleVisibility = useCallback(() => {
    setState(prev => ({ ...prev, visible: !prev.visible }));
  }, []);

  const toggleType = useCallback((type: MeaningType) => {
    setState(prev => ({
      ...prev,
      visible_types: prev.visible_types.includes(type)
        ? prev.visible_types.filter(t => t !== type)
        : [...prev.visible_types, type],
    }));
  }, []);

  const setHovered = useCallback((meaningId: string | null) => {
    setState(prev => ({ ...prev, hovered_meaning_id: meaningId }));
  }, []);

  const setSelected = useCallback((meaningId: string | null) => {
    setState(prev => ({ ...prev, selected_meaning_id: meaningId }));
  }, []);

  const getMeaningVisuals = useCallback((): MeaningVisual[] => {
    // Would return positioned visuals for Universe View
    return [];
  }, []);

  return {
    state,
    toggleVisibility,
    toggleType,
    setHovered,
    setSelected,
    getMeaningVisuals,
  };
}

// ============================================================================
// useMeaningPrompts — Handle agent meaning prompts
// ============================================================================

interface UseMeaningPromptsReturn {
  prompts: MeaningPromptContext[];
  addPrompt: (prompt: MeaningPromptContext) => void;
  dismissPrompt: (entityId: string) => void;
  acceptPrompt: (entityId: string) => void;
  clearAll: () => void;
}

export function useMeaningPrompts(): UseMeaningPromptsReturn {
  const [prompts, setPrompts] = useState<MeaningPromptContext[]>([]);

  const addPrompt = useCallback((prompt: MeaningPromptContext) => {
    setPrompts(prev => {
      if (prev.some(p => p.trigger_entity.entity_id === prompt.trigger_entity.entity_id)) {
        return prev;
      }
      return [...prev, prompt];
    });
  }, []);

  const dismissPrompt = useCallback((entityId: string) => {
    setPrompts(prev => prev.map(p =>
      p.trigger_entity.entity_id === entityId
        ? { ...p, dismissed: true }
        : p
    ));
  }, []);

  const acceptPrompt = useCallback((entityId: string) => {
    setPrompts(prev => prev.filter(p => 
      p.trigger_entity.entity_id !== entityId
    ));
  }, []);

  const clearAll = useCallback(() => {
    setPrompts([]);
  }, []);

  return {
    prompts: prompts.filter(p => !p.dismissed),
    addPrompt,
    dismissPrompt,
    acceptPrompt,
    clearAll,
  };
}

// ============================================================================
// useMeaningReview — Review reminder management
// ============================================================================

interface UseMeaningReviewReturn {
  needsReview: MeaningSummary[];
  upcomingReviews: { meaning: MeaningSummary; reviewDate: string }[];
  markReviewed: (meaningId: string) => Promise<boolean>;
  snoozeReview: (meaningId: string, days: number) => Promise<boolean>;
}

export function useMeaningReview(userId: string): UseMeaningReviewReturn {
  const [needsReview, setNeedsReview] = useState<MeaningSummary[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<{ meaning: MeaningSummary; reviewDate: string }[]>([]);

  useEffect(() => {
    // Load meanings needing review
    // Mock - would fetch from API
  }, [userId]);

  const markReviewed = useCallback(async (meaningId: string): Promise<boolean> => {
    try {
      setNeedsReview(prev => prev.filter(m => m.id !== meaningId));
      return true;
    } catch {
      return false;
    }
  }, []);

  const snoozeReview = useCallback(async (meaningId: string, days: number): Promise<boolean> => {
    try {
      setNeedsReview(prev => prev.filter(m => m.id !== meaningId));
      // Would update next_review date
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    needsReview,
    upcomingReviews,
    markReviewed,
    snoozeReview,
  };
}

// ============================================================================
// useMeaningSearch — Search across meanings
// ============================================================================

interface UseMeaningSearchReturn {
  results: MeaningSummary[];
  isSearching: boolean;
  search: (query: string) => void;
  clearSearch: () => void;
}

export function useMeaningSearch(userId: string): UseMeaningSearchReturn {
  const [results, setResults] = useState<MeaningSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      // Mock search
      await new Promise(resolve => setTimeout(resolve, 200));
      setResults([]);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const search = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    results,
    isSearching,
    search,
    clearSearch,
  };
}

// ============================================================================
// useLinkedMeanings — Get meanings for a specific entity
// ============================================================================

interface UseLinkedMeaningsOptions {
  entityType: string;
  entityId: string;
}

interface UseLinkedMeaningsReturn {
  meanings: MeaningSummary[];
  isLoading: boolean;
  linkMeaning: (meaningId: string, reason?: string) => Promise<boolean>;
  unlinkMeaning: (meaningId: string) => Promise<boolean>;
}

export function useLinkedMeanings(options: UseLinkedMeaningsOptions): UseLinkedMeaningsReturn {
  const { entityType, entityId } = options;
  const [meanings, setMeanings] = useState<MeaningSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Mock loading
    setTimeout(() => {
      setMeanings([]);
      setIsLoading(false);
    }, 200);
  }, [entityType, entityId]);

  const linkMeaning = useCallback(async (meaningId: string, reason?: string): Promise<boolean> => {
    try {
      // Would call API
      return true;
    } catch {
      return false;
    }
  }, [entityType, entityId]);

  const unlinkMeaning = useCallback(async (meaningId: string): Promise<boolean> => {
    try {
      setMeanings(prev => prev.filter(m => m.id !== meaningId));
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    meanings,
    isLoading,
    linkMeaning,
    unlinkMeaning,
  };
}
