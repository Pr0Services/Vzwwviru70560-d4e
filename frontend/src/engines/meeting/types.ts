/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — MEETING ENGINE TYPES                                  ║
 * ║              Complete Type Definitions                                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Meetings are KNOWLEDGE EVENTS that generate structured, actionable,        ║
 * ║   and replayable artifacts."                                                 ║
 * ║  "Every meeting becomes a permanent contribution to the knowledge base."     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export type MeetingType = 
  | 'standard'        // General collaboration
  | 'standup'         // Quick team sync (15 min)
  | 'project_review'  // Comprehensive project assessment
  | 'multi_domain'    // Cross-functional collaboration
  | 'xr_spatial'      // Immersive XR environment
  | 'asynchronous';   // Structured async collaboration

export type MeetingStatus = 
  | 'draft'           // Being configured
  | 'scheduled'       // Confirmed and upcoming
  | 'preparing'       // Pre-meeting prep active
  | 'in_progress'     // Currently happening
  | 'concluding'      // Wrapping up
  | 'completed'       // Finished
  | 'cancelled'       // Cancelled
  | 'archived';       // Long-term storage

export type MeetingPhase = 
  | 'initiation'      // Phase 1: User request, context determination
  | 'preparation'     // Phase 2: Material assembly, agenda
  | 'execution'       // Phase 3: Active meeting
  | 'conclusion'      // Phase 4: Summary, confirmation
  | 'integration'     // Phase 5: Task routing, decision integration
  | 'follow_up';      // Phase 6: Progress monitoring

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICIPANT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ParticipantRole = 
  | 'organizer'       // Meeting creator/owner
  | 'required'        // Must attend
  | 'optional'        // May attend
  | 'presenter'       // Will present content
  | 'observer'        // View only
  | 'agent';          // AI participant

export type ParticipantStatus = 
  | 'pending'         // Awaiting response
  | 'accepted'        // Will attend
  | 'declined'        // Cannot attend
  | 'tentative'       // May attend
  | 'attended'        // Was present
  | 'absent';         // Did not attend

export interface MeetingParticipant {
  id: string;
  user_id?: string;       // For human participants
  agent_id?: string;      // For AI agents
  name: string;
  email?: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  is_agent: boolean;
  
  // During meeting
  joined_at?: string;
  left_at?: string;
  speaking_time_seconds?: number;
  contributions_count?: number;
  
  // Consent
  recording_consent?: boolean;
  consent_timestamp?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENDA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  presenter_id?: string;
  order: number;
  
  // Execution tracking
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  actual_start?: string;
  actual_end?: string;
  actual_duration_minutes?: number;
  
  // Related content
  attached_documents: string[];
  related_decisions: string[];
  related_tasks: string[];
  
  // Notes
  discussion_notes?: string;
}

export interface MeetingAgenda {
  items: AgendaItem[];
  total_planned_minutes: number;
  auto_generated_items: AgendaItem[];
  agent_suggested_items: AgendaItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTES & TRANSCRIPT
// ═══════════════════════════════════════════════════════════════════════════════

export interface TranscriptSegment {
  id: string;
  speaker_id: string;
  speaker_name: string;
  text: string;
  start_time: string;
  end_time: string;
  confidence: number;
  language: string;
  
  // Analysis
  sentiment?: 'positive' | 'neutral' | 'negative';
  is_decision_related?: boolean;
  is_task_related?: boolean;
  topics?: string[];
}

export interface MeetingNotes {
  raw_transcript: TranscriptSegment[];
  
  // Structured
  structured_notes: string;
  topic_summaries: Array<{
    topic: string;
    summary: string;
    speakers: string[];
    key_points: string[];
  }>;
  
  // Per speaker
  speaker_contributions: Array<{
    speaker_id: string;
    speaker_name: string;
    total_speaking_time_seconds: number;
    key_points: string[];
    questions_raised: string[];
  }>;
  
  // Highlights
  key_moments: Array<{
    timestamp: string;
    type: 'decision' | 'action' | 'question' | 'insight' | 'concern';
    content: string;
    speaker_id: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECISIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type DecisionStatus = 
  | 'proposed'        // Under discussion
  | 'confirmed'       // Agreed upon
  | 'pending_approval'// Needs higher approval
  | 'approved'        // Fully approved
  | 'rejected'        // Not approved
  | 'deferred'        // Postponed
  | 'implemented';    // Carried out

export interface MeetingDecision {
  id: string;
  meeting_id: string;
  
  // Content
  title: string;
  description: string;
  rationale?: string;
  
  // Context
  agenda_item_id?: string;
  related_thread_id?: string;
  
  // Stakeholders
  proposed_by: string;
  approved_by: string[];
  affected_participants: string[];
  
  // Status
  status: DecisionStatus;
  
  // Timestamps
  proposed_at: string;
  confirmed_at?: string;
  
  // Implementation
  implementation_tasks: string[];
  deadline?: string;
  
  // Conflicts
  conflicts_with?: string[]; // Previous decision IDs
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingTask {
  id: string;
  meeting_id: string;
  
  // Content
  title: string;
  description?: string;
  
  // Assignment
  assigned_to: string;
  assigned_to_name: string;
  assigned_by?: string;
  
  // Timing
  deadline?: string;
  estimated_hours?: number;
  
  // Priority
  priority: 'urgent' | 'high' | 'normal' | 'low';
  
  // Context
  agenda_item_id?: string;
  decision_id?: string;
  source_transcript_id?: string;
  
  // Routing
  target_dataspace_id?: string;
  target_domain?: string;
  
  // Dependencies
  dependencies: string[];
  blocks: string[];
  
  // Status
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
  acknowledged_at?: string;
  completed_at?: string;
  
  // Extraction metadata
  extraction_confidence: number;
  manually_confirmed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingSummaries {
  micro: string;          // 1-2 sentences
  executive: string;      // 1 paragraph
  technical?: string;     // Technical decisions
  task_summary: string;   // Action items focus
  risk_summary?: string;  // Risks identified
  decision_summary: string; // All decisions
  
  generated_at: string;
  generator_version: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECORDINGS & XR
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingRecording {
  id: string;
  type: 'audio' | 'video' | 'xr_session';
  
  // File info
  file_url: string;
  file_size_bytes: number;
  duration_seconds: number;
  format: string;
  
  // Processing
  transcript_url?: string;
  indexed: boolean;
  searchable: boolean;
  
  // Consent
  consent_given_by: string[];
  
  // Created
  created_at: string;
}

export interface XRMeetingSpace {
  id: string;
  environment_type: string;
  
  // Configuration
  spatial_audio: boolean;
  max_participants: number;
  
  // Objects
  placed_objects: Array<{
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    annotations: string[];
  }>;
  
  // Annotations
  spatial_annotations: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    content: string;
    created_by: string;
    created_at: string;
  }>;
  
  // Snapshots
  scene_snapshots: Array<{
    id: string;
    timestamp: string;
    screenshot_url: string;
    description: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOLLOW-UP
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingFollowUp {
  triggered_workflows: Array<{
    workflow_id: string;
    trigger_reason: string;
    triggered_at: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
  }>;
  
  scheduled_followups: Array<{
    id: string;
    type: 'meeting' | 'task_review' | 'decision_review';
    scheduled_for: string;
    description: string;
  }>;
  
  pending_actions: Array<{
    id: string;
    description: string;
    owner_id: string;
    due_date?: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  
  completion_tracking: {
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    total_decisions: number;
    implemented_decisions: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CONTRIBUTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentContribution {
  agent_id: string;
  agent_name: string;
  contribution_type: 'context' | 'suggestion' | 'analysis' | 'action' | 'summary';
  content: string;
  timestamp: string;
  relevance_score?: number;
  user_feedback?: 'helpful' | 'not_helpful';
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingGovernance {
  // Permissions
  can_record: boolean;
  can_share_externally: boolean;
  requires_consent: boolean;
  
  // Consent records
  consent_records: Array<{
    participant_id: string;
    consent_type: 'recording' | 'sharing' | 'ai_processing';
    granted: boolean;
    timestamp: string;
  }>;
  
  // Audit trail
  audit_trail: Array<{
    action: string;
    actor_id: string;
    timestamp: string;
    details?: unknown;
  }>;
  
  // Retention
  retention_policy: {
    retain_until?: string;
    auto_archive_after_days: number;
    auto_delete_after_days?: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN MEETING INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface Meeting {
  id: string;
  dataspace_id: string;  // Meeting as DataSpace
  
  // Basic info
  title: string;
  description?: string;
  type: MeetingType;
  status: MeetingStatus;
  phase: MeetingPhase;
  
  // Timing
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  duration_minutes: number;
  timezone: string;
  
  // Context
  sphere_id: string;
  domain_ids: string[];
  project_id?: string;
  related_thread_ids: string[];
  related_dataspace_ids: string[];
  previous_meeting_id?: string;
  
  // Participants
  participants: MeetingParticipant[];
  organizer_id: string;
  
  // Content
  agenda: MeetingAgenda;
  notes: MeetingNotes;
  decisions: MeetingDecision[];
  tasks: MeetingTask[];
  summaries?: MeetingSummaries;
  
  // Media
  recordings: MeetingRecording[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploaded_by: string;
    uploaded_at: string;
  }>;
  
  // XR (if applicable)
  xr_space?: XRMeetingSpace;
  
  // Follow-up
  follow_up: MeetingFollowUp;
  
  // Agent contributions
  agent_contributions: AgentContribution[];
  
  // Governance
  governance: MeetingGovernance;
  
  // Metadata
  created_at: string;
  created_by: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATION & QUERY
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingCreationRequest {
  title: string;
  description?: string;
  type: MeetingType;
  
  // Timing
  scheduled_start: string;
  scheduled_end: string;
  timezone?: string;
  
  // Context
  sphere_id: string;
  domain_ids?: string[];
  project_id?: string;
  related_thread_ids?: string[];
  
  // Participants
  participant_ids: string[];
  
  // Agenda
  agenda_items?: Array<{
    title: string;
    description?: string;
    duration_minutes: number;
    presenter_id?: string;
  }>;
  
  // Options
  enable_recording?: boolean;
  enable_xr?: boolean;
  xr_environment?: string;
  
  // Recurrence
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    end_date?: string;
    occurrences?: number;
  };
}

export interface MeetingQuery {
  sphere_id?: string;
  domain_id?: string;
  project_id?: string;
  type?: MeetingType;
  status?: MeetingStatus;
  participant_id?: string;
  organizer_id?: string;
  
  scheduled_after?: string;
  scheduled_before?: string;
  
  search_text?: string;
  
  limit?: number;
  offset?: number;
  sort_by?: 'scheduled_start' | 'created_at' | 'title';
  sort_order?: 'asc' | 'desc';
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDUP SPECIFIC
// ═══════════════════════════════════════════════════════════════════════════════

export interface StandupEntry {
  participant_id: string;
  participant_name: string;
  
  progress: string[];      // What I did
  plans: string[];         // What I'll do
  blockers: string[];      // What's blocking me
  
  submitted_at: string;
}

export interface StandupMeetingExtras {
  entries: StandupEntry[];
  team_health_score?: number;
  blocker_count: number;
  blockers_resolved_count: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC MEETING SPECIFIC
// ═══════════════════════════════════════════════════════════════════════════════

export interface AsyncContributionWindow {
  id: string;
  title: string;
  description?: string;
  opens_at: string;
  closes_at: string;
  required_participants: string[];
}

export interface AsyncContribution {
  id: string;
  window_id: string;
  participant_id: string;
  content: string;
  attachments: string[];
  submitted_at: string;
}

export interface AsyncMeetingExtras {
  contribution_windows: AsyncContributionWindow[];
  contributions: AsyncContribution[];
  synthesis_documents: Array<{
    id: string;
    window_id: string;
    content: string;
    generated_at: string;
  }>;
  decision_points: Array<{
    id: string;
    question: string;
    options: string[];
    votes: Map<string, string>;
    resolved: boolean;
    resolution?: string;
  }>;
}
