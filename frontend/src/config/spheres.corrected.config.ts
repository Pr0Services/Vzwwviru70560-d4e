/**
 * CHE·NU™ - CORRECTED Sphere Configuration
 * 
 * CANONICAL 8 SPHERES (FROZEN - NON-NEGOTIABLE):
 * 
 * 1. Personal 🏠
 * 2. Business 💼
 * 3. Government & Institutions 🏛️
 * 4. Creative Studio 🎨
 * 5. Entertainment 🎬
 * 6. Community 👥 (INCLUDES Social & Media)
 * 7. My Team 🤝 (INCLUDES IA Labs, Skills, Tools)
 * 8. Architecture / XR 🏗️
 * 
 * NO additional spheres allowed.
 * NO sphere may be split or merged.
 */

// ═══════════════════════════════════════════════════════════════
// SPHERE IDS - EXACTLY 8
// ═══════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'      // 1. Personal 🏠
  | 'business'      // 2. Business 💼
  | 'government'    // 3. Government & Institutions 🏛️
  | 'design_studio'        // 4. Creative Studio 🎨
  | 'entertainment' // 5. Entertainment 🎬
  | 'community'     // 6. Community 👥 (includes Social & Media)
  | 'my_team'          // 7. My Team 🤝 (includes IA Labs, Skills, Tools)
  | 'architecture'; // 8. Architecture / XR 🏗️

// ═══════════════════════════════════════════════════════════════
// BUREAU SECTIONS - EXACTLY 10 PER SPHERE (FROZEN)
// ═══════════════════════════════════════════════════════════════

export type BureauSectionId =
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'projects'
  | 'threads'
  | 'meetings'
  | 'data'
  | 'agents'
  | 'reports'
  | 'budget';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface SphereSubModule {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
}

export interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  defaultAgents: string[];
  subModules?: SphereSubModule[]; // For spheres with integrated content
}

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  icon: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// BRAND COLORS (FROZEN)
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// 8 SPHERES - CANONICAL STRUCTURE (FROZEN)
// ═══════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereId, Sphere> = {
  // ─────────────────────────────────────────────────────────────
  // 1. PERSONAL 🏠
  // ─────────────────────────────────────────────────────────────
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    color: BRAND_COLORS.cenoteTurquoise,
    description: 'Personal life management, health, family, home',
    defaultAgents: ['personal-assistant', 'health-tracker', 'family-organizer'],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. BUSINESS 💼
  // ─────────────────────────────────────────────────────────────
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Entreprise',
    icon: '💼',
    color: BRAND_COLORS.sacredGold,
    description: 'Professional operations, projects, clients, finance',
    defaultAgents: ['project-manager', 'business-analyst', 'finance-tracker'],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. GOVERNMENT & INSTITUTIONS 🏛️
  // ─────────────────────────────────────────────────────────────
  government: {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: BRAND_COLORS.ancientStone,
    description: 'Official documents, taxes, permits, legal matters',
    defaultAgents: ['legal-assistant', 'document-manager', 'compliance-checker'],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. CREATIVE STUDIO 🎨
  // ─────────────────────────────────────────────────────────────
  studio: {
    id: 'design_studio',
    name: 'Creative Studio',
    nameFr: 'Studio de Création',
    icon: '🎨',
    color: BRAND_COLORS.earthEmber,
    description: 'Design, writing, music, video, creative projects',
    defaultAgents: ['creative-director', 'content-creator', 'design-assistant'],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. ENTERTAINMENT 🎬
  // ─────────────────────────────────────────────────────────────
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    color: BRAND_COLORS.shadowMoss,
    description: 'Media consumption, hobbies, leisure activities',
    defaultAgents: ['media-curator', 'recommendation-engine', 'hobby-tracker'],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. COMMUNITY 👥 (INCLUDES SOCIAL & MEDIA)
  // ─────────────────────────────────────────────────────────────
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    color: BRAND_COLORS.jungleEmerald,
    description: 'Forums, groups, associations, social networks, media presence',
    defaultAgents: ['community-manager', 'event-coordinator', 'social-manager'],
    subModules: [
      {
        id: 'social',
        name: 'Social & Media',
        nameFr: 'Social & Médias',
        icon: '📱',
        description: 'Social networks, media presence, content scheduling',
      },
      {
        id: 'forums',
        name: 'Forums & Groups',
        nameFr: 'Forums & Groupes',
        icon: '💬',
        description: 'Community discussions, group management',
      },
      {
        id: 'associations',
        name: 'Associations',
        nameFr: 'Associations',
        icon: '🤝',
        description: 'Non-profit organizations, volunteer work',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. MY TEAM 🤝 (INCLUDES IA LABS, SKILLS, TOOLS)
  // ─────────────────────────────────────────────────────────────
  team: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    color: BRAND_COLORS.sacredGold,
    description: 'AI agents, skills management, tools registry, team coordination',
    defaultAgents: ['team-coordinator', 'skill-manager', 'tool-registry'],
    subModules: [
      {
        id: 'ia-labs',
        name: 'IA Labs',
        nameFr: 'Labo IA',
        icon: '🧪',
        description: 'AI experimentation, agent testing, prompt engineering',
      },
      {
        id: 'skills',
        name: 'Skills & Tools',
        nameFr: 'Compétences & Outils',
        icon: '🔧',
        description: 'Skill inventory, tool integrations, capability mapping',
      },
      {
        id: 'orchestration',
        name: 'Orchestration',
        nameFr: 'Orchestration',
        icon: '🎯',
        description: 'Orchestrator configuration, agent workflows',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. ARCHITECTURE / XR 🏗️
  // ─────────────────────────────────────────────────────────────
  architecture: {
    id: 'architecture',
    name: 'Architecture / XR',
    nameFr: 'Architecture / XR',
    icon: '🏗️',
    color: BRAND_COLORS.ancientStone,
    description: 'Spatial design, 3D spaces, XR environments, bureau layouts',
    defaultAgents: ['spatial-designer', 'xr-composer', 'layout-optimizer'],
    subModules: [
      {
        id: 'spatial',
        name: 'Spatial Design',
        nameFr: 'Design Spatial',
        icon: '🌐',
        description: '3D space configuration, VR environments',
      },
      {
        id: 'bureau-layout',
        name: 'Bureau Layout',
        nameFr: 'Agencement Bureau',
        icon: '📐',
        description: 'Customize bureau organization and appearance',
      },
      {
        id: 'immersive',
        name: 'Immersive Mode',
        nameFr: 'Mode Immersif',
        icon: '🥽',
        description: 'VR/AR experience settings',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// 10 BUREAU SECTIONS - SAME FOR ALL SPHERES (FROZEN)
// ═══════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: BureauSection[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    description: 'Overview and quick access to key information',
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    description: 'Quick notes and documentation',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: '✅',
    description: 'Task management and to-do lists',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '📁',
    description: 'Project organization and tracking',
  },
  {
    id: 'threads',
    name: 'Threads (.chenu)',
    icon: '🧵',
    description: 'Persistent lines of thought with AI',
  },
  {
    id: 'meetings',
    name: 'Meetings',
    icon: '📅',
    description: 'Meeting scheduling and notes',
  },
  {
    id: 'data',
    name: 'Data / Database',
    icon: '💾',
    description: 'Structured data and databases',
  },
  {
    id: 'agents',
    name: 'Agents',
    icon: '🤖',
    description: 'AI agent management for this sphere',
  },
  {
    id: 'reports',
    name: 'Reports / History',
    icon: '📈',
    description: 'Reports, analytics, and activity history',
  },
  {
    id: 'budget',
    name: 'Budget & Governance',
    icon: '💰',
    description: 'Token budget and governance rules',
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export const getSphere = (id: SphereId): Sphere => SPHERES[id];

export const getAllSpheres = (): Sphere[] => Object.values(SPHERES);

export const getSphereIds = (): SphereId[] => Object.keys(SPHERES) as SphereId[];

export const getBureauSection = (id: BureauSectionId): BureauSection | undefined =>
  BUREAU_SECTIONS.find((s) => s.id === id);

export const SPHERE_ORDER: SphereId[] = [
  'personal',
  'business',
  'government',
  'design_studio',
  'entertainment',
  'community',
  'my_team',
  'architecture',
];

// ═══════════════════════════════════════════════════════════════
// VALIDATION - Ensure exactly 8 spheres
// ═══════════════════════════════════════════════════════════════

const SPHERE_COUNT = Object.keys(SPHERES).length;
if (SPHERE_COUNT !== 8) {
  logger.error(`❌ VIOLATION: Expected 8 spheres, found ${SPHERE_COUNT}`);
}

const SECTION_COUNT = BUREAU_SECTIONS.length;
if (SECTION_COUNT !== 10) {
  logger.error(`❌ VIOLATION: Expected 10 bureau sections, found ${SECTION_COUNT}`);
}

export default SPHERES;
