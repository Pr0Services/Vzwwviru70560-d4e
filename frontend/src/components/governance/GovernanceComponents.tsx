/**
 * CHE·NU™ — Governance Components
 * Checkpoints, Approvals, Elevations, and Human Gates
 */

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle,
  CheckCircle, XCircle, Clock, ChevronRight, ArrowUp,
  Lock, Unlock, Eye, FileText, User, Bot, Zap, History,
  AlertCircle, Info, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Badge, Avatar, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Progress } from '@/components/ui'

// ============================================================================
// TYPES
// ============================================================================

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal'
export type CheckpointStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type ElevationType = 'scope' | 'budget' | 'access' | 'action'

export interface Checkpoint {
  id: string
  title: string
  description: string
  riskLevel: RiskLevel
  status: CheckpointStatus
  createdAt: string
  expiresAt?: string
  agentId?: string
  agentName?: string
  sphereId: string
  details?: Record<string, any>
  requiresReason?: boolean
}

export interface ElevationRequest {
  id: string
  type: ElevationType
  agentId: string
  agentName: string
  currentLevel: string
  requestedLevel: string
  justification: string
  riskLevel: RiskLevel
  status: CheckpointStatus
  createdAt: string
  expiresAt?: string
}

// ============================================================================
// RISK LEVEL BADGE
// ============================================================================

export interface RiskLevelBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const riskConfig: Record<RiskLevel, { color: string; icon: ReactNode; label: string }> = {
  critical: { color: 'danger', label: 'Critical', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  high: { color: 'warning', label: 'High', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  medium: { color: 'secondary', label: 'Medium', icon: <ShieldQuestion className="w-3.5 h-3.5" /> },
  low: { color: 'primary', label: 'Low', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  minimal: { color: 'success', label: 'Minimal', icon: <CheckCircle className="w-3.5 h-3.5" /> },
}

export function RiskLevelBadge({ level, size = 'md', showIcon = true }: RiskLevelBadgeProps) {
  const config = riskConfig[level]

  return (
    <Badge variant={config.color as any} size={size}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}

// ============================================================================
// CHECKPOINT CARD
// ============================================================================

export interface CheckpointCardProps extends HTMLAttributes<HTMLDivElement> {
  checkpoint: Checkpoint
  onApprove?: (reason?: string) => void
  onReject?: (reason?: string) => void
  onView?: () => void
  compact?: boolean
}

export const CheckpointCard = forwardRef<HTMLDivElement, CheckpointCardProps>(
  ({ className, checkpoint, onApprove, onReject, onView, compact, ...props }, ref) => {
    const [showDetails, setShowDetails] = useState(false)
    const [reason, setReason] = useState('')
    const isUrgent = checkpoint.riskLevel === 'critical' || checkpoint.riskLevel === 'high'
    const timeLeft = checkpoint.expiresAt
      ? Math.max(0, new Date(checkpoint.expiresAt).getTime() - Date.now())
      : null

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl',
            'bg-white dark:bg-gray-900 border',
            isUrgent ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-800',
            className
          )}
          {...props}
        >
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            checkpoint.riskLevel === 'critical' && 'bg-red-100 dark:bg-red-900/30 text-red-600',
            checkpoint.riskLevel === 'high' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
            checkpoint.riskLevel === 'medium' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
            checkpoint.riskLevel === 'low' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
            checkpoint.riskLevel === 'minimal' && 'bg-green-100 dark:bg-green-900/30 text-green-600',
          )}>
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {checkpoint.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {checkpoint.agentName && `${checkpoint.agentName} · `}
              {new Date(checkpoint.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <RiskLevelBadge level={checkpoint.riskLevel} size="sm" showIcon={false} />
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        layout
        className={cn(
          'rounded-2xl overflow-hidden',
          'bg-white dark:bg-gray-900 border',
          isUrgent
            ? 'border-red-300 dark:border-red-700 shadow-lg shadow-red-500/10'
            : 'border-gray-200 dark:border-gray-800',
          className
        )}
        {...props}
      >
        {/* Urgent Banner */}
        {isUrgent && (
          <div className="px-4 py-2 bg-red-500 text-white text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {checkpoint.riskLevel === 'critical' ? 'Critical Review Required' : 'High Priority'}
            {timeLeft && (
              <span className="ml-auto text-red-100">
                Expires in {Math.floor(timeLeft / 60000)}m
              </span>
            )}
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              checkpoint.riskLevel === 'critical' && 'bg-red-100 dark:bg-red-900/30 text-red-600',
              checkpoint.riskLevel === 'high' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
              checkpoint.riskLevel === 'medium' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600',
              checkpoint.riskLevel === 'low' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
              checkpoint.riskLevel === 'minimal' && 'bg-green-100 dark:bg-green-900/30 text-green-600',
            )}>
              <ShieldQuestion className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {checkpoint.title}
                </h3>
                <RiskLevelBadge level={checkpoint.riskLevel} size="sm" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {checkpoint.description}
              </p>
            </div>
          </div>

          {/* Agent Info */}
          {checkpoint.agentName && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Bot className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requested by <strong>{checkpoint.agentName}</strong>
              </span>
            </div>
          )}

          {/* Details Toggle */}
          {checkpoint.details && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-4"
            >
              <Eye className="w-4 h-4" />
              {showDetails ? 'Hide' : 'View'} Details
              <ChevronDown className={cn('w-4 h-4 transition-transform', showDetails && 'rotate-180')} />
            </button>
          )}

          <AnimatePresence>
            {showDetails && checkpoint.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono overflow-hidden"
              >
                <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {JSON.stringify(checkpoint.details, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reason Input */}
          {checkpoint.requiresReason && checkpoint.status === 'pending' && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Reason (required)
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain your decision..."
                className="w-full h-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm resize-none"
              />
            </div>
          )}

          {/* Actions */}
          {checkpoint.status === 'pending' && (
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => onReject?.(reason)}
                className="flex-1"
                disabled={checkpoint.requiresReason && !reason.trim()}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => onApprove?.(reason)}
                className="flex-1"
                disabled={checkpoint.requiresReason && !reason.trim()}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
            </div>
          )}

          {/* Status Badge for resolved */}
          {checkpoint.status !== 'pending' && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg',
              checkpoint.status === 'approved' && 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
              checkpoint.status === 'rejected' && 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
              checkpoint.status === 'expired' && 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            )}>
              {checkpoint.status === 'approved' && <CheckCircle className="w-5 h-5" />}
              {checkpoint.status === 'rejected' && <XCircle className="w-5 h-5" />}
              {checkpoint.status === 'expired' && <Clock className="w-5 h-5" />}
              <span className="font-medium capitalize">{checkpoint.status}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)

CheckpointCard.displayName = 'CheckpointCard'

// ============================================================================
// CHECKPOINT LIST
// ============================================================================

export interface CheckpointListProps {
  checkpoints: Checkpoint[]
  onApprove?: (checkpoint: Checkpoint, reason?: string) => void
  onReject?: (checkpoint: Checkpoint, reason?: string) => void
  onView?: (checkpoint: Checkpoint) => void
  emptyMessage?: string
}

export function CheckpointList({
  checkpoints,
  onApprove,
  onReject,
  onView,
  emptyMessage = "No pending checkpoints",
}: CheckpointListProps) {
  const pending = checkpoints.filter(c => c.status === 'pending')
  const resolved = checkpoints.filter(c => c.status !== 'pending')

  if (checkpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldCheck className="w-12 h-12 text-green-500 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map(checkpoint => (
              <CheckpointCard
                key={checkpoint.id}
                checkpoint={checkpoint}
                onApprove={(reason) => onApprove?.(checkpoint, reason)}
                onReject={(reason) => onReject?.(checkpoint, reason)}
                onView={() => onView?.(checkpoint)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            History ({resolved.length})
          </h3>
          <div className="space-y-2">
            {resolved.slice(0, 5).map(checkpoint => (
              <CheckpointCard
                key={checkpoint.id}
                checkpoint={checkpoint}
                compact
                onClick={() => onView?.(checkpoint)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ELEVATION REQUEST CARD
// ============================================================================

export interface ElevationRequestCardProps {
  request: ElevationRequest
  onApprove?: () => void
  onReject?: () => void
}

export function ElevationRequestCard({ request, onApprove, onReject }: ElevationRequestCardProps) {
  const typeIcons: Record<ElevationType, ReactNode> = {
    scope: <Unlock className="w-5 h-5" />,
    budget: <Zap className="w-5 h-5" />,
    access: <Lock className="w-5 h-5" />,
    action: <ArrowUp className="w-5 h-5" />,
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 shadow-lg shadow-orange-500/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
          <ArrowUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Elevation Request
          </h3>
          <p className="text-xs text-gray-500">
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <RiskLevelBadge level={request.riskLevel} size="sm" className="ml-auto" />
      </div>

      {/* Request Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Bot className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {request.agentName}
            </p>
            <p className="text-xs text-gray-500">Requesting agent</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          {typeIcons[request.type]}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
              {request.type} Elevation
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{request.currentLevel}</span>
              <ArrowUp className="w-3 h-3" />
              <span className="text-orange-600 font-medium">{request.requestedLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Justification */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-4">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
          Justification
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {request.justification}
        </p>
      </div>

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="flex gap-3">
          <Button variant="danger" onClick={onReject} className="flex-1">
            <XCircle className="w-4 h-4 mr-1" />
            Deny
          </Button>
          <Button variant="success" onClick={onApprove} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Grant
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// GOVERNANCE STATS
// ============================================================================

export interface GovernanceStatsProps {
  stats: {
    pending: number
    approved: number
    rejected: number
    criticalPending: number
  }
}

export function GovernanceStats({ stats }: GovernanceStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <Clock className="w-5 h-5 text-yellow-600 mb-2" />
        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
          {stats.pending}
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
      </div>
      <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
          {stats.approved}
        </p>
        <p className="text-xs text-green-600 dark:text-green-400">Approved</p>
      </div>
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <XCircle className="w-5 h-5 text-red-600 mb-2" />
        <p className="text-2xl font-bold text-red-700 dark:text-red-300">
          {stats.rejected}
        </p>
        <p className="text-xs text-red-600 dark:text-red-400">Rejected</p>
      </div>
      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <ShieldAlert className="w-5 h-5 text-purple-600 mb-2" />
        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
          {stats.criticalPending}
        </p>
        <p className="text-xs text-purple-600 dark:text-purple-400">Critical</p>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export const GovernanceComponents = {
  RiskLevelBadge,
  CheckpointCard,
  CheckpointList,
  ElevationRequestCard,
  GovernanceStats,
}
