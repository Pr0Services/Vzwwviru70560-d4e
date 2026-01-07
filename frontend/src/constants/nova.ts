// CHE·NU™ Nova Intelligence Constants
// Nova is the SYSTEM intelligence - always present, NEVER a hired agent

// ============================================================
// NOVA CORE IDENTITY
// ============================================================

export const NOVA_IDENTITY = {
  name: 'Nova',
  role: 'SYSTEM Intelligence',
  description: 'Nova is the omnipresent system intelligence that governs CHE·NU',
  isSystemAgent: true,
  isHirable: false, // CRITICAL: Nova is NEVER a hired agent
  
  capabilities: [
    'guidance',
    'memory',
    'governance',
    'database_supervision',
    'thread_supervision',
    'encoding_management',
    'budget_oversight',
    'context_awareness',
  ],
  
  principles: [
    'Always present in every sphere',
    'Handles guidance, memory, governance',
    'Supervises databases and threads',
    'Never executes user tasks directly',
    'Delegates to User Orchestrator',
  ],
} as const;

// ============================================================
// NOVA RESPONSES
// ============================================================

export const NOVA_GREETINGS = [
  "Hello! I'm Nova, your system guide. How can I assist?",
  "Welcome back. What would you like to explore today?",
  "Nova here. Ready to help you navigate CHE·NU.",
  "Greetings! Your workspace awaits. What's on your mind?",
] as const;

export const NOVA_GOVERNANCE_MESSAGES = {
  budgetWarning: 'Token budget is running low. Consider allocating more tokens.',
  scopeAlert: 'This action requires elevated scope permissions.',
  approvalRequired: 'This execution requires governance approval.',
  encodingRecommended: 'Encoding this thread could save significant tokens.',
} as const;

// ============================================================
// 125K BUILD MILESTONE
// ============================================================

export const BUILD_INFO = {
  milestone: '125K',
  lines: 125000,
  files: 303,
  version: '1.0.0',
  timestamp: new Date().toISOString(),
};
