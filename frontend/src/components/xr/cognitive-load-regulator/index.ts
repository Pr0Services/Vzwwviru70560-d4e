/**
 * CHE·NU™ Cognitive Load Regulator — Module Exports
 * 
 * Makes mental overload VISIBLE, EXPLICIT, and RESPECTED —
 * without optimization pressure or behavioral manipulation.
 * 
 * Core principles:
 * - The system adapts to the human
 * - The human never adapts to the system
 * - Tells what is happening, not what to do
 * - No nudging, no guilt, no pressure
 * 
 * Position: Mega-Tree → Meta Layer → Cognitive Load Regulator
 * 
 * @module cognitive-load-regulator
 * @version 1.0.0
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Load dimensions
  LoadDimensions,
  LoadState,
  LoadTrend,
  
  // Contributing factors
  ContributingFactorType,
  ContributingFactor,
  
  // Load state
  CognitiveLoadState,
  LoadHistoryPoint,
  
  // UI state
  IndicatorPosition,
  IndicatorIntensity,
  RegulatorUIState,
  
  // Adaptations
  SystemAdaptation,
  LoadSuggestion,
  
  // Agent interaction
  AgentLoadRules,
  
  // Privacy
  LoadPrivacySettings,
  
  // Integration
  ModuleIntegration,
} from './cognitive-load-regulator.types';

// ============================================================================
// Constant Exports
// ============================================================================

export {
  // State metadata
  LOAD_STATE_META,
  FACTOR_META,
  
  // Design colors
  REGULATOR_COLORS,
  
  // Agent phrasings
  AGENT_LOAD_PHRASINGS,
  
  // Defaults
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_AGENT_LOAD_RULES,
  DEFAULT_MODULE_INTEGRATION,
  
  // Thresholds
  LOAD_THRESHOLDS,
  
  // Ethical constraints
  LOAD_ETHICAL_CONSTRAINTS,
} from './cognitive-load-regulator.types';

// ============================================================================
// Component Exports
// ============================================================================

export {
  // Ambient indicator
  LoadIndicator,
  
  // Expanded breakdown view
  LoadBreakdown,
  
  // Suggestion banner
  LoadSuggestionBanner,
  
  // Main component
  CognitiveLoadRegulator,
  
  // Adaptation notice
  AdaptationNotice,
  
  // Full overview page
  LoadOverview,
} from './CognitiveLoadRegulator';

// ============================================================================
// Hook Exports
// ============================================================================

export {
  // Main load state
  useCognitiveLoad,
  
  // UI state management
  useRegulatorUI,
  
  // System adaptations
  useSystemAdaptations,
  
  // Optional suggestions
  useLoadSuggestions,
  
  // Factor details
  useFactorDetails,
  
  // Privacy settings
  useLoadPrivacy,
  
  // Reduced motion preference
  useReducedMotion,
  
  // Session history
  useLoadHistory,
} from './hooks';

// ============================================================================
// Default Export
// ============================================================================

export { CognitiveLoadRegulator as default } from './CognitiveLoadRegulator';

// ============================================================================
// Module Documentation
// ============================================================================

/**
 * Cognitive Load Regulator Module
 * 
 * This module makes complexity visible without making it coercive.
 * 
 * What it measures (system state only):
 * - Active threads
 * - Unresolved decisions
 * - Context switches
 * - Concurrent agents
 * - Navigation depth
 * - Meaning conflicts
 * 
 * What it does NOT measure:
 * - Biometric data
 * - Emotional state
 * - Productivity metrics
 * - Behavioral patterns
 * 
 * Load Dimensions:
 * - DENSITY: how much is active at once
 * - FRAGMENTATION: how scattered context is
 * - AMBIGUITY: unresolved meaning or decisions
 * - VOLATILITY: how fast context is changing
 * - RESPONSIBILITY: number of owned decisions
 * 
 * Load States (descriptive, not judgmental):
 * - CLEAR: Minimal active complexity
 * - FOCUSED: Single main context
 * - DENSE: Many active elements
 * - FRAGMENTED: Scattered across contexts
 * - SATURATED: Near capacity
 * - UNSTABLE: Rapid context changes
 * 
 * Key Rules:
 * - No nudging or guilt framing
 * - No productivity pressure
 * - No engagement optimization
 * - User can disable permanently
 * - Data is ephemeral, no profiling
 * 
 * Integration Points:
 * - Universe View: Ambient indicator, visual adaptations
 * - Knowledge Threads: Highlights excessive parallelism
 * - Context Snapshots: Suggested during high volatility
 * - Decision Crystallizer: Flags high-ambiguity decisions
 * - Agent Contracts: Agents respect load visibility rules
 * 
 * Usage Example:
 * ```tsx
 * import { CognitiveLoadRegulator, useCognitiveLoad } from './cognitive-load-regulator';
 * 
 * function Dashboard() {
 *   const { state, dimensions } = useCognitiveLoad({ sessionId: 'session_1' });
 *   
 *   return (
 *     <div>
 *       <CognitiveLoadRegulator userId="user_1" />
 *       {state === 'saturated' && (
 *         <p>Context is dense. You decide what to do.</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
