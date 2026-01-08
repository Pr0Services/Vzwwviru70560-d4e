/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — UNIFIED API CLIENT
 * ═══════════════════════════════════════════════════════════════════════════
 * Client HTTP unifié pour toutes les requêtes API
 * Remplace: api.ts, api-client.ts, api.client.ts
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { API_CONFIG } from '../config/api.config';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiRequestOptions extends RequestInit {
  /** Skip authentication header */
  skipAuth?: boolean;
  /** Custom timeout (ms) */
  timeout?: number;
  /** Retry on failure */
  retry?: boolean;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Check if error is authentication related */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** Check if error is a checkpoint (HTTP 423) */
  isCheckpoint(): boolean {
    return this.status === 423;
  }

  /** Check if error is a validation error */
  isValidationError(): boolean {
    return this.status === 422;
  }

  /** Check if error is a server error */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /** Check if error is a network error */
  isNetworkError(): boolean {
    return this.status === 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

const TOKEN_KEY = 'chenu_access_token';
const REFRESH_TOKEN_KEY = 'chenu_refresh_token';

export const tokenManager = {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// API CLIENT CLASS
// ═══════════════════════════════════════════════════════════════════════════

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.FULL_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Build request headers
   */
  private buildHeaders(options: ApiRequestOptions): Headers {
    const headers = new Headers(options.headers);
    
    // Set Content-Type if not already set and we have a body
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add Authorization header if authenticated and not skipping
    if (!options.skipAuth) {
      const token = tokenManager.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    return headers;
  }

  /**
   * Handle token refresh
   */
  private async refreshAccessToken(): Promise<boolean> {
    // If already refreshing, wait for the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          return false;
        }

        const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          tokenManager.clearTokens();
          return false;
        }

        const data = await response.json();
        tokenManager.setTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        tokenManager.clearTokens();
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Execute request with timeout
   */
  private async executeWithTimeout<T>(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type') || '';
    
    // Handle no content
    if (response.status === 204 || contentType.length === 0) {
      return {} as T;
    }
    
    // Handle JSON
    if (contentType.includes('application/json')) {
      return response.json();
    }
    
    // Handle text
    if (contentType.includes('text/')) {
      return response.text() as unknown as T;
    }
    
    // Handle blob (files, images)
    if (contentType.includes('application/octet-stream') || 
        contentType.includes('image/') ||
        contentType.includes('application/pdf')) {
      return response.blob() as unknown as T;
    }
    
    // Default to JSON
    return response.json();
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let message = `HTTP Error ${response.status}`;
    let code: string | undefined;
    let details: Record<string, unknown> | undefined;

    try {
      const errorData = await response.json() as ApiErrorResponse;
      message = errorData.message || message;
      code = errorData.code;
      details = errorData.details;
    } catch {
      // Response body is not JSON
      message = response.statusText || message;
    }

    throw new ApiError(response.status, message, code, details);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC REQUEST METHOD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Main request method
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      skipAuth = false,
      timeout = this.defaultTimeout,
      retry = true,
      params,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const headers = this.buildHeaders({ ...options, skipAuth });

    try {
      let response = await this.executeWithTimeout<T>(
        url,
        { ...fetchOptions, headers },
        timeout
      );

      // Handle 401 - Try to refresh token
      if (response.status === 401 && !skipAuth && retry) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          const newHeaders = this.buildHeaders({ ...options, skipAuth: false });
          response = await this.executeWithTimeout<T>(
            url,
            { ...fetchOptions, headers: newHeaders },
            timeout
          );
        }
      }

      // Handle error responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse and return response
      return this.parseResponse<T>(response);
      
    } catch (error) {
      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(0, 'Request timeout', 'TIMEOUT');
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Network error - Unable to connect to server', 'NETWORK_ERROR');
      }
      
      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Wrap unknown errors
      throw new ApiError(0, (error as Error).message || 'Unknown error', 'UNKNOWN');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HTTP METHOD SHORTCUTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: unknown, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if server is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get(API_CONFIG.ENDPOINTS.SYSTEM.HEALTH, { skipAuth: true, timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Upload file
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    // Remove Content-Type to let browser set it with boundary
    const headers = new Headers(options.headers);
    headers.delete('Content-Type');

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData as unknown as BodyInit,
      headers,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const apiClient = new ApiClient();

// Default export for convenience
export default apiClient;
