/**
 * CHE·NU™ PUBLIC ABSTRACTION LAYER — HOOKS
 * 
 * Custom hooks for public-facing abstraction.
 * Translates internal complexity into understandable public concepts.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  AbstractionLevel,
  PublicSpace,
  PublicDecision,
  PublicThread,
  PublicRoom,
  PublicAssistant,
  PublicDashboardView,
  PublicSpaceView,
  TrustSignalDisplay,
} from './public-abstraction.types';
import {
  ABSTRACTION_LEVELS,
  PUBLIC_OBJECT_MAPPINGS,
  TRUST_SIGNAL_DISPLAYS,
  PUBLIC_COMMUNICATION_GUIDELINES,
  toPublicTerm,
} from './public-abstraction.types';

// ═══════════════════════════════════════════════════════════════════════════════
// ABSTRACTION LEVEL HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseAbstractionLevelOptions {
  initial_level?: AbstractionLevel;
  persist?: boolean;
  onLevelChange?: (level: AbstractionLevel) => void;
}

export interface UseAbstractionLevelReturn {
  level: AbstractionLevel;
  depth: number;
  definition: typeof ABSTRACTION_LEVELS[AbstractionLevel];
  setLevel: (level: AbstractionLevel) => void;
  increaseDepth: () => void;
  decreaseDepth: () => void;
  isMaxDepth: boolean;
  isMinDepth: boolean;
  availableLevels: AbstractionLevel[];
}

export function useAbstractionLevel(
  options: UseAbstractionLevelOptions = {}
): UseAbstractionLevelReturn {
  const { initial_level = 'conceptual', persist = true, onLevelChange } = options;
  
  const [level, setLevelInternal] = useState<AbstractionLevel>(() => {
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem('chenu_abstraction_level');
      if (stored && stored in ABSTRACTION_LEVELS) {
        return stored as AbstractionLevel;
      }
    }
    return initial_level;
  });
  
  const definition = ABSTRACTION_LEVELS[level];
  const depth = definition.depth;
  
  const setLevel = useCallback((newLevel: AbstractionLevel) => {
    setLevelInternal(newLevel);
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('chenu_abstraction_level', newLevel);
    }
    onLevelChange?.(newLevel);
  }, [persist, onLevelChange]);
  
  const levels: AbstractionLevel[] = ['conceptual', 'functional', 'experience', 'technical'];
  const currentIndex = levels.indexOf(level);
  
  const increaseDepth = useCallback(() => {
    if (currentIndex < levels.length - 1) {
      setLevel(levels[currentIndex + 1]);
    }
  }, [currentIndex, levels, setLevel]);
  
  const decreaseDepth = useCallback(() => {
    if (currentIndex > 0) {
      setLevel(levels[currentIndex - 1]);
    }
  }, [currentIndex, levels, setLevel]);
  
  return {
    level,
    depth,
    definition,
    setLevel,
    increaseDepth,
    decreaseDepth,
    isMaxDepth: currentIndex === levels.length - 1,
    isMinDepth: currentIndex === 0,
    availableLevels: levels,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINOLOGY TRANSLATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePublicTerminologyReturn {
  translate: (internal: string) => string;
  translateBack: (public_term: string) => string;
  getDescription: (internal: string) => string | undefined;
  mappings: typeof PUBLIC_OBJECT_MAPPINGS;
}

export function usePublicTerminology(): UsePublicTerminologyReturn {
  const translate = useCallback((internal: string): string => {
    return toPublicTerm(internal);
  }, []);
  
  const translateBack = useCallback((public_term: string): string => {
    const mapping = PUBLIC_OBJECT_MAPPINGS.find(m => m.public === public_term);
    return mapping?.internal ?? public_term;
  }, []);
  
  const getDescription = useCallback((internal: string): string | undefined => {
    const mapping = PUBLIC_OBJECT_MAPPINGS.find(m => m.internal === internal);
    return mapping?.description;
  }, []);
  
  return {
    translate,
    translateBack,
    getDescription,
    mappings: PUBLIC_OBJECT_MAPPINGS,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST SIGNALS HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseTrustSignalsOptions {
  show_all?: boolean;
  primary_only?: boolean;
}

export interface UseTrustSignalsReturn {
  signals: TrustSignalDisplay[];
  primarySignals: TrustSignalDisplay[];
  secondarySignals: TrustSignalDisplay[];
  getSignal: (id: string) => TrustSignalDisplay | undefined;
}

export function useTrustSignals(options: UseTrustSignalsOptions = {}): UseTrustSignalsReturn {
  const { primary_only = false } = options;
  
  const signals = useMemo(() => {
    if (primary_only) {
      return TRUST_SIGNAL_DISPLAYS.filter(s => s.emphasis === 'primary');
    }
    return TRUST_SIGNAL_DISPLAYS;
  }, [primary_only]);
  
  const primarySignals = useMemo(() => 
    TRUST_SIGNAL_DISPLAYS.filter(s => s.emphasis === 'primary'),
  []);
  
  const secondarySignals = useMemo(() =>
    TRUST_SIGNAL_DISPLAYS.filter(s => s.emphasis === 'secondary'),
  []);
  
  const getSignal = useCallback((id: string) => {
    return TRUST_SIGNAL_DISPLAYS.find(s => s.id === id);
  }, []);
  
  return {
    signals,
    primarySignals,
    secondarySignals,
    getSignal,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNICATION GUIDELINES HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseCommunicationGuidelinesReturn {
  tone: typeof PUBLIC_COMMUNICATION_GUIDELINES.tone;
  useWords: string[];
  avoidWords: string[];
  keyMessages: string[];
  isWordAllowed: (word: string) => boolean;
  checkText: (text: string) => { allowed: boolean; issues: string[] };
}

export function useCommunicationGuidelines(): UseCommunicationGuidelinesReturn {
  const isWordAllowed = useCallback((word: string): boolean => {
    const lower = word.toLowerCase();
    return !PUBLIC_COMMUNICATION_GUIDELINES.avoid_words.some(
      avoid => lower.includes(avoid.toLowerCase())
    );
  }, []);
  
  const checkText = useCallback((text: string): { allowed: boolean; issues: string[] } => {
    const issues: string[] = [];
    const lower = text.toLowerCase();
    
    for (const avoid of PUBLIC_COMMUNICATION_GUIDELINES.avoid_words) {
      if (lower.includes(avoid.toLowerCase())) {
        issues.push(`Contains "${avoid}" - consider alternatives`);
      }
    }
    
    return {
      allowed: issues.length === 0,
      issues,
    };
  }, []);
  
  return {
    tone: PUBLIC_COMMUNICATION_GUIDELINES.tone,
    useWords: PUBLIC_COMMUNICATION_GUIDELINES.use_words,
    avoidWords: PUBLIC_COMMUNICATION_GUIDELINES.avoid_words,
    keyMessages: PUBLIC_COMMUNICATION_GUIDELINES.key_messages,
    isWordAllowed,
    checkText,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC DASHBOARD HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePublicDashboardOptions {
  user_id: string;
  level: AbstractionLevel;
}

export interface UsePublicDashboardReturn {
  dashboard: PublicDashboardView | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePublicDashboard(options: UsePublicDashboardOptions): UsePublicDashboardReturn {
  const { user_id, level } = options;
  
  const [dashboard, setDashboard] = useState<PublicDashboardView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - would fetch from internal system and transform
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Transform internal data to public view
      const publicDashboard: PublicDashboardView = {
        spaces: [
          {
            id: 'space-1',
            name: 'Work',
            description: 'Professional projects and tasks',
            icon: '💼',
            color: '#6688cc',
            activity_summary: '3 active threads, 2 pending decisions',
            active_threads: 3,
            recent_decisions: 2,
            mental_load: 'moderate',
          },
          {
            id: 'space-2',
            name: 'Personal',
            description: 'Personal goals and reflections',
            icon: '🏠',
            color: '#88aa88',
            activity_summary: '1 active thread',
            active_threads: 1,
            recent_decisions: 0,
            mental_load: 'low',
          },
        ],
        recent_decisions: [
          {
            id: 'decision-1',
            title: 'Project approach',
            summary: 'Chose iterative development over waterfall',
            made_at: new Date().toISOString(),
            made_by: user_id,
            rationale: 'Allows for flexibility and early feedback',
            impacts: ['Timeline', 'Team allocation'],
            reversible: true,
          },
        ],
        active_threads: [
          {
            id: 'thread-1',
            title: 'Q1 Planning',
            summary: 'Planning goals and milestones for Q1',
            started_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            evolution: 'Started with brainstorm, now refining priorities',
            decisions: 2,
            status: 'active',
          },
        ],
        mental_load: {
          current: 'moderate',
          trend: 'stable',
          suggestion: 'Consider completing some pending decisions',
        },
        assistants: [
          {
            id: 'assistant-1',
            name: 'Writing Helper',
            role: 'Assists with writing and editing',
            capabilities: ['Draft suggestions', 'Grammar check', 'Tone adjustment'],
            limitations: ['Cannot publish', 'Cannot delete', 'Cannot access other spaces'],
            active: true,
            trust: 'established',
          },
        ],
        trust_signals_visible: true,
      };
      
      setDashboard(publicDashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [user_id]);
  
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);
  
  return {
    dashboard,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC SPACE VIEW HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePublicSpaceViewOptions {
  space_id: string;
  level: AbstractionLevel;
}

export interface UsePublicSpaceViewReturn {
  spaceView: PublicSpaceView | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePublicSpaceView(options: UsePublicSpaceViewOptions): UsePublicSpaceViewReturn {
  const { space_id, level } = options;
  
  const [spaceView, setSpaceView] = useState<PublicSpaceView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadSpaceView = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Would fetch and transform internal sphere data
      const view: PublicSpaceView = {
        space: {
          id: space_id,
          name: 'Work',
          description: 'Professional projects and tasks',
          icon: '💼',
          color: '#6688cc',
          activity_summary: '3 active threads, 2 pending decisions',
          active_threads: 3,
          recent_decisions: 2,
          mental_load: 'moderate',
        },
        threads: [],
        decisions: [],
        assistants: [],
        rooms: level === 'experience' || level === 'technical' ? [
          {
            id: 'room-1',
            name: 'Reflection Room',
            purpose: 'A calm space for thinking through decisions',
            type: 'reflection',
            xr_required: false,
            available: true,
          },
        ] : [],
      };
      
      setSpaceView(view);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load space');
    } finally {
      setIsLoading(false);
    }
  }, [space_id, level]);
  
  useEffect(() => {
    loadSpaceView();
  }, [loadSpaceView]);
  
  return {
    spaceView,
    isLoading,
    error,
    refresh: loadSpaceView,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED PUBLIC ABSTRACTION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UsePublicAbstractionOptions {
  user_id: string;
  initial_level?: AbstractionLevel;
  xr_enabled?: boolean;
}

export interface UsePublicAbstractionReturn {
  // Abstraction level
  level: UseAbstractionLevelReturn;
  
  // Terminology
  terminology: UsePublicTerminologyReturn;
  
  // Trust
  trust: UseTrustSignalsReturn;
  
  // Communication
  communication: UseCommunicationGuidelinesReturn;
  
  // Dashboard
  dashboard: UsePublicDashboardReturn;
  
  // XR
  xr: {
    enabled: boolean;
    showXROptions: boolean;
  };
}

export function usePublicAbstraction(options: UsePublicAbstractionOptions): UsePublicAbstractionReturn {
  const { user_id, initial_level = 'conceptual', xr_enabled = false } = options;
  
  const level = useAbstractionLevel({ initial_level });
  const terminology = usePublicTerminology();
  const trust = useTrustSignals();
  const communication = useCommunicationGuidelines();
  const dashboard = usePublicDashboard({ user_id, level: level.level });
  
  // XR is only shown at experience or technical levels
  const showXROptions = xr_enabled && (level.level === 'experience' || level.level === 'technical');
  
  return {
    level,
    terminology,
    trust,
    communication,
    dashboard,
    xr: {
      enabled: xr_enabled,
      showXROptions,
    },
  };
}
