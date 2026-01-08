/**
 * CHE·NU™ V75 — useNotifications Hook
 * 
 * Notifications API Hook
 * GOUVERNANCE > EXÉCUTION
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  action_url?: string;
  action_type?: string;
  metadata: Record<string, unknown>;
  source: {
    type: 'system' | 'thread' | 'agent' | 'user' | 'checkpoint';
    id?: string;
    name?: string;
  };
  created_at: string;
  read_at?: string;
}

export type NotificationType = 
  | 'checkpoint_pending'     // Checkpoint needs approval
  | 'checkpoint_approved'    // Checkpoint was approved
  | 'checkpoint_rejected'    // Checkpoint was rejected
  | 'agent_hired'           // Agent was hired
  | 'agent_dismissed'       // Agent was dismissed
  | 'thread_update'         // Thread was updated
  | 'decision_recorded'     // Decision was recorded
  | 'mention'               // User was mentioned
  | 'reminder'              // Scheduled reminder
  | 'system'                // System notification
  | 'security';             // Security alert

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  channels: {
    [key in NotificationType]?: {
      email: boolean;
      push: boolean;
      in_app: boolean;
    };
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  by_priority: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════════

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...notificationKeys.lists(), filters] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all notifications with optional filters
 */
export function useNotifications(filters?: {
  status?: 'unread' | 'read' | 'archived';
  type?: NotificationType;
  priority?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: notificationKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      
      const response = await apiClient.get(`/notifications?${params.toString()}`);
      return response.data as { notifications: Notification[]; total: number };
    },
  });
}

/**
 * Fetch unread notifications
 */
export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await apiClient.get('/notifications?status=unread');
      return response.data as { notifications: Notification[]; total: number };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Fetch notification stats
 */
export function useNotificationStats() {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get('/notifications/stats');
      return response.data as NotificationStats;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Fetch notification preferences
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: async () => {
      const response = await apiClient.get('/notifications/preferences');
      return response.data as NotificationPreferences;
    },
  });
}

/**
 * Update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<NotificationPreferences>) => {
      const response = await apiClient.patch('/notifications/preferences', data);
      return response.data as NotificationPreferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });
}

/**
 * Mark notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.post(`/notifications/${notificationId}/read`);
      return response.data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/notifications/read-all');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Archive notification
 */
export function useArchiveNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.post(`/notifications/${notificationId}/archive`);
      return response.data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await apiClient.delete(`/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Get unread count (optimized for header badge)
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: [...notificationKeys.unread(), 'count'],
    queryFn: async () => {
      const response = await apiClient.get('/notifications/stats');
      return (response.data as NotificationStats).unread;
    },
    refetchInterval: 15000, // More frequent for badge
  });
}

export default {
  useNotifications,
  useUnreadNotifications,
  useNotificationStats,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useMarkAsRead,
  useMarkAllAsRead,
  useArchiveNotification,
  useDeleteNotification,
  useUnreadCount,
};
