/**
 * CHE·NU™ Knowledge Threads - Type Definitions
 * 
 * A Knowledge Thread is a persistent, human-recognized semantic thread
 * that links heterogeneous elements across CHE·NU into a coherent line
 * of meaning.
 * 
 * Position: Mega-Tree → Meta Layer → Knowledge Threads
 * 
 * Key Principles:
 * - Threads DO NOT own content, they reference it
 * - Threads DO NOT act, they contextualize
 * - No silent thread creation
 * - No hidden semantic inference
 * - Human remains the authority on "what this is about"
 * 
 * @version 1.0.0
 * @module knowledge-threads
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Thread status lifecycle
 */
export type ThreadStatus = 'active' | 'dormant' | 'closed';

/**
 * Thread visibility scope
 */
export type VisibilityScope = 'private' | 'shared' | 'my_team';

/**
 * Explicit link types - Every link MUST declare its nature
 * No implicit semantics. No inferred meaning without declaration.
 */
export type LinkType =
  | 'ORIGIN'        // Where this thread started
  | 'CONTEXT'       // Background/situational information
  | 'DECISION'      // A decision point
  | 'CONSEQUENCE'   // Result of a decision
  | 'QUESTION'      // Open question
  | 'EXPLORATION'   // Investigation/research
  | 'METHOD_USED'   // How something was done
  | 'SNAPSHOT'      // Point-in-time capture
  | 'REFLECTION'    // Human insight/thinking
  | 'RESOLUTION';   // Answered question/closed loop

/**
 * Entity types that can be linked to threads
 */
export type LinkedEntityType =
  | 'note'
  | 'memory'
  | 'decision'
  | 'meeting'
  | 'task'
  | 'agent'
  | 'method'
  | 'snapshot'
  | 'document'
  | 'xr_session'
  | 'thread'        // Threads can reference other threads
  | 'rnd_project'   // R&D Workspace projects
  | 'dataspace'     // DataSpace nodes
  | 'external';     // External references

/**
 * Agent role within a thread
 */
export type AgentRoleInThread =
  | 'advisor'       // Provides guidance
  | 'analyst'       // Analyzes content
  | 'summarizer'    // Creates summaries
  | 'monitor'       // Watches for changes
  | 'contributor';  // Contributes content

/**
 * Timeline event types
 */
export type TimelineEventType =
  | 'created'
  | 'linked'
  | 'unlinked'
  | 'status_changed'
  | 'agent_suggested'
  | 'human_reflected'
  | 'snapshot_taken'
  | 'decision_made'
  | 'question_raised'
  | 'question_resolved';

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * A linked entity reference
 */
export interface LinkedEntity {
  id: string;
  entity_type: LinkedEntityType;
  entity_id: string;
  link_type: LinkType;
  timestamp: string;
  linked_by: string;           // User ID who created the link
  reason?: string;             // Why this was linked
  display_title?: string;      // Cached display title
  sphere_origin?: string;      // Which sphere this came from
  is_resolved?: boolean;       // For QUESTION type
  metadata?: Record<string, unknown>;
}

/**
 * An agent linked to a thread
 */
export interface LinkedAgent {
  id: string;
  agent_id: string;
  agent_name: string;
  role_in_thread: AgentRoleInThread;
  linked_at: string;
  linked_by: string;
  permissions: AgentThreadPermissions;
  last_activity?: string;
  contribution_count?: number;
}

/**
 * Agent permissions within a thread (restrictive by design)
 */
export interface AgentThreadPermissions {
  can_read: boolean;
  can_suggest_links: boolean;
  can_summarize: boolean;
  can_highlight_inconsistencies: boolean;
  // Agents MAY NOT: close threads, redefine meaning, change ownership, remove links
}

/**
 * A snapshot linked to a thread
 */
export interface LinkedSnapshot {
  id: string;
  snapshot_id: string;
  title: string;
  created_at: string;
  created_by: string;
  description?: string;
  entity_count: number;        // How many entities captured
  preview?: string;            // Brief preview text
}

/**
 * A decision linked to a thread
 */
export interface LinkedDecision {
  id: string;
  decision_id: string;
  title: string;
  made_at: string;
  made_by: string;
  outcome?: string;
  rationale?: string;
  is_superseded?: boolean;
  superseded_by?: string;
}

/**
 * Timeline event within a thread
 */
export interface ThreadTimelineEvent {
  id: string;
  event_type: TimelineEventType;
  timestamp: string;
  actor_type: 'human' | 'agent' | 'system';
  actor_id: string;
  actor_name: string;
  description: string;
  entity_reference?: {
    type: LinkedEntityType;
    id: string;
    title: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Creation context - Why this thread was created
 */
export interface ThreadCreationContext {
  trigger: 'user_explicit' | 'agent_suggestion_confirmed';
  reason: string;
  initial_entities?: string[];  // Entity IDs that started this
  suggested_by_agent?: string;  // If agent suggested
  confirmation_timestamp?: string;
}

/**
 * Unresolved element within a thread
 */
export interface UnresolvedElement {
  id: string;
  type: 'question' | 'decision' | 'exploration';
  title: string;
  raised_at: string;
  raised_by: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  entity_id?: string;          // Related linked entity
}

// ============================================================================
// MAIN THREAD INTERFACE
// ============================================================================

/**
 * The Knowledge Thread - Core data model
 */
export interface KnowledgeThread {
  // Identity
  id: string;
  title: string;
  description?: string;
  
  // Ownership & Access
  owner: string;               // Single human owner
  owner_name?: string;         // Display name
  visibility_scope: VisibilityScope;
  shared_with?: string[];      // User IDs if shared
  
  // Lifecycle
  status: ThreadStatus;
  created_at: string;
  creation_context: ThreadCreationContext;
  updated_at: string;
  last_activity_at: string;
  closed_at?: string;
  closed_reason?: string;
  
  // Core collections
  linked_entities: LinkedEntity[];
  agents_linked: LinkedAgent[];
  snapshots_linked: LinkedSnapshot[];
  decisions_linked: LinkedDecision[];
  
  // Timeline
  timeline: ThreadTimelineEvent[];
  
  // Computed/cached
  entity_count: number;
  unresolved_count: number;
  sphere_coverage: string[];   // Which spheres are touched
  activity_level: 'high' | 'medium' | 'low' | 'dormant';
  
  // Metadata
  tags?: string[];
  color?: string;              // Visual identifier
  icon?: string;               // Emoji or icon
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AGENT SUGGESTION INTERFACES
// ============================================================================

/**
 * Agent suggestion for thread linking
 */
export interface AgentThreadSuggestion {
  id: string;
  suggestion_type: 'link_existing' | 'create_new';
  agent_id: string;
  agent_name: string;
  timestamp: string;
  
  // For existing thread
  target_thread_id?: string;
  target_thread_title?: string;
  
  // For new thread
  suggested_title?: string;
  suggested_description?: string;
  
  // The entity being suggested
  entity: {
    type: LinkedEntityType;
    id: string;
    title: string;
  };
  
  // Explanation (required)
  reason: string;
  confidence: number;          // 0-1
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  user_response_at?: string;
  user_response_reason?: string;
}

/**
 * Agent analysis of thread state
 */
export interface ThreadAnalysis {
  thread_id: string;
  analyzed_at: string;
  agent_id: string;
  
  // Summary
  summary: string;
  key_themes: string[];
  
  // Health indicators
  inconsistencies: Array<{
    description: string;
    severity: 'low' | 'medium' | 'high';
    related_entities: string[];
  }>;
  
  // Observations
  drift_detected: boolean;     // Thread seems to be changing topic
  drift_description?: string;
  
  forgotten_elements: Array<{
    entity_id: string;
    entity_title: string;
    last_referenced: string;
    suggestion: string;
  }>;
  
  unresolved_questions: UnresolvedElement[];
  
  // Suggestions
  suggested_actions: Array<{
    action: string;
    reason: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

// ============================================================================
// UI STATE INTERFACES
// ============================================================================

/**
 * Thread view filters
 */
export interface ThreadViewFilters {
  entity_types: LinkedEntityType[];
  link_types: LinkType[];
  date_range?: {
    start: string;
    end: string;
  };
  show_resolved: boolean;
  spheres: string[];
  search_query?: string;
}

/**
 * Thread list view state
 */
export interface ThreadListState {
  threads: KnowledgeThread[];
  loading: boolean;
  error: string | null;
  
  // Filters
  status_filter: ThreadStatus | 'all';
  visibility_filter: VisibilityScope | 'all';
  sort_by: 'recent' | 'created' | 'activity' | 'name';
  sort_order: 'asc' | 'desc';
  search_query: string;
  
  // Pagination
  page: number;
  page_size: number;
  total_count: number;
}

/**
 * Single thread view state
 */
export interface ThreadViewState {
  thread: KnowledgeThread | null;
  loading: boolean;
  error: string | null;
  
  // View mode
  view_mode: 'timeline' | 'entities' | 'graph' | 'summary';
  
  // Filters
  filters: ThreadViewFilters;
  
  // Selection
  selected_entity_id: string | null;
  
  // Panel states
  agent_panel_open: boolean;
  link_panel_open: boolean;
  
  // Pending suggestions
  pending_suggestions: AgentThreadSuggestion[];
}

/**
 * Thread creation form state
 */
export interface ThreadCreationForm {
  title: string;
  description: string;
  visibility_scope: VisibilityScope;
  initial_entities: Array<{
    type: LinkedEntityType;
    id: string;
    title: string;
    link_type: LinkType;
  }>;
  color?: string;
  icon?: string;
  tags: string[];
}

// ============================================================================
// ACTION INTERFACES
// ============================================================================

/**
 * Link entity action
 */
export interface LinkEntityAction {
  thread_id: string;
  entity_type: LinkedEntityType;
  entity_id: string;
  link_type: LinkType;
  reason?: string;
  user_id: string;
}

/**
 * Unlink entity action
 */
export interface UnlinkEntityAction {
  thread_id: string;
  linked_entity_id: string;
  reason: string;
  user_id: string;
}

/**
 * Thread update action
 */
export interface UpdateThreadAction {
  thread_id: string;
  updates: Partial<Pick<KnowledgeThread, 
    'title' | 'description' | 'status' | 'visibility_scope' | 
    'tags' | 'color' | 'icon'
  >>;
  user_id: string;
  reason?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Link type metadata for display
 */
export const LINK_TYPE_META: Record<LinkType, {
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  ORIGIN: {
    label: 'Origine',
    icon: '🌱',
    color: '#22C55E',
    description: 'Point de départ de ce fil',
  },
  CONTEXT: {
    label: 'Contexte',
    icon: '📋',
    color: '#3B82F6',
    description: 'Information de fond',
  },
  DECISION: {
    label: 'Décision',
    icon: '⚖️',
    color: '#D4AF37',
    description: 'Point de décision',
  },
  CONSEQUENCE: {
    label: 'Conséquence',
    icon: '➡️',
    color: '#F97316',
    description: 'Résultat d\'une décision',
  },
  QUESTION: {
    label: 'Question',
    icon: '❓',
    color: '#8B5CF6',
    description: 'Question ouverte',
  },
  EXPLORATION: {
    label: 'Exploration',
    icon: '🔍',
    color: '#EC4899',
    description: 'Investigation/recherche',
  },
  METHOD_USED: {
    label: 'Méthode',
    icon: '🔧',
    color: '#6B7280',
    description: 'Comment quelque chose a été fait',
  },
  SNAPSHOT: {
    label: 'Snapshot',
    icon: '📸',
    color: '#14B8A6',
    description: 'Capture à un instant T',
  },
  REFLECTION: {
    label: 'Réflexion',
    icon: '💭',
    color: '#A855F7',
    description: 'Insight humain',
  },
  RESOLUTION: {
    label: 'Résolution',
    icon: '✅',
    color: '#10B981',
    description: 'Question résolue / boucle fermée',
  },
};

/**
 * Entity type metadata for display
 */
export const ENTITY_TYPE_META: Record<LinkedEntityType, {
  label: string;
  icon: string;
  color: string;
}> = {
  note: { label: 'Note', icon: '📝', color: '#3B82F6' },
  memory: { label: 'Mémoire', icon: '🧠', color: '#8B5CF6' },
  decision: { label: 'Décision', icon: '⚖️', color: '#D4AF37' },
  meeting: { label: 'Meeting', icon: '👥', color: '#22C55E' },
  task: { label: 'Tâche', icon: '✓', color: '#F97316' },
  agent: { label: 'Agent', icon: '🤖', color: '#EC4899' },
  method: { label: 'Méthode', icon: '🔧', color: '#6B7280' },
  snapshot: { label: 'Snapshot', icon: '📸', color: '#14B8A6' },
  document: { label: 'Document', icon: '📄', color: '#64748B' },
  xr_session: { label: 'Session XR', icon: '🥽', color: '#06B6D4' },
  thread: { label: 'Thread', icon: '🧵', color: '#A855F7' },
  rnd_project: { label: 'Projet R&D', icon: '🔬', color: '#EF4444' },
  dataspace: { label: 'DataSpace', icon: '📦', color: '#84CC16' },
  external: { label: 'Externe', icon: '🔗', color: '#78716C' },
};

/**
 * Thread status metadata
 */
export const THREAD_STATUS_META: Record<ThreadStatus, {
  label: string;
  icon: string;
  color: string;
}> = {
  active: { label: 'Actif', icon: '🟢', color: '#22C55E' },
  dormant: { label: 'Dormant', icon: '🟡', color: '#EAB308' },
  closed: { label: 'Fermé', icon: '⚫', color: '#6B7280' },
};

/**
 * Design system colors
 */
export const THREAD_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  obsidianBlack: '#0A0A0B',
  templeWhite: '#FAF9F6',
  nightSlate: '#1E1F22',
  deepBlue: '#1E3A5F',
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Thread summary for list views
 */
export type ThreadSummary = Pick<KnowledgeThread, 
  'id' | 'title' | 'description' | 'status' | 'owner' | 'owner_name' |
  'created_at' | 'last_activity_at' | 'entity_count' | 'unresolved_count' |
  'activity_level' | 'color' | 'icon' | 'sphere_coverage'
>;

/**
 * Thread with analysis
 */
export interface ThreadWithAnalysis extends KnowledgeThread {
  latest_analysis?: ThreadAnalysis;
}

/**
 * Navigation context when entering a thread
 */
export interface ThreadNavigationContext {
  from_entity?: {
    type: LinkedEntityType;
    id: string;
    title: string;
  };
  from_sphere?: string;
  highlight_entity_id?: string;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default thread creation form values
 */
export const DEFAULT_THREAD_FORM: ThreadCreationForm = {
  title: '',
  description: '',
  visibility_scope: 'private',
  initial_entities: [],
  tags: [],
};

/**
 * Default view filters
 */
export const DEFAULT_VIEW_FILTERS: ThreadViewFilters = {
  entity_types: [],
  link_types: [],
  show_resolved: true,
  spheres: [],
};

/**
 * Default agent permissions (restrictive)
 */
export const DEFAULT_AGENT_PERMISSIONS: AgentThreadPermissions = {
  can_read: true,
  can_suggest_links: true,
  can_summarize: true,
  can_highlight_inconsistencies: true,
};
