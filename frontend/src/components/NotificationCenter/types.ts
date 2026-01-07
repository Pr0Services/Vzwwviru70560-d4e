/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — NOTIFICATION CENTER TYPES
   Centralized notification system
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'agent'      // Agent activity
  | 'thread'     // Thread updates
  | 'meeting'    // Meeting reminders
  | 'mention'    // User mentions
  | 'decision'   // Decision required
  | 'system';    // System notifications

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'unread' | 'read' | 'archived' | 'actioned';

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION ITEM
// ════════════════════════════════════════════════════════════════════════════════

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  
  // Content
  title: string;
  message: string;
  icon?: string;
  
  // Context
  sphereId?: string;
  sphereName?: string;
  threadId?: string;
  agentId?: string;
  agentName?: string;
  
  // Timestamps
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
  
  // Actions
  primaryAction?: NotificationAction;
  secondaryAction?: NotificationAction;
  dismissable?: boolean;
  
  // Grouping
  groupId?: string;
  groupCount?: number;
  
  // Sound/Visual
  playSound?: boolean;
  showBadge?: boolean;
}

export interface NotificationAction {
  label: string;
  labelFr?: string;
  icon?: string;
  action: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
}

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION GROUP
// ════════════════════════════════════════════════════════════════════════════════

export interface NotificationGroup {
  id: string;
  title: string;
  titleFr?: string;
  icon: string;
  notifications: Notification[];
  count: number;
  unreadCount: number;
  latestAt: Date;
}

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION PREFERENCES
// ════════════════════════════════════════════════════════════════════════════════

export interface NotificationPreferences {
  // Global
  enabled: boolean;
  soundEnabled: boolean;
  badgeEnabled: boolean;
  
  // Do Not Disturb
  dndEnabled: boolean;
  dndStart?: string; // "22:00"
  dndEnd?: string;   // "08:00"
  dndExceptions: NotificationType[];
  
  // Per-type settings
  typeSettings: Record<NotificationType, {
    enabled: boolean;
    sound: boolean;
    priority: NotificationPriority;
  }>;
  
  // Per-sphere settings
  sphereSettings: Record<string, {
    enabled: boolean;
    sound: boolean;
  }>;
  
  // Digest
  digestEnabled: boolean;
  digestFrequency: 'hourly' | 'daily' | 'weekly';
  digestTime?: string; // "09:00"
}

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION FILTER
// ════════════════════════════════════════════════════════════════════════════════

export interface NotificationFilter {
  types?: NotificationType[];
  priorities?: NotificationPriority[];
  statuses?: NotificationStatus[];
  sphereIds?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION STORE STATE
// ════════════════════════════════════════════════════════════════════════════════

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  isLoading: boolean;
  filter: NotificationFilter;
  preferences: NotificationPreferences;
}

export interface NotificationActions {
  add: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archive: (id: string) => void;
  archiveAll: () => void;
  dismiss: (id: string) => void;
  clear: () => void;
  setFilter: (filter: NotificationFilter) => void;
  setPreferences: (prefs: Partial<NotificationPreferences>) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  agent: '🤖',
  thread: '💬',
  meeting: '📅',
  mention: '@',
  decision: '⚖️',
  system: '⚙️',
};

export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  info: '#3EB4A2',      // Cenote Turquoise
  success: '#3F7249',   // Jungle Emerald
  warning: '#D8B26A',   // Sacred Gold
  error: '#C53030',     // Red
  agent: '#8D8371',     // Ancient Stone
  thread: '#3EB4A2',    // Cenote Turquoise
  meeting: '#7A593A',   // Earth Ember
  mention: '#D8B26A',   // Sacred Gold
  decision: '#2F4C39',  // Shadow Moss
  system: '#1E1F22',    // UI Slate
};

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  soundEnabled: true,
  badgeEnabled: true,
  dndEnabled: false,
  dndExceptions: ['urgent', 'decision'] as unknown as NotificationType[],
  typeSettings: {
    info: { enabled: true, sound: false, priority: 'low' },
    success: { enabled: true, sound: true, priority: 'medium' },
    warning: { enabled: true, sound: true, priority: 'high' },
    error: { enabled: true, sound: true, priority: 'urgent' },
    agent: { enabled: true, sound: false, priority: 'medium' },
    thread: { enabled: true, sound: true, priority: 'medium' },
    meeting: { enabled: true, sound: true, priority: 'high' },
    mention: { enabled: true, sound: true, priority: 'high' },
    decision: { enabled: true, sound: true, priority: 'urgent' },
    system: { enabled: true, sound: false, priority: 'low' },
  },
  sphereSettings: {},
  digestEnabled: true,
  digestFrequency: 'daily',
  digestTime: '09:00',
};
