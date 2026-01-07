/**
 * CHE·NU™ VERTICAL INDUSTRY PACKS — TYPE DEFINITIONS
 * 
 * Vertical Industry Packs allow CHE·NU to be adopted contextually
 * without reinterpreting its core architecture.
 * 
 * They provide domain-specific:
 * - language
 * - templates
 * - agents
 * - XR spaces
 * 
 * WITHOUT altering meaning, ethics, or structure.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A Vertical Industry Pack is a preconfigured, domain-specific composition.
 * The core remains identical across all packs.
 */
export interface VerticalIndustryPack {
  /** Unique pack identifier */
  id: string;
  
  /** Internal industry name */
  industry_name: string;
  
  /** Public-facing label */
  public_label: string;
  
  /** Pack version */
  version: string;
  
  /** Domain language mapping */
  domain_language_map: DomainLanguageMap;
  
  /** Enabled spheres (subset of 9) */
  enabled_spheres: SphereConfiguration[];
  
  /** Pre-configured templates */
  templates: PackTemplate[];
  
  /** Pre-written agent contracts */
  agent_contracts: PackAgentContract[];
  
  /** Pre-configured XR spaces */
  xr_spaces: PackXRSpace[];
  
  /** Domain-specific meaning prompts */
  meaning_prompts: MeaningPrompt[];
  
  /** Regulatory/compliance notes */
  compliance_notes: string[];
  
  /** Pack metadata */
  metadata: PackMetadata;
}

/**
 * Pack cannot redefine these (LOCKED)
 */
export interface PackConstraints {
  /** Foundation Laws are immutable */
  foundation_laws_locked: true;
  
  /** Agent authority cannot be increased */
  agent_authority_locked: true;
  
  /** Decision ownership cannot be transferred to AI */
  decision_ownership_locked: true;
  
  /** Meaning semantics cannot be reinterpreted */
  meaning_semantics_locked: true;
}

export const PACK_CONSTRAINTS: PackConstraints = {
  foundation_laws_locked: true,
  agent_authority_locked: true,
  decision_ownership_locked: true,
  meaning_semantics_locked: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN LANGUAGE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Maps core CHE·NU terms to domain-specific vocabulary
 */
export interface DomainLanguageMap {
  /** Internal term -> domain term */
  terms: Record<string, string>;
  
  /** Domain-specific descriptions */
  descriptions: Record<string, string>;
  
  /** Domain examples */
  examples: Record<string, string[]>;
}

/**
 * Example language maps for different industries
 */
export const DOMAIN_LANGUAGE_EXAMPLES: Record<string, DomainLanguageMap> = {
  construction: {
    terms: {
      'Decision': 'Project Decision',
      'Thread': 'Project Thread',
      'Space': 'Project Site',
      'Snapshot': 'Site Status',
      'Reflection': 'Project Review',
    },
    descriptions: {
      'Decision': 'A documented project decision with full audit trail',
      'Thread': 'Connected project discussions and evolution',
      'Space': 'A construction project or site workspace',
    },
    examples: {
      'Decision': ['Material selection', 'Schedule change', 'Subcontractor approval'],
      'Thread': ['Foundation issues', 'Permit process', 'Safety protocol'],
    },
  },
  creative: {
    terms: {
      'Decision': 'Creative Choice',
      'Thread': 'Creative Thread',
      'Space': 'Studio',
      'Snapshot': 'Version',
      'Reflection': 'Creative Review',
    },
    descriptions: {
      'Decision': 'A documented creative direction or choice',
      'Thread': 'Evolution of creative ideas over time',
      'Space': 'A focused creative workspace',
    },
    examples: {
      'Decision': ['Color palette', 'Narrative direction', 'Visual style'],
      'Thread': ['Character development', 'Brand evolution', 'Story arc'],
    },
  },
  startup: {
    terms: {
      'Decision': 'Strategic Decision',
      'Thread': 'Strategy Thread',
      'Space': 'Domain',
      'Snapshot': 'Pivot Point',
      'Reflection': 'Strategy Review',
    },
    descriptions: {
      'Decision': 'A strategic choice with documented rationale',
      'Thread': 'Evolution of strategy across pivots',
      'Space': 'A focused business domain',
    },
    examples: {
      'Decision': ['Market pivot', 'Funding decision', 'Hire decision'],
      'Thread': ['Product evolution', 'Market positioning', 'Growth strategy'],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration for a sphere within a pack
 */
export interface SphereConfiguration {
  /** Sphere ID (one of 9 core spheres) */
  sphere_id: string;
  
  /** Display name in this pack */
  display_name: string;
  
  /** Domain-specific description */
  description: string;
  
  /** Enabled features */
  enabled_features: string[];
  
  /** Disabled features */
  disabled_features: string[];
  
  /** Is this sphere primary for this pack? */
  primary: boolean;
  
  /** Visibility order */
  order: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-configured template for this industry
 */
export interface PackTemplate {
  /** Template ID */
  id: string;
  
  /** Template type */
  type: 'decision' | 'thread' | 'workflow' | 'document' | 'meeting';
  
  /** Template name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Template structure */
  structure: TemplateStructure;
  
  /** Suggested meaning prompts */
  meaning_prompts: string[];
  
  /** Required fields */
  required_fields: string[];
  
  /** Optional fields */
  optional_fields: string[];
}

export interface TemplateStructure {
  /** Fields */
  fields: TemplateField[];
  
  /** Sections */
  sections: TemplateSection[];
  
  /** Validation rules */
  validation: ValidationRule[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'person' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TemplateSection {
  id: string;
  title: string;
  fields: string[];
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min_length' | 'max_length' | 'pattern';
  value?: string | number;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CONTRACTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-written agent contract for this industry
 */
export interface PackAgentContract {
  /** Contract ID */
  id: string;
  
  /** Agent role name */
  role_name: string;
  
  /** Role description */
  description: string;
  
  /** Allowed actions */
  allowed_actions: string[];
  
  /** Forbidden actions (explicitly stated) */
  forbidden_actions: string[];
  
  /** Required approvals */
  required_approvals: ApprovalRequirement[];
  
  /** Learning disabled by default in packs */
  learning_disabled: boolean;
  
  /** Maximum autonomy level */
  max_autonomy: 'none' | 'minimal' | 'limited';
  
  /** Trust ceiling */
  trust_ceiling: number; // 0-100
  
  /** Domain-specific constraints */
  domain_constraints: string[];
}

export interface ApprovalRequirement {
  action: string;
  required_role: 'owner' | 'admin' | 'any_human';
  timeout_action: 'block' | 'escalate';
}

/**
 * No pack may increase agent autonomy
 */
export const AGENT_AUTONOMY_CONSTRAINTS = {
  max_pack_autonomy: 'limited' as const,
  learning_default: false,
  trust_ceiling: 75, // Packs cannot set trust > 75
};

// ═══════════════════════════════════════════════════════════════════════════════
// XR SPACES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-configured XR space for this industry
 */
export interface PackXRSpace {
  /** Space ID */
  id: string;
  
  /** Space type */
  type: 'meta_room' | 'decision_room' | 'team_reflection' | 'narrative_replay';
  
  /** Display name */
  name: string;
  
  /** Purpose description */
  purpose: string;
  
  /** XR is always optional */
  optional: true;
  
  /** Configuration */
  configuration: XRSpaceConfiguration;
  
  /** Domain-specific primitives */
  domain_primitives: string[];
}

export interface XRSpaceConfiguration {
  /** Default layout */
  default_layout: string;
  
  /** Available primitives */
  primitives: string[];
  
  /** Suggested uses */
  suggested_uses: string[];
  
  /** Ambient settings */
  ambient: {
    lighting: 'calm' | 'focused' | 'neutral';
    audio: 'silent' | 'ambient' | 'minimal';
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEANING PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Domain-specific meaning prompts
 */
export interface MeaningPrompt {
  /** Prompt ID */
  id: string;
  
  /** Context where this prompt appears */
  context: 'decision' | 'thread' | 'reflection' | 'snapshot';
  
  /** The prompt question */
  question: string;
  
  /** Why this matters */
  rationale: string;
  
  /** Example responses */
  examples: string[];
  
  /** Required or suggested */
  required: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PACK METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface PackMetadata {
  /** Creation date */
  created_at: string;
  
  /** Last updated */
  updated_at: string;
  
  /** Author/maintainer */
  author: string;
  
  /** License */
  license: string;
  
  /** Compatibility */
  compatible_with: string; // Core version
  
  /** Tags */
  tags: string[];
  
  /** Description */
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL VERTICAL PACKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Foundation set of vertical packs
 */
export type FoundationPackId =
  | 'creative_studio'
  | 'construction_engineering'
  | 'startup_strategy'
  | 'education_research'
  | 'health_wellness';

export interface FoundationPackDefinition {
  id: FoundationPackId;
  name: string;
  tagline: string;
  emphasis: string[];
  primary_spheres: string[];
  xr_focus: string[];
}

export const FOUNDATION_PACKS: FoundationPackDefinition[] = [
  {
    id: 'creative_studio',
    name: 'Creative Studio',
    tagline: 'For writing, design, and media',
    emphasis: ['Narrative replay', 'Meaning-first workflows', 'Creative threads'],
    primary_spheres: ['Creative', 'Personal'],
    xr_focus: ['Narrative Replay', 'Reflection Room'],
  },
  {
    id: 'construction_engineering',
    name: 'Construction & Engineering',
    tagline: 'For projects, compliance, and traceability',
    emphasis: ['Decision rooms', 'Snapshots', 'Audit trails'],
    primary_spheres: ['Business', 'Team'],
    xr_focus: ['Decision Room', 'Team Reflection'],
  },
  {
    id: 'startup_strategy',
    name: 'Startup & Strategy',
    tagline: 'For decision clarity across pivots',
    emphasis: ['Decision clarity', 'Threads across pivots', 'Team alignment'],
    primary_spheres: ['Business', 'Team', 'Personal'],
    xr_focus: ['Decision Room', 'Team Reflection'],
  },
  {
    id: 'education_research',
    name: 'Education & Research',
    tagline: 'For learning and discovery',
    emphasis: ['Knowledge threads', 'Narrative learning', 'Low cognitive load'],
    primary_spheres: ['Scholar', 'Personal'],
    xr_focus: ['Narrative Replay', 'Reflection Room'],
  },
  {
    id: 'health_wellness',
    name: 'Health & Wellness (Non-Clinical)',
    tagline: 'For meaning, pacing, and balance',
    emphasis: ['Meaning focus', 'Strict agent boundaries', 'Load regulation'],
    primary_spheres: ['Personal', 'Community'],
    xr_focus: ['Reflection Room'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PACK PRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * How packs are presented publicly
 */
export interface PackPresentation {
  /** Pack ID */
  pack_id: string;
  
  /** Public name format: "CHE·NU for [Industry]" */
  public_name: string;
  
  /** This is NOT a different product */
  not_different_product: true;
  
  /** This is NOT a fork */
  not_fork: true;
  
  /** This is NOT a simplified version */
  not_simplified: true;
  
  /** Positioning */
  positioning: 'One core. Many lenses.';
}

/**
 * Pack presentation constraints
 */
export const PACK_PRESENTATION_RULES = {
  format: 'CHE·NU for [Industry]',
  is_semantic_adapter: true,
  not_feature_bundle: true,
  not_pricing_tier: true,
  not_watered_down: true,
  not_marketing_skin: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PACK LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pack lifecycle operations
 */
export interface PackLifecycle {
  /** Packs can be installed */
  installable: true;
  
  /** Packs can be removed */
  removable: true;
  
  /** Packs are versioned independently */
  independently_versioned: true;
  
  /** Updating pack does not affect core */
  update_isolation: true;
  
  /** Packs do not affect other packs */
  pack_isolation: true;
}

export const PACK_LIFECYCLE: PackLifecycle = {
  installable: true,
  removable: true,
  independently_versioned: true,
  update_isolation: true,
  pack_isolation: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get domain term for a core term
 */
export function getDomainTerm(
  pack: VerticalIndustryPack,
  coreTerm: string
): string {
  return pack.domain_language_map.terms[coreTerm] ?? coreTerm;
}

/**
 * Get domain description
 */
export function getDomainDescription(
  pack: VerticalIndustryPack,
  coreTerm: string
): string | undefined {
  return pack.domain_language_map.descriptions[coreTerm];
}

/**
 * Validate pack constraints
 */
export function validatePackConstraints(pack: VerticalIndustryPack): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  // Check agent autonomy limits
  for (const contract of pack.agent_contracts) {
    if (contract.max_autonomy === 'none') continue;
    if (contract.max_autonomy === 'minimal') continue;
    if (contract.max_autonomy === 'limited') {
      if (contract.trust_ceiling > AGENT_AUTONOMY_CONSTRAINTS.trust_ceiling) {
        violations.push(
          `Agent ${contract.role_name} trust ceiling ${contract.trust_ceiling} exceeds pack limit ${AGENT_AUTONOMY_CONSTRAINTS.trust_ceiling}`
        );
      }
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const VERTICAL_PACKS_MODULE_METADATA = {
  name: 'Vertical Industry Packs',
  version: '1.0.0',
  status: 'V51-extension',
  base: 'V51 (FROZEN)',
  modifies_core: false,
  
  purpose: 'Domain-specific adoption without core modification',
  
  provides: [
    'domain language',
    'domain templates',
    'domain agents',
    'domain XR spaces',
  ],
  
  does_not_alter: [
    'meaning',
    'ethics',
    'structure',
    'foundation laws',
    'agent authority',
    'decision ownership',
    'meaning semantics',
  ],
  
  foundation_packs: FOUNDATION_PACKS.map(p => p.id),
  
  pack_is_semantic_adapter: true,
} as const;
