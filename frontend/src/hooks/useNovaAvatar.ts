/**
 * CHE·NU — Nova Avatar Hook
 * ============================================================
 * Manages Nova's visual presence activation and state.
 * 
 * Principles:
 * - Avatar is NOT visible by default
 * - Requires: action + orchestrator + voice + explicit opt-in
 * - Visual presence must never increase cognitive load
 * - Avatar is an interface, not a character
 * 
 * @version 1.0.0
 * @frozen true
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

export type AvatarState = 
  | 'hidden'       // Not visible (default)
  | 'idle'         // Visible, minimal movement
  | 'speaking'     // Light animation, lip sync
  | 'listening'    // Attentive, eyes glow
  | 'processing'   // Gentle pulse
  | 'inactive'     // Faded/minimized
  | 'focus_mode';  // Hidden (user typing)

export interface AvatarConditions {
  hasCompletedAction: boolean;    // At least one assisted action
  orchestratorActive: boolean;    // Orchestrator is on
  voiceEnabled: boolean;          // Voice is on
  explicitOptIn: boolean;         // User said yes
}

export interface AvatarAppearance {
  style: 'futuristic' | 'minimal' | 'abstract';
  size: 'small' | 'medium' | 'large';
  position: 'docked' | 'floating';
  lipSync: boolean;
  subtleBreathing: boolean;
}

export interface AvatarProposal {
  id: string;
  message: string;
  buttons: Array<{
    label: string;
    action: 'enable' | 'decline';
    isDefault?: boolean;
  }>;
}

export interface UseNovaAvatarReturn {
  // State
  avatarState: AvatarState;
  conditions: AvatarConditions;
  appearance: AvatarAppearance;
  
  // Computed
  isVisible: boolean;
  isEligible: boolean;
  shouldPropose: boolean;
  conditionsMet: number;
  
  // Proposal
  proposal: AvatarProposal | null;
  
  // Condition Recording
  recordCompletedAction: () => void;
  setOrchestratorActive: (active: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  
  // Avatar Control
  handleEnable: () => void;
  handleDecline: () => void;
  disable: () => void;
  minimize: () => void;
  restore: () => void;
  
  // State Updates
  setAvatarState: (state: AvatarState) => void;
  enterFocusMode: () => void;
  exitFocusMode: () => void;
  
  // Appearance
  updateAppearance: (appearance: Partial<AvatarAppearance>) => void;
  
  // Performance
  isLowPerformance: boolean;
  isBatterySaving: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'chenu_nova_avatar';
const APPEARANCE_KEY = 'chenu_nova_avatar_appearance';

// ============================================================
// CANONICAL PROPOSAL
// ============================================================

const CANONICAL_PROPOSAL: AvatarProposal = {
  id: 'nova_avatar_proposal',
  message: `You can enable a visual representation of Nova.
It does not add features.
It only changes how information is presented.`,
  buttons: [
    { label: 'Enable avatar', action: 'enable' },
    { label: 'Not now', action: 'decline', isDefault: true }
  ]
};

// ============================================================
// DEFAULT APPEARANCE
// ============================================================

const DEFAULT_APPEARANCE: AvatarAppearance = {
  style: 'futuristic',
  size: 'small',
  position: 'docked',
  lipSync: false,
  subtleBreathing: true
};

// ============================================================
// HOOK
// ============================================================

export function useNovaAvatar(): UseNovaAvatarReturn {
  
  // ============================================================
  // STATE
  // ============================================================
  
  const [avatarState, setAvatarStateInternal] = useState<AvatarState>('hidden');
  
  const [conditions, setConditions] = useState<AvatarConditions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.conditions || getDefaultConditions();
      }
    } catch {}
    return getDefaultConditions();
  });
  
  const [appearance, setAppearance] = useState<AvatarAppearance>(() => {
    try {
      const saved = localStorage.getItem(APPEARANCE_KEY);
      return saved ? { ...DEFAULT_APPEARANCE, ...JSON.parse(saved) } : DEFAULT_APPEARANCE;
    } catch {
      return DEFAULT_APPEARANCE;
    }
  });
  
  const [wasProposed, setWasProposed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [previousState, setPreviousState] = useState<AvatarState>('hidden');
  
  // Performance detection
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isBatterySaving, setIsBatterySaving] = useState(false);
  
  // ============================================================
  // HELPERS
  // ============================================================
  
  function getDefaultConditions(): AvatarConditions {
    return {
      hasCompletedAction: false,
      orchestratorActive: false,
      voiceEnabled: false,
      explicitOptIn: false
    };
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      conditions,
      enabled: conditions.explicitOptIn && avatarState !== 'hidden'
    }));
  }, [conditions, avatarState]);
  
  useEffect(() => {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearance));
  }, [appearance]);
  
  // ============================================================
  // PERFORMANCE DETECTION
  // ============================================================
  
  useEffect(() => {
    // Check device memory (if available)
    const nav = navigator as any;
    if (nav.deviceMemory && nav.deviceMemory < 4) {
      setIsLowPerformance(true);
    }
    
    // Check battery status
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: unknown) => {
        const checkBattery = () => {
          setIsBatterySaving(battery.level < 0.2 && !battery.charging);
        };
        
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      }).catch(() => {
        // Battery API not available
      });
    }
  }, []);
  
  // ============================================================
  // COMPUTED
  // ============================================================
  
  const conditionsMet = useMemo(() => {
    let count = 0;
    if (conditions.hasCompletedAction) count++;
    if (conditions.orchestratorActive) count++;
    if (conditions.voiceEnabled) count++;
    if (conditions.explicitOptIn) count++;
    return count;
  }, [conditions]);
  
  const isEligible = useMemo(() => {
    return (
      conditions.hasCompletedAction &&
      conditions.orchestratorActive &&
      conditions.voiceEnabled
    );
  }, [conditions]);
  
  const shouldPropose = useMemo(() => {
    // Don't propose if already opted in or declined
    if (conditions.explicitOptIn || wasProposed) {
      return false;
    }
    
    // Don't propose on low-performance devices
    if (isLowPerformance || isBatterySaving) {
      return false;
    }
    
    // Propose only when all prerequisites met
    return isEligible;
  }, [conditions.explicitOptIn, wasProposed, isEligible, isLowPerformance, isBatterySaving]);
  
  const isVisible = useMemo(() => {
    if (!conditions.explicitOptIn) return false;
    if (isLowPerformance || isBatterySaving) return false;
    if (avatarState === 'hidden' || avatarState === 'focus_mode') return false;
    if (isMinimized) return false;
    return true;
  }, [conditions.explicitOptIn, avatarState, isMinimized, isLowPerformance, isBatterySaving]);
  
  const proposal = useMemo(() => {
    if (shouldPropose) {
      return CANONICAL_PROPOSAL;
    }
    return null;
  }, [shouldPropose]);
  
  // ============================================================
  // CONDITION RECORDING
  // ============================================================
  
  const recordCompletedAction = useCallback(() => {
    setConditions(prev => ({ ...prev, hasCompletedAction: true }));
  }, []);
  
  const setOrchestratorActive = useCallback((active: boolean) => {
    setConditions(prev => ({ ...prev, orchestratorActive: active }));
  }, []);
  
  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setConditions(prev => ({ ...prev, voiceEnabled: enabled }));
    
    // Avatar requires voice - if voice disabled, hide avatar
    if (!enabled && avatarState !== 'hidden') {
      setAvatarStateInternal('hidden');
    }
  }, [avatarState]);
  
  // ============================================================
  // AVATAR CONTROL
  // ============================================================
  
  const handleEnable = useCallback(() => {
    if (!isEligible) {
      logger.warn('[NovaAvatar] Cannot enable - conditions not met');
      return;
    }
    
    setConditions(prev => ({ ...prev, explicitOptIn: true }));
    setAvatarStateInternal('idle');
    setWasProposed(true);
    
    // logger.debug('[NovaAvatar] Enabled by user');
  }, [isEligible]);
  
  const handleDecline = useCallback(() => {
    setWasProposed(true);
    // logger.debug('[NovaAvatar] Declined by user');
  }, []);
  
  const disable = useCallback(() => {
    setConditions(prev => ({ ...prev, explicitOptIn: false }));
    setAvatarStateInternal('hidden');
    // logger.debug('[NovaAvatar] Disabled by user');
  }, []);
  
  const minimize = useCallback(() => {
    setIsMinimized(true);
    // logger.debug('[NovaAvatar] Minimized');
  }, []);
  
  const restore = useCallback(() => {
    setIsMinimized(false);
    // logger.debug('[NovaAvatar] Restored');
  }, []);
  
  // ============================================================
  // STATE UPDATES
  // ============================================================
  
  const setAvatarState = useCallback((state: AvatarState) => {
    if (!conditions.explicitOptIn && state !== 'hidden') {
      logger.warn('[NovaAvatar] Cannot change state - avatar not enabled');
      return;
    }
    
    setAvatarStateInternal(state);
  }, [conditions.explicitOptIn]);
  
  const enterFocusMode = useCallback(() => {
    if (avatarState !== 'hidden' && avatarState !== 'focus_mode') {
      setPreviousState(avatarState);
      setAvatarStateInternal('focus_mode');
    }
  }, [avatarState]);
  
  const exitFocusMode = useCallback(() => {
    if (avatarState === 'focus_mode') {
      setAvatarStateInternal(previousState || 'idle');
    }
  }, [avatarState, previousState]);
  
  // ============================================================
  // APPEARANCE
  // ============================================================
  
  const updateAppearance = useCallback((newAppearance: Partial<AvatarAppearance>) => {
    setAppearance(prev => ({ ...prev, ...newAppearance }));
  }, []);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    avatarState,
    conditions,
    appearance,
    isVisible,
    isEligible,
    shouldPropose,
    conditionsMet,
    proposal,
    recordCompletedAction,
    setOrchestratorActive,
    setVoiceEnabled,
    handleEnable,
    handleDecline,
    disable,
    minimize,
    restore,
    setAvatarState,
    enterFocusMode,
    exitFocusMode,
    updateAppearance,
    isLowPerformance,
    isBatterySaving
  };
}

export default useNovaAvatar;
