/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — ASSETS CONFIGURATION                         ║
 * ║                       Switch Placeholder ↔ Midjourney                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Configuration centralisée pour tous les assets visuels CHE·NU
 * Permet de basculer entre:
 * - Mode PLACEHOLDER: Emojis et formes SVG générées
 * - Mode MIDJOURNEY: Images générées par Midjourney
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION GLOBALE
// ═══════════════════════════════════════════════════════════════════════════════

export type AssetMode = 'placeholder' | 'midjourney';

/**
 * 🔄 SWITCH PRINCIPAL
 * Changer cette valeur pour basculer tous les assets
 */
export const ASSET_MODE: AssetMode = 'placeholder';

/**
 * Chemin de base pour les assets Midjourney
 */
export const MIDJOURNEY_BASE_PATH = '/assets/midjourney';

/**
 * Activer le fallback automatique si image manquante
 */
export const ENABLE_FALLBACK = true;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team' 
  | 'scholars';

export type NovaState = 'idle' | 'thinking' | 'active' | 'speaking';

export type CheckpointState = 'pending' | 'approved' | 'rejected';

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface AssetConfig {
  placeholder: string;  // Emoji ou caractère
  midjourney: string;   // Chemin vers l'image
  alt: string;          // Description accessible
  color: string;        // Couleur associée
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: NOVA
// ═══════════════════════════════════════════════════════════════════════════════

export const NOVA_ASSETS: Record<NovaState, AssetConfig> = {
  idle: {
    placeholder: '✨',
    midjourney: `${MIDJOURNEY_BASE_PATH}/nova/nova-idle.png`,
    alt: 'Nova - État repos',
    color: '#3EB4A2',
  },
  thinking: {
    placeholder: '🤔',
    midjourney: `${MIDJOURNEY_BASE_PATH}/nova/nova-thinking.png`,
    alt: 'Nova - En réflexion',
    color: '#D8B26A',
  },
  active: {
    placeholder: '⚡',
    midjourney: `${MIDJOURNEY_BASE_PATH}/nova/nova-active.png`,
    alt: 'Nova - Active',
    color: '#4ADE80',
  },
  speaking: {
    placeholder: '💬',
    midjourney: `${MIDJOURNEY_BASE_PATH}/nova/nova-speaking.png`,
    alt: 'Nova - Communication',
    color: '#3EB4A2',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: 9 SPHÈRES
// ═══════════════════════════════════════════════════════════════════════════════

export const SPHERE_ASSETS: Record<SphereId, AssetConfig> = {
  personal: {
    placeholder: '🏠',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/personal.png`,
    alt: 'Sphère Personnel',
    color: '#3EB4A2',
  },
  business: {
    placeholder: '💼',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/business.png`,
    alt: 'Sphère Business',
    color: '#D8B26A',
  },
  government: {
    placeholder: '🏛️',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/government.png`,
    alt: 'Sphère Institutions',
    color: '#8D8371',
  },
  studio: {
    placeholder: '🎨',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/studio.png`,
    alt: 'Sphère Studio',
    color: '#7A593A',
  },
  community: {
    placeholder: '👥',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/community.png`,
    alt: 'Sphère Communauté',
    color: '#3F7249',
  },
  social: {
    placeholder: '📱',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/social.png`,
    alt: 'Sphère Social',
    color: '#2F4C39',
  },
  entertainment: {
    placeholder: '🎬',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/entertainment.png`,
    alt: 'Sphère Loisirs',
    color: '#E9E4D6',
  },
  team: {
    placeholder: '🤝',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/team.png`,
    alt: 'Sphère Équipe',
    color: '#5ED8FF',
  },
  scholar: {
    placeholder: '📚',
    midjourney: `${MIDJOURNEY_BASE_PATH}/spheres/scholar.png`,
    alt: 'Sphère Savoir',
    color: '#9B59B6',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: CHECKPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CHECKPOINT_ASSETS: Record<CheckpointState, AssetConfig> = {
  pending: {
    placeholder: '⏳',
    midjourney: `${MIDJOURNEY_BASE_PATH}/checkpoints/pending.png`,
    alt: 'Checkpoint en attente',
    color: '#D8B26A',
  },
  approved: {
    placeholder: '✅',
    midjourney: `${MIDJOURNEY_BASE_PATH}/checkpoints/approved.png`,
    alt: 'Checkpoint approuvé',
    color: '#3F7249',
  },
  rejected: {
    placeholder: '❌',
    midjourney: `${MIDJOURNEY_BASE_PATH}/checkpoints/rejected.png`,
    alt: 'Checkpoint refusé',
    color: '#8D8371',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: SECTIONS BUREAU
// ═══════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'dashboard' | 'notes' | 'tasks' | 'projects' 
  | 'threads' | 'meetings' | 'data' | 'agents' 
  | 'reports' | 'budget';

export const BUREAU_SECTION_ASSETS: Record<BureauSectionId, AssetConfig> = {
  dashboard: {
    placeholder: '📊',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/dashboard.png`,
    alt: 'Tableau de bord',
    color: '#3EB4A2',
  },
  notes: {
    placeholder: '📝',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/notes.png`,
    alt: 'Notes',
    color: '#E9E4D6',
  },
  tasks: {
    placeholder: '✅',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/tasks.png`,
    alt: 'Tâches',
    color: '#4ADE80',
  },
  projects: {
    placeholder: '📁',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/projects.png`,
    alt: 'Projets',
    color: '#D8B26A',
  },
  threads: {
    placeholder: '🧵',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/threads.png`,
    alt: 'Threads .chenu',
    color: '#9B59B6',
  },
  meetings: {
    placeholder: '📅',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/meetings.png`,
    alt: 'Réunions',
    color: '#5ED8FF',
  },
  data: {
    placeholder: '🗄️',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/data.png`,
    alt: 'Données',
    color: '#8D8371',
  },
  agents: {
    placeholder: '🤖',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/agents.png`,
    alt: 'Agents',
    color: '#3EB4A2',
  },
  reports: {
    placeholder: '📈',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/reports.png`,
    alt: 'Rapports',
    color: '#7A593A',
  },
  budget: {
    placeholder: '💰',
    midjourney: `${MIDJOURNEY_BASE_PATH}/sections/budget.png`,
    alt: 'Budget & Gouvernance',
    color: '#D8B26A',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: AGENTS (Top 20)
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentAssetConfig extends AssetConfig {
  level: AgentLevel;
  domain: string;
}

export const AGENT_ASSETS: Record<string, AgentAssetConfig> = {
  // L0 - System
  'nova': {
    placeholder: '✨',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/nova-system.png`,
    alt: 'Nova - Intelligence Système',
    color: '#3EB4A2',
    level: 'L0',
    domain: 'system',
  },
  
  // L1 - Directors (9)
  'director-personal': {
    placeholder: '🏠',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/personal.png`,
    alt: 'Director Personnel',
    color: '#3EB4A2',
    level: 'L1',
    domain: 'personal',
  },
  'director-business': {
    placeholder: '💼',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/business.png`,
    alt: 'Director Business',
    color: '#D8B26A',
    level: 'L1',
    domain: 'business',
  },
  'director-construction': {
    placeholder: '🏗️',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/construction.png`,
    alt: 'Director Construction',
    color: '#7A593A',
    level: 'L1',
    domain: 'construction',
  },
  'director-finance': {
    placeholder: '💵',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/finance.png`,
    alt: 'Director Finance',
    color: '#D8B26A',
    level: 'L1',
    domain: 'finance',
  },
  'director-legal': {
    placeholder: '⚖️',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/legal.png`,
    alt: 'Director Legal',
    color: '#8D8371',
    level: 'L1',
    domain: 'legal',
  },
  'director-creative': {
    placeholder: '🎨',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/creative.png`,
    alt: 'Director Creative',
    color: '#7A593A',
    level: 'L1',
    domain: 'creative',
  },
  'director-scholar': {
    placeholder: '📚',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/scholar.png`,
    alt: 'Director Scholar',
    color: '#9B59B6',
    level: 'L1',
    domain: 'scholars',
  },
  'director-team': {
    placeholder: '🤝',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/team.png`,
    alt: 'Director Team',
    color: '#5ED8FF',
    level: 'L1',
    domain: 'my_team',
  },
  'director-community': {
    placeholder: '👥',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/directors/community.png`,
    alt: 'Director Community',
    color: '#3F7249',
    level: 'L1',
    domain: 'community',
  },
  
  // L2 - Managers (exemples)
  'manager-accounting': {
    placeholder: '🧮',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/managers/accounting.png`,
    alt: 'Manager Comptabilité',
    color: '#D8B26A',
    level: 'L2',
    domain: 'finance',
  },
  'manager-contracts': {
    placeholder: '📜',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/managers/contracts.png`,
    alt: 'Manager Contrats',
    color: '#8D8371',
    level: 'L2',
    domain: 'legal',
  },
  'manager-design': {
    placeholder: '🖌️',
    midjourney: `${MIDJOURNEY_BASE_PATH}/agents/managers/design.png`,
    alt: 'Manager Design',
    color: '#7A593A',
    level: 'L2',
    domain: 'creative',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: UI ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const UI_ASSETS = {
  logo: {
    placeholder: '◈',
    midjourney: `${MIDJOURNEY_BASE_PATH}/ui/logo.png`,
    alt: 'CHE·NU Logo',
    color: '#D8B26A',
  },
  appIcon: {
    placeholder: '✦',
    midjourney: `${MIDJOURNEY_BASE_PATH}/ui/app-icon.png`,
    alt: 'CHE·NU App Icon',
    color: '#3EB4A2',
  },
  splash: {
    placeholder: '',
    midjourney: `${MIDJOURNEY_BASE_PATH}/ui/splash.png`,
    alt: 'CHE·NU Splash Screen',
    color: '#0d0d0f',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSETS: BACKGROUNDS
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKGROUND_ASSETS = {
  universe: {
    placeholder: '',
    midjourney: `${MIDJOURNEY_BASE_PATH}/backgrounds/universe.png`,
    alt: 'Fond Univers',
    color: '#0a0a0c',
  },
  bureau: {
    placeholder: '',
    midjourney: `${MIDJOURNEY_BASE_PATH}/backgrounds/bureau.png`,
    alt: 'Fond Bureau',
    color: '#151A18',
  },
  map: {
    placeholder: '',
    midjourney: `${MIDJOURNEY_BASE_PATH}/backgrounds/map.png`,
    alt: 'Fond Carte',
    color: '#0d100f',
  },
  landing: {
    placeholder: '',
    midjourney: `${MIDJOURNEY_BASE_PATH}/backgrounds/landing-hero.png`,
    alt: 'Hero Landing Page',
    color: '#0d0d0f',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: GET ASSET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Récupère l'asset approprié selon le mode actuel
 */
export function getAsset(config: AssetConfig): string {
  if (ASSET_MODE === 'midjourney') {
    return config.midjourney;
  }
  return config.placeholder;
}

/**
 * Vérifie si on est en mode Midjourney
 */
export function isMidjourneyMode(): boolean {
  return ASSET_MODE === 'midjourney';
}

/**
 * Récupère la couleur d'un asset
 */
export function getAssetColor(config: AssetConfig): string {
  return config.color;
}
