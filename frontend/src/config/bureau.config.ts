/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BUREAU CONFIGURATION V52
 * 10 SECTIONS BUREAU — STRUCTURE FLEXIBLE PAR HIÉRARCHIE
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * BUREAU MODEL (Non-Negotiable):
 * Each SPHERE opens a BUREAU containing maximum 6 Flexible by hierarchy SECTIONS.
 * Structure NEVER changes. Only content, permissions, and agents vary.
 * 
 * MEMORY PROMPT ALIGNMENT:
 * 1. Dashboard
 * 2. Notes
 * 3. Tasks
 * 4. Projects
 * 5. Threads (.chenu)
 * 6. Meetings
 * 7. Data / Database
 * 8. Agents
 * 9. Reports / History
 * 10. Budget & Governance
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'dashboard'   // Vue d'ensemble
  | 'notes'       // Notes rapides
  | 'tasks'       // Tâches
  | 'projects'    // Projets
  | 'threads'     // Threads .chenu
  | 'meetings'    // Réunions
  | 'data'        // DataSpace / Base de données
  | 'agents'      // Agents IA
  | 'reports'     // Rapports / Historique
  | 'budget';     // Budget & Gouvernance

export type BureauSectionCategory = 'overview' | 'content' | 'collaboration' | 'intelligence' | 'governance';

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  category: BureauSectionCategory;
  sortOrder: number;
  requiresTokens: boolean;
  defaultVisible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// 10 BUREAU SECTIONS — COMPLETE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS_CONFIG: Record<BureauSectionId, BureauSection> = {
  // ─────────────────────────────────────────────────────────────
  // 1. DASHBOARD — Overview
  // ─────────────────────────────────────────────────────────────
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    nameFr: 'Tableau de bord',
    icon: '📊',
    description: 'Overview of sphere activity, stats, and quick actions',
    descriptionFr: 'Vue d\'ensemble de l\'activité de la sphère, statistiques et actions rapides',
    category: 'overview',
    sortOrder: 1,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. NOTES — Quick Capture
  // ─────────────────────────────────────────────────────────────
  notes: {
    id: 'notes',
    name: 'Notes',
    nameFr: 'Notes',
    icon: '📝',
    description: 'Quick notes, ideas, and snippets',
    descriptionFr: 'Notes rapides, idées et fragments',
    category: 'content',
    sortOrder: 2,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. TASKS — Task Management
  // ─────────────────────────────────────────────────────────────
  tasks: {
    id: 'tasks',
    name: 'Tasks',
    nameFr: 'Tâches',
    icon: '✅',
    description: 'Task management with priorities and assignments',
    descriptionFr: 'Gestion des tâches avec priorités et assignations',
    category: 'content',
    sortOrder: 3,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. PROJECTS — Project Management
  // ─────────────────────────────────────────────────────────────
  projects: {
    id: 'projects',
    name: 'Projects',
    nameFr: 'Projets',
    icon: '📁',
    description: 'Project organization and tracking',
    descriptionFr: 'Organisation et suivi des projets',
    category: 'content',
    sortOrder: 4,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. THREADS — .chenu Threads (FIRST-CLASS OBJECTS)
  // ─────────────────────────────────────────────────────────────
  threads: {
    id: 'threads',
    name: 'Threads',
    nameFr: 'Threads',
    icon: '💬',
    description: 'Persistent lines of thought with encoding and token budgets',
    descriptionFr: 'Lignes de pensée persistantes avec encodage et budgets tokens',
    category: 'collaboration',
    sortOrder: 5,
    requiresTokens: true,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 6. MEETINGS — Meeting Management
  // ─────────────────────────────────────────────────────────────
  meetings: {
    id: 'meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Schedule, conduct, and document meetings',
    descriptionFr: 'Planifier, conduire et documenter les réunions',
    category: 'collaboration',
    sortOrder: 6,
    requiresTokens: true,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 7. DATA — DataSpace / Database
  // ─────────────────────────────────────────────────────────────
  data: {
    id: 'data',
    name: 'Data',
    nameFr: 'Données',
    icon: '💾',
    description: 'DataSpaces, files, and structured data',
    descriptionFr: 'DataSpaces, fichiers et données structurées',
    category: 'content',
    sortOrder: 7,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 8. AGENTS — AI Agents
  // ─────────────────────────────────────────────────────────────
  agents: {
    id: 'agents',
    name: 'Agents',
    nameFr: 'Agents',
    icon: '🤖',
    description: 'AI agents assigned to this sphere',
    descriptionFr: 'Agents IA assignés à cette sphère',
    category: 'intelligence',
    sortOrder: 8,
    requiresTokens: true,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 9. REPORTS — Reports / History
  // ─────────────────────────────────────────────────────────────
  reports: {
    id: 'reports',
    name: 'Reports',
    nameFr: 'Rapports',
    icon: '📈',
    description: 'Analytics, reports, and activity history',
    descriptionFr: 'Analytiques, rapports et historique d\'activité',
    category: 'governance',
    sortOrder: 9,
    requiresTokens: false,
    defaultVisible: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 10. BUDGET — Budget & Governance
  // ─────────────────────────────────────────────────────────────
  budget: {
    id: 'budget',
    name: 'Budget',
    nameFr: 'Budget',
    icon: '⚖️',
    description: 'Token budget, governance rules, and spending tracking',
    descriptionFr: 'Budget tokens, règles de gouvernance et suivi des dépenses',
    category: 'governance',
    sortOrder: 10,
    requiresTokens: false,
    defaultVisible: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Get sections ordered by sortOrder
 */
export const getOrderedSections = (): BureauSection[] => {
  return Object.values(BUREAU_SECTIONS_CONFIG).sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * Get sections by category
 */
export const getSectionsByCategory = (category: BureauSectionCategory): BureauSection[] => {
  return Object.values(BUREAU_SECTIONS_CONFIG)
    .filter(s => s.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * Check if section requires tokens
 */
export const sectionRequiresTokens = (sectionId: BureauSectionId): boolean => {
  return BUREAU_SECTIONS_CONFIG[sectionId]?.requiresTokens ?? false;
};

/**
 * All section IDs in order
 */
export const SECTION_IDS_ORDERED: BureauSectionId[] = [
  'dashboard',
  'notes',
  'tasks',
  'projects',
  'threads',
  'meetings',
  'data',
  'agents',
  'reports',
  'budget',
];

export default BUREAU_SECTIONS_CONFIG;
