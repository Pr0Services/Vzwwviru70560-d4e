/**
 * CHE·NU™ - MEETING STORE
 * 
 * Meeting System - part of the 10 BUREAU sections
 * Meetings can span across spheres and integrate with threads
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Meeting {
  id: string;
  title: string;
  description: string;
  sphereId: SphereId;
  
  // Scheduling
  startTime: string;
  endTime: string;
  timezone: string;
  recurrence?: MeetingRecurrence;
  
  // Participants
  organizerId: string;
  attendees: Attendee[];
  
  // Location
  location?: string;
  virtualLink?: string;
  isVirtual: boolean;
  
  // Content
  agenda: AgendaItem[];
  notes: MeetingNote[];
  decisions: MeetingDecision[];
  actionItems: ActionItem[];
  
  // Links
  linkedThreadId?: string;
  linkedProjectId?: string;
  attachments: Attachment[];
  
  // Status
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
  
  // Token Budget (meetings consume tokens for AI assistance)
  tokenBudget: number;
  tokensUsed: number;
}

export type MeetingStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export interface MeetingRecurrence {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate?: string;
  exceptions?: string[]; // dates to skip
}

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  role: 'organizer' | 'required' | 'optional';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  isExternal: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  presenter?: string;
  order: number;
  status: 'pending' | 'discussed' | 'skipped';
}

export interface MeetingNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  agendaItemId?: string;
  isPrivate: boolean;
}

export interface MeetingDecision {
  id: string;
  title: string;
  description: string;
  decidedAt: string;
  decidedBy: string;
  participants: string[];
  impact: 'low' | 'medium' | 'high';
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface MeetingState {
  // State
  meetings: Record<string, Meeting>;
  activeMeetingId: string | null;
  isLoading: boolean;
  
  // Meeting CRUD
  createMeeting: (data: CreateMeetingInput) => Meeting;
  getMeeting: (id: string) => Meeting | undefined;
  updateMeeting: (id: string, data: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  
  // Navigation
  setActiveMeeting: (id: string | null) => void;
  getActiveMeeting: () => Meeting | undefined;
  
  // Filtering
  getMeetingsBySphere: (sphereId: SphereId) => Meeting[];
  getUpcomingMeetings: (limit?: number) => Meeting[];
  getPastMeetings: (limit?: number) => Meeting[];
  getMeetingsByDateRange: (start: string, end: string) => Meeting[];
  searchMeetings: (query: string) => Meeting[];
  
  // Meeting Operations
  startMeeting: (id: string) => void;
  endMeeting: (id: string) => void;
  cancelMeeting: (id: string, reason?: string) => void;
  
  // Attendee Operations
  addAttendee: (meetingId: string, attendee: Omit<Attendee, 'id'>) => void;
  removeAttendee: (meetingId: string, attendeeId: string) => void;
  updateAttendeeStatus: (meetingId: string, attendeeId: string, status: Attendee['status']) => void;
  
  // Agenda Operations
  addAgendaItem: (meetingId: string, item: Omit<AgendaItem, 'id' | 'order' | 'status'>) => void;
  updateAgendaItem: (meetingId: string, itemId: string, data: Partial<AgendaItem>) => void;
  removeAgendaItem: (meetingId: string, itemId: string) => void;
  reorderAgenda: (meetingId: string, itemIds: string[]) => void;
  
  // Note Operations
  addNote: (meetingId: string, content: string, agendaItemId?: string) => void;
  updateNote: (meetingId: string, noteId: string, content: string) => void;
  deleteNote: (meetingId: string, noteId: string) => void;
  
  // Decision Operations
  recordDecision: (meetingId: string, decision: Omit<MeetingDecision, 'id' | 'decidedAt'>) => void;
  
  // Action Item Operations
  addActionItem: (meetingId: string, item: Omit<ActionItem, 'id' | 'createdAt' | 'status'>) => void;
  updateActionItem: (meetingId: string, itemId: string, data: Partial<ActionItem>) => void;
}

interface CreateMeetingInput {
  title: string;
  description?: string;
  sphereId: SphereId;
  startTime: string;
  endTime: string;
  timezone?: string;
  location?: string;
  virtualLink?: string;
  isVirtual?: boolean;
  attendees?: Omit<Attendee, 'id'>[];
  tokenBudget?: number;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateId = () => `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      // Initial State
      meetings: {},
      activeMeetingId: null,
      isLoading: false,

      // ─────────────────────────────────────────────────────────
      // Meeting CRUD
      // ─────────────────────────────────────────────────────────
      createMeeting: (data: CreateMeetingInput): Meeting => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const meeting: Meeting = {
          id,
          title: data.title,
          description: data.description || '',
          sphereId: data.sphereId,
          startTime: data.startTime,
          endTime: data.endTime,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          location: data.location,
          virtualLink: data.virtualLink,
          isVirtual: data.isVirtual ?? true,
          organizerId: 'current_user',
          attendees: (data.attendees || []).map((a, i) => ({ ...a, id: `att_${i}` })),
          agenda: [],
          notes: [],
          decisions: [],
          actionItems: [],
          attachments: [],
          status: 'scheduled',
          createdAt: now,
          updatedAt: now,
          tokenBudget: data.tokenBudget || 1000,
          tokensUsed: 0,
        };

        set((state) => ({
          meetings: { ...state.meetings, [id]: meeting },
        }));

        return meeting;
      },

      getMeeting: (id: string): Meeting | undefined => {
        return get().meetings[id];
      },

      updateMeeting: (id: string, data: Partial<Meeting>): void => {
        set((state) => {
          const meeting = state.meetings[id];
          if (!meeting) return state;
          
          return {
            meetings: {
              ...state.meetings,
              [id]: { ...meeting, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      deleteMeeting: (id: string): void => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.meetings;
          return {
            meetings: remaining,
            activeMeetingId: state.activeMeetingId === id ? null : state.activeMeetingId,
          };
        });
      },

      // ─────────────────────────────────────────────────────────
      // Navigation
      // ─────────────────────────────────────────────────────────
      setActiveMeeting: (id: string | null): void => {
        set({ activeMeetingId: id });
      },

      getActiveMeeting: (): Meeting | undefined => {
        const { activeMeetingId, meetings } = get();
        return activeMeetingId ? meetings[activeMeetingId] : undefined;
      },

      // ─────────────────────────────────────────────────────────
      // Filtering
      // ─────────────────────────────────────────────────────────
      getMeetingsBySphere: (sphereId: SphereId): Meeting[] => {
        return Object.values(get().meetings)
          .filter((m) => m.sphereId === sphereId)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      },

      getUpcomingMeetings: (limit = 10): Meeting[] => {
        const now = new Date().toISOString();
        return Object.values(get().meetings)
          .filter((m) => m.startTime >= now && m.status === 'scheduled')
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .slice(0, limit);
      },

      getPastMeetings: (limit = 10): Meeting[] => {
        const now = new Date().toISOString();
        return Object.values(get().meetings)
          .filter((m) => m.endTime < now || m.status === 'completed')
          .sort((a, b) => b.startTime.localeCompare(a.startTime))
          .slice(0, limit);
      },

      getMeetingsByDateRange: (start: string, end: string): Meeting[] => {
        return Object.values(get().meetings)
          .filter((m) => m.startTime >= start && m.startTime <= end)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      },

      searchMeetings: (query: string): Meeting[] => {
        const q = query.toLowerCase();
        return Object.values(get().meetings).filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q)
        );
      },

      // ─────────────────────────────────────────────────────────
      // Meeting Operations
      // ─────────────────────────────────────────────────────────
      startMeeting: (id: string): void => {
        get().updateMeeting(id, { status: 'in_progress' });
      },

      endMeeting: (id: string): void => {
        get().updateMeeting(id, { status: 'completed' });
      },

      cancelMeeting: (id: string, reason?: string): void => {
        get().updateMeeting(id, { 
          status: 'cancelled',
          description: reason ? `${get().meetings[id]?.description}\n\n[Cancelled: ${reason}]` : get().meetings[id]?.description,
        });
      },

      // ─────────────────────────────────────────────────────────
      // Attendee Operations
      // ─────────────────────────────────────────────────────────
      addAttendee: (meetingId: string, attendee: Omit<Attendee, 'id'>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const newAttendee: Attendee = {
          ...attendee,
          id: `att_${Date.now()}`,
        };

        get().updateMeeting(meetingId, {
          attendees: [...meeting.attendees, newAttendee],
        });
      },

      removeAttendee: (meetingId: string, attendeeId: string): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          attendees: meeting.attendees.filter((a) => a.id !== attendeeId),
        });
      },

      updateAttendeeStatus: (meetingId: string, attendeeId: string, status: Attendee['status']): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          attendees: meeting.attendees.map((a) =>
            a.id === attendeeId ? { ...a, status } : a
          ),
        });
      },

      // ─────────────────────────────────────────────────────────
      // Agenda Operations
      // ─────────────────────────────────────────────────────────
      addAgendaItem: (meetingId: string, item: Omit<AgendaItem, 'id' | 'order' | 'status'>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const newItem: AgendaItem = {
          ...item,
          id: `agenda_${Date.now()}`,
          order: meeting.agenda.length,
          status: 'pending',
        };

        get().updateMeeting(meetingId, {
          agenda: [...meeting.agenda, newItem],
        });
      },

      updateAgendaItem: (meetingId: string, itemId: string, data: Partial<AgendaItem>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          agenda: meeting.agenda.map((a) =>
            a.id === itemId ? { ...a, ...data } : a
          ),
        });
      },

      removeAgendaItem: (meetingId: string, itemId: string): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          agenda: meeting.agenda.filter((a) => a.id !== itemId),
        });
      },

      reorderAgenda: (meetingId: string, itemIds: string[]): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const reordered = itemIds
          .map((id, index) => {
            const item = meeting.agenda.find((a) => a.id === id);
            return item ? { ...item, order: index } : null;
          })
          .filter(Boolean) as AgendaItem[];

        get().updateMeeting(meetingId, { agenda: reordered });
      },

      // ─────────────────────────────────────────────────────────
      // Note Operations
      // ─────────────────────────────────────────────────────────
      addNote: (meetingId: string, content: string, agendaItemId?: string): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const note: MeetingNote = {
          id: `note_${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          createdBy: 'current_user',
          agendaItemId,
          isPrivate: false,
        };

        get().updateMeeting(meetingId, {
          notes: [...meeting.notes, note],
        });
      },

      updateNote: (meetingId: string, noteId: string, content: string): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          notes: meeting.notes.map((n) =>
            n.id === noteId ? { ...n, content } : n
          ),
        });
      },

      deleteNote: (meetingId: string, noteId: string): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          notes: meeting.notes.filter((n) => n.id !== noteId),
        });
      },

      // ─────────────────────────────────────────────────────────
      // Decision Operations
      // ─────────────────────────────────────────────────────────
      recordDecision: (meetingId: string, decision: Omit<MeetingDecision, 'id' | 'decidedAt'>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const newDecision: MeetingDecision = {
          ...decision,
          id: `dec_${Date.now()}`,
          decidedAt: new Date().toISOString(),
        };

        get().updateMeeting(meetingId, {
          decisions: [...meeting.decisions, newDecision],
        });
      },

      // ─────────────────────────────────────────────────────────
      // Action Item Operations
      // ─────────────────────────────────────────────────────────
      addActionItem: (meetingId: string, item: Omit<ActionItem, 'id' | 'createdAt' | 'status'>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        const actionItem: ActionItem = {
          ...item,
          id: `action_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };

        get().updateMeeting(meetingId, {
          actionItems: [...meeting.actionItems, actionItem],
        });
      },

      updateActionItem: (meetingId: string, itemId: string, data: Partial<ActionItem>): void => {
        const meeting = get().meetings[meetingId];
        if (!meeting) return;

        get().updateMeeting(meetingId, {
          actionItems: meeting.actionItems.map((a) =>
            a.id === itemId ? { ...a, ...data } : a
          ),
        });
      },
    }),
    {
      name: 'chenu-meetings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useMeetings = () => useMeetingStore((state) => Object.values(state.meetings));
export const useActiveMeeting = () => useMeetingStore((state) => state.getActiveMeeting());
export const useUpcomingMeetings = (limit?: number) => useMeetingStore((state) => state.getUpcomingMeetings(limit));

export default useMeetingStore;
