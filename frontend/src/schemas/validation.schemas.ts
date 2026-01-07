// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — ZOD VALIDATION SCHEMAS
// Sprint 4: Runtime type validation for architecture compliance
// ═══════════════════════════════════════════════════════════════════════════════

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE SCHEMAS (9 SPHERES - FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

export const SphereIdSchema = z.enum([
  'personal',
  'business',
  'government',
  'creative',
  'community',
  'social',
  'entertainment',
  'my_team',
  'scholars',
]);

export type SphereId = z.infer<typeof SphereIdSchema>;

export const SphereSchema = z.object({
  id: SphereIdSchema,
  name: z.string().min(1),
  nameFr: z.string().min(1),
  icon: z.string().emoji(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  route: z.string().startsWith('/'),
  description: z.string(),
  order: z.number().int().min(1).max(9),
  isUnlocked: z.boolean().default(true),
});

export type Sphere = z.infer<typeof SphereSchema>;

export const SpheresArraySchema = z.array(SphereSchema).length(9);

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION SCHEMAS (6 SECTIONS - HARD LIMIT)
// ═══════════════════════════════════════════════════════════════════════════════

export const BureauSectionIdSchema = z.enum([
  'QUICK_CAPTURE',
  'RESUME_WORKSPACE',
  'THREADS',
  'DATA_FILES',
  'ACTIVE_AGENTS',
  'MEETINGS',
]);

export type BureauSectionId = z.infer<typeof BureauSectionIdSchema>;

export const BureauSectionKeySchema = z.enum([
  'quick_capture',
  'resume_workspace',
  'threads',
  'data_files',
  'active_agents',
  'meetings',
]);

export type BureauSectionKey = z.infer<typeof BureauSectionKeySchema>;

export const BureauSectionSchema = z.object({
  id: BureauSectionIdSchema,
  key: BureauSectionKeySchema,
  name: z.string().min(1),
  nameFr: z.string().min(1),
  icon: z.string(),
  description: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  level: z.literal('L2'),
  hierarchy: z.number().int().min(1).max(6),
  testId: z.string(),
});

export type BureauSection = z.infer<typeof BureauSectionSchema>;

export const BureauSectionsArraySchema = z.array(BureauSectionSchema).length(6);

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT SCHEMAS (L0-L3 Hierarchy)
// ═══════════════════════════════════════════════════════════════════════════════

export const AgentLevelSchema = z.enum(['L0', 'L1', 'L2', 'L3']);
export type AgentLevel = z.infer<typeof AgentLevelSchema>;

export const AgentTypeSchema = z.enum(['nova', 'orchestrator', 'specialist', 'worker']);
export type AgentType = z.infer<typeof AgentTypeSchema>;

export const AgentStatusSchema = z.enum(['idle', 'busy', 'offline']);
export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const AgentCapabilitySchema = z.enum([
  'guidance',
  'memory',
  'governance',
  'supervision',
  'analysis',
  'writing',
  'coding',
  'research',
  'communication',
  'creative',
]);

export const AgentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: AgentTypeSchema,
  level: AgentLevelSchema,
  status: AgentStatusSchema,
  isSystem: z.boolean(),
  isHired: z.boolean(),
  costPerToken: z.number().positive(),
  capabilities: z.array(AgentCapabilitySchema).min(1),
  sphereScopes: z.array(SphereIdSchema).or(z.array(z.literal('all'))),
  hiredAt: z.string().datetime().optional(),
  metrics: z.object({
    tasksCompleted: z.number().int().nonnegative(),
    tasksSuccessful: z.number().int().nonnegative(),
    totalTokensUsed: z.number().nonnegative(),
  }).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

// Nova specific schema (L0 - NEVER hired)
export const NovaSchema = AgentSchema.extend({
  id: z.literal('nova'),
  name: z.literal('Nova'),
  type: z.literal('nova'),
  level: z.literal('L0'),
  isSystem: z.literal(true),
  isHired: z.literal(false), // NEVER hired
}).refine(
  (data) => data.capabilities.includes('governance'),
  { message: 'Nova must have governance capability' }
);

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD SCHEMAS (.chenu)
// ═══════════════════════════════════════════════════════════════════════════════

export const ThreadTypeSchema = z.enum(['chat', 'agent', 'task']);
export type ThreadType = z.infer<typeof ThreadTypeSchema>;

export const ThreadStatusSchema = z.enum(['active', 'archived']);
export type ThreadStatus = z.infer<typeof ThreadStatusSchema>;

export const ThreadSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  type: ThreadTypeSchema,
  sphereId: SphereIdSchema,
  status: ThreadStatusSchema,
  tokenBudget: z.number().int().positive(),
  tokensUsed: z.number().int().nonnegative(),
  encodingMode: z.enum(['standard', 'compressed', 'minimal']).default('standard'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Thread = z.infer<typeof ThreadSchema>;

export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);

export const ThreadMessageSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  tokensUsed: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  aiMetadata: z.object({
    model: z.string().optional(),
    tokensOutput: z.number().optional(),
    latencyMs: z.number().optional(),
  }).optional(),
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

export const GovernanceLawCodeSchema = z.enum([
  'CONSENT_PRIMACY',
  'TEMPORAL_SOVEREIGNTY',
  'CONTEXTUAL_FIDELITY',
  'HIERARCHICAL_RESPECT',
  'AUDIT_COMPLETENESS',
  'ENCODING_TRANSPARENCY',
  'AGENT_NON_AUTONOMY',
  'BUDGET_ACCOUNTABILITY',
  'CROSS_SPHERE_ISOLATION',
  'DELETION_COMPLETENESS',
]);

export const GovernanceLawSchema = z.object({
  id: z.string().regex(/^L([1-9]|10)$/),
  code: GovernanceLawCodeSchema,
  name: z.string(),
  nameFr: z.string(),
  description: z.string(),
  enforcement: z.enum(['STRICT', 'STANDARD']),
});

export const ScopeLevelSchema = z.enum([
  'selection',
  'document',
  'project',
  'sphere',
  'global',
]);

export type ScopeLevel = z.infer<typeof ScopeLevelSchema>;

export const ScopeLockSchema = z.object({
  active: z.boolean(),
  level: ScopeLevelSchema,
  targetId: z.string().nullable(),
  targetName: z.string().nullable(),
  lockedAt: z.string().datetime().nullable(),
  lockedBy: z.string().nullable(),
});

export type ScopeLock = z.infer<typeof ScopeLockSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET SCHEMAS (Internal Credits - NOT Crypto!)
// ═══════════════════════════════════════════════════════════════════════════════

export const TokenBudgetSchema = z.object({
  total: z.number().int().positive(),
  used: z.number().int().nonnegative(),
  remaining: z.number().int().nonnegative(),
  reserved: z.number().int().nonnegative(),
  dailyLimit: z.number().int().positive().default(100000),
  warningThreshold: z.number().min(0).max(1).default(0.8),
}).refine(
  (data) => data.remaining === data.total - data.used,
  { message: 'remaining must equal total - used' }
).refine(
  (data) => data.used <= data.total,
  { message: 'used cannot exceed total' }
);

export type TokenBudget = z.infer<typeof TokenBudgetSchema>;

export const GovernanceStatusSchema = z.object({
  enabled: z.boolean(),
  strictMode: z.boolean(),
  budget: TokenBudgetSchema,
  scopeLock: ScopeLockSchema,
  pendingApprovals: z.number().int().nonnegative(),
  activeViolations: z.number().int().nonnegative(),
});

export type GovernanceStatus = z.infer<typeof GovernanceStatusSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// ENCODING SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

export const EncodingModeSchema = z.enum(['standard', 'compressed', 'minimal', 'custom']);

export const EncodingResultSchema = z.object({
  encodedText: z.string(),
  originalTokens: z.number().int().positive(),
  encodedTokens: z.number().int().positive(),
  compressionRatio: z.number().positive(),
  qualityScore: z.number().min(0).max(100),
  isReversible: z.boolean(),
});

export type EncodingResult = z.infer<typeof EncodingResultSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

export const UserRoleSchema = z.enum(['user', 'admin', 'enterprise']);
export const SubscriptionSchema = z.enum(['free', 'pro', 'enterprise']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  role: UserRoleSchema,
  tokenBalance: z.number().int().nonnegative(),
  subscription: SubscriptionSchema,
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.number().int().positive(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// API RESPONSE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

export const ApiMetaSchema = z.object({
  requestId: z.string(),
  tokensUsed: z.number().int().nonnegative(),
  latencyMs: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    meta: ApiMetaSchema.optional(),
  });

// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU COLORS SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const ChenuColorSchema = z.object({
  sacredGold: z.literal('#D8B26A'),
  ancientStone: z.literal('#8D8371'),
  jungleEmerald: z.literal('#3F7249'),
  cenoteTurquoise: z.literal('#3EB4A2'),
  shadowMoss: z.literal('#2F4C39'),
  earthEmber: z.literal('#7A593A'),
  uiSlate: z.literal('#1E1F22'),
  softSand: z.literal('#E9E4D6'),
  scholarGold: z.literal('#E0C46B'),
});

export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  scholarGold: '#E0C46B',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const validateSphere = (data: unknown) => SphereSchema.safeParse(data);
export const validateAgent = (data: unknown) => AgentSchema.safeParse(data);
export const validateNova = (data: unknown) => NovaSchema.safeParse(data);
export const validateThread = (data: unknown) => ThreadSchema.safeParse(data);
export const validateTokenBudget = (data: unknown) => TokenBudgetSchema.safeParse(data);
export const validateUser = (data: unknown) => UserSchema.safeParse(data);

// Ensure exactly 9 spheres
export const validateSpheresCount = (spheres: unknown[]) => {
  if (spheres.length !== 9) {
    throw new Error(`Expected 9 spheres (FROZEN), got ${spheres.length}`);
  }
  return SpheresArraySchema.parse(spheres);
};

// Ensure exactly 6 bureau sections
export const validateBureauSectionsCount = (sections: unknown[]) => {
  if (sections.length !== 6) {
    throw new Error(`Expected 6 bureau sections (HARD LIMIT), got ${sections.length}`);
  }
  return BureauSectionsArraySchema.parse(sections);
};
