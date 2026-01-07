// =============================================================================
// CHE·NU™ — BUREAU TYPES
// Version Finale V52 — ARCHITECTURE GELÉE
// =============================================================================

/**
 * CHE·NU BUREAU MODEL — 6 SECTIONS (FROZEN)
 * 
 * IMPORTANT:
 * - Dashboard vs Bureau are SEPARATE MODES (not sections)
 * - Dashboard = Overview mode (KPIs, quick stats)
 * - Bureau = Work mode with these 6 hierarchical sections
 * 
 * DO NOT MODIFY WITHOUT EXPLICIT AUTHORIZATION
 */

// =============================================================================
// WORKSPACE VIEW MODES
// =============================================================================

export type WorkspaceViewMode = 'dashboard' | 'bureau';

export interface ViewModeConfig {
  id: WorkspaceViewMode;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
}

export const VIEW_MODE_CONFIGS: Record<WorkspaceViewMode, ViewModeConfig> = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    nameFr: 'Tableau de Bord',
    icon: '📊',
    description: 'Overview with KPIs and quick stats',
    descriptionFr: 'Vue d\'ensemble avec KPIs et statistiques rapides',
  },
  bureau: {
    id: 'bureau',
    name: 'Bureau',
    nameFr: 'Bureau',
    icon: '🗂️',
    description: 'Work mode with 6 sections',
    descriptionFr: 'Mode travail avec 6 sections',
  },
};

// =============================================================================
// 6 BUREAU SECTIONS (FROZEN — DO NOT MODIFY)
// =============================================================================

export type BureauSectionId = 
  | 'quickcapture'     // L2-1: ⚡ Quick Capture
  | 'resumeworkspace'  // L2-2: ▶️ Resume Workspace
  | 'threads'          // L2-3: 💬 Threads (.chenu)
  | 'datafiles'        // L2-4: 📁 Data/Files
  | 'activeagents'     // L2-5: 🤖 Active Agents
  | 'meetings';        // L2-6: 📅 Meetings

export const BUREAU_SECTION_COUNT = 6; // HARD LIMIT - DO NOT CHANGE

export interface BureauSectionConfig {
  id: BureauSectionId;
  level: 'L2';
  order: number;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  testId: string;
  maxItems?: number;
  features: string[];
}

// =============================================================================
// BUREAU SECTIONS DEFINITIONS
// =============================================================================

export const BUREAU_SECTIONS: Record<BureauSectionId, BureauSectionConfig> = {
  quickcapture: {
    id: 'quickcapture',
    level: 'L2',
    order: 1,
    name: 'Quick Capture',
    nameFr: 'Capture Rapide',
    icon: '⚡',
    description: 'Lightweight note taking (500 char max)',
    descriptionFr: 'Prise de notes légère (500 car. max)',
    testId: 'bureau-section-quickcapture',
    maxItems: 5,
    features: ['quick-notes', 'voice-to-text', 'image-capture'],
  },
  
  resumeworkspace: {
    id: 'resumeworkspace',
    level: 'L2',
    order: 2,
    name: 'Resume Workspace',
    nameFr: 'Reprendre le Travail',
    icon: '▶️',
    description: 'Continue existing work',
    descriptionFr: 'Continuer le travail existant',
    testId: 'bureau-section-resumeworkspace',
    features: ['recent-items', 'pinned-items', 'context-restore'],
  },
  
  threads: {
    id: 'threads',
    level: 'L2',
    order: 3,
    name: 'Threads',
    nameFr: 'Fils (.chenu)',
    icon: '💬',
    description: 'Conversation threads (.chenu files)',
    descriptionFr: 'Fils de conversation (fichiers .chenu)',
    testId: 'bureau-section-threads',
    features: ['thread-create', 'thread-search', 'thread-archive', 'encoding'],
  },
  
  datafiles: {
    id: 'datafiles',
    level: 'L2',
    order: 4,
    name: 'Data/Files',
    nameFr: 'Données/Fichiers',
    icon: '📁',
    description: 'File management and data access',
    descriptionFr: 'Gestion des fichiers et accès aux données',
    testId: 'bureau-section-datafiles',
    features: ['file-browser', 'upload', 'search', 'dataspaces'],
  },
  
  activeagents: {
    id: 'activeagents',
    level: 'L2',
    order: 5,
    name: 'Active Agents',
    nameFr: 'Agents Actifs',
    icon: '🤖',
    description: 'Agent status & control',
    descriptionFr: 'Statut et contrôle des agents',
    testId: 'bureau-section-activeagents',
    features: ['agent-list', 'agent-control', 'execution-status', 'checkpoints'],
  },
  
  meetings: {
    id: 'meetings',
    level: 'L2',
    order: 6,
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Meeting management',
    descriptionFr: 'Gestion des réunions',
    testId: 'bureau-section-meetings',
    features: ['meeting-schedule', 'meeting-notes', 'participants', 'recordings'],
  },
};

// =============================================================================
// BUREAU SECTIONS LIST (Ordered)
// =============================================================================

export const BUREAU_SECTION_LIST: BureauSectionConfig[] = [
  BUREAU_SECTIONS.quickcapture,
  BUREAU_SECTIONS.resumeworkspace,
  BUREAU_SECTIONS.threads,
  BUREAU_SECTIONS.datafiles,
  BUREAU_SECTIONS.activeagents,
  BUREAU_SECTIONS.meetings,
];

export const BUREAU_SECTION_IDS: BureauSectionId[] = [
  'quickcapture',
  'resumeworkspace',
  'threads',
  'datafiles',
  'activeagents',
  'meetings',
];

// =============================================================================
// WORKSPACE STATE
// =============================================================================

export interface WorkspaceViewState {
  mode: WorkspaceViewMode;
  currentSection?: BureauSectionId;
  previousSection?: BureauSectionId;
  isTransitioning: boolean;
}

export interface BureauState {
  activeSphereId: string | null;
  viewMode: WorkspaceViewMode;
  activeSection: BureauSectionId;
  expandedSections: BureauSectionId[];
  sectionStates: Record<BureauSectionId, SectionState>;
}

export interface SectionState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastUpdated: Date | null;
  itemCount: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get bureau section by ID
 */
export function getBureauSection(id: BureauSectionId): BureauSectionConfig {
  return BUREAU_SECTIONS[id];
}

/**
 * Get bureau section name in current locale
 */
export function getBureauSectionName(id: BureauSectionId, locale: 'fr' | 'en' = 'fr'): string {
  return locale === 'fr' ? BUREAU_SECTIONS[id].nameFr : BUREAU_SECTIONS[id].name;
}

/**
 * Validate bureau section ID
 */
export function isValidBureauSectionId(id: string): id is BureauSectionId {
  return BUREAU_SECTION_IDS.includes(id as BureauSectionId);
}

/**
 * Get default bureau section
 */
export function getDefaultBureauSection(): BureauSectionId {
  return 'quickcapture';
}

/**
 * Get next bureau section
 */
export function getNextBureauSection(currentId: BureauSectionId): BureauSectionId | null {
  const currentIndex = BUREAU_SECTION_IDS.indexOf(currentId);
  if (currentIndex === -1 || currentIndex >= BUREAU_SECTION_IDS.length - 1) {
    return null;
  }
  return BUREAU_SECTION_IDS[currentIndex + 1];
}

/**
 * Get previous bureau section
 */
export function getPreviousBureauSection(currentId: BureauSectionId): BureauSectionId | null {
  const currentIndex = BUREAU_SECTION_IDS.indexOf(currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return BUREAU_SECTION_IDS[currentIndex - 1];
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate bureau architecture
 */
export function validateBureauArchitecture(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (BUREAU_SECTION_IDS.length !== BUREAU_SECTION_COUNT) {
    errors.push(`Expected ${BUREAU_SECTION_COUNT} bureau sections, found ${BUREAU_SECTION_IDS.length}`);
  }
  
  // Check order is sequential 1-6
  for (let i = 0; i < BUREAU_SECTION_LIST.length; i++) {
    if (BUREAU_SECTION_LIST[i].order !== i + 1) {
      errors.push(`Section ${BUREAU_SECTION_LIST[i].id} has wrong order: ${BUREAU_SECTION_LIST[i].order}, expected ${i + 1}`);
    }
  }
  
  // Check all sections have level L2
  for (const section of BUREAU_SECTION_LIST) {
    if (section.level !== 'L2') {
      errors.push(`Section ${section.id} has wrong level: ${section.level}, expected L2`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Runtime validation
if (BUREAU_SECTION_IDS.length !== BUREAU_SECTION_COUNT) {
  // logger.error(`CRITICAL: CHE·NU Bureau requires exactly ${BUREAU_SECTION_COUNT} sections. Found: ${BUREAU_SECTION_IDS.length}`);
}
