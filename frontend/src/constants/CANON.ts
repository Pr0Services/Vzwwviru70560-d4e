/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — CANON.ts                                    ║
 * ║                    Source de Vérité Immuable                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE ABSOLUE: Ce fichier définit les CONSTANTES structurantes.
 * - Les sphères sont un CADRE COGNITIF, pas un état mutable
 * - Les sections bureau sont FIXES (6 exactement)
 * - AUCUNE modification runtime autorisée
 * 
 * "Les sphères sont un plan de réalité, pas un état applicatif."
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU™ BRAND
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND_COLORS = {
  SACRED_GOLD: '#D8B26A',
  ANCIENT_STONE: '#8D8371',
  JUNGLE_EMERALD: '#3F7249',
  CENOTE_TURQUOISE: '#3EB4A2',
  SHADOW_MOSS: '#2F4C39',
  EARTH_EMBER: '#7A593A',
  UI_SLATE: '#1E1F22',
  SOFT_SAND: '#E9E4D6',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 9 SPHÈRES — ARCHITECTURE GELÉE (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars';

export interface SphereDefinition {
  readonly id: SphereId;
  readonly label: string;
  readonly labelFr: string;
  readonly icon: string;
  readonly color: string;
  readonly description: string;
}

export const SPHERES: Record<SphereId, SphereDefinition> = {
  personal: {
    id: 'personal',
    label: 'Personal',
    labelFr: 'Personnel',
    icon: '🏠',
    color: BRAND_COLORS.CENOTE_TURQUOISE,
    description: 'Your private cognitive space',
  },
  business: {
    id: 'business',
    label: 'Business',
    labelFr: 'Entreprise',
    icon: '💼',
    color: BRAND_COLORS.SACRED_GOLD,
    description: 'Professional and business activities',
  },
  government: {
    id: 'government',
    label: 'Government',
    labelFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: BRAND_COLORS.ANCIENT_STONE,
    description: 'Civic and institutional matters',
  },
  studio: {
    id: 'studio',
    label: 'Studio',
    labelFr: 'Studio de Création',
    icon: '🎨',
    color: BRAND_COLORS.JUNGLE_EMERALD,
    description: 'Creative projects and design',
  },
  community: {
    id: 'community',
    label: 'Community',
    labelFr: 'Communauté',
    icon: '👥',
    color: BRAND_COLORS.SHADOW_MOSS,
    description: 'Community engagement and groups',
  },
  social: {
    id: 'social',
    label: 'Social & Media',
    labelFr: 'Social & Médias',
    icon: '📱',
    color: '#4A90D9',
    description: 'Social connections and media',
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entertainment',
    labelFr: 'Divertissement',
    icon: '🎬',
    color: '#9B59B6',
    description: 'Entertainment and leisure',
  },
  my_team: {
    id: 'my_team',
    label: 'My Team',
    labelFr: 'Mon Équipe',
    icon: '🤝',
    color: BRAND_COLORS.EARTH_EMBER,
    description: 'Team collaboration space',
  },
  scholars: {
    id: 'scholars',
    label: 'Scholars',
    labelFr: 'Académique',
    icon: '📚',
    color: '#2C3E50',
    description: 'Academic and research activities',
  },
} as const;

export const SPHERE_IDS = Object.keys(SPHERES) as SphereId[];
export const SPHERES_LIST = Object.values(SPHERES);
export const SPHERE_COUNT = 9;

// ═══════════════════════════════════════════════════════════════════════════════
// 6 SECTIONS BUREAU — STRUCTURE CANONIQUE
// ═══════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'quickcapture'
  | 'resumeworkspace'
  | 'threads'
  | 'datafiles'
  | 'activeagents'
  | 'meetings';

export interface BureauSectionDefinition {
  readonly id: BureauSectionId;
  readonly label: string;
  readonly labelFr: string;
  readonly icon: string;
  readonly description: string;
  readonly order: number;
}

export const BUREAU_SECTIONS: Record<BureauSectionId, BureauSectionDefinition> = {
  quickcapture: {
    id: 'quickcapture',
    label: 'QuickCapture',
    labelFr: 'Capture Rapide',
    icon: '⚡',
    description: 'Fast input and capture',
    order: 1,
  },
  resumeworkspace: {
    id: 'resumeworkspace',
    label: 'ResumeWorkspace',
    labelFr: 'Espace de Travail',
    icon: '📋',
    description: 'Continue where you left off',
    order: 2,
  },
  threads: {
    id: 'threads',
    label: 'Threads',
    labelFr: 'Fils de Discussion',
    icon: '💬',
    description: 'Conversation threads (.chenu)',
    order: 3,
  },
  datafiles: {
    id: 'datafiles',
    label: 'DataFiles',
    labelFr: 'Fichiers & Données',
    icon: '📁',
    description: 'Data and file management',
    order: 4,
  },
  activeagents: {
    id: 'activeagents',
    label: 'ActiveAgents',
    labelFr: 'Agents Actifs',
    icon: '🤖',
    description: 'Hired agents and execution',
    order: 5,
  },
  meetings: {
    id: 'meetings',
    label: 'Meetings',
    labelFr: 'Réunions',
    icon: '📅',
    description: 'Scheduled meetings and rooms',
    order: 6,
  },
} as const;

export const BUREAU_SECTION_IDS = Object.keys(BUREAU_SECTIONS) as BureauSectionId[];
export const BUREAU_SECTION_COUNT = 6;

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION LEVELS
// ═══════════════════════════════════════════════════════════════════════════════

export type NavigationLevel = 'L0' | 'L1' | 'L2' | 'L3';

export const NAVIGATION_LEVELS = {
  L0: { id: 'L0', label: 'Universe', description: 'Top-level sphere selection' },
  L1: { id: 'L1', label: 'Dashboard', description: 'Sphere dashboard view' },
  L2: { id: 'L2', label: 'Bureau', description: 'Bureau with 6 sections' },
  L3: { id: 'L3', label: 'Workspace', description: 'Deep work context' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE LAWS (10 Laws)
// ═══════════════════════════════════════════════════════════════════════════════

export type GovernanceLawCode = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10';

export const GOVERNANCE_LAWS: Record<GovernanceLawCode, { code: GovernanceLawCode; name: string; description: string }> = {
  L1: { code: 'L1', name: 'Consent Primacy', description: 'Nothing without user approval' },
  L2: { code: 'L2', name: 'Temporal Sovereignty', description: 'User controls timing' },
  L3: { code: 'L3', name: 'Contextual Fidelity', description: 'Actions respect context' },
  L4: { code: 'L4', name: 'Hierarchical Respect', description: 'Agent hierarchy maintained' },
  L5: { code: 'L5', name: 'Audit Completeness', description: 'Everything logged' },
  L6: { code: 'L6', name: 'Encoding Transparency', description: 'Visible and explainable' },
  L7: { code: 'L7', name: 'Agent Non-Autonomy', description: 'Agents never act alone' },
  L8: { code: 'L8', name: 'Budget Accountability', description: 'Token costs transparent' },
  L9: { code: 'L9', name: 'Cross-Sphere Isolation', description: 'Spheres isolated' },
  L10: { code: 'L10', name: 'Deletion Completeness', description: 'Deletions verifiable' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (pure, no state)
// ═══════════════════════════════════════════════════════════════════════════════

export function getSphere(id: SphereId): SphereDefinition {
  return SPHERES[id];
}

export function getBureauSection(id: BureauSectionId): BureauSectionDefinition {
  return BUREAU_SECTIONS[id];
}

export function getOrderedBureauSections(): BureauSectionDefinition[] {
  return BUREAU_SECTION_IDS
    .map(id => BUREAU_SECTIONS[id])
    .sort((a, b) => a.order - b.order);
}

export function isValidSphereId(id: string): id is SphereId {
  return SPHERE_IDS.includes(id as SphereId);
}

export function isValidBureauSectionId(id: string): id is BureauSectionId {
  return BUREAU_SECTION_IDS.includes(id as BureauSectionId);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTION FORBIDDEN TERMS (UI must never display these)
// ═══════════════════════════════════════════════════════════════════════════════

export const CONSTITUTION_FORBIDDEN_TERMS = [
  'budget',
  'cost',
  'price',
  'estimatedCost',
  'tokenBudget',
  '$',
  '€',
  'coût',
  'prix',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SPHERE_ID: SphereId = 'personal';
export const DEFAULT_BUREAU_SECTION_ID: BureauSectionId = 'quickcapture';
export const DEFAULT_NAVIGATION_LEVEL: NavigationLevel = 'L0';
