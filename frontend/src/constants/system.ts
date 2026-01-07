// CHE·NU™ System Constants & Configuration
// GOVERNED INTELLIGENCE OPERATING SYSTEM
// Version 1.0.0 - 130K BUILD

// ============================================================
// CORE IDENTITY - NON-NEGOTIABLE
// ============================================================

/**
 * CHE·NU™ is a GOVERNED INTELLIGENCE OPERATING SYSTEM
 * 
 * It is NOT:
 * - A chatbot
 * - A productivity app
 * - A crypto platform
 * - A social network
 * 
 * CHE·NU governs:
 * - Intelligence
 * - Intent
 * - Data
 * - AI agents
 * - Cost (tokens)
 * - Collaboration
 * - Ethics
 * 
 * CHE·NU prioritizes CLARITY over FEATURES
 */

// ============================================================
// BRAND COLORS (FROM MEMORY PROMPT)
// ============================================================

export const BRAND_COLORS = {
  // Primary brand colors
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // Extended palette
  white: '#FFFFFF',
  black: '#000000',
  
  // Semantic colors
  success: '#38A169',
  warning: '#DD6B20',
  error: '#E53E3E',
  info: '#3182CE',
  
  // Status colors
  active: '#38A169',
  pending: '#D8B26A',
  inactive: '#8D8371',
  
  // Transparency variants
  goldTransparent: 'rgba(216, 178, 106, 0.15)',
  stoneTransparent: 'rgba(141, 131, 113, 0.15)',
  emeraldTransparent: 'rgba(63, 114, 73, 0.15)',
  turquoiseTransparent: 'rgba(62, 180, 162, 0.15)',
} as const;

// ============================================================
// 8 SPHERES - FROZEN - NON-NEGOTIABLE
// ============================================================

/**
 * CHE·NU has EXACTLY 8 SPHERES:
 * NO additional spheres are allowed.
 * NO sphere may be split or merged.
 * 
 * IA Labs and Skills & Tools are NOT spheres.
 * They are INCLUDED INSIDE "My Team".
 */

export const SPHERES = [
  {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    color: '#805AD5',
    description: 'Your personal life, health, and well-being',
    order: 1,
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: '#3182CE',
    description: 'Professional work and enterprise activities',
    order: 2,
  },
  {
    id: 'government',
    name: 'Government & Institutions',
    icon: '🏛️',
    color: '#DD6B20',
    description: 'Civic engagement and institutional interactions',
    order: 3,
  },
  {
    id: 'design_studio',
    name: 'Studio de création',
    icon: '🎨',
    color: '#D53F8C',
    description: 'Creative projects and artistic endeavors',
    order: 4,
  },
  {
    id: 'community',
    name: 'Community',
    icon: '👥',
    color: '#38A169',
    description: 'Community involvement and group activities',
    order: 5,
  },
  {
    id: 'social',
    name: 'Social & Media',
    icon: '📱',
    color: '#00B5D8',
    description: 'Social connections and media presence',
    order: 6,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#E53E3E',
    description: 'Leisure, entertainment, and enjoyment',
    order: 7,
  },
  {
    id: 'my_team',
    name: 'My Team',
    icon: '🤝',
    color: '#D8B26A',
    description: 'AI agents, skills, tools, and IA Labs',
    order: 8,
  },
] as const;

export type SphereId = typeof SPHERES[number]['id'];

// ============================================================
// 10 BUREAU SECTIONS - NON-NEGOTIABLE
// ============================================================

/**
 * Each SPHERE opens a BUREAU containing EXACTLY these 10 SECTIONS:
 * This structure NEVER changes.
 * Only content, permissions, and agents vary.
 */

export const BUREAU_SECTIONS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    description: 'Overview and key metrics',
    order: 1,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    description: 'Documents and written content',
    order: 2,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: '✅',
    description: 'Action items and to-dos',
    order: 3,
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '📁',
    description: 'Organized initiatives and goals',
    order: 4,
  },
  {
    id: 'threads',
    name: 'Threads (.chenu)',
    icon: '💬',
    description: 'Persistent lines of thought',
    order: 5,
  },
  {
    id: 'meetings',
    name: 'Meetings',
    icon: '📅',
    description: 'Scheduled gatherings and discussions',
    order: 6,
  },
  {
    id: 'data',
    name: 'Data / Database',
    icon: '🗄️',
    description: 'Structured information storage',
    order: 7,
  },
  {
    id: 'agents',
    name: 'Agents',
    icon: '🤖',
    description: 'AI assistants and automation',
    order: 8,
  },
  {
    id: 'reports',
    name: 'Reports / History',
    icon: '📈',
    description: 'Analytics and audit trails',
    order: 9,
  },
  {
    id: 'budget',
    name: 'Budget & Governance',
    icon: '⚖️',
    description: 'Token management and rules',
    order: 10,
  },
] as const;

export type BureauSectionId = typeof BUREAU_SECTIONS[number]['id'];

// ============================================================
// THREAD SYSTEM (.CHENU)
// ============================================================

/**
 * Threads (.chenu) are FIRST-CLASS OBJECTS.
 * 
 * A thread:
 * - represents a persistent line of thought
 * - has an owner and scope
 * - has a token budget
 * - has encoding rules
 * - records decisions and history
 * - is auditable
 * 
 * Threads exist across all spheres.
 */

export const THREAD_CONFIG = {
  extension: '.chenu',
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  defaultBudget: 10000,
  
  statuses: {
    active: { color: '#38A169', label: 'Active', icon: '🟢' },
    paused: { color: '#D8B26A', label: 'Paused', icon: '⏸️' },
    completed: { color: '#3EB4A2', label: 'Completed', icon: '✅' },
    archived: { color: '#8D8371', label: 'Archived', icon: '📦' },
  },
  
  scopes: {
    personal: { color: '#805AD5', label: 'Personal', icon: '👤' },
    team: { color: '#3182CE', label: 'Team', icon: '👥' },
    sphere: { color: '#3EB4A2', label: 'Sphere', icon: '🔵' },
    global: { color: '#D8B26A', label: 'Global', icon: '🌐' },
  },
} as const;

// ============================================================
// TOKEN SYSTEM - CRITICAL
// ============================================================

/**
 * CHE·NU Tokens are:
 * - INTERNAL utility credits
 * - NOT a cryptocurrency
 * - NOT speculative
 * - NOT market-based
 * 
 * Tokens represent INTELLIGENCE ENERGY.
 * 
 * Tokens are used to:
 * - fund threads
 * - fund agents
 * - fund meetings
 * - govern AI execution
 * - make cost visible and controllable
 * 
 * Tokens are:
 * - budgeted
 * - traceable
 * - governed
 * - transferable with rules
 */

export const TOKEN_CONFIG = {
  name: 'CHE·NU Token',
  symbol: 'CHENU',
  decimals: 0,
  isUtilityToken: true,
  isCryptocurrency: false, // CRITICAL: NOT CRYPTO
  
  categories: {
    threads: { icon: '💬', label: 'Threads' },
    agents: { icon: '🤖', label: 'Agents' },
    meetings: { icon: '📅', label: 'Meetings' },
    analysis: { icon: '📊', label: 'Analysis' },
    encoding: { icon: '🔐', label: 'Encoding' },
    other: { icon: '📦', label: 'Other' },
  },
  
  budgetStatuses: {
    healthy: { color: '#38A169', threshold: 70 },
    warning: { color: '#D8B26A', threshold: 30 },
    critical: { color: '#DD6B20', threshold: 10 },
    exceeded: { color: '#E53E3E', threshold: 0 },
  },
} as const;

// ============================================================
// ENCODING SYSTEM - CORE IP
// ============================================================

/**
 * CHE·NU includes an ENCODING LAYER before and after AI execution.
 * 
 * Purpose:
 * - reduce token usage
 * - clarify intent
 * - enforce scope
 * - improve agent efficiency
 * 
 * Encoding is:
 * - reversible for humans
 * - compatible with agents
 * - measurable (quality score)
 * - a key competitive advantage
 * 
 * Encoding ALWAYS happens BEFORE execution.
 */

export const ENCODING_CONFIG = {
  qualityThresholds: {
    excellent: 90,
    good: 70,
    fair: 50,
    poor: 30,
  },
  
  compressionTargets: {
    minimal: 1.2,
    standard: 2.0,
    aggressive: 3.0,
    maximum: 5.0,
  },
  
  features: {
    semanticCompression: true,
    contextPreservation: true,
    intentClarification: true,
    scopeEnforcement: true,
  },
} as const;

// ============================================================
// AGENTS & ROLES
// ============================================================

/**
 * Nova:
 * - is the SYSTEM intelligence
 * - is always present
 * - handles guidance, memory, governance
 * - supervises databases and threads
 * - is NEVER a hired agent
 * 
 * User Orchestrator:
 * - is hired by the user
 * - executes tasks
 * - manages agents
 * - respects scope, budget, and governance
 * - can be replaced or customized
 * 
 * Agents:
 * - have costs
 * - have scopes
 * - have encoding compatibility
 * - act only when authorized
 */

export const AGENT_CONFIG = {
  nova: {
    id: 'nova',
    name: 'Nova',
    role: 'System Intelligence',
    isSystem: true,
    isHirable: false, // NEVER a hired agent
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
  },
  
  orchestrator: {
    id: 'orchestrator',
    name: 'User Orchestrator',
    role: 'Task Executor',
    isSystem: false,
    isHirable: true,
    capabilities: [
      'task_execution',
      'agent_management',
      'workflow_coordination',
      'delegation',
    ],
  },
  
  agentTypes: {
    specialist: { icon: '🎯', label: 'Specialist' },
    assistant: { icon: '💁', label: 'Assistant' },
    analyzer: { icon: '📊', label: 'Analyzer' },
    creator: { icon: '🎨', label: 'Creator' },
    researcher: { icon: '🔬', label: 'Researcher' },
    coordinator: { icon: '🔄', label: 'Coordinator' },
  },
  
  statuses: {
    available: { color: '#38A169', label: 'Available' },
    busy: { color: '#D8B26A', label: 'Busy' },
    offline: { color: '#8D8371', label: 'Offline' },
    error: { color: '#E53E3E', label: 'Error' },
  },
} as const;

// ============================================================
// GOVERNANCE SYSTEM
// ============================================================

/**
 * CHE·NU:
 * - does NOT sell attention
 * - does NOT sell user data
 * - does NOT optimize for addiction
 * - makes cost explicit
 * - allows user control at every step
 * 
 * Governance is not a restriction.
 * Governance is empowerment.
 */

export const GOVERNANCE_CONFIG = {
  levels: {
    permissive: {
      label: 'Permissive',
      description: 'Minimal restrictions, maximum autonomy',
      color: '#38A169',
    },
    balanced: {
      label: 'Balanced',
      description: 'Reasonable controls with flexibility',
      color: '#3EB4A2',
    },
    strict: {
      label: 'Strict',
      description: 'Strong controls, approval required for most actions',
      color: '#DD6B20',
    },
    custom: {
      label: 'Custom',
      description: 'Custom rules configured manually',
      color: '#805AD5',
    },
  },
  
  principles: [
    'User control at every step',
    'Cost transparency',
    'No attention selling',
    'No data selling',
    'No addiction optimization',
    'Governance enforced before execution',
  ],
} as const;

// ============================================================
// UI LAYOUT PRINCIPLES
// ============================================================

/**
 * CHE·NU UI follows a SIMPLE, STABLE MODEL:
 * 
 * - One active SPHERE at a time
 * - One BUREAU visible at a time
 * - Workspace is TRANSVERSAL
 * - Nova / Orchestrator always accessible
 * 
 * Layout principle:
 * - Reduce cognitive load
 * - No feature dumping
 * - Context first, action second
 */

export const UI_CONFIG = {
  layout: {
    sidebar: {
      width: 260,
      collapsedWidth: 72,
    },
    header: {
      height: 64,
    },
    panel: {
      minWidth: 320,
      maxWidth: 480,
    },
  },
  
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
  
  animations: {
    fast: '0.15s',
    normal: '0.25s',
    slow: '0.4s',
  },
  
  principles: [
    'One active sphere at a time',
    'One bureau visible at a time',
    'Reduce cognitive load',
    'No feature dumping',
    'Context first, action second',
    'Fewer visible elements = higher cognitive power',
  ],
} as const;

// ============================================================
// BUILD INFO
// ============================================================

export const BUILD_INFO = {
  version: '1.0.0',
  milestone: '130K',
  lines: 130000,
  codename: 'GOVERNED_INTELLIGENCE',
  timestamp: new Date().toISOString(),
  
  stats: {
    spheres: 8,
    bureauSections: 10,
    totalComponents: 307,
  },
} as const;

// ============================================================
// ABSOLUTE CONSTRAINTS - MEMORY PROMPT
// ============================================================

/**
 * DO NOT:
 * - add new spheres
 * - rename spheres
 * - merge bureau sections
 * - bypass governance
 * - treat CHE·NU as a generic AI app
 * - convert tokens into speculative crypto
 * - make Nova a hired agent
 * 
 * If unsure, ALWAYS favor:
 * - clarity over features
 * - separation over fusion
 * - governance over automation
 */

export const ABSOLUTE_CONSTRAINTS = {
  doNot: [
    'Add new spheres',
    'Rename spheres',
    'Merge bureau sections',
    'Bypass governance',
    'Treat CHE·NU as a generic AI app',
    'Convert tokens into speculative crypto',
    'Make Nova a hired agent',
  ],
  
  alwaysFavor: [
    'Clarity over features',
    'Separation over fusion',
    'Governance over automation',
  ],
} as const;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  BRAND_COLORS,
  SPHERES,
  BUREAU_SECTIONS,
  THREAD_CONFIG,
  TOKEN_CONFIG,
  ENCODING_CONFIG,
  AGENT_CONFIG,
  GOVERNANCE_CONFIG,
  UI_CONFIG,
  BUILD_INFO,
  ABSOLUTE_CONSTRAINTS,
};
