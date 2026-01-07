/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — AGENT EXECUTION PANEL                       ║
 * ║                    Real-time Agent Task Execution Visualization              ║
 * ║                    Task A8: Agent Alpha Roadmap                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Visual panel to display and control agent task execution.
 * Shows real-time progress, token consumption, and governance compliance.
 *
 * FEATURES:
 * - Real-time execution progress
 * - Token budget tracking
 * - Checkpoint approval workflow
 * - Execution log viewer
 * - Pause/Resume/Cancel controls
 * - Multi-agent coordination view
 *
 * GOVERNANCE:
 * - All executions go through checkpoint system
 * - Token budgets enforced
 * - Full audit trail
 */

import { useState, useEffect, useMemo, useCallback, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Play, Pause, Square, RotateCcw, ChevronDown, ChevronUp,
  Clock, Coins, Shield, ShieldAlert, Check, X, AlertTriangle,
  Activity, Zap, Eye, EyeOff, Terminal, FileCode, ArrowRight,
  RefreshCw, MoreVertical, Settings, Download, Maximize2, Minimize2,
  Lock, Unlock, Info, ExternalLink, Cpu, Database, Network
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ExecutionStatus =
  | 'pending'
  | 'queued'
  | 'running'
  | 'paused'
  | 'waiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type ExecutionStepType =
  | 'encode'
  | 'validate'
  | 'checkpoint'
  | 'execute'
  | 'verify'
  | 'audit'

export interface ExecutionStep {
  id: string
  type: ExecutionStepType
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  started_at?: string
  completed_at?: string
  duration_ms?: number
  error?: string
  output?: unknown
  tokens_used?: number
  requires_approval?: boolean
  approved_at?: string
  approved_by?: string
}

export interface ExecutionLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, unknown>
}

export interface AgentExecution {
  id: string
  agent_id: string
  agent_name: string
  agent_avatar?: string
  
  // Task info
  task_id: string
  task_description: string
  encoding_id?: string
  
  // Status
  status: ExecutionStatus
  progress: number // 0-100
  
  // Steps
  steps: ExecutionStep[]
  current_step?: string
  
  // Timing
  started_at: string
  estimated_completion?: string
  completed_at?: string
  
  // Tokens
  tokens_allocated: number
  tokens_used: number
  tokens_reserved: number
  
  // Governance
  requires_checkpoint: boolean
  checkpoint_id?: string
  checkpoint_status?: 'pending' | 'approved' | 'rejected'
  
  // Logs
  logs: ExecutionLog[]
  
  // Results
  result?: unknown
  error?: string
}

export interface AgentExecutionPanelProps {
  /** The execution to display */
  execution: AgentExecution
  /** Called when user pauses execution */
  onPause?: (executionId: string) => void
  /** Called when user resumes execution */
  onResume?: (executionId: string) => void
  /** Called when user cancels execution */
  onCancel?: (executionId: string) => void
  /** Called when user retries failed execution */
  onRetry?: (executionId: string) => void
  /** Called when user approves checkpoint */
  onApproveCheckpoint?: (executionId: string, checkpointId: string) => void
  /** Called when user rejects checkpoint */
  onRejectCheckpoint?: (executionId: string, checkpointId: string, reason?: string) => void
  /** Additional CSS classes */
  className?: string
  /** Show in compact mode */
  compact?: boolean
  /** Show detailed logs */
  showLogs?: boolean
  /** Enable auto-scroll for logs */
  autoScrollLogs?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<ExecutionStatus, {
  label: string
  color: string
  bgColor: string
  icon: typeof Play
  animated?: boolean
}> = {
  pending: {
    label: 'En attente',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    icon: Clock,
  },
  queued: {
    label: 'En file',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    icon: Clock,
  },
  running: {
    label: 'En cours',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Activity,
    animated: true,
  },
  paused: {
    label: 'Pausé',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    icon: Pause,
  },
  waiting_approval: {
    label: 'Approbation',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    icon: Shield,
    animated: true,
  },
  completed: {
    label: 'Terminé',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: Check,
  },
  failed: {
    label: 'Échoué',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    icon: X,
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    icon: Square,
  },
}

const STEP_TYPE_CONFIG: Record<ExecutionStepType, {
  label: string
  icon: typeof Play
  color: string
}> = {
  encode: { label: 'Encodage', icon: FileCode, color: 'text-violet-400' },
  validate: { label: 'Validation', icon: Check, color: 'text-blue-400' },
  checkpoint: { label: 'Checkpoint', icon: Shield, color: 'text-amber-400' },
  execute: { label: 'Exécution', icon: Zap, color: 'text-green-400' },
  verify: { label: 'Vérification', icon: Eye, color: 'text-cyan-400' },
  audit: { label: 'Audit', icon: Database, color: 'text-purple-400' },
}

const LOG_LEVEL_CONFIG: Record<string, { color: string; bgColor: string }> = {
  info: { color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  warn: { color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  error: { color: 'text-red-400', bgColor: 'bg-red-500/10' },
  debug: { color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Status Badge
 */
function StatusBadge({ status }: { status: ExecutionStatus }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      config.bgColor,
      config.color
    )}>
      <Icon className={cn('w-3.5 h-3.5', config.animated && 'animate-pulse')} />
      {config.label}
    </span>
  )
}

/**
 * Progress Ring
 */
function ProgressRing({ progress, size = 48, strokeWidth = 4 }: { 
  progress: number
  size?: number
  strokeWidth?: number 
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-violet-500 transition-all duration-300"
      />
    </svg>
  )
}

/**
 * Token Usage Bar
 */
function TokenUsageBar({ allocated, used, reserved }: {
  allocated: number
  used: number
  reserved: number
}) {
  const usedPercent = (used / allocated) * 100
  const reservedPercent = (reserved / allocated) * 100
  const remaining = allocated - used - reserved
  const remainingPercent = (remaining / allocated) * 100
  
  const isOverBudget = used > allocated
  const isNearLimit = usedPercent > 80
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Tokens</span>
        <span className={cn(
          'font-medium',
          isOverBudget ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-slate-300'
        )}>
          {used.toLocaleString()} / {allocated.toLocaleString()}
        </span>
      </div>
      
      <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden flex">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-green-500'
          )}
          style={{ width: `${Math.min(usedPercent, 100)}%` }}
        />
        {reserved > 0 && (
          <div
            className="h-full bg-violet-500/50 transition-all duration-300"
            style={{ width: `${reservedPercent}%` }}
          />
        )}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Utilisé: {used.toLocaleString()}
        </span>
        {reserved > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-500/50" />
            Réservé: {reserved.toLocaleString()}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          Restant: {remaining.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

/**
 * Execution Step
 */
function ExecutionStepItem({ step, isCurrent }: { step: ExecutionStep; isCurrent: boolean }) {
  const typeConfig = STEP_TYPE_CONFIG[step.type]
  const Icon = typeConfig.icon
  
  const statusColors = {
    pending: 'text-slate-500 bg-slate-500/10',
    running: 'text-blue-400 bg-blue-500/10',
    completed: 'text-green-400 bg-green-500/10',
    failed: 'text-red-400 bg-red-500/10',
    skipped: 'text-slate-400 bg-slate-500/10',
  }
  
  return (
    <div className={cn(
      'flex items-center gap-3 p-2 rounded-lg transition-colors',
      isCurrent && 'bg-slate-700/30'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        statusColors[step.status]
      )}>
        {step.status === 'running' ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : step.status === 'completed' ? (
          <Check className="w-4 h-4" />
        ) : step.status === 'failed' ? (
          <X className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium',
            step.status === 'completed' ? 'text-slate-300' :
            step.status === 'running' ? 'text-slate-100' :
            'text-slate-400'
          )}>
            {step.label}
          </span>
          
          {step.requires_approval && (
            <Lock className="w-3 h-3 text-violet-400" />
          )}
        </div>
        
        {step.duration_ms && (
          <span className="text-xs text-slate-500">
            {step.duration_ms}ms
          </span>
        )}
        
        {step.error && (
          <p className="text-xs text-red-400 mt-1 truncate">
            {step.error}
          </p>
        )}
      </div>
      
      {step.tokens_used !== undefined && (
        <span className="text-xs text-slate-400">
          {step.tokens_used} tokens
        </span>
      )}
    </div>
  )
}

/**
 * Log Entry
 */
function LogEntry({ log }: { log: ExecutionLog }) {
  const config = LOG_LEVEL_CONFIG[log.level]
  const time = new Date(log.timestamp).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
  
  return (
    <div className="flex items-start gap-2 py-1 font-mono text-xs">
      <span className="text-slate-500 flex-shrink-0">{time}</span>
      <span className={cn('px-1.5 py-0.5 rounded uppercase', config.bgColor, config.color)}>
        {log.level}
      </span>
      <span className="text-slate-300 break-all">{log.message}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AgentExecutionPanel({
  execution,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onApproveCheckpoint,
  onRejectCheckpoint,
  className,
  compact = false,
  showLogs: initialShowLogs = false,
  autoScrollLogs = true,
}: AgentExecutionPanelProps) {
  const [showSteps, setShowSteps] = useState(true)
  const [showLogs, setShowLogs] = useState(initialShowLogs)
  const [isExpanded, setIsExpanded] = useState(!compact)
  
  const logsEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll logs
  useEffect(() => {
    if (autoScrollLogs && showLogs && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [execution.logs.length, showLogs, autoScrollLogs])
  
  // Stats
  const stats = useMemo(() => {
    const completedSteps = execution.steps.filter(s => s.status === 'completed').length
    const totalSteps = execution.steps.length
    const elapsedMs = execution.completed_at 
      ? new Date(execution.completed_at).getTime() - new Date(execution.started_at).getTime()
      : Date.now() - new Date(execution.started_at).getTime()
    
    return {
      completedSteps,
      totalSteps,
      elapsedMs,
      elapsedFormatted: formatDuration(elapsedMs),
    }
  }, [execution])
  
  // Can perform actions
  const canPause = execution.status === 'running'
  const canResume = execution.status === 'paused'
  const canCancel = ['running', 'paused', 'queued'].includes(execution.status)
  const canRetry = execution.status === 'failed'
  const needsApproval = execution.status === 'waiting_approval' && execution.checkpoint_id
  
  return (
    <div className={cn(
      'rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start gap-3">
          {/* Agent Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              {execution.agent_avatar ? (
                <img 
                  src={execution.agent_avatar} 
                  alt={execution.agent_name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Bot className="w-6 h-6 text-white" />
              )}
            </div>
            
            {/* Progress Ring Overlay */}
            {execution.status === 'running' && (
              <div className="absolute -inset-1">
                <ProgressRing progress={execution.progress} size={56} strokeWidth={2} />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-100 truncate">
                {execution.agent_name}
              </h3>
              <StatusBadge status={execution.status} />
            </div>
            
            <p className="text-sm text-slate-400 line-clamp-2">
              {execution.task_description}
            </p>
          </div>
          
          {/* Expand/Collapse */}
          {compact && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/30">
          <div className="flex items-center gap-1.5 text-sm">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{execution.progress}%</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm">
            <Coins className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{execution.tokens_used.toLocaleString()}</span>
            <span className="text-slate-500">/ {execution.tokens_allocated.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{stats.elapsedFormatted}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{stats.completedSteps}/{stats.totalSteps}</span>
            <span className="text-slate-500">étapes</span>
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {/* Token Usage */}
            <div className="p-4 border-b border-slate-700/30">
              <TokenUsageBar 
                allocated={execution.tokens_allocated}
                used={execution.tokens_used}
                reserved={execution.tokens_reserved}
              />
            </div>
            
            {/* Checkpoint Approval */}
            {needsApproval && (
              <div className="p-4 border-b border-slate-700/30 bg-violet-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">Approbation requise</p>
                      <p className="text-xs text-slate-400">
                        Checkpoint #{execution.checkpoint_id?.slice(-6)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRejectCheckpoint?.(execution.id, execution.checkpoint_id!)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => onApproveCheckpoint?.(execution.id, execution.checkpoint_id!)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    >
                      Approuver
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Steps */}
            <div className="border-b border-slate-700/30">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/20"
              >
                <span className="text-sm font-medium text-slate-300">
                  Étapes d'exécution
                </span>
                {showSteps ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              {showSteps && (
                <div className="px-3 pb-3 space-y-1">
                  {execution.steps.map((step) => (
                    <ExecutionStepItem
                      key={step.id}
                      step={step}
                      isCurrent={step.id === execution.current_step}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Logs */}
            <div className="border-b border-slate-700/30">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/20"
              >
                <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Logs ({execution.logs.length})
                </span>
                {showLogs ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              {showLogs && (
                <div className="px-3 pb-3 max-h-48 overflow-y-auto bg-slate-900/30 rounded-lg mx-3 mb-3">
                  {execution.logs.length === 0 ? (
                    <p className="text-xs text-slate-500 p-2">Aucun log</p>
                  ) : (
                    <>
                      {execution.logs.map((log) => (
                        <LogEntry key={log.id} log={log} />
                      ))}
                      <div ref={logsEndRef} />
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Error Display */}
            {execution.error && (
              <div className="p-4 bg-red-500/5 border-b border-red-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Erreur</p>
                    <p className="text-sm text-red-300/80 mt-1">{execution.error}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Actions */}
      <div className="p-3 bg-slate-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canPause && (
            <button
              onClick={() => onPause?.(execution.id)}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-400"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          
          {canResume && (
            <button
              onClick={() => onResume?.(execution.id)}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-green-400"
              title="Reprendre"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={() => onCancel?.(execution.id)}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400"
              title="Annuler"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
          
          {canRetry && (
            <button
              onClick={() => onRetry?.(execution.id)}
              className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-blue-400"
              title="Réessayer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>ID: {execution.id.slice(-8)}</span>
          {execution.encoding_id && (
            <>
              <span>•</span>
              <span>Enc: {execution.encoding_id.slice(-6)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${Math.round(ms / 1000)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT VARIANT
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentExecutionCompactProps {
  execution: AgentExecution
  onClick?: () => void
  className?: string
}

export function AgentExecutionCompact({
  execution,
  onClick,
  className,
}: AgentExecutionCompactProps) {
  const statusConfig = STATUS_CONFIG[execution.status]
  const StatusIcon = statusConfig.icon
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg border border-slate-700/50 bg-slate-800/30',
        'hover:border-blue-500/50 hover:bg-slate-800/50',
        'transition-colors text-left',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {execution.status === 'running' && (
            <div className="absolute -inset-0.5">
              <ProgressRing progress={execution.progress} size={44} strokeWidth={2} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200 truncate">
              {execution.agent_name}
            </span>
            <span className={cn('text-xs', statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {execution.task_description}
          </p>
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-xs text-slate-400">{execution.progress}%</span>
          <StatusIcon className={cn('w-4 h-4', statusConfig.color, statusConfig.animated && 'animate-pulse')} />
        </div>
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  AgentExecutionPanelProps,
  AgentExecutionCompactProps,
  AgentExecution,
  ExecutionStep,
  ExecutionLog,
  ExecutionStatus,
  ExecutionStepType,
}
