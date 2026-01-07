/**
 * CHE·NU™ — SPHERES & BUREAUX CANONICAL CONFIG
 * FROZEN ARCHITECTURE - DO NOT MODIFY STRUCTURE
 * 
 * Rules:
 * - Exactly 8 Spheres (NO MORE, NO LESS)
 * - Each Bureau has exactly 6 sections
 * - This is the SINGLE SOURCE OF TRUTH
 */

// =============================================================================
// SPHERE TYPES
// =============================================================================

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team';

export interface SphereConfig {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  description: string;
  bureauSections?: string[];
}

// =============================================================================
// THE 8 SPHERES (FROZEN)
// =============================================================================

export const SPHERES: Record<SphereId, SphereConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    color: '#3b82f6',
    description: 'Personal life management'
  },
  business: {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: '#8b5cf6',
    description: 'Professional and business activities'
  },
  government: {
    id: 'government',
    name: 'Government & Institutions',
    icon: '🏛️',
    color: '#6366f1',
    description: 'Government, legal, institutional'
  },
  studio: {
    id: 'design_studio',
    name: 'Studio de création',
    icon: '🎨',
    color: '#ec4899',
    description: 'Creative projects and studio'
  },
  community: {
    id: 'community',
    name: 'Community',
    icon: '👥',
    color: '#14b8a6',
    description: 'Community engagement'
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    icon: '📱',
    color: '#f59e0b',
    description: 'Social networks and media'
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#ef4444',
    description: 'Entertainment and leisure'
  },
  team: {
    id: 'my_team',
    name: 'My Team',
    icon: '🤝',
    color: '#22c55e',
    description: 'Team management and collaboration'
  }
};

export const SPHERE_LIST: SphereConfig[] = Object.values(SPHERES);
export const SPHERE_IDS: SphereId[] = Object.keys(SPHERES) as SphereId[];

// =============================================================================
// BUREAU SECTIONS (10 per bureau - FROZEN)
// =============================================================================

export interface BureauSection {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export const BUREAU_SECTIONS_CATALOG: BureauSection[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', order: 1 },
  { id: 'notes', name: 'Notes', icon: '📝', order: 2 },
  { id: 'tasks', name: 'Tasks', icon: '✅', order: 3 },
  { id: 'projects', name: 'Projects', icon: '📁', order: 4 },
  { id: 'threads', name: 'Threads (.chenu)', icon: '💬', order: 5 },
  { id: 'meetings', name: 'Meetings', icon: '🎯', order: 6 },
  { id: 'data', name: 'Data / Database', icon: '🗄️', order: 7 },
  { id: 'agents', name: 'Agents', icon: '🤖', order: 8 },
  { id: 'reports', name: 'Reports / History', icon: '📈', order: 9 },
  { id: 'budget', name: 'Budget & Governance', icon: '💰', order: 10 },
];

export const DEFAULT_BUREAU_SECTIONS = BUREAU_SECTIONS_CATALOG.map(s => s.id);
export const MAX_BUREAU_SECTIONS = 10;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const mapLegacySphere = (legacyId: string): SphereId | null => {
  const mapping: Record<string, SphereId> = {
    'perso': 'personal',
    'pro': 'business',
    'gov': 'government',
    'creative': 'design_studio',
    'social-media': 'social',
    'fun': 'entertainment',
    'collab': 'my_team'
  };
  return mapping[legacyId] || (SPHERE_IDS.includes(legacyId as SphereId) ? legacyId as SphereId : null);
};

export const getBureauSections = (sphereId: SphereId): BureauSection[] => {
  // All spheres have the same 6 sections
  return BUREAU_SECTIONS_CATALOG;
};

export const validateBureauSections = (sections: string[]): boolean => {
  if (sections.length > MAX_BUREAU_SECTIONS) return false;
  const validIds = BUREAU_SECTIONS_CATALOG.map(s => s.id);
  return sections.every(s => validIds.includes(s));
};

export default {
  SPHERES,
  SPHERE_LIST,
  SPHERE_IDS,
  BUREAU_SECTIONS_CATALOG,
  DEFAULT_BUREAU_SECTIONS,
  MAX_BUREAU_SECTIONS,
  mapLegacySphere,
  getBureauSections,
  validateBureauSections
};
