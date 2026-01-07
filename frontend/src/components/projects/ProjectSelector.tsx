// ============================================================
// CHE·NU - Project Selector
// ============================================================
// Select project for budget attribution
// Shows budget status inline
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderKanban, 
  Plus, 
  ChevronDown, 
  AlertCircle,
  Zap,
  TrendingUp
} from 'lucide-react'
import { clsx } from 'clsx'

export interface Project {
  id: string
  sphereId: string
  name: string
  description?: string
}

export interface ProjectBudget {
  projectId: string
  projectName: string
  tokenLimit: number
  usedTokens: number
  remainingTokens: number
  usagePercent: number
  isOverBudget: boolean
  isWarning: boolean
}

interface ProjectSelectorProps {
  projects: Project[]
  budgets: Record<string, ProjectBudget>
  value: string | null
  onChange: (projectId: string | null) => void
  sphereId?: string
  disabled?: boolean
  onCreateProject?: () => void
  compact?: boolean
}

export function ProjectSelector({
  projects,
  budgets,
  value,
  onChange,
  sphereId,
  disabled = false,
  onCreateProject,
  compact = false
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const filteredProjects = sphereId 
    ? projects.filter(p => p.sphereId === sphereId)
    : projects
  
  const selectedProject = value 
    ? projects.find(p => p.id === value) 
    : null
  
  const selectedBudget = value ? budgets[value] : null

  if (compact) {
    return (
      <CompactProjectSelector
        projects={filteredProjects}
        budgets={budgets}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition-all',
          isOpen ? 'border-purple-500/50 bg-purple-500/10' : 'border-gray-700 bg-gray-800/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            selectedProject ? 'bg-purple-500/20' : 'bg-gray-700/50'
          )}>
            <FolderKanban size={20} className={selectedProject ? 'text-purple-400' : 'text-gray-400'} />
          </div>
          <div className="text-left">
            <p className={clsx(
              'font-medium',
              selectedProject ? 'text-white' : 'text-gray-400'
            )}>
              {selectedProject ? selectedProject.name : 'Aucun projet'}
            </p>
            {selectedBudget && (
              <BudgetMini budget={selectedBudget} />
            )}
            {!selectedProject && (
              <p className="text-xs text-gray-500">Les tokens ne seront pas attribués</p>
            )}
          </div>
        </div>
        <ChevronDown 
          size={20} 
          className={clsx(
            'text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-xl border border-gray-700 bg-gray-800 shadow-xl overflow-hidden"
          >
            {/* Unassigned Option */}
            <button
              onClick={() => { onChange(null); setIsOpen(false) }}
              className={clsx(
                'w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 transition-colors',
                !value && 'bg-purple-500/10'
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                <FolderKanban size={16} className="text-gray-500" />
              </div>
              <div className="text-left">
                <p className="text-gray-300 font-medium">Aucun projet</p>
                <p className="text-xs text-gray-500">Tokens non attribués</p>
              </div>
            </button>

            {/* Projects */}
            {filteredProjects.length > 0 && (
              <div className="border-t border-gray-700/50 max-h-60 overflow-y-auto">
                {filteredProjects.map(project => {
                  const budget = budgets[project.id]
                  const isSelected = value === project.id
                  
                  return (
                    <button
                      key={project.id}
                      onClick={() => { onChange(project.id); setIsOpen(false) }}
                      className={clsx(
                        'w-full flex items-center gap-3 p-3 hover:bg-gray-700/50 transition-colors',
                        isSelected && 'bg-purple-500/10'
                      )}
                    >
                      <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        budget?.isOverBudget ? 'bg-red-500/20' : budget?.isWarning ? 'bg-yellow-500/20' : 'bg-purple-500/20'
                      )}>
                        <FolderKanban size={16} className={clsx(
                          budget?.isOverBudget ? 'text-red-400' : budget?.isWarning ? 'text-yellow-400' : 'text-purple-400'
                        )} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium">{project.name}</p>
                        {budget && <BudgetMini budget={budget} />}
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Create New */}
            {onCreateProject && (
              <button
                onClick={() => { onCreateProject(); setIsOpen(false) }}
                className="w-full flex items-center gap-2 p-3 border-t border-gray-700/50 text-purple-400 hover:bg-purple-500/10 transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Créer un projet</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function BudgetMini({ budget }: { budget: ProjectBudget }) {
  const getColor = () => {
    if (budget.isOverBudget) return 'text-red-400'
    if (budget.isWarning) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <div className={clsx('flex items-center gap-2 text-xs', getColor())}>
      <Zap size={10} />
      <span className="font-mono">
        {budget.usedTokens.toLocaleString()} / {budget.tokenLimit.toLocaleString()}
      </span>
      <span className="text-gray-500">({budget.usagePercent}%)</span>
      {budget.isOverBudget && <AlertCircle size={10} />}
    </div>
  )
}

function CompactProjectSelector({
  projects,
  budgets,
  value,
  onChange,
  disabled
}: {
  projects: Project[]
  budgets: Record<string, ProjectBudget>
  value: string | null
  onChange: (projectId: string | null) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <FolderKanban size={14} className="text-gray-500" />
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
        className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-300"
      >
        <option value="">Aucun projet</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} {budgets[p.id] ? `(${budgets[p.id].usagePercent}%)` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
