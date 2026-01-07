// CHE·NU™ Collaboration Space Types
// Business Sphere → Project → Collaboration

// ============================================================
// COLLABORATION SPACE
// ============================================================

export type CollaborationSection = 
  | 'overview'
  | 'meetings'
  | 'working-sessions'
  | 'notes-decisions'
  | 'vision-principles';

export interface CollaborationSectionConfig {
  id: CollaborationSection;
  name: string;
  icon: string;
  description: string;
}

export const COLLABORATION_SECTIONS: CollaborationSectionConfig[] = [
  { id: 'overview', name: 'Overview', icon: '🏠', description: 'Contexte rapide et statut' },
  { id: 'meetings', name: 'Meetings', icon: '📅', description: 'Décisions synchrones' },
  { id: 'working-sessions', name: 'Working Sessions', icon: '🛠️', description: 'Travail réel' },
  { id: 'notes-decisions', name: 'Notes & Decisions', icon: '📋', description: 'Mémoire collective' },
  { id: 'vision-principles', name: 'Vision & Principles', icon: '🎯', description: 'Stabilité idéologique' },
];

// ============================================================
// COLLABORATORS & INVITATIONS
// ============================================================

export type CollaboratorRole = 'observer' | 'contributor' | 'facilitator';

export interface Collaborator {
  id: string;
  user_id: string | null; // null si invitation en attente
  email: string;
  name: string;
  avatar_url: string | null;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  invited_at: string;
  joined_at: string | null;
  invited_by: string;
}

export type CollaboratorStatus = 'pending' | 'active' | 'declined' | 'removed';

export interface CollaborationInvite {
  id: string;
  collaboration_id: string;
  email: string;
  role: CollaboratorRole;
  message: string | null;
  token: string;
  expires_at: string;
  created_at: string;
  created_by: string;
}

export const COLLABORATOR_ROLE_CONFIG: Record<CollaboratorRole, { name: string; description: string; color: string }> = {
  observer: { 
    name: 'Observer', 
    description: 'Peut voir tout le contenu', 
    color: '#6B7280' 
  },
  contributor: { 
    name: 'Contributor', 
    description: 'Peut participer et écrire', 
    color: '#3B82F6' 
  },
  facilitator: { 
    name: 'Facilitator', 
    description: 'Peut créer meetings et valider décisions', 
    color: '#D8B26A' 
  },
};

// ============================================================
// MEETINGS
// ============================================================

export interface CollaborationMeeting {
  id: string;
  collaboration_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: MeetingStatus;
  context: string | null;
  agenda: MeetingAgendaItem[];
  notes: string;
  decisions: MeetingDecision[];
  action_items: ActionItem[];
  participants: MeetingParticipant[];
  created_by: string;
  created_at: string;
}

export type MeetingStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface MeetingAgendaItem {
  id: string;
  title: string;
  duration_minutes: number;
  presenter: string | null;
  completed: boolean;
}

export interface MeetingDecision {
  id: string;
  meeting_id: string;
  title: string;
  description: string;
  decided_at: string;
  decided_by: string[];
}

export interface MeetingParticipant {
  user_id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'attended';
}

// ============================================================
// WORKING SESSIONS
// ============================================================

export interface WorkingSession {
  id: string;
  collaboration_id: string;
  title: string;
  goal: string;
  scope: string;
  status: WorkingSessionStatus;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  participants: string[];
  work_notes: string;
  outputs: WorkingSessionOutput[];
  created_by: string;
  created_at: string;
}

export type WorkingSessionStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export interface WorkingSessionOutput {
  id: string;
  session_id: string;
  title: string;
  type: 'document' | 'code' | 'design' | 'decision' | 'other';
  url: string | null;
  description: string;
  created_at: string;
}

// ============================================================
// NOTES & DECISIONS
// ============================================================

export interface CollaborationNote {
  id: string;
  collaboration_id: string;
  category: NoteCategory;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type NoteCategory = 'decision' | 'design_choice' | 'rejected_option' | 'open_question' | 'general';

export const NOTE_CATEGORY_CONFIG: Record<NoteCategory, { name: string; icon: string; color: string }> = {
  decision: { name: 'Decision', icon: '✅', color: '#10B981' },
  design_choice: { name: 'Design Choice', icon: '🎨', color: '#8B5CF6' },
  rejected_option: { name: 'Rejected Option', icon: '❌', color: '#EF4444' },
  open_question: { name: 'Open Question', icon: '❓', color: '#F59E0B' },
  general: { name: 'General Note', icon: '📝', color: '#6B7280' },
};

// ============================================================
// VISION & PRINCIPLES
// ============================================================

export interface VisionDocument {
  id: string;
  collaboration_id: string;
  section: VisionSection;
  content: string;
  last_updated_by: string;
  updated_at: string;
}

export type VisionSection = 'mission' | 'values' | 'design_principles' | 'ethical_boundaries' | 'non_negotiables';

export const VISION_SECTIONS: { id: VisionSection; name: string; icon: string; description: string }[] = [
  { id: 'mission', name: 'Mission', icon: '🎯', description: 'Pourquoi on existe' },
  { id: 'values', name: 'Values', icon: '💎', description: 'Ce qui nous guide' },
  { id: 'design_principles', name: 'Design Principles', icon: '📐', description: 'Comment on construit' },
  { id: 'ethical_boundaries', name: 'Ethical Boundaries', icon: '🛡️', description: 'Nos lignes rouges' },
  { id: 'non_negotiables', name: 'Non-Negotiables', icon: '🔒', description: 'Ce qui ne change jamais' },
];

// ============================================================
// ACTION ITEMS
// ============================================================

export interface ActionItem {
  id: string;
  source_type: 'meeting' | 'session' | 'note';
  source_id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
  due_date: string | null;
  status: ActionItemStatus;
  created_at: string;
  completed_at: string | null;
}

export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// ============================================================
// COLLABORATION SPACE (MAIN)
// ============================================================

export interface CollaborationSpace {
  id: string;
  project_id: string; // Lié à un projet Business
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'archived';
  owner_id: string;
  collaborators: Collaborator[];
  created_at: string;
  updated_at: string;
  
  // Stats
  meetings_count: number;
  sessions_count: number;
  decisions_count: number;
  next_meeting: CollaborationMeeting | null;
}

// ============================================================
// AGENT RESTRICTIONS (IMPORTANT!)
// ============================================================

export const COLLABORATION_AGENT_RULES = {
  // Agents désactivés par défaut
  default_enabled: false,
  
  // Actions autorisées
  allowed_actions: [
    'take_notes',        // Prise de notes automatique
    'summarize',         // Résumés
    'remind_decisions',  // Rappel de décisions passées
  ],
  
  // Actions INTERDITES
  forbidden_actions: [
    'make_decisions',        // Jamais décider
    'send_external_messages', // Jamais envoyer de messages
    'modify_vision',         // Ne pas toucher à Vision & Principles
    'invite_collaborators',  // Seul humain peut inviter
  ],
} as const;
