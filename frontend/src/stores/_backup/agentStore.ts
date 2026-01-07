/**
 * CHE·NU™ - AGENT STORE
 * 
 * AGENTS & ROLES:
 * 
 * Nova:
 * - is the SYSTEM intelligence
 * - is always present
 * - handles guidance, memory, governance
 * - supervises databases and threads
 * - is NEVER a hired agent
 * 
 * User Orchestrator:
 * - is hired by the user
 * - executes tasks
 * - manages agents
 * - respects scope, budget, and governance
 * - can be replaced or customized
 * 
 * Agents:
 * - have costs
 * - have scopes
 * - have encoding compatibility
 * - act only when authorized
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SphereId } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type AgentType = 'nova' | 'orchestrator' | 'specialist' | 'assistant' | 'analyzer';
export type AgentStatus = 'idle' | 'thinking' | 'executing' | 'waiting' | 'error' | 'offline';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  avatar?: string;
  
  // Capabilities
  capabilities: AgentCapability[];
  sphereScopes: SphereId[];
  encodingCompatibility: number; // 0-100
  
  // Costs
  baseCostPerToken: number;
  averageTokensPerTask: number;
  
  // Status
  status: AgentStatus;
  currentTaskId?: string;
  lastActiveAt: string;
  
  // Performance
  metrics: AgentMetrics;
  
  // Configuration
  isSystem: boolean; // Nova is system, others are not
  isHired: boolean;
  hiredAt?: string;
  config: AgentConfig;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: CapabilityCategory;
  proficiency: number; // 0-100
}

export type CapabilityCategory = 
  | 'analysis'
  | 'creation'
  | 'communication'
  | 'organization'
  | 'research'
  | 'coding'
  | 'design'
  | 'governance';

export interface AgentMetrics {
  tasksCompleted: number;
  tasksSuccessful: number;
  totalTokensUsed: number;
  averageTaskDuration: number; // ms
  userRating: number; // 0-5
  lastEvaluatedAt: string;
}

export interface AgentConfig {
  temperature: number;
  maxTokensPerResponse: number;
  contextWindowSize: number;
  systemPrompt?: string;
  specialInstructions?: string[];
}

export interface AgentTask {
  id: string;
  agentId: string;
  threadId?: string;
  sphereId: SphereId;
  input: string;
  encodedInput?: string;
  output?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  tokensUsed: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// NOVA DEFINITION (SYSTEM AGENT - NEVER HIRED)
// ═══════════════════════════════════════════════════════════════

const NOVA_AGENT: Agent = {
  id: 'nova',
  name: 'Nova',
  type: 'nova',
  description: 'System intelligence that handles guidance, memory, governance. Always present, supervises all operations.',
  avatar: '✧',
  
  capabilities: [
    { id: 'cap_guidance', name: 'User Guidance', description: 'Guide users through CHE·NU', category: 'communication', proficiency: 100 },
    { id: 'cap_memory', name: 'Memory Management', description: 'Manage conversation and context memory', category: 'organization', proficiency: 100 },
    { id: 'cap_governance', name: 'Governance Enforcement', description: 'Enforce rules and budgets', category: 'governance', proficiency: 100 },
    { id: 'cap_supervision', name: 'Agent Supervision', description: 'Supervise all agent activities', category: 'governance', proficiency: 100 },
    { id: 'cap_database', name: 'Database Supervision', description: 'Oversee data operations', category: 'organization', proficiency: 95 },
  ],
  
  sphereScopes: ['personal', 'business', 'government', 'design_studio', 'community', 'social', 'entertainment', 'team'],
  encodingCompatibility: 100,
  
  baseCostPerToken: 0.001,
  averageTokensPerTask: 500,
  
  status: 'idle',
  lastActiveAt: new Date().toISOString(),
  
  metrics: {
    tasksCompleted: 0,
    tasksSuccessful: 0,
    totalTokensUsed: 0,
    averageTaskDuration: 0,
    userRating: 5,
    lastEvaluatedAt: new Date().toISOString(),
  },
  
  isSystem: true,
  isHired: false, // Nova is NEVER hired - always present
  
  config: {
    temperature: 0.7,
    maxTokensPerResponse: 2000,
    contextWindowSize: 16000,
    systemPrompt: 'You are Nova, the system intelligence of CHE·NU. You guide users, enforce governance, and ensure all operations respect budgets and scopes.',
  },
};

// ═══════════════════════════════════════════════════════════════
// AVAILABLE AGENTS CATALOG
// ═══════════════════════════════════════════════════════════════

const AVAILABLE_AGENTS: Omit<Agent, 'isHired' | 'hiredAt' | 'metrics'>[] = [
  {
    id: 'orchestrator_default',
    name: 'Default Orchestrator',
    type: 'orchestrator',
    description: 'General-purpose task orchestrator. Executes tasks, manages workflows, respects governance.',
    avatar: '🎯',
    capabilities: [
      { id: 'cap_task', name: 'Task Execution', description: 'Execute user tasks efficiently', category: 'organization', proficiency: 90 },
      { id: 'cap_workflow', name: 'Workflow Management', description: 'Manage complex workflows', category: 'organization', proficiency: 85 },
      { id: 'cap_delegation', name: 'Agent Delegation', description: 'Delegate to specialist agents', category: 'organization', proficiency: 88 },
    ],
    sphereScopes: ['personal', 'business', 'design_studio', 'team'],
    encodingCompatibility: 95,
    baseCostPerToken: 0.002,
    averageTokensPerTask: 800,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.5,
      maxTokensPerResponse: 4000,
      contextWindowSize: 32000,
    },
  },
  {
    id: 'analyst_data',
    name: 'Data Analyst',
    type: 'specialist',
    description: 'Specialized in data analysis, reporting, and insights extraction.',
    avatar: '📊',
    capabilities: [
      { id: 'cap_analysis', name: 'Data Analysis', description: 'Analyze datasets and extract insights', category: 'analysis', proficiency: 95 },
      { id: 'cap_reporting', name: 'Report Generation', description: 'Create comprehensive reports', category: 'creation', proficiency: 90 },
      { id: 'cap_visualization', name: 'Data Visualization', description: 'Create charts and visualizations', category: 'design', proficiency: 85 },
    ],
    sphereScopes: ['business', 'personal', 'government'],
    encodingCompatibility: 90,
    baseCostPerToken: 0.003,
    averageTokensPerTask: 1200,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.3,
      maxTokensPerResponse: 6000,
      contextWindowSize: 48000,
    },
  },
  {
    id: 'writer_creative',
    name: 'Creative Writer',
    type: 'specialist',
    description: 'Expert in creative writing, content creation, and storytelling.',
    avatar: '✍️',
    capabilities: [
      { id: 'cap_writing', name: 'Creative Writing', description: 'Write engaging content', category: 'creation', proficiency: 95 },
      { id: 'cap_editing', name: 'Content Editing', description: 'Edit and improve text', category: 'creation', proficiency: 90 },
      { id: 'cap_storytelling', name: 'Storytelling', description: 'Craft compelling narratives', category: 'creation', proficiency: 92 },
    ],
    sphereScopes: ['design_studio', 'personal', 'social', 'entertainment'],
    encodingCompatibility: 85,
    baseCostPerToken: 0.0025,
    averageTokensPerTask: 1500,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.8,
      maxTokensPerResponse: 8000,
      contextWindowSize: 32000,
    },
  },
  {
    id: 'coder_dev',
    name: 'Dev Assistant',
    type: 'specialist',
    description: 'Specialized in coding, debugging, and technical problem-solving.',
    avatar: '💻',
    capabilities: [
      { id: 'cap_coding', name: 'Code Generation', description: 'Write clean, efficient code', category: 'coding', proficiency: 92 },
      { id: 'cap_debugging', name: 'Debugging', description: 'Find and fix code issues', category: 'coding', proficiency: 88 },
      { id: 'cap_review', name: 'Code Review', description: 'Review code for quality', category: 'coding', proficiency: 90 },
    ],
    sphereScopes: ['design_studio', 'business', 'personal'],
    encodingCompatibility: 92,
    baseCostPerToken: 0.003,
    averageTokensPerTask: 1000,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.2,
      maxTokensPerResponse: 8000,
      contextWindowSize: 64000,
    },
  },
  {
    id: 'researcher',
    name: 'Research Agent',
    type: 'specialist',
    description: 'Expert in research, fact-checking, and information gathering.',
    avatar: '🔍',
    capabilities: [
      { id: 'cap_research', name: 'Deep Research', description: 'Conduct thorough research', category: 'research', proficiency: 94 },
      { id: 'cap_factcheck', name: 'Fact Checking', description: 'Verify information accuracy', category: 'research', proficiency: 92 },
      { id: 'cap_synthesis', name: 'Info Synthesis', description: 'Synthesize complex information', category: 'analysis', proficiency: 88 },
    ],
    sphereScopes: ['business', 'government', 'personal', 'studio'],
    encodingCompatibility: 88,
    baseCostPerToken: 0.0035,
    averageTokensPerTask: 2000,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.4,
      maxTokensPerResponse: 10000,
      contextWindowSize: 64000,
    },
  },
  {
    id: 'scheduler',
    name: 'Schedule Manager',
    type: 'assistant',
    description: 'Helps manage calendars, meetings, and time organization.',
    avatar: '📅',
    capabilities: [
      { id: 'cap_scheduling', name: 'Schedule Management', description: 'Organize calendars and meetings', category: 'organization', proficiency: 95 },
      { id: 'cap_reminders', name: 'Reminders', description: 'Set and manage reminders', category: 'organization', proficiency: 90 },
      { id: 'cap_coordination', name: 'Team Coordination', description: 'Coordinate schedules', category: 'communication', proficiency: 85 },
    ],
    sphereScopes: ['personal', 'business', 'team'],
    encodingCompatibility: 90,
    baseCostPerToken: 0.0015,
    averageTokensPerTask: 400,
    status: 'offline',
    lastActiveAt: new Date().toISOString(),
    isSystem: false,
    config: {
      temperature: 0.3,
      maxTokensPerResponse: 2000,
      contextWindowSize: 16000,
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// STORE STATE & ACTIONS
// ═══════════════════════════════════════════════════════════════

interface AgentState {
  // State
  nova: Agent;
  hiredAgents: Record<string, Agent>;
  availableAgents: typeof AVAILABLE_AGENTS;
  tasks: Record<string, AgentTask>;
  activeOrchestrator: string | null;
  
  // Nova Operations (System - Always Available)
  askNova: (input: string, threadId?: string, sphereId?: SphereId) => Promise<AgentTask>;
  getNovaStatus: () => AgentStatus;
  
  // Orchestrator Operations
  setActiveOrchestrator: (agentId: string | null) => void;
  getActiveOrchestrator: () => Agent | null;
  
  // Agent Hiring
  hireAgent: (agentId: string) => boolean;
  fireAgent: (agentId: string) => boolean;
  getHiredAgents: () => Agent[];
  isAgentHired: (agentId: string) => boolean;
  
  // Task Operations
  createTask: (agentId: string, input: string, sphereId: SphereId, threadId?: string) => AgentTask;
  executeTask: (taskId: string) => Promise<AgentTask>;
  cancelTask: (taskId: string) => void;
  getTasksByAgent: (agentId: string) => AgentTask[];
  getTasksByThread: (threadId: string) => AgentTask[];
  
  // Agent Queries
  getAgentById: (id: string) => Agent | undefined;
  getAgentsByCapability: (capability: CapabilityCategory) => Agent[];
  getAgentsBySphere: (sphereId: SphereId) => Agent[];
  getCompatibleAgents: (taskType: string, sphereId: SphereId) => Agent[];
  
  // Metrics
  updateAgentMetrics: (agentId: string, metrics: Partial<AgentMetrics>) => void;
  getAgentPerformance: (agentId: string) => AgentMetrics | undefined;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const generateTaskId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createDefaultMetrics = (): AgentMetrics => ({
  tasksCompleted: 0,
  tasksSuccessful: 0,
  totalTokensUsed: 0,
  averageTaskDuration: 0,
  userRating: 0,
  lastEvaluatedAt: new Date().toISOString(),
});

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      // Initial State
      nova: NOVA_AGENT,
      hiredAgents: {},
      availableAgents: AVAILABLE_AGENTS,
      tasks: {},
      activeOrchestrator: null,

      // ─────────────────────────────────────────────────────────
      // Nova Operations
      // ─────────────────────────────────────────────────────────
      askNova: async (input: string, threadId?: string, sphereId: SphereId = 'personal'): Promise<AgentTask> => {
        const task = get().createTask('nova', input, sphereId, threadId);
        
        // Update Nova status
        set((state) => ({
          nova: { ...state.nova, status: 'thinking', currentTaskId: task.id },
        }));

        // Simulate Nova processing
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

        // Complete task
        const completedTask: AgentTask = {
          ...task,
          status: 'completed',
          output: `Nova: I understand your request about "${input.substring(0, 50)}...". Let me help you within the governance framework.`,
          tokensUsed: Math.ceil(input.length / 4) + 150,
          completedAt: new Date().toISOString(),
        };

        set((state) => ({
          nova: { ...state.nova, status: 'idle', currentTaskId: undefined },
          tasks: { ...state.tasks, [task.id]: completedTask },
        }));

        return completedTask;
      },

      getNovaStatus: (): AgentStatus => get().nova.status,

      // ─────────────────────────────────────────────────────────
      // Orchestrator Operations
      // ─────────────────────────────────────────────────────────
      setActiveOrchestrator: (agentId: string | null): void => {
        if (agentId && !get().isAgentHired(agentId)) {
          console.warn('Cannot set orchestrator: agent not hired');
          return;
        }
        set({ activeOrchestrator: agentId });
      },

      getActiveOrchestrator: (): Agent | null => {
        const { activeOrchestrator, hiredAgents } = get();
        return activeOrchestrator ? hiredAgents[activeOrchestrator] || null : null;
      },

      // ─────────────────────────────────────────────────────────
      // Agent Hiring
      // ─────────────────────────────────────────────────────────
      hireAgent: (agentId: string): boolean => {
        const { availableAgents, hiredAgents } = get();
        
        if (hiredAgents[agentId]) {
          console.warn('Agent already hired');
          return false;
        }

        const agentTemplate = availableAgents.find((a) => a.id === agentId);
        if (!agentTemplate) {
          console.warn('Agent not found in catalog');
          return false;
        }

        const hiredAgent: Agent = {
          ...agentTemplate,
          isHired: true,
          hiredAt: new Date().toISOString(),
          status: 'idle',
          metrics: createDefaultMetrics(),
        };

        set((state) => ({
          hiredAgents: { ...state.hiredAgents, [agentId]: hiredAgent },
        }));

        return true;
      },

      fireAgent: (agentId: string): boolean => {
        const { hiredAgents, activeOrchestrator } = get();
        
        if (!hiredAgents[agentId]) {
          console.warn('Agent not hired');
          return false;
        }

        const { [agentId]: fired, ...remaining } = hiredAgents;

        set({
          hiredAgents: remaining,
          activeOrchestrator: activeOrchestrator === agentId ? null : activeOrchestrator,
        });

        return true;
      },

      getHiredAgents: (): Agent[] => Object.values(get().hiredAgents),

      isAgentHired: (agentId: string): boolean => !!get().hiredAgents[agentId],

      // ─────────────────────────────────────────────────────────
      // Task Operations
      // ─────────────────────────────────────────────────────────
      createTask: (agentId: string, input: string, sphereId: SphereId, threadId?: string): AgentTask => {
        const task: AgentTask = {
          id: generateTaskId(),
          agentId,
          threadId,
          sphereId,
          input,
          status: 'pending',
          tokensUsed: 0,
        };

        set((state) => ({
          tasks: { ...state.tasks, [task.id]: task },
        }));

        return task;
      },

      executeTask: async (taskId: string): Promise<AgentTask> => {
        const task = get().tasks[taskId];
        if (!task) throw new Error('Task not found');

        const agent = task.agentId === 'nova' 
          ? get().nova 
          : get().hiredAgents[task.agentId];
        
        if (!agent) throw new Error('Agent not found');

        // Update status
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...task, status: 'in_progress', startedAt: new Date().toISOString() },
          },
        }));

        // Simulate execution
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

        const tokensUsed = Math.ceil(task.input.length / 4) + agent.averageTokensPerTask;

        const completedTask: AgentTask = {
          ...task,
          status: 'completed',
          output: `[${agent.name}] Task completed successfully.`,
          tokensUsed,
          completedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: { ...state.tasks, [taskId]: completedTask },
        }));

        // Update metrics
        get().updateAgentMetrics(task.agentId, {
          tasksCompleted: (agent.metrics.tasksCompleted || 0) + 1,
          tasksSuccessful: (agent.metrics.tasksSuccessful || 0) + 1,
          totalTokensUsed: (agent.metrics.totalTokensUsed || 0) + tokensUsed,
        });

        return completedTask;
      },

      cancelTask: (taskId: string): void => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], status: 'cancelled' },
          },
        }));
      },

      getTasksByAgent: (agentId: string): AgentTask[] => {
        return Object.values(get().tasks).filter((t) => t.agentId === agentId);
      },

      getTasksByThread: (threadId: string): AgentTask[] => {
        return Object.values(get().tasks).filter((t) => t.threadId === threadId);
      },

      // ─────────────────────────────────────────────────────────
      // Agent Queries
      // ─────────────────────────────────────────────────────────
      getAgentById: (id: string): Agent | undefined => {
        if (id === 'nova') return get().nova;
        return get().hiredAgents[id];
      },

      getAgentsByCapability: (capability: CapabilityCategory): Agent[] => {
        const allAgents = [get().nova, ...Object.values(get().hiredAgents)];
        return allAgents.filter((a) =>
          a.capabilities.some((c) => c.category === capability)
        );
      },

      getAgentsBySphere: (sphereId: SphereId): Agent[] => {
        const allAgents = [get().nova, ...Object.values(get().hiredAgents)];
        return allAgents.filter((a) => a.sphereScopes.includes(sphereId));
      },

      getCompatibleAgents: (taskType: string, sphereId: SphereId): Agent[] => {
        const sphereAgents = get().getAgentsBySphere(sphereId);
        // Simple compatibility check based on task keywords
        return sphereAgents.filter((a) =>
          a.capabilities.some((c) =>
            c.name.toLowerCase().includes(taskType.toLowerCase()) ||
            c.description.toLowerCase().includes(taskType.toLowerCase())
          )
        );
      },

      // ─────────────────────────────────────────────────────────
      // Metrics
      // ─────────────────────────────────────────────────────────
      updateAgentMetrics: (agentId: string, metrics: Partial<AgentMetrics>): void => {
        if (agentId === 'nova') {
          set((state) => ({
            nova: {
              ...state.nova,
              metrics: { ...state.nova.metrics, ...metrics },
            },
          }));
        } else {
          set((state) => {
            const agent = state.hiredAgents[agentId];
            if (!agent) return state;
            
            return {
              hiredAgents: {
                ...state.hiredAgents,
                [agentId]: {
                  ...agent,
                  metrics: { ...agent.metrics, ...metrics },
                },
              },
            };
          });
        }
      },

      getAgentPerformance: (agentId: string): AgentMetrics | undefined => {
        return get().getAgentById(agentId)?.metrics;
      },
    }),
    {
      name: 'chenu-agents-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hiredAgents: state.hiredAgents,
        activeOrchestrator: state.activeOrchestrator,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════

export const useNova = () => useAgentStore((state) => state.nova);
export const useHiredAgents = () => useAgentStore((state) => Object.values(state.hiredAgents));
export const useAvailableAgents = () => useAgentStore((state) => state.availableAgents);
export const useActiveOrchestrator = () => useAgentStore((state) => state.getActiveOrchestrator());

export default useAgentStore;
