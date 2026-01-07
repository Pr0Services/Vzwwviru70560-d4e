// ============================================================
// CHE·NU - Sphere Budget Panel
// ============================================================
// Shows budget status for a single sphere
// Visual progress bar with alert levels
// ============================================================

import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  ChevronRight
} from 'lucide-react'
import { clsx } from 'clsx'

export interface SphereBudget {
  sphereId: string
  sphereLabel: string
  sphereIcon: string
  sphereColor: string
  monthlyLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  alertLevel: 'none' | 'info' | 'warning' | 'critical' | 'exceeded'
  periodStart: string
  periodEnd: string
}

interface SphereBudgetPanelProps {
  budget: SphereBudget
  onEditLimit?: () => void
  onViewDetails?: () => void
  compact?: boolean
}

const alertColors = {
  none: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500/30',
    fill: 'bg-green-500/20'
  },
  info: {
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    fill: 'bg-blue-500/20'
  },
  warning: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    fill: 'bg-yellow-500/20'
  },
  critical: {
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    fill: 'bg-orange-500/20'
  },
  exceeded: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-500/30',
    fill: 'bg-red-500/20'
  }
}

export function SphereBudgetPanel({
  budget,
  onEditLimit,
  onViewDetails,
  compact = false
}: SphereBudgetPanelProps) {
  const colors = alertColors[budget.alertLevel]
  const percent = Math.min(100, budget.usagePercent)

  if (compact) {
    return (
      <div className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-xl border',
        colors.fill,
        colors.border
      )}>
        <span className="text-lg">{budget.sphereIcon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">{budget.sphereLabel}</span>
            <span className={clsx('text-xs font-mono', colors.text)}>
              {percent.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={clsx('h-full rounded-full', colors.bg)}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'rounded-xl border overflow-hidden',
      colors.fill,
      colors.border
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            'bg-gray-800/50'
          )}>
            {budget.sphereIcon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{budget.sphereLabel}</h3>
            <p className="text-xs text-gray-500">
              Budget mensuel
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {budget.alertLevel !== 'none' && budget.alertLevel !== 'info' && (
            <div className={clsx(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
              colors.fill,
              colors.text
            )}>
              <AlertTriangle size={12} />
              {budget.usagePercent.toFixed(0)}%
            </div>
          )}
          
          {onEditLimit && (
            <button
              onClick={onEditLimit}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={clsx('h-full rounded-full', colors.bg)}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-gray-500">0</span>
          <span className={colors.text}>
            {budget.usedTokens.toLocaleString()} / {budget.monthlyLimit.toLocaleString()}
          </span>
          <span className="text-gray-500">{budget.monthlyLimit.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-t border-gray-700/30">
        <div className="p-3 text-center border-r border-gray-700/30">
          <p className="text-lg font-bold text-white">
            {budget.usedTokens.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">utilisés</p>
        </div>
        <div className="p-3 text-center">
          <p className={clsx('text-lg font-bold', colors.text)}>
            {budget.remainingTokens.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">restants</p>
        </div>
      </div>

      {/* Footer Action */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full p-3 border-t border-gray-700/30 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/30 transition-colors"
        >
          Voir les détails
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}
