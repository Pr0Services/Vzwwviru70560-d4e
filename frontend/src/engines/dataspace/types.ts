/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — DATASPACE ENGINE TYPES                                ║
 * ║              Complete Type Definitions                                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "A DataSpace is CHE·NU's fundamental unit of intelligent, governed storage" ║
 * ║  "Every entity in CHE·NU exists within a DataSpace."                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DATASPACE CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export type DataSpaceType = 
  | 'project'           // Container for project-related information
  | 'meeting'           // Complete meeting lifecycle management
  | 'property_personal' // Personal property management
  | 'property_building' // Multi-unit property management (Enterprise)
  | 'document'          // Organized document collection
  | 'creative_asset'    // Creative project assets
  | 'construction_site' // Construction project management
  | 'business_entity'   // Business/company management
  | 'workflow'          // Automated process container
  | 'archive'           // Long-term storage
  | 'xr_space'          // Virtual/AR environment
  | 'generic';          // Default type

export type DataSpaceStatus = 
  | 'active'            // Currently in use
  | 'archived'          // Preserved but inactive
  | 'deleted'           // Soft deleted (recoverable)
  | 'locked'            // Read-only, protected
  | 'processing';       // Being processed by system

export type DataSpaceLevel = 1 | 2 | 3 | 4 | 5;

// ═══════════════════════════════════════════════════════════════════════════════
// HIERARCHY (5 Levels)
// ═══════════════════════════════════════════════════════════════════════════════
// Level 1: Sphere (Identity Container)
// Level 2: Domain (Functional Area)
// Level 3: DataSpace (Primary Container)
// Level 4: Sub-DataSpaces (Nested Containers)
// Level 5: Threads, Entities, Temporal Layers

export interface DataSpaceHierarchy {
  sphere_id: string;      // Level 1
  domain_id: string;      // Level 2
  dataspace_id: string;   // Level 3
  sub_dataspace_id?: string; // Level 4
  entity_id?: string;     // Level 5
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type DocumentFormat = 
  | 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'md' | 'html' | 'json' | 'xml';

export type MediaFormat = 
  | 'png' | 'jpg' | 'svg' | 'webp' | 'tiff'  // Images
  | 'mp3' | 'wav' | 'm4a' | 'flac'           // Audio
  | 'mp4' | 'mov' | 'webm'                    // Video
  | 'dwg' | 'dxf'                            // Blueprints
  | 'obj' | 'fbx' | 'gltf' | 'usdz';         // 3D Models

export type DiagramType = 
  | 'flowchart' | 'sequence' | 'state' | 'class'
  | 'architecture' | 'workflow' | 'mindmap'
  | 'orgchart' | 'er_diagram' | 'gantt';

export interface DataSpaceDocument {
  id: string;
  name: string;
  format: DocumentFormat;
  size_bytes: number;
  version: number;
  content_hash: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags: string[];
  ai_summary?: string;
  extracted_text?: string;
}

export interface DataSpaceMedia {
  id: string;
  name: string;
  format: MediaFormat;
  size_bytes: number;
  duration_seconds?: number; // For audio/video
  dimensions?: { width: number; height: number };
  thumbnail_url?: string;
  created_at: string;
  tags: string[];
  ai_analysis?: {
    description?: string;
    detected_objects?: string[];
    transcription?: string;
    speaker_ids?: string[];
  };
}

export interface DataSpaceTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  due_date?: string;
  assigned_to?: string;
  subtasks: string[]; // Task IDs
  dependencies: string[]; // Task IDs
  domain_tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  completed_at?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
  };
}

export interface DataSpaceDiagram {
  id: string;
  name: string;
  type: DiagramType;
  content: string; // Mermaid or other format
  created_at: string;
  updated_at: string;
  preview_url?: string;
}

export interface DataSpaceXRScene {
  id: string;
  name: string;
  type: 'meeting_room' | 'property_walkthrough' | 'construction_site' | 'design_review' | 'training';
  config: {
    environment: string;
    lighting: string;
    objects: XRObject[];
    spawn_points: Array<{ x: number; y: number; z: number }>;
  };
  created_at: string;
  participants_max?: number;
}

export interface XRObject {
  id: string;
  type: 'document' | 'media' | 'annotation' | 'furniture' | 'custom';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  properties: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATASPACE METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface DataSpaceMetadata {
  // Identity
  owner_id: string;
  identity_id: string;
  
  // Classification
  sphere_id: string;
  domain_id: string;
  type: DataSpaceType;
  
  // Access Control
  permissions: DataSpacePermissions;
  
  // Relationships
  parent_id?: string;
  children_ids: string[];
  linked_dataspaces: string[];
  
  // Organization
  tags: string[];
  custom_fields: Record<string, any>;
  
  // Status
  status: DataSpaceStatus;
  
  // Timestamps
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  archived_at?: string;
  
  // Versioning
  version: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type DataSpaceRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'agent';

export interface DataSpacePermissions {
  owner_id: string;
  
  // Role assignments
  roles: Map<string, DataSpaceRole>; // user_id -> role
  
  // Specific permissions
  can_share: boolean;
  can_export: boolean;
  can_delete: boolean;
  
  // Agent permissions
  agent_access: {
    can_read: boolean;
    can_write_limited: boolean;
  };
  
  // Elevation
  elevation_requests: ElevationRequest[];
}

export interface ElevationRequest {
  id: string;
  requester_id: string;
  requested_role: DataSpaceRole;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  responded_at?: string;
  responded_by?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPORAL LAYERS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TemporalLayer {
  id: string;
  dataspace_id: string;
  version: number;
  timestamp: string;
  changes: DataSpaceChange[];
  snapshot_hash: string;
  created_by: string;
}

export interface DataSpaceChange {
  type: 'create' | 'update' | 'delete' | 'move';
  entity_type: 'document' | 'media' | 'task' | 'thread' | 'metadata';
  entity_id: string;
  before?: unknown;
  after?: unknown;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT MEMORY (Governed)
// ═══════════════════════════════════════════════════════════════════════════════

export interface DataSpaceAgentMemory {
  dataspace_id: string;
  
  // Rules (Admin-approved only)
  rules: Array<{
    id: string;
    rule: string;
    approved_by: string;
    approved_at: string;
  }>;
  
  // Templates (Version controlled)
  templates: Array<{
    id: string;
    name: string;
    content: string;
    version: number;
  }>;
  
  // Structured Knowledge (Verified sources only)
  knowledge: Array<{
    id: string;
    topic: string;
    content: string;
    source: string;
    verified: boolean;
  }>;
  
  // Learned Preferences (User-deletable)
  preferences: Array<{
    id: string;
    key: string;
    value: unknown;
    learned_at: string;
    deletable: true; // Always true
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATASPACE LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

export type LifecyclePhase = 
  | 'creation'
  | 'metadata_assignment'
  | 'domain_mapping'
  | 'sphere_mapping'
  | 'identity_binding'
  | 'permissions_definition'
  | 'content_ingestion'
  | 'agent_processing'
  | 'workflow_execution'
  | 'evolution'
  | 'archiving'
  | 'deletion';

export interface DataSpaceLifecycle {
  dataspace_id: string;
  current_phase: LifecyclePhase;
  phase_history: Array<{
    phase: LifecyclePhase;
    entered_at: string;
    exited_at?: string;
    notes?: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DATASPACE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface DataSpace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  
  // Classification
  type: DataSpaceType;
  hierarchy: DataSpaceHierarchy;
  
  // Metadata
  metadata: DataSpaceMetadata;
  
  // Content
  documents: DataSpaceDocument[];
  media: DataSpaceMedia[];
  tasks: DataSpaceTask[];
  diagrams: DataSpaceDiagram[];
  xr_scenes: DataSpaceXRScene[];
  
  // Threads (from MemoryEngine)
  thread_ids: string[];
  
  // Sub-DataSpaces
  children: DataSpace[];
  
  // Temporal
  temporal_layers: TemporalLayer[];
  current_version: number;
  
  // Agent Memory
  agent_memory: DataSpaceAgentMemory;
  
  // Lifecycle
  lifecycle: DataSpaceLifecycle;
  
  // Stats
  stats: {
    total_documents: number;
    total_media: number;
    total_tasks: number;
    total_threads: number;
    storage_bytes: number;
    last_activity: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATION METHODS
// ═══════════════════════════════════════════════════════════════════════════════

export type CreationMethod = 
  | 'user_intent'              // Natural language
  | 'one_click'                // Dashboard button
  | 'file_import'              // Upload files
  | 'workspace_transform'      // Convert from workspace
  | 'meeting_creation'         // Schedule meeting
  | 'property_onboarding'      // Add property
  | 'blueprint_ingestion'      // Upload blueprints
  | 'creative_workflow'        // Start creative project
  | 'xr_room_generation'       // Create VR room
  | 'api'                      // External API
  | 'agent_suggestion';        // AI recommended

export interface DataSpaceCreationRequest {
  method: CreationMethod;
  name: string;
  description?: string;
  type?: DataSpaceType; // Auto-detected if not provided
  sphere_id: string;
  domain_id?: string;   // Auto-detected if not provided
  parent_id?: string;
  
  // Initial content
  initial_documents?: File[];
  initial_content?: string;
  
  // Configuration
  template_id?: string;
  custom_structure?: unknown;
  
  // Context
  source_context?: {
    workspace_id?: string;
    thread_id?: string;
    meeting_id?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH & QUERY
// ═══════════════════════════════════════════════════════════════════════════════

export interface DataSpaceQuery {
  // Filters
  sphere_id?: string;
  domain_id?: string;
  type?: DataSpaceType;
  status?: DataSpaceStatus;
  owner_id?: string;
  
  // Search
  search_text?: string;
  tags?: string[];
  
  // Date filters
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Sorting
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'type';
  sort_order?: 'asc' | 'desc';
  
  // Include options
  include_children?: boolean;
  include_stats?: boolean;
}

export interface DataSpaceQueryResult {
  dataspaces: DataSpace[];
  total_count: number;
  has_more: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DataSpaceTemplate {
  id: string;
  name: string;
  description: string;
  type: DataSpaceType;
  domain_id?: string;
  
  // Structure
  recommended_children: Array<{
    name: string;
    type: DataSpaceType;
    description: string;
  }>;
  
  // Initial content
  default_documents: Array<{
    name: string;
    template_content: string;
  }>;
  
  default_tasks: Array<{
    title: string;
    description: string;
  }>;
  
  // Auto-features
  auto_features: string[];
  
  // Domain-specific
  domain_config?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN-SPECIFIC TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Immobilier Personal
export interface PropertyDataSpaceConfig {
  address: string;
  property_type: 'house' | 'condo' | 'land' | 'cottage';
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  mortgage_info?: {
    lender: string;
    balance: number;
    monthly_payment: number;
    interest_rate: number;
    maturity_date: string;
  };
  insurance_info?: {
    provider: string;
    policy_number: string;
    annual_premium: number;
    renewal_date: string;
  };
}

// Immobilier Enterprise (Building)
export interface BuildingDataSpaceConfig {
  address: string;
  building_type: 'residential' | 'commercial' | 'mixed';
  total_units: number;
  units: Array<{
    unit_id: string;
    unit_number: string;
    bedrooms: number;
    rent_amount: number;
    tenant_name?: string;
    lease_start?: string;
    lease_end?: string;
  }>;
  financial: {
    monthly_revenue: number;
    monthly_expenses: number;
    roi_percentage: number;
  };
  tal_compliance: boolean; // Tribunal administratif du logement
}

// Construction
export interface ConstructionDataSpaceConfig {
  project_name: string;
  client_name: string;
  site_address: string;
  project_type: 'renovation' | 'new_construction' | 'addition' | 'repair';
  estimated_cost: number;
  actual_cost?: number;
  start_date: string;
  estimated_end_date: string;
  actual_end_date?: string;
  permits: Array<{
    type: string;
    number: string;
    status: 'pending' | 'approved' | 'expired';
  }>;
  rbq_license?: string; // Régie du bâtiment du Québec
  cnesst_compliance: boolean;
}

// Meeting
export interface MeetingDataSpaceConfig {
  scheduled_at: string;
  duration_minutes: number;
  participants: Array<{
    user_id: string;
    name: string;
    role: 'organizer' | 'required' | 'optional';
    status: 'pending' | 'accepted' | 'declined';
  }>;
  agenda: string[];
  location?: string;
  xr_enabled: boolean;
  recording_enabled: boolean;
}
