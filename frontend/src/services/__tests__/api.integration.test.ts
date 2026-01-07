// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — API INTEGRATION TESTS
// Sprint 2: Integration tests for all API endpoints
// Tests frontend API client against mock server
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import ApiClient from '../api.client';
import {
  MockServer,
  createMockServer,
  defaultEndpoints,
  mockSuccessResponse,
  mockErrorResponse,
  createMockThread,
  createMockAgent,
  createMockNova,
  createMockBudget,
  MOCK_SPHERES,
} from './mockServer';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SETUP
// ═══════════════════════════════════════════════════════════════════════════════

let mockServer: MockServer;
let apiClient: ApiClient;

beforeAll(() => {
  mockServer = createMockServer();
  mockServer.start();
});

afterAll(() => {
  mockServer.stop();
});

beforeEach(() => {
  apiClient = new ApiClient({
    baseUrl: 'http://localhost:8000/api/v1',
    timeout: 5000,
  });
});

afterEach(() => {
  apiClient.setAccessToken(null);
});

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('API Health', () => {
  it('should return healthy status', async () => {
    const response = await apiClient.healthCheck();
    
    expect(response.success).toBe(true);
    expect(response.data?.status).toBe('healthy');
    expect(response.data?.version).toBe('40.0.0');
  });

  it('should include metadata in response', async () => {
    const response = await apiClient.healthCheck();
    
    expect(response.meta).toBeDefined();
    expect(response.meta?.requestId).toBeDefined();
    expect(response.meta?.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH API TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Auth API', () => {
  it('should login successfully', async () => {
    const response = await apiClient.login({
      email: 'test@chenu.ai',
      password: 'password123',
    });
    
    expect(response.success).toBe(true);
    expect(response.data?.user).toBeDefined();
    expect(response.data?.accessToken).toBeDefined();
    expect(response.data?.refreshToken).toBeDefined();
  });

  it('should set access token after login', async () => {
    await apiClient.login({
      email: 'test@chenu.ai',
      password: 'password123',
    });
    
    const config = apiClient.getConfig();
    // Token is set internally, we verify by making authenticated request
    const meResponse = await apiClient.getMe();
    expect(meResponse.success).toBe(true);
  });

  it('should get current user', async () => {
    const response = await apiClient.getMe();
    
    expect(response.success).toBe(true);
    expect(response.data?.email).toBeDefined();
    expect(response.data?.role).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERES API TESTS (9 SPHERES)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Spheres API (9 Spheres)', () => {
  it('should get all 9 spheres', async () => {
    const response = await apiClient.getSpheres();
    
    expect(response.success).toBe(true);
    expect(response.data?.length).toBe(9);
  });

  it('should include Scholar as 9th sphere', async () => {
    const response = await apiClient.getSpheres();
    
    const scholar = response.data?.find(s => s.id === 'scholars');
    expect(scholar).toBeDefined();
    expect(scholar?.icon).toBe('📚');
    expect(scholar?.order).toBe(9);
  });

  it('spheres should be in correct order', async () => {
    const response = await apiClient.getSpheres();
    
    const orders = response.data?.map(s => s.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should get single sphere by ID', async () => {
    const response = await apiClient.getSphere('personal');
    
    expect(response.success).toBe(true);
    expect(response.data?.id).toBe('personal');
    expect(response.data?.icon).toBe('🏠');
  });

  it('should return error for invalid sphere', async () => {
    // Add custom endpoint for this test
    mockServer.addEndpoint({
      method: 'GET',
      path: '/spheres/invalid',
      response: mockErrorResponse('NOT_FOUND', 'Sphere not found'),
      status: 404,
    });

    const response = await apiClient.getSphere('invalid' as any);
    expect(response.success).toBe(false);
  });

  it('all spheres should have CHE·NU colors', async () => {
    const response = await apiClient.getSpheres();
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    
    response.data?.forEach(sphere => {
      expect(sphere.color).toMatch(hexColorRegex);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// THREADS API TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Threads API', () => {
  it('should get threads list', async () => {
    const response = await apiClient.getThreads();
    
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should create new thread', async () => {
    const response = await apiClient.createThread({
      title: 'New Test Thread',
      sphereId: 'business',
      type: 'chat',
    });
    
    expect(response.success).toBe(true);
    expect(response.data?.title).toBe('New Test Thread');
    expect(response.data?.sphereId).toBe('business');
  });

  it('thread should have token budget', async () => {
    const response = await apiClient.createThread({
      title: 'Budget Thread',
      sphereId: 'personal',
      tokenBudget: 10000,
    });
    
    expect(response.data?.tokenBudget).toBeDefined();
    expect(response.data?.tokensUsed).toBe(0);
  });

  it('should support different thread types', async () => {
    const types = ['chat', 'agent', 'task'] as const;
    
    for (const type of types) {
      const response = await apiClient.createThread({
        title: `${type} Thread`,
        sphereId: 'personal',
        type,
      });
      
      expect(response.success).toBe(true);
      expect(response.data?.type).toBe(type);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS API TESTS (Nova L0, Hiring)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Agents API', () => {
  describe('Nova (System Intelligence)', () => {
    it('should get Nova agent', async () => {
      const response = await apiClient.getNova();
      
      expect(response.success).toBe(true);
      expect(response.data?.id).toBe('nova');
      expect(response.data?.name).toBe('Nova');
    });

    it('Nova should be L0 level', async () => {
      const response = await apiClient.getNova();
      expect(response.data?.level).toBe('L0');
    });

    it('Nova should be system agent', async () => {
      const response = await apiClient.getNova();
      expect(response.data?.isSystem).toBe(true);
    });

    it('Nova should NEVER be hired', async () => {
      const response = await apiClient.getNova();
      expect(response.data?.isHired).toBe(false);
    });

    it('Nova should have governance capability', async () => {
      const response = await apiClient.getNova();
      expect(response.data?.capabilities).toContain('governance');
    });

    it('Nova should have access to all spheres', async () => {
      const response = await apiClient.getNova();
      expect(response.data?.sphereScopes.length).toBe(9);
    });
  });

  describe('Agent Catalog', () => {
    it('should get available agents', async () => {
      const response = await apiClient.getAvailableAgents();
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data?.length).toBeGreaterThan(0);
    });

    it('available agents should have costs defined', async () => {
      const response = await apiClient.getAvailableAgents();
      
      response.data?.forEach(agent => {
        expect(agent.costPerToken).toBeGreaterThan(0);
      });
    });

    it('should include orchestrator in catalog', async () => {
      const response = await apiClient.getAvailableAgents();
      
      const orchestrator = response.data?.find(a => a.type === 'orchestrator');
      expect(orchestrator).toBeDefined();
      expect(orchestrator?.level).toBe('L1');
    });
  });

  describe('Agent Hiring', () => {
    it('should hire agent', async () => {
      const response = await apiClient.hireAgent({ agentId: 'orchestrator_1' });
      
      expect(response.success).toBe(true);
      expect(response.data?.isHired).toBe(true);
    });

    it('should get hired agents list', async () => {
      const response = await apiClient.getHiredAgents();
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE API TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance API', () => {
  describe('Status', () => {
    it('should get governance status', async () => {
      const response = await apiClient.getGovernanceStatus();
      
      expect(response.success).toBe(true);
      expect(response.data?.enabled).toBeDefined();
      expect(response.data?.strictMode).toBeDefined();
    });

    it('governance should be enabled by default', async () => {
      const response = await apiClient.getGovernanceStatus();
      expect(response.data?.enabled).toBe(true);
    });
  });

  describe('Token Budget', () => {
    it('should get token budget', async () => {
      const response = await apiClient.getBudget();
      
      expect(response.success).toBe(true);
      expect(response.data?.total).toBe(100000);
      expect(response.data?.remaining).toBeDefined();
    });

    it('budget should have warning threshold', async () => {
      const response = await apiClient.getBudget();
      expect(response.data?.warningThreshold).toBe(0.8);
    });

    it('tokens are internal credits (not crypto)', async () => {
      const response = await apiClient.getBudget();
      
      // Verify it's a simple number budget, not blockchain-related
      expect(typeof response.data?.total).toBe('number');
      expect(response.data?.total).toBeGreaterThan(0);
    });
  });

  describe('Execution Validation', () => {
    it('should validate execution request', async () => {
      const response = await apiClient.validateExecution({
        estimatedTokens: 1000,
        agentId: 'nova',
      });
      
      expect(response.success).toBe(true);
      expect(response.data?.allowed).toBeDefined();
    });

    it('should allow execution with sufficient budget', async () => {
      const response = await apiClient.validateExecution({
        estimatedTokens: 1000,
      });
      
      expect(response.data?.allowed).toBe(true);
    });

    it('should indicate if approval is required', async () => {
      const response = await apiClient.validateExecution({
        estimatedTokens: 1000,
      });
      
      expect(response.data?.requiresApproval).toBeDefined();
    });
  });

  describe('Scope Lock', () => {
    it('should have scope lock in status', async () => {
      const response = await apiClient.getGovernanceStatus();
      
      expect(response.data?.scopeLock).toBeDefined();
      expect(response.data?.scopeLock.level).toBeDefined();
    });

    it('scope lock should be inactive by default', async () => {
      const response = await apiClient.getGovernanceStatus();
      expect(response.data?.scopeLock.active).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// API RESPONSE STRUCTURE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('API Response Structure', () => {
  it('success responses should have data', async () => {
    const response = await apiClient.getSpheres();
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it('all responses should have metadata', async () => {
    const response = await apiClient.getSpheres();
    
    expect(response.meta).toBeDefined();
    expect(response.meta?.requestId).toBeDefined();
    expect(response.meta?.timestamp).toBeDefined();
    expect(response.meta?.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('responses should track token usage', async () => {
    const response = await apiClient.getSpheres();
    expect(response.meta?.tokensUsed).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Error Handling', () => {
  it('error responses should have error object', async () => {
    mockServer.addEndpoint({
      method: 'GET',
      path: '/test/error',
      response: mockErrorResponse('TEST_ERROR', 'Test error message'),
      status: 400,
    });

    const response = await apiClient.get('/test/error');
    
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
    expect(response.error?.code).toBeDefined();
    expect(response.error?.message).toBeDefined();
  });

  it('should handle 404 errors', async () => {
    const response = await apiClient.get('/nonexistent');
    
    expect(response.success).toBe(false);
    expect(response.error?.code).toContain('404');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT COMPLIANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Compliance', () => {
  it('should return exactly 9 spheres (FROZEN)', async () => {
    const response = await apiClient.getSpheres();
    expect(response.data?.length).toBe(9);
  });

  it('Nova should be system intelligence (never hired)', async () => {
    const response = await apiClient.getNova();
    expect(response.data?.isSystem).toBe(true);
    expect(response.data?.isHired).toBe(false);
    expect(response.data?.type).toBe('nova');
  });

  it('tokens should be internal credits (not crypto)', async () => {
    const response = await apiClient.getBudget();
    
    // Simple numeric budget, not blockchain
    expect(typeof response.data?.total).toBe('number');
    expect(response.data?.dailyLimit).toBeDefined();
  });

  it('governance should be enforced before execution', async () => {
    const response = await apiClient.validateExecution({
      estimatedTokens: 1000,
    });
    
    // Validation happens BEFORE execution
    expect(response.success).toBe(true);
    expect(response.data?.allowed).toBeDefined();
  });
});
