/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — ONECLICK ENGINE STORE                       ║
 * ║                    Rapid Execution & Automation                               ║
 * ║                    Task C3: Nouveaux Engines                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ONECLICK ENGINE FEATURES:
 * - Quick action templates
 * - Execution with governance
 * - Action history & favorites
 * - Automation workflows
 * - Nova integration
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ActionCategory = 
  | 'communication' 
  | 'data' 
  | 'agents' 
  | 'governance' 
  | 'calendar' 
  | 'documents' 
  | 'automation'
  | 'custom'

export type ExecutionStatus = 
  | 'pending' 
  | 'running' 
  | 'checkpoint_required' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'

export interface QuickAction {
  id: string
  name: string
  description: string
  icon: string
  category: ActionCategory
  sphere_id?: string
  command: string
  parameters: ActionParameter[]
  requires_checkpoint: boolean
  estimated_tokens: number
  is_system: boolean
  is_favorite: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface ActionParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'file'
  label: string
  description?: string
  required: boolean
  default_value?: unknown
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface ActionExecution {
  id: string
  action_id: string
  action_name: string
  identity_id: string
  sphere_id?: string
  status: ExecutionStatus
  parameters: Record<string, unknown>
  checkpoint_id?: string
  result?: ExecutionResult
  error?: string
  tokens_consumed: number
  started_at: string
  completed_at?: string
}

export interface ExecutionResult {
  success: boolean
  data?: unknown
  message: string
  artifacts?: ExecutionArtifact[]
}

export interface ExecutionArtifact {
  id: string
  type: 'file' | 'link' | 'message' | 'thread' | 'event'
  name: string
  url?: string
  data?: unknown
}

export interface Workflow {
  id: string
  name: string
  description: string
  icon: string
  sphere_id?: string
  steps: WorkflowStep[]
  trigger?: WorkflowTrigger
  is_active: boolean
  run_count: number
  last_run_at?: string
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  order: number
  action_id: string
  action_name: string
  parameters: Record<string, unknown>
  condition?: string
  on_failure: 'stop' | 'continue' | 'retry'
  retry_count?: number
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'event' | 'webhook'
  config: Record<string, unknown>
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  workflow_name: string
  status: ExecutionStatus
  current_step: number
  step_results: StepResult[]
  started_at: string
  completed_at?: string
}

export interface StepResult {
  step_id: string
  status: ExecutionStatus
  result?: ExecutionResult
  error?: string
  started_at: string
  completed_at?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const SYSTEM_ACTIONS: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Envoyer un message',
    description: 'Envoyer un message dans un thread existant',
    icon: '💬',
    category: 'communication',
    command: 'send_message',
    parameters: [
      { name: 'thread_id', type: 'string', label: 'Thread', required: true },
      { name: 'content', type: 'string', label: 'Message', required: true },
    ],
    requires_checkpoint: false,
    estimated_tokens: 10,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Créer un thread',
    description: 'Démarrer une nouvelle conversation',
    icon: '📝',
    category: 'communication',
    command: 'create_thread',
    parameters: [
      { name: 'title', type: 'string', label: 'Titre', required: true },
      { name: 'sphere_id', type: 'select', label: 'Sphère', required: true, options: [] },
    ],
    requires_checkpoint: false,
    estimated_tokens: 50,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Demander à Nova',
    description: 'Poser une question à l\'intelligence système',
    icon: '🤖',
    category: 'agents',
    command: 'ask_nova',
    parameters: [
      { name: 'question', type: 'string', label: 'Question', required: true },
      { name: 'context', type: 'string', label: 'Contexte', required: false },
    ],
    requires_checkpoint: false,
    estimated_tokens: 100,
    is_system: true,
    is_favorite: true,
    usage_count: 0,
  },
  {
    name: 'Assigner une tâche',
    description: 'Assigner une tâche à un agent',
    icon: '📋',
    category: 'agents',
    command: 'assign_task',
    parameters: [
      { name: 'agent_id', type: 'string', label: 'Agent', required: true },
      { name: 'title', type: 'string', label: 'Titre', required: true },
      { name: 'description', type: 'string', label: 'Description', required: true },
      { name: 'priority', type: 'select', label: 'Priorité', required: true, options: [
        { value: 'low', label: 'Basse' },
        { value: 'medium', label: 'Moyenne' },
        { value: 'high', label: 'Haute' },
      ]},
    ],
    requires_checkpoint: true,
    estimated_tokens: 50,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Créer un checkpoint',
    description: 'Demander une approbation de gouvernance',
    icon: '🔒',
    category: 'governance',
    command: 'create_checkpoint',
    parameters: [
      { name: 'title', type: 'string', label: 'Titre', required: true },
      { name: 'description', type: 'string', label: 'Description', required: true },
      { name: 'priority', type: 'select', label: 'Priorité', required: true, options: [
        { value: 'low', label: 'Basse' },
        { value: 'medium', label: 'Moyenne' },
        { value: 'high', label: 'Haute' },
        { value: 'critical', label: 'Critique' },
      ]},
    ],
    requires_checkpoint: false,
    estimated_tokens: 20,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Planifier une réunion',
    description: 'Créer un événement dans le calendrier',
    icon: '📅',
    category: 'calendar',
    command: 'schedule_meeting',
    parameters: [
      { name: 'title', type: 'string', label: 'Titre', required: true },
      { name: 'date', type: 'date', label: 'Date', required: true },
      { name: 'duration', type: 'number', label: 'Durée (min)', required: true, default_value: 30 },
      { name: 'participants', type: 'string', label: 'Participants (emails)', required: false },
    ],
    requires_checkpoint: false,
    estimated_tokens: 30,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Rechercher documents',
    description: 'Rechercher dans les fichiers de données',
    icon: '🔍',
    category: 'documents',
    command: 'search_documents',
    parameters: [
      { name: 'query', type: 'string', label: 'Recherche', required: true },
      { name: 'sphere_id', type: 'select', label: 'Sphère', required: false, options: [] },
    ],
    requires_checkpoint: false,
    estimated_tokens: 20,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
  {
    name: 'Exporter données',
    description: 'Exporter des données au format CSV/JSON',
    icon: '📤',
    category: 'data',
    command: 'export_data',
    parameters: [
      { name: 'data_type', type: 'select', label: 'Type', required: true, options: [
        { value: 'threads', label: 'Threads' },
        { value: 'agents', label: 'Agents' },
        { value: 'checkpoints', label: 'Checkpoints' },
      ]},
      { name: 'format', type: 'select', label: 'Format', required: true, options: [
        { value: 'csv', label: 'CSV' },
        { value: 'json', label: 'JSON' },
      ]},
    ],
    requires_checkpoint: true,
    estimated_tokens: 100,
    is_system: true,
    is_favorite: false,
    usage_count: 0,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface OneClickState {
  // Data
  actions: Record<string, QuickAction>
  executions: Record<string, ActionExecution>
  workflows: Record<string, Workflow>
  workflow_executions: Record<string, WorkflowExecution>
  
  // UI State
  recent_action_ids: string[]
  favorite_action_ids: string[]
  is_executing: boolean
  current_execution_id: string | null
  
  // Actions CRUD
  loadSystemActions: () => void
  createAction: (data: Omit<QuickAction, 'id' | 'created_at' | 'updated_at' | 'is_system' | 'usage_count'>) => QuickAction
  updateAction: (id: string, data: Partial<QuickAction>) => void
  deleteAction: (id: string) => boolean
  getAction: (id: string) => QuickAction | undefined
  getActionsByCategory: (category: ActionCategory) => QuickAction[]
  toggleFavorite: (id: string) => void
  
  // Execution
  executeAction: (actionId: string, parameters: Record<string, unknown>, identityId: string) => Promise<ActionExecution>
  cancelExecution: (executionId: string) => void
  getExecution: (id: string) => ActionExecution | undefined
  getRecentExecutions: (limit?: number) => ActionExecution[]
  
  // Workflows
  createWorkflow: (data: Omit<Workflow, 'id' | 'created_at' | 'updated_at' | 'run_count'>) => Workflow
  updateWorkflow: (id: string, data: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => boolean
  executeWorkflow: (workflowId: string, identityId: string) => Promise<WorkflowExecution>
  toggleWorkflowActive: (id: string) => void
  
  // Search & Filter
  searchActions: (query: string) => QuickAction[]
  getFavorites: () => QuickAction[]
  getRecent: () => QuickAction[]
  
  // Utilities
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  actions: {},
  executions: {},
  workflows: {},
  workflow_executions: {},
  recent_action_ids: [],
  favorite_action_ids: [],
  is_executing: false,
  current_execution_id: null,
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useOneClickEngineStore = create<OneClickState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // ─────────────────────────────────────────────────────────────────────────
        // Actions CRUD
        // ─────────────────────────────────────────────────────────────────────────
        
        loadSystemActions: () => {
          const now = new Date().toISOString()
          const systemActions: Record<string, QuickAction> = {}
          
          SYSTEM_ACTIONS.forEach((action, index) => {
            const id = `system_${action.command}`
            systemActions[id] = {
              ...action,
              id,
              created_at: now,
              updated_at: now,
            }
          })
          
          set(state => ({
            actions: { ...systemActions, ...state.actions },
            favorite_action_ids: state.favorite_action_ids.length === 0 
              ? ['system_ask_nova'] 
              : state.favorite_action_ids,
          }))
          
          // System actions loaded - use logger if needed
          // logger.debug('System actions loaded:', Object.keys(systemActions).length)
        },
        
        createAction: (data) => {
          const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          const now = new Date().toISOString()
          
          const action: QuickAction = {
            ...data,
            id,
            is_system: false,
            usage_count: 0,
            created_at: now,
            updated_at: now,
          }
          
          set(state => ({
            actions: { ...state.actions, [id]: action },
          }))
          
          return action
        },
        
        updateAction: (id, data) => {
          set(state => ({
            actions: {
              ...state.actions,
              [id]: {
                ...state.actions[id],
                ...data,
                updated_at: new Date().toISOString(),
              },
            },
          }))
        },
        
        deleteAction: (id) => {
          const action = get().actions[id]
          if (!action || action.is_system) return false
          
          set(state => {
            const { [id]: _, ...actions } = state.actions
            return { actions }
          })
          
          return true
        },
        
        getAction: (id) => get().actions[id],
        
        getActionsByCategory: (category) => {
          return Object.values(get().actions).filter(a => a.category === category)
        },
        
        toggleFavorite: (id) => {
          set(state => {
            const isFavorite = state.favorite_action_ids.includes(id)
            return {
              favorite_action_ids: isFavorite
                ? state.favorite_action_ids.filter(fid => fid !== id)
                : [...state.favorite_action_ids, id],
              actions: {
                ...state.actions,
                [id]: {
                  ...state.actions[id],
                  is_favorite: !isFavorite,
                },
              },
            }
          })
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // Execution
        // ─────────────────────────────────────────────────────────────────────────
        
        executeAction: async (actionId, parameters, identityId) => {
          const action = get().actions[actionId]
          if (!action) throw new Error('Action not found')
          
          const executionId = `exec_${Date.now()}`
          const now = new Date().toISOString()
          
          const execution: ActionExecution = {
            id: executionId,
            action_id: actionId,
            action_name: action.name,
            identity_id: identityId,
            sphere_id: action.sphere_id,
            status: action.requires_checkpoint ? 'checkpoint_required' : 'running',
            parameters,
            tokens_consumed: 0,
            started_at: now,
          }
          
          set(state => ({
            executions: { ...state.executions, [executionId]: execution },
            is_executing: true,
            current_execution_id: executionId,
            recent_action_ids: [actionId, ...state.recent_action_ids.filter(id => id !== actionId)].slice(0, 10),
            actions: {
              ...state.actions,
              [actionId]: {
                ...state.actions[actionId],
                usage_count: state.actions[actionId].usage_count + 1,
              },
            },
          }))
          
          // Simulate execution
          if (!action.requires_checkpoint) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            set(state => ({
              executions: {
                ...state.executions,
                [executionId]: {
                  ...state.executions[executionId],
                  status: 'completed',
                  tokens_consumed: action.estimated_tokens,
                  completed_at: new Date().toISOString(),
                  result: {
                    success: true,
                    message: `Action "${action.name}" exécutée avec succès`,
                  },
                },
              },
              is_executing: false,
              current_execution_id: null,
            }))
          }
          
          // Action executed - use logger if needed
          // logger.debug('Action executed:', actionId, execution.status)
          return get().executions[executionId]
        },
        
        cancelExecution: (executionId) => {
          set(state => ({
            executions: {
              ...state.executions,
              [executionId]: {
                ...state.executions[executionId],
                status: 'cancelled',
                completed_at: new Date().toISOString(),
              },
            },
            is_executing: false,
            current_execution_id: null,
          }))
        },
        
        getExecution: (id) => get().executions[id],
        
        getRecentExecutions: (limit = 10) => {
          return Object.values(get().executions)
            .sort((a, b) => b.started_at.localeCompare(a.started_at))
            .slice(0, limit)
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // Workflows
        // ─────────────────────────────────────────────────────────────────────────
        
        createWorkflow: (data) => {
          const id = `workflow_${Date.now()}`
          const now = new Date().toISOString()
          
          const workflow: Workflow = {
            ...data,
            id,
            run_count: 0,
            created_at: now,
            updated_at: now,
          }
          
          set(state => ({
            workflows: { ...state.workflows, [id]: workflow },
          }))
          
          return workflow
        },
        
        updateWorkflow: (id, data) => {
          set(state => ({
            workflows: {
              ...state.workflows,
              [id]: {
                ...state.workflows[id],
                ...data,
                updated_at: new Date().toISOString(),
              },
            },
          }))
        },
        
        deleteWorkflow: (id) => {
          set(state => {
            const { [id]: _, ...workflows } = state.workflows
            return { workflows }
          })
          return true
        },
        
        executeWorkflow: async (workflowId, identityId) => {
          const workflow = get().workflows[workflowId]
          if (!workflow) throw new Error('Workflow not found')
          
          const executionId = `wf_exec_${Date.now()}`
          const now = new Date().toISOString()
          
          const execution: WorkflowExecution = {
            id: executionId,
            workflow_id: workflowId,
            workflow_name: workflow.name,
            status: 'running',
            current_step: 0,
            step_results: [],
            started_at: now,
          }
          
          set(state => ({
            workflow_executions: { ...state.workflow_executions, [executionId]: execution },
            workflows: {
              ...state.workflows,
              [workflowId]: {
                ...state.workflows[workflowId],
                run_count: state.workflows[workflowId].run_count + 1,
                last_run_at: now,
              },
            },
          }))
          
          // Workflow started - use logger if needed
          // logger.debug('Workflow started:', workflowId)
          return execution
        },
        
        toggleWorkflowActive: (id) => {
          set(state => ({
            workflows: {
              ...state.workflows,
              [id]: {
                ...state.workflows[id],
                is_active: !state.workflows[id].is_active,
              },
            },
          }))
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // Search & Filter
        // ─────────────────────────────────────────────────────────────────────────
        
        searchActions: (query) => {
          const q = query.toLowerCase()
          return Object.values(get().actions).filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.command.toLowerCase().includes(q)
          )
        },
        
        getFavorites: () => {
          const { actions, favorite_action_ids } = get()
          return favorite_action_ids.map(id => actions[id]).filter(Boolean)
        },
        
        getRecent: () => {
          const { actions, recent_action_ids } = get()
          return recent_action_ids.map(id => actions[id]).filter(Boolean)
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // Utilities
        // ─────────────────────────────────────────────────────────────────────────
        
        reset: () => set(initialState),
      }),
      {
        name: 'chenu-oneclick-engine',
        partialize: (state) => ({
          favorite_action_ids: state.favorite_action_ids,
          recent_action_ids: state.recent_action_ids,
        }),
      }
    ),
    { name: 'chenu-oneclick-engine' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type { OneClickState }
export default useOneClickEngineStore
