/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — NOVA ENCODING CARD                          ║
 * ║                    Semantic Encoding Visualization                            ║
 * ║                    Task A7: Agent Alpha Roadmap                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Visual component to display semantic encodings from Nova.
 * Shows the transformation from natural language to structured actions.
 *
 * FEATURES:
 * - Display original input and encoded actions
 * - Show token estimates and checkpoint requirements
 * - Sensitivity level indicators
 * - Expandable action details
 * - Approval/rejection controls for checkpoints
 */

import { useState, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, ChevronDown, ChevronUp, Check, X, AlertTriangle,
  Shield, ShieldAlert, ShieldCheck, Coins, Clock, FileCode,
  Play, Pause, RotateCcw, Eye, EyeOff, Lock, Unlock,
  ArrowRight, Zap, Target, Box, Brain, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

import type {
  SemanticEncoding,
  EncodedAction,
  EncodedActionType,
  EncodedTargetType,
  SensitivityLevel,
} from '@/hooks/useNovaEncoding'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaEncodingCardProps {
  /** The semantic encoding to display */
  encoding: SemanticEncoding
  /** Whether the card is in loading state */
  isLoading?: boolean
  /** Whether actions can be approved/rejected */
  isInteractive?: boolean
  /** Called when user approves the encoding */
  onApprove?: (encodingId: string) => void
  /** Called when user rejects the encoding */
  onReject?: (encodingId: string, reason?: string) => void
  /** Called when user wants to execute */
  onExecute?: (encodingId: string) => void
  /** Called when user modifies an action */
  onModifyAction?: (actionId: string, updates: Partial<EncodedAction>) => void
  /** Additional CSS classes */
  className?: string
  /** Show in compact mode */
  compact?: boolean
  /** Show execution timeline */
  showTimeline?: boolean
}

export interface ActionCardProps {
  action: EncodedAction
  index: number
  isExpanded: boolean
  onToggle: () => void
  onModify?: (updates: Partial<EncodedAction>) => void
  isInteractive?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════════

const ACTION_ICONS: Record<EncodedActionType, typeof Sparkles> = {
  create: Box,
  read: Eye,
  update: FileCode,
  delete: X,
  analyze: Brain,
  summarize: FileCode,
  generate: Sparkles,
  search: Target,
  compare: ArrowRight,
  extract: FileCode,
  transform: RotateCcw,
  validate: Check,
  notify: Zap,
  schedule: Clock,
  delegate: ArrowRight,
}

const ACTION_COLORS: Record<EncodedActionType, string> = {
  create: 'text-green-500 bg-green-500/10',
  read: 'text-blue-500 bg-blue-500/10',
  update: 'text-amber-500 bg-amber-500/10',
  delete: 'text-red-500 bg-red-500/10',
  analyze: 'text-purple-500 bg-purple-500/10',
  summarize: 'text-cyan-500 bg-cyan-500/10',
  generate: 'text-violet-500 bg-violet-500/10',
  search: 'text-indigo-500 bg-indigo-500/10',
  compare: 'text-teal-500 bg-teal-500/10',
  extract: 'text-orange-500 bg-orange-500/10',
  transform: 'text-pink-500 bg-pink-500/10',
  validate: 'text-emerald-500 bg-emerald-500/10',
  notify: 'text-yellow-500 bg-yellow-500/10',
  schedule: 'text-sky-500 bg-sky-500/10',
  delegate: 'text-rose-500 bg-rose-500/10',
}

const SENSITIVITY_CONFIG: Record<SensitivityLevel, {
  icon: typeof Shield
  color: string
  bgColor: string
  label: string
}> = {
  low: {
    icon: ShieldCheck,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Faible',
  },
  medium: {
    icon: Shield,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'Moyen',
  },
  high: {
    icon: ShieldAlert,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Élevé',
  },
  critical: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Critique',
  },
}

const TARGET_LABELS: Record<EncodedTargetType, string> = {
  thread: 'Thread',
  memory: 'Mémoire',
  dataspace: 'DataSpace',
  agent: 'Agent',
  meeting: 'Réunion',
  document: 'Document',
  task: 'Tâche',
  checkpoint: 'Checkpoint',
  token: 'Token',
  sphere: 'Sphère',
  external: 'Externe',
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sensitivity Badge
 */
function SensitivityBadge({ level, size = 'sm' }: { level: SensitivityLevel; size?: 'sm' | 'md' }) {
  const config = SENSITIVITY_CONFIG[level]
  const Icon = config.icon
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
      config.bgColor,
      config.color,
      size === 'sm' ? 'text-xs' : 'text-sm'
    )}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  )
}

/**
 * Token Badge
 */
function TokenBadge({ tokens, variant = 'default' }: { tokens: number; variant?: 'default' | 'warning' | 'danger' }) {
  const colors = {
    default: 'text-slate-400 bg-slate-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    danger: 'text-red-500 bg-red-500/10',
  }
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      colors[variant]
    )}>
      <Coins className="w-3 h-3" />
      {tokens.toLocaleString()}
    </span>
  )
}

/**
 * Checkpoint Badge
 */
function CheckpointBadge({ required }: { required: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      required 
        ? 'text-violet-500 bg-violet-500/10' 
        : 'text-slate-400 bg-slate-500/10'
    )}>
      {required ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
      {required ? 'Checkpoint' : 'Auto'}
    </span>
  )
}

/**
 * Action Type Badge
 */
function ActionTypeBadge({ type }: { type: EncodedActionType }) {
  const Icon = ACTION_ICONS[type]
  const color = ACTION_COLORS[type]
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium uppercase',
      color
    )}>
      <Icon className="w-3 h-3" />
      {type}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ActionCard({
  action,
  index,
  isExpanded,
  onToggle,
  onModify,
  isInteractive = true,
}: ActionCardProps) {
  const Icon = ACTION_ICONS[action.type]
  const color = ACTION_COLORS[action.type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'rounded-lg border border-slate-700/50 bg-slate-800/50',
        'hover:border-slate-600/50 transition-colors'
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        {/* Order Number */}
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
          {action.order}
        </span>
        
        {/* Icon */}
        <span className={cn('flex-shrink-0 p-1.5 rounded-lg', color)}>
          <Icon className="w-4 h-4" />
        </span>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <ActionTypeBadge type={action.type} />
            <span className="text-sm text-slate-400">→</span>
            <span className="text-sm font-medium text-slate-200">
              {action.target_name || TARGET_LABELS[action.target_type]}
            </span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-2">
          <SensitivityBadge level={action.sensitivity} />
          <TokenBadge 
            tokens={action.estimated_tokens} 
            variant={action.estimated_tokens > 1000 ? 'warning' : 'default'}
          />
          {action.requires_checkpoint && (
            <CheckpointBadge required={true} />
          )}
        </div>
        
        {/* Toggle */}
        <span className="flex-shrink-0 text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-slate-700/50">
              {/* Parameters */}
              {Object.keys(action.parameters).length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">
                    Paramètres
                  </h4>
                  <pre className="p-2 rounded bg-slate-900/50 text-xs text-slate-300 overflow-x-auto">
                    {JSON.stringify(action.parameters, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* Dependencies */}
              {action.dependencies.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">
                    Dépendances
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {action.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-300"
                      >
                        #{dep.slice(-6)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Target ID */}
              {action.target_id && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Target ID:</span>
                  <code className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 font-mono">
                    {action.target_id}
                  </code>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXECUTION TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════

interface ExecutionTimelineProps {
  actions: EncodedAction[]
  currentStep?: number
}

function ExecutionTimeline({ actions, currentStep = 0 }: ExecutionTimelineProps) {
  const sortedActions = useMemo(() => 
    [...actions].sort((a, b) => a.order - b.order),
    [actions]
  )
  
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {sortedActions.map((action, idx) => {
        const Icon = ACTION_ICONS[action.type]
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep
        const isPending = idx > currentStep
        
        return (
          <div key={action.id} className="flex items-center">
            {/* Node */}
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              'transition-colors duration-200',
              isCompleted && 'bg-green-500/20 text-green-400',
              isCurrent && 'bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/50',
              isPending && 'bg-slate-700/50 text-slate-500'
            )}>
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>
            
            {/* Connector */}
            {idx < sortedActions.length - 1 && (
              <div className={cn(
                'flex-shrink-0 w-6 h-0.5 mx-0.5',
                isCompleted ? 'bg-green-500/50' : 'bg-slate-700'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function NovaEncodingCard({
  encoding,
  isLoading = false,
  isInteractive = true,
  onApprove,
  onReject,
  onExecute,
  onModifyAction,
  className,
  compact = false,
  showTimeline = false,
}: NovaEncodingCardProps) {
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set())
  const [showAllActions, setShowAllActions] = useState(false)
  
  // Stats calculation
  const stats = useMemo(() => {
    const totalTokens = encoding.actions.reduce((sum, a) => sum + a.estimated_tokens, 0)
    const checkpointCount = encoding.actions.filter(a => a.requires_checkpoint).length
    const highSensitivityCount = encoding.actions.filter(
      a => a.sensitivity === 'high' || a.sensitivity === 'critical'
    ).length
    const maxSensitivity = encoding.actions.reduce<SensitivityLevel>(
      (max, a) => {
        const levels: SensitivityLevel[] = ['low', 'medium', 'high', 'critical']
        return levels.indexOf(a.sensitivity) > levels.indexOf(max) ? a.sensitivity : max
      },
      'low'
    )
    return { totalTokens, checkpointCount, highSensitivityCount, maxSensitivity }
  }, [encoding.actions])
  
  // Toggle action expansion
  const toggleAction = (actionId: string) => {
    setExpandedActions((prev) => {
      const next = new Set(prev)
      if (next.has(actionId)) {
        next.delete(actionId)
      } else {
        next.add(actionId)
      }
      return next
    })
  }
  
  // Actions to display
  const displayedActions = useMemo(() => {
    if (showAllActions) return encoding.actions
    return encoding.actions.slice(0, 3)
  }, [encoding.actions, showAllActions])
  
  const hasMoreActions = encoding.actions.length > 3
  
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700/50 bg-slate-800/30',
        'overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
        <div className="flex items-start gap-3">
          {/* Nova Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-100">
                Encodage Sémantique
              </h3>
              <span className="text-xs text-slate-400">
                v{encoding.version}
              </span>
              {isLoading && (
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              )}
            </div>
            
            {/* Original Input */}
            <p className="text-sm text-slate-300 line-clamp-2">
              "{encoding.original_input}"
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <SensitivityBadge level={stats.maxSensitivity} size="md" />
          </div>
        </div>
        
        {/* Stats Row */}
        {!compact && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/30">
            <div className="flex items-center gap-1.5 text-sm">
              <Box className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{encoding.actions.length}</span>
              <span className="text-slate-500">actions</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm">
              <Coins className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{stats.totalTokens.toLocaleString()}</span>
              <span className="text-slate-500">tokens</span>
            </div>
            
            {stats.checkpointCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Lock className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300">{stats.checkpointCount}</span>
                <span className="text-slate-500">checkpoints</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">
                ~{Math.ceil(encoding.estimated_duration_ms / 1000)}s
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Execution Timeline */}
      {showTimeline && (
        <div className="px-4 py-2 border-b border-slate-700/30 bg-slate-900/30">
          <ExecutionTimeline actions={encoding.actions} currentStep={0} />
        </div>
      )}
      
      {/* Intent & Context */}
      {!compact && (
        <div className="p-4 border-b border-slate-700/30 space-y-2">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 uppercase">Intent</span>
              <p className="text-sm text-slate-300">{encoding.intent.primary}</p>
              {encoding.intent.secondary && (
                <p className="text-xs text-slate-400 mt-1">{encoding.intent.secondary}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Sphere:</span>
            <span className="text-sm text-slate-300">{encoding.context.sphere_id}</span>
            <span className="text-xs text-slate-500 ml-2">Confiance:</span>
            <span className="text-sm text-slate-300">
              {Math.round(encoding.confidence * 100)}%
            </span>
          </div>
        </div>
      )}
      
      {/* Actions List */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-200">
            Actions encodées
          </h4>
          {hasMoreActions && (
            <button
              onClick={() => setShowAllActions(!showAllActions)}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              {showAllActions ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  Réduire
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  Voir tout ({encoding.actions.length})
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {displayedActions.map((action, idx) => (
            <ActionCard
              key={action.id}
              action={action}
              index={idx}
              isExpanded={expandedActions.has(action.id)}
              onToggle={() => toggleAction(action.id)}
              onModify={onModifyAction ? (updates) => onModifyAction(action.id, updates) : undefined}
              isInteractive={isInteractive}
            />
          ))}
        </div>
        
        {hasMoreActions && !showAllActions && (
          <p className="text-xs text-slate-500 text-center pt-2">
            + {encoding.actions.length - 3} autres actions
          </p>
        )}
      </div>
      
      {/* Footer Actions */}
      {isInteractive && encoding.requires_checkpoint && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-violet-400" />
              <span className="text-slate-300">Approbation requise</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onReject?.(encoding.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  'bg-red-500/10 text-red-400 hover:bg-red-500/20',
                  'transition-colors'
                )}
              >
                <X className="w-4 h-4 inline-block mr-1" />
                Rejeter
              </button>
              
              <button
                onClick={() => onApprove?.(encoding.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  'bg-green-500/10 text-green-400 hover:bg-green-500/20',
                  'transition-colors'
                )}
              >
                <Check className="w-4 h-4 inline-block mr-1" />
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Execute Button (no checkpoint required) */}
      {isInteractive && !encoding.requires_checkpoint && onExecute && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          <button
            onClick={() => onExecute(encoding.id)}
            disabled={isLoading}
            className={cn(
              'w-full px-4 py-2 rounded-lg text-sm font-medium',
              'bg-gradient-to-r from-violet-500 to-fuchsia-500',
              'text-white hover:opacity-90',
              'transition-opacity',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center gap-2'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exécution...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Exécuter ({stats.totalTokens} tokens)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT VARIANT
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaEncodingCompactProps {
  encoding: SemanticEncoding
  onClick?: () => void
  className?: string
}

export function NovaEncodingCompact({
  encoding,
  onClick,
  className,
}: NovaEncodingCompactProps) {
  const stats = useMemo(() => {
    const totalTokens = encoding.actions.reduce((sum, a) => sum + a.estimated_tokens, 0)
    const checkpointCount = encoding.actions.filter(a => a.requires_checkpoint).length
    return { totalTokens, checkpointCount }
  }, [encoding.actions])
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg border border-slate-700/50 bg-slate-800/30',
        'hover:border-violet-500/50 hover:bg-slate-800/50',
        'transition-colors text-left',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 truncate">
            {encoding.intent.primary}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">
              {encoding.actions.length} actions
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {stats.totalTokens} tokens
            </span>
            {stats.checkpointCount > 0 && (
              <>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-violet-400">
                  {stats.checkpointCount} checkpoints
                </span>
              </>
            )}
          </div>
        </div>
        
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type {
  NovaEncodingCardProps,
  ActionCardProps,
  NovaEncodingCompactProps,
}
