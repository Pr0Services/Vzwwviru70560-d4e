/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENT CARD COMPONENT                            ║
 * ║                    Display agent information with status                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  Bot, Sparkles, Zap, Shield, ChevronRight,
  Play, Pause, Square, Settings, MoreHorizontal,
  Activity, Clock, Coins, AlertCircle
} from 'lucide-react'
import type { Agent, AgentLevel, AgentStatus } from '@/types'

// Level colors and info
const levelConfig: Record<AgentLevel, {
  label: string
  color: string
  bgColor: string
  description: string
}> = {
  L0: {
    label: 'Nova',
    color: 'text-sacred-gold',
    bgColor: 'bg-sacred-gold/20',
    description: 'Intelligence système globale',
  },
  L1: {
    label: 'Orchestrator',
    color: 'text-sphere-studio',
    bgColor: 'bg-sphere-studio/20',
    description: 'Coordinateur de tâches',
  },
  L2: {
    label: 'Specialist',
    color: 'text-cenote-turquoise',
    bgColor: 'bg-cenote-turquoise/20',
    description: 'Agent spécialisé',
  },
  L3: {
    label: 'Worker',
    color: 'text-jungle-emerald',
    bgColor: 'bg-jungle-emerald/20',
    description: 'Agent d\'exécution',
  },
}

// Status colors
const statusConfig: Record<AgentStatus, {
  label: string
  color: string
  icon: React.ElementType
}> = {
  idle: {
    label: 'En attente',
    color: 'text-ancient-stone',
    icon: Clock,
  },
  active: {
    label: 'Actif',
    color: 'text-jungle-emerald',
    icon: Activity,
  },
  busy: {
    label: 'Occupé',
    color: 'text-earth-ember',
    icon: Zap,
  },
  error: {
    label: 'Erreur',
    color: 'text-red-400',
    icon: AlertCircle,
  },
  paused: {
    label: 'Pause',
    color: 'text-cenote-turquoise',
    icon: Pause,
  },
}

interface AgentCardProps {
  agent: Agent
  onClick?: () => void
  onEngage?: () => void
  onPause?: () => void
  onStop?: () => void
  compact?: boolean
  showActions?: boolean
}

export default function AgentCard({
  agent,
  onClick,
  onEngage,
  onPause,
  onStop,
  compact = false,
  showActions = true,
}: AgentCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const level = levelConfig[agent.level]
  const status = statusConfig[agent.status]
  const StatusIcon = status.icon

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-3 p-3 rounded-xl border border-white/5 
          bg-white/[0.02] hover:bg-white/5 transition-colors
          ${onClick ? 'cursor-pointer' : ''}
        `}
      >
        <div className={`w-9 h-9 rounded-lg ${level.bgColor} flex items-center justify-center`}>
          {agent.level === 'L0' ? (
            <Sparkles className={`w-4 h-4 ${level.color}`} />
          ) : (
            <Bot className={`w-4 h-4 ${level.color}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-soft-sand truncate">{agent.name}</div>
          <div className="text-xs text-ancient-stone">{level.label}</div>
        </div>
        <div className={`flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 p-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${level.bgColor} flex items-center justify-center flex-shrink-0`}>
          {agent.level === 'L0' ? (
            <Sparkles className={`w-6 h-6 ${level.color}`} />
          ) : (
            <Bot className={`w-6 h-6 ${level.color}`} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-soft-sand truncate">{agent.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs ${level.bgColor} ${level.color}`}>
              {level.label}
            </span>
          </div>
          
          <p className="text-sm text-ancient-stone mt-1 line-clamp-2">
            {agent.description || level.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-ancient-stone">
            <span className={`flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              {agent.cost} tokens/req
            </span>
            {agent.scope && (
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {agent.scope}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-ancient-stone"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 rounded-lg bg-ui-slate border border-white/10 shadow-xl">
                  <button 
                    onClick={() => {
                      setShowMenu(false)
                      onClick?.()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft-sand hover:bg-white/5"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Détails
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft-sand hover:bg-white/5">
                    <Settings className="w-4 h-4" />
                    Configurer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && agent.status !== 'idle' && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.01]">
          {agent.status === 'active' || agent.status === 'busy' ? (
            <>
              <button
                onClick={onPause}
                className="flex-1 btn-outline text-sm py-2 flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={onStop}
                className="flex-1 btn-outline text-sm py-2 flex items-center justify-center gap-2 text-red-400 border-red-400/30 hover:bg-red-500/10"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          ) : agent.status === 'paused' ? (
            <button
              onClick={onEngage}
              className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Reprendre
            </button>
          ) : null}
        </div>
      )}

      {/* Engage button for idle agents */}
      {showActions && agent.status === 'idle' && (
        <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
          <button
            onClick={onEngage}
            className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Engager cet agent
          </button>
        </div>
      )}
    </div>
  )
}

// Mini Agent Badge
export function AgentBadge({ agent }: { agent: Agent }) {
  const level = levelConfig[agent.level]

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${level.bgColor}`}>
      {agent.level === 'L0' ? (
        <Sparkles className={`w-3 h-3 ${level.color}`} />
      ) : (
        <Bot className={`w-3 h-3 ${level.color}`} />
      )}
      <span className={`text-xs font-medium ${level.color}`}>{agent.name}</span>
    </div>
  )
}

// Nova Card (Special)
export function NovaCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-sacred-gold/20 bg-gradient-to-br from-sacred-gold/10 to-earth-ember/5 overflow-hidden">
      <div 
        className="flex items-start gap-4 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-14 h-14 rounded-xl bg-sacred-gold/20 flex items-center justify-center nova-active">
          <Sparkles className="w-7 h-7 text-sacred-gold" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-semibold text-sacred-gold">Nova</h3>
            <span className="px-2 py-0.5 rounded-full text-xs bg-sacred-gold/20 text-sacred-gold">
              L0
            </span>
          </div>
          <p className="text-sm text-ancient-stone mt-1">
            Intelligence système globale. Nova coordonne, observe et guide l'ensemble de l'écosystème CHE·NU.
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1 text-jungle-emerald">
              <Activity className="w-3 h-3" />
              Actif
            </span>
            <span className="text-ancient-stone">•</span>
            <span className="text-ancient-stone">Jamais hired</span>
            <span className="text-ancient-stone">•</span>
            <span className="text-ancient-stone">Always available</span>
          </div>
        </div>

        <ChevronRight className={`w-5 h-5 text-ancient-stone transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-sacred-gold/10">
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-ancient-stone mb-1">Sphères surveillées</div>
              <div className="text-lg font-semibold text-soft-sand">9</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-ancient-stone mb-1">Agents actifs</div>
              <div className="text-lg font-semibold text-soft-sand">0</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-ancient-stone mb-1">Tokens utilisés</div>
              <div className="text-lg font-semibold text-soft-sand">0</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-ancient-stone mb-1">Gouvernance</div>
              <div className="text-lg font-semibold text-jungle-emerald">Active</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
