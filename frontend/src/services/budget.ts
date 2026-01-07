// ============================================================
// CHE·NU - Budget API Service
// ============================================================
// Budget presets and guard APIs
// Presets define limits, not behavior
// User always chooses
// ============================================================

import { api } from './api'
import type { PresetId, BudgetPreset } from '@/components/budget'

// ============================================================
// TYPES
// ============================================================

export interface GuardResult {
  ok: boolean
  reason?: string
  suggestion?: string
  blockedBy?: 'model' | 'scope' | 'action_limit' | 'meeting_limit'
}

export interface PresetSuggestion {
  currentPreset: PresetId
  suggestedPreset: PresetId | null
  reason: string
  message: string
  blockedBy: string
}

export interface BudgetStatus {
  preset: {
    id: PresetId
    label: string
    icon: string
    color: string
  }
  limits: {
    maxTokensPerAction: number
    maxTokensPerMeeting: number
    allowedModels: string[]
    allowedScopes: string[]
  }
  meeting?: {
    usedTokens: number
    remainingTokens: number
    usagePercent: number
    maxTokens: number
  }
  warning?: {
    level: string
    message: string
    usagePercent: number
    remaining: number
    threshold: number
  }
}

// ============================================================
// PRESET API
// ============================================================

/**
 * Get all available budget presets
 */
export async function getPresets(): Promise<{ presets: BudgetPreset[] }> {
  return api.get('/budget/presets')
}

/**
 * Get details for a specific preset
 */
export async function getPresetDetails(presetId: PresetId): Promise<BudgetPreset> {
  return api.get(`/budget/presets/${presetId}`)
}

/**
 * Get recommended preset based on usage patterns
 */
export async function getRecommendedPreset(params: {
  typicalActionTokens: number
  needsWorkspaceScope?: boolean
  needsLargeModel?: boolean
}): Promise<{
  recommendedPreset: PresetId
  reason: string
  preset: { id: PresetId; label: string; description: string; icon: string }
}> {
  return api.post('/budget/presets/recommend', {
    typical_action_tokens: params.typicalActionTokens,
    needs_workspace_scope: params.needsWorkspaceScope || false,
    needs_large_model: params.needsLargeModel || false
  })
}

// ============================================================
// GUARD API
// ============================================================

/**
 * Check if an action is allowed by the budget preset.
 * 
 * ⚠️ Call this BEFORE any generation!
 * This is a HARD GUARD - blocks before any spend.
 */
export async function enforceBudget(params: {
  presetId: PresetId
  requestedTokens: number
  scope: 'selection' | 'document' | 'workspace' | 'meeting'
  model: 'small' | 'medium' | 'large'
  meetingUsedTokens?: number
}): Promise<GuardResult> {
  return api.post('/budget/enforce', {
    preset_id: params.presetId,
    requested_tokens: params.requestedTokens,
    scope: params.scope,
    model: params.model,
    meeting_used_tokens: params.meetingUsedTokens
  })
}

/**
 * Check if meeting usage is approaching the warning threshold
 */
export async function checkWarning(params: {
  presetId: PresetId
  meetingUsedTokens: number
}): Promise<{
  warning: {
    level: string
    message: string
    usagePercent: number
    remaining: number
    threshold: number
  } | null
}> {
  return api.post('/budget/warning', {
    preset_id: params.presetId,
    meeting_used_tokens: params.meetingUsedTokens
  })
}

/**
 * Get current budget status for display
 */
export async function getBudgetStatus(params: {
  presetId: PresetId
  meetingUsedTokens?: number
}): Promise<BudgetStatus> {
  return api.post('/budget/status', {
    preset_id: params.presetId,
    meeting_used_tokens: params.meetingUsedTokens
  })
}

/**
 * Suggest a preset change if current preset blocks the action.
 * 
 * This is a SOFT suggestion - never auto-upgrades.
 */
export async function suggestPresetChange(params: {
  currentPresetId: PresetId
  requestedTokens: number
  scope: 'selection' | 'document' | 'workspace' | 'meeting'
  model: 'small' | 'medium' | 'large'
}): Promise<{ suggestion: PresetSuggestion | null }> {
  return api.post('/budget/suggest-change', {
    current_preset_id: params.currentPresetId,
    requested_tokens: params.requestedTokens,
    scope: params.scope,
    model: params.model
  })
}

// ============================================================
// CLIENT-SIDE HELPERS
// ============================================================

/**
 * Quick client-side check (for UI feedback before API call)
 */
export function quickBudgetCheck(
  preset: BudgetPreset,
  requestedTokens: number,
  scope: string,
  model: string
): { ok: boolean; issue?: string } {
  if (!preset.allowedModels.includes(model)) {
    return { ok: false, issue: 'model' }
  }
  
  if (!preset.allowedScopes.includes(scope)) {
    return { ok: false, issue: 'scope' }
  }
  
  if (requestedTokens > preset.maxTokensPerAction) {
    return { ok: false, issue: 'tokens' }
  }
  
  return { ok: true }
}

/**
 * Get default preset limits (for offline/fallback)
 */
export const DEFAULT_PRESET_LIMITS: Record<PresetId, {
  maxTokensPerAction: number
  maxTokensPerMeeting: number
  allowedModels: string[]
  allowedScopes: string[]
}> = {
  eco: {
    maxTokensPerAction: 800,
    maxTokensPerMeeting: 8_000,
    allowedModels: ['small'],
    allowedScopes: ['selection', 'document']
  },
  balanced: {
    maxTokensPerAction: 2_500,
    maxTokensPerMeeting: 20_000,
    allowedModels: ['small', 'medium'],
    allowedScopes: ['selection', 'document', 'workspace']
  },
  pro: {
    maxTokensPerAction: 8_000,
    maxTokensPerMeeting: 80_000,
    allowedModels: ['small', 'medium', 'large'],
    allowedScopes: ['selection', 'document', 'workspace', 'meeting']
  }
}
