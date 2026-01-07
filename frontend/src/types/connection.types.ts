/**
 * CHE·NU — External Connection Types
 */

export type ConnectionProvider = 
  // Storage
  | 'google_drive'
  | 'dropbox'
  | 'onedrive'
  | 'box'
  // Calendar
  | 'google_calendar'
  | 'outlook_calendar'
  // Email
  | 'gmail'
  | 'outlook_mail'
  // Communication
  | 'slack'
  | 'discord'
  | 'teams'
  // Productivity
  | 'notion'
  | 'trello'
  | 'asana'
  // Development
  | 'github'
  | 'gitlab';

export interface ExternalConnection {
  id: string;
  user_id: string;
  provider: ConnectionProvider;
  provider_account_id: string;
  provider_email?: string;
  
  status: 'active' | 'expired' | 'revoked' | 'error';
  last_sync?: string;
  last_error?: string;
  
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    sync_enabled: boolean;
    sync_frequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  };
  
  scopes: string[];
  
  created_at: string;
  updated_at: string;
}

export interface ProviderInfo {
  id: ConnectionProvider;
  name: string;
  icon: string;
  color: string;
  category: 'storage' | 'calendar' | 'email' | 'communication' | 'productivity' | 'development';
  description: string;
  scopes: string[];
}
