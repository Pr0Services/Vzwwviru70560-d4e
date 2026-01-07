// =============================================================================
// CHE·NU™ — CANONICAL SPHERES CONFIGURATION V2
// =============================================================================
// ⚠️ ARCHITECTURE VERROUILLÉE — NE PAS MODIFIER
// 
// HIÉRARCHIE:
// - Personal (centre absolu, niveau 0)
// - My Team (sphère spéciale, niveau 1)
// - Contextual Spheres (niveau 2)
// =============================================================================

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type SphereId = 
  | 'personal'
  | 'my_team'
  | 'business'
  | 'design_studio'
  | 'social'
  | 'community'
  | 'government'
  | 'scholars'
  | 'entertainment';

export type SphereType = 'personal' | 'my_team' | 'contextual';
export type SphereState = 'latent' | 'active' | 'focus';
export type OrbitLevel = 0 | 1 | 2;

// -----------------------------------------------------------------------------
// SPHERE NODE (CANONICAL)
// -----------------------------------------------------------------------------

export interface SphereNode {
  id: SphereId;
  label: string;
  labelFr: string;
  type: SphereType;
  
  state: SphereState;
  
  relations: {
    parent: 'personal' | 'my_team' | null;
    linkedToTeam: boolean;
  };
  
  visual: {
    orbitLevel: OrbitLevel;
    emoji: string;
    color: string;
    priority: number;  // 1 = highest
  };
  
  description: string;
  descriptionFr: string;
  
  meta?: {
    createdAt?: string;
    lastActiveAt?: string;
    activityScore?: number;
  };
}

// -----------------------------------------------------------------------------
// CANONICAL SPHERES DEFINITION
// -----------------------------------------------------------------------------

/**
 * 🔴 PERSONAL — Centre Absolu (Niveau 0)
 * Toujours présent, toujours actif, jamais optionnel
 */
export const SPHERE_PERSONAL: SphereNode = {
  id: 'personal',
  label: 'Personal',
  labelFr: 'Personnel',
  type: 'personal',
  state: 'active',  // Toujours actif
  relations: {
    parent: null,  // Pas de parent
    linkedToTeam: false
  },
  visual: {
    orbitLevel: 0,  // Centre
    emoji: '🏠',
    color: '#6366F1',
    priority: 1
  },
  description: 'Private life, health, family, personal identity',
  descriptionFr: 'Vie privée, santé, famille, identité personnelle'
};

/**
 * 🔵 MY TEAM — Sphère Spéciale (Niveau 1)
 * Pont entre Personal et les sphères contextuelles
 */
export const SPHERE_TEAM: SphereNode = {
  id: 'my_team',
  label: 'My Team',
  labelFr: 'Mon Équipe',
  type: 'my_team',
  state: 'active',
  relations: {
    parent: 'personal',
    linkedToTeam: false  // Elle EST My Team
  },
  visual: {
    orbitLevel: 1,  // Premier anneau
    emoji: '🤝',
    color: '#06B6D4',
    priority: 2
  },
  description: 'Team management, collaboration, agents, delegation',
  descriptionFr: 'Gestion d\'équipe, collaboration, agents, délégation'
};

/**
 * 🌐 SPHERES CONTEXTUELLES (Niveau 2)
 */
export const CONTEXTUAL_SPHERES: SphereNode[] = [
  {
    id: 'business',
    label: 'Enterprise',
    labelFr: 'Entreprise',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '💼',
      color: '#10B981',
      priority: 3
    },
    description: 'Professional work, projects, clients, operations',
    descriptionFr: 'Travail professionnel, projets, clients, opérations'
  },
  {
    id: 'design_studio',
    label: 'Design Studio',
    labelFr: 'Studio Créatif',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '🎨',
      color: '#EC4899',
      priority: 4
    },
    description: 'Art, design, content creation, multimedia',
    descriptionFr: 'Art, design, création de contenu, multimédia'
  },
  {
    id: 'social',
    label: 'Social',
    labelFr: 'Social & Médias',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '📱',
      color: '#3B82F6',
      priority: 5
    },
    description: 'Social media, online presence, networking',
    descriptionFr: 'Médias sociaux, présence en ligne, réseautage'
  },
  {
    id: 'community',
    label: 'Community',
    labelFr: 'Communauté',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '👥',
      color: '#F97316',
      priority: 6
    },
    description: 'Local relations, associations, events',
    descriptionFr: 'Relations locales, associations, événements'
  },
  {
    id: 'government',
    label: 'Government',
    labelFr: 'Gouvernement',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '🏛️',
      color: '#EF4444',
      priority: 7
    },
    description: 'Government, compliance, legal, regulations',
    descriptionFr: 'Gouvernement, conformité, légal, réglementations'
  },
  {
    id: 'scholars',
    label: 'Scholars',
    labelFr: 'Études & Recherche',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'my_team',
      linkedToTeam: true
    },
    visual: {
      orbitLevel: 2,
      emoji: '🎓',
      color: '#7C3AED',
      priority: 8
    },
    description: 'Education, research, learning, academic pursuits',
    descriptionFr: 'Éducation, recherche, apprentissage'
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    labelFr: 'Divertissement',
    type: 'contextual',
    state: 'latent',
    relations: {
      parent: 'personal',  // Lié à Personal directement (loisirs personnels)
      linkedToTeam: false
    },
    visual: {
      orbitLevel: 2,
      emoji: '🎬',
      color: '#8B5CF6',
      priority: 9
    },
    description: 'Leisure, movies, games, travel, hobbies',
    descriptionFr: 'Loisirs, films, jeux, voyage, hobbies'
  }
];

// -----------------------------------------------------------------------------
// ALL SPHERES (ORDERED)
// -----------------------------------------------------------------------------

export const ALL_SPHERES: SphereNode[] = [
  SPHERE_PERSONAL,
  SPHERE_TEAM,
  ...CONTEXTUAL_SPHERES
];

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

export const getSphereById = (id: SphereId): SphereNode | undefined =>
  ALL_SPHERES.find(s => s.id === id);

export const getSpheresByLevel = (level: OrbitLevel): SphereNode[] =>
  ALL_SPHERES.filter(s => s.visual.orbitLevel === level);

export const getSpheresByType = (type: SphereType): SphereNode[] =>
  ALL_SPHERES.filter(s => s.type === type);

export const getActiveSpheres = (): SphereNode[] =>
  ALL_SPHERES.filter(s => s.state === 'active');

// -----------------------------------------------------------------------------
// VALIDATION
// -----------------------------------------------------------------------------

export const validateSphereHierarchy = (): boolean => {
  // Personal must be level 0
  if (SPHERE_PERSONAL.visual.orbitLevel !== 0) return false;
  
  // Team must be level 1
  if (SPHERE_TEAM.visual.orbitLevel !== 1) return false;
  
  // All contextual must be level 2
  for (const s of CONTEXTUAL_SPHERES) {
    if (s.visual.orbitLevel !== 2) return false;
  }
  
  return true;
};

// Run validation on load
if (!validateSphereHierarchy()) {
  logger.error('❌ SPHERE HIERARCHY VALIDATION FAILED');
}
