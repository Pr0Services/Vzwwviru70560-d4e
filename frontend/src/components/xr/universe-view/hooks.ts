/**
 * CHE·NU™ Universe View — Custom Hooks
 * 
 * Hooks for managing Universe View state, navigation, and interactions.
 * 
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ViewState,
  ZoomLevel,
  SphereId,
  UniverseViewState,
  VisibilityToggles,
  NavigationAction,
  MetaObject,
  AgentPresence,
  Position3D,
  DEFAULT_VISIBILITY,
  DEFAULT_ORBITAL_CONFIG,
  DEFAULT_TRANSITION,
  TransitionConfig,
} from './universe-view.types';

// ============================================================================
// useUniverseNavigation
// ============================================================================

interface UseUniverseNavigationOptions {
  initialState?: ViewState;
  initialZoom?: ZoomLevel;
  transitionConfig?: TransitionConfig;
}

interface UseUniverseNavigationReturn {
  viewState: ViewState;
  zoomLevel: ZoomLevel;
  focusedSphere: SphereId | null;
  activeThread: string | null;
  activeDecision: string | null;
  isTransitioning: boolean;
  dispatch: (action: NavigationAction) => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export function useUniverseNavigation(
  options: UseUniverseNavigationOptions = {}
): UseUniverseNavigationReturn {
  const {
    initialState = 'orbital',
    initialZoom = 'universe',
    transitionConfig = DEFAULT_TRANSITION,
  } = options;

  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(initialZoom);
  const [focusedSphere, setFocusedSphere] = useState<SphereId | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [activeDecision, setActiveDecision] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const zoomLevels: ZoomLevel[] = ['universe', 'sphere', 'category', 'item', 'meta'];
  const currentZoomIndex = zoomLevels.indexOf(zoomLevel);

  const dispatch = useCallback((action: NavigationAction) => {
    setIsTransitioning(true);
    
    switch (action.type) {
      case 'zoom_in':
        if (currentZoomIndex < zoomLevels.length - 1) {
          setZoomLevel(zoomLevels[currentZoomIndex + 1]);
        }
        break;
      case 'zoom_out':
        if (currentZoomIndex > 0) {
          setZoomLevel(zoomLevels[currentZoomIndex - 1]);
        }
        break;
      case 'zoom_to_level':
        setZoomLevel(action.level);
        break;
      case 'focus_sphere':
        setViewState('focus');
        setFocusedSphere(action.sphere);
        break;
      case 'unfocus':
        setViewState('orbital');
        setFocusedSphere(null);
        break;
      case 'activate_thread_lens':
        setViewState('thread_lens');
        setActiveThread(action.thread_id);
        break;
      case 'deactivate_thread_lens':
        setViewState('orbital');
        setActiveThread(null);
        break;
      case 'focus_decision':
        setViewState('decision_focus');
        setActiveDecision(action.decision_id);
        break;
      case 'unfocus_decision':
        setViewState('orbital');
        setActiveDecision(null);
        break;
      case 'reset_view':
        setViewState('orbital');
        setZoomLevel('universe');
        setFocusedSphere(null);
        setActiveThread(null);
        setActiveDecision(null);
        break;
    }

    // End transition after duration
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionConfig.duration);
  }, [currentZoomIndex, transitionConfig.duration]);

  return {
    viewState,
    zoomLevel,
    focusedSphere,
    activeThread,
    activeDecision,
    isTransitioning,
    dispatch,
    canZoomIn: currentZoomIndex < zoomLevels.length - 1,
    canZoomOut: currentZoomIndex > 0,
  };
}

// ============================================================================
// useVisibilityToggles
// ============================================================================

interface UseVisibilityTogglesReturn {
  visibility: VisibilityToggles;
  toggle: (key: keyof VisibilityToggles) => void;
  setAll: (visible: boolean) => void;
  reset: () => void;
}

export function useVisibilityToggles(
  initialVisibility: VisibilityToggles = DEFAULT_VISIBILITY
): UseVisibilityTogglesReturn {
  const [visibility, setVisibility] = useState<VisibilityToggles>(initialVisibility);

  const toggle = useCallback((key: keyof VisibilityToggles) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setAll = useCallback((visible: boolean) => {
    setVisibility({
      show_threads: visible,
      show_snapshots: visible,
      show_decisions: visible,
      show_agent_auras: visible,
      show_connections: visible,
      reduced_density: false,
    });
  }, []);

  const reset = useCallback(() => {
    setVisibility(DEFAULT_VISIBILITY);
  }, []);

  return { visibility, toggle, setAll, reset };
}

// ============================================================================
// useMetaObjects
// ============================================================================

interface UseMetaObjectsOptions {
  userId: string;
  sphereFilter?: SphereId[];
  typeFilter?: ('thread' | 'snapshot' | 'decision')[];
}

interface UseMetaObjectsReturn {
  objects: MetaObject[];
  threads: MetaObject[];
  snapshots: MetaObject[];
  decisions: MetaObject[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMetaObjects(options: UseMetaObjectsOptions): UseMetaObjectsReturn {
  const { userId, sphereFilter, typeFilter } = options;
  const [objects, setObjects] = useState<MetaObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadObjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data
      const mockObjects: MetaObject[] = [
        {
          id: 'thread_001',
          type: 'thread',
          title: 'Strategic Direction Q1',
          owner: userId,
          created_at: '2025-12-01T10:00:00Z',
          last_activity: '2025-12-28T15:30:00Z',
          position: { x: 0, y: 0, z: 50 },
          is_visible: true,
          is_highlighted: false,
          path_points: [
            { x: -200, y: 100, z: 0 },
            { x: -50, y: 50, z: 0 },
            { x: 100, y: -100, z: 0 },
          ],
          thickness: 3,
          color: 'rgba(64, 224, 208, 0.4)',
          linked_entity_ids: ['e1', 'e2'],
          unresolved_count: 1,
          sphere_coverage: ['business', 'personal'],
        } as MetaObject,
      ];
      
      setObjects(mockObjects);
    } catch (e) {
      setError('Failed to load meta objects');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadObjects();
  }, [loadObjects]);

  const filtered = useMemo(() => {
    let result = objects;
    
    if (typeFilter && typeFilter.length > 0) {
      result = result.filter(o => typeFilter.includes(o.type));
    }
    
    if (sphereFilter && sphereFilter.length > 0) {
      result = result.filter(o => {
        if (o.type === 'thread') {
          return (o as any).sphere_coverage?.some((s: SphereId) => sphereFilter.includes(s));
        }
        return true;
      });
    }
    
    return result;
  }, [objects, sphereFilter, typeFilter]);

  return {
    objects: filtered,
    threads: filtered.filter(o => o.type === 'thread'),
    snapshots: filtered.filter(o => o.type === 'snapshot'),
    decisions: filtered.filter(o => o.type === 'decision'),
    isLoading,
    error,
    refresh: loadObjects,
  };
}

// ============================================================================
// useAgentPresences
// ============================================================================

interface UseAgentPresencesOptions {
  userId: string;
  showOnlyWithSuggestions?: boolean;
}

interface UseAgentPresencesReturn {
  agents: AgentPresence[];
  pendingSuggestions: number;
  isLoading: boolean;
  dismissSuggestion: (agentId: string, suggestionId: string) => void;
}

export function useAgentPresences(options: UseAgentPresencesOptions): UseAgentPresencesReturn {
  const { userId, showOnlyWithSuggestions = false } = options;
  const [agents, setAgents] = useState<AgentPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      setAgents([
        {
          agent_id: 'nova',
          agent_name: 'Nova',
          agent_icon: '🌟',
          contract_id: 'contract_nova_001',
          position: { x: 50, y: 50, z: 20 },
          aura_radius: 100,
          aura_intensity: 'subtle',
          aura_color: 'rgba(64, 224, 208, 0.15)',
          influenced_areas: ['business', 'personal'],
          has_pending_suggestions: true,
          suggestions: [
            {
              id: 'sug_001',
              agent_id: 'nova',
              suggestion_type: 'decision_drift',
              title: 'Decision drift detected',
              description: 'Context has changed since this decision.',
              priority: 'attention',
              created_at: '2025-12-28T10:00:00Z',
              dismissed: false,
            },
          ],
        },
      ]);
      setIsLoading(false);
    }, 200);
  }, [userId]);

  const filtered = useMemo(() => {
    if (showOnlyWithSuggestions) {
      return agents.filter(a => a.has_pending_suggestions);
    }
    return agents;
  }, [agents, showOnlyWithSuggestions]);

  const pendingSuggestions = useMemo(() => {
    return agents.reduce((count, agent) => {
      return count + agent.suggestions.filter(s => !s.dismissed).length;
    }, 0);
  }, [agents]);

  const dismissSuggestion = useCallback((agentId: string, suggestionId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.agent_id !== agentId) return agent;
      return {
        ...agent,
        suggestions: agent.suggestions.map(s => 
          s.id === suggestionId ? { ...s, dismissed: true } : s
        ),
        has_pending_suggestions: agent.suggestions.some(s => 
          s.id !== suggestionId && !s.dismissed
        ),
      };
    }));
  }, []);

  return { agents: filtered, pendingSuggestions, isLoading, dismissSuggestion };
}

// ============================================================================
// useSnapshotMode
// ============================================================================

interface UseSnapshotModeOptions {
  onEnter?: (snapshotId: string) => void;
  onExit?: () => void;
}

interface UseSnapshotModeReturn {
  isActive: boolean;
  snapshotId: string | null;
  snapshotTitle: string | null;
  enter: (snapshotId: string, title: string) => void;
  exit: () => void;
}

export function useSnapshotMode(options: UseSnapshotModeOptions = {}): UseSnapshotModeReturn {
  const { onEnter, onExit } = options;
  const [isActive, setIsActive] = useState(false);
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [snapshotTitle, setSnapshotTitle] = useState<string | null>(null);

  const enter = useCallback((id: string, title: string) => {
    setIsActive(true);
    setSnapshotId(id);
    setSnapshotTitle(title);
    onEnter?.(id);
  }, [onEnter]);

  const exit = useCallback(() => {
    setIsActive(false);
    setSnapshotId(null);
    setSnapshotTitle(null);
    onExit?.();
  }, [onExit]);

  return { isActive, snapshotId, snapshotTitle, enter, exit };
}

// ============================================================================
// useKeyboardNavigation
// ============================================================================

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onEscape?: () => void;
  onReset?: () => void;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}): void {
  const { enabled = true, onZoomIn, onZoomOut, onEscape, onReset } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '+':
        case '=':
          onZoomIn?.();
          break;
        case '-':
        case '_':
          onZoomOut?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onReset?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onZoomIn, onZoomOut, onEscape, onReset]);
}

// ============================================================================
// useSphereLayout
// ============================================================================

interface UseSphereLayoutOptions {
  sphereCount: number;
  radius: number;
  centerOffset?: Position3D;
}

interface UseSphereLayoutReturn {
  getPosition: (index: number) => Position3D;
  positions: Position3D[];
}

export function useSphereLayout(options: UseSphereLayoutOptions): UseSphereLayoutReturn {
  const { sphereCount, radius, centerOffset = { x: 0, y: 0, z: 0 } } = options;

  const positions = useMemo(() => {
    return Array.from({ length: sphereCount }, (_, i) => {
      const angle = (i / sphereCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius + centerOffset.x,
        y: Math.sin(angle) * radius + centerOffset.y,
        z: centerOffset.z,
      };
    });
  }, [sphereCount, radius, centerOffset]);

  const getPosition = useCallback((index: number): Position3D => {
    return positions[index] || { x: 0, y: 0, z: 0 };
  }, [positions]);

  return { getPosition, positions };
}

// ============================================================================
// useHoverState
// ============================================================================

interface HoverState<T> {
  isHovered: boolean;
  hoveredId: T | null;
  position: { x: number; y: number };
}

interface UseHoverStateReturn<T> {
  state: HoverState<T>;
  onHover: (id: T | null, event?: React.MouseEvent) => void;
  onMove: (event: React.MouseEvent) => void;
  clear: () => void;
}

export function useHoverState<T>(): UseHoverStateReturn<T> {
  const [state, setState] = useState<HoverState<T>>({
    isHovered: false,
    hoveredId: null,
    position: { x: 0, y: 0 },
  });

  const onHover = useCallback((id: T | null, event?: React.MouseEvent) => {
    setState(prev => ({
      isHovered: id !== null,
      hoveredId: id,
      position: event ? { x: event.clientX, y: event.clientY } : prev.position,
    }));
  }, []);

  const onMove = useCallback((event: React.MouseEvent) => {
    setState(prev => ({
      ...prev,
      position: { x: event.clientX, y: event.clientY },
    }));
  }, []);

  const clear = useCallback(() => {
    setState({
      isHovered: false,
      hoveredId: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  return { state, onHover, onMove, clear };
}

// ============================================================================
// useAccessibility
// ============================================================================

interface UseAccessibilityReturn {
  reduceMotion: boolean;
  highContrast: boolean;
  announceToScreenReader: (message: string) => void;
}

export function useAccessibility(): UseAccessibilityReturn {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check system preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    
    setReduceMotion(motionQuery.matches);
    setHighContrast(contrastQuery.matches);

    const motionListener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    const contrastListener = (e: MediaQueryListEvent) => setHighContrast(e.matches);

    motionQuery.addEventListener('change', motionListener);
    contrastQuery.addEventListener('change', contrastListener);

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      contrastQuery.removeEventListener('change', contrastListener);
    };
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    if (!announcerRef.current) {
      announcerRef.current = document.createElement('div');
      announcerRef.current.setAttribute('role', 'status');
      announcerRef.current.setAttribute('aria-live', 'polite');
      announcerRef.current.setAttribute('aria-atomic', 'true');
      announcerRef.current.style.cssText = 'position:absolute;left:-9999px;';
      document.body.appendChild(announcerRef.current);
    }
    announcerRef.current.textContent = message;
  }, []);

  return { reduceMotion, highContrast, announceToScreenReader };
}
