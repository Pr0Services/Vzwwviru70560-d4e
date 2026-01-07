/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — APPLICATION SHELL                                                  ║
 * ║                                                                                  ║
 * ║     Shell principal avec navigation et labels canoniques                         ║
 * ║                                                                                  ║
 * ║     Architecture:                                                                ║
 * ║     ┌─────────────────────────────────────────────────────────────┐              ║
 * ║     │  NavigationBar (Centre de Commandement ↔ Bureau)           │              ║
 * ║     ├─────────────────────────────────────────────────────────────┤              ║
 * ║     │  ClarificationBanner (onboarding)                          │              ║
 * ║     ├─────┬───────────────────────────────────────────────────────┤              ║
 * ║     │     │                                                       │              ║
 * ║     │ Map │           Content Area                                │              ║
 * ║     │     │    (CommandCenter ou Workdesk)                        │              ║
 * ║     │     │                                                       │              ║
 * ║     ├─────┴───────────────────────────────────────────────────────┤              ║
 * ║     │  CommunicationBar (Messages · Courriel · Réunions)         │              ║
 * ║     └─────────────────────────────────────────────────────────────┘              ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import {
  NavigationBar,
  CommunicationBar,
  MiniMapView,
  ClarificationBanner,
  type NavigationMode,
} from '../ui';
import { CommandCenter } from '../components/CommandCenter';
import { Workdesk } from '../components/Workdesk';
import type { BureauWindowId } from '../architecture/dashboard-bureau.architecture';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export interface AppShellProps {
  initialMode?: NavigationMode;
  initialSphere?: string;
  showMiniMap?: boolean;
  showCommunicationBar?: boolean;
}

interface AppState {
  mode: NavigationMode;
  sphereId: string;
  sphereName: string;
  sphereColor: string;
  bureauWindowId?: BureauWindowId;
  unreadMessages: number;
  unreadEmails: number;
  upcomingMeetings: number;
  activeAgents: number;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--chenu-bg-deep, #16171A)',
    color: 'var(--chenu-text, #E9E4D6)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  mainArea: {
    flex: 1,
    overflow: 'hidden',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// CSS VARIABLES (à injecter dans :root)
// ═══════════════════════════════════════════════════════════════════════════════════

const CSS_VARIABLES = `
:root {
  /* CHE·NU Brand Colors */
  --chenu-gold: #D8B26A;
  --chenu-stone: #8D8371;
  --chenu-emerald: #3F7249;
  --chenu-turquoise: #3EB4A2;
  --chenu-moss: #2F4C39;
  --chenu-ember: #7A593A;
  --chenu-slate: #1E1F22;
  --chenu-sand: #E9E4D6;
  
  /* UI Colors */
  --chenu-bg-deep: #16171A;
  --chenu-bg: #1E1F22;
  --chenu-surface: #2A2B2E;
  --chenu-surface-hover: #3A3B3E;
  --chenu-surface-elevated: #3A3B3E;
  --chenu-border: #3A3B3E;
  --chenu-border-subtle: #2A2B2E;
  
  /* Text */
  --chenu-text: #E9E4D6;
  --chenu-text-muted: #8D8371;
  
  /* Accents */
  --chenu-accent: #3EB4A2;
  --chenu-accent-subtle: rgba(62, 180, 162, 0.15);
  
  /* Semantic */
  --chenu-success: #3EB4A2;
  --chenu-success-subtle: rgba(62, 180, 162, 0.15);
  --chenu-warning: #D8B26A;
  --chenu-warning-subtle: rgba(217, 178, 106, 0.15);
  --chenu-error: #EF4444;
  --chenu-error-subtle: rgba(239, 68, 68, 0.15);
  --chenu-info: #3B82F6;
  --chenu-info-subtle: rgba(59, 130, 246, 0.15);
}
`;

// ═══════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const AppShell: React.FC<AppShellProps> = ({
  initialMode = 'DASHBOARD',
  initialSphere = 'personal',
  showMiniMap = true,
  showCommunicationBar = true,
}) => {
  const [state, setState] = useState<AppState>({
    mode: initialMode,
    sphereId: initialSphere,
    sphereName: 'Personnel',
    sphereColor: '#3EB4A2',
    unreadMessages: 3,
    unreadEmails: 12,
    upcomingMeetings: 2,
    activeAgents: 1,
  });

  // Inject CSS variables
  React.useEffect(() => {
    const styleId = 'chenu-css-variables';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = CSS_VARIABLES;
      document.head.appendChild(style);
    }
  }, []);

  const handleModeChange = useCallback((mode: NavigationMode) => {
    setState(prev => ({ ...prev, mode, bureauWindowId: undefined }));
  }, []);

  const handleNavigateToBureau = useCallback((windowId?: string) => {
    setState(prev => ({
      ...prev,
      mode: 'BUREAU',
      bureauWindowId: windowId as BureauWindowId,
    }));
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    setState(prev => ({ ...prev, mode: 'DASHBOARD' }));
  }, []);

  const handleOpenMessages = useCallback(() => {
    handleNavigateToBureau('MESSAGES');
  }, [handleNavigateToBureau]);

  const handleOpenEmail = useCallback(() => {
    handleNavigateToBureau('COURRIEL');
  }, [handleNavigateToBureau]);

  const handleOpenMeetings = useCallback(() => {
    // TODO: Open meetings modal or navigate
    logger.debug('[AppShell] Open meetings');
  }, []);

  const handleOpenAgents = useCallback(() => {
    handleNavigateToBureau('AGENTS_EXECUTION');
  }, [handleNavigateToBureau]);

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <NavigationBar
        currentMode={state.mode}
        sphereName={state.sphereName}
        onModeChange={handleModeChange}
        onOpenMessages={handleOpenMessages}
        onOpenEmail={handleOpenEmail}
        onOpenMeetings={handleOpenMeetings}
        onOpenAgents={handleOpenAgents}
      />

      {/* Clarification Banner */}
      <ClarificationBanner mode={state.mode} />

      {/* Main Content Area */}
      <div style={styles.content}>
        {/* Mini Map (optional) */}
        {showMiniMap && (
          <MiniMapView
            currentSphere={state.sphereName}
            currentMode={state.mode}
            sphereColor={state.sphereColor}
          />
        )}

        {/* Main Area: Dashboard or Bureau */}
        <div style={styles.mainArea}>
          {state.mode === 'DASHBOARD' ? (
            <CommandCenter
              sphereId={state.sphereId}
              sphereName={state.sphereName}
              onNavigateToBureau={handleNavigateToBureau}
            />
          ) : (
            <Workdesk
              sphereId={state.sphereId}
              sphereName={state.sphereName}
              initialWindowId={state.bureauWindowId}
              onNavigateToDashboard={handleNavigateToDashboard}
            />
          )}
        </div>
      </div>

      {/* Communication Bar */}
      {showCommunicationBar && (
        <CommunicationBar
          unreadMessages={state.unreadMessages}
          unreadEmails={state.unreadEmails}
          upcomingMeetings={state.upcomingMeetings}
          activeAgents={state.activeAgents}
          onOpenMessages={handleOpenMessages}
          onOpenEmail={handleOpenEmail}
          onOpenMeetings={handleOpenMeetings}
          onOpenAgents={handleOpenAgents}
        />
      )}
    </div>
  );
};

export default AppShell;
