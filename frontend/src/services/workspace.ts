// ============================================================
// CHE·NU - Workspace API Service
// ============================================================
// NO LLM in frontend!
// All intelligence is backend-side.
// ============================================================

import { api } from './api'

// Types
export interface TokenEstimation {
  estimatedTokens: number
  estimatedCostUSD: number
  model: string
  contentLength: number
  warnings: string[]
}

export interface BudgetStatus {
  meetingId: string
  maxTokens: number
  usedTokens: number
  remainingTokens: number
}

export interface BudgetCheck {
  canProceed: boolean
  remainingTokens: number
  requestedTokens: number
  message: string
  warningLevel: 'none' | 'low' | 'medium' | 'high' | 'blocked'
}

export interface StructureProposal {
  proposalId: string
  structured: string
  metadata: Record<string, any>
  requiresConfirmation: boolean
}

export interface BudgetPreset {
  name: string
  maxTokens: number
  description: string
}

// ============================================================
// API CALLS
// ============================================================

/**
 * Estimate tokens BEFORE generation
 * ⚠️ MUST be called before any structure request!
 */
export async function estimateGeneration(
  content: string, 
  model: 'small' | 'medium' | 'large' = 'medium'
): Promise<TokenEstimation> {
  return api.post('/workspace/estimate', { content, model })
}

/**
 * Create a new meeting budget
 */
export async function createMeetingBudget(
  preset: string = 'balanced'
): Promise<BudgetStatus> {
  return api.post(`/workspace/budget/create?preset=${preset}`)
}

/**
 * Check if tokens can be consumed from budget
 * ⚠️ This is a CHECK only - does not consume!
 */
export async function checkBudget(
  meetingId: string, 
  requestedTokens: number
): Promise<BudgetCheck> {
  return api.post('/workspace/budget/check', { 
    meeting_id: meetingId, 
    requested_tokens: requestedTokens 
  })
}

/**
 * Get current budget status
 */
export async function getBudgetStatus(meetingId: string): Promise<BudgetStatus> {
  return api.get(`/workspace/budget/${meetingId}`)
}

/**
 * Get available budget presets
 */
export async function getBudgetPresets(): Promise<{ presets: BudgetPreset[] }> {
  return api.get('/workspace/budget/presets')
}

/**
 * Request structured version from Orchestrator
 * ⚠️ Estimation MUST have been done first!
 * ⚠️ User MUST have confirmed!
 */
export async function requestStructuredProposal(params: {
  content: string
  scope?: 'selection' | 'document' | 'workspace'
  meetingId?: string
  sphereId?: string
  confirmedTokens: number  // Required! Must match estimation
}): Promise<StructureProposal> {
  return api.post('/workspace/structure', {
    content: params.content,
    scope: params.scope || 'document',
    meeting_id: params.meetingId,
    sphere_id: params.sphereId,
    confirmed_tokens: params.confirmedTokens
  })
}
