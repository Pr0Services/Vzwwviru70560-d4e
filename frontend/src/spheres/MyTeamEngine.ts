/**
 * CHE·NU™ — MY TEAM SPHERE ENGINE v35
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * MY TEAM: AI Agents + Skills & Tools + IA Labs — UNIFIED COMMAND CENTER
 * Your Personal AI Workforce + Skill Management + Innovation Lab
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * @author Jonathan Emmanuel Rodrigue
 * @version 35.0
 * @license Proprietary - All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════
// SPHERE IDENTITY (V51 STANDARD)
// ═══════════════════════════════════════════════════════════════════════════

import type { SphereId } from '../types/spheres.types';

export const SPHERE_ID: SphereId = 'my_team';
export const SPHERE_COLOR = '#5ED8FF';
export const SPHERE_ICON = '🤝';
export const SPHERE_NAME = 'My Team';
export const SPHERE_NAME_FR = 'Équipe';

// ═══════════════════════════════════════════════════════════════════════════
// MY TEAM ENGINE — THE COMPLETE AI WORKFORCE
// ═══════════════════════════════════════════════════════════════════════════

export interface MyTeamEngine {
  // ═══════════════════════════════════════════════════════════════════════
  // PART 1: AI AGENTS (Your AI Workforce)
  // ═══════════════════════════════════════════════════════════════════════
  agents: AgentManagement;
  
  // ═══════════════════════════════════════════════════════════════════════
  // PART 2: SKILLS & TOOLS (Capabilities & Integrations)
  // ═══════════════════════════════════════════════════════════════════════
  skills: SkillsManagement;
  tools: ToolsManagement;
  
  // ═══════════════════════════════════════════════════════════════════════
  // PART 3: IA LABS (Innovation & Experimentation)
  // ═══════════════════════════════════════════════════════════════════════
  labs: IALabsEngine;
  
  // ═══════════════════════════════════════════════════════════════════════
  // ORCHESTRATION
  // ═══════════════════════════════════════════════════════════════════════
  orchestrator: TeamOrchestrator;
  
  // MARKETPLACE
  marketplace: TeamMarketplace;
  
  // ANALYTICS
  analytics: TeamAnalytics;
  
  // GOVERNANCE
  governance: TeamGovernance;
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: AI AGENTS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export interface AgentManagement {
  // System Agents (Always present)
  systemAgents: SystemAgent[];
  
  // User's Hired Agents
  hiredAgents: HiredAgent[];
  
  // Custom Agents (User created)
  customAgents: CustomAgent[];
  
  // Agent Templates
  templates: AgentTemplate[];
  
  // Agent Teams
  teams: AgentTeam[];
  
  // Active Sessions
  activeSessions: AgentSession[];
  
  // History
  history: AgentHistory[];
  
  // Settings
  settings: AgentSettings;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM AGENTS — Always Present (Nova is SYSTEM, not hired)
// ─────────────────────────────────────────────────────────────────────────────

export interface SystemAgent {
  id: string;
  name: string;
  type: 'nova' | 'guardian' | 'archivist' | 'sentinel';
  
  // Nova is THE system intelligence
  isNova: boolean;
  
  // Role
  role: SystemAgentRole;
  
  // Capabilities
  capabilities: string[];
  
  // Always active
  status: 'active';
  
  // Cannot be disabled
  canBeDisabled: false;
  
  // Settings
  settings: SystemAgentSettings;
}

export type SystemAgentRole = 
  | 'system_intelligence'  // Nova
  | 'security_guardian'    // Guardian
  | 'memory_keeper'        // Archivist
  | 'governance_enforcer'; // Sentinel

export interface SystemAgentSettings {
  // Nova settings
  personality?: 'professional' | 'friendly' | 'concise' | 'detailed';
  proactivity?: 'low' | 'medium' | 'high';
  
  // Communication
  notifyOnImportant: boolean;
  dailyBriefing: boolean;
  briefingTime?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HIRED AGENTS — User's AI Workforce
// ─────────────────────────────────────────────────────────────────────────────

export interface HiredAgent {
  id: string;
  name: string;
  
  // Type
  type: AgentType;
  specialization: AgentSpecialization;
  
  // Avatar & Identity
  avatar: string;
  color: string;
  personality: AgentPersonality;
  
  // Capabilities
  capabilities: AgentCapability[];
  skills: string[];
  tools: string[];
  
  // Access
  sphereAccess: SphereAccess[];
  dataAccess: DataAccessLevel;
  
  // Performance
  level: number;
  experience: number;
  performance: AgentPerformance;
  
  // Cost
  tokenCost: TokenCost;
  
  // Status
  status: AgentStatus;
  
  // Constraints
  constraints: AgentConstraints;
  
  // History
  hiredAt: string;
  lastActive: string;
  totalTasks: number;
  totalTokensUsed: number;
}

export type AgentType = 
  | 'orchestrator'      // User Orchestrator - main assistant
  | 'specialist'        // Domain expert
  | 'analyst'          // Data analysis
  | 'creator'          // Content creation
  | 'automator'        // Task automation
  | 'researcher'       // Research & discovery
  | 'communicator'     // Communication & outreach
  | 'guardian';        // Security & compliance

export type AgentSpecialization = 
  // Business
  | 'sales' | 'marketing' | 'finance' | 'legal' | 'hr' | 'operations'
  
  // Technical
  | 'developer' | 'data_scientist' | 'devops' | 'security' | 'architect'
  
  // Creative
  | 'designer' | 'writer' | 'video' | 'audio' | 'photographer'
  
  // Research
  | 'market_research' | 'academic' | 'competitive' | 'trend'
  
  // Communication
  | 'social_media' | 'email' | 'customer_service' | 'pr'
  
  // Personal
  | 'assistant' | 'scheduler' | 'health' | 'travel' | 'finance_personal'
  
  // General
  | 'generalist';

export interface AgentPersonality {
  tone: 'formal' | 'casual' | 'friendly' | 'professional';
  verbosity: 'concise' | 'balanced' | 'detailed';
  proactivity: 'reactive' | 'balanced' | 'proactive';
  creativity: 'conservative' | 'balanced' | 'creative';
}

export interface AgentCapability {
  id: string;
  name: string;
  category: CapabilityCategory;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  
  // What it can do
  actions: string[];
  
  // Requirements
  requiredTools: string[];
  requiredPermissions: string[];
  
  // Cost
  tokenCostMultiplier: number;
}

export type CapabilityCategory = 
  | 'research'
  | 'analysis'
  | 'creation'
  | 'communication'
  | 'automation'
  | 'integration'
  | 'decision'
  | 'planning';

export interface SphereAccess {
  sphereId: string;
  sphereName: string;
  level: 'none' | 'read' | 'write' | 'full';
  bureauAccess: {
    bureauId: string;
    level: 'none' | 'read' | 'write' | 'full';
  }[];
}

export type DataAccessLevel = 
  | 'none'
  | 'anonymized'
  | 'limited'
  | 'standard'
  | 'full'
  | 'admin';

export interface AgentPerformance {
  // Quality
  successRate: number;
  avgQualityScore: number;
  
  // Speed
  avgResponseTime: number;
  avgTaskDuration: number;
  
  // Efficiency
  tokenEfficiency: number;
  taskCompletionRate: number;
  
  // User satisfaction
  userRating: number;
  feedbackScore: number;
  
  // History
  performanceHistory: PerformanceEntry[];
}

export interface PerformanceEntry {
  date: string;
  tasks: number;
  successRate: number;
  avgQuality: number;
  tokensUsed: number;
}

export interface TokenCost {
  // Base cost
  baseCostPerTask: number;
  baseCostPerHour: number;
  
  // Current
  currentBudget: number;
  usedThisMonth: number;
  
  // Limits
  dailyLimit?: number;
  monthlyLimit?: number;
  taskLimit?: number;
  
  // Pricing
  pricingTier: 'basic' | 'standard' | 'premium' | 'enterprise';
}

export type AgentStatus = 
  | 'active'
  | 'idle'
  | 'working'
  | 'paused'
  | 'sleeping'
  | 'error'
  | 'disabled';

export interface AgentConstraints {
  // Execution
  maxConcurrentTasks: number;
  maxTaskDuration: number;
  requireApproval: boolean;
  approvalThreshold: number;
  
  // Data
  canAccessSensitive: boolean;
  canExportData: boolean;
  canDeleteData: boolean;
  
  // Actions
  canSendEmails: boolean;
  canMakePayments: boolean;
  canModifySettings: boolean;
  
  // Time
  workingHours?: { start: string; end: string };
  timezone: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM AGENTS — User Created
// ─────────────────────────────────────────────────────────────────────────────

export interface CustomAgent extends HiredAgent {
  // Custom configuration
  isCustom: true;
  
  // Base template
  baseTemplateId?: string;
  
  // Custom instructions
  systemPrompt: string;
  instructions: string[];
  
  // Custom training
  trainingData: TrainingData[];
  
  // Custom tools
  customTools: CustomTool[];
  
  // Workflows
  workflows: AgentWorkflow[];
}

export interface TrainingData {
  id: string;
  type: 'example' | 'document' | 'conversation' | 'feedback';
  content: string;
  metadata: Record<string, any>;
  addedAt: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  enabled: boolean;
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'event' | 'condition';
  config: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  action: string;
  params: Record<string, any>;
  conditions?: Record<string, any>;
  onSuccess?: string;
  onFailure?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: AgentTemplateCategory;
  
  // Preview
  avatar: string;
  color: string;
  
  // Configuration
  type: AgentType;
  specialization: AgentSpecialization;
  capabilities: string[];
  personality: AgentPersonality;
  
  // Requirements
  requiredSkills: string[];
  requiredTools: string[];
  
  // Pricing
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  tokenCost: number;
  
  // Stats
  popularity: number;
  rating: number;
  reviewCount: number;
  
  // Source
  source: 'system' | 'marketplace' | 'custom';
  createdBy?: string;
}

export type AgentTemplateCategory = 
  | 'business'
  | 'technical'
  | 'creative'
  | 'research'
  | 'communication'
  | 'personal'
  | 'automation'
  | 'industry_specific';

// ─────────────────────────────────────────────────────────────────────────────
// AGENT TEAMS
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentTeam {
  id: string;
  name: string;
  description?: string;
  
  // Members
  members: AgentTeamMember[];
  
  // Purpose
  purpose: string;
  specialization: string;
  
  // Collaboration
  collaborationMode: 'sequential' | 'parallel' | 'hierarchical';
  leadAgent?: string;
  
  // Tasks
  activeTasks: string[];
  completedTasks: number;
  
  // Performance
  teamPerformance: AgentPerformance;
  
  createdAt: string;
}

export interface AgentTeamMember {
  agentId: string;
  role: 'lead' | 'member' | 'specialist' | 'reviewer';
  responsibilities: string[];
  joinedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT SESSIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentSession {
  id: string;
  agentId: string;
  
  // Task
  taskId?: string;
  taskType: string;
  taskDescription: string;
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'failed';
  
  // Progress
  progress: number;
  currentStep?: string;
  
  // Resources
  tokensUsed: number;
  estimatedTokens: number;
  
  // Timing
  startedAt: string;
  estimatedCompletion?: string;
  
  // Context
  sphereId: string;
  bureauId?: string;
  
  // Messages
  messages: SessionMessage[];
}

export interface SessionMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: SKILLS & TOOLS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export interface SkillsManagement {
  // User's skills
  userSkills: UserSkill[];
  
  // Skill assessments
  assessments: SkillAssessment[];
  
  // Learning paths
  learningPaths: LearningPath[];
  
  // Certifications
  certifications: Certification[];
  
  // Skill goals
  goals: SkillGoal[];
  
  // Skills library
  library: SkillLibrary;
}

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  
  // Level
  level: SkillLevel;
  experience: number;
  
  // Assessment
  lastAssessed?: string;
  assessmentScore?: number;
  
  // Usage
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  lastUsed?: string;
  
  // Related
  relatedTools: string[];
  relatedAgents: string[];
  
  // Learning
  isLearning: boolean;
  learningProgress?: number;
  
  // Validation
  endorsements: number;
  certifications: string[];
}

export type SkillCategory = 
  | 'technical'
  | 'creative'
  | 'business'
  | 'communication'
  | 'leadership'
  | 'analytical'
  | 'organizational'
  | 'interpersonal';

export type SkillLevel = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master';

export interface SkillAssessment {
  id: string;
  skillId: string;
  
  // Assessment
  type: 'self' | 'ai' | 'test' | 'project' | 'peer';
  score: number;
  maxScore: number;
  
  // Results
  levelBefore: SkillLevel;
  levelAfter: SkillLevel;
  
  // Feedback
  feedback: string[];
  recommendations: string[];
  
  assessedAt: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  
  // Target
  targetSkills: string[];
  targetLevel: SkillLevel;
  
  // Content
  modules: LearningModule[];
  totalDuration: number;
  
  // Progress
  progress: number;
  currentModule: number;
  startedAt?: string;
  estimatedCompletion?: string;
  
  // Source
  source: 'system' | 'custom' | 'marketplace';
}

export interface LearningModule {
  id: string;
  name: string;
  type: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
  duration: number;
  completed: boolean;
  score?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  skillIds: string[];
  
  // Status
  status: 'earned' | 'in_progress' | 'expired';
  earnedAt?: string;
  expiresAt?: string;
  
  // Verification
  credentialId?: string;
  verificationUrl?: string;
}

export interface SkillGoal {
  id: string;
  skillId: string;
  targetLevel: SkillLevel;
  deadline: string;
  
  // Progress
  currentProgress: number;
  milestones: SkillMilestone[];
  
  // Status
  status: 'active' | 'completed' | 'abandoned';
}

export interface SkillMilestone {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
}

export interface SkillLibrary {
  categories: SkillCategory[];
  skills: SkillDefinition[];
  assessmentTemplates: AssessmentTemplate[];
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  levels: {
    level: SkillLevel;
    description: string;
    requirements: string[];
  }[];
  relatedSkills: string[];
}

export interface AssessmentTemplate {
  id: string;
  skillId: string;
  type: string;
  questions: AssessmentQuestion[];
  passingScore: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'practical' | 'open';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolsManagement {
  // Connected tools
  connectedTools: ConnectedTool[];
  
  // Tool categories
  categories: ToolCategory[];
  
  // Integrations
  integrations: ToolIntegration[];
  
  // Custom tools
  customTools: CustomTool[];
  
  // Tool usage
  usage: ToolUsage;
  
  // Marketplace
  marketplace: ToolMarketplace;
}

export interface ConnectedTool {
  id: string;
  name: string;
  slug: string;
  category: ToolCategoryType;
  
  // Connection
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  connectedAt?: string;
  lastUsed?: string;
  
  // Authentication
  authType: 'api_key' | 'oauth' | 'basic' | 'custom';
  authStatus: 'valid' | 'expired' | 'invalid';
  
  // Capabilities
  capabilities: ToolCapability[];
  
  // Agent access
  agentAccess: string[]; // Agent IDs that can use this tool
  
  // Usage
  usageStats: ToolUsageStats;
  
  // Settings
  settings: Record<string, any>;
}

export type ToolCategoryType = 
  | 'productivity'
  | 'communication'
  | 'development'
  | 'design'
  | 'marketing'
  | 'sales'
  | 'finance'
  | 'analytics'
  | 'ai_services'
  | 'storage'
  | 'automation'
  | 'custom';

export interface ToolCategory {
  id: string;
  name: string;
  slug: ToolCategoryType;
  icon: string;
  description: string;
  tools: string[];
}

export interface ToolCapability {
  id: string;
  name: string;
  action: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

export interface ToolUsageStats {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  errorCount: number;
  lastError?: string;
}

export interface ToolIntegration {
  id: string;
  name: string;
  sourceTool: string;
  targetTool: string;
  
  // Mapping
  dataMapping: DataMapping[];
  
  // Trigger
  trigger: IntegrationTrigger;
  
  // Status
  enabled: boolean;
  lastRun?: string;
  runCount: number;
  errorCount: number;
}

export interface DataMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

export interface IntegrationTrigger {
  type: 'event' | 'schedule' | 'manual' | 'condition';
  config: Record<string, any>;
}

export interface CustomTool {
  id: string;
  name: string;
  description: string;
  
  // Type
  type: 'api' | 'webhook' | 'script' | 'workflow';
  
  // Configuration
  config: CustomToolConfig;
  
  // Capabilities
  capabilities: ToolCapability[];
  
  // Testing
  testResults?: ToolTestResult[];
  
  // Usage
  usageStats: ToolUsageStats;
  
  createdAt: string;
  updatedAt: string;
}

export interface CustomToolConfig {
  // API
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  
  // Auth
  authType?: string;
  authConfig?: Record<string, any>;
  
  // Script
  script?: string;
  runtime?: string;
  
  // Input/Output
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

export interface ToolTestResult {
  id: string;
  input: Record<string, any>;
  output: Record<string, any>;
  success: boolean;
  duration: number;
  error?: string;
  testedAt: string;
}

export interface ToolUsage {
  // Overview
  totalCalls: number;
  totalTokens: number;
  
  // By tool
  byTool: { toolId: string; calls: number; tokens: number }[];
  
  // By agent
  byAgent: { agentId: string; calls: number; tokens: number }[];
  
  // Trends
  daily: { date: string; calls: number }[];
}

export interface ToolMarketplace {
  featured: MarketplaceTool[];
  categories: { category: string; count: number }[];
  search(query: string): Promise<MarketplaceTool[]>;
}

export interface MarketplaceTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategoryType;
  provider: string;
  
  // Pricing
  pricing: 'free' | 'freemium' | 'paid';
  price?: number;
  
  // Stats
  installs: number;
  rating: number;
  reviews: number;
  
  // Preview
  icon: string;
  screenshots: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: IA LABS — INNOVATION & EXPERIMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export interface IALabsEngine {
  // Experiments
  experiments: Experiment[];
  
  // Prototypes
  prototypes: Prototype[];
  
  // Research
  research: ResearchProject[];
  
  // Sandbox
  sandbox: SandboxEnvironment;
  
  // Model testing
  modelTesting: ModelTestingEngine;
  
  // Prompt engineering
  promptLab: PromptLab;
  
  // Fine-tuning
  fineTuning: FineTuningEngine;
  
  // Benchmarks
  benchmarks: BenchmarkEngine;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIMENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Experiment {
  id: string;
  name: string;
  description: string;
  
  // Type
  type: ExperimentType;
  
  // Hypothesis
  hypothesis: string;
  successCriteria: string[];
  
  // Variables
  variables: ExperimentVariable[];
  
  // Status
  status: 'draft' | 'running' | 'completed' | 'failed' | 'cancelled';
  
  // Results
  results?: ExperimentResults;
  
  // Timeline
  startedAt?: string;
  completedAt?: string;
  
  createdAt: string;
}

export type ExperimentType = 
  | 'a_b_test'
  | 'prompt_comparison'
  | 'model_comparison'
  | 'workflow_optimization'
  | 'custom';

export interface ExperimentVariable {
  name: string;
  type: 'independent' | 'dependent' | 'control';
  values: unknown[];
}

export interface ExperimentResults {
  winner?: string;
  metrics: Record<string, number>;
  statisticalSignificance: number;
  insights: string[];
  recommendations: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Prototype {
  id: string;
  name: string;
  description: string;
  
  // Type
  type: PrototypeType;
  
  // Components
  components: PrototypeComponent[];
  
  // Status
  status: 'ideation' | 'development' | 'testing' | 'review' | 'deployed' | 'archived';
  
  // Version
  version: string;
  versions: PrototypeVersion[];
  
  // Testing
  testResults: PrototypeTestResult[];
  
  // Deployment
  deployedTo?: string;
  deployedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export type PrototypeType = 
  | 'agent'
  | 'workflow'
  | 'tool'
  | 'integration'
  | 'feature'
  | 'ui_component';

export interface PrototypeComponent {
  id: string;
  type: string;
  config: Record<string, any>;
  connections: string[];
}

export interface PrototypeVersion {
  version: string;
  changes: string;
  createdAt: string;
}

export interface PrototypeTestResult {
  id: string;
  version: string;
  type: 'unit' | 'integration' | 'user' | 'performance';
  passed: boolean;
  metrics: Record<string, number>;
  feedback?: string;
  testedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SANDBOX ENVIRONMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface SandboxEnvironment {
  // Instances
  instances: SandboxInstance[];
  
  // Templates
  templates: SandboxTemplate[];
  
  // Resources
  resources: SandboxResources;
  
  // Actions
  createInstance(template: string): Promise<SandboxInstance>;
  destroyInstance(id: string): Promise<void>;
  resetInstance(id: string): Promise<void>;
}

export interface SandboxInstance {
  id: string;
  name: string;
  templateId: string;
  
  // Status
  status: 'creating' | 'running' | 'stopped' | 'error';
  
  // Resources
  allocatedResources: {
    tokens: number;
    storage: number;
    compute: number;
  };
  
  // Access
  accessUrl?: string;
  
  // Expiration
  expiresAt: string;
  
  createdAt: string;
}

export interface SandboxTemplate {
  id: string;
  name: string;
  description: string;
  
  // Configuration
  config: {
    models: string[];
    tools: string[];
    agents: string[];
    data: string[];
  };
  
  // Resources
  resourceRequirements: {
    tokens: number;
    storage: number;
  };
}

export interface SandboxResources {
  tokensRemaining: number;
  storageRemaining: number;
  activeInstances: number;
  maxInstances: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT LAB
// ─────────────────────────────────────────────────────────────────────────────

export interface PromptLab {
  // Prompts
  prompts: SavedPrompt[];
  
  // Templates
  templates: PromptTemplate[];
  
  // Testing
  testSuite: PromptTestSuite;
  
  // Optimization
  optimizer: PromptOptimizer;
  
  // Version control
  versions: PromptVersion[];
}

export interface SavedPrompt {
  id: string;
  name: string;
  description?: string;
  
  // Content
  systemPrompt?: string;
  userPrompt: string;
  
  // Variables
  variables: PromptVariable[];
  
  // Metadata
  model: string;
  temperature?: number;
  maxTokens?: number;
  
  // Testing
  testCases: PromptTestCase[];
  avgScore?: number;
  
  // Tags
  tags: string[];
  
  // Usage
  usageCount: number;
  lastUsed?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'json';
  description?: string;
  defaultValue?: unknown;
  options?: unknown[];
  required: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  
  // Content
  template: string;
  variables: PromptVariable[];
  
  // Best practices
  tips: string[];
  examples: string[];
}

export interface PromptTestSuite {
  tests: PromptTestCase[];
  run(promptId: string): Promise<PromptTestResults>;
}

export interface PromptTestCase {
  id: string;
  name: string;
  inputs: Record<string, any>;
  expectedOutput?: string;
  evaluationCriteria: EvaluationCriterion[];
}

export interface EvaluationCriterion {
  name: string;
  type: 'contains' | 'not_contains' | 'regex' | 'semantic' | 'length' | 'format';
  value: unknown;
  weight: number;
}

export interface PromptTestResults {
  promptId: string;
  overallScore: number;
  results: {
    testId: string;
    passed: boolean;
    score: number;
    output: string;
    feedback: string;
  }[];
  recommendations: string[];
}

export interface PromptOptimizer {
  optimize(promptId: string, criteria: string[]): Promise<OptimizationResult>;
  suggestions(promptId: string): Promise<PromptSuggestion[]>;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  scoreIncrease: number;
}

export interface PromptSuggestion {
  type: 'clarity' | 'specificity' | 'structure' | 'examples' | 'constraints';
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changes: string;
  score?: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODEL TESTING
// ─────────────────────────────────────────────────────────────────────────────

export interface ModelTestingEngine {
  // Available models
  models: AIModel[];
  
  // Comparisons
  comparisons: ModelComparison[];
  
  // Benchmarks
  benchmarks: ModelBenchmark[];
  
  // Actions
  compare(models: string[], testCases: TestCase[]): Promise<ComparisonResult>;
  benchmark(model: string, suite: string): Promise<BenchmarkResult>;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  
  // Capabilities
  capabilities: string[];
  maxTokens: number;
  supportedLanguages: string[];
  
  // Pricing
  inputCostPer1k: number;
  outputCostPer1k: number;
  
  // Status
  available: boolean;
  latency: number;
}

export interface ModelComparison {
  id: string;
  name: string;
  models: string[];
  testCases: TestCase[];
  results: ComparisonResult;
  createdAt: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  evaluationMethod: 'human' | 'ai' | 'regex' | 'semantic';
}

export interface ComparisonResult {
  winner: string;
  scores: Record<string, number>;
  details: {
    testId: string;
    modelId: string;
    output: string;
    score: number;
    latency: number;
    cost: number;
  }[];
}

export interface ModelBenchmark {
  id: string;
  modelId: string;
  suite: string;
  score: number;
  metrics: Record<string, number>;
  runAt: string;
}

export interface BenchmarkResult {
  modelId: string;
  suite: string;
  overallScore: number;
  metrics: {
    name: string;
    value: number;
    percentile: number;
  }[];
  comparison: {
    modelId: string;
    score: number;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// TEAM ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

export interface TeamOrchestrator {
  // Task assignment
  assignTask(task: Task, criteria?: AssignmentCriteria): Promise<Assignment>;
  
  // Team coordination
  coordinateTeam(teamId: string, objective: string): Promise<CoordinationPlan>;
  
  // Workflow execution
  executeWorkflow(workflowId: string, inputs: Record<string, any>): Promise<WorkflowExecution>;
  
  // Load balancing
  loadBalancing: LoadBalancer;
  
  // Monitoring
  monitoring: OrchestratorMonitoring;
}

export interface Task {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  requirements: string[];
  context: Record<string, any>;
}

export interface AssignmentCriteria {
  preferredAgents?: string[];
  requiredCapabilities?: string[];
  maxCost?: number;
  maxDuration?: number;
}

export interface Assignment {
  taskId: string;
  agentId: string;
  estimatedDuration: number;
  estimatedCost: number;
  confidence: number;
}

export interface CoordinationPlan {
  teamId: string;
  objective: string;
  phases: CoordinationPhase[];
  estimatedDuration: number;
  risks: string[];
}

export interface CoordinationPhase {
  name: string;
  agents: string[];
  tasks: string[];
  dependencies: string[];
  duration: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentStep: number;
  outputs: Record<string, any>;
  logs: WorkflowLog[];
}

export interface WorkflowLog {
  timestamp: string;
  step: string;
  agent: string;
  action: string;
  result: string;
}

export interface LoadBalancer {
  strategy: 'round_robin' | 'least_loaded' | 'cost_optimized' | 'performance_optimized';
  getAvailableAgent(requirements: string[]): Promise<string>;
  getLoadDistribution(): Record<string, number>;
}

export interface OrchestratorMonitoring {
  // Real-time
  activeWorkflows: number;
  activeTasks: number;
  queuedTasks: number;
  
  // Health
  agentHealth: Record<string, 'healthy' | 'degraded' | 'down'>;
  systemHealth: 'healthy' | 'degraded' | 'down';
  
  // Alerts
  alerts: OrchestratorAlert[];
}

export interface OrchestratorAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEAM ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

export interface TeamAnalytics {
  // Overview
  overview: AnalyticsOverview;
  
  // Agent performance
  agentPerformance: AgentPerformanceAnalytics;
  
  // Tool usage
  toolUsage: ToolUsageAnalytics;
  
  // Cost analysis
  costs: CostAnalytics;
  
  // Efficiency
  efficiency: EfficiencyAnalytics;
}

export interface AnalyticsOverview {
  // Period
  period: { start: string; end: string };
  
  // Summary
  totalTasks: number;
  completedTasks: number;
  successRate: number;
  
  // Tokens
  totalTokensUsed: number;
  tokenCost: number;
  
  // Time
  totalActiveTime: number;
  avgTaskDuration: number;
  
  // Trends
  trends: {
    tasks: number;
    change: number;
    direction: 'up' | 'down' | 'stable';
  };
}

export interface AgentPerformanceAnalytics {
  // By agent
  byAgent: {
    agentId: string;
    tasks: number;
    successRate: number;
    avgQuality: number;
    avgDuration: number;
    tokensUsed: number;
    efficiency: number;
  }[];
  
  // Top performers
  topPerformers: string[];
  
  // Needs improvement
  needsImprovement: string[];
  
  // Recommendations
  recommendations: string[];
}

export interface ToolUsageAnalytics {
  // By tool
  byTool: {
    toolId: string;
    calls: number;
    successRate: number;
    avgLatency: number;
    errors: number;
  }[];
  
  // Most used
  mostUsed: string[];
  
  // Unused
  unused: string[];
  
  // Recommendations
  recommendations: string[];
}

export interface CostAnalytics {
  // Total
  totalCost: number;
  budget: number;
  remaining: number;
  
  // Breakdown
  byAgent: Record<string, number>;
  byTool: Record<string, number>;
  byTask: Record<string, number>;
  
  // Trends
  daily: { date: string; cost: number }[];
  
  // Projections
  projectedMonthly: number;
  
  // Optimization
  savingsOpportunities: {
    type: string;
    description: string;
    potentialSavings: number;
  }[];
}

export interface EfficiencyAnalytics {
  // Overall
  overallEfficiency: number;
  
  // By dimension
  tokenEfficiency: number;
  timeEfficiency: number;
  costEfficiency: number;
  
  // Bottlenecks
  bottlenecks: {
    type: string;
    description: string;
    impact: number;
    solution: string;
  }[];
  
  // Improvements
  improvements: {
    metric: string;
    before: number;
    after: number;
    change: number;
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// TEAM GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════

export interface TeamGovernance {
  // Policies
  policies: GovernancePolicy[];
  
  // Approvals
  approvals: ApprovalWorkflow[];
  
  // Audit
  audit: AuditLog;
  
  // Compliance
  compliance: ComplianceEngine;
  
  // Limits
  limits: GovernanceLimits;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  
  // Rules
  rules: PolicyRule[];
  
  // Enforcement
  enforcement: 'warn' | 'block' | 'approve';
  
  // Scope
  scope: {
    agents: string[];
    tools: string[];
    actions: string[];
  };
  
  enabled: boolean;
}

export type PolicyType = 
  | 'data_access'
  | 'action_limit'
  | 'cost_control'
  | 'time_restriction'
  | 'content_filter'
  | 'approval_required';

export interface PolicyRule {
  condition: string;
  action: 'allow' | 'deny' | 'require_approval';
  message: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  
  // Trigger
  trigger: ApprovalTrigger;
  
  // Approvers
  approvers: string[];
  requiredApprovals: number;
  
  // Timeout
  timeout: number;
  timeoutAction: 'approve' | 'deny' | 'escalate';
}

export interface ApprovalTrigger {
  type: 'cost_threshold' | 'action_type' | 'data_access' | 'external_action';
  threshold?: number;
  actions?: string[];
}

export interface AuditLog {
  entries: AuditEntry[];
  search(filters: AuditFilters): Promise<AuditEntry[]>;
  export(format: 'csv' | 'json'): Promise<string>;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: { type: 'user' | 'agent' | 'system'; id: string };
  action: string;
  resource: string;
  details: Record<string, any>;
  result: 'success' | 'failure' | 'blocked';
  policyViolations: string[];
}

export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  actors?: string[];
  actions?: string[];
  results?: string[];
}

export interface ComplianceEngine {
  // Standards
  standards: ComplianceStandard[];
  
  // Status
  status: ComplianceStatus;
  
  // Reports
  generateReport(standard: string): Promise<ComplianceReport>;
}

export interface ComplianceStandard {
  id: string;
  name: string;
  requirements: ComplianceRequirement[];
  lastAssessed: string;
  status: 'compliant' | 'non_compliant' | 'partial';
}

export interface ComplianceRequirement {
  id: string;
  description: string;
  status: 'met' | 'not_met' | 'partial' | 'not_applicable';
  evidence: string[];
}

export interface ComplianceStatus {
  overall: 'compliant' | 'non_compliant' | 'at_risk';
  byStandard: Record<string, 'compliant' | 'non_compliant' | 'partial'>;
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  standardId: string;
  requirementId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
}

export interface ComplianceReport {
  standard: string;
  generatedAt: string;
  status: string;
  requirements: ComplianceRequirement[];
  issues: ComplianceIssue[];
  recommendations: string[];
}

export interface GovernanceLimits {
  // Tokens
  dailyTokenLimit: number;
  monthlyTokenLimit: number;
  
  // Actions
  maxConcurrentTasks: number;
  maxDailyTasks: number;
  
  // Data
  maxDataExport: number;
  
  // Costs
  dailyCostLimit: number;
  monthlyCostLimit: number;
  
  // Current usage
  currentUsage: {
    dailyTokens: number;
    monthlyTokens: number;
    dailyCost: number;
    monthlyCost: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const SYSTEM_AGENTS = {
  NOVA: {
    id: 'nova',
    name: 'Nova',
    type: 'nova',
    role: 'system_intelligence',
    isSystemAgent: true,
    canBeHired: false,
    description: 'CHE·NU System Intelligence - Always present, guides and governs'
  },
  GUARDIAN: {
    id: 'guardian',
    name: 'Guardian',
    type: 'guardian',
    role: 'security_guardian',
    isSystemAgent: true,
    description: 'Security and access control'
  },
  ARCHIVIST: {
    id: 'archivist',
    name: 'Archivist',
    type: 'archivist',
    role: 'memory_keeper',
    isSystemAgent: true,
    description: 'Memory and database management'
  }
};

export default {
  description: 'MY TEAM = AI Agents + Skills & Tools + IA Labs — Your Complete AI Workforce',
  
  includes: [
    'AI Agents (Nova system + Hired agents + Custom agents)',
    'Skills Management (Assessment + Learning + Certification)',
    'Tools Integration (Connected + Custom + Marketplace)',
    'IA Labs (Experiments + Prototypes + Sandbox + Prompt Lab)'
  ],
  
  keyPrinciples: [
    'Nova is SYSTEM intelligence, NOT a hired agent',
    'User Orchestrator is hired by user, executes tasks',
    'All agents have costs, scopes, and governance',
    'Skills & Tools are INSIDE My Team, not separate spheres',
    'IA Labs is for innovation and experimentation'
  ],
  
  advantages: {
    uniqueFeatures: [
      'Complete AI workforce management',
      'Nova system intelligence always present',
      'Custom agent creation',
      'Skills tracking and development',
      '500+ tool integrations',
      'Prompt engineering lab',
      'Model testing and comparison',
      'Full governance and audit',
    ],
  },
};
