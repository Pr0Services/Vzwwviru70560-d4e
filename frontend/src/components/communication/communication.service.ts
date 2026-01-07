/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU™ V50 — COMMUNICATION SERVICE                        ║
 * ║                                                                              ║
 * ║  Central service connecting all communication components:                    ║
 * ║                                                                              ║
 * ║  • Nova Intelligence API                                                     ║
 * ║  • Threads (.chenu) Management                                               ║
 * ║  • Emails — Unified inbox management                                         ║
 * ║  • Meetings Scheduling                                                       ║
 * ║  • Connected Apps — Third-party integrations                                 ║
 * ║  • Real-time Notifications                                                   ║
 * ║  • Voice Interface                                                           ║
 * ║                                                                              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { create } from 'zustand';
import { logger } from '@/utils/logger';
import { subscribeWithSelector } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Nova Types
export interface NovaMessage {
  id: string;
  role: 'user' | 'nova' | 'system';
  content: string;
  timestamp: string;
  threadId?: string;
  attachments?: NovaAttachment[];
  metadata?: {
    model?: string;
    tokensUsed?: number;
    latencyMs?: number;
    suggestions?: string[];
    checkpoint?: CheckpointInfo;
  };
}

export interface NovaAttachment {
  id: string;
  type: 'file' | 'image' | 'dataspace' | 'thread' | 'meeting';
  name: string;
  url?: string;
  referenceId?: string;
}

export interface CheckpointInfo {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  action: string;
  requiredApprover?: string;
}

// Thread Types
export interface ThreadSummary {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  scope: 'personal' | 'shared' | 'project';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  unreadCount: number;
  lastMessageAt: string;
  lastMessage: string;
  participants: string[];
  sphereId: string;
  sphereEmoji: string;
  projectId?: string;
  tokenBudget: number;
  tokensUsed: number;
}

// Meeting Types
export interface MeetingSummary {
  id: string;
  title: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  duration: number;
  meetingType: 'sync' | 'async' | 'hybrid' | 'xr_spatial';
  participantCount: number;
  isHost: boolean;
  sphereId: string;
  sphereEmoji: string;
  hasAgenda: boolean;
  tokenBudget: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'thread' | 'meeting' | 'task' | 'agent' | 'system' | 'mention' | 'checkpoint' | 'email' | 'app';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sphereId?: string;
  action?: {
    type: string;
    targetId: string;
    label: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  subject: string;
  preview: string;
  body?: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  attachmentCount?: number;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  labels: string[];
  accountId: string; // 'chenu' pour emails natifs, ou ID du provider
  accountName: string;
  priority: 'low' | 'normal' | 'high';
  threadId?: string; // Link to CHE·NU thread
  isInternal: boolean; // true = email CHE·NU natif
}

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: 'chenu' | 'gmail' | 'outlook' | 'icloud' | 'yahoo' | 'custom';
  icon: string;
  color: string;
  unreadCount: number;
  connected: boolean;
  lastSync: string;
  isNative: boolean; // true = boîte CHE·NU
  settings?: {
    syncFrequency: number; // minutes
    autoArchive: boolean;
    signature?: string;
  };
}

export interface EmailDraft {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: { name: string; size: number; type: string }[];
  accountId: string;
  savedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTED APPS TYPES
// ═══════════════════════════════════════════════════════════════════════════════
//
// IMPORTANT: Seules les apps avec API LÉGALES sont supportées
//
// ✅ API Légales:
//   - Slack, Discord (Bot API)
//   - WhatsApp Business API (entreprises seulement)
//   - SMS (via Twilio, Vonage)
//   - Messenger (Pages entreprise SEULEMENT)
//   - Teams, Zoom, Google Meet (Meeting APIs)
//
// ❌ API Illégales (non supportées):
//   - WhatsApp personnel
//   - Messenger personnel
//   - Instagram DMs personnel
// ═══════════════════════════════════════════════════════════════════════════════

export type AppCategory = 
  | 'messaging'      // Slack, Discord, WhatsApp Business, SMS, Messenger Business
  | 'meetings'       // Teams, Zoom, Google Meet, Webex
  | 'storage'        // Google Drive, Dropbox, OneDrive
  | 'productivity'   // Notion, Figma, Miro
  | 'project'        // Jira, Asana, Linear, Trello
  | 'developer'      // GitHub, GitLab, Bitbucket
  | 'calendar'       // Google Calendar, Outlook Calendar
  | 'crm';           // Salesforce, HubSpot

export interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  category: AppCategory;
  description: string;
  connected: boolean;
  lastSync?: string;
  unreadCount?: number;
  permissions: string[];
  color: string;
  status: 'active' | 'syncing' | 'error' | 'disconnected' | 'pending';
  hasOfficialAPI: boolean; // true = API légale officielle
  apiNote?: string; // Note sur les restrictions API
  authUrl?: string;
  webhookEnabled?: boolean;
  actions?: {
    id: string;
    label: string;
    icon: string;
  }[];
}

export interface AppMessage {
  id: string;
  appId: string;
  appName: string;
  appIcon: string;
  type: 'message' | 'mention' | 'notification' | 'task' | 'event' | 'update';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface AppIntegration {
  appId: string;
  sphereId?: string;
  autoSync: boolean;
  syncInterval: number; // minutes
  mappings?: {
    source: string;
    target: string;
    transform?: string;
  }[];
}

// Voice Types
export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error?: string;
}

// Connection Status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface CommunicationState {
  // Connection
  connectionStatus: ConnectionStatus;
  lastSync: string | null;
  
  // Nova
  novaMessages: NovaMessage[];
  novaIsTyping: boolean;
  novaContext: {
    currentSphereId: string | null;
    currentProjectId: string | null;
    activeThreadId: string | null;
  };
  
  // Threads
  threads: ThreadSummary[];
  threadsLoading: boolean;
  
  // Meetings
  meetings: MeetingSummary[];
  meetingsLoading: boolean;
  
  // Notifications
  notifications: Notification[];
  notificationsLoading: boolean;
  
  // Emails
  emails: Email[];
  emailsLoading: boolean;
  emailAccounts: EmailAccount[];
  selectedEmailAccount: string | null;
  selectedEmailFolder: Email['folder'];
  emailDrafts: EmailDraft[];
  
  // Connected Apps
  connectedApps: ConnectedApp[];
  appsLoading: boolean;
  appMessages: AppMessage[];
  selectedAppCategory: AppCategory | 'all';
  
  // Voice
  voice: VoiceState;
  
  // Actions - Nova
  sendMessageToNova: (content: string, attachments?: NovaAttachment[]) => Promise<void>;
  clearNovaHistory: () => void;
  setNovaContext: (context: Partial<CommunicationState['novaContext']>) => void;
  
  // Actions - Threads
  fetchThreads: (sphereId?: string) => Promise<void>;
  markThreadAsRead: (threadId: string) => void;
  updateThread: (threadId: string, updates: Partial<ThreadSummary>) => void;
  
  // Actions - Meetings
  fetchMeetings: (options?: { upcoming?: boolean; sphereId?: string }) => Promise<void>;
  joinMeeting: (meetingId: string) => Promise<string>;
  updateMeeting: (meetingId: string, updates: Partial<MeetingSummary>) => void;
  
  // Actions - Emails
  fetchEmails: (options?: { accountId?: string; folder?: Email['folder'] }) => Promise<void>;
  fetchEmailAccounts: () => Promise<void>;
  sendEmail: (email: Omit<Email, 'id' | 'timestamp' | 'read' | 'starred' | 'folder'>) => Promise<void>;
  markEmailAsRead: (emailId: string) => void;
  markEmailAsStarred: (emailId: string, starred: boolean) => void;
  moveEmail: (emailId: string, folder: Email['folder']) => void;
  deleteEmail: (emailId: string) => void;
  saveDraft: (draft: Omit<EmailDraft, 'id' | 'savedAt'>) => void;
  setSelectedEmailAccount: (accountId: string | null) => void;
  setSelectedEmailFolder: (folder: Email['folder']) => void;
  connectEmailAccount: (provider: EmailAccount['provider']) => Promise<void>;
  disconnectEmailAccount: (accountId: string) => void;
  syncEmailAccount: (accountId: string) => Promise<void>;
  
  // Actions - Connected Apps
  fetchConnectedApps: () => Promise<void>;
  fetchAppMessages: (appId?: string) => Promise<void>;
  connectApp: (appId: string) => Promise<void>;
  disconnectApp: (appId: string) => void;
  syncApp: (appId: string) => Promise<void>;
  markAppMessageAsRead: (messageId: string) => void;
  setSelectedAppCategory: (category: AppCategory | 'all') => void;
  
  // Actions - Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  
  // Actions - Voice
  startVoiceListening: () => Promise<void>;
  stopVoiceListening: () => void;
  processVoiceCommand: (transcript: string) => Promise<void>;
  
  // Actions - Connection
  connect: () => Promise<void>;
  disconnect: () => void;
  syncAll: () => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API SIMULATION — Replace with real API calls
// ═══════════════════════════════════════════════════════════════════════════════

const API = {
  // Nova
  async sendMessage(content: string, context: CommunicationState['novaContext']): Promise<NovaMessage> {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    
    // Simulate intelligent response based on content
    let responseContent = '';
    
    if (content.toLowerCase().includes('thread') || content.toLowerCase().includes('résumer')) {
      responseContent = `📊 Voici le résumé de vos threads actifs:\n\n• **Architecture V50** - 3 nouveaux messages, discussion sur ResizablePanels\n• **Budget Q1** - En attente de votre validation\n• **Personal Goals** - Nova a préparé 3 nouvelles suggestions\n\nVoulez-vous ouvrir un thread spécifique?`;
    } else if (content.toLowerCase().includes('réunion') || content.toLowerCase().includes('meeting')) {
      responseContent = `📅 Vos prochaines réunions:\n\n1. **Sprint Planning V50** - Dans 30 min (Vous êtes l'hôte)\n2. **Client Presentation** - Dans 3h\n3. **Team Retrospective** - Demain 14h\n\nJe peux vous aider à préparer l'une de ces réunions.`;
    } else if (content.toLowerCase().includes('tâche') || content.toLowerCase().includes('urgent')) {
      responseContent = `✅ Tâches prioritaires aujourd'hui:\n\n🔴 **Review PR #234** - Urgent, deadline 17h\n🟡 **Documentation V50** - En cours\n🟢 **Tests unitaires** - Planifié\n\nVoulez-vous que je crée un rappel ou que j'assigne une tâche?`;
    } else {
      responseContent = `Je comprends votre demande concernant "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}".\n\nVoici ce que je peux faire:\n\n• Analyser le contexte actuel\n• Proposer des actions basées sur votre historique\n• Créer des tâches ou threads liés\n\nQue souhaitez-vous faire?`;
    }
    
    return {
      id: `nova_${Date.now()}`,
      role: 'nova',
      content: responseContent,
      timestamp: new Date().toISOString(),
      threadId: context.activeThreadId || undefined,
      metadata: {
        model: 'claude-sonnet-4-20250514',
        tokensUsed: Math.floor(50 + Math.random() * 150),
        latencyMs: Math.floor(800 + Math.random() * 400),
        suggestions: ['Voir les détails', 'Créer une tâche', 'Planifier un suivi'],
      },
    };
  },
  
  // Threads
  async getThreads(sphereId?: string): Promise<ThreadSummary[]> {
    await new Promise(r => setTimeout(r, 300));
    
    const allThreads: ThreadSummary[] = [
      {
        id: 't1',
        title: 'Architecture V50 Discussion',
        status: 'active',
        scope: 'project',
        priority: 'high',
        unreadCount: 3,
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        lastMessage: 'Nova: Les composants ResizablePanels sont prêts pour review...',
        participants: ['Vous', 'Nova', 'Marc'],
        sphereId: 'business',
        sphereEmoji: '💼',
        tokenBudget: 5000,
        tokensUsed: 2340,
      },
      {
        id: 't2',
        title: 'Budget Q1 Analysis',
        status: 'active',
        scope: 'shared',
        priority: 'normal',
        unreadCount: 0,
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        lastMessage: 'Les projections montrent une croissance de 15%...',
        participants: ['Vous', 'Nova'],
        sphereId: 'business',
        sphereEmoji: '💼',
        tokenBudget: 2500,
        tokensUsed: 890,
      },
      {
        id: 't3',
        title: 'Personal Goals 2025',
        status: 'active',
        scope: 'personal',
        priority: 'normal',
        unreadCount: 1,
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastMessage: 'Nova a suggéré 3 nouvelles actions pour vos objectifs...',
        participants: ['Vous', 'Nova'],
        sphereId: 'personal',
        sphereEmoji: '🏠',
        tokenBudget: 1000,
        tokensUsed: 450,
      },
    ];
    
    if (sphereId) {
      return allThreads.filter(t => t.sphereId === sphereId);
    }
    return allThreads;
  },
  
  // Meetings
  async getMeetings(options?: { upcoming?: boolean; sphereId?: string }): Promise<MeetingSummary[]> {
    await new Promise(r => setTimeout(r, 300));
    
    const allMeetings: MeetingSummary[] = [
      {
        id: 'm1',
        title: 'Sprint Planning - V50',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        duration: 60,
        meetingType: 'sync',
        participantCount: 5,
        isHost: true,
        sphereId: 'business',
        sphereEmoji: '💼',
        hasAgenda: true,
        tokenBudget: 1000,
      },
      {
        id: 'm2',
        title: 'Client Presentation',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
        duration: 45,
        meetingType: 'hybrid',
        participantCount: 8,
        isHost: false,
        sphereId: 'business',
        sphereEmoji: '💼',
        hasAgenda: true,
        tokenBudget: 500,
      },
      {
        id: 'm3',
        title: 'Team Retrospective',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        duration: 30,
        meetingType: 'xr_spatial',
        participantCount: 4,
        isHost: true,
        sphereId: 'my_team',
        sphereEmoji: '🤝',
        hasAgenda: false,
        tokenBudget: 750,
      },
    ];
    
    let filtered = allMeetings;
    if (options?.sphereId) {
      filtered = filtered.filter(m => m.sphereId === options.sphereId);
    }
    if (options?.upcoming) {
      filtered = filtered.filter(m => new Date(m.scheduledAt) > new Date());
    }
    return filtered;
  },
  
  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await new Promise(r => setTimeout(r, 200));
    
    return [
      {
        id: 'n1',
        type: 'mention',
        title: 'Marc vous a mentionné',
        message: 'dans "Architecture V50 Discussion"',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        read: false,
        priority: 'high',
        sphereId: 'business',
        action: { type: 'open_thread', targetId: 't1', label: 'Voir' },
      },
      {
        id: 'n2',
        type: 'meeting',
        title: 'Réunion dans 30 min',
        message: 'Sprint Planning - V50',
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        read: false,
        priority: 'urgent',
        sphereId: 'business',
        action: { type: 'join_meeting', targetId: 'm1', label: 'Rejoindre' },
      },
      {
        id: 'n3',
        type: 'task',
        title: '3 tâches dues aujourd\'hui',
        message: 'Dont 1 urgente: Review PR #234',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
        priority: 'normal',
        action: { type: 'open_tasks', targetId: 'today', label: 'Voir les tâches' },
      },
      {
        id: 'n4',
        type: 'agent',
        title: 'Nova a terminé l\'analyse',
        message: 'Rapport de données Q4 disponible',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: true,
        priority: 'normal',
        action: { type: 'view_report', targetId: 'r1', label: 'Voir le rapport' },
      },
      {
        id: 'n5',
        type: 'checkpoint',
        title: 'Approbation requise',
        message: 'Nova demande l\'autorisation d\'exécuter une action',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        priority: 'high',
        action: { type: 'review_checkpoint', targetId: 'cp1', label: 'Examiner' },
      },
    ];
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EMAILS API
  // ═══════════════════════════════════════════════════════════════════════════
  
  async getEmailAccounts(): Promise<EmailAccount[]> {
    await new Promise(r => setTimeout(r, 200));
    return [
      {
        id: 'gmail1',
        name: 'Gmail Personnel',
        email: 'jo@gmail.com',
        provider: 'gmail',
        icon: '📧',
        color: '#EA4335',
        unreadCount: 12,
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
      {
        id: 'outlook1',
        name: 'Outlook Pro',
        email: 'jo@entreprise.com',
        provider: 'outlook',
        icon: '📨',
        color: '#0078D4',
        unreadCount: 5,
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 'icloud1',
        name: 'iCloud',
        email: 'jo@icloud.com',
        provider: 'icloud',
        icon: '☁️',
        color: '#3693F3',
        unreadCount: 0,
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ];
  },
  
  async getEmails(options?: { accountId?: string; folder?: Email['folder'] }): Promise<Email[]> {
    await new Promise(r => setTimeout(r, 300));
    
    const allEmails: Email[] = [
      {
        id: 'e1',
        from: { name: 'Marc Dupont', email: 'marc@entreprise.com' },
        to: ['jo@entreprise.com'],
        subject: 'RE: Review des composants V50',
        preview: 'J\'ai terminé la review des ResizablePanels. Quelques suggestions...',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
        starred: true,
        hasAttachments: true,
        attachmentCount: 2,
        folder: 'inbox',
        labels: ['work', 'important'],
        accountId: 'outlook1',
        accountName: 'Outlook Pro',
        priority: 'high',
      },
      {
        id: 'e2',
        from: { name: 'GitHub', email: 'noreply@github.com' },
        to: ['jo@gmail.com'],
        subject: '[CHE-NU/v50] PR #234 needs your review',
        preview: 'jonathandumont requested your review on Pull Request #234...',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: false,
        starred: false,
        hasAttachments: false,
        folder: 'inbox',
        labels: ['github', 'dev'],
        accountId: 'gmail1',
        accountName: 'Gmail Personnel',
        priority: 'normal',
      },
      {
        id: 'e3',
        from: { name: 'Client Important', email: 'contact@bigclient.com' },
        to: ['jo@entreprise.com'],
        subject: 'Confirmation réunion de demain',
        preview: 'Bonjour, je confirme notre réunion de demain à 14h...',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        starred: true,
        hasAttachments: true,
        attachmentCount: 1,
        folder: 'inbox',
        labels: ['client'],
        accountId: 'outlook1',
        accountName: 'Outlook Pro',
        priority: 'high',
      },
      {
        id: 'e4',
        from: { name: 'Newsletter Tech', email: 'news@techdigest.com' },
        to: ['jo@gmail.com'],
        subject: 'Les tendances AI 2025',
        preview: 'Cette semaine: LLMs, Agents autonomes, et gouvernance IA...',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
        starred: false,
        hasAttachments: false,
        folder: 'inbox',
        labels: ['newsletter'],
        accountId: 'gmail1',
        accountName: 'Gmail Personnel',
        priority: 'low',
      },
    ];
    
    let filtered = allEmails;
    if (options?.accountId) {
      filtered = filtered.filter(e => e.accountId === options.accountId);
    }
    if (options?.folder) {
      filtered = filtered.filter(e => e.folder === options.folder);
    }
    return filtered;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTED APPS API
  // ═══════════════════════════════════════════════════════════════════════════
  
  async getConnectedApps(): Promise<ConnectedApp[]> {
    await new Promise(r => setTimeout(r, 200));
    return [
      {
        id: 'slack',
        name: 'Slack',
        icon: '💬',
        category: 'communication',
        description: 'Messagerie d\'équipe',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        unreadCount: 8,
        permissions: ['read_messages', 'send_messages', 'read_channels'],
        color: '#4A154B',
        status: 'active',
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: '👥',
        category: 'communication',
        description: 'Collaboration Microsoft',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        unreadCount: 3,
        permissions: ['read_messages', 'send_messages', 'read_calendar'],
        color: '#6264A7',
        status: 'active',
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: '🎮',
        category: 'communication',
        description: 'Communautés et gaming',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        unreadCount: 15,
        permissions: ['read_messages', 'send_messages'],
        color: '#5865F2',
        status: 'active',
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: '📝',
        category: 'productivity',
        description: 'Notes et documentation',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        permissions: ['read_pages', 'write_pages'],
        color: '#000000',
        status: 'active',
      },
      {
        id: 'gdrive',
        name: 'Google Drive',
        icon: '📁',
        category: 'storage',
        description: 'Stockage cloud Google',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        permissions: ['read_files', 'write_files'],
        color: '#4285F4',
        status: 'syncing',
      },
      {
        id: 'dropbox',
        name: 'Dropbox',
        icon: '📦',
        category: 'storage',
        description: 'Stockage cloud Dropbox',
        connected: false,
        permissions: [],
        color: '#0061FF',
        status: 'disconnected',
      },
      {
        id: 'gcal',
        name: 'Google Calendar',
        icon: '📅',
        category: 'calendar',
        description: 'Calendrier Google',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        permissions: ['read_events', 'write_events'],
        color: '#4285F4',
        status: 'active',
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: '🐙',
        category: 'developer',
        description: 'Repositories et PRs',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        unreadCount: 4,
        permissions: ['read_repos', 'read_notifications'],
        color: '#24292E',
        status: 'active',
      },
      {
        id: 'jira',
        name: 'Jira',
        icon: '🎯',
        category: 'project',
        description: 'Gestion de projet Atlassian',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        unreadCount: 2,
        permissions: ['read_issues', 'write_issues'],
        color: '#0052CC',
        status: 'active',
      },
      {
        id: 'figma',
        name: 'Figma',
        icon: '🎨',
        category: 'productivity',
        description: 'Design collaboratif',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        permissions: ['read_files'],
        color: '#F24E1E',
        status: 'active',
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        icon: '☁️',
        category: 'crm',
        description: 'CRM et ventes',
        connected: false,
        permissions: [],
        color: '#00A1E0',
        status: 'disconnected',
      },
    ];
  },
  
  async getAppMessages(appId?: string): Promise<AppMessage[]> {
    await new Promise(r => setTimeout(r, 250));
    
    const allMessages: AppMessage[] = [
      {
        id: 'am1',
        appId: 'slack',
        appName: 'Slack',
        appIcon: '💬',
        type: 'mention',
        title: '@vous dans #dev-team',
        content: 'Marc: @jo peux-tu regarder le PR quand tu as un moment?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        sender: { name: 'Marc Dupont' },
      },
      {
        id: 'am2',
        appId: 'github',
        appName: 'GitHub',
        appIcon: '🐙',
        type: 'notification',
        title: 'PR #234 approved',
        content: 'Your pull request has been approved by 2 reviewers',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        actionUrl: 'https://github.com/che-nu/v50/pull/234',
      },
      {
        id: 'am3',
        appId: 'jira',
        appName: 'Jira',
        appIcon: '🎯',
        type: 'task',
        title: 'CHENU-456 assigned to you',
        content: 'Implement ResizablePanels component',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: true,
      },
      {
        id: 'am4',
        appId: 'teams',
        appName: 'Teams',
        appIcon: '👥',
        type: 'message',
        title: 'Message de Sophie',
        content: 'Hey! Tu as vu le nouveau design?',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        read: true,
        sender: { name: 'Sophie Martin' },
      },
      {
        id: 'am5',
        appId: 'gcal',
        appName: 'Google Calendar',
        appIcon: '📅',
        type: 'event',
        title: 'Rappel: Sprint Planning dans 1h',
        content: 'Sprint Planning - V50 avec 5 participants',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: false,
      },
      {
        id: 'am6',
        appId: 'discord',
        appName: 'Discord',
        appIcon: '🎮',
        type: 'mention',
        title: 'Mention dans #general',
        content: '@jo check out this new AI tool!',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        read: false,
        sender: { name: 'DevCommunity' },
      },
    ];
    
    if (appId) {
      return allMessages.filter(m => m.appId === appId);
    }
    return allMessages;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const useCommunicationStore = create<CommunicationState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    connectionStatus: 'disconnected',
    lastSync: null,
    
    novaMessages: [
      {
        id: 'welcome',
        role: 'nova',
        content: 'Bonjour! 👋 Je suis Nova, votre intelligence système. Comment puis-je vous aider aujourd\'hui?',
        timestamp: new Date().toISOString(),
        metadata: {
          suggestions: ['Résumer mes threads actifs', 'Prochaines réunions', 'Tâches prioritaires'],
        },
      },
    ],
    novaIsTyping: false,
    novaContext: {
      currentSphereId: null,
      currentProjectId: null,
      activeThreadId: null,
    },
    
    threads: [],
    threadsLoading: false,
    
    meetings: [],
    meetingsLoading: false,
    
    notifications: [],
    notificationsLoading: false,
    
    // Emails
    emails: [],
    emailsLoading: false,
    emailAccounts: [],
    selectedEmailAccount: null,
    selectedEmailFolder: 'inbox',
    emailDrafts: [],
    
    // Connected Apps
    connectedApps: [],
    appsLoading: false,
    appMessages: [],
    selectedAppCategory: 'all',
    
    voice: {
      isListening: false,
      isProcessing: false,
      transcript: '',
      confidence: 0,
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Nova Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    sendMessageToNova: async (content: string, attachments?: NovaAttachment[]) => {
      const userMessage: NovaMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        attachments,
      };
      
      set(state => ({
        novaMessages: [...state.novaMessages, userMessage],
        novaIsTyping: true,
      }));
      
      try {
        const response = await API.sendMessage(content, get().novaContext);
        set(state => ({
          novaMessages: [...state.novaMessages, response],
          novaIsTyping: false,
        }));
      } catch (error) {
        const errorMessage: NovaMessage = {
          id: `error_${Date.now()}`,
          role: 'system',
          content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          novaMessages: [...state.novaMessages, errorMessage],
          novaIsTyping: false,
        }));
      }
    },
    
    clearNovaHistory: () => {
      set({
        novaMessages: [
          {
            id: 'welcome_new',
            role: 'nova',
            content: 'Historique effacé. Comment puis-je vous aider?',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    },
    
    setNovaContext: (context) => {
      set(state => ({
        novaContext: { ...state.novaContext, ...context },
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Threads Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    fetchThreads: async (sphereId?: string) => {
      set({ threadsLoading: true });
      try {
        const threads = await API.getThreads(sphereId);
        set({ threads, threadsLoading: false });
      } catch (error) {
        logger.error('Failed to fetch threads:', error);
        set({ threadsLoading: false });
      }
    },
    
    markThreadAsRead: (threadId: string) => {
      set(state => ({
        threads: state.threads.map(t =>
          t.id === threadId ? { ...t, unreadCount: 0 } : t
        ),
      }));
    },
    
    updateThread: (threadId: string, updates: Partial<ThreadSummary>) => {
      set(state => ({
        threads: state.threads.map(t =>
          t.id === threadId ? { ...t, ...updates } : t
        ),
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Meetings Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    fetchMeetings: async (options?) => {
      set({ meetingsLoading: true });
      try {
        const meetings = await API.getMeetings(options);
        set({ meetings, meetingsLoading: false });
      } catch (error) {
        logger.error('Failed to fetch meetings:', error);
        set({ meetingsLoading: false });
      }
    },
    
    joinMeeting: async (meetingId: string) => {
      // TODO: Implement actual meeting join logic
      logger.debug('Joining meeting:', meetingId);
      return `https://meet.chenu.ai/${meetingId}`;
    },
    
    updateMeeting: (meetingId: string, updates: Partial<MeetingSummary>) => {
      set(state => ({
        meetings: state.meetings.map(m =>
          m.id === meetingId ? { ...m, ...updates } : m
        ),
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Notifications Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    fetchNotifications: async () => {
      set({ notificationsLoading: true });
      try {
        const notifications = await API.getNotifications();
        set({ notifications, notificationsLoading: false });
      } catch (error) {
        logger.error('Failed to fetch notifications:', error);
        set({ notificationsLoading: false });
      }
    },
    
    markNotificationAsRead: (notificationId: string) => {
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    },
    
    markAllNotificationsAsRead: () => {
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      }));
    },
    
    dismissNotification: (notificationId: string) => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
      }));
    },
    
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      set(state => ({
        notifications: [newNotification, ...state.notifications],
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Email Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    fetchEmails: async (options) => {
      set({ emailsLoading: true });
      try {
        const emails = await API.getEmails(options);
        set({ emails, emailsLoading: false });
      } catch (error) {
        logger.error('Failed to fetch emails:', error);
        set({ emailsLoading: false });
      }
    },
    
    fetchEmailAccounts: async () => {
      try {
        const emailAccounts = await API.getEmailAccounts();
        set({ emailAccounts });
      } catch (error) {
        logger.error('Failed to fetch email accounts:', error);
      }
    },
    
    sendEmail: async (email) => {
      // TODO: Implement real email sending
      logger.debug('Sending email:', email);
      await new Promise(r => setTimeout(r, 500));
      
      // Add to sent folder
      const sentEmail: Email = {
        ...email,
        id: `email_${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: true,
        starred: false,
        folder: 'sent',
      };
      set(state => ({
        emails: [...state.emails, sentEmail],
      }));
    },
    
    markEmailAsRead: (emailId) => {
      set(state => ({
        emails: state.emails.map(e =>
          e.id === emailId ? { ...e, read: true } : e
        ),
        emailAccounts: state.emailAccounts.map(acc => {
          const email = state.emails.find(e => e.id === emailId);
          if (email && email.accountId === acc.id && !email.read) {
            return { ...acc, unreadCount: Math.max(0, acc.unreadCount - 1) };
          }
          return acc;
        }),
      }));
    },
    
    markEmailAsStarred: (emailId, starred) => {
      set(state => ({
        emails: state.emails.map(e =>
          e.id === emailId ? { ...e, starred } : e
        ),
      }));
    },
    
    moveEmail: (emailId, folder) => {
      set(state => ({
        emails: state.emails.map(e =>
          e.id === emailId ? { ...e, folder } : e
        ),
      }));
    },
    
    deleteEmail: (emailId) => {
      set(state => ({
        emails: state.emails.filter(e => e.id !== emailId),
      }));
    },
    
    saveDraft: (draft) => {
      const newDraft: EmailDraft = {
        ...draft,
        id: `draft_${Date.now()}`,
        savedAt: new Date().toISOString(),
      };
      set(state => ({
        emailDrafts: [...state.emailDrafts, newDraft],
      }));
    },
    
    setSelectedEmailAccount: (accountId) => {
      set({ selectedEmailAccount: accountId });
    },
    
    setSelectedEmailFolder: (folder) => {
      set({ selectedEmailFolder: folder });
    },
    
    connectEmailAccount: async (provider) => {
      // TODO: Implement OAuth flow
      logger.debug('Connecting email account:', provider);
      await new Promise(r => setTimeout(r, 1000));
    },
    
    disconnectEmailAccount: (accountId) => {
      set(state => ({
        emailAccounts: state.emailAccounts.map(acc =>
          acc.id === accountId ? { ...acc, connected: false } : acc
        ),
      }));
    },
    
    syncEmailAccount: async (accountId) => {
      // TODO: Implement real sync
      logger.debug('Syncing email account:', accountId);
      await new Promise(r => setTimeout(r, 500));
      set(state => ({
        emailAccounts: state.emailAccounts.map(acc =>
          acc.id === accountId 
            ? { ...acc, lastSync: new Date().toISOString() } 
            : acc
        ),
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Connected Apps Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    fetchConnectedApps: async () => {
      set({ appsLoading: true });
      try {
        const connectedApps = await API.getConnectedApps();
        set({ connectedApps, appsLoading: false });
      } catch (error) {
        logger.error('Failed to fetch connected apps:', error);
        set({ appsLoading: false });
      }
    },
    
    fetchAppMessages: async (appId) => {
      try {
        const appMessages = await API.getAppMessages(appId);
        set({ appMessages });
      } catch (error) {
        logger.error('Failed to fetch app messages:', error);
      }
    },
    
    connectApp: async (appId) => {
      // TODO: Implement OAuth flow for each app
      logger.debug('Connecting app:', appId);
      set(state => ({
        connectedApps: state.connectedApps.map(app =>
          app.id === appId 
            ? { ...app, status: 'pending' } 
            : app
        ),
      }));
      
      await new Promise(r => setTimeout(r, 1500));
      
      set(state => ({
        connectedApps: state.connectedApps.map(app =>
          app.id === appId 
            ? { 
                ...app, 
                connected: true, 
                status: 'active',
                lastSync: new Date().toISOString(),
              } 
            : app
        ),
      }));
    },
    
    disconnectApp: (appId) => {
      set(state => ({
        connectedApps: state.connectedApps.map(app =>
          app.id === appId 
            ? { ...app, connected: false, status: 'disconnected' } 
            : app
        ),
      }));
    },
    
    syncApp: async (appId) => {
      set(state => ({
        connectedApps: state.connectedApps.map(app =>
          app.id === appId ? { ...app, status: 'syncing' } : app
        ),
      }));
      
      await new Promise(r => setTimeout(r, 1000));
      
      // Fetch new messages for this app
      const appMessages = await API.getAppMessages(appId);
      
      set(state => ({
        connectedApps: state.connectedApps.map(app =>
          app.id === appId 
            ? { ...app, status: 'active', lastSync: new Date().toISOString() } 
            : app
        ),
        appMessages: [
          ...state.appMessages.filter(m => m.appId !== appId),
          ...appMessages,
        ],
      }));
    },
    
    markAppMessageAsRead: (messageId) => {
      set(state => ({
        appMessages: state.appMessages.map(m =>
          m.id === messageId ? { ...m, read: true } : m
        ),
        connectedApps: state.connectedApps.map(app => {
          const message = state.appMessages.find(m => m.id === messageId);
          if (message && message.appId === app.id && !message.read && app.unreadCount) {
            return { ...app, unreadCount: Math.max(0, app.unreadCount - 1) };
          }
          return app;
        }),
      }));
    },
    
    setSelectedAppCategory: (category) => {
      set({ selectedAppCategory: category });
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Voice Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    startVoiceListening: async () => {
      // TODO: Implement Web Speech API integration
      set(state => ({
        voice: { ...state.voice, isListening: true, transcript: '', error: undefined },
      }));
      logger.debug('Voice listening started...');
    },
    
    stopVoiceListening: () => {
      set(state => ({
        voice: { ...state.voice, isListening: false },
      }));
      logger.debug('Voice listening stopped');
    },
    
    processVoiceCommand: async (transcript: string) => {
      set(state => ({
        voice: { ...state.voice, isProcessing: true, transcript },
      }));
      
      // Send to Nova
      await get().sendMessageToNova(transcript);
      
      set(state => ({
        voice: { ...state.voice, isProcessing: false },
      }));
    },
    
    // ─────────────────────────────────────────────────────────────────────────
    // Connection Actions
    // ─────────────────────────────────────────────────────────────────────────
    
    connect: async () => {
      set({ connectionStatus: 'connecting' });
      try {
        // Simulate connection
        await new Promise(r => setTimeout(r, 500));
        set({ connectionStatus: 'connected' });
        
        // Initial sync
        await get().syncAll();
      } catch (error) {
        logger.error('Connection failed:', error);
        set({ connectionStatus: 'error' });
      }
    },
    
    disconnect: () => {
      set({ connectionStatus: 'disconnected' });
    },
    
    syncAll: async () => {
      const { 
        fetchThreads, 
        fetchMeetings, 
        fetchNotifications,
        fetchEmails,
        fetchEmailAccounts,
        fetchConnectedApps,
        fetchAppMessages,
      } = get();
      
      await Promise.all([
        fetchThreads(),
        fetchMeetings({ upcoming: true }),
        fetchNotifications(),
        fetchEmails(),
        fetchEmailAccounts(),
        fetchConnectedApps(),
        fetchAppMessages(),
      ]);
      
      set({ lastSync: new Date().toISOString() });
    },
  }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const useNovaMessages = () => useCommunicationStore(s => s.novaMessages);
export const useNovaIsTyping = () => useCommunicationStore(s => s.novaIsTyping);
export const useNovaContext = () => useCommunicationStore(s => s.novaContext);

export const useThreads = () => useCommunicationStore(s => s.threads);
export const useThreadsLoading = () => useCommunicationStore(s => s.threadsLoading);
export const useUnreadThreadsCount = () => useCommunicationStore(s => 
  s.threads.reduce((sum, t) => sum + t.unreadCount, 0)
);

export const useMeetings = () => useCommunicationStore(s => s.meetings);
export const useMeetingsLoading = () => useCommunicationStore(s => s.meetingsLoading);
export const useUpcomingMeetingsCount = () => useCommunicationStore(s =>
  s.meetings.filter(m => new Date(m.scheduledAt) > new Date()).length
);

// Email Selectors
export const useEmails = () => useCommunicationStore(s => s.emails);
export const useEmailsLoading = () => useCommunicationStore(s => s.emailsLoading);
export const useEmailAccounts = () => useCommunicationStore(s => s.emailAccounts);
export const useSelectedEmailAccount = () => useCommunicationStore(s => s.selectedEmailAccount);
export const useSelectedEmailFolder = () => useCommunicationStore(s => s.selectedEmailFolder);
export const useEmailDrafts = () => useCommunicationStore(s => s.emailDrafts);
export const useUnreadEmailsCount = () => useCommunicationStore(s =>
  s.emails.filter(e => !e.read && e.folder === 'inbox').length
);
export const useFilteredEmails = () => useCommunicationStore(s => {
  let emails = s.emails;
  if (s.selectedEmailAccount) {
    emails = emails.filter(e => e.accountId === s.selectedEmailAccount);
  }
  return emails.filter(e => e.folder === s.selectedEmailFolder);
});

// Connected Apps Selectors
export const useConnectedApps = () => useCommunicationStore(s => s.connectedApps);
export const useAppsLoading = () => useCommunicationStore(s => s.appsLoading);
export const useAppMessages = () => useCommunicationStore(s => s.appMessages);
export const useSelectedAppCategory = () => useCommunicationStore(s => s.selectedAppCategory);
export const useUnreadAppMessagesCount = () => useCommunicationStore(s =>
  s.appMessages.filter(m => !m.read).length
);
export const useFilteredApps = () => useCommunicationStore(s => {
  if (s.selectedAppCategory === 'all') return s.connectedApps;
  return s.connectedApps.filter(app => app.category === s.selectedAppCategory);
});
export const useConnectedAppsCount = () => useCommunicationStore(s =>
  s.connectedApps.filter(app => app.connected).length
);

export const useNotifications = () => useCommunicationStore(s => s.notifications);
export const useUnreadNotificationsCount = () => useCommunicationStore(s =>
  s.notifications.filter(n => !n.read).length
);

export const useVoiceState = () => useCommunicationStore(s => s.voice);
export const useConnectionStatus = () => useCommunicationStore(s => s.connectionStatus);

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to initialize communication system
 */
export const useCommunicationInit = () => {
  const connect = useCommunicationStore(s => s.connect);
  const connectionStatus = useCommunicationStore(s => s.connectionStatus);
  
  return {
    connect,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
  };
};

/**
 * Hook for Nova chat functionality
 */
export const useNovaChat = () => {
  const messages = useNovaMessages();
  const isTyping = useNovaIsTyping();
  const sendMessage = useCommunicationStore(s => s.sendMessageToNova);
  const clearHistory = useCommunicationStore(s => s.clearNovaHistory);
  const setContext = useCommunicationStore(s => s.setNovaContext);
  
  return {
    messages,
    isTyping,
    sendMessage,
    clearHistory,
    setContext,
  };
};

/**
 * Hook for notification actions
 */
export const useNotificationActions = () => {
  const markAsRead = useCommunicationStore(s => s.markNotificationAsRead);
  const markAllAsRead = useCommunicationStore(s => s.markAllNotificationsAsRead);
  const dismiss = useCommunicationStore(s => s.dismissNotification);
  const add = useCommunicationStore(s => s.addNotification);
  
  return {
    markAsRead,
    markAllAsRead,
    dismiss,
    add,
  };
};

/**
 * Hook for email functionality
 */
export const useEmailActions = () => {
  const emails = useEmails();
  const filteredEmails = useFilteredEmails();
  const accounts = useEmailAccounts();
  const loading = useEmailsLoading();
  const unreadCount = useUnreadEmailsCount();
  const selectedAccount = useSelectedEmailAccount();
  const selectedFolder = useSelectedEmailFolder();
  
  const fetchEmails = useCommunicationStore(s => s.fetchEmails);
  const fetchAccounts = useCommunicationStore(s => s.fetchEmailAccounts);
  const sendEmail = useCommunicationStore(s => s.sendEmail);
  const markAsRead = useCommunicationStore(s => s.markEmailAsRead);
  const markAsStarred = useCommunicationStore(s => s.markEmailAsStarred);
  const moveEmail = useCommunicationStore(s => s.moveEmail);
  const deleteEmail = useCommunicationStore(s => s.deleteEmail);
  const setSelectedAccount = useCommunicationStore(s => s.setSelectedEmailAccount);
  const setSelectedFolder = useCommunicationStore(s => s.setSelectedEmailFolder);
  const connectAccount = useCommunicationStore(s => s.connectEmailAccount);
  const disconnectAccount = useCommunicationStore(s => s.disconnectEmailAccount);
  const syncAccount = useCommunicationStore(s => s.syncEmailAccount);
  
  return {
    emails,
    filteredEmails,
    accounts,
    loading,
    unreadCount,
    selectedAccount,
    selectedFolder,
    fetchEmails,
    fetchAccounts,
    sendEmail,
    markAsRead,
    markAsStarred,
    moveEmail,
    deleteEmail,
    setSelectedAccount,
    setSelectedFolder,
    connectAccount,
    disconnectAccount,
    syncAccount,
  };
};

/**
 * Hook for connected apps functionality
 */
export const useConnectedAppsActions = () => {
  const apps = useConnectedApps();
  const filteredApps = useFilteredApps();
  const messages = useAppMessages();
  const loading = useAppsLoading();
  const unreadCount = useUnreadAppMessagesCount();
  const connectedCount = useConnectedAppsCount();
  const selectedCategory = useSelectedAppCategory();
  
  const fetchApps = useCommunicationStore(s => s.fetchConnectedApps);
  const fetchMessages = useCommunicationStore(s => s.fetchAppMessages);
  const connectApp = useCommunicationStore(s => s.connectApp);
  const disconnectApp = useCommunicationStore(s => s.disconnectApp);
  const syncApp = useCommunicationStore(s => s.syncApp);
  const markMessageAsRead = useCommunicationStore(s => s.markAppMessageAsRead);
  const setSelectedCategory = useCommunicationStore(s => s.setSelectedAppCategory);
  
  return {
    apps,
    filteredApps,
    messages,
    loading,
    unreadCount,
    connectedCount,
    selectedCategory,
    fetchApps,
    fetchMessages,
    connectApp,
    disconnectApp,
    syncApp,
    markMessageAsRead,
    setSelectedCategory,
  };
};

/**
 * Hook for all communication counts (badge display)
 */
export const useCommunicationCounts = () => {
  const threadsUnread = useUnreadThreadsCount();
  const emailsUnread = useUnreadEmailsCount();
  const appsUnread = useUnreadAppMessagesCount();
  const notificationsUnread = useCommunicationStore(s => 
    s.notifications.filter(n => !n.read).length
  );
  const meetingsUpcoming = useUpcomingMeetingsCount();
  
  return {
    threads: threadsUnread,
    emails: emailsUnread,
    apps: appsUnread,
    notifications: notificationsUnread,
    meetings: meetingsUpcoming,
    total: threadsUnread + emailsUnread + appsUnread + notificationsUnread,
  };
};

export default useCommunicationStore;
