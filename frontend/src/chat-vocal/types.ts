// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — CHAT & VOCAL TYPES
// CANONICAL BLOCK — COPY/PASTE SAFE
// ═══════════════════════════════════════════════════════════════════════════════

/* =========================================================
   1. MESSAGE TYPES
========================================================= */

export type MessageType =
  | 'TASK'
  | 'NOTE'
  | 'COMMENT'
  | 'QUESTION'
  | 'DECISION'
  | 'VOICE_TRANSCRIPT';

export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MessageAttachment {
  id: string;
  type: 'file' | 'image' | 'document' | 'link';
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  threadId: string;
  
  // Content
  type: MessageType;
  content: string;
  
  // Source
  senderId: string;
  senderType: 'human' | 'agent' | 'system';
  senderName: string;
  senderAvatar?: string;
  
  // Target (optional)
  targetAgentIds?: string[];
  targetSphereId?: string;
  targetMeetingId?: string;
  
  // Metadata
  timestamp: number;
  status: MessageStatus;
  priority: MessagePriority;
  
  // Optional
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyToId?: string;
  editedAt?: number;
  
  // Voice specific
  voiceTranscript?: {
    originalAudio?: string;
    confidence: number;
    language: string;
    confirmedByUser: boolean;
  };
  
  // Task specific
  taskData?: {
    taskId: string;
    deadline?: number;
    assigneeIds?: string[];
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  };
}

/* =========================================================
   2. THREAD TYPES
========================================================= */

export type ThreadType = 'direct' | 'sphere' | 'meeting' | 'broadcast';

export interface Thread {
  id: string;
  type: ThreadType;
  
  // Context
  sphereId?: string;
  meetingId?: string;
  
  // Participants
  participantIds: string[];
  agentIds: string[];
  
  // State
  title?: string;
  lastMessageId?: string;
  lastMessageAt?: number;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
}

/* =========================================================
   3. AGENT INBOX TYPES
========================================================= */

export interface AgentInbox {
  agentId: string;
  agentName: string;
  
  // Counts
  totalMessages: number;
  unreadMessages: number;
  pendingTasks: number;
  
  // Recent
  lastMessageAt?: number;
  lastMessagePreview?: string;
  
  // State
  isOnline: boolean;
  isProcessing: boolean;
  currentTaskId?: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  
  // From message
  sourceMessageId: string;
  sourceThreadId: string;
  
  // Task details
  title: string;
  description: string;
  priority: MessagePriority;
  
  // State
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  
  // Timing
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  deadline?: number;
  
  // Output
  result?: {
    success: boolean;
    output?: string;
    error?: string;
    artifacts?: string[];
  };
}

/* =========================================================
   4. VOICE INPUT TYPES
========================================================= */

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'confirming'
  | 'error';

export interface VoiceSession {
  id: string;
  state: VoiceState;
  
  // Recording
  startedAt?: number;
  duration?: number;
  audioBlob?: Blob;
  
  // Transcription
  transcript?: string;
  confidence?: number;
  language?: string;
  
  // Alternatives
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
  
  // Error
  error?: {
    code: string;
    message: string;
  };
}

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxDuration: number;
  silenceTimeout: number;
  
  // Hotword
  hotwordEnabled: boolean;
  hotword?: string;
}

/* =========================================================
   5. CHAT CONFIG TYPES
========================================================= */

export interface ChatConfig {
  // Features
  voiceEnabled: boolean;
  attachmentsEnabled: boolean;
  reactionsEnabled: boolean;
  
  // Limits
  maxMessageLength: number;
  maxAttachments: number;
  maxAttachmentSize: number;
  
  // Voice
  voiceConfig: VoiceConfig;
  
  // Display
  showTimestamps: boolean;
  showAvatars: boolean;
  groupMessages: boolean;
  
  // Notifications
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

export const DEFAULT_CHAT_CONFIG: ChatConfig = {
  voiceEnabled: true,
  attachmentsEnabled: true,
  reactionsEnabled: true,
  
  maxMessageLength: 10000,
  maxAttachments: 5,
  maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  
  voiceConfig: {
    language: 'fr-CA',
    continuous: false,
    interimResults: true,
    maxDuration: 60000, // 1 minute
    silenceTimeout: 3000, // 3 seconds
    hotwordEnabled: false,
  },
  
  showTimestamps: true,
  showAvatars: true,
  groupMessages: true,
  
  soundEnabled: true,
  desktopNotifications: true,
};

/* =========================================================
   6. EVENTS
========================================================= */

export type ChatEvent =
  | { type: 'MESSAGE_SENT'; message: Message }
  | { type: 'MESSAGE_RECEIVED'; message: Message }
  | { type: 'MESSAGE_READ'; messageId: string; readerId: string }
  | { type: 'TYPING_START'; threadId: string; userId: string }
  | { type: 'TYPING_STOP'; threadId: string; userId: string }
  | { type: 'AGENT_ONLINE'; agentId: string }
  | { type: 'AGENT_OFFLINE'; agentId: string }
  | { type: 'TASK_CREATED'; task: AgentTask }
  | { type: 'TASK_UPDATED'; task: AgentTask }
  | { type: 'VOICE_START'; sessionId: string }
  | { type: 'VOICE_TRANSCRIPT'; sessionId: string; transcript: string }
  | { type: 'VOICE_END'; sessionId: string };

/* =========================================================
   7. API TYPES
========================================================= */

export interface SendMessageRequest {
  threadId: string;
  type: MessageType;
  content: string;
  targetAgentIds?: string[];
  attachments?: File[];
  replyToId?: string;
  priority?: MessagePriority;
}

export interface SendMessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface GetMessagesRequest {
  threadId: string;
  limit?: number;
  before?: string;
  after?: string;
}

export interface GetMessagesResponse {
  messages: Message[];
  hasMore: boolean;
  cursor?: string;
}

/* =========================================================
   8. EXPORTS
========================================================= */

export default {
  DEFAULT_CHAT_CONFIG,
};
