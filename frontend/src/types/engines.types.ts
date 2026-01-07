/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — SHARED TYPES                                ║
 * ║                    Type Definitions for All Engines                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface TimestampedEntity {
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'auto_approved';

export interface Checkpoint {
  id: string;
  identity_id: string;
  agent_id?: string;
  action_type: string;
  description: string;
  context: Record<string, unknown>;
  status: CheckpointStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  expires_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TokenTransactionType = 'credit' | 'debit' | 'refund' | 'bonus' | 'transfer';

export interface TokenBalance {
  identity_id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  created_at: string;
  updated_at: string;
}

export interface TokenTransaction {
  id: string;
  identity_id: string;
  type: TokenTransactionType;
  amount: number;
  operation: string;
  context: Record<string, unknown>;
  balance_after: number;
  created_at: string;
}

export interface BudgetCheck {
  allowed: boolean;
  balance: number;
  required: number;
  remaining: number;
  daily_limit: number;
  daily_spent: number;
  daily_remaining: number;
  sphere_budget?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId =
  | 'sphere_personal'
  | 'sphere_business'
  | 'sphere_government'
  | 'sphere_studio'
  | 'sphere_community'
  | 'sphere_social'
  | 'sphere_entertainment'
  | 'sphere_team'
  | 'sphere_scholar';

export interface Sphere {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type MeetingType = 'standup' | 'planning' | 'review' | 'brainstorm' | 'one_on_one' | 'checkpoint' | 'general';

export interface Meeting extends TimestampedEntity {
  id: string;
  title: string;
  description?: string;
  sphere_id: string;
  host_id: string;
  meeting_type: MeetingType;
  status: MeetingStatus;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  participant_count: number;
}

export interface MeetingFilters {
  sphere_id?: string;
  status?: MeetingStatus;
  from_date?: string;
  to_date?: string;
}

export interface CreateMeetingInput {
  title: string;
  description?: string;
  sphere_id: string;
  meeting_type?: MeetingType;
  scheduled_start: string;
  scheduled_end: string;
  invited_identities?: string[];
  invited_agents?: string[];
}

export interface Participant {
  id: string;
  meeting_id: string;
  identity_id?: string;
  agent_id?: string;
  name: string;
  role: 'host' | 'participant' | 'observer' | 'agent';
  joined_at: string;
  left_at?: string;
  is_active: boolean;
}

export interface AgendaItem {
  id: string;
  meeting_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  presenter_id?: string;
}

export interface MeetingNote {
  id: string;
  meeting_id: string;
  author_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  title: string;
  description?: string;
  assignee_id: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONECLICK ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ActionCategory = 'communication' | 'productivity' | 'analysis' | 'automation' | 'integration' | 'custom';
export type ExecutionStatus = 'pending' | 'running' | 'checkpoint_required' | 'completed' | 'failed' | 'cancelled';

export interface ActionParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'datetime';
  required: boolean;
  default_value?: unknown;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ActionCategory;
  parameters: ActionParameter[];
  requires_checkpoint: boolean;
  estimated_tokens: number;
  is_system: boolean;
  is_enabled: boolean;
  is_favorite?: boolean;
  last_used?: string;
  usage_count?: number;
}

export interface ExecutionResult {
  id: string;
  action_id: string;
  identity_id: string;
  status: ExecutionStatus;
  parameters: Record<string, unknown>;
  result?: unknown;
  error_message?: string;
  tokens_consumed: number;
  checkpoint_id?: string;
  started_at: string;
  completed_at?: string;
}

export interface WorkflowStep {
  action_id: string;
  parameters: Record<string, unknown>;
  condition?: string;
  on_failure?: 'stop' | 'continue' | 'retry';
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  is_active: boolean;
  execution_count: number;
  last_executed?: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMMOBILIER ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'parking' | 'storage';
export type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'sold' | 'inactive';
export type TenantStatus = 'pending' | 'active' | 'inactive' | 'evicted';
export type LeaseStatus = 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyDetails {
  surface_m2: number;
  rooms: number;
  bedrooms?: number;
  bathrooms: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  amenities?: string[];
  energy_rating?: string;
  parking_spots?: number;
}

export interface Property extends TimestampedEntity {
  id: string;
  owner_id: string;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  address: Address;
  details: PropertyDetails;
  monthly_rent?: number;
  deposit?: number;
  current_tenant_id?: string;
  current_lease_id?: string;
  images?: string[];
  documents?: string[];
  notes?: string;
}

export interface Tenant extends TimestampedEntity {
  id: string;
  owner_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: TenantStatus;
  property_id?: string;
  lease_id?: string;
  documents?: string[];
  notes?: string;
  rating?: number;
}

export interface Lease extends TimestampedEntity {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  status: LeaseStatus;
  monthly_rent: number;
  deposit: number;
  charges?: number;
  start_date: string;
  end_date: string;
  payment_day: number;
  auto_renew: boolean;
  documents?: string[];
}

export interface MaintenanceRequest extends TimestampedEntity {
  id: string;
  property_id: string;
  requester_id: string;
  title: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assigned_to?: string;
  scheduled_date?: string;
  completed_date?: string;
  cost?: number;
  images?: string[];
  notes?: string;
}

export interface FinancialTransaction extends TimestampedEntity {
  id: string;
  property_id: string;
  owner_id: string;
  type: 'rent' | 'deposit' | 'charges' | 'maintenance' | 'tax' | 'insurance' | 'other';
  amount: number;
  is_income: boolean;
  description: string;
  date: string;
  category?: string;
  receipt_url?: string;
}

export interface PortfolioAnalytics {
  properties_count: number;
  occupied_count: number;
  available_count: number;
  vacancy_rate: number;
  total_value: number;
  monthly_income: number;
  monthly_expenses: number;
  net_monthly: number;
  annual_income_projected: number;
  roi_percentage: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OCW ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type WorkspaceType = 'project' | 'team' | 'department' | 'organization' | 'temporary';
export type WorkspaceVisibility = 'private' | 'sphere' | 'organization' | 'public';
export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ResourceType = 'document' | 'image' | 'video' | 'link' | 'file' | 'thread';

export interface WorkspaceStats {
  member_count: number;
  resource_count: number;
  task_count: number;
  completed_task_count: number;
  active_agent_count: number;
}

export interface Workspace extends TimestampedEntity {
  id: string;
  name: string;
  description?: string;
  type: WorkspaceType;
  visibility: WorkspaceVisibility;
  owner_id: string;
  sphere_id: string;
  icon: string;
  color: string;
  stats: WorkspaceStats;
  settings?: Record<string, unknown>;
  is_archived: boolean;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  identity_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: MemberRole;
  permissions: string[];
  joined_at: string;
  last_active?: string;
  is_online: boolean;
}

export interface SharedResource {
  id: string;
  workspace_id: string;
  type: ResourceType;
  resource_id: string;
  name: string;
  description?: string;
  shared_by: string;
  shared_at: string;
  access_count: number;
  last_accessed?: string;
}

export interface Task extends TimestampedEntity {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string;
  assignee_ids: string[];
  due_date?: string;
  labels: string[];
  checklist?: { item: string; completed: boolean }[];
  comments_count: number;
  attachments_count: number;
}

export interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
}

export interface AgentAssignment {
  id: string;
  workspace_id: string;
  agent_id: string;
  agent_name: string;
  agent_avatar?: string;
  role: string;
  permissions: string[];
  token_budget: number;
  tokens_used: number;
  assigned_at: string;
  assigned_by: string;
  is_active: boolean;
  last_action?: string;
}

export interface WorkspaceActivity {
  id: string;
  workspace_id: string;
  actor_id: string;
  actor_name: string;
  actor_type: 'user' | 'agent' | 'system';
  action: string;
  target_type: string;
  target_id: string;
  target_name?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NovaCapability = 'query' | 'analyze' | 'suggest' | 'orchestrate' | 'summarize' | 'translate';

export interface NovaResponse {
  query: string;
  response: string;
  capability: NovaCapability;
  tokens_used: number;
  confidence: number;
  sources: string[];
  suggestions: string[];
  timestamp: string;
}

export interface NovaStatus {
  status: 'operational' | 'degraded' | 'offline';
  version: string;
  capabilities: NovaCapability[];
  is_hireable: false; // CRITICAL: Nova is NEVER hireable
  type: 'system_intelligence';
}
