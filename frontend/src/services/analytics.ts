// ============================================================
// CHE·NU - Analytics API Service
// ============================================================
// Top cost projects, trends, teams, reallocation
// ============================================================

import { api } from './api'

// ============================================================
// TYPES
// ============================================================

export interface ProjectCostReport {
  projectId: string
  projectName: string
  sphereId: string
  totalTokens: number
  totalCostUSD: number
  actionCount: number
  meetingCount: number
  avgTokensPerAction: number
  avgCostPerAction: number
  budgetLimit: number | null
  budgetUsedPercent: number | null
  tokensLast7Days: number
  tokensLast30Days: number
  dailyAverage: number
  rank: number
}

export interface SphereCostReport {
  sphereId: string
  sphereName: string
  totalTokens: number
  totalCostUSD: number
  projectCount: number
  budgetLimit: number | null
  budgetUsedPercent: number | null
  topProjects: ProjectCostReport[]
}

export interface TrendPoint {
  period: string
  tokens: number
  costUSD: number
  actionCount: number
}

export interface UsageSummary {
  totalTokens: number
  totalCostUSD: number
  actionCount: number
  meetingCount: number
  uniqueProjects: number
  avgTokensPerAction: number
  peakDay: { date: string; tokens: number } | null
  periodDays: number
}

export interface Department {
  id: string
  name: string
  headId: string | null
  teamIds: string[]
  teamCount: number
}

export interface Team {
  id: string
  name: string
  departmentId: string
  managerId: string | null
  memberIds: string[]
  memberCount: number
}

export interface TeamBudget {
  teamId: string
  teamName: string
  departmentId: string
  tokenLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  period: string
  isOverBudget: boolean
  isWarning: boolean
}

export interface DepartmentBudget {
  departmentId: string
  departmentName: string
  tokenLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  period: string
  allocatedToTeams: number
  unallocatedTokens: number
  isOverBudget: boolean
}

export interface ReallocationRule {
  id: string
  name: string
  triggerThresholdPercent: number
  sourceMinRemainingPercent: number
  reallocatePercentOfSource: number
  maxReallocateTokens: number
  scope: string
  autoApply: boolean
  enabled: boolean
}

export interface ReallocationSuggestion {
  id: string
  type: string
  source: { id: string; name: string; remaining: number; usagePercent: number }
  target: { id: string; name: string; needed: number; usagePercent: number }
  suggestedAmount: number
  reason: string
  confidence: string
  status: string
}

// ============================================================
// REPORTING API
// ============================================================

export async function getTopCostProjects(params: {
  limit?: number
  sphereId?: string
  periodDays?: number
  sortBy?: 'tokens' | 'cost' | 'actions'
}): Promise<{ projects: ProjectCostReport[]; periodDays: number; sortBy: string }> {
  return api.post('/analytics/top-cost-projects', {
    limit: params.limit || 10,
    sphere_id: params.sphereId,
    period_days: params.periodDays || 30,
    sort_by: params.sortBy || 'tokens'
  })
}

export async function getSphereReport(sphereId: string, periodDays = 30): Promise<SphereCostReport> {
  return api.get(`/analytics/sphere/${sphereId}/report?period_days=${periodDays}`)
}

export async function getCostTrends(params: {
  periodDays?: number
  sphereId?: string
  projectId?: string
  granularity?: 'daily' | 'weekly'
}): Promise<{ trends: TrendPoint[]; periodDays: number; granularity: string }> {
  return api.post('/analytics/trends', {
    period_days: params.periodDays || 30,
    sphere_id: params.sphereId,
    project_id: params.projectId,
    granularity: params.granularity || 'daily'
  })
}

export async function getUsageSummary(periodDays = 30, sphereId?: string): Promise<UsageSummary> {
  const params = new URLSearchParams({ period_days: String(periodDays) })
  if (sphereId) params.append('sphere_id', sphereId)
  return api.get(`/analytics/summary?${params}`)
}

// ============================================================
// TEAM/DEPARTMENT API
// ============================================================

export async function createDepartment(params: {
  name: string
  headId?: string
}): Promise<Department> {
  return api.post('/analytics/departments', {
    name: params.name,
    head_id: params.headId
  })
}

export async function getDepartments(): Promise<{ departments: Department[] }> {
  return api.get('/analytics/departments')
}

export async function getDepartmentSummary(departmentId: string): Promise<{
  department: Department
  budget: DepartmentBudget | null
  teams: Array<{ team: Team; budget: TeamBudget | null }>
  totalTeamMembers: number
}> {
  return api.get(`/analytics/departments/${departmentId}`)
}

export async function createTeam(params: {
  departmentId: string
  name: string
  managerId?: string
}): Promise<Team> {
  return api.post(`/analytics/departments/${params.departmentId}/teams`, {
    name: params.name,
    manager_id: params.managerId
  })
}

export async function addTeamMember(teamId: string, userId: string): Promise<{ success: boolean }> {
  return api.post(`/analytics/teams/${teamId}/members`, { user_id: userId })
}

export async function initTeamBudget(params: {
  teamId: string
  tokenLimit: number
  period?: 'monthly' | 'quarterly' | 'yearly' | 'total'
  warningThresholdPercent?: number
  canExceed?: boolean
}): Promise<TeamBudget> {
  return api.post(`/analytics/teams/${params.teamId}/budget/init`, {
    token_limit: params.tokenLimit,
    period: params.period || 'monthly',
    warning_threshold_percent: params.warningThresholdPercent || 70,
    can_exceed: params.canExceed || false
  })
}

export async function getTeamBudget(teamId: string): Promise<TeamBudget> {
  return api.get(`/analytics/teams/${teamId}/budget`)
}

export async function initDepartmentBudget(params: {
  departmentId: string
  tokenLimit: number
  period?: 'monthly' | 'quarterly' | 'yearly' | 'total'
  warningThresholdPercent?: number
}): Promise<DepartmentBudget> {
  return api.post(`/analytics/departments/${params.departmentId}/budget/init`, {
    token_limit: params.tokenLimit,
    period: params.period || 'monthly',
    warning_threshold_percent: params.warningThresholdPercent || 70
  })
}

// ============================================================
// REALLOCATION API
// ============================================================

export async function getReallocationRules(): Promise<{ rules: ReallocationRule[] }> {
  return api.get('/analytics/reallocation/rules')
}

export async function updateReallocationRule(ruleId: string, params: {
  triggerThresholdPercent?: number
  sourceMinRemainingPercent?: number
  reallocatePercentOfSource?: number
  maxReallocateTokens?: number
  enabled?: boolean
}): Promise<ReallocationRule> {
  return api.patch(`/analytics/reallocation/rules/${ruleId}`, {
    trigger_threshold_percent: params.triggerThresholdPercent,
    source_min_remaining_percent: params.sourceMinRemainingPercent,
    reallocate_percent_of_source: params.reallocatePercentOfSource,
    max_reallocate_tokens: params.maxReallocateTokens,
    enabled: params.enabled
  })
}

export async function checkProjectReallocation(projectId: string, sphereId: string): Promise<{
  needsReallocation: boolean
  suggestion?: ReallocationSuggestion
  novaMessage?: string
}> {
  return api.post(`/analytics/reallocation/check/project/${projectId}?sphere_id=${sphereId}`, {})
}

export async function checkTeamReallocation(teamId: string): Promise<{
  needsReallocation: boolean
  suggestion?: ReallocationSuggestion
  novaMessage?: string
}> {
  return api.post(`/analytics/reallocation/check/team/${teamId}`, {})
}

export async function getPendingSuggestions(): Promise<{ suggestions: ReallocationSuggestion[] }> {
  return api.get('/analytics/reallocation/suggestions')
}

export async function acceptSuggestion(suggestionId: string): Promise<{
  success: boolean
  suggestion: ReallocationSuggestion
  newSourceLimit?: number
  newTargetLimit?: number
}> {
  return api.post(`/analytics/reallocation/suggestions/${suggestionId}/accept`, {})
}

export async function rejectSuggestion(suggestionId: string): Promise<{ success: boolean }> {
  return api.post(`/analytics/reallocation/suggestions/${suggestionId}/reject`, {})
}
