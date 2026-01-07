/**
 * CHE·NU™ - 3-HUB ARCHITECTURE
 * 
 * CANONICAL STRUCTURE (NON-NEGOTIABLE):
 * 
 * A) Communication Hub - Chat, messages, notifications
 * B) Navigation Hub - Sphere navigation, search, quick access
 * C) Workspace Hub - The ONLY place where work happens
 * 
 * RULES:
 * - Only 3 hubs exist
 * - Max 2 hubs visible at once
 * - Nova always accessible
 * - No hidden execution in background
 * - Workspace is the only place where work happens
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { SphereId } from '../config/spheres.corrected.config';

// ═══════════════════════════════════════════════════════════════
// HUB TYPES
// ═══════════════════════════════════════════════════════════════

export type HubId = 'communication' | 'navigation' | 'workspace';

export interface Hub {
  id: HubId;
  name: string;
  icon: string;
  description: string;
  position: 'left' | 'center' | 'right';
  isAlwaysVisible: boolean;
}

export const HUBS: Record<HubId, Hub> = {
  communication: {
    id: 'communication',
    name: 'Communication Hub',
    icon: '💬',
    description: 'Chat with Nova, messages, notifications',
    position: 'left',
    isAlwaysVisible: false,
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation Hub',
    icon: '🧭',
    description: 'Sphere navigation, search, quick access',
    position: 'center',
    isAlwaysVisible: false,
  },
  workspace: {
    id: 'workspace',
    name: 'Workspace Hub',
    icon: '💼',
    description: 'The ONLY place where work happens',
    position: 'right',
    isAlwaysVisible: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// HUB STATE
// ═══════════════════════════════════════════════════════════════

interface HubState {
  // Currently visible hubs (max 2)
  visibleHubs: HubId[];
  
  // Primary (active) hub
  primaryHub: HubId;
  
  // Nova accessibility
  isNovaOpen: boolean;
  novaMinimized: boolean;
  
  // Workspace state
  workspaceMode: 'draft' | 'staging' | 'review' | 'version';
  workspaceLocked: boolean;
}

interface HubContextValue extends HubState {
  // Hub actions
  showHub: (hubId: HubId) => void;
  hideHub: (hubId: HubId) => void;
  setPrimaryHub: (hubId: HubId) => void;
  toggleHub: (hubId: HubId) => void;
  
  // Nova actions
  openNova: () => void;
  closeNova: () => void;
  toggleNova: () => void;
  minimizeNova: () => void;
  
  // Workspace actions
  setWorkspaceMode: (mode: HubState['workspaceMode']) => void;
  lockWorkspace: () => void;
  unlockWorkspace: () => void;
  
  // Validation
  canShowHub: (hubId: HubId) => boolean;
  getVisibleHubCount: () => number;
}

// ═══════════════════════════════════════════════════════════════
// HUB CONTEXT
// ═══════════════════════════════════════════════════════════════

const HubContext = createContext<HubContextValue | null>(null);

export const useHubs = () => {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error('useHubs must be used within HubProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════
// HUB PROVIDER
// ═══════════════════════════════════════════════════════════════

interface HubProviderProps {
  children: React.ReactNode;
  initialPrimaryHub?: HubId;
}

export const HubProvider: React.FC<HubProviderProps> = ({ 
  children, 
  initialPrimaryHub = 'workspace' 
}) => {
  const [state, setState] = useState<HubState>({
    visibleHubs: ['workspace'], // Workspace always visible
    primaryHub: initialPrimaryHub,
    isNovaOpen: false,
    novaMinimized: false,
    workspaceMode: 'draft',
    workspaceLocked: false,
  });

  // ─────────────────────────────────────────────────────────────
  // Hub Visibility - MAX 2 HUBS VISIBLE AT ONCE
  // ─────────────────────────────────────────────────────────────
  const canShowHub = useCallback((hubId: HubId): boolean => {
    // Workspace is always allowed
    if (hubId === 'workspace') return true;
    
    // Check if already visible
    if (state.visibleHubs.includes(hubId)) return true;
    
    // Max 2 hubs
    if (state.visibleHubs.length >= 2) {
      // Can replace non-workspace hub
      return state.visibleHubs.some((h) => h !== 'workspace');
    }
    
    return true;
  }, [state.visibleHubs]);

  const showHub = useCallback((hubId: HubId) => {
    setState((prev) => {
      if (prev.visibleHubs.includes(hubId)) {
        return prev; // Already visible
      }
      
      if (prev.visibleHubs.length >= 2) {
        // Replace the non-workspace hub
        const newVisible = prev.visibleHubs
          .filter((h) => h === 'workspace')
          .concat(hubId);
        return { ...prev, visibleHubs: newVisible };
      }
      
      return { ...prev, visibleHubs: [...prev.visibleHubs, hubId] };
    });
  }, []);

  const hideHub = useCallback((hubId: HubId) => {
    // Cannot hide workspace
    if (hubId === 'workspace') return;
    
    setState((prev) => ({
      ...prev,
      visibleHubs: prev.visibleHubs.filter((h) => h !== hubId),
      primaryHub: prev.primaryHub === hubId ? 'workspace' : prev.primaryHub,
    }));
  }, []);

  const toggleHub = useCallback((hubId: HubId) => {
    if (state.visibleHubs.includes(hubId)) {
      hideHub(hubId);
    } else {
      showHub(hubId);
    }
  }, [state.visibleHubs, showHub, hideHub]);

  const setPrimaryHub = useCallback((hubId: HubId) => {
    setState((prev) => {
      if (!prev.visibleHubs.includes(hubId)) {
        // Show the hub first
        return {
          ...prev,
          visibleHubs: prev.visibleHubs.length >= 2
            ? [hubId, 'workspace']
            : [...prev.visibleHubs, hubId],
          primaryHub: hubId,
        };
      }
      return { ...prev, primaryHub: hubId };
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Nova - ALWAYS ACCESSIBLE
  // ─────────────────────────────────────────────────────────────
  const openNova = useCallback(() => {
    setState((prev) => ({ ...prev, isNovaOpen: true, novaMinimized: false }));
  }, []);

  const closeNova = useCallback(() => {
    setState((prev) => ({ ...prev, isNovaOpen: false }));
  }, []);

  const toggleNova = useCallback(() => {
    setState((prev) => ({ 
      ...prev, 
      isNovaOpen: !prev.isNovaOpen,
      novaMinimized: false,
    }));
  }, []);

  const minimizeNova = useCallback(() => {
    setState((prev) => ({ ...prev, novaMinimized: true }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Workspace - ONLY PLACE WHERE WORK HAPPENS
  // ─────────────────────────────────────────────────────────────
  const setWorkspaceMode = useCallback((mode: HubState['workspaceMode']) => {
    setState((prev) => ({ ...prev, workspaceMode: mode }));
  }, []);

  const lockWorkspace = useCallback(() => {
    setState((prev) => ({ ...prev, workspaceLocked: true }));
  }, []);

  const unlockWorkspace = useCallback(() => {
    setState((prev) => ({ ...prev, workspaceLocked: false }));
  }, []);

  const getVisibleHubCount = useCallback(() => {
    return state.visibleHubs.length;
  }, [state.visibleHubs]);

  // ─────────────────────────────────────────────────────────────
  // Context Value
  // ─────────────────────────────────────────────────────────────
  const value: HubContextValue = {
    ...state,
    showHub,
    hideHub,
    setPrimaryHub,
    toggleHub,
    openNova,
    closeNova,
    toggleNova,
    minimizeNova,
    setWorkspaceMode,
    lockWorkspace,
    unlockWorkspace,
    canShowHub,
    getVisibleHubCount,
  };

  return (
    <HubContext.Provider value={value}>
      {children}
    </HubContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUB COMPONENTS
// ═══════════════════════════════════════════════════════════════

interface HubContainerProps {
  hubId: HubId;
  children: React.ReactNode;
}

export const HubContainer: React.FC<HubContainerProps> = ({ hubId, children }) => {
  const { visibleHubs, primaryHub } = useHubs();
  const hub = HUBS[hubId];
  
  if (!visibleHubs.includes(hubId)) return null;
  
  const isPrimary = primaryHub === hubId;
  
  return (
    <div 
      className={`hub-container hub-${hubId} ${isPrimary ? 'hub-primary' : 'hub-secondary'}`}
      data-hub={hubId}
      data-position={hub.position}
    >
      <div className="hub-header">
        <span className="hub-icon">{hub.icon}</span>
        <span className="hub-name">{hub.name}</span>
      </div>
      <div className="hub-content">
        {children}
      </div>
      
      <style>{`
        .hub-container {
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          border: 1px solid #222;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .hub-primary {
          flex: 2;
        }
        
        .hub-secondary {
          flex: 1;
        }
        
        .hub-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #111;
          border-bottom: 1px solid #222;
        }
        
        .hub-icon {
          font-size: 16px;
        }
        
        .hub-name {
          font-size: 13px;
          font-weight: 600;
          color: #888;
        }
        
        .hub-content {
          flex: 1;
          overflow: auto;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NOVA BUTTON - Always Accessible
// ═══════════════════════════════════════════════════════════════

export const NovaAccessButton: React.FC = () => {
  const { isNovaOpen, novaMinimized, toggleNova, openNova } = useHubs();
  
  if (isNovaOpen && !novaMinimized) return null;
  
  return (
    <button className="nova-access-button" onClick={openNova}>
      <span className="nova-icon">✧</span>
      <span className="nova-label">Nova</span>
      {novaMinimized && <span className="nova-badge">1</span>}
      
      <style>{`
        .nova-access-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 50px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(216, 178, 106, 0.3);
          transition: all 0.2s;
          z-index: 1000;
        }
        
        .nova-access-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(216, 178, 106, 0.4);
        }
        
        .nova-icon {
          font-size: 18px;
        }
        
        .nova-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #e74c3c;
          border-radius: 50%;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUB LAYOUT - Main Layout Component
// ═══════════════════════════════════════════════════════════════

interface HubLayoutProps {
  communicationContent?: React.ReactNode;
  navigationContent?: React.ReactNode;
  workspaceContent: React.ReactNode;
}

export const HubLayout: React.FC<HubLayoutProps> = ({
  communicationContent,
  navigationContent,
  workspaceContent,
}) => {
  const { visibleHubs } = useHubs();
  
  return (
    <div className="hub-layout">
      {visibleHubs.includes('communication') && communicationContent && (
        <HubContainer hubId="communication">
          {communicationContent}
        </HubContainer>
      )}
      
      {visibleHubs.includes('navigation') && navigationContent && (
        <HubContainer hubId="navigation">
          {navigationContent}
        </HubContainer>
      )}
      
      <HubContainer hubId="workspace">
        {workspaceContent}
      </HubContainer>
      
      <NovaAccessButton />
      
      <style>{`
        .hub-layout {
          display: flex;
          gap: 16px;
          height: 100vh;
          padding: 16px;
          background: #0a0a0a;
        }
      `}</style>
    </div>
  );
};

export default HubProvider;
