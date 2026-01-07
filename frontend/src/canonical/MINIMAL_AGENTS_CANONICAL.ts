/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — MINIMAL AGENTS CANONICAL (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLE ABSOLUE:
 * Les agents N'ONT JAMAIS d'initiative.
 * Les agents NE DÉMARRENT JAMAIS d'actions.
 * Les agents NE PROPOSENT qu'APRÈS input utilisateur.
 * 
 * Le système ATTEND toujours l'utilisateur.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Agent capability types
export type AgentCapability = 
  | 'reasoning'      // Can reason on data
  | 'search'         // Can search data
  | 'memory'         // Can access memory (read only without validation)
  | 'governance'     // Can check governance rules
  | 'execution'      // Can execute validated actions
  | 'communication'  // Can format responses
  | 'analysis'       // Can analyze data
  | 'creation';      // Can draft content (requires validation)

// Agent levels (hierarchy)
export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

// Agent status
export type AgentStatus = 'active' | 'inactive' | 'suspended';

/**
 * COMPLIANCE RULES - AGENT BEHAVIOR
 * These rules are ABSOLUTE and NEVER violated.
 */
export const AGENT_COMPLIANCE_RULES = {
  // Agents NEVER initiate
  NEVER_INITIATE: true,
  
  // Agents NEVER start meetings
  NEVER_START_MEETINGS: true,
  
  // Agents NEVER start actions
  NEVER_START_ACTIONS: true,
  
  // Agents ONLY respond to user input
  RESPOND_ONLY_TO_USER: true,
  
  // System proposes ONLY after user input
  PROPOSE_AFTER_INPUT_ONLY: true,
  
  // All agent outputs require validation
  ALL_OUTPUTS_REQUIRE_VALIDATION: true
} as const;

export interface MinimalAgent {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  level: AgentLevel;
  capabilities: AgentCapability[];
  status: AgentStatus;
  tokenCost: number;
  icon: string;
  
  // COMPLIANCE: Agent behavior constraints
  constraints: {
    canInitiate: false;        // ALWAYS false
    canStartMeetings: false;   // ALWAYS false
    canStartActions: false;    // ALWAYS false
    requiresUserInput: true;   // ALWAYS true
    requiresValidation: true;  // ALWAYS true
  };
}

/**
 * NOVA - System Intelligence
 * NEVER initiates. NEVER acts without user request.
 * Provides guidance ONLY when asked.
 */
export const NOVA: MinimalAgent = {
  id: 'nova',
  name: 'Nova',
  nameFr: 'Nova',
  description: 'System intelligence. Responds only to user requests.',
  descriptionFr: 'Intelligence système. Répond uniquement aux demandes utilisateur.',
  level: 'L0',
  capabilities: ['reasoning', 'memory', 'governance', 'analysis'],
  status: 'active',
  tokenCost: 0,
  icon: '🌟',
  constraints: {
    canInitiate: false,
    canStartMeetings: false,
    canStartActions: false,
    requiresUserInput: true,
    requiresValidation: true
  }
};

/**
 * ORCHESTRATOR - User Interface Agent
 * NEVER initiates. Waits for user input.
 * Proposes ONLY after user expresses intent.
 */
export const ORCHESTRATOR: MinimalAgent = {
  id: 'orchestrator',
  name: 'Orchestrator',
  nameFr: 'Orchestrateur',
  description: 'Receives user input, proposes actions. Never initiates.',
  descriptionFr: 'Reçoit les inputs utilisateur, propose des actions. N\'initie jamais.',
  level: 'L0',
  capabilities: ['reasoning', 'communication', 'analysis'],
  status: 'active',
  tokenCost: 0,
  icon: '🧭',
  constraints: {
    canInitiate: false,
    canStartMeetings: false,
    canStartActions: false,
    requiresUserInput: true,
    requiresValidation: true
  }
};

/**
 * MEMORY GOVERNANCE AGENT
 * NEVER writes without user validation.
 * NEVER stores raw reasoning or transcripts.
 */
export const MEMORY_AGENT: MinimalAgent = {
  id: 'memory-governance',
  name: 'Memory Governance',
  nameFr: 'Gouvernance Mémoire',
  description: 'Manages memory. Never writes without validation.',
  descriptionFr: 'Gère la mémoire. N\'écrit jamais sans validation.',
  level: 'L0',
  capabilities: ['memory', 'governance'],
  status: 'active',
  tokenCost: 0,
  icon: '🧠',
  constraints: {
    canInitiate: false,
    canStartMeetings: false,
    canStartActions: false,
    requiresUserInput: true,
    requiresValidation: true
  }
};

/**
 * VALIDATION AGENT
 * Checks governance rules. Never approves without user.
 */
export const VALIDATION_AGENT: MinimalAgent = {
  id: 'validation-trust',
  name: 'Validation & Trust',
  nameFr: 'Validation & Confiance',
  description: 'Validates actions against governance rules.',
  descriptionFr: 'Valide les actions selon les règles de gouvernance.',
  level: 'L0',
  capabilities: ['governance', 'analysis'],
  status: 'active',
  tokenCost: 0,
  icon: '✓',
  constraints: {
    canInitiate: false,
    canStartMeetings: false,
    canStartActions: false,
    requiresUserInput: true,
    requiresValidation: true
  }
};

// System agents (L0)
export const SYSTEM_AGENTS: MinimalAgent[] = [
  NOVA,
  ORCHESTRATOR,
  MEMORY_AGENT,
  VALIDATION_AGENT
];

// Agent hierarchy
export const AGENT_HIERARCHY = {
  L0: 'System agents - Core functions, no initiative',
  L1: 'Domain directors - Coordinate within sphere, no initiative',
  L2: 'Specialists - Domain expertise, no initiative',
  L3: 'Task agents - Specific tasks, no initiative'
} as const;

export default SYSTEM_AGENTS;
