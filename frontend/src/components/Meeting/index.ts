/**
 * CHE·NU™ Meeting Module
 * Complete meeting system with agents, notes, tasks, XR support
 * 
 * @module meeting
 * @version 33.0
 */

export { default as MeetingRoom } from './MeetingRoom';

// Types
export type MeetingType = 'standard' | 'standup' | 'brainstorm' | 'review' | 'planning' | 'xr';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ParticipantRole = 'organizer' | 'presenter' | 'participant' | 'observer';
export type RsvpStatus = 'pending' | 'accepted' | 'declined' | 'tentative';
export type NoteType = 'note' | 'decision' | 'action' | 'question';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  rsvpStatus: RsvpStatus;
  avatar?: string;
  isAgent?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  presenter?: string;
  notes?: string;
  completed: boolean;
}

export interface MeetingNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  type: NoteType;
}

export interface MeetingTask {
  id: string;
  title: string;
  assignee: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: MeetingType;
  status: MeetingStatus;
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  isXrMeeting: boolean;
  participants: MeetingParticipant[];
  agenda: AgendaItem[];
  notes: MeetingNote[];
  tasks: MeetingTask[];
  sphereId: string;
  dataspaceId?: string;
}

// Constants
export const MEETING_TYPES = {
  standard: { label: 'Standard', icon: '📋' },
  standup: { label: 'Stand-up', icon: '🧍' },
  brainstorm: { label: 'Brainstorm', icon: '💡' },
  review: { label: 'Revue', icon: '🔍' },
  planning: { label: 'Planification', icon: '📅' },
  xr: { label: 'XR/Immersif', icon: '🥽' },
} as const;

export const NOTE_TYPES = {
  note: { label: 'Note', color: 'slate' },
  decision: { label: 'Décision', color: 'emerald' },
  action: { label: 'Action', color: 'amber' },
  question: { label: 'Question', color: 'blue' },
} as const;
