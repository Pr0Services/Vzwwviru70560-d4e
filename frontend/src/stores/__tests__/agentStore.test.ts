// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — AGENT STORE TESTS
// Sprint 1 - Tâche 6: 15 tests pour agentStore
// Nova = System Intelligence (NEVER hired) | Agents = Hired with costs
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAgentStore } from '../agent.store';

// Reset store before each test
beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  // Reset to initial state
  const store = useAgentStore.getState();
  // Clear hired agents
  Object.keys(store.hiredAgents).forEach(id => {
    store.fireAgent(id);
  });
});

afterEach(() => {
  vi.useRealTimers();
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA TESTS (System Intelligence - NEVER Hired)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Nova - System Intelligence', () => {
  it('should always have Nova present', () => {
    const state = useAgentStore.getState();
    expect(state.nova).toBeDefined();
    expect(state.nova.id).toBe('nova');
  });

  it('Nova should be a system agent', () => {
    const nova = useAgentStore.getState().nova;
    expect(nova.isSystem).toBe(true);
  });

  it('Nova should NEVER be hired (always present)', () => {
    const nova = useAgentStore.getState().nova;
    expect(nova.isHired).toBe(false);
  });

  it('Nova should have type "nova"', () => {
    const nova = useAgentStore.getState().nova;
    expect(nova.type).toBe('nova');
  });

  it('Nova should have governance capability', () => {
    const nova = useAgentStore.getState().nova;
    const governanceCap = nova.capabilities.find(c => c.category === 'governance');
    expect(governanceCap).toBeDefined();
  });

  it('Nova should have memory management capability', () => {
    const nova = useAgentStore.getState().nova;
    const memoryCap = nova.capabilities.find(c => c.name === 'Memory Management');
    expect(memoryCap).toBeDefined();
    expect(memoryCap?.proficiency).toBe(100);
  });

  it('Nova should have access to all spheres', () => {
    const nova = useAgentStore.getState().nova;
    expect(nova.sphereScopes.length).toBeGreaterThanOrEqual(8);
  });

  it('should get Nova status', () => {
    const status = useAgentStore.getState().getNovaStatus();
    expect(['idle', 'thinking', 'executing', 'waiting', 'error', 'offline']).toContain(status);
  });

  it('should ask Nova and get response', async () => {
    const question = 'What is CHE·NU?';
    
    let response;
    await act(async () => {
      const promise = useAgentStore.getState().askNova(question);
      vi.advanceTimersByTime(3000);
      response = await promise;
    });
    
    expect(response).toBeDefined();
    expect(response?.status).toBe('completed');
    expect(response?.output).toContain('Nova');
  });

  it('Nova should have 100% encoding compatibility', () => {
    const nova = useAgentStore.getState().nova;
    expect(nova.encodingCompatibility).toBe(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CATALOG TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Catalog', () => {
  it('should have available agents in catalog', () => {
    const state = useAgentStore.getState();
    expect(state.availableAgents.length).toBeGreaterThan(0);
  });

  it('should have orchestrator in catalog', () => {
    const state = useAgentStore.getState();
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    expect(orchestrator).toBeDefined();
  });

  it('should have specialist agents in catalog', () => {
    const state = useAgentStore.getState();
    const specialists = state.availableAgents.filter(a => a.type === 'specialist');
    expect(specialists.length).toBeGreaterThan(0);
  });

  it('each agent should have defined costs', () => {
    const state = useAgentStore.getState();
    state.availableAgents.forEach(agent => {
      expect(agent.baseCostPerToken).toBeGreaterThan(0);
      expect(agent.averageTokensPerTask).toBeGreaterThan(0);
    });
  });

  it('each agent should have sphere scopes defined', () => {
    const state = useAgentStore.getState();
    state.availableAgents.forEach(agent => {
      expect(agent.sphereScopes.length).toBeGreaterThan(0);
    });
  });

  it('each agent should have capabilities', () => {
    const state = useAgentStore.getState();
    state.availableAgents.forEach(agent => {
      expect(agent.capabilities.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT HIRING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Hiring', () => {
  it('should hire an agent from catalog', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    const result = state.hireAgent(agentId);
    
    expect(result).toBe(true);
    expect(state.isAgentHired(agentId)).toBe(true);
  });

  it('hired agent should have isHired = true', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const hired = state.hiredAgents[agentId];
    
    expect(hired.isHired).toBe(true);
  });

  it('hired agent should have hiredAt timestamp', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const hired = state.hiredAgents[agentId];
    
    expect(hired.hiredAt).toBeDefined();
  });

  it('should not hire same agent twice', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const result = state.hireAgent(agentId);
    
    expect(result).toBe(false);
  });

  it('should not hire non-existent agent', () => {
    const result = useAgentStore.getState().hireAgent('fake-agent-id');
    expect(result).toBe(false);
  });

  it('should get list of hired agents', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const hiredList = state.getHiredAgents();
    
    expect(hiredList.length).toBe(1);
    expect(hiredList[0].id).toBe(agentId);
  });

  it('hired agent should have initial metrics', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const hired = state.hiredAgents[agentId];
    
    expect(hired.metrics).toBeDefined();
    expect(hired.metrics.tasksCompleted).toBe(0);
    expect(hired.metrics.totalTokensUsed).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT FIRING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Firing', () => {
  it('should fire a hired agent', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    const result = state.fireAgent(agentId);
    
    expect(result).toBe(true);
    expect(state.isAgentHired(agentId)).toBe(false);
  });

  it('should not fire non-hired agent', () => {
    const result = useAgentStore.getState().fireAgent('not-hired-agent');
    expect(result).toBe(false);
  });

  it('should clear active orchestrator when fired', () => {
    const state = useAgentStore.getState();
    const orchestratorAgent = state.availableAgents.find(a => a.type === 'orchestrator');
    
    if (orchestratorAgent) {
      state.hireAgent(orchestratorAgent.id);
      state.setActiveOrchestrator(orchestratorAgent.id);
      
      expect(state.activeOrchestrator).toBe(orchestratorAgent.id);
      
      state.fireAgent(orchestratorAgent.id);
      
      expect(useAgentStore.getState().activeOrchestrator).toBeNull();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ORCHESTRATOR TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Orchestrator Management', () => {
  it('should set active orchestrator', () => {
    const state = useAgentStore.getState();
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    
    if (orchestrator) {
      state.hireAgent(orchestrator.id);
      state.setActiveOrchestrator(orchestrator.id);
      
      expect(useAgentStore.getState().activeOrchestrator).toBe(orchestrator.id);
    }
  });

  it('should not set orchestrator if not hired', () => {
    const state = useAgentStore.getState();
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    
    if (orchestrator) {
      state.setActiveOrchestrator(orchestrator.id);
      expect(useAgentStore.getState().activeOrchestrator).toBeNull();
    }
  });

  it('should get active orchestrator', () => {
    const state = useAgentStore.getState();
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    
    if (orchestrator) {
      state.hireAgent(orchestrator.id);
      state.setActiveOrchestrator(orchestrator.id);
      
      const active = state.getActiveOrchestrator();
      expect(active?.id).toBe(orchestrator.id);
    }
  });

  it('should clear active orchestrator', () => {
    const state = useAgentStore.getState();
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    
    if (orchestrator) {
      state.hireAgent(orchestrator.id);
      state.setActiveOrchestrator(orchestrator.id);
      state.setActiveOrchestrator(null);
      
      expect(useAgentStore.getState().activeOrchestrator).toBeNull();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK MANAGEMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Task Management', () => {
  it('should create a task', () => {
    const task = useAgentStore.getState().createTask(
      'nova',
      'Analyze this document',
      'business'
    );
    
    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.status).toBe('pending');
    expect(task.agentId).toBe('nova');
    expect(task.sphereId).toBe('business');
  });

  it('should create task with thread reference', () => {
    const task = useAgentStore.getState().createTask(
      'nova',
      'Analyze this',
      'personal',
      'thread-123'
    );
    
    expect(task.threadId).toBe('thread-123');
  });

  it('should execute task and complete', async () => {
    const task = useAgentStore.getState().createTask(
      'nova',
      'Simple task',
      'personal'
    );
    
    let completedTask;
    await act(async () => {
      const promise = useAgentStore.getState().executeTask(task.id);
      vi.advanceTimersByTime(5000);
      completedTask = await promise;
    });
    
    expect(completedTask?.status).toBe('completed');
    expect(completedTask?.output).toBeDefined();
    expect(completedTask?.tokensUsed).toBeGreaterThan(0);
  });

  it('should cancel a task', () => {
    const task = useAgentStore.getState().createTask(
      'nova',
      'Task to cancel',
      'business'
    );
    
    useAgentStore.getState().cancelTask(task.id);
    
    const updated = useAgentStore.getState().tasks[task.id];
    expect(updated.status).toBe('cancelled');
  });

  it('should get tasks by agent', () => {
    const state = useAgentStore.getState();
    
    state.createTask('nova', 'Task 1', 'personal');
    state.createTask('nova', 'Task 2', 'business');
    
    const novaTasks = state.getTasksByAgent('nova');
    expect(novaTasks.length).toBe(2);
  });

  it('should get tasks by thread', () => {
    const state = useAgentStore.getState();
    
    state.createTask('nova', 'Task 1', 'personal', 'thread-abc');
    state.createTask('nova', 'Task 2', 'personal', 'thread-abc');
    state.createTask('nova', 'Task 3', 'personal', 'thread-xyz');
    
    const threadTasks = state.getTasksByThread('thread-abc');
    expect(threadTasks.length).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT QUERY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Queries', () => {
  it('should get agent by ID', () => {
    const nova = useAgentStore.getState().getAgentById('nova');
    expect(nova).toBeDefined();
    expect(nova?.name).toBe('Nova');
  });

  it('should get agents by capability', () => {
    const state = useAgentStore.getState();
    
    // Hire some agents first
    state.availableAgents.forEach(a => state.hireAgent(a.id));
    
    const analysisAgents = state.getAgentsByCapability('analysis');
    expect(analysisAgents.length).toBeGreaterThan(0);
  });

  it('should get agents by sphere', () => {
    const state = useAgentStore.getState();
    
    // Hire some agents
    state.availableAgents.forEach(a => state.hireAgent(a.id));
    
    const businessAgents = state.getAgentsBySphere('business');
    expect(businessAgents.length).toBeGreaterThan(0);
  });

  it('should get compatible agents for task', () => {
    const state = useAgentStore.getState();
    
    // Hire agents
    state.availableAgents.forEach(a => state.hireAgent(a.id));
    
    const compatible = state.getCompatibleAgents('analysis', 'business');
    expect(compatible.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// METRICS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Metrics', () => {
  it('should update Nova metrics', () => {
    useAgentStore.getState().updateAgentMetrics('nova', {
      tasksCompleted: 10,
      tasksSuccessful: 9,
    });
    
    const nova = useAgentStore.getState().nova;
    expect(nova.metrics.tasksCompleted).toBe(10);
    expect(nova.metrics.tasksSuccessful).toBe(9);
  });

  it('should update hired agent metrics', () => {
    const state = useAgentStore.getState();
    const agentId = state.availableAgents[0].id;
    
    state.hireAgent(agentId);
    state.updateAgentMetrics(agentId, {
      totalTokensUsed: 5000,
    });
    
    const agent = state.hiredAgents[agentId];
    expect(agent.metrics.totalTokensUsed).toBe(5000);
  });

  it('should get agent performance metrics', () => {
    const performance = useAgentStore.getState().getAgentPerformance('nova');
    
    expect(performance).toBeDefined();
    expect(performance).toHaveProperty('tasksCompleted');
    expect(performance).toHaveProperty('totalTokensUsed');
    expect(performance).toHaveProperty('userRating');
  });

  it('task execution should update metrics', async () => {
    const initialMetrics = useAgentStore.getState().nova.metrics;
    const initialTasksCompleted = initialMetrics.tasksCompleted;
    
    const task = useAgentStore.getState().createTask('nova', 'Test task', 'personal');
    
    await act(async () => {
      const promise = useAgentStore.getState().executeTask(task.id);
      vi.advanceTimersByTime(5000);
      await promise;
    });
    
    const newMetrics = useAgentStore.getState().nova.metrics;
    expect(newMetrics.tasksCompleted).toBe(initialTasksCompleted + 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT TYPES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agent Types', () => {
  it('should have different agent types in catalog', () => {
    const state = useAgentStore.getState();
    const types = new Set(state.availableAgents.map(a => a.type));
    
    expect(types.has('orchestrator')).toBe(true);
    expect(types.has('specialist')).toBe(true);
  });

  it('each agent type should have distinct capabilities', () => {
    const state = useAgentStore.getState();
    
    const orchestrator = state.availableAgents.find(a => a.type === 'orchestrator');
    const specialist = state.availableAgents.find(a => a.type === 'specialist');
    
    expect(orchestrator?.capabilities.map(c => c.category)).not.toEqual(
      specialist?.capabilities.map(c => c.category)
    );
  });
});
