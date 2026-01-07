/**
 * CHE·NU™ XR META ROOM — MODULE EXPORTS
 * 
 * XR Meta Room is a spatial environment for reflection, alignment,
 * and high-level sense-making. The calm center of CHE·NU.
 * 
 * NOT for execution. NOT for productivity. NOT for performance.
 * 
 * It exists to answer:
 * → "What am I doing?"
 * → "Why am I doing it?"
 * → "Does this still make sense?"
 * 
 * @version 1.0
 * @status V51-ready
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export { XRMetaRoom, default } from './XRMetaRoom';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Spatial primitives
export type {
  Vector3,
  Rotation3,
  Quaternion,
  Transform,
  BoundingVolume,
} from './xr-meta-room.types';

// Room configuration
export type {
  RoomEntrySource,
  RoomAmbience,
  RoomConfig,
} from './xr-meta-room.types';

export { DEFAULT_ROOM_CONFIG } from './xr-meta-room.types';

// Spatial zones
export type {
  ZoneType,
  SpatialZone,
  ZoneContent,
  VisualState,
  AnimationState,
} from './xr-meta-room.types';

// XR representations
export type {
  XRThread,
  XRLinkedElement,
  ThreadSegment,
  XRDecision,
  XRDecisionFacet,
  XRSnapshot,
  SnapshotModeState,
  XRMeaning,
  MeaningRepresentation,
  XRCognitiveLoad,
  LoadXRState,
  LoadPerceptionCue,
  XRAgentPresence,
  XRAgentBoundary,
} from './xr-meta-room.types';

// Room state
export type {
  RoomState,
  SelectedObject,
} from './xr-meta-room.types';

// Interaction
export type {
  InteractionType,
  InteractionEvent,
  ExitMethod,
  NavigationMode,
  NavigationState,
} from './xr-meta-room.types';

// API types
export type {
  EnterRoomRequest,
  EnterRoomResponse,
  ExitRoomRequest,
  RoomUpdate,
} from './xr-meta-room.types';

// Component props
export type {
  XRMetaRoomProps,
  XRThreadVisualizationProps,
  XRDecisionVisualizationProps,
  XRSnapshotVisualizationProps,
} from './xr-meta-room.types';

// Design tokens
export { XR_META_ROOM_TOKENS } from './xr-meta-room.types';

// Module metadata
export { XR_META_ROOM_MODULE_METADATA } from './xr-meta-room.types';

// Non-goals
export type { XRMetaRoomNonGoal } from './xr-meta-room.types';
export { assertNotNonGoal } from './xr-meta-room.types';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

// Main room hook
export {
  useXRMetaRoom,
  type UseXRMetaRoomOptions,
  type UseXRMetaRoomReturn,
} from './hooks';

// Content management hooks
export {
  useXRThreads,
  type UseXRThreadsOptions,
  type UseXRThreadsReturn,
} from './hooks';

export {
  useXRDecisions,
  type UseXRDecisionsOptions,
  type UseXRDecisionsReturn,
} from './hooks';

export {
  useXRSnapshots,
  type UseXRSnapshotsOptions,
  type UseXRSnapshotsReturn,
} from './hooks';

// Environmental hooks
export {
  useXRCognitiveLoad,
  type UseXRCognitiveLoadOptions,
  type UseXRCognitiveLoadReturn,
} from './hooks';

// Agent hooks
export {
  useXRAgents,
  type UseXRAgentsOptions,
  type UseXRAgentsReturn,
} from './hooks';

// UI hooks
export {
  useXRMetaRoomUI,
  type UseXRMetaRoomUIReturn,
} from './hooks';

// Combined hook
export {
  useXRMetaRoomAll,
  type UseXRMetaRoomAllOptions,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR Meta Room is NOT:
 * - A meeting room
 * - A collaboration space
 * - A productivity XR tool
 * - A performance visualization
 * 
 * It is a place for ALIGNMENT.
 */
export const XR_META_ROOM_NON_GOALS = [
  'meeting_room',
  'collaboration_space',
  'productivity_tool',
  'performance_visualization',
  'gamification',
  'social_space',
  'task_execution',
  'notification_center',
] as const;

/**
 * Interaction rules for XR Meta Room:
 * - Slow movement
 * - Intentional gestures
 * - No rapid UI
 * - No notifications
 * 
 * XR Meta Room enforces calm by design, not by restriction.
 */
export const XR_META_ROOM_INTERACTION_RULES = {
  movement: {
    max_speed: 0.3,       // Always slow
    acceleration: 0.1,    // Gradual
    deceleration: 0.2,    // Smooth stop
  },
  gestures: {
    sensitivity: 0.5,     // Intentional
    hold_threshold: 500,  // ms for hold gesture
  },
  ui: {
    transition_duration: 1000,  // ms, always smooth
    fade_duration: 500,         // ms
  },
} as const;

/**
 * Agent behavior rules in XR Meta Room
 */
export const XR_META_ROOM_AGENT_RULES = {
  // Agents MAY:
  can: [
    'explain',
    'answer',
    'reflect',
  ],
  // Agents MAY NOT:
  cannot: [
    'persuade',
    'optimize',
    'lead',
    'initiate_unprompted',
    'create_urgency',
    'evaluate_performance',
  ],
} as const;

/**
 * Safety rules for XR Meta Room
 * User is NEVER trapped
 */
export const XR_META_ROOM_SAFETY = {
  exit_methods: ['gesture', 'voice', 'controller', 'timeout'],
  exit_always_available: true,
  exit_always_instant: true,
  force_entry: false,  // System must NEVER force entry
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE INFO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Module information
 */
export const MODULE_INFO = {
  name: 'XR Meta Room',
  version: '1.0.0',
  description: 'Spatial environment for reflection and alignment',
  
  purpose: `
    XR Meta Room exists as a spatial environment dedicated to
    reflection, alignment, and high-level sense-making.
    
    It is NOT for execution.
    It is NOT for productivity.
    It is NOT for performance.
    
    It exists to answer:
    → "What am I doing?"
    → "Why am I doing it?"
    → "Does this still make sense?"
    
    XR Meta Room is the calm center of CHE·NU.
  `,
  
  spatial_zones: [
    'CENTER: User presence',
    'THREAD FIELD: Floating semantic paths',
    'DECISION ANCHORS: Crystalline nodes',
    'SNAPSHOT MARKERS: Temporal pillars',
    'MEANING HALO: Ambient layer',
    'LOAD FIELD: Environmental density',
    'AGENT BOUNDARIES: Subtle perimeter outlines',
  ],
  
  visual_principles: [
    'No sharp edges',
    'No visual noise',
    'No urgency cues',
    'Minimal, calm, grounded',
  ],
  
  dependencies: [
    'Knowledge Threads',
    'Decision Crystallizer',
    'Context Snapshot',
    'Meaning Layer',
    'Cognitive Load Regulator',
    'Agent Contract',
    'Universe View',
  ],
  
  files: [
    'xr-meta-room.types.ts',
    'XRMetaRoom.tsx',
    'hooks.ts',
    'index.ts',
  ],
};
