/**
 * CHE·NU™ - SPHERE CONTEXT
 * Global state management for active sphere and bureau section
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  SphereId, 
  BureauSectionId, 
  Sphere, 
  BureauSection,
  SPHERES,
  BUREAU_SECTIONS,
  DEFAULT_SPHERE,
  DEFAULT_SECTION,
  getSphereById,
  getBureauSectionById
} from '../constants/spheres';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface SphereContextState {
  // Current active sphere
  activeSphere: Sphere;
  activeSphereId: SphereId;
  
  // Current active bureau section
  activeSection: BureauSection;
  activeSectionId: BureauSectionId;
  
  // Navigation functions
  setSphere: (sphereId: SphereId) => void;
  setSection: (sectionId: BureauSectionId) => void;
  navigateTo: (sphereId: SphereId, sectionId?: BureauSectionId) => void;
  
  // All spheres and sections
  spheres: Sphere[];
  sections: BureauSection[];
  
  // History
  previousSphere: SphereId | null;
  goBack: () => void;
  
  // UI state
  isSphereMenuOpen: boolean;
  setSphereMenuOpen: (open: boolean) => void;
  toggleSphereMenu: () => void;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const SphereContext = createContext<SphereContextState | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════

interface SphereProviderProps {
  children: ReactNode;
  initialSphere?: SphereId;
  initialSection?: BureauSectionId;
}

export const SphereProvider: React.FC<SphereProviderProps> = ({
  children,
  initialSphere = DEFAULT_SPHERE,
  initialSection = DEFAULT_SECTION
}) => {
  // State
  const [activeSphereId, setActiveSphereId] = useState<SphereId>(initialSphere);
  const [activeSectionId, setActiveSectionId] = useState<BureauSectionId>(initialSection);
  const [previousSphere, setPreviousSphere] = useState<SphereId | null>(null);
  const [isSphereMenuOpen, setSphereMenuOpen] = useState(false);
  
  // Derived state
  const activeSphere = getSphereById(activeSphereId);
  const activeSection = getBureauSectionById(activeSectionId);
  const spheres = Object.values(SPHERES);
  const sections = Object.values(BUREAU_SECTIONS);
  
  // Navigation functions
  const setSphere = useCallback((sphereId: SphereId) => {
    setPreviousSphere(activeSphereId);
    setActiveSphereId(sphereId);
    // Reset to dashboard when changing sphere
    setActiveSectionId('dashboard');
    setSphereMenuOpen(false);
    
    // Update URL
    window.history.pushState({}, '', `/${sphereId}/dashboard`);
  }, [activeSphereId]);
  
  const setSection = useCallback((sectionId: BureauSectionId) => {
    setActiveSectionId(sectionId);
    
    // Update URL
    window.history.pushState({}, '', `/${activeSphereId}/${sectionId}`);
  }, [activeSphereId]);
  
  const navigateTo = useCallback((sphereId: SphereId, sectionId: BureauSectionId = 'dashboard') => {
    if (sphereId !== activeSphereId) {
      setPreviousSphere(activeSphereId);
    }
    setActiveSphereId(sphereId);
    setActiveSectionId(sectionId);
    setSphereMenuOpen(false);
    
    // Update URL
    window.history.pushState({}, '', `/${sphereId}/${sectionId}`);
  }, [activeSphereId]);
  
  const goBack = useCallback(() => {
    if (previousSphere) {
      setActiveSphereId(previousSphere);
      setPreviousSphere(null);
      setActiveSectionId('dashboard');
    }
  }, [previousSphere]);
  
  const toggleSphereMenu = useCallback(() => {
    setSphereMenuOpen(prev => !prev);
  }, []);
  
  // Parse URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    if (parts.length >= 1) {
      const sphereId = parts[0] as SphereId;
      if (SPHERES[sphereId]) {
        setActiveSphereId(sphereId);
      }
    }
    
    if (parts.length >= 2) {
      const sectionId = parts[1] as BureauSectionId;
      if (BUREAU_SECTIONS[sectionId]) {
        setActiveSectionId(sectionId);
      }
    }
  }, []);
  
  // Listen for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      
      if (parts.length >= 1) {
        const sphereId = parts[0] as SphereId;
        if (SPHERES[sphereId]) {
          setActiveSphereId(sphereId);
        }
      }
      
      if (parts.length >= 2) {
        const sectionId = parts[1] as BureauSectionId;
        if (BUREAU_SECTIONS[sectionId]) {
          setActiveSectionId(sectionId);
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Context value
  const value: SphereContextState = {
    activeSphere,
    activeSphereId,
    activeSection,
    activeSectionId,
    setSphere,
    setSection,
    navigateTo,
    spheres,
    sections,
    previousSphere,
    goBack,
    isSphereMenuOpen,
    setSphereMenuOpen,
    toggleSphereMenu
  };
  
  return (
    <SphereContext.Provider value={value}>
      {children}
    </SphereContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export const useSphere = (): SphereContextState => {
  const context = useContext(SphereContext);
  if (!context) {
    throw new Error('useSphere must be used within a SphereProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL HOOKS
// ═══════════════════════════════════════════════════════════════

export const useActiveSphere = () => {
  const { activeSphere, activeSphereId } = useSphere();
  return { sphere: activeSphere, id: activeSphereId };
};

export const useActiveSection = () => {
  const { activeSection, activeSectionId } = useSphere();
  return { section: activeSection, id: activeSectionId };
};

export const useSphereNavigation = () => {
  const { setSphere, setSection, navigateTo, goBack } = useSphere();
  return { setSphere, setSection, navigateTo, goBack };
};

export default SphereContext;
