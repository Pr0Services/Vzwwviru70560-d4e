/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — MEETING ENGINE STORE                        ║
 * ║                    Real-time Meeting Room Management                          ║
 * ║                    Task C1: Nouveaux Engines                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * MEETING ENGINE FEATURES:
 * - Real-time meeting rooms
 * - Participant management
 * - Agenda & action items
 * - Recording & transcription
 * - Integration with agents
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type ParticipantRole = 'host' | 'co_host' | 'participant' | 'observer' | 'agent'
export type ParticipantStatus = 'invited' | 'accepted' | 'declined' | 'joined' | 'left'
export type AgendaItemStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'
export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export interface MeetingParticipant {
  id: string
  meeting_id: string
  identity_id?: string
  agent_id?: string
  name: string
  email?: string
  avatar?: string
  role: ParticipantRole
  status: ParticipantStatus
  joined_at?: string
  left_at?: string
  is_muted: boolean
  is_video_on: boolean
  is_screen_sharing: boolean
}

export interface AgendaItem {
  id: string
  meeting_id: string
  title: string
  description?: string
  duration_minutes: number
  presenter_id?: string
  status: AgendaItemStatus
  order: number
  started_at?: string
  completed_at?: string
  notes?: string
}

export interface ActionItem {
  id: string
  meeting_id: string
  title: string
  description?: string
  assignee_id: string
  assignee_name: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  status: ActionItemStatus
  created_at: string
  completed_at?: string
}

export interface MeetingNote {
  id: string
  meeting_id: string
  content: string
  author_id: string
  author_name: string
  timestamp: string
  is_pinned: boolean
}

export interface MeetingRecording {
  id: string
  meeting_id: string
  url: string
  duration_seconds: number
  size_bytes: number
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed'
  transcription_url?: string
  created_at: string
}

export interface Meeting {
  id: string
  title: string
  description?: string
  sphere_id: string
  thread_id?: string
  host_id: string
  status: MeetingStatus
  scheduled_start: string
  scheduled_end: string
  actual_start?: string
  actual_end?: string
  timezone: string
  location?: string
  meeting_url?: string
  password?: string
  is_recurring: boolean
  recurrence_rule?: string
  settings: MeetingSettings
  created_at: string
  updated_at: string
}

export interface MeetingSettings {
  allow_guests: boolean
  require_approval: boolean
  auto_record: boolean
  enable_transcription: boolean
  enable_chat: boolean
  enable_reactions: boolean
  enable_screen_share: boolean
  enable_breakout_rooms: boolean
  waiting_room_enabled: boolean
  mute_on_entry: boolean
  max_participants: number
}

export interface MeetingRoom {
  meeting_id: string
  connection_status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  local_participant?: MeetingParticipant
  participants: MeetingParticipant[]
  current_agenda_item?: string
  active_speaker_id?: string
  is_recording: boolean
  chat_messages: ChatMessage[]
  reactions: Reaction[]
}

export interface ChatMessage {
  id: string
  sender_id: string
  sender_name: string
  content: string
  timestamp: string
  is_private: boolean
  recipient_id?: string
}

export interface Reaction {
  id: string
  sender_id: string
  type: 'like' | 'love' | 'laugh' | 'wow' | 'clap' | 'think'
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface MeetingState {
  // Data
  meetings: Record<string, Meeting>
  participants: Record<string, MeetingParticipant[]>
  agenda: Record<string, AgendaItem[]>
  action_items: Record<string, ActionItem[]>
  notes: Record<string, MeetingNote[]>
  recordings: Record<string, MeetingRecording[]>
  
  // Active room
  active_room: MeetingRoom | null
  
  // UI State
  is_loading: boolean
  error: string | null
  
  // Meeting CRUD
  createMeeting: (data: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => Meeting
  updateMeeting: (id: string, data: Partial<Meeting>) => void
  deleteMeeting: (id: string) => boolean
  getMeeting: (id: string) => Meeting | undefined
  getUpcomingMeetings: (sphereId?: string) => Meeting[]
  
  // Participant Management
  addParticipant: (meetingId: string, participant: Omit<MeetingParticipant, 'id' | 'meeting_id'>) => MeetingParticipant
  removeParticipant: (meetingId: string, participantId: string) => void
  updateParticipantStatus: (meetingId: string, participantId: string, status: ParticipantStatus) => void
  
  // Meeting Room
  joinMeeting: (meetingId: string, identityId: string) => Promise<boolean>
  leaveMeeting: () => void
  toggleMute: () => void
  toggleVideo: () => void
  toggleScreenShare: () => void
  sendChatMessage: (content: string, isPrivate?: boolean, recipientId?: string) => void
  sendReaction: (type: Reaction['type']) => void
  
  // Agenda
  addAgendaItem: (meetingId: string, item: Omit<AgendaItem, 'id' | 'meeting_id' | 'status'>) => AgendaItem
  updateAgendaItem: (meetingId: string, itemId: string, data: Partial<AgendaItem>) => void
  startAgendaItem: (meetingId: string, itemId: string) => void
  completeAgendaItem: (meetingId: string, itemId: string) => void
  reorderAgenda: (meetingId: string, itemIds: string[]) => void
  
  // Action Items
  addActionItem: (meetingId: string, item: Omit<ActionItem, 'id' | 'meeting_id' | 'status' | 'created_at'>) => ActionItem
  updateActionItem: (meetingId: string, itemId: string, data: Partial<ActionItem>) => void
  completeActionItem: (meetingId: string, itemId: string) => void
  
  // Notes
  addNote: (meetingId: string, content: string, authorId: string, authorName: string) => MeetingNote
  pinNote: (meetingId: string, noteId: string) => void
  
  // Recording
  startRecording: (meetingId: string) => void
  stopRecording: (meetingId: string) => void
  
  // Meeting Control
  startMeeting: (id: string) => void
  endMeeting: (id: string) => void
  
  // Utilities
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  meetings: {},
  participants: {},
  agenda: {},
  action_items: {},
  notes: {},
  recordings: {},
  active_room: null,
  is_loading: false,
  error: null,
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useMeetingEngineStore = create<MeetingState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // ─────────────────────────────────────────────────────────────────────────
      // Meeting CRUD
      // ─────────────────────────────────────────────────────────────────────────
      
      createMeeting: (data) => {
        const id = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()
        
        const meeting: Meeting = {
          ...data,
          id,
          created_at: now,
          updated_at: now,
        }
        
        set(state => ({
          meetings: { ...state.meetings, [id]: meeting },
          participants: { ...state.participants, [id]: [] },
          agenda: { ...state.agenda, [id]: [] },
          action_items: { ...state.action_items, [id]: [] },
          notes: { ...state.notes, [id]: [] },
          recordings: { ...state.recordings, [id]: [] },
        }))
        
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Meeting created:', id)
        return meeting
      },
      
      updateMeeting: (id, data) => {
        set(state => ({
          meetings: {
            ...state.meetings,
            [id]: {
              ...state.meetings[id],
              ...data,
              updated_at: new Date().toISOString(),
            },
          },
        }))
      },
      
      deleteMeeting: (id) => {
        const meeting = get().meetings[id]
        if (!meeting) return false
        
        set(state => {
          const { [id]: _, ...meetings } = state.meetings
          const { [id]: __, ...participants } = state.participants
          const { [id]: ___, ...agenda } = state.agenda
          const { [id]: ____, ...action_items } = state.action_items
          const { [id]: _____, ...notes } = state.notes
          const { [id]: ______, ...recordings } = state.recordings
          
          return { meetings, participants, agenda, action_items, notes, recordings }
        })
        
        return true
      },
      
      getMeeting: (id) => get().meetings[id],
      
      getUpcomingMeetings: (sphereId) => {
        const now = new Date()
        return Object.values(get().meetings)
          .filter(m => {
            if (sphereId && m.sphere_id !== sphereId) return false
            if (m.status === 'cancelled' || m.status === 'completed') return false
            return new Date(m.scheduled_start) >= now
          })
          .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Participants
      // ─────────────────────────────────────────────────────────────────────────
      
      addParticipant: (meetingId, data) => {
        const id = `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const participant: MeetingParticipant = {
          ...data,
          id,
          meeting_id: meetingId,
        }
        
        set(state => ({
          participants: {
            ...state.participants,
            [meetingId]: [...(state.participants[meetingId] || []), participant],
          },
        }))
        
        return participant
      },
      
      removeParticipant: (meetingId, participantId) => {
        set(state => ({
          participants: {
            ...state.participants,
            [meetingId]: (state.participants[meetingId] || []).filter(p => p.id !== participantId),
          },
        }))
      },
      
      updateParticipantStatus: (meetingId, participantId, status) => {
        set(state => ({
          participants: {
            ...state.participants,
            [meetingId]: (state.participants[meetingId] || []).map(p =>
              p.id === participantId ? { ...p, status } : p
            ),
          },
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Meeting Room
      // ─────────────────────────────────────────────────────────────────────────
      
      joinMeeting: async (meetingId, identityId) => {
        const meeting = get().meetings[meetingId]
        if (!meeting) return false
        
        set({
          active_room: {
            meeting_id: meetingId,
            connection_status: 'connecting',
            participants: [],
            chat_messages: [],
            reactions: [],
            is_recording: false,
          },
        })
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const localParticipant: MeetingParticipant = {
          id: `local_${identityId}`,
          meeting_id: meetingId,
          identity_id: identityId,
          name: 'You',
          role: 'participant',
          status: 'joined',
          joined_at: new Date().toISOString(),
          is_muted: meeting.settings.mute_on_entry,
          is_video_on: true,
          is_screen_sharing: false,
        }
        
        set(state => ({
          active_room: state.active_room ? {
            ...state.active_room,
            connection_status: 'connected',
            local_participant: localParticipant,
            participants: [...state.active_room.participants, localParticipant],
          } : null,
        }))
        
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Joined meeting:', meetingId)
        return true
      },
      
      leaveMeeting: () => {
        const room = get().active_room
        if (room?.local_participant) {
          // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Left meeting:', room.meeting_id)
        }
        set({ active_room: null })
      },
      
      toggleMute: () => {
        set(state => {
          if (!state.active_room?.local_participant) return state
          
          const newMutedState = !state.active_room.local_participant.is_muted
          
          return {
            active_room: {
              ...state.active_room,
              local_participant: {
                ...state.active_room.local_participant,
                is_muted: newMutedState,
              },
              participants: state.active_room.participants.map(p =>
                p.id === state.active_room!.local_participant!.id
                  ? { ...p, is_muted: newMutedState }
                  : p
              ),
            },
          }
        })
      },
      
      toggleVideo: () => {
        set(state => {
          if (!state.active_room?.local_participant) return state
          
          const newVideoState = !state.active_room.local_participant.is_video_on
          
          return {
            active_room: {
              ...state.active_room,
              local_participant: {
                ...state.active_room.local_participant,
                is_video_on: newVideoState,
              },
            },
          }
        })
      },
      
      toggleScreenShare: () => {
        set(state => {
          if (!state.active_room?.local_participant) return state
          
          return {
            active_room: {
              ...state.active_room,
              local_participant: {
                ...state.active_room.local_participant,
                is_screen_sharing: !state.active_room.local_participant.is_screen_sharing,
              },
            },
          }
        })
      },
      
      sendChatMessage: (content, isPrivate = false, recipientId) => {
        set(state => {
          if (!state.active_room?.local_participant) return state
          
          const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            sender_id: state.active_room.local_participant.identity_id || '',
            sender_name: state.active_room.local_participant.name,
            content,
            timestamp: new Date().toISOString(),
            is_private: isPrivate,
            recipient_id: recipientId,
          }
          
          return {
            active_room: {
              ...state.active_room,
              chat_messages: [...state.active_room.chat_messages, message],
            },
          }
        })
      },
      
      sendReaction: (type) => {
        set(state => {
          if (!state.active_room?.local_participant) return state
          
          const reaction: Reaction = {
            id: `reaction_${Date.now()}`,
            sender_id: state.active_room.local_participant.identity_id || '',
            type,
            timestamp: new Date().toISOString(),
          }
          
          return {
            active_room: {
              ...state.active_room,
              reactions: [...state.active_room.reactions, reaction],
            },
          }
        })
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Agenda
      // ─────────────────────────────────────────────────────────────────────────
      
      addAgendaItem: (meetingId, data) => {
        const id = `agenda_${Date.now()}`
        const existingItems = get().agenda[meetingId] || []
        
        const item: AgendaItem = {
          ...data,
          id,
          meeting_id: meetingId,
          status: 'pending',
          order: data.order ?? existingItems.length,
        }
        
        set(state => ({
          agenda: {
            ...state.agenda,
            [meetingId]: [...(state.agenda[meetingId] || []), item],
          },
        }))
        
        return item
      },
      
      updateAgendaItem: (meetingId, itemId, data) => {
        set(state => ({
          agenda: {
            ...state.agenda,
            [meetingId]: (state.agenda[meetingId] || []).map(item =>
              item.id === itemId ? { ...item, ...data } : item
            ),
          },
        }))
      },
      
      startAgendaItem: (meetingId, itemId) => {
        set(state => ({
          agenda: {
            ...state.agenda,
            [meetingId]: (state.agenda[meetingId] || []).map(item =>
              item.id === itemId
                ? { ...item, status: 'in_progress' as const, started_at: new Date().toISOString() }
                : item
            ),
          },
          active_room: state.active_room?.meeting_id === meetingId
            ? { ...state.active_room, current_agenda_item: itemId }
            : state.active_room,
        }))
      },
      
      completeAgendaItem: (meetingId, itemId) => {
        set(state => ({
          agenda: {
            ...state.agenda,
            [meetingId]: (state.agenda[meetingId] || []).map(item =>
              item.id === itemId
                ? { ...item, status: 'completed' as const, completed_at: new Date().toISOString() }
                : item
            ),
          },
        }))
      },
      
      reorderAgenda: (meetingId, itemIds) => {
        set(state => ({
          agenda: {
            ...state.agenda,
            [meetingId]: itemIds.map((id, index) => {
              const item = (state.agenda[meetingId] || []).find(i => i.id === id)
              return item ? { ...item, order: index } : null
            }).filter((i): i is AgendaItem => i !== null),
          },
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Action Items
      // ─────────────────────────────────────────────────────────────────────────
      
      addActionItem: (meetingId, data) => {
        const id = `action_${Date.now()}`
        
        const item: ActionItem = {
          ...data,
          id,
          meeting_id: meetingId,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
        
        set(state => ({
          action_items: {
            ...state.action_items,
            [meetingId]: [...(state.action_items[meetingId] || []), item],
          },
        }))
        
        return item
      },
      
      updateActionItem: (meetingId, itemId, data) => {
        set(state => ({
          action_items: {
            ...state.action_items,
            [meetingId]: (state.action_items[meetingId] || []).map(item =>
              item.id === itemId ? { ...item, ...data } : item
            ),
          },
        }))
      },
      
      completeActionItem: (meetingId, itemId) => {
        set(state => ({
          action_items: {
            ...state.action_items,
            [meetingId]: (state.action_items[meetingId] || []).map(item =>
              item.id === itemId
                ? { ...item, status: 'completed' as const, completed_at: new Date().toISOString() }
                : item
            ),
          },
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Notes
      // ─────────────────────────────────────────────────────────────────────────
      
      addNote: (meetingId, content, authorId, authorName) => {
        const id = `note_${Date.now()}`
        
        const note: MeetingNote = {
          id,
          meeting_id: meetingId,
          content,
          author_id: authorId,
          author_name: authorName,
          timestamp: new Date().toISOString(),
          is_pinned: false,
        }
        
        set(state => ({
          notes: {
            ...state.notes,
            [meetingId]: [...(state.notes[meetingId] || []), note],
          },
        }))
        
        return note
      },
      
      pinNote: (meetingId, noteId) => {
        set(state => ({
          notes: {
            ...state.notes,
            [meetingId]: (state.notes[meetingId] || []).map(note =>
              note.id === noteId ? { ...note, is_pinned: !note.is_pinned } : note
            ),
          },
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Recording
      // ─────────────────────────────────────────────────────────────────────────
      
      startRecording: (meetingId) => {
        set(state => ({
          active_room: state.active_room?.meeting_id === meetingId
            ? { ...state.active_room, is_recording: true }
            : state.active_room,
        }))
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Recording started:', meetingId)
      },
      
      stopRecording: (meetingId) => {
        set(state => ({
          active_room: state.active_room?.meeting_id === meetingId
            ? { ...state.active_room, is_recording: false }
            : state.active_room,
        }))
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Recording stopped:', meetingId)
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Meeting Control
      // ─────────────────────────────────────────────────────────────────────────
      
      startMeeting: (id) => {
        set(state => ({
          meetings: {
            ...state.meetings,
            [id]: {
              ...state.meetings[id],
              status: 'in_progress',
              actual_start: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        }))
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Meeting started:', id)
      },
      
      endMeeting: (id) => {
        set(state => ({
          meetings: {
            ...state.meetings,
            [id]: {
              ...state.meetings[id],
              status: 'completed',
              actual_end: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
          active_room: state.active_room?.meeting_id === id ? null : state.active_room,
        }))
        // [MeetingEngine] Debug: // logger.debug('[MeetingEngine] Meeting ended:', id)
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Utilities
      // ─────────────────────────────────────────────────────────────────────────
      
      setLoading: (loading) => set({ is_loading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    })),
    { name: 'chenu-meeting-engine' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type { MeetingState }
export default useMeetingEngineStore
