// ============================================================
// CHE·NU - Sphere Budget Overview
// ============================================================
// Shows all sphere budgets in a dashboard view
// Visual distribution of token usage
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PieChart, 
  BarChart3, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Wallet,
  Calendar
} from 'lucide-react'
import { clsx } from 'clsx'
import { SphereBudgetPanel, type SphereBudget } from './SphereBudgetPanel'

interface SphereBudgetOverviewProps {
  budgets: SphereBudget[]
  totalLimit: number
  totalUsed: number
  onEditLimit?: (sphereId: string) => void
  onViewDetails?: (sphereId: string) => void
  loading?: boolean
}

export function SphereBudgetOverview({
  budgets,
  totalLimit,
  totalUsed,
  onEditLimit,
  onViewDetails,
  loading = false
}: SphereBudgetOverviewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expanded, setExpanded] = useState(true)

  const totalPercent = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0
  const totalRemaining = totalLimit - totalUsed

  // Sort by usage (highest first)
  const sortedBudgets = [...budgets].sort((a, b) => b.usedTokens - a.usedTokens)

  if (loading) {
    return (
      <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm mt-3">Chargement des budgets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Wallet size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Budget Total - Toutes Sphères</h3>
              <p className="text-sm text-gray-400">
                {budgets.length} sphère{budgets.length > 1 ? 's' : ''} actives
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {totalPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">utilisé ce mois</p>
            </div>
            {expanded ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Global Progress */}
        <div className="px-4 pb-4">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, totalPercent)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{totalUsed.toLocaleString()} utilisés</span>
            <span>{totalRemaining.toLocaleString()} restants</span>
          </div>
        </div>

        {/* Stats Grid */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="grid grid-cols-3 border-t border-gray-700/30">
                <div className="p-4 text-center border-r border-gray-700/30">
                  <p className="text-2xl font-bold text-purple-400">
                    {totalUsed.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">tokens utilisés</p>
                </div>
                <div className="p-4 text-center border-r border-gray-700/30">
                  <p className="text-2xl font-bold text-pink-400">
                    {totalRemaining.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">tokens restants</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {totalLimit.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">limite mensuelle</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Per-Sphere Distribution */}
      <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-400" />
            Distribution par Sphère
          </h4>
          <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'px-3 py-1 rounded text-xs transition-colors',
                viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-500'
              )}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'px-3 py-1 rounded text-xs transition-colors',
                viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500'
              )}
            >
              Liste
            </button>
          </div>
        </div>

        {/* Sphere Budgets */}
        <div className={clsx(
          'p-4',
          viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'
        )}>
          {sortedBudgets.map((budget) => (
            <SphereBudgetPanel
              key={budget.sphereId}
              budget={budget}
              compact={viewMode === 'list'}
              onEditLimit={onEditLimit ? () => onEditLimit(budget.sphereId) : undefined}
              onViewDetails={onViewDetails ? () => onViewDetails(budget.sphereId) : undefined}
            />
          ))}
        </div>

        {budgets.length === 0 && (
          <div className="p-8 text-center">
            <PieChart size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">Aucune sphère avec budget</p>
            <p className="text-xs text-gray-600 mt-1">
              Les budgets sont initialisés automatiquement lors de la première utilisation
            </p>
          </div>
        )}
      </div>

      {/* Period Info */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Calendar size={12} />
        <span>Période actuelle: {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
  )
}
