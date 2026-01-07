/**
 * CHE·NU — Voice Activation Hook
 * ============================================================
 * Manages when and how to propose voice interaction.
 * 
 * Principles:
 * - Voice is earned, not enabled
 * - Silence is the default state
 * - Push-to-talk by default
 * - Never bypasses governance
 * 
 * @version 1.0.0
 * @frozen true
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

export type VoiceState = 
  | 'unavailable'    // Conditions not met
  | 'available'      // Can be proposed
  | 'proposed'       // Currently showing proposal
  | 'declined'       // User said no
  | 'enabled'        // Voice is on
  | 'listening'      // Actively listening
  | 'processing'     // Processing input
  | 'speaking'       // Nova is speaking
  | 'muted';         // User muted

export type VoiceMode = 'push_to_talk' | 'hands_free';

export interface VoiceConditions {
  hasCompletedAction: boolean;    // Accepted or rejected a proposal
  longSession: boolean;           // Session > 20 min
  orchestratorActive: boolean;    // Orchestrator is on
  isMultitasking: boolean;        // Switching contexts
  inCollaboration: boolean;       // Meeting/sharing active
}

export interface VoiceSettings {
  mode: VoiceMode;
  autoMuteInFocus: boolean;
  respectSystemMute: boolean;
}

export interface VoiceProposal {
  id: string;
  message: string;
  buttons: Array<{
    label: string;
    action: 'enable' | 'decline';
    isDefault?: boolean;
  }>;
}

export interface UseVoiceActivationReturn {
  // State
  voiceState: VoiceState;
  conditions: VoiceConditions;
  settings: VoiceSettings;
  
  // Computed
  shouldPropose: boolean;
  isEnabled: boolean;
  isListening: boolean;
  conditionsMet: number;
  
  // Proposal
  proposal: VoiceProposal | null;
  
  // Recording conditions
  recordCompletedAction: () => void;
  setOrchestratorActive: (active: boolean) => void;
  setMultitasking: (multitasking: boolean) => void;
  setCollaboration: (active: boolean) => void;
  
  // Voice control
  handleEnable: () => void;
  handleDecline: () => void;
  disable: () => void;
  
  // Interaction
  startListening: () => void;
  stopListening: () => void;
  mute: () => void;
  unmute: () => void;
  
  // Settings
  updateSettings: (settings: Partial<VoiceSettings>) => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const MIN_CONDITIONS_REQUIRED = 2;
const LONG_SESSION_MINUTES = 20;

const STORAGE_KEY = 'chenu_voice_state';
const SETTINGS_KEY = 'chenu_voice_settings';

// ============================================================
// CANONICAL PROPOSAL
// ============================================================

const CANONICAL_PROPOSAL: VoiceProposal = {
  id: 'voice_proposal',
  message: `You can enable voice interaction if you prefer speaking instead of typing.
Voice is optional and can be turned off at any time.`,
  buttons: [
    { label: 'Enable voice', action: 'enable' },
    { label: 'Not now', action: 'decline', isDefault: true }
  ]
};

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS: VoiceSettings = {
  mode: 'push_to_talk',
  autoMuteInFocus: true,
  respectSystemMute: true
};

// ============================================================
// HOOK
// ============================================================

export function useVoiceActivation(
  sessionStartTime: number,
  isOriented: boolean = false
): UseVoiceActivationReturn {
  
  // ============================================================
  // STATE
  // ============================================================
  
  const [voiceState, setVoiceState] = useState<VoiceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.enabled) return 'enabled';
        if (parsed.declined) return 'declined';
      }
    } catch {}
    return 'unavailable';
  });
  
  const [conditions, setConditions] = useState<VoiceConditions>({
    hasCompletedAction: false,
    longSession: false,
    orchestratorActive: false,
    isMultitasking: false,
    inCollaboration: false
  });
  
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });
  
  const [wasProposed, setWasProposed] = useState(false);
  
  // Refs for audio handling
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  useEffect(() => {
    const stateToSave = {
      enabled: voiceState === 'enabled' || voiceState === 'listening' || 
               voiceState === 'processing' || voiceState === 'speaking',
      declined: voiceState === 'declined'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [voiceState]);
  
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  
  // ============================================================
  // SESSION TIME TRACKING
  // ============================================================
  
  useEffect(() => {
    const checkSessionLength = () => {
      const elapsed = (Date.now() - sessionStartTime) / 60000;
      if (elapsed >= LONG_SESSION_MINUTES) {
        setConditions(prev => ({ ...prev, longSession: true }));
      }
    };
    
    const interval = setInterval(checkSessionLength, 60000);
    checkSessionLength();
    
    return () => clearInterval(interval);
  }, [sessionStartTime]);
  
  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  
  const conditionsMet = useMemo(() => {
    let count = 0;
    if (conditions.hasCompletedAction) count++;
    if (conditions.longSession) count++;
    if (conditions.orchestratorActive) count++;
    if (conditions.isMultitasking) count++;
    if (conditions.inCollaboration) count++;
    return count;
  }, [conditions]);
  
  const shouldPropose = useMemo(() => {
    // Don't propose if already enabled or declined
    if (voiceState === 'enabled' || voiceState === 'declined' || 
        voiceState === 'listening' || voiceState === 'processing' ||
        voiceState === 'speaking' || voiceState === 'muted') {
      return false;
    }
    
    // Don't propose if already proposed this session
    if (wasProposed) {
      return false;
    }
    
    // Don't propose if user isn't oriented
    if (!isOriented) {
      return false;
    }
    
    // Propose only if minimum conditions met
    return conditionsMet >= MIN_CONDITIONS_REQUIRED;
  }, [voiceState, wasProposed, isOriented, conditionsMet]);
  
  const isEnabled = useMemo(() => {
    return ['enabled', 'listening', 'processing', 'speaking', 'muted'].includes(voiceState);
  }, [voiceState]);
  
  const isListening = useMemo(() => {
    return voiceState === 'listening';
  }, [voiceState]);
  
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
  
  const setMultitasking = useCallback((multitasking: boolean) => {
    setConditions(prev => ({ ...prev, isMultitasking: multitasking }));
  }, []);
  
  const setCollaboration = useCallback((active: boolean) => {
    setConditions(prev => ({ ...prev, inCollaboration: active }));
  }, []);
  
  // ============================================================
  // VOICE CONTROL
  // ============================================================
  
  const handleEnable = useCallback(() => {
    setVoiceState('enabled');
    setWasProposed(true);
    // logger.debug('[Voice] Enabled by user');
  }, []);
  
  const handleDecline = useCallback(() => {
    setVoiceState('declined');
    setWasProposed(true);
    // logger.debug('[Voice] Declined by user');
  }, []);
  
  const disable = useCallback(() => {
    // Stop any active listening
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    setVoiceState('unavailable');
    // logger.debug('[Voice] Disabled by user');
  }, []);
  
  // ============================================================
  // LISTENING CONTROL
  // ============================================================
  
  const startListening = useCallback(async () => {
    if (!isEnabled) {
      logger.warn('[Voice] Cannot listen - voice not enabled');
      return;
    }
    
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      setVoiceState('listening');
      // logger.debug('[Voice] Started listening');
      
      // In real implementation, connect to speech recognition service
      
    } catch (error) {
      logger.error('[Voice] Failed to start listening:', error);
      // Fall back silently to text
    }
  }, [isEnabled]);
  
  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (voiceState === 'listening') {
      setVoiceState('enabled');
    }
    
    // logger.debug('[Voice] Stopped listening');
  }, [voiceState]);
  
  const mute = useCallback(() => {
    if (isEnabled) {
      stopListening();
      setVoiceState('muted');
      // logger.debug('[Voice] Muted');
    }
  }, [isEnabled, stopListening]);
  
  const unmute = useCallback(() => {
    if (voiceState === 'muted') {
      setVoiceState('enabled');
      // logger.debug('[Voice] Unmuted');
    }
  }, [voiceState]);
  
  // ============================================================
  // SETTINGS
  // ============================================================
  
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  // ============================================================
  // CLEANUP
  // ============================================================
  
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    voiceState,
    conditions,
    settings,
    shouldPropose,
    isEnabled,
    isListening,
    conditionsMet,
    proposal,
    recordCompletedAction,
    setOrchestratorActive,
    setMultitasking,
    setCollaboration,
    handleEnable,
    handleDecline,
    disable,
    startListening,
    stopListening,
    mute,
    unmute,
    updateSettings
  };
}

export default useVoiceActivation;
