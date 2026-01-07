// ============================================================
// CHE·NU - Scope Warning Panel
// ============================================================
// Shows token delta vs Selection (baseline)
// Enables 1-click scope reduction
// No silent costs • User in control
// ============================================================

import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  Zap,
  DollarSign,
  MousePointer2,
  FileText,
  FolderOpen,
  Users
} from 'lucide-react'
import { clsx } from 'clsx'
import type { Scope } from './ScopeSelector'
import type { MultiScopeEstimate, DeltaEstimate } from '@/services/workspace'

interface ScopeWarningPanelProps {
  currentScope: Scope
  estimates: MultiScopeEstimate | null
  onReduceScope: (to: Scope) => void
  loading?: boolean
}

const scopeIcons: Record<Scope, typeof MousePointer2> = {
  selection: MousePointer2,
  document: FileText,
  workspace: FolderOpen,
  meeting: Users
}

const scopeLabels: Record<Scope, string> = {
  selection: 'Sélection',
  document: 'Document',
  workspace: 'Workspace',
  meeting: 'Meeting'
}

export function ScopeWarningPanel({
  currentScope,
  estimates,
  onReduceScope,
  loading = false
}: ScopeWarningPanelProps) {
  // No warning needed for selection (baseline)
  if (currentScope === 'selection' || !estimates) {
    return null
  }

  const currentEst = estimates[currentScope]
  const baselineEst = estimates.selection
  const delta = estimates.deltas[currentScope]

  if (!currentEst || !baselineEst || !delta) {
    return null
  }

  // Determine severity
  const severity = getSeverity(delta.percentageIncrease)
  const CurrentIcon = scopeIcons[currentScope]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={clsx(
          'rounded-xl border overflow-hidden',
          severity === 'high' && 'bg-red-500/10 border-red-500/30',
          severity === 'medium' && 'bg-orange-500/10 border-orange-500/30',
          severity === 'low' && 'bg-yellow-500/10 border-yellow-500/30',
          severity === 'info' && 'bg-blue-500/10 border-blue-500/30'
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className={clsx(
              severity === 'high' && 'text-red-400',
              severity === 'medium' && 'text-orange-400',
              severity === 'low' && 'text-yellow-400',
              severity === 'info' && 'text-blue-400'
            )} />
            <span className="font-medium text-gray-200">
              Impact du scope
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CurrentIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">{scopeLabels[currentScope]}</span>
          </div>
        </div>

        {/* Delta Stats */}
        <div className="px-4 py-3 border-t border-gray-700/50 grid grid-cols-3 gap-4">
          {/* Tokens Delta */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp size={14} className={clsx(
                delta.deltaTokens > 0 ? 'text-red-400' : 'text-green-400'
              )} />
              <span className={clsx(
                'text-lg font-bold',
                delta.deltaTokens > 0 ? 'text-red-400' : 'text-green-400'
              )}>
                {delta.deltaTokens > 0 ? '+' : ''}{delta.deltaTokens.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">tokens vs Sélection</p>
          </div>

          {/* Cost Delta */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign size={14} className={clsx(
                delta.deltaCostUSD > 0 ? 'text-red-400' : 'text-green-400'
              )} />
              <span className={clsx(
                'text-lg font-bold',
                delta.deltaCostUSD > 0 ? 'text-red-400' : 'text-green-400'
              )}>
                {delta.deltaCostUSD > 0 ? '+' : ''}${delta.deltaCostUSD.toFixed(4)}
              </span>
            </div>
            <p className="text-xs text-gray-500">coût additionnel</p>
          </div>

          {/* Percentage */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Zap size={14} className={clsx(
                severity === 'high' && 'text-red-400',
                severity === 'medium' && 'text-orange-400',
                severity === 'low' && 'text-yellow-400',
                severity === 'info' && 'text-blue-400'
              )} />
              <span className={clsx(
                'text-lg font-bold',
                severity === 'high' && 'text-red-400',
                severity === 'medium' && 'text-orange-400',
                severity === 'low' && 'text-yellow-400',
                severity === 'info' && 'text-blue-400'
              )}>
                +{delta.percentageIncrease}%
              </span>
            </div>
            <p className="text-xs text-gray-500">augmentation</p>
          </div>
        </div>

        {/* Warning Message */}
        {delta.warning && (
          <div className="px-4 py-2 border-t border-gray-700/50">
            <p className={clsx(
              'text-sm',
              severity === 'high' && 'text-red-400',
              severity === 'medium' && 'text-orange-400',
              severity === 'low' && 'text-yellow-400'
            )}>
              ⚠️ {delta.warning}
            </p>
          </div>
        )}

        {/* Reduce Scope Actions */}
        <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-900/30">
          <p className="text-xs text-gray-500 mb-2">Réduire le scope pour économiser:</p>
          <div className="flex gap-2">
            <button
              onClick={() => onReduceScope('selection')}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <MousePointer2 size={14} />
              Sélection
              <span className="text-xs text-green-600">(-{delta.percentageIncrease}%)</span>
            </button>
            
            {currentScope !== 'document' && (
              <button
                onClick={() => onReduceScope('document')}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <FileText size={14} />
                Document
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table (Expandable) */}
        <ScopeComparisonTable estimates={estimates} currentScope={currentScope} />
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================
// HELPER: Get Severity Level
// ============================================================
function getSeverity(percentageIncrease: number): 'info' | 'low' | 'medium' | 'high' {
  if (percentageIncrease > 200) return 'high'
  if (percentageIncrease > 100) return 'medium'
  if (percentageIncrease > 50) return 'low'
  return 'info'
}

// ============================================================
// SUB-COMPONENT: Scope Comparison Table
// ============================================================
function ScopeComparisonTable({ 
  estimates, 
  currentScope 
}: { 
  estimates: MultiScopeEstimate
  currentScope: Scope 
}) {
  const [expanded, setExpanded] = useState(false)

  const scopes: Scope[] = ['selection', 'document', 'workspace', 'meeting']
  
  return (
    <div className="border-t border-gray-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        <span>Comparer tous les scopes</span>
        <ChevronDown size={14} className={clsx(
          'transition-transform',
          expanded && 'rotate-180'
        )} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1">
              {scopes.map(scope => {
                const est = estimates[scope]
                if (!est) return null
                
                const Icon = scopeIcons[scope]
                const isActive = scope === currentScope
                const isBaseline = scope === 'selection'
                
                return (
                  <div
                    key={scope}
                    className={clsx(
                      'flex items-center justify-between p-2 rounded-lg text-sm',
                      isActive && 'bg-gray-700/50 ring-1 ring-gray-600',
                      isBaseline && !isActive && 'bg-green-500/5'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={clsx(
                        isBaseline ? 'text-green-400' : 'text-gray-400'
                      )} />
                      <span className={clsx(
                        isActive ? 'text-white font-medium' : 'text-gray-400'
                      )}>
                        {scopeLabels[scope]}
                      </span>
                      {isBaseline && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                          baseline
                        </span>
                      )}
                      {isActive && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                          actuel
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-400 font-mono">
                        {est.estimatedTokens.toLocaleString()} tok
                      </span>
                      <span className="text-gray-500 font-mono">
                        ${est.estimatedCostUSD.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Import useState
import { useState } from 'react'
