// CHE·NU™ Form Validation System
// Comprehensive validation for all forms

import { z, ZodSchema } from 'zod';

// ============================================================
// TYPES
// ============================================================

type SphereCode = 'PERSONAL' | 'BUSINESS' | 'GOVERNMENT' | 'STUDIO' | 'COMMUNITY' | 'SOCIAL' | 'ENTERTAINMENT' | 'TEAM';

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================================
// BASE SCHEMAS
// ============================================================

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters');

const descriptionSchema = z
  .string()
  .max(5000, 'Description must be less than 5000 characters')
  .optional();

const sphereCodeSchema = z.enum([
  'PERSONAL',
  'BUSINESS',
  'GOVERNMENT',
  'STUDIO',
  'COMMUNITY',
  'SOCIAL',
  'ENTERTAINMENT',
  'TEAM',
]);

const uuidSchema = z.string().uuid('Invalid ID format');

const dateSchema = z.string().datetime({ message: 'Invalid date format' });

const tagsSchema = z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed');

// ============================================================
// AUTH SCHEMAS
// ============================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: nameSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// ============================================================
// USER SCHEMAS
// ============================================================

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2).max(5),
  notifications: z.boolean(),
  defaultSphere: sphereCodeSchema,
  compactMode: z.boolean().optional(),
  showTokenUsage: z.boolean().optional(),
  autoEncoding: z.boolean().optional(),
});

// ============================================================
// THREAD SCHEMAS
// ============================================================

export const createThreadSchema = z.object({
  title: titleSchema,
  sphereCode: sphereCodeSchema,
  tokenBudget: z
    .number()
    .min(100, 'Minimum budget is 100 tokens')
    .max(1000000, 'Maximum budget is 1,000,000 tokens')
    .optional()
    .default(5000),
  encodingEnabled: z.boolean().optional().default(false),
  description: descriptionSchema,
});

export const updateThreadSchema = z.object({
  title: titleSchema.optional(),
  tokenBudget: z
    .number()
    .min(100, 'Minimum budget is 100 tokens')
    .max(1000000, 'Maximum budget is 1,000,000 tokens')
    .optional(),
  encodingEnabled: z.boolean().optional(),
  description: descriptionSchema,
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(50000, 'Message is too long'),
  role: z.enum(['user', 'assistant']).optional().default('user'),
  attachments: z
    .array(
      z.object({
        type: z.enum(['file', 'image', 'link']),
        url: z.string().url(),
        name: z.string().optional(),
      })
    )
    .optional(),
});

// ============================================================
// TASK SCHEMAS
// ============================================================

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  sphereCode: sphereCodeSchema,
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  dueDate: dateSchema.optional(),
  assigneeId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
  tags: tagsSchema.optional(),
  estimatedTime: z.number().min(0).optional(),
  parentTaskId: uuidSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  dueDate: dateSchema.optional().nullable(),
  assigneeId: uuidSchema.optional().nullable(),
  tags: tagsSchema.optional(),
  estimatedTime: z.number().min(0).optional(),
  actualTime: z.number().min(0).optional(),
});

export const taskFilterSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assigneeId: uuidSchema.optional(),
  projectId: uuidSchema.optional(),
  dueBefore: dateSchema.optional(),
  dueAfter: dateSchema.optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================================
// NOTE SCHEMAS
// ============================================================

export const createNoteSchema = z.object({
  title: titleSchema,
  content: z.string().max(100000, 'Note content is too long'),
  sphereCode: sphereCodeSchema,
  tags: tagsSchema.optional(),
  isPinned: z.boolean().optional().default(false),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
});

export const updateNoteSchema = z.object({
  title: titleSchema.optional(),
  content: z.string().max(100000, 'Note content is too long').optional(),
  tags: tagsSchema.optional(),
  isPinned: z.boolean().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional().nullable(),
});

// ============================================================
// PROJECT SCHEMAS
// ============================================================

export const createProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  sphereCode: sphereCodeSchema,
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).optional().default('planning'),
  members: z.array(uuidSchema).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  budget: z.number().min(0).optional(),
  tags: tagsSchema.optional(),
});

export const updateProjectSchema = z.object({
  name: nameSchema.optional(),
  description: descriptionSchema,
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).optional(),
  members: z.array(uuidSchema).optional(),
  startDate: dateSchema.optional().nullable(),
  endDate: dateSchema.optional().nullable(),
  budget: z.number().min(0).optional(),
  tags: tagsSchema.optional(),
});

// ============================================================
// MEETING SCHEMAS
// ============================================================

export const createMeetingSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    sphereCode: sphereCodeSchema,
    startTime: dateSchema,
    endTime: dateSchema,
    participantIds: z.array(uuidSchema).min(1, 'At least one participant is required'),
    tokenBudget: z.number().min(100).max(100000).optional().default(1000),
    location: z.string().max(200).optional(),
    isRecurring: z.boolean().optional().default(false),
    recurrencePattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
    reminders: z.array(z.number().min(0).max(10080)).optional(), // Minutes before meeting
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

export const updateMeetingSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  startTime: dateSchema.optional(),
  endTime: dateSchema.optional(),
  participantIds: z.array(uuidSchema).optional(),
  tokenBudget: z.number().min(100).max(100000).optional(),
  location: z.string().max(200).optional().nullable(),
  notes: z.string().max(50000).optional(),
});

export const meetingActionItemSchema = z.object({
  description: z.string().min(1).max(500),
  assigneeId: uuidSchema.optional(),
  dueDate: dateSchema.optional(),
});

// ============================================================
// AGENT SCHEMAS
// ============================================================

export const hireAgentSchema = z.object({
  agentId: uuidSchema,
  sphereCode: sphereCodeSchema,
  budget: z.number().min(100, 'Minimum budget is 100 tokens').max(1000000),
  scope: z.array(z.string()).optional(),
  instructions: z.string().max(5000).optional(),
});

export const agentTaskSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(10000),
  priority: z.enum(['low', 'normal', 'high']).optional().default('normal'),
  deadline: dateSchema.optional(),
  context: z.record(z.any()).optional(),
});

// ============================================================
// TOKEN BUDGET SCHEMAS
// ============================================================

export const allocateTokensSchema = z.object({
  sphereCode: sphereCodeSchema,
  amount: z.number().min(1, 'Amount must be at least 1').max(10000000),
});

export const transferTokensSchema = z
  .object({
    fromSphere: sphereCodeSchema,
    toSphere: sphereCodeSchema,
    amount: z.number().min(1, 'Amount must be at least 1').max(10000000),
    reason: z.string().max(500).optional(),
  })
  .refine((data) => data.fromSphere !== data.toSphere, {
    message: 'Cannot transfer to the same sphere',
    path: ['toSphere'],
  });

export const reserveTokensSchema = z.object({
  sphereCode: sphereCodeSchema,
  resourceType: z.enum(['thread', 'meeting', 'agent']),
  resourceId: uuidSchema,
  amount: z.number().min(1).max(1000000),
  expiresAt: dateSchema.optional(),
});

// ============================================================
// GOVERNANCE SCHEMAS
// ============================================================

export const governanceConsentSchema = z.object({
  lawNumbers: z.array(z.number().min(1).max(10)),
  action: z.string().min(1).max(200),
  context: z.record(z.any()),
  acknowledged: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the governance laws',
  }),
});

// ============================================================
// SEARCH SCHEMAS
// ============================================================

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500),
  sphereCode: sphereCodeSchema.optional(),
  types: z.array(z.enum(['thread', 'task', 'note', 'project', 'meeting'])).optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});

// ============================================================
// DATA IMPORT/EXPORT SCHEMAS
// ============================================================

export const importDataSchema = z.object({
  sphereCode: sphereCodeSchema,
  format: z.enum(['json', 'csv']),
  overwrite: z.boolean().optional().default(false),
  mapping: z.record(z.string()).optional(),
});

export const exportDataSchema = z.object({
  sphereCode: sphereCodeSchema.optional(),
  types: z.array(z.enum(['threads', 'tasks', 'notes', 'projects', 'meetings'])).optional(),
  format: z.enum(['json', 'csv']),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
  includeArchived: z.boolean().optional().default(false),
});

// ============================================================
// NOTIFICATION SETTINGS SCHEMA
// ============================================================

export const notificationSettingsSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    digest: z.enum(['instant', 'daily', 'weekly']),
    types: z.array(z.string()),
  }),
  push: z.object({
    enabled: z.boolean(),
    types: z.array(z.string()),
  }),
  inApp: z.object({
    enabled: z.boolean(),
    sound: z.boolean(),
    types: z.array(z.string()),
  }),
});

// ============================================================
// FEEDBACK SCHEMA
// ============================================================

export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'improvement', 'other']),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  attachments: z.array(z.string().url()).max(5).optional(),
  contactEmail: emailSchema.optional(),
});

// ============================================================
// VALIDATOR CLASS
// ============================================================

export class FormValidator<T> {
  private schema: ZodSchema<T>;

  constructor(schema: ZodSchema<T>) {
    this.schema = schema;
  }

  validate(data: unknown): ValidationResult<T> {
    const result = this.schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    const errors: ValidationError[] = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    return {
      success: false,
      errors,
    };
  }

  validateAsync(data: unknown): Promise<ValidationResult<T>> {
    return Promise.resolve(this.validate(data));
  }

  getFieldError(data: unknown, field: string): string | null {
    const result = this.validate(data);
    if (result.success) return null;

    const error = result.errors?.find((e) => e.field === field);
    return error?.message || null;
  }

  isValid(data: unknown): boolean {
    return this.validate(data).success;
  }
}

// ============================================================
// VALIDATOR INSTANCES
// ============================================================

export const validators = {
  // Auth
  login: new FormValidator(loginSchema),
  register: new FormValidator(registerSchema),
  forgotPassword: new FormValidator(forgotPasswordSchema),
  resetPassword: new FormValidator(resetPasswordSchema),
  changePassword: new FormValidator(changePasswordSchema),

  // User
  updateProfile: new FormValidator(updateProfileSchema),
  userPreferences: new FormValidator(userPreferencesSchema),

  // Thread
  createThread: new FormValidator(createThreadSchema),
  updateThread: new FormValidator(updateThreadSchema),
  sendMessage: new FormValidator(sendMessageSchema),

  // Task
  createTask: new FormValidator(createTaskSchema),
  updateTask: new FormValidator(updateTaskSchema),
  taskFilter: new FormValidator(taskFilterSchema),

  // Note
  createNote: new FormValidator(createNoteSchema),
  updateNote: new FormValidator(updateNoteSchema),

  // Project
  createProject: new FormValidator(createProjectSchema),
  updateProject: new FormValidator(updateProjectSchema),

  // Meeting
  createMeeting: new FormValidator(createMeetingSchema),
  updateMeeting: new FormValidator(updateMeetingSchema),
  meetingActionItem: new FormValidator(meetingActionItemSchema),

  // Agent
  hireAgent: new FormValidator(hireAgentSchema),
  agentTask: new FormValidator(agentTaskSchema),

  // Token Budget
  allocateTokens: new FormValidator(allocateTokensSchema),
  transferTokens: new FormValidator(transferTokensSchema),
  reserveTokens: new FormValidator(reserveTokensSchema),

  // Governance
  governanceConsent: new FormValidator(governanceConsentSchema),

  // Search
  search: new FormValidator(searchSchema),

  // Data Import/Export
  importData: new FormValidator(importDataSchema),
  exportData: new FormValidator(exportDataSchema),

  // Notifications
  notificationSettings: new FormValidator(notificationSettingsSchema),

  // Feedback
  feedback: new FormValidator(feedbackSchema),
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function validateField<T>(
  schema: ZodSchema<T>,
  field: string,
  value: unknown
): string | null {
  try {
    // Create a partial object with just this field
    const partialSchema = (schema as any).pick({ [field]: true });
    partialSchema.parse({ [field]: value });
    return null;
  } catch (error: unknown) {
    if (error.errors && error.errors.length > 0) {
      return error.errors[0].message;
    }
    return 'Invalid value';
  }
}

export function getErrorMessages(errors: ValidationError[] | undefined): Record<string, string> {
  if (!errors) return {};
  return errors.reduce(
    (acc, err) => ({
      ...acc,
      [err.field]: err.message,
    }),
    {}
  );
}

export function hasErrors(result: ValidationResult<any>): boolean {
  return !result.success && !!result.errors && result.errors.length > 0;
}

// ============================================================
// CUSTOM VALIDATION RULES
// ============================================================

export const customRules = {
  // Memory Prompt: Tokens are NOT cryptocurrency
  validateTokenAmount: (amount: number, budget: number): string | null => {
    if (amount > budget) {
      return 'Amount exceeds available budget';
    }
    if (amount <= 0) {
      return 'Amount must be positive';
    }
    return null;
  },

  // Memory Prompt: 8 FROZEN spheres
  validateSphereCode: (code: string): boolean => {
    const VALID_SPHERES: SphereCode[] = [
      'PERSONAL',
      'BUSINESS',
      'GOVERNMENT',
      'STUDIO',
      'COMMUNITY',
      'SOCIAL',
      'ENTERTAINMENT',
      'TEAM',
    ];
    return VALID_SPHERES.includes(code as SphereCode);
  },

  // Memory Prompt: 10 NON-NEGOTIABLE bureau sections
  validateBureauSection: (section: string): boolean => {
    const VALID_SECTIONS = [
      'dashboard',
      'notes',
      'tasks',
      'projects',
      'threads',
      'meetings',
      'data',
      'agents',
      'reports',
      'budget',
    ];
    return VALID_SECTIONS.includes(section.toLowerCase());
  },

  // Validate date range
  validateDateRange: (start: string, end: string): string | null => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime())) {
      return 'Invalid start date';
    }
    if (isNaN(endDate.getTime())) {
      return 'Invalid end date';
    }
    if (endDate <= startDate) {
      return 'End date must be after start date';
    }
    return null;
  },

  // Validate future date
  validateFutureDate: (date: string): string | null => {
    const inputDate = new Date(date);
    const now = new Date();
    
    if (isNaN(inputDate.getTime())) {
      return 'Invalid date';
    }
    if (inputDate < now) {
      return 'Date must be in the future';
    }
    return null;
  },

  // Validate URL
  validateUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate file size
  validateFileSize: (size: number, maxSizeMB: number): string | null => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (size > maxBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  },

  // Validate file type
  validateFileType: (type: string, allowedTypes: string[]): string | null => {
    if (!allowedTypes.includes(type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
};

// ============================================================
// EXPORTS
// ============================================================

export type {
  ValidationResult,
  ValidationError,
  SphereCode,
};

export default validators;
