/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — 1-CLICK ASSISTANT ENGINE TYPES                        ║
 * ║              Friction-Free Action Layer                                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "One instruction → Many coordinated operations."                            ║
 * ║  "Governed, Reversible, Explainable, Identity-Scoped"                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type InputType = 
  | 'natural_language'    // Short natural language prompt
  | 'fragment'            // Fragment of information
  | 'file_upload'         // File upload (PDF, DOCX, XLSX, etc.)
  | 'visual'              // Screenshot, photo, sketch
  | 'workspace_context'   // Current workspace state
  | 'thread_context'      // Conversation context
  | 'dataspace_reference' // Existing DataSpace reference
  | 'multi_modal';        // Combination of above

export type FileType = 
  | 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'md'
  | 'png' | 'jpg' | 'svg' | 'webp'
  | 'mp3' | 'wav' | 'm4a'
  | 'mp4' | 'mov' | 'webm'
  | 'json' | 'xml' | 'csv';

export interface OneClickInput {
  id: string;
  type: InputType;
  
  // Text input
  text?: string;
  
  // File input
  file?: {
    name: string;
    type: FileType;
    size_bytes: number;
    url?: string;
    content?: string; // For text files
    base64?: string;  // For binary files
  };
  
  // Visual input
  visual?: {
    type: 'screenshot' | 'photo' | 'sketch' | 'whiteboard';
    url: string;
    annotations?: Array<{
      x: number;
      y: number;
      text: string;
    }>;
  };
  
  // Context references
  workspace_id?: string;
  thread_id?: string;
  dataspace_id?: string;
  
  // User context
  user_id: string;
  sphere_id: string;
  domain_hints?: string[];
  
  // Timestamp
  submitted_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type OutputType = 
  | 'document'            // Complete document/report
  | 'spreadsheet'         // Financial model, data table
  | 'presentation'        // Slide deck
  | 'diagram'             // Flowchart, architecture
  | 'dashboard'           // Visual summary
  | 'dataspace'           // Organized DataSpace
  | 'task_list'           // Action items
  | 'calendar_events'     // Scheduled events
  | 'xr_scene'            // 3D visualization
  | 'summary'             // Executive overview
  | 'notification'        // Alert/reminder
  | 'workflow';           // Automated process

export interface OneClickOutput {
  id: string;
  type: OutputType;
  title: string;
  description?: string;
  
  // Content
  content: unknown; // Type varies by output type
  
  // Files generated
  files: Array<{
    id: string;
    name: string;
    type: FileType;
    url: string;
    size_bytes: number;
  }>;
  
  // Storage location
  dataspace_id?: string;
  
  // Metadata
  generated_at: string;
  generation_time_ms: number;
  quality_score?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTENT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export type IntentCategory = 
  | 'create'              // Create new content
  | 'analyze'             // Analyze existing content
  | 'transform'           // Convert or restructure
  | 'organize'            // Organize/categorize
  | 'summarize'           // Generate summary
  | 'estimate'            // Calculate/estimate
  | 'schedule'            // Time management
  | 'communicate'         // Draft communication
  | 'visualize'           // Create visuals
  | 'automate';           // Set up automation

export interface IntentAnalysis {
  id: string;
  input_id: string;
  
  // Core intent
  primary_intent: IntentCategory;
  secondary_intents: IntentCategory[];
  
  // Natural language understanding
  purpose: string;           // What user wants to accomplish
  scope: 'simple' | 'medium' | 'complex';
  constraints: string[];     // Any limitations mentioned
  
  // Domain detection
  spheres: string[];
  domains: string[];
  
  // Gap analysis
  missing_info: Array<{
    field: string;
    required: boolean;
    default_available: boolean;
    clarification_prompt?: string;
  }>;
  
  // Confidence
  confidence: number;
  requires_clarification: boolean;
  clarification_questions: string[];
  
  // Timing
  analyzed_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORKFLOW TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type WorkflowStepType = 
  | 'file_transform'      // Process file
  | 'content_extract'     // Extract information
  | 'content_analyze'     // Analyze content
  | 'content_generate'    // Generate new content
  | 'content_format'      // Format/style
  | 'dataspace_create'    // Create DataSpace
  | 'dataspace_update'    // Update DataSpace
  | 'agent_task'          // Delegate to agent
  | 'calculation'         // Perform calculation
  | 'visualization'       // Create visual
  | 'notification'        // Send notification
  | 'checkpoint'          // Verification point
  | 'human_review';       // Require human approval

export type WorkflowStepStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'awaiting_approval';

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  description: string;
  
  // Execution
  order: number;
  parallel_group?: string;  // Steps with same group run in parallel
  
  // Dependencies
  depends_on: string[];     // Step IDs
  
  // Agent assignment
  agent_id?: string;
  agent_type?: string;
  
  // Input/Output
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  
  // Status
  status: WorkflowStepStatus;
  started_at?: string;
  completed_at?: string;
  error?: string;
  
  // Reversibility
  can_undo: boolean;
  undo_action?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  
  // Input
  input_id: string;
  intent_id: string;
  
  // Steps
  steps: WorkflowStep[];
  current_step: number;
  
  // Parallelization
  parallel_groups: Map<string, string[]>; // group_name -> step_ids
  
  // Checkpoints
  checkpoints: Array<{
    step_id: string;
    description: string;
    requires_approval: boolean;
    approved?: boolean;
    approved_by?: string;
  }>;
  
  // Fallbacks
  fallback_steps: Map<string, WorkflowStep[]>; // step_id -> fallback steps
  
  // Status
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  
  // Timing
  created_at: string;
  started_at?: string;
  completed_at?: string;
  estimated_duration_ms?: number;
  actual_duration_ms?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPERATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type OperationType = 
  // Construction domain
  | 'construction_estimate'
  | 'materials_list'
  | 'project_timeline'
  | 'permit_checklist'
  
  // Immobilier domain
  | 'portfolio_organization'
  | 'property_card_generation'
  | 'rent_analysis'
  | 'maintenance_schedule'
  | 'tenant_report'
  
  // Business domain
  | 'business_plan'
  | 'investor_pitch'
  | 'financial_projection'
  | 'competitive_analysis'
  
  // Meeting domain
  | 'meeting_actionability'
  | 'decision_extraction'
  | 'action_plan'
  | 'meeting_summary'
  
  // Creative domain
  | 'storyboard_generation'
  | 'brand_kit'
  | 'content_calendar'
  
  // General
  | 'document_transformation'
  | 'data_analysis'
  | 'sketch_to_formal'
  | 'organize_content'
  | 'custom';

export interface OperationDefinition {
  type: OperationType;
  name: string;
  description: string;
  
  // Requirements
  required_domains: string[];
  required_inputs: InputType[];
  
  // Workflow template
  template_steps: Omit<WorkflowStep, 'id' | 'status'>[];
  
  // Output
  expected_outputs: OutputType[];
  
  // Complexity
  estimated_duration_ms: number;
  token_cost_estimate: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GovernanceCheck {
  check_type: 'permission' | 'identity' | 'budget' | 'data_access' | 'reversibility';
  passed: boolean;
  details: string;
  blocking: boolean;
  elevation_available?: boolean;
  elevation_approved?: boolean;
}

export interface OperationAudit {
  operation_id: string;
  user_id: string;
  
  // Input
  input_summary: string;
  input_type: InputType;
  
  // Intent
  detected_intent: IntentCategory;
  confidence: number;
  
  // Execution
  workflow_id: string;
  steps_executed: number;
  steps_total: number;
  
  // Governance
  governance_checks: GovernanceCheck[];
  all_checks_passed: boolean;
  
  // Output
  outputs_generated: OutputType[];
  
  // Reversibility
  can_undo: boolean;
  undo_token?: string;
  
  // Timing
  started_at: string;
  completed_at: string;
  duration_ms: number;
  
  // Cost
  tokens_consumed: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface OneClickSession {
  id: string;
  user_id: string;
  
  // Active operation
  current_input?: OneClickInput;
  current_intent?: IntentAnalysis;
  current_workflow?: Workflow;
  
  // Pending clarifications
  clarifications_pending: Array<{
    question: string;
    field: string;
    answered: boolean;
    answer?: string;
  }>;
  
  // History (this session)
  completed_operations: OperationAudit[];
  
  // State
  status: 'idle' | 'analyzing' | 'clarifying' | 'executing' | 'reviewing';
  
  // Timing
  started_at: string;
  last_activity: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REQUEST/RESPONSE
// ═══════════════════════════════════════════════════════════════════════════════

export interface OneClickRequest {
  // Basic input
  text?: string;
  file?: File;
  visual_url?: string;
  
  // Context
  workspace_id?: string;
  thread_id?: string;
  dataspace_id?: string;
  sphere_id: string;
  
  // User
  user_id: string;
  
  // Options
  skip_clarification?: boolean;
  max_tokens?: number;
  priority?: 'normal' | 'high';
}

export interface OneClickResponse {
  session_id: string;
  
  // Status
  status: 'analyzing' | 'clarifying' | 'executing' | 'completed' | 'failed';
  
  // If clarifying
  clarification_questions?: string[];
  
  // If executing/completed
  workflow?: Workflow;
  progress?: number;
  
  // If completed
  outputs?: OneClickOutput[];
  
  // If failed
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
  
  // Audit reference
  audit_id?: string;
}
