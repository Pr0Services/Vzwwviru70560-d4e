// =============================================================================
// CHE·NU™ — UNIVERSE VIEW TYPES (CANONICAL)
// =============================================================================
// Props, États, Règles UI pour la vue UniverseView
// ⚠️ VERROUILLÉ — Implementation Lock
// =============================================================================

import { SphereId, SphereNode, SphereState, SphereType } from './SPHERES_CANONICAL_V2';

// -----------------------------------------------------------------------------
// VIEW MODES
// -----------------------------------------------------------------------------

export type ViewMode = 'overview' | 'focus';
export type InteractionMode = 'idle' | 'hover' | 'focus';

// -----------------------------------------------------------------------------
// UNIVERSE VIEW PROPS (CANONICAL)
// -----------------------------------------------------------------------------

export interface UniverseViewProps {
  userId: string;
  
  // Personal est toujours présent et actif
  personal: {
    id: 'personal';
    state: 'active';  // Toujours actif
  };
  
  // Liste des sphères avec leurs états
  spheres: SphereNode[];
  
  // Sphère actuellement en focus (optionnel)
  focusedSphereId?: SphereId | null;
  
  // Mode de vue
  viewMode: ViewMode;
  
  // Mode d'interaction actuel
  interactionMode: InteractionMode;
  
  // Permissions utilisateur
  permissions: {
    canActivateSphere: boolean;
    canEditTeam: boolean;
  };
}

// -----------------------------------------------------------------------------
// UNIVERSE VIEW STATE
// -----------------------------------------------------------------------------

export interface UniverseViewState {
  // Sphère survolée
  hoveredSphereId: SphereId | null;
  
  // Sphère en focus
  focusedSphereId: SphereId | null;
  
  // Mode actuel
  viewMode: ViewMode;
  interactionMode: InteractionMode;
  
  // Animation state
  isTransitioning: boolean;
  
  // Erreurs
  error: string | null;
}

// -----------------------------------------------------------------------------
// INTERACTIONS AUTORISÉES
// -----------------------------------------------------------------------------

export interface UniverseViewInteractions {
  // Hover - Révèle les relations
  onHover: (sphereId: SphereId | null) => void;
  
  // Click - Active le focus
  onClick: (sphereId: SphereId) => void;
  
  // Exit focus - Retour à overview
  onExitFocus: () => void;
  
  // Navigate to sphere
  onNavigate: (sphereId: SphereId) => void;
}

// -----------------------------------------------------------------------------
// VISUAL RULES (CANONICAL)
// -----------------------------------------------------------------------------

export const UNIVERSE_VIEW_RULES = {
  // Personal
  personal: {
    alwaysVisible: true,
    alwaysCentered: true,
    neverHidden: true,
    neverDisabled: true,
    neverInExclusiveFocus: true  // Il est toujours là
  },
  
  // My Team
  team: {
    alwaysLinkedToPersonal: true,
    canBeEmpty: true,  // Solo mode
    neverDeleted: true,
    closerThanContextual: true
  },
  
  // Contextual
  contextual: {
    optional: true,
    progressiveActivation: true,
    notAllVisibleByDefault: true,
    neverDirectlyLinked: true,  // Toujours via My Team
    parentRequired: true
  },
  
  // Interactions
  interactions: {
    dragAllowed: false,  // Pas de drag libre
    zoomInfinite: false,
    multiFocus: false,
    directLinks: false,  // Pas de liens sphère ↔ sphère
    autoActivation: false
  },
  
  // Animations
  animations: {
    startFromPersonal: true,
    endAtPersonal: true,
    slow: true,
    neverDecorative: true,
    alwaysExplanatory: true
  }
} as const;

// -----------------------------------------------------------------------------
// STATE VISUALS
// -----------------------------------------------------------------------------

export interface StateVisual {
  opacity: number;
  scale: number;
  glowIntensity: number;
  labelVisible: boolean;
  interactive: boolean;
}

export const STATE_VISUALS: Record<SphereState, StateVisual> = {
  latent: {
    opacity: 0.3,
    scale: 0.8,
    glowIntensity: 0,
    labelVisible: false,
    interactive: false
  },
  active: {
    opacity: 1,
    scale: 1,
    glowIntensity: 0.5,
    labelVisible: true,
    interactive: true
  },
  focus: {
    opacity: 1,
    scale: 1.2,
    glowIntensity: 1,
    labelVisible: true,
    interactive: true
  }
};

// -----------------------------------------------------------------------------
// ORBIT CONFIGURATION
// -----------------------------------------------------------------------------

export interface OrbitConfig {
  level: 0 | 1 | 2;
  radius: number;
  speed: number;  // 0 = statique
}

export const ORBIT_CONFIGS: Record<0 | 1 | 2, OrbitConfig> = {
  0: { level: 0, radius: 0, speed: 0 },      // Personal - Centre
  1: { level: 1, radius: 100, speed: 0.1 },  // My Team - Premier anneau
  2: { level: 2, radius: 200, speed: 0.05 }  // Contextual - Second anneau
};

// -----------------------------------------------------------------------------
// VALIDATION
// -----------------------------------------------------------------------------

export const validateUniverseViewProps = (props: UniverseViewProps): boolean => {
  // Personal must be present and active
  if (props.personal.id !== 'personal') return false;
  if (props.personal.state !== 'active') return false;
  
  // Must have spheres
  if (!props.spheres || props.spheres.length === 0) return false;
  
  // ViewMode must be valid
  if (!['overview', 'focus'].includes(props.viewMode)) return false;
  
  return true;
};

// -----------------------------------------------------------------------------
// ERRORS
// -----------------------------------------------------------------------------

export const UNIVERSE_VIEW_ERRORS = {
  PERSONAL_MISSING: 'Personal sphere is missing',
  PERSONAL_NOT_ACTIVE: 'Personal sphere must be active',
  TEAM_NOT_SPECIAL: 'My Team must be treated as special sphere',
  INVALID_HIERARCHY: 'Sphere hierarchy is invalid',
  DIRECT_LINK: 'Direct links between contextual spheres are forbidden',
  FLAT_LAYOUT: 'Flat layout detected - hierarchy must be visible'
} as const;
