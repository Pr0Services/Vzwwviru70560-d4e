// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — ERROR BOUNDARY TESTS
// Sprint 10 (FINAL): Error handling and recovery tests
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

class CHENUError extends Error {
  code: string;
  recoverable: boolean;

  constructor(message: string, code: string, recoverable: boolean = true) {
    super(message);
    this.name = 'CHENUError';
    this.code = code;
    this.recoverable = recoverable;
  }
}

class SphereError extends CHENUError {
  sphereId: string;

  constructor(message: string, sphereId: string) {
    super(message, 'SPHERE_ERROR', true);
    this.name = 'SphereError';
    this.sphereId = sphereId;
  }
}

class ThreadError extends CHENUError {
  threadId: string;

  constructor(message: string, threadId: string) {
    super(message, 'THREAD_ERROR', true);
    this.name = 'ThreadError';
    this.threadId = threadId;
  }
}

class GovernanceError extends CHENUError {
  lawId: string;

  constructor(message: string, lawId: string) {
    super(message, 'GOVERNANCE_ERROR', false);
    this.name = 'GovernanceError';
    this.lawId = lawId;
  }
}

class TokenBudgetError extends CHENUError {
  required: number;
  available: number;

  constructor(required: number, available: number) {
    super(`Insufficient tokens: required ${required}, available ${available}`, 'TOKEN_ERROR', true);
    this.name = 'TokenBudgetError';
    this.required = required;
    this.available = available;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorLog {
  error: Error;
  timestamp: Date;
  context: Record<string, any>;
  handled: boolean;
}

class ErrorHandler {
  private errorLog: ErrorLog[] = [];
  private recoveryAttempts: Map<string, number> = new Map();
  private maxRecoveryAttempts: number = 3;

  handle(error: Error, context: Record<string, any> = {}): boolean {
    const log: ErrorLog = {
      error,
      timestamp: new Date(),
      context,
      handled: false,
    };

    this.errorLog.push(log);

    if (error instanceof CHENUError) {
      if (error.recoverable) {
        log.handled = this.attemptRecovery(error);
      } else {
        log.handled = this.handleCriticalError(error);
      }
    } else {
      log.handled = this.handleUnknownError(error);
    }

    return log.handled;
  }

  private attemptRecovery(error: CHENUError): boolean {
    const key = error.code;
    const attempts = this.recoveryAttempts.get(key) || 0;

    if (attempts >= this.maxRecoveryAttempts) {
      return false;
    }

    this.recoveryAttempts.set(key, attempts + 1);
    return true;
  }

  private handleCriticalError(error: CHENUError): boolean {
    // Critical errors cannot be recovered
    logger.error('Critical error:', error.message);
    return false;
  }

  private handleUnknownError(error: Error): boolean {
    logger.error('Unknown error:', error.message);
    return false;
  }

  getErrorLog(): ErrorLog[] {
    return [...this.errorLog];
  }

  clearLog(): void {
    this.errorLog = [];
    this.recoveryAttempts.clear();
  }

  getRecoveryAttempts(code: string): number {
    return this.recoveryAttempts.get(code) || 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  private onError: ((error: Error, info: string) => void) | null = null;
  private fallback: string = 'An error occurred';

  setOnError(handler: (error: Error, info: string) => void): void {
    this.onError = handler;
  }

  setFallback(fallback: string): void {
    this.fallback = fallback;
  }

  catch(error: Error, info: string = ''): void {
    this.state = {
      hasError: true,
      error,
      errorInfo: info,
    };

    if (this.onError) {
      this.onError(error, info);
    }
  }

  reset(): void {
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  getFallback(): string {
    return this.fallback;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR TYPE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Error Types', () => {
  it('should create CHENUError', () => {
    const error = new CHENUError('Test error', 'TEST_ERROR');
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.recoverable).toBe(true);
  });

  it('should create SphereError', () => {
    const error = new SphereError('Sphere not found', 'personal');
    
    expect(error.sphereId).toBe('personal');
    expect(error.code).toBe('SPHERE_ERROR');
  });

  it('should create ThreadError', () => {
    const error = new ThreadError('Thread failed', 'thread_123');
    
    expect(error.threadId).toBe('thread_123');
    expect(error.code).toBe('THREAD_ERROR');
  });

  it('should create GovernanceError as non-recoverable', () => {
    const error = new GovernanceError('Governance violation', 'L7');
    
    expect(error.lawId).toBe('L7');
    expect(error.recoverable).toBe(false);
  });

  it('should create TokenBudgetError', () => {
    const error = new TokenBudgetError(1000, 500);
    
    expect(error.required).toBe(1000);
    expect(error.available).toBe(500);
    expect(error.message).toContain('Insufficient tokens');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Error Handler', () => {
  let handler: ErrorHandler;

  beforeEach(() => {
    handler = new ErrorHandler();
  });

  it('should log errors', () => {
    const error = new Error('Test error');
    handler.handle(error);
    
    const log = handler.getErrorLog();
    expect(log.length).toBe(1);
    expect(log[0].error).toBe(error);
  });

  it('should handle recoverable errors', () => {
    const error = new CHENUError('Recoverable', 'TEST', true);
    const handled = handler.handle(error);
    
    expect(handled).toBe(true);
  });

  it('should not handle critical errors', () => {
    const error = new GovernanceError('Critical', 'L7');
    const handled = handler.handle(error);
    
    expect(handled).toBe(false);
  });

  it('should limit recovery attempts', () => {
    const error = new CHENUError('Test', 'RETRY_TEST', true);
    
    // First 3 attempts should succeed
    expect(handler.handle(error)).toBe(true);
    expect(handler.handle(error)).toBe(true);
    expect(handler.handle(error)).toBe(true);
    
    // 4th attempt should fail
    expect(handler.handle(error)).toBe(false);
  });

  it('should track recovery attempts', () => {
    const error = new CHENUError('Test', 'TRACK_TEST', true);
    
    handler.handle(error);
    handler.handle(error);
    
    expect(handler.getRecoveryAttempts('TRACK_TEST')).toBe(2);
  });

  it('should clear error log', () => {
    handler.handle(new Error('Test'));
    handler.clearLog();
    
    expect(handler.getErrorLog().length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Error Boundary', () => {
  let boundary: ErrorBoundary;

  beforeEach(() => {
    boundary = new ErrorBoundary();
  });

  it('should start with no error', () => {
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
  });

  it('should catch errors', () => {
    const error = new Error('Test error');
    boundary.catch(error);
    
    expect(boundary.state.hasError).toBe(true);
    expect(boundary.state.error).toBe(error);
  });

  it('should reset error state', () => {
    boundary.catch(new Error('Test'));
    boundary.reset();
    
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
  });

  it('should call onError handler', () => {
    const onError = vi.fn();
    boundary.setOnError(onError);
    
    const error = new Error('Test');
    boundary.catch(error, 'component stack');
    
    expect(onError).toHaveBeenCalledWith(error, 'component stack');
  });

  it('should provide fallback', () => {
    boundary.setFallback('Custom fallback message');
    
    expect(boundary.getFallback()).toBe('Custom fallback message');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE ERROR HANDLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sphere Error Handling', () => {
  let handler: ErrorHandler;

  beforeEach(() => {
    handler = new ErrorHandler();
  });

  it('should handle sphere not found', () => {
    const error = new SphereError('Sphere not found', 'invalid_sphere');
    const handled = handler.handle(error, { operation: 'load' });
    
    expect(handled).toBe(true);
  });

  it('should handle all 9 sphere errors', () => {
    const spheres = [
      'personal', 'business', 'government', 'creative',
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    spheres.forEach(sphereId => {
      const error = new SphereError(`Error in ${sphereId}`, sphereId);
      const handled = handler.handle(error);
      expect(handled).toBe(true);
    });
    
    expect(handler.getErrorLog().length).toBe(9);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE ERROR HANDLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Error Handling', () => {
  let handler: ErrorHandler;

  beforeEach(() => {
    handler = new ErrorHandler();
  });

  it('should not recover from L7 violations', () => {
    const error = new GovernanceError('Agent tried autonomous action', 'L7');
    const handled = handler.handle(error);
    
    expect(handled).toBe(false);
  });

  it('should not recover from L9 violations', () => {
    const error = new GovernanceError('Cross-sphere data access', 'L9');
    const handled = handler.handle(error);
    
    expect(handled).toBe(false);
  });

  it('should log all governance violations', () => {
    const laws = ['L1', 'L5', 'L7', 'L9', 'L10'];
    
    laws.forEach(lawId => {
      const error = new GovernanceError(`Violation of ${lawId}`, lawId);
      handler.handle(error);
    });
    
    expect(handler.getErrorLog().length).toBe(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN ERROR HANDLING TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Token Error Handling', () => {
  let handler: ErrorHandler;

  beforeEach(() => {
    handler = new ErrorHandler();
  });

  it('should handle insufficient tokens', () => {
    const error = new TokenBudgetError(5000, 1000);
    const handled = handler.handle(error);
    
    expect(handled).toBe(true);
  });

  it('should provide token details in error', () => {
    const error = new TokenBudgetError(10000, 2500);
    
    expect(error.required).toBe(10000);
    expect(error.available).toBe(2500);
    expect(error.message).toContain('10000');
    expect(error.message).toContain('2500');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GRACEFUL DEGRADATION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Graceful Degradation', () => {
  it('should degrade gracefully on sphere error', () => {
    const boundary = new ErrorBoundary();
    boundary.setFallback('Unable to load sphere. Please try again.');
    
    boundary.catch(new SphereError('Load failed', 'personal'));
    
    expect(boundary.state.hasError).toBe(true);
    expect(boundary.getFallback()).toContain('Unable to load sphere');
  });

  it('should allow recovery after reset', () => {
    const boundary = new ErrorBoundary();
    
    boundary.catch(new Error('Temporary error'));
    expect(boundary.state.hasError).toBe(true);
    
    boundary.reset();
    expect(boundary.state.hasError).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY PROMPT ERROR COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe('Memory Prompt Error Compliance', () => {
  let handler: ErrorHandler;

  beforeEach(() => {
    handler = new ErrorHandler();
  });

  it('should enforce governance errors as non-recoverable (L7)', () => {
    const error = new GovernanceError('L7 violation', 'L7');
    
    expect(error.recoverable).toBe(false);
    expect(handler.handle(error)).toBe(false);
  });

  it('should handle errors for all 9 spheres', () => {
    const spheres = [
      'personal', 'business', 'government', 'creative',
      'community', 'social', 'entertainment', 'my_team', 'scholar'
    ];
    
    let handledCount = 0;
    spheres.forEach(id => {
      if (handler.handle(new SphereError('Error', id))) {
        handledCount++;
      }
    });
    
    expect(handledCount).toBe(9);
  });

  it('should include Scholar sphere in error handling', () => {
    const error = new SphereError('Scholar error', 'scholar');
    const handled = handler.handle(error);
    
    expect(handled).toBe(true);
    expect(error.sphereId).toBe('scholar');
  });

  it('should handle token budget errors (L8)', () => {
    const error = new TokenBudgetError(10000, 0);
    const handled = handler.handle(error);
    
    expect(handled).toBe(true);
    expect(error.code).toBe('TOKEN_ERROR');
  });
});
