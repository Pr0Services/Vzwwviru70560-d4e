// CHE·NU™ Notifications System — Real-time Alerts
// Governance-aware notifications with sphere context

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'governance' 
  | 'agent' 
  | 'thread' 
  | 'budget'
  | 'nova';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  sphere_code?: string;
  sphere_icon?: string;
  thread_id?: string;
  agent_code?: string;
  action_url?: string;
  action_label?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  auto_dismiss?: number; // seconds
  requires_action?: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
  types: {
    [key in NotificationType]: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "07:00"
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'nova',
    priority: 'medium',
    title: '🌟 Nova Insight',
    message: 'Based on your Q4 strategy thread, I suggest scheduling a follow-up meeting this week.',
    sphere_code: 'business',
    sphere_icon: '💼',
    thread_id: 'thread-001',
    action_url: '/threads/thread-001',
    action_label: 'View Thread',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false,
    dismissed: false,
  },
  {
    id: 'n2',
    type: 'budget',
    priority: 'high',
    title: '⚠️ Token Budget Alert',
    message: 'Business sphere has used 85% of its monthly token budget.',
    sphere_code: 'business',
    sphere_icon: '💼',
    action_url: '/analytics',
    action_label: 'View Analytics',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    dismissed: false,
    requires_action: true,
  },
  {
    id: 'n3',
    type: 'agent',
    priority: 'medium',
    title: '🤖 Agent Task Complete',
    message: 'DOC_GENERATOR has completed "Q4_Market_Expansion_Plan.docx"',
    sphere_code: 'business',
    sphere_icon: '💼',
    agent_code: 'DOC_GENERATOR',
    action_url: '/documents/doc-123',
    action_label: 'View Document',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false,
    dismissed: false,
  },
  {
    id: 'n4',
    type: 'governance',
    priority: 'critical',
    title: '⚖️ Governance Required',
    message: 'New agent "DATA_ANALYST" requires your approval before activation.',
    action_url: '/settings/agents',
    action_label: 'Review Agent',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    read: false,
    dismissed: false,
    requires_action: true,
  },
  {
    id: 'n5',
    type: 'thread',
    priority: 'low',
    title: '💬 Thread Update',
    message: 'Your "Personal Budget Planning" thread has been inactive for 7 days.',
    sphere_code: 'personal',
    sphere_icon: '🏠',
    thread_id: 'thread-002',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
    dismissed: false,
  },
  {
    id: 'n6',
    type: 'success',
    priority: 'medium',
    title: '✅ Task Completed',
    message: '15 tasks marked complete in "Website Redesign" project.',
    sphere_code: 'design_studio',
    sphere_icon: '🎨',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    read: true,
    dismissed: false,
  },
];

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  sound: true,
  desktop: false,
  priorities: { low: true, medium: true, high: true, critical: true },
  types: {
    info: true, success: true, warning: true, error: true,
    governance: true, agent: true, thread: true, budget: true, nova: true,
  },
  quiet_hours: { enabled: false, start: '22:00', end: '07:00' },
};

// ============================================================
// CONTEXT
// ============================================================

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

// ============================================================
// PROVIDER
// ============================================================

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
    const newNotification: Notification = {
      ...notif,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss if set
    if (notif.auto_dismiss) {
      setTimeout(() => {
        setNotifications(prev => prev.map(n => 
          n.id === newNotification.id ? { ...n, dismissed: true } : n
        ));
      }, notif.auto_dismiss * 1000);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })));
  }, []);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications: notifications.filter(n => !n.dismissed),
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      dismiss,
      clearAll,
      preferences,
      updatePreferences,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Notification Bell
  bellContainer: {
    position: 'relative' as const,
  },
  bellButton: {
    padding: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: CHENU_COLORS.softSand,
  },
  badge: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },

  // Dropdown Panel
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    width: '400px',
    maxHeight: '500px',
    backgroundColor: '#0a0a0b',
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  headerButton: {
    padding: '6px 12px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '6px',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    cursor: 'pointer',
  },
  notificationsList: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: CHENU_COLORS.ancientStone,
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },

  // Notification Item
  notificationItem: (read: boolean, priority: string) => ({
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}11`,
    backgroundColor: read ? 'transparent' : '#111113',
    borderLeft: `3px solid ${
      priority === 'critical' ? '#e74c3c' :
      priority === 'high' ? CHENU_COLORS.sacredGold :
      priority === 'medium' ? CHENU_COLORS.cenoteTurquoise :
      CHENU_COLORS.ancientStone
    }`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  }),
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px',
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  notificationTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  notificationMessage: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  notificationMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sphereTag: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: '#111113',
    color: CHENU_COLORS.softSand,
  },
  actionButton: {
    fontSize: '12px',
    padding: '4px 12px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    border: `1px solid ${CHENU_COLORS.sacredGold}44`,
    borderRadius: '4px',
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
  },
  dismissButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: 'auto',
  },

  // Toast Notifications
  toastContainer: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    zIndex: 9999,
  },
  toast: (type: NotificationType) => ({
    padding: '16px 20px',
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    border: `1px solid ${
      type === 'error' ? '#e74c3c33' :
      type === 'success' ? CHENU_COLORS.jungleEmerald + '33' :
      type === 'warning' ? CHENU_COLORS.sacredGold + '33' :
      type === 'governance' ? CHENU_COLORS.cenoteTurquoise + '33' :
      CHENU_COLORS.ancientStone + '33'
    }`,
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    minWidth: '300px',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    animation: 'slideIn 0.3s ease',
  }),
  toastIcon: {
    fontSize: '20px',
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  toastMessage: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
  },
  toastClose: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '16px',
  },
};

// ============================================================
// NOTIFICATION BELL COMPONENT
// ============================================================

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.action_url) {
      // Navigate to action URL
      logger.debug('Navigate to:', notif.action_url);
    }
  };

  return (
    <div style={styles.bellContainer}>
      <button style={styles.bellButton} onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Notifications</span>
            <div style={styles.headerActions}>
              <button style={styles.headerButton} onClick={markAllAsRead}>
                Mark all read
              </button>
              <button style={styles.headerButton} onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔔</div>
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  style={styles.notificationItem(notif.read, notif.priority)}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div style={styles.notificationHeader}>
                    <span style={styles.notificationTitle}>{notif.title}</span>
                    <span style={styles.notificationTime}>{formatTime(notif.timestamp)}</span>
                  </div>
                  <div style={styles.notificationMessage}>{notif.message}</div>
                  <div style={styles.notificationMeta}>
                    {notif.sphere_icon && (
                      <span style={styles.sphereTag}>
                        {notif.sphere_icon} {notif.sphere_code}
                      </span>
                    )}
                    {notif.action_label && (
                      <button style={styles.actionButton}>{notif.action_label}</button>
                    )}
                    <button
                      style={styles.dismissButton}
                      onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// TOAST NOTIFICATIONS COMPONENT
// ============================================================

interface ToastNotification extends Notification {
  visible: boolean;
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Expose a global function to show toasts
  useEffect(() => {
    (window as any).showChenuToast = (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
      const newToast: ToastNotification = {
        ...notification,
        id: `toast-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        dismissed: false,
        visible: true,
      };
      setToasts(prev => [...prev, newToast]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };

    return () => {
      delete (window as any).showChenuToast;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'governance': return '⚖️';
      case 'agent': return '🤖';
      case 'thread': return '💬';
      case 'budget': return '💰';
      case 'nova': return '🌟';
      default: return 'ℹ️';
    }
  };

  return (
    <div style={styles.toastContainer}>
      {toasts.map(toast => (
        <div key={toast.id} style={styles.toast(toast.type)}>
          <span style={styles.toastIcon}>{getIcon(toast.type)}</span>
          <div style={styles.toastContent}>
            <div style={styles.toastTitle}>{toast.title}</div>
            <div style={styles.toastMessage}>{toast.message}</div>
          </div>
          <button style={styles.toastClose} onClick={() => removeToast(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  NotificationProvider,
  NotificationBell,
  ToastContainer,
  useNotifications,
};
