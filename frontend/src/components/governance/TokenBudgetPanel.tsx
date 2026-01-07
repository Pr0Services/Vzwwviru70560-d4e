/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — TOKEN BUDGET PANEL                          ║
 * ║                    Token Budget Dashboard & Management                        ║
 * ║                    Task A+8: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * TOKEN BUDGET PANEL FEATURES:
 * - Budget overview with progress bars
 * - Usage analytics
 * - Budget management actions
 * - Transaction history
 * - Rule configuration
 */

import React, { useState, useMemo, useCallback } from 'react'
import {
  useTokenStore,
  type TokenBudget,
  type TokenAnalytics,
  type TokenTransaction,
  type BudgetPeriod,
  type SphereId,
} from '../../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: 'space-y-6',
  grid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  
  // Cards
  card: 'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden',
  cardHeader: 'px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between',
  cardTitle: 'text-lg font-semibold text-slate-900 dark:text-white',
  cardBody: 'p-6',
  cardFooter: 'px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700',
  
  // Stats
  statGrid: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
  statCard: 'bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-center',
  statValue: 'text-2xl font-bold text-slate-900 dark:text-white',
  statLabel: 'text-xs text-slate-500 dark:text-slate-400 mt-1',
  statTrend: 'text-xs mt-2',
  trendUp: 'text-emerald-600 dark:text-emerald-400',
  trendDown: 'text-red-600 dark:text-red-400',
  
  // Progress
  progressContainer: 'space-y-2',
  progressHeader: 'flex justify-between items-center',
  progressLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  progressValue: 'text-sm text-slate-500 dark:text-slate-400',
  progressBar: 'h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden',
  progressFill: 'h-full rounded-full transition-all duration-500',
  
  // Budget list
  budgetList: 'space-y-4',
  budgetItem: 'bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4',
  budgetHeader: 'flex items-center justify-between mb-3',
  budgetName: 'font-medium text-slate-900 dark:text-white',
  budgetSphere: 'text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300',
  budgetStats: 'flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400',
  
  // Transactions
  txList: 'space-y-2 max-h-64 overflow-y-auto',
  txItem: 'flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg',
  txLeft: 'flex items-center gap-3',
  txIcon: 'w-8 h-8 rounded-lg flex items-center justify-center',
  txDetails: '',
  txDesc: 'text-sm font-medium text-slate-900 dark:text-white',
  txTime: 'text-xs text-slate-500 dark:text-slate-400',
  txAmount: 'font-medium',
  txPositive: 'text-emerald-600 dark:text-emerald-400',
  txNegative: 'text-red-600 dark:text-red-400',
  
  // Chart
  chart: 'h-40 flex items-end gap-1',
  chartBar: 'flex-1 bg-amber-500 dark:bg-amber-400 rounded-t transition-all duration-300 hover:bg-amber-600',
  chartLabel: 'text-center text-xs text-slate-400 mt-2',
  
  // Actions
  actions: 'flex gap-2',
  btn: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
  btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
  btnSecondary: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300',
  
  // Modal
  modalOverlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
  modalContent: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6',
  modalTitle: 'text-lg font-semibold text-slate-900 dark:text-white mb-4',
  modalForm: 'space-y-4',
  formField: 'space-y-2',
  formLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  formInput: 'w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500',
  formSelect: 'w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500',
  modalActions: 'flex gap-3 mt-6',
  
  // Empty
  empty: 'text-center py-8',
  emptyIcon: 'text-4xl mb-2',
  emptyText: 'text-slate-500 dark:text-slate-400',
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const formatNumber = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

const getProgressColor = (percentage: number): string => {
  if (percentage >= 95) return 'bg-red-500'
  if (percentage >= 80) return 'bg-amber-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

const getTxIcon = (type: TokenTransaction['type']): { icon: string; bg: string } => {
  switch (type) {
    case 'allocation': return { icon: '📥', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
    case 'consumption': return { icon: '📤', bg: 'bg-red-100 dark:bg-red-900/30' }
    case 'reservation': return { icon: '🔒', bg: 'bg-blue-100 dark:bg-blue-900/30' }
    case 'release': return { icon: '🔓', bg: 'bg-purple-100 dark:bg-purple-900/30' }
    case 'transfer': return { icon: '↔️', bg: 'bg-amber-100 dark:bg-amber-900/30' }
    case 'refund': return { icon: '↩️', bg: 'bg-teal-100 dark:bg-teal-900/30' }
    case 'bonus': return { icon: '🎁', bg: 'bg-pink-100 dark:bg-pink-900/30' }
    default: return { icon: '📋', bg: 'bg-slate-100 dark:bg-slate-700' }
  }
}

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}min`
  if (hours < 24) return `${hours}h`
  return `${days}j`
}

const SPHERE_NAMES: Record<SphereId, string> = {
  personal: 'Personnel',
  business: 'Business',
  government: 'Gouvernement',
  design_studio: 'Studio',
  community: 'Communauté',
  social: 'Social',
  entertainment: 'Divertissement',
  team: 'Équipe',
  scholar: 'Académique',
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════════════════════════════

interface TokenBudgetPanelProps {
  identityId: string
  sphereId?: SphereId
  compact?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TokenBudgetPanel: React.FC<TokenBudgetPanelProps> = ({
  identityId,
  sphereId,
  compact = false,
}) => {
  // Store
  const budgets = useTokenStore(state => 
    Object.values(state.budgets).filter(b => 
      b.identity_id === identityId && 
      (!sphereId || b.sphere_id === sphereId)
    )
  )
  const globalBalance = useTokenStore(state => state.getGlobalBalance())
  const analytics = useTokenStore(state => state.getAnalytics(identityId))
  const transactions = useTokenStore(state => 
    state.getTransactionHistory({ identity_id: identityId, limit: 10 })
  )
  const createBudget = useTokenStore(state => state.createBudget)
  const requestBudgetIncrease = useTokenStore(state => state.requestBudgetIncrease)
  
  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showIncreaseModal, setShowIncreaseModal] = useState<string | null>(null)
  const [newBudget, setNewBudget] = useState({
    name: '',
    sphere_id: 'personal' as SphereId,
    total_allocated: 5000,
    period: 'monthly' as BudgetPeriod,
  })
  const [increaseAmount, setIncreaseAmount] = useState(1000)
  const [increaseJustification, setIncreaseJustification] = useState('')
  
  // Computed totals
  const totals = useMemo(() => {
    return budgets.reduce((acc, b) => ({
      allocated: acc.allocated + b.total_allocated,
      used: acc.used + b.total_used,
      remaining: acc.remaining + b.remaining,
    }), { allocated: 0, used: 0, remaining: 0 })
  }, [budgets])
  
  const overallPercentage = totals.allocated > 0 
    ? Math.round((totals.used / totals.allocated) * 100) 
    : 0
  
  // Handlers
  const handleCreateBudget = useCallback(() => {
    if (!newBudget.name.trim()) return
    
    createBudget({
      ...newBudget,
      identity_id: identityId,
      created_by: identityId,
    })
    
    setNewBudget({
      name: '',
      sphere_id: 'personal',
      total_allocated: 5000,
      period: 'monthly',
    })
    setShowCreateModal(false)
  }, [newBudget, identityId, createBudget])
  
  const handleRequestIncrease = useCallback(() => {
    if (!showIncreaseModal || !increaseJustification.trim()) return
    
    requestBudgetIncrease(
      showIncreaseModal,
      increaseAmount,
      increaseJustification.trim(),
      identityId
    )
    
    setShowIncreaseModal(null)
    setIncreaseAmount(1000)
    setIncreaseJustification('')
  }, [showIncreaseModal, increaseAmount, increaseJustification, identityId, requestBudgetIncrease])
  
  // Compact view
  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            🪙 Tokens
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formatNumber(totals.remaining)} restants
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${getProgressColor(overallPercentage)}`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>{formatNumber(totals.used)} utilisés</span>
          <span>{formatNumber(totals.allocated)} total</span>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className={styles.container}>
        {/* Overview Stats */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>🪙 {formatNumber(totals.remaining)}</div>
            <div className={styles.statLabel}>Tokens disponibles</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{formatNumber(analytics.total_used_today)}</div>
            <div className={styles.statLabel}>Utilisés aujourd'hui</div>
            <div className={`${styles.statTrend} ${analytics.total_used_today > analytics.average_daily ? styles.trendUp : styles.trendDown}`}>
              {analytics.total_used_today > analytics.average_daily ? '↑' : '↓'} vs moyenne
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{overallPercentage}%</div>
            <div className={styles.statLabel}>Utilisation</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{analytics.efficiency_score}</div>
            <div className={styles.statLabel}>Score efficacité</div>
          </div>
        </div>
        
        <div className={styles.grid}>
          {/* Budgets */}
          <div className={`${styles.card} lg:col-span-2`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>💰 Budgets</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                + Nouveau
              </button>
            </div>
            <div className={styles.cardBody}>
              {budgets.length > 0 ? (
                <div className={styles.budgetList}>
                  {budgets.map(budget => {
                    const percentage = budget.total_allocated > 0
                      ? Math.round((budget.total_used / budget.total_allocated) * 100)
                      : 0
                    
                    return (
                      <div key={budget.id} className={styles.budgetItem}>
                        <div className={styles.budgetHeader}>
                          <div className="flex items-center gap-2">
                            <span className={styles.budgetName}>{budget.name}</span>
                            <span className={styles.budgetSphere}>
                              {SPHERE_NAMES[budget.sphere_id]}
                            </span>
                          </div>
                          <button
                            onClick={() => setShowIncreaseModal(budget.id)}
                            className="text-amber-600 hover:text-amber-700 text-sm"
                          >
                            + Augmenter
                          </button>
                        </div>
                        
                        <div className={styles.progressContainer}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>
                              {formatNumber(budget.total_used)} / {formatNumber(budget.total_allocated)}
                            </span>
                            <span className={styles.progressValue}>{percentage}%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={`${styles.progressFill} ${getProgressColor(percentage)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className={styles.budgetStats}>
                          <span>📅 {budget.period}</span>
                          <span>🔒 {formatNumber(budget.total_reserved)} réservés</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>💰</div>
                  <p className={styles.emptyText}>Aucun budget créé</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Transactions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>📊 Transactions</h3>
            </div>
            <div className={styles.cardBody}>
              {transactions.length > 0 ? (
                <div className={styles.txList}>
                  {transactions.map(tx => {
                    const iconConfig = getTxIcon(tx.type)
                    const isPositive = ['allocation', 'refund', 'bonus', 'release'].includes(tx.type)
                    
                    return (
                      <div key={tx.id} className={styles.txItem}>
                        <div className={styles.txLeft}>
                          <div className={`${styles.txIcon} ${iconConfig.bg}`}>
                            {iconConfig.icon}
                          </div>
                          <div className={styles.txDetails}>
                            <div className={styles.txDesc}>{tx.description}</div>
                            <div className={styles.txTime}>{formatRelativeTime(tx.timestamp)}</div>
                          </div>
                        </div>
                        <div className={`${styles.txAmount} ${isPositive ? styles.txPositive : styles.txNegative}`}>
                          {isPositive ? '+' : '-'}{formatNumber(tx.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>📊</div>
                  <p className={styles.emptyText}>Aucune transaction</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Usage Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>📈 Utilisation (7 jours)</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.chart}>
              {analytics.daily_trend.map((day, idx) => {
                const maxValue = Math.max(...analytics.daily_trend.map(d => d.tokens_used), 1)
                const height = (day.tokens_used / maxValue) * 100
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className={styles.chartBar}
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${day.tokens_used} tokens`}
                    />
                    <div className={styles.chartLabel}>
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Global Balance */}
        <div className={`${styles.card} bg-gradient-to-br from-amber-500 to-amber-600`}>
          <div className="p-6 text-white">
            <h3 className="text-sm font-medium opacity-80 mb-1">Balance Globale</h3>
            <div className="text-3xl font-bold mb-4">
              🪙 {formatNumber(globalBalance.available)}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="opacity-70">Total</div>
                <div className="font-medium">{formatNumber(globalBalance.total)}</div>
              </div>
              <div>
                <div className="opacity-70">Réservé</div>
                <div className="font-medium">{formatNumber(globalBalance.reserved)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Créer un budget</h3>
            <div className={styles.modalForm}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nom</label>
                <input
                  type="text"
                  value={newBudget.name}
                  onChange={e => setNewBudget(b => ({ ...b, name: e.target.value }))}
                  placeholder="Ex: Budget Marketing"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Sphère</label>
                <select
                  value={newBudget.sphere_id}
                  onChange={e => setNewBudget(b => ({ ...b, sphere_id: e.target.value as SphereId }))}
                  className={styles.formSelect}
                >
                  {Object.entries(SPHERE_NAMES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Tokens alloués</label>
                <input
                  type="number"
                  value={newBudget.total_allocated}
                  onChange={e => setNewBudget(b => ({ ...b, total_allocated: parseInt(e.target.value) || 0 }))}
                  min={100}
                  max={globalBalance.available}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Période</label>
                <select
                  value={newBudget.period}
                  onChange={e => setNewBudget(b => ({ ...b, period: e.target.value as BudgetPeriod }))}
                  className={styles.formSelect}
                >
                  <option value="daily">Journalier</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="yearly">Annuel</option>
                  <option value="unlimited">Illimité</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 ${styles.btn} ${styles.btnSecondary}`}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateBudget}
                disabled={!newBudget.name.trim()}
                className={`flex-1 ${styles.btn} ${styles.btnPrimary} disabled:opacity-50`}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Increase Budget Modal */}
      {showIncreaseModal && (
        <div className={styles.modalOverlay} onClick={() => setShowIncreaseModal(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Demander une augmentation</h3>
            <div className={styles.modalForm}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Montant</label>
                <input
                  type="number"
                  value={increaseAmount}
                  onChange={e => setIncreaseAmount(parseInt(e.target.value) || 0)}
                  min={100}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Justification</label>
                <textarea
                  value={increaseJustification}
                  onChange={e => setIncreaseJustification(e.target.value)}
                  placeholder="Expliquez pourquoi vous avez besoin de plus de tokens..."
                  rows={3}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowIncreaseModal(null)}
                className={`flex-1 ${styles.btn} ${styles.btnSecondary}`}
              >
                Annuler
              </button>
              <button
                onClick={handleRequestIncrease}
                disabled={!increaseJustification.trim()}
                className={`flex-1 ${styles.btn} ${styles.btnPrimary} disabled:opacity-50`}
              >
                Demander
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINI TOKEN DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

export const TokenBalance: React.FC<{
  budgetId?: string
  showLabel?: boolean
}> = ({ budgetId, showLabel = true }) => {
  const budget = useTokenStore(state => budgetId ? state.budgets[budgetId] : null)
  const globalBalance = useTokenStore(state => state.getGlobalBalance())
  
  const balance = budget?.remaining ?? globalBalance.available
  const percentage = budget 
    ? Math.round((budget.total_used / budget.total_allocated) * 100)
    : 0
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">🪙</span>
      <span className="font-medium text-slate-900 dark:text-white">
        {formatNumber(balance)}
      </span>
      {showLabel && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          tokens
        </span>
      )}
      {budget && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          percentage >= 80 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {percentage}%
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default TokenBudgetPanel
