/**
 * CHE·NU™ XR ARCHITECTURE SYSTEM — MODULE INDEX
 * 
 * XR Architecture System exists to give CHE·NU a coherent,
 * intentional spatial language.
 * 
 * XR is not decoration.
 * XR is structural cognition.
 * 
 * @version 1.0
 * @status V51-ready
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { XRArchitectureSystem, default } from './XRArchitectureSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  usePrimitives,
  useSpatialSemantics,
  useColorPhilosophy,
  useNavigationConfig,
  useRoomValidation,
  useArchitectAgent,
  useXRArchitecture,
} from './hooks';

export type {
  UsePrimitivesOptions,
  UsePrimitivesReturn,
  UseSpatialSemanticsOptions,
  UseSpatialSemanticsReturn,
  UseColorPhilosophyOptions,
  UseColorPhilosophyReturn,
  UseNavigationConfigOptions,
  UseNavigationConfigReturn,
  UseRoomValidationOptions,
  UseRoomValidationReturn,
  UseArchitectAgentOptions,
  UseArchitectAgentReturn,
  UseXRArchitectureOptions,
  UseXRArchitectureReturn,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Primitives
  ArchitecturalPrimitiveType,
  ArchitecturalPrimitive,
  AnchorPrimitive,
  AnchorType,
  PathPrimitive,
  PathType,
  FieldPrimitive,
  FieldType,
  NodePrimitive,
  NodeType,
  NodeShape,
  BoundaryPrimitive,
  BoundaryType,
  HorizonPrimitive,
  HorizonType,
  DepthPrimitive,
  DepthType,
  
  // Semantics
  SpatialSemantics,
  SemanticViolation,
  
  // Materials & Colors
  MaterialDefinition,
  MaterialType,
  ColorPhilosophy,
  
  // Navigation
  NavigationConfig,
  
  // Rooms
  RoomType,
  RoomTypeDefinition,
  RoomLayout,
  
  // Architect Agent
  ArchitectAgentCapabilities,
  ComplianceCheckResult,
  
  // Validation
  ValidationRule,
  ValidationCategory,
  ValidationContext,
  ValidationResult,
  
  // API
  CreatePrimitiveRequest,
  ValidateRoomRequest,
  ValidateRoomResponse,
  
  // Props
  XRArchitectureSystemProps,
  
  // Non-goals
  XRArchitectureNonGoal,
} from './xr-architecture-system.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  DEFAULT_SPATIAL_SEMANTICS,
  DEFAULT_COLOR_PHILOSOPHY,
  DEFAULT_NAVIGATION_CONFIG,
  ARCHITECT_AGENT_CAPABILITIES,
  XR_ARCHITECTURE_TOKENS,
  XR_ARCHITECTURE_MODULE_METADATA,
  XR_ARCHITECTURE_NON_GOALS,
} from './xr-architecture-system.types';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR ARCHITECTURE SYSTEM V1.0
 * 
 * PURPOSE:
 * XR Architecture System exists to give CHE·NU a coherent,
 * intentional spatial language.
 * 
 * It ensures that XR spaces are:
 * - consistent
 * - meaningful
 * - readable
 * - non-manipulative
 * 
 * ARCHITECTURAL PRIMITIVES:
 * - ANCHOR: fixed reference (decisions, snapshots)
 * - PATH: continuity (threads, narratives)
 * - FIELD: ambient state (meaning, load)
 * - NODE: discrete objects (options, agents)
 * - BOUNDARY: limits (contracts, permissions)
 * - HORIZON: future / unknown
 * - DEPTH: complexity, not priority
 * 
 * SPATIAL SEMANTICS (NON-NEGOTIABLE):
 * - CENTER ≠ importance (center = perspective)
 * - HEIGHT ≠ authority (height = abstraction)
 * - SIZE ≠ value (size = complexity)
 * - BRIGHTNESS ≠ priority (brightness = clarity)
 * - MOTION ≠ urgency (motion = change)
 * 
 * COLOR & MATERIAL PHILOSOPHY:
 * - Desaturated palettes
 * - Soft materials
 * - No high-contrast alerts
 * - No aggressive lighting
 * - No gamification textures
 * - Color conveys state, not emotion
 * 
 * NAVIGATION PRINCIPLES:
 * - Slow locomotion by default
 * - Intentional gestures
 * - No forced paths
 * - Multiple exits always visible
 * - User agency never compromised
 * 
 * ROOM CONSISTENCY:
 * All XR rooms inherit:
 * - Same spatial grammar
 * - Same safety rules
 * - Same semantic primitives
 * - Rooms differ by configuration, not philosophy
 * 
 * ARCHITECT AGENT:
 * XR Space Architect Agent (OPTIONAL):
 * - Validates room compliance
 * - Checks semantic consistency
 * - Blocks manipulative layouts
 * - Has NO creative authority
 * - Only structural veto power
 * 
 * @example
 * ```tsx
 * import { XRArchitectureSystem } from '@chenu/xr-architecture-system';
 * 
 * const primitives = [
 *   {
 *     id: 'anchor-1',
 *     type: 'anchor',
 *     position: { x: 0, y: 0, z: 0 },
 *     scale: { x: 1, y: 1, z: 1 },
 *     semantic_meaning: 'Decision reference point',
 *     semantic_verbal: 'This marks where the decision was crystallized',
 *     material: { type: 'soft_glow', base_color: '#8888AA', roughness: 0.7, metalness: 0.1, transparency: 0 },
 *     opacity: 1,
 *     active: true,
 *     interactive: true,
 *     created_at: new Date().toISOString(),
 *     anchor_type: 'decision_anchor',
 *     stability: 'permanent',
 *     glow_radius: 0.5,
 *     pulse_rate: 0,
 *   }
 * ];
 * 
 * <XRArchitectureSystem
 *   room_type="decision_room"
 *   primitives={primitives}
 *   validate_on_change={true}
 *   architect_agent_enabled={true}
 *   onValidationResult={(result) => logger.debug(result)}
 * />
 * ```
 */
