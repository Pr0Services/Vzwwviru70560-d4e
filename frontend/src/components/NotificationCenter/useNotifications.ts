/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — USE NOTIFICATIONS HOOK
   React hook for managing notifications state
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  Notification, 
  NotificationPreferences, 
  NotificationFilter,
  NotificationType,
  NotificationPriority 
} from './types';
import { DEFAULT_PREFERENCES } from './types';

// ════════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS
// ════════════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  notifications: 'chenu-notifications',
  preferences: 'chenu-notification-preferences',
};

// ════════════════════════════════════════════════════════════════════════════════
// GENERATE ID
// ════════════════════════════════════════════════════════════════════════════════

const generateId = (): string => {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// HOOK RETURN TYPE
// ════════════════════════════════════════════════════════════════════════════════

interface UseNotificationsReturn {
  // State
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  preferences: NotificationPreferences;
  
  // Panel actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  
  // Notification actions
  add: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archive: (id: string) => void;
  archiveAll: () => void;
  dismiss: (id: string) => void;
  clear: () => void;
  
  // Preferences
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  // Helpers
  getByType: (type: NotificationType) => Notification[];
  getBySphere: (sphereId: string) => Notification[];
  
  // Quick notification creators
  notify: {
    info: (title: string, message: string, options?: Partial<Notification>) => string;
    success: (title: string, message: string, options?: Partial<Notification>) => string;
    warning: (title: string, message: string, options?: Partial<Notification>) => string;
    error: (title: string, message: string, options?: Partial<Notification>) => string;
    agent: (agentName: string, message: string, options?: Partial<Notification>) => string;
    thread: (threadTitle: string, message: string, options?: Partial<Notification>) => string;
    meeting: (title: string, message: string, options?: Partial<Notification>) => string;
    mention: (from: string, message: string, options?: Partial<Notification>) => string;
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// HOOK
// ════════════════════════════════════════════════════════════════════════════════

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load from storage on mount
  useEffect(() => {
    try {
      // Load notifications
      const storedNotifs = localStorage.getItem(STORAGE_KEYS.notifications);
      if (storedNotifs) {
        const parsed = JSON.parse(storedNotifs);
        const notifs = parsed.map((n: unknown) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          readAt: n.readAt ? new Date(n.readAt) : undefined,
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
        }));
        setNotifications(notifs);
      }

      // Load preferences
      const storedPrefs = localStorage.getItem(STORAGE_KEYS.preferences);
      if (storedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) });
      }
    } catch (error) {
      logger.error('Failed to load notifications:', error);
    }
  }, []);

  // Save notifications to storage
  const saveNotifications = useCallback((notifs: Notification[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifs));
    } catch (error) {
      logger.error('Failed to save notifications:', error);
    }
  }, []);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.status === 'unread').length;
  }, [notifications]);

  // Panel controls
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Add notification
  const add = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'status'>): string => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      status: 'unread',
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 100); // Keep max 100
      saveNotifications(updated);
      return updated;
    });

    // Play sound if enabled
    if (preferences.soundEnabled && preferences.typeSettings[notification.type]?.sound) {
      // Could play a sound here
      // new Audio('/sounds/notification.mp3').play();
    }

    return id;
  }, [preferences, saveNotifications]);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, status: 'read' as const, readAt: new Date() } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.status === 'unread' ? { ...n, status: 'read' as const, readAt: new Date() } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Archive
  const archive = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, status: 'archived' as const } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Archive all
  const archiveAll = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, status: 'archived' as const }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Dismiss (remove)
  const dismiss = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear all
  const clear = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.notifications);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get by type
  const getByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get by sphere
  const getBySphere = useCallback((sphereId: string) => {
    return notifications.filter(n => n.sphereId === sphereId);
  }, [notifications]);

  // Quick notification creators
  const notify = useMemo(() => ({
    info: (title: string, message: string, options?: Partial<Notification>) => 
      add({ type: 'info', priority: 'low', title, message, ...options }),
    
    success: (title: string, message: string, options?: Partial<Notification>) => 
      add({ type: 'success', priority: 'medium', title, message, ...options }),
    
    warning: (title: string, message: string, options?: Partial<Notification>) => 
      add({ type: 'warning', priority: 'high', title, message, ...options }),
    
    error: (title: string, message: string, options?: Partial<Notification>) => 
      add({ type: 'error', priority: 'urgent', title, message, ...options }),
    
    agent: (agentName: string, message: string, options?: Partial<Notification>) => 
      add({ 
        type: 'agent', 
        priority: 'medium', 
        title: `Agent: ${agentName}`, 
        message, 
        agentName,
        icon: '🤖',
        ...options 
      }),
    
    thread: (threadTitle: string, message: string, options?: Partial<Notification>) => 
      add({ 
        type: 'thread', 
        priority: 'medium', 
        title: threadTitle, 
        message,
        icon: '💬',
        ...options 
      }),
    
    meeting: (title: string, message: string, options?: Partial<Notification>) => 
      add({ 
        type: 'meeting', 
        priority: 'high', 
        title, 
        message,
        icon: '📅',
        ...options 
      }),
    
    mention: (from: string, message: string, options?: Partial<Notification>) => 
      add({ 
        type: 'mention', 
        priority: 'high', 
        title: `@${from} vous a mentionné`, 
        message,
        icon: '@',
        ...options 
      }),
  }), [add]);

  return {
    notifications,
    unreadCount,
    isOpen,
    preferences,
    open,
    close,
    toggle,
    add,
    markAsRead,
    markAllAsRead,
    archive,
    archiveAll,
    dismiss,
    clear,
    updatePreferences,
    getByType,
    getBySphere,
    notify,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default useNotifications;
