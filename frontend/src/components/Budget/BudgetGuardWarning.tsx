// ============================================================
// CHE·NU - Budget Guard Warning
// ============================================================
// Shows when action is blocked by budget
// Never auto-upgrades • Always explicit
// Nova explains, doesn't block silently
// ============================================================

import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Leaf, 
  Scale, 
  Rocket,
  Scissors,
  Info
} from 'lucide-react'
import { clsx } from 'clsx'
import type { PresetId } from './BudgetPresetSelector'

interface GuardResult {
  ok: boolean
  reason?: string
  suggestion?: string
  blockedBy?: 'model' | 'scope' | 'action_limit' | 'meeting_limit'
}

interface PresetSuggestion {
  currentPreset: PresetId
  suggestedPreset: PresetId | null
  reason: string
  message: string
  blockedBy: string
}

interface BudgetGuardWarningProps {
  guardResult: GuardResult | null
  suggestion?: PresetSuggestion | null
  onReduceScope?: () => void
  onChangePreset?: (preset: PresetId) => void
  onDismiss?: () => void
}

const presetIcons = {
  eco: Leaf,
  balanced: Scale,
  pro: Rocket
}

const presetColors = {
  eco: 'text-green-400 bg-green-500/20',
  balanced: 'text-blue-400 bg-blue-500/20',
  pro: 'text-purple-400 bg-purple-500/20'
}

const blockReasonIcons = {
  model: '🤖',
  scope: '🔍',
  action_limit: '⚡',
  meeting_limit: '📊'
}

export function BudgetGuardWarning({
  guardResult,
  suggestion,
  onReduceScope,
  onChangePreset,
  onDismiss
}: BudgetGuardWarningProps) {
  // Only show if blocked
  if (!guardResult || guardResult.ok) {
    return null
  }

  const blockedBy = guardResult.blockedBy || 'action_limit'
  const Icon = blockReasonIcons[blockedBy]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-red-500/30 bg-red-500/10 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 bg-red-500/5">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <XCircle size={20} className="text-red-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-red-400">Action bloquée</h4>
          <p className="text-sm text-gray-400">
            {Icon} {guardResult.reason}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestion */}
      {guardResult.suggestion && (
        <div className="px-4 py-3 border-t border-gray-700/30 flex items-start gap-2">
          <Info size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">{guardResult.suggestion}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-700/30 bg-gray-900/30 flex flex-wrap gap-2">
        {/* Reduce Scope */}
        {(blockedBy === 'action_limit' || blockedBy === 'scope') && onReduceScope && (
          <button
            onClick={onReduceScope}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <Scissors size={16} />
            Réduire le scope
          </button>
        )}

        {/* Upgrade Preset */}
        {suggestion?.suggestedPreset && onChangePreset && (
          <button
            onClick={() => onChangePreset(suggestion.suggestedPreset!)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              presetColors[suggestion.suggestedPreset]
            )}
          >
            {(() => {
              const PresetIcon = presetIcons[suggestion.suggestedPreset!]
              return <PresetIcon size={16} />
            })()}
            Passer à {suggestion.suggestedPreset}
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Nova Message */}
      <div className="px-4 py-3 border-t border-gray-700/30 bg-purple-500/5">
        <div className="flex items-start gap-2">
          <span className="text-purple-400">🌟</span>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-purple-400 font-medium">Nova:</span>{' '}
              {getNovaMessage(blockedBy, suggestion)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// NOVA MESSAGES (Never authoritative, always helpful)
// ============================================================
function getNovaMessage(
  blockedBy: string, 
  suggestion?: PresetSuggestion | null
): string {
  const messages: Record<string, string[]> = {
    model: [
      "Ce modèle n'est pas disponible avec votre preset actuel. Vous pouvez utiliser un modèle plus léger ou changer de preset.",
      "Le modèle demandé nécessite un preset supérieur. Je peux vous aider avec le modèle disponible, ou vous pouvez changer de preset."
    ],
    scope: [
      "Ce scope utilise plus de contexte que votre preset permet. Sélectionnez moins de texte ou changez de preset.",
      "Le scope workspace nécessite au minimum le preset Balanced."
    ],
    action_limit: [
      "Cette action dépasse la limite de tokens. Réduire le scope est souvent la meilleure solution.",
      "Trop de tokens pour ce preset. Essayez de sélectionner uniquement la partie pertinente du texte."
    ],
    meeting_limit: [
      "Le budget meeting est épuisé. Vous pouvez terminer le meeting et en démarrer un nouveau.",
      "Plus de tokens disponibles pour ce meeting. Les prochaines actions devront attendre."
    ]
  }

  const options = messages[blockedBy] || messages.action_limit
  return options[Math.floor(Math.random() * options.length)]
}

// ============================================================
// COMPACT VERSION (for inline display)
// ============================================================
export function BudgetGuardBadge({
  guardResult
}: {
  guardResult: GuardResult | null
}) {
  if (!guardResult || guardResult.ok) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Budget OK
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 text-xs text-red-400">
      <AlertTriangle size={12} />
      Bloqué
    </span>
  )
}
