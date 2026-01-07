// ============================================================
// CHE·NU - Nova Intelligence Hook
// ============================================================
// AI-powered insights and recommendations
// ============================================================

import { useState, useCallback } from 'react'

interface NovaInsight {
  id: string
  type: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  novaExplanation: string
  entityType?: string
  entityId?: string
  entityName?: string
  data: Record<string, any>
  confidence: number
  actionType?: string
  actionParams: Record<string, any>
  estimatedSavingsTokens: number
  estimatedSavingsPercent: number
  status: 'active' | 'dismissed' | 'applied'
}

interface ForecastResult {
  projectId: string
  currentUsage: number
  projectedUsage: number
  projectedDate: number
  confidence: number
  willExceedBudget: boolean
  daysUntilExceeded?: number
  recommendation?: string
}

interface UseNovaOptions {
  apiBaseUrl?: string
}

interface UseNovaReturn {
  // State
  insights: NovaInsight[]
  isLoading: boolean
  
  // Actions
  analyzeProject: (params: {
    projectId: string
    projectName: string
    tokenLimit: number
    usedTokens: number
    usageHistory: unknown[]
    preset?: string
  }) => Promise<NovaInsight[]>
  
  suggestReallocations: (projects: unknown[]) => Promise<NovaInsight[]>
  
  forecast: (params: {
    projectId: string
    currentUsage: number
    tokenLimit: number
    usageHistory: unknown[]
    daysAhead?: number
  }) => Promise<ForecastResult>
  
  dismissInsight: (insightId: string) => Promise<void>
  applyInsight: (insightId: string) => Promise<{ actionType: string; actionParams: Record<string, unknown> }>
  
  askNova: (question: string, context?: Record<string, unknown>) => Promise<string>
  
  refreshInsights: () => Promise<void>
}

export function useNova(options: UseNovaOptions = {}): UseNovaReturn {
  const { apiBaseUrl = '/api' } = options
  
  const [insights, setInsights] = useState<NovaInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const analyzeProject = useCallback(async (params: {
    projectId: string
    projectName: string
    tokenLimit: number
    usedTokens: number
    usageHistory: unknown[]
    preset?: string
  }): Promise<NovaInsight[]> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/nova/analyze-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: params.projectId,
          project_name: params.projectName,
          token_limit: params.tokenLimit,
          used_tokens: params.usedTokens,
          usage_history: params.usageHistory,
          preset: params.preset || 'balanced'
        })
      })
      const data = await response.json()
      const newInsights = data.insights || []
      setInsights(prev => [...prev.filter(i => i.entityId !== params.projectId), ...newInsights])
      return newInsights
    } finally {
      setIsLoading(false)
    }
  }, [apiBaseUrl])

  const suggestReallocations = useCallback(async (projects: unknown[]): Promise<NovaInsight[]> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/nova/suggest-reallocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects })
      })
      const data = await response.json()
      const suggestions = data.suggestions || []
      setInsights(prev => [...prev.filter(i => i.type !== 'reallocation_suggestion'), ...suggestions])
      return suggestions
    } finally {
      setIsLoading(false)
    }
  }, [apiBaseUrl])

  const forecast = useCallback(async (params: {
    projectId: string
    currentUsage: number
    tokenLimit: number
    usageHistory: unknown[]
    daysAhead?: number
  }): Promise<ForecastResult> => {
    const response = await fetch(`${apiBaseUrl}/nova/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: params.projectId,
        current_usage: params.currentUsage,
        token_limit: params.tokenLimit,
        usage_history: params.usageHistory,
        days_ahead: params.daysAhead || 30
      })
    })
    return response.json()
  }, [apiBaseUrl])

  const dismissInsight = useCallback(async (insightId: string): Promise<void> => {
    await fetch(`${apiBaseUrl}/nova/insights/${insightId}/dismiss`, { method: 'POST' })
    setInsights(prev => prev.filter(i => i.id !== insightId))
  }, [apiBaseUrl])

  const applyInsight = useCallback(async (insightId: string): Promise<{ actionType: string; actionParams: Record<string, unknown> }> => {
    const response = await fetch(`${apiBaseUrl}/nova/insights/${insightId}/apply`, { method: 'POST' })
    const result = await response.json()
    setInsights(prev => prev.map(i => i.id === insightId ? { ...i, status: 'applied' as const } : i))
    return result
  }, [apiBaseUrl])

  const askNova = useCallback(async (question: string, context?: Record<string, unknown>): Promise<string> => {
    const response = await fetch(`${apiBaseUrl}/nova/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    })
    const data = await response.json()
    return data.response
  }, [apiBaseUrl])

  const refreshInsights = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/nova/insights?status=active`)
      const data = await response.json()
      setInsights(data.insights || [])
    } finally {
      setIsLoading(false)
    }
  }, [apiBaseUrl])

  return {
    insights,
    isLoading,
    analyzeProject,
    suggestReallocations,
    forecast,
    dismissInsight,
    applyInsight,
    askNova,
    refreshInsights
  }
}

export default useNova
