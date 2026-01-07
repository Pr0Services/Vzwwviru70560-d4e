/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — USE AGENT HOOK                              ║
 * ║                    Agent Management & Interaction                             ║
 * ║                    Task A+12: Alpha+ Roadmap                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * HOOK FEATURES:
 * - Agent hiring with governance
 * - Task assignment & tracking
 * - Agent pool management
 * - Nova integration (non-hireable)
 * - Capability matching
 */

import { useCallback, useMemo } from 'react'
import {
  useAgentStore,
  type Agent,
  type AgentStatus,
  type AgentCapability,
  type AgentTask,
  type TaskStatus,
  type SphereId,
} from '../stores'
import { useGovernance } from './useGovernance'
import { useTokenBudget } from './useTokenBudget'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentPoolStats {
  total_available: number
  hired_count: number
  active_count: number
  by_capability: Record<string, number>
}

export interface HireAgentOptions {
  agent_id: string
  sphere_id: SphereId
  token_budget?: number
  auto_renew?: boolean
  reason?: string
}

export interface AssignTaskOptions {
  agent_id: string
  title: string
  description: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  deadline?: string
  thread_id?: string
  requires_checkpoint?: boolean
  metadata?: Record<string, unknown>
}

export interface AgentSearchCriteria {
  capability?: AgentCapability
  min_reliability?: number
  max_cost_per_token?: number
  available_only?: boolean
  sphere_id?: SphereId
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useAgent(identityId: string, sphereId?: SphereId) {
  // Stores
  const agents = useAgentStore(state => state.agents)
  const agentPool = useAgentStore(state => state.agent_pool)
  const tasks = useAgentStore(state => state.tasks)
  const nova = useAgentStore(state => state.nova)
  
  // Store actions
  const hireAgentAction = useAgentStore(state => state.hireAgent)
  const fireAgentAction = useAgentStore(state => state.fireAgent)
  const assignTaskAction = useAgentStore(state => state.assignTask)
  const completeTaskAction = useAgentStore(state => state.completeTask)
  const cancelTaskAction = useAgentStore(state => state.cancelTask)
  const updateAgentStatusAction = useAgentStore(state => state.updateAgentStatus)
  const searchPoolAction = useAgentStore(state => state.searchPool)
  const getNovaAction = useAgentStore(state => state.getNova)
  
  // Related hooks
  const governance = useGovernance(identityId)
  const tokenBudget = useTokenBudget(identityId, sphereId)
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Filtered Agents
  // ─────────────────────────────────────────────────────────────────────────────
  
  const myAgents = useMemo(() => {
    let result = Object.values(agents).filter(a => a.hired_by === identityId)
    if (sphereId) {
      result = result.filter(a => a.sphere_id === sphereId)
    }
    return result
  }, [agents, identityId, sphereId])
  
  const activeAgents = useMemo(() => {
    return myAgents.filter(a => a.status === 'active')
  }, [myAgents])
  
  const availableAgents = useMemo(() => {
    return Object.values(agentPool).filter(a => 
      a.status === 'available' && !a.hired_by
    )
  }, [agentPool])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Tasks
  // ─────────────────────────────────────────────────────────────────────────────
  
  const myTasks = useMemo(() => {
    return Object.values(tasks).filter(t => 
      myAgents.some(a => a.id === t.agent_id)
    )
  }, [tasks, myAgents])
  
  const pendingTasks = useMemo(() => {
    return myTasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
  }, [myTasks])
  
  const tasksByAgent = useMemo(() => {
    const grouped: Record<string, AgentTask[]> = {}
    myTasks.forEach(task => {
      if (!grouped[task.agent_id]) {
        grouped[task.agent_id] = []
      }
      grouped[task.agent_id].push(task)
    })
    return grouped
  }, [myTasks])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Pool Statistics
  // ─────────────────────────────────────────────────────────────────────────────
  
  const poolStats: AgentPoolStats = useMemo(() => {
    const byCapability: Record<string, number> = {}
    
    availableAgents.forEach(agent => {
      agent.capabilities.forEach(cap => {
        byCapability[cap] = (byCapability[cap] || 0) + 1
      })
    })
    
    return {
      total_available: availableAgents.length,
      hired_count: myAgents.length,
      active_count: activeAgents.length,
      by_capability: byCapability,
    }
  }, [availableAgents, myAgents, activeAgents])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Hiring Operations
  // ─────────────────────────────────────────────────────────────────────────────
  
  const canHire = useCallback((agentId: string): { allowed: boolean; reason?: string } => {
    const agent = agentPool[agentId]
    
    if (!agent) {
      return { allowed: false, reason: 'Agent not found in pool' }
    }
    
    if (agent.status !== 'available') {
      return { allowed: false, reason: 'Agent is not available' }
    }
    
    if (agent.hired_by) {
      return { allowed: false, reason: 'Agent is already hired' }
    }
    
    // Check if we have tokens for the hire
    const hireCost = agent.cost_per_token * 100 // Estimate initial cost
    const canPay = tokenBudget.canConsume(undefined, hireCost)
    if (!canPay.allowed) {
      return { allowed: false, reason: canPay.reason }
    }
    
    return { allowed: true }
  }, [agentPool, tokenBudget])
  
  const hire = useCallback(async (options: HireAgentOptions): Promise<{
    success: boolean
    agent?: Agent
    error?: string
    checkpoint_id?: string
  }> => {
    // Check if can hire
    const check = canHire(options.agent_id)
    if (!check.allowed) {
      return { success: false, error: check.reason }
    }
    
    // Create governance checkpoint for hiring
    const checkpoint = governance.createCheckpoint({
      title: `Embaucher agent: ${options.agent_id}`,
      description: options.reason || 'Demande d\'embauche d\'agent',
      action_type: 'agent_action',
      priority: 'medium',
      identity_id: identityId,
      sphere_id: options.sphere_id,
      agent_id: options.agent_id,
      payload: {
        action: 'hire',
        token_budget: options.token_budget,
        auto_renew: options.auto_renew,
      },
    })
    
    // For now, auto-approve (in production, this would wait for approval)
    governance.approveCheckpoint(checkpoint.id, identityId)
    
    // Hire the agent
    const agent = hireAgentAction({
      agent_id: options.agent_id,
      hired_by: identityId,
      sphere_id: options.sphere_id,
      token_budget: options.token_budget || 1000,
      auto_renew: options.auto_renew || false,
    })
    
    if (!agent) {
      return { success: false, error: 'Failed to hire agent' }
    }
    
    // Log audit
    governance.logAudit({
      action: 'agent_hired',
      severity: 'medium',
      identity_id: identityId,
      agent_id: options.agent_id,
      sphere_id: options.sphere_id,
      checkpoint_id: checkpoint.id,
      details: {
        token_budget: options.token_budget,
        auto_renew: options.auto_renew,
      },
    })
    
    return {
      success: true,
      agent,
      checkpoint_id: checkpoint.id,
    }
  }, [canHire, governance, hireAgentAction, identityId])
  
  const fire = useCallback((agentId: string, reason?: string): boolean => {
    const agent = agents[agentId]
    if (!agent || agent.hired_by !== identityId) {
      return false
    }
    
    const success = fireAgentAction(agentId)
    
    if (success) {
      governance.logAudit({
        action: 'agent_fired',
        severity: 'medium',
        identity_id: identityId,
        agent_id: agentId,
        details: { reason },
      })
    }
    
    return success
  }, [agents, fireAgentAction, governance, identityId])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Task Operations
  // ─────────────────────────────────────────────────────────────────────────────
  
  const assignTask = useCallback((options: AssignTaskOptions): AgentTask | null => {
    const agent = agents[options.agent_id]
    if (!agent || agent.hired_by !== identityId) {
      logger.warn('[useAgent] Cannot assign task: agent not hired by this identity')
      return null
    }
    
    // Check if checkpoint required
    if (options.requires_checkpoint) {
      const checkpoint = governance.createCheckpoint({
        title: `Tâche: ${options.title}`,
        description: options.description,
        action_type: 'agent_action',
        priority: options.priority || 'medium',
        identity_id: identityId,
        agent_id: options.agent_id,
        thread_id: options.thread_id,
        payload: {
          task_title: options.title,
          deadline: options.deadline,
        },
      })
      
      // Auto-approve for low priority
      if (options.priority !== 'critical' && options.priority !== 'high') {
        governance.approveCheckpoint(checkpoint.id, identityId)
      }
    }
    
    const task = assignTaskAction({
      agent_id: options.agent_id,
      title: options.title,
      description: options.description,
      priority: options.priority || 'medium',
      deadline: options.deadline,
      thread_id: options.thread_id,
      assigned_by: identityId,
      metadata: options.metadata,
    })
    
    if (task) {
      governance.logAudit({
        action: 'agent_task_assigned',
        severity: 'low',
        identity_id: identityId,
        agent_id: options.agent_id,
        thread_id: options.thread_id,
        details: {
          task_id: task.id,
          task_title: options.title,
          priority: options.priority,
        },
      })
    }
    
    return task
  }, [agents, assignTaskAction, governance, identityId])
  
  const completeTask = useCallback((taskId: string, result?: Record<string, unknown>): boolean => {
    const task = tasks[taskId]
    if (!task) return false
    
    const success = completeTaskAction(taskId, result)
    
    if (success) {
      governance.logAudit({
        action: 'agent_task_completed',
        severity: 'low',
        identity_id: identityId,
        agent_id: task.agent_id,
        thread_id: task.thread_id || undefined,
        details: {
          task_id: taskId,
          task_title: task.title,
        },
      })
    }
    
    return success
  }, [tasks, completeTaskAction, governance, identityId])
  
  const cancelTask = useCallback((taskId: string, reason?: string): boolean => {
    return cancelTaskAction(taskId, reason)
  }, [cancelTaskAction])
  
  const getTasksForAgent = useCallback((agentId: string): AgentTask[] => {
    return tasksByAgent[agentId] || []
  }, [tasksByAgent])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Agent Search
  // ─────────────────────────────────────────────────────────────────────────────
  
  const searchAgents = useCallback((criteria: AgentSearchCriteria = {}): Agent[] => {
    let results = searchPoolAction(criteria.capability)
    
    if (criteria.min_reliability !== undefined) {
      results = results.filter(a => a.reliability_score >= criteria.min_reliability!)
    }
    
    if (criteria.max_cost_per_token !== undefined) {
      results = results.filter(a => a.cost_per_token <= criteria.max_cost_per_token!)
    }
    
    if (criteria.available_only) {
      results = results.filter(a => a.status === 'available' && !a.hired_by)
    }
    
    return results
  }, [searchPoolAction])
  
  const findAgentByCapability = useCallback((capability: AgentCapability): Agent | undefined => {
    return availableAgents.find(a => a.capabilities.includes(capability))
  }, [availableAgents])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Nova (System Intelligence)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const novaInfo = useMemo(() => {
    return getNovaAction()
  }, [getNovaAction])
  
  const isNova = useCallback((agentId: string): boolean => {
    return agentId === 'nova' || agentId === nova.id
  }, [nova])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Agent Status
  // ─────────────────────────────────────────────────────────────────────────────
  
  const getAgent = useCallback((agentId: string): Agent | undefined => {
    return agents[agentId] || agentPool[agentId]
  }, [agents, agentPool])
  
  const updateStatus = useCallback((agentId: string, status: AgentStatus): void => {
    updateAgentStatusAction(agentId, status)
  }, [updateAgentStatusAction])
  
  const pauseAgent = useCallback((agentId: string): void => {
    updateStatus(agentId, 'paused')
  }, [updateStatus])
  
  const resumeAgent = useCallback((agentId: string): void => {
    updateStatus(agentId, 'active')
  }, [updateStatus])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Convenience
  // ─────────────────────────────────────────────────────────────────────────────
  
  const hasActiveAgents = useMemo((): boolean => {
    return activeAgents.length > 0
  }, [activeAgents])
  
  const hasPendingTasks = useMemo((): boolean => {
    return pendingTasks.length > 0
  }, [pendingTasks])
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────────
  
  return {
    // Data
    agents: myAgents,
    activeAgents,
    availableAgents,
    tasks: myTasks,
    pendingTasks,
    tasksByAgent,
    poolStats,
    nova: novaInfo,
    
    // Hiring
    canHire,
    hire,
    fire,
    
    // Tasks
    assignTask,
    completeTask,
    cancelTask,
    getTasksForAgent,
    
    // Search
    searchAgents,
    findAgentByCapability,
    
    // Status
    getAgent,
    updateStatus,
    pauseAgent,
    resumeAgent,
    isNova,
    
    // Convenience
    hasActiveAgents,
    hasPendingTasks,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for a specific agent
 */
export function useAgentById(agentId: string) {
  const agent = useAgentStore(state => state.agents[agentId] || state.agent_pool[agentId])
  const tasks = useAgentStore(state => 
    Object.values(state.tasks).filter(t => t.agent_id === agentId)
  )
  const updateStatus = useAgentStore(state => state.updateAgentStatus)
  
  const isActive = agent?.status === 'active'
  const isHired = !!agent?.hired_by
  const pendingTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length
  
  return {
    agent,
    tasks,
    isActive,
    isHired,
    pendingTasksCount,
    pause: () => updateStatus(agentId, 'paused'),
    resume: () => updateStatus(agentId, 'active'),
  }
}

/**
 * Hook for Nova system intelligence
 */
export function useNova() {
  const nova = useAgentStore(state => state.nova)
  const getNova = useAgentStore(state => state.getNova)
  
  return {
    nova,
    ...getNova(),
    isSystemIntelligence: true,
    isHireable: false, // Nova is NEVER hireable
  }
}

/**
 * Hook for agent pool
 */
export function useAgentPool() {
  const pool = useAgentStore(state => state.agent_pool)
  const searchPool = useAgentStore(state => state.searchPool)
  
  const availableCount = Object.values(pool).filter(a => 
    a.status === 'available' && !a.hired_by
  ).length
  
  return {
    pool: Object.values(pool),
    availableCount,
    search: searchPool,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  AgentPoolStats,
  HireAgentOptions,
  AssignTaskOptions,
  AgentSearchCriteria,
}

export default useAgent
