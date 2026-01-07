/**
 * CHE·NU™ Agent Orchestration Module
 * Manage agent assignments, workflows, and execution monitoring
 * 
 * @module orchestration
 * @version 33.0
 */

export { default as OrchestrationPanel } from './OrchestrationPanel';

// Types
export type AgentStatus = 'idle' | 'running' | 'paused' | 'waiting' | 'completed' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ExecutionPhase = 'planning' | 'executing' | 'reviewing' | 'staging' | 'completed';

export interface Agent {
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

// Constants
export const AGENT_STATUSES = [
  'idle', 'running', 'paused', 'waiting', 'completed', 'failed'
] as const;
