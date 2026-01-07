/**
 * ============================================================================
 * CHE·NU™ V70 — API CONFIGURATION
 * ============================================================================
 * Central configuration for connecting Frontend V68.6 to Backend V69
 * Principle: GOUVERNANCE > EXÉCUTION
 * ============================================================================
 */

// Environment configuration
export const API_CONFIG = {
  // Backend V69 base URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // API version prefix
  API_PREFIX: '/api/v1',
  
  // Timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // WebSocket URL
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
} as const;

// Full API URL helper
export const getApiUrl = (path: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${path}`;
};

// API Endpoints mapping to Backend V69 routes
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  READY: '/ready',
  LIVE: '/live',
  
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Simulations (Nova Pipeline)
  SIMULATIONS: {
    LIST: '/simulations',
    CREATE: '/simulations',
    GET: (id: string) => `/simulations/${id}`,
    RUN: (id: string) => `/simulations/${id}/run`,
    DELETE: (id: string) => `/simulations/${id}`,
  },
  
  // Scenarios
  SCENARIOS: {
    CREATE: '/scenarios',
    GET: (id: string) => `/scenarios/${id}`,
    COMPARE: '/scenarios/compare',
  },
  
  // Agents
  AGENTS: {
    LIST: '/agents',
    CREATE: '/agents',
    GET: (id: string) => `/agents/${id}`,
    ACTIVATE: (id: string) => `/agents/${id}/activate`,
    PAUSE: (id: string) => `/agents/${id}/pause`,
    ACTIONS: (id: string) => `/agents/${id}/actions`,
    HIERARCHY: '/agents/hierarchy',
  },
  
  // Checkpoints (Governance)
  CHECKPOINTS: {
    LIST: '/checkpoints',
    PENDING: '/checkpoints/pending',
    GET: (id: string) => `/checkpoints/${id}`,
    RESOLVE: (id: string) => `/checkpoints/${id}/resolve`,
  },
  
  // XR Packs
  XR: {
    GENERATE: '/xr-packs/generate',
    GET: (id: string) => `/xr-packs/${id}`,
    MANIFEST: (id: string) => `/xr-packs/${id}/manifest`,
    CHUNKS: (packId: string, chunkId: string) => `/xr-packs/${packId}/chunks/${chunkId}`,
    DOWNLOAD: (id: string) => `/xr-packs/${id}/download`,
  },
  
  // Causal Engine
  CAUSAL: {
    CREATE_DAG: '/causal/dags',
    GET_DAG: (id: string) => `/causal/dags/${id}`,
    ADD_NODE: (dagId: string) => `/causal/dags/${dagId}/nodes`,
    ADD_EDGE: (dagId: string) => `/causal/dags/${dagId}/edges`,
    INFERENCE: '/causal/inference',
  },
  
  // Audit
  AUDIT: {
    EVENTS: '/audit/events',
    REPORT: (simulationId: string) => `/audit/simulations/${simulationId}/report`,
    VERIFY: '/audit/verify',
  },
  
  // WebSocket
  WS: {
    SIMULATION: (simulationId: string) => `/ws/simulation/${simulationId}`,
    STATS: '/ws/stats',
  },
} as const;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request options
export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: string;
  requestId?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error response
export interface ApiErrorResponse {
  error: string;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export default API_CONFIG;
