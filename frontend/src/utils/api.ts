/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — API Utilities                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ═══════════════════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, headers: customHeaders, ...restOptions } = options;

    const url = this.buildUrl(path, params);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      ...restOptions,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(
        error.message || `HTTP ${response.status}`,
        error.code || 'API_ERROR',
        response.status
      );
    }

    const data = await response.json();
    
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  async get<T>(path: string, options?: ApiOptions): Promise<T> {
    const response = await this.request<T>('GET', path, options);
    return response.data;
  }

  async post<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    const response = await this.request<T>('POST', path, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  async put<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    const response = await this.request<T>('PUT', path, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  async patch<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    const response = await this.request<T>('PATCH', path, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.data;
  }

  async delete<T>(path: string, options?: ApiOptions): Promise<T> {
    const response = await this.request<T>('DELETE', path, options);
    return response.data;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const api = new ApiClient(API_URL);

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const formatters = {
  /**
   * Format a number as currency (EUR)
   */
  currency: (amount: number, currency = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format a date string
   */
  date: (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', options || {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  },

  /**
   * Format a time string
   */
  time: (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Format a date relative to now
   */
  relative: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return formatters.date(dateString);
  },

  /**
   * Format tokens with icon
   */
  tokens: (amount: number): string => {
    return `🪙 ${amount.toLocaleString('fr-FR')}`;
  },

  /**
   * Format file size
   */
  fileSize: (bytes: number): string => {
    const units = ['o', 'Ko', 'Mo', 'Go'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const validators = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Validate phone number (French format)
   */
  phone: (phone: string): boolean => {
    return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
  },

  /**
   * Validate required field
   */
  required: (value: unknown): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },

  /**
   * Validate min length
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Validate max length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const sphereUtils = {
  /**
   * Get sphere color
   */
  getColor: (sphereId: string): string => {
    const colors: Record<string, string> = {
      sphere_personal: '#3EB4A2',
      sphere_business: '#D8B26A',
      sphere_government: '#8D8371',
      sphere_studio: '#7A593A',
      sphere_community: '#3F7249',
      sphere_social: '#2F4C39',
      sphere_entertainment: '#D8B26A',
      sphere_team: '#3EB4A2',
      sphere_scholar: '#8D8371',
    };
    return colors[sphereId] || '#8D8371';
  },

  /**
   * Get sphere icon
   */
  getIcon: (sphereId: string): string => {
    const icons: Record<string, string> = {
      sphere_personal: '🏠',
      sphere_business: '💼',
      sphere_government: '🏛️',
      sphere_studio: '🎨',
      sphere_community: '👥',
      sphere_social: '📱',
      sphere_entertainment: '🎬',
      sphere_team: '🤝',
      sphere_scholar: '📚',
    };
    return icons[sphereId] || '🔵';
  },

  /**
   * Get sphere name
   */
  getName: (sphereId: string): string => {
    const names: Record<string, string> = {
      sphere_personal: 'Personnel',
      sphere_business: 'Business',
      sphere_government: 'Gouvernement',
      sphere_studio: 'Studio',
      sphere_community: 'Communauté',
      sphere_social: 'Social & Media',
      sphere_entertainment: 'Entertainment',
      sphere_team: 'My Team',
      sphere_scholar: 'Scholar',
    };
    return names[sphereId] || sphereId;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      logger.error('Failed to save to localStorage');
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};
