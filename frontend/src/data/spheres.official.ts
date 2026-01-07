/**
 * CHE·NU V51 — SPHERES OFFICIAL MODEL
 * STATUS: LOCKED — NO MODIFICATION ALLOWED
 * 
 * FUNDAMENTAL PRINCIPLE:
 * CHE·NU is centered on HUMANS, not organizations.
 * PERSONAL is the ROOT of all meaning.
 * MY TEAM is the COLLECTIVE EXTENSION of that root.
 * 
 * EXACTLY 9 SPHERES — NO MORE, NO LESS
 */

export type SphereRole = 'dominant' | 'dual' | 'contextual';

export interface SphereLinks {
  receivesContextFrom: string[];
  projectsContextTo: string[];
}

export interface SphereCapabilities {
  workspace: boolean;
  transversal_context: boolean;
  identity_root?: boolean;
  collective_extension?: boolean;
}

export interface SphereDefinition {
  id: string;
  name: string;
  icon: string;
  role: SphereRole;
  links: SphereLinks;
  capabilities: SphereCapabilities;
  description: string;
  color: string;
}

/**
 * OFFICIAL 9 SPHERES — EXACTLY 9, NO MORE, NO LESS
 * 
 * Hierarchy:
 * 1. PERSONAL (dominant) — Identity Root
 * 2. MY_TEAM (dual) — Collective Extension
 * 3-9. Contextual Spheres — Domain Spaces (7 spheres)
 */
export const SPHERES_OFFICIAL: SphereDefinition[] = [
  // ═══════════════════════════════════════════
  // A) PERSONAL — IDENTITY ROOT (DOMINANT)
  // ═══════════════════════════════════════════
  {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    role: 'dominant',
    links: {
      receivesContextFrom: [],
      projectsContextTo: ['my_team', 'business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'scholars']
    },
    capabilities: {
      workspace: false,
      transversal_context: true,
      identity_root: true
    },
    description: 'Identity root. Represents the individual human: identity, preferences, intent, history, cognitive context, values & constraints.',
    color: '#D8B26A' // Sacred Gold
  },

  // ═══════════════════════════════════════════
  // B) MY TEAM — COLLECTIVE EXTENSION (DUAL)
  // ═══════════════════════════════════════════
  {
    id: 'my_team',
    name: 'My Team',
    icon: '🤝',
    role: 'dual',
    links: {
      receivesContextFrom: ['personal'],
      projectsContextTo: ['business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'scholars']
    },
    capabilities: {
      workspace: true,
      transversal_context: true,
      collective_extension: true
    },
    description: 'Collective human context. Team composition, roles, coordination, shared responsibility.',
    color: '#3EB4A2' // Cenote Turquoise
  },

  // ═══════════════════════════════════════════
  // C) CONTEXTUAL SPHERES (7 DOMAIN SPACES)
  // ═══════════════════════════════════════════
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Business domain context. Operations, strategy, clients, finance.',
    color: '#8D8371' // Ancient Stone
  },

  {
    id: 'government',
    name: 'Government & Institutions',
    icon: '🏛️',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Institutional domain context. Government, legal, compliance.',
    color: '#1E1F22' // UI Slate
  },

  {
    id: 'design_studio',
    name: 'Studio de création',
    icon: '🎨',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Creative domain context. Design, art, media production.',
    color: '#7A593A' // Earth Ember
  },

  {
    id: 'community',
    name: 'Community',
    icon: '👥',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Community domain context. Groups, organizations, collective initiatives.',
    color: '#2F4C39' // Shadow Moss
  },

  {
    id: 'social',
    name: 'Social & Media',
    icon: '📱',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Social domain context. Communication, media, networking.',
    color: '#3F7249' // Jungle Emerald
  },

  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Entertainment domain context. Media, gaming, leisure.',
    color: '#9B4DCA' // Purple for Entertainment
  },

  {
    id: 'scholars',
    name: 'Scholars',
    icon: '📚',
    role: 'contextual',
    links: { receivesContextFrom: ['personal', 'my_team'], projectsContextTo: [] },
    capabilities: { workspace: true, transversal_context: false },
    description: 'Academic domain context. Research, learning, knowledge.',
    color: '#E9E4D6' // Soft Sand
  }
];

// ═══════════════════════════════════════════
// SPHERE COUNT LOCK — EXACTLY 9
// ═══════════════════════════════════════════

export const SPHERE_COUNT = 9;

if (SPHERES_OFFICIAL.length !== SPHERE_COUNT) {
  throw new Error('CRITICAL: Expected ' + SPHERE_COUNT + ' spheres, got ' + SPHERES_OFFICIAL.length);
}

// Validation
console.assert(SPHERES_OFFICIAL.length === 9, 'CHE·NU requires EXACTLY 9 spheres');

export default SPHERES_OFFICIAL;
