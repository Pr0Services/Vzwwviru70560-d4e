/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NAVIGATION CONTEXT & HOOKS                      ║
 * ║                    Système de Navigation React                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Context et hooks React pour la navigation CHE·NU
 * 
 * @version 51.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import {
  SphereId,
  BureauSectionId,
  ViewType,
  NavigationState,
  getSphereConfig,
  getSectionConfig,
  isValidSphereId,
  isValidSectionId,
} from '../types/spheres.types';
import {
  NavigationAction,
  NavigationParams,
  RouteConfig,
  Breadcrumb,
  navigationReducer,
  initialNavigationState,
  resolveRoute,
  generatePath,
  isValidNavigation,
  getNavigationPath,
  areSpheresConnected,
  findSpherePath,
  ALL_ROUTES,
  SPHERE_CONNECTIONS,
} from './router';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NavigationContextValue {
  // State
  state: NavigationState;
  currentRoute: RouteConfig | null;
  breadcrumbs: Breadcrumb[];
  
  // Navigation functions
  navigateToUniverse: () => void;
  navigateToMap: () => void;
  navigateToSphere: (sphereId: SphereId) => boolean;
  navigateToSection: (sphereId: SphereId, sectionId: BureauSectionId) => boolean;
  openNova: () => void;
  closeNova: () => void;
  goBack: () => void;
  
  // Utility functions
  canNavigateTo: (params: NavigationParams) => boolean;
  getPathToSphere: (sphereId: SphereId) => SphereId[];
  isCurrentSphere: (sphereId: SphereId) => boolean;
  isCurrentSection: (sectionId: BureauSectionId) => boolean;
  
  // Nova state
  isNovaOpen: boolean;
  toggleNova: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const NavigationContext = createContext<NavigationContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface NavigationProviderProps {
  children: React.ReactNode;
  initialPath?: string;
  onNavigate?: (params: NavigationParams) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialPath = '/',
  onNavigate,
}) => {
  // Parse initial route
  const initialRoute = useMemo(() => {
    const route = resolveRoute(initialPath);
    if (!route) return initialNavigationState;
    
    return {
      ...initialNavigationState,
      currentView: route.view,
      activeSphere: route.sphere ?? null,
      activeSection: route.section ?? null,
    };
  }, [initialPath]);

  const [state, dispatch] = useReducer(navigationReducer, initialRoute);
  const [isNovaOpen, setIsNovaOpen] = React.useState(false);

  // Current route
  const currentRoute = useMemo(() => {
    const path = generatePath({
      view: state.currentView,
      sphere: state.activeSphere ?? undefined,
      section: state.activeSection ?? undefined,
    });
    return resolveRoute(path);
  }, [state.currentView, state.activeSphere, state.activeSection]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    return currentRoute?.breadcrumbs ?? [];
  }, [currentRoute]);

  // Navigation effect - sync with URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = generatePath({
        view: state.currentView,
        sphere: state.activeSphere ?? undefined,
        section: state.activeSection ?? undefined,
      });
      
      // Update URL without page reload
      window.history.pushState(null, '', path);
    }
  }, [state.currentView, state.activeSphere, state.activeSection]);

  // Navigation callbacks
  const navigateToUniverse = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_UNIVERSE' });
    onNavigate?.({ view: 'universe' });
  }, [onNavigate]);

  const navigateToMap = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_MAP' });
    onNavigate?.({ view: 'map' });
  }, [onNavigate]);

  const navigateToSphere = useCallback((sphereId: SphereId): boolean => {
    if (!isValidSphereId(sphereId)) {
      logger.warn(`Invalid sphere ID: ${sphereId}`);
      return false;
    }

    dispatch({ type: 'NAVIGATE_TO_SPHERE', payload: sphereId });
    onNavigate?.({ view: 'sphere', sphere: sphereId });
    return true;
  }, [onNavigate]);

  const navigateToSection = useCallback((sphereId: SphereId, sectionId: BureauSectionId): boolean => {
    if (!isValidSphereId(sphereId)) {
      logger.warn(`Invalid sphere ID: ${sphereId}`);
      return false;
    }
    if (!isValidSectionId(sectionId)) {
      logger.warn(`Invalid section ID: ${sectionId}`);
      return false;
    }

    dispatch({ 
      type: 'NAVIGATE_TO_SECTION', 
      payload: { sphere: sphereId, section: sectionId } 
    });
    onNavigate?.({ view: 'section', sphere: sphereId, section: sectionId });
    return true;
  }, [onNavigate]);

  const openNova = useCallback(() => {
    setIsNovaOpen(true);
    dispatch({ type: 'OPEN_NOVA' });
  }, []);

  const closeNova = useCallback(() => {
    setIsNovaOpen(false);
    dispatch({ type: 'CLOSE_NOVA' });
  }, []);

  const toggleNova = useCallback(() => {
    if (isNovaOpen) {
      closeNova();
    } else {
      openNova();
    }
  }, [isNovaOpen, openNova, closeNova]);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  // Utility functions
  const canNavigateTo = useCallback((params: NavigationParams): boolean => {
    return isValidNavigation(
      { 
        view: state.currentView, 
        sphere: state.activeSphere ?? undefined,
        section: state.activeSection ?? undefined,
      },
      params
    );
  }, [state]);

  const getPathToSphere = useCallback((sphereId: SphereId): SphereId[] => {
    if (!state.activeSphere) return [sphereId];
    return findSpherePath(state.activeSphere, sphereId);
  }, [state.activeSphere]);

  const isCurrentSphere = useCallback((sphereId: SphereId): boolean => {
    return state.activeSphere === sphereId;
  }, [state.activeSphere]);

  const isCurrentSection = useCallback((sectionId: BureauSectionId): boolean => {
    return state.activeSection === sectionId;
  }, [state.activeSection]);

  // Context value
  const value = useMemo<NavigationContextValue>(() => ({
    state,
    currentRoute,
    breadcrumbs,
    navigateToUniverse,
    navigateToMap,
    navigateToSphere,
    navigateToSection,
    openNova,
    closeNova,
    goBack,
    canNavigateTo,
    getPathToSphere,
    isCurrentSphere,
    isCurrentSection,
    isNovaOpen,
    toggleNova,
  }), [
    state,
    currentRoute,
    breadcrumbs,
    navigateToUniverse,
    navigateToMap,
    navigateToSphere,
    navigateToSection,
    openNova,
    closeNova,
    goBack,
    canNavigateTo,
    getPathToSphere,
    isCurrentSphere,
    isCurrentSection,
    isNovaOpen,
    toggleNova,
  ]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook principal de navigation
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

/**
 * Hook pour la sphère active
 */
export function useActiveSphere() {
  const { state } = useNavigation();
  
  const sphereConfig = useMemo(() => {
    if (!state.activeSphere) return null;
    return getSphereConfig(state.activeSphere);
  }, [state.activeSphere]);

  return {
    sphereId: state.activeSphere,
    sphereConfig,
    isInSphere: state.activeSphere !== null,
  };
}

/**
 * Hook pour la section active
 */
export function useActiveSection() {
  const { state } = useNavigation();
  
  const sectionConfig = useMemo(() => {
    if (!state.activeSection) return null;
    return getSectionConfig(state.activeSection);
  }, [state.activeSection]);

  return {
    sectionId: state.activeSection,
    sectionConfig,
    isInSection: state.activeSection !== null,
  };
}

/**
 * Hook pour les breadcrumbs
 */
export function useBreadcrumbs() {
  const { breadcrumbs } = useNavigation();
  return breadcrumbs;
}

/**
 * Hook pour Nova
 */
export function useNova() {
  const { isNovaOpen, openNova, closeNova, toggleNova } = useNavigation();
  
  return {
    isOpen: isNovaOpen,
    open: openNova,
    close: closeNova,
    toggle: toggleNova,
  };
}

/**
 * Hook pour naviguer vers une sphère spécifique
 */
export function useSphereNavigation(sphereId: SphereId) {
  const { navigateToSphere, navigateToSection, isCurrentSphere, getPathToSphere } = useNavigation();
  
  const navigate = useCallback(() => {
    navigateToSphere(sphereId);
  }, [navigateToSphere, sphereId]);

  const navigateToSphereSection = useCallback((sectionId: BureauSectionId) => {
    navigateToSection(sphereId, sectionId);
  }, [navigateToSection, sphereId]);

  const isActive = isCurrentSphere(sphereId);
  const sphereConfig = getSphereConfig(sphereId);
  const pathFromCurrent = getPathToSphere(sphereId);

  return {
    navigate,
    navigateToSection: navigateToSphereSection,
    isActive,
    config: sphereConfig,
    pathFromCurrent,
  };
}

/**
 * Hook pour les connexions inter-sphères
 */
export function useSphereConnections(sphereId: SphereId) {
  const connections = useMemo(() => {
    return SPHERE_CONNECTIONS[sphereId] || [];
  }, [sphereId]);

  const isConnectedTo = useCallback((otherSphereId: SphereId) => {
    return areSpheresConnected(sphereId, otherSphereId);
  }, [sphereId]);

  return {
    connections,
    isConnectedTo,
    connectionCount: connections.length,
  };
}

/**
 * Hook pour l'historique de navigation
 */
export function useNavigationHistory() {
  const { state, goBack } = useNavigation();
  
  return {
    history: state.history,
    canGoBack: state.history.length > 1,
    goBack,
    previousView: state.previousView,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  NavigationContext,
  type NavigationContextValue,
  type NavigationProviderProps,
};

export default NavigationProvider;
