/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — API TYPES (OpenAPI Generated)                   ║
 * ║                    Sprint B3.1: Type-safe API                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This file is auto-generated from OpenAPI schema.
 * DO NOT EDIT MANUALLY - run `npm run generate:types`
 * 
 * @generated from /api/openapi.json
 * @version 52.0.0
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type UUID = string

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
}

export interface APIError {
  detail: string
  code: string
  field?: string
}

export interface APIResponse<T> {
  data: T
  meta?: {
    request_id: string
    timestamp: string
  }
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  accept_terms: boolean
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: UUID
  email: string
  name: string
  avatar_url?: string
  role: UserRole
  status: UserStatus
  token_balance: number
  created_at: string
  updated_at: string
  settings: UserSettings
}

export type UserRole = 'user' | 'admin' | 'moderator'
export type UserStatus = 'active' | 'suspended' | 'pending'

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications_enabled: boolean
  email_notifications: boolean
  default_sphere_id?: UUID
}

export interface UpdateUserRequest {
  name?: string
  avatar_url?: string
  settings?: Partial<UserSettings>
}

// ============================================================================
// SPHERE TYPES
// ============================================================================

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'team'
  | 'scholar'

export interface Sphere {
  id: SphereId
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
  thread_count: number
  agent_count: number
  token_usage: number
  created_at: string
}

export interface SphereStats {
  sphere_id: SphereId
  total_threads: number
  active_threads: number
  total_messages: number
  total_agents: number
  active_agents: number
  token_usage_today: number
  token_usage_month: number
}

// ============================================================================
// BUREAU SECTION TYPES
// ============================================================================

export type BureauSectionId = 
  | 'quick-capture'
  | 'resume-workspace'
  | 'threads'
  | 'data-files'
  | 'active-agents'
  | 'meetings'

export interface BureauSection {
  id: BureauSectionId
  name: string
  description: string
  icon: string
  item_count: number
  is_available: boolean
}

// ============================================================================
// THREAD TYPES
// ============================================================================

export type ThreadStatus = 'active' | 'archived' | 'deleted'
export type ThreadPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Thread {
  id: UUID
  title: string
  sphere_id: SphereId
  section_id: BureauSectionId
  status: ThreadStatus
  priority: ThreadPriority
  created_by: UUID
  created_at: string
  updated_at: string
  last_message_at?: string
  message_count: number
  participant_count: number
  tags: string[]
  metadata: Record<string, unknown>
}

export interface ThreadDetail extends Thread {
  messages: Message[]
  participants: ThreadParticipant[]
  agents: ThreadAgent[]
}

export interface ThreadParticipant {
  user_id: UUID
  user_name: string
  user_avatar?: string
  role: 'owner' | 'member' | 'viewer'
  joined_at: string
}

export interface ThreadAgent {
  agent_id: UUID
  agent_name: string
  status: 'active' | 'paused' | 'completed'
  hired_at: string
  token_used: number
}

export interface CreateThreadRequest {
  title: string
  sphere_id: SphereId
  section_id?: BureauSectionId
  priority?: ThreadPriority
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface UpdateThreadRequest {
  title?: string
  status?: ThreadStatus
  priority?: ThreadPriority
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface ThreadFilters {
  sphere_id?: SphereId
  section_id?: BureauSectionId
  status?: ThreadStatus
  priority?: ThreadPriority
  search?: string
  tags?: string[]
  created_after?: string
  created_before?: string
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system' | 'agent'
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed'

export interface Message {
  id: UUID
  thread_id: UUID
  role: MessageRole
  content: string
  status: MessageStatus
  created_by: UUID
  created_at: string
  updated_at?: string
  agent_id?: UUID
  agent_name?: string
  tokens_used?: number
  metadata: MessageMetadata
  attachments: Attachment[]
}

export interface MessageMetadata {
  model?: string
  tokens_input?: number
  tokens_output?: number
  duration_ms?: number
  commands?: string[]
  mentions?: string[]
}

export interface Attachment {
  id: UUID
  name: string
  type: string
  size: number
  url: string
  thumbnail_url?: string
}

export interface SendMessageRequest {
  content: string
  attachments?: UUID[]
  metadata?: Record<string, unknown>
}

export interface SendMessageResponse {
  user_message: Message
  assistant_message?: Message
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3'
export type AgentStatus = 'available' | 'hired' | 'busy' | 'paused' | 'deprecated'
export type AgentScope = 'thread' | 'sphere' | 'global'

export interface Agent {
  id: UUID
  name: string
  description: string
  level: AgentLevel
  status: AgentStatus
  category: string
  capabilities: string[]
  icon: string
  color: string
  cost_per_token: number
  min_tokens: number
  max_tokens: number
  average_response_time: number
  success_rate: number
  total_tasks: number
  created_at: string
}

export interface HiredAgent {
  id: UUID
  agent_id: UUID
  agent: Agent
  user_id: UUID
  scope: AgentScope
  scope_id?: UUID
  status: 'active' | 'paused' | 'expired' | 'terminated'
  hired_at: string
  expires_at?: string
  token_budget: number
  token_used: number
  task_count: number
  last_active_at?: string
}

export interface HireAgentRequest {
  agent_id: UUID
  scope: AgentScope
  scope_id?: UUID
  token_budget: number
  duration_hours?: number
}

export interface HireAgentResponse {
  hired_agent: HiredAgent
  estimated_cost: number
  governance_checkpoint?: GovernanceCheckpoint
}

export interface AgentTask {
  id: UUID
  hired_agent_id: UUID
  thread_id?: UUID
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  input: string
  output?: string
  tokens_used: number
  duration_ms: number
  created_at: string
  completed_at?: string
  error?: string
}

export interface AgentFilters {
  level?: AgentLevel
  status?: AgentStatus
  category?: string
  search?: string
  min_success_rate?: number
}

// ============================================================================
// NOVA TYPES
// ============================================================================

export type NovaStatus = 'active' | 'degraded' | 'offline' | 'maintenance'

export interface NovaState {
  status: NovaStatus
  version: string
  capabilities: string[]
  token_limit: number
  token_used_today: number
  response_time_avg: number
  uptime_percent: number
  last_updated: string
}

export interface NovaQueryRequest {
  query: string
  context?: {
    sphere_id?: SphereId
    thread_id?: UUID
    include_history?: boolean
    max_tokens?: number
  }
  stream?: boolean
}

export interface NovaQueryResponse {
  id: UUID
  query: string
  response: string
  tokens_used: number
  duration_ms: number
  sources?: NovaSource[]
  suggestions?: string[]
}

export interface NovaSource {
  type: 'thread' | 'document' | 'agent' | 'web'
  id: UUID
  title: string
  relevance: number
}

export interface NovaStreamChunk {
  id: UUID
  delta: string
  done: boolean
  tokens_used?: number
}

// ============================================================================
// GOVERNANCE TYPES
// ============================================================================

export type CheckpointType = 
  | 'agent_action'
  | 'cross_sphere_transfer'
  | 'token_budget'
  | 'data_export'
  | 'external_integration'

export type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface GovernanceCheckpoint {
  id: UUID
  type: CheckpointType
  status: CheckpointStatus
  risk_level: RiskLevel
  title: string
  description: string
  requester_id: UUID
  requester_name: string
  agent_id?: UUID
  agent_name?: string
  sphere_id?: SphereId
  target_sphere_id?: SphereId
  token_amount?: number
  created_at: string
  expires_at: string
  decided_at?: string
  decided_by?: UUID
  decision_reason?: string
  metadata: Record<string, unknown>
}

export interface ApproveCheckpointRequest {
  reason?: string
  partial_amount?: number
}

export interface RejectCheckpointRequest {
  reason: string
}

export interface GovernanceStats {
  pending_count: number
  approved_today: number
  rejected_today: number
  high_risk_pending: number
  average_decision_time: number
}

export interface AuditLogEntry {
  id: UUID
  action: string
  actor_id: UUID
  actor_name: string
  actor_type: 'user' | 'agent' | 'system'
  target_type: string
  target_id: UUID
  sphere_id?: SphereId
  details: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface AuditLogFilters {
  actor_id?: UUID
  actor_type?: 'user' | 'agent' | 'system'
  action?: string
  target_type?: string
  sphere_id?: SphereId
  start_date?: string
  end_date?: string
}

// ============================================================================
// TOKEN TYPES
// ============================================================================

export interface TokenBalance {
  total: number
  available: number
  reserved: number
  used_today: number
  used_this_month: number
  limit_daily?: number
  limit_monthly?: number
}

export interface TokenUsage {
  date: string
  sphere_id?: SphereId
  agent_id?: UUID
  tokens_used: number
  cost: number
}

export interface TokenTransaction {
  id: UUID
  type: 'credit' | 'debit' | 'reserve' | 'release'
  amount: number
  balance_after: number
  description: string
  reference_type?: string
  reference_id?: UUID
  created_at: string
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 
  | 'message'
  | 'mention'
  | 'agent_complete'
  | 'checkpoint_required'
  | 'token_warning'
  | 'system'

export interface Notification {
  id: UUID
  type: NotificationType
  title: string
  body: string
  is_read: boolean
  action_url?: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface NotificationSettings {
  email_enabled: boolean
  push_enabled: boolean
  types: Record<NotificationType, boolean>
  quiet_hours?: {
    start: string
    end: string
    timezone: string
  }
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export type WebSocketEventType =
  | 'message.new'
  | 'message.update'
  | 'thread.update'
  | 'agent.status'
  | 'nova.stream'
  | 'checkpoint.new'
  | 'checkpoint.update'
  | 'token.update'
  | 'notification.new'
  | 'presence.update'

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType
  payload: T
  timestamp: string
}

export interface PresenceUpdate {
  user_id: UUID
  status: 'online' | 'away' | 'offline'
  last_seen?: string
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export interface APIEndpoints {
  // Auth
  'POST /auth/login': { request: LoginRequest; response: LoginResponse }
  'POST /auth/register': { request: RegisterRequest; response: LoginResponse }
  'POST /auth/refresh': { request: RefreshTokenRequest; response: RefreshTokenResponse }
  'POST /auth/logout': { request: never; response: { success: boolean } }
  
  // User
  'GET /users/me': { request: never; response: User }
  'PATCH /users/me': { request: UpdateUserRequest; response: User }
  'GET /users/me/tokens': { request: never; response: TokenBalance }
  
  // Spheres
  'GET /spheres': { request: never; response: Sphere[] }
  'GET /spheres/:id': { request: never; response: Sphere }
  'GET /spheres/:id/stats': { request: never; response: SphereStats }
  'GET /spheres/:id/sections': { request: never; response: BureauSection[] }
  
  // Threads
  'GET /threads': { request: ThreadFilters; response: PaginatedResponse<Thread> }
  'POST /threads': { request: CreateThreadRequest; response: Thread }
  'GET /threads/:id': { request: never; response: ThreadDetail }
  'PATCH /threads/:id': { request: UpdateThreadRequest; response: Thread }
  'DELETE /threads/:id': { request: never; response: { success: boolean } }
  'POST /threads/:id/archive': { request: never; response: Thread }
  
  // Messages
  'GET /threads/:id/messages': { request: { page?: number; limit?: number }; response: PaginatedResponse<Message> }
  'POST /threads/:id/messages': { request: SendMessageRequest; response: SendMessageResponse }
  
  // Agents
  'GET /agents': { request: AgentFilters; response: PaginatedResponse<Agent> }
  'GET /agents/:id': { request: never; response: Agent }
  'GET /agents/hired': { request: never; response: HiredAgent[] }
  'POST /agents/:id/hire': { request: HireAgentRequest; response: HireAgentResponse }
  'POST /agents/hired/:id/pause': { request: never; response: HiredAgent }
  'POST /agents/hired/:id/resume': { request: never; response: HiredAgent }
  'POST /agents/hired/:id/fire': { request: never; response: { refund: number } }
  'GET /agents/hired/:id/tasks': { request: never; response: AgentTask[] }
  
  // Nova
  'GET /nova/status': { request: never; response: NovaState }
  'POST /nova/query': { request: NovaQueryRequest; response: NovaQueryResponse }
  
  // Governance
  'GET /governance/checkpoints': { request: { status?: CheckpointStatus }; response: GovernanceCheckpoint[] }
  'GET /governance/checkpoints/:id': { request: never; response: GovernanceCheckpoint }
  'POST /governance/checkpoints/:id/approve': { request: ApproveCheckpointRequest; response: GovernanceCheckpoint }
  'POST /governance/checkpoints/:id/reject': { request: RejectCheckpointRequest; response: GovernanceCheckpoint }
  'GET /governance/stats': { request: never; response: GovernanceStats }
  'GET /governance/audit': { request: AuditLogFilters; response: PaginatedResponse<AuditLogEntry> }
  
  // Notifications
  'GET /notifications': { request: { unread_only?: boolean }; response: Notification[] }
  'POST /notifications/:id/read': { request: never; response: Notification }
  'POST /notifications/read-all': { request: never; response: { count: number } }
}

// ============================================================================
// TYPE HELPERS
// ============================================================================

export type EndpointMethod = keyof APIEndpoints
export type EndpointRequest<T extends EndpointMethod> = APIEndpoints[T]['request']
export type EndpointResponse<T extends EndpointMethod> = APIEndpoints[T]['response']
