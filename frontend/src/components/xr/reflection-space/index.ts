/**
 * CHE·NU™ V51 Meta-Layer
 * Reflection Space V1.0 — Module Exports
 * 
 * PURPOSE:
 * Provides a protected space for genuine reflection without
 * optimization pressure, productivity guilt, or judgment.
 * 
 * CORE PRINCIPLE:
 * Reflection is SACRED, not productive.
 * The system creates space for thought, never demands output.
 * 
 * THIS IS NOT:
 * - A journaling productivity tool
 * - A self-improvement tracker
 * - An insight extraction system
 * 
 * THIS IS:
 * - A quiet space to think
 * - Protection from productivity pressure
 * - Space to simply BE with thoughts
 * 
 * © 2025 CHE·NU™ — Governed Intelligence Operating System
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Core types
  Reflection,
  ReflectionSummary,
  ReflectionType,
  ReflectionState,
  ReflectionPrivacy,
  ReflectionEntry,
  
  // Content
  ReflectionContent,
  ReflectionSpark,
  ReflectionConnection,
  ReflectionRetention,
  
  // Space
  ReflectionSpace as ReflectionSpaceType,
  ReflectionEnvironment,
  ReflectionProtections,
  
  // Prompts
  ReflectionPrompt,
  PromptCategory,
  PromptSettings,
  
  // Agent restrictions
  ReflectionAgentPermissions,
  ReflectionEthicalConstraints,
  
  // UI State
  ReflectionFilters,
  ReflectionSort,
  ReflectionViewMode,
  ReflectionSpaceUIState,
  ReflectionEditState,
  ReflectionSpaceSettings,
  
  // Input types
  CreateReflectionInput,
  UpdateReflectionInput
} from './reflection-space.types';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  // Labels
  REFLECTION_TYPE_LABELS,
  REFLECTION_TYPE_SYMBOLS,
  REFLECTION_STATE_LABELS,
  REFLECTION_ENTRY_LABELS,
  PROMPT_CATEGORY_LABELS,
  
  // Defaults
  DEFAULT_REFLECTION_CONTENT,
  DEFAULT_REFLECTION_EDIT_STATE,
  DEFAULT_REFLECTION_ENVIRONMENT,
  DEFAULT_REFLECTION_PROTECTIONS,
  DEFAULT_REFLECTION_RETENTION,
  DEFAULT_PROMPT_SETTINGS,
  DEFAULT_REFLECTION_AGENT_PERMISSIONS,
  DEFAULT_REFLECTION_UI_STATE,
  DEFAULT_SPACE_SETTINGS,
  
  // Agent restrictions
  REFLECTION_AGENT_CANNOT,
  
  // Ethical constraints
  REFLECTION_ETHICAL_CONSTRAINTS,
  
  // Design tokens
  REFLECTION_DESIGN_TOKENS,
  
  // Sample prompts
  SAMPLE_REFLECTION_PROMPTS
} from './reflection-space.types';

// ============================================================================
// COMPONENTS
// ============================================================================

export {
  // Main component
  default as ReflectionSpace,
  ReflectionSpace as ReflectionSpaceComponent,
  
  // List components
  ReflectionList,
  ReflectionCard,
  
  // View components
  ReflectionView,
  ReflectionEditor,
  
  // Space components
  SpaceEnvironment,
  GentlePrompt,
  
  // Display components
  TypeIndicator,
  StateBadge,
  PrivacyIndicator
} from './ReflectionSpace';

// ============================================================================
// HOOKS
// ============================================================================

export {
  // List management
  useReflections,
  
  // Single reflection operations
  useReflection,
  
  // Editing
  useReflectionEdit,
  
  // Space environment
  useReflectionSpaceEnv,
  
  // Prompts
  useReflectionPrompts,
  
  // UI state
  useReflectionSpaceUI,
  
  // Privacy
  useReflectionPrivacy,
  
  // Search
  useReflectionSearch,
  
  // All settings
  useReflectionSettings
} from './hooks';

// Export hook types
export type {
  UseReflectionsOptions,
  UseReflectionsReturn,
  UseReflectionReturn,
  UseReflectionEditReturn,
  UseReflectionSpaceEnvReturn,
  UseReflectionPromptsReturn,
  UseReflectionSpaceUIReturn,
  UseReflectionPrivacyReturn,
  UseReflectionSearchReturn,
  UseReflectionSettingsReturn
} from './hooks';

// ============================================================================
// MODULE METADATA
// ============================================================================

/**
 * Reflection Space module metadata
 * For registry and integration purposes
 */
export const REFLECTION_SPACE_MODULE = {
  name: 'Reflection Space',
  version: '1.0.0',
  status: 'active',
  sphere: 'meta-layer',
  
  purpose: 'Protected space for genuine reflection without productivity pressure',
  
  principles: [
    'Reflection is SACRED, not productive',
    'System creates space for thought, never demands output',
    'No optimization, no judgment, no pressure'
  ],
  
  components: [
    'ReflectionSpace',
    'ReflectionList',
    'ReflectionCard',
    'ReflectionView',
    'ReflectionEditor',
    'SpaceEnvironment',
    'GentlePrompt'
  ],
  
  hooks: [
    'useReflections',
    'useReflection',
    'useReflectionEdit',
    'useReflectionSpaceEnv',
    'useReflectionPrompts',
    'useReflectionSpaceUI',
    'useReflectionPrivacy',
    'useReflectionSearch',
    'useReflectionSettings'
  ],
  
  dependencies: [],
  
  ethicalConstraints: [
    'Never productivize reflection',
    'Never gamify (no streaks, badges, scores)',
    'Never compare to others',
    'Never judge quality',
    'Maximum privacy by default',
    'Never analyze patterns',
    'No format or output requirements',
    'No time pressure',
    'No insight extraction',
    'Block agent intrusion',
    'Protect from analysis'
  ],
  
  agentRestrictions: {
    canDo: [
      // Almost nothing - reflection is sacred
      'Read titles only if explicitly permitted',
      'Never read content unless explicitly permitted'
    ],
    cannotDo: [
      'Read reflection content without explicit permission',
      'Access sealed reflections ever',
      'View reflection history or patterns',
      'Analyze reflection content',
      'Extract insights from reflections',
      'Identify patterns across reflections',
      'Track reflection frequency',
      'Measure reflection quality or depth',
      'Suggest reflection topics',
      'Recommend reflection prompts',
      'Prompt user to reflect',
      'Remind user to reflect',
      'Track reflection time',
      'Measure reflection consistency',
      'Report reflection stats',
      'Compare to other users',
      'Infer emotional state',
      'Track mood',
      'Analyze sentiment',
      'Reference content in other contexts',
      'Build profile from reflections'
    ]
  },
  
  reflectionTypes: [
    { type: 'freeform', symbol: '◌', description: 'Unstructured thought' },
    { type: 'processing', symbol: '◈', description: 'Working through something' },
    { type: 'exploring', symbol: '◇', description: 'Following curiosity' },
    { type: 'questioning', symbol: '?', description: 'Holding questions' },
    { type: 'appreciating', symbol: '♡', description: 'Noticing what matters' },
    { type: 'releasing', symbol: '○', description: 'Letting go' },
    { type: 'sitting', symbol: '●', description: 'Simply being present' },
    { type: 'unknown', symbol: '·', description: 'Not categorized' }
  ]
} as const;

// ============================================================================
// PHILOSOPHY STATEMENT
// ============================================================================

/**
 * Why Reflection Space exists
 * 
 * In a world of optimization and productivity pressure,
 * we need spaces where thinking is not measured.
 * 
 * This space is not for:
 * - Becoming more productive
 * - Improving yourself
 * - Extracting insights
 * - Measuring growth
 * 
 * This space is for:
 * - Being present with your thoughts
 * - Holding questions without answering
 * - Noticing without analyzing
 * - Simply being, without becoming
 * 
 * No agent will suggest how to reflect better.
 * No algorithm will optimize your thinking.
 * No metric will judge your depth.
 * 
 * This is sacred space.
 * It serves you by NOT serving productivity.
 */
export const REFLECTION_PHILOSOPHY = `
Reflection is not productive time to be optimized.
It is human time to be protected.

We do not measure reflection depth.
We do not track reflection frequency.
We do not analyze reflection content.
We do not compare reflection patterns.

We simply create space.
And trust you to use it—or not—as you need.

This is radical in a productivity culture.
But it is essential for human flourishing.

Reflect, or don't.
Write, or don't.
Find insight, or don't.

The space is here. It asks nothing of you.
` as const;
