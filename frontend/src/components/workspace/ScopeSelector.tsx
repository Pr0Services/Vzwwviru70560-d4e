// ============================================================
// CHE·NU - Scope Selector
// ============================================================
// Controls what the orchestrator "sees"
// Reduces tokens by limiting context
// ============================================================

import { clsx } from 'clsx'
import { 
  MousePointer2, 
  FileText, 
  FolderOpen, 
  Users,
  Info,
  AlertTriangle
} from 'lucide-react'

export type Scope = 'selection' | 'document' | 'workspace' | 'meeting'

interface ScopeSelectorProps {
  value: Scope
  onChange: (scope: Scope) => void
  disabled?: boolean
  hasSelection?: boolean
  showWarnings?: boolean
}

const scopeConfig: Record<Scope, {
  label: string
  description: string
  icon: typeof MousePointer2
  color: string
  tokenMultiplier: string
}> = {
  selection: {
    label: 'Sélection',
    description: 'Texte sélectionné uniquement (recommandé)',
    icon: MousePointer2,
    color: 'green',
    tokenMultiplier: '~1x'
  },
  document: {
    label: 'Document',
    description: 'Document complet actuel',
    icon: FileText,
    color: 'blue',
    tokenMultiplier: '~2-5x'
  },
  workspace: {
    label: 'Workspace',
    description: 'Document + contexte workspace',
    icon: FolderOpen,
    color: 'orange',
    tokenMultiplier: '~5-10x'
  },
  meeting: {
    label: 'Meeting',
    description: 'Contexte meeting + participants',
    icon: Users,
    color: 'purple',
    tokenMultiplier: '~3-8x'
  }
}

export function ScopeSelector({ 
  value, 
  onChange, 
  disabled = false,
  hasSelection = false,
  showWarnings = true
}: ScopeSelectorProps) {
  const config = scopeConfig[value]

  return (
    <div className="space-y-3">
      {/* Scope Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Scope:</span>
        <div className="flex gap-1 p-1 bg-gray-800/50 rounded-xl">
          {(Object.entries(scopeConfig) as [Scope, typeof config][]).map(([scope, cfg]) => {
            const Icon = cfg.icon
            const isActive = value === scope
            const isSelectionWithoutText = scope === 'selection' && !hasSelection
            
            return (
              <button
                key={scope}
                onClick={() => onChange(scope)}
                disabled={disabled}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive && cfg.color === 'green' && 'bg-green-500/20 text-green-400',
                  isActive && cfg.color === 'blue' && 'bg-blue-500/20 text-blue-400',
                  isActive && cfg.color === 'orange' && 'bg-orange-500/20 text-orange-400',
                  isActive && cfg.color === 'purple' && 'bg-purple-500/20 text-purple-400',
                  !isActive && 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50',
                  disabled && 'opacity-50 cursor-not-allowed',
                  isSelectionWithoutText && !isActive && 'opacity-40'
                )}
                title={cfg.description}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Info Banner */}
      <div className={clsx(
        'flex items-start gap-2 p-3 rounded-xl text-sm',
        config.color === 'green' && 'bg-green-500/10 border border-green-500/20',
        config.color === 'blue' && 'bg-blue-500/10 border border-blue-500/20',
        config.color === 'orange' && 'bg-orange-500/10 border border-orange-500/20',
        config.color === 'purple' && 'bg-purple-500/10 border border-purple-500/20'
      )}>
        <Info size={16} className={clsx(
          'mt-0.5 flex-shrink-0',
          config.color === 'green' && 'text-green-400',
          config.color === 'blue' && 'text-blue-400',
          config.color === 'orange' && 'text-orange-400',
          config.color === 'purple' && 'text-purple-400'
        )} />
        <div>
          <p className="text-gray-300">{config.description}</p>
          <p className="text-gray-500 mt-1">
            Tokens: <span className="font-mono">{config.tokenMultiplier}</span>
          </p>
        </div>
      </div>

      {/* Warnings */}
      {showWarnings && (
        <>
          {value === 'selection' && !hasSelection && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-yellow-400">
                Aucune sélection - le document entier sera utilisé
              </span>
            </div>
          )}
          {(value === 'workspace' || value === 'meeting') && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm">
              <AlertTriangle size={14} className="text-orange-400" />
              <span className="text-orange-400">
                Ce scope peut consommer plus de tokens
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
