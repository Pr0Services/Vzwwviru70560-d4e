/**
 * CHE·NU™ Meaning Layer — Module Exports
 * 
 * Meaning Layer captures and preserves the human WHY behind
 * actions, structures, and decisions.
 * 
 * Core principles:
 * - Meaning is DECLARED, never inferred
 * - Agents may read, never write
 * - No persuasion, no optimization
 * - Provides space for reflection, not direction
 * 
 * Position: Mega-Tree → Meta Layer → Meaning Layer
 * 
 * @module meaning-layer
 * @version 1.0.0
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core types
  MeaningType,
  MeaningScope,
  MeaningStability,
  MeaningState,
  LinkedEntityType,
  
  // Interfaces
  LinkedEntity,
  ReviewReminder,
  MeaningRevision,
  MeaningEntry,
  MeaningSummary,
  
  // Creation & editing
  MeaningCreationForm,
  MeaningPromptContext,
  
  // Conflict detection
  MeaningConflict,
  
  // Agent interaction
  AgentMeaningRules,
  AgentMeaningSuggestion,
  
  // Visualization
  MeaningVisual,
  MeaningLayerState,
  
  // Reflection view
  MeaningReflectionView,
} from './meaning-layer.types';

// ============================================================================
// Constant Exports
// ============================================================================

export {
  // Type metadata
  MEANING_TYPE_META,
  MEANING_SCOPE_META,
  MEANING_STABILITY_META,
  MEANING_STATE_META,
  
  // Design colors
  MEANING_COLORS,
  
  // Defaults
  DEFAULT_AGENT_MEANING_RULES,
  DEFAULT_REVIEW_REMINDER,
  
  // Ethical constraints
  MEANING_ETHICAL_CONSTRAINTS,
} from './meaning-layer.types';

// ============================================================================
// Component Exports
// ============================================================================

export {
  // List view
  MeaningList,
  
  // Card component
  MeaningCard,
  
  // Detail view
  MeaningView,
  
  // Creation form
  MeaningCreation,
  
  // Agent prompt
  MeaningPrompt,
  
  // Conflict banner
  MeaningConflictBanner,
} from './MeaningLayer';

// ============================================================================
// Hook Exports
// ============================================================================

export {
  // List and filter meanings
  useMeanings,
  
  // Single meaning operations
  useMeaning,
  
  // Create new meaning
  useMeaningCreation,
  
  // Conflict detection
  useMeaningConflicts,
  
  // Visualization layer
  useMeaningLayer,
  
  // Agent prompts
  useMeaningPrompts,
  
  // Review reminders
  useMeaningReview,
  
  // Search
  useMeaningSearch,
  
  // Entity-linked meanings
  useLinkedMeanings,
} from './hooks';

// ============================================================================
// Default Export
// ============================================================================

export { MeaningList as default } from './MeaningLayer';

// ============================================================================
// Module Documentation
// ============================================================================

/**
 * Meaning Layer Module
 * 
 * This module provides a first-class place where users can declare:
 * - "What does this mean to me?"
 * - "Why does this exist in my life or work?"
 * 
 * Meaning Types:
 * - PURPOSE: "Why this exists"
 * - VALUE: "What matters here"
 * - INTENTION: "What I am trying to do"
 * - BELIEF: "What I assume to be true"
 * - COMMITMENT: "What I choose to stand by"
 * 
 * Key Rules:
 * - Meaning is always human-authored
 * - Agents may read and reference, never create or edit
 * - No hierarchy between meaning types
 * - No correctness scoring
 * - Evolution is visible, never erased
 * 
 * Integration Points:
 * - Knowledge Threads: Meaning gives narrative coherence
 * - Decisions: Decisions may reference meaning
 * - Context Snapshots: Capture active meanings
 * - Universe View: Subtle halo/annotation layer
 * 
 * Ethical Constraints:
 * - No persuasion mechanics
 * - No emotional scoring
 * - No sentiment analysis for control
 * - No optimization of meaning
 * 
 * Usage Example:
 * ```tsx
 * import { MeaningList, useMeaning, MeaningPrompt } from './meaning-layer';
 * 
 * function MeaningManager() {
 *   const { meaning } = useMeaning({ meaningId: 'xyz', userId: 'user_1' });
 *   
 *   return (
 *     <div>
 *       <MeaningList userId="user_1" />
 *       {meaning && (
 *         <blockquote>"{meaning.statement}"</blockquote>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
