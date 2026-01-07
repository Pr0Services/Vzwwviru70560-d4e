/**
 * CHE·NU™ V51 Meta-Layer
 * Context Snapshot V1.0 — Hooks
 * 
 * PURPOSE:
 * State management for context snapshot functionality.
 * Enables capture, storage, and restoration of mental context.
 * 
 * CORE PRINCIPLE:
 * Snapshots are CAPTURES, not records.
 * The system preserves state, never surveils.
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  ContextSnapshot,
  SnapshotTrigger,
  SnapshotState,
  CapturedThread,
  CapturedAgent,
  CapturedNavigation,
  CapturedOpenItems,
  ContextNotes,
  SnapshotFilters,
  ContextSnapshotUIState,
  CaptureFlowState,
  RestoreFlowState,
  CaptureConfig,
  RestoreOptions,
  RetentionSettings,
  QuickCapture,
  SnapshotAutomationSettings,
  SnapshotPrivacySettings
} from './context-snapshot.types';
import {
  DEFAULT_CAPTURE_CONFIG,
  DEFAULT_RESTORE_OPTIONS,
  DEFAULT_AUTOMATION_SETTINGS,
  DEFAULT_SNAPSHOT_PRIVACY
} from './context-snapshot.types';

// ============================================================================
// USE SNAPSHOTS — List management
// ============================================================================

/**
 * Options for useSnapshots hook
 */
interface UseSnapshotsOptions {
  initialFilters?: SnapshotFilters;
  initialSort?: 'recent_first' | 'oldest_first' | 'by_sphere';
}

/**
 * Return type for useSnapshots hook
 */
interface UseSnapshotsReturn {
  snapshots: ContextSnapshot[];
  filteredSnapshots: ContextSnapshot[];
  filters: SnapshotFilters;
  sort: 'recent_first' | 'oldest_first' | 'by_sphere';
  setFilters: (filters: SnapshotFilters) => void;
  setSort: (sort: 'recent_first' | 'oldest_first' | 'by_sphere') => void;
  addSnapshot: (snapshot: ContextSnapshot) => void;
  removeSnapshot: (id: string) => void;
  updateSnapshot: (id: string, updates: Partial<ContextSnapshot>) => void;
  clearFilters: () => void;
  activeCount: number;
  archivedCount: number;
}

/**
 * Hook for managing snapshot list
 */
export function useSnapshots(
  initialSnapshots: ContextSnapshot[] = [],
  options: UseSnapshotsOptions = {}
): UseSnapshotsReturn {
  const [snapshots, setSnapshots] = useState<ContextSnapshot[]>(initialSnapshots);
  const [filters, setFilters] = useState<SnapshotFilters>(options.initialFilters || {});
  const [sort, setSort] = useState<'recent_first' | 'oldest_first' | 'by_sphere'>(
    options.initialSort || 'recent_first'
  );
  
  // Filtered and sorted snapshots
  const filteredSnapshots = useMemo(() => {
    let result = [...snapshots];
    
    // Apply filters
    if (filters.triggers?.length) {
      result = result.filter(s => filters.triggers!.includes(s.trigger));
    }
    if (filters.states?.length) {
      result = result.filter(s => filters.states!.includes(s.state));
    }
    if (filters.spheres?.length) {
      result = result.filter(s => filters.spheres!.includes(s.sphere));
    }
    if (filters.tags?.length) {
      result = result.filter(s => 
        s.tags.some(t => filters.tags!.includes(t))
      );
    }
    if (filters.has_notes !== undefined) {
      result = result.filter(s => {
        const hasNotes = !!(
          s.notes.current_focus || 
          s.notes.next_intention || 
          s.notes.important_context
        );
        return hasNotes === filters.has_notes;
      });
    }
    if (filters.date_range) {
      if (filters.date_range.from) {
        const from = new Date(filters.date_range.from);
        result = result.filter(s => new Date(s.captured_at) >= from);
      }
      if (filters.date_range.to) {
        const to = new Date(filters.date_range.to);
        result = result.filter(s => new Date(s.captured_at) <= to);
      }
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(s => {
        const searchable = [
          s.title,
          s.notes.current_focus,
          s.notes.next_intention,
          s.notes.important_context,
          s.sphere,
          ...s.tags
        ].filter(Boolean).join(' ').toLowerCase();
        return searchable.includes(search);
      });
    }
    
    // Apply sort
    switch (sort) {
      case 'recent_first':
        result.sort((a, b) => 
          new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
        );
        break;
      case 'oldest_first':
        result.sort((a, b) => 
          new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime()
        );
        break;
      case 'by_sphere':
        result.sort((a, b) => a.sphere.localeCompare(b.sphere));
        break;
    }
    
    return result;
  }, [snapshots, filters, sort]);
  
  // Add snapshot
  const addSnapshot = useCallback((snapshot: ContextSnapshot) => {
    setSnapshots(prev => [snapshot, ...prev]);
  }, []);
  
  // Remove snapshot
  const removeSnapshot = useCallback((id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  }, []);
  
  // Update snapshot
  const updateSnapshot = useCallback((id: string, updates: Partial<ContextSnapshot>) => {
    setSnapshots(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);
  
  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  // Counts
  const activeCount = useMemo(() => 
    snapshots.filter(s => s.state === 'active').length,
    [snapshots]
  );
  
  const archivedCount = useMemo(() => 
    snapshots.filter(s => s.state === 'archived').length,
    [snapshots]
  );
  
  return {
    snapshots,
    filteredSnapshots,
    filters,
    sort,
    setFilters,
    setSort,
    addSnapshot,
    removeSnapshot,
    updateSnapshot,
    clearFilters,
    activeCount,
    archivedCount
  };
}

// ============================================================================
// USE SNAPSHOT — Single snapshot operations
// ============================================================================

/**
 * Return type for useSnapshot hook
 */
interface UseSnapshotReturn {
  snapshot: ContextSnapshot | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  archive: () => Promise<void>;
  restore: (options: RestoreOptions) => Promise<void>;
  delete_: () => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  updateNotes: (notes: Partial<ContextNotes>) => void;
}

/**
 * Hook for single snapshot operations
 */
export function useSnapshot(
  snapshotId: string | null,
  fetchSnapshot: (id: string) => Promise<ContextSnapshot>,
  onArchive: (id: string) => Promise<void>,
  onRestore: (id: string, options: RestoreOptions) => Promise<void>,
  onDelete: (id: string) => Promise<void>,
  onUpdate: (id: string, updates: Partial<ContextSnapshot>) => void
): UseSnapshotReturn {
  const [snapshot, setSnapshot] = useState<ContextSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch snapshot
  const refresh = useCallback(async () => {
    if (!snapshotId) {
      setSnapshot(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSnapshot(snapshotId);
      setSnapshot(data);
    } catch (err) {
      setError('Failed to load snapshot');
      logger.error('Snapshot fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [snapshotId, fetchSnapshot]);
  
  // Load on mount / id change
  useEffect(() => {
    refresh();
  }, [refresh]);
  
  // Archive
  const archive = useCallback(async () => {
    if (!snapshot) return;
    
    try {
      await onArchive(snapshot.id);
      setSnapshot(prev => prev ? { ...prev, state: 'archived' } : null);
    } catch (err) {
      setError('Failed to archive snapshot');
    }
  }, [snapshot, onArchive]);
  
  // Restore
  const restore = useCallback(async (options: RestoreOptions) => {
    if (!snapshot) return;
    
    try {
      await onRestore(snapshot.id, options);
      setSnapshot(prev => prev ? { ...prev, state: 'restored' } : null);
    } catch (err) {
      setError('Failed to restore snapshot');
    }
  }, [snapshot, onRestore]);
  
  // Delete
  const delete_ = useCallback(async () => {
    if (!snapshot) return;
    
    try {
      await onDelete(snapshot.id);
      setSnapshot(null);
    } catch (err) {
      setError('Failed to delete snapshot');
    }
  }, [snapshot, onDelete]);
  
  // Add tag
  const addTag = useCallback((tag: string) => {
    if (!snapshot) return;
    if (snapshot.tags.includes(tag)) return;
    
    const updatedTags = [...snapshot.tags, tag];
    setSnapshot(prev => prev ? { ...prev, tags: updatedTags } : null);
    onUpdate(snapshot.id, { tags: updatedTags });
  }, [snapshot, onUpdate]);
  
  // Remove tag
  const removeTag = useCallback((tag: string) => {
    if (!snapshot) return;
    
    const updatedTags = snapshot.tags.filter(t => t !== tag);
    setSnapshot(prev => prev ? { ...prev, tags: updatedTags } : null);
    onUpdate(snapshot.id, { tags: updatedTags });
  }, [snapshot, onUpdate]);
  
  // Update notes
  const updateNotes = useCallback((notes: Partial<ContextNotes>) => {
    if (!snapshot) return;
    
    const updatedNotes = { ...snapshot.notes, ...notes };
    setSnapshot(prev => prev ? { ...prev, notes: updatedNotes } : null);
    onUpdate(snapshot.id, { notes: updatedNotes });
  }, [snapshot, onUpdate]);
  
  return {
    snapshot,
    loading,
    error,
    refresh,
    archive,
    restore,
    delete_,
    addTag,
    removeTag,
    updateNotes
  };
}

// ============================================================================
// USE SNAPSHOT CAPTURE — Capture flow state
// ============================================================================

/**
 * Return type for useSnapshotCapture hook
 */
interface UseSnapshotCaptureReturn {
  captureState: CaptureFlowState;
  isCapturing: boolean;
  canProceed: boolean;
  setConfig: (config: Partial<CaptureConfig>) => void;
  setNotes: (notes: Partial<ContextNotes>) => void;
  setTitle: (title: string) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setRetention: (retention: RetentionSettings) => void;
  nextStep: () => void;
  prevStep: () => void;
  capture: () => Promise<string>;
  reset: () => void;
}

/**
 * Hook for capture flow state management
 */
export function useSnapshotCapture(
  onCapture: (
    config: CaptureConfig,
    notes: ContextNotes,
    title?: string,
    tags?: string[],
    retention?: RetentionSettings
  ) => Promise<string>
): UseSnapshotCaptureReturn {
  const [captureState, setCaptureState] = useState<CaptureFlowState>({
    step: 'config',
    config: DEFAULT_CAPTURE_CONFIG,
    notes: {},
    tags: [],
    progress: 0
  });
  
  const isCapturing = captureState.step === 'capturing';
  
  // Can proceed validation
  const canProceed = useMemo(() => {
    switch (captureState.step) {
      case 'config':
        // At least one thing to capture
        return (
          captureState.config.capture_threads ||
          captureState.config.capture_agents ||
          captureState.config.capture_navigation ||
          captureState.config.capture_open_items ||
          captureState.config.capture_decisions ||
          captureState.config.capture_meanings
        );
      case 'notes':
        return true; // Notes are optional
      case 'review':
        return true;
      default:
        return false;
    }
  }, [captureState]);
  
  // Set config
  const setConfig = useCallback((config: Partial<CaptureConfig>) => {
    setCaptureState(prev => ({
      ...prev,
      config: { ...prev.config, ...config }
    }));
  }, []);
  
  // Set notes
  const setNotes = useCallback((notes: Partial<ContextNotes>) => {
    setCaptureState(prev => ({
      ...prev,
      notes: { ...prev.notes, ...notes }
    }));
  }, []);
  
  // Set title
  const setTitle = useCallback((title: string) => {
    setCaptureState(prev => ({ ...prev, title }));
  }, []);
  
  // Set tags
  const setTags = useCallback((tags: string[]) => {
    setCaptureState(prev => ({ ...prev, tags }));
  }, []);
  
  // Add tag
  const addTag = useCallback((tag: string) => {
    setCaptureState(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag]
    }));
  }, []);
  
  // Remove tag
  const removeTag = useCallback((tag: string) => {
    setCaptureState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);
  
  // Set retention
  const setRetention = useCallback((retention: RetentionSettings) => {
    setCaptureState(prev => ({ ...prev, retention }));
  }, []);
  
  // Next step
  const nextStep = useCallback(() => {
    setCaptureState(prev => {
      const steps: CaptureFlowState['step'][] = ['config', 'notes', 'review'];
      const currentIndex = steps.indexOf(prev.step);
      if (currentIndex >= steps.length - 1) return prev;
      return { ...prev, step: steps[currentIndex + 1] };
    });
  }, []);
  
  // Previous step
  const prevStep = useCallback(() => {
    setCaptureState(prev => {
      const steps: CaptureFlowState['step'][] = ['config', 'notes', 'review'];
      const currentIndex = steps.indexOf(prev.step);
      if (currentIndex <= 0) return prev;
      return { ...prev, step: steps[currentIndex - 1] };
    });
  }, []);
  
  // Capture
  const capture = useCallback(async (): Promise<string> => {
    setCaptureState(prev => ({ ...prev, step: 'capturing', progress: 0, error: undefined }));
    
    // Progress simulation
    const interval = setInterval(() => {
      setCaptureState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 15, 90)
      }));
    }, 150);
    
    try {
      const id = await onCapture(
        captureState.config,
        captureState.notes as ContextNotes,
        captureState.title,
        captureState.tags,
        captureState.retention
      );
      
      clearInterval(interval);
      setCaptureState(prev => ({ ...prev, step: 'complete', progress: 100 }));
      
      return id;
    } catch (err) {
      clearInterval(interval);
      setCaptureState(prev => ({
        ...prev,
        step: 'config',
        progress: 0,
        error: 'Failed to capture context. Please try again.'
      }));
      throw err;
    }
  }, [captureState, onCapture]);
  
  // Reset
  const reset = useCallback(() => {
    setCaptureState({
      step: 'config',
      config: DEFAULT_CAPTURE_CONFIG,
      notes: {},
      tags: [],
      progress: 0
    });
  }, []);
  
  return {
    captureState,
    isCapturing,
    canProceed,
    setConfig,
    setNotes,
    setTitle,
    setTags,
    addTag,
    removeTag,
    setRetention,
    nextStep,
    prevStep,
    capture,
    reset
  };
}

// ============================================================================
// USE SNAPSHOT RESTORE — Restore flow state
// ============================================================================

/**
 * Return type for useSnapshotRestore hook
 */
interface UseSnapshotRestoreReturn {
  restoreState: RestoreFlowState;
  isRestoring: boolean;
  setOptions: (options: Partial<RestoreOptions>) => void;
  restore: () => Promise<void>;
  reset: () => void;
  setSnapshotId: (id: string) => void;
}

/**
 * Hook for restore flow state management
 */
export function useSnapshotRestore(
  onRestore: (id: string, options: RestoreOptions) => Promise<void>
): UseSnapshotRestoreReturn {
  const [restoreState, setRestoreState] = useState<RestoreFlowState>({
    snapshot_id: '',
    step: 'options',
    options: DEFAULT_RESTORE_OPTIONS,
    progress: 0,
    restored_elements: []
  });
  
  const isRestoring = restoreState.step === 'restoring';
  
  // Set snapshot ID
  const setSnapshotId = useCallback((id: string) => {
    setRestoreState(prev => ({ ...prev, snapshot_id: id }));
  }, []);
  
  // Set options
  const setOptions = useCallback((options: Partial<RestoreOptions>) => {
    setRestoreState(prev => ({
      ...prev,
      options: { ...prev.options, ...options }
    }));
  }, []);
  
  // Restore
  const restore = useCallback(async () => {
    if (!restoreState.snapshot_id) return;
    
    setRestoreState(prev => ({ ...prev, step: 'restoring', progress: 0, error: undefined }));
    
    // Progress simulation
    const interval = setInterval(() => {
      setRestoreState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 20, 90)
      }));
    }, 150);
    
    try {
      await onRestore(restoreState.snapshot_id, restoreState.options);
      
      clearInterval(interval);
      
      // Build restored elements list
      const elements: string[] = [];
      if (restoreState.options.restore_navigation) elements.push('Navigation state');
      if (restoreState.options.restore_threads) elements.push('Active threads');
      if (restoreState.options.restore_agents) elements.push('Active agents');
      if (restoreState.options.restore_open_items) elements.push('Open items');
      
      setRestoreState(prev => ({
        ...prev,
        step: 'complete',
        progress: 100,
        restored_elements: elements
      }));
    } catch (err) {
      clearInterval(interval);
      setRestoreState(prev => ({
        ...prev,
        step: 'options',
        progress: 0,
        error: 'Failed to restore context. Please try again.'
      }));
      throw err;
    }
  }, [restoreState, onRestore]);
  
  // Reset
  const reset = useCallback(() => {
    setRestoreState({
      snapshot_id: '',
      step: 'options',
      options: DEFAULT_RESTORE_OPTIONS,
      progress: 0,
      restored_elements: []
    });
  }, []);
  
  return {
    restoreState,
    isRestoring,
    setOptions,
    restore,
    reset,
    setSnapshotId
  };
}

// ============================================================================
// USE QUICK CAPTURE — Minimal capture
// ============================================================================

/**
 * Return type for useQuickCapture hook
 */
interface UseQuickCaptureReturn {
  isOpen: boolean;
  focus: string;
  intention: string;
  setFocus: (focus: string) => void;
  setIntention: (intention: string) => void;
  open: () => void;
  close: () => void;
  capture: () => Promise<string>;
}

/**
 * Hook for quick capture functionality
 */
export function useQuickCapture(
  onQuickCapture: (focus?: string, intention?: string) => Promise<string>
): UseQuickCaptureReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [focus, setFocus] = useState('');
  const [intention, setIntention] = useState('');
  
  const open = useCallback(() => {
    setIsOpen(true);
    setFocus('');
    setIntention('');
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
    setFocus('');
    setIntention('');
  }, []);
  
  const capture = useCallback(async () => {
    const id = await onQuickCapture(
      focus || undefined,
      intention || undefined
    );
    close();
    return id;
  }, [focus, intention, onQuickCapture, close]);
  
  return {
    isOpen,
    focus,
    intention,
    setFocus,
    setIntention,
    open,
    close,
    capture
  };
}

// ============================================================================
// USE SNAPSHOT AUTOMATION — Automation settings
// ============================================================================

/**
 * Return type for useSnapshotAutomation hook
 */
interface UseSnapshotAutomationReturn {
  settings: SnapshotAutomationSettings;
  setSettings: (settings: Partial<SnapshotAutomationSettings>) => void;
  enableSphereSwitch: () => void;
  disableSphereSwitch: () => void;
  enableSessionEnd: () => void;
  disableSessionEnd: () => void;
  enableBreakCapture: () => void;
  disableBreakCapture: () => void;
  setSchedule: (schedule: SnapshotAutomationSettings['scheduled']) => void;
}

/**
 * Hook for automation settings management
 */
export function useSnapshotAutomation(
  initialSettings: SnapshotAutomationSettings = DEFAULT_AUTOMATION_SETTINGS
): UseSnapshotAutomationReturn {
  const [settings, setSettingsState] = useState<SnapshotAutomationSettings>(initialSettings);
  
  const setSettings = useCallback((updates: Partial<SnapshotAutomationSettings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const enableSphereSwitch = useCallback(() => {
    setSettings({ on_sphere_switch: true });
  }, [setSettings]);
  
  const disableSphereSwitch = useCallback(() => {
    setSettings({ on_sphere_switch: false });
  }, [setSettings]);
  
  const enableSessionEnd = useCallback(() => {
    setSettings({ on_session_end: true });
  }, [setSettings]);
  
  const disableSessionEnd = useCallback(() => {
    setSettings({ on_session_end: false });
  }, [setSettings]);
  
  const enableBreakCapture = useCallback(() => {
    setSettings({ on_break: true });
  }, [setSettings]);
  
  const disableBreakCapture = useCallback(() => {
    setSettings({ on_break: false });
  }, [setSettings]);
  
  const setSchedule = useCallback((schedule: SnapshotAutomationSettings['scheduled']) => {
    setSettings({ scheduled: schedule });
  }, [setSettings]);
  
  return {
    settings,
    setSettings,
    enableSphereSwitch,
    disableSphereSwitch,
    enableSessionEnd,
    disableSessionEnd,
    enableBreakCapture,
    disableBreakCapture,
    setSchedule
  };
}

// ============================================================================
// USE SNAPSHOT PRIVACY — Privacy settings
// ============================================================================

/**
 * Return type for useSnapshotPrivacy hook
 */
interface UseSnapshotPrivacyReturn {
  settings: SnapshotPrivacySettings;
  setSettings: (settings: Partial<SnapshotPrivacySettings>) => void;
  makePrivate: () => void;
  makeShared: () => void;
  enableAgentAccess: () => void;
  disableAgentAccess: () => void;
  setAutoExpire: (days: number) => void;
  disableAutoExpire: () => void;
}

/**
 * Hook for privacy settings management
 */
export function useSnapshotPrivacy(
  initialSettings: SnapshotPrivacySettings = DEFAULT_SNAPSHOT_PRIVACY
): UseSnapshotPrivacyReturn {
  const [settings, setSettingsState] = useState<SnapshotPrivacySettings>(initialSettings);
  
  const setSettings = useCallback((updates: Partial<SnapshotPrivacySettings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const makePrivate = useCallback(() => {
    setSettings({ visibility: 'private' });
  }, [setSettings]);
  
  const makeShared = useCallback(() => {
    setSettings({ visibility: 'shared' });
  }, [setSettings]);
  
  const enableAgentAccess = useCallback(() => {
    setSettings({ agent_readable: true });
  }, [setSettings]);
  
  const disableAgentAccess = useCallback(() => {
    setSettings({ agent_readable: false });
  }, [setSettings]);
  
  const setAutoExpire = useCallback((days: number) => {
    setSettings({ auto_expire: true, expire_after_days: days });
  }, [setSettings]);
  
  const disableAutoExpire = useCallback(() => {
    setSettings({ auto_expire: false });
  }, [setSettings]);
  
  return {
    settings,
    setSettings,
    makePrivate,
    makeShared,
    enableAgentAccess,
    disableAgentAccess,
    setAutoExpire,
    disableAutoExpire
  };
}

// ============================================================================
// USE CONTEXT SNAPSHOT UI — UI state management
// ============================================================================

/**
 * Return type for useContextSnapshotUI hook
 */
interface UseContextSnapshotUIReturn {
  uiState: ContextSnapshotUIState;
  showList: () => void;
  showDetail: (id: string) => void;
  showCapture: () => void;
  showRestore: (id: string) => void;
  showQuickCapture: () => void;
  hideQuickCapture: () => void;
  setFilters: (filters: SnapshotFilters) => void;
  setSort: (sort: ContextSnapshotUIState['sort']) => void;
}

/**
 * Hook for UI state management
 */
export function useContextSnapshotUI(): UseContextSnapshotUIReturn {
  const [uiState, setUIState] = useState<ContextSnapshotUIState>({
    view: 'list',
    filters: {},
    sort: 'recent_first',
    capturing: false,
    restoring: false,
    show_quick_capture: false
  });
  
  const showList = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      view: 'list',
      selected_snapshot_id: undefined
    }));
  }, []);
  
  const showDetail = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      view: 'detail',
      selected_snapshot_id: id
    }));
  }, []);
  
  const showCapture = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      view: 'capture',
      capturing: true
    }));
  }, []);
  
  const showRestore = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      view: 'restore',
      selected_snapshot_id: id,
      restoring: true
    }));
  }, []);
  
  const showQuickCapture = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      show_quick_capture: true
    }));
  }, []);
  
  const hideQuickCapture = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      show_quick_capture: false
    }));
  }, []);
  
  const setFilters = useCallback((filters: SnapshotFilters) => {
    setUIState(prev => ({ ...prev, filters }));
  }, []);
  
  const setSort = useCallback((sort: ContextSnapshotUIState['sort']) => {
    setUIState(prev => ({ ...prev, sort }));
  }, []);
  
  return {
    uiState,
    showList,
    showDetail,
    showCapture,
    showRestore,
    showQuickCapture,
    hideQuickCapture,
    setFilters,
    setSort
  };
}

// ============================================================================
// USE SNAPSHOT SEARCH — Search functionality
// ============================================================================

/**
 * Return type for useSnapshotSearch hook
 */
interface UseSnapshotSearchReturn {
  query: string;
  results: ContextSnapshot[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  search: () => void;
  clear: () => void;
}

/**
 * Hook for snapshot search
 */
export function useSnapshotSearch(
  snapshots: ContextSnapshot[]
): UseSnapshotSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchLower = query.toLowerCase();
    
    return snapshots.filter(s => {
      const searchable = [
        s.title,
        s.notes.current_focus,
        s.notes.next_intention,
        s.notes.important_context,
        s.notes.additional_notes,
        s.sphere,
        ...s.tags,
        ...s.threads.map(t => t.title),
        ...s.agents.map(a => a.agent_name)
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchable.includes(searchLower);
    });
  }, [snapshots, query]);
  
  const search = useCallback(() => {
    setIsSearching(true);
    // Results are computed via useMemo
    setIsSearching(false);
  }, []);
  
  const clear = useCallback(() => {
    setQuery('');
  }, []);
  
  return {
    query,
    results,
    isSearching,
    setQuery,
    search,
    clear
  };
}

// ============================================================================
// USE SNAPSHOT SUGGESTIONS — Capture suggestions
// ============================================================================

/**
 * Capture suggestion
 */
interface CaptureSuggestion {
  reason: string;
  trigger: SnapshotTrigger;
  confidence: number;
  context?: string;
}

/**
 * Return type for useSnapshotSuggestions hook
 */
interface UseSnapshotSuggestionsReturn {
  suggestions: CaptureSuggestion[];
  hasSuggestion: boolean;
  dismissSuggestion: () => void;
  acceptSuggestion: () => void;
}

/**
 * Hook for capture suggestions (respects user control)
 */
export function useSnapshotSuggestions(
  currentSphere: string,
  sessionDuration: number,
  cognitiveLoad?: number,
  onAccept: () => void = () => {}
): UseSnapshotSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<CaptureSuggestion[]>([]);
  const [dismissed, setDismissed] = useState(false);
  
  // Generate suggestions based on context
  // Note: These are SUGGESTIONS only - user always decides
  useEffect(() => {
    if (dismissed) return;
    
    const newSuggestions: CaptureSuggestion[] = [];
    
    // Long session suggestion
    if (sessionDuration > 7200) { // 2 hours
      newSuggestions.push({
        reason: 'You\'ve been working for a while',
        trigger: 'before_break',
        confidence: 0.7,
        context: `${Math.floor(sessionDuration / 3600)} hours in session`
      });
    }
    
    // High cognitive load suggestion
    if (cognitiveLoad && cognitiveLoad > 0.75) {
      newSuggestions.push({
        reason: 'High context complexity detected',
        trigger: 'high_volatility',
        confidence: 0.6,
        context: 'Consider capturing before context loss'
      });
    }
    
    setSuggestions(newSuggestions);
  }, [currentSphere, sessionDuration, cognitiveLoad, dismissed]);
  
  const dismissSuggestion = useCallback(() => {
    setDismissed(true);
    setSuggestions([]);
  }, []);
  
  const acceptSuggestion = useCallback(() => {
    onAccept();
    setDismissed(true);
    setSuggestions([]);
  }, [onAccept]);
  
  return {
    suggestions,
    hasSuggestion: suggestions.length > 0,
    dismissSuggestion,
    acceptSuggestion
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  UseSnapshotsOptions,
  UseSnapshotsReturn,
  UseSnapshotReturn,
  UseSnapshotCaptureReturn,
  UseSnapshotRestoreReturn,
  UseQuickCaptureReturn,
  UseSnapshotAutomationReturn,
  UseSnapshotPrivacyReturn,
  UseContextSnapshotUIReturn,
  UseSnapshotSearchReturn,
  UseSnapshotSuggestionsReturn,
  CaptureSuggestion
};
