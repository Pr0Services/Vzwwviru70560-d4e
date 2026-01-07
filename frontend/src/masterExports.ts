/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ v40 — MASTER EXPORTS
   ═══════════════════════════════════════════════════════════════════════════════
   
   POINT D'ENTRÉE PRINCIPAL - TOUS LES MODULES
   
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// VERSION
// ════════════════════════════════════════════════════════════════════════════════

export const CHENU_VERSION = {
  major: 40,
  minor: 0,
  patch: 0,
  full: '40.0.0',
  codename: 'GOVERNED_INTELLIGENCE',
  buildDate: '2025-12-20',
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE CONSTANTS (FROZEN)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * 9 SPHERES - Structure gelée, ne pas modifier
 */
export const SPHERES = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', icon: '🏠', color: '#3EB4A2' },
  { id: 'business', name: 'Business', nameFr: 'Affaires', icon: '💼', color: '#D8B26A' },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', icon: '🏛️', color: '#8D8371' },
  { id: 'design_studio', name: 'Studio', nameFr: 'Studio de création', icon: '🎨', color: '#3F7249' },
  { id: 'community', name: 'Community', nameFr: 'Communauté', icon: '👥', color: '#5DA9FF' },
  { id: 'social', name: 'Social', nameFr: 'Social & Média', icon: '📱', color: '#9B59B6' },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', icon: '🎬', color: '#7A593A' },
  { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe', icon: '🤝', color: '#E74C3C' },
  { id: 'scholars', name: 'Scholar', nameFr: 'Études', icon: '📚', color: '#1ABC9C' },
] as const;

/**
 * 6 BUREAU SECTIONS - Structure gelée, ne pas modifier
 */
export const BUREAU_SECTIONS = [
  { id: 'QUICK_CAPTURE', name: 'Quick Capture', nameFr: 'Capture Rapide', icon: '⚡', shortcut: 'Q' },
  { id: 'RESUME_WORKSPACE', name: 'Resume Workspace', nameFr: 'Reprendre', icon: '📂', shortcut: 'R' },
  { id: 'THREADS', name: 'Threads', nameFr: 'Fils', icon: '💬', shortcut: 'T' },
  { id: 'DATA_FILES', name: 'Data & Files', nameFr: 'Données', icon: '📁', shortcut: 'D' },
  { id: 'ACTIVE_AGENTS', name: 'Active Agents', nameFr: 'Agents', icon: '🤖', shortcut: 'A' },
  { id: 'MEETINGS', name: 'Meetings', nameFr: 'Réunions', icon: '📅', shortcut: 'M' },
] as const;

/**
 * 10 GOVERNANCE LAWS
 */
export const GOVERNANCE_LAWS = [
  { id: 'L1', name: 'ENCODING_BEFORE_EXECUTION', description: 'Encodage avant exécution' },
  { id: 'L2', name: 'BUDGET_BEFORE_ACTION', description: 'Budget avant action' },
  { id: 'L3', name: 'SINGLE_SPHERE_ACTIVE', description: 'Une seule sphère active' },
  { id: 'L4', name: 'HIERARCHICAL_RESPECT', description: 'Respect hiérarchique L0→L3' },
  { id: 'L5', name: 'THREAD_PERSISTENCE', description: 'Fils persistants' },
  { id: 'L6', name: 'TOKEN_ACCOUNTABILITY', description: 'Traçabilité tokens' },
  { id: 'L7', name: 'AGENT_NON_AUTONOMY', description: 'Non-autonomie agents' },
  { id: 'L8', name: 'BUDGET_ACCOUNTABILITY', description: 'Responsabilité budget' },
  { id: 'L9', name: 'CROSS_SPHERE_ISOLATION', description: 'Isolation inter-sphères' },
  { id: 'L10', name: 'AUDIT_TRAIL', description: 'Piste d\'audit' },
] as const;

// ════════════════════════════════════════════════════════════════════════════════
// BRAND COLORS
// ════════════════════════════════════════════════════════════════════════════════

export const BRAND_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  // Semantic
  primary: '#5DA9FF',
  success: '#4CAF88',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type SphereId = typeof SPHERES[number]['id'];
export type BureauSectionId = typeof BUREAU_SECTIONS[number]['id'];
export type GovernanceLawId = typeof GOVERNANCE_LAWS[number]['id'];

export interface Thread {
  id: string;
  sphereId: SphereId;
  title: string;
  status: 'active' | 'archived' | 'completed';
  tokenBudget: number;
  tokensUsed: number;
  encoding: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  sphereId: SphereId;
  capabilities: string[];
  tokensPerAction: number;
  isActive: boolean;
}

export interface TokenTransaction {
  id: string;
  threadId: string;
  agentId: string;
  amount: number;
  action: string;
  timestamp: Date;
}

// ════════════════════════════════════════════════════════════════════════════════
// API ENDPOINTS REGISTRY
// ════════════════════════════════════════════════════════════════════════════════

export const API_ENDPOINTS = {
  // Personal
  personal: {
    goals: '/api/personal/goals',
    habits: '/api/personal/habits',
    journal: '/api/personal/journal',
    dailyPlan: '/api/personal/daily-plan',
  },
  // Business
  business: {
    crm: {
      contacts: '/api/crm/contacts',
      companies: '/api/crm/companies',
      deals: '/api/crm/deals',
      pipelines: '/api/crm/pipelines',
    },
    invoice: {
      invoices: '/api/invoice/invoices',
      payments: '/api/invoice/payments',
      templates: '/api/invoice/templates',
    },
    timeTracking: '/api/time-tracking',
  },
  // Government
  government: {
    documents: '/api/government/documents',
    deadlines: '/api/government/deadlines',
    forms: '/api/government/forms',
  },
  // Studio
  studio: {
    projects: '/api/studio/projects',
    assets: '/api/studio/assets',
    versions: '/api/studio/versions',
  },
  // Community
  community: {
    groups: '/api/community/groups',
    events: '/api/community/events',
    forum: '/api/community/forum',
  },
  // Social
  social: {
    profiles: '/api/social/profiles',
    posts: '/api/social/posts',
    analytics: '/api/social/analytics',
  },
  // Entertainment
  entertainment: {
    media: '/api/entertainment/media',
    playlists: '/api/entertainment/playlists',
    watchParties: '/api/entertainment/watch-parties',
  },
  // My Team
  myteam: {
    teams: '/api/myteam/teams',
    skills: '/api/myteam/skills',
    marketplace: '/api/myteam/marketplace',
  },
  // Scholar
  scholar: {
    references: '/api/scholar/references',
    flashcards: '/api/scholar/flashcards',
    studyPlans: '/api/scholar/study-plans',
  },
  // Core
  threads: '/api/threads',
  agents: '/api/agents',
  tokens: '/api/tokens',
  governance: '/api/governance',
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// AGENT MANIFEST
// ════════════════════════════════════════════════════════════════════════════════

export const AGENT_MANIFEST = {
  'personal.assistant': {
    level: 'L3',
    sphereId: 'personal',
    capabilities: [
      'create_goal', 'update_goal', 'archive_goal', 'list_goals',
      'track_habit', 'analyze_habits', 'suggest_improvements',
      'create_journal_entry', 'search_journal', 'daily_summary',
      'create_daily_plan', 'optimize_schedule',
    ],
    tokensPerAction: 75,
  },
  'business.crm_assistant': {
    level: 'L3',
    sphereId: 'business',
    capabilities: [
      'create_contact', 'update_contact', 'search_contacts',
      'create_company', 'link_contacts', 'manage_deal',
      'update_pipeline', 'generate_report', 'forecast_revenue',
    ],
    tokensPerAction: 100,
  },
  'business.invoice_manager': {
    level: 'L3',
    sphereId: 'business',
    capabilities: [
      'create_invoice', 'send_invoice', 'track_payment',
      'generate_statement', 'calculate_tax', 'export_accounting',
      'analyze_cashflow', 'predict_revenue',
    ],
    tokensPerAction: 100,
  },
  'government.admin': {
    level: 'L3',
    sphereId: 'government',
    capabilities: [
      'store_document', 'verify_validity', 'track_deadline',
      'prepare_form', 'check_compliance', 'send_reminder',
      'archive_document', 'generate_report', 'cross_reference', 'summarize',
    ],
    tokensPerAction: 80,
  },
  'studio.creative_assistant': {
    level: 'L3',
    sphereId: 'design_studio',
    capabilities: [
      'create_project', 'manage_versions', 'organize_assets',
      'suggest_collaboration', 'track_progress', 'publish_project',
      'generate_brief', 'analyze_style', 'recommend_tools',
      'create_moodboard', 'export_package',
    ],
    tokensPerAction: 120,
  },
  'community.community_manager': {
    level: 'L3',
    sphereId: 'community',
    capabilities: [
      'create_group', 'manage_membership', 'create_event',
      'moderate_content', 'analyze_engagement', 'send_notification',
      'generate_report', 'welcome_member',
    ],
    tokensPerAction: 85,
  },
  'social.media_manager': {
    level: 'L3',
    sphereId: 'social',
    capabilities: [
      'create_post', 'schedule_post', 'analyze_performance',
      'manage_profile', 'respond_comment', 'generate_hashtags',
      'track_trends', 'create_story', 'cross_post',
      'generate_report', 'suggest_content', 'optimize_timing',
    ],
    tokensPerAction: 90,
  },
  'entertainment.curator': {
    level: 'L3',
    sphereId: 'entertainment',
    capabilities: [
      'add_media', 'create_playlist', 'recommend_content',
      'organize_library', 'track_viewing', 'host_watch_party',
      'analyze_preferences', 'discover_new', 'export_list',
      'rate_content', 'share_playlist', 'sync_services',
    ],
    tokensPerAction: 70,
  },
  'myteam.orchestrator': {
    level: 'L3',
    sphereId: 'my_team',
    capabilities: [
      'create_team', 'assign_role', 'manage_skills',
      'browse_marketplace', 'hire_agent', 'coordinate_tasks',
      'track_performance', 'generate_report', 'optimize_team',
      'distribute_budget', 'onboard_member', 'evaluate_agent',
    ],
    tokensPerAction: 110,
  },
  'scholar.research_assistant': {
    level: 'L3',
    sphereId: 'scholars',
    capabilities: [
      'search_literature', 'add_reference', 'create_flashcard',
      'study_session', 'track_progress', 'generate_summary',
      'create_study_plan', 'export_bibliography', 'analyze_sources',
      'suggest_reading', 'calculate_spaced_repetition', 'quiz_mode',
    ],
    tokensPerAction: 95,
  },
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const getSphereById = (id: SphereId) => SPHERES.find(s => s.id === id);
export const getSectionById = (id: BureauSectionId) => BUREAU_SECTIONS.find(s => s.id === id);
export const getAgentConfig = (agentId: keyof typeof AGENT_MANIFEST) => AGENT_MANIFEST[agentId];

export const validateGovernance = (action: string, context: { sphereId: SphereId; budget: number }): boolean => {
  // L2: Budget before action
  if (context.budget <= 0) return false;
  
  // L3: Single sphere active (validation happens at UI level)
  
  return true;
};

export const calculateTokenCost = (agentId: keyof typeof AGENT_MANIFEST, actionCount: number = 1): number => {
  const agent = AGENT_MANIFEST[agentId];
  return agent ? agent.tokensPerAction * actionCount : 0;
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS SUMMARY
// ════════════════════════════════════════════════════════════════════════════════

export default {
  VERSION: CHENU_VERSION,
  SPHERES,
  BUREAU_SECTIONS,
  GOVERNANCE_LAWS,
  BRAND_COLORS,
  API_ENDPOINTS,
  AGENT_MANIFEST,
  utils: {
    getSphereById,
    getSectionById,
    getAgentConfig,
    validateGovernance,
    calculateTokenCost,
  },
};
