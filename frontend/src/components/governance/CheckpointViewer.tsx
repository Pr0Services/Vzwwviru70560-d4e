/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — CHECKPOINT VIEWER                           ║
 * ║                    Detailed Checkpoint Display with Actions                   ║
 * ║                    Task A+6: Alpha+ Roadmap                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * CHECKPOINT VIEWER:
 * - Full checkpoint details
 * - Approve/Reject actions
 * - Context display (agent, thread, sphere)
 * - Audit trail integration
 * - Governance compliance
 */

import React, { useState, useCallback, useMemo } from 'react'
import {
  useGovernanceStore,
  type Checkpoint,
  type CheckpointStatus,
} from '../../stores'

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES (Tailwind-compatible classes)
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: 'bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden',
  header: 'px-6 py-4 border-b border-slate-200 dark:border-slate-700',
  headerTop: 'flex items-center justify-between mb-2',
  title: 'text-lg font-semibold text-slate-900 dark:text-white',
  badge: 'px-3 py-1 rounded-full text-xs font-medium',
  description: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
  body: 'p-6',
  section: 'mb-6 last:mb-0',
  sectionTitle: 'text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3',
  grid: 'grid grid-cols-2 gap-4',
  field: 'space-y-1',
  fieldLabel: 'text-xs text-slate-500 dark:text-slate-400',
  fieldValue: 'text-sm font-medium text-slate-900 dark:text-white',
  contextCard: 'bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4',
  contextIcon: 'w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-2',
  contextTitle: 'text-sm font-medium text-slate-900 dark:text-white',
  contextSub: 'text-xs text-slate-500 dark:text-slate-400',
  actions: 'flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700',
  btnApprove: 'flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2',
  btnReject: 'flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2',
  btnSecondary: 'px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors',
  textarea: 'w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none',
  modalOverlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
  modalContent: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6',
  modalTitle: 'text-lg font-semibold text-slate-900 dark:text-white mb-4',
  modalActions: 'flex gap-3 mt-6',
  timeline: 'space-y-3',
  timelineItem: 'flex gap-3',
  timelineDot: 'w-2 h-2 rounded-full mt-2 flex-shrink-0',
  timelineContent: 'flex-1 pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0',
  timelineAction: 'text-sm font-medium text-slate-900 dark:text-white',
  timelineTime: 'text-xs text-slate-500 dark:text-slate-400',
  empty: 'text-center py-12 text-slate-500 dark:text-slate-400',
  emptyIcon: 'text-4xl mb-3',
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const getStatusConfig = (status: CheckpointStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'En attente', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' }
    case 'approved':
      return { label: 'Approuvé', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' }
    case 'rejected':
      return { label: 'Rejeté', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' }
    case 'expired':
      return { label: 'Expiré', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400', dot: 'bg-slate-500' }
    case 'auto_approved':
      return { label: 'Auto-approuvé', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' }
    default:
      return { label: status, color: 'bg-slate-100 text-slate-800', dot: 'bg-slate-500' }
  }
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { label: '🔴 Critique', color: 'text-red-600 dark:text-red-400' }
    case 'high':
      return { label: '🟠 Haute', color: 'text-orange-600 dark:text-orange-400' }
    case 'medium':
      return { label: '🟡 Moyenne', color: 'text-amber-600 dark:text-amber-400' }
    case 'low':
      return { label: '🟢 Basse', color: 'text-emerald-600 dark:text-emerald-400' }
    default:
      return { label: priority, color: 'text-slate-600' }
  }
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'agent_action': return '🤖'
    case 'data_access': return '📊'
    case 'external_call': return '🌐'
    case 'budget_change': return '💰'
    case 'settings_change': return '⚙️'
    case 'user_data_modification': return '👤'
    default: return '📋'
  }
}

const formatDate = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeTime = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes}min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${days}j`
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════════════════════════════════════════

interface CheckpointViewerProps {
  checkpointId: string
  onClose?: () => void
  onApproved?: (checkpoint: Checkpoint) => void
  onRejected?: (checkpoint: Checkpoint) => void
  showActions?: boolean
  compact?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CheckpointViewer: React.FC<CheckpointViewerProps> = ({
  checkpointId,
  onClose,
  onApproved,
  onRejected,
  showActions = true,
  compact = false,
}) => {
  // Store
  const checkpoint = useGovernanceStore(state => state.checkpoints[checkpointId])
  const approveCheckpoint = useGovernanceStore(state => state.approveCheckpoint)
  const rejectCheckpoint = useGovernanceStore(state => state.rejectCheckpoint)
  
  // Local state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Computed
  const statusConfig = useMemo(() => 
    checkpoint ? getStatusConfig(checkpoint.status) : null, 
    [checkpoint?.status]
  )
  
  const priorityConfig = useMemo(() => 
    checkpoint ? getPriorityConfig(checkpoint.priority) : null, 
    [checkpoint?.priority]
  )
  
  const canAct = checkpoint?.status === 'pending'
  
  // Handlers
  const handleApprove = useCallback(async () => {
    if (!checkpoint || !canAct) return
    
    setIsProcessing(true)
    try {
      approveCheckpoint(checkpoint.id, 'current_user') // TODO: Get real user ID
      onApproved?.(checkpoint)
    } finally {
      setIsProcessing(false)
    }
  }, [checkpoint, canAct, approveCheckpoint, onApproved])
  
  const handleReject = useCallback(async () => {
    if (!checkpoint || !canAct || !rejectReason.trim()) return
    
    setIsProcessing(true)
    try {
      rejectCheckpoint(checkpoint.id, 'current_user', rejectReason.trim())
      setShowRejectModal(false)
      setRejectReason('')
      onRejected?.(checkpoint)
    } finally {
      setIsProcessing(false)
    }
  }, [checkpoint, canAct, rejectReason, rejectCheckpoint, onRejected])
  
  // Empty state
  if (!checkpoint) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>Checkpoint non trouvé</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getActionIcon(checkpoint.action_type)}</span>
              <div>
                <h2 className={styles.title}>{checkpoint.title}</h2>
                <p className={styles.description}>{checkpoint.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusConfig && (
                <span className={`${styles.badge} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className={styles.body}>
          {/* Details Grid */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Détails</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Type d'action</span>
                <span className={styles.fieldValue}>
                  {checkpoint.action_type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Priorité</span>
                <span className={`${styles.fieldValue} ${priorityConfig?.color}`}>
                  {priorityConfig?.label}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Créé le</span>
                <span className={styles.fieldValue}>
                  {formatDate(checkpoint.created_at)}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Expire le</span>
                <span className={styles.fieldValue}>
                  {checkpoint.expires_at ? formatDate(checkpoint.expires_at) : 'Jamais'}
                </span>
              </div>
              {checkpoint.tokens_required > 0 && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Tokens requis</span>
                  <span className={styles.fieldValue}>
                    🪙 {checkpoint.tokens_required.toLocaleString()}
                  </span>
                </div>
              )}
              {checkpoint.estimated_impact && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Impact estimé</span>
                  <span className={styles.fieldValue}>
                    {checkpoint.estimated_impact}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Context Cards */}
          {!compact && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Contexte</h3>
              <div className="grid grid-cols-3 gap-4">
                {/* Agent */}
                <div className={styles.contextCard}>
                  <div className={`${styles.contextIcon} bg-purple-100 dark:bg-purple-900/30`}>
                    🤖
                  </div>
                  <div className={styles.contextTitle}>
                    {checkpoint.agent_id || 'N/A'}
                  </div>
                  <div className={styles.contextSub}>Agent</div>
                </div>
                
                {/* Sphere */}
                <div className={styles.contextCard}>
                  <div className={`${styles.contextIcon} bg-emerald-100 dark:bg-emerald-900/30`}>
                    🌐
                  </div>
                  <div className={styles.contextTitle}>
                    {checkpoint.sphere_id || 'Global'}
                  </div>
                  <div className={styles.contextSub}>Sphère</div>
                </div>
                
                {/* Thread */}
                <div className={styles.contextCard}>
                  <div className={`${styles.contextIcon} bg-blue-100 dark:bg-blue-900/30`}>
                    💬
                  </div>
                  <div className={styles.contextTitle}>
                    {checkpoint.thread_id ? 'Actif' : 'Aucun'}
                  </div>
                  <div className={styles.contextSub}>Thread</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Payload Preview */}
          {checkpoint.payload && Object.keys(checkpoint.payload).length > 0 && !compact && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Données de la requête</h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-slate-700 dark:text-slate-300">
                  {JSON.stringify(checkpoint.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {/* Resolution Info */}
          {checkpoint.status !== 'pending' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Résolution</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${statusConfig?.dot}`} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineAction}>
                      {checkpoint.status === 'approved' && '✅ Approuvé'}
                      {checkpoint.status === 'rejected' && '❌ Rejeté'}
                      {checkpoint.status === 'expired' && '⏰ Expiré'}
                      {checkpoint.status === 'auto_approved' && '🤖 Auto-approuvé'}
                      {checkpoint.resolved_by && ` par ${checkpoint.resolved_by}`}
                    </div>
                    {checkpoint.resolved_at && (
                      <div className={styles.timelineTime}>
                        {formatDate(checkpoint.resolved_at)}
                      </div>
                    )}
                    {checkpoint.rejection_reason && (
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        "{checkpoint.rejection_reason}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          {showActions && canAct && (
            <div className={styles.actions}>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={styles.btnApprove}
              >
                {isProcessing ? '⏳' : '✅'} Approuver
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className={styles.btnReject}
              >
                {isProcessing ? '⏳' : '❌'} Rejeter
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Rejeter le checkpoint</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Veuillez indiquer la raison du rejet. Cette information sera enregistrée 
              dans l'audit trail.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Raison du rejet..."
              rows={4}
              className={styles.textarea}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowRejectModal(false)}
                className={`flex-1 ${styles.btnSecondary}`}
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
                className={`flex-1 ${styles.btnReject} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? '⏳' : '❌'} Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT VARIANT
// ═══════════════════════════════════════════════════════════════════════════════

export const CheckpointCard: React.FC<{
  checkpoint: Checkpoint
  onClick?: () => void
  showQuickActions?: boolean
}> = ({ checkpoint, onClick, showQuickActions = false }) => {
  const statusConfig = getStatusConfig(checkpoint.status)
  const approveCheckpoint = useGovernanceStore(state => state.approveCheckpoint)
  
  const handleQuickApprove = (e: React.MouseEvent) => {
    e.stopPropagation()
    approveCheckpoint(checkpoint.id, 'current_user')
  }
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700
        p-4 cursor-pointer hover:shadow-md transition-shadow
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">{getActionIcon(checkpoint.action_type)}</span>
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
              {checkpoint.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {checkpoint.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`${styles.badge} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-slate-400">
                {formatRelativeTime(checkpoint.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        {showQuickActions && checkpoint.status === 'pending' && (
          <button
            onClick={handleQuickApprove}
            className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors text-emerald-600"
            title="Approuver rapidement"
          >
            ✅
          </button>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default CheckpointViewer
