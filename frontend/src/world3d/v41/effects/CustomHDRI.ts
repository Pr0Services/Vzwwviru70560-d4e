/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 POLISH — CUSTOM HDRI INTEGRATION
 * Load and manage custom HDRI environments with fallbacks
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type HDRITheme = 'normal' | 'atlean' | 'futuristic' | 'cosmic';

export interface HDRIConfig {
  theme: HDRITheme;
  url: string;
  fallbackColor: THREE.Color;
  intensity: number;
  rotation: number;         // Y-axis rotation in radians
  blur: number;            // 0.0 to 1.0
  backgroundIntensity?: number;
}

export interface HDRILoadResult {
  texture: THREE.Texture | null;
  usedFallback: boolean;
  loadTime: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HDRI CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const HDRI_CONFIGS: Record<HDRITheme, HDRIConfig> = {
  // NORMAL - Studio white
  normal: {
    theme: 'normal',
    url: '/assets/hdri/studio_neutral.hdr',
    fallbackColor: new THREE.Color(0xF5F5F5),
    intensity: 1.0,
    rotation: 0,
    blur: 0.0,
  },

  // ATLEAN - Jungle golden hour
  atlean: {
    theme: 'atlean',
    url: '/assets/hdri/jungle_golden_hour.hdr',
    fallbackColor: new THREE.Color(0xE9D5B5), // Warm golden
    intensity: 1.2,
    rotation: Math.PI * 0.5,
    blur: 0.1,
    backgroundIntensity: 0.3,
  },

  // FUTURISTIC - Cyber city night
  futuristic: {
    theme: 'futuristic',
    url: '/assets/hdri/cyber_city_night.hdr',
    fallbackColor: new THREE.Color(0x1A1A2E), // Dark blue-black
    intensity: 0.6,
    rotation: Math.PI * 0.25,
    blur: 0.05,
    backgroundIntensity: 0.2,
  },

  // COSMIC - Deep space nebula
  cosmic: {
    theme: 'cosmic',
    url: '/assets/hdri/nebula_space.hdr',
    fallbackColor: new THREE.Color(0x0F0A1F), // Deep purple-black
    intensity: 0.5,
    rotation: 0,
    blur: 0.2,
    backgroundIntensity: 0.4,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HDRI MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class HDRIManager {
  private static instance: HDRIManager;
  
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private loader: RGBELoader;
  
  // Cache
  private cache: Map<string, THREE.Texture> = new Map();
  private currentTheme: HDRITheme = 'normal';
  private loadingPromises: Map<string, Promise<HDRILoadResult>> = new Map();

  private constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.loader = new RGBELoader();
    
    // Configure PMREMGenerator for HDRI
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
  }

  static getInstance(scene?: THREE.Scene, renderer?: THREE.WebGLRenderer): HDRIManager {
    if (!HDRIManager.instance) {
      if (!scene || !renderer) {
        throw new Error('HDRIManager requires scene and renderer on first initialization');
      }
      HDRIManager.instance = new HDRIManager(scene, renderer);
    }
    return HDRIManager.instance;
  }

  /**
   * Load HDRI for theme with fallback
   */
  async loadHDRI(theme: HDRITheme): Promise<HDRILoadResult> {
    const config = HDRI_CONFIGS[theme];
    const startTime = performance.now();

    console.log(`🌅 Loading HDRI: ${theme} (${config.url})`);

    // Check cache
    if (this.cache.has(config.url)) {
      console.log(`✅ HDRI loaded from cache: ${theme}`);
      const texture = this.cache.get(config.url)!;
      this.applyHDRI(texture, config);
      
      return {
        texture,
        usedFallback: false,
        loadTime: performance.now() - startTime,
      };
    }

    // Check if already loading
    if (this.loadingPromises.has(config.url)) {
      console.log(`⏳ HDRI already loading, waiting: ${theme}`);
      return this.loadingPromises.get(config.url)!;
    }

    // Start loading
    const loadPromise = this.performLoad(config, startTime);
    this.loadingPromises.set(config.url, loadPromise);

    const result = await loadPromise;
    this.loadingPromises.delete(config.url);

    return result;
  }

  /**
   * Perform actual HDRI load
   */
  private async performLoad(
    config: HDRIConfig,
    startTime: number
  ): Promise<HDRILoadResult> {
    try {
      // Attempt to load HDRI
      const texture = await this.loader.loadAsync(config.url);
      
      // Configure texture
      texture.mapping = THREE.EquirectangularReflectionMapping;
      
      // Cache it
      this.cache.set(config.url, texture);
      
      // Apply to scene
      this.applyHDRI(texture, config);
      
      const loadTime = performance.now() - startTime;
      console.log(`✅ HDRI loaded: ${config.theme} (${loadTime.toFixed(0)}ms)`);
      
      return {
        texture,
        usedFallback: false,
        loadTime,
      };
      
    } catch (error) {
      console.warn(`⚠️ HDRI load failed: ${config.url}`, error);
      console.log(`🔄 Using fallback color for ${config.theme}`);
      
      // Use fallback
      this.applyFallback(config);
      
      const loadTime = performance.now() - startTime;
      
      return {
        texture: null,
        usedFallback: true,
        loadTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Apply HDRI texture to scene
   */
  private applyHDRI(texture: THREE.Texture, config: HDRIConfig): void {
    // Generate environment map using PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    
    // Apply to scene
    this.scene.environment = envMap;
    
    // Optionally use as background
    if (config.backgroundIntensity !== undefined && config.backgroundIntensity > 0) {
      this.scene.background = envMap;
    } else {
      this.scene.background = null;
    }
    
    // Clean up
    pmremGenerator.dispose();
    
    this.currentTheme = config.theme;
  }

  /**
   * Apply fallback color when HDRI fails to load
   */
  private applyFallback(config: HDRIConfig): void {
    // Create solid color background
    this.scene.background = config.fallbackColor;
    
    // Create basic environment for reflections
    const scene = new THREE.Scene();
    scene.background = config.fallbackColor;
    
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const envMap = pmremGenerator.fromScene(scene).texture;
    
    this.scene.environment = envMap;
    
    pmremGenerator.dispose();
    
    this.currentTheme = config.theme;
  }

  /**
   * Preload all HDRIs
   */
  async preloadAll(themes?: HDRITheme[]): Promise<void> {
    const themesToLoad = themes || (['normal', 'atlean', 'futuristic', 'cosmic'] as HDRITheme[]);
    
    console.log(`🌅 Preloading ${themesToLoad.length} HDRIs...`);
    
    const promises = themesToLoad.map(theme => this.loadHDRI(theme));
    await Promise.all(promises);
    
    console.log(`✅ All HDRIs preloaded`);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): HDRITheme {
    return this.currentTheme;
  }

  /**
   * Get HDRI config for theme
   */
  getConfig(theme: HDRITheme): HDRIConfig {
    return HDRI_CONFIGS[theme];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
    console.log('🧹 HDRI cache cleared');
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { count: number; themes: HDRITheme[] } {
    const themes: HDRITheme[] = [];
    
    Object.entries(HDRI_CONFIGS).forEach(([theme, config]) => {
      if (this.cache.has(config.url)) {
        themes.push(theme as HDRITheme);
      }
    });
    
    return {
      count: this.cache.size,
      themes,
    };
  }

  /**
   * Dispose manager
   */
  dispose(): void {
    this.clearCache();
    this.loadingPromises.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize HDRI system
 */
export function initHDRI(scene: THREE.Scene, renderer: THREE.WebGLRenderer): HDRIManager {
  return HDRIManager.getInstance(scene, renderer);
}

/**
 * Load HDRI for theme
 */
export async function loadHDRIForTheme(theme: HDRITheme): Promise<HDRILoadResult> {
  const manager = HDRIManager.getInstance();
  return manager.loadHDRI(theme);
}

/**
 * Preload all HDRIs in background
 */
export async function preloadAllHDRIs(): Promise<void> {
  const manager = HDRIManager.getInstance();
  return manager.preloadAll();
}

/**
 * Get HDRI config
 */
export function getHDRIConfig(theme: HDRITheme): HDRIConfig {
  return HDRI_CONFIGS[theme];
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOMMENDED HDRI SOURCES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Recommended free HDRI sources for CHE·NU themes:
 * 
 * 1. Poly Haven (polyhaven.com) - CC0, high quality
 *    - ATLEAN: "forest_slope_2k.hdr" or "belfast_sunset_puresky_2k.hdr"
 *    - FUTURISTIC: "neon_photostudio_2k.hdr" or "shanghai_bund_2k.hdr"
 *    - COSMIC: "starmap_2020_4k.hdr" or "kloppenheim_02_2k.hdr"
 * 
 * 2. HDRI Haven (hdrihaven.com) - CC0
 *    - Wide selection of environments
 * 
 * 3. Generate with AI:
 *    - Midjourney: "equirectangular 360 panorama [description] --ar 2:1"
 *    - DALL-E: "360 degree panorama [description]"
 *    - Convert to .hdr with tools like Photoshop or online converters
 * 
 * File placement:
 * /public/assets/hdri/
 *   ├── studio_neutral.hdr (NORMAL)
 *   ├── jungle_golden_hour.hdr (ATLEAN)
 *   ├── cyber_city_night.hdr (FUTURISTIC)
 *   └── nebula_space.hdr (COSMIC)
 * 
 * Recommended resolution: 2K (2048x1024) for web, 4K for desktop app
 */

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default HDRIManager;
