/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — MEMORY STORE                                ║
 * ║                    Governed Memory System                                     ║
 * ║                    Task A1: Agent Alpha Roadmap                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * THE TEN LAWS OF MEMORY (INVIOLABLE):
 * 
 * Law 1: No Hidden Memory
 *   Every piece of stored information is visible to the user.
 * 
 * Law 2: Explicit Storage Approval
 *   Nothing enters long-term storage without explicit user approval.
 * 
 * Law 3: Identity Scoping
 *   All memory is bound to a specific identity.
 * 
 * Law 4: No Cross-Identity Access
 *   Memory from one identity cannot be accessed from another.
 * 
 * Law 5: Reversibility
 *   All memory operations can be undone. Users can delete any stored information.
 * 
 * Law 6: Operation Logging
 *   Every memory operation is logged with timestamp, actor, and action.
 * 
 * Law 7: No Self-Directed Agent Learning
 *   Agents cannot use stored memory to take self-directed actions.
 * 
 * Law 8: Domain Awareness
 *   Memory is organized by domain for easy management.
 * 
 * Law 9: DataSpace Foundation
 *   All persistent memory lives in DataSpaces.
 * 
 * Law 10: User-Controlled Lifespan
 *   Users determine memory duration: temporary, persistent, pinned, or archived.
 */

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Memory item type classification
 */
export type MemoryType = 
  | 'fact'           // Factual information about user/context
  | 'preference'     // User preferences and settings
  | 'context'        // Contextual information for tasks
  | 'relationship'   // Relationships between entities
  | 'skill'          // Learned user skills/capabilities
  | 'instruction'    // User instructions/rules
  | 'reference'      // Reference materials

/**
 * Source of memory creation
 */
export type MemorySource = 
  | 'user'           // Directly created by user
  | 'nova'           // Created by Nova assistant
  | 'agent'          // Created by an agent
  | 'inferred'       // Inferred from user behavior (requires consent)
  | 'imported'       // Imported from external source

/**
 * Memory lifespan classification (Law 10)
 */
export type MemoryLifespan = 
  | 'temporary'      // Session only, auto-cleared
  | 'persistent'     // Until explicitly deleted
  | 'pinned'         // Protected, requires confirmation to delete
  | 'archived'       // Compressed storage, less accessible

/**
 * Memory visibility level
 */
export type MemoryVisibility = 
  | 'private'        // Only visible to owner identity
  | 'shared'         // Shared within team/sphere
  | 'public'         // Publicly accessible

/**
 * Sphere ID type (9 spheres frozen)
 */
export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'my_team'
  | 'scholar'

/**
 * Domain classification for memory organization (Law 8)
 */
export type MemoryDomain = 
  | 'general'
  | 'immobilier'
  | 'construction'
  | 'finance'
  | 'creative'
  | 'technical'
  | 'legal'
  | 'health'
  | 'education'

/**
 * Core memory item structure
 */
export interface MemoryItem {
  // Identification
  id: string
  type: MemoryType
  
  // Content
  content: string
  summary?: string
  tags: string[]
  
  // Scoping (Laws 3, 4, 8)
  identity_id: string
  sphere_id?: SphereId
  domain: MemoryDomain
  dataspace_id?: string  // Law 9: DataSpace Foundation
  
  // Source & Trust (Law 6)
  source: MemorySource
  source_id?: string     // ID of agent/thread that created it
  confidence: number     // 0-1, quality score
  
  // Governance (Laws 1, 2, 5)
  consent_given: boolean
  consent_date?: string
  is_active: boolean
  is_pinned: boolean
  
  // Lifespan (Law 10)
  lifespan: MemoryLifespan
  expires_at?: string
  
  // Visibility
  visibility: MemoryVisibility
  
  // Timestamps
  created_at: string
  updated_at: string
  accessed_at: string
  access_count: number
  
  // Audit (Law 6)
  created_by: string
  last_modified_by?: string
}

/**
 * Memory search/filter query
 */
export interface MemoryQuery {
  query?: string
  types?: MemoryType[]
  sources?: MemorySource[]
  domains?: MemoryDomain[]
  sphere_id?: SphereId
  identity_id?: string
  dataspace_id?: string
  min_confidence?: number
  is_active?: boolean
  lifespan?: MemoryLifespan
  tags?: string[]
  created_after?: string
  created_before?: string
  limit?: number
  offset?: number
}

/**
 * Memory statistics
 */
export interface MemoryStats {
  total_items: number
  active_items: number
  by_type: Record<MemoryType, number>
  by_source: Record<MemorySource, number>
  by_domain: Record<MemoryDomain, number>
  by_sphere: Partial<Record<SphereId, number>>
  by_lifespan: Record<MemoryLifespan, number>
  storage_used_bytes: number
  storage_limit_bytes: number
  last_cleanup_at: string
  consent_pending_count: number
}

/**
 * Audit log entry (Law 6)
 */
export interface MemoryAuditEntry {
  id: string
  memory_id?: string
  action: 
    | 'create' 
    | 'read' 
    | 'update' 
    | 'delete' 
    | 'export' 
    | 'import'
    | 'consent_grant' 
    | 'consent_revoke'
    | 'pin' 
    | 'unpin'
    | 'archive'
    | 'restore'
  actor_type: 'user' | 'nova' | 'agent' | 'system'
  actor_id: string
  actor_name?: string
  timestamp: string
  details?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

/**
 * Memory creation input (without auto-generated fields)
 */
export type MemoryCreateInput = Omit<
  MemoryItem,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'accessed_at'
  | 'access_count'
  | 'created_by'
  | 'last_modified_by'
>

/**
 * Memory update input
 */
export type MemoryUpdateInput = Partial<
  Pick<
    MemoryItem,
    | 'content'
    | 'summary'
    | 'tags'
    | 'confidence'
    | 'is_active'
    | 'is_pinned'
    | 'lifespan'
    | 'expires_at'
    | 'visibility'
  >
>

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success_count: number
  failure_count: number
  failed_ids: string[]
  errors: Array<{ id: string; error: string }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = '/api/v1/memory'

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

interface MemoryState {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** All loaded memories */
  memories: MemoryItem[]
  
  /** Currently selected memory for detail view */
  selectedMemory: MemoryItem | null
  
  /** Memory statistics */
  stats: MemoryStats | null
  
  /** Search results */
  searchResults: MemoryItem[]
  
  /** Audit log entries */
  auditLog: MemoryAuditEntry[]
  
  /** Loading states */
  isLoading: boolean
  isSearching: boolean
  isExporting: boolean
  
  /** Error state */
  error: string | null
  
  /** Current filters */
  currentFilters: MemoryQuery
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CRUD OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Fetch memories with optional filters */
  fetchMemories: (query?: MemoryQuery) => Promise<void>
  
  /** Fetch a single memory by ID */
  fetchMemoryById: (id: string) => Promise<MemoryItem>
  
  /** Create a new memory (Law 2: requires consent) */
  createMemory: (input: MemoryCreateInput) => Promise<MemoryItem>
  
  /** Update an existing memory */
  updateMemory: (id: string, updates: MemoryUpdateInput) => Promise<MemoryItem>
  
  /** Delete a memory (Law 5: Reversibility) */
  deleteMemory: (id: string) => Promise<void>
  
  /** Bulk delete memories */
  bulkDeleteMemories: (ids: string[]) => Promise<BulkOperationResult>
  
  /** Delete ALL memories (requires confirmation string) */
  deleteAllMemories: (confirmation: 'DELETE ALL MY MEMORIES') => Promise<void>
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SEARCH & FILTER
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Search memories by query */
  searchMemories: (query: MemoryQuery) => Promise<MemoryItem[]>
  
  /** Set current filters */
  setFilters: (filters: MemoryQuery) => void
  
  /** Clear filters */
  clearFilters: () => void
  
  // ─────────────────────────────────────────────────────────────────────────────
  // GOVERNANCE OPERATIONS (Laws 1, 2, 5, 6)
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Grant consent for a memory item (Law 2) */
  grantConsent: (id: string) => Promise<void>
  
  /** Revoke consent for a memory item (Law 2, 5) */
  revokeConsent: (id: string) => Promise<void>
  
  /** Pin a memory (protect from accidental deletion) */
  pinMemory: (id: string) => Promise<void>
  
  /** Unpin a memory */
  unpinMemory: (id: string) => Promise<void>
  
  /** Archive a memory (Law 10) */
  archiveMemory: (id: string) => Promise<void>
  
  /** Restore an archived memory */
  restoreMemory: (id: string) => Promise<void>
  
  // ─────────────────────────────────────────────────────────────────────────────
  // AUDIT & TRANSPARENCY (Law 1, 6)
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Fetch audit log for all memories or specific memory */
  fetchAuditLog: (memoryId?: string, limit?: number) => Promise<MemoryAuditEntry[]>
  
  /** Fetch memory statistics */
  fetchStats: () => Promise<void>
  
  // ─────────────────────────────────────────────────────────────────────────────
  // EXPORT & IMPORT (Law 1: Transparency)
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Export all memories as JSON blob */
  exportMemories: (query?: MemoryQuery) => Promise<Blob>
  
  /** Export audit log */
  exportAuditLog: () => Promise<Blob>
  
  /** Import memories from JSON (requires consent for each) */
  importMemories: (file: File) => Promise<BulkOperationResult>
  
  // ─────────────────────────────────────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Set selected memory */
  setSelectedMemory: (memory: MemoryItem | null) => void
  
  /** Clear error */
  clearError: () => void
  
  /** Reset store */
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  memories: [],
  selectedMemory: null,
  stats: null,
  searchResults: [],
  auditLog: [],
  isLoading: false,
  isSearching: false,
  isExporting: false,
  error: null,
  currentFilters: {},
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useMemoryStore = create<MemoryState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ═══════════════════════════════════════════════════════════════════════
        // CRUD OPERATIONS
        // ═══════════════════════════════════════════════════════════════════════

        fetchMemories: async (query) => {
          set({ isLoading: true, error: null })
          try {
            const params = new URLSearchParams()
            if (query) {
              Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  if (Array.isArray(value)) {
                    params.set(key, value.join(','))
                  } else {
                    params.set(key, String(value))
                  }
                }
              })
            }
            
            const queryString = params.toString()
            const endpoint = queryString ? `?${queryString}` : ''
            
            const data = await apiRequest<{ items: MemoryItem[]; total: number }>(endpoint)
            
            set({ 
              memories: data.items, 
              currentFilters: query || {},
              isLoading: false 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch memories',
              isLoading: false 
            })
            throw error
          }
        },

        fetchMemoryById: async (id) => {
          const response = await apiRequest<MemoryItem>(`/${id}`)
          
          // Update in local state if exists
          set(state => ({
            memories: state.memories.map(m => m.id === id ? response : m)
          }))
          
          return response
        },

        createMemory: async (input) => {
          set({ isLoading: true, error: null })
          try {
            // Law 2: Explicit Storage Approval - consent must be true
            if (!input.consent_given) {
              throw new Error('Memory creation requires explicit consent (Law 2)')
            }
            
            const newMemory = await apiRequest<MemoryItem>('', {
              method: 'POST',
              body: JSON.stringify(input),
            })
            
            set(state => ({ 
              memories: [newMemory, ...state.memories],
              isLoading: false 
            }))
            
            return newMemory
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to create memory',
              isLoading: false 
            })
            throw error
          }
        },

        updateMemory: async (id, updates) => {
          set({ isLoading: true, error: null })
          try {
            const updated = await apiRequest<MemoryItem>(`/${id}`, {
              method: 'PATCH',
              body: JSON.stringify(updates),
            })
            
            set(state => ({
              memories: state.memories.map(m => m.id === id ? updated : m),
              selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
              isLoading: false
            }))
            
            return updated
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update memory',
              isLoading: false 
            })
            throw error
          }
        },

        deleteMemory: async (id) => {
          set({ isLoading: true, error: null })
          try {
            // Check if pinned - require confirmation
            const memory = get().memories.find(m => m.id === id)
            if (memory?.is_pinned) {
              throw new Error('Cannot delete pinned memory. Unpin first.')
            }
            
            await apiRequest(`/${id}`, { method: 'DELETE' })
            
            set(state => ({
              memories: state.memories.filter(m => m.id !== id),
              selectedMemory: state.selectedMemory?.id === id ? null : state.selectedMemory,
              isLoading: false
            }))
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete memory',
              isLoading: false 
            })
            throw error
          }
        },

        bulkDeleteMemories: async (ids) => {
          set({ isLoading: true, error: null })
          try {
            const result = await apiRequest<BulkOperationResult>('/bulk-delete', {
              method: 'POST',
              body: JSON.stringify({ ids }),
            })
            
            // Remove successfully deleted from local state
            const deletedIds = new Set(ids.filter(id => !result.failed_ids.includes(id)))
            
            set(state => ({
              memories: state.memories.filter(m => !deletedIds.has(m.id)),
              selectedMemory: state.selectedMemory && deletedIds.has(state.selectedMemory.id) 
                ? null 
                : state.selectedMemory,
              isLoading: false
            }))
            
            return result
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to bulk delete',
              isLoading: false 
            })
            throw error
          }
        },

        deleteAllMemories: async (confirmation) => {
          // CRITICAL: Require exact confirmation string
          if (confirmation !== 'DELETE ALL MY MEMORIES') {
            throw new Error('Invalid confirmation. Type exactly: DELETE ALL MY MEMORIES')
          }
          
          set({ isLoading: true, error: null })
          try {
            await apiRequest('/all', { method: 'DELETE' })
            
            set({ 
              memories: [],
              selectedMemory: null,
              searchResults: [],
              isLoading: false
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete all memories',
              isLoading: false 
            })
            throw error
          }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // SEARCH & FILTER
        // ═══════════════════════════════════════════════════════════════════════

        searchMemories: async (query) => {
          set({ isSearching: true, error: null })
          try {
            const results = await apiRequest<{ items: MemoryItem[] }>('/search', {
              method: 'POST',
              body: JSON.stringify(query),
            })
            
            set({ searchResults: results.items, isSearching: false })
            return results.items
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Search failed',
              isSearching: false 
            })
            throw error
          }
        },

        setFilters: (filters) => {
          set({ currentFilters: filters })
        },

        clearFilters: () => {
          set({ currentFilters: {}, searchResults: [] })
        },

        // ═══════════════════════════════════════════════════════════════════════
        // GOVERNANCE OPERATIONS
        // ═══════════════════════════════════════════════════════════════════════

        grantConsent: async (id) => {
          const updated = await apiRequest<MemoryItem>(`/${id}/consent`, {
            method: 'POST',
          })
          
          set(state => ({
            memories: state.memories.map(m => m.id === id ? updated : m),
            selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
          }))
        },

        revokeConsent: async (id) => {
          // Law 5: Reversibility - revoking consent deactivates the memory
          await apiRequest(`/${id}/consent`, { method: 'DELETE' })
          
          set(state => ({
            memories: state.memories.map(m => 
              m.id === id 
                ? { ...m, consent_given: false, is_active: false } 
                : m
            ),
            selectedMemory: state.selectedMemory?.id === id 
              ? { ...state.selectedMemory, consent_given: false, is_active: false }
              : state.selectedMemory,
          }))
        },

        pinMemory: async (id) => {
          const updated = await apiRequest<MemoryItem>(`/${id}/pin`, {
            method: 'POST',
          })
          
          set(state => ({
            memories: state.memories.map(m => m.id === id ? updated : m),
            selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
          }))
        },

        unpinMemory: async (id) => {
          const updated = await apiRequest<MemoryItem>(`/${id}/pin`, {
            method: 'DELETE',
          })
          
          set(state => ({
            memories: state.memories.map(m => m.id === id ? updated : m),
            selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
          }))
        },

        archiveMemory: async (id) => {
          const updated = await apiRequest<MemoryItem>(`/${id}/archive`, {
            method: 'POST',
          })
          
          set(state => ({
            memories: state.memories.map(m => m.id === id ? updated : m),
            selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
          }))
        },

        restoreMemory: async (id) => {
          const updated = await apiRequest<MemoryItem>(`/${id}/archive`, {
            method: 'DELETE',
          })
          
          set(state => ({
            memories: state.memories.map(m => m.id === id ? updated : m),
            selectedMemory: state.selectedMemory?.id === id ? updated : state.selectedMemory,
          }))
        },

        // ═══════════════════════════════════════════════════════════════════════
        // AUDIT & TRANSPARENCY
        // ═══════════════════════════════════════════════════════════════════════

        fetchAuditLog: async (memoryId, limit = 100) => {
          const params = new URLSearchParams()
          if (memoryId) params.set('memory_id', memoryId)
          params.set('limit', String(limit))
          
          const data = await apiRequest<{ entries: MemoryAuditEntry[] }>(
            `/audit?${params.toString()}`
          )
          
          set({ auditLog: data.entries })
          return data.entries
        },

        fetchStats: async () => {
          set({ isLoading: true })
          try {
            const stats = await apiRequest<MemoryStats>('/stats')
            set({ stats, isLoading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch stats',
              isLoading: false 
            })
          }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // EXPORT & IMPORT
        // ═══════════════════════════════════════════════════════════════════════

        exportMemories: async (query) => {
          set({ isExporting: true })
          try {
            const response = await fetch(`${API_BASE}/export`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(query || {}),
            })
            
            if (!response.ok) throw new Error('Export failed')
            
            const blob = await response.blob()
            set({ isExporting: false })
            return blob
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Export failed',
              isExporting: false 
            })
            throw error
          }
        },

        exportAuditLog: async () => {
          const response = await fetch(`${API_BASE}/audit/export`)
          if (!response.ok) throw new Error('Audit export failed')
          return response.blob()
        },

        importMemories: async (file) => {
          set({ isLoading: true })
          try {
            const formData = new FormData()
            formData.append('file', file)
            
            const response = await fetch(`${API_BASE}/import`, {
              method: 'POST',
              body: formData,
            })
            
            if (!response.ok) throw new Error('Import failed')
            
            const result: BulkOperationResult = await response.json()
            
            // Refresh memories after import
            await get().fetchMemories(get().currentFilters)
            
            set({ isLoading: false })
            return result
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Import failed',
              isLoading: false 
            })
            throw error
          }
        },

        // ═══════════════════════════════════════════════════════════════════════
        // UI STATE
        // ═══════════════════════════════════════════════════════════════════════

        setSelectedMemory: (memory) => {
          set({ selectedMemory: memory })
        },

        clearError: () => {
          set({ error: null })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'chenu-memory-store',
        // Only persist non-sensitive data
        partialize: (state) => ({
          currentFilters: state.currentFilters,
        }),
      }
    ),
    { name: 'MemoryStore' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get active memories only
 */
export const selectActiveMemories = (state: MemoryState): MemoryItem[] =>
  state.memories.filter(m => m.is_active)

/**
 * Get memories by sphere
 */
export const selectMemoriesBySphere = (
  state: MemoryState,
  sphereId: SphereId
): MemoryItem[] =>
  state.memories.filter(m => m.sphere_id === sphereId)

/**
 * Get memories by domain
 */
export const selectMemoriesByDomain = (
  state: MemoryState,
  domain: MemoryDomain
): MemoryItem[] =>
  state.memories.filter(m => m.domain === domain)

/**
 * Get pinned memories
 */
export const selectPinnedMemories = (state: MemoryState): MemoryItem[] =>
  state.memories.filter(m => m.is_pinned)

/**
 * Get memories pending consent
 */
export const selectPendingConsentMemories = (state: MemoryState): MemoryItem[] =>
  state.memories.filter(m => !m.consent_given)

/**
 * Get archived memories
 */
export const selectArchivedMemories = (state: MemoryState): MemoryItem[] =>
  state.memories.filter(m => m.lifespan === 'archived')

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to get memory by ID
 */
export const useMemory = (id: string) => {
  const memory = useMemoryStore(state => 
    state.memories.find(m => m.id === id)
  )
  return memory
}

/**
 * Hook to get memories for current sphere
 */
export const useSpheresMemories = (sphereId: SphereId) => {
  const memories = useMemoryStore(state => 
    selectMemoriesBySphere(state, sphereId)
  )
  return memories
}
