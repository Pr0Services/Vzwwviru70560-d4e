/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — IDENTITY STORE                              ║
 * ║                    Multi-Identity Management System                           ║
 * ║                    Task A2: Agent Alpha Roadmap                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * IDENTITY PRINCIPLES:
 * 
 * 1. Complete Separation
 *    Each identity operates in complete isolation. Memory, agents, and data
 *    from one identity NEVER leak to another.
 * 
 * 2. Explicit Switching
 *    Identity changes require explicit user action. The system never
 *    auto-switches based on context.
 * 
 * 3. Primary Identity
 *    One identity is always marked as primary (usually Personal).
 *    This is the default fallback identity.
 * 
 * 4. Sphere Access Control
 *    Each identity has allowed spheres. A Business identity might only
 *    access Business, Government, and My Team spheres.
 * 
 * 5. Visual Distinction
 *    Each identity has visual markers (avatar, color) to make the
 *    current context immediately clear to the user.
 */

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { SphereId } from './memory.store'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Identity type classification
 */
export type IdentityType =
  | 'personal'       // Personal identity (always exists)
  | 'professional'   // Business/work identity
  | 'creative'       // Artist/creator identity
  | 'institutional'  // Organization/company identity
  | 'academic'       // Scholar/research identity

/**
 * Identity status
 */
export type IdentityStatus =
  | 'active'         // Currently usable
  | 'suspended'      // Temporarily disabled
  | 'pending'        // Awaiting verification
  | 'archived'       // Soft deleted

/**
 * Identity verification level
 */
export type VerificationLevel =
  | 'none'           // No verification
  | 'email'          // Email verified
  | 'phone'          // Phone verified
  | 'document'       // Document verified (KYC)
  | 'organization'   // Organization verified

/**
 * Identity theme/visual settings
 */
export interface IdentityTheme {
  primary_color: string
  secondary_color: string
  accent_color: string
  avatar_background: string
}

/**
 * Identity preferences
 */
export interface IdentityPreferences {
  language: 'fr' | 'en' | 'es' | 'de'
  timezone: string
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  time_format: '12h' | '24h'
  notifications_enabled: boolean
  nova_voice_enabled: boolean
  auto_save_enabled: boolean
}

/**
 * Identity quota/limits
 */
export interface IdentityQuota {
  max_memories: number
  max_agents: number
  max_dataspaces: number
  max_threads: number
  tokens_monthly_limit: number
  tokens_used_this_month: number
  storage_limit_bytes: number
  storage_used_bytes: number
}

/**
 * Core identity structure
 */
export interface Identity {
  // Identification
  id: string
  name: string
  display_name: string
  type: IdentityType
  status: IdentityStatus
  
  // Visual
  avatar_url?: string
  avatar_emoji?: string
  theme: IdentityTheme
  
  // Sphere Access (Law 4 from Memory: No Cross-Identity Access)
  default_sphere: SphereId
  allowed_spheres: SphereId[]
  
  // Verification
  verification_level: VerificationLevel
  verified_at?: string
  
  // Organization Link (for institutional)
  organization_id?: string
  organization_name?: string
  organization_role?: string
  
  // Preferences
  preferences: IdentityPreferences
  
  // Quota
  quota: IdentityQuota
  
  // Flags
  is_primary: boolean
  is_active: boolean
  is_default: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
  last_active_at: string
  
  // Audit
  created_by: string
  switch_count: number
}

/**
 * Identity creation input
 */
export type IdentityCreateInput = Pick<
  Identity,
  | 'name'
  | 'display_name'
  | 'type'
  | 'avatar_url'
  | 'avatar_emoji'
  | 'default_sphere'
  | 'allowed_spheres'
  | 'organization_id'
  | 'organization_name'
  | 'organization_role'
> & {
  theme?: Partial<IdentityTheme>
  preferences?: Partial<IdentityPreferences>
}

/**
 * Identity update input
 */
export type IdentityUpdateInput = Partial<
  Pick<
    Identity,
    | 'name'
    | 'display_name'
    | 'avatar_url'
    | 'avatar_emoji'
    | 'default_sphere'
    | 'allowed_spheres'
    | 'organization_role'
  > & {
    theme?: Partial<IdentityTheme>
    preferences?: Partial<IdentityPreferences>
  }
>

/**
 * Identity switch context
 */
export interface IdentitySwitchContext {
  from_identity_id: string
  to_identity_id: string
  switched_at: string
  reason?: string
  auto_switched: boolean
}

/**
 * Identity activity log entry
 */
export interface IdentityActivityEntry {
  id: string
  identity_id: string
  action:
    | 'created'
    | 'updated'
    | 'switched_to'
    | 'switched_from'
    | 'suspended'
    | 'reactivated'
    | 'archived'
    | 'restored'
    | 'verified'
    | 'quota_exceeded'
  timestamp: string
  details?: Record<string, unknown>
  ip_address?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_THEME: IdentityTheme = {
  primary_color: '#D8B26A',    // Sacred Gold
  secondary_color: '#3F7249',   // Jungle Emerald
  accent_color: '#3EB4A2',      // Cenote Turquoise
  avatar_background: '#2F4C39', // Shadow Moss
}

const DEFAULT_PREFERENCES: IdentityPreferences = {
  language: 'fr',
  timezone: 'Europe/Paris',
  date_format: 'DD/MM/YYYY',
  time_format: '24h',
  notifications_enabled: true,
  nova_voice_enabled: false,
  auto_save_enabled: true,
}

const DEFAULT_QUOTA: IdentityQuota = {
  max_memories: 10000,
  max_agents: 50,
  max_dataspaces: 100,
  max_threads: 500,
  tokens_monthly_limit: 1000000,
  tokens_used_this_month: 0,
  storage_limit_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
  storage_used_bytes: 0,
}

// ═══════════════════════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = '/api/v1/identities'

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

interface IdentityState {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────

  /** All user identities */
  identities: Identity[]

  /** Currently active identity */
  activeIdentity: Identity | null

  /** Primary identity (fallback) */
  primaryIdentity: Identity | null

  /** Recent switch history */
  switchHistory: IdentitySwitchContext[]

  /** Activity log */
  activityLog: IdentityActivityEntry[]

  /** Loading states */
  isLoading: boolean
  isSwitching: boolean

  /** Error state */
  error: string | null

  // ─────────────────────────────────────────────────────────────────────────────
  // CRUD OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /** Fetch all identities */
  fetchIdentities: () => Promise<void>

  /** Fetch a single identity by ID */
  fetchIdentityById: (id: string) => Promise<Identity>

  /** Create a new identity */
  createIdentity: (input: IdentityCreateInput) => Promise<Identity>

  /** Update an existing identity */
  updateIdentity: (id: string, updates: IdentityUpdateInput) => Promise<Identity>

  /** Delete an identity (cannot delete primary) */
  deleteIdentity: (id: string) => Promise<void>

  /** Archive an identity (soft delete) */
  archiveIdentity: (id: string) => Promise<void>

  /** Restore an archived identity */
  restoreIdentity: (id: string) => Promise<void>

  // ─────────────────────────────────────────────────────────────────────────────
  // IDENTITY SWITCHING
  // ─────────────────────────────────────────────────────────────────────────────

  /** Switch to a different identity */
  switchIdentity: (id: string, reason?: string) => Promise<void>

  /** Switch to primary identity */
  switchToPrimary: () => Promise<void>

  /** Set an identity as primary */
  setPrimaryIdentity: (id: string) => Promise<void>

  /** Set an identity as default for new sessions */
  setDefaultIdentity: (id: string) => Promise<void>

  // ─────────────────────────────────────────────────────────────────────────────
  // SPHERE ACCESS
  // ─────────────────────────────────────────────────────────────────────────────

  /** Check if current identity can access a sphere */
  canAccessSphere: (sphereId: SphereId) => boolean

  /** Get allowed spheres for current identity */
  getAllowedSpheres: () => SphereId[]

  /** Update allowed spheres for an identity */
  updateAllowedSpheres: (id: string, spheres: SphereId[]) => Promise<void>

  // ─────────────────────────────────────────────────────────────────────────────
  // QUOTA MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /** Check if quota is exceeded for current identity */
  isQuotaExceeded: (resource: keyof IdentityQuota) => boolean

  /** Get quota usage percentage */
  getQuotaUsage: (resource: 'tokens' | 'storage' | 'memories' | 'agents') => number

  /** Refresh quota data */
  refreshQuota: (id: string) => Promise<void>

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVITY & AUDIT
  // ─────────────────────────────────────────────────────────────────────────────

  /** Fetch activity log */
  fetchActivityLog: (identityId?: string, limit?: number) => Promise<IdentityActivityEntry[]>

  /** Get switch history */
  getSwitchHistory: (limit?: number) => IdentitySwitchContext[]

  // ─────────────────────────────────────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────────────────────────────────────

  /** Clear error */
  clearError: () => void

  /** Reset store */
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  identities: [],
  activeIdentity: null,
  primaryIdentity: null,
  switchHistory: [],
  activityLog: [],
  isLoading: false,
  isSwitching: false,
  error: null,
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useIdentityStore = create<IdentityState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ═══════════════════════════════════════════════════════════════════════
        // CRUD OPERATIONS
        // ═══════════════════════════════════════════════════════════════════════

        fetchIdentities: async () => {
          set({ isLoading: true, error: null })
          try {
            const data = await apiRequest<{ items: Identity[] }>('')

            const identities = data.items
            const primary = identities.find(i => i.is_primary) || identities[0]
            const active = identities.find(i => i.is_active) || primary

            set({
              identities,
              primaryIdentity: primary || null,
              activeIdentity: active || null,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch identities',
              isLoading: false,
            })
            throw error
          }
        },

        fetchIdentityById: async (id) => {
          const response = await apiRequest<Identity>(`/${id}`)

          set(state => ({
            identities: state.identities.map(i => (i.id === id ? response : i)),
          }))

          return response
        },

        createIdentity: async (input) => {
          set({ isLoading: true, error: null })
          try {
            // Apply defaults
            const fullInput = {
              ...input,
              theme: { ...DEFAULT_THEME, ...input.theme },
              preferences: { ...DEFAULT_PREFERENCES, ...input.preferences },
            }

            const newIdentity = await apiRequest<Identity>('', {
              method: 'POST',
              body: JSON.stringify(fullInput),
            })

            set(state => ({
              identities: [...state.identities, newIdentity],
              isLoading: false,
            }))

            return newIdentity
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to create identity',
              isLoading: false,
            })
            throw error
          }
        },

        updateIdentity: async (id, updates) => {
          set({ isLoading: true, error: null })
          try {
            const updated = await apiRequest<Identity>(`/${id}`, {
              method: 'PATCH',
              body: JSON.stringify(updates),
            })

            set(state => ({
              identities: state.identities.map(i => (i.id === id ? updated : i)),
              activeIdentity: state.activeIdentity?.id === id ? updated : state.activeIdentity,
              primaryIdentity: state.primaryIdentity?.id === id ? updated : state.primaryIdentity,
              isLoading: false,
            }))

            return updated
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update identity',
              isLoading: false,
            })
            throw error
          }
        },

        deleteIdentity: async (id) => {
          const { identities, primaryIdentity, activeIdentity } = get()

          // Cannot delete primary identity
          if (primaryIdentity?.id === id) {
            throw new Error('Cannot delete primary identity. Set another identity as primary first.')
          }

          // Must have at least one identity
          if (identities.length <= 1) {
            throw new Error('Cannot delete last identity. Users must have at least one identity.')
          }

          set({ isLoading: true, error: null })
          try {
            await apiRequest(`/${id}`, { method: 'DELETE' })

            const remaining = identities.filter(i => i.id !== id)

            set({
              identities: remaining,
              activeIdentity: activeIdentity?.id === id ? remaining[0] : activeIdentity,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete identity',
              isLoading: false,
            })
            throw error
          }
        },

        archiveIdentity: async (id) => {
          const { primaryIdentity } = get()

          if (primaryIdentity?.id === id) {
            throw new Error('Cannot archive primary identity.')
          }

          const updated = await apiRequest<Identity>(`/${id}/archive`, {
            method: 'POST',
          })

          set(state => ({
            identities: state.identities.map(i => (i.id === id ? updated : i)),
          }))
        },

        restoreIdentity: async (id) => {
          const updated = await apiRequest<Identity>(`/${id}/restore`, {
            method: 'POST',
          })

          set(state => ({
            identities: state.identities.map(i => (i.id === id ? updated : i)),
          }))
        },

        // ═══════════════════════════════════════════════════════════════════════
        // IDENTITY SWITCHING
        // ═══════════════════════════════════════════════════════════════════════

        switchIdentity: async (id, reason) => {
          const { activeIdentity, identities } = get()

          if (activeIdentity?.id === id) {
            return // Already active
          }

          const targetIdentity = identities.find(i => i.id === id)
          if (!targetIdentity) {
            throw new Error('Identity not found')
          }

          if (targetIdentity.status !== 'active') {
            throw new Error(`Cannot switch to ${targetIdentity.status} identity`)
          }

          set({ isSwitching: true, error: null })
          try {
            await apiRequest(`/${id}/activate`, { method: 'POST' })

            const switchContext: IdentitySwitchContext = {
              from_identity_id: activeIdentity?.id || '',
              to_identity_id: id,
              switched_at: new Date().toISOString(),
              reason,
              auto_switched: false,
            }

            set(state => ({
              identities: state.identities.map(i => ({
                ...i,
                is_active: i.id === id,
              })),
              activeIdentity: targetIdentity,
              switchHistory: [switchContext, ...state.switchHistory].slice(0, 50),
              isSwitching: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to switch identity',
              isSwitching: false,
            })
            throw error
          }
        },

        switchToPrimary: async () => {
          const { primaryIdentity } = get()
          if (primaryIdentity) {
            await get().switchIdentity(primaryIdentity.id, 'Switch to primary')
          }
        },

        setPrimaryIdentity: async (id) => {
          const { identities } = get()
          const target = identities.find(i => i.id === id)

          if (!target) {
            throw new Error('Identity not found')
          }

          await apiRequest(`/${id}/set-primary`, { method: 'POST' })

          set(state => ({
            identities: state.identities.map(i => ({
              ...i,
              is_primary: i.id === id,
            })),
            primaryIdentity: target,
          }))
        },

        setDefaultIdentity: async (id) => {
          await apiRequest(`/${id}/set-default`, { method: 'POST' })

          set(state => ({
            identities: state.identities.map(i => ({
              ...i,
              is_default: i.id === id,
            })),
          }))
        },

        // ═══════════════════════════════════════════════════════════════════════
        // SPHERE ACCESS
        // ═══════════════════════════════════════════════════════════════════════

        canAccessSphere: (sphereId) => {
          const { activeIdentity } = get()
          if (!activeIdentity) return false
          return activeIdentity.allowed_spheres.includes(sphereId)
        },

        getAllowedSpheres: () => {
          const { activeIdentity } = get()
          return activeIdentity?.allowed_spheres || []
        },

        updateAllowedSpheres: async (id, spheres) => {
          const updated = await apiRequest<Identity>(`/${id}/spheres`, {
            method: 'PUT',
            body: JSON.stringify({ allowed_spheres: spheres }),
          })

          set(state => ({
            identities: state.identities.map(i => (i.id === id ? updated : i)),
            activeIdentity: state.activeIdentity?.id === id ? updated : state.activeIdentity,
          }))
        },

        // ═══════════════════════════════════════════════════════════════════════
        // QUOTA MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════════

        isQuotaExceeded: (resource) => {
          const { activeIdentity } = get()
          if (!activeIdentity) return false

          const quota = activeIdentity.quota

          switch (resource) {
            case 'tokens_monthly_limit':
              return quota.tokens_used_this_month >= quota.tokens_monthly_limit
            case 'storage_limit_bytes':
              return quota.storage_used_bytes >= quota.storage_limit_bytes
            case 'max_memories':
            case 'max_agents':
            case 'max_dataspaces':
            case 'max_threads':
              // These need actual counts from API
              return false
            default:
              return false
          }
        },

        getQuotaUsage: (resource) => {
          const { activeIdentity } = get()
          if (!activeIdentity) return 0

          const quota = activeIdentity.quota

          switch (resource) {
            case 'tokens':
              return (quota.tokens_used_this_month / quota.tokens_monthly_limit) * 100
            case 'storage':
              return (quota.storage_used_bytes / quota.storage_limit_bytes) * 100
            default:
              return 0
          }
        },

        refreshQuota: async (id) => {
          const updated = await apiRequest<Identity>(`/${id}/quota`)

          set(state => ({
            identities: state.identities.map(i => (i.id === id ? updated : i)),
            activeIdentity: state.activeIdentity?.id === id ? updated : state.activeIdentity,
          }))
        },

        // ═══════════════════════════════════════════════════════════════════════
        // ACTIVITY & AUDIT
        // ═══════════════════════════════════════════════════════════════════════

        fetchActivityLog: async (identityId, limit = 100) => {
          const params = new URLSearchParams()
          if (identityId) params.set('identity_id', identityId)
          params.set('limit', String(limit))

          const data = await apiRequest<{ entries: IdentityActivityEntry[] }>(
            `/activity?${params.toString()}`
          )

          set({ activityLog: data.entries })
          return data.entries
        },

        getSwitchHistory: (limit = 10) => {
          const { switchHistory } = get()
          return switchHistory.slice(0, limit)
        },

        // ═══════════════════════════════════════════════════════════════════════
        // UI STATE
        // ═══════════════════════════════════════════════════════════════════════

        clearError: () => {
          set({ error: null })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'chenu-identity-store',
        partialize: (state) => ({
          // Persist active identity ID for session restoration
          activeIdentityId: state.activeIdentity?.id,
        }),
      }
    ),
    { name: 'IdentityStore' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get active identities only (not archived/suspended)
 */
export const selectActiveIdentities = (state: IdentityState): Identity[] =>
  state.identities.filter(i => i.status === 'active')

/**
 * Get identities by type
 */
export const selectIdentitiesByType = (
  state: IdentityState,
  type: IdentityType
): Identity[] => state.identities.filter(i => i.type === type)

/**
 * Get identities that can access a specific sphere
 */
export const selectIdentitiesForSphere = (
  state: IdentityState,
  sphereId: SphereId
): Identity[] =>
  state.identities.filter(i => 
    i.status === 'active' && i.allowed_spheres.includes(sphereId)
  )

/**
 * Get identity by ID
 */
export const selectIdentityById = (
  state: IdentityState,
  id: string
): Identity | undefined => state.identities.find(i => i.id === id)

/**
 * Check if user has multiple identities
 */
export const selectHasMultipleIdentities = (state: IdentityState): boolean =>
  state.identities.filter(i => i.status === 'active').length > 1

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook to get current identity
 */
export const useActiveIdentity = () => {
  return useIdentityStore(state => state.activeIdentity)
}

/**
 * Hook to get identity theme
 */
export const useIdentityTheme = () => {
  const activeIdentity = useIdentityStore(state => state.activeIdentity)
  return activeIdentity?.theme || DEFAULT_THEME
}

/**
 * Hook to check sphere access
 */
export const useSphereAccess = (sphereId: SphereId) => {
  return useIdentityStore(state => state.canAccessSphere(sphereId))
}

/**
 * Hook to get quota usage
 */
export const useQuotaUsage = () => {
  const activeIdentity = useIdentityStore(state => state.activeIdentity)
  const getQuotaUsage = useIdentityStore(state => state.getQuotaUsage)
  
  return {
    tokens: getQuotaUsage('tokens'),
    storage: getQuotaUsage('storage'),
    quota: activeIdentity?.quota || DEFAULT_QUOTA,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export { DEFAULT_THEME, DEFAULT_PREFERENCES, DEFAULT_QUOTA }
