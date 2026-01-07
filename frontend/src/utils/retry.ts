/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — RETRY UTILITIES                                 ║
 * ║                    Sprint B3.5: Advanced Retry Logic                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { AxiosError } from 'axios'

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number
  /** Base delay in milliseconds */
  baseDelay: number
  /** Maximum delay in milliseconds */
  maxDelay: number
  /** Backoff multiplier (exponential backoff) */
  backoffMultiplier: number
  /** Add random jitter to prevent thundering herd */
  jitter: boolean
  /** HTTP status codes that should trigger retry */
  retryableStatuses: number[]
  /** Error codes that should trigger retry */
  retryableErrors: string[]
  /** Callback before each retry */
  onRetry?: (attempt: number, error: Error, delay: number) => void
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', 'ECONNRESET', 'ECONNREFUSED'],
  onRetry: undefined,
}

// ============================================================================
// DELAY CALCULATION
// ============================================================================

/**
 * Calculate delay for retry attempt with exponential backoff and jitter
 */
export function calculateRetryDelay(
  attempt: number,
  config: Pick<RetryConfig, 'baseDelay' | 'maxDelay' | 'backoffMultiplier' | 'jitter'>
): number {
  // Exponential backoff: baseDelay * (multiplier ^ attempt)
  let delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt)
  
  // Cap at max delay
  delay = Math.min(delay, config.maxDelay)
  
  // Add jitter (±25%)
  if (config.jitter) {
    const jitterRange = delay * 0.25
    delay = delay + (Math.random() * jitterRange * 2) - jitterRange
  }
  
  return Math.round(delay)
}

/**
 * Wait for specified delay
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// ERROR CLASSIFICATION
// ============================================================================

/**
 * Check if error is retryable
 */
export function isRetryableError(
  error: unknown,
  config: Pick<RetryConfig, 'retryableStatuses' | 'retryableErrors'>
): boolean {
  // Axios error with response
  if (error instanceof AxiosError) {
    // Check status code
    if (error.response?.status) {
      return config.retryableStatuses.includes(error.response.status)
    }
    
    // Network errors (no response)
    if (!error.response) {
      // Check error code
      if (error.code && config.retryableErrors.includes(error.code)) {
        return true
      }
      // Generic network error
      if (error.message.includes('Network Error')) {
        return true
      }
    }
  }
  
  // Check error code property
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code
    if (config.retryableErrors.includes(code)) {
      return true
    }
  }
  
  return false
}

/**
 * Check if we should retry based on response headers
 */
export function getRetryAfterDelay(error: AxiosError): number | null {
  const retryAfter = error.response?.headers?.['retry-after']
  
  if (!retryAfter) return null
  
  // Retry-After can be a number (seconds) or HTTP date
  const parsed = parseInt(retryAfter, 10)
  
  if (!isNaN(parsed)) {
    return parsed * 1000 // Convert to milliseconds
  }
  
  // Try parsing as date
  const date = new Date(retryAfter)
  if (!isNaN(date.getTime())) {
    return Math.max(0, date.getTime() - Date.now())
  }
  
  return null
}

// ============================================================================
// RETRY WRAPPER
// ============================================================================

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: Error
  
  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Check if we should retry
      const shouldRetry = 
        attempt < finalConfig.maxRetries && 
        isRetryableError(error, finalConfig)
      
      if (!shouldRetry) {
        throw lastError
      }
      
      // Calculate delay
      let delay = calculateRetryDelay(attempt, finalConfig)
      
      // Check for Retry-After header
      if (error instanceof AxiosError) {
        const retryAfter = getRetryAfterDelay(error)
        if (retryAfter !== null) {
          delay = Math.min(retryAfter, finalConfig.maxDelay)
        }
      }
      
      // Call retry callback
      finalConfig.onRetry?.(attempt + 1, lastError, delay)
      
      // Wait before retry
      await wait(delay)
    }
  }
  
  throw lastError!
}

// ============================================================================
// TANSTACK QUERY RETRY FUNCTIONS
// ============================================================================

/**
 * Create retry function for TanStack Query
 */
export function createQueryRetryFn(config: Partial<RetryConfig> = {}) {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  
  return (failureCount: number, error: unknown): boolean => {
    // Don't retry if max retries reached
    if (failureCount >= finalConfig.maxRetries) {
      return false
    }
    
    // Check if error is retryable
    return isRetryableError(error, finalConfig)
  }
}

/**
 * Create retry delay function for TanStack Query
 */
export function createQueryRetryDelay(config: Partial<RetryConfig> = {}) {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  
  return (attemptIndex: number, error: unknown): number => {
    // Check for Retry-After header
    if (error instanceof AxiosError) {
      const retryAfter = getRetryAfterDelay(error)
      if (retryAfter !== null) {
        return Math.min(retryAfter, finalConfig.maxDelay)
      }
    }
    
    return calculateRetryDelay(attemptIndex, finalConfig)
  }
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

interface CircuitBreakerState {
  failures: number
  lastFailure: number | null
  state: 'closed' | 'open' | 'half-open'
}

interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold: number
  /** Time in ms before attempting to close circuit */
  resetTimeout: number
  /** Number of successful calls to close circuit from half-open */
  successThreshold: number
}

const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000,
  successThreshold: 2,
}

/**
 * Circuit breaker for protecting against cascading failures
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailure: null,
    state: 'closed',
  }
  private successCount = 0
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CIRCUIT_CONFIG, ...config }
  }

  /**
   * Execute function through circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from open to half-open
    if (this.state.state === 'open') {
      const timeSinceFailure = Date.now() - (this.state.lastFailure || 0)
      
      if (timeSinceFailure >= this.config.resetTimeout) {
        this.state.state = 'half-open'
        this.successCount = 0
      } else {
        throw new CircuitBreakerError('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    if (this.state.state === 'half-open') {
      this.successCount++
      
      if (this.successCount >= this.config.successThreshold) {
        this.state.state = 'closed'
        this.state.failures = 0
        this.state.lastFailure = null
      }
    } else {
      // Reset failures on success when closed
      this.state.failures = 0
    }
  }

  private onFailure() {
    this.state.failures++
    this.state.lastFailure = Date.now()

    if (this.state.state === 'half-open') {
      // Immediately open on failure in half-open state
      this.state.state = 'open'
    } else if (this.state.failures >= this.config.failureThreshold) {
      this.state.state = 'open'
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitBreakerState['state'] {
    return this.state.state
  }

  /**
   * Manually reset circuit breaker
   */
  reset() {
    this.state = {
      failures: 0,
      lastFailure: null,
      state: 'closed',
    }
    this.successCount = 0
  }
}

export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CircuitBreakerError'
  }
}

// ============================================================================
// RETRY HOOKS
// ============================================================================

import { useState, useCallback, useRef } from 'react'

interface UseRetryOptions extends Partial<RetryConfig> {
  immediate?: boolean
}

interface UseRetryState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  attempt: number
  isRetrying: boolean
}

/**
 * Hook for manual retry control
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: UseRetryOptions = {}
) {
  const { immediate = false, ...retryConfig } = options
  
  const [state, setState] = useState<UseRetryState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    attempt: 0,
    isRetrying: false,
  })
  
  const abortRef = useRef<AbortController | null>(null)
  
  const execute = useCallback(async () => {
    // Abort previous request
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      attempt: 0,
      isRetrying: false,
    }))
    
    try {
      const result = await withRetry(fn, {
        ...retryConfig,
        onRetry: (attempt, error, delay) => {
          setState(prev => ({
            ...prev,
            attempt,
            isRetrying: true,
          }))
          retryConfig.onRetry?.(attempt, error, delay)
        },
      })
      
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        isRetrying: false,
      }))
      
      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      
      setState(prev => ({
        ...prev,
        error: err,
        isLoading: false,
        isRetrying: false,
      }))
      
      throw err
    }
  }, [fn, retryConfig])
  
  const abort = useCallback(() => {
    abortRef.current?.abort()
    setState(prev => ({
      ...prev,
      isLoading: false,
      isRetrying: false,
    }))
  }, [])
  
  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({
      data: null,
      error: null,
      isLoading: false,
      attempt: 0,
      isRetrying: false,
    })
  }, [])
  
  return {
    ...state,
    execute,
    abort,
    reset,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  calculateRetryDelay,
  wait,
  isRetryableError,
  getRetryAfterDelay,
  withRetry,
  createQueryRetryFn,
  createQueryRetryDelay,
}
