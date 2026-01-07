// =============================================================================
// CHE·NU™ — UNIVERSE TYPES
// Version Finale V51
// Navigation 2D / 3D / XR
// =============================================================================

import { SphereId } from './sphere.types';
import { Agent } from './agent.types';

/**
 * Mode de vue de l'univers
 */
export type ViewMode = '2d' | '3d' | 'xr' | 'list';

/**
 * Niveau de zoom
 */
export type ZoomLevel = 'universe' | 'cluster' | 'sphere' | 'category' | 'agent';

/**
 * Direction de navigation
 */
export type NavigationDirection = 'in' | 'out' | 'left' | 'right' | 'up' | 'down';

/**
 * Dimensions de l'univers
 */
export interface UniverseDimensions {
  width: number;
  height: number;
  depth: number;           // Pour 3D/XR
  coreRadius: number;      // Rayon du noyau central
  sphereOrbitRadius: number;
  agentOrbitRadius: number;
}

/**
 * Configuration des orbites
 */
export interface OrbitConfig {
  level: number;           // 1-3
  radius: number;
  speed: number;
  direction: 'clockwise' | 'counterclockwise';
  tilt: number;            // Inclinaison en degrés
}

/**
 * Point de vue/caméra
 */
export interface ViewCamera {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  zoom: number;
  fov: number;             // Field of view pour 3D
}

/**
 * État de la navigation
 */
export interface NavigationState {
  currentView: ViewMode;
  zoomLevel: ZoomLevel;
  focusedSphereId: SphereId | null;
  focusedAgentId: string | null;
  camera: ViewCamera;
  breadcrumbs: NavigationBreadcrumb[];
}

/**
 * Fil d'Ariane
 */
export interface NavigationBreadcrumb {
  type: 'universe' | 'sphere' | 'category' | 'agent';
  id: string;
  label: string;
  icon: string;
}

/**
 * Données visuelles d'une sphère pour le rendu
 */
export interface SphereVisualData {
  id: SphereId;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  glowColor: string;
  glowIntensity: number;
  rotation: number;
  opacity: number;
  label: string;
  icon: string;
  agentCount: number;
  isActive: boolean;
  isFocused: boolean;
  isHovered: boolean;
}

/**
 * Données visuelles d'un agent pour le rendu
 */
export interface AgentVisualData {
  id: string;
  sphereId: SphereId;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  orbitLevel: number;
  angle: number;
  speed: number;
  label: string;
  level: number;
  isActive: boolean;
  isSelected: boolean;
}

/**
 * Connexion visuelle entre éléments
 */
export interface VisualConnection {
  fromId: string;
  toId: string;
  type: 'hierarchy' | 'collaboration' | 'data_flow';
  strength: number;
  color: string;
  animated: boolean;
}

/**
 * Nœud de la minimap
 */
export interface MinimapNode {
  id: string;
  type: 'sphere' | 'agent' | 'core';
  x: number;
  y: number;
  radius: number;
  color: string;
  isActive: boolean;
}

/**
 * Configuration du rendu
 */
export interface RenderConfig {
  showLabels: boolean;
  showConnections: boolean;
  showAgents: boolean;
  showMinimap: boolean;
  showGrid: boolean;
  animationsEnabled: boolean;
  particlesEnabled: boolean;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
}

/**
 * Événement d'interaction
 */
export interface InteractionEvent {
  type: 'click' | 'hover' | 'drag' | 'zoom' | 'pan' | 'select';
  target: 'sphere' | 'agent' | 'core' | 'background' | 'connection';
  targetId: string | null;
  position: { x: number; y: number; z?: number };
  timestamp: Date;
}

/**
 * État complet de l'univers
 */
export interface UniverseState {
  dimensions: UniverseDimensions;
  navigation: NavigationState;
  spheres: SphereVisualData[];
  agents: AgentVisualData[];
  connections: VisualConnection[];
  renderConfig: RenderConfig;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions de l'univers
 */
export type UniverseAction =
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'ZOOM_TO'; payload: { level: ZoomLevel; targetId?: string } }
  | { type: 'FOCUS_SPHERE'; payload: SphereId | null }
  | { type: 'FOCUS_AGENT'; payload: string | null }
  | { type: 'UPDATE_CAMERA'; payload: Partial<ViewCamera> }
  | { type: 'TOGGLE_LABELS'; payload?: boolean }
  | { type: 'TOGGLE_CONNECTIONS'; payload?: boolean }
  | { type: 'TOGGLE_AGENTS'; payload?: boolean }
  | { type: 'SET_RENDER_CONFIG'; payload: Partial<RenderConfig> }
  | { type: 'NAVIGATE'; payload: NavigationDirection }
  | { type: 'RESET_VIEW' };

// =============================================================================
// CONSTANTES
// =============================================================================

export const VIEW_MODES: ViewMode[] = ['2d', '3d', 'xr', 'list'];

export const ZOOM_LEVELS: ZoomLevel[] = [
  'universe',
  'cluster',
  'sphere',
  'category',
  'agent',
];

export const DEFAULT_UNIVERSE_DIMENSIONS: UniverseDimensions = {
  width: 1920,
  height: 1080,
  depth: 1000,
  coreRadius: 80,
  sphereOrbitRadius: 350,
  agentOrbitRadius: 60,
};

export const ORBIT_LEVELS: OrbitConfig[] = [
  { level: 1, radius: 40, speed: 0.5, direction: 'clockwise', tilt: 0 },
  { level: 2, radius: 60, speed: 0.3, direction: 'counterclockwise', tilt: 15 },
  { level: 3, radius: 80, speed: 0.2, direction: 'clockwise', tilt: -10 },
];

export const DEFAULT_CAMERA: ViewCamera = {
  x: 0,
  y: 0,
  z: 500,
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  zoom: 1,
  fov: 60,
};

export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  showLabels: true,
  showConnections: true,
  showAgents: true,
  showMinimap: true,
  showGrid: false,
  animationsEnabled: true,
  particlesEnabled: true,
  qualityLevel: 'high',
};
