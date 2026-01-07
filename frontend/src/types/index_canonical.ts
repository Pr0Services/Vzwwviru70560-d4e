// CHE·NU™ TypeScript Types — Complete Type Definitions
// ════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE GELÉE — NE PAS MODIFIER SANS AUTORISATION
// ════════════════════════════════════════════════════════════════════════════

// ============================================================
// CORE ENTITIES
// ============================================================

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  locale: 'fr' | 'en';
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface Identity {
  id: string;
  user_id: string;
  sphere_id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Sphere {
  id: string;
  code: SphereCode;
  name_fr: string;
  name_en: string;
  icon: string;
  color: string;
  description: string | null;
  sort_order: number;
}

// ════════════════════════════════════════════════════════════════════════════
// 9 SPHÈRES (FROZEN — DO NOT MODIFY)
// ════════════════════════════════════════════════════════════════════════════

export type SphereCode = 
  | 'personal'      // 🏠 Personal
  | 'business'      // 💼 Business
  | 'government'    // 🏛️ Government & Institutions
  | 'studio'        // 🎨 Studio de création
  | 'community'     // 👥 Community
  | 'social'        // 📱 Social & Media
  | 'entertainment' // 🎬 Entertainment
  | 'team'          // 🤝 My Team (includes IA Labs, Skills & Tools)
  | 'scholar';      // 📚 Scholars (NEW - 9th sphere)

export const SPHERE_COUNT = 9; // HARD LIMIT

// ════════════════════════════════════════════════════════════════════════════
// 6 BUREAU SECTIONS (FROZEN — DO NOT MODIFY)
// ════════════════════════════════════════════════════════════════════════════
// Dashboard vs Bureau are SEPARATE MODES, not sections
// Dashboard = Overview mode
// Bureau = Work mode with these 6 sections

export type BureauSection = 
  | 'quickcapture'    // ⚡ Quick Capture (lightweight notes, 500 char max)
  | 'resumeworkspace' // ▶️ Resume Workspace (continue existing work)
  | 'threads'         // 💬 Threads (.chenu files)
  | 'datafiles'       // 📁 Data/Files
  | 'activeagents'    // 🤖 Active Agents
  | 'meetings';       // 📅 Meetings

export const BUREAU_SECTION_COUNT = 6; // HARD LIMIT

export interface BureauSectionConfig {
  id: BureauSection;
  name_fr: string;
  name_en: string;
  icon: string;
  description: string;
  order: number;
  maxItems?: number;
}

export const BUREAU_SECTIONS: BureauSectionConfig[] = [
  { 
    id: 'quickcapture', 
    name_fr: 'Capture Rapide', 
    name_en: 'Quick Capture', 
    icon: '⚡', 
    description: 'Lightweight note taking (500 char max)',
    order: 1,
    maxItems: 5
  },
  { 
    id: 'resumeworkspace', 
    name_fr: 'Reprendre le Travail', 
    name_en: 'Resume Workspace', 
    icon: '▶️', 
    description: 'Continue existing work',
    order: 2
  },
  { 
    id: 'threads', 
    name_fr: 'Fils (.chenu)', 
    name_en: 'Threads (.chenu)', 
    icon: '💬', 
    description: 'Persistent conversations',
    order: 3
  },
  { 
    id: 'datafiles', 
    name_fr: 'Données/Fichiers', 
    name_en: 'Data/Files', 
    icon: '📁', 
    description: 'File management and data access',
    order: 4
  },
  { 
    id: 'activeagents', 
    name_fr: 'Agents Actifs', 
    name_en: 'Active Agents', 
    icon: '🤖', 
    description: 'Agent status & control',
    order: 5
  },
  { 
    id: 'meetings', 
    name_fr: 'Réunions', 
    name_en: 'Meetings', 
    icon: '📅', 
    description: 'Meeting management',
    order: 6
  }
];

// Validation: Must be exactly 6 sections
if (BUREAU_SECTIONS.length !== BUREAU_SECTION_COUNT) {
  throw new Error(`CRITICAL: CHE·NU Bureau requires exactly ${BUREAU_SECTION_COUNT} sections. Found: ${BUREAU_SECTIONS.length}`);
}

// ════════════════════════════════════════════════════════════════════════════
// WORKSPACE MODES (Dashboard vs Bureau)
// ════════════════════════════════════════════════════════════════════════════

export type WorkspaceViewMode = 'dashboard' | 'bureau';

export interface WorkspaceViewState {
  mode: WorkspaceViewMode;
  currentSection?: BureauSection; // Only relevant when mode === 'bureau'
}

// ============================================================
// THREADS (.CHENU)
// ============================================================

export interface Thread {
  id: string;
  user_id: string;
  identity_id: string;
  dataspace_id: string | null;
  parent_thread_id: string | null;
  title: string;
  description: string | null;
  thread_type: ThreadType;
  status: ThreadStatus;
  encoding_level: EncodingLevel;
  token_budget: number;
  tokens_used: number;
  priority: number;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export type ThreadType = 'discussion' | 'task' | 'decision' | 'brainstorm' | 'review' | 'meeting';
export type ThreadStatus = 'active' | 'paused' | 'resolved' | 'archived';
export type EncodingLevel = 'none' | 'light' | 'standard' | 'aggressive' | 'maximum';

export interface Message {
  id: string;
  thread_id: string;
  user_id: string | null;
  agent_id: string | null;
  role: MessageRole;
  content: string;
  content_encoded: string | null;
  encoding_applied: boolean;
  encoding_savings: number;
  tokens_used: number;
  metadata: Record<string, any>;
  created_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'agent';

export interface Decision {
  id: string;
  thread_id: string;
  user_id: string;
  decision_type: DecisionType;
  title: string;
  description: string | null;
  options: DecisionOption[];
  selected_option: DecisionOption | null;
  rationale: string | null;
  status: DecisionStatus;
  decided_at: string | null;
  created_at: string;
}

export type DecisionType = 'approval' | 'choice' | 'allocation' | 'direction' | 'policy';
export type DecisionStatus = 'pending' | 'decided' | 'deferred' | 'cancelled';

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  impact?: string;
}

// ============================================================
// AGENTS
// ============================================================

export interface Agent {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  description: string | null;
  agent_level: AgentLevel;
  agent_type: AgentType;
  sphere_id: string | null;
  domain_id: string | null;
  capabilities: string[];
  constraints: string[];
  llm_provider: string;
  llm_model: string | null;
  is_active: boolean;
  is_system: boolean;
}

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';
export type AgentType = 'orchestrator' | 'specialist' | 'support' | 'analyzer';

export interface AgentExecution {
  id: string;
  agent_id: string;
  status: ExecutionStatus;
  input_tokens: number;
  output_tokens: number;
  total_cost: number;
  started_at: string;
  completed_at: string | null;
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// ============================================================
// WORKSPACE (OCW)
// ============================================================

export interface Workspace {
  id: string;
  identity_id: string;
  dataspace_id: string | null;
  name: string;
  description: string | null;
  workspace_type: WorkspaceType;
  current_mode: WorkspaceMode;
  layout_config: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export type WorkspaceType = 'personal' | 'project' | 'team' | 'shared';
export type WorkspaceMode = 'document' | 'board' | 'dashboard' | 'timeline' | 'diagram' | 'hybrid';

// ============================================================
// DATASPACE
// ============================================================

export interface DataSpace {
  id: string;
  identity_id: string;
  parent_id: string | null;
  name: string;
  description: string | null;
  dataspace_type: DataSpaceType;
  path: string;
  depth: number;
  metadata: Record<string, any>;
  created_at: string;
}

export type DataSpaceType = 'folder' | 'project' | 'archive' | 'template' | 'shared';

// ============================================================
// MEMORY & GOVERNANCE
// ============================================================

export interface MemoryItem {
  id: string;
  user_id: string;
  identity_id: string;
  memory_type: MemoryType;
  memory_category: MemoryCategory | null;
  content: string;
  metadata: Record<string, any>;
  dataspace_id: string | null;
  thread_id: string | null;
  status: MemoryStatus;
  created_at: string;
  expires_at: string | null;
}

export type MemoryType = 'short_term' | 'mid_term' | 'long_term' | 'institutional' | 'agent';
export type MemoryCategory = 'preference' | 'instruction' | 'fact' | 'context' | 'rule';
export type MemoryStatus = 'active' | 'pinned' | 'archived' | 'deleted';

export interface GovernanceAuditEntry {
  id: string;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id: string;
  action_details: Record<string, any>;
  created_at: string;
}

export interface ElevationRequest {
  id: string;
  user_id: string;
  requested_action: string;
  resource_type: string;
  resource_id: string;
  reason: string | null;
  status: ElevationStatus;
  requested_at: string;
  expires_at: string | null;
}

export type ElevationStatus = 'pending' | 'approved' | 'denied' | 'expired';

// ============================================================
// TOKENS (INTERNAL UTILITY - NOT CRYPTO)
// ============================================================

export interface TokenBudget {
  id: string;
  identity_id: string;
  total_allocated: number;
  total_used: number;
  total_remaining: number;
  period_start: string;
  period_end: string;
}

export interface TokenTransaction {
  id: string;
  identity_id: string;
  amount: number;
  transaction_type: 'allocation' | 'usage' | 'refund' | 'transfer';
  source: string;
  description: string;
  created_at: string;
}

// ============================================================
// IMMOBILIER
// ============================================================

export interface Property {
  id: string;
  identity_id: string;
  name: string;
  address: string;
  property_type: PropertyType;
  units_count: number;
  purchase_price: number | null;
  current_value: number | null;
  status: PropertyStatus;
}

export type PropertyType = 'residential' | 'commercial' | 'mixed' | 'land';
export type PropertyStatus = 'active' | 'for_sale' | 'sold' | 'under_renovation';

export interface Lease {
  id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: LeaseStatus;
}

export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending';

// ============================================================
// MEETINGS
// ============================================================

export interface Meeting {
  id: string;
  identity_id: string;
  title: string;
  description: string | null;
  meeting_type: MeetingType;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  status: MeetingStatus;
  participants: MeetingParticipant[];
}

export type MeetingType = 'one_on_one' | 'team' | 'client' | 'project' | 'standup' | 'review';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string | null;
  email: string;
  name: string;
  role: 'organizer' | 'participant' | 'optional';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    request_id: string;
    timestamp: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ============================================================
// UI STATE
// ============================================================

export interface AppState {
  user: User | null;
  currentIdentity: Identity | null;
  currentSphere: Sphere | null;
  currentViewMode: WorkspaceViewMode;
  currentBureauSection: BureauSection;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  locale: 'fr' | 'en';
}

export interface NavigationState {
  sphereCode: SphereCode;
  viewMode: WorkspaceViewMode;
  bureauSection: BureauSection;
  workspaceId: string | null;
  threadId: string | null;
}

// ════════════════════════════════════════════════════════════════════════════
// BRAND COLORS (CHE·NU Official Palette)
// ════════════════════════════════════════════════════════════════════════════

export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
} as const;

// ════════════════════════════════════════════════════════════════════════════
// 9 SPHERE COLORS & ICONS (FROZEN)
// ════════════════════════════════════════════════════════════════════════════

export const SPHERE_COLORS: Record<SphereCode, string> = {
  personal: CHENU_COLORS.cenoteTurquoise,    // 🏠
  business: CHENU_COLORS.sacredGold,         // 💼
  government: CHENU_COLORS.ancientStone,     // 🏛️
  studio: CHENU_COLORS.jungleEmerald,        // 🎨
  community: CHENU_COLORS.shadowMoss,        // 👥
  social: CHENU_COLORS.earthEmber,           // 📱
  entertainment: '#E74C3C',                   // 🎬
  team: CHENU_COLORS.cenoteTurquoise,        // 🤝
  scholar: '#6B5B95',                         // 📚 Purple for academic
};

export const SPHERE_ICONS: Record<SphereCode, string> = {
  personal: '🏠',
  business: '💼',
  government: '🏛️',
  studio: '🎨',
  community: '👥',
  social: '📱',
  entertainment: '🎬',
  team: '🤝',
  scholar: '📚',
};

export const SPHERE_NAMES: Record<SphereCode, { fr: string; en: string }> = {
  personal: { fr: 'Personnel', en: 'Personal' },
  business: { fr: 'Entreprise', en: 'Business' },
  government: { fr: 'Gouvernement & Institutions', en: 'Government & Institutions' },
  studio: { fr: 'Studio de Création', en: 'Creative Studio' },
  community: { fr: 'Communauté', en: 'Community' },
  social: { fr: 'Social & Médias', en: 'Social & Media' },
  entertainment: { fr: 'Divertissement', en: 'Entertainment' },
  team: { fr: 'Mon Équipe', en: 'My Team' },
  scholar: { fr: 'Savoirs', en: 'Scholars' },
};

// Validation: Must be exactly 9 spheres
const sphereCount = Object.keys(SPHERE_COLORS).length;
if (sphereCount !== SPHERE_COUNT) {
  throw new Error(`CRITICAL: CHE·NU requires exactly ${SPHERE_COUNT} spheres. Found: ${sphereCount}`);
}

// Autonomous Execution (Manus 1.6)
export * from './autonomous';
