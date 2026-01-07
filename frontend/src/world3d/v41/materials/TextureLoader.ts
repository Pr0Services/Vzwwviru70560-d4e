/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — OPTIMIZED TEXTURE LOADER
 * Advanced texture loading with compression, caching, and lazy loading
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TEXTURE LOADER WITH OPTIMIZATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TextureLoadOptions {
  /** Enable compression (WebP preferred) */
  compression?: boolean;
  
  /** Generate mipmaps */
  mipmaps?: boolean;
  
  /** Anisotropic filtering level (1-16) */
  anisotropy?: number;
  
  /** Lazy load (load on demand) */
  lazy?: boolean;
  
  /** Priority (0-10, higher = load first) */
  priority?: number;
  
  /** Enable caching */
  cache?: boolean;
  
  /** Texture encoding */
  encoding?: THREE.TextureEncoding;
  
  /** Wrapping mode */
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  
  /** Filtering */
  minFilter?: THREE.TextureFilter;
  maxFilter?: THREE.TextureFilter;
}

interface TextureQueueItem {
  path: string;
  options: TextureLoadOptions;
  priority: number;
  resolve: (texture: THREE.Texture) => void;
  reject: (error: Error) => void;
}

export class OptimizedTextureLoader {
  private loader: THREE.TextureLoader;
  private cache: Map<string, THREE.Texture>;
  private queue: TextureQueueItem[];
  private loading: Set<string>;
  private maxConcurrent: number;
  private currentLoading: number;
  private totalLoaded: number;
  private totalFailed: number;
  private totalBytes: number;

  constructor(maxConcurrent: number = 4) {
    this.loader = new THREE.TextureLoader();
    this.cache = new Map();
    this.queue = [];
    this.loading = new Set();
    this.maxConcurrent = maxConcurrent;
    this.currentLoading = 0;
    this.totalLoaded = 0;
    this.totalFailed = 0;
    this.totalBytes = 0;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEXTURE LOADING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Load a texture with optimizations
   */
  async load(path: string, options: TextureLoadOptions = {}): Promise<THREE.Texture> {
    // Default options
    const opts: TextureLoadOptions = {
      compression: true,
      mipmaps: true,
      anisotropy: 16,
      lazy: false,
      priority: 5,
      cache: true,
      encoding: THREE.sRGBEncoding,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.LinearMipmapLinearFilter,
      maxFilter: THREE.LinearFilter,
      ...options,
    };

    // Check cache
    if (opts.cache && this.cache.has(path)) {
      console.log(`📦 Cache hit: ${path}`);
      return this.cache.get(path)!.clone();
    }

    // Determine best path (with compression support)
    const texturePath = this.getOptimalPath(path, opts.compression!);

    // Load texture
    return new Promise((resolve, reject) => {
      if (opts.lazy) {
        // Add to queue
        this.queue.push({
          path: texturePath,
          options: opts,
          priority: opts.priority!,
          resolve,
          reject,
        });
        this.processQueue();
      } else {
        // Load immediately
        this.loadTexture(texturePath, opts).then(resolve).catch(reject);
      }
    });
  }

  /**
   * Get optimal texture path (WebP if supported, fallback to original)
   */
  private getOptimalPath(path: string, useCompression: boolean): string {
    if (!useCompression) return path;

    // Check WebP support
    const supportsWebP = this.checkWebPSupport();
    
    if (supportsWebP) {
      // Replace extension with .webp
      return path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }

    return path;
  }

  /**
   * Check WebP support (cached result)
   */
  private webpSupported: boolean | null = null;
  private checkWebPSupport(): boolean {
    if (this.webpSupported !== null) return this.webpSupported;

    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      this.webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } else {
      this.webpSupported = false;
    }

    return this.webpSupported;
  }

  /**
   * Load texture (internal)
   */
  private async loadTexture(
    path: string,
    options: TextureLoadOptions
  ): Promise<THREE.Texture> {
    // Check if already loading
    if (this.loading.has(path)) {
      console.warn(`⏳ Already loading: ${path}`);
      // Wait for existing load
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!this.loading.has(path)) {
            clearInterval(checkInterval);
            if (this.cache.has(path)) {
              resolve(this.cache.get(path)!.clone());
            } else {
              reject(new Error('Texture load failed'));
            }
          }
        }, 100);
      });
    }

    this.loading.add(path);
    this.currentLoading++;

    const startTime = performance.now();

    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        this.loader.load(
          path,
          (tex) => resolve(tex),
          undefined,
          (error) => reject(error)
        );
      });

      // Configure texture
      this.configureTexture(texture, options);

      // Cache
      if (options.cache) {
        this.cache.set(path, texture);
      }

      // Stats
      const loadTime = performance.now() - startTime;
      this.totalLoaded++;
      console.log(`✅ Loaded: ${path} (${loadTime.toFixed(2)}ms)`);

      return texture;
    } catch (error) {
      this.totalFailed++;
      console.error(`❌ Failed to load: ${path}`, error);
      
      // Fallback: create placeholder texture
      return this.createPlaceholderTexture();
    } finally {
      this.loading.delete(path);
      this.currentLoading--;
      this.processQueue();
    }
  }

  /**
   * Configure texture with options
   */
  private configureTexture(texture: THREE.Texture, options: TextureLoadOptions): void {
    texture.encoding = options.encoding!;
    texture.wrapS = options.wrapS!;
    texture.wrapT = options.wrapT!;
    texture.minFilter = options.minFilter!;
    texture.maxFilter = options.maxFilter!;
    texture.anisotropy = options.anisotropy!;
    texture.generateMipmaps = options.mipmaps!;
    texture.needsUpdate = true;
  }

  /**
   * Create placeholder texture (for failed loads)
   */
  private createPlaceholderTexture(): THREE.Texture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Checkerboard pattern
    const squareSize = size / 8;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#FF00FF' : '#000000';
        ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // QUEUE MANAGEMENT (for lazy loading)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Process texture loading queue
   */
  private processQueue(): void {
    // Load up to maxConcurrent textures
    while (this.currentLoading < this.maxConcurrent && this.queue.length > 0) {
      // Sort by priority (highest first)
      this.queue.sort((a, b) => b.priority - a.priority);

      const item = this.queue.shift()!;
      
      this.loadTexture(item.path, item.options)
        .then(item.resolve)
        .catch(item.reject);
    }
  }

  /**
   * Preload multiple textures
   */
  async preload(paths: string[], options: TextureLoadOptions = {}): Promise<THREE.Texture[]> {
    console.log(`📥 Preloading ${paths.length} textures...`);
    const promises = paths.map((path) => this.load(path, { ...options, lazy: false }));
    return Promise.all(promises);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CACHE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
    console.log('🗑️ Texture cache cleared');
  }

  /**
   * Remove texture from cache
   */
  removeFromCache(path: string): void {
    const texture = this.cache.get(path);
    if (texture) {
      texture.dispose();
      this.cache.delete(path);
      console.log(`🗑️ Removed from cache: ${path}`);
    }
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      totalLoaded: this.totalLoaded,
      totalFailed: this.totalFailed,
      currentLoading: this.currentLoading,
      queueSize: this.queue.length,
      totalBytes: this.totalBytes,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MEMORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Dispose all resources
   */
  dispose(): void {
    this.clearCache();
    this.queue = [];
    this.loading.clear();
    console.log('🗑️ TextureLoader disposed');
  }

  /**
   * Get estimated memory usage (rough approximation)
   */
  getMemoryUsage(): number {
    let totalPixels = 0;
    
    this.cache.forEach((texture) => {
      if (texture.image) {
        const width = texture.image.width || 512;
        const height = texture.image.height || 512;
        totalPixels += width * height;
      }
    });

    // Assume 4 bytes per pixel (RGBA)
    // Plus mipmaps (approximately 1.33x)
    const bytesPerPixel = 4;
    const mipmapMultiplier = 1.33;
    
    return totalPixels * bytesPerPixel * mipmapMultiplier;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

let globalLoader: OptimizedTextureLoader | null = null;

/**
 * Get global texture loader instance
 */
export function getTextureLoader(): OptimizedTextureLoader {
  if (!globalLoader) {
    globalLoader = new OptimizedTextureLoader(4); // Max 4 concurrent loads
  }
  return globalLoader;
}

/**
 * Reset global loader
 */
export function resetTextureLoader(): void {
  if (globalLoader) {
    globalLoader.dispose();
    globalLoader = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load texture with default options
 */
export async function loadTexture(path: string): Promise<THREE.Texture> {
  const loader = getTextureLoader();
  return loader.load(path);
}

/**
 * Preload textures
 */
export async function preloadTextures(paths: string[]): Promise<THREE.Texture[]> {
  const loader = getTextureLoader();
  return loader.preload(paths);
}

/**
 * Get texture loader stats
 */
export function getTextureStats() {
  const loader = getTextureLoader();
  const stats = loader.getStats();
  const memoryMB = (loader.getMemoryUsage() / (1024 * 1024)).toFixed(2);
  
  return {
    ...stats,
    memoryUsageMB: memoryMB,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default OptimizedTextureLoader;
