/**
 * CHE·NU™ V75 — useMeetings Hook
 * 
 * Meeting Management API Hook
 * GOUVERNANCE > EXÉCUTION
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Meeting {
  id: string;
  dataspace_id: string;
  title: string;
  description?: string;
  meeting_type: 'standup' | 'planning' | 'review' | 'retrospective' | 'one_on_one' | 'all_hands';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_start?: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  location?: string;
  is_xr_meeting: boolean;
  agenda: AgendaItem[];
  participants: Participant[];
  notes: MeetingNote[];
  tasks: MeetingTask[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration_minutes: number;
  presenter?: string;
  notes?: string;
  order: number;
}

export interface Participant {
  id: string;
  user_id: string;
  name: string;
  role: 'organizer' | 'required' | 'optional';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  joined_at?: string;
  left_at?: string;
}

export interface MeetingNote {
  id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface MeetingTask {
  id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export interface CreateMeetingRequest {
  dataspace_id: string;
  title: string;
  description?: string;
  meeting_type?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  location?: string;
  is_xr_meeting?: boolean;
  agenda?: Omit<AgendaItem, 'id'>[];
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  location?: string;
  agenda?: AgendaItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...meetingKeys.lists(), filters] as const,
  upcoming: () => [...meetingKeys.all, 'upcoming'] as const,
  today: () => [...meetingKeys.all, 'today'] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
  participants: (id: string) => [...meetingKeys.detail(id), 'participants'] as const,
  notes: (id: string) => [...meetingKeys.detail(id), 'notes'] as const,
  tasks: (id: string) => [...meetingKeys.detail(id), 'tasks'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all meetings with optional filters
 */
export function useMeetings(filters?: {
  dataspace_id?: string;
  status?: string;
  meeting_type?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: meetingKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dataspace_id) params.append('dataspace_id', filters.dataspace_id);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.meeting_type) params.append('meeting_type', filters.meeting_type);
      if (filters?.from_date) params.append('from_date', filters.from_date);
      if (filters?.to_date) params.append('to_date', filters.to_date);
      
      const response = await apiClient.get(`/meetings?${params.toString()}`);
      return response.data as { meetings: Meeting[]; total: number };
    },
  });
}

/**
 * Fetch upcoming meetings
 */
export function useUpcomingMeetings(limit: number = 10) {
  return useQuery({
    queryKey: meetingKeys.upcoming(),
    queryFn: async () => {
      const response = await apiClient.get(`/meetings/upcoming?limit=${limit}`);
      return response.data as { meetings: Meeting[] };
    },
  });
}

/**
 * Fetch today's meetings
 */
export function useTodayMeetings() {
  return useQuery({
    queryKey: meetingKeys.today(),
    queryFn: async () => {
      const response = await apiClient.get('/meetings/today');
      return response.data as { meetings: Meeting[] };
    },
  });
}

/**
 * Fetch single meeting by ID
 */
export function useMeeting(meetingId: string) {
  return useQuery({
    queryKey: meetingKeys.detail(meetingId),
    queryFn: async () => {
      const response = await apiClient.get(`/meetings/${meetingId}`);
      return response.data as Meeting;
    },
    enabled: !!meetingId,
  });
}

/**
 * Create new meeting
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMeetingRequest) => {
      const response = await apiClient.post('/meetings', data);
      return response.data as Meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

/**
 * Update meeting
 */
export function useUpdateMeeting(meetingId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateMeetingRequest) => {
      const response = await apiClient.patch(`/meetings/${meetingId}`, data);
      return response.data as Meeting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
}

/**
 * Start meeting
 */
export function useStartMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meetingId: string) => {
      const response = await apiClient.post(`/meetings/${meetingId}/start`);
      return response.data as Meeting;
    },
    onSuccess: (_, meetingId) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
  });
}

/**
 * End meeting
 */
export function useEndMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meetingId: string) => {
      const response = await apiClient.post(`/meetings/${meetingId}/end`);
      return response.data as Meeting;
    },
    onSuccess: (_, meetingId) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
  });
}

/**
 * Add participant to meeting
 */
export function useAddParticipant(meetingId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { user_id: string; role?: string }) => {
      const response = await apiClient.post(`/meetings/${meetingId}/participants`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.participants(meetingId) });
    },
  });
}

/**
 * Add note to meeting
 */
export function useAddMeetingNote(meetingId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiClient.post(`/meetings/${meetingId}/notes`, data);
      return response.data as MeetingNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.notes(meetingId) });
    },
  });
}

/**
 * Add task to meeting
 */
export function useAddMeetingTask(meetingId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; assignee_id?: string; due_date?: string }) => {
      const response = await apiClient.post(`/meetings/${meetingId}/tasks`, data);
      return response.data as MeetingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.tasks(meetingId) });
    },
  });
}

export default {
  useMeetings,
  useUpcomingMeetings,
  useTodayMeetings,
  useMeeting,
  useCreateMeeting,
  useUpdateMeeting,
  useStartMeeting,
  useEndMeeting,
  useAddParticipant,
  useAddMeetingNote,
  useAddMeetingTask,
};
