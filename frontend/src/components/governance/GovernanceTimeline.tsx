/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — GOVERNANCE TIMELINE                         ║
 * ║                    Auditable Actions Timeline Display                         ║
 * ║                    Task A+9: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * GOVERNANCE TIMELINE FEATURES:
 * - Chronological audit trail
 * - Filterable by action type, actor, severity
 * - Real-time updates
 * - Detailed event inspection
 * - Export capabilities
 */

import React, { useState, useMemo, useCallback } from 'react'
import {
  useGovernanceStore,
  type AuditEntry,
  type AuditAction,
  type AuditSeverity,
} from '../../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: 'space-y-4',
  header: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
  title: 'text-xl font-bold text-slate-900 dark:text-white',
  
  // Filters
  filters: 'flex flex-wrap items-center gap-2',
  filterGroup: 'flex items-center gap-1',
  filterLabel: 'text-xs text-slate-500 dark:text-slate-400 mr-1',
  filterBtn: 'px-2 py-1 rounded text-xs font-medium transition-colors',
  filterActive: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  filterInactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600',
  
  // Search
  searchInput: 'w-full sm:w-48 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500',
  
  // Timeline
  timeline: 'relative',
  timelineLine: 'absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700',
  timelineItem: 'relative pl-14 pb-6 last:pb-0',
  timelineDot: 'absolute left-4 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs',
  timelineCard: 'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow cursor-pointer',
  timelineCardExpanded: 'ring-2 ring-amber-500',
  
  // Event header
  eventHeader: 'flex items-start justify-between gap-2 mb-2',
  eventTitle: 'font-medium text-slate-900 dark:text-white',
  eventTime: 'text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap',
  eventMeta: 'flex flex-wrap items-center gap-2 text-xs',
  eventBadge: 'px-2 py-0.5 rounded-full',
  
  // Event details
  eventDetails: 'mt-4 pt-4 border-t border-slate-100 dark:border-slate-700',
  detailsGrid: 'grid grid-cols-2 gap-4',
  detailField: 'space-y-1',
  detailLabel: 'text-xs text-slate-500 dark:text-slate-400',
  detailValue: 'text-sm text-slate-900 dark:text-white font-mono',
  
  // Payload
  payloadContainer: 'mt-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 overflow-x-auto',
  payloadPre: 'text-xs font-mono text-slate-700 dark:text-slate-300',
  
  // Actions
  actions: 'flex gap-2 mt-4',
  btn: 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
  btnSecondary: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300',
  
  // Empty
  empty: 'text-center py-12',
  emptyIcon: 'text-5xl mb-4',
  emptyTitle: 'text-lg font-medium text-slate-900 dark:text-white mb-2',
  emptyText: 'text-slate-500 dark:text-slate-400',
  
  // Pagination
  pagination: 'flex items-center justify-center gap-2 mt-6',
  pageBtn: 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
  pageActive: 'bg-amber-600 text-white',
  pageInactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600',
  
  // Date separator
  dateSeparator: 'relative pl-14 py-4',
  dateSeparatorLine: 'absolute left-0 right-0 top-1/2 h-px bg-slate-200 dark:bg-slate-700',
  dateSeparatorText: 'relative inline-block bg-slate-50 dark:bg-slate-900 px-4 text-sm font-medium text-slate-500 dark:text-slate-400',
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const getActionConfig = (action: AuditAction): { icon: string; label: string; color: string } => {
  const configs: Record<AuditAction, { icon: string; label: string; color: string }> = {
    checkpoint_created: { icon: '🆕', label: 'Checkpoint créé', color: 'bg-blue-500' },
    checkpoint_approved: { icon: '✅', label: 'Checkpoint approuvé', color: 'bg-emerald-500' },
    checkpoint_rejected: { icon: '❌', label: 'Checkpoint rejeté', color: 'bg-red-500' },
    checkpoint_expired: { icon: '⏰', label: 'Checkpoint expiré', color: 'bg-slate-500' },
    agent_hired: { icon: '🤝', label: 'Agent embauché', color: 'bg-purple-500' },
    agent_fired: { icon: '👋', label: 'Agent licencié', color: 'bg-orange-500' },
    agent_task_assigned: { icon: '📋', label: 'Tâche assignée', color: 'bg-blue-500' },
    agent_task_completed: { icon: '✔️', label: 'Tâche complétée', color: 'bg-emerald-500' },
    tokens_allocated: { icon: '📥', label: 'Tokens alloués', color: 'bg-emerald-500' },
    tokens_consumed: { icon: '📤', label: 'Tokens consommés', color: 'bg-amber-500' },
    tokens_transferred: { icon: '↔️', label: 'Tokens transférés', color: 'bg-blue-500' },
    data_accessed: { icon: '👁️', label: 'Données accédées', color: 'bg-slate-500' },
    data_modified: { icon: '✏️', label: 'Données modifiées', color: 'bg-amber-500' },
    data_deleted: { icon: '🗑️', label: 'Données supprimées', color: 'bg-red-500' },
    settings_changed: { icon: '⚙️', label: 'Paramètres modifiés', color: 'bg-slate-500' },
    rule_violation: { icon: '⚠️', label: 'Violation de règle', color: 'bg-red-500' },
    external_call: { icon: '🌐', label: 'Appel externe', color: 'bg-blue-500' },
    session_start: { icon: '▶️', label: 'Session démarrée', color: 'bg-emerald-500' },
    session_end: { icon: '⏹️', label: 'Session terminée', color: 'bg-slate-500' },
  }
  return configs[action] || { icon: '📋', label: action, color: 'bg-slate-500' }
}

const getSeverityConfig = (severity: AuditSeverity): { label: string; color: string } => {
  const configs: Record<AuditSeverity, { label: string; color: string }> = {
    info: { label: 'Info', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' },
    low: { label: 'Faible', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    medium: { label: 'Moyen', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    high: { label: 'Élevé', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    critical: { label: 'Critique', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  }
  return configs[severity]
}

const formatTime = (iso: string): string => {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const formatDate = (iso: string): string => {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Aujourd\'hui'
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier'
  }
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

const groupByDate = (entries: AuditEntry[]): Map<string, AuditEntry[]> => {
  const groups = new Map<string, AuditEntry[]>()
  
  entries.forEach(entry => {
    const dateKey = new Date(entry.timestamp).toDateString()
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(entry)
  })
  
  return groups
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════════════════════════════

interface GovernanceTimelineProps {
  identityId?: string
  sphereId?: string
  agentId?: string
  limit?: number
  showFilters?: boolean
  showExport?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const GovernanceTimeline: React.FC<GovernanceTimelineProps> = ({
  identityId,
  sphereId,
  agentId,
  limit = 50,
  showFilters = true,
  showExport = true,
}) => {
  // Store
  const auditEntries = useGovernanceStore(state => {
    let entries = state.getAuditTrail({ identity_id: identityId })
    
    if (sphereId) {
      entries = entries.filter(e => e.sphere_id === sphereId)
    }
    if (agentId) {
      entries = entries.filter(e => e.agent_id === agentId)
    }
    
    return entries.slice(0, limit)
  })
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | null>(null)
  const [actionFilter, setActionFilter] = useState<AuditAction | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  
  // Filter entries
  const filteredEntries = useMemo(() => {
    let result = [...auditEntries]
    
    if (severityFilter) {
      result = result.filter(e => e.severity === severityFilter)
    }
    
    if (actionFilter) {
      result = result.filter(e => e.action === actionFilter)
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.action.toLowerCase().includes(q) ||
        e.actor_id.toLowerCase().includes(q) ||
        JSON.stringify(e.details).toLowerCase().includes(q)
      )
    }
    
    return result
  }, [auditEntries, severityFilter, actionFilter, searchQuery])
  
  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / pageSize)
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEntries.slice(start, start + pageSize)
  }, [filteredEntries, currentPage])
  
  // Group by date
  const groupedEntries = useMemo(() => {
    return groupByDate(paginatedEntries)
  }, [paginatedEntries])
  
  // Available actions (for filter)
  const availableActions = useMemo(() => {
    const actions = new Set(auditEntries.map(e => e.action))
    return Array.from(actions)
  }, [auditEntries])
  
  // Export
  const handleExport = useCallback(() => {
    const data = JSON.stringify(filteredEntries, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredEntries])
  
  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [severityFilter, actionFilter, searchQuery])
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>📜 Audit Trail</h2>
        
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className={styles.searchInput}
          />
          
          {showExport && filteredEntries.length > 0 && (
            <button onClick={handleExport} className={`${styles.btn} ${styles.btnSecondary}`}>
              📥 Exporter
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className={styles.filters}>
          {/* Severity filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sévérité:</span>
            {(['info', 'low', 'medium', 'high', 'critical'] as AuditSeverity[]).map(sev => {
              const config = getSeverityConfig(sev)
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(s => s === sev ? null : sev)}
                  className={`${styles.filterBtn} ${
                    severityFilter === sev ? styles.filterActive : styles.filterInactive
                  }`}
                >
                  {config.label}
                </button>
              )
            })}
          </div>
          
          {/* Action filter dropdown */}
          {availableActions.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Action:</span>
              <select
                value={actionFilter || ''}
                onChange={e => setActionFilter(e.target.value as AuditAction || null)}
                className={`${styles.searchInput} w-auto`}
              >
                <option value="">Toutes</option>
                {availableActions.map(action => {
                  const config = getActionConfig(action)
                  return (
                    <option key={action} value={action}>{config.label}</option>
                  )
                })}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Timeline */}
      {groupedEntries.size > 0 ? (
        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          
          {Array.from(groupedEntries.entries()).map(([dateKey, entries]) => (
            <React.Fragment key={dateKey}>
              {/* Date separator */}
              <div className={styles.dateSeparator}>
                <div className={styles.dateSeparatorLine} />
                <span className={styles.dateSeparatorText}>
                  {formatDate(entries[0].timestamp)}
                </span>
              </div>
              
              {/* Entries */}
              {entries.map(entry => {
                const actionConfig = getActionConfig(entry.action)
                const severityConfig = getSeverityConfig(entry.severity)
                const isExpanded = expandedId === entry.id
                
                return (
                  <div key={entry.id} className={styles.timelineItem}>
                    {/* Dot */}
                    <div className={`${styles.timelineDot} ${actionConfig.color}`}>
                      {actionConfig.icon}
                    </div>
                    
                    {/* Card */}
                    <div
                      className={`${styles.timelineCard} ${isExpanded ? styles.timelineCardExpanded : ''}`}
                      onClick={() => setExpandedId(id => id === entry.id ? null : entry.id)}
                    >
                      {/* Header */}
                      <div className={styles.eventHeader}>
                        <div>
                          <div className={styles.eventTitle}>{actionConfig.label}</div>
                          <div className={styles.eventMeta}>
                            <span className={`${styles.eventBadge} ${severityConfig.color}`}>
                              {severityConfig.label}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              par {entry.actor_type === 'system' ? '🤖 Système' : entry.actor_id}
                            </span>
                            {entry.sphere_id && (
                              <span className="text-slate-500 dark:text-slate-400">
                                • 🌐 {entry.sphere_id}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={styles.eventTime}>
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                      
                      {/* Expanded details */}
                      {isExpanded && (
                        <div className={styles.eventDetails}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailField}>
                              <span className={styles.detailLabel}>ID</span>
                              <span className={styles.detailValue}>{entry.id}</span>
                            </div>
                            <div className={styles.detailField}>
                              <span className={styles.detailLabel}>Identity</span>
                              <span className={styles.detailValue}>{entry.identity_id}</span>
                            </div>
                            {entry.agent_id && (
                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>Agent</span>
                                <span className={styles.detailValue}>{entry.agent_id}</span>
                              </div>
                            )}
                            {entry.thread_id && (
                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>Thread</span>
                                <span className={styles.detailValue}>{entry.thread_id}</span>
                              </div>
                            )}
                            {entry.checkpoint_id && (
                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>Checkpoint</span>
                                <span className={styles.detailValue}>{entry.checkpoint_id}</span>
                              </div>
                            )}
                            {entry.tokens_consumed !== undefined && entry.tokens_consumed > 0 && (
                              <div className={styles.detailField}>
                                <span className={styles.detailLabel}>Tokens</span>
                                <span className={styles.detailValue}>🪙 {entry.tokens_consumed}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Details payload */}
                          {Object.keys(entry.details).length > 0 && (
                            <div className={styles.payloadContainer}>
                              <pre className={styles.payloadPre}>
                                {JSON.stringify(entry.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📜</div>
          <h3 className={styles.emptyTitle}>Aucun événement</h3>
          <p className={styles.emptyText}>
            {searchQuery || severityFilter || actionFilter
              ? 'Aucun résultat pour ces filtres'
              : 'L\'historique d\'audit est vide'}
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
          
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} / {totalPages}
          </span>
          
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
// MINI TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════

export const RecentActivityFeed: React.FC<{
  identityId?: string
  limit?: number
}> = ({ identityId, limit = 5 }) => {
  const entries = useGovernanceStore(state => 
    state.getAuditTrail({ identity_id: identityId }).slice(0, limit)
  )
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
        Aucune activité récente
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      {entries.map(entry => {
        const config = getActionConfig(entry.action)
        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <span className={`w-6 h-6 rounded flex items-center justify-center text-sm ${config.color}`}>
              {config.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-900 dark:text-white truncate">
                {config.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {formatTime(entry.timestamp)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default GovernanceTimeline
