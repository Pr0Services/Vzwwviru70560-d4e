// ============================================================
// CHE·NU - Get Scoped Content
// ============================================================
// Extracts content based on selected scope
// Reduces tokens by limiting what orchestrator sees
// ============================================================

import type { Scope } from '@/components/workspace/ScopeSelector'

export interface ScopedContentParams {
  scope: Scope
  selectionText?: string
  documentText: string
  workspaceContext?: WorkspaceContext
  meetingContext?: MeetingContext
}

export interface WorkspaceContext {
  documentTitle?: string
  sphereId?: string
  sphereName?: string
  recentVersions?: string[]
  metadata?: Record<string, any>
}

export interface MeetingContext {
  meetingId?: string
  participants?: string[]
  agenda?: string[]
  recentMessages?: { role: string; content: string }[]
  summary?: string
}

export interface ScopedResult {
  content: string
  scope: Scope
  tokenEstimateMultiplier: number
  metadata: {
    source: string
    hasSelection: boolean
    contextIncluded: string[]
  }
}

/**
 * Get content based on selected scope
 * 
 * - selection: Only selected text (recommended, lowest tokens)
 * - document: Full document content
 * - workspace: Document + workspace context
 * - meeting: Document + meeting context
 */
export function getScopedContent(params: ScopedContentParams): ScopedResult {
  const { 
    scope, 
    selectionText, 
    documentText, 
    workspaceContext, 
    meetingContext 
  } = params

  const hasSelection = Boolean(selectionText?.trim())
  
  switch (scope) {
    case 'selection': {
      // Use selection if available, fallback to document
      const content = hasSelection ? selectionText!.trim() : documentText
      return {
        content,
        scope: 'selection',
        tokenEstimateMultiplier: 1,
        metadata: {
          source: hasSelection ? 'selection' : 'document (fallback)',
          hasSelection,
          contextIncluded: ['text']
        }
      }
    }

    case 'document': {
      return {
        content: documentText,
        scope: 'document',
        tokenEstimateMultiplier: 1,
        metadata: {
          source: 'document',
          hasSelection,
          contextIncluded: ['document']
        }
      }
    }

    case 'workspace': {
      // Document + workspace context
      const contextParts: string[] = []
      const contextIncluded: string[] = ['document']

      if (workspaceContext) {
        if (workspaceContext.sphereName) {
          contextParts.push(`[Sphère: ${workspaceContext.sphereName}]`)
          contextIncluded.push('sphere')
        }
        if (workspaceContext.documentTitle) {
          contextParts.push(`[Document: ${workspaceContext.documentTitle}]`)
          contextIncluded.push('title')
        }
        if (workspaceContext.recentVersions?.length) {
          contextParts.push(`[Versions précédentes: ${workspaceContext.recentVersions.length}]`)
          contextIncluded.push('versions')
        }
      }

      const header = contextParts.length > 0 
        ? `WORKSPACE_CONTEXT:\n${contextParts.join('\n')}\n\n---\n\n`
        : ''

      return {
        content: header + documentText,
        scope: 'workspace',
        tokenEstimateMultiplier: contextParts.length > 0 ? 1.5 : 1,
        metadata: {
          source: 'workspace',
          hasSelection,
          contextIncluded
        }
      }
    }

    case 'meeting': {
      // Document + meeting context
      const contextParts: string[] = []
      const contextIncluded: string[] = ['document']

      if (meetingContext) {
        if (meetingContext.participants?.length) {
          contextParts.push(`[Participants: ${meetingContext.participants.join(', ')}]`)
          contextIncluded.push('participants')
        }
        if (meetingContext.agenda?.length) {
          contextParts.push(`[Agenda: ${meetingContext.agenda.join('; ')}]`)
          contextIncluded.push('agenda')
        }
        if (meetingContext.summary) {
          contextParts.push(`[Résumé: ${meetingContext.summary}]`)
          contextIncluded.push('summary')
        }
        if (meetingContext.recentMessages?.length) {
          const msgs = meetingContext.recentMessages
            .slice(-5)
            .map(m => `${m.role}: ${m.content.slice(0, 100)}...`)
            .join('\n')
          contextParts.push(`[Messages récents:\n${msgs}]`)
          contextIncluded.push('messages')
        }
      }

      const header = contextParts.length > 0 
        ? `MEETING_CONTEXT:\n${contextParts.join('\n')}\n\n---\n\n`
        : ''

      return {
        content: header + documentText,
        scope: 'meeting',
        tokenEstimateMultiplier: contextParts.length > 0 ? 2 : 1,
        metadata: {
          source: 'meeting',
          hasSelection,
          contextIncluded
        }
      }
    }

    default:
      return {
        content: documentText,
        scope: 'document',
        tokenEstimateMultiplier: 1,
        metadata: {
          source: 'document (default)',
          hasSelection,
          contextIncluded: ['document']
        }
      }
  }
}

/**
 * Estimate token reduction for a scope
 */
export function estimateScopeTokens(
  selectionLength: number,
  documentLength: number,
  scope: Scope
): { tokens: number; savings: string } {
  const baseTokens = Math.ceil(documentLength / 4)
  
  switch (scope) {
    case 'selection': {
      const selTokens = selectionLength > 0 
        ? Math.ceil(selectionLength / 4) 
        : baseTokens
      const savings = selectionLength > 0 
        ? `${Math.round((1 - selTokens / baseTokens) * 100)}% économisé`
        : '0% (pas de sélection)'
      return { tokens: selTokens, savings }
    }
    case 'document':
      return { tokens: baseTokens, savings: 'baseline' }
    case 'workspace':
      return { tokens: Math.ceil(baseTokens * 1.5), savings: '+50% contexte' }
    case 'meeting':
      return { tokens: Math.ceil(baseTokens * 2), savings: '+100% contexte' }
    default:
      return { tokens: baseTokens, savings: 'baseline' }
  }
}
