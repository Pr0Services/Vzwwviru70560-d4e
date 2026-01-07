/**
 * CHE·NU™ — Agent Types (Legacy Stub)
 */
export interface AgentConfig {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3;
  capabilities: string[];
}
export interface AgentInstance {
  agentId: string;
  status: 'idle' | 'active' | 'paused';
  currentTask?: string;
}
