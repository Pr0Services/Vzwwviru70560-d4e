/**
 * ============================================================
 * CHE·NU — XR ADAPTER — SPATIAL ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Adapter for XR spatial navigation, zones, and mapping.
 */

import type { RootSphere } from "./universeAdapter";

// ============================================================
// TYPES
// ============================================================

export type ZoneType = 
  | "hub"
  | "workspace"
  | "gallery"
  | "garden"
  | "archive"
  | "portal"
  | "observation"
  | "meeting";

export type NavigationType = 
  | "teleport"
  | "walk"
  | "fly"
  | "portal"
  | "elevator";

export type BoundaryType = 
  | "none"
  | "soft"
  | "hard"
  | "fade";

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialBounds {
  min: SpatialVector3;
  max: SpatialVector3;
}

export interface SpatialZone {
  id: string;
  name: string;
  description: string;
  type: ZoneType;
  sphere: RootSphere;
  sceneId: string;
  bounds: SpatialBounds;
  center: SpatialVector3;
  radius: number;
  color: string;
  accessible: boolean;
  visible: boolean;
  connectedZones: string[];
}

export interface NavigationPath {
  id: string;
  name: string;
  fromZoneId: string;
  toZoneId: string;
  type: NavigationType;
  waypoints: SpatialVector3[];
  duration: number;
  bidirectional: boolean;
  active: boolean;
}

export interface SpatialBoundary {
  id: string;
  name: string;
  type: BoundaryType;
  zoneId: string;
  segments: SpatialVector3[];
  height: number;
  color: string;
  opacity: number;
}

export interface SpawnPoint {
  id: string;
  name: string;
  zoneId: string;
  position: SpatialVector3;
  rotation: number;
  default: boolean;
  capacity: number;
}

export interface SpatialMarker {
  id: string;
  name: string;
  description: string;
  zoneId: string;
  position: SpatialVector3;
  icon: string;
  type: "info" | "waypoint" | "landmark" | "poi";
  visible: boolean;
}

export interface SpatialMap {
  id: string;
  name: string;
  description: string;
  sphere: RootSphere;
  zones: SpatialZone[];
  paths: NavigationPath[];
  boundaries: SpatialBoundary[];
  spawnPoints: SpawnPoint[];
  markers: SpatialMarker[];
  worldBounds: SpatialBounds;
  defaultSpawnId: string;
}

export interface SpatialStats {
  totalZones: number;
  totalPaths: number;
  totalMarkers: number;
  accessibleZones: number;
  worldVolume: number;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_ZONES: SpatialZone[] = [
  {
    id: "zone-hub-central",
    name: "Central Hub",
    description: "The main gathering point connecting all spheres",
    type: "hub",
    sphere: "personal",
    sceneId: "scene-sanctuary-personal",
    bounds: { min: { x: -20, y: 0, z: -20 }, max: { x: 20, y: 10, z: 20 } },
    center: { x: 0, y: 0, z: 0 },
    radius: 20,
    color: "#D8B26A",
    accessible: true,
    visible: true,
    connectedZones: ["zone-personal-sanctuary", "zone-creative-gallery", "zone-business-office"]
  },
  {
    id: "zone-personal-sanctuary",
    name: "Personal Sanctuary",
    description: "A peaceful retreat for personal reflection",
    type: "workspace",
    sphere: "personal",
    sceneId: "scene-sanctuary-personal",
    bounds: { min: { x: -15, y: 0, z: 25 }, max: { x: 15, y: 8, z: 55 } },
    center: { x: 0, y: 0, z: 40 },
    radius: 15,
    color: "#3EB4A2",
    accessible: true,
    visible: true,
    connectedZones: ["zone-hub-central", "zone-personal-garden"]
  },
  {
    id: "zone-personal-garden",
    name: "Wellness Garden",
    description: "An organic space for growth and mindfulness",
    type: "garden",
    sphere: "personal",
    sceneId: "scene-sanctuary-personal",
    bounds: { min: { x: 20, y: 0, z: 25 }, max: { x: 50, y: 6, z: 55 } },
    center: { x: 35, y: 0, z: 40 },
    radius: 15,
    color: "#3F7249",
    accessible: true,
    visible: true,
    connectedZones: ["zone-personal-sanctuary"]
  },
  {
    id: "zone-creative-gallery",
    name: "Creative Gallery",
    description: "Exhibition space for creative works",
    type: "gallery",
    sphere: "creative",
    sceneId: "scene-gallery-creative",
    bounds: { min: { x: -30, y: 0, z: -60 }, max: { x: 30, y: 12, z: -20 } },
    center: { x: 0, y: 0, z: -40 },
    radius: 30,
    color: "#9B59B6",
    accessible: true,
    visible: true,
    connectedZones: ["zone-hub-central", "zone-creative-studio"]
  },
  {
    id: "zone-creative-studio",
    name: "Creative Studio",
    description: "A workshop for creative production",
    type: "workspace",
    sphere: "creative",
    sceneId: "scene-gallery-creative",
    bounds: { min: { x: -50, y: 0, z: -60 }, max: { x: -35, y: 8, z: -20 } },
    center: { x: -42, y: 0, z: -40 },
    radius: 12,
    color: "#E74C3C",
    accessible: true,
    visible: true,
    connectedZones: ["zone-creative-gallery"]
  },
  {
    id: "zone-business-office",
    name: "Business Command Center",
    description: "Professional workspace for business operations",
    type: "workspace",
    sphere: "business",
    sceneId: "scene-workspace-business",
    bounds: { min: { x: 30, y: 0, z: -30 }, max: { x: 70, y: 10, z: 10 } },
    center: { x: 50, y: 0, z: -10 },
    radius: 20,
    color: "#2C3E50",
    accessible: true,
    visible: true,
    connectedZones: ["zone-hub-central", "zone-business-meeting"]
  },
  {
    id: "zone-business-meeting",
    name: "Meeting Chamber",
    description: "Collaborative meeting space",
    type: "meeting",
    sphere: "business",
    sceneId: "scene-workspace-business",
    bounds: { min: { x: 75, y: 0, z: -20 }, max: { x: 95, y: 8, z: 0 } },
    center: { x: 85, y: 0, z: -10 },
    radius: 10,
    color: "#34495E",
    accessible: true,
    visible: true,
    connectedZones: ["zone-business-office"]
  },
  {
    id: "zone-systems-observatory",
    name: "Systems Observatory",
    description: "Monitoring station for system infrastructure",
    type: "observation",
    sphere: "systems",
    sceneId: "scene-observatory-systems",
    bounds: { min: { x: -40, y: 0, z: 60 }, max: { x: 0, y: 15, z: 100 } },
    center: { x: -20, y: 0, z: 80 },
    radius: 20,
    color: "#1E1F22",
    accessible: true,
    visible: true,
    connectedZones: ["zone-hub-central"]
  }
];

const MOCK_PATHS: NavigationPath[] = [
  {
    id: "path-hub-personal",
    name: "Hub to Personal Sanctuary",
    fromZoneId: "zone-hub-central",
    toZoneId: "zone-personal-sanctuary",
    type: "teleport",
    waypoints: [
      { x: 0, y: 0, z: 10 },
      { x: 0, y: 0, z: 30 }
    ],
    duration: 2.0,
    bidirectional: true,
    active: true
  },
  {
    id: "path-personal-garden",
    name: "Sanctuary to Garden",
    fromZoneId: "zone-personal-sanctuary",
    toZoneId: "zone-personal-garden",
    type: "walk",
    waypoints: [
      { x: 10, y: 0, z: 40 },
      { x: 25, y: 0, z: 40 }
    ],
    duration: 5.0,
    bidirectional: true,
    active: true
  },
  {
    id: "path-hub-creative",
    name: "Hub to Creative Gallery",
    fromZoneId: "zone-hub-central",
    toZoneId: "zone-creative-gallery",
    type: "portal",
    waypoints: [
      { x: 0, y: 0, z: -10 },
      { x: 0, y: 0, z: -25 }
    ],
    duration: 1.5,
    bidirectional: true,
    active: true
  },
  {
    id: "path-creative-studio",
    name: "Gallery to Studio",
    fromZoneId: "zone-creative-gallery",
    toZoneId: "zone-creative-studio",
    type: "walk",
    waypoints: [
      { x: -20, y: 0, z: -40 },
      { x: -35, y: 0, z: -40 }
    ],
    duration: 4.0,
    bidirectional: true,
    active: true
  },
  {
    id: "path-hub-business",
    name: "Hub to Business Center",
    fromZoneId: "zone-hub-central",
    toZoneId: "zone-business-office",
    type: "teleport",
    waypoints: [
      { x: 15, y: 0, z: 0 },
      { x: 35, y: 0, z: -10 }
    ],
    duration: 2.5,
    bidirectional: true,
    active: true
  },
  {
    id: "path-business-meeting",
    name: "Office to Meeting Chamber",
    fromZoneId: "zone-business-office",
    toZoneId: "zone-business-meeting",
    type: "walk",
    waypoints: [
      { x: 65, y: 0, z: -10 },
      { x: 78, y: 0, z: -10 }
    ],
    duration: 3.0,
    bidirectional: true,
    active: true
  },
  {
    id: "path-hub-systems",
    name: "Hub to Systems Observatory",
    fromZoneId: "zone-hub-central",
    toZoneId: "zone-systems-observatory",
    type: "elevator",
    waypoints: [
      { x: -10, y: 0, z: 15 },
      { x: -20, y: 5, z: 60 }
    ],
    duration: 4.0,
    bidirectional: true,
    active: true
  }
];

const MOCK_SPAWN_POINTS: SpawnPoint[] = [
  {
    id: "spawn-hub-main",
    name: "Hub Main Spawn",
    zoneId: "zone-hub-central",
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    default: true,
    capacity: 50
  },
  {
    id: "spawn-personal-entry",
    name: "Personal Sanctuary Entry",
    zoneId: "zone-personal-sanctuary",
    position: { x: 0, y: 0, z: 28 },
    rotation: 0,
    default: false,
    capacity: 10
  },
  {
    id: "spawn-creative-entry",
    name: "Creative Gallery Entry",
    zoneId: "zone-creative-gallery",
    position: { x: 0, y: 0, z: -25 },
    rotation: 180,
    default: false,
    capacity: 20
  },
  {
    id: "spawn-business-entry",
    name: "Business Office Entry",
    zoneId: "zone-business-office",
    position: { x: 35, y: 0, z: -10 },
    rotation: 90,
    default: false,
    capacity: 15
  },
  {
    id: "spawn-systems-entry",
    name: "Systems Observatory Entry",
    zoneId: "zone-systems-observatory",
    position: { x: -20, y: 0, z: 65 },
    rotation: 0,
    default: false,
    capacity: 8
  }
];

const MOCK_MARKERS: SpatialMarker[] = [
  {
    id: "marker-hub-info",
    name: "Welcome Point",
    description: "Information about the CHE·NU Universe",
    zoneId: "zone-hub-central",
    position: { x: 5, y: 1.5, z: 0 },
    icon: "ℹ️",
    type: "info",
    visible: true
  },
  {
    id: "marker-hub-directory",
    name: "Sphere Directory",
    description: "Navigate to different spheres",
    zoneId: "zone-hub-central",
    position: { x: -5, y: 1.5, z: 0 },
    icon: "🗺️",
    type: "waypoint",
    visible: true
  },
  {
    id: "marker-personal-meditation",
    name: "Meditation Spot",
    description: "A peaceful place for mindfulness",
    zoneId: "zone-personal-sanctuary",
    position: { x: 0, y: 0, z: 45 },
    icon: "🧘",
    type: "poi",
    visible: true
  },
  {
    id: "marker-creative-featured",
    name: "Featured Work",
    description: "Highlighted creative piece",
    zoneId: "zone-creative-gallery",
    position: { x: 0, y: 2, z: -40 },
    icon: "⭐",
    type: "landmark",
    visible: true
  },
  {
    id: "marker-business-dashboard",
    name: "Business Dashboard",
    description: "Key metrics and KPIs",
    zoneId: "zone-business-office",
    position: { x: 50, y: 2, z: -15 },
    icon: "📊",
    type: "poi",
    visible: true
  }
];

const MOCK_BOUNDARIES: SpatialBoundary[] = [
  {
    id: "boundary-hub-outer",
    name: "Hub Outer Boundary",
    type: "fade",
    zoneId: "zone-hub-central",
    segments: [
      { x: -20, y: 0, z: -20 },
      { x: 20, y: 0, z: -20 },
      { x: 20, y: 0, z: 20 },
      { x: -20, y: 0, z: 20 }
    ],
    height: 10,
    color: "#D8B26A",
    opacity: 0.3
  },
  {
    id: "boundary-personal-soft",
    name: "Personal Zone Boundary",
    type: "soft",
    zoneId: "zone-personal-sanctuary",
    segments: [
      { x: -15, y: 0, z: 25 },
      { x: 15, y: 0, z: 25 },
      { x: 15, y: 0, z: 55 },
      { x: -15, y: 0, z: 55 }
    ],
    height: 8,
    color: "#3EB4A2",
    opacity: 0.2
  }
];

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Get all spatial zones
 */
export function getAllZones(): SpatialZone[] {
  return [...MOCK_ZONES];
}

/**
 * Get zones for a specific sphere
 */
export function getZonesForSphere(sphere: RootSphere): SpatialZone[] {
  return MOCK_ZONES.filter(zone => zone.sphere === sphere);
}

/**
 * Get zone by ID
 */
export function getZoneById(id: string): SpatialZone | undefined {
  return MOCK_ZONES.find(zone => zone.id === id);
}

/**
 * Get zones by type
 */
export function getZonesByType(type: ZoneType): SpatialZone[] {
  return MOCK_ZONES.filter(zone => zone.type === type);
}

/**
 * Get accessible zones
 */
export function getAccessibleZones(): SpatialZone[] {
  return MOCK_ZONES.filter(zone => zone.accessible);
}

/**
 * Get connected zones for a zone
 */
export function getConnectedZones(zoneId: string): SpatialZone[] {
  const zone = getZoneById(zoneId);
  if (!zone) return [];
  return zone.connectedZones
    .map(id => getZoneById(id))
    .filter((z): z is SpatialZone => z !== undefined);
}

/**
 * Get all navigation paths
 */
export function getAllPaths(): NavigationPath[] {
  return [...MOCK_PATHS];
}

/**
 * Get paths from a zone
 */
export function getPathsFromZone(zoneId: string): NavigationPath[] {
  return MOCK_PATHS.filter(path => 
    path.fromZoneId === zoneId || 
    (path.bidirectional && path.toZoneId === zoneId)
  );
}

/**
 * Get path between zones
 */
export function getPathBetweenZones(fromId: string, toId: string): NavigationPath | undefined {
  return MOCK_PATHS.find(path => 
    (path.fromZoneId === fromId && path.toZoneId === toId) ||
    (path.bidirectional && path.fromZoneId === toId && path.toZoneId === fromId)
  );
}

/**
 * Get all spawn points
 */
export function getAllSpawnPoints(): SpawnPoint[] {
  return [...MOCK_SPAWN_POINTS];
}

/**
 * Get spawn points for a zone
 */
export function getSpawnPointsForZone(zoneId: string): SpawnPoint[] {
  return MOCK_SPAWN_POINTS.filter(sp => sp.zoneId === zoneId);
}

/**
 * Get default spawn point
 */
export function getDefaultSpawnPoint(): SpawnPoint | undefined {
  return MOCK_SPAWN_POINTS.find(sp => sp.default);
}

/**
 * Get all markers
 */
export function getAllMarkers(): SpatialMarker[] {
  return [...MOCK_MARKERS];
}

/**
 * Get markers for a zone
 */
export function getMarkersForZone(zoneId: string): SpatialMarker[] {
  return MOCK_MARKERS.filter(m => m.zoneId === zoneId);
}

/**
 * Get visible markers
 */
export function getVisibleMarkers(): SpatialMarker[] {
  return MOCK_MARKERS.filter(m => m.visible);
}

/**
 * Get all boundaries
 */
export function getAllBoundaries(): SpatialBoundary[] {
  return [...MOCK_BOUNDARIES];
}

/**
 * Get boundaries for a zone
 */
export function getBoundariesForZone(zoneId: string): SpatialBoundary[] {
  return MOCK_BOUNDARIES.filter(b => b.zoneId === zoneId);
}

/**
 * Get spatial statistics
 */
export function getSpatialStats(): SpatialStats {
  const bounds = {
    min: { x: -100, y: 0, z: -100 },
    max: { x: 100, y: 20, z: 100 }
  };
  
  return {
    totalZones: MOCK_ZONES.length,
    totalPaths: MOCK_PATHS.length,
    totalMarkers: MOCK_MARKERS.length,
    accessibleZones: MOCK_ZONES.filter(z => z.accessible).length,
    worldVolume: (bounds.max.x - bounds.min.x) * 
                 (bounds.max.y - bounds.min.y) * 
                 (bounds.max.z - bounds.min.z)
  };
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(from: SpatialVector3, to: SpatialVector3): number {
  return Math.sqrt(
    Math.pow(to.x - from.x, 2) +
    Math.pow(to.y - from.y, 2) +
    Math.pow(to.z - from.z, 2)
  );
}

/**
 * Check if point is within zone bounds
 */
export function isPointInZone(point: SpatialVector3, zoneId: string): boolean {
  const zone = getZoneById(zoneId);
  if (!zone) return false;
  
  return (
    point.x >= zone.bounds.min.x && point.x <= zone.bounds.max.x &&
    point.y >= zone.bounds.min.y && point.y <= zone.bounds.max.y &&
    point.z >= zone.bounds.min.z && point.z <= zone.bounds.max.z
  );
}

export default {
  getAllZones,
  getZonesForSphere,
  getZoneById,
  getZonesByType,
  getAccessibleZones,
  getConnectedZones,
  getAllPaths,
  getPathsFromZone,
  getPathBetweenZones,
  getAllSpawnPoints,
  getSpawnPointsForZone,
  getDefaultSpawnPoint,
  getAllMarkers,
  getMarkersForZone,
  getVisibleMarkers,
  getAllBoundaries,
  getBoundariesForZone,
  getSpatialStats,
  calculateDistance,
  isPointInZone
};
