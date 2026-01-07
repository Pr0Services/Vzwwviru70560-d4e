/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW DESIGNER AGENT
   AI agent that designs custom workflows from natural language descriptions
   ═══════════════════════════════════════════════════════════════════════════════
   
   FLOW:
   1. User describes what they want to automate in natural language
   2. Agent analyzes intent and generates a complete workflow
   3. User reviews and edits the generated workflow in visual builder
   4. User activates the workflow
   
   UNIQUE DIFFERENTIATOR: No competitor has AI-designed automation!
   
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge,
  TriggerType,
  ActionType,
  WorkflowNodeType 
} from './types';
import { NODE_COLORS } from './types';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type Locale = 'en' | 'fr' | 'es';

export interface WorkflowDesignRequest {
  description: string;
  locale: Locale;
  sphereId?: string;
  constraints?: {
    maxNodes?: number;
    maxTokenBudget?: number;
    allowedTriggers?: TriggerType[];
    allowedActions?: ActionType[];
  };
}

export interface WorkflowDesignResult {
  success: boolean;
  workflow?: Workflow;
  explanation: string;
  suggestions?: string[];
  estimatedTokenCost?: number;
}

export interface IntentAnalysis {
  triggers: TriggerType[];
  actions: ActionType[];
  conditions: string[];
  loops: boolean;
  aiAgentNeeded: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

// ════════════════════════════════════════════════════════════════════════════════
// LOCALIZED STRINGS
// ════════════════════════════════════════════════════════════════════════════════

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    analyzing: 'Analyzing your request...',
    generating: 'Generating workflow...',
    success: 'Workflow generated successfully!',
    review: 'Please review and edit the workflow before activating.',
    noTrigger: 'Could not identify a trigger. Please specify when this should run.',
    noAction: 'Could not identify actions. Please specify what should happen.',
    tooComplex: 'This request is too complex. Try breaking it into smaller workflows.',
    suggestion: 'Suggestion',
    estimatedCost: 'Estimated token cost per execution',
  },
  fr: {
    analyzing: 'Analyse de votre demande...',
    generating: 'Génération du workflow...',
    success: 'Workflow généré avec succès!',
    review: 'Veuillez réviser et modifier le workflow avant de l\'activer.',
    noTrigger: 'Impossible d\'identifier un déclencheur. Précisez quand cela doit s\'exécuter.',
    noAction: 'Impossible d\'identifier des actions. Précisez ce qui doit se passer.',
    tooComplex: 'Cette demande est trop complexe. Essayez de la diviser en workflows plus petits.',
    suggestion: 'Suggestion',
    estimatedCost: 'Coût estimé en tokens par exécution',
  },
  es: {
    analyzing: 'Analizando su solicitud...',
    generating: 'Generando flujo de trabajo...',
    success: '¡Flujo de trabajo generado con éxito!',
    review: 'Por favor revise y edite el flujo de trabajo antes de activarlo.',
    noTrigger: 'No se pudo identificar un disparador. Especifique cuándo debe ejecutarse.',
    noAction: 'No se pudieron identificar acciones. Especifique qué debe suceder.',
    tooComplex: 'Esta solicitud es demasiado compleja. Intente dividirla en flujos más pequeños.',
    suggestion: 'Sugerencia',
    estimatedCost: 'Costo estimado de tokens por ejecución',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// INTENT KEYWORDS (Multilingual)
// ════════════════════════════════════════════════════════════════════════════════

const TRIGGER_KEYWORDS: Record<TriggerType, string[]> = {
  manual: ['manually', 'manuellement', 'manualmente', 'click', 'button', 'bouton', 'botón'],
  schedule: ['every day', 'daily', 'weekly', 'chaque jour', 'quotidien', 'cada día', 'diario', 'morning', 'matin', 'mañana', 'cron', 'schedule', 'horaire', 'programar'],
  event: ['when event', 'quand événement', 'cuando evento', 'on event'],
  webhook: ['webhook', 'api call', 'external', 'externe', 'externo'],
  thread_created: ['new thread', 'nouveau fil', 'nuevo hilo', 'thread created', 'fil créé', 'hilo creado'],
  thread_message: ['new message', 'nouveau message', 'nuevo mensaje', 'reply', 'réponse', 'respuesta'],
  meeting_start: ['meeting starts', 'début réunion', 'inicio reunión', 'when meeting'],
  meeting_end: ['meeting ends', 'fin réunion', 'fin reunión', 'after meeting', 'après réunion', 'después reunión'],
  file_uploaded: ['file uploaded', 'fichier uploadé', 'archivo subido', 'new file', 'nouveau fichier', 'nuevo archivo', 'document added', 'document ajouté', 'documento añadido'],
  agent_complete: ['agent finishes', 'agent termine', 'agente termina', 'when agent', 'quand agent', 'cuando agente'],
  decision_made: ['decision made', 'décision prise', 'decisión tomada', 'when decided', 'quand décidé', 'cuando decidido'],
  deadline_near: ['deadline', 'échéance', 'fecha límite', 'due soon', 'bientôt dû', 'vence pronto'],
};

const ACTION_KEYWORDS: Record<ActionType, string[]> = {
  create_thread: ['create thread', 'créer fil', 'crear hilo', 'new thread', 'nouveau fil', 'nuevo hilo', 'start conversation', 'commencer conversation', 'iniciar conversación'],
  send_message: ['send message', 'envoyer message', 'enviar mensaje', 'post', 'poster', 'publicar', 'reply', 'répondre', 'responder'],
  create_task: ['create task', 'créer tâche', 'crear tarea', 'add task', 'ajouter tâche', 'añadir tarea', 'todo'],
  update_task: ['update task', 'modifier tâche', 'actualizar tarea', 'mark complete', 'marquer terminé', 'marcar completado'],
  create_meeting: ['schedule meeting', 'planifier réunion', 'programar reunión', 'create meeting', 'créer réunion', 'crear reunión'],
  send_notification: ['notify', 'notifier', 'notificar', 'alert', 'alerter', 'alertar', 'send notification', 'envoyer notification', 'enviar notificación'],
  update_dataspace: ['update data', 'modifier données', 'actualizar datos', 'save to', 'sauvegarder', 'guardar'],
  move_file: ['move file', 'déplacer fichier', 'mover archivo', 'organize', 'organiser', 'organizar'],
  send_email: ['send email', 'envoyer email', 'enviar correo', 'email', 'courriel', 'correo'],
  call_webhook: ['call api', 'appeler api', 'llamar api', 'webhook', 'http request', 'requête http', 'solicitud http'],
  log_event: ['log', 'journaliser', 'registrar', 'record', 'enregistrer', 'grabar'],
  assign_to_user: ['assign', 'assigner', 'asignar', 'delegate', 'déléguer', 'delegar'],
};

const AI_KEYWORDS = [
  'analyze', 'analyser', 'analizar',
  'summarize', 'résumer', 'resumir',
  'generate', 'générer', 'generar',
  'ai', 'ia', 'intelligent',
  'extract', 'extraire', 'extraer',
  'understand', 'comprendre', 'comprender',
  'classify', 'classifier', 'clasificar',
  'translate', 'traduire', 'traducir',
  'write', 'écrire', 'escribir',
  'respond', 'répondre', 'responder',
];

const CONDITION_KEYWORDS = [
  'if', 'si',
  'when', 'quand', 'cuando',
  'only if', 'seulement si', 'solo si',
  'unless', 'sauf si', 'a menos que',
  'depending', 'selon', 'dependiendo',
  'based on', 'basé sur', 'basado en',
];

const LOOP_KEYWORDS = [
  'for each', 'pour chaque', 'para cada',
  'all', 'tous', 'todos',
  'every', 'chaque', 'cada',
  'iterate', 'itérer', 'iterar',
  'loop', 'boucle', 'bucle',
];

// ════════════════════════════════════════════════════════════════════════════════
// HELPER: Generate ID
// ════════════════════════════════════════════════════════════════════════════════

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// INTENT ANALYZER
// ════════════════════════════════════════════════════════════════════════════════

export const analyzeIntent = (description: string): IntentAnalysis => {
  const text = description.toLowerCase();
  
  // Detect triggers
  const triggers: TriggerType[] = [];
  for (const [trigger, keywords] of Object.entries(TRIGGER_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      triggers.push(trigger as TriggerType);
    }
  }
  
  // Default to manual if no trigger detected
  if (triggers.length === 0) {
    triggers.push('manual');
  }
  
  // Detect actions
  const actions: ActionType[] = [];
  for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      actions.push(action as ActionType);
    }
  }
  
  // Detect conditions
  const conditions = CONDITION_KEYWORDS.filter(kw => text.includes(kw));
  
  // Detect loops
  const loops = LOOP_KEYWORDS.some(kw => text.includes(kw));
  
  // Detect AI need
  const aiAgentNeeded = AI_KEYWORDS.some(kw => text.includes(kw));
  
  // Calculate complexity
  let complexity: 'simple' | 'medium' | 'complex' = 'simple';
  const score = triggers.length + actions.length + conditions.length + (loops ? 2 : 0) + (aiAgentNeeded ? 2 : 0);
  if (score > 6) complexity = 'complex';
  else if (score > 3) complexity = 'medium';
  
  return {
    triggers,
    actions,
    conditions,
    loops,
    aiAgentNeeded,
    complexity,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// NODE LABELS (Trilingual)
// ════════════════════════════════════════════════════════════════════════════════

const getNodeLabels = (type: WorkflowNodeType, subtype?: string): Record<Locale, { label: string; description: string }> => {
  const labels: Record<string, Record<Locale, { label: string; description: string }>> = {
    'trigger-manual': {
      en: { label: 'Manual Trigger', description: 'Start workflow manually' },
      fr: { label: 'Déclenchement manuel', description: 'Démarrer le workflow manuellement' },
      es: { label: 'Disparador manual', description: 'Iniciar flujo de trabajo manualmente' },
    },
    'trigger-schedule': {
      en: { label: 'Scheduled', description: 'Run on a schedule' },
      fr: { label: 'Planifié', description: 'Exécuter selon un horaire' },
      es: { label: 'Programado', description: 'Ejecutar según horario' },
    },
    'trigger-thread_created': {
      en: { label: 'New Thread', description: 'When a thread is created' },
      fr: { label: 'Nouveau fil', description: 'Quand un fil est créé' },
      es: { label: 'Nuevo hilo', description: 'Cuando se crea un hilo' },
    },
    'trigger-file_uploaded': {
      en: { label: 'File Uploaded', description: 'When a file is uploaded' },
      fr: { label: 'Fichier uploadé', description: 'Quand un fichier est uploadé' },
      es: { label: 'Archivo subido', description: 'Cuando se sube un archivo' },
    },
    'trigger-meeting_end': {
      en: { label: 'Meeting End', description: 'When a meeting ends' },
      fr: { label: 'Fin de réunion', description: 'Quand une réunion se termine' },
      es: { label: 'Fin de reunión', description: 'Cuando termina una reunión' },
    },
    'trigger-deadline_near': {
      en: { label: 'Deadline Near', description: 'When a deadline approaches' },
      fr: { label: 'Échéance proche', description: 'Quand une échéance approche' },
      es: { label: 'Fecha límite cerca', description: 'Cuando se acerca una fecha límite' },
    },
    'condition': {
      en: { label: 'Condition', description: 'Branch based on conditions' },
      fr: { label: 'Condition', description: 'Brancher selon des conditions' },
      es: { label: 'Condición', description: 'Ramificar según condiciones' },
    },
    'loop': {
      en: { label: 'Loop', description: 'Iterate over items' },
      fr: { label: 'Boucle', description: 'Itérer sur des éléments' },
      es: { label: 'Bucle', description: 'Iterar sobre elementos' },
    },
    'agent': {
      en: { label: 'AI Agent', description: 'Execute AI analysis' },
      fr: { label: 'Agent IA', description: 'Exécuter une analyse IA' },
      es: { label: 'Agente IA', description: 'Ejecutar análisis IA' },
    },
    'action-send_message': {
      en: { label: 'Send Message', description: 'Send a message' },
      fr: { label: 'Envoyer message', description: 'Envoyer un message' },
      es: { label: 'Enviar mensaje', description: 'Enviar un mensaje' },
    },
    'action-create_task': {
      en: { label: 'Create Task', description: 'Create a new task' },
      fr: { label: 'Créer tâche', description: 'Créer une nouvelle tâche' },
      es: { label: 'Crear tarea', description: 'Crear una nueva tarea' },
    },
    'action-send_notification': {
      en: { label: 'Send Notification', description: 'Notify users' },
      fr: { label: 'Notification', description: 'Notifier les utilisateurs' },
      es: { label: 'Notificación', description: 'Notificar usuarios' },
    },
    'action-send_email': {
      en: { label: 'Send Email', description: 'Send an email' },
      fr: { label: 'Envoyer email', description: 'Envoyer un courriel' },
      es: { label: 'Enviar correo', description: 'Enviar un correo' },
    },
    'end': {
      en: { label: 'End', description: 'End workflow' },
      fr: { label: 'Fin', description: 'Terminer le workflow' },
      es: { label: 'Fin', description: 'Terminar flujo de trabajo' },
    },
  };
  
  const key = subtype ? `${type}-${subtype}` : type;
  return labels[key] || labels[type] || {
    en: { label: type, description: '' },
    fr: { label: type, description: '' },
    es: { label: type, description: '' },
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// WORKFLOW GENERATOR
// ════════════════════════════════════════════════════════════════════════════════

export const generateWorkflow = (
  intent: IntentAnalysis,
  request: WorkflowDesignRequest
): Workflow => {
  const { locale } = request;
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  
  let yPos = 100;
  const xCenter = 300;
  const ySpacing = 150;
  
  // 1. Add trigger node
  const triggerType = intent.triggers[0] || 'manual';
  const triggerLabels = getNodeLabels('trigger', triggerType);
  const triggerId = generateId('trigger');
  
  nodes.push({
    id: triggerId,
    type: 'trigger',
    position: { x: xCenter, y: yPos },
    label: triggerLabels.en.label,
    labelFr: triggerLabels.fr.label,
    labelEs: triggerLabels.es.label,
    description: triggerLabels.en.description,
    descriptionFr: triggerLabels.fr.description,
    descriptionEs: triggerLabels.es.description,
    icon: '⚡',
    color: NODE_COLORS.trigger,
    isValid: true,
    triggerType,
    config: {},
  } as any);
  
  let lastNodeId = triggerId;
  yPos += ySpacing;
  
  // 2. Add AI agent if needed
  if (intent.aiAgentNeeded) {
    const agentLabels = getNodeLabels('agent');
    const agentId = generateId('agent');
    
    nodes.push({
      id: agentId,
      type: 'agent',
      position: { x: xCenter, y: yPos },
      label: agentLabels.en.label,
      labelFr: agentLabels.fr.label,
      labelEs: agentLabels.es.label,
      description: agentLabels.en.description,
      descriptionFr: agentLabels.fr.description,
      descriptionEs: agentLabels.es.description,
      icon: '🤖',
      color: NODE_COLORS.agent,
      isValid: true,
      agentId: 'workflow-agent',
      agentName: 'WorkflowAgent',
      agentLevel: 'L2',
      config: {
        prompt: 'Analyze and process the input',
        maxTokens: 1000,
        inputMapping: {},
        outputMapping: {},
      },
    } as any);
    
    edges.push({
      id: generateId('edge'),
      source: lastNodeId,
      target: agentId,
      animated: true,
    });
    
    lastNodeId = agentId;
    yPos += ySpacing;
  }
  
  // 3. Add condition if needed
  if (intent.conditions.length > 0) {
    const condLabels = getNodeLabels('condition');
    const condId = generateId('condition');
    
    nodes.push({
      id: condId,
      type: 'condition',
      position: { x: xCenter, y: yPos },
      label: condLabels.en.label,
      labelFr: condLabels.fr.label,
      labelEs: condLabels.es.label,
      icon: '🔀',
      color: NODE_COLORS.condition,
      isValid: true,
      config: {
        conditions: [{ field: 'result', operator: 'is_not_empty', value: '' }],
        logic: 'and',
      },
    } as any);
    
    edges.push({
      id: generateId('edge'),
      source: lastNodeId,
      target: condId,
      animated: true,
    });
    
    lastNodeId = condId;
    yPos += ySpacing;
  }
  
  // 4. Add loop if needed
  if (intent.loops) {
    const loopLabels = getNodeLabels('loop');
    const loopId = generateId('loop');
    
    nodes.push({
      id: loopId,
      type: 'loop',
      position: { x: xCenter, y: yPos },
      label: loopLabels.en.label,
      labelFr: loopLabels.fr.label,
      labelEs: loopLabels.es.label,
      icon: '🔄',
      color: NODE_COLORS.loop,
      isValid: true,
      config: {
        iterateOver: '{{items}}',
        itemVariable: 'item',
        maxIterations: 100,
      },
    } as any);
    
    edges.push({
      id: generateId('edge'),
      source: lastNodeId,
      target: loopId,
      animated: true,
    });
    
    lastNodeId = loopId;
    yPos += ySpacing;
  }
  
  // 5. Add action nodes
  for (const action of intent.actions.slice(0, 3)) { // Max 3 actions
    const actionLabels = getNodeLabels('action', action);
    const actionId = generateId('action');
    
    nodes.push({
      id: actionId,
      type: 'action',
      position: { x: xCenter, y: yPos },
      label: actionLabels.en.label,
      labelFr: actionLabels.fr.label,
      labelEs: actionLabels.es.label,
      description: actionLabels.en.description,
      descriptionFr: actionLabels.fr.description,
      descriptionEs: actionLabels.es.description,
      icon: '▶️',
      color: NODE_COLORS.action,
      isValid: true,
      actionType: action,
      config: {},
    } as any);
    
    edges.push({
      id: generateId('edge'),
      source: lastNodeId,
      target: actionId,
      animated: true,
    });
    
    lastNodeId = actionId;
    yPos += ySpacing;
  }
  
  // 6. Add end node
  const endLabels = getNodeLabels('end');
  const endId = generateId('end');
  
  nodes.push({
    id: endId,
    type: 'end',
    position: { x: xCenter, y: yPos },
    label: endLabels.en.label,
    labelFr: endLabels.fr.label,
    labelEs: endLabels.es.label,
    icon: '🏁',
    color: NODE_COLORS.end,
    isValid: true,
    config: { status: 'success' },
  } as any);
  
  edges.push({
    id: generateId('edge'),
    source: lastNodeId,
    target: endId,
    animated: true,
  });
  
  // Create workflow
  const workflowNames: Record<Locale, string> = {
    en: 'AI-Generated Workflow',
    fr: 'Workflow généré par IA',
    es: 'Flujo de trabajo generado por IA',
  };
  
  return {
    id: generateId('wf'),
    name: workflowNames[locale],
    nameFr: workflowNames.fr,
    nameEs: workflowNames.es,
    description: request.description,
    descriptionFr: locale === 'fr' ? request.description : undefined,
    descriptionEs: locale === 'es' ? request.description : undefined,
    version: 1,
    status: 'draft',
    nodes,
    edges,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'workflow-designer-agent',
    tokenBudget: intent.aiAgentNeeded ? 2000 : 500,
    maxExecutionTime: 120,
    executionCount: 0,
  } as Workflow;
};

// ════════════════════════════════════════════════════════════════════════════════
// MAIN AGENT FUNCTION
// ════════════════════════════════════════════════════════════════════════════════

export const designWorkflow = async (
  request: WorkflowDesignRequest
): Promise<WorkflowDesignResult> => {
  const { description, locale, constraints } = request;
  const strings = STRINGS[locale];
  
  // 1. Analyze intent
  const intent = analyzeIntent(description);
  
  // 2. Validate
  if (intent.actions.length === 0) {
    return {
      success: false,
      explanation: strings.noAction,
      suggestions: [
        locale === 'en' ? 'Try: "send a notification when..."' :
        locale === 'fr' ? 'Essayez: "envoyer une notification quand..."' :
        'Intente: "enviar una notificación cuando..."',
      ],
    };
  }
  
  // Check complexity
  if (intent.complexity === 'complex' && constraints?.maxNodes && constraints.maxNodes < 8) {
    return {
      success: false,
      explanation: strings.tooComplex,
      suggestions: [
        locale === 'en' ? 'Break this into multiple simpler workflows' :
        locale === 'fr' ? 'Divisez ceci en plusieurs workflows plus simples' :
        'Divida esto en varios flujos de trabajo más simples',
      ],
    };
  }
  
  // 3. Generate workflow
  const workflow = generateWorkflow(intent, request);
  
  // 4. Calculate estimated cost
  let estimatedTokenCost = 100; // Base cost
  if (intent.aiAgentNeeded) estimatedTokenCost += 500;
  if (intent.loops) estimatedTokenCost *= 2;
  
  return {
    success: true,
    workflow,
    explanation: `${strings.success} ${strings.review}`,
    estimatedTokenCost,
    suggestions: intent.complexity === 'simple' ? [
      locale === 'en' ? 'Consider adding conditions for more control' :
      locale === 'fr' ? 'Envisagez d\'ajouter des conditions pour plus de contrôle' :
      'Considere agregar condiciones para más control',
    ] : undefined,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ════════════════════════════════════════════════════════════════════════════════

export interface UseWorkflowDesignerReturn {
  design: (description: string) => Promise<WorkflowDesignResult>;
  isDesigning: boolean;
  lastResult: WorkflowDesignResult | null;
  analyzeIntent: (description: string) => IntentAnalysis;
}

// For React usage
export const createWorkflowDesigner = (locale: Locale = 'fr'): UseWorkflowDesignerReturn => {
  let isDesigning = false;
  let lastResult: WorkflowDesignResult | null = null;
  
  return {
    design: async (description: string) => {
      isDesigning = true;
      const result = await designWorkflow({ description, locale });
      lastResult = result;
      isDesigning = false;
      return result;
    },
    isDesigning,
    lastResult,
    analyzeIntent,
  };
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default designWorkflow;
