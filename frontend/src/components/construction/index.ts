/**
 * CHE·NU™ Construction Module
 * Complete construction domain components
 * 
 * @module construction
 * @version 33.0
 */

// Hierarchy & Agents
export { default as AgentsHierarchy } from './AgentsHierarchy';

// Dashboard
export { default as ConstructionDashboard } from './Dashboard';

// Workflows
export { default as ConstructionWorkflows } from './Workflows';

// Tools & Calculators
export { default as ConstructionTools } from './Tools';
export { default as ConstructionToolsIntegrated } from './ToolsIntegrated';
export { default as ConstructionCalculators } from './Calculators';

// Templates
export { default as ConstructionTemplates } from './Templates';

// Integrations
export { default as ConstructionIntegrationsUI } from './IntegrationsUI';

// Re-export types
export type ConstructionProject = {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'paused' | 'planning';
  phase: 'design' | 'permit' | 'construction' | 'closeout';
  progress: number;
  budget: {
    total: number;
    spent: number;
    committed: number;
  };
  schedule: {
    start: string;
    end: string;
    daysRemaining: number;
  };
};

export type ConstructionAgent = {
  id: string;
  name: string;
  icon: string;
  level: 'L1' | 'L2' | 'L3';
  desc: string;
  tools: string[];
  delegatesTo?: string[];
  responsibilities: string[];
};

export type ConstructionDepartment = {
  id: string;
  name: string;
  icon: string;
  head: string;
  agents: number;
  activeProjects: number;
};
