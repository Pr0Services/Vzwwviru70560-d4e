// =============================================================================
// CHE·NU™ — AGENT TYPES
// Version Finale V51
// 168 Agents Hiérarchiques (L0-L3)
// =============================================================================

import { SphereId } from './sphere.types';

/**
 * Niveaux hiérarchiques des agents
 * L0: Constitutional (3) - Veto power, Tree Laws
 * L1: Strategic (12) - Department orchestration
 * L2: Tactical (45) - Sphere management
 * L3: Operational (108) - Task execution
 */
export type AgentLevel = 0 | 1 | 2 | 3;

/**
 * Types d'agents
 */
export type AgentType = 
  | 'guardian'      // L0 - Gardien constitutionnel
  | 'coordinator'   // L1 - Coordinateur stratégique
  | 'analyzer'      // L2 - Analyseur tactique
  | 'validator'     // L2 - Validateur tactique
  | 'executor'      // L3 - Exécuteur opérationnel
  | 'assistant'     // L3 - Assistant spécialisé
  | 'monitor'       // Transversal - Monitoring
  | 'gateway';      // Nova - Point d'entrée

/**
 * Départements/domaines des agents
 */
export type AgentDepartment =
  | 'all'           // Transversal
  | 'governance'    // Gouvernance
  | 'security'      // Sécurité
  | 'compliance'    // Conformité
  | 'construction'  // Construction (Québec)
  | 'finance'       // Finance
  | 'legal'         // Légal
  | 'hr'            // Ressources humaines
  | 'marketing'     // Marketing
  | 'operations'    // Opérations
  | 'technology'    // Technologie
  | 'creative'      // Créatif
  | 'research'      // Recherche
  | 'support';      // Support

/**
 * État d'un agent
 */
export type AgentStatus = 
  | 'idle'          // En attente
  | 'thinking'      // En réflexion
  | 'working'       // En travail
  | 'waiting'       // En attente validation
  | 'blocked'       // Bloqué
  | 'sleeping'      // En veille
  | 'error';        // En erreur

/**
 * Permissions d'un agent
 */
export interface AgentPermissions {
  canRead: boolean;
  canWrite: boolean;
  canExecute: boolean;
  canDelegate: boolean;
  canEscalate: boolean;
  canVeto: boolean;          // L0 seulement
  requiresApproval: boolean;
  autoExecuteThreshold: number; // 0-1, niveau de confiance pour auto-exécution
}

/**
 * Capacités d'un agent
 */
export interface AgentCapabilities {
  naturalLanguage: boolean;
  codeGeneration: boolean;
  dataAnalysis: boolean;
  webSearch: boolean;
  fileOperations: boolean;
  apiCalls: boolean;
  scheduling: boolean;
  notifications: boolean;
  xrInteraction: boolean;
  multiModal: boolean;
}

/**
 * Configuration LLM d'un agent
 */
export interface AgentLLMConfig {
  provider: 'anthropic' | 'openai' | 'google' | 'ollama' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  customInstructions?: string;
}

/**
 * Métriques de performance d'un agent
 */
export interface AgentMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  avgResponseTime: number;   // En ms
  avgQualityScore: number;   // 0-1
  userSatisfaction: number;  // 0-1
  lastActive: Date;
}

/**
 * Règles de gouvernance d'un agent
 */
export interface AgentGovernance {
  treeLawsCompliant: boolean;
  humanApprovalRequired: boolean;
  escalationPath: string[];     // IDs des agents pour escalade
  vetoAgentIds: string[];       // IDs des agents L0 qui peuvent veto
  auditTrail: boolean;
  maxAutonomousActions: number;
}

/**
 * Position orbitale d'un agent
 */
export interface AgentOrbitPosition {
  sphereId: SphereId;
  orbitLevel: number;     // 1-3, distance du centre de la sphère
  angle: number;          // 0-360 degrés
  speed: number;          // Vitesse de rotation
  visible: boolean;
}

/**
 * Relations inter-agents
 */
export interface AgentRelation {
  targetAgentId: string;
  relationType: 'reports_to' | 'delegates_to' | 'collaborates_with' | 'escalates_to';
  strength: number;       // 0-1
}

/**
 * Définition complète d'un agent
 */
export interface Agent {
  // Identité
  id: string;
  name: string;
  nameFr: string;
  code: string;           // Ex: "L0-001", "L2-CONST-003"
  type: AgentType;
  level: AgentLevel;
  department: AgentDepartment;
  
  // Description
  description: string;
  descriptionFr: string;
  emoji: string;
  avatar: string;         // URL ou identifiant avatar
  
  // Affectation
  sphereId: SphereId | 'all';
  categoryId: string | null;
  
  // Configuration
  permissions: AgentPermissions;
  capabilities: AgentCapabilities;
  llmConfig: AgentLLMConfig;
  governance: AgentGovernance;
  
  // Position visuelle
  orbit: AgentOrbitPosition;
  
  // Relations
  parentAgentId: string | null;
  childAgentIds: string[];
  relations: AgentRelation[];
  
  // État
  status: AgentStatus;
  metrics: AgentMetrics;
  
  // Métadonnées
  version: string;
  createdAt: Date;
  updatedAt: Date;
  isCore: boolean;        // Agent core (ne peut être désactivé)
}

/**
 * Action d'un agent
 */
export interface AgentAction {
  id: string;
  agentId: string;
  type: 'proposal' | 'execution' | 'escalation' | 'veto' | 'approval';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  requiresApproval: boolean;
  approvedBy: string | null;
  createdAt: Date;
  executedAt: Date | null;
  result?: Record<string, unknown>;
}

/**
 * Message d'un agent
 */
export interface AgentMessage {
  id: string;
  agentId: string;
  type: 'info' | 'question' | 'suggestion' | 'warning' | 'error';
  content: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
}

/**
 * Filtre pour recherche d'agents
 */
export interface AgentFilter {
  level?: AgentLevel[];
  type?: AgentType[];
  department?: AgentDepartment[];
  sphereId?: SphereId[];
  status?: AgentStatus[];
  isCore?: boolean;
  search?: string;
}

/**
 * Statistiques des agents
 */
export interface AgentStats {
  total: number;
  byLevel: Record<AgentLevel, number>;
  byType: Record<AgentType, number>;
  byStatus: Record<AgentStatus, number>;
  activeNow: number;
  pendingApprovals: number;
}

// =============================================================================
// CONSTANTES
// =============================================================================

export const AGENT_LEVELS: AgentLevel[] = [0, 1, 2, 3];

export const AGENT_LEVEL_NAMES: Record<AgentLevel, string> = {
  0: 'Constitutional',
  1: 'Strategic',
  2: 'Tactical',
  3: 'Operational',
};

export const AGENT_LEVEL_COLORS: Record<AgentLevel, string> = {
  0: '#E53935', // Rouge - Guardian
  1: '#8E24AA', // Violet - Coordinator
  2: '#1E88E5', // Bleu - Analyzer
  3: '#43A047', // Vert - Executor
};

export const AGENT_LEVEL_COUNTS: Record<AgentLevel, number> = {
  0: 1,    // Nova
  1: 8,    // Sphere Orchestrators
  2: 50,   // Domain Specialists
  3: 167,  // Task Executors
};

export const AGENT_STATUS_ICONS: Record<AgentStatus, string> = {
  idle: '⚪',
  thinking: '🤔',
  working: '⚙️',
  waiting: '⏳',
  blocked: '🚫',
  sleeping: '💤',
  error: '❌',
};

export const TOTAL_AGENTS = 226;

// =============================================================================
// CORE AGENTS IDS (6 agents fondamentaux)
// =============================================================================

export const CORE_AGENT_IDS = {
  TREE_GUARDIAN: 'AGENT_L0_TREE_GUARDIAN',
  NOVA_GATEWAY: 'AGENT_L0_NOVA_GATEWAY',
  MEMORY_COMPANION: 'AGENT_L0_MEMORY_COMPANION',
  ARCHITECT_SIGMA: 'AGENT_L1_ARCHITECT_SIGMA',
  STRATEGY_ORCHESTRATOR: 'AGENT_L1_STRATEGY_ORCHESTRATOR',
  COMPLIANCE_GUARDIAN: 'AGENT_L1_COMPLIANCE_GUARDIAN',
};
