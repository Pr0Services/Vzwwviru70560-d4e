/**
 * ============================================================
 * CHE·NU — XR ADAPTER — SCENE ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Adapter for XR scene data, configurations, and schemas.
 */

import type { RootSphere } from "./universeAdapter";

// ============================================================
// TYPES
// ============================================================

export type XRSceneType = 
  | "sanctuary"
  | "workspace"
  | "gallery"
  | "meeting"
  | "dashboard"
  | "archive"
  | "garden"
  | "observatory";

export type XREnvironment = 
  | "void"
  | "nature"
  | "urban"
  | "cosmic"
  | "abstract"
  | "minimal";

export type XRLightingPreset = 
  | "daylight"
  | "sunset"
  | "night"
  | "studio"
  | "dramatic"
  | "soft";

export interface XRVector3 {
  x: number;
  y: number;
  z: number;
}

export interface XRQuaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface XRTransform {
  position: XRVector3;
  rotation: XRQuaternion;
  scale: XRVector3;
}

export interface XRMaterial {
  id: string;
  type: "standard" | "pbr" | "unlit" | "glass" | "emissive";
  color: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  emissiveIntensity?: number;
}

export interface XRLight {
  id: string;
  type: "ambient" | "directional" | "point" | "spot";
  color: string;
  intensity: number;
  position?: XRVector3;
  target?: XRVector3;
  castShadow?: boolean;
}

export interface XRObject {
  id: string;
  name: string;
  type: "mesh" | "group" | "sprite" | "text" | "portal" | "interactive";
  geometry?: string;
  material?: XRMaterial;
  transform: XRTransform;
  visible: boolean;
  interactive: boolean;
  metadata?: Record<string, unknown>;
}

export interface XRPortal {
  id: string;
  name: string;
  targetSceneId: string;
  targetSphere?: RootSphere;
  transform: XRTransform;
  style: "door" | "arch" | "ring" | "vortex" | "minimal";
  color: string;
  active: boolean;
}

export interface XRHotspot {
  id: string;
  name: string;
  description: string;
  position: XRVector3;
  icon: string;
  action: "info" | "link" | "trigger" | "expand";
  data?: Record<string, unknown>;
}

export interface XRScene {
  id: string;
  name: string;
  description: string;
  type: XRSceneType;
  sphere: RootSphere;
  environment: XREnvironment;
  lighting: XRLightingPreset;
  lights: XRLight[];
  objects: XRObject[];
  portals: XRPortal[];
  hotspots: XRHotspot[];
  skybox?: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  audio?: {
    ambient?: string;
    volume: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface XRSceneTemplate {
  id: string;
  name: string;
  description: string;
  type: XRSceneType;
  thumbnail: string;
  defaultEnvironment: XREnvironment;
  defaultLighting: XRLightingPreset;
  objectCount: number;
  complexity: "simple" | "moderate" | "complex";
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_SCENES: XRScene[] = [
  {
    id: "scene-sanctuary-personal",
    name: "Personal Sanctuary",
    description: "A peaceful retreat for reflection and personal organization",
    type: "sanctuary",
    sphere: "personal",
    environment: "nature",
    lighting: "sunset",
    lights: [
      { id: "light-1", type: "ambient", color: "#FFF5E6", intensity: 0.4 },
      { id: "light-2", type: "directional", color: "#FFD700", intensity: 0.8, position: { x: 10, y: 20, z: 5 }, castShadow: true }
    ],
    objects: [
      {
        id: "obj-platform",
        name: "Central Platform",
        type: "mesh",
        geometry: "cylinder",
        material: { id: "mat-1", type: "pbr", color: "#E9E4D6", metalness: 0.1, roughness: 0.8 },
        transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 5, y: 0.2, z: 5 } },
        visible: true,
        interactive: false
      },
      {
        id: "obj-orb",
        name: "Memory Orb",
        type: "mesh",
        geometry: "sphere",
        material: { id: "mat-2", type: "glass", color: "#3EB4A2", opacity: 0.7 },
        transform: { position: { x: 0, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 0.5, y: 0.5, z: 0.5 } },
        visible: true,
        interactive: true
      }
    ],
    portals: [
      {
        id: "portal-creative",
        name: "To Creative Studio",
        targetSceneId: "scene-gallery-creative",
        targetSphere: "creative",
        transform: { position: { x: -5, y: 0, z: 0 }, rotation: { x: 0, y: 0.7, z: 0, w: 0.7 }, scale: { x: 1, y: 1, z: 1 } },
        style: "arch",
        color: "#9B59B6",
        active: true
      }
    ],
    hotspots: [
      {
        id: "hs-1",
        name: "Daily Tasks",
        description: "View and manage your daily tasks",
        position: { x: 2, y: 1, z: 2 },
        icon: "📋",
        action: "expand"
      }
    ],
    skybox: "sunset_nature",
    fog: { color: "#FFE4C4", near: 10, far: 50 },
    audio: { ambient: "nature_birds", volume: 0.3 },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-01T14:30:00Z"
  },
  {
    id: "scene-gallery-creative",
    name: "Creative Gallery",
    description: "An immersive gallery space for showcasing creative works",
    type: "gallery",
    sphere: "creative",
    environment: "minimal",
    lighting: "studio",
    lights: [
      { id: "light-1", type: "ambient", color: "#FFFFFF", intensity: 0.3 },
      { id: "light-2", type: "spot", color: "#FFFFFF", intensity: 1.0, position: { x: 0, y: 5, z: 0 }, castShadow: true }
    ],
    objects: [
      {
        id: "obj-floor",
        name: "Gallery Floor",
        type: "mesh",
        geometry: "plane",
        material: { id: "mat-floor", type: "pbr", color: "#1E1F22", metalness: 0.3, roughness: 0.2 },
        transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: -0.7, y: 0, z: 0, w: 0.7 }, scale: { x: 20, y: 20, z: 1 } },
        visible: true,
        interactive: false
      }
    ],
    portals: [
      {
        id: "portal-personal",
        name: "To Personal Sanctuary",
        targetSceneId: "scene-sanctuary-personal",
        targetSphere: "personal",
        transform: { position: { x: 8, y: 0, z: 0 }, rotation: { x: 0, y: -0.7, z: 0, w: 0.7 }, scale: { x: 1, y: 1, z: 1 } },
        style: "ring",
        color: "#3EB4A2",
        active: true
      }
    ],
    hotspots: [],
    skybox: "studio_dark",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-10T16:00:00Z"
  },
  {
    id: "scene-workspace-business",
    name: "Business Command Center",
    description: "A professional workspace for business operations",
    type: "workspace",
    sphere: "business",
    environment: "urban",
    lighting: "daylight",
    lights: [
      { id: "light-1", type: "ambient", color: "#F0F0F0", intensity: 0.5 },
      { id: "light-2", type: "directional", color: "#FFFFFF", intensity: 0.7, position: { x: 5, y: 10, z: 5 }, castShadow: true }
    ],
    objects: [
      {
        id: "obj-desk",
        name: "Executive Desk",
        type: "group",
        transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
        visible: true,
        interactive: true
      }
    ],
    portals: [],
    hotspots: [
      {
        id: "hs-metrics",
        name: "Business Metrics",
        description: "View key performance indicators",
        position: { x: -3, y: 1.5, z: 0 },
        icon: "📊",
        action: "expand"
      }
    ],
    skybox: "city_day",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-03-05T11:00:00Z"
  },
  {
    id: "scene-meeting-social",
    name: "Social Hub",
    description: "A collaborative meeting space for social interactions",
    type: "meeting",
    sphere: "social",
    environment: "abstract",
    lighting: "soft",
    lights: [
      { id: "light-1", type: "ambient", color: "#E6F3FF", intensity: 0.6 },
      { id: "light-2", type: "point", color: "#3EB4A2", intensity: 0.5, position: { x: 0, y: 3, z: 0 } }
    ],
    objects: [
      {
        id: "obj-table",
        name: "Round Table",
        type: "mesh",
        geometry: "cylinder",
        material: { id: "mat-table", type: "pbr", color: "#8D8371", metalness: 0.2, roughness: 0.6 },
        transform: { position: { x: 0, y: 0.4, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 2, y: 0.05, z: 2 } },
        visible: true,
        interactive: false
      }
    ],
    portals: [],
    hotspots: [],
    skybox: "abstract_gradient",
    createdAt: "2024-02-15T14:00:00Z",
    updatedAt: "2024-03-08T09:30:00Z"
  },
  {
    id: "scene-observatory-systems",
    name: "Systems Observatory",
    description: "A monitoring station for system infrastructure",
    type: "observatory",
    sphere: "systems",
    environment: "cosmic",
    lighting: "night",
    lights: [
      { id: "light-1", type: "ambient", color: "#1a1a2e", intensity: 0.2 },
      { id: "light-2", type: "point", color: "#D8B26A", intensity: 0.8, position: { x: 0, y: 5, z: 0 } }
    ],
    objects: [
      {
        id: "obj-console",
        name: "Control Console",
        type: "group",
        transform: { position: { x: 0, y: 0, z: -2 }, rotation: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } },
        visible: true,
        interactive: true
      }
    ],
    portals: [],
    hotspots: [
      {
        id: "hs-status",
        name: "System Status",
        description: "Monitor all system health indicators",
        position: { x: 0, y: 2, z: -2 },
        icon: "🖥️",
        action: "expand"
      }
    ],
    skybox: "cosmos_stars",
    fog: { color: "#0a0a1a", near: 20, far: 100 },
    createdAt: "2024-01-25T16:00:00Z",
    updatedAt: "2024-03-12T10:00:00Z"
  }
];

const MOCK_TEMPLATES: XRSceneTemplate[] = [
  {
    id: "tpl-sanctuary",
    name: "Sanctuary",
    description: "A peaceful retreat space for reflection and meditation",
    type: "sanctuary",
    thumbnail: "sanctuary_thumb.jpg",
    defaultEnvironment: "nature",
    defaultLighting: "sunset",
    objectCount: 15,
    complexity: "moderate"
  },
  {
    id: "tpl-workspace",
    name: "Workspace",
    description: "A professional environment for focused work",
    type: "workspace",
    thumbnail: "workspace_thumb.jpg",
    defaultEnvironment: "urban",
    defaultLighting: "daylight",
    objectCount: 25,
    complexity: "complex"
  },
  {
    id: "tpl-gallery",
    name: "Gallery",
    description: "An exhibition space for showcasing content",
    type: "gallery",
    thumbnail: "gallery_thumb.jpg",
    defaultEnvironment: "minimal",
    defaultLighting: "studio",
    objectCount: 10,
    complexity: "simple"
  },
  {
    id: "tpl-meeting",
    name: "Meeting Room",
    description: "A collaborative space for group discussions",
    type: "meeting",
    thumbnail: "meeting_thumb.jpg",
    defaultEnvironment: "abstract",
    defaultLighting: "soft",
    objectCount: 20,
    complexity: "moderate"
  },
  {
    id: "tpl-dashboard",
    name: "Dashboard",
    description: "A data visualization environment",
    type: "dashboard",
    thumbnail: "dashboard_thumb.jpg",
    defaultEnvironment: "void",
    defaultLighting: "dramatic",
    objectCount: 30,
    complexity: "complex"
  },
  {
    id: "tpl-observatory",
    name: "Observatory",
    description: "A monitoring and observation station",
    type: "observatory",
    thumbnail: "observatory_thumb.jpg",
    defaultEnvironment: "cosmic",
    defaultLighting: "night",
    objectCount: 18,
    complexity: "moderate"
  },
  {
    id: "tpl-garden",
    name: "Garden",
    description: "An organic space for growth and cultivation",
    type: "garden",
    thumbnail: "garden_thumb.jpg",
    defaultEnvironment: "nature",
    defaultLighting: "daylight",
    objectCount: 40,
    complexity: "complex"
  },
  {
    id: "tpl-archive",
    name: "Archive",
    description: "A structured space for storing and retrieving information",
    type: "archive",
    thumbnail: "archive_thumb.jpg",
    defaultEnvironment: "minimal",
    defaultLighting: "studio",
    objectCount: 12,
    complexity: "simple"
  }
];

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Get all XR scenes
 */
export function getAllScenes(): XRScene[] {
  return [...MOCK_SCENES];
}

/**
 * Get scenes for a specific sphere
 */
export function getScenesForSphere(sphere: RootSphere): XRScene[] {
  return MOCK_SCENES.filter(scene => scene.sphere === sphere);
}

/**
 * Get scene by ID
 */
export function getSceneById(id: string): XRScene | undefined {
  return MOCK_SCENES.find(scene => scene.id === id);
}

/**
 * Get scenes by type
 */
export function getScenesByType(type: XRSceneType): XRScene[] {
  return MOCK_SCENES.filter(scene => scene.type === type);
}

/**
 * Get scene count for sphere
 */
export function getSceneCount(sphere: RootSphere): number {
  return MOCK_SCENES.filter(scene => scene.sphere === sphere).length;
}

/**
 * Get total scene count
 */
export function getTotalSceneCount(): number {
  return MOCK_SCENES.length;
}

/**
 * Get all scene templates
 */
export function getAllTemplates(): XRSceneTemplate[] {
  return [...MOCK_TEMPLATES];
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): XRSceneTemplate | undefined {
  return MOCK_TEMPLATES.find(tpl => tpl.id === id);
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: XRSceneType): XRSceneTemplate[] {
  return MOCK_TEMPLATES.filter(tpl => tpl.type === type);
}

/**
 * Get templates by complexity
 */
export function getTemplatesByComplexity(complexity: "simple" | "moderate" | "complex"): XRSceneTemplate[] {
  return MOCK_TEMPLATES.filter(tpl => tpl.complexity === complexity);
}

/**
 * Get connected portals from a scene
 */
export function getScenePortals(sceneId: string): XRPortal[] {
  const scene = getSceneById(sceneId);
  return scene?.portals || [];
}

/**
 * Get hotspots from a scene
 */
export function getSceneHotspots(sceneId: string): XRHotspot[] {
  const scene = getSceneById(sceneId);
  return scene?.hotspots || [];
}

/**
 * Get scene statistics
 */
export function getSceneStats(sceneId: string): {
  objectCount: number;
  portalCount: number;
  hotspotCount: number;
  lightCount: number;
} {
  const scene = getSceneById(sceneId);
  if (!scene) {
    return { objectCount: 0, portalCount: 0, hotspotCount: 0, lightCount: 0 };
  }
  return {
    objectCount: scene.objects.length,
    portalCount: scene.portals.length,
    hotspotCount: scene.hotspots.length,
    lightCount: scene.lights.length
  };
}

export default {
  getAllScenes,
  getScenesForSphere,
  getSceneById,
  getScenesByType,
  getSceneCount,
  getTotalSceneCount,
  getAllTemplates,
  getTemplateById,
  getTemplatesByType,
  getTemplatesByComplexity,
  getScenePortals,
  getSceneHotspots,
  getSceneStats
};
