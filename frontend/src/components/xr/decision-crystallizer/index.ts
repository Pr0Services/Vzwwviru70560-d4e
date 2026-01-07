/**
 * CHE·NU™ V51 Meta-Layer
 * Decision Crystallizer V1.0 — Index
 * 
 * Makes decisions VISIBLE, TRACEABLE, and EXPLICIT.
 * Crystallizes choices without judgment or optimization.
 * 
 * WHAT THIS IS:
 * - A decision journal
 * - A choice visibility system  
 * - A traceability record
 * - An uncertainty acknowledgment tool
 * 
 * WHAT THIS IS NOT:
 * - A decision optimizer
 * - A choice recommender
 * - A regret analyzer
 * - A rationality coach
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export {
  DecisionCrystallizer,
  DecisionList,
  DecisionCard,
  DecisionView,
  DecisionCreation,
  DriftNotice,
  EmergingDecisions
} from './DecisionCrystallizer';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useDecisions,
  useDecision,
  useDecisionCreation,
  useEmergingDecisions,
  useDecisionDrift,
  useDecisionCrystallizerUI,
  useDecisionPrivacy,
  useDecisionReview,
  useDecisionSearch,
  useLinkedDecisions
} from './hooks';

// ============================================================================
// TYPES
// ============================================================================

export type {
  DecisionEntry,
  DecisionNature,
  CertaintyLevel,
  DecisionState,
  DecisionContext,
  AlternativeConsidered,
  DecisionLinkedEntity,
  DecisionLinkedEntityType,
  DecisionRevisitation,
  ReviewReminder,
  EmergingDecision,
  DecisionFilters,
  DecisionDrift,
  DecisionDriftTrigger,
  DecisionCrystallizerUIState,
  DecisionSortOption,
  DecisionCreationStep,
  DecisionCreationState,
  DecisionPrivacySettings
} from './decision-crystallizer.types';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  DECISION_NATURE_SYMBOLS,
  DECISION_NATURE_LABELS,
  DECISION_NATURE_DESCRIPTIONS,
  CERTAINTY_INDICATORS,
  DECISION_STATE_DESCRIPTIONS,
  AGENT_DECISION_PERMISSIONS,
  DECISION_ETHICAL_CONSTRAINTS,
  DECISION_DESIGN_TOKENS,
  DEFAULT_DECISION_PRIVACY
} from './decision-crystallizer.types';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export { DecisionCrystallizer as default } from './DecisionCrystallizer';
