// ============================================================
// CHE·NU - Budget Guard Alert
// ============================================================
// Shows when action is blocked by budget
// Nova explains, never just blocks
// Suggests solutions
// ============================================================

import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Shield, 
  ArrowRight,
  X,
  Leaf,
  Scale,
  Rocket,
  MousePointer2
} from 'lucide-react'
import { clsx } from 'clsx'
import type { BudgetPresetId } from './BudgetPresetSelector'

export interface BudgetViolation {
  ok: boolean
  reason?: string
  suggestion?: string
  violation_type?: 'model_not_allowed' | 'action_limit_exceeded' | 'scope_not_allowed' | 'meeting_budget_exceeded'
  current_limit?: number
  requested?: number
}

interface BudgetGuardAlertProps {
  violation: BudgetViolation
  currentPreset: BudgetPresetId
  onReduceScope?: () => void
  onUpgradePreset?: (preset: BudgetPresetId) => void
  onDismiss: () => void
}

const presetIcons = {
  eco: Leaf,
  balanced: Scale,
  pro: Rocket
}

const nextPreset: Record<BudgetPresetId, BudgetPresetId | null> = {
  eco: 'balanced',
  balanced: 'pro',
  pro: null
}

export function BudgetGuardAlert({
  violation,
  currentPreset,
  onReduceScope,
  onUpgradePreset,
  onDismiss
}: BudgetGuardAlertProps) {
  if (violation.ok) return null

  const nextUp = nextPreset[currentPreset]
  const canUpgrade = nextUp !== null && onUpgradePreset
  const canReduce = onReduceScope && violation.violation_type === 'action_limit_exceeded'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-red-400" />
          <span className="font-medium text-red-400">Budget Guard</span>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Reason */}
      <p className="text-sm text-gray-300 mb-3">
        {violation.reason}
      </p>

      {/* Stats (if available) */}
      {violation.current_limit && violation.requested && (
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-gray-800/50">
          <div>
            <p className="text-lg font-bold text-red-400">{violation.requested.toLocaleString()}</p>
            <p className="text-xs text-gray-500">demandé</p>
          </div>
          <ArrowRight size={16} className="text-gray-600" />
          <div>
            <p className="text-lg font-bold text-green-400">{violation.current_limit.toLocaleString()}</p>
            <p className="text-xs text-gray-500">limite</p>
          </div>
        </div>
      )}

      {/* Suggestion (from Nova) */}
      {violation.suggestion && (
        <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-purple-400">💡 Nova suggère:</span>
          </div>
          <p className="text-sm text-gray-300">{violation.suggestion}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canReduce && (
          <button
            onClick={onReduceScope}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium"
          >
            <MousePointer2 size={14} />
            Réduire à Selection
          </button>
        )}
        
        {canUpgrade && (
          <button
            onClick={() => onUpgradePreset(nextUp!)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
              nextUp === 'balanced' && 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
              nextUp === 'pro' && 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            )}
          >
            {(() => {
              const Icon = presetIcons[nextUp!]
              return <Icon size={14} />
            })()}
            Passer à {nextUp === 'balanced' ? 'Balanced' : 'Pro'}
          </button>
        )}
        
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm"
        >
          Annuler
        </button>
      </div>
    </motion.div>
  )
}
