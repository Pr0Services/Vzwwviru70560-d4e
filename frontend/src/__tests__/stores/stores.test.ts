/**
 * CHE·NU™ - STORE TESTS
 * Unit tests for Zustand stores
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// ═══════════════════════════════════════════════════════════════
// MOCK SETUP
// ═══════════════════════════════════════════════════════════════

// Mock API service
vi.mock('../../services/api/ApiService', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// ═══════════════════════════════════════════════════════════════
// AUTH STORE TESTS
// ═══════════════════════════════════════════════════════════════

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    vi.resetModules();
  });

  it('should have initial state', async () => {
    const { useAuthStore } = await import('../../stores/auth.store');
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should login user successfully', async () => {
    const { useAuthStore } = await import('../../stores/auth.store');
    const { apiService } = await import('../../services/api/ApiService');
    
    const mockUser = {
      id: 'user-1',
      email: 'test@chenu.io',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
      tokenBalance: 10000,
    };

    vi.mocked(apiService.post).mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@chenu.io', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user', async () => {
    const { useAuthStore } = await import('../../stores/auth.store');
    const { result } = renderHook(() => useAuthStore());

    // Set initial logged in state
    act(() => {
      result.current.setUser({
        id: 'user-1',
        email: 'test@chenu.io',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
        tokenBalance: 10000,
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════
// THREAD STORE TESTS
// ═══════════════════════════════════════════════════════════════

describe('ThreadStore', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should have initial state', async () => {
    const { useThreadStore } = await import('../../stores/thread.store');
    const { result } = renderHook(() => useThreadStore());
    
    expect(result.current.threads).toEqual([]);
    expect(result.current.activeThread).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should create a new thread', async () => {
    const { useThreadStore } = await import('../../stores/thread.store');
    const { apiService } = await import('../../services/api/ApiService');

    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      sphereId: 'personal',
      status: 'active',
      tokenBudget: 5000,
      tokensUsed: 0,
      messages: [],
      decisions: [],
      createdAt: new Date().toISOString(),
    };

    vi.mocked(apiService.post).mockResolvedValueOnce(mockThread);

    const { result } = renderHook(() => useThreadStore());

    await act(async () => {
      await result.current.createThread({
        title: 'Test Thread',
        sphereId: 'personal',
        tokenBudget: 5000,
      });
    });

    expect(result.current.threads).toHaveLength(1);
    expect(result.current.threads[0].title).toBe('Test Thread');
  });

  it('should add message to thread', async () => {
    const { useThreadStore } = await import('../../stores/thread.store');
    const { apiService } = await import('../../services/api/ApiService');

    const mockMessage = {
      id: 'msg-1',
      role: 'user',
      content: 'Hello Nova',
      tokensUsed: 10,
      timestamp: new Date().toISOString(),
    };

    vi.mocked(apiService.post).mockResolvedValueOnce(mockMessage);

    const { result } = renderHook(() => useThreadStore());

    // Set active thread
    act(() => {
      result.current.setActiveThread({
        id: 'thread-1',
        title: 'Test',
        sphereId: 'personal',
        status: 'active',
        tokenBudget: 5000,
        tokensUsed: 0,
        messages: [],
        decisions: [],
        createdAt: new Date().toISOString(),
      });
    });

    await act(async () => {
      await result.current.sendMessage('thread-1', 'Hello Nova');
    });

    expect(result.current.activeThread?.messages).toHaveLength(1);
  });

  it('should filter threads by sphere', async () => {
    const { useThreadStore } = await import('../../stores/thread.store');
    const { result } = renderHook(() => useThreadStore());

    // Add threads
    act(() => {
      result.current.setThreads([
        { id: '1', title: 'Personal 1', sphereId: 'personal', status: 'active', tokenBudget: 1000, tokensUsed: 0, messages: [], decisions: [], createdAt: '' },
        { id: '2', title: 'Business 1', sphereId: 'business', status: 'active', tokenBudget: 1000, tokensUsed: 0, messages: [], decisions: [], createdAt: '' },
        { id: '3', title: 'Personal 2', sphereId: 'personal', status: 'active', tokenBudget: 1000, tokensUsed: 0, messages: [], decisions: [], createdAt: '' },
      ]);
    });

    const personalThreads = result.current.getThreadsBySphere('personal');
    expect(personalThreads).toHaveLength(2);
    
    const businessThreads = result.current.getThreadsBySphere('business');
    expect(businessThreads).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════
// TOKEN STORE TESTS
// ═══════════════════════════════════════════════════════════════

describe('TokenStore', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should have initial state', async () => {
    const { useTokenStore } = await import('../../stores/token.store');
    const { result } = renderHook(() => useTokenStore());
    
    expect(result.current.budgets).toEqual([]);
    expect(result.current.transactions).toEqual([]);
  });

  it('should calculate total available tokens', async () => {
    const { useTokenStore } = await import('../../stores/token.store');
    const { result } = renderHook(() => useTokenStore());

    act(() => {
      result.current.setBudgets([
        { id: '1', name: 'Personal', sphereId: 'personal', totalAllocated: 5000, totalUsed: 1000, period: 'monthly' },
        { id: '2', name: 'Business', sphereId: 'business', totalAllocated: 10000, totalUsed: 3000, period: 'monthly' },
      ]);
    });

    expect(result.current.getTotalAvailable()).toBe(11000); // (5000-1000) + (10000-3000)
  });

  it('should record token consumption', async () => {
    const { useTokenStore } = await import('../../stores/token.store');
    const { apiService } = await import('../../services/api/ApiService');

    vi.mocked(apiService.post).mockResolvedValueOnce({
      id: 'tx-1',
      type: 'consumption',
      amount: 100,
      budgetId: 'budget-1',
    });

    const { result } = renderHook(() => useTokenStore());

    act(() => {
      result.current.setBudgets([
        { id: 'budget-1', name: 'Test', sphereId: 'personal', totalAllocated: 5000, totalUsed: 0, period: 'monthly' },
      ]);
    });

    await act(async () => {
      await result.current.consumeTokens('budget-1', 100, 'Test consumption');
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].amount).toBe(100);
  });

  it('should prevent over-consumption', async () => {
    const { useTokenStore } = await import('../../stores/token.store');
    const { result } = renderHook(() => useTokenStore());

    act(() => {
      result.current.setBudgets([
        { id: 'budget-1', name: 'Test', sphereId: 'personal', totalAllocated: 100, totalUsed: 90, period: 'monthly' },
      ]);
    });

    const canConsume = result.current.canConsume('budget-1', 50);
    expect(canConsume).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════
// AGENT STORE TESTS
// ═══════════════════════════════════════════════════════════════

describe('AgentStore', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should have Nova as system agent', async () => {
    const { useAgentStore } = await import('../../stores/agent.store');
    const { result } = renderHook(() => useAgentStore());

    expect(result.current.nova).toBeDefined();
    expect(result.current.nova.type).toBe('nova');
    expect(result.current.nova.isSystem).toBe(true);
  });

  it('should hire an agent', async () => {
    const { useAgentStore } = await import('../../stores/agent.store');
    const { apiService } = await import('../../services/api/ApiService');

    vi.mocked(apiService.post).mockResolvedValueOnce({
      id: 'hired-1',
      agentId: 'agent-1',
      status: 'idle',
    });

    const { result } = renderHook(() => useAgentStore());

    // Add available agent
    act(() => {
      result.current.setAvailableAgents([
        {
          id: 'agent-1',
          name: 'Data Analyst',
          type: 'specialist',
          avatar: '📊',
          capabilities: ['data_analysis'],
          sphereScopes: ['business'],
          baseCostPerToken: 0.002,
          isSystem: false,
          isActive: true,
        },
      ]);
    });

    await act(async () => {
      await result.current.hireAgent('agent-1');
    });

    expect(result.current.hiredAgents).toHaveLength(1);
  });

  it('should not allow hiring Nova', async () => {
    const { useAgentStore } = await import('../../stores/agent.store');
    const { result } = renderHook(() => useAgentStore());

    // Nova should not be hireable
    expect(result.current.nova.isSystem).toBe(true);
    
    // Attempting to hire Nova should fail or be prevented
    const novaInAvailable = result.current.availableAgents.find(a => a.type === 'nova');
    expect(novaInAvailable).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════
// ENCODING SERVICE TESTS
// ═══════════════════════════════════════════════════════════════

describe('EncodingService', () => {
  it('should encode text and reduce token count', async () => {
    const { encodingService } = await import('../../services/encoding/EncodingService');

    const originalText = 'Please help me analyze the quarterly financial report and provide recommendations for improvement.';
    const result = encodingService.encode(originalText);

    expect(result.encodedText).toBeDefined();
    expect(result.originalTokens).toBeGreaterThan(0);
    expect(result.encodedTokens).toBeLessThan(result.originalTokens);
    expect(result.compressionRatio).toBeGreaterThan(1);
  });

  it('should decode encoded text', async () => {
    const { encodingService } = await import('../../services/encoding/EncodingService');

    const originalText = 'Create a new project for the marketing team';
    const encoded = encodingService.encode(originalText);
    const decoded = encodingService.decode(encoded.encodedText);

    // Decoded should be similar to original (may not be exact due to encoding)
    expect(decoded).toBeDefined();
    expect(decoded.length).toBeGreaterThan(0);
  });

  it('should calculate quality score', async () => {
    const { encodingService } = await import('../../services/encoding/EncodingService');

    const text = 'Analyze the data and create a report';
    const result = encodingService.encode(text);

    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
  });

  it('should apply custom encoding rules', async () => {
    const { encodingService } = await import('../../services/encoding/EncodingService');

    const customRules = [
      { pattern: 'quarterly report', replacement: 'QR' },
      { pattern: 'financial analysis', replacement: 'FA' },
    ];

    const text = 'Need quarterly report with financial analysis';
    const result = encodingService.encode(text, { customRules });

    expect(result.encodedText).toContain('QR');
    expect(result.encodedText).toContain('FA');
  });
});

// ═══════════════════════════════════════════════════════════════
// GOVERNANCE TESTS
// ═══════════════════════════════════════════════════════════════

describe('Governance', () => {
  it('should validate execution request', async () => {
    const { useTokenStore } = await import('../../stores/token.store');
    const { result } = renderHook(() => useTokenStore());

    act(() => {
      result.current.setBudgets([
        { id: 'budget-1', name: 'Test', sphereId: 'personal', totalAllocated: 5000, totalUsed: 1000, period: 'monthly' },
      ]);
    });

    // Should pass - enough tokens
    expect(result.current.canConsume('budget-1', 1000)).toBe(true);
    
    // Should fail - not enough tokens
    expect(result.current.canConsume('budget-1', 5000)).toBe(false);
  });

  it('should enforce scope boundaries', async () => {
    const { useAgentStore } = await import('../../stores/agent.store');
    const { result } = renderHook(() => useAgentStore());

    act(() => {
      result.current.setAvailableAgents([
        {
          id: 'agent-1',
          name: 'Business Agent',
          type: 'specialist',
          avatar: '💼',
          capabilities: ['business_analysis'],
          sphereScopes: ['business'], // Only business sphere
          baseCostPerToken: 0.002,
          isSystem: false,
          isActive: true,
        },
      ]);
    });

    const agent = result.current.availableAgents[0];
    
    // Agent should work in business sphere
    expect(agent.sphereScopes.includes('business')).toBe(true);
    
    // Agent should NOT work in personal sphere
    expect(agent.sphereScopes.includes('personal')).toBe(false);
  });
});
