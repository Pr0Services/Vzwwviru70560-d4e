/**
 * CHE·NU™ — API Client
 * Real backend connection
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    type: string;
  };
  timestamp: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username?: string;
  display_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  token_balance?: number;
}

export interface LoginResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

// ═══════════════════════════════════════════════════════════════
// HTTP CLIENT
// ═══════════════════════════════════════════════════════════════

class ChenuApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Restore token from localStorage
    this.accessToken = localStorage.getItem('chenu_access_token');
  }

  // Set auth token
  setToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('chenu_access_token', token);
    } else {
      localStorage.removeItem('chenu_access_token');
    }
  }

  // Get headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  // Generic request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ─────────────────────────────────────────────────────────────
  // AUTH ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (response.tokens?.access_token) {
      this.setToken(response.tokens.access_token);
    }
    
    return response;
  }

  async register(data: {
    email: string;
    password: string;
    username: string;
    display_name: string;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token
    if (response.tokens?.access_token) {
      this.setToken(response.tokens.access_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>('/users/me');
  }

  // ─────────────────────────────────────────────────────────────
  // SPHERES ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getSpheres() {
    return this.request('/spheres');
  }

  async getSphere(sphereId: string) {
    return this.request(`/spheres/${sphereId}`);
  }

  async getBureauSections(sphereId: string) {
    return this.request(`/spheres/${sphereId}/bureau`);
  }

  // ─────────────────────────────────────────────────────────────
  // TOKENS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getTokenBalance() {
    return this.request('/tokens/balance');
  }

  async getTokenHistory(limit = 50) {
    return this.request(`/tokens/history?limit=${limit}`);
  }

  // ─────────────────────────────────────────────────────────────
  // THREADS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getThreads(sphereId?: string) {
    const query = sphereId ? `?sphere_id=${sphereId}` : '';
    return this.request(`/threads${query}`);
  }

  async getThread(threadId: string) {
    return this.request(`/threads/${threadId}`);
  }

  async createThread(data: { title: string; sphere_id: string; budget?: number }) {
    return this.request('/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NOVA ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async novaChat(message: string, threadId?: string, sphereId?: string) {
    return this.request('/nova/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        thread_id: threadId,
        sphere_id: sphereId,
      }),
    });
  }

  async novaSuggestions(query: string, limit = 5) {
    return this.request(`/nova/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // ─────────────────────────────────────────────────────────────
  // TASKS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getTasks(sphereId?: string) {
    const query = sphereId ? `?sphere_id=${sphereId}` : '';
    return this.request(`/tasks${query}`);
  }

  async createTask(data: {
    title: string;
    description?: string;
    sphere_id: string;
    due_date?: string;
    priority?: string;
  }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(taskId: string, data: Partial<{ title: string; status: string; priority: string }>) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PROJECTS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getProjects(sphereId?: string) {
    const query = sphereId ? `?sphere_id=${sphereId}` : '';
    return this.request(`/projects${query}`);
  }

  async getProject(projectId: string) {
    return this.request(`/projects/${projectId}`);
  }

  async createProject(data: {
    name: string;
    description?: string;
    sphere_id: string;
    budget?: number;
  }) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NOTES ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getNotes(sphereId?: string) {
    const query = sphereId ? `?sphere_id=${sphereId}` : '';
    return this.request(`/notes${query}`);
  }

  async createNote(data: { title: string; content: string; sphere_id: string }) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MEETINGS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getMeetings(sphereId?: string) {
    const query = sphereId ? `?sphere_id=${sphereId}` : '';
    return this.request(`/meetings${query}`);
  }

  async createMeeting(data: {
    title: string;
    sphere_id: string;
    scheduled_at: string;
    duration_minutes?: number;
  }) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // AGENTS ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getAgents() {
    return this.request('/agents');
  }

  async hireAgent(agentId: string, sphereId?: string) {
    return this.request(`/agents/${agentId}/hire`, {
      method: 'POST',
      body: JSON.stringify({ sphere_id: sphereId }),
    });
  }

  async executeAgent(agentId: string, input: string, context?: Record<string, unknown>) {
    return this.request(`/agents/${agentId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input, context }),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HEALTH CHECK
  // ─────────────────────────────────────────────────────────────

  async healthCheck() {
    return this.request('/health');
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════

export const api = new ChenuApiClient(API_BASE_URL);

export default api;
