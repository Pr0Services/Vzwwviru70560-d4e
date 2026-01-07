// ============================================================
// CHE·NU - Global App Store (Zustand)
// Architecture 3 Surfaces
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  SurfaceType, 
  NovaMessage, 
  Sphere, 
  WorkspaceVersion 
} from '@/types/surfaces'

interface AppStore {
  // Active Surface
  activeSurface: SurfaceType
  setActiveSurface: (surface: SurfaceType) => void

  // Nova State
  novaMessages: NovaMessage[]
  novaProcessing: boolean
  addNovaMessage: (message: Omit<NovaMessage, 'id' | 'timestamp'>) => void
  clearNovaMessages: () => void
  setNovaProcessing: (processing: boolean) => void

  // Spheres State
  spheres: Sphere[]
  activeSphereId: string | null
  setActiveSphere: (id: string | null) => void

  // Workspace State
  workspaceVersions: WorkspaceVersion[]
  activeVersionId: string | null
  workspaceDraft: string
  isProposing: boolean
  setWorkspaceDraft: (draft: string) => void
  proposeVersion: (content: string, author: 'user' | 'orchestrator') => string
  acceptVersion: (id: string) => void
  rejectVersion: (id: string) => void
  setIsProposing: (proposing: boolean) => void
}

const defaultSpheres: Sphere[] = [
  { 
    id: 'personal', 
    name: 'Personal', 
    icon: '👤', 
    color: '#8b5cf6',
    description: 'Espace personnel et tâches quotidiennes',
    isContextual: false,
    agents: 12,
    activeProjects: 3
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise', 
    icon: '🏢', 
    color: '#0ea5e9',
    description: 'Gestion d\'entreprise et opérations',
    isContextual: false,
    agents: 45,
    activeProjects: 8
  },
  { 
    id: 'creative', 
    name: 'Creative Studio', 
    icon: '🎨', 
    color: '#ec4899',
    description: 'Production créative et design',
    isContextual: false,
    agents: 18,
    activeProjects: 5
  },
  { 
    id: 'architecture', 
    name: 'Architecture', 
    icon: '🏛️', 
    color: '#f97316',
    description: 'Conception architecturale et plans',
    isContextual: false,
    agents: 15,
    activeProjects: 4
  },
  { 
    id: 'construction', 
    name: 'Construction', 
    icon: '🏗️', 
    color: '#eab308',
    description: 'Gestion de chantiers et conformité QC',
    isContextual: false,
    agents: 32,
    activeProjects: 12
  },
  { 
    id: 'social', 
    name: 'Social & Media', 
    icon: '📱', 
    color: '#06b6d4',
    description: 'Réseaux sociaux et communication',
    isContextual: false,
    agents: 8,
    activeProjects: 2
  },
  { 
    id: 'community', 
    name: 'Community', 
    icon: '🤝', 
    color: '#22c55e',
    description: 'Gestion de communauté',
    isContextual: false,
    agents: 6,
    activeProjects: 1
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    icon: '🎮', 
    color: '#f43f5e',
    description: 'Divertissement et loisirs',
    isContextual: false,
    agents: 10,
    activeProjects: 2
  },
  { 
    id: 'ai_labs', 
    name: 'AI Labs', 
    icon: '🧠', 
    color: '#a855f7',
    description: 'Recherche et développement IA',
    isContextual: false,
    agents: 25,
    activeProjects: 6
  },
  { 
    id: 'design', 
    name: 'Design Studio', 
    icon: '✨', 
    color: '#14b8a6',
    description: 'Design UI/UX et graphisme',
    isContextual: false,
    agents: 14,
    activeProjects: 4
  },
  { 
    id: 'real_estate', 
    name: 'Real Estate', 
    icon: '🏠', 
    color: '#84cc16',
    description: 'Immobilier et investissements',
    isContextual: true,
    agents: 8,
    activeProjects: 3
  },
]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Surface
      activeSurface: 'workspace',
      setActiveSurface: (surface) => set({ activeSurface: surface }),

      // Nova
      novaMessages: [
        {
          id: 'welcome',
          role: 'nova',
          content: "Bonjour! Je suis Nova, votre interface de gouvernance. Je protège votre intention et coordonne les actions avec les agents. Comment puis-je vous aider?",
          timestamp: new Date(),
        }
      ],
      novaProcessing: false,
      addNovaMessage: (message) => set((state) => ({
        novaMessages: [
          ...state.novaMessages,
          {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          }
        ]
      })),
      clearNovaMessages: () => set({ 
        novaMessages: [{
          id: 'welcome',
          role: 'nova',
          content: "Conversation réinitialisée. Comment puis-je vous aider?",
          timestamp: new Date(),
        }]
      }),
      setNovaProcessing: (processing) => set({ novaProcessing: processing }),

      // Spheres
      spheres: defaultSpheres,
      activeSphereId: 'construction',
      setActiveSphere: (id) => set({ activeSphereId: id }),

      // Workspace
      workspaceVersions: [
        {
          id: 'initial',
          content: '',
          status: 'active',
          createdAt: new Date(),
          author: 'user',
        }
      ],
      activeVersionId: 'initial',
      workspaceDraft: '',
      isProposing: false,
      setWorkspaceDraft: (draft) => set({ workspaceDraft: draft }),
      proposeVersion: (content, author) => {
        const id = crypto.randomUUID()
        set((state) => ({
          workspaceVersions: [
            ...state.workspaceVersions,
            {
              id,
              content,
              status: 'proposed',
              createdAt: new Date(),
              author,
            }
          ]
        }))
        return id
      },
      acceptVersion: (id) => set((state) => ({
        workspaceVersions: state.workspaceVersions.map(v => 
          v.id === id 
            ? { ...v, status: 'active' as const }
            : v.status === 'active'
              ? { ...v, status: 'archived' as const }
              : v
        ),
        activeVersionId: id,
        workspaceDraft: state.workspaceVersions.find(v => v.id === id)?.content || '',
      })),
      rejectVersion: (id) => set((state) => ({
        workspaceVersions: state.workspaceVersions.map(v =>
          v.id === id ? { ...v, status: 'rejected' as const } : v
        )
      })),
      setIsProposing: (proposing) => set({ isProposing: proposing }),
    }),
    {
      name: 'chenu-app-store',
      partialize: (state) => ({
        activeSurface: state.activeSurface,
        activeSphereId: state.activeSphereId,
      }),
    }
  )
)
