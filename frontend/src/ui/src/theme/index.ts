// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — THEME SYSTEM INDEX
// ═══════════════════════════════════════════════════════════════════════════════

// Conflict Detection & Timeline
export {
  THEME_CONFLICT_RULES,
  CONFLICT_VISUAL_CONFIG,
  GOVERNANCE_RULES,
  detectThemeConflicts,
  ThemeTimelineRecorder,
  replayThemeTimeline,
  useThemeTimelineReplay,
} from './ThemeConflictDetector';

export type {
  ThemeLevel,
  ConflictSeverity,
  ThemeConflict,
  ThemeTimelineEvent,
  TimelineSnapshot,
  ReplayControls,
  ReplayState,
} from './ThemeConflictDetector';

// Theme Presets
export const THEME_PRESETS = {
  TREE_NATURE: 'tree_nature',
  SACRED_GOLD: 'sacred_gold',
  COSMIC_VOID: 'cosmic_void',
  ANCIENT_STONE: 'ancient_stone',
  QUANTUM_FLOW: 'quantum_flow',
} as const;

// Default Theme Config
export const DEFAULT_THEME_CONFIG = {
  defaultTheme: 'tree_nature',
  enableTransitions: true,
  transitionDuration: 300,
  enableConflictDetection: true,
  enableTimeline: true,
  maxTimelineEvents: 1000,
};
