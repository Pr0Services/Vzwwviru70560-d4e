// =============================================================================
// CHE·NU™ — CANONICAL CONFIGURATION
// Version Finale V52 — ARCHITECTURE GELÉE (FROZEN)
// =============================================================================
// 
// ⚠️ DO NOT MODIFY THIS FILE WITHOUT EXPLICIT AUTHORIZATION ⚠️
// 
// This is the single source of truth for CHE·NU architecture.
// Any modification to spheres, bureau sections, or colors must be
// approved and documented.
//
// =============================================================================

import { SphereId } from './sphere.types';
import { BureauSectionId, BUREAU_SECTION_COUNT } from './bureau.types';

// =============================================================================
// BRAND COLORS (Official CHE·NU Palette)
// =============================================================================

export const CHENU_COLORS = {
  // Primary palette
  sacredGold: '#D8B26A',      // Primary accent
  ancientStone: '#8D8371',    // Secondary neutral
  jungleEmerald: '#3F7249',   // Nature/growth
  cenoteTurquoise: '#3EB4A2', // Water/clarity
  shadowMoss: '#2F4C39',      // Deep nature
  earthEmber: '#7A593A',      // Earth/warmth
  
  // UI colors
  uiSlate: '#1E1F22',         // Dark background
  softSand: '#E9E4D6',        // Light background
  
  // Extended palette
  scholarPurple: '#6B5B95',   // Academic/knowledge
  entertainmentRed: '#E74C3C', // Entertainment/fun
} as const;

// =============================================================================
// 9 SPHERES (FROZEN — DO NOT MODIFY)
// =============================================================================

export const SPHERE_COUNT = 9; // HARD LIMIT

export interface SphereConfig {
  id: SphereId;
  order: number;
  name: string;
  nameFr: string;
  emoji: string;
  color: string;
  description: string;
  descriptionFr: string;
  allowsAIExecution: boolean;
  connections: SphereId[];
  subModules?: string[];
}

export const SPHERE_CONFIGS: Record<SphereId, SphereConfig> = {
  personal: {
    id: 'personal',
    order: 1,
    name: 'Personal',
    nameFr: 'Personnel',
    emoji: '🏠',
    color: CHENU_COLORS.cenoteTurquoise,
    description: 'Personal life, health, family, home',
    descriptionFr: 'Vie personnelle, santé, famille, maison',
    allowsAIExecution: true,
    connections: ['business', 'entertainment', 'team'],
  },
  
  business: {
    id: 'business',
    order: 2,
    name: 'Business',
    nameFr: 'Entreprise',
    emoji: '💼',
    color: CHENU_COLORS.sacredGold,
    description: 'Professional operations, projects, clients, finances',
    descriptionFr: 'Opérations professionnelles, projets, clients, finances',
    allowsAIExecution: true,
    connections: ['personal', 'government', 'studio', 'community', 'social', 'team'],
  },
  
  government: {
    id: 'government',
    order: 3,
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    emoji: '🏛️',
    color: CHENU_COLORS.ancientStone,
    description: 'Official documents, taxes, permits, legal affairs',
    descriptionFr: 'Documents officiels, taxes, permis, affaires légales',
    allowsAIExecution: true,
    connections: ['personal', 'business', 'team'],
  },
  
  studio: {
    id: 'studio',
    order: 4,
    name: 'Creative Studio',
    nameFr: 'Studio de Création',
    emoji: '🎨',
    color: CHENU_COLORS.jungleEmerald,
    description: 'Image, video, music, photography, 3D/XR, design',
    descriptionFr: 'Image, vidéo, musique, photo, plans, 3D/XR',
    allowsAIExecution: true,
    connections: ['personal', 'business', 'social', 'team'],
  },
  
  community: {
    id: 'community',
    order: 5,
    name: 'Community',
    nameFr: 'Communauté',
    emoji: '👥',
    color: CHENU_COLORS.shadowMoss,
    description: 'Structured communities, forums, marketplaces, events',
    descriptionFr: 'Communautés structurées, forums, marketplaces, événements',
    allowsAIExecution: true,
    connections: ['business', 'social', 'entertainment', 'team'],
  },
  
  social: {
    id: 'social',
    order: 6,
    name: 'Social & Media',
    nameFr: 'Social & Médias',
    emoji: '📱',
    color: CHENU_COLORS.earthEmber,
    description: 'Posts, media sharing, external platform connections',
    descriptionFr: 'Posts, partage média, connexions plateformes externes',
    allowsAIExecution: true,
    connections: ['business', 'studio', 'community', 'team'],
  },
  
  entertainment: {
    id: 'entertainment',
    order: 7,
    name: 'Entertainment',
    nameFr: 'Divertissement',
    emoji: '🎬',
    color: CHENU_COLORS.entertainmentRed,
    description: 'Media consumption, streaming, XR leisure',
    descriptionFr: 'Consommation médias, streaming, loisirs XR',
    allowsAIExecution: true,
    connections: ['personal', 'community', 'team'],
  },
  
  team: {
    id: 'team',
    order: 8,
    name: 'My Team',
    nameFr: 'Mon Équipe',
    emoji: '🤝',
    color: CHENU_COLORS.cenoteTurquoise,
    description: 'Human members, AI agents, orchestrators, Skills & Tools, IA Labs',
    descriptionFr: 'Membres humains, agents IA, orchestrateurs, Skills & Tools, IA Labs',
    allowsAIExecution: true,
    connections: ['personal', 'business', 'government', 'studio', 'community', 'social', 'entertainment', 'scholar'],
    subModules: ['ia_labs', 'skills_tools', 'orchestrator'],
  },
  
  scholar: {
    id: 'scholar',
    order: 9,
    name: 'Scholars',
    nameFr: 'Savoirs',
    emoji: '📚',
    color: CHENU_COLORS.scholarPurple,
    description: 'Research, learning, academic resources, knowledge base',
    descriptionFr: 'Recherche, apprentissage, ressources académiques, base de connaissances',
    allowsAIExecution: true,
    connections: ['personal', 'business', 'studio', 'team'],
  },
};

// Ordered list of spheres
export const SPHERE_LIST: SphereConfig[] = Object.values(SPHERE_CONFIGS).sort((a, b) => a.order - b.order);

// Sphere IDs in order
export const CANONICAL_SPHERE_IDS: SphereId[] = SPHERE_LIST.map(s => s.id);

// =============================================================================
// SPHERE VISUAL MAPS
// =============================================================================

export const SPHERE_COLORS: Record<SphereId, string> = {
  personal: CHENU_COLORS.cenoteTurquoise,
  business: CHENU_COLORS.sacredGold,
  government: CHENU_COLORS.ancientStone,
  studio: CHENU_COLORS.jungleEmerald,
  community: CHENU_COLORS.shadowMoss,
  social: CHENU_COLORS.earthEmber,
  entertainment: CHENU_COLORS.entertainmentRed,
  team: CHENU_COLORS.cenoteTurquoise,
  scholar: CHENU_COLORS.scholarPurple,
};

export const SPHERE_ICONS: Record<SphereId, string> = {
  personal: '🏠',
  business: '💼',
  government: '🏛️',
  studio: '🎨',
  community: '👥',
  social: '📱',
  entertainment: '🎬',
  team: '🤝',
  scholar: '📚',
};

export const SPHERE_NAMES: Record<SphereId, { en: string; fr: string }> = {
  personal: { en: 'Personal', fr: 'Personnel' },
  business: { en: 'Business', fr: 'Entreprise' },
  government: { en: 'Government & Institutions', fr: 'Gouvernement & Institutions' },
  studio: { en: 'Creative Studio', fr: 'Studio de Création' },
  community: { en: 'Community', fr: 'Communauté' },
  social: { en: 'Social & Media', fr: 'Social & Médias' },
  entertainment: { en: 'Entertainment', fr: 'Divertissement' },
  team: { en: 'My Team', fr: 'Mon Équipe' },
  scholar: { en: 'Scholars', fr: 'Savoirs' },
};

// =============================================================================
// ARCHITECTURE VALIDATION
// =============================================================================

export interface ArchitectureValidation {
  valid: boolean;
  sphereCount: number;
  bureauSectionCount: number;
  errors: string[];
  warnings: string[];
}

export function validateCanonicalArchitecture(): ArchitectureValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate sphere count
  const sphereCount = Object.keys(SPHERE_CONFIGS).length;
  if (sphereCount !== SPHERE_COUNT) {
    errors.push(`Expected ${SPHERE_COUNT} spheres, found ${sphereCount}`);
  }
  
  // Validate sphere order
  const sphereOrders = SPHERE_LIST.map(s => s.order);
  const expectedOrders = Array.from({ length: SPHERE_COUNT }, (_, i) => i + 1);
  if (JSON.stringify(sphereOrders) !== JSON.stringify(expectedOrders)) {
    errors.push(`Sphere orders are not sequential 1-${SPHERE_COUNT}`);
  }
  
  // Validate connections reference valid spheres
  for (const sphere of SPHERE_LIST) {
    for (const connId of sphere.connections) {
      if (!SPHERE_CONFIGS[connId]) {
        errors.push(`Sphere ${sphere.id} has invalid connection: ${connId}`);
      }
    }
  }
  
  // Validate Team sphere has subModules
  if (!SPHERE_CONFIGS.team.subModules || SPHERE_CONFIGS.team.subModules.length === 0) {
    warnings.push('Team sphere should have subModules (ia_labs, skills_tools, orchestrator)');
  }
  
  return {
    valid: errors.length === 0,
    sphereCount,
    bureauSectionCount: BUREAU_SECTION_COUNT,
    errors,
    warnings,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getSphereConfig(id: SphereId): SphereConfig {
  return SPHERE_CONFIGS[id];
}

export function getSphereName(id: SphereId, locale: 'fr' | 'en' = 'fr'): string {
  return SPHERE_NAMES[id][locale];
}

export function getSphereColor(id: SphereId): string {
  return SPHERE_COLORS[id];
}

export function getSphereIcon(id: SphereId): string {
  return SPHERE_ICONS[id];
}

export function isValidSphereId(id: string): id is SphereId {
  return CANONICAL_SPHERE_IDS.includes(id as SphereId);
}

export function canSpheresConnect(from: SphereId, to: SphereId): boolean {
  if (from === to) return false;
  return SPHERE_CONFIGS[from].connections.includes(to);
}

// =============================================================================
// RUNTIME VALIDATION
// =============================================================================

// Validate on module load
const validation = validateCanonicalArchitecture();
if (!validation.valid) {
  logger.error('CHE·NU ARCHITECTURE VIOLATION:', validation.errors);
}
if (validation.warnings.length > 0) {
  logger.warn('CHE·NU Architecture warnings:', validation.warnings);
}

// =============================================================================
// EXPORTS SUMMARY
// =============================================================================
// 
// SPHERES:
// - SPHERE_COUNT = 9
// - SPHERE_CONFIGS = Full config for each sphere
// - SPHERE_LIST = Ordered array of sphere configs
// - CANONICAL_SPHERE_IDS = ['personal', 'business', ...]
// - SPHERE_COLORS, SPHERE_ICONS, SPHERE_NAMES = Visual maps
// 
// BUREAU:
// - BUREAU_SECTION_COUNT = 6 (imported from bureau.types)
// - Bureau sections: quickcapture, resumeworkspace, threads, datafiles, activeagents, meetings
// 
// COLORS:
// - CHENU_COLORS = Official brand palette
//
// =============================================================================
