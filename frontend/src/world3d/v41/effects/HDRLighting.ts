/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 PHASE 3 — HDR LIGHTING SYSTEM
 * HDRI environments, tone mapping, and theme-specific lighting presets
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type LightingTheme = 'normal' | 'atlean' | 'futuristic' | 'cosmic';

export interface LightingPreset {
  theme: LightingTheme;
  name: string;
  ambient: {
    color: number;
    intensity: number;
  };
  directional: {
    color: number;
    intensity: number;
    position: THREE.Vector3;
    castShadow: boolean;
  };
  hemispheric?: {
    skyColor: number;
    groundColor: number;
    intensity: number;
  };
  fog?: {
    color: number;
    near: number;
    far: number;
  };
  environmentMap?: string; // HDRI path
  exposure?: number;
  toneMapping?: THREE.ToneMapping;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const LIGHTING_PRESETS: Record<LightingTheme, LightingPreset> = {
  // NORMAL THEME - Studio/Office lighting
  normal: {
    theme: 'normal',
    name: 'Studio Neutral',
    ambient: {
      color: 0xFFFFFF,
      intensity: 0.4,
    },
    directional: {
      color: 0xFFFFFF,
      intensity: 0.8,
      position: new THREE.Vector3(10, 20, 10),
      castShadow: true,
    },
    hemispheric: {
      skyColor: 0xB1E1FF,
      groundColor: 0xB97A20,
      intensity: 0.3,
    },
    fog: {
      color: 0xCCCCCC,
      near: 50,
      far: 200,
    },
    exposure: 1.0,
    toneMapping: THREE.ACESFilmicToneMapping,
  },

  // ATLEAN THEME - Golden hour jungle/temple
  atlean: {
    theme: 'atlean',
    name: 'Golden Hour Jungle',
    ambient: {
      color: 0xD8B26A, // Sacred Gold
      intensity: 0.5,
    },
    directional: {
      color: 0xFFE4A0, // Warm golden
      intensity: 1.2,
      position: new THREE.Vector3(15, 30, -10), // Low angle sun
      castShadow: true,
    },
    hemispheric: {
      skyColor: 0xFFD4A0, // Golden sky
      groundColor: 0x3F7249, // Jungle Emerald
      intensity: 0.6,
    },
    fog: {
      color: 0xE9E4D6, // Soft Sand mist
      near: 30,
      far: 150,
    },
    environmentMap: '/hdri/jungle_golden_hour.hdr',
    exposure: 1.3,
    toneMapping: THREE.ACESFilmicToneMapping,
  },

  // FUTURISTIC THEME - Neon city night
  futuristic: {
    theme: 'futuristic',
    name: 'Neon City Night',
    ambient: {
      color: 0x0A0A0A, // Almost black
      intensity: 0.2,
    },
    directional: {
      color: 0x00F0FF, // Cyan neon
      intensity: 0.6,
      position: new THREE.Vector3(5, 10, 5),
      castShadow: true,
    },
    hemispheric: {
      skyColor: 0x1a1a2e, // Dark purple-blue
      groundColor: 0x16213e, // Dark blue
      intensity: 0.4,
    },
    fog: {
      color: 0x0F0F1E, // Dark with purple tint
      near: 20,
      far: 100,
    },
    environmentMap: '/hdri/cyber_city_night.hdr',
    exposure: 1.5,
    toneMapping: THREE.ReinhardToneMapping,
  },

  // COSMIC THEME - Deep space
  cosmic: {
    theme: 'cosmic',
    name: 'Deep Space',
    ambient: {
      color: 0x1E3A8A, // Bleu galaxie
      intensity: 0.3,
    },
    directional: {
      color: 0x00CED1, // Cyan étoile
      intensity: 0.5,
      position: new THREE.Vector3(0, 10, 20),
      castShadow: false, // No shadows in space
    },
    hemispheric: {
      skyColor: 0x000000, // Pure black
      groundColor: 0x6B2F8A, // Violet nébuleuse
      intensity: 0.5,
    },
    fog: {
      color: 0x000000,
      near: 100,
      far: 500,
    },
    environmentMap: '/hdri/nebula_space.hdr',
    exposure: 2.0,
    toneMapping: THREE.ACESFilmicToneMapping,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HDR ENVIRONMENT LOADER
// ═══════════════════════════════════════════════════════════════════════════════

export class HDREnvironmentLoader {
  private loader: RGBELoader;
  private cache: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.loader = new RGBELoader();
    this.loader.setPath('/assets/hdri/');
  }

  async load(path: string): Promise<THREE.Texture | null> {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    try {
      const texture = await this.loader.loadAsync(path);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.cache.set(path, texture);
      return texture;
    } catch (error) {
      console.warn(`Failed to load HDRI: ${path}`, error);
      return null;
    }
  }

  dispose(): void {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class LightingManager {
  private static instance: LightingManager;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private currentTheme: LightingTheme = 'normal';
  private hdriLoader: HDREnvironmentLoader;

  // Lights
  private ambientLight: THREE.AmbientLight | null = null;
  private directionalLight: THREE.DirectionalLight | null = null;
  private hemisphereLight: THREE.HemisphereLight | null = null;

  private constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.hdriLoader = new HDREnvironmentLoader();
  }

  static getInstance(scene?: THREE.Scene, renderer?: THREE.WebGLRenderer): LightingManager {
    if (!LightingManager.instance) {
      if (!scene || !renderer) {
        throw new Error('LightingManager requires scene and renderer on first initialization');
      }
      LightingManager.instance = new LightingManager(scene, renderer);
    }
    return LightingManager.instance;
  }

  async applyPreset(theme: LightingTheme): Promise<void> {
    const preset = LIGHTING_PRESETS[theme];
    if (!preset) {
      console.error(`Unknown lighting theme: ${theme}`);
      return;
    }

    console.log(`🌟 Applying lighting preset: ${preset.name}`);

    // Clear existing lights
    this.clearLights();

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(
      preset.ambient.color,
      preset.ambient.intensity
    );
    this.scene.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(
      preset.directional.color,
      preset.directional.intensity
    );
    this.directionalLight.position.copy(preset.directional.position);
    this.directionalLight.castShadow = preset.directional.castShadow;

    if (preset.directional.castShadow) {
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
      this.directionalLight.shadow.camera.near = 0.5;
      this.directionalLight.shadow.camera.far = 500;
      this.directionalLight.shadow.camera.left = -50;
      this.directionalLight.shadow.camera.right = 50;
      this.directionalLight.shadow.camera.top = 50;
      this.directionalLight.shadow.camera.bottom = -50;
    }

    this.scene.add(this.directionalLight);

    // Hemisphere light
    if (preset.hemispheric) {
      this.hemisphereLight = new THREE.HemisphereLight(
        preset.hemispheric.skyColor,
        preset.hemispheric.groundColor,
        preset.hemispheric.intensity
      );
      this.scene.add(this.hemisphereLight);
    }

    // Fog
    if (preset.fog) {
      this.scene.fog = new THREE.Fog(
        preset.fog.color,
        preset.fog.near,
        preset.fog.far
      );
    } else {
      this.scene.fog = null;
    }

    // Tone mapping
    if (preset.toneMapping) {
      this.renderer.toneMapping = preset.toneMapping;
      this.renderer.toneMappingExposure = preset.exposure || 1.0;
    }

    // Environment map (HDRI)
    if (preset.environmentMap) {
      const envMap = await this.hdriLoader.load(preset.environmentMap);
      if (envMap) {
        this.scene.environment = envMap;
        this.scene.background = envMap;
      }
    } else {
      // Clear background or set solid color
      this.scene.environment = null;
      if (theme === 'cosmic') {
        this.scene.background = new THREE.Color(0x000000); // Black for space
      } else if (theme === 'futuristic') {
        this.scene.background = new THREE.Color(0x0A0A0A); // Almost black
      } else {
        this.scene.background = new THREE.Color(0xCCCCCC); // Light gray
      }
    }

    this.currentTheme = theme;
    console.log(`✅ Lighting preset applied: ${preset.name}`);
  }

  private clearLights(): void {
    if (this.ambientLight) {
      this.scene.remove(this.ambientLight);
      this.ambientLight = null;
    }
    if (this.directionalLight) {
      this.scene.remove(this.directionalLight);
      this.directionalLight = null;
    }
    if (this.hemisphereLight) {
      this.scene.remove(this.hemisphereLight);
      this.hemisphereLight = null;
    }
  }

  getCurrentTheme(): LightingTheme {
    return this.currentTheme;
  }

  // Update specific light properties
  updateAmbientIntensity(intensity: number): void {
    if (this.ambientLight) {
      this.ambientLight.intensity = intensity;
    }
  }

  updateDirectionalIntensity(intensity: number): void {
    if (this.directionalLight) {
      this.directionalLight.intensity = intensity;
    }
  }

  updateExposure(exposure: number): void {
    this.renderer.toneMappingExposure = exposure;
  }

  // Smooth transition between themes
  async transitionToTheme(newTheme: LightingTheme, duration: number = 2000): Promise<void> {
    // TODO: Implement smooth transition with tweening
    // For now, instant switch
    await this.applyPreset(newTheme);
  }

  dispose(): void {
    this.clearLights();
    this.hdriLoader.dispose();
    this.scene.fog = null;
    this.scene.environment = null;
    this.scene.background = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESSING EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface BloomSettings {
  threshold: number;
  strength: number;
  radius: number;
}

export const BLOOM_PRESETS: Record<LightingTheme, BloomSettings> = {
  normal: {
    threshold: 0.9,
    strength: 0.3,
    radius: 0.5,
  },
  atlean: {
    threshold: 0.7,
    strength: 0.5,
    radius: 0.8,
  },
  futuristic: {
    threshold: 0.5,
    strength: 1.2,
    radius: 1.0,
  },
  cosmic: {
    threshold: 0.4,
    strength: 1.5,
    radius: 1.2,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function initLighting(scene: THREE.Scene, renderer: THREE.WebGLRenderer): LightingManager {
  const manager = LightingManager.getInstance(scene, renderer);
  
  // Apply default (normal) lighting
  manager.applyPreset('normal');
  
  return manager;
}

export async function setLightingTheme(theme: LightingTheme): Promise<void> {
  const manager = LightingManager.getInstance();
  await manager.applyPreset(theme);
}

export function getLightingPreset(theme: LightingTheme): LightingPreset {
  return LIGHTING_PRESETS[theme];
}

export function getBloomSettings(theme: LightingTheme): BloomSettings {
  return BLOOM_PRESETS[theme];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default LightingManager;
