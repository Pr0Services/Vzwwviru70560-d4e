/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW BUILDER INDEX
   Visual automation system with 226 AI agents
   ═══════════════════════════════════════════════════════════════════════════════
   
   USAGE:
   
   import { 
     WorkflowBuilder, 
     WorkflowDesignerUI,
     useWorkflowBuilder,
     designWorkflow,
     NODE_TEMPLATES,
     WORKFLOW_TEMPLATES 
   } from '@/components/WorkflowBuilder';
   
   // Basic usage
   function MyWorkflowEditor() {
     return (
       <WorkflowBuilder
         onSave={(workflow) => logger.debug('Saved:', workflow)}
         onExecute={(workflow) => logger.debug('Execute:', workflow)}
         locale="fr"
       />
     );
   }
   
   // AI-Designed Workflows (UNIQUE DIFFERENTIATOR!)
   function AIWorkflowDesigner() {
     return (
       <WorkflowDesignerUI
         onWorkflowGenerated={(wf) => logger.debug('AI created:', wf)}
         onEditWorkflow={(wf) => openBuilder(wf)}
         locale="es" // Trilingual: EN/FR/ES
       />
     );
   }
   
   // With hook for more control
   function AdvancedEditor() {
     const {
       workflows,
       currentWorkflow,
       createWorkflow,
       saveWorkflow,
       execute,
       validate,
       undo,
       redo,
     } = useWorkflowBuilder();
     
     return (
       <WorkflowBuilder
         workflow={currentWorkflow}
         onChange={saveWorkflow}
         onExecute={execute}
       />
     );
   }
   
   FEATURES:
   - ✅ Drag & drop node placement
   - ✅ Visual edge connections
   - ✅ 20+ pre-built node types
   - ✅ 5 workflow templates
   - ✅ Zoom & pan controls
   - ✅ Undo/redo history
   - ✅ Validation system
   - ✅ Export/import
   - ✅ Execution simulation
   - ✅ Trilingual (FR/EN/ES)
   - ✅ AI WORKFLOW DESIGNER - Describe in natural language, get a workflow!
   - ✅ Integration with 226 CHE·NU agents
   
   NODE TYPES:
   - Triggers: Manual, Schedule, Event, Webhook, Thread, Meeting, File, Agent
   - Logic: Condition, Loop, Delay
   - AI: Agent (226 available), Transform
   - Actions: Create Thread/Task/Meeting, Notification, Webhook
   - Utility: End
   
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export { WorkflowBuilder } from './WorkflowBuilder';
export { default } from './WorkflowBuilder';
export { WorkflowNode } from './WorkflowNode';
export { WorkflowSidebar } from './WorkflowSidebar';
export { WorkflowDesignerUI } from './WorkflowDesignerUI';

// ════════════════════════════════════════════════════════════════════════════════
// AI WORKFLOW DESIGNER (UNIQUE!)
// ════════════════════════════════════════════════════════════════════════════════

export { 
  designWorkflow,
  analyzeIntent,
  createWorkflowDesigner,
  type WorkflowDesignRequest,
  type WorkflowDesignResult,
  type IntentAnalysis,
} from './WorkflowDesignerAgent';

// ════════════════════════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════════════════════════

export { useWorkflowBuilder } from './useWorkflowBuilder';

// ════════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════

export { 
  NODE_TEMPLATES, 
  WORKFLOW_TEMPLATES,
  getTemplatesByCategory,
  getNodeTemplate,
  createWorkflowFromTemplate,
} from './templates';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type {
  // Node types
  WorkflowNodeType,
  WorkflowNode,
  TriggerNode,
  ConditionNode,
  ActionNode,
  AgentNode,
  DelayNode,
  LoopNode,
  TransformNode,
  NotificationNode,
  WebhookNode,
  EndNode,
  
  // Subtypes
  TriggerType,
  ActionType,
  ConditionOperator,
  ConditionConfig,
  
  // Edge
  WorkflowEdge,
  
  // Workflow
  Workflow,
  
  // Execution
  WorkflowExecution,
  ExecutionStatus,
  ExecutionLog,
  
  // Builder
  WorkflowBuilderState,
  ValidationError,
  
  // Templates
  NodeTemplate,
  
  // Utilities
  Position,
} from './types';

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

export { 
  NODE_COLORS, 
  NODE_ICONS,
  TRIGGER_LABELS,
  ACTION_LABELS,
} from './types';

// ════════════════════════════════════════════════════════════════════════════════
// LOCALIZATION
// ════════════════════════════════════════════════════════════════════════════════

export type { Locale } from './WorkflowDesignerAgent';
