/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — SPHERE PROVIDER                             ║
 * ║                    Contexte de la sphère et section actives                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SPHERES, BUREAU_SECTIONS, SphereId, BureauSectionId } from '../constants/CANON';
import { logger } from '../utils/logger';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Sphere {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  icon: string;
  description: string;
}

export interface SphereContextType {
  // Current state
  currentSphere: Sphere | null;
  currentSection: BureauSection | null;
  
  // All spheres and sections
  spheres: Sphere[];
  sections: BureauSection[];
  
  // Navigation
  navigateToSphere: (sphereId: SphereId) => void;
  navigateToSection: (sectionId: BureauSectionId) => void;
  navigateTo: (sphereId: SphereId, sectionId: BureauSectionId) => void;
  
  // Helpers
  isValidSphere: (id: string) => boolean;
  isValidSection: (id: string) => boolean;
  getSphereById: (id: string) => Sphere | undefined;
  getSectionById: (id: string) => BureauSection | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const SphereContext = createContext<SphereContextType | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereProviderProps {
  children: ReactNode;
}

export function SphereProvider({ children }: SphereProviderProps) {
  const params = useParams<{ sphere?: string; section?: string }>();
  const navigate = useNavigate();
  
  // Convert CANON spheres to array
  const spheres: Sphere[] = Object.values(SPHERES);
  const sections: BureauSection[] = Object.values(BUREAU_SECTIONS);
  
  // Current sphere and section from URL
  const [currentSphere, setCurrentSphere] = useState<Sphere | null>(null);
  const [currentSection, setCurrentSection] = useState<BureauSection | null>(null);
  
  // Helpers
  const isValidSphere = useCallback((id: string): boolean => {
    return Object.keys(SPHERES).includes(id);
  }, []);
  
  const isValidSection = useCallback((id: string): boolean => {
    return Object.keys(BUREAU_SECTIONS).includes(id);
  }, []);
  
  const getSphereById = useCallback((id: string): Sphere | undefined => {
    return spheres.find(s => s.id === id);
  }, [spheres]);
  
  const getSectionById = useCallback((id: string): BureauSection | undefined => {
    return sections.find(s => s.id === id);
  }, [sections]);
  
  // Update state from URL params
  useEffect(() => {
    if (params.sphere) {
      const sphere = getSphereById(params.sphere);
      if (sphere) {
        setCurrentSphere(sphere);
        logger.nav('Sphere changed', { sphere: sphere.id });
      } else {
        logger.warn('Invalid sphere in URL', { sphere: params.sphere });
        // Redirect to default
        navigate('/personal/quickcapture', { replace: true });
      }
    }
    
    if (params.section) {
      const section = getSectionById(params.section);
      if (section) {
        setCurrentSection(section);
        logger.nav('Section changed', { section: section.id });
      } else {
        logger.warn('Invalid section in URL', { section: params.section });
        // Redirect to default section
        if (params.sphere && isValidSphere(params.sphere)) {
          navigate(`/${params.sphere}/quickcapture`, { replace: true });
        }
      }
    } else if (params.sphere && isValidSphere(params.sphere)) {
      // No section in URL, default to quickcapture
      setCurrentSection(BUREAU_SECTIONS.quickcapture);
    }
  }, [params.sphere, params.section, getSphereById, getSectionById, isValidSphere, navigate]);
  
  // Navigation functions
  const navigateToSphere = useCallback((sphereId: SphereId) => {
    if (!isValidSphere(sphereId)) {
      logger.error('Invalid sphere ID', { sphereId });
      return;
    }
    
    const sectionId = currentSection?.id || 'quickcapture';
    navigate(`/${sphereId}/${sectionId}`);
  }, [currentSection, isValidSphere, navigate]);
  
  const navigateToSection = useCallback((sectionId: BureauSectionId) => {
    if (!isValidSection(sectionId)) {
      logger.error('Invalid section ID', { sectionId });
      return;
    }
    
    const sphereId = currentSphere?.id || 'personal';
    navigate(`/${sphereId}/${sectionId}`);
  }, [currentSphere, isValidSection, navigate]);
  
  const navigateTo = useCallback((sphereId: SphereId, sectionId: BureauSectionId) => {
    if (!isValidSphere(sphereId) || !isValidSection(sectionId)) {
      logger.error('Invalid navigation params', { sphereId, sectionId });
      return;
    }
    
    navigate(`/${sphereId}/${sectionId}`);
  }, [isValidSphere, isValidSection, navigate]);
  
  const value: SphereContextType = {
    currentSphere,
    currentSection,
    spheres,
    sections,
    navigateToSphere,
    navigateToSection,
    navigateTo,
    isValidSphere,
    isValidSection,
    getSphereById,
    getSectionById,
  };
  
  return (
    <SphereContext.Provider value={value}>
      {children}
    </SphereContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useSphere(): SphereContextType {
  const context = useContext(SphereContext);
  if (!context) {
    throw new Error('useSphere must be used within a SphereProvider');
  }
  return context;
}

// Convenience hooks
export function useCurrentSphere(): Sphere | null {
  const { currentSphere } = useSphere();
  return currentSphere;
}

export function useCurrentSection(): BureauSection | null {
  const { currentSection } = useSphere();
  return currentSection;
}

export function useSphereNavigation() {
  const { navigateToSphere, navigateToSection, navigateTo } = useSphere();
  return { navigateToSphere, navigateToSection, navigateTo };
}

export default SphereProvider;
