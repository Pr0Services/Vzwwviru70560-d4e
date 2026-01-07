/**
 * CHE·NU™ Knowledge Threads Module
 * 
 * A Knowledge Thread is a persistent, human-recognized semantic thread
 * that links heterogeneous elements across CHE·NU into a coherent line
 * of meaning.
 * 
 * Position: Mega-Tree → Meta Layer → Knowledge Threads
 * 
 * Key Principles:
 * - Threads DO NOT own content, they reference it
 * - Threads DO NOT act, they contextualize
 * - No silent thread creation
 * - No hidden semantic inference
 * - Human remains the authority on "what this is about"
 * 
 * Non-Goals:
 * - NOT project management
 * - NOT productivity tracking
 * - NOT engagement optimization
 * - NOT memory replacement
 * 
 * Purpose: CLARITY, CONTINUITY, RESPONSIBILITY.
 * 
 * @version 1.0.0
 * @module knowledge-threads
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Core enums
  ThreadStatus,
  VisibilityScope,
  LinkType,
  LinkedEntityType,
  AgentRoleInThread,
  TimelineEventType,
  
  // Core interfaces
  LinkedEntity,
  LinkedAgent,
  AgentThreadPermissions,
  LinkedSnapshot,
  LinkedDecision,
  ThreadTimelineEvent,
  ThreadCreationContext,
  UnresolvedElement,
  
  // Main thread
  KnowledgeThread,
  
  // Agent suggestions
  AgentThreadSuggestion,
  ThreadAnalysis,
  
  // UI state
  ThreadViewFilters,
  ThreadListState,
  ThreadViewState,
  ThreadCreationForm,
  
  // Actions
  LinkEntityAction,
  UnlinkEntityAction,
  UpdateThreadAction,
  
  // Utility types
  ThreadSummary,
  ThreadWithAnalysis,
  ThreadNavigationContext,
} from './knowledge-threads.types';

// Export constants
export {
  LINK_TYPE_META,
  ENTITY_TYPE_META,
  THREAD_STATUS_META,
  THREAD_COLORS,
  DEFAULT_THREAD_FORM,
  DEFAULT_VIEW_FILTERS,
  DEFAULT_AGENT_PERMISSIONS,
} from './knowledge-threads.types';

// ============================================================================
// COMPONENTS
// ============================================================================

export { KnowledgeThreads } from './KnowledgeThreads';
export type { KnowledgeThreadsProps } from './KnowledgeThreads';

export { ThreadView } from './ThreadView';
export type { ThreadViewProps } from './ThreadView';

export { ThreadCreation } from './ThreadCreation';
export type { ThreadCreationProps } from './ThreadCreation';

export { LinkEntity } from './LinkEntity';
export type { LinkEntityProps } from './LinkEntity';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useThread,
  useThreadList,
  useEntityThreads,
  useThreadSuggestions,
  useThreadTimeline,
  useThreadCreation,
  useDebounce,
} from './hooks';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // ID Generation
  generateThreadId,
  generateLinkId,
  generateEventId,
  // Date/Time
  formatDate,
  formatRelativeTime,
  // Analysis
  calculateActivityLevel,
  extractUnresolvedElements,
  getSphereCoverage,
  groupEntitiesByLinkType,
  groupEntitiesByType,
  // Validation
  validateThreadForm,
  validateLink,
  // Transformations
  toThreadSummary,
  createLinkEvent,
  // Export
  exportToMarkdown,
  exportToJSON,
  // Search
  searchThreads,
  sortThreads,
  // Text
  truncate,
  capitalize,
  // Color
  getActivityColor,
  adjustBrightness,
} from './utils';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

import { KnowledgeThreads } from './KnowledgeThreads';
export default KnowledgeThreads;
