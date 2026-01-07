// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — BUREAU SYSTEM v2
// 6 Sections Hiérarchiques (HARD LIMIT)
// DELTA APRÈS v38.2
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'QUICK_CAPTURE'
  | 'RESUME_WORKSPACE'
  | 'THREADS'
  | 'DATA_FILES'
  | 'ACTIVE_AGENTS'
  | 'MEETINGS';

export type BureauLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface BureauSection {
  id: BureauSectionId;
  key: string;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  color: string;
  level: BureauLevel;
  testId: string;
}

// ═══════════════════════════════════════════════════════════════
// 6 BUREAU SECTIONS (HARD LIMIT)
// Context Bureau NEVER SKIPPED - Intelligence PRE-FILLS
// ═══════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS_V2: BureauSection[] = [
  {
    id: 'QUICK_CAPTURE',
    key: 'quick_capture',
    name: 'Quick Capture',
    nameFr: 'Capture Rapide',
    icon: '📝',
    description: 'Quick notes, voice memos, instant capture',
    descriptionFr: 'Notes rapides, mémos vocaux, capture instantanée',
    color: '#D8B26A', // Sacred Gold
    level: 'L2',
    testId: 'bureau-section-quick-capture',
  },
  {
    id: 'RESUME_WORKSPACE',
    key: 'resume_workspace',
    name: 'Resume Work',
    nameFr: 'Reprendre le Travail',
    icon: '▶️',
    description: 'Continue where you left off',
    descriptionFr: 'Continuer là où vous vous êtes arrêté',
    color: '#3EB4A2', // Cenote Turquoise
    level: 'L2',
    testId: 'bureau-section-resume-workspace',
  },
  {
    id: 'THREADS',
    key: 'threads',
    name: 'Threads',
    nameFr: 'Fils de Discussion',
    icon: '💬',
    description: 'Persistent conversation threads (.chenu)',
    descriptionFr: 'Fils de discussion persistants (.chenu)',
    color: '#3F7249', // Jungle Emerald
    level: 'L2',
    testId: 'bureau-section-threads',
  },
  {
    id: 'DATA_FILES',
    key: 'data_files',
    name: 'Data/Files',
    nameFr: 'Données/Fichiers',
    icon: '📁',
    description: 'DataSpaces and file management',
    descriptionFr: 'DataSpaces et gestion de fichiers',
    color: '#8D8371', // Ancient Stone
    level: 'L2',
    testId: 'bureau-section-data-files',
  },
  {
    id: 'ACTIVE_AGENTS',
    key: 'active_agents',
    name: 'Active Agents',
    nameFr: 'Agents Actifs',
    icon: '🤖',
    description: 'Currently active AI agents',
    descriptionFr: 'Agents IA actuellement actifs',
    color: '#2F4C39', // Shadow Moss
    level: 'L2',
    testId: 'bureau-section-active-agents',
  },
  {
    id: 'MEETINGS',
    key: 'meetings',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Meeting scheduling and management',
    descriptionFr: 'Planification et gestion des réunions',
    color: '#7A593A', // Earth Ember
    level: 'L2',
    testId: 'bureau-section-meetings',
  },
];

// ═══════════════════════════════════════════════════════════════
// BUREAU HIERARCHY (5 LEVELS)
// ═══════════════════════════════════════════════════════════════

export const BUREAU_HIERARCHY = {
  L0: {
    name: 'Global Bureau',
    description: 'System-wide settings and preferences',
    sections: ['settings', 'preferences', 'notifications', 'search', 'help'],
    count: 5,
  },
  L1: {
    name: 'Identity Bureau',
    description: 'User identity management per context',
    sections: ['profile', 'budget', 'permissions', 'history'],
    count: 4,
  },
  L2: {
    name: 'Sphere Bureau',
    description: '6 sections per sphere (HARD LIMIT)',
    sections: BUREAU_SECTIONS_V2.map(s => s.key),
    count: 6, // HARD LIMIT
  },
  L3: {
    name: 'Project Bureau',
    description: 'Project-specific sections',
    sections: ['overview', 'tasks', 'documents', 'team'],
    count: 4,
  },
  L4: {
    name: 'Agent Bureau',
    description: 'Agent-specific sections',
    sections: ['config', 'runs', 'logs', 'budget'],
    count: 4,
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getBureauSection = (id: BureauSectionId): BureauSection | undefined => {
  return BUREAU_SECTIONS_V2.find(s => s.id === id);
};

export const getBureauSectionByKey = (key: string): BureauSection | undefined => {
  return BUREAU_SECTIONS_V2.find(s => s.key === key);
};

export const getAllBureauSections = (): BureauSection[] => {
  return BUREAU_SECTIONS_V2;
};

export const getBureauSectionIds = (): BureauSectionId[] => {
  return BUREAU_SECTIONS_V2.map(s => s.id);
};

export const getBureauSectionKeys = (): string[] => {
  return BUREAU_SECTIONS_V2.map(s => s.key);
};

export const getBureauSectionCount = (): number => {
  return BUREAU_SECTIONS_V2.length; // Always 6
};

export const getBureauHierarchyLevel = (level: BureauLevel) => {
  return BUREAU_HIERARCHY[level];
};

// ═══════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════

export const validateBureauSectionId = (id: string): id is BureauSectionId => {
  return BUREAU_SECTIONS_V2.some(s => s.id === id);
};

export const validateBureauSectionKey = (key: string): boolean => {
  return BUREAU_SECTIONS_V2.some(s => s.key === key);
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default BUREAU_SECTIONS_V2;
