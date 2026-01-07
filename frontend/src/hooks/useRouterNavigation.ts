/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — ROUTER NAVIGATION HOOK                          ║
 * ║                    Synchronise FloatingMinimap ↔ React Router                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce hook connecte la navigation de la minimap au système de routing React.
 * - Lecture de la sphère active depuis l'URL
 * - Navigation vers les routes des sphères
 * - Synchronisation bidirectionnelle
 */

import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'team' 
  | 'scholar';

export type BureauSection = 
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'projects'
  | 'threads'
  | 'meetings';

interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  emoji: string;
  color: string;
  colorGlow: string;
  path: string;
  angle: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES — 9 SPHÈRES (ARCHITECTURE GELÉE)
// ═══════════════════════════════════════════════════════════════════════════════

export const SPHERES: Sphere[] = [
  { 
    id: 'personal', 
    name: 'Personal', 
    nameFr: 'Personnel', 
    emoji: '🏠', 
    color: '#3EB4A2', 
    colorGlow: 'rgba(62, 180, 162, 0.6)', 
    path: '/personal',
    angle: 0 
  },
  { 
    id: 'business', 
    name: 'Business', 
    nameFr: 'Affaires', 
    emoji: '💼', 
    color: '#D8B26A', 
    colorGlow: 'rgba(216, 178, 106, 0.6)', 
    path: '/business',
    angle: 40 
  },
  { 
    id: 'government', 
    name: 'Government', 
    nameFr: 'Gouvernement', 
    emoji: '🏛️', 
    color: '#8D8371', 
    colorGlow: 'rgba(141, 131, 113, 0.6)', 
    path: '/government',
    angle: 80 
  },
  { 
    id: 'studio', 
    name: 'Creative Studio', 
    nameFr: 'Studio Créatif', 
    emoji: '🎨', 
    color: '#E07B53', 
    colorGlow: 'rgba(224, 123, 83, 0.6)', 
    path: '/studio',
    angle: 120 
  },
  { 
    id: 'community', 
    name: 'Community', 
    nameFr: 'Communauté', 
    emoji: '👥', 
    color: '#3F7249', 
    colorGlow: 'rgba(63, 114, 73, 0.6)', 
    path: '/community',
    angle: 160 
  },
  { 
    id: 'social', 
    name: 'Social & Media', 
    nameFr: 'Social & Média', 
    emoji: '📱', 
    color: '#5B8DEE', 
    colorGlow: 'rgba(91, 141, 238, 0.6)', 
    path: '/social',
    angle: 200 
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    nameFr: 'Divertissement', 
    emoji: '🎬', 
    color: '#9B59B6', 
    colorGlow: 'rgba(155, 89, 182, 0.6)', 
    path: '/entertainment',
    angle: 240 
  },
  { 
    id: 'team', 
    name: 'My Team', 
    nameFr: 'Mon Équipe', 
    emoji: '🤝', 
    color: '#7A593A', 
    colorGlow: 'rgba(122, 89, 58, 0.6)', 
    path: '/team',
    angle: 280 
  },
  { 
    id: 'scholar', 
    name: 'Scholar', 
    nameFr: 'Académique', 
    emoji: '📚', 
    color: '#2F4C39', 
    colorGlow: 'rgba(47, 76, 57, 0.6)', 
    path: '/scholar',
    angle: 320 
  },
];

// 6 Sections Bureau (ARCHITECTURE GELÉE)
export const BUREAU_SECTIONS: BureauSection[] = [
  'dashboard',
  'notes',
  'tasks',
  'projects',
  'threads',
  'meetings',
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extrait l'ID de sphère depuis un chemin URL
 */
export function getSphereFromPath(pathname: string): SphereId | null {
  const segment = pathname.split('/')[1];
  const sphere = SPHERES.find(s => s.path === `/${segment}`);
  return sphere?.id || null;
}

/**
 * Extrait la section bureau depuis un chemin URL
 */
export function getSectionFromPath(pathname: string): BureauSection {
  const segment = pathname.split('/')[2];
  if (segment && BUREAU_SECTIONS.includes(segment as BureauSection)) {
    return segment as BureauSection;
  }
  return 'dashboard';
}

/**
 * Construit le chemin URL pour une sphère et section
 */
export function buildSpherePath(sphereId: SphereId, section: BureauSection = 'dashboard'): string {
  const sphere = SPHERES.find(s => s.id === sphereId);
  if (!sphere) return '/personal/dashboard';
  return `${sphere.path}/${section}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseRouterNavigationReturn {
  // État actuel
  activeSphere: SphereId | null;
  activeSection: BureauSection;
  activeSphereData: Sphere | null;
  
  // Navigation
  navigateToSphere: (sphereId: SphereId, section?: BureauSection) => void;
  navigateToSection: (section: BureauSection) => void;
  navigateToOverview: () => void;
  
  // Données
  spheres: Sphere[];
  sections: BureauSection[];
  
  // Helpers
  isOverview: boolean;
  currentPath: string;
}

export function useRouterNavigation(): UseRouterNavigationReturn {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraire la sphère et section actuelles depuis l'URL
  const activeSphere = useMemo(() => getSphereFromPath(location.pathname), [location.pathname]);
  const activeSection = useMemo(() => getSectionFromPath(location.pathname), [location.pathname]);
  
  // Données de la sphère active
  const activeSphereData = useMemo(() => {
    return SPHERES.find(s => s.id === activeSphere) || null;
  }, [activeSphere]);
  
  // Navigation vers une sphère
  const navigateToSphere = useCallback((sphereId: SphereId, section: BureauSection = 'dashboard') => {
    const path = buildSpherePath(sphereId, section);
    navigate(path);
  }, [navigate]);
  
  // Navigation vers une section (dans la sphère actuelle)
  const navigateToSection = useCallback((section: BureauSection) => {
    if (activeSphere) {
      const path = buildSpherePath(activeSphere, section);
      navigate(path);
    } else {
      // Si pas de sphère active, aller à Personal
      navigate(`/personal/${section}`);
    }
  }, [navigate, activeSphere]);
  
  // Navigation vers l'overview (centre de commandement)
  const navigateToOverview = useCallback(() => {
    navigate('/');
  }, [navigate]);
  
  // Est-on sur l'overview?
  const isOverview = location.pathname === '/' || location.pathname === '/overview';
  
  return {
    activeSphere,
    activeSection,
    activeSphereData,
    navigateToSphere,
    navigateToSection,
    navigateToOverview,
    spheres: SPHERES,
    sections: BUREAU_SECTIONS,
    isOverview,
    currentPath: location.pathname,
  };
}

export default useRouterNavigation;
