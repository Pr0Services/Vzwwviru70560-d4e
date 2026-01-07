/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — UNIVERSE VIEW SYSTEM                                  ║
 * ║                                                                              ║
 * ║  ONE canonical spatial map. FOUR visual interpretations.                     ║
 * ║  Views are SKINS, not STRUCTURES.                                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// TYPES
// ============================================================================

export type UniverseViewId = "regular" | "futuristic" | "natural" | "astral";

export type SphereKey =
  | "personal"
  | "business"
  | "government"
  | "creative_studio"
  | "community"
  | "social_media"
  | "entertainment"
  | "my_team";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  glow?: string;
}

export interface MaterialConfig {
  color: string;
  metalness: number;
  roughness: number;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
}

export interface LightingConfig {
  ambient: string;
  ambientIntensity: number;
  directional: string;
  directionalIntensity: number;
  pointLights?: Array<{
    color: string;
    intensity: number;
    position: Vector3;
  }>;
}

export interface ParticleConfig {
  enabled: boolean;
  type: "none" | "dust" | "pixels" | "pollen" | "stars" | "nebula";
  count: number;
  color: string;
  size: number;
  speed: number;
}

export interface SoundscapeConfig {
  ambient: string | null;
  volume: number;
  effects: string[];
}

// ============================================================================
// CANONICAL SPHERE MAP (FROZEN - NEVER CHANGES)
// ============================================================================

export interface CanonicalSphere {
  id: SphereKey;
  position: Vector3;
  connections: SphereKey[];
  subSpaces: readonly [
    "dashboard",
    "notes",
    "tasks",
    "projects",
    "threads",
    "meetings",
    "data",
    "agents",
    "reports",
    "budget"
  ];
}

/**
 * THE CANONICAL MAP - FROZEN
 * This structure NEVER changes. Only visual skins change.
 */
export const CANONICAL_SPHERE_MAP: Record<SphereKey, CanonicalSphere> = {
  personal: {
    id: "personal",
    position: { x: -3, y: 0, z: 0 },
    connections: ["business", "entertainment", "community"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  business: {
    id: "business",
    position: { x: -1, y: 0, z: 0 },
    connections: ["personal", "government", "my_team"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  government: {
    id: "government",
    position: { x: 1, y: 0, z: 0 },
    connections: ["business", "creative_studio"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  creative_studio: {
    id: "creative_studio",
    position: { x: 3, y: 0, z: 0 },
    connections: ["government", "entertainment", "social_media"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  community: {
    id: "community",
    position: { x: -2, y: 0, z: 2 },
    connections: ["personal", "social_media"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  social_media: {
    id: "social_media",
    position: { x: 2, y: 0, z: 2 },
    connections: ["creative_studio", "community", "entertainment"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  entertainment: {
    id: "entertainment",
    position: { x: -1, y: 0, z: 3 },
    connections: ["personal", "creative_studio", "social_media"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
  my_team: {
    id: "my_team",
    position: { x: 1, y: 0, z: 3 },
    connections: ["business", "social_media"],
    subSpaces: ["dashboard", "notes", "tasks", "projects", "threads", "meetings", "data", "agents", "reports", "budget"],
  },
};

// ============================================================================
// UNIVERSE VIEW DEFINITIONS
// ============================================================================

export interface SphereSkin {
  material: MaterialConfig;
  accentMaterial: MaterialConfig;
  glowColor?: string;
  iconStyle: "flat" | "3d" | "hologram" | "organic" | "crystalline";
}

export interface ConnectionSkin {
  material: MaterialConfig;
  style: "line" | "tube" | "beam" | "vine" | "energy";
  animated: boolean;
  particleTrail: boolean;
}

export interface DiamondSkin {
  material: MaterialConfig;
  innerGlow: string;
  outerGlow: string;
  rotationSpeed: number;
  scale: number;
}

export interface UniverseView {
  id: UniverseViewId;
  name: string;
  nameFr: string;
  description: string;
  
  // Global Theme
  colors: ColorPalette;
  lighting: LightingConfig;
  particles: ParticleConfig;
  soundscape: SoundscapeConfig;
  
  // Element Skins
  sphereSkin: SphereSkin;
  connectionSkin: ConnectionSkin;
  diamondSkin: DiamondSkin;
  
  // Background
  background: {
    type: "solid" | "gradient" | "skybox" | "procedural";
    value: string | string[];
  };
}

// ============================================================================
// THE 4 UNIVERSE VIEWS
// ============================================================================

export const UNIVERSE_VIEWS: Record<UniverseViewId, UniverseView> = {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. REGULAR / PROFESSIONAL
  // ─────────────────────────────────────────────────────────────────────────
  regular: {
    id: "regular",
    name: "Professional",
    nameFr: "Professionnel",
    description: "Clean corporate aesthetic with glass and steel",
    
    colors: {
      primary: "#2a2a2a",
      secondary: "#404040",
      accent: "#3EB4A2",
      background: "#0a0a0a",
      text: "#e0e0e0",
    },
    
    lighting: {
      ambient: "#404040",
      ambientIntensity: 0.4,
      directional: "#ffffff",
      directionalIntensity: 1.0,
    },
    
    particles: {
      enabled: false,
      type: "none",
      count: 0,
      color: "#ffffff",
      size: 0,
      speed: 0,
    },
    
    soundscape: {
      ambient: null,
      volume: 0,
      effects: [],
    },
    
    sphereSkin: {
      material: {
        color: "#2a2a2a",
        metalness: 0.8,
        roughness: 0.2,
      },
      accentMaterial: {
        color: "#3EB4A2",
        metalness: 0.5,
        roughness: 0.3,
      },
      iconStyle: "flat",
    },
    
    connectionSkin: {
      material: {
        color: "#404040",
        metalness: 0.5,
        roughness: 0.5,
      },
      style: "line",
      animated: false,
      particleTrail: false,
    },
    
    diamondSkin: {
      material: {
        color: "#D8B26A",
        metalness: 0.9,
        roughness: 0.1,
      },
      innerGlow: "#D8B26A",
      outerGlow: "#D8B26A33",
      rotationSpeed: 0.5,
      scale: 1.0,
    },
    
    background: {
      type: "solid",
      value: "#0a0a0a",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. FUTURISTIC
  // ─────────────────────────────────────────────────────────────────────────
  futuristic: {
    id: "futuristic",
    name: "Futuristic",
    nameFr: "Futuriste",
    description: "Cyberpunk aesthetic with neon and holograms",
    
    colors: {
      primary: "#0a0a1a",
      secondary: "#1a1a3a",
      accent: "#00ffff",
      background: "#000011",
      text: "#00ffff",
      glow: "#ff00ff",
    },
    
    lighting: {
      ambient: "#000033",
      ambientIntensity: 0.2,
      directional: "#00ffff",
      directionalIntensity: 1.5,
      pointLights: [
        { color: "#ff00ff", intensity: 0.5, position: { x: -5, y: 3, z: 0 } },
        { color: "#00ffff", intensity: 0.5, position: { x: 5, y: 3, z: 0 } },
      ],
    },
    
    particles: {
      enabled: true,
      type: "pixels",
      count: 500,
      color: "#00ffff",
      size: 0.02,
      speed: 0.5,
    },
    
    soundscape: {
      ambient: "synthwave_ambient",
      volume: 0.3,
      effects: ["digital_hum", "data_stream"],
    },
    
    sphereSkin: {
      material: {
        color: "#0a0a1a",
        metalness: 0.9,
        roughness: 0.1,
        emissive: "#001122",
        emissiveIntensity: 0.3,
      },
      accentMaterial: {
        color: "#00ffff",
        metalness: 0.2,
        roughness: 0.1,
        emissive: "#00ffff",
        emissiveIntensity: 1.0,
      },
      glowColor: "#00ffff",
      iconStyle: "hologram",
    },
    
    connectionSkin: {
      material: {
        color: "#00ffff",
        metalness: 0.0,
        roughness: 0.0,
        emissive: "#00ffff",
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
      },
      style: "beam",
      animated: true,
      particleTrail: true,
    },
    
    diamondSkin: {
      material: {
        color: "#ffffff",
        metalness: 1.0,
        roughness: 0.0,
        emissive: "#00ffff",
        emissiveIntensity: 0.5,
      },
      innerGlow: "#00ffff",
      outerGlow: "#ff00ff",
      rotationSpeed: 2.0,
      scale: 1.2,
    },
    
    background: {
      type: "procedural",
      value: "grid_horizon",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. NATURAL / HUMAN
  // ─────────────────────────────────────────────────────────────────────────
  natural: {
    id: "natural",
    name: "Natural",
    nameFr: "Naturel",
    description: "Organic aesthetic with wood, stone and vegetation",
    
    colors: {
      primary: "#8B4513",
      secondary: "#D2B48C",
      accent: "#228B22",
      background: "#1a0f05",
      text: "#f5deb3",
    },
    
    lighting: {
      ambient: "#3d2817",
      ambientIntensity: 0.5,
      directional: "#ffd700",
      directionalIntensity: 0.8,
      pointLights: [
        { color: "#ff6600", intensity: 0.3, position: { x: 0, y: 5, z: 0 } },
      ],
    },
    
    particles: {
      enabled: true,
      type: "pollen",
      count: 200,
      color: "#ffd700",
      size: 0.03,
      speed: 0.1,
    },
    
    soundscape: {
      ambient: "forest_ambient",
      volume: 0.4,
      effects: ["birds", "wind_leaves", "water_stream"],
    },
    
    sphereSkin: {
      material: {
        color: "#8B4513",
        metalness: 0.0,
        roughness: 0.9,
      },
      accentMaterial: {
        color: "#228B22",
        metalness: 0.0,
        roughness: 0.8,
      },
      iconStyle: "organic",
    },
    
    connectionSkin: {
      material: {
        color: "#228B22",
        metalness: 0.0,
        roughness: 0.9,
      },
      style: "vine",
      animated: true,
      particleTrail: false,
    },
    
    diamondSkin: {
      material: {
        color: "#D8B26A",
        metalness: 0.3,
        roughness: 0.5,
      },
      innerGlow: "#ffd700",
      outerGlow: "#ff660033",
      rotationSpeed: 0.2,
      scale: 1.0,
    },
    
    background: {
      type: "gradient",
      value: ["#1a0f05", "#2d1f10", "#1a0f05"],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. ASTRAL / ABSTRACT
  // ─────────────────────────────────────────────────────────────────────────
  astral: {
    id: "astral",
    name: "Astral",
    nameFr: "Astral",
    description: "Cosmic aesthetic with nebulae and sacred geometry",
    
    colors: {
      primary: "#1a0033",
      secondary: "#330066",
      accent: "#D8B26A",
      background: "#050010",
      text: "#e0d0ff",
      glow: "#8844ff",
    },
    
    lighting: {
      ambient: "#110022",
      ambientIntensity: 0.3,
      directional: "#8844ff",
      directionalIntensity: 0.6,
      pointLights: [
        { color: "#D8B26A", intensity: 0.4, position: { x: 0, y: 10, z: 0 } },
        { color: "#8844ff", intensity: 0.3, position: { x: -3, y: 5, z: 3 } },
        { color: "#4488ff", intensity: 0.3, position: { x: 3, y: 5, z: -3 } },
      ],
    },
    
    particles: {
      enabled: true,
      type: "stars",
      count: 1000,
      color: "#ffffff",
      size: 0.01,
      speed: 0.02,
    },
    
    soundscape: {
      ambient: "cosmic_drone",
      volume: 0.3,
      effects: ["ethereal_chimes", "deep_resonance"],
    },
    
    sphereSkin: {
      material: {
        color: "#1a0033",
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8,
      },
      accentMaterial: {
        color: "#D8B26A",
        metalness: 0.8,
        roughness: 0.1,
        emissive: "#D8B26A",
        emissiveIntensity: 0.5,
      },
      glowColor: "#8844ff",
      iconStyle: "crystalline",
    },
    
    connectionSkin: {
      material: {
        color: "#8844ff",
        metalness: 0.0,
        roughness: 0.0,
        emissive: "#8844ff",
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
      },
      style: "energy",
      animated: true,
      particleTrail: true,
    },
    
    diamondSkin: {
      material: {
        color: "#D8B26A",
        metalness: 1.0,
        roughness: 0.0,
        emissive: "#D8B26A",
        emissiveIntensity: 0.8,
      },
      innerGlow: "#D8B26A",
      outerGlow: "#8844ff",
      rotationSpeed: 0.3,
      scale: 1.5,
    },
    
    background: {
      type: "skybox",
      value: "nebula_panorama",
    },
  },
};

// ============================================================================
// VIEW UTILITIES
// ============================================================================

/**
 * Get a Universe View by ID
 */
export function getUniverseView(id: UniverseViewId): UniverseView {
  return UNIVERSE_VIEWS[id];
}

/**
 * Get all available Universe Views
 */
export function getAllUniverseViews(): UniverseView[] {
  return Object.values(UNIVERSE_VIEWS);
}

/**
 * Apply a Universe View to the canonical map (returns rendered config)
 */
export function applyUniverseView(
  viewId: UniverseViewId
): {
  map: typeof CANONICAL_SPHERE_MAP;
  view: UniverseView;
} {
  return {
    map: CANONICAL_SPHERE_MAP,
    view: UNIVERSE_VIEWS[viewId],
  };
}

/**
 * User preference for Universe View
 */
export interface UserUniversePreference {
  defaultView: UniverseViewId;
  perSphereOverrides?: Partial<Record<SphereKey, UniverseViewId>>;
  transitionSpeed: "instant" | "smooth" | "cinematic";
  soundEnabled: boolean;
  particlesEnabled: boolean;
}

/**
 * Default user preference
 */
export const DEFAULT_UNIVERSE_PREFERENCE: UserUniversePreference = {
  defaultView: "regular",
  transitionSpeed: "smooth",
  soundEnabled: false,
  particlesEnabled: true,
};

export default UNIVERSE_VIEWS;
