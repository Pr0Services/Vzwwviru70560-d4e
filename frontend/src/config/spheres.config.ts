/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SPHERE CONFIGURATION V51 FINAL
 * 9 SPHÈRES EXACTEMENT — STRUCTURE GELÉE
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * HIERARCHY:
 * 
 * PERSONAL (dominant) ─── Identity Root
 *     │                   - ALWAYS ACTIVE
 *     │                   - IS NOT A WORKSPACE
 *     │                   - PROVIDES CONTEXT TO: ALL 8 other spheres
 *     │
 *     └──► MY_TEAM (dual) ─── Collective Extension
 *               │              - SELECTABLE (on/off)
 *               │              - IS WORKSPACE + TRANSVERSAL
 *               │              - DEPENDS ON: personal
 *               │              - RECEIVES FROM: personal
 *               │              - PROVIDES TO: 7 contextual spheres
 *               │
 *               └──► 7 CONTEXTUAL SPHERES
 *                    (business, government, design_studio, community,
 *                     social, entertainment, scholars)
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'        // 🏠 Personal (dominant)
  | 'my_team'         // 🤝 My Team (dual)
  | 'business'        // 💼 Business (contextual)
  | 'government'      // 🏛️ Government & Institutions (contextual)
  | 'design_studio'   // 🎨 Studio de création (contextual)
  | 'community'       // 👥 Community (contextual)
  | 'social'          // 📱 Social & Media (contextual)
  | 'entertainment'   // 🎬 Entertainment (contextual)
  | 'scholars';       // 📚 Scholars (contextual)

export type SphereRole = 'dominant' | 'dual' | 'contextual';

export interface SphereLinks {
  receivesContextFrom: SphereId[];
  providesContextTo: SphereId[];
}

export interface SphereCapabilities {
  isWorkspace: boolean;
  isTransversal: boolean;
  canBeDisabled: boolean;
  isAlwaysActive: boolean;
}

export interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  descriptionFr: string;
  role: SphereRole;
  links: SphereLinks;
  capabilities: SphereCapabilities;
  defaultAgents: string[];
  sortOrder: number;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// BRAND COLORS (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════════

export const BRAND_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════════
// 9 SPHERES — FROZEN STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereId, Sphere> = {
  // ─────────────────────────────────────────────────────────────
  // 1. PERSONAL 🏠 — DOMINANT (Identity Root)
  // ─────────────────────────────────────────────────────────────
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    color: BRAND_COLORS.sacredGold,
    description: 'Identity root. Personal life, health, family, wellbeing, values.',
    descriptionFr: 'Racine identitaire. Vie personnelle, santé, famille, bien-être, valeurs.',
    role: 'dominant',
    links: {
      receivesContextFrom: [],
      providesContextTo: ['my_team', 'business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'scholars'],
    },
    capabilities: {
      isWorkspace: false,
      isTransversal: true,
      canBeDisabled: false,
      isAlwaysActive: true,
    },
    defaultAgents: ['nova', 'personal-assistant'],
    sortOrder: 1,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. MY TEAM 🤝 — DUAL (Collective Extension)
  // ─────────────────────────────────────────────────────────────
  my_team: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    color: BRAND_COLORS.cenoteTurquoise,
    description: 'Collective extension. Team coordination, roles, shared responsibility.',
    descriptionFr: 'Extension collective. Coordination d\'équipe, rôles, responsabilités partagées.',
    role: 'dual',
    links: {
      receivesContextFrom: ['personal'],
      providesContextTo: ['business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'scholars'],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: true,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'team-coordinator'],
    sortOrder: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. BUSINESS 💼 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Entreprise',
    icon: '💼',
    color: BRAND_COLORS.ancientStone,
    description: 'Business domain. Operations, strategy, clients, finance.',
    descriptionFr: 'Domaine professionnel. Opérations, stratégie, clients, finances.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'business-analyst', 'project-manager'],
    sortOrder: 3,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. GOVERNMENT 🏛️ — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  government: {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: BRAND_COLORS.uiSlate,
    description: 'Institutional domain. Government, legal, compliance, permits.',
    descriptionFr: 'Domaine institutionnel. Gouvernement, légal, conformité, permis.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'legal-assistant', 'document-manager'],
    sortOrder: 4,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. DESIGN STUDIO 🎨 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  design_studio: {
    id: 'design_studio',
    name: 'Creative Studio',
    nameFr: 'Studio de Création',
    icon: '🎨',
    color: BRAND_COLORS.earthEmber,
    description: 'Creative domain. Design, art, media production, branding.',
    descriptionFr: 'Domaine créatif. Design, art, production média, branding.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'creative-director', 'design-assistant'],
    sortOrder: 5,
  },

  // ─────────────────────────────────────────────────────────────
  // 6. COMMUNITY 👥 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    color: BRAND_COLORS.shadowMoss,
    description: 'Community domain. Local groups, associations, collective initiatives.',
    descriptionFr: 'Domaine communautaire. Groupes locaux, associations, initiatives collectives.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'community-manager'],
    sortOrder: 6,
  },

  // ─────────────────────────────────────────────────────────────
  // 7. SOCIAL 📱 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  social: {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Médias',
    icon: '📱',
    color: BRAND_COLORS.jungleEmerald,
    description: 'Social domain. Online networks, communication, media.',
    descriptionFr: 'Domaine social. Réseaux en ligne, communication, médias.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'social-assistant'],
    sortOrder: 7,
  },

  // ─────────────────────────────────────────────────────────────
  // 8. ENTERTAINMENT 🎬 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    color: '#9B4DCA',
    description: 'Entertainment domain. Leisure, gaming, streaming, travel.',
    descriptionFr: 'Domaine divertissement. Loisirs, jeux, streaming, voyages.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'entertainment-curator'],
    sortOrder: 8,
  },

  // ─────────────────────────────────────────────────────────────
  // 9. SCHOLARS 📚 — CONTEXTUAL
  // ─────────────────────────────────────────────────────────────
  scholars: {
    id: 'scholars',
    name: 'Scholars',
    nameFr: 'Érudition',
    icon: '📚',
    color: BRAND_COLORS.softSand,
    description: 'Academic domain. Research, learning, knowledge, education.',
    descriptionFr: 'Domaine académique. Recherche, apprentissage, connaissance, éducation.',
    role: 'contextual',
    links: {
      receivesContextFrom: ['personal', 'my_team'],
      providesContextTo: [],
    },
    capabilities: {
      isWorkspace: true,
      isTransversal: false,
      canBeDisabled: true,
      isAlwaysActive: false,
    },
    defaultAgents: ['nova', 'research-assistant', 'learning-coach'],
    sortOrder: 9,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// SPHERE LISTS
// ═══════════════════════════════════════════════════════════════════════════════════

export const SPHERE_LIST: SphereId[] = Object.keys(SPHERES) as SphereId[];

export const CONTEXTUAL_SPHERES: SphereId[] = [
  'business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'scholars'
];

export const TRANSVERSAL_SPHERES: SphereId[] = ['personal', 'my_team'];

// ═══════════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════════

export const SPHERE_COUNT = 9;

// Runtime validation
if (SPHERE_LIST.length !== SPHERE_COUNT) {
  throw new Error(`CRITICAL: Expected ${SPHERE_COUNT} spheres, got ${SPHERE_LIST.length}`);
}

// ═══════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════

export const getSphere = (id: SphereId): Sphere => SPHERES[id];
export const getSphereColor = (id: SphereId): string => SPHERES[id].color;
export const getSphereEmoji = (id: SphereId): string => SPHERES[id].icon;
export const getSphereRole = (id: SphereId): SphereRole => SPHERES[id].role;
export const isSphereId = (id: string): id is SphereId => SPHERE_LIST.includes(id as SphereId);
export const getSphereIds = (): SphereId[] => SPHERE_LIST;

export const getContextProviders = (id: SphereId): SphereId[] => {
  return SPHERES[id].links.receivesContextFrom;
};

export const getContextReceivers = (id: SphereId): SphereId[] => {
  return SPHERES[id].links.providesContextTo;
};

export const canSphereBeDisabled = (id: SphereId): boolean => {
  return SPHERES[id].capabilities.canBeDisabled;
};

export const isSphereAlwaysActive = (id: SphereId): boolean => {
  return SPHERES[id].capabilities.isAlwaysActive;
};

// ═══════════════════════════════════════════════════════════════════════════════════
// L2: BUREAU SECTIONS (6 HARD LIMIT) — Reference
// ═══════════════════════════════════════════════════════════════════════════════════

export type BureauSectionId =
  | 'QUICK_CAPTURE'
  | 'RESUME_WORKSPACE'
  | 'THREADS'
  | 'DATA_FILES'
  | 'ACTIVE_AGENTS'
  | 'MEETINGS';

export interface BureauSection {
  id: BureauSectionId;
  key: string;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
}

export const BUREAU_SECTIONS: BureauSection[] = [
  { id: 'QUICK_CAPTURE', key: 'quick_capture', name: 'Quick Capture', nameFr: 'Capture Rapide', icon: '📝', description: 'Quick notes, voice memos' },
  { id: 'RESUME_WORKSPACE', key: 'resume_workspace', name: 'Resume Work', nameFr: 'Reprendre le Travail', icon: '▶️', description: 'Continue where you left off' },
  { id: 'THREADS', key: 'threads', name: 'Threads', nameFr: 'Fils de Discussion', icon: '💬', description: 'Persistent conversation threads (.chenu)' },
  { id: 'DATA_FILES', key: 'data_files', name: 'Data/Files', nameFr: 'Données/Fichiers', icon: '📁', description: 'DataSpaces and file management' },
  { id: 'ACTIVE_AGENTS', key: 'active_agents', name: 'Active Agents', nameFr: 'Agents Actifs', icon: '🤖', description: 'Currently active AI agents' },
  { id: 'MEETINGS', key: 'meetings', name: 'Meetings', nameFr: 'Réunions', icon: '📅', description: 'Meeting scheduling and management' },
];

export const BUREAU_SECTION_COUNT = 6; // HARD LIMIT

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════════

export default SPHERES;
