// ============================================================
// CHE·NU - Meeting Live Meter
// ============================================================
// Real-time token consumption display
// Visible, non-intrusive
// Alerts at thresholds (70%, 90%)
// ============================================================

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gauge, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Zap,
  DollarSign
} from 'lucide-react'
import { clsx } from 'clsx'

export interface MeterData {
  meetingId: string
  maxTokens: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  alertLevel: 'none' | 'info' | 'warning' | 'critical' | 'exceeded'
  preset: string
  consumptionCount: number
}

interface MeetingLiveMeterProps {
  data: MeterData | null
  loading?: boolean
  onRefresh?: () => void
  compact?: boolean
  showHistory?: boolean
}

const alertConfig = {
  none: {
    color: 'green',
    bgClass: 'bg-green-500',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/30',
    bgFillClass: 'bg-green-500/20',
    message: 'Budget OK'
  },
  info: {
    color: 'blue',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    bgFillClass: 'bg-blue-500/20',
    message: '50% du budget utilisé'
  },
  warning: {
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
    bgFillClass: 'bg-yellow-500/20',
    message: '70% du budget utilisé'
  },
  critical: {
    color: 'orange',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500/30',
    bgFillClass: 'bg-orange-500/20',
    message: '⚠️ 90% du budget utilisé'
  },
  exceeded: {
    color: 'red',
    bgClass: 'bg-red-500',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30',
    bgFillClass: 'bg-red-500/20',
    message: '❌ Budget dépassé'
  }
}

export function MeetingLiveMeter({
  data,
  loading = false,
  onRefresh,
  compact = false,
  showHistory = false
}: MeetingLiveMeterProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false)

  // Pulse animation when usage changes
  useEffect(() => {
    if (data) {
      setPulseAnimation(true)
      const timer = setTimeout(() => setPulseAnimation(false), 500)
      return () => clearTimeout(timer)
    }
  }, [data?.usedTokens])

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Chargement du meter...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
        <Gauge size={24} className="mx-auto text-gray-500 mb-2" />
        <p className="text-gray-500 text-sm">Aucun meeting actif</p>
      </div>
    )
  }

  const config = alertConfig[data.alertLevel]
  const percent = Math.min(100, data.usagePercent)

  // Compact version (for header bar)
  if (compact) {
    return (
      <div className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-xl border',
        config.bgFillClass,
        config.borderClass
      )}>
        <Gauge size={16} className={config.textClass} />
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={clsx('h-full rounded-full', config.bgClass)}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className={clsx('text-xs font-mono', config.textClass)}>
          {percent.toFixed(0)}%
        </span>
      </div>
    )
  }

  // Full version
  return (
    <div className={clsx(
      'rounded-xl border overflow-hidden',
      config.bgFillClass,
      config.borderClass,
      pulseAnimation && 'ring-2 ring-offset-2 ring-offset-gray-900',
      pulseAnimation && data.alertLevel === 'none' && 'ring-green-500/50',
      pulseAnimation && data.alertLevel === 'info' && 'ring-blue-500/50',
      pulseAnimation && data.alertLevel === 'warning' && 'ring-yellow-500/50',
      pulseAnimation && data.alertLevel === 'critical' && 'ring-orange-500/50',
      pulseAnimation && data.alertLevel === 'exceeded' && 'ring-red-500/50'
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            config.bgClass + '/30'
          )}>
            <Gauge size={20} className={config.textClass} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Meeting Budget</h3>
            <p className="text-xs text-gray-500">
              Preset: {data.preset} • {data.consumptionCount} actions
            </p>
          </div>
        </div>
        
        {/* Alert Badge */}
        {data.alertLevel !== 'none' && (
          <div className={clsx(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
            config.bgClass + '/30',
            config.textClass
          )}>
            {(data.alertLevel === 'critical' || data.alertLevel === 'exceeded') && (
              <AlertTriangle size={12} />
            )}
            {data.usagePercent.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={clsx('h-full rounded-full relative', config.bgClass)}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-gray-500">0</span>
          <span className={config.textClass}>{config.message}</span>
          <span className="text-gray-500">{data.maxTokens.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 border-t border-gray-700/30">
        <div className="p-3 text-center border-r border-gray-700/30">
          <div className="flex items-center justify-center gap-1">
            <Zap size={14} className="text-blue-400" />
            <span className="text-lg font-bold text-white">
              {data.usedTokens.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500">utilisés</p>
        </div>
        <div className="p-3 text-center border-r border-gray-700/30">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp size={14} className={config.textClass} />
            <span className={clsx('text-lg font-bold', config.textClass)}>
              {data.remainingTokens.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500">restants</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock size={14} className="text-gray-400" />
            <span className="text-lg font-bold text-gray-400">
              {data.consumptionCount}
            </span>
          </div>
          <p className="text-xs text-gray-500">actions</p>
        </div>
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <div className="p-2 border-t border-gray-700/30 bg-gray-900/30">
          <button
            onClick={onRefresh}
            className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors"
          >
            Rafraîchir
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SUB-COMPONENT: Inline Mini Meter (for headers)
// ============================================================
export function MiniMeetingMeter({ data }: { data: MeterData | null }) {
  if (!data) return null
  
  const config = alertConfig[data.alertLevel]
  const percent = Math.min(100, data.usagePercent)
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={clsx('h-full rounded-full transition-all', config.bgClass)}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={clsx('text-xs font-mono', config.textClass)}>
        {percent.toFixed(0)}%
      </span>
    </div>
  )
}
