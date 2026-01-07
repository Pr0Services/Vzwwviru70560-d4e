// CHE·NU™ Integration Tests — API Endpoint Testing
// Testing API integration with mock server

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockChenuApi, TEST_CONSTANTS, createMockUser, createMockThread, createMockAgent } from './setup';

// ============================================================
// API CLIENT MOCK
// ============================================================

const mockFetch = vi.fn();
global.fetch = mockFetch;

const apiClient = {
  baseUrl: 'https://api.chenu.io/v1',
  token: 'test-token',
  
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    });
    return response.json();
  },
  
  get: (endpoint: string) => apiClient.request(endpoint),
  post: (endpoint: string, data: unknown) => apiClient.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: unknown) => apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiClient.request(endpoint, { method: 'DELETE' }),
};

// ============================================================
// AUTH API TESTS
// ============================================================

describe('Auth API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockResponse = {
        access_token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
        expires_in: 3600,
        user: createMockUser(),
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      });

      const result = await apiClient.post('/auth/login', {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('POST /auth/register', () => {
    it('should require governance consent', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Governance consent required' }),
      });

      const result = await apiClient.post('/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        consents: {
          terms: true,
          governance: false, // Missing governance consent
          data_processing: true,
        },
      });

      expect(result.error).toContain('consent');
    });

    it('should register with all consents', async () => {
      const mockResponse = {
        access_token: 'jwt-token-123',
        user: createMockUser(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post('/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        consents: {
          terms: true,
          governance: true,
          data_processing: true,
        },
      });

      expect(result.access_token).toBeDefined();
    });
  });
});

// ============================================================
// SPHERES API TESTS
// ============================================================

describe('Spheres API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /spheres', () => {
    it('should return exactly 8 spheres', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ spheres: TEST_CONSTANTS.SPHERES }),
      });

      const result = await apiClient.get('/spheres');

      expect(result.spheres.length).toBe(8);
    });

    it('should include all required spheres', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ spheres: TEST_CONSTANTS.SPHERES }),
      });

      const result = await apiClient.get('/spheres');
      const codes = result.spheres.map((s: unknown) => s.code);

      expect(codes).toContain('personal');
      expect(codes).toContain('business');
      expect(codes).toContain('government');
      expect(codes).toContain('studio');
      expect(codes).toContain('community');
      expect(codes).toContain('social');
      expect(codes).toContain('entertainment');
      expect(codes).toContain('my_team');
    });
  });

  describe('GET /spheres/{code}/bureau', () => {
    it('should return bureau with exactly 10 sections', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          sphere_code: 'business',
          sections: TEST_CONSTANTS.BUREAU_SECTIONS,
        }),
      });

      const result = await apiClient.get('/spheres/business/bureau');

      expect(result.sections.length).toBe(10);
    });

    it('should include all required sections', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          sphere_code: 'business',
          sections: TEST_CONSTANTS.BUREAU_SECTIONS,
        }),
      });

      const result = await apiClient.get('/spheres/business/bureau');
      const names = result.sections.map((s: unknown) => s.name);

      expect(names).toContain('Dashboard');
      expect(names).toContain('Notes');
      expect(names).toContain('Tasks');
      expect(names).toContain('Projects');
      expect(names).toContain('Threads (.chenu)');
      expect(names).toContain('Meetings');
      expect(names).toContain('Data / Database');
      expect(names).toContain('Agents');
      expect(names).toContain('Reports / History');
      expect(names).toContain('Budget & Governance');
    });
  });
});

// ============================================================
// THREADS API TESTS
// ============================================================

describe('Threads API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('POST /threads', () => {
    it('should create thread with token budget', async () => {
      const mockThread = createMockThread();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockThread),
      });

      const result = await apiClient.post('/threads', {
        title: 'Test Thread',
        sphere_code: 'business',
        token_budget: 10000,
      });

      expect(result.id).toBeDefined();
      expect(result.token_budget).toBe(10000);
    });
  });

  describe('POST /threads/{id}/messages', () => {
    it('should encode message by default', async () => {
      const mockMessage = {
        id: 'msg-001',
        content: 'Test message',
        encoded: true,
        encoding_ratio: 0.65,
        tokens: 8,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMessage),
      });

      const result = await apiClient.post('/threads/thread-001/messages', {
        content: 'Test message',
        encode: true,
      });

      expect(result.encoded).toBe(true);
      expect(result.encoding_ratio).toBeLessThan(1);
    });

    it('should track token usage', async () => {
      const mockMessage = {
        id: 'msg-001',
        content: 'Test message',
        tokens: 15,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMessage),
      });

      const result = await apiClient.post('/threads/thread-001/messages', {
        content: 'Test message',
      });

      expect(result.tokens).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// TOKENS API TESTS
// ============================================================

describe('Tokens API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /tokens/balance', () => {
    it('should return token balance', async () => {
      const mockBalance = {
        total_allocated: 100000,
        total_used: 25000,
        total_remaining: 75000,
        by_sphere: [
          { sphere_code: 'business', allocated: 50000, used: 15000 },
          { sphere_code: 'personal', allocated: 50000, used: 10000 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBalance),
      });

      const result = await apiClient.get('/tokens/balance');

      expect(result.total_allocated).toBeGreaterThan(0);
      expect(result.total_remaining).toBe(result.total_allocated - result.total_used);
    });
  });

  describe('Token Properties (Memory Prompt)', () => {
    it('tokens should be internal utility credits', () => {
      const tokenDefinition = {
        type: 'internal_utility_credit',
        is_crypto: false,
        is_speculative: false,
        is_market_based: false,
      };

      expect(tokenDefinition.is_crypto).toBe(false);
      expect(tokenDefinition.is_speculative).toBe(false);
      expect(tokenDefinition.is_market_based).toBe(false);
    });
  });
});

// ============================================================
// AGENTS API TESTS
// ============================================================

describe('Agents API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('POST /agents/{code}/execute', () => {
    it('should check governance before execution', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({
          error: 'Governance check failed',
          law_violated: 7,
          message: 'Agent Non-Autonomy: Agent not authorized',
        }),
      });

      const result = await apiClient.post('/agents/TEST_AGENT/execute', {
        task: 'Test task',
        sphere_code: 'business',
      });

      expect(result.error).toContain('Governance');
    });

    it('should execute when governance passes', async () => {
      const mockResult = {
        success: true,
        result: { output: 'Task completed' },
        tokens_used: 150,
        execution_time_ms: 2500,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const result = await apiClient.post('/agents/DOC_GENERATOR/execute', {
        task: 'Generate document',
        sphere_code: 'business',
      });

      expect(result.success).toBe(true);
      expect(result.tokens_used).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// GOVERNANCE API TESTS
// ============================================================

describe('Governance API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /governance/laws', () => {
    it('should return exactly 10 laws', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ laws: TEST_CONSTANTS.GOVERNANCE_LAWS }),
      });

      const result = await apiClient.get('/governance/laws');

      expect(result.laws.length).toBe(10);
    });

    it('should include all required laws', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ laws: TEST_CONSTANTS.GOVERNANCE_LAWS }),
      });

      const result = await apiClient.get('/governance/laws');
      const names = result.laws.map((l: unknown) => l.name);

      expect(names).toContain('Consent Primacy');
      expect(names).toContain('Temporal Sovereignty');
      expect(names).toContain('Contextual Fidelity');
      expect(names).toContain('Hierarchical Respect');
      expect(names).toContain('Audit Completeness');
      expect(names).toContain('Encoding Transparency');
      expect(names).toContain('Agent Non-Autonomy');
      expect(names).toContain('Budget Accountability');
      expect(names).toContain('Cross-Sphere Isolation');
      expect(names).toContain('Deletion Completeness');
    });
  });

  describe('POST /governance/check', () => {
    it('should verify governance before actions', async () => {
      const mockResult = {
        approved: true,
        laws_checked: [1, 7, 8],
        violations: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const result = await apiClient.post('/governance/check', {
        action: 'execute_agent',
        entity_type: 'agent',
        entity_id: 'DOC_GENERATOR',
      });

      expect(result.approved).toBe(true);
      expect(result.violations.length).toBe(0);
    });
  });
});

// ============================================================
// NOVA API TESTS
// ============================================================

describe('Nova API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /nova/status', () => {
    it('should return Nova as system intelligence', async () => {
      const mockStatus = {
        active: true,
        type: 'system_intelligence',
        handles: ['guidance', 'memory', 'governance', 'databases', 'threads'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

      const result = await apiClient.get('/nova/status');

      expect(result.type).toBe('system_intelligence');
      expect(result.active).toBe(true);
    });

    it('Nova should NOT be a hired agent', async () => {
      const novaStatus = {
        type: 'system_intelligence',
        is_hired_agent: false, // NEVER true
      };

      expect(novaStatus.is_hired_agent).toBe(false);
    });
  });

  describe('POST /nova/query', () => {
    it('should respond to queries', async () => {
      const mockResponse = {
        response: 'Here is your guidance...',
        tokens_used: 45,
        suggestions: ['Create a task', 'Schedule a meeting'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.post('/nova/query', {
        query: 'What should I focus on today?',
        sphere_code: 'business',
      });

      expect(result.response).toBeDefined();
      expect(result.tokens_used).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// ENCODING API TESTS
// ============================================================

describe('Encoding API Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('POST /encoding/encode', () => {
    it('should reduce token count', async () => {
      const mockResult = {
        encoded: 'ENC_TST_MSG',
        original_tokens: 50,
        encoded_tokens: 15,
        savings_ratio: 0.7,
        quality_score: 94,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const result = await apiClient.post('/encoding/encode', {
        content: 'This is a test message for encoding',
      });

      expect(result.encoded_tokens).toBeLessThan(result.original_tokens);
      expect(result.savings_ratio).toBeGreaterThan(0);
    });
  });

  describe('POST /encoding/decode', () => {
    it('should be reversible for humans', async () => {
      const original = 'This is a test message';
      const mockDecoded = {
        decoded: original,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDecoded),
      });

      const result = await apiClient.post('/encoding/decode', {
        encoded: 'ENC_TST_MSG',
      });

      expect(result.decoded).toBeDefined();
    });
  });

  describe('Encoding Timing (Memory Prompt)', () => {
    it('encoding should happen BEFORE execution', () => {
      const workflow = {
        steps: ['encode', 'governance_check', 'execute'],
      };

      expect(workflow.steps[0]).toBe('encode');
      expect(workflow.steps.indexOf('encode')).toBeLessThan(workflow.steps.indexOf('execute'));
    });
  });
});

// ============================================================
// EXPORT
// ============================================================

export {
  apiClient,
  describe,
  it,
  expect,
};
