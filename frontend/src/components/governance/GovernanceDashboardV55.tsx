/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — GOVERNANCE DASHBOARD                        ║
 * ║                    Complete Integrated Governance Interface                   ║
 * ║                    Task A+13: Alpha+ Roadmap                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * DASHBOARD FEATURES:
 * - Unified governance overview
 * - Checkpoint management
 * - Token budget monitoring
 * - Audit trail visualization
 * - Agent activity tracking
 * - Real-time metrics
 */

import React, { useState, useMemo } from 'react'
import { 
  useGovernance, 
  useGovernanceMetrics,
  usePendingCheckpoints,
} from '../../hooks/useGovernance'
import { 
  useTokenBudget, 
  useTokenBalance,
} from '../../hooks/useTokenBudget'
import { 
  useAgent,
} from '../../hooks/useAgent'
import {
  CheckpointViewer,
  CheckpointList,
  PendingCheckpointsBadge,
} from './CheckpointViewer'
import { TokenBudgetPanel, TokenBalance } from './TokenBudgetPanel'
import { GovernanceTimeline, RecentActivityFeed } from './GovernanceTimeline'
import type { Checkpoint, SphereId } from '../../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: 'min-h-screen bg-slate-50 dark:bg-slate-900',
  header: 'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4',
  headerContent: 'max-w-7xl mx-auto flex items-center justify-between',
  headerLeft: 'flex items-center gap-4',
  logo: 'text-2xl font-bold text-slate-900 dark:text-white',
  headerRight: 'flex items-center gap-4',
  
  main: 'max-w-7xl mx-auto px-6 py-8',
  
  // Stats bar
  statsBar: 'grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8',
  statCard: 'bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700',
  statIcon: 'text-2xl mb-2',
  statValue: 'text-2xl font-bold text-slate-900 dark:text-white',
  statLabel: 'text-sm text-slate-500 dark:text-slate-400',
  statTrend: 'text-xs mt-1',
  
  // Tabs
  tabBar: 'flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6',
  tab: 'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer',
  tabActive: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm',
  tabInactive: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  
  // Cards
  card: 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden',
  cardHeader: 'px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between',
  cardTitle: 'text-lg font-semibold text-slate-900 dark:text-white',
  cardBody: 'p-6',
  cardFooter: 'px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700',
  
  // Modal
  modalOverlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
  modalContent: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto',
  
  // Alert banner
  alertBanner: 'mb-6 p-4 rounded-xl flex items-center gap-4',
  alertCritical: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
  alertWarning: 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
  alertSuccess: 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800',
  
  // Buttons
  btn: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
  btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
  btnSecondary: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300',
  btnDanger: 'bg-red-600 hover:bg-red-700 text-white',
  
  // Empty state
  empty: 'text-center py-12',
  emptyIcon: 'text-5xl mb-4',
  emptyTitle: 'text-lg font-medium text-slate-900 dark:text-white mb-2',
  emptyText: 'text-slate-500 dark:text-slate-400',
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type TabId = 'overview' | 'checkpoints' | 'tokens' | 'audit' | 'agents'

interface GovernanceDashboardProps {
  identityId: string
  sphereId?: SphereId
  defaultTab?: TabId
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const GovernanceDashboardV55: React.FC<GovernanceDashboardProps> = ({
  identityId,
  sphereId,
  defaultTab = 'overview',
}) => {
  // Hooks
  const governance = useGovernance(identityId)
  const metrics = useGovernanceMetrics(identityId)
  const pendingInfo = usePendingCheckpoints(identityId)
  const tokenBalance = useTokenBalance(identityId, sphereId)
  const tokenBudget = useTokenBudget(identityId, sphereId)
  const agentHook = useAgent(identityId, sphereId)
  
  // Local state
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  
  // Tabs config
  const tabs: { id: TabId; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'checkpoints', label: 'Checkpoints', icon: '🔒', badge: pendingInfo.count },
    { id: 'tokens', label: 'Tokens', icon: '🪙' },
    { id: 'audit', label: 'Audit', icon: '📜' },
    { id: 'agents', label: 'Agents', icon: '🤖', badge: agentHook.activeAgents.length },
  ]
  
  // Alert status
  const alertStatus = useMemo(() => {
    if (pendingInfo.criticalCount > 0) {
      return {
        type: 'critical' as const,
        message: `${pendingInfo.criticalCount} checkpoint(s) critique(s) en attente d'approbation`,
        icon: '🚨',
      }
    }
    if (tokenBalance.isCritical) {
      return {
        type: 'warning' as const,
        message: `Budget tokens critique: ${tokenBalance.percentage}% utilisé`,
        icon: '⚠️',
      }
    }
    if (pendingInfo.count > 5) {
      return {
        type: 'warning' as const,
        message: `${pendingInfo.count} checkpoints en attente de traitement`,
        icon: '📋',
      }
    }
    return null
  }, [pendingInfo, tokenBalance])
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.logo}>🏛️ Gouvernance</h1>
            {sphereId && (
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-300">
                {sphereId}
              </span>
            )}
          </div>
          <div className={styles.headerRight}>
            <TokenBalance showLabel={false} />
            <PendingCheckpointsBadge onClick={() => setActiveTab('checkpoints')} />
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        {/* Alert Banner */}
        {alertStatus && (
          <div className={`${styles.alertBanner} ${
            alertStatus.type === 'critical' ? styles.alertCritical : styles.alertWarning
          }`}>
            <span className="text-2xl">{alertStatus.icon}</span>
            <div className="flex-1">
              <p className={`font-medium ${
                alertStatus.type === 'critical' 
                  ? 'text-red-800 dark:text-red-200' 
                  : 'text-amber-800 dark:text-amber-200'
              }`}>
                {alertStatus.message}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('checkpoints')}
              className={`${styles.btn} ${
                alertStatus.type === 'critical' ? styles.btnDanger : styles.btnPrimary
              }`}
            >
              Voir
            </button>
          </div>
        )}
        
        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statValue}>{metrics.pending_checkpoints}</div>
            <div className={styles.statLabel}>Checkpoints en attente</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statValue}>{metrics.approval_rate}%</div>
            <div className={styles.statLabel}>Taux d'approbation</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🪙</div>
            <div className={styles.statValue}>{tokenBalance.available.toLocaleString()}</div>
            <div className={styles.statLabel}>Tokens disponibles</div>
            {tokenBalance.isLow && (
              <div className={`${styles.statTrend} text-amber-600`}>⚠️ Niveau bas</div>
            )}
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🤖</div>
            <div className={styles.statValue}>{agentHook.activeAgents.length}</div>
            <div className={styles.statLabel}>Agents actifs</div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className={styles.tabBar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : styles.tabInactive}`}
            >
              {tab.icon} {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className={styles.grid2}>
            {/* Recent Checkpoints */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>🔒 Checkpoints récents</h3>
                <button
                  onClick={() => setActiveTab('checkpoints')}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Voir tout
                </button>
              </div>
              <div className={styles.cardBody}>
                {governance.pendingCheckpoints.length > 0 ? (
                  <div className="space-y-3">
                    {governance.pendingCheckpoints.slice(0, 5).map(cp => (
                      <div
                        key={cp.id}
                        onClick={() => setSelectedCheckpoint(cp)}
                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-white text-sm">
                            {cp.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            cp.priority === 'critical' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {cp.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🎉</div>
                    <p className={styles.emptyText}>Aucun checkpoint en attente</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>📜 Activité récente</h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Historique
                </button>
              </div>
              <div className={styles.cardBody}>
                <RecentActivityFeed identityId={identityId} limit={8} />
              </div>
            </div>
            
            {/* Token Summary */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>🪙 Budget Tokens</h3>
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Gérer
                </button>
              </div>
              <div className={styles.cardBody}>
                <TokenBudgetPanel identityId={identityId} sphereId={sphereId} compact />
              </div>
            </div>
            
            {/* Agents Summary */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>🤖 Agents</h3>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Gérer
                </button>
              </div>
              <div className={styles.cardBody}>
                {agentHook.activeAgents.length > 0 ? (
                  <div className="space-y-3">
                    {agentHook.activeAgents.slice(0, 4).map(agent => (
                      <div
                        key={agent.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <span className="text-2xl">{agent.avatar || '🤖'}</span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white text-sm">
                            {agent.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {agentHook.getTasksForAgent(agent.id).filter(t => t.status === 'in_progress').length} tâches en cours
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🤖</div>
                    <p className={styles.emptyText}>Aucun agent actif</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'checkpoints' && (
          <CheckpointList
            identityId={identityId}
            sphereId={sphereId}
            onSelect={setSelectedCheckpoint}
            showBatchActions
          />
        )}
        
        {activeTab === 'tokens' && (
          <TokenBudgetPanel identityId={identityId} sphereId={sphereId} />
        )}
        
        {activeTab === 'audit' && (
          <GovernanceTimeline
            identityId={identityId}
            sphereId={sphereId}
            showFilters
            showExport
          />
        )}
        
        {activeTab === 'agents' && (
          <div className={styles.grid3}>
            {/* Active Agents */}
            <div className={`${styles.card} lg:col-span-2`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>🤖 Agents Embauchés</h3>
              </div>
              <div className={styles.cardBody}>
                {agentHook.activeAgents.length > 0 ? (
                  <div className="space-y-4">
                    {agentHook.activeAgents.map(agent => (
                      <div
                        key={agent.id}
                        className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{agent.avatar || '🤖'}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-slate-900 dark:text-white">
                                {agent.name}
                              </h4>
                              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full text-xs">
                                Actif
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                              {agent.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {agent.capabilities.map(cap => (
                                <span
                                  key={cap}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs text-slate-600 dark:text-slate-300"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🤖</div>
                    <h3 className={styles.emptyTitle}>Aucun agent embauché</h3>
                    <p className={styles.emptyText}>Explorez le pool d'agents disponibles</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pool Stats */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>📊 Pool d'agents</h3>
              </div>
              <div className={styles.cardBody}>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {agentHook.poolStats.total_available}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Agents disponibles
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Par capacité
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(agentHook.poolStats.by_capability)
                        .slice(0, 5)
                        .map(([cap, count]) => (
                          <div key={cap} className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{cap}</span>
                            <span className="font-medium text-slate-900 dark:text-white">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Checkpoint Modal */}
      {selectedCheckpoint && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCheckpoint(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <CheckpointViewer
              checkpointId={selectedCheckpoint.id}
              onClose={() => setSelectedCheckpoint(null)}
              onApproved={() => setSelectedCheckpoint(null)}
              onRejected={() => setSelectedCheckpoint(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default GovernanceDashboardV55
