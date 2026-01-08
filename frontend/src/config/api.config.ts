/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — API CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 * Source unique de vérité pour toutes les URLs et endpoints API
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Configuration centralisée de l'API
 */
export const API_CONFIG = {
  /** URL de base du backend */
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  /** Version de l'API */
  VERSION: 'v1',
  
  /** URL complète de l'API */
  get FULL_URL(): string {
    return `${this.BASE_URL}/api/${this.VERSION}`;
  },
  
  /** Timeout des requêtes en ms */
  TIMEOUT: 30000,
  
  /** Retry configuration */
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2,
  },
  
  /** Endpoints groupés par domaine */
  ENDPOINTS: {
    // ═══════════════════════════════════════════════════════════════════════
    // AUTH
    // ═══════════════════════════════════════════════════════════════════════
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════════════════
    DASHBOARD: {
      STATS: '/dashboard/stats',
      RECENT_ACTIVITY: '/dashboard/activity',
      QUICK_ACTIONS: '/dashboard/quick-actions',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // THREADS
    // ═══════════════════════════════════════════════════════════════════════
    THREADS: {
      LIST: '/threads',
      DETAIL: (id: string) => `/threads/${id}`,
      CREATE: '/threads',
      UPDATE: (id: string) => `/threads/${id}`,
      DELETE: (id: string) => `/threads/${id}`,
      ARCHIVE: (id: string) => `/threads/${id}/archive`,
      EVENTS: (id: string) => `/threads/${id}/events`,
      ADD_EVENT: (id: string) => `/threads/${id}/events`,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // AGENTS
    // ═══════════════════════════════════════════════════════════════════════
    AGENTS: {
      LIST: '/agents',
      DETAIL: (id: string) => `/agents/${id}`,
      HIRED: '/agents?status=hired',
      AVAILABLE: '/agents?status=available',
      HIRE: '/agents/hire',           // POST with { agent_id } in body
      FIRE: (id: string) => `/agents/${id}/dismiss`,  // POST
      SUGGESTED: '/agents/suggestions', // POST with context
      STATS: '/agents/stats',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // SPHERES
    // ═══════════════════════════════════════════════════════════════════════
    SPHERES: {
      LIST: '/spheres',
      DETAIL: (id: string) => `/spheres/${id}`,
      STATS: (id: string) => `/spheres/${id}/stats`,
      THREADS: (id: string) => `/spheres/${id}/threads`,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GOVERNANCE
    // ═══════════════════════════════════════════════════════════════════════
    GOVERNANCE: {
      CHECKPOINTS: '/checkpoints',
      CHECKPOINTS_PENDING: '/checkpoints/pending',
      CHECKPOINT_DETAIL: (id: string) => `/checkpoints/${id}`,
      RESOLVE: '/checkpoints/resolve',  // POST with { checkpoint_id, decision }
      METRICS: '/governance/metrics',
      SIGNALS: '/governance/signals',
      RESOLVE_SIGNAL: (id: string) => `/governance/signals/${id}/resolve`,
      AUDIT_LOG: '/governance/audit',
      POLICIES: '/governance/policies',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // DECISIONS
    // ═══════════════════════════════════════════════════════════════════════
    DECISIONS: {
      LIST: '/decisions',
      DETAIL: (id: string) => `/decisions/${id}`,
      CREATE: '/decisions',
      MAKE: '/decisions/make',  // POST to resolve a decision
      DEFER: (id: string) => `/decisions/${id}/defer`,  // POST
      STATS: '/decisions/stats',
      BY_THREAD: (threadId: string) => `/threads/${threadId}/decisions`,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // NOVA (Intelligence System)
    // ═══════════════════════════════════════════════════════════════════════
    NOVA: {
      STATUS: '/nova/status',
      CHAT: '/nova/chat',      // POST - main query endpoint
      QUERY: '/nova/chat',     // Alias for chat
      ANALYZE: '/nova/analyze',
      SUGGESTIONS: '/nova/suggestions',
      HISTORY: '/nova/history',
      CLEAR_HISTORY: '/nova/history',  // DELETE
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // XR (Mixed Reality)
    // ═══════════════════════════════════════════════════════════════════════
    XR: {
      ENVIRONMENTS: '/xr/environments',
      GENERATE: '/xr/generate',
      TEMPLATES: '/xr/templates',
      PREVIEW: (id: string) => `/xr/environments/${id}/preview`,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // MEMORY
    // ═══════════════════════════════════════════════════════════════════════
    MEMORY: {
      SEARCH: '/memory/search',
      RECENT: '/memory/recent',
      THREAD_MEMORY: (threadId: string) => `/threads/${threadId}/memory`,
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // TOKENS
    // ═══════════════════════════════════════════════════════════════════════
    TOKENS: {
      BALANCE: '/tokens/balance',
      USAGE: '/tokens/usage',
      HISTORY: '/tokens/history',
      BUDGET: '/tokens/budget',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/read-all',
      CLEAR: '/notifications/clear',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════════════
    SEARCH: {
      GLOBAL: '/search',
      THREADS: '/search/threads',
      AGENTS: '/search/agents',
      DECISIONS: '/search/decisions',
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // HEALTH & SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    SYSTEM: {
      HEALTH: '/health',
      VERSION: '/version',
      STATUS: '/status',
    },
  },
} as const;

/**
 * Query Keys pour TanStack Query
 * Utilisés pour le caching et l'invalidation
 */
export const QUERY_KEYS = {
  // Dashboard
  DASHBOARD_STATS: ['dashboard', 'stats'] as const,
  DASHBOARD_ACTIVITY: ['dashboard', 'activity'] as const,
  
  // Threads
  THREADS: ['threads'] as const,
  THREAD: (id: string) => ['threads', id] as const,
  THREAD_EVENTS: (id: string) => ['threads', id, 'events'] as const,
  
  // Agents
  AGENTS: ['agents'] as const,
  AGENT: (id: string) => ['agents', id] as const,
  AGENTS_HIRED: ['agents', 'hired'] as const,
  AGENTS_SUGGESTED: ['agents', 'suggested'] as const,
  
  // Spheres
  SPHERES: ['spheres'] as const,
  SPHERE: (id: string) => ['spheres', id] as const,
  SPHERE_STATS: (id: string) => ['spheres', id, 'stats'] as const,
  
  // Governance
  CHECKPOINTS: ['governance', 'checkpoints'] as const,
  CHECKPOINT: (id: string) => ['governance', 'checkpoints', id] as const,
  AUDIT_LOG: ['governance', 'audit-log'] as const,
  
  // Decisions
  DECISIONS: ['decisions'] as const,
  DECISION: (id: string) => ['decisions', id] as const,
  
  // Nova
  NOVA_STATUS: ['nova', 'status'] as const,
  NOVA_HISTORY: ['nova', 'history'] as const,
  
  // XR
  XR_ENVIRONMENTS: ['xr', 'environments'] as const,
  XR_TEMPLATES: ['xr', 'templates'] as const,
  
  // Tokens
  TOKEN_BALANCE: ['tokens', 'balance'] as const,
  TOKEN_USAGE: ['tokens', 'usage'] as const,
  
  // Notifications
  NOTIFICATIONS: ['notifications'] as const,
  
  // User
  USER: ['user'] as const,
  USER_ME: ['user', 'me'] as const,
} as const;

/**
 * Stale times pour différents types de données
 */
export const STALE_TIMES = {
  /** Données temps réel - 10 secondes */
  REALTIME: 10 * 1000,
  /** Données fréquemment mises à jour - 30 secondes */
  FREQUENT: 30 * 1000,
  /** Données standard - 1 minute */
  STANDARD: 60 * 1000,
  /** Données peu changeantes - 5 minutes */
  STATIC: 5 * 60 * 1000,
  /** Données très statiques - 15 minutes */
  VERY_STATIC: 15 * 60 * 1000,
} as const;

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS;
export type QueryKeys = typeof QUERY_KEYS;
