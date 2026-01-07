// ============================================================
// CHE·NU - Token API Service
// ============================================================
// Token history and meeting meter APIs
// Full transparency - no hidden costs
// ============================================================

import { api } from './api'
import type { TokenEvent, MeterData } from '@/components/tokens'

// ============================================================
// TOKEN HISTORY API
// ============================================================

export interface TokenHistoryParams {
  userId: string
  from?: number
  to?: number
  contextType?: 'action' | 'meeting' | 'chat'
  sphereId?: string
  limit?: number
}

export interface TokenHistoryResponse {
  events: TokenEvent[]
  count: number
  userId: string
}

/**
 * Get token usage history for a user
 */
export async function getTokenHistory(
  params: TokenHistoryParams
): Promise<TokenHistoryResponse> {
  const query = new URLSearchParams()
  query.set('user_id', params.userId)
  if (params.from) query.set('from_ts', params.from.toString())
  if (params.to) query.set('to_ts', params.to.toString())
  if (params.contextType) query.set('context_type', params.contextType)
  if (params.sphereId) query.set('sphere_id', params.sphereId)
  if (params.limit) query.set('limit', params.limit.toString())
  
  return api.get(`/tokens/history?${query.toString()}`)
}

export interface TokenSummary {
  totalTokens: number
  totalCostUsd: number
  eventCount: number
  byScope: Record<string, number>
  byModel: Record<string, number>
  byContextType: Record<string, number>
}

/**
 * Get token usage summary for a user
 */
export async function getTokenSummary(userId: string): Promise<TokenSummary> {
  return api.get(`/tokens/summary?user_id=${userId}`)
}

/**
 * Get usage for a specific context (document, meeting, etc.)
 */
export async function getContextUsage(contextId: string): Promise<{
  contextId: string
  totalTokens: number
  totalCostUsd: number
  eventCount: number
}> {
  return api.get(`/tokens/context/${contextId}`)
}

/**
 * Get usage for a sphere
 */
export async function getSphereUsage(sphereId: string): Promise<{
  sphereId: string
  totalTokens: number
  totalCostUsd: number
  eventCount: number
  byDay: Record<string, number>
}> {
  return api.get(`/tokens/sphere/${sphereId}`)
}

/**
 * Record a token consumption event
 */
export async function recordTokenEvent(params: {
  userId: string
  contextType: 'action' | 'meeting' | 'chat'
  contextId: string
  scope: 'selection' | 'document' | 'workspace' | 'meeting'
  model: 'small' | 'medium' | 'large'
  tokens: number
  costUsd: number
  sphereId?: string
  description?: string
}): Promise<{ recorded: boolean; eventId: string }> {
  return api.post('/tokens/record', {
    user_id: params.userId,
    context_type: params.contextType,
    context_id: params.contextId,
    scope: params.scope,
    model: params.model,
    tokens: params.tokens,
    cost_usd: params.costUsd,
    sphere_id: params.sphereId,
    description: params.description
  })
}

// ============================================================
// MEETING METER API
// ============================================================

/**
 * Initialize a meeting meter
 */
export async function initMeetingMeter(
  meetingId: string,
  preset: string = 'balanced'
): Promise<MeterData> {
  return api.post(`/meetings/${meetingId}/meter/init`, { preset })
}

/**
 * Get current meter status for a meeting
 */
export async function getMeetingMeter(meetingId: string): Promise<MeterData> {
  return api.get(`/meetings/${meetingId}/meter`)
}

/**
 * Add tokens to a meeting's usage
 */
export async function addMeetingTokens(
  meetingId: string,
  tokens: number,
  scope: string = 'document',
  description?: string
): Promise<MeterData> {
  return api.post(`/meetings/${meetingId}/meter/add`, {
    tokens,
    scope,
    description
  })
}

/**
 * Check if tokens can be consumed from meeting budget
 */
export async function checkMeetingBudget(
  meetingId: string,
  requestedTokens: number
): Promise<{
  canProceed: boolean
  remainingTokens: number
  requestedTokens: number
  projectedUsage: number
  message: string
  alertLevel: string
}> {
  return api.post(`/meetings/${meetingId}/meter/check`, {
    requested_tokens: requestedTokens
  })
}

/**
 * Get consumption history for a meeting
 */
export async function getMeetingHistory(
  meetingId: string,
  limit: number = 20
): Promise<{
  history: Array<{
    id: string
    timestamp: number
    tokens: number
    scope: string
    description?: string
  }>
  count: number
}> {
  return api.get(`/meetings/${meetingId}/meter/history?limit=${limit}`)
}

/**
 * Close a meeting meter (end of meeting)
 */
export async function closeMeetingMeter(meetingId: string): Promise<{
  meetingId: string
  finalUsage: number
  maxTokens: number
  usagePercent: number
  consumptionCount: number
}> {
  return api.post(`/meetings/${meetingId}/meter/close`)
}

/**
 * Get available budget presets
 */
export async function getBudgetPresets(): Promise<{
  presets: Array<{
    name: string
    maxTokens: number
    description: string
  }>
}> {
  return api.get('/meetings/presets')
}

// ============================================================
// UTILITY: Export to CSV
// ============================================================

export function exportHistoryToCSV(events: TokenEvent[]): string {
  const headers = [
    'Timestamp',
    'Context Type',
    'Context ID',
    'Scope',
    'Model',
    'Tokens',
    'Cost (USD)',
    'Sphere ID',
    'Description'
  ]
  
  const rows = events.map(e => [
    new Date(e.timestamp).toISOString(),
    e.contextType,
    e.contextId,
    e.scope,
    e.model,
    e.tokens.toString(),
    e.costUSD.toFixed(6),
    e.sphereId || '',
    e.description || ''
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csv
}

export function downloadCSV(csv: string, filename: string = 'token-history.csv') {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
