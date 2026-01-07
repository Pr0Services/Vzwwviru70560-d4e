/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 — MATERIAL PRESETS
 * 18 pre-configured PBR materials (5 wood + 5 stone + 5 metal + 3 glass)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';
import type { PBRMaterialConfig } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// WOOD MATERIALS (5 presets)
// ═══════════════════════════════════════════════════════════════════════════════

export const OAK_WOOD: PBRMaterialConfig = {
  id: 'oak',
  name: 'Oak Wood',
  category: 'wood',
  maps: {
    color: 'oak_color.webp',
    normal: 'oak_normal.webp',
    roughness: 'oak_roughness.webp',
    ao: 'oak_ao.webp',
  },
  roughness: 0.7,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.5, 0.5),
  aoMapIntensity: 1.2,
};

export const PINE_WOOD: PBRMaterialConfig = {
  id: 'pine',
  name: 'Pine Wood',
  category: 'wood',
  maps: {
    color: 'pine_color.webp',
    normal: 'pine_normal.webp',
    roughness: 'pine_roughness.webp',
    ao: 'pine_ao.webp',
  },
  roughness: 0.65,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.4, 0.4),
  aoMapIntensity: 1.0,
};

export const WALNUT_WOOD: PBRMaterialConfig = {
  id: 'walnut',
  name: 'Walnut Wood',
  category: 'wood',
  maps: {
    color: 'walnut_color.webp',
    normal: 'walnut_normal.webp',
    roughness: 'walnut_roughness.webp',
    ao: 'walnut_ao.webp',
  },
  roughness: 0.6,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.6, 0.6),
  aoMapIntensity: 1.3,
};

export const BAMBOO_WOOD: PBRMaterialConfig = {
  id: 'bamboo',
  name: 'Bamboo',
  category: 'wood',
  maps: {
    color: 'bamboo_color.webp',
    normal: 'bamboo_normal.webp',
    roughness: 'bamboo_roughness.webp',
    ao: 'bamboo_ao.webp',
  },
  roughness: 0.55,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.3, 0.3),
  aoMapIntensity: 0.9,
};

export const WEATHERED_WOOD: PBRMaterialConfig = {
  id: 'weathered_wood',
  name: 'Weathered Wood',
  category: 'wood',
  maps: {
    color: 'weathered_wood_color.webp',
    normal: 'weathered_wood_normal.webp',
    roughness: 'weathered_wood_roughness.webp',
    ao: 'weathered_wood_ao.webp',
  },
  roughness: 0.85,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.8, 0.8),
  aoMapIntensity: 1.5,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STONE MATERIALS (5 presets)
// ═══════════════════════════════════════════════════════════════════════════════

export const GRANITE: PBRMaterialConfig = {
  id: 'granite',
  name: 'Granite',
  category: 'stone',
  maps: {
    color: 'granite_color.webp',
    normal: 'granite_normal.webp',
    roughness: 'granite_roughness.webp',
    ao: 'granite_ao.webp',
  },
  roughness: 0.4,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.7, 0.7),
  aoMapIntensity: 1.1,
};

export const MARBLE: PBRMaterialConfig = {
  id: 'marble',
  name: 'Marble',
  category: 'stone',
  maps: {
    color: 'marble_color.webp',
    normal: 'marble_normal.webp',
    roughness: 'marble_roughness.webp',
    ao: 'marble_ao.webp',
  },
  roughness: 0.2,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.3, 0.3),
  aoMapIntensity: 0.8,
};

export const LIMESTONE: PBRMaterialConfig = {
  id: 'limestone',
  name: 'Limestone',
  category: 'stone',
  maps: {
    color: 'limestone_color.webp',
    normal: 'limestone_normal.webp',
    roughness: 'limestone_roughness.webp',
    ao: 'limestone_ao.webp',
  },
  roughness: 0.6,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.5, 0.5),
  aoMapIntensity: 1.2,
};

export const CONCRETE: PBRMaterialConfig = {
  id: 'concrete',
  name: 'Concrete',
  category: 'stone',
  maps: {
    color: 'concrete_color.webp',
    normal: 'concrete_normal.webp',
    roughness: 'concrete_roughness.webp',
    ao: 'concrete_ao.webp',
  },
  roughness: 0.75,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.4, 0.4),
  aoMapIntensity: 1.0,
};

export const SANDSTONE: PBRMaterialConfig = {
  id: 'sandstone',
  name: 'Sandstone',
  category: 'stone',
  maps: {
    color: 'sandstone_color.webp',
    normal: 'sandstone_normal.webp',
    roughness: 'sandstone_roughness.webp',
    ao: 'sandstone_ao.webp',
  },
  roughness: 0.7,
  metalness: 0.0,
  normalScale: new THREE.Vector2(0.6, 0.6),
  aoMapIntensity: 1.3,
};

// ═══════════════════════════════════════════════════════════════════════════════
// METAL MATERIALS (5 presets)
// ═══════════════════════════════════════════════════════════════════════════════

export const BRUSHED_ALUMINUM: PBRMaterialConfig = {
  id: 'brushed_aluminum',
  name: 'Brushed Aluminum',
  category: 'metal',
  maps: {
    color: 'brushed_aluminum_color.webp',
    normal: 'brushed_aluminum_normal.webp',
    roughness: 'brushed_aluminum_roughness.webp',
    metalness: 'brushed_aluminum_metalness.webp',
  },
  color: 0xcccccc,
  roughness: 0.3,
  metalness: 1.0,
  normalScale: new THREE.Vector2(0.2, 0.2),
  envMapIntensity: 1.5,
};

export const POLISHED_STEEL: PBRMaterialConfig = {
  id: 'polished_steel',
  name: 'Polished Steel',
  category: 'metal',
  maps: {
    color: 'polished_steel_color.webp',
    normal: 'polished_steel_normal.webp',
    roughness: 'polished_steel_roughness.webp',
    metalness: 'polished_steel_metalness.webp',
  },
  color: 0xdddddd,
  roughness: 0.1,
  metalness: 1.0,
  normalScale: new THREE.Vector2(0.1, 0.1),
  envMapIntensity: 2.0,
};

export const COPPER_OXIDIZED: PBRMaterialConfig = {
  id: 'copper_oxidized',
  name: 'Oxidized Copper',
  category: 'metal',
  maps: {
    color: 'copper_oxidized_color.webp',
    normal: 'copper_oxidized_normal.webp',
    roughness: 'copper_oxidized_roughness.webp',
    metalness: 'copper_oxidized_metalness.webp',
  },
  color: 0x4d8b7b,
  roughness: 0.6,
  metalness: 0.8,
  normalScale: new THREE.Vector2(0.5, 0.5),
  envMapIntensity: 1.2,
};

export const GOLD: PBRMaterialConfig = {
  id: 'gold',
  name: 'Gold',
  category: 'metal',
  maps: {
    color: 'gold_color.webp',
    normal: 'gold_normal.webp',
    roughness: 'gold_roughness.webp',
    metalness: 'gold_metalness.webp',
  },
  color: 0xffd700,
  roughness: 0.2,
  metalness: 1.0,
  normalScale: new THREE.Vector2(0.15, 0.15),
  envMapIntensity: 1.8,
};

export const IRON_RUSTY: PBRMaterialConfig = {
  id: 'iron_rusty',
  name: 'Rusty Iron',
  category: 'metal',
  maps: {
    color: 'iron_rusty_color.webp',
    normal: 'iron_rusty_normal.webp',
    roughness: 'iron_rusty_roughness.webp',
    metalness: 'iron_rusty_metalness.webp',
  },
  color: 0x8b4513,
  roughness: 0.8,
  metalness: 0.5,
  normalScale: new THREE.Vector2(0.7, 0.7),
  envMapIntensity: 0.8,
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLASS MATERIALS (3 presets)
// ═══════════════════════════════════════════════════════════════════════════════

export const CLEAR_GLASS: PBRMaterialConfig = {
  id: 'clear_glass',
  name: 'Clear Glass',
  category: 'glass',
  maps: {
    normal: 'clear_glass_normal.webp',
  },
  color: 0xffffff,
  roughness: 0.05,
  metalness: 0.0,
  opacity: 0.3,
  transparent: true,
  normalScale: new THREE.Vector2(0.1, 0.1),
  envMapIntensity: 2.5,
  side: THREE.DoubleSide,
};

export const FROSTED_GLASS: PBRMaterialConfig = {
  id: 'frosted_glass',
  name: 'Frosted Glass',
  category: 'glass',
  maps: {
    roughness: 'frosted_glass_roughness.webp',
    normal: 'frosted_glass_normal.webp',
  },
  color: 0xf0f0f0,
  roughness: 0.4,
  metalness: 0.0,
  opacity: 0.5,
  transparent: true,
  normalScale: new THREE.Vector2(0.3, 0.3),
  envMapIntensity: 1.5,
  side: THREE.DoubleSide,
};

export const COLORED_GLASS: PBRMaterialConfig = {
  id: 'colored_glass',
  name: 'Colored Glass (Blue)',
  category: 'glass',
  maps: {
    normal: 'colored_glass_normal.webp',
  },
  color: 0x3498db,
  roughness: 0.1,
  metalness: 0.0,
  opacity: 0.6,
  transparent: true,
  normalScale: new THREE.Vector2(0.2, 0.2),
  envMapIntensity: 2.0,
  side: THREE.DoubleSide,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const WOOD_PRESETS = [
  OAK_WOOD,
  PINE_WOOD,
  WALNUT_WOOD,
  BAMBOO_WOOD,
  WEATHERED_WOOD,
];

export const STONE_PRESETS = [
  GRANITE,
  MARBLE,
  LIMESTONE,
  CONCRETE,
  SANDSTONE,
];

export const METAL_PRESETS = [
  BRUSHED_ALUMINUM,
  POLISHED_STEEL,
  COPPER_OXIDIZED,
  GOLD,
  IRON_RUSTY,
];

export const GLASS_PRESETS = [
  CLEAR_GLASS,
  FROSTED_GLASS,
  COLORED_GLASS,
];

export const ALL_PRESETS = [
  ...WOOD_PRESETS,
  ...STONE_PRESETS,
  ...METAL_PRESETS,
  ...GLASS_PRESETS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get preset by ID
 */
export function getPresetById(id: string): PBRMaterialConfig | undefined {
  return ALL_PRESETS.find((preset) => preset.id === id);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: string): PBRMaterialConfig[] {
  switch (category) {
    case 'wood':
      return WOOD_PRESETS;
    case 'stone':
      return STONE_PRESETS;
    case 'metal':
      return METAL_PRESETS;
    case 'glass':
      return GLASS_PRESETS;
    default:
      return [];
  }
}

/**
 * List all preset IDs
 */
export function listPresetIds(): string[] {
  return ALL_PRESETS.map((preset) => preset.id);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Wood
  OAK_WOOD,
  PINE_WOOD,
  WALNUT_WOOD,
  BAMBOO_WOOD,
  WEATHERED_WOOD,
  
  // Stone
  GRANITE,
  MARBLE,
  LIMESTONE,
  CONCRETE,
  SANDSTONE,
  
  // Metal
  BRUSHED_ALUMINUM,
  POLISHED_STEEL,
  COPPER_OXIDIZED,
  GOLD,
  IRON_RUSTY,
  
  // Glass
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
};
