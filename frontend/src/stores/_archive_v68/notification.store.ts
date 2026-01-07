/**
 * CHE·NU — Notification Store (Zustand)
 */

import { create } from 'zustand';
import { Notification, NotificationSettings, NotificationStats } from '../types/notification.types';
import notificationService from '../services/notification.service';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  stats: NotificationStats | null;
  isLoading: boolean;
  
  // Actions
  loadNotifications: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadStats: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  connect: (userId: string) => void;
  disconnect: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  settings: null,
  stats: null,
  isLoading: false,

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const { notifications } = await notificationService.list({ limit: 50 });
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to load notifications:', error);
      set({ isLoading: false });
    }
  },

  loadSettings: async () => {
    try {
      const settings = await notificationService.getSettings();
      set({ settings });
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  },

  loadStats: async () => {
    try {
      const stats = await notificationService.getStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to load notification stats:', error);
    }
  },

  markAsRead: async (id: string) => {
    await notificationService.markAsRead(id);
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await notificationService.markAllAsRead();
    set(state => ({
      notifications: state.notifications.map(n => ({
        ...n,
        read: true,
        read_at: new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
  },

  dismiss: async (id: string) => {
    await notificationService.dismiss(id);
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
      unreadCount: state.notifications.find(n => n.id === id)?.read === false
        ? state.unreadCount - 1
        : state.unreadCount,
    }));
  },

  dismissAll: async () => {
    await notificationService.dismissAll();
    set({ notifications: [], unreadCount: 0 });
  },

  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    }));
    
    // Show browser notification if enabled
    const settings = get().settings;
    if (settings?.channels.push) {
      notificationService.showBrowserNotification(notification);
    }
  },

  updateSettings: async (updates: Partial<NotificationSettings>) => {
    const settings = await notificationService.updateSettings(updates);
    set({ settings });
  },

  connect: (userId: string) => {
    notificationService.connect(userId);
    notificationService.onNotification((notification) => {
      get().addNotification(notification);
    });
  },

  disconnect: () => {
    notificationService.disconnect();
  },
}));

export default useNotificationStore;
