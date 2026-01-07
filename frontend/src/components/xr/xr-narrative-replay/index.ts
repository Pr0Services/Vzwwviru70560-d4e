/**
 * CHE·NU™ XR NARRATIVE REPLAY — MODULE INDEX
 * 
 * XR Narrative Replay exists to allow humans to
 * RE-EXPERIENCE the evolution of thought, decisions,
 * and meaning — not just events.
 * 
 * This is NOT surveillance.
 * This is reflective memory.
 * 
 * @version 1.0
 * @status V51-ready
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { XRNarrativeReplay, default } from './XRNarrativeReplay';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useNarrativeReplay,
  useNarrativeElements,
  useNarrativeComparison,
  useNarrativeAgent,
  useTeamNarrative,
  useNarrativeKeyboard,
  useXRNarrativeReplay,
} from './hooks';

export type {
  UseNarrativeReplayOptions,
  UseNarrativeReplayReturn,
  UseNarrativeElementsOptions,
  UseNarrativeElementsReturn,
  UseNarrativeComparisonOptions,
  UseNarrativeComparisonReturn,
  UseNarrativeAgentOptions,
  UseNarrativeAgentReturn,
  UseTeamNarrativeOptions,
  UseTeamNarrativeReturn,
  UseNarrativeKeyboardOptions,
  UseXRNarrativeReplayOptions,
  UseXRNarrativeReplayReturn,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Sources
  NarrativeSourceType,
  NarrativeSource,
  
  // Elements
  NarrativeElementType,
  NarrativeElement,
  StartElement,
  BranchElement,
  BranchOption,
  PauseElement,
  DecisionElement,
  ConsequenceElement,
  EvolutionElement,
  
  // Path & Connections
  NarrativePath,
  NarrativeConnection,
  
  // Spatial
  NarrativeSpatialConfig,
  
  // Controls
  NarrativeUserControls,
  
  // Playback
  PlaybackState,
  NarrativeSessionState,
  
  // Agent
  NarrativeAgentCapabilities,
  NarrativeAgent,
  
  // Ethics
  NarrativeEthicalSafeguards,
  
  // Team
  TeamNarrativeConfig,
  NarrativeParticipant,
  
  // Comparison
  NarrativeComparison,
  ComparisonDifference,
  
  // API
  CreateNarrativeRequest,
  CreateNarrativeResponse,
  StartReplayRequest,
  StartReplayResponse,
  
  // Props
  XRNarrativeReplayProps,
  
  // Non-goals
  XRNarrativeReplayNonGoal,
} from './xr-narrative-replay.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  DEFAULT_NARRATIVE_SPATIAL_CONFIG,
  DEFAULT_NARRATIVE_USER_CONTROLS,
  NARRATIVE_AGENT_CAPABILITIES,
  DEFAULT_ETHICAL_SAFEGUARDS,
  DEFAULT_TEAM_NARRATIVE_CONFIG,
  XR_NARRATIVE_REPLAY_TOKENS,
  XR_NARRATIVE_REPLAY_MODULE_METADATA,
  XR_NARRATIVE_REPLAY_NON_GOALS,
} from './xr-narrative-replay.types';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR NARRATIVE REPLAY V1.0
 * 
 * PURPOSE:
 * XR Narrative Replay exists to allow humans to
 * RE-EXPERIENCE the evolution of thought, decisions,
 * and meaning — not just events.
 * 
 * It answers:
 * → "How did we get here?"
 * → "What changed along the way?"
 * → "What did we believe then?"
 * 
 * This is NOT surveillance.
 * This is reflective memory.
 * 
 * NARRATIVE STRUCTURE:
 * - START: initial context & meaning
 * - BRANCHES: explored options
 * - PAUSES: uncertainty & reflection
 * - DECISIONS: crystallization points
 * - CONSEQUENCES: downstream effects
 * - EVOLUTION: meaning shifts
 * 
 * INPUT SOURCES:
 * - Knowledge Threads
 * - Context Snapshots
 * - Crystallized Decisions
 * - Meaning Entries
 * - Timeline events
 * - XR sessions (if consented)
 * 
 * USER CONTROLS:
 * - Pause narrative
 * - Jump between points
 * - Compare past & present
 * - Exit instantly (ESC)
 * 
 * ETHICAL SAFEGUARDS:
 * - Replay is opt-in
 * - No hidden recording
 * - No auto-generated narratives without approval
 * - Meaning is preserved as it was
 * - No retrospective optimization
 * 
 * TEAM NARRATIVE RULES:
 * - Individual perspectives remain visible
 * - Ownership is preserved
 * - Disagreements are not smoothed out
 * - History remains plural
 * 
 * AGENT CAPABILITIES:
 * - MAY: explain what happened, clarify why it mattered, answer questions
 * - MAY NOT: reinterpret meaning, justify outcomes, rewrite history
 * - MUST: cite sources
 * 
 * @example
 * ```tsx
 * import { XRNarrativeReplay } from '@chenu/xr-narrative-replay';
 * 
 * const narrative = {
 *   id: 'narrative-1',
 *   title: 'Project Decision Journey',
 *   description: 'How we arrived at the architecture',
 *   elements: [
 *     {
 *       id: 'start-1',
 *       type: 'start',
 *       timestamp: '2025-01-15T10:00:00Z',
 *       position: { x: 0, y: 0, z: 0 },
 *       title: 'Initial Requirements',
 *       description: 'Started with user research',
 *       context_at_time: 'Early planning phase',
 *       source: { type: 'context_snapshot', id: 'snap-1', consented: true },
 *       linked_elements: ['branch-1'],
 *       created_at: '2025-01-15T10:00:00Z',
 *       preserved_as_was: true,
 *       initial_context: 'User research complete',
 *       initial_meaning: ['Speed matters', 'Privacy essential'],
 *     }
 *   ],
 *   connections: [],
 *   start_time: '2025-01-15T10:00:00Z',
 *   created_by: 'user-1',
 *   all_sources_consented: true,
 *   created_at: '2025-01-15T10:00:00Z',
 *   updated_at: '2025-01-15T10:00:00Z',
 * };
 * 
 * <XRNarrativeReplay
 *   narrative={narrative}
 *   user_id="user-1"
 *   agent_enabled={true}
 *   onElementVisit={(el) => logger.debug('Visited:', el.title)}
 *   onExit={() => logger.debug('Exited replay')}
 * />
 * ```
 */
