/**
 * CHE·NU™ PUBLIC ABSTRACTION LAYER — TYPE DEFINITIONS
 * 
 * Public Abstraction Layer exists to make CHE·NU
 * UNDERSTANDABLE, SHAREABLE, and PRESENTABLE
 * without exposing its internal cognitive complexity.
 * 
 * The public never sees:
 * - Mega-Tree internals
 * - Agent orchestration complexity
 * - Cognitive load mechanics
 * - Meaning infrastructure
 * - Ethical enforcement mechanisms
 * 
 * The public sees:
 * → outcomes
 * → clarity
 * → responsibility
 * → stability
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ABSTRACTION STRATA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public Abstraction is layered - each level is opt-in, no forced depth
 */
export type AbstractionLevel =
  | 'conceptual'   // Level 1: Vision
  | 'functional'   // Level 2: Capabilities
  | 'experience'   // Level 3: Use Cases
  | 'technical';   // Level 4: Optional Tech (for experts)

/**
 * Abstraction Level definitions
 */
export interface AbstractionLevelDefinition {
  level: AbstractionLevel;
  depth: 1 | 2 | 3 | 4;
  label: string;
  description: string;
  audience: string;
  shows: string[];
  hides: string[];
}

export const ABSTRACTION_LEVELS: Record<AbstractionLevel, AbstractionLevelDefinition> = {
  conceptual: {
    level: 'conceptual',
    depth: 1,
    label: 'Vision',
    description: 'CHE·NU as a "Human-Centered Cognitive OS"',
    audience: 'General public, executives, non-technical stakeholders',
    shows: ['clarity', 'responsibility', 'stability', 'human control'],
    hides: ['architecture', 'agents', 'mega-tree', 'cognitive mechanics'],
  },
  functional: {
    level: 'functional',
    depth: 2,
    label: 'Capabilities',
    description: 'What CHE·NU enables you to do',
    audience: 'Potential users, department heads, team leads',
    shows: ['organize work', 'knowledge management', 'AI assistance', 'traceable decisions'],
    hides: ['agent contracts', 'encoding layer', 'thread mechanics'],
  },
  experience: {
    level: 'experience',
    depth: 3,
    label: 'Use Cases',
    description: 'How CHE·NU feels to use',
    audience: 'Evaluators, pilot users, champions',
    shows: ['decision clarity', 'team alignment', 'reduced overload', 'meaningful workflows'],
    hides: ['meaning infrastructure', 'cognitive load algorithms'],
  },
  technical: {
    level: 'technical',
    depth: 4,
    label: 'Architecture (Optional)',
    description: 'Technical details for experts',
    audience: 'Technical evaluators, integrators, developers',
    shows: ['modular architecture', 'agent contracts', 'XR spaces', 'narrative replay'],
    hides: ['nothing - full transparency for this audience'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC OBJECT MODEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public-facing objects are simplified
 * Internal names remain untouched
 */

/**
 * Mapping from internal to public terminology
 */
export interface PublicObjectMapping {
  internal: string;
  public: string;
  description: string;
  level: AbstractionLevel;
}

export const PUBLIC_OBJECT_MAPPINGS: PublicObjectMapping[] = [
  {
    internal: 'Sphere',
    public: 'Space',
    description: 'A focused area for specific work or life domain',
    level: 'functional',
  },
  {
    internal: 'Crystallized Decision',
    public: 'Decision',
    description: 'A recorded choice with context and rationale',
    level: 'functional',
  },
  {
    internal: 'Knowledge Thread',
    public: 'Thread',
    description: 'Connected thinking that evolves over time',
    level: 'functional',
  },
  {
    internal: 'XR Meta Room',
    public: 'Room',
    description: 'An optional space for focused reflection',
    level: 'experience',
  },
  {
    internal: 'Agent',
    public: 'Assistant',
    description: 'AI help with clear boundaries',
    level: 'functional',
  },
  {
    internal: 'Agent Contract',
    public: 'Assistant Rules',
    description: 'What your assistant can and cannot do',
    level: 'experience',
  },
  {
    internal: 'Cognitive Load',
    public: 'Mental Load',
    description: 'How much you have on your mind',
    level: 'experience',
  },
  {
    internal: 'Meaning Layer',
    public: 'Values & Meaning',
    description: 'What matters to you and why',
    level: 'experience',
  },
  {
    internal: 'Context Snapshot',
    public: 'Snapshot',
    description: 'A saved moment of understanding',
    level: 'functional',
  },
  {
    internal: 'Narrative Replay',
    public: 'History Review',
    description: 'Looking back at how you got here',
    level: 'experience',
  },
];

/**
 * Public Space (simplified Sphere)
 */
export interface PublicSpace {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  
  /** Current activity summary */
  activity_summary: string;
  
  /** Number of active threads */
  active_threads: number;
  
  /** Number of recent decisions */
  recent_decisions: number;
  
  /** Mental load indicator (simplified) */
  mental_load: 'low' | 'moderate' | 'high';
}

/**
 * Public Decision (simplified Crystallized Decision)
 */
export interface PublicDecision {
  id: string;
  title: string;
  summary: string;
  made_at: string;
  made_by: string;
  
  /** Why this decision was made */
  rationale: string;
  
  /** What this affects */
  impacts: string[];
  
  /** Can this be changed? */
  reversible: boolean;
  
  /** Related thread */
  thread_id?: string;
}

/**
 * Public Thread (simplified Knowledge Thread)
 */
export interface PublicThread {
  id: string;
  title: string;
  summary: string;
  started_at: string;
  last_updated: string;
  
  /** Brief evolution description */
  evolution: string;
  
  /** Related decisions */
  decisions: number;
  
  /** Current status */
  status: 'active' | 'paused' | 'concluded';
}

/**
 * Public Room (simplified XR Meta Room)
 */
export interface PublicRoom {
  id: string;
  name: string;
  purpose: string;
  type: 'reflection' | 'decision' | 'my_team' | 'review';
  
  /** Is XR required? */
  xr_required: boolean;
  
  /** Availability */
  available: boolean;
}

/**
 * Public Assistant (simplified Agent)
 */
export interface PublicAssistant {
  id: string;
  name: string;
  role: string;
  
  /** What this assistant can do */
  capabilities: string[];
  
  /** What this assistant cannot do */
  limitations: string[];
  
  /** Is this assistant active? */
  active: boolean;
  
  /** Trust level */
  trust: 'new' | 'established' | 'trusted';
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI & COMMUNICATION RULES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public UI characteristics
 */
export interface PublicUIRules {
  /** UI must be flat, not deep */
  flat: true;
  
  /** UI must be calm, not stimulating */
  calm: true;
  
  /** Minimal depth by default */
  minimal_depth: true;
  
  /** XR is optional, never default */
  xr_optional: true;
  
  /** No futurism marketing */
  no_futurism: true;
  
  /** No AI mystique */
  no_ai_mystique: true;
  
  /** No productivity hype */
  no_productivity_hype: true;
}

/**
 * XR presentation rules
 */
export interface XRPresentationRules {
  /** How XR is described publicly */
  public_description: 'Optional immersive reflection spaces';
  
  /** XR is never forced */
  never_forced: true;
  
  /** XR is not the main feature */
  not_main_feature: true;
  
  /** XR is presented as enhancement, not requirement */
  enhancement_only: true;
}

/**
 * Communication guidelines
 */
export interface CommunicationGuidelines {
  tone: 'calm' | 'professional' | 'trustworthy';
  
  /** Words to use */
  use_words: string[];
  
  /** Words to avoid */
  avoid_words: string[];
  
  /** Key messages */
  key_messages: string[];
}

export const PUBLIC_COMMUNICATION_GUIDELINES: CommunicationGuidelines = {
  tone: 'trustworthy',
  
  use_words: [
    'clarity',
    'understanding',
    'control',
    'responsibility',
    'traceable',
    'reversible',
    'human-centered',
    'thoughtful',
    'stable',
    'trustworthy',
  ],
  
  avoid_words: [
    'AI-powered',
    'revolutionary',
    'disruptive',
    'automated',
    'intelligent',
    'smart',
    'optimize',
    '10x',
    'productivity',
    'efficiency',
    'gamification',
    'engagement',
  ],
  
  key_messages: [
    'Human always in control',
    'Nothing happens silently',
    'Every decision has an owner',
    'Everything can be undone',
    'Clarity over speed',
    'Understanding over automation',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY & TRUST SIGNALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Trust signals that must be emphasized
 */
export interface TrustSignals {
  /** Human is always in control */
  human_control: true;
  
  /** No hidden automation */
  no_hidden_automation: true;
  
  /** Decisions are owned by humans */
  decision_ownership: true;
  
  /** AI cannot act silently */
  no_silent_ai: true;
  
  /** Everything is reversible */
  reversibility: true;
  
  /** Full transparency */
  transparency: true;
}

/**
 * Trust signal display
 */
export interface TrustSignalDisplay {
  id: string;
  signal: keyof TrustSignals;
  icon: string;
  title: string;
  description: string;
  emphasis: 'primary' | 'secondary';
}

export const TRUST_SIGNAL_DISPLAYS: TrustSignalDisplay[] = [
  {
    id: 'control',
    signal: 'human_control',
    icon: '👤',
    title: 'You Stay in Control',
    description: 'AI assists, but you decide. Always.',
    emphasis: 'primary',
  },
  {
    id: 'visible',
    signal: 'no_hidden_automation',
    icon: '👁️',
    title: 'Everything Visible',
    description: 'No hidden processes. See what happens.',
    emphasis: 'primary',
  },
  {
    id: 'owned',
    signal: 'decision_ownership',
    icon: '✍️',
    title: 'Your Decisions',
    description: 'Every choice has a clear owner.',
    emphasis: 'secondary',
  },
  {
    id: 'quiet',
    signal: 'no_silent_ai',
    icon: '🔔',
    title: 'AI Never Silent',
    description: 'AI cannot act without your knowledge.',
    emphasis: 'secondary',
  },
  {
    id: 'undo',
    signal: 'reversibility',
    icon: '↩️',
    title: 'Always Reversible',
    description: 'Change your mind. Undo any action.',
    emphasis: 'primary',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public dashboard view
 */
export interface PublicDashboardView {
  /** Active spaces summary */
  spaces: PublicSpace[];
  
  /** Recent decisions */
  recent_decisions: PublicDecision[];
  
  /** Active threads */
  active_threads: PublicThread[];
  
  /** Mental load overview */
  mental_load: {
    current: 'low' | 'moderate' | 'high';
    trend: 'decreasing' | 'stable' | 'increasing';
    suggestion?: string;
  };
  
  /** Active assistants */
  assistants: PublicAssistant[];
  
  /** Trust indicators visible */
  trust_signals_visible: true;
}

/**
 * Public space view
 */
export interface PublicSpaceView {
  space: PublicSpace;
  threads: PublicThread[];
  decisions: PublicDecision[];
  assistants: PublicAssistant[];
  rooms: PublicRoom[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Translate internal term to public term
 */
export function toPublicTerm(internal: string): string {
  const mapping = PUBLIC_OBJECT_MAPPINGS.find(m => m.internal === internal);
  return mapping?.public ?? internal;
}

/**
 * Translate public term to internal term
 */
export function toInternalTerm(public_term: string): string {
  const mapping = PUBLIC_OBJECT_MAPPINGS.find(m => m.public === public_term);
  return mapping?.internal ?? public_term;
}

/**
 * Get appropriate abstraction level content
 */
export function getAbstractionContent<T>(
  level: AbstractionLevel,
  content: Record<AbstractionLevel, T>
): T {
  return content[level];
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public abstraction layer component props
 */
export interface PublicAbstractionLayerProps {
  /** User abstraction level preference */
  level: AbstractionLevel;
  
  /** User ID */
  user_id: string;
  
  /** Show trust signals */
  show_trust_signals?: boolean;
  
  /** Enable XR options */
  xr_enabled?: boolean;
  
  /** Callbacks */
  onLevelChange?: (level: AbstractionLevel) => void;
  onSpaceSelect?: (space: PublicSpace) => void;
  onDecisionSelect?: (decision: PublicDecision) => void;
  onThreadSelect?: (thread: PublicThread) => void;
  
  /** Custom class */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NON-GOALS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * This layer is NOT:
 */
export type PublicAbstractionNonGoal =
  | 'a_demo_of_technical_power'
  | 'a_showcase_of_ai_intelligence'
  | 'a_promise_of_optimization'
  | 'a_marketing_surface';

export const PUBLIC_ABSTRACTION_NON_GOALS: PublicAbstractionNonGoal[] = [
  'a_demo_of_technical_power',
  'a_showcase_of_ai_intelligence',
  'a_promise_of_optimization',
  'a_marketing_surface',
];

/**
 * It IS:
 */
export const PUBLIC_ABSTRACTION_IS = 'A DOORWAY, NOT THE ENGINE' as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const PUBLIC_ABSTRACTION_MODULE_METADATA = {
  name: 'Public Abstraction Layer',
  version: '1.0.0',
  status: 'V51-extension',
  base: 'V51 (FROZEN)',
  modifies_core: false,
  
  purpose: 'Make CHE·NU understandable, shareable, and presentable',
  
  what_public_sees: ['outcomes', 'clarity', 'responsibility', 'stability'],
  
  what_public_never_sees: [
    'Mega-Tree internals',
    'Agent orchestration complexity',
    'Cognitive load mechanics',
    'Meaning infrastructure',
    'Ethical enforcement mechanisms',
  ],
  
  abstraction_levels: Object.keys(ABSTRACTION_LEVELS),
  
  trust_is_primary_feature: true,
} as const;
