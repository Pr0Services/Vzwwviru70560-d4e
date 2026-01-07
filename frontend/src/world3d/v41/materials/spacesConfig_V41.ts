/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V41 - SPACES CONFIGURATION WITH PBR MATERIALS
 * Configuration for 7 3D spaces with material assignments
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { MaterialPreset } from '../../materials/types';

export interface SpaceConfig {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  
  // V41: Material configuration
  materials: {
    primary: MaterialPreset;
    secondary?: MaterialPreset;
    accent?: MaterialPreset;
  };
  
  // Visual settings
  scale?: number;
  rotationSpeed?: number;
  lightingIntensity?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACES CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const SPACES_CONFIG: Record<string, SpaceConfig> = {
  maison: {
    id: 'maison',
    name: 'Maison',
    color: '#D8B26A', // Sacred Gold
    position: [0, 0, 0],
    materials: {
      primary: 'oak',
      secondary: 'weathered_wood',
      accent: 'sandstone',
    },
    scale: 1.0,
    lightingIntensity: 1.2,
  },

  entreprise: {
    id: 'entreprise',
    name: 'Entreprise',
    color: '#8D8371', // Ancient Stone
    position: [5, 0, 0],
    materials: {
      primary: 'brushed_aluminum',
      secondary: 'clear_glass',
      accent: 'polished_steel',
    },
    scale: 1.0,
    lightingIntensity: 1.5,
  },

  projets: {
    id: 'projets',
    name: 'Projets',
    color: '#3F7249', // Jungle Emerald
    position: [10, 0, 0],
    materials: {
      primary: 'concrete',
      secondary: 'iron_rusty',
      accent: 'pine',
    },
    scale: 1.0,
    lightingIntensity: 1.0,
  },

  gouvernement: {
    id: 'gouvernement',
    name: 'Gouvernement',
    color: '#3EB4A2', // Cenote Turquoise
    position: [15, 0, 0],
    materials: {
      primary: 'marble',
      secondary: 'granite',
      accent: 'gold',
    },
    scale: 1.0,
    lightingIntensity: 1.8,
  },

  immobilier: {
    id: 'immobilier',
    name: 'Immobilier',
    color: '#2F4C39', // Shadow Moss
    position: [20, 0, 0],
    materials: {
      primary: 'concrete',
      secondary: 'limestone',
      accent: 'frosted_glass',
    },
    scale: 1.0,
    lightingIntensity: 1.3,
  },

  associations: {
    id: 'associations',
    name: 'Associations',
    color: '#7A593A', // Earth Ember
    position: [25, 0, 0],
    materials: {
      primary: 'walnut',
      secondary: 'bamboo',
    },
    scale: 1.0,
    lightingIntensity: 1.1,
  },

  creative: {
    id: 'creative',
    name: 'Creative Studio',
    color: '#E9E4D6', // Soft Sand
    position: [30, 0, 0],
    materials: {
      primary: 'polished_steel',
      secondary: 'colored_glass',
    },
    scale: 1.0,
    rotationSpeed: 0.3,
    lightingIntensity: 2.0,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get space configuration by ID
 */
export function getSpaceConfig(spaceId: string): SpaceConfig | undefined {
  return SPACES_CONFIG[spaceId];
}

/**
 * List all space IDs
 */
export function listSpaceIds(): string[] {
  return Object.keys(SPACES_CONFIG);
}

/**
 * Get material presets for a space
 */
export function getSpaceMaterials(spaceId: string): MaterialPreset[] {
  const config = SPACES_CONFIG[spaceId];
  if (!config) return [];
  
  const materials: MaterialPreset[] = [config.materials.primary];
  if (config.materials.secondary) materials.push(config.materials.secondary);
  if (config.materials.accent) materials.push(config.materials.accent);
  
  return materials;
}

/**
 * Preload all materials for all spaces
 */
export async function preloadAllSpaceMaterials(): Promise<MaterialPreset[]> {
  const allMaterials = new Set<MaterialPreset>();
  
  Object.values(SPACES_CONFIG).forEach((config) => {
    allMaterials.add(config.materials.primary);
    if (config.materials.secondary) allMaterials.add(config.materials.secondary);
    if (config.materials.accent) allMaterials.add(config.materials.accent);
  });
  
  return Array.from(allMaterials);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default SPACES_CONFIG;
