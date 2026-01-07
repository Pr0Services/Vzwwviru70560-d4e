/**
 * CHE·NU™ Cognitive Load Regulator — Custom Hooks
 * 
 * Hooks for measuring, visualizing, and responding to cognitive load.
 * 
 * Core principle: Measure system state, not human state.
 *                 Visibility, not judgment.
 * 
 * @module cognitive-load-regulator
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  CognitiveLoadState,
  LoadState,
  LoadDimensions,
  LoadTrend,
  ContributingFactor,
  ContributingFactorType,
  RegulatorUIState,
  LoadSuggestion,
  SystemAdaptation,
  IndicatorPosition,
  LoadHistoryPoint,
  LoadPrivacySettings,
  FACTOR_META,
  LOAD_THRESHOLDS,
  DEFAULT_PRIVACY_SETTINGS,
} from './cognitive-load-regulator.types';

// ============================================================================
// useCognitiveLoad — Main load state hook
// ============================================================================

interface UseCognitiveLoadOptions {
  sessionId: string;
  measurementInterval?: number; // ms, default 30000 (30s)
}

interface UseCognitiveLoadReturn {
  loadState: CognitiveLoadState;
  dimensions: LoadDimensions;
  state: LoadState;
  trend: LoadTrend;
  factors: ContributingFactor[];
  isLoading: boolean;
  refresh: () => void;
}

export function useCognitiveLoad(options: UseCognitiveLoadOptions): UseCognitiveLoadReturn {
  const { sessionId, measurementInterval = 30000 } = options;
  
  const [loadState, setLoadState] = useState<CognitiveLoadState>({
    id: `load_${Date.now()}`,
    timestamp: new Date().toISOString(),
    dimensions: {
      density: 0,
      fragmentation: 0,
      ambiguity: 0,
      volatility: 0,
      responsibility_weight: 0,
    },
    state: 'clear',
    trend: 'stable',
    factors: [],
    session_id: sessionId,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef<LoadHistoryPoint[]>([]);

  const measureLoad = useCallback(async () => {
    try {
      // In real implementation, this would query system state
      // Here we calculate from mock data
      
      const factors = await measureFactors(sessionId);
      const dimensions = calculateDimensions(factors);
      const state = determineState(dimensions);
      const trend = calculateTrend(historyRef.current, dimensions);
      
      const newLoadState: CognitiveLoadState = {
        id: `load_${Date.now()}`,
        timestamp: new Date().toISOString(),
        dimensions,
        state,
        trend,
        factors,
        session_id: sessionId,
      };
      
      // Update history (keep last 10)
      historyRef.current = [
        ...historyRef.current.slice(-9),
        { timestamp: newLoadState.timestamp, state, dimensions },
      ];
      
      setLoadState(newLoadState);
      setIsLoading(false);
    } catch (error) {
      logger.error('Failed to measure cognitive load:', error);
    }
  }, [sessionId]);

  useEffect(() => {
    measureLoad();
    
    const interval = setInterval(measureLoad, measurementInterval);
    return () => clearInterval(interval);
  }, [measureLoad, measurementInterval]);

  return {
    loadState,
    dimensions: loadState.dimensions,
    state: loadState.state,
    trend: loadState.trend,
    factors: loadState.factors,
    isLoading,
    refresh: measureLoad,
  };
}

// Helper functions for useCognitiveLoad
async function measureFactors(sessionId: string): Promise<ContributingFactor[]> {
  // Mock implementation - would query real system state
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      type: 'active_threads',
      label: 'Active Threads',
      value: 4,
      baseline: 3,
      contribution: 0.25,
      explanation: 'Number of open knowledge threads in this session.',
    },
    {
      type: 'unresolved_decisions',
      label: 'Unresolved Decisions',
      value: 2,
      baseline: 1,
      contribution: 0.30,
      explanation: 'Decisions awaiting your input.',
    },
    {
      type: 'context_switches',
      label: 'Context Switches',
      value: 3,
      baseline: 5,
      contribution: 0.10,
      explanation: 'How often you have changed focus this session.',
    },
  ];
}

function calculateDimensions(factors: ContributingFactor[]): LoadDimensions {
  // Calculate each dimension from factors
  let density = 0;
  let fragmentation = 0;
  let ambiguity = 0;
  let volatility = 0;
  let responsibility = 0;
  
  factors.forEach(f => {
    const normalized = Math.min((f.value / Math.max(f.baseline, 1)) * 50, 100);
    
    switch (f.type) {
      case 'active_threads':
      case 'concurrent_agents':
        density += normalized * f.contribution;
        break;
      case 'context_switches':
      case 'navigation_depth':
        fragmentation += normalized * f.contribution;
        break;
      case 'unresolved_decisions':
      case 'task_ambiguity':
      case 'meaning_conflicts':
        ambiguity += normalized * f.contribution;
        break;
      case 'snapshot_frequency':
        volatility += normalized * f.contribution;
        break;
      case 'pending_approvals':
      case 'decision_drift':
        responsibility += normalized * f.contribution;
        break;
    }
  });
  
  return {
    density: Math.min(density, 100),
    fragmentation: Math.min(fragmentation, 100),
    ambiguity: Math.min(ambiguity, 100),
    volatility: Math.min(volatility, 100),
    responsibility_weight: Math.min(responsibility, 100),
  };
}

function determineState(dimensions: LoadDimensions): LoadState {
  const average = (
    dimensions.density + 
    dimensions.fragmentation + 
    dimensions.ambiguity + 
    dimensions.responsibility_weight
  ) / 4;
  
  // Check for unstable first (special case)
  if (dimensions.volatility >= LOAD_THRESHOLDS.unstable.volatility_min) {
    return 'unstable';
  }
  
  if (average <= LOAD_THRESHOLDS.clear.max) return 'clear';
  if (average <= LOAD_THRESHOLDS.focused.max) return 'focused';
  if (average <= LOAD_THRESHOLDS.dense.max) return 'dense';
  if (dimensions.fragmentation > 60) return 'fragmented';
  if (average <= LOAD_THRESHOLDS.saturated.max) return 'saturated';
  
  return 'dense';
}

function calculateTrend(history: LoadHistoryPoint[], current: LoadDimensions): LoadTrend {
  if (history.length < 3) return 'stable';
  
  const recentHistory = history.slice(-3);
  const recentAvg = recentHistory.reduce((sum, h) => {
    return sum + (h.dimensions.density + h.dimensions.ambiguity) / 2;
  }, 0) / recentHistory.length;
  
  const currentAvg = (current.density + current.ambiguity) / 2;
  const diff = currentAvg - recentAvg;
  
  if (diff > 10) return 'increasing';
  if (diff < -10) return 'decreasing';
  return 'stable';
}

// ============================================================================
// useRegulatorUI — UI state management
// ============================================================================

interface UseRegulatorUIReturn {
  uiState: RegulatorUIState;
  toggleVisibility: () => void;
  setPosition: (position: IndicatorPosition) => void;
  expand: () => void;
  collapse: () => void;
  hidePermantly: () => void;
  show: () => void;
  pauseAnimations: () => void;
  resumeAnimations: () => void;
}

export function useRegulatorUI(): UseRegulatorUIReturn {
  const [uiState, setUIState] = useState<RegulatorUIState>({
    visible: true,
    position: 'bottom-right',
    intensity: 'subtle',
    expanded: false,
    animations_paused: false,
    permanently_hidden: false,
  });

  const toggleVisibility = useCallback(() => {
    setUIState(prev => ({ ...prev, visible: !prev.visible }));
  }, []);

  const setPosition = useCallback((position: IndicatorPosition) => {
    setUIState(prev => ({ ...prev, position }));
  }, []);

  const expand = useCallback(() => {
    setUIState(prev => ({ ...prev, expanded: true }));
  }, []);

  const collapse = useCallback(() => {
    setUIState(prev => ({ ...prev, expanded: false }));
  }, []);

  const hidePermantly = useCallback(() => {
    setUIState(prev => ({ 
      ...prev, 
      visible: false, 
      permanently_hidden: true 
    }));
  }, []);

  const show = useCallback(() => {
    setUIState(prev => ({ 
      ...prev, 
      visible: true, 
      permanently_hidden: false 
    }));
  }, []);

  const pauseAnimations = useCallback(() => {
    setUIState(prev => ({ ...prev, animations_paused: true }));
  }, []);

  const resumeAnimations = useCallback(() => {
    setUIState(prev => ({ ...prev, animations_paused: false }));
  }, []);

  return {
    uiState,
    toggleVisibility,
    setPosition,
    expand,
    collapse,
    hidePermantly,
    show,
    pauseAnimations,
    resumeAnimations,
  };
}

// ============================================================================
// useSystemAdaptations — Automatic UI adaptations
// ============================================================================

interface UseSystemAdaptationsOptions {
  loadState: LoadState;
  enabled?: boolean;
}

interface UseSystemAdaptationsReturn {
  adaptations: SystemAdaptation[];
  activeAdaptations: SystemAdaptation[];
  getAdaptationStyles: () => React.CSSProperties;
}

export function useSystemAdaptations(
  options: UseSystemAdaptationsOptions
): UseSystemAdaptationsReturn {
  const { loadState, enabled = true } = options;
  
  const adaptations = useMemo((): SystemAdaptation[] => {
    if (!enabled) return [];
    
    const results: SystemAdaptation[] = [];
    
    if (loadState === 'dense' || loadState === 'saturated') {
      results.push({
        type: 'fade_meta',
        active: true,
        description: 'Non-essential meta-objects faded',
        functionality_preserved: true,
      });
    }
    
    if (loadState === 'saturated' || loadState === 'unstable') {
      results.push({
        type: 'slow_animations',
        active: true,
        description: 'Animations slowed for clarity',
        functionality_preserved: true,
      });
    }
    
    if (loadState === 'fragmented') {
      results.push({
        type: 'reduce_density',
        active: true,
        description: 'Visual density reduced',
        functionality_preserved: true,
      });
    }
    
    return results;
  }, [loadState, enabled]);

  const activeAdaptations = useMemo(() => 
    adaptations.filter(a => a.active),
  [adaptations]);

  const getAdaptationStyles = useCallback((): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    activeAdaptations.forEach(a => {
      switch (a.type) {
        case 'fade_meta':
          // Meta elements should use this to reduce opacity
          break;
        case 'slow_animations':
          styles.transitionDuration = '0.5s';
          break;
        case 'reduce_density':
          // Layout components should use this to increase spacing
          break;
      }
    });
    
    return styles;
  }, [activeAdaptations]);

  return {
    adaptations,
    activeAdaptations,
    getAdaptationStyles,
  };
}

// ============================================================================
// useLoadSuggestions — Optional suggestions (never prescriptive)
// ============================================================================

interface UseLoadSuggestionsOptions {
  loadState: CognitiveLoadState;
  enabled?: boolean;
}

interface UseLoadSuggestionsReturn {
  suggestions: LoadSuggestion[];
  dismissSuggestion: (index: number) => void;
  dismissAll: () => void;
  acceptSuggestion: (index: number) => void;
}

export function useLoadSuggestions(
  options: UseLoadSuggestionsOptions
): UseLoadSuggestionsReturn {
  const { loadState, enabled = true } = options;
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = useMemo((): LoadSuggestion[] => {
    if (!enabled) return [];
    
    const results: LoadSuggestion[] = [];
    
    if (loadState.state === 'saturated' || loadState.state === 'unstable') {
      results.push({
        type: 'pause',
        text: 'Current context is quite dense. Would you like to pause and take stock?',
        dismissed: dismissed.has('pause'),
      });
    }
    
    if (loadState.trend === 'increasing' && loadState.dimensions.volatility > 50) {
      results.push({
        type: 'snapshot',
        text: 'Things are changing quickly. A context snapshot might help preserve your current state.',
        dismissed: dismissed.has('snapshot'),
      });
    }
    
    if (loadState.state === 'fragmented') {
      results.push({
        type: 'reduce_scope',
        text: 'Your attention is spread across many areas. Would focusing on fewer items help?',
        dismissed: dismissed.has('reduce_scope'),
      });
    }
    
    return results.filter(s => !s.dismissed);
  }, [loadState, enabled, dismissed]);

  const dismissSuggestion = useCallback((index: number) => {
    const suggestion = suggestions[index];
    if (suggestion) {
      setDismissed(prev => new Set([...prev, suggestion.type]));
    }
  }, [suggestions]);

  const dismissAll = useCallback(() => {
    setDismissed(new Set(suggestions.map(s => s.type)));
  }, [suggestions]);

  const acceptSuggestion = useCallback((index: number) => {
    const suggestion = suggestions[index];
    if (suggestion?.action) {
      suggestion.action();
    }
    dismissSuggestion(index);
  }, [suggestions, dismissSuggestion]);

  return {
    suggestions,
    dismissSuggestion,
    dismissAll,
    acceptSuggestion,
  };
}

// ============================================================================
// useFactorDetails — Drill into specific factors
// ============================================================================

interface UseFactorDetailsOptions {
  factorType: ContributingFactorType;
  sessionId: string;
}

interface UseFactorDetailsReturn {
  factor: ContributingFactor | null;
  relatedItems: { id: string; name: string; type: string }[];
  isLoading: boolean;
  navigateToItem: (itemId: string) => void;
}

export function useFactorDetails(
  options: UseFactorDetailsOptions
): UseFactorDetailsReturn {
  const { factorType, sessionId } = options;
  const [factor, setFactor] = useState<ContributingFactor | null>(null);
  const [relatedItems, setRelatedItems] = useState<{ id: string; name: string; type: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Mock load
    setTimeout(() => {
      const meta = FACTOR_META[factorType];
      setFactor({
        type: factorType,
        label: meta.label,
        value: 4,
        baseline: 3,
        contribution: 0.25,
        explanation: meta.description,
        items: [],
      });
      setRelatedItems([]);
      setIsLoading(false);
    }, 200);
  }, [factorType, sessionId]);

  const navigateToItem = useCallback((itemId: string) => {
    // Would navigate to the item
    logger.debug('Navigate to:', itemId);
  }, []);

  return {
    factor,
    relatedItems,
    isLoading,
    navigateToItem,
  };
}

// ============================================================================
// useLoadPrivacy — Privacy settings
// ============================================================================

interface UseLoadPrivacyReturn {
  settings: LoadPrivacySettings;
  updateSetting: <K extends keyof LoadPrivacySettings>(
    key: K,
    value: LoadPrivacySettings[K]
  ) => void;
  disablePermanently: () => void;
  clearAllData: () => Promise<void>;
}

export function useLoadPrivacy(): UseLoadPrivacyReturn {
  const [settings, setSettings] = useState<LoadPrivacySettings>(DEFAULT_PRIVACY_SETTINGS);

  const updateSetting = useCallback(<K extends keyof LoadPrivacySettings>(
    key: K,
    value: LoadPrivacySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const disablePermanently = useCallback(() => {
    setSettings(prev => ({ ...prev, can_disable: true }));
    // Would persist this preference
  }, []);

  const clearAllData = useCallback(async () => {
    // Would clear any ephemeral data
    await new Promise(resolve => setTimeout(resolve, 100));
  }, []);

  return {
    settings,
    updateSetting,
    disablePermanently,
    clearAllData,
  };
}

// ============================================================================
// useReducedMotion — Accessibility
// ============================================================================

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// ============================================================================
// useLoadHistory — Session load history (ephemeral)
// ============================================================================

interface UseLoadHistoryOptions {
  sessionId: string;
  maxPoints?: number;
}

interface UseLoadHistoryReturn {
  history: LoadHistoryPoint[];
  addPoint: (point: LoadHistoryPoint) => void;
  clearHistory: () => void;
  getAverageState: () => LoadState;
}

export function useLoadHistory(options: UseLoadHistoryOptions): UseLoadHistoryReturn {
  const { sessionId, maxPoints = 20 } = options;
  const [history, setHistory] = useState<LoadHistoryPoint[]>([]);

  const addPoint = useCallback((point: LoadHistoryPoint) => {
    setHistory(prev => [...prev.slice(-(maxPoints - 1)), point]);
  }, [maxPoints]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getAverageState = useCallback((): LoadState => {
    if (history.length === 0) return 'clear';
    
    const stateCounts: Record<LoadState, number> = {
      clear: 0, focused: 0, dense: 0, fragmented: 0, saturated: 0, unstable: 0,
    };
    
    history.forEach(h => stateCounts[h.state]++);
    
    let maxCount = 0;
    let mostCommon: LoadState = 'clear';
    
    (Object.entries(stateCounts) as [LoadState, number][]).forEach(([state, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = state;
      }
    });
    
    return mostCommon;
  }, [history]);

  // Clear on session change
  useEffect(() => {
    setHistory([]);
  }, [sessionId]);

  return {
    history,
    addPoint,
    clearHistory,
    getAverageState,
  };
}
