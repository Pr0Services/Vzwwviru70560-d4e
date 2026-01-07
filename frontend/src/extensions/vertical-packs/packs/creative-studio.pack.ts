/**
 * CHE·NU™ VERTICAL PACK — CREATIVE STUDIO
 * 
 * Pre-configured pack for writing, design, and media workflows.
 * 
 * Emphasis:
 * - Narrative replay
 * - Meaning-first workflows
 * - Creative threads
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

import type {
  VerticalIndustryPack,
  SphereConfiguration,
  PackTemplate,
  PackAgentContract,
  PackXRSpace,
  MeaningPrompt,
} from './vertical-packs.types';

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CREATIVE_STUDIO_SPHERES: SphereConfiguration[] = [
  {
    sphere_id: 'creative',
    display_name: 'Studio',
    description: 'Your primary creative workspace',
    enabled_features: [
      'knowledge_threads',
      'narrative_replay',
      'meaning_layer',
      'decision_crystallizer',
      'reflection_space',
    ],
    disabled_features: [],
    primary: true,
    order: 1,
  },
  {
    sphere_id: 'personal',
    display_name: 'Journal',
    description: 'Personal reflections and creative notes',
    enabled_features: [
      'knowledge_threads',
      'meaning_layer',
      'reflection_space',
    ],
    disabled_features: [],
    primary: false,
    order: 2,
  },
  {
    sphere_id: 'my_team',
    display_name: 'Collaborations',
    description: 'Shared creative projects',
    enabled_features: [
      'knowledge_threads',
      'decision_crystallizer',
      'context_snapshot',
    ],
    disabled_features: [],
    primary: false,
    order: 3,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const CREATIVE_STUDIO_TEMPLATES: PackTemplate[] = [
  {
    id: 'creative_thread',
    type: 'thread',
    name: 'Creative Thread',
    description: 'Track the evolution of a creative idea',
    structure: {
      fields: [
        {
          id: 'title',
          label: 'Thread Title',
          type: 'text',
          required: true,
          placeholder: 'e.g., Character Design Evolution',
        },
        {
          id: 'initial_spark',
          label: 'Initial Spark',
          type: 'textarea',
          required: true,
          placeholder: 'What inspired this creative direction?',
        },
        {
          id: 'medium',
          label: 'Medium',
          type: 'select',
          required: true,
          options: ['Writing', 'Visual Design', 'Music', 'Video', 'Mixed Media', 'Other'],
        },
        {
          id: 'meaning',
          label: 'Why This Matters',
          type: 'textarea',
          required: true,
          placeholder: 'What makes this creatively meaningful to you?',
        },
      ],
      sections: [
        { id: 'core', title: 'Core', fields: ['title', 'initial_spark'] },
        { id: 'context', title: 'Context', fields: ['medium', 'meaning'] },
      ],
      validation: [
        { field: 'title', rule: 'required', message: 'Title is required' },
        { field: 'initial_spark', rule: 'required', message: 'Initial spark is required' },
        { field: 'meaning', rule: 'required', message: 'Please reflect on why this matters' },
      ],
    },
    meaning_prompts: [
      'What does this represent in your creative journey?',
      'How does this connect to your creative values?',
    ],
    required_fields: ['title', 'initial_spark', 'meaning'],
    optional_fields: ['medium'],
  },
  {
    id: 'creative_choice',
    type: 'decision',
    name: 'Creative Choice',
    description: 'Document a creative direction decision',
    structure: {
      fields: [
        {
          id: 'choice',
          label: 'The Choice',
          type: 'text',
          required: true,
          placeholder: 'e.g., Going with warm color palette',
        },
        {
          id: 'alternatives',
          label: 'Alternatives Considered',
          type: 'textarea',
          required: true,
          placeholder: 'What other directions were possible?',
        },
        {
          id: 'why_this',
          label: 'Why This Direction',
          type: 'textarea',
          required: true,
          placeholder: 'What made you choose this path?',
        },
        {
          id: 'intuition_vs_analysis',
          label: 'Intuition or Analysis',
          type: 'select',
          required: false,
          options: ['Pure intuition', 'Mostly intuition', 'Balanced', 'Mostly analysis', 'Pure analysis'],
        },
        {
          id: 'reversibility',
          label: 'Can This Be Changed?',
          type: 'select',
          required: true,
          options: ['Easily reversible', 'Reversible with effort', 'Difficult to reverse', 'Final'],
        },
      ],
      sections: [
        { id: 'decision', title: 'Decision', fields: ['choice', 'reversibility'] },
        { id: 'reasoning', title: 'Reasoning', fields: ['alternatives', 'why_this', 'intuition_vs_analysis'] },
      ],
      validation: [
        { field: 'choice', rule: 'required', message: 'State the choice clearly' },
        { field: 'why_this', rule: 'required', message: 'Explain your reasoning' },
      ],
    },
    meaning_prompts: [
      'What does this choice say about your creative values?',
      'Will you remember why you made this choice in 6 months?',
    ],
    required_fields: ['choice', 'alternatives', 'why_this', 'reversibility'],
    optional_fields: ['intuition_vs_analysis'],
  },
  {
    id: 'version_snapshot',
    type: 'document',
    name: 'Version Snapshot',
    description: 'Capture a point in creative evolution',
    structure: {
      fields: [
        {
          id: 'version_name',
          label: 'Version Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., Draft 3 - After feedback',
        },
        {
          id: 'state_description',
          label: 'Current State',
          type: 'textarea',
          required: true,
          placeholder: 'Describe what exists at this point',
        },
        {
          id: 'changes_from_previous',
          label: 'Changes from Previous',
          type: 'textarea',
          required: false,
          placeholder: 'What changed since last version?',
        },
        {
          id: 'open_questions',
          label: 'Open Questions',
          type: 'textarea',
          required: false,
          placeholder: 'What are you still uncertain about?',
        },
        {
          id: 'gut_feeling',
          label: 'Gut Feeling',
          type: 'textarea',
          required: false,
          placeholder: 'How do you feel about this version?',
        },
      ],
      sections: [
        { id: 'version', title: 'Version', fields: ['version_name', 'state_description'] },
        { id: 'evolution', title: 'Evolution', fields: ['changes_from_previous', 'open_questions', 'gut_feeling'] },
      ],
      validation: [
        { field: 'version_name', rule: 'required', message: 'Name this version' },
        { field: 'state_description', rule: 'required', message: 'Describe the current state' },
      ],
    },
    meaning_prompts: [
      'What did you learn getting to this version?',
      'What would you tell your past self about this point?',
    ],
    required_fields: ['version_name', 'state_description'],
    optional_fields: ['changes_from_previous', 'open_questions', 'gut_feeling'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CONTRACTS
// ═══════════════════════════════════════════════════════════════════════════════

const CREATIVE_STUDIO_AGENTS: PackAgentContract[] = [
  {
    id: 'creative_companion',
    role_name: 'Creative Companion',
    description: 'Assists with creative reflection and documentation, never directs',
    allowed_actions: [
      'suggest_meaning_prompts',
      'summarize_thread_evolution',
      'identify_patterns_across_threads',
      'prepare_narrative_replay',
      'format_documentation',
      'organize_versions',
    ],
    forbidden_actions: [
      'generate_creative_content',
      'suggest_creative_directions',
      'evaluate_creative_quality',
      'compare_to_other_work',
      'recommend_changes',
      'optimize_anything',
      'auto_publish',
      'auto_share',
    ],
    required_approvals: [
      { action: 'share_to_collaborators', required_role: 'owner', timeout_action: 'block' },
      { action: 'archive_thread', required_role: 'owner', timeout_action: 'block' },
    ],
    learning_disabled: true,
    max_autonomy: 'minimal',
    trust_ceiling: 50,
    domain_constraints: [
      'Never judge creative work',
      'Never suggest what to create',
      'Only reflect, never direct',
      'Creativity belongs to human',
    ],
  },
  {
    id: 'narrative_curator',
    role_name: 'Narrative Curator',
    description: 'Prepares narrative replays without interpretation',
    allowed_actions: [
      'organize_timeline',
      'identify_key_moments',
      'prepare_visual_timeline',
      'link_related_threads',
      'surface_documented_meaning',
    ],
    forbidden_actions: [
      'interpret_creative_meaning',
      'add_narrative_commentary',
      'suggest_story_arcs',
      'evaluate_progress',
      'compare_timelines',
      'predict_outcomes',
    ],
    required_approvals: [
      { action: 'create_replay', required_role: 'owner', timeout_action: 'block' },
    ],
    learning_disabled: true,
    max_autonomy: 'minimal',
    trust_ceiling: 40,
    domain_constraints: [
      'Present facts, not interpretations',
      'Human interprets their own story',
      'No narrative suggestion',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// XR SPACES
// ═══════════════════════════════════════════════════════════════════════════════

const CREATIVE_STUDIO_XR: PackXRSpace[] = [
  {
    id: 'creative_reflection_room',
    type: 'meta_room',
    name: 'Creative Reflection Room',
    purpose: 'A calm space to reflect on creative journey',
    optional: true,
    configuration: {
      default_layout: 'organic',
      primitives: ['thread_path', 'version_node', 'meaning_field', 'boundary'],
      suggested_uses: [
        'Review creative evolution',
        'Find patterns in choices',
        'Connect disparate threads',
        'Prepare for new direction',
      ],
      ambient: {
        lighting: 'calm',
        audio: 'ambient',
      },
    },
    domain_primitives: [
      'inspiration_anchor',
      'version_timeline',
      'meaning_constellation',
    ],
  },
  {
    id: 'creative_replay_space',
    type: 'narrative_replay',
    name: 'Creative Journey Replay',
    purpose: 'Walk through the evolution of a creative work',
    optional: true,
    configuration: {
      default_layout: 'timeline',
      primitives: ['moment_node', 'evolution_path', 'choice_point', 'meaning_layer'],
      suggested_uses: [
        'Understand how a piece evolved',
        'See all versions in context',
        'Recall forgotten meaning',
        'Share creative story with others',
      ],
      ambient: {
        lighting: 'neutral',
        audio: 'minimal',
      },
    },
    domain_primitives: [
      'version_marker',
      'inspiration_moment',
      'pivot_point',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MEANING PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

const CREATIVE_STUDIO_MEANING: MeaningPrompt[] = [
  {
    id: 'initial_meaning',
    context: 'thread',
    question: 'What makes this creatively meaningful to you?',
    rationale: 'Meaning gives creative work persistence',
    examples: [
      'This explores a feeling I have never been able to articulate',
      'This connects to my cultural heritage',
      'This is an experiment I need to try to learn',
    ],
    required: true,
  },
  {
    id: 'choice_values',
    context: 'decision',
    question: 'What does this choice say about your creative values?',
    rationale: 'Choices reveal values over time',
    examples: [
      'I value authenticity over polish',
      'I am prioritizing clarity for the audience',
      'I am following my intuition even if risky',
    ],
    required: false,
  },
  {
    id: 'version_learning',
    context: 'snapshot',
    question: 'What did you learn getting to this version?',
    rationale: 'Learning is as valuable as the output',
    examples: [
      'Constraints can be liberating',
      'I work better with collaboration',
      'This direction was wrong but taught me something',
    ],
    required: false,
  },
  {
    id: 'reflection_insight',
    context: 'reflection',
    question: 'What insight are you taking from this reflection?',
    rationale: 'Reflection without insight is incomplete',
    examples: [
      'I need more unstructured time',
      'My best work comes from personal experience',
      'I should trust my first instinct more',
    ],
    required: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE PACK
// ═══════════════════════════════════════════════════════════════════════════════

export const CREATIVE_STUDIO_PACK: VerticalIndustryPack = {
  id: 'creative_studio',
  industry_name: 'Creative & Media',
  public_label: 'CHE·NU for Creative Studio',
  version: '1.0.0',
  
  domain_language_map: {
    terms: {
      'Decision': 'Creative Choice',
      'Thread': 'Creative Thread',
      'Space': 'Studio',
      'Snapshot': 'Version',
      'Reflection': 'Creative Review',
      'Agent': 'Companion',
      'XR Room': 'Reflection Space',
    },
    descriptions: {
      'Creative Choice': 'A documented creative direction or choice',
      'Creative Thread': 'Evolution of creative ideas over time',
      'Studio': 'A focused creative workspace',
      'Version': 'A captured point in creative evolution',
      'Creative Review': 'Time for creative reflection',
      'Companion': 'AI that reflects, never directs',
    },
    examples: {
      'Creative Choice': ['Color palette', 'Narrative direction', 'Visual style'],
      'Creative Thread': ['Character development', 'Brand evolution', 'Story arc'],
      'Version': ['Draft 1', 'After feedback', 'Final candidate'],
    },
  },
  
  enabled_spheres: CREATIVE_STUDIO_SPHERES,
  templates: CREATIVE_STUDIO_TEMPLATES,
  agent_contracts: CREATIVE_STUDIO_AGENTS,
  xr_spaces: CREATIVE_STUDIO_XR,
  meaning_prompts: CREATIVE_STUDIO_MEANING,
  
  compliance_notes: [
    'Creative work ownership remains with human creator',
    'AI companions do not generate creative content',
    'All versions and evolution are traced to human decisions',
    'No optimization or engagement metrics',
  ],
  
  metadata: {
    created_at: '2025-12-29',
    updated_at: '2025-12-29',
    author: 'CHE·NU Foundation',
    license: 'CHE·NU Pack License',
    compatible_with: 'V51',
    tags: ['creative', 'writing', 'design', 'media', 'narrative'],
    description: 'CHE·NU configured for creative workflows with emphasis on meaning, narrative replay, and creative thread evolution.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default CREATIVE_STUDIO_PACK;
