/**
 * CHE·NU™ - API SERVICE
 * Central API client for all backend communication
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

// ═══════════════════════════════════════════════════════════════
// API CLIENT CLASS
// ═══════════════════════════════════════════════════════════════

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  // ─────────────────────────────────────────────────────────────
  // Token Management
  // ─────────────────────────────────────────────────────────────

  private loadToken() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chenu-auth-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.authToken = parsed?.state?.tokens?.accessToken || null;
        } catch {
          this.authToken = null;
        }
      }
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  // ─────────────────────────────────────────────────────────────
  // Request Helpers
  // ─────────────────────────────────────────────────────────────

  private getHeaders(options?: RequestOptions): Headers {
    const headers = new Headers(DEFAULT_HEADERS);
    
    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    
    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }
    
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.buildUrl(path, options?.params), {
        method,
        headers: this.getHeaders(options),
        body: body ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null as T,
          success: false,
          error: data.detail || data.message || `Error ${response.status}`,
        };
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // HTTP Methods
  // ─────────────────────────────────────────────────────────────

  async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

// ═══════════════════════════════════════════════════════════════
// API INSTANCE
// ═══════════════════════════════════════════════════════════════

export const api = new ApiClient();

// ═══════════════════════════════════════════════════════════════
// SERVICE MODULES
// ═══════════════════════════════════════════════════════════════

// Auth Service
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: unknown; tokens: unknown }>('/auth/login', { email, password }),

  register: (data: { email: string; password: string; username: string; displayName: string }) =>
    api.post<{ user: unknown; tokens: unknown }>('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post<{ tokens: unknown }>('/auth/refresh', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  getProfile: () =>
    api.get<{ user: unknown }>('/auth/me'),

  updateProfile: (data: Partial<any>) =>
    api.patch<{ user: unknown }>('/auth/me', data),
};

// Thread Service
export const threadService = {
  list: (sphereId?: string, status?: string, page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<any>>('/threads', {
      params: { ...(sphereId && { sphereId }), ...(status && { status }), page, pageSize },
    }),

  get: (id: string) =>
    api.get<any>(`/threads/${id}`),

  create: (data: { title: string; sphereId: string; description?: string; tokenBudget?: number }) =>
    api.post<any>('/threads', data),

  update: (id: string, data: Partial<any>) =>
    api.patch<any>(`/threads/${id}`, data),

  delete: (id: string) =>
    api.delete(`/threads/${id}`),

  archive: (id: string) =>
    api.post(`/threads/${id}/archive`),

  addMessage: (threadId: string, message: { role: string; content: string }) =>
    api.post<any>(`/threads/${threadId}/messages`, message),

  addDecision: (threadId: string, decision: Record<string, unknown>) =>
    api.post<any>(`/threads/${threadId}/decisions`, decision),
};

// Token Service
export const tokenService = {
  getBalance: () =>
    api.get<{ balance: number }>('/tokens/balance'),

  getBudgets: (sphereId?: string) =>
    api.get<any[]>('/tokens/budgets', { params: sphereId ? { sphereId } : undefined }),

  createBudget: (data: { name: string; sphereId: string; amount: number; period: string }) =>
    api.post<any>('/tokens/budgets', data),

  allocate: (budgetId: string, amount: number, description: string) =>
    api.post(`/tokens/budgets/${budgetId}/allocate`, { amount, description }),

  consume: (budgetId: string, amount: number, threadId?: string, agentId?: string, description?: string) =>
    api.post(`/tokens/budgets/${budgetId}/consume`, { amount, threadId, agentId, description }),

  getTransactions: (budgetId?: string, limit = 50) =>
    api.get<any[]>('/tokens/transactions', { params: { ...(budgetId && { budgetId }), limit } }),

  getAnalytics: () =>
    api.get<any>('/tokens/analytics'),
};

// Agent Service
export const agentService = {
  list: (sphereId?: string) =>
    api.get<any[]>('/agents', { params: sphereId ? { sphereId } : undefined }),

  get: (id: string) =>
    api.get<any>(`/agents/${id}`),

  execute: (agentId: string, input: { prompt: string; threadId?: string; context?: Record<string, unknown> }) =>
    api.post<any>(`/agents/${agentId}/execute`, input),

  getCompatibility: (agentId: string, taskType: string) =>
    api.get<{ compatible: boolean; score: number }>(`/agents/${agentId}/compatibility`, {
      params: { taskType },
    }),
};

// Nova Service
export const novaService = {
  chat: (message: string, threadId?: string, sphereId?: string) =>
    api.post<{ response: string; tokensUsed: number }>('/nova/chat', {
      message,
      threadId,
      sphereId,
    }),

  getContext: (sphereId: string) =>
    api.get<any>(`/nova/context/${sphereId}`),

  getSuggestions: (query: string, limit = 5) =>
    api.get<string[]>('/nova/suggestions', { params: { query, limit } }),
};

// DataSpace Service
export const dataSpaceService = {
  list: (sphereId?: string) =>
    api.get<any[]>('/dataspaces', { params: sphereId ? { sphereId } : undefined }),

  get: (id: string) =>
    api.get<any>(`/dataspaces/${id}`),

  create: (data: { name: string; sphereId: string; schema?: Record<string, unknown> }) =>
    api.post<any>('/dataspaces', data),

  query: (id: string, query: string) =>
    api.post<any[]>(`/dataspaces/${id}/query`, { query }),

  insert: (id: string, records: Record<string, unknown>[]) =>
    api.post(`/dataspaces/${id}/records`, { records }),
};

// Meeting Service
export const meetingService = {
  list: (sphereId?: string, upcoming = true) =>
    api.get<any[]>('/meetings', { params: { sphereId, upcoming } }),

  get: (id: string) =>
    api.get<any>(`/meetings/${id}`),

  create: (data: { title: string; sphereId: string; startTime: string; endTime: string; attendees?: string[] }) =>
    api.post<any>('/meetings', data),

  update: (id: string, data: Partial<any>) =>
    api.patch<any>(`/meetings/${id}`, data),

  delete: (id: string) =>
    api.delete(`/meetings/${id}`),

  addNote: (meetingId: string, note: string) =>
    api.post(`/meetings/${meetingId}/notes`, { note }),
};

// Governance Service
export const governanceService = {
  validateExecution: (request: {
    threadId: string;
    intent: string;
    targetAgents: string[];
    estimatedTokens: number;
  }) =>
    api.post<{ allowed: boolean; warnings: unknown[]; blockers: unknown[] }>('/governance/validate', request),

  getRules: (sphereId?: string) =>
    api.get<any[]>('/governance/rules', { params: sphereId ? { sphereId } : undefined }),

  createRule: (rule: { name: string; type: string; threshold: number; action: string; sphereId?: string }) =>
    api.post<any>('/governance/rules', rule),

  getAuditLog: (threadId?: string, limit = 50) =>
    api.get<any[]>('/governance/audit', { params: { threadId, limit } }),
};

// Export types
export type { ApiResponse, PaginatedResponse, RequestOptions };

export default api;
