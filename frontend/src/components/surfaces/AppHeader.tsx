/**
 * CHE·NU — APP HEADER
 * ============================================================
 * Surface Navigation + Status + Logo + Nova Indicator
 * 
 * @version 27.0.0
 */

import { motion } from 'framer-motion'
import { MessageSquare, Globe, FileEdit, Sparkles, Bell, User, Settings, Menu } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { clsx } from 'clsx'

// ============================================================
// TYPES
// ============================================================

export type Surface = 'nova' | 'spheres' | 'workspace'

interface Sphere {
  id: string
  name: string
  icon: string
  color: string
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppHeaderProps {
  user?: User | null
  activeSurface: Surface
  onSurfaceChange: (surface: Surface) => void
  activeSphere?: Sphere | null
  isExpertMode?: boolean
  isOrchestratorActive?: boolean
  isNovaActive?: boolean
}

// ============================================================
// SURFACES CONFIG
// ============================================================

const surfaces = [
  { 
    id: 'nova' as Surface, 
    label: 'Nova', 
    icon: Sparkles, 
    description: 'Dialogue & Gouvernance',
    gradient: 'from-purple-500 to-purple-700'
  },
  { 
    id: 'spheres' as Surface, 
    label: 'Sphères', 
    icon: Globe, 
    description: 'Navigation Contextuelle',
    gradient: 'from-emerald-500 to-emerald-700'
  },
  { 
    id: 'workspace' as Surface, 
    label: 'Workspace', 
    icon: FileEdit, 
    description: 'Espace de Travail',
    gradient: 'from-blue-500 to-blue-700'
  },
]

// ============================================================
// COMPONENT
// ============================================================

export function AppHeader({ 
  user,
  activeSurface, 
  onSurfaceChange, 
  activeSphere,
  isExpertMode = false,
  isOrchestratorActive = false,
  isNovaActive = false
}: AppHeaderProps) {
  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 z-50 sticky top-0">
      
      {/* ════════════════════════════════════════════════════════
          LEFT: LOGO + SPHERE INDICATOR
          ════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4">
        {/* Logo CHE·NU */}
        <Logo size="medium" variant="full" />

        {/* Active Sphere Indicator */}
        {activeSphere && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700"
          >
            <span className="text-lg">{activeSphere.icon}</span>
            <span className="text-sm text-gray-300">{activeSphere.name}</span>
          </motion.div>
        )}

        {/* Expert Mode Badge */}
        {isExpertMode && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"
          >
            EXPERT
          </motion.div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          CENTER: SURFACE NAVIGATION
          ════════════════════════════════════════════════════════ */}
      <nav className="flex items-center gap-1 bg-gray-800/50 rounded-xl p-1">
        {surfaces.map((surface) => {
          const Icon = surface.icon
          const isActive = activeSurface === surface.id
          
          return (
            <button
              key={surface.id}
              onClick={() => onSurfaceChange(surface.id)}
              className={clsx(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              )}
              title={surface.description}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSurface"
                  className={clsx(
                    'absolute inset-0 rounded-lg bg-gradient-to-r',
                    surface.gradient
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10 hidden sm:inline">{surface.label}</span>
              
              {/* Nova Active Pulse */}
              {surface.id === 'nova' && isNovaActive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ════════════════════════════════════════════════════════
          RIGHT: STATUS & USER
          ════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        {/* Orchestrator Status */}
        {isOrchestratorActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30"
          >
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs text-purple-300">Orchestrator</span>
          </motion.div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Settings size={20} />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-gray-300 hidden md:inline">
            {user?.name || 'Utilisateur'}
          </span>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
