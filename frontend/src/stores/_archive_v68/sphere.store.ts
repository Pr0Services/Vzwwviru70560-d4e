/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — SPHERE STORE                                ║
 * ║                    9 Spheres Navigation with Identity Access                  ║
 * ║                    Task A+4: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * SPHERE ARCHITECTURE (FROZEN):
 * 9 Spheres - Cannot be added or removed
 * 1. Personal 🏠    - Private life management
 * 2. Business 💼    - Professional workspace
 * 3. Government 🏛️  - Civic & administrative
 * 4. Design Studio 🎨 - Creative projects
 * 5. Community 👥   - Group activities
 * 6. Social & Media 📱 - Social presence
 * 7. Entertainment 🎬 - Leisure & media
 * 8. My Team 🤝     - Team collaboration
 * 9. Scholar 📚     - Academic & research
 *
 * BUREAU SECTIONS (6 per sphere - FROZEN):
 * 1. QuickCapture   - Fast input
 * 2. ResumeWorkspace - Context restoration
 * 3. Threads        - .chenu conversations
 * 4. DataFiles      - Document storage
 * 5. ActiveAgents   - Agent management
 * 6. Meetings       - Collaboration
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sphere ID - 9 spheres FROZEN
 */
export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'design_studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'team'
  | 'scholar'

/**
 * Bureau Section ID - 6 sections FROZEN
 */
export type BureauSectionId = 
  | 'quick_capture'
  | 'resume_workspace'
  | 'threads'
  | 'data_files'
  | 'active_agents'
  | 'meetings'

/**
 * Sphere metadata
 */
export interface SphereMetadata {
  id: SphereId
  name: string
  name_fr: string
  description: string
  description_fr: string
  icon: string
  color: string
  gradient: string
  order: number
  is_default: boolean
}

/**
 * Bureau section metadata
 */
export interface BureauSectionMetadata {
  id: BureauSectionId
  name: string
  name_fr: string
  description: string
  icon: string
  order: number
}

/**
 * Sphere statistics
 */
export interface SphereStats {
  thread_count: number
  active_agents: number
  pending_checkpoints: number
  tokens_used: number
  tokens_budget: number
  last_activity: string | null
  unread_count: number
}

/**
 * Navigation entry
 */
export interface NavigationEntry {
  sphere_id: SphereId
  section_id: BureauSectionId
  timestamp: string
  identity_id: string
}

/**
 * Identity sphere access
 */
export interface IdentitySphereAccess {
  identity_id: string
  sphere_id: SphereId
  access_level: 'full' | 'read_only' | 'none'
  granted_at: string
  granted_by: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE DEFINITIONS (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereId, SphereMetadata> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    name_fr: 'Personnel',
    description: 'Private life management, personal projects, and self-care',
    description_fr: 'Gestion de la vie privée, projets personnels et bien-être',
    icon: '🏠',
    color: '#3F7249', // Jungle Emerald
    gradient: 'linear-gradient(135deg, #3F7249 0%, #2F4C39 100%)',
    order: 1,
    is_default: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    name_fr: 'Entreprise',
    description: 'Professional workspace, career management, and business operations',
    description_fr: 'Espace professionnel, gestion de carrière et opérations commerciales',
    icon: '💼',
    color: '#D8B26A', // Sacred Gold
    gradient: 'linear-gradient(135deg, #D8B26A 0%, #7A593A 100%)',
    order: 2,
    is_default: false,
  },
  government: {
    id: 'government',
    name: 'Government & Institutions',
    name_fr: 'Gouvernement & Institutions',
    description: 'Civic duties, administrative tasks, and institutional interactions',
    description_fr: 'Devoirs civiques, tâches administratives et interactions institutionnelles',
    icon: '🏛️',
    color: '#8D8371', // Ancient Stone
    gradient: 'linear-gradient(135deg, #8D8371 0%, #6B6359 100%)',
    order: 3,
    is_default: false,
  },
  design_studio: {
    id: 'design_studio',
    name: 'Design Studio',
    name_fr: 'Studio de Création',
    description: 'Creative projects, artistic endeavors, and design work',
    description_fr: 'Projets créatifs, travaux artistiques et design',
    icon: '🎨',
    color: '#3EB4A2', // Cenote Turquoise
    gradient: 'linear-gradient(135deg, #3EB4A2 0%, #2F8B7A 100%)',
    order: 4,
    is_default: false,
  },
  community: {
    id: 'community',
    name: 'Community',
    name_fr: 'Communauté',
    description: 'Group activities, associations, and community involvement',
    description_fr: 'Activités de groupe, associations et engagement communautaire',
    icon: '👥',
    color: '#7A593A', // Earth Ember
    gradient: 'linear-gradient(135deg, #7A593A 0%, #5A4329 100%)',
    order: 5,
    is_default: false,
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    name_fr: 'Social & Médias',
    description: 'Social media presence, networking, and public communications',
    description_fr: 'Présence sur les réseaux sociaux, networking et communications publiques',
    icon: '📱',
    color: '#4A90D9', // Social Blue
    gradient: 'linear-gradient(135deg, #4A90D9 0%, #3A70A9 100%)',
    order: 6,
    is_default: false,
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    name_fr: 'Divertissement',
    description: 'Leisure activities, media consumption, and recreation',
    description_fr: 'Activités de loisirs, consommation de médias et récréation',
    icon: '🎬',
    color: '#E74C3C', // Entertainment Red
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
    order: 7,
    is_default: false,
  },
  team: {
    id: 'team',
    name: 'My Team',
    name_fr: 'Mon Équipe',
    description: 'Team collaboration, shared projects, and group coordination',
    description_fr: 'Collaboration d\'équipe, projets partagés et coordination de groupe',
    icon: '🤝',
    color: '#9B59B6', // Team Purple
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
    order: 8,
    is_default: false,
  },
  scholar: {
    id: 'scholar',
    name: 'Scholar',
    name_fr: 'Académique',
    description: 'Academic research, learning, and intellectual pursuits',
    description_fr: 'Recherche académique, apprentissage et pursuits intellectuelles',
    icon: '📚',
    color: '#1ABC9C', // Scholar Teal
    gradient: 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
    order: 9,
    is_default: false,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTIONS (FROZEN)
// ═══════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: Record<BureauSectionId, BureauSectionMetadata> = {
  quick_capture: {
    id: 'quick_capture',
    name: 'Quick Capture',
    name_fr: 'Capture Rapide',
    description: 'Fast input for ideas, notes, and quick actions',
    icon: '⚡',
    order: 1,
  },
  resume_workspace: {
    id: 'resume_workspace',
    name: 'Resume Workspace',
    name_fr: 'Reprendre',
    description: 'Restore context and continue previous work',
    icon: '🔄',
    order: 2,
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    name_fr: 'Fils',
    description: '.chenu conversation files and thought threads',
    icon: '💬',
    order: 3,
  },
  data_files: {
    id: 'data_files',
    name: 'Data Files',
    name_fr: 'Fichiers',
    description: 'Document storage and data management',
    icon: '📁',
    order: 4,
  },
  active_agents: {
    id: 'active_agents',
    name: 'Active Agents',
    name_fr: 'Agents Actifs',
    description: 'Agent management and task delegation',
    icon: '🤖',
    order: 5,
  },
  meetings: {
    id: 'meetings',
    name: 'Meetings',
    name_fr: 'Réunions',
    description: 'Collaboration sessions and scheduled meetings',
    icon: '📅',
    order: 6,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereState {
  // Current navigation
  current_sphere: SphereId
  current_section: BureauSectionId
  current_identity_id: string | null
  
  // Navigation history
  previous_sphere: SphereId | null
  previous_section: BureauSectionId | null
  navigation_history: NavigationEntry[]
  
  // Sphere stats
  sphere_stats: Record<SphereId, SphereStats>
  
  // Identity access
  identity_access: IdentitySphereAccess[]
  
  // UI state
  sidebar_collapsed: boolean
  nova_open: boolean
  xr_mode_active: boolean
  sphere_panel_expanded: boolean
  
  // Loading
  is_loading: boolean
  error: string | null
}

interface SphereActions {
  // Navigation
  setCurrentSphere: (sphereId: SphereId, identityId: string) => boolean
  setCurrentSection: (sectionId: BureauSectionId) => void
  navigateTo: (sphereId: SphereId, sectionId: BureauSectionId, identityId: string) => boolean
  goBack: () => void
  
  // Sphere queries
  getSphereMetadata: (sphereId: SphereId) => SphereMetadata
  getAllSpheres: () => SphereMetadata[]
  getSpheresByOrder: () => SphereMetadata[]
  getDefaultSphere: () => SphereMetadata
  
  // Section queries
  getSectionMetadata: (sectionId: BureauSectionId) => BureauSectionMetadata
  getAllSections: () => BureauSectionMetadata[]
  getSectionsByOrder: () => BureauSectionMetadata[]
  
  // Stats
  getSphereStats: (sphereId: SphereId) => SphereStats
  updateSphereStats: (sphereId: SphereId, stats: Partial<SphereStats>) => void
  incrementUnread: (sphereId: SphereId, count?: number) => void
  clearUnread: (sphereId: SphereId) => void
  
  // Identity access
  hasAccess: (identityId: string, sphereId: SphereId) => boolean
  getAccessLevel: (identityId: string, sphereId: SphereId) => 'full' | 'read_only' | 'none'
  grantAccess: (identityId: string, sphereId: SphereId, level: 'full' | 'read_only', grantedBy: string) => void
  revokeAccess: (identityId: string, sphereId: SphereId) => void
  getAccessibleSpheres: (identityId: string) => SphereId[]
  
  // Navigation history
  getNavigationHistory: (limit?: number) => NavigationEntry[]
  clearNavigationHistory: () => void
  
  // UI actions
  toggleSidebar: () => void
  toggleNova: () => void
  toggleXRMode: () => void
  toggleSpherePanel: () => void
  setNovaOpen: (open: boolean) => void
  
  // Identity
  setCurrentIdentity: (identityId: string) => void
  
  // Reset
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const now = (): string => new Date().toISOString()

const DEFAULT_SPHERE: SphereId = 'personal'
const DEFAULT_SECTION: BureauSectionId = 'quick_capture'
const MAX_HISTORY_LENGTH = 100

const createDefaultStats = (): SphereStats => ({
  thread_count: 0,
  active_agents: 0,
  pending_checkpoints: 0,
  tokens_used: 0,
  tokens_budget: 10000,
  last_activity: null,
  unread_count: 0,
})

const createInitialStats = (): Record<SphereId, SphereStats> => {
  const stats: Record<string, SphereStats> = {}
  Object.keys(SPHERES).forEach((id) => {
    stats[id] = createDefaultStats()
  })
  return stats as Record<SphereId, SphereStats>
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE CREATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useSphereStore = create<SphereState & SphereActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ─────────────────────────────────────────────────────────────────────
        // Initial State
        // ─────────────────────────────────────────────────────────────────────
        current_sphere: DEFAULT_SPHERE,
        current_section: DEFAULT_SECTION,
        current_identity_id: null,
        previous_sphere: null,
        previous_section: null,
        navigation_history: [],
        sphere_stats: createInitialStats(),
        identity_access: [],
        sidebar_collapsed: false,
        nova_open: false,
        xr_mode_active: false,
        sphere_panel_expanded: true,
        is_loading: false,
        error: null,

        // ─────────────────────────────────────────────────────────────────────
        // Navigation
        // ─────────────────────────────────────────────────────────────────────

        setCurrentSphere: (sphereId, identityId) => {
          const state = get()
          
          // Check access
          if (!state.hasAccess(identityId, sphereId)) {
            console.warn(`[SphereStore] Identity ${identityId} has no access to sphere ${sphereId}`)
            return false
          }
          
          if (sphereId === state.current_sphere) return true
          
          set((s) => {
            s.previous_sphere = s.current_sphere
            s.previous_section = s.current_section
            s.current_sphere = sphereId
            s.current_section = DEFAULT_SECTION
            s.current_identity_id = identityId
            
            // Add to history
            s.navigation_history.push({
              sphere_id: sphereId,
              section_id: DEFAULT_SECTION,
              timestamp: now(),
              identity_id: identityId,
            })
            
            // Trim history
            if (s.navigation_history.length > MAX_HISTORY_LENGTH) {
              s.navigation_history = s.navigation_history.slice(-MAX_HISTORY_LENGTH)
            }
          })
          
          return true
        },

        setCurrentSection: (sectionId) => {
          const state = get()
          if (sectionId === state.current_section) return
          
          set((s) => {
            s.previous_section = s.current_section
            s.current_section = sectionId
            
            // Add to history
            if (s.current_identity_id) {
              s.navigation_history.push({
                sphere_id: s.current_sphere,
                section_id: sectionId,
                timestamp: now(),
                identity_id: s.current_identity_id,
              })
              
              if (s.navigation_history.length > MAX_HISTORY_LENGTH) {
                s.navigation_history = s.navigation_history.slice(-MAX_HISTORY_LENGTH)
              }
            }
          })
        },

        navigateTo: (sphereId, sectionId, identityId) => {
          const state = get()
          
          // Check access
          if (!state.hasAccess(identityId, sphereId)) {
            console.warn(`[SphereStore] Identity ${identityId} has no access to sphere ${sphereId}`)
            return false
          }
          
          set((s) => {
            s.previous_sphere = s.current_sphere
            s.previous_section = s.current_section
            s.current_sphere = sphereId
            s.current_section = sectionId
            s.current_identity_id = identityId
            
            s.navigation_history.push({
              sphere_id: sphereId,
              section_id: sectionId,
              timestamp: now(),
              identity_id: identityId,
            })
            
            if (s.navigation_history.length > MAX_HISTORY_LENGTH) {
              s.navigation_history = s.navigation_history.slice(-MAX_HISTORY_LENGTH)
            }
          })
          
          return true
        },

        goBack: () => {
          const state = get()
          if (!state.previous_sphere) return
          
          set((s) => {
            s.current_sphere = s.previous_sphere!
            s.current_section = s.previous_section || DEFAULT_SECTION
            s.previous_sphere = null
            s.previous_section = null
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Sphere Queries
        // ─────────────────────────────────────────────────────────────────────

        getSphereMetadata: (sphereId) => SPHERES[sphereId],

        getAllSpheres: () => Object.values(SPHERES),

        getSpheresByOrder: () => Object.values(SPHERES).sort((a, b) => a.order - b.order),

        getDefaultSphere: () => SPHERES[DEFAULT_SPHERE],

        // ─────────────────────────────────────────────────────────────────────
        // Section Queries
        // ─────────────────────────────────────────────────────────────────────

        getSectionMetadata: (sectionId) => BUREAU_SECTIONS[sectionId],

        getAllSections: () => Object.values(BUREAU_SECTIONS),

        getSectionsByOrder: () => Object.values(BUREAU_SECTIONS).sort((a, b) => a.order - b.order),

        // ─────────────────────────────────────────────────────────────────────
        // Stats
        // ─────────────────────────────────────────────────────────────────────

        getSphereStats: (sphereId) => get().sphere_stats[sphereId],

        updateSphereStats: (sphereId, stats) => {
          set((s) => {
            s.sphere_stats[sphereId] = {
              ...s.sphere_stats[sphereId],
              ...stats,
              last_activity: now(),
            }
          })
        },

        incrementUnread: (sphereId, count = 1) => {
          set((s) => {
            s.sphere_stats[sphereId].unread_count += count
          })
        },

        clearUnread: (sphereId) => {
          set((s) => {
            s.sphere_stats[sphereId].unread_count = 0
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Identity Access
        // ─────────────────────────────────────────────────────────────────────

        hasAccess: (identityId, sphereId) => {
          // Personal sphere is always accessible
          if (sphereId === 'personal') return true
          
          const access = get().identity_access.find(
            a => a.identity_id === identityId && a.sphere_id === sphereId
          )
          
          // If no explicit access, grant full access by default (can be changed)
          return access ? access.access_level !== 'none' : true
        },

        getAccessLevel: (identityId, sphereId) => {
          if (sphereId === 'personal') return 'full'
          
          const access = get().identity_access.find(
            a => a.identity_id === identityId && a.sphere_id === sphereId
          )
          
          return access?.access_level ?? 'full'
        },

        grantAccess: (identityId, sphereId, level, grantedBy) => {
          set((s) => {
            // Remove existing access
            s.identity_access = s.identity_access.filter(
              a => !(a.identity_id === identityId && a.sphere_id === sphereId)
            )
            
            // Add new access
            s.identity_access.push({
              identity_id: identityId,
              sphere_id: sphereId,
              access_level: level,
              granted_at: now(),
              granted_by: grantedBy,
            })
          })
        },

        revokeAccess: (identityId, sphereId) => {
          // Cannot revoke access to personal sphere
          if (sphereId === 'personal') return
          
          set((s) => {
            const idx = s.identity_access.findIndex(
              a => a.identity_id === identityId && a.sphere_id === sphereId
            )
            
            if (idx !== -1) {
              s.identity_access[idx].access_level = 'none'
            }
          })
        },

        getAccessibleSpheres: (identityId) => {
          const state = get()
          return (Object.keys(SPHERES) as SphereId[]).filter(
            sphereId => state.hasAccess(identityId, sphereId)
          )
        },

        // ─────────────────────────────────────────────────────────────────────
        // Navigation History
        // ─────────────────────────────────────────────────────────────────────

        getNavigationHistory: (limit = 50) => {
          return get().navigation_history.slice(-limit).reverse()
        },

        clearNavigationHistory: () => {
          set((s) => {
            s.navigation_history = []
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // UI Actions
        // ─────────────────────────────────────────────────────────────────────

        toggleSidebar: () => {
          set((s) => {
            s.sidebar_collapsed = !s.sidebar_collapsed
          })
        },

        toggleNova: () => {
          set((s) => {
            s.nova_open = !s.nova_open
          })
        },

        toggleXRMode: () => {
          set((s) => {
            s.xr_mode_active = !s.xr_mode_active
          })
        },

        toggleSpherePanel: () => {
          set((s) => {
            s.sphere_panel_expanded = !s.sphere_panel_expanded
          })
        },

        setNovaOpen: (open) => {
          set((s) => {
            s.nova_open = open
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Identity
        // ─────────────────────────────────────────────────────────────────────

        setCurrentIdentity: (identityId) => {
          set((s) => {
            s.current_identity_id = identityId
          })
        },

        // ─────────────────────────────────────────────────────────────────────
        // Reset
        // ─────────────────────────────────────────────────────────────────────

        reset: () => {
          set({
            current_sphere: DEFAULT_SPHERE,
            current_section: DEFAULT_SECTION,
            current_identity_id: null,
            previous_sphere: null,
            previous_section: null,
            navigation_history: [],
            sphere_stats: createInitialStats(),
            identity_access: [],
            sidebar_collapsed: false,
            nova_open: false,
            xr_mode_active: false,
            sphere_panel_expanded: true,
            is_loading: false,
            error: null,
          })
        },
      })),
      {
        name: 'chenu-spheres-v55',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          current_sphere: state.current_sphere,
          current_section: state.current_section,
          sidebar_collapsed: state.sidebar_collapsed,
          sphere_panel_expanded: state.sphere_panel_expanded,
        }),
      }
    ),
    { name: 'SphereStore' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const selectCurrentSphere = (state: SphereState) => state.current_sphere
export const selectCurrentSection = (state: SphereState) => state.current_section
export const selectCurrentSphereMetadata = (state: SphereState) => SPHERES[state.current_sphere]
export const selectCurrentSectionMetadata = (state: SphereState) => BUREAU_SECTIONS[state.current_section]
export const selectSidebarCollapsed = (state: SphereState) => state.sidebar_collapsed
export const selectNovaOpen = (state: SphereState) => state.nova_open
export const selectXRModeActive = (state: SphereState) => state.xr_mode_active
export const selectNavigationHistory = (state: SphereState) => state.navigation_history
export const selectAllSphereStats = (state: SphereState) => state.sphere_stats

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export const useCurrentSphere = () => useSphereStore(selectCurrentSphere)
export const useCurrentSection = () => useSphereStore(selectCurrentSection)
export const useCurrentSphereMetadata = () => useSphereStore(selectCurrentSphereMetadata)
export const useCurrentSectionMetadata = () => useSphereStore(selectCurrentSectionMetadata)
export const useSidebarCollapsed = () => useSphereStore(selectSidebarCollapsed)
export const useNovaOpen = () => useSphereStore(selectNovaOpen)
export const useXRModeActive = () => useSphereStore(selectXRModeActive)
export const useNavigationHistory = () => useSphereStore(selectNavigationHistory)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  SphereState,
  SphereActions,
}

export default useSphereStore
