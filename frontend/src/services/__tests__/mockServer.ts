// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — MOCK SERVER UTILITIES
// Sprint 2: Mock server for frontend API integration testing
// ═══════════════════════════════════════════════════════════════════════════════

import { vi } from 'vitest';
import type {
  ApiResponse,
  Sphere,
  Thread,
  Agent,
  TokenBudget,
  GovernanceStatus,
  User,
  ThreadMessage,
  AgentTask,
} from '../api.client';
import type { SphereId } from '../../constants/canonical';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateId = (): string => 
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: generateId(),
  email: 'test@chenu.ai',
  displayName: 'Test User',
  role: 'user',
  tokenBalance: 10000,
  subscription: 'free',
  ...overrides,
});

export const createMockSphere = (
  id: SphereId,
  overrides: Partial<Sphere> = {}
): Sphere => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  icon: '🔵',
  color: '#D8B26A',
  isUnlocked: true,
  order: 1,
  ...overrides,
});

export const createMockThread = (overrides: Partial<Thread> = {}): Thread => ({
  id: generateId(),
  title: 'Test Thread',
  type: 'chat',
  sphereId: 'personal',
  status: 'active',
  tokenBudget: 5000,
  tokensUsed: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockMessage = (
  threadId: string,
  overrides: Partial<ThreadMessage> = {}
): ThreadMessage => ({
  id: generateId(),
  threadId,
  role: 'user',
  content: 'Test message',
  tokensUsed: 10,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: generateId(),
  name: 'Test Agent',
  type: 'specialist',
  level: 'L2',
  status: 'idle',
  isSystem: false,
  isHired: false,
  costPerToken: 0.002,
  capabilities: ['analysis'],
  sphereScopes: ['personal', 'business'],
  ...overrides,
});

export const createMockNova = (): Agent => ({
  id: 'nova',
  name: 'Nova',
  type: 'nova',
  level: 'L0',
  status: 'idle',
  isSystem: true,
  isHired: false, // Nova is NEVER hired
  costPerToken: 0.001,
  capabilities: ['guidance', 'governance', 'memory', 'supervision'],
  sphereScopes: ['personal', 'business', 'government', 'creative', 'community', 'social', 'entertainment', 'my_team', 'scholar'],
});

export const createMockTask = (overrides: Partial<AgentTask> = {}): AgentTask => ({
  id: generateId(),
  agentId: 'nova',
  input: 'Test task',
  status: 'pending',
  tokensUsed: 0,
  ...overrides,
});

export const createMockBudget = (overrides: Partial<TokenBudget> = {}): TokenBudget => ({
  total: 100000,
  used: 0,
  remaining: 100000,
  reserved: 0,
  dailyLimit: 100000,
  warningThreshold: 0.8,
  ...overrides,
});

export const createMockGovernanceStatus = (
  overrides: Partial<GovernanceStatus> = {}
): GovernanceStatus => ({
  enabled: true,
  strictMode: false,
  budget: createMockBudget(),
  scopeLock: {
    active: false,
    level: 'document',
    targetId: null,
    targetName: null,
    lockedAt: null,
    lockedBy: null,
  },
  pendingApprovals: 0,
  activeViolations: 0,
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK RESPONSE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const mockSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  meta: {
    requestId: generateId(),
    tokensUsed: Math.floor(Math.random() * 100),
    latencyMs: Math.floor(Math.random() * 500),
    timestamp: new Date().toISOString(),
  },
});

export const mockErrorResponse = <T>(
  code: string,
  message: string
): ApiResponse<T> => ({
  success: false,
  error: {
    code,
    message,
  },
  meta: {
    requestId: generateId(),
    tokensUsed: 0,
    latencyMs: Math.floor(Math.random() * 100),
    timestamp: new Date().toISOString(),
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9 SPHERES MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_SPHERES: Sphere[] = [
  createMockSphere('personal', { name: 'Personal', icon: '🏠', color: '#D8B26A', order: 1 }),
  createMockSphere('business', { name: 'Business', icon: '💼', color: '#8D8371', order: 2 }),
  createMockSphere('government', { name: 'Government', icon: '🏛️', color: '#2F4C39', order: 3 }),
  createMockSphere('creative', { name: 'Creative Studio', icon: '🎨', color: '#7A593A', order: 4 }),
  createMockSphere('community', { name: 'Community', icon: '👥', color: '#3F7249', order: 5 }),
  createMockSphere('social', { name: 'Social & Media', icon: '📱', color: '#3EB4A2', order: 6 }),
  createMockSphere('entertainment', { name: 'Entertainment', icon: '🎬', color: '#E9E4D6', order: 7 }),
  createMockSphere('my_team', { name: 'My Team', icon: '🤝', color: '#1E1F22', order: 8 }),
  createMockSphere('scholars', { name: 'Scholar', icon: '📚', color: '#E0C46B', order: 9 }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK FETCH SETUP
// ═══════════════════════════════════════════════════════════════════════════════

export interface MockEndpoint {
  method: string;
  path: string | RegExp;
  response: unknown | ((url: string, options?: RequestInit) => unknown);
  status?: number;
  delay?: number;
}

export class MockServer {
  private endpoints: MockEndpoint[] = [];
  private originalFetch: typeof fetch;

  constructor() {
    this.originalFetch = global.fetch;
  }

  addEndpoint(endpoint: MockEndpoint): void {
    this.endpoints.push(endpoint);
  }

  addEndpoints(endpoints: MockEndpoint[]): void {
    this.endpoints.push(...endpoints);
  }

  clearEndpoints(): void {
    this.endpoints = [];
  }

  start(): void {
    global.fetch = vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
      const method = options?.method || 'GET';
      const pathname = new URL(url, 'http://localhost').pathname;

      const endpoint = this.endpoints.find((e) => {
        const methodMatch = e.method.toUpperCase() === method.toUpperCase();
        const pathMatch = e.path instanceof RegExp 
          ? e.path.test(pathname)
          : pathname.endsWith(e.path);
        return methodMatch && pathMatch;
      });

      if (!endpoint) {
        return new Response(
          JSON.stringify({ error: 'Not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Optional delay
      if (endpoint.delay) {
        await new Promise((resolve) => setTimeout(resolve, endpoint.delay));
      }

      const responseData = typeof endpoint.response === 'function'
        ? endpoint.response(url, options)
        : endpoint.response;

      return new Response(
        JSON.stringify(responseData),
        { 
          status: endpoint.status || 200,
          headers: { 
            'Content-Type': 'application/json',
            'x-request-id': generateId(),
          },
        }
      );
    });
  }

  stop(): void {
    global.fetch = this.originalFetch;
  }

  reset(): void {
    this.clearEndpoints();
    this.stop();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultEndpoints: MockEndpoint[] = [
  // Health
  {
    method: 'GET',
    path: '/health',
    response: mockSuccessResponse({ status: 'healthy', version: '40.0.0' }),
  },

  // Auth
  {
    method: 'POST',
    path: '/auth/login',
    response: mockSuccessResponse({
      user: createMockUser(),
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresAt: Date.now() + 3600000,
    }),
  },
  {
    method: 'GET',
    path: '/auth/me',
    response: mockSuccessResponse(createMockUser()),
  },

  // Spheres (9 spheres)
  {
    method: 'GET',
    path: '/spheres',
    response: mockSuccessResponse(MOCK_SPHERES),
  },
  {
    method: 'GET',
    path: /\/spheres\/\w+$/,
    response: (url: string) => {
      const sphereId = url.split('/').pop() as SphereId;
      const sphere = MOCK_SPHERES.find(s => s.id === sphereId);
      return sphere 
        ? mockSuccessResponse(sphere)
        : mockErrorResponse('NOT_FOUND', 'Sphere not found');
    },
  },

  // Threads
  {
    method: 'GET',
    path: '/threads',
    response: mockSuccessResponse([
      createMockThread({ title: 'Thread 1' }),
      createMockThread({ title: 'Thread 2' }),
    ]),
  },
  {
    method: 'POST',
    path: '/threads',
    response: (url: string, options?: RequestInit) => {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      return mockSuccessResponse(createMockThread(body));
    },
  },

  // Agents
  {
    method: 'GET',
    path: '/agents/nova',
    response: mockSuccessResponse(createMockNova()),
  },
  {
    method: 'GET',
    path: '/agents/available',
    response: mockSuccessResponse([
      createMockAgent({ id: 'orchestrator_1', name: 'Orchestrator', type: 'orchestrator', level: 'L1' }),
      createMockAgent({ id: 'analyst_1', name: 'Data Analyst', type: 'specialist', level: 'L2' }),
      createMockAgent({ id: 'writer_1', name: 'Writer', type: 'specialist', level: 'L2' }),
    ]),
  },
  {
    method: 'GET',
    path: '/agents/hired',
    response: mockSuccessResponse([]),
  },
  {
    method: 'POST',
    path: '/agents/hire',
    response: (url: string, options?: RequestInit) => {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      return mockSuccessResponse(createMockAgent({ ...body, isHired: true }));
    },
  },

  // Governance
  {
    method: 'GET',
    path: '/governance/status',
    response: mockSuccessResponse(createMockGovernanceStatus()),
  },
  {
    method: 'GET',
    path: '/governance/budget',
    response: mockSuccessResponse(createMockBudget()),
  },
  {
    method: 'POST',
    path: '/governance/validate',
    response: mockSuccessResponse({ allowed: true, requiresApproval: false }),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const createMockServer = (): MockServer => {
  const server = new MockServer();
  server.addEndpoints(defaultEndpoints);
  return server;
};

export const setupMockApi = (): MockServer => {
  const server = createMockServer();
  server.start();
  return server;
};
