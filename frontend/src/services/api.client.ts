// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — API CLIENT SERVICE
// Sprint 2: Typed API client for all backend endpoints
// Governance-aware with token tracking
// ═══════════════════════════════════════════════════════════════════════════════

import type { SphereId } from '../constants/canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  requestId: string;
  tokensUsed: number;
  latencyMs: number;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Sphere {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  order: number;
}

export interface SphereStats {
  sphereId: SphereId;
  totalThreads: number;
  totalTokensUsed: number;
  activeAgents: number;
  lastActivity: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Thread {
  id: string;
  title: string;
  type: 'chat' | 'agent' | 'task';
  sphereId: SphereId;
  status: 'active' | 'archived';
  tokenBudget: number;
  tokensUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensUsed: number;
  createdAt: string;
}

export interface CreateThreadRequest {
  title: string;
  sphereId: SphereId;
  type?: 'chat' | 'agent' | 'task';
  tokenBudget?: number;
}

export interface SendMessageRequest {
  threadId: string;
  content: string;
  agentId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Agent {
  id: string;
  name: string;
  type: 'nova' | 'orchestrator' | 'specialist' | 'worker';
  level: 'L0' | 'L1' | 'L2' | 'L3';
  status: 'idle' | 'busy' | 'offline';
  isSystem: boolean;
  isHired: boolean;
  costPerToken: number;
  capabilities: string[];
  sphereScopes: SphereId[];
}

export interface AgentTask {
  id: string;
  agentId: string;
  threadId?: string;
  input: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tokensUsed: number;
  startedAt?: string;
  completedAt?: string;
}

export interface HireAgentRequest {
  agentId: string;
}

export interface CreateTaskRequest {
  agentId: string;
  input: string;
  sphereId: SphereId;
  threadId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface TokenBudget {
  total: number;
  used: number;
  remaining: number;
  reserved: number;
  dailyLimit: number;
  warningThreshold: number;
}

export interface ScopeLock {
  active: boolean;
  level: 'selection' | 'document' | 'project' | 'sphere' | 'global';
  targetId: string | null;
  targetName: string | null;
  lockedAt: string | null;
  lockedBy: string | null;
}

export interface GovernanceStatus {
  enabled: boolean;
  strictMode: boolean;
  budget: TokenBudget;
  scopeLock: ScopeLock;
  pendingApprovals: number;
  activeViolations: number;
}

export interface ValidateExecutionRequest {
  estimatedTokens: number;
  agentId?: string;
  sphereId?: SphereId;
}

export interface ValidateExecutionResponse {
  allowed: boolean;
  reason?: string;
  requiresApproval: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'enterprise';
  tokenBalance: number;
  subscription: 'free' | 'pro' | 'enterprise';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API CLIENT CLASS
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env?.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiClient {
  private config: ApiConfig;
  private accessToken: string | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getConfig(): ApiConfig {
    return { ...this.config };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Base Request Method
  // ─────────────────────────────────────────────────────────────────────────────

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const startTime = Date.now();

    const headers: Record<string, string> = {
      ...this.config.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: responseData.message || response.statusText,
            details: responseData.details,
          },
          meta: {
            requestId: response.headers.get('x-request-id') || '',
            tokensUsed: 0,
            latencyMs,
            timestamp: new Date().toISOString(),
          },
        };
      }

      return {
        success: true,
        data: responseData.data || responseData,
        meta: {
          requestId: response.headers.get('x-request-id') || responseData.requestId || '',
          tokensUsed: responseData.tokensUsed || 0,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      
      return {
        success: false,
        error: {
          code: error instanceof Error && error.name === 'AbortError' 
            ? 'TIMEOUT' 
            : 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        meta: {
          requestId: '',
          tokensUsed: 0,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HTTP Methods
  // ─────────────────────────────────────────────────────────────────────────────

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data);
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Auth Endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/login', request);
    if (response.success && response.data) {
      this.setAccessToken(response.data.accessToken);
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.post<void>('/auth/logout');
    this.setAccessToken(null);
    return response;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/refresh', { refreshToken });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sphere Endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  async getSpheres(): Promise<ApiResponse<Sphere[]>> {
    return this.get<Sphere[]>('/spheres');
  }

  async getSphere(sphereId: SphereId): Promise<ApiResponse<Sphere>> {
    return this.get<Sphere>(`/spheres/${sphereId}`);
  }

  async getSphereStats(sphereId: SphereId): Promise<ApiResponse<SphereStats>> {
    return this.get<SphereStats>(`/spheres/${sphereId}/stats`);
  }

  async unlockSphere(sphereId: SphereId): Promise<ApiResponse<Sphere>> {
    return this.post<Sphere>(`/spheres/${sphereId}/unlock`);
  }

  async lockSphere(sphereId: SphereId): Promise<ApiResponse<Sphere>> {
    return this.post<Sphere>(`/spheres/${sphereId}/lock`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Thread Endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  async getThreads(sphereId?: SphereId): Promise<ApiResponse<Thread[]>> {
    const query = sphereId ? `?sphereId=${sphereId}` : '';
    return this.get<Thread[]>(`/threads${query}`);
  }

  async getThread(threadId: string): Promise<ApiResponse<Thread>> {
    return this.get<Thread>(`/threads/${threadId}`);
  }

  async createThread(request: CreateThreadRequest): Promise<ApiResponse<Thread>> {
    return this.post<Thread>('/threads', request);
  }

  async archiveThread(threadId: string): Promise<ApiResponse<Thread>> {
    return this.patch<Thread>(`/threads/${threadId}`, { status: 'archived' });
  }

  async deleteThread(threadId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/threads/${threadId}`);
  }

  async getMessages(threadId: string): Promise<ApiResponse<ThreadMessage[]>> {
    return this.get<ThreadMessage[]>(`/threads/${threadId}/messages`);
  }

  async sendMessage(request: SendMessageRequest): Promise<ApiResponse<ThreadMessage>> {
    return this.post<ThreadMessage>(`/threads/${request.threadId}/messages`, {
      content: request.content,
      agentId: request.agentId,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agent Endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  async getNova(): Promise<ApiResponse<Agent>> {
    return this.get<Agent>('/agents/nova');
  }

  async getAvailableAgents(): Promise<ApiResponse<Agent[]>> {
    return this.get<Agent[]>('/agents/available');
  }

  async getHiredAgents(): Promise<ApiResponse<Agent[]>> {
    return this.get<Agent[]>('/agents/hired');
  }

  async getAgent(agentId: string): Promise<ApiResponse<Agent>> {
    return this.get<Agent>(`/agents/${agentId}`);
  }

  async hireAgent(request: HireAgentRequest): Promise<ApiResponse<Agent>> {
    return this.post<Agent>('/agents/hire', request);
  }

  async fireAgent(agentId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/agents/${agentId}/hire`);
  }

  async createTask(request: CreateTaskRequest): Promise<ApiResponse<AgentTask>> {
    return this.post<AgentTask>('/agents/tasks', request);
  }

  async getTask(taskId: string): Promise<ApiResponse<AgentTask>> {
    return this.get<AgentTask>(`/agents/tasks/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<ApiResponse<AgentTask>> {
    return this.patch<AgentTask>(`/agents/tasks/${taskId}`, { status: 'cancelled' });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Governance Endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  async getGovernanceStatus(): Promise<ApiResponse<GovernanceStatus>> {
    return this.get<GovernanceStatus>('/governance/status');
  }

  async getBudget(): Promise<ApiResponse<TokenBudget>> {
    return this.get<TokenBudget>('/governance/budget');
  }

  async validateExecution(
    request: ValidateExecutionRequest
  ): Promise<ApiResponse<ValidateExecutionResponse>> {
    return this.post<ValidateExecutionResponse>('/governance/validate', request);
  }

  async lockScope(
    level: ScopeLock['level'],
    targetId: string,
    targetName: string
  ): Promise<ApiResponse<ScopeLock>> {
    return this.post<ScopeLock>('/governance/scope/lock', {
      level,
      targetId,
      targetName,
    });
  }

  async unlockScope(): Promise<ApiResponse<void>> {
    return this.post<void>('/governance/scope/unlock');
  }

  async useTokens(amount: number, sphereId?: SphereId): Promise<ApiResponse<TokenBudget>> {
    return this.post<TokenBudget>('/governance/tokens/use', { amount, sphereId });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Health & Meta
  // ─────────────────────────────────────────────────────────────────────────────

  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.get<{ status: string; version: string }>('/health');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const apiClient = new ApiClient();

export default ApiClient;
