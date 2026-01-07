// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — GOVERNANCE STORE TESTS
// Sprint 1 - Tâche 4: 12 tests pour governanceStore
// Tokens = Crédits internes (PAS crypto) | Governance BEFORE execution
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useGovernanceStore, GOVERNANCE_LAWS } from '../governance.store';

// Reset store before each test
beforeEach(() => {
  localStorage.clear();
  act(() => {
    useGovernanceStore.getState().reset();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET TESTS (Tokens = Internal Credits, NOT crypto)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Token Budget (Internal Credits)', () => {
  it('should initialize with default budget of 100,000 tokens', () => {
    const state = useGovernanceStore.getState();
    expect(state.budget.total).toBe(100000);
    expect(state.budget.remaining).toBe(100000);
    expect(state.budget.used).toBe(0);
  });

  it('should use tokens and update remaining', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(1000);
    });
    
    const state = useGovernanceStore.getState();
    expect(state.budget.used).toBe(1000);
    expect(state.budget.remaining).toBe(99000);
  });

  it('should not allow using more tokens than available', () => {
    const result = useGovernanceStore.getState().useTokens(150000);
    
    expect(result).toBe(false);
    expect(useGovernanceStore.getState().budget.used).toBe(0);
  });

  it('should track token usage per sphere', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(500, 'business');
      useGovernanceStore.getState().useTokens(300, 'personal');
    });
    
    const state = useGovernanceStore.getState();
    expect(state.sphereBudgets['business']?.used).toBe(500);
    expect(state.sphereBudgets['personal']?.used).toBe(300);
  });

  it('should reserve tokens', () => {
    const result = useGovernanceStore.getState().reserveTokens(5000);
    
    expect(result).toBe(true);
    expect(useGovernanceStore.getState().budget.reserved).toBe(5000);
  });

  it('should not reserve more than available', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(98000);
    });
    
    const result = useGovernanceStore.getState().reserveTokens(5000);
    expect(result).toBe(false);
  });

  it('should release reserved tokens', () => {
    act(() => {
      useGovernanceStore.getState().reserveTokens(5000);
    });
    act(() => {
      useGovernanceStore.getState().releaseReservedTokens(3000);
    });
    
    expect(useGovernanceStore.getState().budget.reserved).toBe(2000);
  });

  it('should update budget with setBudget', () => {
    act(() => {
      useGovernanceStore.getState().setBudget({ total: 200000, remaining: 200000 });
    });
    
    expect(useGovernanceStore.getState().budget.total).toBe(200000);
  });

  it('should reset budget to defaults', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(50000);
      useGovernanceStore.getState().resetBudget();
    });
    
    const state = useGovernanceStore.getState();
    expect(state.budget.total).toBe(100000);
    expect(state.budget.used).toBe(0);
    expect(state.budget.remaining).toBe(100000);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCOPE LOCK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Scope Lock', () => {
  it('should initialize with unlocked scope', () => {
    const state = useGovernanceStore.getState();
    expect(state.scopeLock.active).toBe(false);
  });

  it('should lock scope with all parameters', () => {
    act(() => {
      useGovernanceStore.getState().lockScope(
        'document',
        'doc-123',
        'My Document',
        'user-456'
      );
    });
    
    const state = useGovernanceStore.getState();
    expect(state.scopeLock.active).toBe(true);
    expect(state.scopeLock.level).toBe('document');
    expect(state.scopeLock.targetId).toBe('doc-123');
    expect(state.scopeLock.targetName).toBe('My Document');
    expect(state.scopeLock.lockedBy).toBe('user-456');
  });

  it('should record lock timestamp', () => {
    const beforeTime = Date.now();
    
    act(() => {
      useGovernanceStore.getState().lockScope('project', 'proj-1', 'Project', 'user-1');
    });
    
    const afterTime = Date.now();
    const lockedAt = useGovernanceStore.getState().scopeLock.lockedAt;
    
    expect(lockedAt).toBeGreaterThanOrEqual(beforeTime);
    expect(lockedAt).toBeLessThanOrEqual(afterTime);
  });

  it('should unlock scope', () => {
    act(() => {
      useGovernanceStore.getState().lockScope('document', 'doc-1', 'Doc', 'user-1');
    });
    act(() => {
      useGovernanceStore.getState().unlockScope();
    });
    
    const state = useGovernanceStore.getState();
    expect(state.scopeLock.active).toBe(false);
    expect(state.scopeLock.targetId).toBeNull();
  });

  it('should check if scope is locked', () => {
    expect(useGovernanceStore.getState().isScopeLocked()).toBe(false);
    
    act(() => {
      useGovernanceStore.getState().lockScope('sphere', 'business', 'Business', 'user-1');
    });
    
    expect(useGovernanceStore.getState().isScopeLocked()).toBe(true);
  });

  it('should get current scope level', () => {
    act(() => {
      useGovernanceStore.getState().lockScope('project', 'proj-1', 'Project', 'user-1');
    });
    
    expect(useGovernanceStore.getState().getScopeLevel()).toBe('project');
  });

  it('should support all scope levels', () => {
    const levels = ['selection', 'document', 'project', 'sphere', 'global'] as const;
    
    levels.forEach(level => {
      act(() => {
        useGovernanceStore.getState().lockScope(level, `${level}-1`, level, 'user-1');
      });
      expect(useGovernanceStore.getState().scopeLock.level).toBe(level);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PENDING APPROVALS TESTS (Governance BEFORE Execution)
// ═══════════════════════════════════════════════════════════════════════════════

describe('Pending Approvals (Governance BEFORE Execution)', () => {
  it('should add pending approval', () => {
    const id = useGovernanceStore.getState().addPendingApproval({
      type: 'execution',
      description: 'Generate report',
      estimatedTokens: 1000,
    });
    
    expect(id).toBeDefined();
    expect(useGovernanceStore.getState().pendingApprovals.length).toBe(1);
  });

  it('should include expiry time on approval', () => {
    const beforeTime = Date.now();
    
    useGovernanceStore.getState().addPendingApproval({
      type: 'execution',
      description: 'Test',
      estimatedTokens: 100,
    });
    
    const approval = useGovernanceStore.getState().pendingApprovals[0];
    // Expiry should be ~5 minutes (300000ms) after creation
    expect(approval.expiresAt).toBeGreaterThan(beforeTime + 290000);
  });

  it('should approve pending request', () => {
    const id = useGovernanceStore.getState().addPendingApproval({
      type: 'execution',
      description: 'Test',
      estimatedTokens: 100,
    });
    
    act(() => {
      useGovernanceStore.getState().approvePending(id);
    });
    
    expect(useGovernanceStore.getState().pendingApprovals.length).toBe(0);
  });

  it('should reject pending request', () => {
    const id = useGovernanceStore.getState().addPendingApproval({
      type: 'budget',
      description: 'Increase budget',
      estimatedTokens: 50000,
    });
    
    act(() => {
      useGovernanceStore.getState().rejectPending(id);
    });
    
    expect(useGovernanceStore.getState().pendingApprovals.length).toBe(0);
  });

  it('should clear expired approvals', () => {
    // Add approval with past expiry (mock)
    const state = useGovernanceStore.getState();
    state.pendingApprovals.push({
      id: 'expired-1',
      type: 'execution',
      description: 'Old request',
      estimatedTokens: 100,
      createdAt: Date.now() - 600000, // 10 min ago
      expiresAt: Date.now() - 300000, // Expired 5 min ago
    });
    
    act(() => {
      useGovernanceStore.getState().clearExpiredApprovals();
    });
    
    expect(useGovernanceStore.getState().pendingApprovals.length).toBe(0);
  });

  it('should support different approval types', () => {
    const types = ['execution', 'budget', 'scope_change', 'agent_action'] as const;
    
    types.forEach(type => {
      useGovernanceStore.getState().addPendingApproval({
        type,
        description: `Test ${type}`,
        estimatedTokens: 100,
      });
    });
    
    expect(useGovernanceStore.getState().pendingApprovals.length).toBe(4);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIOLATIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Violations', () => {
  it('should add violation', () => {
    act(() => {
      useGovernanceStore.getState().addViolation({
        rule: 'BUDGET_ACCOUNTABILITY',
        description: 'Exceeded budget',
        severity: 'error',
      });
    });
    
    expect(useGovernanceStore.getState().violations.length).toBe(1);
  });

  it('should create violation when exceeding budget', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(150000); // More than available
    });
    
    const violations = useGovernanceStore.getState().violations;
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].rule).toBe('BUDGET_ACCOUNTABILITY');
  });

  it('should resolve violation', () => {
    act(() => {
      useGovernanceStore.getState().addViolation({
        rule: 'CONSENT_PRIMACY',
        description: 'Missing approval',
        severity: 'warning',
      });
    });
    
    const violationId = useGovernanceStore.getState().violations[0].id;
    
    act(() => {
      useGovernanceStore.getState().resolveViolation(violationId);
    });
    
    expect(useGovernanceStore.getState().violations[0].resolved).toBe(true);
  });

  it('should clear resolved violations', () => {
    act(() => {
      useGovernanceStore.getState().addViolation({
        rule: 'TEST',
        description: 'Test violation',
        severity: 'warning',
      });
    });
    
    const violationId = useGovernanceStore.getState().violations[0].id;
    
    act(() => {
      useGovernanceStore.getState().resolveViolation(violationId);
      useGovernanceStore.getState().clearResolvedViolations();
    });
    
    expect(useGovernanceStore.getState().violations.length).toBe(0);
  });

  it('should support all severity levels', () => {
    const severities = ['warning', 'error', 'critical'] as const;
    
    severities.forEach(severity => {
      act(() => {
        useGovernanceStore.getState().addViolation({
          rule: 'TEST',
          description: `Test ${severity}`,
          severity,
        });
      });
    });
    
    expect(useGovernanceStore.getState().violations.length).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE LAWS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Laws', () => {
  it('should have 10 governance laws defined', () => {
    expect(Object.keys(GOVERNANCE_LAWS).length).toBe(10);
  });

  it('should include CONSENT_PRIMACY (L1)', () => {
    expect(GOVERNANCE_LAWS.CONSENT_PRIMACY.code).toBe('L1');
    expect(GOVERNANCE_LAWS.CONSENT_PRIMACY.enforcement).toBe('STRICT');
  });

  it('should include AGENT_NON_AUTONOMY (L7)', () => {
    expect(GOVERNANCE_LAWS.AGENT_NON_AUTONOMY.code).toBe('L7');
    expect(GOVERNANCE_LAWS.AGENT_NON_AUTONOMY.enforcement).toBe('STRICT');
  });

  it('should include BUDGET_ACCOUNTABILITY (L8)', () => {
    expect(GOVERNANCE_LAWS.BUDGET_ACCOUNTABILITY.code).toBe('L8');
  });

  it('all STRICT laws should be non-negotiable', () => {
    const strictLaws = Object.values(GOVERNANCE_LAWS).filter(
      law => law.enforcement === 'STRICT'
    );
    expect(strictLaws.length).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTION VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Execution Validation', () => {
  it('should allow execution with sufficient budget', () => {
    const result = useGovernanceStore.getState().validateExecution(1000);
    expect(result.allowed).toBe(true);
  });

  it('should deny execution with insufficient budget', () => {
    const result = useGovernanceStore.getState().validateExecution(150000);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Insufficient budget');
  });

  it('should require scope lock in strict mode', () => {
    act(() => {
      useGovernanceStore.getState().toggleStrictMode();
    });
    
    const result = useGovernanceStore.getState().validateExecution(100);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Scope must be locked');
  });

  it('should allow execution when governance is disabled', () => {
    act(() => {
      useGovernanceStore.getState().toggleGovernance();
    });
    
    const result = useGovernanceStore.getState().validateExecution(999999);
    expect(result.allowed).toBe(true);
  });

  it('should deny when too many pending approvals', () => {
    // Add 10 pending approvals
    for (let i = 0; i < 10; i++) {
      useGovernanceStore.getState().addPendingApproval({
        type: 'execution',
        description: `Request ${i}`,
        estimatedTokens: 100,
      });
    }
    
    const result = useGovernanceStore.getState().validateExecution(100);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Too many pending approvals');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS & RESET TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Settings & Reset', () => {
  it('should toggle governance on/off', () => {
    expect(useGovernanceStore.getState().governanceEnabled).toBe(true);
    
    act(() => {
      useGovernanceStore.getState().toggleGovernance();
    });
    
    expect(useGovernanceStore.getState().governanceEnabled).toBe(false);
  });

  it('should toggle strict mode', () => {
    expect(useGovernanceStore.getState().strictMode).toBe(false);
    
    act(() => {
      useGovernanceStore.getState().toggleStrictMode();
    });
    
    expect(useGovernanceStore.getState().strictMode).toBe(true);
  });

  it('should reset all state', () => {
    act(() => {
      useGovernanceStore.getState().useTokens(5000);
      useGovernanceStore.getState().lockScope('document', 'd-1', 'Doc', 'user-1');
      useGovernanceStore.getState().toggleStrictMode();
      useGovernanceStore.getState().addViolation({
        rule: 'TEST',
        description: 'Test',
        severity: 'warning',
      });
    });
    
    act(() => {
      useGovernanceStore.getState().reset();
    });
    
    const state = useGovernanceStore.getState();
    expect(state.budget.used).toBe(0);
    expect(state.scopeLock.active).toBe(false);
    expect(state.strictMode).toBe(false);
    expect(state.violations.length).toBe(0);
  });
});
