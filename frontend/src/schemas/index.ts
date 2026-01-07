/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — ZOD VALIDATION SCHEMAS v39
   Type-safe runtime validation for all entities
   ═══════════════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';

// ════════════════════════════════════════════════════════════════════════════════
// BASE TYPES
// ════════════════════════════════════════════════════════════════════════════════

export const UUIDSchema = z.string().uuid();
export const TimestampSchema = z.number().int().positive();
export const EmailSchema = z.string().email();
export const URLSchema = z.string().url();

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const SphereIdSchema = z.enum([
  'personal',
  'business',
  'government',
  'creative',
  'community',
  'social',
  'entertainment',
  'scholars',    // 🎓 Knowledge & Research - Core of CHE·NU Intelligence
  'my_team',
]);

export type SphereId = z.infer<typeof SphereIdSchema>;

export const SphereSchema = z.object({
  id: SphereIdSchema,
  name: z.string().min(1).max(50),
  nameFr: z.string().min(1).max(50),
  nameEs: z.string().min(1).max(50),
  icon: z.string().emoji(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  route: z.string().startsWith('/'),
  description: z.string().max(200),
  descriptionFr: z.string().max(200),
  isUnlocked: z.boolean().default(true),
  lastAccessed: TimestampSchema.optional(),
});

export type Sphere = z.infer<typeof SphereSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU SECTION SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const BureauSectionIdSchema = z.enum([
  'QUICK_CAPTURE',
  'RESUME_WORKSPACE',
  'THREADS',
  'DATA_FILES',
  'ACTIVE_AGENTS',
  'MEETINGS',
]);

export type BureauSectionId = z.infer<typeof BureauSectionIdSchema>;

export const BureauSectionSchema = z.object({
  id: BureauSectionIdSchema,
  name: z.string().min(1).max(50),
  nameFr: z.string().min(1).max(50),
  icon: z.string(),
  description: z.string().max(200),
  maxItems: z.number().int().positive().optional(),
  hierarchyLevel: z.number().int().min(1).max(6),
});

export type BureauSection = z.infer<typeof BureauSectionSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// THREAD SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const ThreadStatusSchema = z.enum(['active', 'resolved', 'archived']);

export const ThreadSchema = z.object({
  id: UUIDSchema,
  title: z.string().min(1).max(200),
  content: z.string().max(50000).optional(),
  sphereId: SphereIdSchema,
  ownerId: UUIDSchema,
  participants: z.array(UUIDSchema).default([]),
  unread: z.number().int().min(0).default(0),
  status: ThreadStatusSchema.default('active'),
  tokenBudget: z.number().int().min(0).max(1000000),
  tokensUsed: z.number().int().min(0).default(0),
  encodingRules: z.record(z.unknown()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  lastMessage: TimestampSchema.optional(),
});

export type Thread = z.infer<typeof ThreadSchema>;

export const CreateThreadSchema = ThreadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  tokensUsed: true,
  unread: true,
});

export type CreateThread = z.infer<typeof CreateThreadSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// AGENT SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const AgentLevelSchema = z.enum(['L0', 'L1', 'L2', 'L3']);
export const AgentStatusSchema = z.enum(['idle', 'working', 'waiting', 'paused', 'error']);

export const AgentCategorySchema = z.enum([
  'system',
  'orchestration',
  'analysis',
  'writing',
  'research',
  'coding',
  'data',
  'communication',
  'creativity',
  'productivity',
  'finance',
  'legal',
  'health',
  'education',
  'real_estate',
  'media',
  'support',
  'security',
  'governance',
]);

export const AgentSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1).max(100),
  nameFr: z.string().min(1).max(100),
  nameEs: z.string().min(1).max(100).optional(),
  level: AgentLevelSchema,
  category: AgentCategorySchema,
  description: z.string().max(500),
  status: AgentStatusSchema.default('idle'),
  currentTask: z.string().max(200).optional(),
  progress: z.number().min(0).max(100).optional(),
  costPerToken: z.number().positive(),
  maxTokensPerTask: z.number().int().positive(),
  capabilities: z.array(z.string()).default([]),
  sphereAccess: z.array(SphereIdSchema).default([]),
  isHired: z.boolean().default(false),
  hiredAt: TimestampSchema.optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// MEETING SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const MeetingStatusSchema = z.enum(['scheduled', 'live', 'completed', 'cancelled']);

export const MeetingSchema = z.object({
  id: UUIDSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  sphereId: SphereIdSchema,
  organizerId: UUIDSchema,
  participants: z.array(z.object({
    userId: UUIDSchema,
    email: EmailSchema.optional(),
    name: z.string(),
    role: z.enum(['organizer', 'presenter', 'attendee']),
    status: z.enum(['pending', 'accepted', 'declined', 'tentative']),
  })),
  startTime: TimestampSchema,
  endTime: TimestampSchema,
  duration: z.number().int().positive(), // minutes
  status: MeetingStatusSchema.default('scheduled'),
  hasRecording: z.boolean().default(false),
  recordingUrl: URLSchema.optional(),
  transcriptUrl: URLSchema.optional(),
  agendaItems: z.array(z.object({
    id: UUIDSchema,
    title: z.string().max(200),
    duration: z.number().int().positive().optional(),
    presenter: z.string().optional(),
  })).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export type Meeting = z.infer<typeof MeetingSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// TOKEN & GOVERNANCE SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const ScopeLevelSchema = z.enum([
  'selection',
  'document',
  'project',
  'sphere',
  'global',
]);

export const TokenBudgetSchema = z.object({
  total: z.number().int().min(0),
  used: z.number().int().min(0),
  remaining: z.number().int().min(0),
  reserved: z.number().int().min(0).default(0),
  lastUpdated: TimestampSchema,
});

export type TokenBudget = z.infer<typeof TokenBudgetSchema>;

export const ScopeLockSchema = z.object({
  active: z.boolean().default(false),
  level: ScopeLevelSchema,
  targetId: UUIDSchema.nullable(),
  targetName: z.string().max(200).nullable(),
  lockedAt: TimestampSchema.nullable(),
  lockedBy: UUIDSchema.nullable(),
});

export type ScopeLock = z.infer<typeof ScopeLockSchema>;

export const GovernanceViolationSeveritySchema = z.enum(['warning', 'error', 'critical']);

export const GovernanceViolationSchema = z.object({
  id: UUIDSchema,
  rule: z.string().max(50),
  description: z.string().max(500),
  severity: GovernanceViolationSeveritySchema,
  timestamp: TimestampSchema,
  resolved: z.boolean().default(false),
  resolvedAt: TimestampSchema.optional(),
  resolvedBy: UUIDSchema.optional(),
});

export type GovernanceViolation = z.infer<typeof GovernanceViolationSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// QUICK CAPTURE SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const QuickCaptureTypeSchema = z.enum(['note', 'voice', 'image', 'link']);

export const QuickCaptureSchema = z.object({
  id: UUIDSchema,
  content: z.string().min(1).max(500), // 500 char max per spec
  type: QuickCaptureTypeSchema,
  sphereId: SphereIdSchema.optional(),
  timestamp: TimestampSchema,
  processed: z.boolean().default(false),
  processedAt: TimestampSchema.optional(),
  linkedThreadId: UUIDSchema.optional(),
});

export type QuickCapture = z.infer<typeof QuickCaptureSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// DATA FILE SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const DataFileSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1).max(255),
  mimeType: z.string(),
  size: z.number().int().positive(),
  sphereId: SphereIdSchema,
  ownerId: UUIDSchema,
  path: z.string(),
  url: URLSchema.optional(),
  shared: z.boolean().default(false),
  sharedWith: z.array(UUIDSchema).default([]),
  tags: z.array(z.string().max(50)).default([]),
  metadata: z.record(z.unknown()).optional(),
  createdAt: TimestampSchema,
  modifiedAt: TimestampSchema,
});

export type DataFile = z.infer<typeof DataFileSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// USER SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const UserRoleSchema = z.enum(['user', 'admin', 'superadmin']);

export const UserSchema = z.object({
  id: UUIDSchema,
  email: EmailSchema,
  name: z.string().min(1).max(100),
  avatarUrl: URLSchema.optional(),
  role: UserRoleSchema.default('user'),
  locale: z.enum(['en', 'fr', 'es']).default('en'),
  timezone: z.string().default('UTC'),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('dark'),
    density: z.enum(['compact', 'normal', 'comfortable']).default('normal'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      sound: z.boolean().default(true),
    }).default({}),
    accessibility: z.object({
      reducedMotion: z.boolean().default(false),
      highContrast: z.boolean().default(false),
      fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
    }).default({}),
    governance: z.object({
      dailyTokenLimit: z.number().int().positive().default(100000),
      warningThreshold: z.number().min(0).max(1).default(0.8),
      requireConfirmation: z.boolean().default(true),
    }).default({}),
  }).default({}),
  createdAt: TimestampSchema,
  lastLoginAt: TimestampSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// WORKFLOW SCHEMAS
// ════════════════════════════════════════════════════════════════════════════════

export const WorkflowTriggerTypeSchema = z.enum([
  'schedule',
  'event',
  'webhook',
  'manual',
  'condition',
]);

export const WorkflowActionTypeSchema = z.enum([
  'notification',
  'email',
  'task_create',
  'document_create',
  'api_call',
  'agent_invoke',
  'data_transform',
  'condition_check',
]);

export const WorkflowNodeSchema = z.object({
  id: UUIDSchema,
  type: z.enum(['trigger', 'action', 'condition', 'loop']),
  name: z.string().max(100),
  config: z.record(z.unknown()),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  nextNodes: z.array(UUIDSchema).default([]),
});

export const WorkflowSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  sphereId: SphereIdSchema,
  ownerId: UUIDSchema,
  nodes: z.array(WorkflowNodeSchema),
  triggers: z.array(z.object({
    type: WorkflowTriggerTypeSchema,
    config: z.record(z.unknown()),
  })),
  isActive: z.boolean().default(false),
  estimatedTokensPerRun: z.number().int().positive(),
  totalRuns: z.number().int().min(0).default(0),
  lastRunAt: TimestampSchema.optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export type Workflow = z.infer<typeof WorkflowSchema>;

// ════════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Safe parse with typed error handling
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError['errors'] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors };
}

/**
 * Validate or throw with formatted message
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new Error(`Validation failed${context ? ` for ${context}` : ''}: ${messages}`);
  }
  return result.data;
}

/**
 * Create a partial schema for updates
 */
export function createUpdateSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial().extend({
    id: UUIDSchema,
    updatedAt: TimestampSchema,
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export const schemas = {
  // Base
  UUID: UUIDSchema,
  Timestamp: TimestampSchema,
  Email: EmailSchema,
  URL: URLSchema,
  
  // Domain
  Sphere: SphereSchema,
  SphereId: SphereIdSchema,
  BureauSection: BureauSectionSchema,
  BureauSectionId: BureauSectionIdSchema,
  Thread: ThreadSchema,
  CreateThread: CreateThreadSchema,
  Agent: AgentSchema,
  Meeting: MeetingSchema,
  QuickCapture: QuickCaptureSchema,
  DataFile: DataFileSchema,
  User: UserSchema,
  Workflow: WorkflowSchema,
  
  // Governance
  TokenBudget: TokenBudgetSchema,
  ScopeLock: ScopeLockSchema,
  GovernanceViolation: GovernanceViolationSchema,
};

export default schemas;
