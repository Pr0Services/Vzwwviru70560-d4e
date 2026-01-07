/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — CHECKPOINT LIST                             ║
 * ║                    Filterable List of Governance Checkpoints                  ║
 * ║                    Task A+7: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * CHECKPOINT LIST FEATURES:
 * - Filter by status, priority, sphere
 * - Batch approval actions
 * - Real-time updates
 * - Pagination
 * - Search
 */

import React, { useState, useMemo, useCallback } from 'react'
import {
  useGovernanceStore,
  type Checkpoint,
  type CheckpointStatus,
  type CheckpointPriority,
} from '../../stores'
import { CheckpointCard } from './CheckpointViewer'

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: 'space-y-4',
  header: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
  title: 'text-xl font-bold text-slate-900 dark:text-white',
  stats: 'flex items-center gap-4',
  statBadge: 'px-3 py-1 rounded-full text-xs font-medium',
  filters: 'flex flex-wrap gap-2',
  filterBtn: 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
  filterActive: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  filterInactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600',
  searchContainer: 'relative',
  searchInput: 'w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500',
  searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
  toolbar: 'flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg',
  toolbarLeft: 'flex items-center gap-3',
  toolbarRight: 'flex items-center gap-2',
  checkbox: 'w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500',
  batchBtn: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  batchApprove: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  batchReject: 'bg-red-600 hover:bg-red-700 text-white',
  list: 'space-y-3',
  listItem: 'relative',
  listCheckbox: 'absolute left-4 top-1/2 -translate-y-1/2 z-10',
  listContent: 'pl-10',
  pagination: 'flex items-center justify-center gap-2 mt-6',
  pageBtn: 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
  pageActive: 'bg-amber-600 text-white',
  pageInactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600',
  empty: 'text-center py-12',
  emptyIcon: 'text-5xl mb-4',
  emptyTitle: 'text-lg font-medium text-slate-900 dark:text-white mb-2',
  emptyText: 'text-slate-500 dark:text-slate-400',
  tabBar: 'flex border-b border-slate-200 dark:border-slate-700 mb-4',
  tab: 'px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer',
  tabActive: 'border-amber-500 text-amber-600 dark:text-amber-400',
  tabInactive: 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
  tabCount: 'ml-2 px-2 py-0.5 rounded-full text-xs',
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type TabType = 'pending' | 'all' | 'approved' | 'rejected'

interface CheckpointListProps {
  identityId?: string
  sphereId?: string
  onSelect?: (checkpoint: Checkpoint) => void
  showBatchActions?: boolean
  pageSize?: number
  defaultTab?: TabType
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PRIORITY_ORDER: Record<CheckpointPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const STATUS_TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'pending', label: 'En attente', icon: '⏳' },
  { id: 'all', label: 'Tous', icon: '📋' },
  { id: 'approved', label: 'Approuvés', icon: '✅' },
  { id: 'rejected', label: 'Rejetés', icon: '❌' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CheckpointList: React.FC<CheckpointListProps> = ({
  identityId,
  sphereId,
  onSelect,
  showBatchActions = true,
  pageSize = 10,
  defaultTab = 'pending',
}) => {
  // Store
  const checkpoints = useGovernanceStore(state => Object.values(state.checkpoints))
  const approveCheckpoint = useGovernanceStore(state => state.approveCheckpoint)
  const rejectCheckpoint = useGovernanceStore(state => state.rejectCheckpoint)
  
  // Local state
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<CheckpointPriority | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filter checkpoints
  const filteredCheckpoints = useMemo(() => {
    let result = [...checkpoints]
    
    // Filter by identity
    if (identityId) {
      result = result.filter(c => c.identity_id === identityId)
    }
    
    // Filter by sphere
    if (sphereId) {
      result = result.filter(c => c.sphere_id === sphereId)
    }
    
    // Filter by tab (status)
    switch (activeTab) {
      case 'pending':
        result = result.filter(c => c.status === 'pending')
        break
      case 'approved':
        result = result.filter(c => c.status === 'approved' || c.status === 'auto_approved')
        break
      case 'rejected':
        result = result.filter(c => c.status === 'rejected')
        break
      // 'all' shows everything
    }
    
    // Filter by priority
    if (priorityFilter) {
      result = result.filter(c => c.priority === priorityFilter)
    }
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.action_type.toLowerCase().includes(q)
      )
    }
    
    // Sort: pending first, then by priority, then by date
    result.sort((a, b) => {
      // Pending first
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      
      // Then by priority
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by date (newest first)
      return b.created_at.localeCompare(a.created_at)
    })
    
    return result
  }, [checkpoints, identityId, sphereId, activeTab, priorityFilter, searchQuery])
  
  // Pagination
  const totalPages = Math.ceil(filteredCheckpoints.length / pageSize)
  const paginatedCheckpoints = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCheckpoints.slice(start, start + pageSize)
  }, [filteredCheckpoints, currentPage, pageSize])
  
  // Stats
  const stats = useMemo(() => ({
    pending: checkpoints.filter(c => c.status === 'pending').length,
    critical: checkpoints.filter(c => c.status === 'pending' && c.priority === 'critical').length,
    total: checkpoints.length,
  }), [checkpoints])
  
  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const pendingIds = paginatedCheckpoints
        .filter(c => c.status === 'pending')
        .map(c => c.id)
      setSelectedIds(new Set(pendingIds))
    } else {
      setSelectedIds(new Set())
    }
  }, [paginatedCheckpoints])
  
  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])
  
  // Batch actions
  const handleBatchApprove = useCallback(() => {
    selectedIds.forEach(id => {
      approveCheckpoint(id, 'current_user')
    })
    setSelectedIds(new Set())
  }, [selectedIds, approveCheckpoint])
  
  const handleBatchReject = useCallback(() => {
    selectedIds.forEach(id => {
      rejectCheckpoint(id, 'current_user', 'Batch rejection')
    })
    setSelectedIds(new Set())
  }, [selectedIds, rejectCheckpoint])
  
  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, priorityFilter, searchQuery])
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Checkpoints de Gouvernance</h2>
          <div className={styles.stats}>
            {stats.pending > 0 && (
              <span className={`${styles.statBadge} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400`}>
                ⏳ {stats.pending} en attente
              </span>
            )}
            {stats.critical > 0 && (
              <span className={`${styles.statBadge} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
                🔴 {stats.critical} critiques
              </span>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className={styles.searchInput}
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className={styles.tabBar}>
        {STATUS_TABS.map(tab => {
          const count = tab.id === 'pending' 
            ? stats.pending 
            : tab.id === 'all' 
              ? stats.total 
              : checkpoints.filter(c => 
                  tab.id === 'approved' 
                    ? (c.status === 'approved' || c.status === 'auto_approved')
                    : c.status === tab.id
                ).length
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : styles.tabInactive}`}
            >
              {tab.icon} {tab.label}
              <span className={`${styles.tabCount} ${
                activeTab === tab.id 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Priority Filters */}
      <div className={styles.filters}>
        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Priorité:</span>
        {(['critical', 'high', 'medium', 'low'] as CheckpointPriority[]).map(priority => (
          <button
            key={priority}
            onClick={() => setPriorityFilter(prev => prev === priority ? null : priority)}
            className={`${styles.filterBtn} ${
              priorityFilter === priority ? styles.filterActive : styles.filterInactive
            }`}
          >
            {priority === 'critical' && '🔴'}
            {priority === 'high' && '🟠'}
            {priority === 'medium' && '🟡'}
            {priority === 'low' && '🟢'}
            {' '}{priority}
          </button>
        ))}
      </div>
      
      {/* Batch Actions Toolbar */}
      {showBatchActions && activeTab === 'pending' && paginatedCheckpoints.some(c => c.status === 'pending') && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <input
              type="checkbox"
              checked={selectedIds.size > 0 && selectedIds.size === paginatedCheckpoints.filter(c => c.status === 'pending').length}
              onChange={e => handleSelectAll(e.target.checked)}
              className={styles.checkbox}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedIds.size > 0 
                ? `${selectedIds.size} sélectionné(s)` 
                : 'Sélectionner tout'}
            </span>
          </div>
          
          {selectedIds.size > 0 && (
            <div className={styles.toolbarRight}>
              <button
                onClick={handleBatchApprove}
                className={`${styles.batchBtn} ${styles.batchApprove}`}
              >
                ✅ Approuver ({selectedIds.size})
              </button>
              <button
                onClick={handleBatchReject}
                className={`${styles.batchBtn} ${styles.batchReject}`}
              >
                ❌ Rejeter ({selectedIds.size})
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* List */}
      {paginatedCheckpoints.length > 0 ? (
        <div className={styles.list}>
          {paginatedCheckpoints.map(checkpoint => (
            <div key={checkpoint.id} className={styles.listItem}>
              {showBatchActions && checkpoint.status === 'pending' && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(checkpoint.id)}
                  onChange={e => handleSelectOne(checkpoint.id, e.target.checked)}
                  className={`${styles.checkbox} ${styles.listCheckbox}`}
                />
              )}
              <div className={showBatchActions && checkpoint.status === 'pending' ? styles.listContent : ''}>
                <CheckpointCard
                  checkpoint={checkpoint}
                  onClick={() => onSelect?.(checkpoint)}
                  showQuickActions={!showBatchActions}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            {activeTab === 'pending' ? '🎉' : '📭'}
          </div>
          <h3 className={styles.emptyTitle}>
            {activeTab === 'pending' 
              ? 'Aucun checkpoint en attente' 
              : 'Aucun checkpoint trouvé'}
          </h3>
          <p className={styles.emptyText}>
            {activeTab === 'pending'
              ? 'Tous les checkpoints ont été traités!'
              : 'Essayez de modifier vos filtres de recherche.'}
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`${styles.pageBtn} ${styles.pageInactive} disabled:opacity-50`}
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.pageBtn} ${
                currentPage === page ? styles.pageActive : styles.pageInactive
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`${styles.pageBtn} ${styles.pageInactive} disabled:opacity-50`}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PENDING CHECKPOINTS BADGE
// ═══════════════════════════════════════════════════════════════════════════════

export const PendingCheckpointsBadge: React.FC<{
  onClick?: () => void
}> = ({ onClick }) => {
  const pendingCount = useGovernanceStore(state => 
    Object.values(state.checkpoints).filter(c => c.status === 'pending').length
  )
  
  const criticalCount = useGovernanceStore(state => 
    Object.values(state.checkpoints).filter(c => c.status === 'pending' && c.priority === 'critical').length
  )
  
  if (pendingCount === 0) return null
  
  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-2 px-4 py-2 rounded-lg
        ${criticalCount > 0 
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}
        hover:opacity-80 transition-opacity
      `}
    >
      <span className="text-lg">{criticalCount > 0 ? '🔴' : '⏳'}</span>
      <span className="font-medium">{pendingCount}</span>
      <span className="text-sm">checkpoint{pendingCount > 1 ? 's' : ''}</span>
      
      {criticalCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          {criticalCount}
        </span>
      )}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default CheckpointList
