/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — PBR MATERIALS SYSTEM
 * Physically Based Rendering materials library with texture management
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import type {
  PBRMaterialConfig,
  PBRTextureMaps,
  MaterialPreset,
  MaterialLibraryEntry,
  MaterialLibraryStats,
  TextureLoaderOptions,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// PBR MATERIAL LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

export class PBRMaterialLibrary {
  private materials: Map<string, MaterialLibraryEntry> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private textureLoader: THREE.TextureLoader;
  private defaultOptions: TextureLoaderOptions;

  constructor(options?: TextureLoaderOptions) {
    this.textureLoader = new THREE.TextureLoader();
    this.defaultOptions = {
      basePath: '/assets/textures/',
      compression: 'webp',
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      maxFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      anisotropy: 16,
      encoding: THREE.sRGBEncoding,
      cache: true,
      fallback: 'default',
      ...options,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEXTURE LOADING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Load a single texture with caching
   */
  private async loadTexture(
    path: string,
    options?: Partial<TextureLoaderOptions>
  ): Promise<THREE.Texture | null> {
    const opts = { ...this.defaultOptions, ...options };
    const fullPath = opts.basePath + path;

    // Check cache
    if (opts.cache && this.textureCache.has(fullPath)) {
      return this.textureCache.get(fullPath)!.clone();
    }

    try {
      return new Promise((resolve, reject) => {
        this.textureLoader.load(
          fullPath,
          (texture) => {
            // Configure texture
            texture.minFilter = opts.minFilter!;
            texture.maxFilter = opts.maxFilter!;
            texture.wrapS = opts.wrapS!;
            texture.wrapT = opts.wrapT!;
            texture.anisotropy = opts.anisotropy!;
            texture.encoding = opts.encoding!;
            texture.generateMipmaps = opts.generateMipmaps!;

            // Cache texture
            if (opts.cache) {
              this.textureCache.set(fullPath, texture);
            }

            resolve(texture);
          },
          undefined,
          (error) => {
            console.warn(`Failed to load texture: ${fullPath}`, error);
            if (opts.fallback === 'default') {
              resolve(this.createFallbackTexture());
            } else if (opts.fallback === 'error') {
              reject(error);
            } else {
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error(`Error loading texture: ${fullPath}`, error);
      return opts.fallback === 'default' ? this.createFallbackTexture() : null;
    }
  }

  /**
   * Create a fallback procedural texture
   */
  private createFallbackTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Checkerboard pattern
    const size = 64;
    for (let y = 0; y < 512; y += size) {
      for (let x = 0; x < 512; x += size) {
        ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#999' : '#666';
        ctx.fillRect(x, y, size, size);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Load all textures for a material
   */
  private async loadTextureMaps(
    maps: PBRTextureMaps,
    basePath: string
  ): Promise<PBRTextureMaps> {
    const loadedMaps: PBRTextureMaps = {};

    const loadPromises = Object.entries(maps).map(async ([key, value]) => {
      if (typeof value === 'string') {
        const texture = await this.loadTexture(`${basePath}/${value}`);
        if (texture) {
          loadedMaps[key as keyof PBRTextureMaps] = texture;
        }
      }
    });

    await Promise.all(loadPromises);
    return loadedMaps;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MATERIAL CREATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a PBR material from configuration
   */
  async createMaterial(
    config: PBRMaterialConfig
  ): Promise<THREE.MeshStandardMaterial> {
    // Load textures if paths provided
    let loadedMaps = config.maps;
    const hasTexturePaths = Object.values(config.maps).some(
      (v) => typeof v === 'string'
    );

    if (hasTexturePaths) {
      const basePath = `${config.category}/${config.id}`;
      loadedMaps = await this.loadTextureMaps(config.maps, basePath);
    }

    // Create material
    const material = new THREE.MeshStandardMaterial({
      // Textures
      map: loadedMaps.color,
      normalMap: loadedMaps.normal,
      roughnessMap: loadedMaps.roughness,
      metalnessMap: loadedMaps.metalness,
      aoMap: loadedMaps.ao,
      displacementMap: loadedMaps.displacement,
      emissiveMap: loadedMaps.emissive,
      alphaMap: loadedMaps.alpha,

      // Base values
      color: config.color ? new THREE.Color(config.color) : new THREE.Color(0xffffff),
      roughness: config.roughness ?? 0.5,
      metalness: config.metalness ?? 0.0,

      // Scales and intensities
      normalScale: config.normalScale ?? new THREE.Vector2(1, 1),
      displacementScale: config.displacementScale ?? 0.1,
      aoMapIntensity: config.aoMapIntensity ?? 1.0,
      emissive: config.emissiveColor ? new THREE.Color(config.emissiveColor) : new THREE.Color(0x000000),
      emissiveIntensity: config.emissiveIntensity ?? 0.0,
      envMapIntensity: config.envMapIntensity ?? 1.0,

      // Transparency
      opacity: config.opacity ?? 1.0,
      transparent: config.transparent ?? false,
      alphaTest: config.alphaTest ?? 0.0,

      // Rendering
      side: config.side ?? THREE.FrontSide,
    });

    // Name for debugging
    material.name = config.name;

    return material;
  }

  /**
   * Register a material in the library
   */
  async registerMaterial(config: PBRMaterialConfig): Promise<void> {
    try {
      const material = await this.createMaterial(config);
      this.materials.set(config.id, {
        config,
        material,
        loaded: true,
      });
    } catch (error) {
      console.error(`Failed to register material: ${config.id}`, error);
      this.materials.set(config.id, {
        config,
        material: new THREE.MeshStandardMaterial({ color: 0xff00ff }), // Magenta fallback
        loaded: false,
        error: error as Error,
      });
    }
  }

  /**
   * Get a material by ID
   */
  getMaterial(id: string): THREE.MeshStandardMaterial | null {
    const entry = this.materials.get(id);
    return entry?.material.clone() ?? null;
  }

  /**
   * Get a material preset (convenience method)
   */
  getPreset(preset: MaterialPreset): THREE.MeshStandardMaterial | null {
    return this.getMaterial(preset);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LIBRARY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Preload multiple materials
   */
  async preloadMaterials(configs: PBRMaterialConfig[]): Promise<void> {
    const promises = configs.map((config) => this.registerMaterial(config));
    await Promise.all(promises);
  }

  /**
   * Get library statistics
   */
  getStats(): MaterialLibraryStats {
    let loaded = 0;
    let errored = 0;

    this.materials.forEach((entry) => {
      if (entry.loaded) loaded++;
      if (entry.error) errored++;
    });

    return {
      totalMaterials: this.materials.size,
      loadedMaterials: loaded,
      erroredMaterials: errored,
      cacheSize: this.textureCache.size,
    };
  }

  /**
   * Clear cache and dispose materials
   */
  dispose(): void {
    // Dispose all materials
    this.materials.forEach((entry) => {
      entry.material.dispose();
    });
    this.materials.clear();

    // Dispose all cached textures
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    this.textureCache.clear();
  }

  /**
   * List all registered materials
   */
  listMaterials(): string[] {
    return Array.from(this.materials.keys());
  }

  /**
   * Check if material exists
   */
  hasMaterial(id: string): boolean {
    return this.materials.has(id);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let globalLibrary: PBRMaterialLibrary | null = null;

/**
 * Get the global PBR material library instance
 */
export function getPBRLibrary(): PBRMaterialLibrary {
  if (!globalLibrary) {
    globalLibrary = new PBRMaterialLibrary();
  }
  return globalLibrary;
}

/**
 * Reset the global library (useful for testing)
 */
export function resetPBRLibrary(): void {
  if (globalLibrary) {
    globalLibrary.dispose();
    globalLibrary = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default PBRMaterialLibrary;
