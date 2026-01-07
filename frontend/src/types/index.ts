// =============================================================================
// CHE·NU™ — TYPES INDEX
// Version Finale V52 — ARCHITECTURE GELÉE
// Export centralisé de tous les types
// =============================================================================

// Sphere Types (9 spheres)
export * from './sphere.types';

// Bureau Types (6 sections)
export * from './bureau.types';

// Canonical Configuration (frozen architecture)
export * from './canonical.config';

// Agent Types
export * from './agent.types';

// Theme Types
export * from './theme.types';

// Universe Types
export * from './universe.types';

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * Identifiant unique
 */
export type UUID = string;

/**
 * Timestamp ISO
 */
export type ISOTimestamp = string;

/**
 * Résultat d'une opération
 */
export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

/**
 * Pagination
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * État de chargement
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Notification système
 */
export interface SystemNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  agentId?: string;
  sphereId?: string;
}

/**
 * Préférences utilisateur
 */
export interface UserPreferences {
  language: 'fr' | 'en';
  timezone: string;
  dateFormat: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

/**
 * Session utilisateur
 */
export interface UserSession {
  id: string;
  userId: string;
  startedAt: Date;
  lastActiveAt: Date;
  currentSphereId: string | null;
  activeAgentIds: string[];
  preferences: UserPreferences;
}

/**
 * Audit trail entry
 */
export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  agentId: string | null;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  result: 'success' | 'failure';
}

// =============================================================================
// GOVERNANCE TYPES (Tree Laws)
// =============================================================================

/**
 * Loi de l'arbre (Tree Law)
 */
export interface TreeLaw {
  id: string;
  code: string;           // Ex: "TL-001"
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  category: 'sovereignty' | 'transparency' | 'safety' | 'privacy' | 'governance';
  level: 'absolute' | 'strong' | 'recommended';
  enforcedBy: string[];   // Agent IDs
  canBeOverridden: boolean;
  overrideRequires: string[]; // Conditions pour override
}

/**
 * Validation de gouvernance
 */
export interface GovernanceValidation {
  isValid: boolean;
  violations: TreeLawViolation[];
  warnings: TreeLawWarning[];
  approvalRequired: boolean;
  approvalAgentIds: string[];
}

/**
 * Violation de Tree Law
 */
export interface TreeLawViolation {
  lawId: string;
  lawCode: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  suggestedFix: string;
}

/**
 * Avertissement Tree Law
 */
export interface TreeLawWarning {
  lawId: string;
  lawCode: string;
  description: string;
  recommendation: string;
}

// =============================================================================
// XR TYPES
// =============================================================================

/**
 * Espace XR
 */
export interface XRSpace {
  id: string;
  name: string;
  type: 'meeting' | 'workspace' | 'presentation' | 'reflection';
  sphereId: string | null;
  capacity: number;
  currentOccupants: number;
  environment: string;
  isPublic: boolean;
}

/**
 * Avatar XR
 */
export interface XRAvatar {
  id: string;
  userId: string;
  modelUrl: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  isActive: boolean;
  isSpeaking: boolean;
}

/**
 * Réunion XR
 */
export interface XRMeeting {
  id: string;
  spaceId: string;
  title: string;
  phase: 'waiting' | 'intro' | 'discussion' | 'decision' | 'closing';
  participants: XRAvatar[];
  agentIds: string[];
  startedAt: Date | null;
  scheduledDuration: number;
}

// =============================================================================
// RE-EXPORT CONSTANTS
// =============================================================================

export {
  SPHERE_IDS,
  SPHERE_SIZE_SCALE,
  SPHERE_STATUS_COLORS,
} from './sphere.types';

export {
  AGENT_LEVELS,
  AGENT_LEVEL_NAMES,
  AGENT_LEVEL_COLORS,
  AGENT_LEVEL_COUNTS,
  AGENT_STATUS_ICONS,
  TOTAL_AGENTS,
  CORE_AGENT_IDS,
} from './agent.types';

export {
  THEME_IDS,
  DEFAULT_THEME_ID,
  THEME_MODES,
  THEME_ACCENT_COLORS,
  THEME_DESCRIPTIONS,
} from './theme.types';

export {
  VIEW_MODES,
  ZOOM_LEVELS,
  DEFAULT_UNIVERSE_DIMENSIONS,
  ORBIT_LEVELS,
  DEFAULT_CAMERA,
  DEFAULT_RENDER_CONFIG,
} from './universe.types';

// =============================================================================
// CHENU COLORS (Brand Colors)
// =============================================================================

export const CHENU_COLORS = {
  // Primary
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  
  // UI
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // Semantic
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
} as const;

export type ChenuColorKey = keyof typeof CHENU_COLORS;
