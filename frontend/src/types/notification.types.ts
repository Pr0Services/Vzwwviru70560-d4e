/**
 * CHE·NU — Notification Types
 */

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'agent'
  | 'system'
  | 'mention'
  | 'task'
  | 'reminder';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  
  type: NotificationType;
  priority: NotificationPriority;
  
  title: string;
  message: string;
  
  source: {
    type: 'agent' | 'system' | 'user' | 'external';
    id?: string;
    name?: string;
  };
  
  action?: {
    type: 'link' | 'button' | 'dismiss';
    label: string;
    url?: string;
    callback?: string;
  };
  
  context?: {
    sphere_id?: string;
    thread_id?: string;
    project_id?: string;
  };
  
  read: boolean;
  read_at?: string;
  dismissed: boolean;
  
  created_at: string;
  expires_at?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  
  channels: {
    in_app: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  quiet_hours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  
  preferences: {
    [key in NotificationType]: {
      enabled: boolean;
      channels: ('in_app' | 'email' | 'push' | 'sms')[];
    };
  };
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}
