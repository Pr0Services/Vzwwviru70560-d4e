/**
 * CHE·NU™ XR DECISION ROOM — MODULE INDEX
 * 
 * XR Decision Room exists to support conscious, accountable
 * decision-making in complex contexts.
 * 
 * @version 1.0
 * @status V51-ready
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { XRDecisionRoom, default } from './XRDecisionRoom';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useDecisionRoom,
  useDecisionOptions,
  useDecisionCriteria,
  useDecisionConsequences,
  useDecisionMeaning,
  useDecisionRoomAgents,
  useDecisionRoomInteractions,
  useDecisionRoomAll,
} from './hooks';

export type {
  UseDecisionRoomOptions,
  UseDecisionRoomReturn,
  UseDecisionOptionsReturn,
  UseDecisionCriteriaReturn,
  UseDecisionConsequencesReturn,
  UseDecisionMeaningReturn,
  UseDecisionRoomAgentsReturn,
  UseDecisionRoomInteractionsReturn,
  UseDecisionRoomAllOptions,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Room configuration
  DecisionRoomEntryReason,
  DecisionRoomConfig,
  
  // Decision core
  XRDecisionCore,
  DecisionState,
  DecisionReversibility,
  
  // Options
  XRDecisionOption,
  OptionAssumption,
  OptionRisk,
  
  // Criteria
  XRDecisionCriterion,
  CriteriaEvaluation,
  
  // Consequences
  XRConsequence,
  
  // Snapshot integration
  DecisionSnapshotState,
  
  // Meaning
  XRDecisionMeaning,
  OptionAlignment,
  
  // Cognitive load
  DecisionLoadState,
  
  // Zones
  DecisionZoneType,
  DecisionZone,
  
  // Crystallization
  CrystallizationRequirements,
  CrystallizationEvent,
  
  // Agents
  DecisionRoomAgentCapabilities,
  DecisionRoomAgent,
  
  // Room state
  DecisionRoomState,
  
  // Interactions
  DecisionInteractionType,
  DecisionInteractionEvent,
  
  // API
  EnterDecisionRoomRequest,
  EnterDecisionRoomResponse,
  CrystallizeDecisionRequest,
  CrystallizeDecisionResponse,
  
  // Props
  XRDecisionRoomProps,
  
  // Non-goals
  XRDecisionRoomNonGoal,
} from './xr-decision-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  DEFAULT_DECISION_ROOM_CONFIG,
  DECISION_ROOM_AGENT_CAPABILITIES,
  XR_DECISION_ROOM_TOKENS,
  XR_DECISION_ROOM_MODULE_METADATA,
  XR_DECISION_ROOM_NON_GOALS,
} from './xr-decision-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR DECISION ROOM V1.0
 * 
 * PURPOSE:
 * XR Decision Room exists to support conscious, accountable
 * decision-making in complex contexts.
 * 
 * WHAT IT IS NOT:
 * - Not a debate arena
 * - Not a persuasion space
 * - Not a productivity accelerator
 * 
 * WHAT IT IS:
 * - Externalizes complexity
 * - Slows decision-making appropriately
 * - Preserves responsibility and traceability
 * 
 * SPATIAL ZONES:
 * - CENTER: Decision core
 * - OPTION NODES: Spatially separated paths (equidistant)
 * - CRITERIA RING: Criteria orbit around core
 * - CONTEXT PLANE: Active Context Snapshot
 * - CONSEQUENCE FIELD: Downstream impact projections
 * - MEANING FIELD: Ambient alignment cues
 * - LOAD INDICATOR: Environmental density
 * 
 * PRINCIPLES:
 * - No asymmetry
 * - No visual bias
 * - No hidden scoring
 * - No algorithmic preference
 * 
 * CRYSTALLIZATION:
 * Crystallization occurs ONLY when:
 * - User explicitly confirms
 * - Rationale is provided
 * - Reversibility is declared
 * 
 * AGENT RULES:
 * Agents MAY:
 * - Explain options
 * - Simulate consequences
 * - Surface contradictions
 * 
 * Agents MAY NOT:
 * - Recommend a choice
 * - Prioritize options
 * - Influence emotionally
 * 
 * @example
 * ```tsx
 * import { XRDecisionRoom } from '@chenu/xr-decision-room';
 * 
 * const decision = {
 *   id: 'decision-1',
 *   title: 'Technology Stack',
 *   question: 'Which framework should we use?',
 *   state: 'exploring',
 *   context_summary: 'New project requires...',
 *   linked_thread_ids: ['thread-1'],
 *   created_at: new Date().toISOString(),
 *   created_by: 'user-1',
 * };
 * 
 * <XRDecisionRoom
 *   entry_reason="creating_new"
 *   decision={decision}
 *   options={[
 *     { id: 'opt-1', title: 'React', ... },
 *     { id: 'opt-2', title: 'Vue', ... },
 *   ]}
 *   onCrystallize={(event) => {
 *     logger.debug('Decision crystallized:', event);
 *   }}
 * />
 * ```
 */
