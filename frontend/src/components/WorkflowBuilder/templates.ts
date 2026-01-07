/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW TEMPLATES
   Pre-built node and workflow templates
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { 
  NodeTemplate, 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge,
  TriggerType,
  ActionType 
} from './types';
import { NODE_COLORS, NODE_ICONS } from './types';

// ════════════════════════════════════════════════════════════════════════════════
// NODE TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════

export const NODE_TEMPLATES: NodeTemplate[] = [
  // TRIGGERS
  {
    type: 'trigger',
    label: 'Manual Trigger',
    labelFr: 'Déclenchement manuel',
    description: 'Start workflow manually',
    descriptionFr: 'Démarrer le workflow manuellement',
    icon: '▶️',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'manual' },
  },
  {
    type: 'trigger',
    label: 'Scheduled',
    labelFr: 'Planifié',
    description: 'Run on a schedule',
    descriptionFr: 'Exécuter selon un horaire',
    icon: '📅',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'schedule', schedule: '0 9 * * *' },
  },
  {
    type: 'trigger',
    label: 'New Thread',
    labelFr: 'Nouveau fil',
    description: 'When a thread is created',
    descriptionFr: 'Quand un fil est créé',
    icon: '💬',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'thread_created' },
  },
  {
    type: 'trigger',
    label: 'New Message',
    labelFr: 'Nouveau message',
    description: 'When a message is posted',
    descriptionFr: 'Quand un message est posté',
    icon: '📨',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'thread_message' },
  },
  {
    type: 'trigger',
    label: 'Meeting Start',
    labelFr: 'Début de réunion',
    description: 'When a meeting starts',
    descriptionFr: 'Quand une réunion commence',
    icon: '🎬',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'meeting_start' },
  },
  {
    type: 'trigger',
    label: 'File Uploaded',
    labelFr: 'Fichier uploadé',
    description: 'When a file is uploaded',
    descriptionFr: 'Quand un fichier est uploadé',
    icon: '📤',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'file_uploaded' },
  },
  {
    type: 'trigger',
    label: 'Agent Complete',
    labelFr: 'Agent terminé',
    description: 'When an agent finishes',
    descriptionFr: 'Quand un agent termine',
    icon: '🤖',
    color: NODE_COLORS.trigger,
    category: 'trigger',
    defaultConfig: { triggerType: 'agent_complete' },
  },
  
  // LOGIC
  {
    type: 'condition',
    label: 'Condition',
    labelFr: 'Condition',
    description: 'Branch based on conditions',
    descriptionFr: 'Brancher selon des conditions',
    icon: '🔀',
    color: NODE_COLORS.condition,
    category: 'logic',
    defaultConfig: { conditions: [], logic: 'and' },
  },
  {
    type: 'loop',
    label: 'Loop',
    labelFr: 'Boucle',
    description: 'Iterate over items',
    descriptionFr: 'Itérer sur des éléments',
    icon: '🔄',
    color: NODE_COLORS.loop,
    category: 'logic',
    defaultConfig: { iterateOver: '', itemVariable: 'item', maxIterations: 100 },
  },
  {
    type: 'delay',
    label: 'Delay',
    labelFr: 'Délai',
    description: 'Wait before continuing',
    descriptionFr: 'Attendre avant de continuer',
    icon: '⏰',
    color: NODE_COLORS.delay,
    category: 'logic',
    defaultConfig: { duration: 5, unit: 'minutes' },
  },
  
  // AI AGENTS
  {
    type: 'agent',
    label: 'AI Agent',
    labelFr: 'Agent IA',
    description: 'Execute an AI agent',
    descriptionFr: 'Exécuter un agent IA',
    icon: '🤖',
    color: NODE_COLORS.agent,
    category: 'ai',
    defaultConfig: { agentId: '', prompt: '', maxTokens: 1000 },
  },
  {
    type: 'transform',
    label: 'Transform Data',
    labelFr: 'Transformer',
    description: 'Transform and map data',
    descriptionFr: 'Transformer et mapper les données',
    icon: '🔧',
    color: NODE_COLORS.transform,
    category: 'ai',
    defaultConfig: { transformations: [] },
  },
  
  // ACTIONS
  {
    type: 'action',
    label: 'Create Thread',
    labelFr: 'Créer un fil',
    description: 'Create a new thread',
    descriptionFr: 'Créer un nouveau fil',
    icon: '💬',
    color: NODE_COLORS.action,
    category: 'action',
    defaultConfig: { actionType: 'create_thread', title: '', content: '' },
  },
  {
    type: 'action',
    label: 'Send Message',
    labelFr: 'Envoyer un message',
    description: 'Send a message',
    descriptionFr: 'Envoyer un message',
    icon: '📨',
    color: NODE_COLORS.action,
    category: 'action',
    defaultConfig: { actionType: 'send_message', threadId: '', message: '' },
  },
  {
    type: 'action',
    label: 'Create Task',
    labelFr: 'Créer une tâche',
    description: 'Create a new task',
    descriptionFr: 'Créer une nouvelle tâche',
    icon: '✅',
    color: NODE_COLORS.action,
    category: 'action',
    defaultConfig: { actionType: 'create_task', title: '', assignee: '' },
  },
  {
    type: 'action',
    label: 'Create Meeting',
    labelFr: 'Créer une réunion',
    description: 'Schedule a meeting',
    descriptionFr: 'Planifier une réunion',
    icon: '📅',
    color: NODE_COLORS.action,
    category: 'action',
    defaultConfig: { actionType: 'create_meeting', title: '', datetime: '' },
  },
  {
    type: 'notification',
    label: 'Send Notification',
    labelFr: 'Notification',
    description: 'Send a notification',
    descriptionFr: 'Envoyer une notification',
    icon: '🔔',
    color: NODE_COLORS.notification,
    category: 'action',
    defaultConfig: { type: 'info', title: '', message: '', recipients: [] },
  },
  {
    type: 'webhook',
    label: 'Call Webhook',
    labelFr: 'Appeler webhook',
    description: 'Make HTTP request',
    descriptionFr: 'Faire une requête HTTP',
    icon: '🌐',
    color: NODE_COLORS.webhook,
    category: 'action',
    defaultConfig: { url: '', method: 'POST', headers: {}, body: '' },
  },
  
  // UTILITY
  {
    type: 'end',
    label: 'End',
    labelFr: 'Fin',
    description: 'End the workflow',
    descriptionFr: 'Terminer le workflow',
    icon: '🏁',
    color: NODE_COLORS.end,
    category: 'utility',
    defaultConfig: { status: 'success' },
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// PRE-BUILT WORKFLOW TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════

export const WORKFLOW_TEMPLATES: Array<Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'executionCount'>> = [
  // Template 1: Auto-respond to new threads
  {
    name: 'Auto Thread Response',
    nameFr: 'Réponse automatique aux fils',
    description: 'Automatically respond to new threads with AI',
    descriptionFr: 'Répondre automatiquement aux nouveaux fils avec IA',
    version: 1,
    status: 'draft',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        label: 'New Thread',
        labelFr: 'Nouveau fil',
        icon: '💬',
        color: NODE_COLORS.trigger,
        isValid: true,
        triggerType: 'thread_created',
        config: {},
      } as any,
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 250 },
        label: 'Analyze & Respond',
        labelFr: 'Analyser & Répondre',
        icon: '🤖',
        color: NODE_COLORS.agent,
        isValid: true,
        agentId: 'thread-responder',
        agentName: 'ThreadResponder',
        agentLevel: 'L1',
        config: {
          prompt: 'Analyze the thread and provide a helpful initial response',
          maxTokens: 500,
          inputMapping: { thread: '{{trigger.thread}}' },
          outputMapping: { response: 'agentResponse' },
        },
      } as any,
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        label: 'Post Response',
        labelFr: 'Poster la réponse',
        icon: '📨',
        color: NODE_COLORS.action,
        isValid: true,
        actionType: 'send_message',
        config: { threadId: '{{trigger.threadId}}', message: '{{agentResponse}}' },
      } as any,
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 550 },
        label: 'Done',
        labelFr: 'Terminé',
        icon: '🏁',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'agent-1' },
      { id: 'e2', source: 'agent-1', target: 'action-1' },
      { id: 'e3', source: 'action-1', target: 'end-1' },
    ],
    tokenBudget: 1000,
    maxExecutionTime: 60,
  },

  // Template 2: Meeting Summary
  {
    name: 'Meeting Summary',
    nameFr: 'Résumé de réunion',
    description: 'Generate and share meeting summary after meeting ends',
    descriptionFr: 'Générer et partager un résumé après la réunion',
    version: 1,
    status: 'draft',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        label: 'Meeting End',
        labelFr: 'Fin de réunion',
        icon: '🎬',
        color: NODE_COLORS.trigger,
        isValid: true,
        triggerType: 'meeting_end',
        config: {},
      } as any,
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 250 },
        label: 'Generate Summary',
        labelFr: 'Générer le résumé',
        icon: '🤖',
        color: NODE_COLORS.agent,
        isValid: true,
        agentId: 'meeting-summarizer',
        agentName: 'MeetingSummarizer',
        agentLevel: 'L2',
        config: {
          prompt: 'Generate a comprehensive meeting summary with action items',
          maxTokens: 1500,
          inputMapping: { 
            transcript: '{{trigger.transcript}}',
            participants: '{{trigger.participants}}' 
          },
          outputMapping: { 
            summary: 'meetingSummary',
            actionItems: 'actionItems'
          },
        },
      } as any,
      {
        id: 'loop-1',
        type: 'loop',
        position: { x: 100, y: 400 },
        label: 'For Each Participant',
        labelFr: 'Pour chaque participant',
        icon: '🔄',
        color: NODE_COLORS.loop,
        isValid: true,
        config: { 
          iterateOver: '{{trigger.participants}}',
          itemVariable: 'participant',
          maxIterations: 50
        },
      } as any,
      {
        id: 'notification-1',
        type: 'notification',
        position: { x: 100, y: 550 },
        label: 'Notify Participant',
        labelFr: 'Notifier le participant',
        icon: '🔔',
        color: NODE_COLORS.notification,
        isValid: true,
        config: {
          type: 'info',
          title: 'Meeting Summary Available',
          message: '{{meetingSummary}}',
          recipients: ['{{participant.id}}'],
          channels: ['app', 'email'],
        },
      } as any,
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 700 },
        label: 'Done',
        labelFr: 'Terminé',
        icon: '🏁',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'agent-1' },
      { id: 'e2', source: 'agent-1', target: 'loop-1' },
      { id: 'e3', source: 'loop-1', target: 'notification-1' },
      { id: 'e4', source: 'notification-1', target: 'end-1' },
    ],
    tokenBudget: 3000,
    maxExecutionTime: 120,
  },

  // Template 3: Document Analysis Pipeline
  {
    name: 'Document Analysis',
    nameFr: 'Analyse de document',
    description: 'Analyze uploaded documents and extract insights',
    descriptionFr: 'Analyser les documents uploadés et extraire des insights',
    version: 1,
    status: 'draft',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        label: 'File Uploaded',
        labelFr: 'Fichier uploadé',
        icon: '📤',
        color: NODE_COLORS.trigger,
        isValid: true,
        triggerType: 'file_uploaded',
        config: {},
      } as any,
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 100, y: 250 },
        label: 'Is Document?',
        labelFr: 'Est un document?',
        icon: '🔀',
        color: NODE_COLORS.condition,
        isValid: true,
        config: {
          conditions: [{ field: 'trigger.fileType', operator: 'contains', value: 'pdf' }],
          logic: 'or',
        },
      } as any,
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 250, y: 400 },
        label: 'Extract Content',
        labelFr: 'Extraire le contenu',
        icon: '🤖',
        color: NODE_COLORS.agent,
        isValid: true,
        agentId: 'document-analyzer',
        agentName: 'DocumentAnalyzer',
        agentLevel: 'L2',
        config: {
          prompt: 'Extract key information, summaries, and insights from this document',
          maxTokens: 2000,
          inputMapping: { document: '{{trigger.fileContent}}' },
          outputMapping: { 
            summary: 'docSummary',
            keyPoints: 'keyPoints',
            entities: 'entities'
          },
        },
      } as any,
      {
        id: 'action-1',
        type: 'action',
        position: { x: 250, y: 550 },
        label: 'Update DataSpace',
        labelFr: 'Mettre à jour DataSpace',
        icon: '💾',
        color: NODE_COLORS.action,
        isValid: true,
        actionType: 'update_dataspace',
        config: { 
          dataspaceId: '{{trigger.dataspaceId}}',
          metadata: {
            summary: '{{docSummary}}',
            keyPoints: '{{keyPoints}}',
            analyzedAt: '{{now}}'
          }
        },
      } as any,
      {
        id: 'notification-1',
        type: 'notification',
        position: { x: 250, y: 700 },
        label: 'Notify User',
        labelFr: 'Notifier l\'utilisateur',
        icon: '🔔',
        color: NODE_COLORS.notification,
        isValid: true,
        config: {
          type: 'success',
          title: 'Document Analyzed',
          message: 'Your document has been analyzed. Key points: {{keyPoints}}',
          recipients: ['trigger_user'],
          channels: ['app'],
        },
      } as any,
      {
        id: 'end-success',
        type: 'end',
        position: { x: 250, y: 850 },
        label: 'Done',
        labelFr: 'Terminé',
        icon: '🏁',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
      {
        id: 'end-skip',
        type: 'end',
        position: { x: -50, y: 400 },
        label: 'Skipped',
        labelFr: 'Ignoré',
        icon: '⏭️',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'condition-1' },
      { id: 'e2', source: 'condition-1', target: 'agent-1', sourceHandle: 'true', label: 'Yes' },
      { id: 'e3', source: 'condition-1', target: 'end-skip', sourceHandle: 'false', label: 'No' },
      { id: 'e4', source: 'agent-1', target: 'action-1' },
      { id: 'e5', source: 'action-1', target: 'notification-1' },
      { id: 'e6', source: 'notification-1', target: 'end-success' },
    ],
    tokenBudget: 5000,
    maxExecutionTime: 180,
  },

  // Template 4: Daily Digest
  {
    name: 'Daily Digest',
    nameFr: 'Résumé quotidien',
    description: 'Generate daily activity digest every morning',
    descriptionFr: 'Générer un résumé d\'activité chaque matin',
    version: 1,
    status: 'draft',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        label: 'Every Morning',
        labelFr: 'Chaque matin',
        icon: '📅',
        color: NODE_COLORS.trigger,
        isValid: true,
        triggerType: 'schedule',
        config: { schedule: '0 9 * * 1-5' }, // 9am weekdays
      } as any,
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 250 },
        label: 'Generate Digest',
        labelFr: 'Générer le résumé',
        icon: '🤖',
        color: NODE_COLORS.agent,
        isValid: true,
        agentId: 'digest-generator',
        agentName: 'DigestGenerator',
        agentLevel: 'L2',
        config: {
          prompt: 'Generate a daily digest of yesterday\'s activities, upcoming deadlines, and priorities',
          maxTokens: 1000,
          inputMapping: {},
          outputMapping: { digest: 'dailyDigest' },
        },
      } as any,
      {
        id: 'notification-1',
        type: 'notification',
        position: { x: 100, y: 400 },
        label: 'Send Digest',
        labelFr: 'Envoyer le résumé',
        icon: '🔔',
        color: NODE_COLORS.notification,
        isValid: true,
        config: {
          type: 'info',
          title: '☀️ Your Daily Digest',
          message: '{{dailyDigest}}',
          recipients: ['trigger_user'],
          channels: ['app', 'email'],
        },
      } as any,
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 550 },
        label: 'Done',
        labelFr: 'Terminé',
        icon: '🏁',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'agent-1' },
      { id: 'e2', source: 'agent-1', target: 'notification-1' },
      { id: 'e3', source: 'notification-1', target: 'end-1' },
    ],
    tokenBudget: 2000,
    maxExecutionTime: 60,
  },

  // Template 5: Deadline Reminder
  {
    name: 'Deadline Reminder',
    nameFr: 'Rappel d\'échéance',
    description: 'Send reminders when deadlines are approaching',
    descriptionFr: 'Envoyer des rappels quand les échéances approchent',
    version: 1,
    status: 'draft',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        label: 'Deadline Near',
        labelFr: 'Échéance proche',
        icon: '⏰',
        color: NODE_COLORS.trigger,
        isValid: true,
        triggerType: 'deadline_near',
        config: {},
      } as any,
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 100, y: 250 },
        label: 'High Priority?',
        labelFr: 'Haute priorité?',
        icon: '🔀',
        color: NODE_COLORS.condition,
        isValid: true,
        config: {
          conditions: [{ field: 'trigger.priority', operator: 'equals', value: 'high' }],
          logic: 'and',
        },
      } as any,
      {
        id: 'notification-urgent',
        type: 'notification',
        position: { x: 250, y: 400 },
        label: 'Urgent Reminder',
        labelFr: 'Rappel urgent',
        icon: '🚨',
        color: NODE_COLORS.notification,
        isValid: true,
        config: {
          type: 'warning',
          title: '🚨 Urgent Deadline!',
          message: '{{trigger.taskTitle}} is due in {{trigger.timeRemaining}}',
          recipients: ['{{trigger.assignee}}'],
          channels: ['app', 'email', 'push'],
        },
      } as any,
      {
        id: 'notification-normal',
        type: 'notification',
        position: { x: -50, y: 400 },
        label: 'Normal Reminder',
        labelFr: 'Rappel normal',
        icon: '🔔',
        color: NODE_COLORS.notification,
        isValid: true,
        config: {
          type: 'info',
          title: 'Deadline Reminder',
          message: '{{trigger.taskTitle}} is due in {{trigger.timeRemaining}}',
          recipients: ['{{trigger.assignee}}'],
          channels: ['app'],
        },
      } as any,
      {
        id: 'end-1',
        type: 'end',
        position: { x: 100, y: 550 },
        label: 'Done',
        labelFr: 'Terminé',
        icon: '🏁',
        color: NODE_COLORS.end,
        isValid: true,
        config: { status: 'success' },
      } as any,
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'condition-1' },
      { id: 'e2', source: 'condition-1', target: 'notification-urgent', sourceHandle: 'true', label: 'Yes' },
      { id: 'e3', source: 'condition-1', target: 'notification-normal', sourceHandle: 'false', label: 'No' },
      { id: 'e4', source: 'notification-urgent', target: 'end-1' },
      { id: 'e5', source: 'notification-normal', target: 'end-1' },
    ],
    tokenBudget: 500,
    maxExecutionTime: 30,
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const getTemplatesByCategory = (category: NodeTemplate['category']): NodeTemplate[] => {
  return NODE_TEMPLATES.filter(t => t.category === category);
};

export const getNodeTemplate = (type: string, subtype?: string): NodeTemplate | undefined => {
  return NODE_TEMPLATES.find(t => {
    if (t.type !== type) return false;
    if (subtype && t.defaultConfig.triggerType !== subtype && t.defaultConfig.actionType !== subtype) {
      return false;
    }
    return true;
  });
};

export const createWorkflowFromTemplate = (
  template: typeof WORKFLOW_TEMPLATES[0],
  createdBy: string
): Workflow => {
  const now = new Date();
  return {
    ...template,
    id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    createdBy,
    executionCount: 0,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default NODE_TEMPLATES;
