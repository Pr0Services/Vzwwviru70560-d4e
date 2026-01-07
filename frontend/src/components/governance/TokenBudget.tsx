/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TOKEN BUDGET DISPLAY                            ║
 * ║                    Task B2.5: Token usage and budget visualization            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  Coins, TrendingUp, TrendingDown, AlertTriangle,
  Info, ChevronDown, ChevronUp, Sparkles, Bot,
  Zap, Shield, Clock, BarChart3
} from 'lucide-react'
import { useGovernanceStore } from '@/stores'
import { formatTokens, percentage } from '@/utils'

interface TokenBudgetProps {
  compact?: boolean
  showDetails?: boolean
}

export default function TokenBudget({ 
  compact = false,
  showDetails = true,
}: TokenBudgetProps) {
  const { tokenBudget, tokenUsage } = useGovernanceStore()
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate stats
  const used = tokenUsage?.total || 0
  const limit = tokenBudget?.limit || 100000
  const remaining = limit - used
  const usagePercent = percentage(used, limit)
  const isLow = usagePercent >= 80
  const isCritical = usagePercent >= 95

  // Mock usage by category
  const usageByCategory = [
    { id: 'agents', label: 'Agents', used: Math.floor(used * 0.6), icon: Bot, color: 'text-jungle-emerald' },
    { id: 'nova', label: 'Nova', used: Math.floor(used * 0.25), icon: Sparkles, color: 'text-sacred-gold' },
    { id: 'encoding', label: 'Encoding', used: Math.floor(used * 0.1), icon: Shield, color: 'text-cenote-turquoise' },
    { id: 'other', label: 'Autre', used: Math.floor(used * 0.05), icon: Zap, color: 'text-ancient-stone' },
  ]

  // Compact version (for sidebar/header)
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          ${isCritical ? 'bg-red-500/20' : isLow ? 'bg-earth-ember/20' : 'bg-sacred-gold/20'}
        `}>
          <Coins className={`w-4 h-4 ${isCritical ? 'text-red-400' : isLow ? 'text-earth-ember' : 'text-sacred-gold'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ancient-stone">Tokens</span>
            <span className={`text-xs font-medium ${isCritical ? 'text-red-400' : isLow ? 'text-earth-ember' : 'text-soft-sand'}`}>
              {usagePercent}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical ? 'bg-red-500' : isLow ? 'bg-earth-ember' : 'bg-sacred-gold'
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${isCritical ? 'bg-red-500/20' : isLow ? 'bg-earth-ember/20' : 'bg-sacred-gold/20'}
            `}>
              <Coins className={`w-6 h-6 ${isCritical ? 'text-red-400' : isLow ? 'text-earth-ember' : 'text-sacred-gold'}`} />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-soft-sand">Budget Tokens</h3>
              <p className="text-xs text-ancient-stone">Gouvernance des ressources AI</p>
            </div>
          </div>

          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-ancient-stone">Utilisé</span>
            <span className={`font-medium ${isCritical ? 'text-red-400' : isLow ? 'text-earth-ember' : 'text-soft-sand'}`}>
              {formatTokens(used)} / {formatTokens(limit)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical ? 'bg-red-500' : isLow ? 'bg-earth-ember' : 'bg-sacred-gold'
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Alert if low */}
        {isLow && (
          <div className={`
            flex items-start gap-3 p-3 rounded-xl mb-4
            ${isCritical ? 'bg-red-500/10 border border-red-500/20' : 'bg-earth-ember/10 border border-earth-ember/20'}
          `}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isCritical ? 'text-red-400' : 'text-earth-ember'}`} />
            <div>
              <p className={`text-sm font-medium ${isCritical ? 'text-red-400' : 'text-earth-ember'}`}>
                {isCritical ? 'Budget critique!' : 'Budget faible'}
              </p>
              <p className="text-xs text-ancient-stone mt-0.5">
                {isCritical 
                  ? 'Vos agents seront limités. Augmentez votre budget ou attendez le renouvellement.'
                  : 'Considérez d\'augmenter votre budget pour éviter les interruptions.'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-jungle-emerald" />
              <span className="text-xs text-ancient-stone">Restant</span>
            </div>
            <p className="text-lg font-semibold text-soft-sand">{formatTokens(remaining)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-cenote-turquoise" />
              <span className="text-xs text-ancient-stone">Moy/jour</span>
            </div>
            <p className="text-lg font-semibold text-soft-sand">{formatTokens(Math.floor(used / 30))}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-earth-ember" />
              <span className="text-xs text-ancient-stone">Renouv.</span>
            </div>
            <p className="text-lg font-semibold text-soft-sand">28j</p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && showDetails && (
        <div className="border-t border-white/5">
          {/* Usage by Category */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-soft-sand mb-3">Usage par catégorie</h4>
            <div className="space-y-3">
              {usageByCategory.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-ancient-stone">{cat.label}</span>
                      <span className="text-soft-sand">{formatTokens(cat.used)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cat.color.replace('text-', 'bg-')}`}
                        style={{ width: `${percentage(cat.used, used)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 border-t border-white/5">
            <h4 className="text-sm font-medium text-soft-sand mb-3">Activité récente</h4>
            <div className="space-y-2">
              {[
                { action: 'Nova analyse', tokens: 1250, time: '5 min' },
                { action: 'Agent research', tokens: 3400, time: '12 min' },
                { action: 'Encoding batch', tokens: 850, time: '25 min' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ancient-stone">{activity.action}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-soft-sand">-{formatTokens(activity.tokens)}</span>
                    <span className="text-xs text-ancient-stone">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-white/5 flex items-center gap-2">
            <button className="flex-1 btn-primary text-sm">
              Augmenter budget
            </button>
            <button className="flex-1 btn-outline text-sm">
              Voir historique
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Mini Token Badge (for header)
export function TokenBadge() {
  const { tokenUsage, tokenBudget } = useGovernanceStore()
  
  const used = tokenUsage?.total || 0
  const limit = tokenBudget?.limit || 100000
  const usagePercent = percentage(used, limit)
  const isLow = usagePercent >= 80

  return (
    <div className={`
      flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
      ${isLow ? 'bg-earth-ember/20 text-earth-ember' : 'bg-sacred-gold/20 text-sacred-gold'}
    `}>
      <Coins className="w-3 h-3" />
      <span>{formatTokens(limit - used)}</span>
    </div>
  )
}

// Token Cost Indicator (for actions)
export function TokenCost({ cost, className = '' }: { cost: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs text-ancient-stone ${className}`}>
      <Coins className="w-3 h-3" />
      {formatTokens(cost)} tk
    </span>
  )
}
