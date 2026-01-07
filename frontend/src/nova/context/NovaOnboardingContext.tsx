/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA ONBOARDING CONTEXT                         ║
 * ║                    Provider global pour l'onboarding Nova                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useNovaOnboarding, UseNovaOnboardingReturn } from '../hooks/useNovaOnboarding';
import { NovaDialogue } from '../components/NovaDialogue';
import { NovaAction, NovaTrigger } from '../scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const NovaOnboardingContext = createContext<UseNovaOnboardingReturn | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaOnboardingProviderProps {
  children: ReactNode;
  autoStart?: boolean;
}

export const NovaOnboardingProvider: React.FC<NovaOnboardingProviderProps> = ({
  children,
  autoStart = false,
}) => {
  const onboarding = useNovaOnboarding();
  const {
    state,
    currentScript,
    nextMessage,
    nextScript,
    skipScript,
    startOnboarding,
    isFirstLogin,
  } = onboarding;

  // Auto-start onboarding on first login
  React.useEffect(() => {
    if (autoStart && isFirstLogin && !state.isActive) {
      startOnboarding();
    }
  }, [autoStart, isFirstLogin, state.isActive, startOnboarding]);

  // Handle action from dialogue
  const handleAction = useCallback((action: NovaAction) => {
    switch (action.action) {
      case 'continue':
      case 'done':
        nextScript();
        break;
      case 'skip':
        skipScript();
        break;
      case 'custom':
        // Custom actions can be handled by extending this
        logger.debug('Custom action:', action.customAction);
        nextScript();
        break;
    }
  }, [nextScript, skipScript]);

  // Handle close dialogue (pause)
  const handleClose = useCallback(() => {
    onboarding.pauseOnboarding();
  }, [onboarding]);

  return (
    <NovaOnboardingContext.Provider value={onboarding}>
      {children}
      
      {/* Render dialogue when active */}
      {state.isActive && currentScript && !state.isPaused && (
        <NovaDialogue
          script={currentScript}
          messageIndex={state.messageIndex}
          onNextMessage={nextMessage}
          onAction={handleAction}
          onClose={handleClose}
          position="bottom-right"
        />
      )}
    </NovaOnboardingContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useNovaOnboardingContext(): UseNovaOnboardingReturn {
  const context = useContext(NovaOnboardingContext);
  if (!context) {
    throw new Error('useNovaOnboardingContext must be used within NovaOnboardingProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER COMPONENT (For declarative triggering)
// ═══════════════════════════════════════════════════════════════════════════════

interface NovaTriggerProps {
  trigger: NovaTrigger;
  when?: boolean;
  children?: ReactNode;
}

export const NovaTriggerComponent: React.FC<NovaTriggerProps> = ({
  trigger,
  when = true,
  children,
}) => {
  const { triggerScript, state } = useNovaOnboardingContext();

  React.useEffect(() => {
    if (when && !state.onboardingComplete) {
      triggerScript(trigger);
    }
  }, [when, trigger, triggerScript, state.onboardingComplete]);

  return <>{children}</>;
};

export default NovaOnboardingProvider;
