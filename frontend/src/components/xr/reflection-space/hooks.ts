/**
 * CHE·NU™ V51 Meta-Layer
 * Reflection Space V1.0 — Hooks
 * 
 * PURPOSE:
 * State management for reflection space functionality.
 * Provides protected space for genuine reflection.
 * 
 * CORE PRINCIPLE:
 * Reflection is SACRED, not productive.
 * The system creates space for thought, never demands output.
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type {
  Reflection,
  ReflectionSummary,
  ReflectionType,
  ReflectionState,
  ReflectionPrivacy,
  ReflectionEntry,
  ReflectionContent,
  ReflectionFilters,
  ReflectionSort,
  ReflectionViewMode,
  ReflectionSpaceUIState,
  ReflectionEditState,
  ReflectionSpace as ReflectionSpaceType,
  ReflectionEnvironment,
  ReflectionProtections,
  ReflectionPrompt,
  PromptSettings,
  ReflectionSpark,
  ReflectionConnection,
  ReflectionRetention,
  ReflectionAgentPermissions,
  ReflectionSpaceSettings
} from './reflection-space.types';
import {
  DEFAULT_REFLECTION_CONTENT,
  DEFAULT_REFLECTION_EDIT_STATE,
  DEFAULT_REFLECTION_ENVIRONMENT,
  DEFAULT_REFLECTION_PROTECTIONS,
  DEFAULT_PROMPT_SETTINGS,
  DEFAULT_REFLECTION_RETENTION,
  DEFAULT_REFLECTION_AGENT_PERMISSIONS,
  DEFAULT_REFLECTION_UI_STATE,
  DEFAULT_SPACE_SETTINGS,
  SAMPLE_REFLECTION_PROMPTS
} from './reflection-space.types';

// ============================================================================
// USE REFLECTIONS — List management
// ============================================================================

/**
 * Options for useReflections hook
 */
export interface UseReflectionsOptions {
  initialFilters?: ReflectionFilters;
  initialSort?: ReflectionSort;
  pageSize?: number;
}

/**
 * Return type for useReflections hook
 */
export interface UseReflectionsReturn {
  // Data
  reflections: ReflectionSummary[];
  totalCount: number;
  
  // Filters & Sort
  filters: ReflectionFilters;
  setFilters: (filters: ReflectionFilters) => void;
  clearFilters: () => void;
  sort: ReflectionSort;
  setSort: (sort: ReflectionSort) => void;
  
  // Pagination
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  
  // Loading
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook for managing reflection list
 */
export function useReflections(
  options: UseReflectionsOptions = {}
): UseReflectionsReturn {
  const {
    initialFilters = {},
    initialSort = 'recent_first',
    pageSize = 20
  } = options;
  
  const [reflections, setReflections] = useState<ReflectionSummary[]>([]);
  const [filters, setFilters] = useState<ReflectionFilters>(initialFilters);
  const [sort, setSort] = useState<ReflectionSort>(initialSort);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);
  
  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  }, [page, totalPages]);
  
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);
  
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);
  
  // Refresh
  const refresh = useCallback(() => {
    // Simulated - would fetch from API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Update filters resets page
  const handleSetFilters = useCallback((newFilters: ReflectionFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);
  
  return {
    reflections,
    totalCount,
    filters,
    setFilters: handleSetFilters,
    clearFilters,
    sort,
    setSort,
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    isLoading,
    error,
    refresh
  };
}

// ============================================================================
// USE REFLECTION — Single reflection CRUD
// ============================================================================

/**
 * Return type for useReflection hook
 */
export interface UseReflectionReturn {
  // Data
  reflection: Reflection | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD
  load: (id: string) => void;
  update: (updates: Partial<Reflection>) => Promise<void>;
  delete_: () => Promise<void>;
  
  // State changes
  changeState: (state: ReflectionState) => void;
  
  // Connections
  addConnection: (connection: ReflectionConnection) => void;
  removeConnection: (targetId: string) => void;
}

/**
 * Hook for single reflection operations
 */
export function useReflection(reflectionId?: string): UseReflectionReturn {
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load
  const load = useCallback((id: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulated load - would fetch from API
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);
  
  // Load on mount if ID provided
  useEffect(() => {
    if (reflectionId) {
      load(reflectionId);
    }
  }, [reflectionId, load]);
  
  // Update
  const update = useCallback(async (updates: Partial<Reflection>) => {
    if (!reflection) return;
    
    setReflection(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
  }, [reflection]);
  
  // Delete
  const delete_ = useCallback(async () => {
    if (!reflection) return;
    
    // Would call API
    setReflection(null);
  }, [reflection]);
  
  // Change state
  const changeState = useCallback((state: ReflectionState) => {
    update({ state });
  }, [update]);
  
  // Add connection
  const addConnection = useCallback((connection: ReflectionConnection) => {
    if (!reflection) return;
    
    const connections = [...(reflection.connected_to || []), connection];
    update({ connected_to: connections });
  }, [reflection, update]);
  
  // Remove connection
  const removeConnection = useCallback((targetId: string) => {
    if (!reflection) return;
    
    const connections = (reflection.connected_to || []).filter(
      c => c.target_id !== targetId
    );
    update({ connected_to: connections });
  }, [reflection, update]);
  
  return {
    reflection,
    isLoading,
    error,
    load,
    update,
    delete_,
    changeState,
    addConnection,
    removeConnection
  };
}

// ============================================================================
// USE REFLECTION EDIT — Editing state management
// ============================================================================

/**
 * Return type for useReflectionEdit hook
 */
export interface UseReflectionEditReturn {
  // State
  editState: ReflectionEditState;
  
  // Updates
  updateTitle: (title: string | undefined) => void;
  updateContent: (content: Partial<ReflectionContent>) => void;
  updateType: (type: ReflectionType) => void;
  updatePrivacy: (privacy: ReflectionPrivacy) => void;
  updateEntry: (entry: ReflectionEntry) => void;
  updateTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setSpark: (spark: ReflectionSpark | undefined) => void;
  
  // Content helpers
  addFragment: (fragment: string) => void;
  updateFragment: (index: number, value: string) => void;
  removeFragment: (index: number) => void;
  addQuestion: (question: string) => void;
  updateQuestion: (index: number, value: string) => void;
  removeQuestion: (index: number) => void;
  addObservation: (observation: string) => void;
  addFeeling: (feeling: string) => void;
  
  // Actions
  reset: () => void;
  loadFromReflection: (reflection: Reflection) => void;
  markSaved: () => void;
  
  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
}

/**
 * Hook for reflection editing state
 */
export function useReflectionEdit(
  initialReflection?: Reflection
): UseReflectionEditReturn {
  const [editState, setEditState] = useState<ReflectionEditState>(() => {
    if (initialReflection) {
      return {
        reflection_id: initialReflection.id,
        is_new: false,
        title: initialReflection.title,
        content: initialReflection.content,
        type: initialReflection.type,
        privacy: initialReflection.privacy,
        entry: initialReflection.entry,
        sparked_by: initialReflection.sparked_by,
        tags: initialReflection.tags,
        has_changes: false,
        auto_save_enabled: true,
        is_recording: false,
        is_sketching: false
      };
    }
    return DEFAULT_REFLECTION_EDIT_STATE;
  });
  
  // Update helpers
  const updateTitle = useCallback((title: string | undefined) => {
    setEditState(prev => ({ ...prev, title, has_changes: true }));
  }, []);
  
  const updateContent = useCallback((content: Partial<ReflectionContent>) => {
    setEditState(prev => ({
      ...prev,
      content: { ...prev.content, ...content },
      has_changes: true
    }));
  }, []);
  
  const updateType = useCallback((type: ReflectionType) => {
    setEditState(prev => ({ ...prev, type, has_changes: true }));
  }, []);
  
  const updatePrivacy = useCallback((privacy: ReflectionPrivacy) => {
    setEditState(prev => ({ ...prev, privacy, has_changes: true }));
  }, []);
  
  const updateEntry = useCallback((entry: ReflectionEntry) => {
    setEditState(prev => ({ ...prev, entry }));
  }, []);
  
  const updateTags = useCallback((tags: string[]) => {
    setEditState(prev => ({ ...prev, tags, has_changes: true }));
  }, []);
  
  const addTag = useCallback((tag: string) => {
    setEditState(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
      has_changes: true
    }));
  }, []);
  
  const removeTag = useCallback((tag: string) => {
    setEditState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
      has_changes: true
    }));
  }, []);
  
  const setSpark = useCallback((spark: ReflectionSpark | undefined) => {
    setEditState(prev => ({ ...prev, sparked_by: spark }));
  }, []);
  
  // Content helpers
  const addFragment = useCallback((fragment: string) => {
    setEditState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        fragments: [...(prev.content.fragments || []), fragment]
      },
      has_changes: true
    }));
  }, []);
  
  const updateFragment = useCallback((index: number, value: string) => {
    setEditState(prev => {
      const fragments = [...(prev.content.fragments || [])];
      fragments[index] = value;
      return {
        ...prev,
        content: { ...prev.content, fragments },
        has_changes: true
      };
    });
  }, []);
  
  const removeFragment = useCallback((index: number) => {
    setEditState(prev => {
      const fragments = [...(prev.content.fragments || [])];
      fragments.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, fragments },
        has_changes: true
      };
    });
  }, []);
  
  const addQuestion = useCallback((question: string) => {
    setEditState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [...(prev.content.questions || []), question]
      },
      has_changes: true
    }));
  }, []);
  
  const updateQuestion = useCallback((index: number, value: string) => {
    setEditState(prev => {
      const questions = [...(prev.content.questions || [])];
      questions[index] = value;
      return {
        ...prev,
        content: { ...prev.content, questions },
        has_changes: true
      };
    });
  }, []);
  
  const removeQuestion = useCallback((index: number) => {
    setEditState(prev => {
      const questions = [...(prev.content.questions || [])];
      questions.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, questions },
        has_changes: true
      };
    });
  }, []);
  
  const addObservation = useCallback((observation: string) => {
    setEditState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        observations: [...(prev.content.observations || []), observation]
      },
      has_changes: true
    }));
  }, []);
  
  const addFeeling = useCallback((feeling: string) => {
    setEditState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        feelings: [...(prev.content.feelings || []), feeling]
      },
      has_changes: true
    }));
  }, []);
  
  // Actions
  const reset = useCallback(() => {
    setEditState(DEFAULT_REFLECTION_EDIT_STATE);
  }, []);
  
  const loadFromReflection = useCallback((reflection: Reflection) => {
    setEditState({
      reflection_id: reflection.id,
      is_new: false,
      title: reflection.title,
      content: reflection.content,
      type: reflection.type,
      privacy: reflection.privacy,
      entry: reflection.entry,
      sparked_by: reflection.sparked_by,
      tags: reflection.tags,
      has_changes: false,
      auto_save_enabled: true,
      is_recording: false,
      is_sketching: false
    });
  }, []);
  
  const markSaved = useCallback(() => {
    setEditState(prev => ({
      ...prev,
      has_changes: false,
      last_saved_at: new Date().toISOString()
    }));
  }, []);
  
  const enableAutoSave = useCallback(() => {
    setEditState(prev => ({ ...prev, auto_save_enabled: true }));
  }, []);
  
  const disableAutoSave = useCallback(() => {
    setEditState(prev => ({ ...prev, auto_save_enabled: false }));
  }, []);
  
  return {
    editState,
    updateTitle,
    updateContent,
    updateType,
    updatePrivacy,
    updateEntry,
    updateTags,
    addTag,
    removeTag,
    setSpark,
    addFragment,
    updateFragment,
    removeFragment,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addObservation,
    addFeeling,
    reset,
    loadFromReflection,
    markSaved,
    enableAutoSave,
    disableAutoSave
  };
}

// ============================================================================
// USE REFLECTION SPACE — Space environment management
// ============================================================================

/**
 * Return type for useReflectionSpaceEnv hook
 */
export interface UseReflectionSpaceEnvReturn {
  // State
  isActive: boolean;
  environment: ReflectionEnvironment;
  protections: ReflectionProtections;
  
  // Actions
  enter: () => void;
  exit: () => void;
  
  // Environment settings
  setTheme: (theme: ReflectionEnvironment['theme']) => void;
  toggleTime: () => void;
  toggleCounts: () => void;
  setAmbientSound: (sound: ReflectionEnvironment['ambient_sound']) => void;
  
  // Protection settings
  setProtectionDuration: (duration: ReflectionProtections['protection_duration']) => void;
  setProtectionMinutes: (minutes: number) => void;
}

/**
 * Hook for reflection space environment
 */
export function useReflectionSpaceEnv(
  initialEnvironment: ReflectionEnvironment = DEFAULT_REFLECTION_ENVIRONMENT,
  initialProtections: ReflectionProtections = DEFAULT_REFLECTION_PROTECTIONS
): UseReflectionSpaceEnvReturn {
  const [isActive, setIsActive] = useState(false);
  const [environment, setEnvironment] = useState<ReflectionEnvironment>(initialEnvironment);
  const [protections, setProtections] = useState<ReflectionProtections>(initialProtections);
  
  // Enter space
  const enter = useCallback(() => {
    setIsActive(true);
  }, []);
  
  // Exit space
  const exit = useCallback(() => {
    setIsActive(false);
  }, []);
  
  // Environment settings
  const setTheme = useCallback((theme: ReflectionEnvironment['theme']) => {
    setEnvironment(prev => ({ ...prev, theme }));
  }, []);
  
  const toggleTime = useCallback(() => {
    setEnvironment(prev => ({ ...prev, show_time: !prev.show_time }));
  }, []);
  
  const toggleCounts = useCallback(() => {
    setEnvironment(prev => ({ ...prev, show_counts: !prev.show_counts }));
  }, []);
  
  const setAmbientSound = useCallback((sound: ReflectionEnvironment['ambient_sound']) => {
    setEnvironment(prev => ({ ...prev, ambient_sound: sound }));
  }, []);
  
  // Protection settings
  const setProtectionDuration = useCallback((duration: ReflectionProtections['protection_duration']) => {
    setProtections(prev => ({ ...prev, protection_duration: duration }));
  }, []);
  
  const setProtectionMinutes = useCallback((minutes: number) => {
    setProtections(prev => ({ ...prev, protection_minutes: minutes }));
  }, []);
  
  return {
    isActive,
    environment,
    protections,
    enter,
    exit,
    setTheme,
    toggleTime,
    toggleCounts,
    setAmbientSound,
    setProtectionDuration,
    setProtectionMinutes
  };
}

// ============================================================================
// USE REFLECTION PROMPTS — Prompt management
// ============================================================================

/**
 * Return type for useReflectionPrompts hook
 */
export interface UseReflectionPromptsReturn {
  // Data
  prompts: ReflectionPrompt[];
  currentPrompt: ReflectionPrompt | null;
  
  // Settings
  settings: PromptSettings;
  updateSettings: (settings: Partial<PromptSettings>) => void;
  
  // Actions
  getRandomPrompt: () => ReflectionPrompt | null;
  nextPrompt: () => void;
  dismissPrompt: () => void;
  markUsed: (promptId: string) => void;
  
  // Custom prompts
  addCustomPrompt: (text: string) => void;
  removeCustomPrompt: (id: string) => void;
}

/**
 * Hook for reflection prompts
 */
export function useReflectionPrompts(
  initialPrompts: ReflectionPrompt[] = SAMPLE_REFLECTION_PROMPTS,
  initialSettings: PromptSettings = DEFAULT_PROMPT_SETTINGS
): UseReflectionPromptsReturn {
  const [prompts, setPrompts] = useState<ReflectionPrompt[]>(initialPrompts);
  const [settings, setSettings] = useState<PromptSettings>(initialSettings);
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(null);
  
  // Get random prompt
  const getRandomPrompt = useCallback(() => {
    if (!settings.show_prompts) return null;
    
    const available = prompts.filter(p =>
      settings.include_categories.includes(p.category) &&
      (settings.repeat_used || !p.used_by_user)
    );
    
    if (available.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }, [prompts, settings]);
  
  // Next prompt
  const nextPrompt = useCallback(() => {
    const next = getRandomPrompt();
    setCurrentPrompt(next);
  }, [getRandomPrompt]);
  
  // Dismiss prompt
  const dismissPrompt = useCallback(() => {
    setCurrentPrompt(null);
  }, []);
  
  // Mark used
  const markUsed = useCallback((promptId: string) => {
    setPrompts(prev => prev.map(p =>
      p.id === promptId
        ? { ...p, used_by_user: true, seen_by_user: true }
        : p
    ));
  }, []);
  
  // Update settings
  const updateSettings = useCallback((updates: Partial<PromptSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Add custom prompt
  const addCustomPrompt = useCallback((text: string) => {
    const newPrompt: ReflectionPrompt = {
      id: `custom_${Date.now()}`,
      text,
      invites_type: 'freeform',
      category: 'custom',
      seen_by_user: false,
      used_by_user: false
    };
    setPrompts(prev => [...prev, newPrompt]);
  }, []);
  
  // Remove custom prompt
  const removeCustomPrompt = useCallback((id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);
  
  return {
    prompts,
    currentPrompt,
    settings,
    updateSettings,
    getRandomPrompt,
    nextPrompt,
    dismissPrompt,
    markUsed,
    addCustomPrompt,
    removeCustomPrompt
  };
}

// ============================================================================
// USE REFLECTION SPACE UI — UI state management
// ============================================================================

/**
 * Return type for useReflectionSpaceUI hook
 */
export interface UseReflectionSpaceUIReturn {
  // State
  uiState: ReflectionSpaceUIState;
  
  // View mode
  setViewMode: (mode: ReflectionViewMode) => void;
  
  // Filters
  setFilters: (filters: ReflectionFilters) => void;
  clearFilters: () => void;
  
  // Sort
  setSort: (sort: ReflectionSort) => void;
  
  // Navigation
  goToList: () => void;
  goToSpace: () => void;
  goToSingle: (id: string) => void;
  goToSettings: () => void;
  
  // Modes
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  
  // Prompt
  showPrompt: () => void;
  hidePrompt: () => void;
}

/**
 * Hook for reflection space UI state
 */
export function useReflectionSpaceUI(): UseReflectionSpaceUIReturn {
  const [uiState, setUIState] = useState<ReflectionSpaceUIState>(DEFAULT_REFLECTION_UI_STATE);
  
  // View mode
  const setViewMode = useCallback((viewMode: ReflectionViewMode) => {
    setUIState(prev => ({ ...prev, viewMode }));
  }, []);
  
  // Filters
  const setFilters = useCallback((filters: ReflectionFilters) => {
    setUIState(prev => ({ ...prev, filters }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setUIState(prev => ({ ...prev, filters: {} }));
  }, []);
  
  // Sort
  const setSort = useCallback((sort: ReflectionSort) => {
    setUIState(prev => ({ ...prev, sort }));
  }, []);
  
  // Navigation
  const goToList = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      currentView: 'list',
      selectedReflectionId: undefined,
      spaceActive: false,
      isCreating: false,
      isEditing: false
    }));
  }, []);
  
  const goToSpace = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      currentView: 'space',
      spaceActive: true,
      isCreating: true
    }));
  }, []);
  
  const goToSingle = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      currentView: 'single',
      selectedReflectionId: id,
      spaceActive: false
    }));
  }, []);
  
  const goToSettings = useCallback(() => {
    setUIState(prev => ({ ...prev, currentView: 'settings' }));
  }, []);
  
  // Modes
  const startCreating = useCallback(() => {
    setUIState(prev => ({ ...prev, isCreating: true }));
  }, []);
  
  const stopCreating = useCallback(() => {
    setUIState(prev => ({ ...prev, isCreating: false }));
  }, []);
  
  const startEditing = useCallback(() => {
    setUIState(prev => ({ ...prev, isEditing: true }));
  }, []);
  
  const stopEditing = useCallback(() => {
    setUIState(prev => ({ ...prev, isEditing: false }));
  }, []);
  
  // Prompt
  const showPrompt = useCallback(() => {
    setUIState(prev => ({ ...prev, showPrompt: true }));
  }, []);
  
  const hidePrompt = useCallback(() => {
    setUIState(prev => ({ ...prev, showPrompt: false, currentPromptId: undefined }));
  }, []);
  
  return {
    uiState,
    setViewMode,
    setFilters,
    clearFilters,
    setSort,
    goToList,
    goToSpace,
    goToSingle,
    goToSettings,
    startCreating,
    stopCreating,
    startEditing,
    stopEditing,
    showPrompt,
    hidePrompt
  };
}

// ============================================================================
// USE REFLECTION PRIVACY — Privacy management
// ============================================================================

/**
 * Return type for useReflectionPrivacy hook
 */
export interface UseReflectionPrivacyReturn {
  // Agent permissions
  agentPermissions: ReflectionAgentPermissions;
  setAgentPermissions: (permissions: Partial<ReflectionAgentPermissions>) => void;
  
  // Default privacy
  defaultPrivacy: ReflectionPrivacy;
  setDefaultPrivacy: (privacy: ReflectionPrivacy) => void;
  
  // Default retention
  defaultRetention: ReflectionRetention;
  setDefaultRetention: (retention: Partial<ReflectionRetention>) => void;
}

/**
 * Hook for reflection privacy settings
 */
export function useReflectionPrivacy(): UseReflectionPrivacyReturn {
  const [agentPermissions, setAgentPermissionsState] = useState<ReflectionAgentPermissions>(
    DEFAULT_REFLECTION_AGENT_PERMISSIONS
  );
  const [defaultPrivacy, setDefaultPrivacyState] = useState<ReflectionPrivacy>('private');
  const [defaultRetention, setDefaultRetentionState] = useState<ReflectionRetention>(
    DEFAULT_REFLECTION_RETENTION
  );
  
  const setAgentPermissions = useCallback((permissions: Partial<ReflectionAgentPermissions>) => {
    setAgentPermissionsState(prev => ({ ...prev, ...permissions }));
  }, []);
  
  const setDefaultPrivacy = useCallback((privacy: ReflectionPrivacy) => {
    setDefaultPrivacyState(privacy);
  }, []);
  
  const setDefaultRetention = useCallback((retention: Partial<ReflectionRetention>) => {
    setDefaultRetentionState(prev => ({ ...prev, ...retention }));
  }, []);
  
  return {
    agentPermissions,
    setAgentPermissions,
    defaultPrivacy,
    setDefaultPrivacy,
    defaultRetention,
    setDefaultRetention
  };
}

// ============================================================================
// USE REFLECTION SEARCH — Search functionality
// ============================================================================

/**
 * Return type for useReflectionSearch hook
 */
export interface UseReflectionSearchReturn {
  // Search state
  query: string;
  setQuery: (query: string) => void;
  results: ReflectionSummary[];
  isSearching: boolean;
  
  // Actions
  search: () => void;
  clear: () => void;
}

/**
 * Hook for reflection search
 */
export function useReflectionSearch(
  reflections: ReflectionSummary[]
): UseReflectionSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReflectionSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Search
  const search = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    const searchLower = query.toLowerCase();
    const found = reflections.filter(r =>
      r.title?.toLowerCase().includes(searchLower) ||
      r.preview?.toLowerCase().includes(searchLower) ||
      r.tags.some(t => t.toLowerCase().includes(searchLower))
    );
    
    setResults(found);
    setIsSearching(false);
  }, [query, reflections]);
  
  // Clear
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);
  
  return {
    query,
    setQuery,
    results,
    isSearching,
    search,
    clear
  };
}

// ============================================================================
// USE REFLECTION SETTINGS — All settings combined
// ============================================================================

/**
 * Return type for useReflectionSettings hook
 */
export interface UseReflectionSettingsReturn {
  // All settings
  settings: ReflectionSpaceSettings;
  
  // Update sections
  updateEnvironment: (env: Partial<ReflectionEnvironment>) => void;
  updateProtections: (prot: Partial<ReflectionProtections>) => void;
  updatePrompts: (prompts: Partial<PromptSettings>) => void;
  updateAgentPermissions: (perms: Partial<ReflectionAgentPermissions>) => void;
  updateDefaultRetention: (ret: Partial<ReflectionRetention>) => void;
  
  // Reset
  resetToDefaults: () => void;
}

/**
 * Hook for all reflection settings
 */
export function useReflectionSettings(
  initialSettings: ReflectionSpaceSettings = DEFAULT_SPACE_SETTINGS
): UseReflectionSettingsReturn {
  const [settings, setSettings] = useState<ReflectionSpaceSettings>(initialSettings);
  
  const updateEnvironment = useCallback((env: Partial<ReflectionEnvironment>) => {
    setSettings(prev => ({
      ...prev,
      environment: { ...prev.environment, ...env }
    }));
  }, []);
  
  const updateProtections = useCallback((prot: Partial<ReflectionProtections>) => {
    setSettings(prev => ({
      ...prev,
      protections: { ...prev.protections, ...prot }
    }));
  }, []);
  
  const updatePrompts = useCallback((prompts: Partial<PromptSettings>) => {
    setSettings(prev => ({
      ...prev,
      prompts: { ...prev.prompts, ...prompts }
    }));
  }, []);
  
  const updateAgentPermissions = useCallback((perms: Partial<ReflectionAgentPermissions>) => {
    setSettings(prev => ({
      ...prev,
      agentPermissions: { ...prev.agentPermissions, ...perms }
    }));
  }, []);
  
  const updateDefaultRetention = useCallback((ret: Partial<ReflectionRetention>) => {
    setSettings(prev => ({
      ...prev,
      defaultRetention: { ...prev.defaultRetention, ...ret }
    }));
  }, []);
  
  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SPACE_SETTINGS);
  }, []);
  
  return {
    settings,
    updateEnvironment,
    updateProtections,
    updatePrompts,
    updateAgentPermissions,
    updateDefaultRetention,
    resetToDefaults
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  UseReflectionsOptions,
  UseReflectionsReturn,
  UseReflectionReturn,
  UseReflectionEditReturn,
  UseReflectionSpaceEnvReturn,
  UseReflectionPromptsReturn,
  UseReflectionSpaceUIReturn,
  UseReflectionPrivacyReturn,
  UseReflectionSearchReturn,
  UseReflectionSettingsReturn
};
