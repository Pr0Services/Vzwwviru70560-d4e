/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ V50 — KNOWLEDGE GRAPH TOPICS                            ║
 * ║                                                                              ║
 * ║  Topics Definition Canon — Stable & Minimal                                  ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLE FONDAMENTALE:
 * Un Topic répond à la question:
 * "De quoi parle cette décision, au niveau du système?"
 * 
 * Un Topic n'est:
 * - ni un tag libre
 * - ni une catégorie métier
 * - ni un label marketing
 * 
 * Les Topics servent à RELIER.
 * Ils ne servent PAS à classer exhaustivement.
 * 
 * STRUCTURE:
 * - Level 1: System Domains (stables, canoniques)
 * - Level 2: Functional Topics (évolutifs)
 * - Level 3: Contextual Topics (optionnels, rares)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TopicLevel = 1 | 2 | 3;

export type SystemDomain = 
  | 'navigation_structure'
  | 'workspace_workflows'
  | 'collaboration_meetings'
  | 'decisions_governance'
  | 'agents_automation'
  | 'knowledge_memory'
  | 'ui_visual_system'
  | 'access_permissions'
  | 'integrations_platforms';

export interface Topic {
  id: string;
  level: TopicLevel;
  name: string;
  description: string;
  parentId: string | null; // For Level 2 and 3
  domain: SystemDomain | null; // For Level 2 and 3
}

export interface TopicAssignment {
  decisionId: string;
  topicIds: string[];
  assignedAt: string;
  assignedIn: string; // Meeting ID
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 — SYSTEM DOMAINS (CANONIQUES)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ces Topics sont STABLES dans le temps.
 * Ils représentent les grandes zones de CHE·NU.
 * 
 * RÈGLE: Aucun autre Level 1 n'est autorisé sans refonte système.
 */
export const SYSTEM_DOMAINS: Record<SystemDomain, Topic> = {
  navigation_structure: {
    id: 'L1-navigation',
    level: 1,
    name: 'Navigation & Structure',
    description: 'Organisation spatiale, navigation, hiérarchie des espaces',
    parentId: null,
    domain: null,
  },
  workspace_workflows: {
    id: 'L1-workspace',
    level: 1,
    name: 'Workspace & Workflows',
    description: 'Espaces de travail, flux de tâches, processus',
    parentId: null,
    domain: null,
  },
  collaboration_meetings: {
    id: 'L1-collaboration',
    level: 1,
    name: 'Collaboration & Meetings',
    description: 'Réunions, collaboration, travail d\'équipe',
    parentId: null,
    domain: null,
  },
  decisions_governance: {
    id: 'L1-decisions',
    level: 1,
    name: 'Decisions & Governance',
    description: 'Prise de décision, gouvernance, traçabilité',
    parentId: null,
    domain: null,
  },
  agents_automation: {
    id: 'L1-agents',
    level: 1,
    name: 'Agents & Automation',
    description: 'Agents IA, automatisation, orchestration',
    parentId: null,
    domain: null,
  },
  knowledge_memory: {
    id: 'L1-knowledge',
    level: 1,
    name: 'Knowledge & Memory',
    description: 'Graphe de connaissances, mémoire, contexte',
    parentId: null,
    domain: null,
  },
  ui_visual_system: {
    id: 'L1-ui',
    level: 1,
    name: 'UI & Visual System',
    description: 'Interface, design, système visuel',
    parentId: null,
    domain: null,
  },
  access_permissions: {
    id: 'L1-access',
    level: 1,
    name: 'Access & Permissions',
    description: 'Rôles, permissions, visibilité',
    parentId: null,
    domain: null,
  },
  integrations_platforms: {
    id: 'L1-integrations',
    level: 1,
    name: 'Integrations & Platforms',
    description: 'Intégrations externes, plateformes, API',
    parentId: null,
    domain: null,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 — FUNCTIONAL TOPICS (STANDARD)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ces Topics décrivent des fonctions ou mécanismes précis.
 * Liste non exhaustive — peut être étendue.
 */
export const FUNCTIONAL_TOPICS: Topic[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation & Structure
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-minimap',
    level: 2,
    name: 'Minimap',
    description: 'Vue d\'ensemble et navigation rapide',
    parentId: 'L1-navigation',
    domain: 'navigation_structure',
  },
  {
    id: 'L2-dashboard',
    level: 2,
    name: 'Dashboard',
    description: 'Tableau de bord principal',
    parentId: 'L1-navigation',
    domain: 'navigation_structure',
  },
  {
    id: 'L2-workspace-switching',
    level: 2,
    name: 'Workspace Switching',
    description: 'Navigation entre espaces de travail',
    parentId: 'L1-navigation',
    domain: 'navigation_structure',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Workspace & Workflows
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-task-flow',
    level: 2,
    name: 'Task Flow',
    description: 'Flux de tâches et gestion des actions',
    parentId: 'L1-workspace',
    domain: 'workspace_workflows',
  },
  {
    id: 'L2-working-sessions',
    level: 2,
    name: 'Working Sessions',
    description: 'Sessions de travail collaboratif',
    parentId: 'L1-workspace',
    domain: 'workspace_workflows',
  },
  {
    id: 'L2-output-management',
    level: 2,
    name: 'Output Management',
    description: 'Gestion des résultats et livrables',
    parentId: 'L1-workspace',
    domain: 'workspace_workflows',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Collaboration & Meetings
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-meeting-types',
    level: 2,
    name: 'Meeting Types',
    description: 'Types de réunions et leurs structures',
    parentId: 'L1-collaboration',
    domain: 'collaboration_meetings',
  },
  {
    id: 'L2-notes-structure',
    level: 2,
    name: 'Notes Structure',
    description: 'Organisation et format des notes',
    parentId: 'L1-collaboration',
    domain: 'collaboration_meetings',
  },
  {
    id: 'L2-facilitation',
    level: 2,
    name: 'Facilitation',
    description: 'Outils et pratiques de facilitation',
    parentId: 'L1-collaboration',
    domain: 'collaboration_meetings',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Decisions & Governance
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-decision-creation',
    level: 2,
    name: 'Decision Creation',
    description: 'Création et validation des décisions',
    parentId: 'L1-decisions',
    domain: 'decisions_governance',
  },
  {
    id: 'L2-decision-revision',
    level: 2,
    name: 'Decision Revision',
    description: 'Révision et mise à jour des décisions',
    parentId: 'L1-decisions',
    domain: 'decisions_governance',
  },
  {
    id: 'L2-decision-visibility',
    level: 2,
    name: 'Decision Visibility',
    description: 'Affichage et accessibilité des décisions',
    parentId: 'L1-decisions',
    domain: 'decisions_governance',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Agents & Automation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-agent-permissions',
    level: 2,
    name: 'Agent Permissions',
    description: 'Permissions et autorisations des agents',
    parentId: 'L1-agents',
    domain: 'agents_automation',
  },
  {
    id: 'L2-agent-suggestions',
    level: 2,
    name: 'Agent Suggestions',
    description: 'Suggestions et recommandations des agents',
    parentId: 'L1-agents',
    domain: 'agents_automation',
  },
  {
    id: 'L2-agent-boundaries',
    level: 2,
    name: 'Agent Boundaries',
    description: 'Limites et contraintes des agents',
    parentId: 'L1-agents',
    domain: 'agents_automation',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Knowledge & Memory
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-knowledge-graph',
    level: 2,
    name: 'Knowledge Graph',
    description: 'Structure et relations du graphe de connaissances',
    parentId: 'L1-knowledge',
    domain: 'knowledge_memory',
  },
  {
    id: 'L2-decision-timeline',
    level: 2,
    name: 'Decision Timeline',
    description: 'Historique et évolution des décisions',
    parentId: 'L1-knowledge',
    domain: 'knowledge_memory',
  },
  {
    id: 'L2-context-preservation',
    level: 2,
    name: 'Context Preservation',
    description: 'Conservation et rappel du contexte',
    parentId: 'L1-knowledge',
    domain: 'knowledge_memory',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // UI & Visual System
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-color-system',
    level: 2,
    name: 'Color System',
    description: 'Palette et règles de couleurs',
    parentId: 'L1-ui',
    domain: 'ui_visual_system',
  },
  {
    id: 'L2-contrast-accessibility',
    level: 2,
    name: 'Contrast & Accessibility',
    description: 'Contraste et accessibilité visuelle',
    parentId: 'L1-ui',
    domain: 'ui_visual_system',
  },
  {
    id: 'L2-micro-interactions',
    level: 2,
    name: 'Micro-interactions',
    description: 'Animations et retours visuels',
    parentId: 'L1-ui',
    domain: 'ui_visual_system',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Access & Permissions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-roles',
    level: 2,
    name: 'Roles',
    description: 'Définition et gestion des rôles',
    parentId: 'L1-access',
    domain: 'access_permissions',
  },
  {
    id: 'L2-invitations',
    level: 2,
    name: 'Invitations',
    description: 'Système d\'invitation et onboarding',
    parentId: 'L1-access',
    domain: 'access_permissions',
  },
  {
    id: 'L2-visibility-rules',
    level: 2,
    name: 'Visibility Rules',
    description: 'Règles de visibilité du contenu',
    parentId: 'L1-access',
    domain: 'access_permissions',
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Integrations & Platforms
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'L2-messaging',
    level: 2,
    name: 'Messaging',
    description: 'Intégration messagerie (Slack, Teams, etc.)',
    parentId: 'L1-integrations',
    domain: 'integrations_platforms',
  },
  {
    id: 'L2-email',
    level: 2,
    name: 'Email',
    description: 'Intégration email et notifications',
    parentId: 'L1-integrations',
    domain: 'integrations_platforms',
  },
  {
    id: 'L2-external-tools',
    level: 2,
    name: 'External Tools',
    description: 'Outils et services externes',
    parentId: 'L1-integrations',
    domain: 'integrations_platforms',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 — CONTEXTUAL TOPICS (OPTIONNELS)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Utilisés RAREMENT.
 * Uniquement quand le contexte le justifie.
 * 
 * RÈGLE: Un Topic Level 3 ne doit JAMAIS exister seul.
 * Il complète un Level 1 ou 2.
 */
export const CONTEXTUAL_TOPICS: Topic[] = [
  {
    id: 'L3-cognitive-load',
    level: 3,
    name: 'Cognitive Load',
    description: 'Impact sur la charge cognitive utilisateur',
    parentId: null,
    domain: null,
  },
  {
    id: 'L3-discoverability',
    level: 3,
    name: 'Discoverability',
    description: 'Facilité de découverte des fonctionnalités',
    parentId: null,
    domain: null,
  },
  {
    id: 'L3-trust-transparency',
    level: 3,
    name: 'Trust & Transparency',
    description: 'Confiance et transparence du système',
    parentId: null,
    domain: null,
  },
  {
    id: 'L3-internationalization',
    level: 3,
    name: 'Internationalization',
    description: 'Support multilingue et localisation',
    parentId: null,
    domain: null,
  },
  {
    id: 'L3-long-term-use',
    level: 3,
    name: 'Long-term Use',
    description: 'Considérations pour l\'usage à long terme',
    parentId: null,
    domain: null,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ALL TOPICS (COMBINED)
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_TOPICS: Topic[] = [
  ...Object.values(SYSTEM_DOMAINS),
  ...FUNCTIONAL_TOPICS,
  ...CONTEXTUAL_TOPICS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// ASSIGNMENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const ASSIGNMENT_RULES = {
  default: {
    level1: { min: 1, max: 2 },
    level2: { min: 0, max: 2 },
    level3: { min: 0, max: 1 },
  },
  
  validation: {
    topicsRequiredFor: 'decisions', // Not required for Notes
    editableIn: 'decision_meeting_only',
    visibleIn: ['dashboard', 'collaboration'],
  },
  
  level3Rules: {
    mustHaveParent: true, // Cannot exist alone
    complements: ['level1', 'level2'],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UI CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const TOPICS_UI = {
  dashboard: {
    maxTopics: 2,
    style: 'minimal',
    coloredBadges: false,
    typography: {
      size: '10px',
      weight: '400',
      color: '#8B9096',
    },
  },
  
  collaboration: {
    maxTopics: null, // All
    style: 'list',
    clickable: true, // Opens Knowledge Graph
    hierarchy: false, // No aggressive visual hierarchy
    typography: {
      size: '11px',
      weight: '400',
      color: '#B8BDC3',
    },
  },
  
  editor: {
    // Only in Decision Meeting
    searchable: true,
    grouped: true, // By Level 1
    suggestions: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Récupère un topic par ID
 */
export function getTopicById(id: string): Topic | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

/**
 * Récupère tous les topics d'un niveau
 */
export function getTopicsByLevel(level: TopicLevel): Topic[] {
  return ALL_TOPICS.filter(t => t.level === level);
}

/**
 * Récupère tous les topics d'un domaine système
 */
export function getTopicsByDomain(domain: SystemDomain): Topic[] {
  return ALL_TOPICS.filter(t => t.domain === domain);
}

/**
 * Récupère les topics enfants d'un topic parent
 */
export function getChildTopics(parentId: string): Topic[] {
  return ALL_TOPICS.filter(t => t.parentId === parentId);
}

/**
 * Valide une assignation de topics
 */
export function validateTopicAssignment(
  topicIds: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const topics = topicIds.map(id => getTopicById(id)).filter(Boolean) as Topic[];
  
  // Count by level
  const level1Count = topics.filter(t => t.level === 1).length;
  const level2Count = topics.filter(t => t.level === 2).length;
  const level3Count = topics.filter(t => t.level === 3).length;
  
  // Validate Level 1
  if (level1Count < ASSIGNMENT_RULES.default.level1.min) {
    errors.push(`Au moins ${ASSIGNMENT_RULES.default.level1.min} Topic Level 1 requis`);
  }
  if (level1Count > ASSIGNMENT_RULES.default.level1.max) {
    errors.push(`Maximum ${ASSIGNMENT_RULES.default.level1.max} Topics Level 1`);
  }
  
  // Validate Level 2
  if (level2Count > ASSIGNMENT_RULES.default.level2.max) {
    errors.push(`Maximum ${ASSIGNMENT_RULES.default.level2.max} Topics Level 2`);
  }
  
  // Validate Level 3
  if (level3Count > ASSIGNMENT_RULES.default.level3.max) {
    errors.push(`Maximum ${ASSIGNMENT_RULES.default.level3.max} Topic Level 3`);
  }
  
  // Level 3 cannot exist alone
  if (level3Count > 0 && (level1Count + level2Count) === 0) {
    errors.push('Un Topic Level 3 ne peut pas exister seul');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formate les topics pour l'affichage Dashboard (minimal)
 */
export function formatTopicsForDashboard(topicIds: string[]): string[] {
  const topics = topicIds
    .map(id => getTopicById(id))
    .filter(Boolean) as Topic[];
  
  // Priority: Level 1 first, then Level 2
  const sorted = [...topics].sort((a, b) => a.level - b.level);
  
  // Return max 2
  return sorted.slice(0, TOPICS_UI.dashboard.maxTopics).map(t => t.name);
}

/**
 * Formate les topics pour l'affichage Collaboration (full)
 */
export function formatTopicsForCollaboration(topicIds: string[]): {
  level1: Topic[];
  level2: Topic[];
  level3: Topic[];
} {
  const topics = topicIds
    .map(id => getTopicById(id))
    .filter(Boolean) as Topic[];
  
  return {
    level1: topics.filter(t => t.level === 1),
    level2: topics.filter(t => t.level === 2),
    level3: topics.filter(t => t.level === 3),
  };
}

/**
 * Groupe les topics Level 2 par leur domaine Level 1
 */
export function groupTopicsByDomain(): Record<SystemDomain, Topic[]> {
  const grouped = {} as Record<SystemDomain, Topic[]>;
  
  for (const domain of Object.keys(SYSTEM_DOMAINS) as SystemDomain[]) {
    grouped[domain] = getTopicsByDomain(domain);
  }
  
  return grouped;
}

/**
 * Recherche de topics par nom
 */
export function searchTopics(query: string): Topic[] {
  const lowerQuery = query.toLowerCase();
  return ALL_TOPICS.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery)
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const TOPICS_AGENT_RULES = {
  allowed: [
    'Suggérer des Topics',
    'Détecter incohérences de Topics',
    'Proposer des regroupements thématiques',
  ],
  forbidden: [
    'Assigner ou modifier des Topics',
    'Créer de nouveaux Level 1',
    'Changer la hiérarchie des Topics',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OBJECTIF FINAL:
 * 
 * Les Topics doivent permettre de:
 * - naviguer dans les décisions
 * - comprendre les impacts
 * - relier le passé au présent
 * 
 * Sans jamais alourdir l'UX.
 * 
 * CHE·NU utilise les Topics comme
 * une boussole silencieuse,
 * pas comme un système de classement.
 */

export default {
  SYSTEM_DOMAINS,
  FUNCTIONAL_TOPICS,
  CONTEXTUAL_TOPICS,
  ALL_TOPICS,
  ASSIGNMENT_RULES,
  TOPICS_UI,
  getTopicById,
  getTopicsByLevel,
  getTopicsByDomain,
  getChildTopics,
  validateTopicAssignment,
  formatTopicsForDashboard,
  formatTopicsForCollaboration,
  groupTopicsByDomain,
  searchTopics,
};
