/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — WEBSOCKET TYPES                             ║
 * ║                    Type-safe WebSocket Communication                          ║
 * ║                    Task A9/A10: Agent Alpha Roadmap                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * This file provides type-safe definitions for all WebSocket messages
 * to eliminate `any` types from WebSocketProvider.tsx
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BASE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Base WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
  type: string
  payload: T
  timestamp: string
  requestId?: string
}

/**
 * Generic subscriber callback
 */
export type WebSocketSubscriber<T = unknown> = (payload: T) => void

/**
 * Subscription cleanup function
 */
export type Unsubscribe = () => void

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ThreadUpdatedPayload {
  id: string
  title?: string
  status?: 'active' | 'archived' | 'deleted'
  updated_at: string
  updated_by?: string
  sphere_id?: string
  metadata?: Record<string, unknown>
}

export interface ThreadActivityPayload {
  thread_id: string
  activity_type: 'message' | 'edit' | 'reaction' | 'attachment' | 'mention'
  actor_id: string
  actor_name?: string
  content?: string
  timestamp: string
}

export interface ThreadMessagePayload {
  thread_id: string
  message_id: string
  content: string
  sender_id: string
  sender_name?: string
  timestamp: string
  attachments?: Array<{
    id: string
    type: string
    url: string
    name: string
  }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT TASK MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentTaskStartPayload {
  task_id: string
  agent_id: string
  agent_name: string
  task_type: string
  description: string
  started_at: string
  estimated_tokens?: number
  requires_checkpoint?: boolean
}

export interface AgentTaskProgressPayload {
  task_id: string
  agent_id: string
  progress: number // 0-100
  current_step?: string
  tokens_used?: number
  message?: string
}

export interface AgentTaskCompletePayload {
  task_id: string
  agent_id: string
  status: 'success' | 'partial' | 'skipped'
  result?: unknown
  tokens_used: number
  completed_at: string
  duration_ms: number
}

export interface AgentTaskErrorPayload {
  task_id: string
  agent_id: string
  error_code: string
  error_message: string
  recoverable: boolean
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// USER PRESENCE MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface UserPresencePayload {
  user_id: string
  user_name: string
  avatar_url?: string
  status: 'online' | 'away' | 'busy' | 'offline'
  last_active?: string
}

export interface UserJoinedPayload extends UserPresencePayload {
  joined_at: string
  context?: {
    sphere_id?: string
    thread_id?: string
    meeting_id?: string
  }
}

export interface UserLeftPayload {
  user_id: string
  user_name: string
  left_at: string
  reason?: 'disconnect' | 'timeout' | 'logout' | 'kicked'
}

export interface UserCursorPayload {
  user_id: string
  user_name: string
  cursor: {
    x: number
    y: number
  }
  context?: {
    element_id?: string
    thread_id?: string
  }
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CheckpointRequestPayload {
  checkpoint_id: string
  execution_id: string
  agent_id: string
  agent_name: string
  action_type: string
  description: string
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
  estimated_tokens: number
  requested_at: string
  expires_at?: string
}

export interface CheckpointResponsePayload {
  checkpoint_id: string
  execution_id: string
  decision: 'approved' | 'rejected' | 'modified'
  decided_by: string
  decided_at: string
  reason?: string
  modifications?: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernanceAlertPayload {
  alert_id: string
  alert_type: 'budget_warning' | 'budget_exceeded' | 'rate_limit' | 'security' | 'compliance'
  severity: 'info' | 'warning' | 'error' | 'critical'
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

export interface TokenUpdatePayload {
  identity_id: string
  sphere_id?: string
  budget_id: string
  tokens_used: number
  tokens_remaining: number
  tokens_reserved: number
  updated_at: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaStreamingPayload {
  stream_id: string
  chunk: string
  is_final: boolean
  token_count?: number
}

export interface NovaEncodingPayload {
  encoding_id: string
  status: 'started' | 'completed' | 'failed'
  actions_count?: number
  total_tokens?: number
  requires_checkpoint?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export interface MeetingUpdatePayload {
  meeting_id: string
  update_type: 'started' | 'ended' | 'participant_joined' | 'participant_left' | 'recording_started' | 'recording_stopped'
  data?: Record<string, unknown>
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE TYPE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete mapping of message types to their payload types
 */
export interface WebSocketMessageTypes {
  // Thread
  'thread.updated': ThreadUpdatedPayload
  'thread.activity': ThreadActivityPayload
  'thread.message': ThreadMessagePayload
  
  // Agent Tasks
  'agent.task.start': AgentTaskStartPayload
  'agent.task.progress': AgentTaskProgressPayload
  'agent.task.complete': AgentTaskCompletePayload
  'agent.task.error': AgentTaskErrorPayload
  
  // User Presence
  'user.joined': UserJoinedPayload
  'user.left': UserLeftPayload
  'user.cursor': UserCursorPayload
  'user.presence': UserPresencePayload
  
  // Checkpoint
  'checkpoint.request': CheckpointRequestPayload
  'checkpoint.response': CheckpointResponsePayload
  
  // Governance
  'governance.alert': GovernanceAlertPayload
  'token.update': TokenUpdatePayload
  
  // Nova
  'nova.streaming': NovaStreamingPayload
  'nova.encoding': NovaEncodingPayload
  
  // Meeting
  'meeting.update': MeetingUpdatePayload
}

/**
 * Get payload type for a specific message type
 */
export type PayloadFor<T extends keyof WebSocketMessageTypes> = WebSocketMessageTypes[T]

// ═══════════════════════════════════════════════════════════════════════════════
// QUEUE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Queued message for offline/reconnection handling
 */
export interface QueuedMessage<T = unknown> {
  action: string
  data: T
  timestamp: number
  retries?: number
  priority?: 'low' | 'normal' | 'high'
}

/**
 * Message queue interface
 */
export interface MessageQueue {
  add<T>(action: string, data: T): void
  flush(): QueuedMessage[]
  clear(): void
  size(): number
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK RETURN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Thread subscription options
 */
export interface ThreadSubscriptionOptions {
  threadId: string
  onUpdate?: (thread: ThreadUpdatedPayload) => void
  onActivity?: (activity: ThreadActivityPayload) => void
  onMessage?: (message: ThreadMessagePayload) => void
}

/**
 * Agent task subscription options
 */
export interface AgentTaskSubscriptionOptions {
  agentId?: string
  taskId?: string
  onStart?: (data: AgentTaskStartPayload) => void
  onProgress?: (data: AgentTaskProgressPayload) => void
  onComplete?: (data: AgentTaskCompletePayload) => void
  onError?: (data: AgentTaskErrorPayload) => void
}

/**
 * Presence subscription options
 */
export interface PresenceSubscriptionOptions {
  contextId?: string
  onUserJoined?: (user: UserJoinedPayload) => void
  onUserLeft?: (user: UserLeftPayload) => void
  onCursorMove?: (data: UserCursorPayload) => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generic analytics event
 */
export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, string | number | boolean>
  timestamp: string
}

/**
 * Analytics properties
 */
export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Layout update type for workspace hooks
 */
export interface WorkspaceLayout {
  id: string
  name: string
  columns: number
  rows: number
  panels: WorkspacePanel[]
}

export interface WorkspacePanel {
  id: string
  type: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config?: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  WebSocketMessage,
  WebSocketSubscriber,
  Unsubscribe,
}
