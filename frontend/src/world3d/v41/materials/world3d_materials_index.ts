/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — PBR MATERIALS SYSTEM — EXPORTS
 * Central export point for PBR materials system
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Core system
export { PBRMaterialLibrary, getPBRLibrary, resetPBRLibrary } from './PBRMaterials';

// Types
export type {
  PBRMaterialConfig,
  PBRTextureMaps,
  MaterialCategory,
  MaterialPreset,
  WoodPreset,
  StonePreset,
  MetalPreset,
  GlassPreset,
  TextureLoaderOptions,
  MaterialLibraryEntry,
  MaterialLibraryStats,
  MaterialPerformanceMetrics,
} from './types';

// Presets
export {
  // Individual presets - Wood
  OAK_WOOD,
  PINE_WOOD,
  WALNUT_WOOD,
  BAMBOO_WOOD,
  WEATHERED_WOOD,
  
  // Individual presets - Stone
  GRANITE,
  MARBLE,
  LIMESTONE,
  CONCRETE,
  SANDSTONE,
  
  // Individual presets - Metal
  BRUSHED_ALUMINUM,
  POLISHED_STEEL,
  COPPER_OXIDIZED,
  GOLD,
  IRON_RUSTY,
  
  // Individual presets - Glass
  CLEAR_GLASS,
  FROSTED_GLASS,
  COLORED_GLASS,
  
  // Collections
  WOOD_PRESETS,
  STONE_PRESETS,
  METAL_PRESETS,
  GLASS_PRESETS,
  ALL_PRESETS,
  
  // Helpers
  getPresetById,
  getPresetsByCategory,
  listPresetIds,
} from './MaterialPresets';
