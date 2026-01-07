// CHE·NU™ Error Handling System
// Comprehensive error handling, tracking, and reporting

// ============================================================
// ERROR TYPES
// ============================================================

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'network'
  | 'database'
  | 'server'
  | 'client'
  | 'governance'
  | 'token'
  | 'encoding'
  | 'agent'
  | 'unknown';

interface ErrorContext {
  userId?: string;
  sphereCode?: string;
  threadId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  requestId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ErrorReport {
  id: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  stack?: string;
  originalError?: Error;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  retryable: boolean;
  userFacing: boolean;
  userMessage?: string;
}

// ============================================================
// CUSTOM ERROR CLASSES
// ============================================================

export class ChenuError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly retryable: boolean;
  public readonly userFacing: boolean;
  public readonly userMessage?: string;
  public readonly context: Partial<ErrorContext>;
  public readonly originalError?: Error;

  constructor(
    message: string,
    options: {
      code: string;
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      retryable?: boolean;
      userFacing?: boolean;
      userMessage?: string;
      context?: Partial<ErrorContext>;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'ChenuError';
    this.code = options.code;
    this.severity = options.severity || 'medium';
    this.category = options.category || 'unknown';
    this.retryable = options.retryable ?? false;
    this.userFacing = options.userFacing ?? true;
    this.userMessage = options.userMessage;
    this.context = options.context || {};
    this.originalError = options.cause;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChenuError);
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      userFacing: this.userFacing,
      userMessage: this.userMessage,
      context: this.context,
      stack: this.stack,
    };
  }
}

// Authentication Errors
export class AuthenticationError extends ChenuError {
  constructor(message: string, options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>) {
    super(message, {
      code: options?.code || 'AUTH_ERROR',
      category: 'authentication',
      severity: 'high',
      userFacing: true,
      userMessage: 'Authentication failed. Please try logging in again.',
      ...options,
    });
    this.name = 'AuthenticationError';
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message = 'Invalid email or password') {
    super(message, {
      code: 'INVALID_CREDENTIALS',
      userMessage: 'The email or password you entered is incorrect.',
    });
    this.name = 'InvalidCredentialsError';
  }
}

export class SessionExpiredError extends AuthenticationError {
  constructor(message = 'Session has expired') {
    super(message, {
      code: 'SESSION_EXPIRED',
      retryable: true,
      userMessage: 'Your session has expired. Please log in again.',
    });
    this.name = 'SessionExpiredError';
  }
}

export class TokenRefreshError extends AuthenticationError {
  constructor(message = 'Failed to refresh token') {
    super(message, {
      code: 'TOKEN_REFRESH_FAILED',
      retryable: true,
      userMessage: 'Unable to refresh your session. Please log in again.',
    });
    this.name = 'TokenRefreshError';
  }
}

// Authorization Errors
export class AuthorizationError extends ChenuError {
  constructor(message: string, options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>) {
    super(message, {
      code: options?.code || 'AUTHZ_ERROR',
      category: 'authorization',
      severity: 'high',
      userFacing: true,
      userMessage: 'You do not have permission to perform this action.',
      ...options,
    });
    this.name = 'AuthorizationError';
  }
}

export class AccessDeniedError extends AuthorizationError {
  constructor(resource: string, action: string) {
    super(`Access denied: Cannot ${action} ${resource}`, {
      code: 'ACCESS_DENIED',
      userMessage: `You don't have permission to ${action} this ${resource}.`,
    });
    this.name = 'AccessDeniedError';
  }
}

export class InsufficientPermissionsError extends AuthorizationError {
  constructor(requiredPermission: string) {
    super(`Insufficient permissions: ${requiredPermission} required`, {
      code: 'INSUFFICIENT_PERMISSIONS',
      userMessage: 'You need additional permissions to perform this action.',
    });
    this.name = 'InsufficientPermissionsError';
  }
}

// Validation Errors
export class ValidationError extends ChenuError {
  public readonly fields: Record<string, string>;

  constructor(
    message: string,
    fields: Record<string, string> = {},
    options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>
  ) {
    super(message, {
      code: options?.code || 'VALIDATION_ERROR',
      category: 'validation',
      severity: 'low',
      userFacing: true,
      userMessage: 'Please check your input and try again.',
      ...options,
    });
    this.name = 'ValidationError';
    this.fields = fields;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(fieldName: string) {
    super(`${fieldName} is required`, { [fieldName]: `${fieldName} is required` }, {
      code: 'REQUIRED_FIELD',
      userMessage: `Please provide a value for ${fieldName}.`,
    });
    this.name = 'RequiredFieldError';
  }
}

export class InvalidFormatError extends ValidationError {
  constructor(fieldName: string, expectedFormat: string) {
    super(
      `${fieldName} has invalid format`,
      { [fieldName]: `Expected format: ${expectedFormat}` },
      {
        code: 'INVALID_FORMAT',
        userMessage: `Please enter a valid ${fieldName}.`,
      }
    );
    this.name = 'InvalidFormatError';
  }
}

// Network Errors
export class NetworkError extends ChenuError {
  public readonly statusCode?: number;

  constructor(
    message: string,
    statusCode?: number,
    options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>
  ) {
    super(message, {
      code: options?.code || 'NETWORK_ERROR',
      category: 'network',
      severity: 'medium',
      retryable: true,
      userFacing: true,
      userMessage: 'A network error occurred. Please check your connection.',
      ...options,
    });
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

export class ConnectionTimeoutError extends NetworkError {
  constructor(timeout: number) {
    super(`Connection timed out after ${timeout}ms`, undefined, {
      code: 'CONNECTION_TIMEOUT',
      retryable: true,
      userMessage: 'The request took too long. Please try again.',
    });
    this.name = 'ConnectionTimeoutError';
  }
}

export class ServiceUnavailableError extends NetworkError {
  constructor(serviceName: string) {
    super(`Service ${serviceName} is unavailable`, 503, {
      code: 'SERVICE_UNAVAILABLE',
      severity: 'high',
      retryable: true,
      userMessage: 'The service is temporarily unavailable. Please try again later.',
    });
    this.name = 'ServiceUnavailableError';
  }
}

// Database Errors
export class DatabaseError extends ChenuError {
  constructor(message: string, options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>) {
    super(message, {
      code: options?.code || 'DATABASE_ERROR',
      category: 'database',
      severity: 'high',
      userFacing: false,
      userMessage: 'An internal error occurred. Please try again.',
      ...options,
    });
    this.name = 'DatabaseError';
  }
}

export class RecordNotFoundError extends DatabaseError {
  constructor(recordType: string, id: string) {
    super(`${recordType} with id ${id} not found`, {
      code: 'RECORD_NOT_FOUND',
      severity: 'low',
      userFacing: true,
      userMessage: `The requested ${recordType.toLowerCase()} could not be found.`,
    });
    this.name = 'RecordNotFoundError';
  }
}

export class DuplicateRecordError extends DatabaseError {
  constructor(recordType: string, field: string) {
    super(`${recordType} with this ${field} already exists`, {
      code: 'DUPLICATE_RECORD',
      severity: 'low',
      userFacing: true,
      userMessage: `A ${recordType.toLowerCase()} with this ${field} already exists.`,
    });
    this.name = 'DuplicateRecordError';
  }
}

// Governance Errors (Memory Prompt: Governance is ALWAYS enforced)
export class GovernanceError extends ChenuError {
  public readonly lawNumber?: number;
  public readonly violations: string[];

  constructor(
    message: string,
    violations: string[] = [],
    lawNumber?: number,
    options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>
  ) {
    super(message, {
      code: options?.code || 'GOVERNANCE_ERROR',
      category: 'governance',
      severity: 'high',
      userFacing: true,
      userMessage: 'This action violates governance policies.',
      ...options,
    });
    this.name = 'GovernanceError';
    this.lawNumber = lawNumber;
    this.violations = violations;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      lawNumber: this.lawNumber,
      violations: this.violations,
    };
  }
}

export class ConsentRequiredError extends GovernanceError {
  constructor(action: string) {
    super(`Consent required for action: ${action}`, ['Law 1: Consent Primacy violated'], 1, {
      code: 'CONSENT_REQUIRED',
      userMessage: 'Your consent is required before proceeding with this action.',
    });
    this.name = 'ConsentRequiredError';
  }
}

export class CrossSphereViolationError extends GovernanceError {
  constructor(fromSphere: string, toSphere: string) {
    super(
      `Cross-sphere access violation: ${fromSphere} → ${toSphere}`,
      ['Law 9: Cross-Sphere Isolation violated'],
      9,
      {
        code: 'CROSS_SPHERE_VIOLATION',
        userMessage: 'This action would violate sphere boundaries.',
      }
    );
    this.name = 'CrossSphereViolationError';
  }
}

export class AgentAutonomyViolationError extends GovernanceError {
  constructor(agentId: string) {
    super(
      `Agent ${agentId} attempted autonomous action`,
      ['Law 7: Agent Non-Autonomy violated'],
      7,
      {
        code: 'AGENT_AUTONOMY_VIOLATION',
        severity: 'critical',
        userMessage: 'Agent actions must be authorized by the user.',
      }
    );
    this.name = 'AgentAutonomyViolationError';
  }
}

// Token Budget Errors (Memory Prompt: Tokens are NOT cryptocurrency)
export class TokenError extends ChenuError {
  constructor(message: string, options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>) {
    super(message, {
      code: options?.code || 'TOKEN_ERROR',
      category: 'token',
      severity: 'medium',
      userFacing: true,
      userMessage: 'An error occurred with token allocation.',
      ...options,
    });
    this.name = 'TokenError';
  }
}

export class InsufficientTokensError extends TokenError {
  public readonly required: number;
  public readonly available: number;

  constructor(required: number, available: number) {
    super(`Insufficient tokens: required ${required}, available ${available}`, {
      code: 'INSUFFICIENT_TOKENS',
      userMessage: `Not enough tokens. You need ${required - available} more tokens.`,
    });
    this.name = 'InsufficientTokensError';
    this.required = required;
    this.available = available;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      required: this.required,
      available: this.available,
    };
  }
}

export class TokenBudgetExceededError extends TokenError {
  constructor(budgetType: 'thread' | 'meeting' | 'agent' | 'sphere') {
    super(`Token budget exceeded for ${budgetType}`, {
      code: 'BUDGET_EXCEEDED',
      userMessage: `You've reached the token limit for this ${budgetType}.`,
    });
    this.name = 'TokenBudgetExceededError';
  }
}

// Encoding Errors
export class EncodingError extends ChenuError {
  constructor(message: string, options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>) {
    super(message, {
      code: options?.code || 'ENCODING_ERROR',
      category: 'encoding',
      severity: 'medium',
      userFacing: true,
      userMessage: 'An error occurred during encoding.',
      ...options,
    });
    this.name = 'EncodingError';
  }
}

export class DecodingError extends EncodingError {
  constructor(message = 'Failed to decode content') {
    super(message, {
      code: 'DECODING_ERROR',
      userMessage: 'Unable to decode the content. It may be corrupted.',
    });
    this.name = 'DecodingError';
  }
}

// Agent Errors
export class AgentError extends ChenuError {
  public readonly agentId?: string;

  constructor(
    message: string,
    agentId?: string,
    options?: Partial<Omit<ConstructorParameters<typeof ChenuError>[1], 'category'>>
  ) {
    super(message, {
      code: options?.code || 'AGENT_ERROR',
      category: 'agent',
      severity: 'medium',
      userFacing: true,
      userMessage: 'An error occurred with the agent.',
      ...options,
    });
    this.name = 'AgentError';
    this.agentId = agentId;
  }
}

export class AgentUnavailableError extends AgentError {
  constructor(agentId: string) {
    super(`Agent ${agentId} is unavailable`, agentId, {
      code: 'AGENT_UNAVAILABLE',
      retryable: true,
      userMessage: 'The agent is currently busy. Please try again later.',
    });
    this.name = 'AgentUnavailableError';
  }
}

export class AgentTaskFailedError extends AgentError {
  constructor(agentId: string, taskId: string, reason: string) {
    super(`Agent ${agentId} failed to complete task ${taskId}: ${reason}`, agentId, {
      code: 'AGENT_TASK_FAILED',
      userMessage: 'The agent was unable to complete the task.',
    });
    this.name = 'AgentTaskFailedError';
  }
}

// ============================================================
// ERROR HANDLER
// ============================================================

type ErrorHandler = (error: ChenuError) => void;
type ErrorFilter = (error: ChenuError) => boolean;

class ErrorManager {
  private handlers: Map<ErrorCategory | 'all', ErrorHandler[]> = new Map();
  private filters: ErrorFilter[] = [];
  private errorLog: ErrorReport[] = [];
  private maxLogSize: number = 1000;

  constructor() {
    this.setupDefaultHandlers();
  }

  private setupDefaultHandlers(): void {
    // Default console logging
    this.addHandler('all', (error) => {
      if (process.env.NODE_ENV !== 'production') {
        logger.error(`[${error.category.toUpperCase()}] ${error.code}:`, error.message);
        if (error.stack) {
          logger.error(error.stack);
        }
      }
    });
  }

  addHandler(category: ErrorCategory | 'all', handler: ErrorHandler): void {
    const handlers = this.handlers.get(category) || [];
    handlers.push(handler);
    this.handlers.set(category, handlers);
  }

  removeHandler(category: ErrorCategory | 'all', handler: ErrorHandler): void {
    const handlers = this.handlers.get(category) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  addFilter(filter: ErrorFilter): void {
    this.filters.push(filter);
  }

  handle(error: Error | ChenuError, context?: Partial<ErrorContext>): ErrorReport {
    // Convert to ChenuError if necessary
    const chenuError = this.normalizeError(error, context);

    // Check filters
    const shouldProcess = this.filters.every((filter) => filter(chenuError));
    if (!shouldProcess) {
      return this.createReport(chenuError, false);
    }

    // Execute handlers
    this.executeHandlers(chenuError);

    // Log the error
    const report = this.createReport(chenuError, true);
    this.logError(report);

    return report;
  }

  private normalizeError(error: Error | ChenuError, context?: Partial<ErrorContext>): ChenuError {
    if (error instanceof ChenuError) {
      if (context) {
        error.context.userId = context.userId || error.context.userId;
        error.context.sphereCode = context.sphereCode || error.context.sphereCode;
        error.context.action = context.action || error.context.action;
      }
      return error;
    }

    // Convert standard Error to ChenuError
    return new ChenuError(error.message, {
      code: 'UNKNOWN_ERROR',
      category: 'unknown',
      severity: 'medium',
      context,
      cause: error,
    });
  }

  private executeHandlers(error: ChenuError): void {
    // Execute category-specific handlers
    const categoryHandlers = this.handlers.get(error.category) || [];
    categoryHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (e) {
        logger.error('Error handler failed:', e);
      }
    });

    // Execute global handlers
    const globalHandlers = this.handlers.get('all') || [];
    globalHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (e) {
        logger.error('Global error handler failed:', e);
      }
    });
  }

  private createReport(error: ChenuError, processed: boolean): ErrorReport {
    return {
      id: this.generateId(),
      code: error.code,
      message: error.message,
      severity: error.severity,
      category: error.category,
      context: {
        ...error.context,
        timestamp: new Date().toISOString(),
      },
      stack: error.stack,
      originalError: error.originalError,
      resolved: false,
      retryable: error.retryable,
      userFacing: error.userFacing,
      userMessage: error.userMessage,
    };
  }

  private logError(report: ErrorReport): void {
    this.errorLog.unshift(report);
    
    // Maintain max log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
  }

  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getErrorLog(): ErrorReport[] {
    return [...this.errorLog];
  }

  getErrorsByCategory(category: ErrorCategory): ErrorReport[] {
    return this.errorLog.filter((e) => e.category === category);
  }

  getErrorsBySeverity(severity: ErrorSeverity): ErrorReport[] {
    return this.errorLog.filter((e) => e.severity === severity);
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  resolveError(errorId: string, resolvedBy?: string): boolean {
    const error = this.errorLog.find((e) => e.id === errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = new Date().toISOString();
      error.resolvedBy = resolvedBy;
      return true;
    }
    return false;
  }
}

// ============================================================
// ERROR BOUNDARY HELPER
// ============================================================

export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

export function getErrorMessage(error: Error | ChenuError): string {
  if (error instanceof ChenuError && error.userFacing && error.userMessage) {
    return error.userMessage;
  }
  return 'An unexpected error occurred. Please try again.';
}

export function isRetryableError(error: Error | ChenuError): boolean {
  if (error instanceof ChenuError) {
    return error.retryable;
  }
  return false;
}

export function getErrorSeverity(error: Error | ChenuError): ErrorSeverity {
  if (error instanceof ChenuError) {
    return error.severity;
  }
  return 'medium';
}

// ============================================================
// HTTP ERROR HELPERS
// ============================================================

export function createHttpError(statusCode: number, message?: string): ChenuError {
  const messages: Record<number, { code: string; message: string; userMessage: string }> = {
    400: {
      code: 'BAD_REQUEST',
      message: 'Bad request',
      userMessage: 'The request was invalid. Please check your input.',
    },
    401: {
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
      userMessage: 'Please log in to continue.',
    },
    403: {
      code: 'FORBIDDEN',
      message: 'Forbidden',
      userMessage: 'You do not have permission to access this resource.',
    },
    404: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      userMessage: 'The requested resource could not be found.',
    },
    409: {
      code: 'CONFLICT',
      message: 'Conflict',
      userMessage: 'This action conflicts with an existing resource.',
    },
    422: {
      code: 'UNPROCESSABLE_ENTITY',
      message: 'Unprocessable entity',
      userMessage: 'The data provided could not be processed.',
    },
    429: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests',
      userMessage: 'You are sending too many requests. Please wait a moment.',
    },
    500: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      userMessage: 'An internal error occurred. Please try again later.',
    },
    502: {
      code: 'BAD_GATEWAY',
      message: 'Bad gateway',
      userMessage: 'The server is temporarily unavailable.',
    },
    503: {
      code: 'SERVICE_UNAVAILABLE',
      message: 'Service unavailable',
      userMessage: 'The service is temporarily unavailable. Please try again later.',
    },
    504: {
      code: 'GATEWAY_TIMEOUT',
      message: 'Gateway timeout',
      userMessage: 'The request took too long. Please try again.',
    },
  };

  const info = messages[statusCode] || {
    code: `HTTP_${statusCode}`,
    message: message || 'Unknown error',
    userMessage: 'An error occurred. Please try again.',
  };

  const category: ErrorCategory = statusCode >= 500 ? 'server' : 'client';
  const severity: ErrorSeverity = statusCode >= 500 ? 'high' : 'medium';

  return new ChenuError(message || info.message, {
    code: info.code,
    category,
    severity,
    retryable: statusCode >= 500 || statusCode === 429,
    userFacing: true,
    userMessage: info.userMessage,
  });
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

export const errorManager = new ErrorManager();

// ============================================================
// EXPORTS
// ============================================================

export {
  ErrorManager,
  type ErrorContext,
  type ErrorReport,
};

export default errorManager;
