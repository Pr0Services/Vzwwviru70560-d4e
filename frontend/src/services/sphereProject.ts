// ============================================================
// CHE·NU - Sphere & Project Budget API Service
// ============================================================
// Enterprise-ready budget management
// Double-guard enforcement
// ============================================================

import { api } from './api'
import type { SphereBudget, ProjectBudget } from '@/components/projects'

// ============================================================
// TYPES
// ============================================================

export interface Project {
  id: string
  sphereId: string
  name: string
  description?: string
  createdAt: number
}

export interface CombinedGuardResult {
  ok: boolean
  blockedBy?: 'preset' | 'sphere' | 'project' | 'meeting'
  reason?: string
  suggestion?: string
  warnings: string[]
  remaining: {
    preset?: number
    sphere?: number
    project?: number
    meeting?: number
  }
}

export interface ConsumeResult {
  tokens: number
  sphere?: {
    id: string
    usedTokens: number
    remainingTokens: number
    usagePercent: number
  }
  project?: {
    id: string
    usedTokens: number
    remainingTokens: number
    usagePercent: number
  }
}

// ============================================================
// SPHERE BUDGET API
// ============================================================

export async function initSphereBudget(params: {
  sphereId: string
  sphereName: string
  tokenLimit: number
  period?: 'monthly' | 'total'
  warningThresholdPercent?: number
  softLimit?: number
}): Promise<SphereBudget> {
  return api.post(`/spheres/${params.sphereId}/budget/init`, {
    sphere_id: params.sphereId,
    sphere_name: params.sphereName,
    token_limit: params.tokenLimit,
    period: params.period || 'monthly',
    warning_threshold_percent: params.warningThresholdPercent || 70,
    soft_limit: params.softLimit
  })
}

export async function getSphereBudget(sphereId: string): Promise<SphereBudget> {
  return api.get(`/spheres/${sphereId}/budget`)
}

export async function listSphereBudgets(): Promise<{ budgets: SphereBudget[] }> {
  return api.get('/spheres/budgets')
}

// ============================================================
// PROJECT API
// ============================================================

export async function createProject(params: {
  sphereId: string
  name: string
  description?: string
}): Promise<Project> {
  return api.post(`/spheres/${params.sphereId}/projects`, {
    name: params.name,
    description: params.description
  })
}

export async function getProject(projectId: string): Promise<Project> {
  return api.get(`/projects/${projectId}`)
}

export async function listProjects(sphereId?: string): Promise<{ projects: Project[] }> {
  if (sphereId) {
    return api.get(`/spheres/${sphereId}/projects`)
  }
  return api.get('/projects')
}

// ============================================================
// PROJECT BUDGET API
// ============================================================

export async function initProjectBudget(params: {
  projectId: string
  tokenLimit: number
  period?: 'monthly' | 'total'
  warningThresholdPercent?: number
}): Promise<ProjectBudget> {
  return api.post(`/projects/${params.projectId}/budget/init`, {
    token_limit: params.tokenLimit,
    period: params.period || 'monthly',
    warning_threshold_percent: params.warningThresholdPercent || 70
  })
}

export async function getProjectBudget(projectId: string): Promise<ProjectBudget> {
  return api.get(`/projects/${projectId}/budget`)
}

export async function listProjectBudgets(): Promise<{ budgets: ProjectBudget[] }> {
  return api.get('/projects/budgets')
}

// ============================================================
// COMBINED GUARD API
// ============================================================

/**
 * Combined budget guard - checks ALL levels
 * 
 * ⚠️ Call this BEFORE any generation!
 * 
 * Checks in order:
 * 1. Preset limits
 * 2. Sphere budget
 * 3. Project budget
 * 4. Meeting budget
 */
export async function checkAllBudgets(params: {
  presetId: 'eco' | 'balanced' | 'pro'
  requestedTokens: number
  scope: 'selection' | 'document' | 'workspace' | 'meeting'
  model: 'small' | 'medium' | 'large'
  sphereId?: string
  projectId?: string
  meetingUsedTokens?: number
}): Promise<CombinedGuardResult> {
  return api.post('/budget/guard', {
    preset_id: params.presetId,
    requested_tokens: params.requestedTokens,
    scope: params.scope,
    model: params.model,
    sphere_id: params.sphereId,
    project_id: params.projectId,
    meeting_used_tokens: params.meetingUsedTokens
  })
}

/**
 * Consume tokens from all applicable budgets
 * 
 * ⚠️ Call this AFTER generation is confirmed
 */
export async function consumeAllBudgets(params: {
  tokens: number
  sphereId?: string
  projectId?: string
}): Promise<ConsumeResult> {
  return api.post('/budget/consume', {
    tokens: params.tokens,
    sphere_id: params.sphereId,
    project_id: params.projectId
  })
}

/**
 * Get overview of all budget levels
 */
export async function getBudgetOverview(params: {
  sphereId?: string
  projectId?: string
}): Promise<{
  sphere?: SphereBudget
  project?: ProjectBudget
  allProjects: ProjectBudget[]
}> {
  return api.post('/budget/overview', {
    sphere_id: params.sphereId,
    project_id: params.projectId
  })
}

// ============================================================
// UTILITY HOOKS (for React)
// ============================================================

export function createBudgetChecker(params: {
  presetId: 'eco' | 'balanced' | 'pro'
  sphereId?: string
  projectId?: string
}) {
  return async (requestedTokens: number, scope: string, model: string, meetingUsedTokens?: number) => {
    return checkAllBudgets({
      presetId: params.presetId,
      requestedTokens,
      scope: scope as any,
      model: model as any,
      sphereId: params.sphereId,
      projectId: params.projectId,
      meetingUsedTokens
    })
  }
}
