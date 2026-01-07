/**
 * CHE·NU — APP HEADER
 * ============================================================
 * Header principal avec navigation entre zones
 * 
 * Zones:
 * - INTERACTION (⌘1): Nova · Dialogue · Gouvernance
 * - NAVIGATION (⌘2): Sphères · Contexte · Agents
 * - CONCEPTION (⌘3): Workspace · Documents · Travail
 * 
 * @version 27.0.0
 */

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Globe, PenTool, Bell, Settings, Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'

// ============================================================
// TYPES
// ============================================================

export type Zone = 'interaction' | 'navigation' | 'conception'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppHeaderProps {
  user?: User | null
  activeZone: Zone
  onZoneChange: (zone: Zone) => void
  isExpertMode?: boolean
  isOrchestratorActive?: boolean
  isNovaActive?: boolean
}

// ============================================================
// ZONES CONFIG
// ============================================================

const ZONES = [
  { 
    id: 'interaction' as Zone, 
    label: 'Interaction', 
    shortLabel: 'Nova',
    icon: MessageSquare,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
    description: 'Dialogue · Gouvernance'
  },
  { 
    id: 'navigation' as Zone, 
    label: 'Navigation',
    shortLabel: 'Sphères',
    icon: Globe,
    color: 'emerald', 
    gradient: 'from-emerald-500 to-emerald-700',
    description: 'Contexte · Agents'
  },
  { 
    id: 'conception' as Zone, 
    label: 'Conception',
    shortLabel: 'Workspace',
    icon: PenTool,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    description: 'Documents · Travail'
  },
]

// ============================================================
// COMPONENT
// ============================================================

export function AppHeader({ 
  user,
  activeZone, 
  onZoneChange, 
  isExpertMode = false,
  isOrchestratorActive = false,
  isNovaActive = false
}: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl flex items-center justify-between px-4 z-50">
      
      {/* ════════════════════════════════════════════════════════
          LEFT: LOGO
          ════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4">
        <Logo size="medium" variant="full" />
        
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
          CENTER: ZONE NAVIGATION
          ════════════════════════════════════════════════════════ */}
      <nav className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-2xl">
        {ZONES.map((zone, index) => {
          const Icon = zone.icon
          const isActive = activeZone === zone.id
          
          return (
            <button
              key={zone.id}
              onClick={() => onZoneChange(zone.id)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 text-gray-400 hover:text-white"
              title={`${zone.label}: ${zone.description} (⌘${index + 1})`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeZoneTab"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${zone.gradient}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} className={`relative z-10 ${isActive ? 'text-white' : ''}`} />
              <span className={`relative z-10 hidden sm:inline ${isActive ? 'text-white' : ''}`}>
                {zone.label}
              </span>
              
              {/* Nova Active Pulse */}
              {zone.id === 'interaction' && isNovaActive && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full z-20"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
            {user?.name?.charAt(0) || 'J'}
          </div>
          <span className="text-sm text-gray-300 hidden md:inline">
            {user?.name || 'Jo'}
          </span>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
