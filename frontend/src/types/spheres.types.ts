/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SPHERE TYPES (SINGLE SOURCE OF TRUTH)           ║
 * ║                    Types Centralisés pour toutes les Sphères                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * CE FICHIER EST LA SOURCE UNIQUE DE VÉRITÉ POUR:
 * - SphereId (les 9 sphères)
 * - BureauSectionId (les sections du bureau)
 * - NovaState (les états de Nova)
 * - AgentLevel (niveaux d'agents)
 * - Toutes les configurations de sphères
 * 
 * RÈGLE: Tous les autres fichiers DOIVENT importer depuis ce fichier.
 * NE PAS redéfinir ces types ailleurs.
 * 
 * @version 51.0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE ID — LES 9 SPHÈRES (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Les 9 sphères CHE·NU — Structure FROZEN
 * NE PAS ajouter ou supprimer de sphères
 */
export type SphereId =
  | 'personal'       // 🏠 Personnel
  | 'business'       // 💼 Business
  | 'government'     // 🏛️ Institutions
  | 'design_studio'         // 🎨 Studio de création
  | 'community'      // 👥 Communauté
  | 'social'         // 📱 Social & Média
  | 'entertainment'  // 🎬 Loisirs
  | 'my_team'           // 🤝 Mon Équipe
  | 'scholars';       // 📚 Savoir

/**
 * Liste ordonnée des IDs de sphères
 */
export const SPHERE_IDS: SphereId[] = [
  'personal',
  'business',
  'government',
  'design_studio',
  'community',
  'social',
  'entertainment',
  'my_team',
  'scholars',
];

/**
 * Nombre total de sphères (FROZEN à 9)
 */
export const TOTAL_SPHERES = 9;

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION ID — LES SECTIONS DU BUREAU
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sections CORE du bureau (6 sections principales)
 */
export type BureauCoreSectionId =
  | 'dashboard'   // 📊 Tableau de bord
  | 'notes'       // 📝 Notes
  | 'tasks'       // ✅ Tâches
  | 'projects'    // 📁 Projets
  | 'threads'     // 🧵 Threads (.chenu)
  | 'meetings';   // 📅 Réunions

/**
 * Sections EXTENDED du bureau (optionnelles)
 */
export type BureauExtendedSectionId =
  | 'data'        // 🗄️ Données
  | 'agents'      // 🤖 Agents
  | 'reports'     // 📈 Rapports
  | 'budget';     // 💰 Budget & Gouvernance

/**
 * Toutes les sections du bureau
 */
export type BureauSectionId = BureauCoreSectionId | BureauExtendedSectionId;

/**
 * Liste des sections core
 */
export const BUREAU_CORE_SECTIONS: BureauCoreSectionId[] = [
  'dashboard',
  'notes',
  'tasks',
  'projects',
  'threads',
  'meetings',
];

/**
 * Liste des sections étendues
 */
export const BUREAU_EXTENDED_SECTIONS: BureauExtendedSectionId[] = [
  'data',
  'agents',
  'reports',
  'budget',
];

/**
 * Toutes les sections
 */
export const ALL_BUREAU_SECTIONS: BureauSectionId[] = [
  ...BUREAU_CORE_SECTIONS,
  ...BUREAU_EXTENDED_SECTIONS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA STATE — ÉTATS DE L'INTELLIGENCE SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * États de Nova
 */
export type NovaState =
  | 'idle'       // État repos
  | 'listening'  // Écoute active
  | 'thinking'   // Réflexion en cours
  | 'speaking'   // Communication
  | 'action';    // Exécution d'action

/**
 * Liste des états Nova
 */
export const NOVA_STATES: NovaState[] = [
  'idle',
  'listening',
  'thinking',
  'speaking',
  'action',
];

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT LEVELS — HIÉRARCHIE DES AGENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Niveaux d'agents
 */
export type AgentLevel =
  | 'L0'   // System (Nova)
  | 'L1'   // Directors (9)
  | 'L2'   // Managers (~27)
  | 'L3';  // Task Agents (~189)

/**
 * Configuration des niveaux d'agents
 */
export const AGENT_LEVELS: Record<AgentLevel, { name: string; count: number; description: string }> = {
  L0: { name: 'System', count: 1, description: 'Nova - Intelligence système centrale' },
  L1: { name: 'Directors', count: 9, description: 'Un par sphère' },
  L2: { name: 'Managers', count: 27, description: 'Spécialistes par domaine' },
  L3: { name: 'Task Agents', count: 189, description: 'Agents de tâches spécifiques' },
};

/**
 * Total des agents
 */
export const TOTAL_AGENTS = 226;

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT TYPES — GOUVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Types de checkpoints
 */
export type CheckpointType =
  | 'action'     // Action critique
  | 'data'       // Accès données sensibles
  | 'cost'       // Coût tokens élevé
  | 'external';  // Action externe

/**
 * États des checkpoints
 */
export type CheckpointState =
  | 'pending'    // En attente d'approbation
  | 'approved'   // Approuvé
  | 'rejected';  // Refusé

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CONFIGURATION — CONFIGURATION COMPLÈTE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration complète d'une sphère
 */
export interface SphereConfig {
  id: SphereId;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
  color: string;
  order: number;
  features: string[];
}

/**
 * Configuration des 9 sphères
 */
export const SPHERE_CONFIGS: Record<SphereId, SphereConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    description: 'Personal life and wellness management',
    descriptionFr: 'Vie personnelle et bien-être',
    icon: '🏠',
    color: '#3EB4A2',
    order: 1,
    features: ['health', 'finances', 'family', 'goals', 'habits'],
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Business',
    description: 'Business operations and management',
    descriptionFr: 'Opérations et gestion d\'entreprise',
    icon: '💼',
    color: '#D8B26A',
    order: 2,
    features: ['projects', 'clients', 'invoicing', 'contracts', 'crm'],
  },
  government: {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Institutions',
    description: 'Government relations and compliance',
    descriptionFr: 'Relations institutionnelles et conformité',
    icon: '🏛️',
    color: '#8D8371',
    order: 3,
    features: ['permits', 'compliance', 'taxes', 'regulations', 'grants'],
  },
  studio: {
    id: 'design_studio',
    name: 'Creative Studio',
    nameFr: 'Studio',
    description: 'Creative projects and design',
    descriptionFr: 'Projets créatifs et design',
    icon: '🎨',
    color: '#7A593A',
    order: 4,
    features: ['design', 'media', 'branding', 'content', 'portfolio'],
  },
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    description: 'Community engagement and groups',
    descriptionFr: 'Engagement communautaire et groupes',
    icon: '👥',
    color: '#3F7249',
    order: 5,
    features: ['groups', 'forums', 'events', 'volunteering', 'associations'],
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social',
    description: 'Social media and communications',
    descriptionFr: 'Médias sociaux et communications',
    icon: '📱',
    color: '#2F4C39',
    order: 6,
    features: ['social_media', 'messaging', 'networking', 'content', 'analytics'],
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Loisirs',
    description: 'Entertainment and leisure',
    descriptionFr: 'Divertissement et détente',
    icon: '🎬',
    color: '#E9E4D6',
    order: 7,
    features: ['movies', 'music', 'games', 'books', 'hobbies'],
  },
  team: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Équipe',
    description: 'Team collaboration and tools',
    descriptionFr: 'Collaboration et outils d\'équipe',
    icon: '🤝',
    color: '#5ED8FF',
    order: 8,
    features: ['collaboration', 'agents', 'skills', 'scholars', 'integrations'],
  },
  scholar: {
    id: 'scholars',
    name: 'Scholar',
    nameFr: 'Savoir',
    description: 'Learning and knowledge management',
    descriptionFr: 'Apprentissage et gestion des connaissances',
    icon: '📚',
    color: '#9B59B6',
    order: 9,
    features: ['courses', 'research', 'library', 'certifications', 'skills'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration d'une section du bureau
 */
export interface BureauSectionConfig {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  description: string;
  icon: string;
  isCore: boolean;
  order: number;
}

/**
 * Configuration des sections du bureau
 */
export const BUREAU_SECTION_CONFIGS: Record<BureauSectionId, BureauSectionConfig> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    nameFr: 'Tableau de bord',
    description: 'Vue d\'ensemble et métriques',
    icon: '📊',
    isCore: true,
    order: 1,
  },
  notes: {
    id: 'notes',
    name: 'Notes',
    nameFr: 'Notes',
    description: 'Capture rapide et organisation',
    icon: '📝',
    isCore: true,
    order: 2,
  },
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    nameFr: 'Tâches',
    description: 'Gestion des tâches et to-dos',
    icon: '✅',
    isCore: true,
    order: 3,
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    nameFr: 'Projets',
    description: 'Projets et initiatives',
    icon: '📁',
    isCore: true,
    order: 4,
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    nameFr: 'Threads',
    description: 'Fils de discussion .chenu',
    icon: '🧵',
    isCore: true,
    order: 5,
  },
  meetings: {
    id: 'meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    description: 'Calendrier et réunions',
    icon: '📅',
    isCore: true,
    order: 6,
  },
  data: {
    id: 'data',
    name: 'Data',
    nameFr: 'Données',
    description: 'Base de données et fichiers',
    icon: '🗄️',
    isCore: false,
    order: 7,
  },
  agents: {
    id: 'agents',
    name: 'Agents',
    nameFr: 'Agents',
    description: 'Agents IA actifs',
    icon: '🤖',
    isCore: false,
    order: 8,
  },
  reports: {
    id: 'reports',
    name: 'Reports',
    nameFr: 'Rapports',
    description: 'Historique et rapports',
    icon: '📈',
    isCore: false,
    order: 9,
  },
  budget: {
    id: 'budget',
    name: 'Budget',
    nameFr: 'Budget',
    description: 'Gouvernance et tokens',
    icon: '💰',
    isCore: false,
    order: 10,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Vue actuelle de l'application
 */
export type ViewType =
  | 'universe'    // Vue univers (9 sphères)
  | 'map'         // Vue carte
  | 'sphere'      // Vue intérieure d'une sphère
  | 'section'     // Vue d'une section du bureau
  | 'nova';       // Panel Nova

/**
 * État de navigation
 */
export interface NavigationState {
  currentView: ViewType;
  activeSphere: SphereId | null;
  activeSection: BureauSectionId | null;
  previousView: ViewType | null;
  history: NavigationHistoryEntry[];
}

/**
 * Entrée d'historique de navigation
 */
export interface NavigationHistoryEntry {
  view: ViewType;
  sphere: SphereId | null;
  section: BureauSectionId | null;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Vérifie si un ID est un SphereId valide
 */
export function isValidSphereId(id: string): id is SphereId {
  return SPHERE_IDS.includes(id as SphereId);
}

/**
 * Vérifie si un ID est un BureauSectionId valide
 */
export function isValidSectionId(id: string): id is BureauSectionId {
  return ALL_BUREAU_SECTIONS.includes(id as BureauSectionId);
}

/**
 * Récupère la configuration d'une sphère
 */
export function getSphereConfig(id: SphereId): SphereConfig {
  return SPHERE_CONFIGS[id];
}

/**
 * Récupère la configuration d'une section
 */
export function getSectionConfig(id: BureauSectionId): BureauSectionConfig {
  return BUREAU_SECTION_CONFIGS[id];
}

/**
 * Récupère la couleur d'une sphère
 */
export function getSphereColor(id: SphereId): string {
  return SPHERE_CONFIGS[id].color;
}

/**
 * Récupère l'icône d'une sphère
 */
export function getSphereIcon(id: SphereId): string {
  return SPHERE_CONFIGS[id].icon;
}

/**
 * Récupère le nom français d'une sphère
 */
export function getSphereName(id: SphereId, lang: 'en' | 'fr' = 'fr'): string {
  return lang === 'fr' ? SPHERE_CONFIGS[id].nameFr : SPHERE_CONFIGS[id].name;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
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
};
