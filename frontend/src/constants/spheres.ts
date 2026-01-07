/**
 * CHE·NU™ - 8 SPHERES DEFINITION
 * Governed Intelligence Operating System
 * 
 * Each sphere represents a major life domain with its own Bureau
 * containing exactly 10 sections.
 */

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team';

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

export interface Sphere {
  id: SphereId;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  description: string;
  descriptionFr: string;
}

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// 8 SPHERES - FROZEN STRUCTURE (DO NOT MODIFY)
// ═══════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereId, Sphere> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    color: '#3EB4A2', // Cenote Turquoise
    description: 'Personal life management, health, family, home',
    descriptionFr: 'Gestion de vie personnelle, santé, famille, maison'
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Entreprise',
    icon: '💼',
    color: '#D8B26A', // Sacred Gold
    description: 'Professional operations, projects, clients',
    descriptionFr: 'Opérations professionnelles, projets, clients'
  },
  government: {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: '#8D8371', // Ancient Stone
    description: 'Administrative, legal, governmental interactions',
    descriptionFr: 'Interactions administratives, légales, gouvernementales'
  },
  studio: {
    id: 'design_studio',
    name: 'Creative Studio',
    nameFr: 'Studio de Création',
    icon: '🎨',
    color: '#7A593A', // Earth Ember
    description: 'Design, writing, music, video, creative work',
    descriptionFr: 'Design, écriture, musique, vidéo, travail créatif'
  },
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    color: '#3F7249', // Jungle Emerald
    description: 'Forums, groups, community building, events',
    descriptionFr: 'Forums, groupes, construction communautaire, événements'
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Média',
    icon: '📱',
    color: '#2F4C39', // Shadow Moss
    description: 'Social networks, messaging, relationships',
    descriptionFr: 'Réseaux sociaux, messagerie, relations'
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    color: '#E9E4D6', // Soft Sand
    description: 'Media, streaming, games, leisure',
    descriptionFr: 'Médias, streaming, jeux, loisirs'
  },
  team: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    color: '#1E1F22', // UI Slate
    description: 'Team collaboration, IA Labs, Skills & Tools',
    descriptionFr: 'Collaboration équipe, IA Labs, Compétences & Outils'
  }
};

// ═══════════════════════════════════════════════════════════════
// 10 BUREAU SECTIONS - FROZEN STRUCTURE (DO NOT MODIFY)
// ═══════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: Record<BureauSectionId, BureauSection> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    nameFr: 'Tableau de bord',
    icon: '📊',
    description: 'Overview and key metrics'
  },
  notes: {
    id: 'notes',
    name: 'Notes',
    nameFr: 'Notes',
    icon: '📝',
    description: 'Notes and quick captures'
  },
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    nameFr: 'Tâches',
    icon: '✅',
    description: 'Task management and to-dos'
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    nameFr: 'Projets',
    icon: '📁',
    description: 'Project organization and tracking'
  },
  threads: {
    id: 'threads',
    name: 'Threads (.chenu)',
    nameFr: 'Fils (.chenu)',
    icon: '🧵',
    description: 'Persistent lines of thought'
  },
  meetings: {
    id: 'meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Meeting management and scheduling'
  },
  data: {
    id: 'data',
    name: 'Data / Database',
    nameFr: 'Données / Base de données',
    icon: '🗄️',
    description: 'DataSpaces and structured information'
  },
  agents: {
    id: 'agents',
    name: 'Agents',
    nameFr: 'Agents',
    icon: '🤖',
    description: 'AI agents for this sphere'
  },
  reports: {
    id: 'reports',
    name: 'Reports / History',
    nameFr: 'Rapports / Historique',
    icon: '📈',
    description: 'Reports and audit history'
  },
  budget: {
    id: 'budget',
    name: 'Budget & Governance',
    nameFr: 'Budget & Gouvernance',
    icon: '💰',
    description: 'Token budget and governance rules'
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getSphereById = (id: SphereId): Sphere => SPHERES[id];

export const getBureauSectionById = (id: BureauSectionId): BureauSection => 
  BUREAU_SECTIONS[id];

export const getAllSpheres = (): Sphere[] => Object.values(SPHERES);

export const getAllBureauSections = (): BureauSection[] => 
  Object.values(BUREAU_SECTIONS);

export const getSphereRoute = (sphereId: SphereId, sectionId?: BureauSectionId): string => {
  if (sectionId) {
    return `/${sphereId}/${sectionId}`;
  }
  return `/${sphereId}`;
};

// Default sphere when user first loads
export const DEFAULT_SPHERE: SphereId = 'personal';
export const DEFAULT_SECTION: BureauSectionId = 'dashboard';
