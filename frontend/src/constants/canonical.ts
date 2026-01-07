/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — CANONICAL CONSTANTS v40
   Architecture GELÉE - 9 SPHÈRES + 6 SECTIONS BUREAU
   
   ⚠️ NE PAS MODIFIER SANS AUTORISATION
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// 9 SPHÈRES (FROZEN) - Incluant Scholar 📚
// ════════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'creative'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholars'; // 9ème sphère ajoutée

export interface SphereConfig {
  id: SphereId;
  name: string;
  nameFr: string;
  nameEs: string;
  icon: string;
  color: string;
  route: string;
  description: string;
  descriptionFr: string;
  order: number;
}

export const SPHERES: SphereConfig[] = [
  {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    nameEs: 'Personal',
    icon: '🏠',
    color: '#D8B26A', // Sacred Gold
    route: '/personal',
    description: 'Your private life management',
    descriptionFr: 'Gestion de votre vie privée',
    order: 1,
  },
  {
    id: 'business',
    name: 'Business',
    nameFr: 'Affaires',
    nameEs: 'Negocios',
    icon: '💼',
    color: '#8D8371', // Ancient Stone
    route: '/business',
    description: 'Professional and enterprise',
    descriptionFr: 'Professionnel et entreprise',
    order: 2,
  },
  {
    id: 'government',
    name: 'Government & Institutions',
    nameFr: 'Gouvernement & Institutions',
    nameEs: 'Gobierno e Instituciones',
    icon: '🏛️',
    color: '#2F4C39', // Shadow Moss
    route: '/government',
    description: 'Administrative and legal affairs',
    descriptionFr: 'Affaires administratives et légales',
    order: 3,
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    nameFr: 'Studio de création',
    nameEs: 'Estudio Creativo',
    icon: '🎨',
    color: '#7A593A', // Earth Ember
    route: '/creative',
    description: 'Creative projects and design',
    descriptionFr: 'Projets créatifs et design',
    order: 4,
  },
  {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    nameEs: 'Comunidad',
    icon: '👥',
    color: '#3F7249', // Jungle Emerald
    route: '/community',
    description: 'Groups and associations',
    descriptionFr: 'Groupes et associations',
    order: 5,
  },
  {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Médias',
    nameEs: 'Social y Medios',
    icon: '📱',
    color: '#3EB4A2', // Cenote Turquoise
    route: '/social',
    description: 'Social networks and communications',
    descriptionFr: 'Réseaux sociaux et communications',
    order: 6,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    nameEs: 'Entretenimiento',
    icon: '🎬',
    color: '#E9E4D6', // Soft Sand
    route: '/entertainment',
    description: 'Leisure and entertainment',
    descriptionFr: 'Loisirs et divertissement',
    order: 7,
  },
  {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    nameEs: 'Mi Equipo',
    icon: '🤝',
    color: '#1E1F22', // UI Slate
    route: '/team',
    description: 'AI agents and skills management (includes IA Labs & Skills)',
    descriptionFr: 'Gestion des agents IA et compétences (inclut IA Labs & Skills)',
    order: 8,
  },
  {
    id: 'scholars',
    name: 'Scholar',
    nameFr: 'Académique',
    nameEs: 'Académico',
    icon: '📚',
    color: '#E0C46B', // Scholar Gold
    route: '/scholar',
    description: 'Learning, research, and academic pursuits',
    descriptionFr: 'Apprentissage, recherche et parcours académique',
    order: 9,
  },
];

// Map pour accès rapide par ID
export const SPHERES_MAP: Record<SphereId, SphereConfig> = SPHERES.reduce(
  (acc, sphere) => ({ ...acc, [sphere.id]: sphere }),
  {} as Record<SphereId, SphereConfig>
);

// ════════════════════════════════════════════════════════════════════════════════
// 6 SECTIONS BUREAU FLEXIBLES (FROZEN)
// ════════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'QUICK_CAPTURE'
  | 'RESUME_WORKSPACE'
  | 'THREADS'
  | 'DATA_FILES'
  | 'ACTIVE_AGENTS'
  | 'MEETINGS';

export interface BureauSectionConfig {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  nameEs: string;
  icon: string;
  description: string;
  descriptionFr: string;
  hierarchyLevel: number;
  maxItems?: number;
}

export const BUREAU_SECTIONS: BureauSectionConfig[] = [
  {
    id: 'QUICK_CAPTURE',
    name: 'Quick Capture',
    nameFr: 'Capture rapide',
    nameEs: 'Captura rápida',
    icon: '📝',
    description: 'Quick notes and captures (500 chars max)',
    descriptionFr: 'Notes rapides et captures (500 car. max)',
    hierarchyLevel: 1,
    maxItems: 5,
  },
  {
    id: 'RESUME_WORKSPACE',
    name: 'Resume Work',
    nameFr: 'Reprendre',
    nameEs: 'Reanudar',
    icon: '▶️',
    description: 'Continue work in progress',
    descriptionFr: 'Continuer le travail en cours',
    hierarchyLevel: 2,
    maxItems: 8,
  },
  {
    id: 'THREADS',
    name: 'Threads',
    nameFr: 'Fils',
    nameEs: 'Hilos',
    icon: '💬',
    description: 'Governed .chenu conversations',
    descriptionFr: 'Conversations .chenu gouvernées',
    hierarchyLevel: 3,
  },
  {
    id: 'DATA_FILES',
    name: 'Data & Files',
    nameFr: 'Données & Fichiers',
    nameEs: 'Datos y Archivos',
    icon: '📁',
    description: 'Files and structured data',
    descriptionFr: 'Fichiers et données structurées',
    hierarchyLevel: 4,
  },
  {
    id: 'ACTIVE_AGENTS',
    name: 'Active Agents',
    nameFr: 'Agents actifs',
    nameEs: 'Agentes activos',
    icon: '🤖',
    description: 'Agent status (observation only)',
    descriptionFr: 'Statut des agents (observation)',
    hierarchyLevel: 5,
  },
  {
    id: 'MEETINGS',
    name: 'Meetings',
    nameFr: 'Réunions',
    nameEs: 'Reuniones',
    icon: '📅',
    description: 'Schedule and recordings',
    descriptionFr: 'Planification et enregistrements',
    hierarchyLevel: 6,
  },
];

// Map pour accès rapide par ID
export const BUREAU_SECTIONS_MAP: Record<BureauSectionId, BureauSectionConfig> = 
  BUREAU_SECTIONS.reduce(
    (acc, section) => ({ ...acc, [section.id]: section }),
    {} as Record<BureauSectionId, BureauSectionConfig>
  );

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU - Couleurs officielles
// ════════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  scholarGold: '#E0C46B', // Couleur Scholar
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.15)',
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// AGENT LEVELS (L0-L3) - Hiérarchie des agents
// ════════════════════════════════════════════════════════════════════════════════

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

export const AGENT_LEVELS: Record<AgentLevel, { 
  name: string; 
  nameFr: string;
  color: string; 
  description: string;
  descriptionFr: string;
}> = {
  L0: {
    name: 'System Intelligence',
    nameFr: 'Intelligence Système',
    color: '#D8B26A', // Sacred Gold
    description: 'Nova - Core system intelligence (never hired)',
    descriptionFr: 'Nova - Intelligence système centrale (jamais recrutée)',
  },
  L1: {
    name: 'Orchestrator',
    nameFr: 'Orchestrateur',
    color: '#3F7249', // Jungle Emerald
    description: 'User orchestrator - Task management',
    descriptionFr: 'Orchestrateur utilisateur - Gestion des tâches',
  },
  L2: {
    name: 'Specialist',
    nameFr: 'Spécialiste',
    color: '#3EB4A2', // Cenote Turquoise
    description: 'Domain-specific agents',
    descriptionFr: 'Agents spécialisés par domaine',
  },
  L3: {
    name: 'Worker',
    nameFr: 'Exécutant',
    color: '#8D8371', // Ancient Stone
    description: 'Task execution agents',
    descriptionFr: 'Agents d\'exécution de tâches',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// GOVERNANCE CONSTANTS - Règles de gouvernance
// ════════════════════════════════════════════════════════════════════════════════

export const GOVERNANCE = {
  // Token limits
  DEFAULT_DAILY_LIMIT: 100000,
  WARNING_THRESHOLD: 0.8, // 80%
  
  // Scope levels
  SCOPE_LEVELS: ['selection', 'document', 'project', 'sphere', 'global'] as const,
  
  // Laws (7 lois fondamentales)
  LAWS: {
    CONSENT_PRIMACY: 'L1',      // Primauté du consentement
    TEMPORAL_SOVEREIGNTY: 'L2', // Souveraineté temporelle
    CONTEXTUAL_FIDELITY: 'L3',  // Fidélité contextuelle
    HIERARCHICAL_RESPECT: 'L4', // Respect hiérarchique
    AUDIT_COMPLETENESS: 'L5',   // Complétude d'audit
    ENCODING_TRANSPARENCY: 'L6',// Transparence d'encodage
    AGENT_NON_AUTONOMY: 'L7',   // Non-autonomie des agents
  },

  // Tree Laws (5 règles fondamentales)
  TREE_LAWS: {
    SAFE: 'Système toujours sécurisé',
    NON_AUTONOMOUS: 'Aucune action sans approbation humaine',
    REPRESENTATIONAL: 'Structure uniquement, pas d\'exécution non-approuvée',
    PRIVACY: 'Protection absolue des données',
    TRANSPARENCY: 'Traçabilité complète',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SCHOLAR SPHERE SPECIFIC CONFIG
// ════════════════════════════════════════════════════════════════════════════════

export const SCHOLAR_CONFIG = {
  // Types de contenu académique
  contentTypes: [
    'research_paper',
    'course_material',
    'study_notes',
    'bibliography',
    'thesis',
    'assignment',
    'lecture_notes',
    'research_data',
  ] as const,
  
  // Intégrations académiques
  integrations: [
    'google_scholar',
    'pubmed',
    'arxiv',
    'semantic_scholar',
    'mendeley',
    'zotero',
    'orcid',
  ] as const,
  
  // Styles de citation
  citationStyles: [
    'apa7',
    'mla9',
    'chicago',
    'harvard',
    'ieee',
    'vancouver',
  ] as const,
};

// ════════════════════════════════════════════════════════════════════════════════
// VERSION INFO
// ════════════════════════════════════════════════════════════════════════════════

export const VERSION = {
  major: 40,
  minor: 0,
  patch: 0,
  label: 'v40.0.0',
  date: '2025-12-20',
  changes: [
    '9 SPHÈRES: Ajout de Scholar 📚',
    '6 SECTIONS BUREAU: bureau_v2.ts compliant',
    'Consolidation v38.2 + Delta + Scholar modules',
    'Trilingual support (FR/EN/ES)',
  ],
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default {
  SPHERES,
  SPHERES_MAP,
  BUREAU_SECTIONS,
  BUREAU_SECTIONS_MAP,
  COLORS,
  AGENT_LEVELS,
  GOVERNANCE,
  SCHOLAR_CONFIG,
  VERSION,
};
