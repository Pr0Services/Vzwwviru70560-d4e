// ============================================================
// CHE·NU - Budget Overview Panel
// ============================================================
// Shows Sphere + Project budgets at a glance
// Visual hierarchy: Sphere > Projects
// ============================================================

import { motion } from 'framer-motion'
import { 
  Layers, 
  FolderKanban, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ChevronRight
} from 'lucide-react'
import { clsx } from 'clsx'

export interface SphereBudget {
  sphereId: string
  sphereName: string
  tokenLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  isOverBudget: boolean
  isWarning: boolean
  period: 'monthly' | 'total'
}

export interface ProjectBudget {
  projectId: string
  projectName: string
  sphereId: string
  tokenLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  isOverBudget: boolean
  isWarning: boolean
}

interface BudgetOverviewPanelProps {
  sphereBudget?: SphereBudget | null
  projectBudgets: ProjectBudget[]
  currentProjectId?: string | null
  onSelectProject?: (projectId: string) => void
}

export function BudgetOverviewPanel({
  sphereBudget,
  projectBudgets,
  currentProjectId,
  onSelectProject
}: BudgetOverviewPanelProps) {
  const sphereProjects = sphereBudget 
    ? projectBudgets.filter(p => p.sphereId === sphereBudget.sphereId)
    : projectBudgets

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 overflow-hidden">
      {/* Sphere Level */}
      {sphereBudget && (
        <div className={clsx(
          'p-4 border-b border-gray-700/50',
          sphereBudget.isOverBudget ? 'bg-red-500/5' : sphereBudget.isWarning ? 'bg-yellow-500/5' : 'bg-purple-500/5'
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Layers size={16} className="text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{sphereBudget.sphereName}</h4>
                <p className="text-xs text-gray-500">Budget Sphère • {sphereBudget.period === 'monthly' ? 'Mensuel' : 'Total'}</p>
              </div>
            </div>
            {sphereBudget.isOverBudget && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs">
                <AlertTriangle size={12} />
                Dépassé
              </div>
            )}
            {sphereBudget.isWarning && !sphereBudget.isOverBudget && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">
                <AlertTriangle size={12} />
                {sphereBudget.usagePercent}%
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <BudgetProgressBar 
            used={sphereBudget.usedTokens}
            limit={sphereBudget.tokenLimit}
            percent={sphereBudget.usagePercent}
            isOverBudget={sphereBudget.isOverBudget}
            isWarning={sphereBudget.isWarning}
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-3">
            <BudgetStat 
              icon={<Zap size={12} />}
              label="Utilisés"
              value={sphereBudget.usedTokens.toLocaleString()}
              color="text-blue-400"
            />
            <BudgetStat 
              icon={<TrendingUp size={12} />}
              label="Restants"
              value={sphereBudget.remainingTokens.toLocaleString()}
              color={sphereBudget.isOverBudget ? 'text-red-400' : sphereBudget.isWarning ? 'text-yellow-400' : 'text-green-400'}
            />
            <BudgetStat 
              icon={<DollarSign size={12} />}
              label="Limite"
              value={sphereBudget.tokenLimit.toLocaleString()}
              color="text-gray-400"
            />
          </div>
        </div>
      )}

      {/* Project Level */}
      {sphereProjects.length > 0 && (
        <div className="p-4">
          <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Projets ({sphereProjects.length})
          </h5>
          <div className="space-y-2">
            {sphereProjects.map(project => (
              <ProjectBudgetRow
                key={project.projectId}
                budget={project}
                isSelected={currentProjectId === project.projectId}
                onSelect={() => onSelectProject?.(project.projectId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!sphereBudget && projectBudgets.length === 0 && (
        <div className="p-8 text-center">
          <Layers size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500">Aucun budget configuré</p>
          <p className="text-xs text-gray-600 mt-1">
            Configurez un budget pour suivre vos dépenses
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function BudgetProgressBar({
  used,
  limit,
  percent,
  isOverBudget,
  isWarning
}: {
  used: number
  limit: number
  percent: number
  isOverBudget: boolean
  isWarning: boolean
}) {
  const getColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={clsx('h-full rounded-full', getColor())}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, percent)}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

function BudgetStat({
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
    <div className="text-center">
      <div className={clsx('flex items-center justify-center gap-1 mb-1', color)}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-mono text-sm text-white">{value}</p>
    </div>
  )
}

function ProjectBudgetRow({
  budget,
  isSelected,
  onSelect
}: {
  budget: ProjectBudget
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full flex items-center gap-3 p-2 rounded-lg transition-colors',
        isSelected ? 'bg-purple-500/20 ring-1 ring-purple-500/50' : 'hover:bg-gray-700/50'
      )}
    >
      <div className={clsx(
        'w-6 h-6 rounded-md flex items-center justify-center',
        budget.isOverBudget ? 'bg-red-500/20' : budget.isWarning ? 'bg-yellow-500/20' : 'bg-gray-700/50'
      )}>
        <FolderKanban size={12} className={clsx(
          budget.isOverBudget ? 'text-red-400' : budget.isWarning ? 'text-yellow-400' : 'text-gray-400'
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white font-medium truncate">{budget.projectName}</p>
          <span className={clsx(
            'text-xs font-mono ml-2',
            budget.isOverBudget ? 'text-red-400' : budget.isWarning ? 'text-yellow-400' : 'text-gray-400'
          )}>
            {budget.usagePercent}%
          </span>
        </div>
        
        {/* Mini progress bar */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
          <div 
            className={clsx(
              'h-full rounded-full transition-all',
              budget.isOverBudget ? 'bg-red-500' : budget.isWarning ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${Math.min(100, budget.usagePercent)}%` }}
          />
        </div>
      </div>
      
      <ChevronRight size={14} className="text-gray-600" />
    </button>
  )
}
