/**
 * CHE·NU™ XR SPACE BUILDER UI — MODULE INDEX
 * 
 * XR Space Builder UI exists to let humans DESIGN XR spaces
 * without requiring 3D expertise, while enforcing:
 * - semantic clarity
 * - architectural discipline
 * - ethical safety
 * - cognitive calm
 * 
 * This UI translates XR Architecture rules into
 * UNDERSTANDABLE, HUMAN-SCALE controls.
 * 
 * No raw 3D manipulation.
 * No free-form geometry.
 * 
 * It is a STRUCTURE DECLARATION INTERFACE.
 * 
 * @version 1.0
 * @status V51-FROZEN
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { XRSpaceBuilder, default } from './XRSpaceBuilder';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  useCreationFlow,
  useSpace,
  useValidation,
  usePrimitivePalette,
  usePreview,
  useArchitectAgent,
  useVersioning,
  useXRSpaceBuilder,
  useBuilderKeyboard,
} from './hooks';

export type {
  UseCreationFlowOptions,
  UseCreationFlowReturn,
  UseSpaceOptions,
  UseSpaceReturn,
  UseValidationOptions,
  UseValidationReturn,
  UsePrimitivePaletteOptions,
  UsePrimitivePaletteReturn,
  UsePreviewOptions,
  UsePreviewReturn,
  UseArchitectAgentOptions,
  UseArchitectAgentReturn,
  UseVersioningOptions,
  UseVersioningReturn,
  UseXRSpaceBuilderOptions,
  UseXRSpaceBuilderReturn,
  UseBuilderKeyboardOptions,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  // Philosophy
  XRSpaceBuilderPhilosophy,
  
  // Primitives
  XRPrimitiveType,
  XRPrimitive,
  XRPrimitiveParameters,
  AnchorParameters,
  PathParameters,
  NodeParameters,
  FieldParameters,
  BoundaryParameters,
  HorizonParameters,
  LightParameters,
  XRPrimitiveScope,
  
  // Layout & Panels
  XRSpaceBuilderLayout,
  SpaceOverviewPanel,
  XRZone,
  PrimitivePalettePanel,
  PrimitivePaletteItem,
  SemanticConfigPanel,
  SemanticOption,
  ValidationPanel,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  PreviewPanel,
  PreviewMode,
  PreviewSimulation,
  PreviewState,
  
  // Creation Flow
  CreationStep,
  CreationMode,
  SpaceDeclaration,
  CreationFlowState,
  
  // Safety
  BuilderSafetyGuarantees,
  SafetyViolation,
  
  // Agent
  XRArchitectAgentUI,
  XRArchitectAgentCapabilities,
  ArchitectAgentMessage,
  
  // Versioning
  SpaceVersioning,
  SpaceVersion,
  SemanticChange,
  
  // Space
  XRSpace,
  PrimitiveConnection,
  SafetyStatus,
  
  // Templates
  XRSpaceTemplate,
  
  // API
  CreateSpaceRequest,
  CreateSpaceResponse,
  AddPrimitiveRequest,
  ValidateSpaceRequest,
  ValidateSpaceResponse,
  PublishSpaceRequest,
  
  // Props
  XRSpaceBuilderProps,
  
  // Non-goals
  XRSpaceBuilderNonGoal,
} from './xr-space-builder.types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  DEFAULT_SAFETY_GUARANTEES,
  DEFAULT_ARCHITECT_CAPABILITIES,
  PRIMITIVE_DEFINITIONS,
  CREATION_STEPS_ORDER,
  XR_SPACE_BUILDER_TOKENS,
  XR_SPACE_BUILDER_IS,
  XR_SPACE_BUILDER_NON_GOALS,
  XR_SPACE_BUILDER_MODULE_METADATA,
} from './xr-space-builder.types';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * XR SPACE BUILDER UI V1.0
 * 
 * STATUS: V51-FROZEN
 * 
 * PURPOSE:
 * XR Space Builder UI exists to let humans DESIGN XR spaces
 * without requiring 3D expertise, while enforcing:
 * - semantic clarity
 * - architectural discipline
 * - ethical safety
 * - cognitive calm
 * 
 * UI PHILOSOPHY:
 * - declarative, not procedural
 * - semantic, not geometric
 * - layered, not crowded
 * - calm, not stimulating
 * 
 * The user never "moves polygons".
 * The user declares INTENT and STRUCTURE.
 * 
 * UI LAYOUT (5 ZONES):
 * A) SPACE OVERVIEW PANEL (LEFT)
 *    - Top-down abstract map (non-3D)
 *    - Shows zones, anchors, paths
 *    - No perspective distortion
 * 
 * B) PRIMITIVE PALETTE (LEFT/LOWER)
 *    - Limited list of primitives:
 *      ANCHOR / PATH / NODE / FIELD / BOUNDARY / HORIZON / LIGHT
 *    - Each has meaning + "what this does NOT mean"
 * 
 * C) SEMANTIC CONFIG PANEL (CENTER/RIGHT)
 *    - Context-sensitive
 *    - Shows ONLY allowed properties
 *    - Every option has meaning explanation
 * 
 * D) VALIDATION & SAFETY PANEL (RIGHT)
 *    - Real-time status
 *    - Errors are BLOCKING, not advisory
 *    - Always explains WHY
 * 
 * E) PREVIEW/TEST PANEL (BOTTOM)
 *    - Enter XR preview
 *    - Simulate overlays
 * 
 * CREATION FLOW (NO STEP SKIPPABLE):
 * 1. Select mode (Template / Clone / Composable)
 * 2. Declare purpose & meaning
 * 3. Place primitives (guided)
 * 4. Validate continuously
 * 5. Preview in XR
 * 6. Confirm & publish
 * 
 * SAFETY GUARANTEES (MUST ENFORCE):
 * - no hidden areas
 * - no forced perspective
 * - no urgency encoding
 * - no attention traps
 * - no authority signaling via space
 * - exit always visible
 * - user agency preserved
 * 
 * If violated → BLOCK + EXPLANATION.
 * 
 * AGENT ROLE (XR ARCHITECT):
 * - monitors validation panel
 * - explains architectural rules
 * - NEVER edits or suggests aesthetics
 * - cites rules verbatim
 * 
 * NON-GOALS:
 * This is NOT:
 * - a 3D editor
 * - a creative playground
 * - a visual scripting tool
 * - a performance optimizer
 * 
 * It IS a STRUCTURE DECLARATION INTERFACE.
 * 
 * @example
 * ```tsx
 * import { XRSpaceBuilder } from '@chenu/xr-space-builder';
 * 
 * <XRSpaceBuilder
 *   user_id="user-1"
 *   initial_mode="template"
 *   architect_agent_enabled={true}
 *   onSpacePublished={(space) => logger.debug('Published:', space.id)}
 *   onExit={() => navigate('/')}
 * />
 * ```
 */
