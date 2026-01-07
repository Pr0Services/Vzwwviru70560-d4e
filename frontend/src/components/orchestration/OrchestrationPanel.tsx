/**
 * CHE·NU™ Agent Orchestration System
 * Manage agent assignments, workflows, and execution monitoring
 * 
 * @module orchestration
 * @version 33.0
 */

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type AgentStatus = 'idle' | 'running' | 'paused' | 'waiting' | 'completed' | 'failed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type ExecutionPhase = 'planning' | 'executing' | 'reviewing' | 'staging' | 'completed';

interface Agent {
  id: string;
  name: string;
  type: 'specialist' | 'assistant' | 'analyst' | 'executor';
  domain?: string;
  status: AgentStatus;
  currentTask?: string;
  tokenBudget: number;
  tokensUsed: number;
  successRate: number;
}

interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: AgentStatus;
  phase: ExecutionPhase;
  progress: number;
  tokensEstimated: number;
  tokensUsed: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  outputs?: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  agentId?: string;
  status: 'pending' | 'running' | 'completed' | 'skipped';
  order: number;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  steps: WorkflowStep[];
  currentStep: number;
  createdAt: string;
}

interface OrchestrationPanelProps {
  identityId: string;
  sphereId?: string;
  onAssignAgent?: (agentId: string, taskId: string) => void;
  onPauseAgent?: (agentId: string) => void;
  onResumeAgent?: (agentId: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const STATUS_INFO: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  idle: { label: 'En attente', color: 'slate', icon: '⏸️' },
  running: { label: 'En cours', color: 'emerald', icon: '▶️' },
  paused: { label: 'Pause', color: 'amber', icon: '⏯️' },
  waiting: { label: 'En attente', color: 'blue', icon: '⏳' },
  completed: { label: 'Terminé', color: 'green', icon: '✅' },
  failed: { label: 'Échec', color: 'red', icon: '❌' },
};

const PRIORITY_INFO: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'slate' },
  medium: { label: 'Moyenne', color: 'blue' },
  high: { label: 'Haute', color: 'amber' },
  urgent: { label: 'Urgente', color: 'red' },
};

const PHASE_INFO: Record<ExecutionPhase, { label: string; icon: string }> = {
  planning: { label: 'Planification', icon: '📋' },
  executing: { label: 'Exécution', icon: '⚙️' },
  reviewing: { label: 'Révision', icon: '👁️' },
  staging: { label: 'Staging', icon: '📦' },
  completed: { label: 'Terminé', icon: '✅' },
};

// Mock data
const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Agent Finance',
    type: 'analyst',
    domain: 'finance',
    status: 'running',
    currentTask: 'Analyse des dépenses Q4',
    tokenBudget: 10000,
    tokensUsed: 4500,
    successRate: 94,
  },
  {
    id: 'agent-002',
    name: 'Agent Rédaction',
    type: 'executor',
    domain: 'content',
    status: 'waiting',
    currentTask: 'Rapport mensuel',
    tokenBudget: 8000,
    tokensUsed: 2100,
    successRate: 98,
  },
  {
    id: 'agent-003',
    name: 'Agent Recherche',
    type: 'specialist',
    domain: 'research',
    status: 'idle',
    tokenBudget: 5000,
    tokensUsed: 0,
    successRate: 91,
  },
  {
    id: 'agent-004',
    name: 'Agent Construction',
    type: 'specialist',
    domain: 'construction',
    status: 'paused',
    currentTask: 'Estimation projet rénovation',
    tokenBudget: 12000,
    tokensUsed: 7800,
    successRate: 89,
  },
];

const mockTasks: AgentTask[] = [
  {
    id: 'task-001',
    agentId: 'agent-001',
    title: 'Analyse des dépenses Q4',
    description: 'Analyser toutes les dépenses du trimestre et générer un rapport',
    priority: 'high',
    status: 'running',
    phase: 'executing',
    progress: 67,
    tokensEstimated: 3000,
    tokensUsed: 2010,
    createdAt: '2025-01-15T08:00:00',
    startedAt: '2025-01-15T08:05:00',
  },
  {
    id: 'task-002',
    agentId: 'agent-002',
    title: 'Rapport mensuel',
    description: 'Compiler le rapport mensuel d\'activité',
    priority: 'medium',
    status: 'waiting',
    phase: 'reviewing',
    progress: 100,
    tokensEstimated: 2000,
    tokensUsed: 2100,
    createdAt: '2025-01-14T14:00:00',
    startedAt: '2025-01-14T14:10:00',
    outputs: ['rapport_janvier.pdf', 'graphiques.xlsx'],
  },
  {
    id: 'task-003',
    agentId: 'agent-004',
    title: 'Estimation projet rénovation',
    description: 'Créer une estimation détaillée pour la rénovation cuisine',
    priority: 'urgent',
    status: 'paused',
    phase: 'executing',
    progress: 45,
    tokensEstimated: 5000,
    tokensUsed: 2250,
    createdAt: '2025-01-15T09:30:00',
    startedAt: '2025-01-15T09:35:00',
  },
];

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Processus de Soumission',
    description: 'Workflow complet pour créer une soumission client',
    status: 'active',
    steps: [
      { id: 's1', name: 'Collecte infos', agentId: 'agent-003', status: 'completed', order: 0 },
      { id: 's2', name: 'Estimation', agentId: 'agent-004', status: 'running', order: 1 },
      { id: 's3', name: 'Rédaction', agentId: 'agent-002', status: 'pending', order: 2 },
      { id: 's4', name: 'Révision', agentId: 'agent-001', status: 'pending', order: 3 },
    ],
    currentStep: 1,
    createdAt: '2025-01-15T08:00:00',
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const AgentCard: React.FC<{
  agent: Agent;
  task?: AgentTask;
  onPause?: () => void;
  onResume?: () => void;
  onViewDetails?: () => void;
}> = ({ agent, task, onPause, onResume, onViewDetails }) => {
  const statusInfo = STATUS_INFO[agent.status];
  const tokenPercent = (agent.tokensUsed / agent.tokenBudget) * 100;
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-${statusInfo.color}-900/50 border border-${statusInfo.color}-700/50 flex items-center justify-center`}>
            🤖
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className={`text-${statusInfo.color}-400`}>{statusInfo.icon} {statusInfo.label}</span>
              {agent.domain && <span className="text-slate-500">• {agent.domain}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {agent.status === 'running' && onPause && (
            <button onClick={onPause} className="p-1 hover:bg-slate-700 rounded" title="Pause">
              ⏸️
            </button>
          )}
          {agent.status === 'paused' && onResume && (
            <button onClick={onResume} className="p-1 hover:bg-slate-700 rounded" title="Resume">
              ▶️
            </button>
          )}
          <button onClick={onViewDetails} className="p-1 hover:bg-slate-700 rounded" title="Details">
            ⚙️
          </button>
        </div>
      </div>
      
      {/* Current Task */}
      {task && (
        <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{task.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded bg-${PRIORITY_INFO[task.priority].color}-500`}>
              {PRIORITY_INFO[task.priority].label}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-400">{PHASE_INFO[task.phase].icon} {PHASE_INFO[task.phase].label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${statusInfo.color}-500 rounded-full transition-all`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{task.progress}%</span>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">Budget Tokens</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  tokenPercent > 80 ? 'bg-red-500' : tokenPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${tokenPercent}%` }}
              />
            </div>
            <span className="text-xs">{Math.round(tokenPercent)}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Taux de succès</div>
          <div className={`font-semibold ${
            agent.successRate >= 90 ? 'text-emerald-400' : 
            agent.successRate >= 70 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {agent.successRate}%
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowCard: React.FC<{
  workflow: Workflow;
  onViewDetails?: () => void;
}> = ({ workflow, onViewDetails }) => {
  const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / workflow.steps.length) * 100;
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{workflow.name}</h3>
          {workflow.description && (
            <p className="text-xs text-slate-500 mt-1">{workflow.description}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${
          workflow.status === 'active' ? 'bg-emerald-500' :
          workflow.status === 'paused' ? 'bg-amber-500' :
          workflow.status === 'completed' ? 'bg-blue-500' : 'bg-slate-600'
        }`}>
          {workflow.status}
        </span>
      </div>
      
      {/* Steps */}
      <div className="space-y-2 mb-4">
        {workflow.steps.map((step, i) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              step.status === 'running' ? 'bg-emerald-900/30 border border-emerald-700/50' :
              step.status === 'completed' ? 'bg-slate-700/30' : 'bg-slate-800/50'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step.status === 'completed' ? 'bg-emerald-500' :
              step.status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'
            }`}>
              {step.status === 'completed' ? '✓' : i + 1}
            </span>
            <span className="text-sm flex-1">{step.name}</span>
            {step.status === 'running' && (
              <span className="text-xs text-emerald-400">En cours...</span>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{completedSteps}/{workflow.steps.length}</span>
      </div>
    </div>
  );
};

const TaskQueue: React.FC<{
  tasks: AgentTask[];
}> = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => t.status === 'waiting' || t.phase === 'reviewing');
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>📋</span>
        <span>File d'attente ({pendingTasks.length})</span>
      </h3>
      
      <div className="space-y-2">
        {pendingTasks.map(task => (
          <div 
            key={task.id}
            className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg"
          >
            <span className={`w-2 h-2 rounded-full bg-${PRIORITY_INFO[task.priority].color}-500`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{task.title}</div>
              <div className="text-xs text-slate-500">
                {PHASE_INFO[task.phase].icon} {PHASE_INFO[task.phase].label}
              </div>
            </div>
            {task.outputs && task.outputs.length > 0 && (
              <button className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs">
                Approuver
              </button>
            )}
          </div>
        ))}
        
        {pendingTasks.length === 0 && (
          <p className="text-center text-slate-500 py-4">Aucune tâche en attente</p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const OrchestrationPanel: React.FC<OrchestrationPanelProps> = ({
  identityId,
  sphereId,
  onAssignAgent,
  onPauseAgent,
  onResumeAgent
}) => {
  const [agents] = useState<Agent[]>(mockAgents);
  const [tasks] = useState<AgentTask[]>(mockTasks);
  const [workflows] = useState<Workflow[]>(mockWorkflows);
  const [activeTab, setActiveTab] = useState<'agents' | 'workflows' | 'queue'>('agents');
  
  const runningAgents = agents.filter(a => a.status === 'running').length;
  const totalTokensUsed = agents.reduce((sum, a) => sum + a.tokensUsed, 0);
  const totalTokensBudget = agents.reduce((sum, a) => sum + a.tokenBudget, 0);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🎭</span>
            <span>Orchestration</span>
          </h1>
          <p className="text-slate-400">Gérez vos agents et workflows</p>
        </div>
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-2">
          <span>➕</span>
          <span>Assigner Agent</span>
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">{runningAgents}</div>
          <div className="text-sm text-slate-400">Agents actifs</div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
          <div className="text-sm text-slate-400">Total agents</div>
        </div>
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-400">{tasks.length}</div>
          <div className="text-sm text-slate-400">Tâches en cours</div>
        </div>
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round((totalTokensUsed / totalTokensBudget) * 100)}%
          </div>
          <div className="text-sm text-slate-400">Tokens utilisés</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'agents', label: 'Agents', icon: '🤖', count: agents.length },
          { id: 'workflows', label: 'Workflows', icon: '🔄', count: workflows.length },
          { id: 'queue', label: 'File d\'attente', icon: '📋', count: tasks.filter(t => t.status === 'waiting').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-amber-600' 
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="bg-slate-700 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              task={tasks.find(t => t.agentId === agent.id && t.status === 'running')}
              onPause={() => onPauseAgent?.(agent.id)}
              onResume={() => onResumeAgent?.(agent.id)}
            />
          ))}
        </div>
      )}
      
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
      
      {activeTab === 'queue' && (
        <TaskQueue tasks={tasks} />
      )}
    </div>
  );
};

export default OrchestrationPanel;
