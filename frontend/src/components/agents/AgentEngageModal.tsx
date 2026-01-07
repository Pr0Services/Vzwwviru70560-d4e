/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENT ENGAGE MODAL                              ║
 * ║                    Task B3.2: Agent hiring/engagement modal                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  X, Bot, Sparkles, Zap, Shield, Coins, Clock,
  Check, AlertTriangle, ChevronRight, Star, Info,
  Target, Brain, Wrench, Code, FileText, Search,
  MessageSquare, Loader2
} from 'lucide-react'
import { useAgentsStore, useGovernanceStore } from '@/stores'
import { useToast } from '@/components/ui/Toast'
import { TokenCost } from '@/components/governance/TokenBudget'
import { formatTokens } from '@/utils'
import type { Agent, AgentLevel, SphereId } from '@/types'

interface AgentEngageModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent | null
  sphereId: SphereId
  onSuccess?: (agent: Agent) => void
}

export default function AgentEngageModal({
  isOpen,
  onClose,
  agent,
  sphereId,
  onSuccess,
}: AgentEngageModalProps) {
  const { hireAgent, isLoading } = useAgentsStore()
  const { tokenBudget } = useGovernanceStore()
  const { success, error, governance } = useToast()

  const [scope, setScope] = useState<'thread' | 'sphere' | 'global'>('thread')
  const [budget, setBudget] = useState<number>(1000)
  const [duration, setDuration] = useState<'session' | 'day' | 'week' | 'unlimited'>('session')
  const [isEngaging, setIsEngaging] = useState(false)

  if (!isOpen || !agent) return null

  // Level configuration
  const levelConfig = {
    L0: { label: 'Nova', color: 'text-sacred-gold', bg: 'bg-sacred-gold/20', icon: Sparkles },
    L1: { label: 'Orchestrator', color: 'text-sphere-studio', bg: 'bg-sphere-studio/20', icon: Target },
    L2: { label: 'Specialist', color: 'text-cenote-turquoise', bg: 'bg-cenote-turquoise/20', icon: Brain },
    L3: { label: 'Worker', color: 'text-jungle-emerald', bg: 'bg-jungle-emerald/20', icon: Wrench },
  }

  const config = levelConfig[agent.level]
  const Icon = config.icon

  // Calculate estimated cost
  const estimatedCost = agent.cost * (
    scope === 'thread' ? 1 : 
    scope === 'sphere' ? 2 : 3
  ) * (
    duration === 'session' ? 1 :
    duration === 'day' ? 5 :
    duration === 'week' ? 20 : 50
  )

  const canAfford = (tokenBudget?.limit || 100000) - (tokenBudget?.used || 0) >= estimatedCost

  const handleEngage = async () => {
    if (!canAfford) {
      error('Budget insuffisant', 'Augmentez votre budget tokens ou réduisez la portée')
      return
    }

    setIsEngaging(true)
    try {
      await hireAgent(agent.id)
      governance('Agent engagé', `${agent.name} est maintenant actif avec ${formatTokens(budget)} tokens de budget`)
      onSuccess?.(agent)
      onClose()
    } catch (err) {
      error('Erreur', 'Impossible d\'engager cet agent')
    } finally {
      setIsEngaging(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-ui-slate border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-6 ${config.bg}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/20 text-white/70"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${config.bg} border border-white/20 flex items-center justify-center`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-display font-semibold text-white">{agent.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  {agent.level}
                </span>
              </div>
              <p className="text-sm text-white/70">{agent.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Agent Capabilities */}
          <div>
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sacred-gold" />
              Capacités
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(agent.capabilities || mockCapabilities).map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-ancient-stone">
                  <Check className="w-4 h-4 text-jungle-emerald" />
                  {cap}
                </div>
              ))}
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-cenote-turquoise" />
              Portée d'action
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'thread' as const, label: 'Thread', desc: 'Ce thread uniquement', multiplier: '1x' },
                { id: 'sphere' as const, label: 'Sphère', desc: 'Toute la sphère', multiplier: '2x' },
                { id: 'global' as const, label: 'Global', desc: 'Toutes les sphères', multiplier: '3x' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setScope(option.id)}
                  className={`
                    p-3 rounded-xl border text-left transition-colors
                    ${scope === option.id 
                      ? 'border-cenote-turquoise/50 bg-cenote-turquoise/10' 
                      : 'border-white/10 hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-soft-sand">{option.label}</span>
                    <span className="text-xs text-ancient-stone">{option.multiplier}</span>
                  </div>
                  <p className="text-xs text-ancient-stone">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-earth-ember" />
              Durée d'engagement
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'session' as const, label: 'Session', multiplier: '1x' },
                { id: 'day' as const, label: '24 heures', multiplier: '5x' },
                { id: 'week' as const, label: '7 jours', multiplier: '20x' },
                { id: 'unlimited' as const, label: 'Illimité', multiplier: '50x' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDuration(option.id)}
                  className={`
                    px-4 py-2 rounded-xl border transition-colors
                    ${duration === option.id 
                      ? 'border-earth-ember/50 bg-earth-ember/10 text-earth-ember' 
                      : 'border-white/10 text-ancient-stone hover:bg-white/5'}
                  `}
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="text-xs ml-2 opacity-60">{option.multiplier}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Allocation */}
          <div>
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-sacred-gold" />
              Budget tokens
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-sacred-gold"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-ancient-stone">Allocation:</span>
                <span className="text-sacred-gold font-medium">{formatTokens(budget)} tokens</span>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className={`
            p-4 rounded-xl border
            ${canAfford ? 'border-white/10 bg-white/[0.02]' : 'border-red-500/30 bg-red-500/10'}
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ancient-stone">Coût estimé</span>
              <span className={`text-lg font-display font-semibold ${canAfford ? 'text-soft-sand' : 'text-red-400'}`}>
                {formatTokens(estimatedCost)} tokens
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-ancient-stone">
              <span>Base: {agent.cost} tk/req × Scope × Durée</span>
              {!canAfford && (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Budget insuffisant
                </span>
              )}
            </div>
          </div>

          {/* Governance Notice */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-sphere-government/10 border border-sphere-government/20">
            <Shield className="w-5 h-5 text-sphere-government flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-soft-sand mb-1">Gouvernance activée</p>
              <p className="text-xs text-ancient-stone">
                Cet agent respecte les 7 règles R&D CHE·NU. Toutes ses actions nécessitent votre approbation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-ancient-stone hover:text-soft-sand"
          >
            Annuler
          </button>
          <button
            onClick={handleEngage}
            disabled={!canAfford || isEngaging}
            className={`
              btn-primary flex items-center gap-2
              ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isEngaging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            Engager {agent.name}
          </button>
        </div>
      </div>
    </div>
  )
}

// Quick Engage Button (for thread sidebar)
export function QuickEngageButton({
  agent,
  onEngage,
  compact = false,
}: {
  agent: Agent
  onEngage: () => void
  compact?: boolean
}) {
  const levelColors = {
    L0: 'text-sacred-gold',
    L1: 'text-sphere-studio',
    L2: 'text-cenote-turquoise',
    L3: 'text-jungle-emerald',
  }

  if (compact) {
    return (
      <button
        onClick={onEngage}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-jungle-emerald/10 hover:bg-jungle-emerald/20 text-jungle-emerald text-sm"
      >
        <Bot className="w-4 h-4" />
        Engager
      </button>
    )
  }

  return (
    <button
      onClick={onEngage}
      className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-left group"
    >
      <div className={`w-10 h-10 rounded-xl bg-jungle-emerald/10 flex items-center justify-center`}>
        <Bot className={`w-5 h-5 ${levelColors[agent.level]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-soft-sand truncate">{agent.name}</span>
          <span className="text-xs text-ancient-stone">{agent.level}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-ancient-stone">
          <Coins className="w-3 h-3" />
          {agent.cost} tk/req
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-ancient-stone group-hover:text-soft-sand transition-colors" />
    </button>
  )
}

// Agent Suggestions Panel
export function AgentSuggestionsPanel({
  sphereId,
  context,
  onSelect,
}: {
  sphereId: SphereId
  context?: string
  onSelect: (agent: Agent) => void
}) {
  const { availableAgents } = useAgentsStore()

  // Get relevant agents for sphere
  const suggestedAgents = availableAgents
    .filter(a => a.sphere_id === sphereId || a.level === 'L1' || a.level === 'L2')
    .slice(0, 4)

  if (suggestedAgents.length === 0) return null

  return (
    <div className="p-4 rounded-xl border border-sacred-gold/20 bg-sacred-gold/5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-sacred-gold" />
        <span className="text-sm font-medium text-sacred-gold">Agents suggérés</span>
      </div>
      <div className="space-y-2">
        {suggestedAgents.map((agent) => (
          <QuickEngageButton
            key={agent.id}
            agent={agent}
            onEngage={() => onSelect(agent)}
          />
        ))}
      </div>
    </div>
  )
}

// Mock capabilities
const mockCapabilities = [
  'Recherche avancée',
  'Analyse de données',
  'Rédaction de contenu',
  'Résumé automatique',
  'Traduction',
  'Code generation',
]
