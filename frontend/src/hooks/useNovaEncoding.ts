/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — USE NOVA ENCODING HOOK                      ║
 * ║                    Semantic Encoder Integration                               ║
 * ║                    Task A6: Agent Alpha Roadmap                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * This hook connects Nova (the system intelligence) to the Semantic Encoder.
 * It transforms natural language user inputs into structured, executable actions.
 *
 * ENCODING FLOW:
 * 1. User input → Nova
 * 2. Nova → Semantic Encoder (this hook)
 * 3. Semantic Encoder → Encoded Actions
 * 4. Encoded Actions → Checkpoint (if required)
 * 5. Checkpoint Approval → Execution
 *
 * GOVERNANCE INTEGRATION:
 * - All actions requiring governance go through checkpoints
 * - Token budget is checked before execution
 * - Audit trail is maintained for all encodings
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useGovernanceStore, useNovaStore, useAuthStore } from '@/stores'
import type { SphereId } from '@/stores/memory.store'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Action types that can be encoded
 */
export type EncodedActionType =
  | 'create'      // Create new resource
  | 'read'        // Read/fetch data
  | 'update'      // Modify existing resource
  | 'delete'      // Remove resource
  | 'analyze'     // Analyze data
  | 'summarize'   // Summarize content
  | 'generate'    // Generate new content
  | 'search'      // Search for resources
  | 'compare'     // Compare multiple items
  | 'extract'     // Extract information
  | 'transform'   // Transform data format
  | 'validate'    // Validate data
  | 'notify'      // Send notification
  | 'schedule'    // Schedule task
  | 'delegate'    // Delegate to agent

/**
 * Target resource types
 */
export type EncodedTargetType =
  | 'thread'
  | 'memory'
  | 'dataspace'
  | 'agent'
  | 'meeting'
  | 'document'
  | 'task'
  | 'checkpoint'
  | 'token'
  | 'sphere'
  | 'external'

/**
 * Sensitivity level for checkpoint requirements
 */
export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical'

/**
 * Single encoded action
 */
export interface EncodedAction {
  id: string
  type: EncodedActionType
  target_type: EncodedTargetType
  target_id?: string
  target_name?: string
  parameters: Record<string, unknown>
  estimated_tokens: number
  requires_checkpoint: boolean
  sensitivity: SensitivityLevel
  dependencies: string[] // IDs of actions this depends on
  order: number
}

/**
 * Complete semantic encoding result
 */
export interface SemanticEncoding {
  id: string
  version: string
  
  // Input
  original_input: string
  normalized_input: string
  language: 'fr' | 'en'
  
  // Context
  user_id: string
  identity_id: string
  sphere_id: SphereId
  session_id: string
  
  // Actions
  actions: EncodedAction[]
  action_count: number
  
  // Targets
  target_spheres: SphereId[]
  target_types: EncodedTargetType[]
  
  // Estimates
  estimated_total_tokens: number
  estimated_duration_ms: number
  
  // Governance
  requires_checkpoint: boolean
  checkpoint_type?: 'pre_action' | 'pre_modification' | 'pre_deletion' | 'pre_external'
  max_sensitivity: SensitivityLevel
  
  // Quality
  encoding_quality_score: number
  confidence_score: number
  ambiguity_flags: string[]
  
  // Timestamps
  encoded_at: string
  expires_at: string
}

/**
 * Encoding request options
 */
export interface EncodingOptions {
  /** Force checkpoint even for low sensitivity actions */
  forceCheckpoint?: boolean
  /** Skip encoding cache */
  skipCache?: boolean
  /** Context from previous conversation */
  conversationContext?: string[]
  /** Preferred execution sphere */
  preferredSphere?: SphereId
  /** Max tokens budget for this encoding */
  maxTokens?: number
}

/**
 * Execution result
 */
export interface ExecutionResult {
  id: string
  encoding_id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'awaiting_approval'
  checkpoint_id?: string
  progress: number
  tokens_used: number
  started_at: string
  completed_at?: string
  output?: unknown
  error?: string
}

/**
 * Encoding error
 */
export interface EncodingError {
  code: string
  message: string
  details?: Record<string, unknown>
  recoverable: boolean
  suggestions?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = '/api/v1/encoding'

// Actions that always require checkpoint
const CHECKPOINT_REQUIRED_ACTIONS: EncodedActionType[] = [
  'delete',
  'delegate',
  'notify',
]

// Actions that require checkpoint if targeting external resources
const CHECKPOINT_EXTERNAL_ACTIONS: EncodedActionType[] = [
  'create',
  'update',
  'transform',
]

// High sensitivity targets
const HIGH_SENSITIVITY_TARGETS: EncodedTargetType[] = [
  'checkpoint',
  'token',
  'external',
]

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export function useNovaEncoding() {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  const [encoding, setEncoding] = useState<SemanticEncoding | null>(null)
  const [execution, setExecution] = useState<ExecutionResult | null>(null)
  const [isEncoding, setIsEncoding] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<EncodingError | null>(null)

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null)
  const executionWsRef = useRef<WebSocket | null>(null)

  // Store access
  const { user } = useAuthStore()
  const { addMessage, setTyping } = useNovaStore()
  const { 
    createCheckpoint, 
    pendingCheckpoints,
    tokenBudget,
    consumeTokens,
  } = useGovernanceStore()

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      executionWsRef.current?.close()
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // ENCODING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Encode a natural language input into structured actions
   */
  const encode = useCallback(async (
    input: string,
    options: EncodingOptions = {}
  ): Promise<SemanticEncoding> => {
    // Abort any pending request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setIsEncoding(true)
    setError(null)
    setTyping(true)

    try {
      // Check token budget
      if (options.maxTokens && tokenBudget) {
        const available = tokenBudget.limit - tokenBudget.used
        if (available < options.maxTokens) {
          throw {
            code: 'INSUFFICIENT_TOKENS',
            message: `Insufficient token budget. Available: ${available}, Required: ${options.maxTokens}`,
            recoverable: false,
          } as EncodingError
        }
      }

      const response = await fetch(`${API_BASE}/encode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          user_id: user?.id,
          options: {
            force_checkpoint: options.forceCheckpoint,
            skip_cache: options.skipCache,
            conversation_context: options.conversationContext,
            preferred_sphere: options.preferredSphere,
            max_tokens: options.maxTokens,
          },
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw {
          code: errorData.code || 'ENCODING_FAILED',
          message: errorData.message || 'Failed to encode input',
          details: errorData.details,
          recoverable: response.status < 500,
          suggestions: errorData.suggestions,
        } as EncodingError
      }

      const data: SemanticEncoding = await response.json()
      setEncoding(data)

      // Add encoding message to Nova chat
      addMessage({
        id: `encoding-${data.id}`,
        role: 'assistant',
        type: 'encoding',
        content: data,
        timestamp: new Date().toISOString(),
      })

      return data
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw { code: 'CANCELLED', message: 'Encoding cancelled', recoverable: true }
      }
      
      const encodingError = err as EncodingError
      setError(encodingError)
      throw encodingError
    } finally {
      setIsEncoding(false)
      setTyping(false)
    }
  }, [user, tokenBudget, addMessage, setTyping])

  // ─────────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Execute an encoding, creating checkpoint if required
   */
  const execute = useCallback(async (
    encodingToExecute: SemanticEncoding = encoding!
  ): Promise<ExecutionResult> => {
    if (!encodingToExecute) {
      throw { code: 'NO_ENCODING', message: 'No encoding to execute', recoverable: false }
    }

    setIsExecuting(true)
    setError(null)

    try {
      // Check if checkpoint is required
      if (encodingToExecute.requires_checkpoint) {
        const checkpoint = await createCheckpoint({
          type: encodingToExecute.checkpoint_type || 'pre_action',
          encoding_id: encodingToExecute.id,
          description: `Execute: ${encodingToExecute.original_input}`,
          estimated_cost: encodingToExecute.estimated_total_tokens,
          sensitivity: encodingToExecute.max_sensitivity,
          actions: encodingToExecute.actions.map(a => ({
            type: a.type,
            target: a.target_type,
            description: a.target_name || a.target_id,
          })),
        })

        // Return awaiting approval status
        const result: ExecutionResult = {
          id: `exec-pending-${checkpoint.id}`,
          encoding_id: encodingToExecute.id,
          status: 'awaiting_approval',
          checkpoint_id: checkpoint.id,
          progress: 0,
          tokens_used: 0,
          started_at: new Date().toISOString(),
        }

        setExecution(result)
        return result
      }

      // Direct execution (no checkpoint needed)
      return await executeNow(encodingToExecute)
    } catch (err) {
      const execError = err as EncodingError
      setError(execError)
      throw execError
    } finally {
      setIsExecuting(false)
    }
  }, [encoding, createCheckpoint])

  /**
   * Execute immediately (after checkpoint approval or for low-sensitivity actions)
   */
  const executeNow = useCallback(async (
    encodingToExecute: SemanticEncoding
  ): Promise<ExecutionResult> => {
    const response = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encoding_id: encodingToExecute.id,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw {
        code: errorData.code || 'EXECUTION_FAILED',
        message: errorData.message || 'Execution failed',
        recoverable: false,
      } as EncodingError
    }

    const result: ExecutionResult = await response.json()
    setExecution(result)

    // Consume tokens
    if (result.tokens_used > 0) {
      await consumeTokens(result.tokens_used, `execution-${result.id}`)
    }

    // Subscribe to execution updates via WebSocket
    subscribeToExecution(result.id)

    return result
  }, [consumeTokens])

  /**
   * Subscribe to real-time execution updates
   */
  const subscribeToExecution = useCallback((executionId: string) => {
    // Close existing connection
    executionWsRef.current?.close()

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/executions/${executionId}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'progress') {
        setExecution(prev => prev ? { ...prev, progress: data.progress } : null)
      } else if (data.type === 'complete') {
        setExecution(prev => prev ? {
          ...prev,
          status: 'completed',
          progress: 100,
          completed_at: new Date().toISOString(),
          output: data.output,
        } : null)
        ws.close()
      } else if (data.type === 'error') {
        setExecution(prev => prev ? {
          ...prev,
          status: 'failed',
          error: data.error,
        } : null)
        setError({
          code: 'EXECUTION_ERROR',
          message: data.error,
          recoverable: false,
        })
        ws.close()
      }
    }

    ws.onerror = () => {
      setError({
        code: 'WS_ERROR',
        message: 'Lost connection to execution service',
        recoverable: true,
      })
    }

    executionWsRef.current = ws
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // CHECKPOINT HANDLING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handle checkpoint approval - continue execution
   */
  const onCheckpointApproved = useCallback(async (checkpointId: string) => {
    const pendingExecution = execution
    if (!pendingExecution || pendingExecution.checkpoint_id !== checkpointId) {
      return
    }

    // Find the encoding and execute
    if (encoding) {
      await executeNow(encoding)
    }
  }, [execution, encoding, executeNow])

  /**
   * Handle checkpoint rejection - cancel execution
   */
  const onCheckpointRejected = useCallback((checkpointId: string, reason?: string) => {
    if (execution?.checkpoint_id === checkpointId) {
      setExecution(prev => prev ? {
        ...prev,
        status: 'cancelled',
        error: reason || 'Checkpoint rejected',
      } : null)
    }
  }, [execution])

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Cancel ongoing encoding or execution
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
    executionWsRef.current?.close()
    
    setIsEncoding(false)
    setIsExecuting(false)
    
    if (execution?.status === 'running') {
      // Cancel via API
      fetch(`${API_BASE}/cancel/${execution.id}`, { method: 'POST' })
      setExecution(prev => prev ? { ...prev, status: 'cancelled' } : null)
    }
  }, [execution])

  /**
   * Clear current encoding and execution state
   */
  const reset = useCallback(() => {
    setEncoding(null)
    setExecution(null)
    setError(null)
  }, [])

  /**
   * Estimate tokens for an input without full encoding
   */
  const estimateTokens = useCallback(async (input: string): Promise<number> => {
    const response = await fetch(`${API_BASE}/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    const data = await response.json()
    return data.estimated_tokens
  }, [])

  /**
   * Check if an action type requires checkpoint
   */
  const requiresCheckpoint = useCallback((
    actionType: EncodedActionType,
    targetType: EncodedTargetType
  ): boolean => {
    if (CHECKPOINT_REQUIRED_ACTIONS.includes(actionType)) {
      return true
    }
    
    if (CHECKPOINT_EXTERNAL_ACTIONS.includes(actionType) && targetType === 'external') {
      return true
    }
    
    if (HIGH_SENSITIVITY_TARGETS.includes(targetType)) {
      return true
    }
    
    return false
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────────

  return {
    // State
    encoding,
    execution,
    isEncoding,
    isExecuting,
    error,

    // Actions
    encode,
    execute,
    executeNow,
    cancel,
    reset,

    // Utilities
    estimateTokens,
    requiresCheckpoint,

    // Checkpoint handlers
    onCheckpointApproved,
    onCheckpointRejected,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get actions by type from encoding
 */
export const getActionsByType = (
  encoding: SemanticEncoding,
  type: EncodedActionType
): EncodedAction[] => {
  return encoding.actions.filter(a => a.type === type)
}

/**
 * Get actions requiring checkpoint
 */
export const getCheckpointActions = (
  encoding: SemanticEncoding
): EncodedAction[] => {
  return encoding.actions.filter(a => a.requires_checkpoint)
}

/**
 * Get total estimated tokens
 */
export const getTotalTokens = (encoding: SemanticEncoding): number => {
  return encoding.actions.reduce((sum, a) => sum + a.estimated_tokens, 0)
}

/**
 * Check if encoding has any high sensitivity actions
 */
export const hasHighSensitivity = (encoding: SemanticEncoding): boolean => {
  return encoding.actions.some(a => 
    a.sensitivity === 'high' || a.sensitivity === 'critical'
  )
}

/**
 * Get action execution order (respecting dependencies)
 */
export const getExecutionOrder = (encoding: SemanticEncoding): EncodedAction[] => {
  return [...encoding.actions].sort((a, b) => a.order - b.order)
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  EncodedActionType,
  EncodedTargetType,
  SensitivityLevel,
  EncodedAction,
  SemanticEncoding,
  EncodingOptions,
  ExecutionResult,
  EncodingError,
}
