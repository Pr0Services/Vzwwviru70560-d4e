/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — USE NOVA ONBOARDING HOOK                        ║
 * ║                    Gestion de la progression onboarding                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  NovaScriptId,
  NovaTrigger,
  NovaScript,
  NovaOnboardingState,
  NOVA_SCRIPTS,
  getScriptByTrigger,
  getScriptOrder,
  calculateProgress,
} from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE KEY
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'chenu_nova_onboarding';

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_STATE: NovaOnboardingState = {
  currentScript: null,
  completedScripts: [],
  isActive: false,
  isPaused: false,
  selectedTheme: null,
  onboardingComplete: false,
  messageIndex: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseNovaOnboardingReturn {
  // State
  state: NovaOnboardingState;
  currentScript: NovaScript | null;
  currentMessage: string | null;
  progress: number;
  
  // Navigation
  startOnboarding: () => void;
  nextMessage: () => void;
  nextScript: () => void;
  skipScript: () => void;
  pauseOnboarding: () => void;
  resumeOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Triggers
  triggerScript: (trigger: NovaTrigger) => void;
  
  // Theme
  selectTheme: (themeId: string) => void;
  
  // Flags
  isOnboardingComplete: boolean;
  isFirstLogin: boolean;
  hasStarted: boolean;
}

export function useNovaOnboarding(): UseNovaOnboardingReturn {
  // Load state from localStorage
  const [state, setState] = useState<NovaOnboardingState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      logger.warn('Failed to load Nova onboarding state:', e);
    }
    return DEFAULT_STATE;
  });

  // Save state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Current script data
  const currentScript = useMemo(() => {
    if (!state.currentScript) return null;
    return NOVA_SCRIPTS[state.currentScript] || null;
  }, [state.currentScript]);

  // Current message
  const currentMessage = useMemo(() => {
    if (!currentScript) return null;
    return currentScript.messages[state.messageIndex] || null;
  }, [currentScript, state.messageIndex]);

  // Progress percentage
  const progress = useMemo(() => {
    return calculateProgress(state.completedScripts);
  }, [state.completedScripts]);

  // Start onboarding from beginning
  const startOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      currentScript: 'welcome',
      messageIndex: 0,
    }));
  }, []);

  // Go to next message in current script
  const nextMessage = useCallback(() => {
    if (!currentScript) return;
    
    const maxIndex = currentScript.messages.length - 1;
    if (state.messageIndex < maxIndex) {
      setState(prev => ({
        ...prev,
        messageIndex: prev.messageIndex + 1,
      }));
    }
  }, [currentScript, state.messageIndex]);

  // Go to next script
  const nextScript = useCallback(() => {
    if (!currentScript) return;
    
    const completed = [...state.completedScripts];
    if (!completed.includes(currentScript.id)) {
      completed.push(currentScript.id);
    }

    if (currentScript.nextScript) {
      setState(prev => ({
        ...prev,
        completedScripts: completed,
        currentScript: currentScript.nextScript,
        messageIndex: 0,
      }));
    } else {
      // Onboarding complete
      setState(prev => ({
        ...prev,
        completedScripts: completed,
        currentScript: null,
        isActive: false,
        onboardingComplete: true,
        messageIndex: 0,
      }));
    }
  }, [currentScript, state.completedScripts]);

  // Skip current script
  const skipScript = useCallback(() => {
    nextScript();
  }, [nextScript]);

  // Pause onboarding
  const pauseOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  // Resume onboarding
  const resumeOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      onboardingComplete: true,
      currentScript: null,
    }));
  }, []);

  // Reset onboarding (for testing)
  const resetOnboarding = useCallback(() => {
    setState(DEFAULT_STATE);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Trigger a specific script by trigger name
  const triggerScript = useCallback((trigger: NovaTrigger) => {
    // Don't trigger if onboarding is complete or paused
    if (state.onboardingComplete || state.isPaused) return;
    
    const script = getScriptByTrigger(trigger);
    if (script) {
      setState(prev => ({
        ...prev,
        isActive: true,
        currentScript: script.id,
        messageIndex: 0,
      }));
    }
  }, [state.onboardingComplete, state.isPaused]);

  // Select theme
  const selectTheme = useCallback((themeId: string) => {
    setState(prev => ({
      ...prev,
      selectedTheme: themeId,
    }));
    // Auto-trigger next script
    triggerScript('theme_selected');
  }, [triggerScript]);

  // Computed flags
  const isOnboardingComplete = state.onboardingComplete;
  const isFirstLogin = state.completedScripts.length === 0 && !state.onboardingComplete;
  const hasStarted = state.completedScripts.length > 0 || state.isActive;

  return {
    state,
    currentScript,
    currentMessage,
    progress,
    startOnboarding,
    nextMessage,
    nextScript,
    skipScript,
    pauseOnboarding,
    resumeOnboarding,
    completeOnboarding,
    resetOnboarding,
    triggerScript,
    selectTheme,
    isOnboardingComplete,
    isFirstLogin,
    hasStarted,
  };
}

export default useNovaOnboarding;
