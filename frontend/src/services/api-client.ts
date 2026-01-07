// CHE·NU™ API Client v2.0
// Complete type-safe API client with all endpoints

import { z } from 'zod';

// ============================================================
// CONFIGURATION
// ============================================================

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
  onError?: (error: ApiError) => void;
  onRequest?: (request: RequestInit) => RequestInit;
  onResponse?: (response: Response) => void;
}

const defaultConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
};

// ============================================================
// ERROR HANDLING
// ============================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, body?: unknown): ApiError {
    return new ApiError(
      response.status,
      body?.code || 'UNKNOWN_ERROR',
      body?.message || response.statusText,
      body?.details
    );
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}

// ============================================================
// SCHEMAS (Zod Validation)
// ============================================================

// Sphere Schema
export const SphereCodeSchema = z.enum([
  'PERSONAL',
  'BUSINESS',
  'GOVERNMENT',
  'STUDIO',
  'COMMUNITY',
  'SOCIAL',
  'ENTERTAINMENT',
  'TEAM',
]);

export type SphereCode = z.infer<typeof SphereCodeSchema>;

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  role: z.enum(['user', 'admin', 'superadmin']),
  preferences: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// Thread Schema
export const ThreadSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  sphereCode: SphereCodeSchema,
  userId: z.string().uuid(),
  tokenBudget: z.number().int().positive(),
  tokensUsed: z.number().int().nonnegative(),
  encodingEnabled: z.boolean(),
  status: z.enum(['active', 'archived', 'deleted']),
  messageCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Thread = z.infer<typeof ThreadSchema>;

// Message Schema
export const MessageSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  tokensUsed: z.number().int().nonnegative(),
  encoded: z.boolean(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
});

export type Message = z.infer<typeof MessageSchema>;

// Task Schema
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  sphereCode: SphereCodeSchema,
  userId: z.string().uuid(),
  status: z.enum(['todo', 'in_progress', 'done', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().uuid().optional(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

// Note Schema
export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  sphereCode: SphereCodeSchema,
  userId: z.string().uuid(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Note = z.infer<typeof NoteSchema>;

// Project Schema
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  sphereCode: SphereCodeSchema,
  userId: z.string().uuid(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  tokenBudget: z.number().int().positive(),
  tokensUsed: z.number().int().nonnegative(),
  memberIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Meeting Schema
export const MeetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  sphereCode: SphereCodeSchema,
  organizerId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  tokenBudget: z.number().int().positive(),
  tokensUsed: z.number().int().nonnegative(),
  participantIds: z.array(z.string().uuid()),
  recordingUrl: z.string().url().optional(),
  transcriptId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Meeting = z.infer<typeof MeetingSchema>;

// Agent Schema
export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['orchestrator', 'specialist', 'assistant']),
  description: z.string(),
  capabilities: z.array(z.string()),
  tokenCostPerMessage: z.number().int().positive(),
  status: z.enum(['available', 'busy', 'disabled']),
  encodingCompatible: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Agent = z.infer<typeof AgentSchema>;

// Token Budget Schema
export const TokenBudgetSchema = z.object({
  sphereCode: SphereCodeSchema,
  userId: z.string().uuid(),
  allocated: z.number().int().positive(),
  used: z.number().int().nonnegative(),
  remaining: z.number().int().nonnegative(),
  lastUpdated: z.string().datetime(),
});

export type TokenBudget = z.infer<typeof TokenBudgetSchema>;

// Audit Entry Schema
export const AuditEntrySchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  userId: z.string().uuid(),
  sphereCode: SphereCodeSchema,
  resourceType: z.string(),
  resourceId: z.string(),
  details: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
});

export type AuditEntry = z.infer<typeof AuditEntrySchema>;

// ============================================================
// REQUEST/RESPONSE TYPES
// ============================================================

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Threads
export interface CreateThreadRequest {
  title: string;
  sphereCode: SphereCode;
  tokenBudget?: number;
  encodingEnabled?: boolean;
}

export interface UpdateThreadRequest {
  title?: string;
  tokenBudget?: number;
  encodingEnabled?: boolean;
  status?: 'active' | 'archived';
}

export interface SendMessageRequest {
  content: string;
  encode?: boolean;
}

// Tasks
export interface CreateTaskRequest {
  title: string;
  description?: string;
  sphereCode: SphereCode;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
}

// Notes
export interface CreateNoteRequest {
  title: string;
  content: string;
  sphereCode: SphereCode;
  tags?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

// Projects
export interface CreateProjectRequest {
  name: string;
  description?: string;
  sphereCode: SphereCode;
  startDate?: string;
  endDate?: string;
  tokenBudget?: number;
  memberIds?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  tokenBudget?: number;
  memberIds?: string[];
}

// Meetings
export interface CreateMeetingRequest {
  title: string;
  description?: string;
  sphereCode: SphereCode;
  startTime: string;
  endTime: string;
  tokenBudget?: number;
  participantIds?: string[];
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  tokenBudget?: number;
  participantIds?: string[];
}

// Agents
export interface HireAgentRequest {
  agentId: string;
  sphereCode: SphereCode;
  budget: number;
}

// Token Budget
export interface AllocateTokensRequest {
  sphereCode: SphereCode;
  amount: number;
}

export interface TransferTokensRequest {
  fromSphere: SphereCode;
  toSphere: SphereCode;
  amount: number;
}

// Encoding
export interface EncodeRequest {
  text: string;
  level?: 'light' | 'standard' | 'aggressive';
}

export interface EncodeResponse {
  encoded: string;
  original: string;
  savings: number;
  quality: number;
}

// ============================================================
// API CLIENT CLASS
// ============================================================

export class ChenuApiClient {
  private config: ApiConfig;
  private accessToken: string | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Token Management
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  // Base Request Method
  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, any>;
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T>;
    } = {}
  ): Promise<T> {
    const { body, params, headers = {}, schema } = options;

    // Build URL with query params
    let url = `${this.config.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.accessToken) {
      requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (this.config.apiKey) {
      requestHeaders['X-API-Key'] = this.config.apiKey;
    }

    // Build request
    let requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    // Apply request interceptor
    if (this.config.onRequest) {
      requestInit = this.config.onRequest(requestInit);
    }

    // Execute with retry
    let lastError: Error | null = null;
    const maxRetries = this.config.retries || 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(url, {
          ...requestInit,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Apply response interceptor
        if (this.config.onResponse) {
          this.config.onResponse(response);
        }

        // Parse response
        const responseBody = await response.json().catch(() => null);

        // Handle errors
        if (!response.ok) {
          const error = ApiError.fromResponse(response, responseBody);
          if (this.config.onError) {
            this.config.onError(error);
          }
          throw error;
        }

        // Validate with schema if provided
        if (schema) {
          return schema.parse(responseBody);
        }

        return responseBody as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry client errors
        if (error instanceof ApiError && error.status < 500) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError;
  }

  // ============================================================
  // AUTH ENDPOINTS
  // ============================================================

  auth = {
    login: (data: LoginRequest): Promise<LoginResponse> =>
      this.request('POST', '/auth/login', { body: data }),

    register: (data: RegisterRequest): Promise<LoginResponse> =>
      this.request('POST', '/auth/register', { body: data }),

    logout: (): Promise<void> =>
      this.request('POST', '/auth/logout'),

    refresh: (refreshToken: string): Promise<LoginResponse> =>
      this.request('POST', '/auth/refresh', { body: { refreshToken } }),

    me: (): Promise<User> =>
      this.request('GET', '/auth/me', { schema: UserSchema }),

    updateProfile: (data: Partial<User>): Promise<User> =>
      this.request('PATCH', '/auth/me', { body: data, schema: UserSchema }),

    changePassword: (oldPassword: string, newPassword: string): Promise<void> =>
      this.request('POST', '/auth/change-password', {
        body: { oldPassword, newPassword },
      }),

    forgotPassword: (email: string): Promise<void> =>
      this.request('POST', '/auth/forgot-password', { body: { email } }),

    resetPassword: (token: string, password: string): Promise<void> =>
      this.request('POST', '/auth/reset-password', { body: { token, password } }),
  };

  // ============================================================
  // SPHERES ENDPOINTS
  // ============================================================

  spheres = {
    list: (): Promise<{ code: SphereCode; name: string; icon: string }[]> =>
      this.request('GET', '/spheres'),

    get: (code: SphereCode): Promise<{
      code: SphereCode;
      name: string;
      icon: string;
      budget: TokenBudget;
      stats: Record<string, number>;
    }> =>
      this.request('GET', `/spheres/${code}`),

    getStats: (code: SphereCode): Promise<Record<string, number>> =>
      this.request('GET', `/spheres/${code}/stats`),
  };

  // ============================================================
  // THREADS ENDPOINTS
  // ============================================================

  threads = {
    list: (
      sphereCode: SphereCode,
      pagination?: PaginationParams
    ): Promise<PaginatedResponse<Thread>> =>
      this.request('GET', `/spheres/${sphereCode}/threads`, { params: pagination }),

    get: (sphereCode: SphereCode, threadId: string): Promise<Thread> =>
      this.request('GET', `/spheres/${sphereCode}/threads/${threadId}`, {
        schema: ThreadSchema,
      }),

    create: (data: CreateThreadRequest): Promise<Thread> =>
      this.request('POST', `/spheres/${data.sphereCode}/threads`, {
        body: data,
        schema: ThreadSchema,
      }),

    update: (
      sphereCode: SphereCode,
      threadId: string,
      data: UpdateThreadRequest
    ): Promise<Thread> =>
      this.request('PATCH', `/spheres/${sphereCode}/threads/${threadId}`, {
        body: data,
        schema: ThreadSchema,
      }),

    delete: (sphereCode: SphereCode, threadId: string): Promise<void> =>
      this.request('DELETE', `/spheres/${sphereCode}/threads/${threadId}`),

    archive: (sphereCode: SphereCode, threadId: string): Promise<Thread> =>
      this.request('POST', `/spheres/${sphereCode}/threads/${threadId}/archive`, {
        schema: ThreadSchema,
      }),

    // Messages
    getMessages: (
      sphereCode: SphereCode,
      threadId: string,
      pagination?: PaginationParams
    ): Promise<PaginatedResponse<Message>> =>
      this.request('GET', `/spheres/${sphereCode}/threads/${threadId}/messages`, {
        params: pagination,
      }),

    sendMessage: (
      sphereCode: SphereCode,
      threadId: string,
      data: SendMessageRequest
    ): Promise<Message> =>
      this.request('POST', `/spheres/${sphereCode}/threads/${threadId}/messages`, {
        body: data,
        schema: MessageSchema,
      }),

    // Encoding
    toggleEncoding: (
      sphereCode: SphereCode,
      threadId: string
    ): Promise<{ encodingEnabled: boolean }> =>
      this.request('POST', `/spheres/${sphereCode}/threads/${threadId}/encoding/toggle`),
  };

  // ============================================================
  // TASKS ENDPOINTS
  // ============================================================

  tasks = {
    list: (
      sphereCode: SphereCode,
      pagination?: PaginationParams & { status?: string; priority?: string }
    ): Promise<PaginatedResponse<Task>> =>
      this.request('GET', `/spheres/${sphereCode}/tasks`, { params: pagination }),

    get: (sphereCode: SphereCode, taskId: string): Promise<Task> =>
      this.request('GET', `/spheres/${sphereCode}/tasks/${taskId}`, {
        schema: TaskSchema,
      }),

    create: (data: CreateTaskRequest): Promise<Task> =>
      this.request('POST', `/spheres/${data.sphereCode}/tasks`, {
        body: data,
        schema: TaskSchema,
      }),

    update: (
      sphereCode: SphereCode,
      taskId: string,
      data: UpdateTaskRequest
    ): Promise<Task> =>
      this.request('PATCH', `/spheres/${sphereCode}/tasks/${taskId}`, {
        body: data,
        schema: TaskSchema,
      }),

    delete: (sphereCode: SphereCode, taskId: string): Promise<void> =>
      this.request('DELETE', `/spheres/${sphereCode}/tasks/${taskId}`),

    complete: (sphereCode: SphereCode, taskId: string): Promise<Task> =>
      this.request('POST', `/spheres/${sphereCode}/tasks/${taskId}/complete`, {
        schema: TaskSchema,
      }),
  };

  // ============================================================
  // NOTES ENDPOINTS
  // ============================================================

  notes = {
    list: (
      sphereCode: SphereCode,
      pagination?: PaginationParams & { tag?: string; search?: string }
    ): Promise<PaginatedResponse<Note>> =>
      this.request('GET', `/spheres/${sphereCode}/notes`, { params: pagination }),

    get: (sphereCode: SphereCode, noteId: string): Promise<Note> =>
      this.request('GET', `/spheres/${sphereCode}/notes/${noteId}`, {
        schema: NoteSchema,
      }),

    create: (data: CreateNoteRequest): Promise<Note> =>
      this.request('POST', `/spheres/${data.sphereCode}/notes`, {
        body: data,
        schema: NoteSchema,
      }),

    update: (
      sphereCode: SphereCode,
      noteId: string,
      data: UpdateNoteRequest
    ): Promise<Note> =>
      this.request('PATCH', `/spheres/${sphereCode}/notes/${noteId}`, {
        body: data,
        schema: NoteSchema,
      }),

    delete: (sphereCode: SphereCode, noteId: string): Promise<void> =>
      this.request('DELETE', `/spheres/${sphereCode}/notes/${noteId}`),

    addTag: (sphereCode: SphereCode, noteId: string, tag: string): Promise<Note> =>
      this.request('POST', `/spheres/${sphereCode}/notes/${noteId}/tags`, {
        body: { tag },
        schema: NoteSchema,
      }),

    removeTag: (sphereCode: SphereCode, noteId: string, tag: string): Promise<Note> =>
      this.request('DELETE', `/spheres/${sphereCode}/notes/${noteId}/tags/${tag}`, {
        schema: NoteSchema,
      }),
  };

  // ============================================================
  // PROJECTS ENDPOINTS
  // ============================================================

  projects = {
    list: (
      sphereCode: SphereCode,
      pagination?: PaginationParams & { status?: string }
    ): Promise<PaginatedResponse<Project>> =>
      this.request('GET', `/spheres/${sphereCode}/projects`, { params: pagination }),

    get: (sphereCode: SphereCode, projectId: string): Promise<Project> =>
      this.request('GET', `/spheres/${sphereCode}/projects/${projectId}`, {
        schema: ProjectSchema,
      }),

    create: (data: CreateProjectRequest): Promise<Project> =>
      this.request('POST', `/spheres/${data.sphereCode}/projects`, {
        body: data,
        schema: ProjectSchema,
      }),

    update: (
      sphereCode: SphereCode,
      projectId: string,
      data: UpdateProjectRequest
    ): Promise<Project> =>
      this.request('PATCH', `/spheres/${sphereCode}/projects/${projectId}`, {
        body: data,
        schema: ProjectSchema,
      }),

    delete: (sphereCode: SphereCode, projectId: string): Promise<void> =>
      this.request('DELETE', `/spheres/${sphereCode}/projects/${projectId}`),

    addMember: (
      sphereCode: SphereCode,
      projectId: string,
      userId: string
    ): Promise<Project> =>
      this.request('POST', `/spheres/${sphereCode}/projects/${projectId}/members`, {
        body: { userId },
        schema: ProjectSchema,
      }),

    removeMember: (
      sphereCode: SphereCode,
      projectId: string,
      userId: string
    ): Promise<Project> =>
      this.request('DELETE', `/spheres/${sphereCode}/projects/${projectId}/members/${userId}`, {
        schema: ProjectSchema,
      }),
  };

  // ============================================================
  // MEETINGS ENDPOINTS
  // ============================================================

  meetings = {
    list: (
      sphereCode: SphereCode,
      pagination?: PaginationParams & { status?: string; from?: string; to?: string }
    ): Promise<PaginatedResponse<Meeting>> =>
      this.request('GET', `/spheres/${sphereCode}/meetings`, { params: pagination }),

    get: (sphereCode: SphereCode, meetingId: string): Promise<Meeting> =>
      this.request('GET', `/spheres/${sphereCode}/meetings/${meetingId}`, {
        schema: MeetingSchema,
      }),

    create: (data: CreateMeetingRequest): Promise<Meeting> =>
      this.request('POST', `/spheres/${data.sphereCode}/meetings`, {
        body: data,
        schema: MeetingSchema,
      }),

    update: (
      sphereCode: SphereCode,
      meetingId: string,
      data: UpdateMeetingRequest
    ): Promise<Meeting> =>
      this.request('PATCH', `/spheres/${sphereCode}/meetings/${meetingId}`, {
        body: data,
        schema: MeetingSchema,
      }),

    delete: (sphereCode: SphereCode, meetingId: string): Promise<void> =>
      this.request('DELETE', `/spheres/${sphereCode}/meetings/${meetingId}`),

    start: (sphereCode: SphereCode, meetingId: string): Promise<Meeting> =>
      this.request('POST', `/spheres/${sphereCode}/meetings/${meetingId}/start`, {
        schema: MeetingSchema,
      }),

    end: (sphereCode: SphereCode, meetingId: string): Promise<Meeting> =>
      this.request('POST', `/spheres/${sphereCode}/meetings/${meetingId}/end`, {
        schema: MeetingSchema,
      }),

    cancel: (sphereCode: SphereCode, meetingId: string): Promise<Meeting> =>
      this.request('POST', `/spheres/${sphereCode}/meetings/${meetingId}/cancel`, {
        schema: MeetingSchema,
      }),

    addParticipant: (
      sphereCode: SphereCode,
      meetingId: string,
      userId: string
    ): Promise<Meeting> =>
      this.request('POST', `/spheres/${sphereCode}/meetings/${meetingId}/participants`, {
        body: { userId },
        schema: MeetingSchema,
      }),

    removeParticipant: (
      sphereCode: SphereCode,
      meetingId: string,
      userId: string
    ): Promise<Meeting> =>
      this.request('DELETE', `/spheres/${sphereCode}/meetings/${meetingId}/participants/${userId}`, {
        schema: MeetingSchema,
      }),
  };

  // ============================================================
  // AGENTS ENDPOINTS
  // ============================================================

  agents = {
    list: (): Promise<Agent[]> =>
      this.request('GET', '/agents'),

    get: (agentId: string): Promise<Agent> =>
      this.request('GET', `/agents/${agentId}`, { schema: AgentSchema }),

    available: (): Promise<Agent[]> =>
      this.request('GET', '/agents/available'),

    hire: (data: HireAgentRequest): Promise<{ agent: Agent; assignment: unknown }> =>
      this.request('POST', '/agents/hire', { body: data }),

    dismiss: (agentId: string, sphereCode: SphereCode): Promise<void> =>
      this.request('POST', `/agents/${agentId}/dismiss`, { body: { sphereCode } }),

    myAgents: (sphereCode: SphereCode): Promise<Agent[]> =>
      this.request('GET', `/spheres/${sphereCode}/agents`),
  };

  // ============================================================
  // TOKEN BUDGET ENDPOINTS
  // ============================================================

  budget = {
    get: (sphereCode: SphereCode): Promise<TokenBudget> =>
      this.request('GET', `/spheres/${sphereCode}/budget`, {
        schema: TokenBudgetSchema,
      }),

    getAll: (): Promise<TokenBudget[]> =>
      this.request('GET', '/budget'),

    allocate: (data: AllocateTokensRequest): Promise<TokenBudget> =>
      this.request('POST', '/budget/allocate', {
        body: data,
        schema: TokenBudgetSchema,
      }),

    transfer: (data: TransferTokensRequest): Promise<{
      from: TokenBudget;
      to: TokenBudget;
    }> =>
      this.request('POST', '/budget/transfer', { body: data }),

    history: (
      sphereCode: SphereCode,
      pagination?: PaginationParams
    ): Promise<PaginatedResponse<{
      id: string;
      type: string;
      amount: number;
      description: string;
      timestamp: string;
    }>> =>
      this.request('GET', `/spheres/${sphereCode}/budget/history`, {
        params: pagination,
      }),
  };

  // ============================================================
  // ENCODING ENDPOINTS
  // ============================================================

  encoding = {
    encode: (data: EncodeRequest): Promise<EncodeResponse> =>
      this.request('POST', '/encoding/encode', { body: data }),

    decode: (encoded: string): Promise<{ decoded: string }> =>
      this.request('POST', '/encoding/decode', { body: { encoded } }),

    estimate: (text: string): Promise<{ savings: number; quality: number }> =>
      this.request('POST', '/encoding/estimate', { body: { text } }),

    stats: (): Promise<{
      totalEncoded: number;
      totalSavings: number;
      averageQuality: number;
    }> =>
      this.request('GET', '/encoding/stats'),
  };

  // ============================================================
  // GOVERNANCE ENDPOINTS
  // ============================================================

  governance = {
    laws: (): Promise<{
      number: number;
      name: string;
      description: string;
      enforced: boolean;
    }[]> =>
      this.request('GET', '/governance/laws'),

    check: (action: string, context: Record<string, any>): Promise<{
      compliant: boolean;
      violations: string[];
    }> =>
      this.request('POST', '/governance/check', { body: { action, context } }),

    consents: (): Promise<{
      type: string;
      granted: boolean;
      grantedAt?: string;
    }[]> =>
      this.request('GET', '/governance/consents'),

    grantConsent: (type: string): Promise<void> =>
      this.request('POST', '/governance/consents', { body: { type } }),

    revokeConsent: (type: string): Promise<void> =>
      this.request('DELETE', `/governance/consents/${type}`),
  };

  // ============================================================
  // AUDIT ENDPOINTS
  // ============================================================

  audit = {
    list: (
      pagination?: PaginationParams & {
        sphereCode?: SphereCode;
        action?: string;
        from?: string;
        to?: string;
      }
    ): Promise<PaginatedResponse<AuditEntry>> =>
      this.request('GET', '/audit', { params: pagination }),

    get: (entryId: string): Promise<AuditEntry> =>
      this.request('GET', `/audit/${entryId}`, { schema: AuditEntrySchema }),

    export: (params: {
      sphereCode?: SphereCode;
      from?: string;
      to?: string;
      format?: 'json' | 'csv';
    }): Promise<Blob> =>
      this.request('GET', '/audit/export', { params }),
  };

  // ============================================================
  // NOVA ENDPOINTS (System Intelligence - NOT hired agent)
  // ============================================================

  nova = {
    chat: (message: string, context?: Record<string, any>): Promise<{
      response: string;
      tokensUsed: number;
      suggestions?: string[];
    }> =>
      this.request('POST', '/nova/chat', { body: { message, context } }),

    guidance: (topic: string): Promise<{
      title: string;
      content: string;
      relatedTopics: string[];
    }> =>
      this.request('GET', '/nova/guidance', { params: { topic } }),

    status: (): Promise<{
      active: boolean;
      capabilities: string[];
      lastActivity: string;
    }> =>
      this.request('GET', '/nova/status'),
  };

  // ============================================================
  // SEARCH ENDPOINTS
  // ============================================================

  search = {
    global: (query: string, options?: {
      sphereCode?: SphereCode;
      types?: string[];
      limit?: number;
    }): Promise<{
      results: {
        type: string;
        id: string;
        title: string;
        snippet: string;
        sphereCode: SphereCode;
        relevance: number;
      }[];
      total: number;
    }> =>
      this.request('GET', '/search', { params: { query, ...options } }),
  };

  // ============================================================
  // HEALTH ENDPOINTS
  // ============================================================

  health = {
    check: (): Promise<{
      status: 'healthy' | 'degraded' | 'unhealthy';
      services: Record<string, boolean>;
      timestamp: string;
    }> =>
      this.request('GET', '/health'),

    ready: (): Promise<{ ready: boolean }> =>
      this.request('GET', '/health/ready'),

    live: (): Promise<{ live: boolean }> =>
      this.request('GET', '/health/live'),
  };
}

// ============================================================
// DEFAULT INSTANCE
// ============================================================

export const api = new ChenuApiClient();

export default api;
