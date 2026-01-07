/**
 * ============================================================================
 * CHE·NU™ V70 — HTTP CLIENT
 * ============================================================================
 * Central HTTP client for all API communications
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

import { API_CONFIG, getApiUrl, type RequestOptions, type ApiResponse, type ApiErrorResponse } from './config';

// ============================================================================
// ERROR CLASS
// ============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(status: number, body: ApiErrorResponse): ApiError {
    return new ApiError(
      status,
      body.code || 'UNKNOWN_ERROR',
      body.message || 'An error occurred',
      body.details
    );
  }

  isUnauthorized(): boolean { return this.status === 401; }
  isForbidden(): boolean { return this.status === 403; }
  isNotFound(): boolean { return this.status === 404; }
  isCheckpointRequired(): boolean { return this.status === 423; } // CANON: Checkpoint blocking
  isValidationError(): boolean { return this.status === 400 || this.status === 422; }
  isServerError(): boolean { return this.status >= 500; }
}

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh?: string) => {
  accessToken = access;
  if (refresh) refreshToken = refresh;
  // Persist to localStorage
  localStorage.setItem('chenu_access_token', access);
  if (refresh) localStorage.setItem('chenu_refresh_token', refresh);
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem('chenu_access_token');
  }
  return accessToken;
};

export const getRefreshToken = (): string | null => {
  if (!refreshToken) {
    refreshToken = localStorage.getItem('chenu_refresh_token');
  }
  return refreshToken;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('chenu_access_token');
  localStorage.removeItem('chenu_refresh_token');
};

// ============================================================================
// HTTP CLIENT
// ============================================================================

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.maxRetries = API_CONFIG.MAX_RETRIES;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const method = options.method || 'GET';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: options.signal || controller.signal,
    };

    if (options.body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // Handle response
        if (response.ok) {
          // Check if response has content
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            return await response.json();
          }
          return {} as T;
        }

        // Handle errors
        const errorBody = await response.json().catch(() => ({
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
        }));

        // Special handling for checkpoint required (HTTP 423)
        if (response.status === 423) {
          throw new ApiError(
            423,
            'CHECKPOINT_REQUIRED',
            'Human approval required before proceeding',
            errorBody
          );
        }

        // Handle 401 - try refresh
        if (response.status === 401 && getRefreshToken()) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            attempt++;
            continue;
          }
        }

        throw ApiError.fromResponse(response.status, errorBody);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          throw error;
        }

        lastError = error as Error;
        
        // Don't retry on abort
        if ((error as Error).name === 'AbortError') {
          throw new ApiError(0, 'TIMEOUT', 'Request timed out');
        }

        attempt++;
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new ApiError(0, 'NETWORK_ERROR', 'Network request failed');
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    try {
      const response = await fetch(getApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.access_token, data.refresh_token);
        return true;
      }
    } catch {
      // Refresh failed
    }

    clearTokens();
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Singleton instance
export const httpClient = new HttpClient();

export default httpClient;
