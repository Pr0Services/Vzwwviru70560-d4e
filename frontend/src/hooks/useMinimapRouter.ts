/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — USE MINIMAP ROUTER BRIDGE                       ║
 * ║                    Connecte FloatingMinimap ↔ useRouterNavigation            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * CE HOOK FAIT LE PONT ENTRE:
 * - FloatingMinimap (existant) → src/components/navigation/FloatingMinimap.tsx
 * - useRouterNavigation (P1) → src/hooks/useRouterNavigation.ts
 * 
 * PAS DE DUPLICATION — RÉUTILISATION!
 */

import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRouterNavigation, SphereId, BureauSection, SPHERES } from './useRouterNavigation';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseMinimapRouterReturn {
  // État synchronisé avec URL
  activeSphere: SphereId | null;
  activeSection: BureauSection;
  
  // Actions pour FloatingMinimap
  onSphereSelect: (sphereId: SphereId) => void;
  onCenterClick: () => void;
  
  // Info sphères pour affichage
  spheres: typeof SPHERES;
  currentSphereInfo: typeof SPHERES[0] | null;
  
  // État navigation
  isInSphere: boolean;
  isInOverview: boolean;
  currentPath: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export function useMinimapRouter(): UseMinimapRouterReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ sphereId?: string; section?: string }>();
  
  // Utiliser useRouterNavigation pour la logique de navigation
  const {
    currentSphere,
    currentSection,
    navigateToSphere,
    navigateToOverview,
    isValidSphere,
  } = useRouterNavigation();

  // ═══════════════════════════════════════════════════════════════════════════
  // ÉTAT DÉRIVÉ DE L'URL
  // ═══════════════════════════════════════════════════════════════════════════

  const activeSphere = useMemo((): SphereId | null => {
    // Extraire sphere de l'URL ou des params
    if (currentSphere && isValidSphere(currentSphere)) {
      return currentSphere as SphereId;
    }
    
    // Fallback: parser le pathname
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const potentialSphere = pathParts[0];
      if (isValidSphere(potentialSphere)) {
        return potentialSphere as SphereId;
      }
    }
    
    return null;
  }, [currentSphere, location.pathname, isValidSphere]);

  const activeSection = useMemo((): BureauSection => {
    return (currentSection as BureauSection) || 'dashboard';
  }, [currentSection]);

  // ═══════════════════════════════════════════════════════════════════════════
  // INFO SPHÈRE COURANTE
  // ═══════════════════════════════════════════════════════════════════════════

  const currentSphereInfo = useMemo(() => {
    if (!activeSphere) return null;
    return SPHERES.find(s => s.id === activeSphere) || null;
  }, [activeSphere]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS POUR FLOATINGMINIMAP
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Appelé quand on clique sur une sphère dans la minimap
   * → Navigue vers /:sphereId/dashboard
   */
  const onSphereSelect = useCallback((sphereId: SphereId) => {
    navigateToSphere(sphereId, 'dashboard');
  }, [navigateToSphere]);

  /**
   * Appelé quand on clique sur le centre de la minimap (l'île)
   * → Navigue vers /overview
   */
  const onCenterClick = useCallback(() => {
    navigateToOverview();
  }, [navigateToOverview]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FLAGS UTILES
  // ═══════════════════════════════════════════════════════════════════════════

  const isInSphere = activeSphere !== null;
  const isInOverview = location.pathname === '/overview' || location.pathname === '/';

  // ═══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // État
    activeSphere,
    activeSection,
    
    // Actions pour FloatingMinimap
    onSphereSelect,
    onCenterClick,
    
    // Info
    spheres: SPHERES,
    currentSphereInfo,
    
    // Flags
    isInSphere,
    isInOverview,
    currentPath: location.pathname,
  };
}

export default useMinimapRouter;
