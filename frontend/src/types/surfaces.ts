// ============================================================
// CHE·NU - Types pour Architecture 3 Surfaces
// ============================================================

export type SurfaceType = 'nova' | 'spheres' | 'workspace'

// Surface A - Nova (Dialogue & Governance)
export interface NovaMessage {
  id: string
  role: 'user' | 'nova' | 'system'
  content: string
  timestamp: Date
  intent?: string
  requiresConfirmation?: boolean
  actions?: NovaAction[]
}

export interface NovaAction {
  id: string
  label: string
  type: 'confirm' | 'reject' | 'modify' | 'delegate'
  payload?: unknown
}

export interface NovaState {
  messages: NovaMessage[]
  pendingIntent: string | null
  isProcessing: boolean
}

// Surface B - Spheres (Navigation)
export interface Sphere {
  id: string
  name: string
  icon: string
  color: string
  description: string
  isContextual: boolean
  agents: number
  activeProjects: number
}

export type SphereCategory = 
  | 'personal'
  | 'enterprise' 
  | 'creative'
  | 'architecture'
  | 'social'
  | 'community'
  | 'entertainment'
  | 'ai_labs'
  | 'design'
  | 'real_estate'
  | 'construction'

// Surface C - Workspace
export interface WorkspaceVersion {
  id: string
  content: string
  status: 'active' | 'proposed' | 'archived' | 'rejected'
  createdAt: Date
  author: 'user' | 'orchestrator'
  changes?: string[]
}

export interface WorkspaceState {
  versions: WorkspaceVersion[]
  activeVersionId: string | null
  draft: string
  isProposing: boolean
}

// Global App State
export interface AppState {
  activeSurface: SurfaceType
  nova: NovaState
  spheres: {
    list: Sphere[]
    activeSphere: string | null
  }
  workspace: WorkspaceState
}
