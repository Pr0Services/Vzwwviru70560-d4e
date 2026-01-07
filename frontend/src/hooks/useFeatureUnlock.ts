/**
 * CHE·NU — Progressive Feature Unlock Manager
 * ============================================================
 * Coordinates the progressive unlocking of features based on
 * user maturity and engagement.
 * 
 * Feature unlock order:
 * 1. Basic workspace (immediate)
 * 2. First 10 minutes guidance
 * 3. Orchestrator (after patterns)
 * 4. Voice (after orchestrator or conditions)
 * 5. Advanced features (budgets, presets, meetings)
 * 
 * @version 1.0.0
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useFirst10Minutes } from './useFirst10Minutes';
import { useOrchestratorActivation } from './useOrchestratorActivation';
import { useVoiceActivation } from './useVoiceActivation';

// ============================================================
// TYPES
// ============================================================

export type FeatureLevel = 
  | 'basic'           // Just logged in
  | 'oriented'        // Completed first 10 min
  | 'orchestrated'    // Orchestrator active
  | 'voice_enabled'   // Voice active
  | 'advanced';       // Full features

export interface FeatureFlags {
  // Basic (always available)
  workspace: boolean;
  spheres: boolean;
  documents: boolean;
  
  // After orientation
  novaAssistance: boolean;
  scopeSelection: boolean;
  
  // After orchestrator
  orchestrator: boolean;
  budgetDisplay: boolean;
  presets: boolean;
  
  // After voice
  voice: boolean;
  
  // After advanced
  meetings: boolean;
  multiAgent: boolean;
  advancedScopes: boolean;
}

export interface FeatureProposal {
  feature: 'orchestrator' | 'voice';
  proposal: {
    id: string;
    message: string;
    buttons: Array<{
      label: string;
      action: string;
      isDefault?: boolean;
    }>;
  };
}

export interface UseFeatureUnlockReturn {
  // Current level
  level: FeatureLevel;
  
  // Feature flags
  features: FeatureFlags;
  
  // Active proposal (if any)
  activeProposal: FeatureProposal | null;
  
  // Proposal handlers
  handleProposalResponse: (feature: string, action: string) => void;
  dismissProposal: () => void;
  
  // Manual feature control
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
  
  // State from sub-hooks
  first10Min: ReturnType<typeof useFirst10Minutes>;
  orchestrator: ReturnType<typeof useOrchestratorActivation>;
  voice: ReturnType<typeof useVoiceActivation>;
}

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = 'chenu_feature_state';

// ============================================================
// HOOK
// ============================================================

export function useFeatureUnlock(isLoggedIn: boolean): UseFeatureUnlockReturn {
  
  // Session start time
  const [sessionStart] = useState(() => Date.now());
  
  // Sub-hooks
  const first10Min = useFirst10Minutes(isLoggedIn);
  const orchestrator = useOrchestratorActivation(sessionStart, first10Min.isOriented);
  const voice = useVoiceActivation(sessionStart, first10Min.isOriented);
  
  // Connect orchestrator state to voice
  useEffect(() => {
    voice.setOrchestratorActive(orchestrator.isReady);
  }, [orchestrator.isReady, voice]);
  
  // Record completed actions for voice
  useEffect(() => {
    if (first10Min.context.hasAcceptedProposal !== null) {
      voice.recordCompletedAction();
    }
  }, [first10Min.context.hasAcceptedProposal, voice]);
  
  // ============================================================
  // FEATURE LEVEL
  // ============================================================
  
  const level = useMemo((): FeatureLevel => {
    if (voice.isEnabled) return 'voice_enabled';
    if (orchestrator.isReady) return 'orchestrated';
    if (first10Min.isOriented) return 'oriented';
    return 'basic';
  }, [voice.isEnabled, orchestrator.isReady, first10Min.isOriented]);
  
  // ============================================================
  // FEATURE FLAGS
  // ============================================================
  
  const features = useMemo((): FeatureFlags => {
    const isOriented = first10Min.isOriented;
    const hasOrchestrator = orchestrator.isReady;
    const hasVoice = voice.isEnabled;
    const isAdvanced = hasOrchestrator && hasVoice;
    
    return {
      // Basic (always available)
      workspace: true,
      spheres: true,
      documents: true,
      
      // After orientation
      novaAssistance: isOriented,
      scopeSelection: isOriented,
      
      // After orchestrator
      orchestrator: hasOrchestrator,
      budgetDisplay: hasOrchestrator,
      presets: hasOrchestrator,
      
      // After voice
      voice: hasVoice,
      
      // After advanced
      meetings: isAdvanced,
      multiAgent: isAdvanced,
      advancedScopes: isAdvanced
    };
  }, [first10Min.isOriented, orchestrator.isReady, voice.isEnabled]);
  
  // ============================================================
  // ACTIVE PROPOSAL
  // ============================================================
  
  const activeProposal = useMemo((): FeatureProposal | null => {
    // Priority: orchestrator first, then voice
    if (orchestrator.proposal) {
      return {
        feature: 'orchestrator',
        proposal: orchestrator.proposal
      };
    }
    
    if (voice.proposal) {
      return {
        feature: 'voice',
        proposal: voice.proposal
      };
    }
    
    return null;
  }, [orchestrator.proposal, voice.proposal]);
  
  // ============================================================
  // PROPOSAL HANDLERS
  // ============================================================
  
  const handleProposalResponse = useCallback((feature: string, action: string) => {
    if (feature === 'orchestrator') {
      if (action === 'activate') {
        orchestrator.handleActivate();
      } else if (action === 'decline') {
        orchestrator.handleDecline();
      }
    } else if (feature === 'voice') {
      if (action === 'enable') {
        voice.handleEnable();
      } else if (action === 'decline') {
        voice.handleDecline();
      }
    }
  }, [orchestrator, voice]);
  
  const dismissProposal = useCallback(() => {
    // Dismiss = decline
    if (activeProposal?.feature === 'orchestrator') {
      orchestrator.handleDecline();
    } else if (activeProposal?.feature === 'voice') {
      voice.handleDecline();
    }
  }, [activeProposal, orchestrator, voice]);
  
  // ============================================================
  // MANUAL FEATURE CONTROL
  // ============================================================
  
  const enableFeature = useCallback((feature: keyof FeatureFlags) => {
    if (feature === 'orchestrator') {
      orchestrator.handleActivate();
    } else if (feature === 'voice') {
      voice.handleEnable();
    }
  }, [orchestrator, voice]);
  
  const disableFeature = useCallback((feature: keyof FeatureFlags) => {
    if (feature === 'orchestrator') {
      orchestrator.deactivate();
    } else if (feature === 'voice') {
      voice.disable();
    }
  }, [orchestrator, voice]);
  
  // ============================================================
  // RETURN
  // ============================================================
  
  return {
    level,
    features,
    activeProposal,
    handleProposalResponse,
    dismissProposal,
    enableFeature,
    disableFeature,
    first10Min,
    orchestrator,
    voice
  };
}

export default useFeatureUnlock;
