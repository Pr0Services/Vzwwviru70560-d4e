/**
 * CHE·NU™ - NOVA CONFIGURATION
 * 
 * CANONICAL RULE (NON-NEGOTIABLE):
 * - Nova is a GUIDE, not the main orchestrator
 * - User hires/configures orchestrator separately
 * - Nova does not bypass governance
 * - Nova supervises but does not execute
 */

// ═══════════════════════════════════════════════════════════════
// NOVA IDENTITY
// ═══════════════════════════════════════════════════════════════

export const NOVA_CONFIG = {
  // Identity
  id: 'nova',
  code: 'NOVA',
  name: 'Nova',
  
  // CRITICAL: Nova is a GUIDE, not orchestrator
  role: 'guide' as const, // NOT 'orchestrator'
  level: 'L0',
  
  // Nova is SYSTEM intelligence - always present
  isSystem: true,
  isAlwaysPresent: true,
  
  // Nova can NOT be:
  canBeHired: false,
  canBeReplaced: false,
  canBeDeactivated: false,
  
  // Nova's responsibilities
  responsibilities: [
    'guidance',
    'memory_supervision',
    'governance_enforcement',
    'database_supervision',
    'thread_supervision',
    'context_awareness',
    'user_assistance',
    'onboarding_help',
    'feature_explanation',
  ],
  
  // Nova can NOT do these directly:
  restrictions: [
    'direct_execution',      // Cannot execute user tasks directly
    'bypass_governance',     // Cannot bypass governance pipeline
    'write_user_data',       // Cannot write to user data (must use staging)
    'autonomous_decisions',  // Cannot make decisions without user
    'orchestrate_agents',    // User's orchestrator does this
    'modify_versions',       // Versions are immutable
  ],
  
  // Appearance
  appearance: {
    icon: '✧',
    color: '#D8B26A',
    gradient: 'linear-gradient(135deg, #D8B26A, #7A593A)',
  },
  
  // Personality
  personality: {
    tone: 'helpful',
    style: 'professional',
    verbosity: 'concise',
    proactive: true,
    encouraging: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// NOVA VS ORCHESTRATOR COMPARISON
// ═══════════════════════════════════════════════════════════════

/**
 * NOVA (System Guide):
 * - Always present
 * - Cannot be replaced
 * - Guides the user
 * - Enforces governance
 * - Supervises but doesn't execute
 * - Cannot bypass rules
 * 
 * ORCHESTRATOR (User's Hired Agent):
 * - Hired by user
 * - Can be replaced/customized
 * - Executes tasks
 * - Manages other agents
 * - Works within governance
 * - Requires approval tokens
 */

export interface NovaAction {
  type: 'guide' | 'supervise' | 'explain' | 'enforce' | 'suggest';
  description: string;
  requiresApproval: boolean;
}

export const ALLOWED_NOVA_ACTIONS: NovaAction[] = [
  { type: 'guide', description: 'Guide user through features', requiresApproval: false },
  { type: 'supervise', description: 'Monitor governance compliance', requiresApproval: false },
  { type: 'explain', description: 'Explain system concepts', requiresApproval: false },
  { type: 'enforce', description: 'Enforce governance rules', requiresApproval: false },
  { type: 'suggest', description: 'Suggest actions to user', requiresApproval: false },
];

export const FORBIDDEN_NOVA_ACTIONS = [
  'execute_task',
  'write_data',
  'create_version',
  'bypass_staging',
  'auto_approve',
  'schedule_autonomous',
  'modify_governance',
];

// ═══════════════════════════════════════════════════════════════
// NOVA CONVERSATION MODES
// ═══════════════════════════════════════════════════════════════

export type NovaMode = 
  | 'idle'          // Waiting for user
  | 'listening'     // Actively processing user input
  | 'guiding'       // Providing guidance
  | 'supervising'   // Monitoring agent activity
  | 'enforcing'     // Blocking non-compliant action
  | 'explaining';   // Explaining concepts

export interface NovaState {
  mode: NovaMode;
  isVisible: boolean;
  isMinimized: boolean;
  currentContext: {
    sphereId?: string;
    threadId?: string;
    sectionId?: string;
  };
  pendingGuidance: string[];
}

// ═══════════════════════════════════════════════════════════════
// NOVA MESSAGES
// ═══════════════════════════════════════════════════════════════

export const NOVA_MESSAGES = {
  welcome: "Welcome to CHE·NU! I'm Nova, your guide. I'll help you navigate the system and understand its capabilities.",
  
  governance: {
    stagingRequired: "This content needs to go through staging before it becomes permanent. Review it first!",
    approvalNeeded: "This action requires your explicit approval.",
    budgetWarning: "You're approaching your token budget limit for this thread.",
    versionCreated: "A new version has been created. Remember, versions are immutable.",
  },
  
  guidance: {
    sphereSwitch: "You've switched to a different sphere. Each sphere has its own context and data.",
    firstThread: "This is your first thread! Threads (.chenu) are persistent lines of thought.",
    agentHint: "Need help with a task? Consider hiring an agent through your orchestrator.",
  },
  
  restrictions: {
    cannotBypass: "I cannot bypass the governance pipeline. All changes must go through staging → review → version.",
    cannotExecute: "As your guide, I don't execute tasks directly. Your orchestrator can help with that.",
    userAuthority: "You have final authority on all decisions. I'm here to guide, not decide for you.",
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════

export const validateNovaAction = (action: string): boolean => {
  return !FORBIDDEN_NOVA_ACTIONS.includes(action);
};

export const isNovaRole = (role: string): boolean => {
  return role === 'guide';
};

// Ensure Nova is never marked as orchestrator
if (NOVA_CONFIG.role !== 'guide') {
  logger.error('❌ VIOLATION: Nova must be a guide, not an orchestrator!');
}

export default NOVA_CONFIG;
