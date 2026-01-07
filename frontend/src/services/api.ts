// CHE·NU™ API Service — Complete API Client

import type { 
  User, Identity, Sphere, Thread, Message, Decision,
  Agent, AgentExecution, Workspace, DataSpace, MemoryItem,
  Meeting, Property, Lease, TokenBudget,
  ApiResponse, PaginatedResponse, SphereCode, BureauSection
} from '../types';

// ============================================================
// CONFIG
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

// ============================================================
// HTTP CLIENT
// ============================================================

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private identityId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('chenu_token');
    this.identityId = localStorage.getItem('chenu_identity');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('chenu_token', token);
    else localStorage.removeItem('chenu_token');
  }

  setIdentity(identityId: string | null) {
    this.identityId = identityId;
    if (identityId) localStorage.setItem('chenu_identity', identityId);
    else localStorage.removeItem('chenu_identity');
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = config;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Trace-Id': `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...headers,
    };

    if (this.token) requestHeaders['Authorization'] = `Bearer ${this.token}`;
    if (this.identityId) requestHeaders['X-Identity-Id'] = this.identityId;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error?.code || 'UNKNOWN_ERROR', data.error?.message || 'An error occurred', response.status);
    }

    return data.data;
  }

  // Convenience methods
  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'POST', body }); }
  patch<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'PATCH', body }); }
  put<T>(endpoint: string, body: unknown) { return this.request<T>(endpoint, { method: 'PUT', body }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'DELETE' }); }
}

class ApiError extends Error {
  constructor(public code: string, message: string, public statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================
// API INSTANCE
// ============================================================

const api = new ApiClient(API_BASE);

// ============================================================
// AUTH SERVICE
// ============================================================

export const authService = {
  async register(data: { email: string; password: string; display_name: string; locale?: 'fr' | 'en' }) {
    const result = await api.post<{ user: User; tokens: { access_token: string; refresh_token: string } }>('/auth/register', data);
    api.setToken(result.tokens.access_token);
    return result;
  },

  async login(data: { email: string; password: string }) {
    const result = await api.post<{ user: User; tokens: { access_token: string; refresh_token: string } }>('/auth/login', data);
    api.setToken(result.tokens.access_token);
    return result;
  },

  async logout() {
    await api.post('/auth/logout', {});
    api.setToken(null);
    api.setIdentity(null);
  },

  async refresh(refreshToken: string) {
    const result = await api.post<{ tokens: { access_token: string; refresh_token: string } }>('/auth/refresh', { refresh_token: refreshToken });
    api.setToken(result.tokens.access_token);
    return result;
  },

  async getProfile() {
    return api.get<{ user: User }>('/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword });
  }
};

// ============================================================
// IDENTITY SERVICE
// ============================================================

export const identityService = {
  async getIdentities() {
    return api.get<{ identities: Identity[] }>('/identities');
  },

  async getIdentity(id: string) {
    return api.get<{ identity: Identity }>(`/identities/${id}`);
  },

  async createIdentity(data: { sphere_id: string; name: string; description?: string }) {
    return api.post<{ id: string }>('/identities', data);
  },

  async updateIdentity(id: string, data: Partial<Identity>) {
    return api.patch<{ id: string }>(`/identities/${id}`, data);
  },

  async switchIdentity(id: string) {
    api.setIdentity(id);
    return api.get<{ identity: Identity }>(`/identities/${id}`);
  },

  async getSpheres() {
    return api.get<{ spheres: Sphere[] }>('/spheres');
  }
};

// ============================================================
// THREADS SERVICE
// ============================================================

export const threadsService = {
  async getThreads(params?: { dataspace_id?: string; thread_type?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Thread>>(`/threads?${query}`);
  },

  async getThread(id: string) {
    return api.get<{ thread: Thread }>(`/threads/${id}`);
  },

  async createThread(data: { title: string; description?: string; thread_type?: string; encoding_level?: string; token_budget?: number; tags?: string[] }) {
    return api.post<{ id: string; title: string }>('/threads', data);
  },

  async updateThread(id: string, data: Partial<Thread>) {
    return api.patch<{ id: string }>(`/threads/${id}`, data);
  },

  async deleteThread(id: string) {
    return api.delete(`/threads/${id}`);
  },

  async resolveThread(id: string) {
    return api.post<{ id: string; status: string }>(`/threads/${id}/resolve`, {});
  },

  async archiveThread(id: string) {
    return api.post<{ id: string; status: string }>(`/threads/${id}/archive`, {});
  },

  // Messages
  async getMessages(threadId: string, page = 1, limit = 50) {
    return api.get<{ messages: Message[]; total: number }>(`/threads/${threadId}/messages?page=${page}&limit=${limit}`);
  },

  async addMessage(threadId: string, data: { role: string; content: string; apply_encoding?: boolean }) {
    return api.post<{ id: string; tokens_used: number; encoding_savings: number }>(`/threads/${threadId}/messages`, data);
  },

  async updateMessage(threadId: string, messageId: string, content: string) {
    return api.patch<{ id: string }>(`/threads/${threadId}/messages/${messageId}`, { content });
  },

  async deleteMessage(threadId: string, messageId: string) {
    return api.delete(`/threads/${threadId}/messages/${messageId}`);
  },

  // Decisions
  async getDecisions(threadId: string) {
    return api.get<{ decisions: Decision[] }>(`/threads/${threadId}/decisions`);
  },

  async createDecision(threadId: string, data: { decision_type: string; title: string; description?: string; options: unknown[] }) {
    return api.post<{ id: string }>(`/threads/${threadId}/decisions`, data);
  },

  async makeDecision(decisionId: string, data: { selected_option: unknown; rationale?: string }) {
    return api.post<{ id: string; status: string }>(`/decisions/${decisionId}/decide`, data);
  },

  async getRecentDecisions(limit = 10) {
    return api.get<{ decisions: Decision[] }>(`/decisions/recent?limit=${limit}`);
  }
};

// ============================================================
// AGENTS SERVICE
// ============================================================

export const agentsService = {
  async getAgents(params?: { agent_level?: string; agent_type?: string; sphere_id?: string; is_active?: boolean; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Agent>>(`/agents?${query}`);
  },

  async getAgent(id: string) {
    return api.get<{ agent: Agent }>(`/agents/${id}`);
  },

  async getAgentByCode(code: string) {
    return api.get<{ agent: Agent }>(`/agents/code/${code}`);
  },

  async createAgent(data: { code: string; name_fr: string; name_en: string; agent_level: string; agent_type: string; capabilities?: string[]; system_prompt?: string }) {
    return api.post<{ id: string; code: string }>('/agents', data);
  },

  async updateAgent(id: string, data: Partial<Agent>) {
    return api.patch<{ id: string }>(`/agents/${id}`, data);
  },

  async deleteAgent(id: string) {
    return api.delete(`/agents/${id}`);
  },

  async activateAgent(id: string) {
    return api.post<{ id: string; is_active: boolean }>(`/agents/${id}/activate`, {});
  },

  async deactivateAgent(id: string) {
    return api.post<{ id: string; is_active: boolean }>(`/agents/${id}/deactivate`, {});
  },

  // Executions
  async executeAgent(agentId: string, data: { input_data: unknown; thread_id?: string; max_tokens?: number }) {
    return api.post<{ execution_id: string; status: string }>(`/agents/${agentId}/execute`, data);
  },

  async getExecutions(params?: { agent_id?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<AgentExecution>>(`/executions?${query}`);
  },

  async getExecution(id: string) {
    return api.get<{ execution: AgentExecution }>(`/executions/${id}`);
  },

  async cancelExecution(id: string) {
    return api.post(`/executions/${id}/cancel`, {});
  }
};

// ============================================================
// ENCODING SERVICE
// ============================================================

export const encodingService = {
  async encode(data: { text: string; level?: string; domain?: string }) {
    return api.post<{ original: string; encoded: string; original_tokens: number; encoded_tokens: number; savings_percent: number; quality_score: number }>('/encode', data);
  },

  async decode(data: { encoded_text: string; original_rules?: string[] }) {
    return api.post<{ decoded: string; confidence: number }>('/decode', data);
  },

  async analyze(data: { text: string; domain?: string }) {
    return api.post<{ token_count: number; potential_savings: Record<string, number>; recommended_level: string; detected_patterns: unknown[] }>('/analyze', data);
  },

  async getRules(params?: { rule_type?: string; is_active?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<any>>(`/rules?${query}`);
  }
};

// ============================================================
// WORKSPACE SERVICE
// ============================================================

export const workspaceService = {
  async getWorkspaces(params?: { workspace_type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Workspace>>(`/workspaces?${query}`);
  },

  async getWorkspace(id: string) {
    return api.get<{ workspace: Workspace }>(`/workspaces/${id}`);
  },

  async createWorkspace(data: { name: string; description?: string; workspace_type?: string }) {
    return api.post<{ id: string }>('/workspaces', data);
  },

  async updateWorkspace(id: string, data: Partial<Workspace>) {
    return api.patch<{ id: string }>(`/workspaces/${id}`, data);
  },

  async deleteWorkspace(id: string) {
    return api.delete(`/workspaces/${id}`);
  },

  async changeMode(id: string, mode: string) {
    return api.post<{ id: string; current_mode: string }>(`/workspaces/${id}/mode`, { mode });
  }
};

// ============================================================
// DATASPACE SERVICE
// ============================================================

export const dataspaceService = {
  async getDataSpaces(params?: { parent_id?: string; dataspace_type?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<DataSpace>>(`/dataspaces?${query}`);
  },

  async getDataSpace(id: string) {
    return api.get<{ dataspace: DataSpace }>(`/dataspaces/${id}`);
  },

  async createDataSpace(data: { name: string; description?: string; parent_id?: string; dataspace_type?: string }) {
    return api.post<{ id: string }>('/dataspaces', data);
  },

  async updateDataSpace(id: string, data: Partial<DataSpace>) {
    return api.patch<{ id: string }>(`/dataspaces/${id}`, data);
  },

  async deleteDataSpace(id: string) {
    return api.delete(`/dataspaces/${id}`);
  }
};

// ============================================================
// MEMORY SERVICE
// ============================================================

export const memoryService = {
  async getMemoryItems(params?: { memory_type?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<MemoryItem>>(`/memory?${query}`);
  },

  async createMemoryItem(data: { memory_type: string; content: string; memory_category?: string }) {
    return api.post<{ id: string }>('/memory', data);
  },

  async updateMemoryItem(id: string, data: Partial<MemoryItem>) {
    return api.patch<{ id: string }>(`/memory/${id}`, data);
  },

  async deleteMemoryItem(id: string) {
    return api.delete(`/memory/${id}`);
  },

  async getAuditLog(params?: { resource_type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<any>>(`/memory/audit?${query}`);
  }
};

// ============================================================
// MEETINGS SERVICE
// ============================================================

export const meetingsService = {
  async getMeetings(params?: { status?: string; from?: string; to?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Meeting>>(`/meetings?${query}`);
  },

  async getMeeting(id: string) {
    return api.get<{ meeting: Meeting }>(`/meetings/${id}`);
  },

  async createMeeting(data: { title: string; scheduled_at: string; duration_minutes?: number; meeting_type?: string }) {
    return api.post<{ id: string }>('/meetings', data);
  },

  async updateMeeting(id: string, data: Partial<Meeting>) {
    return api.patch<{ id: string }>(`/meetings/${id}`, data);
  },

  async deleteMeeting(id: string) {
    return api.delete(`/meetings/${id}`);
  }
};

// ============================================================
// IMMOBILIER SERVICE
// ============================================================

export const immobilierService = {
  async getProperties(params?: { property_type?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<Property>>(`/properties?${query}`);
  },

  async getProperty(id: string) {
    return api.get<{ property: Property }>(`/properties/${id}`);
  },

  async createProperty(data: { name: string; address: string; property_type: string }) {
    return api.post<{ id: string }>('/properties', data);
  },

  async getLeases(propertyId: string) {
    return api.get<{ leases: Lease[] }>(`/properties/${propertyId}/leases`);
  }
};

// ============================================================
// BUDGET SERVICE
// ============================================================

export const budgetService = {
  async getBudget() {
    return api.get<{ budget: TokenBudget }>('/budget');
  },

  async getTransactions(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return api.get<PaginatedResponse<any>>(`/budget/transactions?${query}`);
  }
};

// ============================================================
// EXPORT API CLIENT
// ============================================================

export { api, ApiError };
