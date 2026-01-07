// ============================================================
// CHE·NU - Budget Preset Selector
// ============================================================
// User chooses a mode, not numbers
// Visual, intuitive, enterprise-ready
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  Scale, 
  Rocket, 
  Check, 
  ChevronDown,
  Zap,
  DollarSign,
  Lock,
  Unlock,
  Info
} from 'lucide-react'
import { clsx } from 'clsx'

export type PresetId = 'eco' | 'balanced' | 'pro'

export interface BudgetPreset {
  id: PresetId
  label: string
  description: string
  allowedModels: string[]
  defaultModel: string
  maxTokensPerAction: number
  maxTokensPerMeeting: number
  allowedScopes: string[]
  allowWorkspaceScope: boolean
  estimatedCostPerAction: number
  estimatedCostPerMeeting: number
  color: string
  icon: string
}

interface BudgetPresetSelectorProps {
  value: PresetId
  onChange: (preset: PresetId) => void
  presets?: BudgetPreset[]
  disabled?: boolean
  showDetails?: boolean
  compact?: boolean
}

// Default presets (can be overridden from API)
const defaultPresets: Record<PresetId, BudgetPreset> = {
  eco: {
    id: 'eco',
    label: 'Eco',
    description: 'Économique - Idéal pour tâches simples',
    allowedModels: ['small'],
    defaultModel: 'small',
    maxTokensPerAction: 800,
    maxTokensPerMeeting: 8_000,
    allowedScopes: ['selection', 'document'],
    allowWorkspaceScope: false,
    estimatedCostPerAction: 0.0004,
    estimatedCostPerMeeting: 0.004,
    color: 'green',
    icon: '🌱'
  },
  balanced: {
    id: 'balanced',
    label: 'Balanced',
    description: 'Équilibré - Usage quotidien recommandé',
    allowedModels: ['small', 'medium'],
    defaultModel: 'medium',
    maxTokensPerAction: 2_500,
    maxTokensPerMeeting: 20_000,
    allowedScopes: ['selection', 'document', 'workspace'],
    allowWorkspaceScope: true,
    estimatedCostPerAction: 0.005,
    estimatedCostPerMeeting: 0.04,
    color: 'blue',
    icon: '⚖️'
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    description: 'Professionnel - Puissance maximale',
    allowedModels: ['small', 'medium', 'large'],
    defaultModel: 'medium',
    maxTokensPerAction: 8_000,
    maxTokensPerMeeting: 80_000,
    allowedScopes: ['selection', 'document', 'workspace', 'meeting'],
    allowWorkspaceScope: true,
    estimatedCostPerAction: 0.12,
    estimatedCostPerMeeting: 1.20,
    color: 'purple',
    icon: '🚀'
  }
}

const presetIcons = {
  eco: Leaf,
  balanced: Scale,
  pro: Rocket
}

const presetColors = {
  eco: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    ring: 'ring-green-500',
    gradient: 'from-green-500 to-emerald-500'
  },
  balanced: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    ring: 'ring-blue-500',
    gradient: 'from-blue-500 to-cyan-500'
  },
  pro: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
    text: 'text-purple-400',
    ring: 'ring-purple-500',
    gradient: 'from-purple-500 to-pink-500'
  }
}

export function BudgetPresetSelector({
  value,
  onChange,
  presets,
  disabled = false,
  showDetails = true,
  compact = false
}: BudgetPresetSelectorProps) {
  const [showComparison, setShowComparison] = useState(false)
  
  const presetData = presets 
    ? Object.fromEntries(presets.map(p => [p.id, p])) 
    : defaultPresets
  
  const currentPreset = presetData[value]
  const colors = presetColors[value]

  if (compact) {
    return (
      <CompactSelector 
        value={value} 
        onChange={onChange} 
        presets={presetData}
        disabled={disabled}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Preset Cards */}
      <div className="grid grid-cols-3 gap-3">
        {(['eco', 'balanced', 'pro'] as PresetId[]).map((presetId) => {
          const preset = presetData[presetId]
          const Icon = presetIcons[presetId]
          const pColors = presetColors[presetId]
          const isActive = value === presetId
          
          return (
            <button
              key={presetId}
              onClick={() => onChange(presetId)}
              disabled={disabled}
              className={clsx(
                'relative p-4 rounded-2xl border-2 transition-all duration-200',
                'flex flex-col items-center gap-2 text-center',
                isActive && pColors.border,
                isActive && pColors.bg,
                isActive && 'ring-2 ring-offset-2 ring-offset-gray-900',
                isActive && pColors.ring,
                !isActive && 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Selected Indicator */}
              {isActive && (
                <div className={clsx(
                  'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center',
                  `bg-gradient-to-br ${pColors.gradient}`
                )}>
                  <Check size={14} className="text-white" />
                </div>
              )}
              
              {/* Icon */}
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                isActive ? `bg-gradient-to-br ${pColors.gradient}` : 'bg-gray-700/50'
              )}>
                <Icon size={24} className={isActive ? 'text-white' : 'text-gray-400'} />
              </div>
              
              {/* Label */}
              <div>
                <p className={clsx(
                  'font-bold',
                  isActive ? pColors.text : 'text-gray-300'
                )}>
                  {preset.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {preset.icon} ~${preset.estimatedCostPerAction}/action
                </p>
              </div>
              
              {/* Limits Preview */}
              <div className="flex items-center gap-2 text-xs">
                <span className={clsx(
                  'px-2 py-0.5 rounded-full',
                  isActive ? pColors.bg : 'bg-gray-700/50',
                  isActive ? pColors.text : 'text-gray-400'
                )}>
                  {(preset.maxTokensPerAction / 1000).toFixed(1)}k/act
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Current Preset Details */}
      {showDetails && currentPreset && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            'p-4 rounded-xl border',
            colors.bg,
            colors.border
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentPreset.icon}</span>
              <div>
                <h4 className={clsx('font-bold', colors.text)}>{currentPreset.label}</h4>
                <p className="text-xs text-gray-400">{currentPreset.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
            >
              <Info size={14} />
              Comparer
              <ChevronDown size={14} className={clsx(showComparison && 'rotate-180', 'transition-transform')} />
            </button>
          </div>

          {/* Limits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <LimitCard
              icon={<Zap size={14} />}
              label="Par action"
              value={`${currentPreset.maxTokensPerAction.toLocaleString()} tok`}
              color={colors.text}
            />
            <LimitCard
              icon={<Zap size={14} />}
              label="Par meeting"
              value={`${currentPreset.maxTokensPerMeeting.toLocaleString()} tok`}
              color={colors.text}
            />
            <LimitCard
              icon={<DollarSign size={14} />}
              label="Coût/action"
              value={`~$${currentPreset.estimatedCostPerAction}`}
              color={colors.text}
            />
            <LimitCard
              icon={currentPreset.allowWorkspaceScope ? <Unlock size={14} /> : <Lock size={14} />}
              label="Workspace"
              value={currentPreset.allowWorkspaceScope ? 'Activé' : 'Désactivé'}
              color={currentPreset.allowWorkspaceScope ? 'text-green-400' : 'text-gray-500'}
            />
          </div>

          {/* Models & Scopes */}
          <div className="mt-3 flex flex-wrap gap-2">
            {currentPreset.allowedModels.map(model => (
              <span key={model} className="px-2 py-1 rounded-lg bg-gray-800 text-xs text-gray-300">
                {model}
              </span>
            ))}
            <span className="text-gray-600">•</span>
            {currentPreset.allowedScopes.map(scope => (
              <span key={scope} className={clsx('px-2 py-1 rounded-lg text-xs', colors.bg, colors.text)}>
                {scope}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <PresetComparisonTable presets={presetData} currentPreset={value} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function LimitCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="p-2 rounded-lg bg-gray-900/50">
      <div className={clsx('flex items-center gap-1 mb-1', color)}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-mono text-sm text-white">{value}</p>
    </div>
  )
}

function CompactSelector({
  value,
  onChange,
  presets,
  disabled
}: {
  value: PresetId
  onChange: (preset: PresetId) => void
  presets: Record<PresetId, BudgetPreset>
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Budget:</span>
      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-xl">
        {(['eco', 'balanced', 'pro'] as PresetId[]).map((presetId) => {
          const preset = presets[presetId]
          const isActive = value === presetId
          const colors = presetColors[presetId]
          
          return (
            <button
              key={presetId}
              onClick={() => onChange(presetId)}
              disabled={disabled}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                isActive && colors.bg,
                isActive && colors.text,
                !isActive && 'text-gray-500 hover:text-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {preset.icon} {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PresetComparisonTable({
  presets,
  currentPreset
}: {
  presets: Record<PresetId, BudgetPreset>
  currentPreset: PresetId
}) {
  const rows = [
    { label: 'Tokens/action', key: 'maxTokensPerAction', format: (v: number) => `${v.toLocaleString()}` },
    { label: 'Tokens/meeting', key: 'maxTokensPerMeeting', format: (v: number) => `${v.toLocaleString()}` },
    { label: 'Coût/action', key: 'estimatedCostPerAction', format: (v: number) => `$${v}` },
    { label: 'Modèles', key: 'allowedModels', format: (v: string[]) => v.join(', ') },
    { label: 'Workspace', key: 'allowWorkspaceScope', format: (v: boolean) => v ? '✓' : '✗' }
  ]

  return (
    <div className="rounded-xl border border-gray-700/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800/50">
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Limite</th>
            {(['eco', 'balanced', 'pro'] as PresetId[]).map(id => (
              <th 
                key={id}
                className={clsx(
                  'px-4 py-2 text-center font-medium',
                  id === currentPreset ? presetColors[id].text : 'text-gray-400'
                )}
              >
                {presets[id].icon} {presets[id].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} className={i % 2 === 0 ? 'bg-gray-900/30' : ''}>
              <td className="px-4 py-2 text-gray-400">{row.label}</td>
              {(['eco', 'balanced', 'pro'] as PresetId[]).map(id => (
                <td 
                  key={id}
                  className={clsx(
                    'px-4 py-2 text-center font-mono',
                    id === currentPreset ? 'text-white' : 'text-gray-500'
                  )}
                >
                  {row.format((presets[id] as any)[row.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
