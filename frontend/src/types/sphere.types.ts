// =============================================================================
// CHE·NU™ — SPHERE TYPES
// Version Finale V51
// =============================================================================

/**
 * Identifiants des 9 sphères officielles CHE·NU
 */
export type SphereId =
  | 'personal'       // 🏠 Personnel
  | 'business'       // 💼 Business
  | 'government'     // 🏛️ Government/Institutions
  | 'studio'         // 🎨 Creative Studio
  | 'community'      // 👥 Community
  | 'social'         // 📱 Social Media
  | 'entertainment'  // 🎬 Entertainment
  | 'team'           // 🤝 My Team (includes IA Labs)
  | 'scholar';       // 🎓 Scholar

/**
 * Taille visuelle d'une sphère (basée sur activité/densité)
 */
export type SphereSize = 'small' | 'medium' | 'large' | 'giant';

/**
 * État d'une sphère
 */
export type SphereStatus = 'active' | 'idle' | 'busy' | 'sleeping' | 'locked';

/**
 * Niveau d'accès XR pour une sphère
 */
export type XRAccessLevel = 'none' | 'view' | 'interact' | 'immersive';

/**
 * Configuration couleur d'une sphère
 */
export interface SphereColor {
  primary: string;      // Couleur principale
  secondary: string;    // Couleur secondaire
  accent: string;       // Couleur d'accent
  glow: string;         // Couleur de glow/halo
  text: string;         // Couleur texte
}

/**
 * Position dans l'univers (coordonnées polaires)
 */
export interface SpherePosition {
  angle: number;        // Angle en degrés (0-360)
  distance: number;     // Distance du centre (0-1 normalisé)
  elevation: number;    // Élévation pour 3D (-1 à 1)
}

/**
 * Catégorie/sous-section d'une sphère
 */
export interface SphereCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  agentCount: number;
}

/**
 * Métadonnées d'activité
 */
export interface SphereActivity {
  lastAccess: Date;
  sessionCount: number;
  totalTime: number;      // En minutes
  activeAgents: number;
  pendingTasks: number;
  notifications: number;
}

/**
 * Configuration visuelle XR
 */
export interface SphereXRConfig {
  accessLevel: XRAccessLevel;
  environment: string;          // Type d'environnement (forest, office, etc.)
  ambientSound: string | null;  // Son ambiant
  avatarScale: number;          // Échelle des avatars
  lightingPreset: string;       // Preset d'éclairage
}

/**
 * Définition complète d'une sphère
 */
export interface Sphere {
  // Identité
  id: SphereId;
  name: string;
  nameFr: string;
  emoji: string;
  icon: string;
  description: string;
  descriptionFr: string;
  
  // Visuel
  color: SphereColor;
  size: SphereSize;
  position: SpherePosition;
  
  // Structure
  categories: SphereCategory[];
  parentSphere: SphereId | null;
  childSpheres: SphereId[];
  
  // État
  status: SphereStatus;
  activity: SphereActivity;
  
  // Agents
  agentCount: number;
  primaryAgentId: string | null;
  
  // XR
  xr: SphereXRConfig;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

/**
 * État runtime d'une sphère
 */
export interface SphereRuntime {
  sphereId: SphereId;
  status: SphereStatus;
  activeAgentIds: string[];
  currentCategoryId: string | null;
  pendingActions: number;
  lastSync: Date;
}

/**
 * Événement de sphère
 */
export interface SphereEvent {
  type: 'enter' | 'exit' | 'focus' | 'blur' | 'update' | 'agent_action';
  sphereId: SphereId;
  timestamp: Date;
  payload?: Record<string, unknown>;
}

/**
 * Filtre pour recherche de sphères
 */
export interface SphereFilter {
  status?: SphereStatus[];
  size?: SphereSize[];
  hasActiveAgents?: boolean;
  minAgentCount?: number;
  search?: string;
}

/**
 * Statistiques agrégées des sphères
 */
export interface SphereStats {
  totalSpheres: number;
  activeSpheres: number;
  totalAgents: number;
  activeAgents: number;
  totalCategories: number;
  pendingTasks: number;
}

// =============================================================================
// CONSTANTES
// =============================================================================

export const SPHERE_IDS: SphereId[] = [
  'personal',
  'business',
  'government',
  'studio',
  'community',
  'social',
  'entertainment',
  'team',
  'scholar',
];

export const SPHERE_SIZE_SCALE: Record<SphereSize, number> = {
  small: 0.6,
  medium: 1.0,
  large: 1.4,
  giant: 2.0,
};

export const SPHERE_STATUS_COLORS: Record<SphereStatus, string> = {
  active: '#4CAF50',
  idle: '#9E9E9E',
  busy: '#FF9800',
  sleeping: '#607D8B',
  locked: '#F44336',
};
