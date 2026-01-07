// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — AGENT INBOX SYSTEM
// TypeScript Types - Complete Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// ENUMS
// =============================================================================

export enum SenderType {
  USER = 'USER',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
}

export enum MessageType {
  TASK = 'TASK',
  NOTE = 'NOTE',
  COMMENT = 'COMMENT',
  QUESTION = 'QUESTION',
  DECISION = 'DECISION',
  VOICE_TRANSCRIPT = 'VOICE_TRANSCRIPT',
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum MessageStatus {
  NEW = 'NEW',
  READ = 'READ',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  ARCHIVED = 'ARCHIVED',
}

export enum TaskType {
  EXECUTE = 'EXECUTE',
  ANALYZE = 'ANALYZE',
  REVIEW = 'REVIEW',
  DECIDE = 'DECIDE',
  RESEARCH = 'RESEARCH',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskUpdateType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  COMMENT = 'COMMENT',
  RESULT = 'RESULT',
  BLOCKER = 'BLOCKER',
}

export enum VoiceRecordingStatus {
  PENDING = 'PENDING',
  TRANSCRIBED = 'TRANSCRIBED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum AuditAction {
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_READ = 'MESSAGE_READ',
  MESSAGE_ACKNOWLEDGED = 'MESSAGE_ACKNOWLEDGED',
  MESSAGE_ARCHIVED = 'MESSAGE_ARCHIVED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  VOICE_RECORDED = 'VOICE_RECORDED',
  VOICE_TRANSCRIBED = 'VOICE_TRANSCRIBED',
  VOICE_CONFIRMED = 'VOICE_CONFIRMED',
  VOICE_CANCELLED = 'VOICE_CANCELLED',
}

// =============================================================================
// CORE INTERFACES
// =============================================================================

/**
 * Agent Inbox - Every agent has ONE inbox per sphere
 */
export interface AgentInbox {
  id: string;
  sphereId: string;
  agentId: string;
  
  // Cached counts
  unreadCount: number;
  pendingTaskCount: number;
  
  // State
  lastActivityAt: string; // ISO DateTime
  isMuted: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Relations (when populated)
  agent?: AgentInfo;
  messages?: InboxMessage[];
  recentMessages?: InboxMessage[];
}

/**
 * Basic agent info for display
 */
export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  sphereId: string;
}

/**
 * Inbox Message - All communication flows through messages
 */
export interface InboxMessage {
  id: string;
  inboxId: string;
  
  // Sender
  senderType: SenderType;
  senderId: string;
  
  // Classification
  messageType: MessageType;
  priority: Priority;
  
  // Content
  contentText: string;
  contentSummary?: string;
  
  // Voice-specific
  voiceFileRef?: string;
  transcriptionConfidence?: number;
  requiresConfirmation: boolean;
  confirmedAt?: string;
  confirmedBy?: string;
  
  // Relations
  relatedTaskId?: string;
  relatedDecisionId?: string;
  
  // Threading
  parentMessageId?: string;
  threadId?: string;
  
  // Status
  status: MessageStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  
  // Relations (when populated)
  relatedTask?: Task;
  replies?: InboxMessage[];
  senderInfo?: SenderInfo;
}

/**
 * Sender information for display
 */
export interface SenderInfo {
  type: SenderType;
  id: string;
  name: string;
  avatar?: string;
}

/**
 * Task - Actionable work items
 */
export interface Task {
  id: string;
  sphereId: string;
  
  // Assignment
  assignedAgentId: string;
  createdByType: SenderType;
  createdById: string;
  
  // Content
  title: string;
  description: string;
  
  // Classification
  taskType: TaskType;
  priority: Priority;
  
  // Status
  status: TaskStatus;
  blockedReason?: string;
  
  // Result
  result?: string;
  resultArtifacts?: TaskArtifact[];
  
  // Timing
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  
  // Relations (when populated)
  assignedAgent?: AgentInfo;
  updates?: TaskUpdate[];
  sourceMessage?: InboxMessage;
}

/**
 * Task artifact/deliverable
 */
export interface TaskArtifact {
  id: string;
  type: 'document' | 'code' | 'image' | 'data' | 'link' | 'other';
  name: string;
  url?: string;
  content?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt: string;
}

/**
 * Task Update - Audit trail
 */
export interface TaskUpdate {
  id: string;
  taskId: string;
  
  // Actor
  actorType: SenderType;
  actorId: string;
  
  // Change
  updateType: TaskUpdateType;
  content: string;
  
  // Status change details
  previousStatus?: TaskStatus;
  newStatus?: TaskStatus;
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  // Timestamp
  createdAt: string;
  
  // Relations (when populated)
  actorInfo?: SenderInfo;
}

/**
 * Voice Recording - Temporary before confirmation
 */
export interface VoiceRecording {
  id: string;
  
  // Recording
  userId: string;
  targetAgentId: string;
  
  // Audio
  audioFileRef: string;
  durationSeconds: number;
  
  // Transcription
  rawTranscript?: string;
  cleanedTranscript?: string;
  summary?: string;
  transcriptionConfidence?: number;
  
  // AI Analysis
  detectedMessageType?: MessageType;
  detectedPriority?: Priority;
  extractedEntities?: ExtractedEntity[];
  
  // Status
  status: VoiceRecordingStatus;
  
  // Result
  confirmedAt?: string;
  resultMessageId?: string;
  
  // Timestamps
  createdAt: string;
  expiresAt: string;
}

/**
 * Extracted entity from voice/text
 */
export interface ExtractedEntity {
  type: 'person' | 'agent' | 'date' | 'time' | 'deadline' | 'project' | 'task' | 'priority' | 'sphere' | 'action';
  value: string;
  confidence: number;
  startIndex?: number;
  endIndex?: number;
}

/**
 * Audit Log Entry
 */
export interface InboxAuditLog {
  id: string;
  
  action: AuditAction;
  
  actorType: SenderType;
  actorId: string;
  
  entityType: 'INBOX' | 'MESSAGE' | 'TASK' | 'VOICE';
  entityId: string;
  
  details?: Record<string, unknown>;
  
  sphereId?: string;
  agentId?: string;
  
  createdAt: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  inboxId?: string;          // Optional if agentId provided
  agentId?: string;          // Optional if inboxId provided
  
  messageType: MessageType;
  priority?: Priority;       // Defaults to NORMAL
  
  contentText: string;
  
  // Optional
  parentMessageId?: string;  // For threading
  relatedTaskId?: string;
  
  // Voice-specific
  voiceRecordingId?: string; // If from voice
}

/**
 * Send Message Response
 */
export interface SendMessageResponse {
  success: boolean;
  message?: InboxMessage;
  task?: Task;               // If messageType was TASK
  error?: string;
}

/**
 * Acknowledge Message Request
 */
export interface AcknowledgeMessageRequest {
  messageId: string;
}

/**
 * Acknowledge Message Response
 */
export interface AcknowledgeMessageResponse {
  success: boolean;
  message?: InboxMessage;
  error?: string;
}

/**
 * Create Task Request
 */
export interface CreateTaskRequest {
  sphereId: string;
  assignedAgentId: string;
  
  title: string;
  description: string;
  
  taskType: TaskType;
  priority?: Priority;
  
  dueAt?: string;
  
  sourceMessageId?: string;
}

/**
 * Create Task Response
 */
export interface CreateTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

/**
 * Update Task Request
 */
export interface UpdateTaskRequest {
  taskId: string;
  
  status?: TaskStatus;
  blockedReason?: string;
  result?: string;
  resultArtifacts?: TaskArtifact[];
  
  // For adding update
  updateType?: TaskUpdateType;
  updateContent?: string;
}

/**
 * Update Task Response
 */
export interface UpdateTaskResponse {
  success: boolean;
  task?: Task;
  update?: TaskUpdate;
  error?: string;
}

/**
 * Submit Voice Request
 */
export interface SubmitVoiceRequest {
  targetAgentId: string;
  audioBlob: Blob;
  language?: string;
  context?: {
    currentSphere?: string;
    recentTopics?: string[];
  };
}

/**
 * Submit Voice Response
 */
export interface SubmitVoiceResponse {
  success: boolean;
  recording?: VoiceRecording;
  error?: string;
}

/**
 * Confirm Voice Request
 */
export interface ConfirmVoiceRequest {
  recordingId: string;
  editedContent?: string;
  messageType?: MessageType;
  priority?: Priority;
  createTask?: boolean;
}

/**
 * Confirm Voice Response
 */
export interface ConfirmVoiceResponse {
  success: boolean;
  message?: InboxMessage;
  task?: Task;
  error?: string;
}

/**
 * Get Inbox Request
 */
export interface GetInboxRequest {
  agentId: string;
  
  // Filters
  status?: MessageStatus[];
  messageType?: MessageType[];
  priority?: Priority[];
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get Inbox Response
 */
export interface GetInboxResponse {
  success: boolean;
  inbox?: AgentInbox;
  messages?: InboxMessage[];
  total?: number;
  error?: string;
}

/**
 * List Tasks Request
 */
export interface ListTasksRequest {
  // Filters
  sphereId?: string;
  assignedAgentId?: string;
  status?: TaskStatus[];
  taskType?: TaskType[];
  priority?: Priority[];
  
  // Date range
  dueBefore?: string;
  dueAfter?: string;
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: 'createdAt' | 'dueAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * List Tasks Response
 */
export interface ListTasksResponse {
  success: boolean;
  tasks?: Task[];
  total?: number;
  error?: string;
}

// =============================================================================
// UI COMPONENT PROPS
// =============================================================================

/**
 * Agent Inbox Card Props
 */
export interface AgentInboxCardProps {
  inbox: AgentInbox;
  agent: AgentInfo;
  onClick: () => void;
  onMuteToggle?: () => void;
}

/**
 * Message List Props
 */
export interface MessageListProps {
  messages: InboxMessage[];
  currentUserId: string;
  onMessageClick: (message: InboxMessage) => void;
  onAcknowledge: (messageId: string) => void;
  onReply: (message: InboxMessage) => void;
  onCreateTask: (message: InboxMessage) => void;
  groupByDate?: boolean;
}

/**
 * Message Composer Props
 */
export interface MessageComposerProps {
  targetAgent: AgentInfo;
  defaultType?: MessageType;
  onSend: (request: SendMessageRequest) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  disabled?: boolean;
}

/**
 * Task List Props
 */
export interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  sortBy?: 'createdAt' | 'dueAt' | 'priority';
  filterStatus?: TaskStatus[];
}

/**
 * Task Detail Props
 */
export interface TaskDetailProps {
  task: Task;
  updates: TaskUpdate[];
  onUpdate: (update: UpdateTaskRequest) => void;
  onAddComment: (content: string) => void;
}

/**
 * Voice Recorder Props
 */
export interface VoiceRecorderProps {
  targetAgentId: string;
  onRecordingComplete: (recording: VoiceRecording) => void;
  onError?: (error: Error) => void;
  maxDuration?: number;
}

/**
 * Voice Confirmation Dialog Props
 */
export interface VoiceConfirmationDialogProps {
  recording: VoiceRecording;
  onConfirm: (request: ConfirmVoiceRequest) => void;
  onEdit: (editedContent: string) => void;
  onCancel: () => void;
  onReRecord: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const MESSAGE_TYPE_CONFIG: Record<MessageType, {
  icon: string;
  label: string;
  color: string;
  createsTask: boolean;
}> = {
  [MessageType.TASK]: { icon: '📋', label: 'Tâche', color: '#0084ff', createsTask: true },
  [MessageType.NOTE]: { icon: '📝', label: 'Note', color: '#737373', createsTask: false },
  [MessageType.COMMENT]: { icon: '💬', label: 'Commentaire', color: '#525252', createsTask: false },
  [MessageType.QUESTION]: { icon: '❓', label: 'Question', color: '#f59e0b', createsTask: false },
  [MessageType.DECISION]: { icon: '✅', label: 'Décision', color: '#10b981', createsTask: false },
  [MessageType.VOICE_TRANSCRIPT]: { icon: '🎙️', label: 'Vocal', color: '#8b5cf6', createsTask: false },
};

export const PRIORITY_CONFIG: Record<Priority, {
  icon: string;
  label: string;
  color: string;
}> = {
  [Priority.LOW]: { icon: '○', label: 'Basse', color: '#a3a3a3' },
  [Priority.NORMAL]: { icon: '●', label: 'Normale', color: '#0084ff' },
  [Priority.HIGH]: { icon: '◉', label: 'Haute', color: '#f59e0b' },
  [Priority.CRITICAL]: { icon: '🔴', label: 'Critique', color: '#ef4444' },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  icon: string;
  label: string;
  color: string;
}> = {
  [TaskStatus.PENDING]: { icon: '⏳', label: 'En attente', color: '#a3a3a3' },
  [TaskStatus.IN_PROGRESS]: { icon: '🔄', label: 'En cours', color: '#0084ff' },
  [TaskStatus.BLOCKED]: { icon: '🚫', label: 'Bloquée', color: '#f59e0b' },
  [TaskStatus.COMPLETED]: { icon: '✅', label: 'Terminée', color: '#10b981' },
  [TaskStatus.CANCELLED]: { icon: '❌', label: 'Annulée', color: '#ef4444' },
};

export const TASK_TYPE_CONFIG: Record<TaskType, {
  icon: string;
  label: string;
}> = {
  [TaskType.EXECUTE]: { icon: '⚡', label: 'Exécuter' },
  [TaskType.ANALYZE]: { icon: '🔍', label: 'Analyser' },
  [TaskType.REVIEW]: { icon: '👁️', label: 'Réviser' },
  [TaskType.DECIDE]: { icon: '🤔', label: 'Décider' },
  [TaskType.RESEARCH]: { icon: '📚', label: 'Rechercher' },
};

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isTaskMessage(message: InboxMessage): boolean {
  return message.messageType === MessageType.TASK;
}

export function isVoiceMessage(message: InboxMessage): boolean {
  return message.messageType === MessageType.VOICE_TRANSCRIPT;
}

export function needsConfirmation(message: InboxMessage): boolean {
  return message.requiresConfirmation && !message.confirmedAt;
}

export function isHighPriority(item: { priority: Priority }): boolean {
  return item.priority === Priority.HIGH || item.priority === Priority.CRITICAL;
}

export function isTaskBlocked(task: Task): boolean {
  return task.status === TaskStatus.BLOCKED;
}

export function isTaskComplete(task: Task): boolean {
  return task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED;
}

export function canTransitionTo(current: TaskStatus, target: TaskStatus): boolean {
  const transitions: Record<TaskStatus, TaskStatus[]> = {
    [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
    [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.BLOCKED, TaskStatus.CANCELLED],
    [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
    [TaskStatus.COMPLETED]: [], // Terminal
    [TaskStatus.CANCELLED]: [], // Terminal
  };
  
  return transitions[current]?.includes(target) ?? false;
}
