// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — SPHERE PROVIDER
// Context provider pour la navigation entre sphères
// DELTA APRÈS v38.2
// ═══════════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team';

export type BureauSectionId = 
  | 'quick_capture'
  | 'resume_workspace'
  | 'threads'
  | 'data_files'
  | 'active_agents'
  | 'meetings';

export interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  unlocked: boolean;
}

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS — 8 SPHERES (FROZEN)
// ═══════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereId, Sphere> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    color: '#D8B26A', // Sacred Gold
    description: 'Your personal space for life management',
    unlocked: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Entreprise',
    icon: '💼',
    color: '#3F7249', // Jungle Emerald
    description: 'Professional and business operations',
    unlocked: true,
  },
  government: {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: '#8D8371', // Ancient Stone
    description: 'Administrative and institutional matters',
    unlocked: true,
  },
  studio: {
    id: 'design_studio',
    name: 'Studio de création',
    nameFr: 'Studio de création',
    icon: '🎨',
    color: '#7A593A', // Earth Ember
    description: 'Creative projects and design work',
    unlocked: true,
  },
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    color: '#2F4C39', // Shadow Moss
    description: 'Community engagement and collaboration',
    unlocked: true,
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Médias',
    icon: '📱',
    color: '#3EB4A2', // Cenote Turquoise
    description: 'Social media and content management',
    unlocked: true,
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    color: '#D8B26A', // Sacred Gold
    description: 'Entertainment and leisure activities',
    unlocked: true,
  },
  myteam: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    color: '#3F7249', // Jungle Emerald
    description: 'Team management and collaboration (includes IA Labs & Skills)',
    unlocked: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// CONSTANTS — 6 BUREAU SECTIONS (HARD LIMIT)
// ═══════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: BureauSection[] = [
  {
    id: 'quick_capture',
    name: 'Quick Capture',
    nameFr: 'Capture Rapide',
    icon: '📝',
    description: 'Quick notes, voice memos, instant capture',
  },
  {
    id: 'resume_workspace',
    name: 'Resume Work',
    nameFr: 'Reprendre le Travail',
    icon: '▶️',
    description: 'Continue where you left off',
  },
  {
    id: 'threads',
    name: 'Threads',
    nameFr: 'Fils de Discussion',
    icon: '💬',
    description: 'Persistent conversation threads (.chenu)',
  },
  {
    id: 'data_files',
    name: 'Data/Files',
    nameFr: 'Données/Fichiers',
    icon: '📁',
    description: 'DataSpaces and file management',
  },
  {
    id: 'active_agents',
    name: 'Active Agents',
    nameFr: 'Agents Actifs',
    icon: '🤖',
    description: 'Currently active AI agents',
  },
  {
    id: 'meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Meeting scheduling and management',
  },
];

// ═══════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════

const DEFAULT_SPHERE: SphereId = 'personal';
const DEFAULT_SECTION: BureauSectionId = 'quick_capture';

// ═══════════════════════════════════════════════════════════════
// STATE INTERFACE
// ═══════════════════════════════════════════════════════════════

interface SphereState {
  activeSphere: SphereId;
  activeSection: BureauSectionId;
  previousSphere: SphereId | null;
  previousSection: BureauSectionId | null;
  isTransitioning: boolean;
}

interface SphereContextValue extends SphereState {
  setSphere: (sphereId: SphereId) => void;
  setSection: (sectionId: BureauSectionId) => void;
  navigateTo: (sphereId: SphereId, sectionId?: BureauSectionId) => void;
  goBack: () => void;
  getCurrentSphere: () => Sphere;
  getSphereColor: (sphereId: SphereId) => string;
  getBreadcrumb: () => string;
  isInSphere: (sphereId: SphereId) => boolean;
  isInSection: (sectionId: BureauSectionId) => boolean;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const SphereContext = createContext<SphereContextValue | null>(null);

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
  initialSection = DEFAULT_SECTION,
}) => {
  const [state, setState] = useState<SphereState>({
    activeSphere: initialSphere,
    activeSection: initialSection,
    previousSphere: null,
    previousSection: null,
    isTransitioning: false,
  });

  // ─────────────────────────────────────────────────────────────
  // Navigation Functions
  // ─────────────────────────────────────────────────────────────

  const setSphere = useCallback((sphereId: SphereId) => {
    setState((prev) => {
      if (prev.activeSphere === sphereId) return prev;
      
      return {
        ...prev,
        previousSphere: prev.activeSphere,
        previousSection: prev.activeSection,
        activeSphere: sphereId,
        activeSection: DEFAULT_SECTION, // Reset to first section on sphere change
        isTransitioning: true,
      };
    });
    
    // End transition after animation
    setTimeout(() => {
      setState((prev) => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  const setSection = useCallback((sectionId: BureauSectionId) => {
    setState((prev) => {
      if (prev.activeSection === sectionId) return prev;
      
      return {
        ...prev,
        previousSection: prev.activeSection,
        activeSection: sectionId,
      };
    });
  }, []);

  const navigateTo = useCallback((sphereId: SphereId, sectionId?: BureauSectionId) => {
    setState((prev) => ({
      ...prev,
      previousSphere: prev.activeSphere,
      previousSection: prev.activeSection,
      activeSphere: sphereId,
      activeSection: sectionId || DEFAULT_SECTION,
      isTransitioning: true,
    }));
    
    setTimeout(() => {
      setState((prev) => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (!prev.previousSphere) return prev;
      
      return {
        ...prev,
        activeSphere: prev.previousSphere,
        activeSection: prev.previousSection || DEFAULT_SECTION,
        previousSphere: null,
        previousSection: null,
        isTransitioning: true,
      };
    });
    
    setTimeout(() => {
      setState((prev) => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Helper Functions
  // ─────────────────────────────────────────────────────────────

  const getCurrentSphere = useCallback((): Sphere => {
    return SPHERES[state.activeSphere];
  }, [state.activeSphere]);

  const getSphereColor = useCallback((sphereId: SphereId): string => {
    return SPHERES[sphereId]?.color || '#D8B26A';
  }, []);

  const getBreadcrumb = useCallback((): string => {
    const sphere = SPHERES[state.activeSphere];
    const section = BUREAU_SECTIONS.find(s => s.id === state.activeSection);
    return `${sphere.name} > ${section?.name || 'Unknown'}`;
  }, [state.activeSphere, state.activeSection]);

  const isInSphere = useCallback((sphereId: SphereId): boolean => {
    return state.activeSphere === sphereId;
  }, [state.activeSphere]);

  const isInSection = useCallback((sectionId: BureauSectionId): boolean => {
    return state.activeSection === sectionId;
  }, [state.activeSection]);

  // ─────────────────────────────────────────────────────────────
  // URL Sync (optional)
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const path = `/${state.activeSphere}/${state.activeSection}`;
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', path);
    }
  }, [state.activeSphere, state.activeSection]);

  // ─────────────────────────────────────────────────────────────
  // Context Value
  // ─────────────────────────────────────────────────────────────

  const value: SphereContextValue = {
    ...state,
    setSphere,
    setSection,
    navigateTo,
    goBack,
    getCurrentSphere,
    getSphereColor,
    getBreadcrumb,
    isInSphere,
    isInSection,
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

export const useSphere = (): SphereContextValue => {
  const context = useContext(SphereContext);
  if (!context) {
    throw new Error('useSphere must be used within a SphereProvider');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════

export const useActiveSphere = () => {
  const { activeSphere, getCurrentSphere } = useSphere();
  return { sphereId: activeSphere, sphere: getCurrentSphere() };
};

export const useActiveSection = () => {
  const { activeSection } = useSphere();
  const section = BUREAU_SECTIONS.find((s) => s.id === activeSection);
  return { sectionId: activeSection, section };
};

export default SphereProvider;
