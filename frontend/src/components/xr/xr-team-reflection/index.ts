/**
 * CHE·NU™ XR TEAM REFLECTION — MODULE INDEX
 * 
 * XR Team Reflection exists to allow multiple humans to
 * reflect together on shared work WITHOUT urgency,
 * hierarchy, persuasion, or performance pressure.
 * 
 * @version 1.0
 * @status V51-ready
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { XRTeamReflection, default } from './XRTeamReflection';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useTeamReflection,
  useSharedMeaning,
  useSharedThreads,
  useSharedDecisions,
  useTeamLoad,
  useTeamReflectionAgents,
  useTeamReflectionInteractions,
  useTeamReflectionAll,
} from './hooks';

export type {
  UseTeamReflectionOptions,
  UseTeamReflectionReturn,
  UseSharedMeaningReturn,
  UseSharedThreadsReturn,
  UseSharedDecisionsReturn,
  UseTeamLoadReturn,
  UseTeamReflectionAgentsReturn,
  UseTeamReflectionInteractionsReturn,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Entry & Config
  TeamReflectionEntryRequirements,
  TeamReflectionConfig,
  
  // Participants
  TeamReflectionParticipant,
  TeamReflectionInvitation,
  
  // Scope
  ReflectionScope,
  ReflectionFocusType,
  
  // Zones
  TeamReflectionZoneType,
  TeamReflectionZone,
  
  // Shared content
  SharedMeaning,
  MeaningConflict,
  SharedThread,
  SharedDecision,
  
  // Load
  TeamLoadState,
  
  // Silence
  SilenceZone,
  
  // Agents
  TeamReflectionAgentCapabilities,
  TeamReflectionAgent,
  
  // Room state
  TeamReflectionRoomState,
  
  // Interactions
  TeamReflectionInteractionType,
  TeamReflectionInteractionEvent,
  
  // Exit
  ExitMethod,
  ExitEvent,
  
  // API
  CreateTeamReflectionRequest,
  CreateTeamReflectionResponse,
  JoinTeamReflectionRequest,
  JoinTeamReflectionResponse,
  
  // Props
  XRTeamReflectionProps,
  
  // Non-goals
  XRTeamReflectionNonGoal,
} from './xr-team-reflection.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  DEFAULT_TEAM_REFLECTION_CONFIG,
  TEAM_REFLECTION_AGENT_CAPABILITIES,
  XR_TEAM_REFLECTION_TOKENS,
  XR_TEAM_REFLECTION_MODULE_METADATA,
  XR_TEAM_REFLECTION_NON_GOALS,
} from './xr-team-reflection.types';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR TEAM REFLECTION V1.0
 * 
 * PURPOSE:
 * XR Team Reflection exists to allow multiple humans to
 * reflect together on shared work WITHOUT:
 * - urgency
 * - hierarchy
 * - persuasion
 * - performance pressure
 * 
 * WHAT IT IS NOT:
 * - Not a meeting room
 * - Not a standup
 * - Not a review board
 * 
 * WHAT IT IS:
 * - Shared understanding
 * - Alignment
 * - Mutual respect
 * 
 * SPATIAL ZONES:
 * - CENTER: Shared focus area
 * - MEANING FIELD: Shared values & intentions
 * - THREAD MAP: Shared knowledge threads
 * - DECISION ARCHIVE: Shared decisions (read-only)
 * - LOAD AMBIENCE: Aggregated team load
 * - SILENCE ZONE: Optional quiet reflection
 * 
 * PRINCIPLES:
 * - No "head of table"
 * - No dominant position
 * - Presence is equal by design
 * - No individual metrics exposed
 * 
 * ENTRY:
 * - Explicit invitation
 * - Explicit consent
 * - Clear scope definition
 * 
 * @example
 * ```tsx
 * import { XRTeamReflection } from '@chenu/xr-team-reflection';
 * 
 * const scope = {
 *   id: 'scope-1',
 *   title: 'Q4 Reflection',
 *   focus_type: 'shared_meaning',
 *   linked_thread_ids: ['thread-1'],
 *   linked_decision_ids: ['decision-1'],
 *   linked_meaning_ids: [],
 *   defined_by: 'user-1',
 *   defined_at: new Date().toISOString(),
 * };
 * 
 * <XRTeamReflection
 *   session_id="session-1"
 *   scope={scope}
 *   current_user_id="user-1"
 *   display_name="Alice"
 *   onJoin={(p) => logger.debug('Joined:', p)}
 *   onLeave={(e) => logger.debug('Left:', e)}
 * />
 * ```
 */
