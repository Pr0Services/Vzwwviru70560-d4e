/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW BUILDER TYPES
   Visual automation system with AI agents
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// NODE TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type WorkflowNodeType =
  | 'trigger'      // Start of workflow
  | 'condition'    // If/else branching
  | 'action'       // Perform action
  | 'agent'        // AI agent execution
  | 'delay'        // Wait/delay
  | 'loop'         // Iterate over items
  | 'transform'    // Transform data
  | 'notification' // Send notification
  | 'webhook'      // External webhook
  | 'end';         // End of workflow

export type TriggerType =
  | 'manual'           // Manual trigger
  | 'schedule'         // Cron schedule
  | 'event'            // System event
  | 'webhook'          // Incoming webhook
  | 'thread_created'   // New thread
  | 'thread_message'   // New message in thread
  | 'meeting_start'    // Meeting starts
  | 'meeting_end'      // Meeting ends
  | 'file_uploaded'    // File uploaded
  | 'agent_complete'   // Agent finished task
  | 'decision_made'    // Decision recorded
  | 'deadline_near';   // Deadline approaching

export type ActionType =
  | 'create_thread'
  | 'send_message'
  | 'create_task'
  | 'update_task'
  | 'create_meeting'
  | 'send_notification'
  | 'update_dataspace'
  | 'move_file'
  | 'send_email'
  | 'call_webhook'
  | 'log_event'
  | 'assign_to_user';

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'matches_regex';

// ════════════════════════════════════════════════════════════════════════════════
// NODE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════════

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNodeBase {
  id: string;
  type: WorkflowNodeType;
  position: Position;
  label: string;
  labelFr?: string;
  description?: string;
  descriptionFr?: string;
  icon: string;
  color: string;
  isValid: boolean;
  errors?: string[];
}

export interface TriggerNode extends WorkflowNodeBase {
  type: 'trigger';
  triggerType: TriggerType;
  config: {
    schedule?: string;        // Cron expression
    eventType?: string;       // Event name
    webhookPath?: string;     // Webhook path
    sphereId?: string;        // Filter by sphere
    conditions?: ConditionConfig[];
  };
}

export interface ConditionNode extends WorkflowNodeBase {
  type: 'condition';
  config: {
    conditions: ConditionConfig[];
    logic: 'and' | 'or';
  };
}

export interface ConditionConfig {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

export interface ActionNode extends WorkflowNodeBase {
  type: 'action';
  actionType: ActionType;
  config: Record<string, any>;
}

export interface AgentNode extends WorkflowNodeBase {
  type: 'agent';
  agentId: string;
  agentName: string;
  agentLevel: 'L0' | 'L1' | 'L2' | 'L3';
  config: {
    prompt?: string;
    maxTokens?: number;
    timeout?: number;
    inputMapping: Record<string, string>;
    outputMapping: Record<string, string>;
  };
}

export interface DelayNode extends WorkflowNodeBase {
  type: 'delay';
  config: {
    duration: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
  };
}

export interface LoopNode extends WorkflowNodeBase {
  type: 'loop';
  config: {
    iterateOver: string;  // Variable path
    itemVariable: string; // Name for current item
    maxIterations?: number;
  };
}

export interface TransformNode extends WorkflowNodeBase {
  type: 'transform';
  config: {
    transformations: Array<{
      source: string;
      target: string;
      operation: 'copy' | 'format' | 'extract' | 'combine' | 'calculate';
      params?: Record<string, any>;
    }>;
  };
}

export interface NotificationNode extends WorkflowNodeBase {
  type: 'notification';
  config: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    recipients: string[];  // User IDs or 'trigger_user'
    channels: ('app' | 'email' | 'push')[];
  };
}

export interface WebhookNode extends WorkflowNodeBase {
  type: 'webhook';
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string;
    responseMapping?: Record<string, string>;
  };
}

export interface EndNode extends WorkflowNodeBase {
  type: 'end';
  config: {
    status: 'success' | 'failure' | 'cancelled';
    outputMapping?: Record<string, string>;
  };
}

export type WorkflowNode =
  | TriggerNode
  | ConditionNode
  | ActionNode
  | AgentNode
  | DelayNode
  | LoopNode
  | TransformNode
  | NotificationNode
  | WebhookNode
  | EndNode;

// ════════════════════════════════════════════════════════════════════════════════
// EDGES (CONNECTIONS)
// ════════════════════════════════════════════════════════════════════════════════

export interface WorkflowEdge {
  id: string;
  source: string;       // Source node ID
  target: string;       // Target node ID
  sourceHandle?: string; // For condition nodes: 'true' | 'false'
  label?: string;
  labelFr?: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// WORKFLOW DEFINITION
// ════════════════════════════════════════════════════════════════════════════════

export interface Workflow {
  id: string;
  name: string;
  nameFr?: string;
  description?: string;
  descriptionFr?: string;
  version: number;
  status: 'draft' | 'active' | 'paused' | 'archived';
  
  // Structure
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // Metadata
  sphereId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Governance
  tokenBudget?: number;
  maxExecutionTime?: number; // seconds
  retryPolicy?: {
    maxRetries: number;
    retryDelay: number;
  };
  
  // Stats
  executionCount: number;
  lastExecutedAt?: Date;
  averageExecutionTime?: number;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXECUTION
// ════════════════════════════════════════════════════════════════════════════════

export type ExecutionStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'waiting';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowVersion: number;
  status: ExecutionStatus;
  
  // Progress
  currentNodeId?: string;
  completedNodes: string[];
  
  // Data
  triggerData: Record<string, any>;
  context: Record<string, any>;
  outputs: Record<string, any>;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  
  // Errors
  error?: {
    nodeId: string;
    message: string;
    stack?: string;
  };
  
  // Logs
  logs: ExecutionLog[];
  
  // Tokens
  tokensUsed: number;
}

export interface ExecutionLog {
  timestamp: Date;
  nodeId: string;
  nodeName: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: Record<string, any>;
}

// ════════════════════════════════════════════════════════════════════════════════
// BUILDER STATE
// ════════════════════════════════════════════════════════════════════════════════

export interface WorkflowBuilderState {
  workflow: Workflow;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isDragging: boolean;
  isConnecting: boolean;
  connectionSource: string | null;
  zoom: number;
  panOffset: Position;
  history: {
    past: Workflow[];
    future: Workflow[];
  };
  validationErrors: ValidationError[];
  isSaving: boolean;
  isExecuting: boolean;
}

export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  field?: string;
  message: string;
  messageFr?: string;
  severity: 'error' | 'warning';
}

// ════════════════════════════════════════════════════════════════════════════════
// NODE TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════

export interface NodeTemplate {
  type: WorkflowNodeType;
  label: string;
  labelFr: string;
  description: string;
  descriptionFr: string;
  icon: string;
  color: string;
  category: 'trigger' | 'logic' | 'action' | 'ai' | 'utility';
  defaultConfig: Record<string, any>;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

export const NODE_COLORS: Record<WorkflowNodeType, string> = {
  trigger: '#3F7249',      // Jungle Emerald
  condition: '#D8B26A',    // Sacred Gold
  action: '#3EB4A2',       // Cenote Turquoise
  agent: '#7A593A',        // Earth Ember
  delay: '#8D8371',        // Ancient Stone
  loop: '#2F4C39',         // Shadow Moss
  transform: '#3EB4A2',    // Cenote Turquoise
  notification: '#D8B26A', // Sacred Gold
  webhook: '#8D8371',      // Ancient Stone
  end: '#1E1F22',          // UI Slate
};

export const NODE_ICONS: Record<WorkflowNodeType, string> = {
  trigger: '⚡',
  condition: '🔀',
  action: '▶️',
  agent: '🤖',
  delay: '⏰',
  loop: '🔄',
  transform: '🔧',
  notification: '🔔',
  webhook: '🌐',
  end: '🏁',
};

export const TRIGGER_LABELS: Record<TriggerType, { en: string; fr: string }> = {
  manual: { en: 'Manual Trigger', fr: 'Déclenchement manuel' },
  schedule: { en: 'Scheduled', fr: 'Planifié' },
  event: { en: 'System Event', fr: 'Événement système' },
  webhook: { en: 'Webhook', fr: 'Webhook' },
  thread_created: { en: 'Thread Created', fr: 'Fil créé' },
  thread_message: { en: 'New Message', fr: 'Nouveau message' },
  meeting_start: { en: 'Meeting Start', fr: 'Début de réunion' },
  meeting_end: { en: 'Meeting End', fr: 'Fin de réunion' },
  file_uploaded: { en: 'File Uploaded', fr: 'Fichier uploadé' },
  agent_complete: { en: 'Agent Complete', fr: 'Agent terminé' },
  decision_made: { en: 'Decision Made', fr: 'Décision prise' },
  deadline_near: { en: 'Deadline Near', fr: 'Échéance proche' },
};

export const ACTION_LABELS: Record<ActionType, { en: string; fr: string }> = {
  create_thread: { en: 'Create Thread', fr: 'Créer un fil' },
  send_message: { en: 'Send Message', fr: 'Envoyer un message' },
  create_task: { en: 'Create Task', fr: 'Créer une tâche' },
  update_task: { en: 'Update Task', fr: 'Modifier une tâche' },
  create_meeting: { en: 'Create Meeting', fr: 'Créer une réunion' },
  send_notification: { en: 'Send Notification', fr: 'Envoyer une notification' },
  update_dataspace: { en: 'Update DataSpace', fr: 'Modifier le DataSpace' },
  move_file: { en: 'Move File', fr: 'Déplacer un fichier' },
  send_email: { en: 'Send Email', fr: 'Envoyer un email' },
  call_webhook: { en: 'Call Webhook', fr: 'Appeler un webhook' },
  log_event: { en: 'Log Event', fr: 'Journaliser' },
  assign_to_user: { en: 'Assign to User', fr: 'Assigner à un utilisateur' },
};
