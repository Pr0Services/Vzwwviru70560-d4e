/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — ARCHITECTURE CANONIQUE DASHBOARD vs BUREAU                         ║
 * ║                                                                                  ║
 * ║     VERSION CANONIQUE — AUCUNE AMBIGUÏTÉ                                         ║
 * ║                                                                                  ║
 * ║     "Le Dashboard est une carte. Le Bureau est le territoire."                   ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// I. MODES D'INTERACTION
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * CHE·NU a deux modes d'interaction distincts:
 * 
 * DASHBOARD (Centre de Commandement)
 * → Organiser · Décider · Accéder
 * → JAMAIS produire
 * 
 * BUREAU (Bureau de Travail)
 * → Produire · Collaborer · Exécuter
 * → JAMAIS décider globalement
 */
export type InteractionMode = 'DASHBOARD' | 'BUREAU';

// ═══════════════════════════════════════════════════════════════════════════════════
// II. DASHBOARD — CENTRE DE COMMANDEMENT
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * RÔLE UNIQUE du Dashboard:
 * → Organiser · Décider · Accéder
 * → Jamais produire
 */

export type DashboardSectionId =
  | 'CONTEXTE'
  | 'TACHES_PRIORITES'
  | 'WORKSPACES'
  | 'AGENTS_GESTION'
  | 'COMMUNICATION'
  | 'BASES_DONNEES'
  | 'PARAMETRES_AUDIT';

export interface DashboardSection {
  id: DashboardSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  actions: DashboardAction[];
  restrictions: string[];
}

export type DashboardAction = 
  | 'view'           // Voir/lire
  | 'modify_note'    // Modifier note courte
  | 'mark_decision'  // Marquer décision
  | 'archive'        // Archiver
  | 'create_task'    // Créer tâche
  | 'modify_priority'// Modifier priorité
  | 'open_in_bureau' // Ouvrir dans le Bureau
  | 'rename'         // Renommer
  | 'duplicate'      // Dupliquer
  | 'view_permissions'// Voir permissions
  | 'modify_access'  // Modifier accès
  | 'revoke'         // Révoquer
  | 'view_logs'      // Voir logs
  | 'export_audit';  // Exporter audit

/**
 * 7 Sections du Dashboard (Niveau 1)
 */
export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: 'CONTEXTE',
    name: 'Context',
    nameFr: 'Contexte',
    icon: '🎯',
    description: 'Sphère active, objectif courant, notes de contexte',
    actions: ['view', 'modify_note', 'mark_decision', 'archive'],
    restrictions: ['❌ Pas d\'édition longue'],
  },
  {
    id: 'TACHES_PRIORITES',
    name: 'Tasks & Priorities',
    nameFr: 'Tâches & Priorités',
    icon: '✅',
    description: 'Tâches globales, récurrentes, backlog, priorités',
    actions: ['view', 'create_task', 'modify_priority', 'open_in_bureau'],
    restrictions: ['❌ Pas de sous-tâches ici'],
  },
  {
    id: 'WORKSPACES',
    name: 'Workspaces',
    nameFr: 'Espaces de travail',
    icon: '📂',
    description: 'Liste des workspaces, état, dernière activité',
    actions: ['view', 'open_in_bureau', 'rename', 'archive', 'duplicate'],
    restrictions: ['❌ Pas d\'édition de contenu'],
  },
  {
    id: 'AGENTS_GESTION',
    name: 'Agents (Management)',
    nameFr: 'Agents (Gestion)',
    icon: '🤖',
    description: 'Liste des agents, statut, portée autorisée',
    actions: ['view', 'view_permissions', 'modify_access', 'revoke', 'view_logs'],
    restrictions: ['❌ Pas d\'exécution directe'],
  },
  {
    id: 'COMMUNICATION',
    name: 'Communication (Overview)',
    nameFr: 'Communication (Aperçu)',
    icon: '💬',
    description: 'Messages résumé, emails résumé, meetings à venir',
    actions: ['view', 'open_in_bureau'],
    restrictions: ['❌ Pas de réponse ici'],
  },
  {
    id: 'BASES_DONNEES',
    name: 'Databases (Access)',
    nameFr: 'Bases de données (Accès)',
    icon: '🗄️',
    description: 'Liste des DB, type, dernière modif',
    actions: ['view', 'open_in_bureau', 'modify_access'],
    restrictions: ['❌ Pas d\'édition directe'],
  },
  {
    id: 'PARAMETRES_AUDIT',
    name: 'Settings & Audit',
    nameFr: 'Paramètres & Audit',
    icon: '⚙️',
    description: 'Permissions, connexions, audit trail',
    actions: ['view', 'view_logs', 'export_audit', 'modify_access'],
    restrictions: ['❌ Aucune action silencieuse'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// III. BUREAU — BUREAU DE TRAVAIL
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * RÔLE UNIQUE du Bureau:
 * → Produire · Collaborer · Exécuter
 * → Jamais décider globalement
 */

export type BureauWindowId =
  | 'WORKSPACE_ACTIF'
  | 'NOTES_PRODUCTION'
  | 'TACHES_OPERATIONNELLES'
  | 'MESSAGES'
  | 'COURRIEL'
  | 'BASE_DONNEES_EDITION'
  | 'AGENTS_EXECUTION'
  | 'DASHBOARD_MODE_GESTION';

export interface BureauWindow {
  id: BureauWindowId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  actions: BureauAction[];
  restrictions: string[];
}

export type BureauAction =
  | 'create'         // Créer
  | 'edit'           // Éditer
  | 'comment'        // Commenter
  | 'view_history'   // Historique versions
  | 'link_task'      // Lier à tâche
  | 'link_agent'     // Lier à agent
  | 'export'         // Exporter
  | 'mark_complete'  // Marquer complétée
  | 'assign_agent'   // Assigner agent
  | 'transform'      // Transformer en doc
  | 'reply'          // Répondre
  | 'request_summary'// Demander résumé agent
  | 'request_draft'  // Demander brouillon agent
  | 'classify'       // Classer
  | 'link_workspace' // Lier à workspace
  | 'execute_agent'  // Exécuter agent
  | 'choose_scope'   // Choisir scope
  | 'view_result'    // Voir résultat
  | 'revoke_access'; // Révoquer accès

/**
 * 8 Fenêtres du Bureau (Niveau 1)
 */
export const BUREAU_WINDOWS: BureauWindow[] = [
  {
    id: 'WORKSPACE_ACTIF',
    name: 'Active Workspace',
    nameFr: 'Workspace Actif',
    icon: '📝',
    description: 'Documents, notes longues, fichiers, collaboration',
    actions: ['create', 'edit', 'comment', 'view_history'],
    restrictions: [],
  },
  {
    id: 'NOTES_PRODUCTION',
    name: 'Notes (Production)',
    nameFr: 'Notes (Production)',
    icon: '📓',
    description: 'Notes longues, brouillons, recherche, documentation',
    actions: ['create', 'edit', 'link_task', 'link_agent', 'export'],
    restrictions: [],
  },
  {
    id: 'TACHES_OPERATIONNELLES',
    name: 'Operational Tasks',
    nameFr: 'Tâches Opérationnelles',
    icon: '☑️',
    description: 'Sous-tâches, checklists, actions exécutables',
    actions: ['create', 'mark_complete', 'assign_agent', 'transform'],
    restrictions: [],
  },
  {
    id: 'MESSAGES',
    name: 'Messages',
    nameFr: 'Messages',
    icon: '💬',
    description: 'Conversations complètes, réponses, historique',
    actions: ['reply', 'request_summary', 'request_draft'],
    restrictions: [],
  },
  {
    id: 'COURRIEL',
    name: 'Email',
    nameFr: 'Courriel',
    icon: '📧',
    description: 'Boîte complète, réponses, pièces jointes',
    actions: ['reply', 'request_draft', 'classify'],
    restrictions: [],
  },
  {
    id: 'BASE_DONNEES_EDITION',
    name: 'Database (Edit)',
    nameFr: 'Base de données (Édition)',
    icon: '🗃️',
    description: 'Tables, lignes, relations',
    actions: ['create', 'edit', 'link_workspace', 'view_history'],
    restrictions: [],
  },
  {
    id: 'AGENTS_EXECUTION',
    name: 'Agents (Execution)',
    nameFr: 'Agents (Exécution)',
    icon: '🤖',
    description: 'Appel explicite, résumé, brouillon, analyse ciblée',
    actions: ['execute_agent', 'choose_scope', 'view_result', 'revoke_access'],
    restrictions: ['❌ Aucun agent autonome'],
  },
  {
    id: 'DASHBOARD_MODE_GESTION',
    name: 'Dashboard (Management Mode)',
    nameFr: 'Dashboard (Mode Gestion)',
    icon: '🎛️',
    description: 'Vue identique au Dashboard - Lecture/accès uniquement',
    actions: [],
    restrictions: ['Titre: "Centre de Commandement — Mode Gestion"'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// IV. RÈGLES ANTI-DÉRAPAGE
// ═══════════════════════════════════════════════════════════════════════════════════

export type ActionType = 'LIST' | 'ACTION' | 'DECISION' | 'MODIFICATION' | 'UNKNOWN';

/**
 * Détermine où une action doit vivre
 * 
 * Règles:
 * - Si c'est une LISTE → Dashboard
 * - Si c'est une ACTION → Bureau
 * - Si c'est une DÉCISION → Dashboard
 * - Si c'est une MODIFICATION → Bureau
 * - Si tu hésites → Dashboard
 */
export function determineActionLocation(actionType: ActionType): InteractionMode {
  switch (actionType) {
    case 'LIST':
      return 'DASHBOARD';
    case 'ACTION':
      return 'BUREAU';
    case 'DECISION':
      return 'DASHBOARD';
    case 'MODIFICATION':
      return 'BUREAU';
    case 'UNKNOWN':
    default:
      return 'DASHBOARD'; // Si tu hésites → Dashboard
  }
}

/**
 * Vérifie si une action est autorisée dans le mode actuel
 */
export function isActionAllowed(
  mode: InteractionMode,
  actionType: ActionType
): boolean {
  const expectedMode = determineActionLocation(actionType);
  return mode === expectedMode;
}

/**
 * Obtient le message d'erreur approprié si l'action n'est pas autorisée
 */
export function getActionRedirectMessage(
  currentMode: InteractionMode,
  actionType: ActionType
): string | null {
  const expectedMode = determineActionLocation(actionType);
  
  if (currentMode === expectedMode) return null;
  
  if (currentMode === 'DASHBOARD' && expectedMode === 'BUREAU') {
    return 'Cette action de production doit être effectuée dans le Bureau.';
  }
  
  if (currentMode === 'BUREAU' && expectedMode === 'DASHBOARD') {
    return 'Cette décision doit être prise dans le Centre de Commandement.';
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// V. WIDGETS DASHBOARD (Niveau 0)
// ═══════════════════════════════════════════════════════════════════════════════════

export interface DashboardWidget {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  maxItems?: number;
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'priorities',
    name: 'Current Priorities',
    nameFr: 'Priorités actuelles',
    description: 'Top priorities across all spheres',
  },
  {
    id: 'tasks_global',
    name: 'Global Tasks',
    nameFr: 'Tâches globales',
    description: 'Top 5 most urgent tasks',
    maxItems: 5,
  },
  {
    id: 'workspaces_recent',
    name: 'Recent Workspaces',
    nameFr: 'Workspaces récents',
    description: 'Recently accessed workspaces',
  },
  {
    id: 'messages_preview',
    name: 'Messages',
    nameFr: 'Messages',
    description: 'Quick preview of unread messages',
  },
  {
    id: 'agents_status',
    name: 'Agents Status',
    nameFr: 'Agents (statut)',
    description: 'Current agent activity status',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════════
// VI. HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

export function getDashboardSection(id: DashboardSectionId): DashboardSection | undefined {
  return DASHBOARD_SECTIONS.find(s => s.id === id);
}

export function getBureauWindow(id: BureauWindowId): BureauWindow | undefined {
  return BUREAU_WINDOWS.find(w => w.id === id);
}

export function isDashboardAction(action: DashboardAction | BureauAction): action is DashboardAction {
  const dashboardActions: DashboardAction[] = [
    'view', 'modify_note', 'mark_decision', 'archive', 'create_task',
    'modify_priority', 'open_in_bureau', 'rename', 'duplicate',
    'view_permissions', 'modify_access', 'revoke', 'view_logs', 'export_audit'
  ];
  return dashboardActions.includes(action as DashboardAction);
}

export function isBureauAction(action: DashboardAction | BureauAction): action is BureauAction {
  const bureauActions: BureauAction[] = [
    'create', 'edit', 'comment', 'view_history', 'link_task', 'link_agent',
    'export', 'mark_complete', 'assign_agent', 'transform', 'reply',
    'request_summary', 'request_draft', 'classify', 'link_workspace',
    'execute_agent', 'choose_scope', 'view_result', 'revoke_access'
  ];
  return bureauActions.includes(action as BureauAction);
}

// ═══════════════════════════════════════════════════════════════════════════════════
// VII. EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════════

export default {
  DASHBOARD_SECTIONS,
  BUREAU_WINDOWS,
  DASHBOARD_WIDGETS,
  determineActionLocation,
  isActionAllowed,
  getActionRedirectMessage,
  getDashboardSection,
  getBureauWindow,
};
