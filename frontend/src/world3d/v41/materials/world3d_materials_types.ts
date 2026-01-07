/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — PBR MATERIALS SYSTEM — TYPES
 * Type definitions for Physically Based Rendering materials
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// TEXTURE MAPS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PBRTextureMaps {
  /** Base color (albedo) map */
  color?: THREE.Texture;
  
  /** Normal map for surface detail */
  normal?: THREE.Texture;
  
  /** Roughness map (0 = smooth, 1 = rough) */
  roughness?: THREE.Texture;
  
  /** Metalness map (0 = dielectric, 1 = metal) */
  metalness?: THREE.Texture;
  
  /** Ambient occlusion map */
  ao?: THREE.Texture;
  
  /** Displacement/height map */
  displacement?: THREE.Texture;
  
  /** Emissive map (glowing parts) */
  emissive?: THREE.Texture;
  
  /** Alpha/transparency map */
  alpha?: THREE.Texture;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface PBRMaterialConfig {
  /** Unique material ID */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Material category */
  category: MaterialCategory;
  
  /** Texture maps */
  maps: PBRTextureMaps;
  
  /** Base color (if no color map) */
  color?: THREE.Color | string | number;
  
  /** Roughness value (0-1, if no roughness map) */
  roughness?: number;
  
  /** Metalness value (0-1, if no metalness map) */
  metalness?: number;
  
  /** Normal map intensity */
  normalScale?: THREE.Vector2;
  
  /** Displacement intensity */
  displacementScale?: number;
  
  /** AO intensity */
  aoMapIntensity?: number;
  
  /** Emissive color */
  emissiveColor?: THREE.Color | string | number;
  
  /** Emissive intensity */
  emissiveIntensity?: number;
  
  /** Environment map intensity */
  envMapIntensity?: number;
  
  /** Transparency (0-1) */
  opacity?: number;
  
  /** Enable transparency */
  transparent?: boolean;
  
  /** Alpha test threshold */
  alphaTest?: number;
  
  /** Side rendering */
  side?: THREE.Side;
  
  /** Enable shadows */
  castShadow?: boolean;
  receiveShadow?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export type MaterialCategory = 
  | 'wood'
  | 'stone'
  | 'metal'
  | 'glass'
  | 'plastic'
  | 'fabric'
  | 'organic'
  | 'custom';

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export type WoodPreset =
  | 'oak'
  | 'pine'
  | 'walnut'
  | 'bamboo'
  | 'weathered_wood';

export type StonePreset =
  | 'granite'
  | 'marble'
  | 'limestone'
  | 'concrete'
  | 'sandstone';

export type MetalPreset =
  | 'brushed_aluminum'
  | 'polished_steel'
  | 'copper_oxidized'
  | 'gold'
  | 'iron_rusty';

export type GlassPreset =
  | 'clear_glass'
  | 'frosted_glass'
  | 'colored_glass';

export type MaterialPreset = 
  | WoodPreset 
  | StonePreset 
  | MetalPreset 
  | GlassPreset;

// ═══════════════════════════════════════════════════════════════════════════════
// TEXTURE LOADER OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TextureLoaderOptions {
  /** Base path for textures */
  basePath?: string;
  
  /** Enable texture compression */
  compression?: 'webp' | 'basis' | 'none';
  
  /** Generate mipmaps */
  generateMipmaps?: boolean;
  
  /** Texture filtering */
  minFilter?: THREE.TextureFilter;
  maxFilter?: THREE.TextureFilter;
  
  /** Texture wrapping */
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  
  /** Anisotropy level */
  anisotropy?: number;
  
  /** Encoding */
  encoding?: THREE.TextureEncoding;
  
  /** Enable caching */
  cache?: boolean;
  
  /** Fallback behavior on load error */
  fallback?: 'default' | 'error' | 'none';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

export interface MaterialLibraryEntry {
  config: PBRMaterialConfig;
  material: THREE.MeshStandardMaterial;
  loaded: boolean;
  error?: Error;
}

export interface MaterialLibraryStats {
  totalMaterials: number;
  loadedMaterials: number;
  erroredMaterials: number;
  cacheSize: number;
  memoryUsage?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

export interface MaterialPerformanceMetrics {
  /** Load time in ms */
  loadTime: number;
  
  /** Texture memory usage in MB */
  textureMemory: number;
  
  /** Number of draw calls */
  drawCalls: number;
  
  /** FPS impact */
  fpsImpact: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Types are exported above
};
