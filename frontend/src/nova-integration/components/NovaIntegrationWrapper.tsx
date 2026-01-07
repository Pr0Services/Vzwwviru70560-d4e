// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA INTEGRATION WRAPPER
// Composant wrapper pour intégrer Nova dans n'importe quelle app CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect, type ReactNode } from 'react';

// Providers
import { NovaProvider, useNovaContext } from '../providers/NovaProvider';

// Components
import { NovaCommandPalette } from './NovaCommandPalette';
import { NovaFloatingButton } from './NovaFloatingButton';

// Nova Core Components (from nova-system)
import { NovaChatInterface } from '../../core/nova/components/NovaComponents';
import { NovaTutorialOverlay } from '../../core/nova/components/NovaTutorialOverlay';
import { NovaProactiveSuggestions } from '../../core/nova/components/NovaProactiveSuggestions';

// Types
import type { NovaUser, NovaSphere, NovaSection } from '../../core/nova/types/nova.types';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface NovaIntegrationConfig {
  // User info
  user: NovaUser;
  
  // Current context
  currentSphere?: NovaSphere;
  currentSection?: NovaSection;
  
  // Features toggles
  enableFloatingButton?: boolean;
  enableCommandPalette?: boolean;
  enableProactiveSuggestions?: boolean;
  enableTutorials?: boolean;
  enableVoice?: boolean;
  
  // Styling
  theme?: 'light' | 'dark' | 'system';
  accentColor?: string;
  
  // Callbacks
  onNavigate?: (target: { type: 'sphere' | 'section'; id: string }) => void;
  onAction?: (action: string, params?: unknown) => void;
  onNovaOpen?: () => void;
  onNovaClose?: () => void;
  
  // API
  apiEndpoint?: string;
}

interface NovaIntegrationWrapperProps {
  children: ReactNode;
  config: NovaIntegrationConfig;
}

// ─────────────────────────────────────────────────────────────────────────────────
// INNER COMPONENT (with context access)
// ─────────────────────────────────────────────────────────────────────────────────

function NovaIntegrationInner({
  children,
  config,
}: NovaIntegrationWrapperProps) {
  const {
    state,
    openNova,
    closeNova,
    sendMessage,
    setSphere,
    setSection,
    tutorialEngine,
    nextTutorialStep,
    prevTutorialStep,
    endTutorial,
    skipTutorial,
    acceptSuggestion,
    dismissSuggestion,
    submitFeedback,
    submitCorrection,
  } = useNovaContext();
  
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNC CONTEXT WITH CONFIG
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (config.currentSphere) {
      setSphere(config.currentSphere);
    }
  }, [config.currentSphere, setSphere]);

  useEffect(() => {
    if (config.currentSection) {
      setSection(config.currentSection);
    }
  }, [config.currentSection, setSection]);

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" pour ouvrir la palette de commandes
      if (e.key === '/' && !isPaletteOpen && !isInputFocused()) {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaletteOpen]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (state.isOpen) {
      config.onNovaOpen?.();
    } else {
      config.onNovaClose?.();
    }
  }, [state.isOpen, config]);

  const handleClosePalette = useCallback(() => {
    setIsPaletteOpen(false);
  }, []);

  const handleFeedback = useCallback((type: 'positive' | 'negative', messageId: string) => {
    submitFeedback(messageId, type);
  }, [submitFeedback]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GET CURRENT TUTORIAL
  // ═══════════════════════════════════════════════════════════════════════════
  
  const currentTutorial = state.activeTutorial 
    ? tutorialEngine.getTutorial(state.activeTutorial)
    : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="nova-integration-wrapper" style={{ position: 'relative', minHeight: '100%' }}>
      {/* Main app content */}
      {children}

      {/* Command Palette */}
      {config.enableCommandPalette !== false && (
        <NovaCommandPalette
          isOpen={isPaletteOpen}
          onClose={handleClosePalette}
          language={state.settings.language}
        />
      )}

      {/* Floating Button */}
      {config.enableFloatingButton !== false && (
        <NovaFloatingButton
          position="bottom-right"
          size="medium"
          showLabel={true}
          showBadge={state.suggestions.length > 0}
          badgeCount={state.suggestions.length}
          pulse={state.suggestions.length > 0}
        />
      )}

      {/* Nova Chat Interface */}
      {state.isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 400,
            maxHeight: 600,
            zIndex: 9997,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <NovaChatInterface
            messages={state.messages}
            isLoading={state.isLoading}
            onSendMessage={sendMessage}
            onClose={closeNova}
            language={state.settings.language}
            showFeedback={true}
            onFeedback={handleFeedback}
          />
        </div>
      )}

      {/* Proactive Suggestions */}
      {config.enableProactiveSuggestions !== false && state.suggestions.length > 0 && !state.isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 320,
            zIndex: 9996,
          }}
        >
          <NovaProactiveSuggestions
            suggestions={state.suggestions}
            onAccept={acceptSuggestion}
            onDismiss={dismissSuggestion}
            maxVisible={2}
            language={state.settings.language}
            variant="floating"
          />
        </div>
      )}

      {/* Tutorial Overlay */}
      {config.enableTutorials !== false && currentTutorial && (
        <NovaTutorialOverlay
          tutorial={currentTutorial}
          currentStep={state.tutorialStep}
          onStepChange={(step) => {
            if (step > state.tutorialStep) {
              nextTutorialStep();
            } else {
              prevTutorialStep();
            }
          }}
          onComplete={endTutorial}
          onSkip={skipTutorial}
          language={state.settings.language}
        />
      )}

      {/* Global Styles */}
      <style>{`
        :root {
          --chenu-gold: #D8B26A;
          --chenu-stone: #8D8371;
          --chenu-emerald: #3F7249;
          --chenu-turquoise: #3EB4A2;
          --chenu-moss: #2F4C39;
          --chenu-ember: #7A593A;
          --chenu-slate: #1E1F22;
          --chenu-sand: #E9E4D6;
          
          --chenu-bg-primary: ${config.theme === 'light' ? '#ffffff' : '#1E1F22'};
          --chenu-bg-secondary: ${config.theme === 'light' ? '#f5f5f5' : '#2a2b2e'};
          --chenu-bg-hover: ${config.theme === 'light' ? '#e8e8e8' : '#333'};
          --chenu-text-primary: ${config.theme === 'light' ? '#1E1F22' : '#ffffff'};
          --chenu-text-secondary: ${config.theme === 'light' ? '#666' : '#888'};
          --chenu-border: ${config.theme === 'light' ? '#e0e0e0' : '#333'};
          --chenu-accent: ${config.accentColor || '#D8B26A'};
        }
        
        .nova-integration-wrapper * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN WRAPPER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function NovaIntegrationWrapper({
  children,
  config,
}: NovaIntegrationWrapperProps) {
  return (
    <NovaProvider
      user={config.user}
      initialSphere={config.currentSphere}
      onNavigate={config.onNavigate}
      onAction={config.onAction}
      apiEndpoint={config.apiEndpoint}
    >
      <NovaIntegrationInner config={config}>
        {children}
      </NovaIntegrationInner>
    </NovaProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────────

function isInputFocused(): boolean {
  const active = document.activeElement;
  return (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    (active instanceof HTMLElement && active.isContentEditable)
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export default NovaIntegrationWrapper;
