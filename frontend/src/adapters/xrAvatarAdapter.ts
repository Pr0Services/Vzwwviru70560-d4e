/**
 * ============================================================
 * CHE·NU — XR ADAPTER — AVATAR ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Adapter for XR avatar configurations, presets, and customization.
 */

// ============================================================
// TYPES
// ============================================================

export type AvatarStyle = 
  | "humanoid"
  | "abstract"
  | "geometric"
  | "organic"
  | "minimal"
  | "robotic";

export type AvatarRole = 
  | "user"
  | "nova"
  | "director"
  | "guide"
  | "assistant"
  | "participant";

export type AvatarExpression = 
  | "neutral"
  | "happy"
  | "thinking"
  | "focused"
  | "welcoming"
  | "concerned";

export type AvatarAnimation = 
  | "idle"
  | "talking"
  | "walking"
  | "waving"
  | "pointing"
  | "nodding"
  | "thinking";

export interface AvatarColors {
  primary: string;
  secondary: string;
  accent: string;
  glow?: string;
}

export interface AvatarAppearance {
  style: AvatarStyle;
  height: number;
  colors: AvatarColors;
  opacity: number;
  glow: boolean;
  glowIntensity?: number;
}

export interface AvatarAccessory {
  id: string;
  name: string;
  type: "headwear" | "eyewear" | "neckwear" | "handwear" | "badge" | "aura";
  position: "head" | "face" | "neck" | "hand" | "chest" | "body";
  color?: string;
  visible: boolean;
}

export interface AvatarVoice {
  id: string;
  name: string;
  language: string;
  pitch: number;
  speed: number;
  volume: number;
}

export interface XRAvatar {
  id: string;
  name: string;
  role: AvatarRole;
  appearance: AvatarAppearance;
  expression: AvatarExpression;
  currentAnimation: AvatarAnimation;
  accessories: AvatarAccessory[];
  voice?: AvatarVoice;
  bio?: string;
  active: boolean;
  createdAt: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  description: string;
  role: AvatarRole;
  style: AvatarStyle;
  thumbnail: string;
  appearance: AvatarAppearance;
  defaultAccessories: string[];
}

export interface NovaDirector {
  id: string;
  name: string;
  title: string;
  sphere: string;
  avatar: XRAvatar;
  specialization: string[];
  personality: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_AVATARS: XRAvatar[] = [
  {
    id: "avatar-user-default",
    name: "User Avatar",
    role: "user",
    appearance: {
      style: "humanoid",
      height: 1.75,
      colors: {
        primary: "#3EB4A2",
        secondary: "#2F4C39",
        accent: "#D8B26A"
      },
      opacity: 1.0,
      glow: false
    },
    expression: "neutral",
    currentAnimation: "idle",
    accessories: [
      {
        id: "acc-badge-user",
        name: "User Badge",
        type: "badge",
        position: "chest",
        color: "#3EB4A2",
        visible: true
      }
    ],
    active: true,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "avatar-nova-main",
    name: "Nova",
    role: "nova",
    appearance: {
      style: "abstract",
      height: 1.80,
      colors: {
        primary: "#D8B26A",
        secondary: "#1E1F22",
        accent: "#3EB4A2",
        glow: "#D8B26A"
      },
      opacity: 0.95,
      glow: true,
      glowIntensity: 0.6
    },
    expression: "welcoming",
    currentAnimation: "idle",
    accessories: [
      {
        id: "acc-aura-nova",
        name: "Nova Aura",
        type: "aura",
        position: "body",
        color: "#D8B26A",
        visible: true
      }
    ],
    voice: {
      id: "voice-nova",
      name: "Nova Voice",
      language: "en-US",
      pitch: 1.0,
      speed: 1.0,
      volume: 0.8
    },
    bio: "Your intelligent assistant and guide through the CHE·NU universe",
    active: true,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "avatar-director-personal",
    name: "Sage",
    role: "director",
    appearance: {
      style: "organic",
      height: 1.70,
      colors: {
        primary: "#3EB4A2",
        secondary: "#E9E4D6",
        accent: "#3F7249",
        glow: "#3EB4A2"
      },
      opacity: 0.9,
      glow: true,
      glowIntensity: 0.4
    },
    expression: "welcoming",
    currentAnimation: "idle",
    accessories: [],
    bio: "Director of Personal Sphere - wellness and life balance",
    active: true,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "avatar-director-creative",
    name: "Muse",
    role: "director",
    appearance: {
      style: "abstract",
      height: 1.72,
      colors: {
        primary: "#9B59B6",
        secondary: "#E9E4D6",
        accent: "#D8B26A",
        glow: "#9B59B6"
      },
      opacity: 0.9,
      glow: true,
      glowIntensity: 0.5
    },
    expression: "happy",
    currentAnimation: "idle",
    accessories: [],
    bio: "Director of Creative Sphere - inspiration and artistry",
    active: true,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "avatar-director-business",
    name: "Strategist",
    role: "director",
    appearance: {
      style: "geometric",
      height: 1.82,
      colors: {
        primary: "#2C3E50",
        secondary: "#E9E4D6",
        accent: "#D8B26A",
        glow: "#D8B26A"
      },
      opacity: 0.95,
      glow: true,
      glowIntensity: 0.3
    },
    expression: "focused",
    currentAnimation: "idle",
    accessories: [],
    bio: "Director of Business Sphere - strategy and growth",
    active: true,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "avatar-guide-education",
    name: "Scholar",
    role: "guide",
    appearance: {
      style: "humanoid",
      height: 1.68,
      colors: {
        primary: "#3498DB",
        secondary: "#E9E4D6",
        accent: "#F39C12"
      },
      opacity: 0.9,
      glow: false
    },
    expression: "thinking",
    currentAnimation: "idle",
    accessories: [
      {
        id: "acc-eyewear-scholar",
        name: "Scholar Glasses",
        type: "eyewear",
        position: "face",
        visible: true
      }
    ],
    bio: "Guide for Education Sphere - learning and discovery",
    active: true,
    createdAt: "2024-01-10T00:00:00Z"
  }
];

const MOCK_PRESETS: AvatarPreset[] = [
  {
    id: "preset-humanoid-standard",
    name: "Standard Human",
    description: "A balanced humanoid avatar with natural proportions",
    role: "user",
    style: "humanoid",
    thumbnail: "preset_humanoid.jpg",
    appearance: {
      style: "humanoid",
      height: 1.75,
      colors: {
        primary: "#3EB4A2",
        secondary: "#2F4C39",
        accent: "#D8B26A"
      },
      opacity: 1.0,
      glow: false
    },
    defaultAccessories: []
  },
  {
    id: "preset-abstract-glow",
    name: "Abstract Glow",
    description: "An ethereal abstract form with soft luminescence",
    role: "assistant",
    style: "abstract",
    thumbnail: "preset_abstract.jpg",
    appearance: {
      style: "abstract",
      height: 1.70,
      colors: {
        primary: "#D8B26A",
        secondary: "#1E1F22",
        accent: "#3EB4A2",
        glow: "#D8B26A"
      },
      opacity: 0.9,
      glow: true,
      glowIntensity: 0.5
    },
    defaultAccessories: ["acc-aura-soft"]
  },
  {
    id: "preset-geometric-sharp",
    name: "Geometric Sharp",
    description: "A precise geometric form with clean angles",
    role: "director",
    style: "geometric",
    thumbnail: "preset_geometric.jpg",
    appearance: {
      style: "geometric",
      height: 1.80,
      colors: {
        primary: "#2C3E50",
        secondary: "#E9E4D6",
        accent: "#E74C3C"
      },
      opacity: 1.0,
      glow: false
    },
    defaultAccessories: []
  },
  {
    id: "preset-organic-flow",
    name: "Organic Flow",
    description: "A fluid organic form inspired by nature",
    role: "guide",
    style: "organic",
    thumbnail: "preset_organic.jpg",
    appearance: {
      style: "organic",
      height: 1.65,
      colors: {
        primary: "#3F7249",
        secondary: "#E9E4D6",
        accent: "#3EB4A2",
        glow: "#3F7249"
      },
      opacity: 0.85,
      glow: true,
      glowIntensity: 0.3
    },
    defaultAccessories: []
  },
  {
    id: "preset-minimal-simple",
    name: "Minimal Simple",
    description: "A clean minimal representation",
    role: "participant",
    style: "minimal",
    thumbnail: "preset_minimal.jpg",
    appearance: {
      style: "minimal",
      height: 1.70,
      colors: {
        primary: "#8D8371",
        secondary: "#E9E4D6",
        accent: "#D8B26A"
      },
      opacity: 0.8,
      glow: false
    },
    defaultAccessories: []
  },
  {
    id: "preset-robotic-tech",
    name: "Robotic Tech",
    description: "A technological robotic form",
    role: "assistant",
    style: "robotic",
    thumbnail: "preset_robotic.jpg",
    appearance: {
      style: "robotic",
      height: 1.85,
      colors: {
        primary: "#1E1F22",
        secondary: "#8D8371",
        accent: "#3EB4A2",
        glow: "#3EB4A2"
      },
      opacity: 1.0,
      glow: true,
      glowIntensity: 0.7
    },
    defaultAccessories: ["acc-visor-tech"]
  }
];

const NOVA_DIRECTORS: NovaDirector[] = [
  {
    id: "dir-personal",
    name: "Sage",
    title: "Director of Personal Sphere",
    sphere: "personal",
    avatar: MOCK_AVATARS.find(a => a.id === "avatar-director-personal")!,
    specialization: ["wellness", "life-balance", "mindfulness", "habits"],
    personality: "Calm, nurturing, and focused on holistic well-being"
  },
  {
    id: "dir-creative",
    name: "Muse",
    title: "Director of Creative Sphere",
    sphere: "creative",
    avatar: MOCK_AVATARS.find(a => a.id === "avatar-director-creative")!,
    specialization: ["art", "design", "music", "storytelling"],
    personality: "Inspiring, imaginative, and supportive of creative expression"
  },
  {
    id: "dir-business",
    name: "Strategist",
    title: "Director of Business Sphere",
    sphere: "business",
    avatar: MOCK_AVATARS.find(a => a.id === "avatar-director-business")!,
    specialization: ["strategy", "finance", "operations", "growth"],
    personality: "Analytical, decisive, and results-oriented"
  }
];

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Get all avatars
 */
export function getAllAvatars(): XRAvatar[] {
  return [...MOCK_AVATARS];
}

/**
 * Get avatar by ID
 */
export function getAvatarById(id: string): XRAvatar | undefined {
  return MOCK_AVATARS.find(avatar => avatar.id === id);
}

/**
 * Get avatars by role
 */
export function getAvatarsByRole(role: AvatarRole): XRAvatar[] {
  return MOCK_AVATARS.filter(avatar => avatar.role === role);
}

/**
 * Get active avatars
 */
export function getActiveAvatars(): XRAvatar[] {
  return MOCK_AVATARS.filter(avatar => avatar.active);
}

/**
 * Get Nova avatar
 */
export function getNovaAvatar(): XRAvatar | undefined {
  return MOCK_AVATARS.find(avatar => avatar.role === "nova");
}

/**
 * Get all presets
 */
export function getAllPresets(): AvatarPreset[] {
  return [...MOCK_PRESETS];
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): AvatarPreset | undefined {
  return MOCK_PRESETS.find(preset => preset.id === id);
}

/**
 * Get presets by style
 */
export function getPresetsByStyle(style: AvatarStyle): AvatarPreset[] {
  return MOCK_PRESETS.filter(preset => preset.style === style);
}

/**
 * Get presets by role
 */
export function getPresetsByRole(role: AvatarRole): AvatarPreset[] {
  return MOCK_PRESETS.filter(preset => preset.role === role);
}

/**
 * Get all Nova directors
 */
export function getAllDirectors(): NovaDirector[] {
  return [...NOVA_DIRECTORS];
}

/**
 * Get director by sphere
 */
export function getDirectorBySphere(sphere: string): NovaDirector | undefined {
  return NOVA_DIRECTORS.find(dir => dir.sphere === sphere);
}

/**
 * Get director by ID
 */
export function getDirectorById(id: string): NovaDirector | undefined {
  return NOVA_DIRECTORS.find(dir => dir.id === id);
}

/**
 * Get avatar count
 */
export function getAvatarCount(): number {
  return MOCK_AVATARS.length;
}

/**
 * Get preset count
 */
export function getPresetCount(): number {
  return MOCK_PRESETS.length;
}

/**
 * Get available avatar styles
 */
export function getAvailableStyles(): AvatarStyle[] {
  return ["humanoid", "abstract", "geometric", "organic", "minimal", "robotic"];
}

/**
 * Get available expressions
 */
export function getAvailableExpressions(): AvatarExpression[] {
  return ["neutral", "happy", "thinking", "focused", "welcoming", "concerned"];
}

/**
 * Get available animations
 */
export function getAvailableAnimations(): AvatarAnimation[] {
  return ["idle", "talking", "walking", "waving", "pointing", "nodding", "thinking"];
}

export default {
  getAllAvatars,
  getAvatarById,
  getAvatarsByRole,
  getActiveAvatars,
  getNovaAvatar,
  getAllPresets,
  getPresetById,
  getPresetsByStyle,
  getPresetsByRole,
  getAllDirectors,
  getDirectorBySphere,
  getDirectorById,
  getAvatarCount,
  getPresetCount,
  getAvailableStyles,
  getAvailableExpressions,
  getAvailableAnimations
};
