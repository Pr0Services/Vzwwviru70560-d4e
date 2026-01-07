/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SPHERES INDEX                                   ║
 * ║                    Export Centralisé de tous les Engines (9/9)               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Point d'entrée unique pour tous les sphere engines.
 * Import: import { PersonalEngine, BusinessEngine, ... } from '@/spheres';
 * 
 * @version 51.0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE ENGINES (9/9 COMPLETS)
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Personal 🏠
export * from './PersonalEngine';
export { default as PersonalEngine } from './PersonalEngine';

// 2. Business 💼
export * from './BusinessEngine';
export { default as BusinessEngine } from './BusinessEngine';

// 3. Government 🏛️
export * from './GovernmentEngine';
export { default as GovernmentEngine } from './GovernmentEngine';

// 4. Studio 🎨
export * from './StudioDeCreationEngine';
export { default as StudioEngine } from './StudioDeCreationEngine';

// 5. Community 👥
export * from './CommunityEngine';
export { default as CommunityEngine } from './CommunityEngine';

// 6. Social 📱
export * from './SocialMediaEngine';
export { default as SocialEngine } from './SocialMediaEngine';

// 7. Entertainment 🎬
export * from './EntertainmentEngine';
export { default as EntertainmentEngine } from './EntertainmentEngine';

// 8. Team 🤝
export * from './MyTeamEngine';
export { default as TeamEngine } from './MyTeamEngine';

// 9. Scholar 📚
export * from './ScholarEngine';
export { default as ScholarEngine } from './ScholarEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES - SOURCE UNIQUE DE VÉRITÉ (from spheres.types.ts)
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  SphereId,
  BureauSectionId,
  BureauCoreSectionId,
  BureauExtendedSectionId,
  ViewType,
  NavigationState,
  NavigationHistoryEntry,
  NovaState,
  AgentLevel,
  CheckpointType,
  CheckpointState,
  SphereConfig,
  BureauSectionConfig,
} from '../types/spheres.types';

export {
  SPHERE_IDS,
  TOTAL_SPHERES,
  BUREAU_CORE_SECTIONS,
  BUREAU_EXTENDED_SECTIONS,
  ALL_BUREAU_SECTIONS,
  NOVA_STATES,
  AGENT_LEVELS,
  TOTAL_AGENTS,
  SPHERE_CONFIGS,
  BUREAU_SECTION_CONFIGS,
  getSphereConfig,
  getSectionConfig,
  getSphereColor,
  getSphereIcon,
  getSphereName,
  isValidSphereId,
  isValidSectionId,
} from '../types/spheres.types';

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE REGISTRY (pour accès dynamique)
// ═══════════════════════════════════════════════════════════════════════════════

import type { SphereId as SphereIdType } from '../types/spheres.types';

import PersonalEngineDefault from './PersonalEngine';
import BusinessEngineDefault from './BusinessEngine';
import GovernmentEngineDefault from './GovernmentEngine';
import StudioEngineDefault from './StudioDeCreationEngine';
import CommunityEngineDefault from './CommunityEngine';
import SocialEngineDefault from './SocialMediaEngine';
import EntertainmentEngineDefault from './EntertainmentEngine';
import TeamEngineDefault from './MyTeamEngine';
import ScholarEngineDefault from './ScholarEngine';

/**
 * Configuration de base d'un engine
 */
export interface SphereEngineConfig {
  SPHERE_ID: SphereIdType;
  SPHERE_COLOR: string;
  SPHERE_ICON: string;
  SPHERE_NAME: string;
  SPHERE_NAME_FR: string;
  initialState: unknown;
  reducer?: (state: unknown, action: unknown) => unknown;
}

/**
 * Registry de tous les engines par SphereId
 */
export const SPHERE_ENGINE_REGISTRY: Record<SphereIdType, SphereEngineConfig> = {
  personal: PersonalEngineDefault,
  business: BusinessEngineDefault,
  government: GovernmentEngineDefault,
  studio: StudioEngineDefault,
  community: CommunityEngineDefault,
  social: SocialEngineDefault,
  entertainment: EntertainmentEngineDefault,
  team: TeamEngineDefault,
  scholar: ScholarEngineDefault,
};

/**
 * Récupère un engine par son SphereId
 */
export function getSphereEngine(sphereId: SphereIdType): SphereEngineConfig {
  const engine = SPHERE_ENGINE_REGISTRY[sphereId];
  if (!engine) {
    throw new Error(`Engine not found for sphere: ${sphereId}`);
  }
  return engine;
}

/**
 * Récupère l'état initial d'un engine
 */
export function getSphereInitialState(sphereId: SphereIdType): unknown {
  return getSphereEngine(sphereId).initialState;
}

/**
 * Liste des engines disponibles
 */
export const AVAILABLE_ENGINES = Object.keys(SPHERE_ENGINE_REGISTRY) as SphereIdType[];

/**
 * Vérifie si un engine existe pour une sphère
 */
export function hasEngine(sphereId: SphereIdType): boolean {
  return sphereId in SPHERE_ENGINE_REGISTRY;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY COMPATIBILITY (à retirer dans V52)
// ═══════════════════════════════════════════════════════════════════════════════

import { SPHERE_CONFIGS as CONFIGS } from '../types/spheres.types';

/** @deprecated Use SPHERE_CONFIGS from spheres.types.ts */
export const OFFICIAL_SPHERES = Object.values(CONFIGS).map(config => ({
  id: config.id,
  name: config.name,
  nameFr: config.nameFr,
  icon: config.icon,
  color: config.color,
}));
