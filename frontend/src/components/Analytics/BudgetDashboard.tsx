// ============================================================
// CHE·NU - Budget Analytics Dashboard
// ============================================================
// Complete dashboard: Top projects, trends, teams, reallocation
// Enterprise-ready analytics
// ============================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FolderKanban,
  Layers,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  DollarSign,
  Zap,
  Calendar,
  Building,
  ChevronRight,
  Filter
} from 'lucide-react'
import { clsx } from 'clsx'

// ============================================================
// TYPES
// ============================================================

interface ProjectCostReport {
  projectId: string
  projectName: string
  sphereId: string
  totalTokens: number
  totalCostUSD: number
  actionCount: number
  meetingCount: number
  avgTokensPerAction: number
  budgetLimit: number | null
  budgetUsedPercent: number | null
  tokensLast7Days: number
  dailyAverage: number
  rank: number
}

interface UsageSummary {
  totalTokens: number
  totalCostUSD: number
  actionCount: number
  meetingCount: number
  uniqueProjects: number
  avgTokensPerAction: number
  peakDay: { date: string; tokens: number } | null
  periodDays: number
}

interface TrendPoint {
  period: string
  tokens: number
  costUSD: number
  actionCount: number
}

interface ReallocationSuggestion {
  id: string
  type: string
  source: { id: string; name: string; remaining: number; usagePercent: number }
  target: { id: string; name: string; needed: number; usagePercent: number }
  suggestedAmount: number
  reason: string
  confidence: string
  status: string
}

interface DashboardProps {
  sphereId?: string
  onProjectSelect?: (projectId: string) => void
  onTeamSelect?: (teamId: string) => void
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

export function BudgetDashboard({
  sphereId,
  onProjectSelect,
  onTeamSelect
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'teams' | 'reallocation'>('overview')
  const [periodDays, setPeriodDays] = useState(30)
  const [loading, setLoading] = useState(false)
  
  // Mock data - replace with API calls
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [topProjects, setTopProjects] = useState<ProjectCostReport[]>([])
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [suggestions, setSuggestions] = useState<ReallocationSuggestion[]>([])

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      setSummary({
        totalTokens: 125_432,
        totalCostUSD: 15.24,
        actionCount: 342,
        meetingCount: 28,
        uniqueProjects: 8,
        avgTokensPerAction: 367,
        peakDay: { date: "2025-01-10", tokens: 12_500 },
        periodDays: 30
      })
      setTopProjects([
        { projectId: "1", projectName: "Rénovation Maison", sphereId: "construction", totalTokens: 45_000, totalCostUSD: 5.40, actionCount: 120, meetingCount: 8, avgTokensPerAction: 375, budgetLimit: 60_000, budgetUsedPercent: 75, tokensLast7Days: 12_000, dailyAverage: 1500, rank: 1 },
        { projectId: "2", projectName: "Extension Garage", sphereId: "construction", totalTokens: 32_000, totalCostUSD: 3.84, actionCount: 85, meetingCount: 5, avgTokensPerAction: 376, budgetLimit: 50_000, budgetUsedPercent: 64, tokensLast7Days: 8_000, dailyAverage: 1067, rank: 2 },
        { projectId: "3", projectName: "Toiture", sphereId: "construction", totalTokens: 28_432, totalCostUSD: 3.41, actionCount: 78, meetingCount: 6, avgTokensPerAction: 364, budgetLimit: 30_000, budgetUsedPercent: 95, tokensLast7Days: 5_000, dailyAverage: 948, rank: 3 },
        { projectId: "4", projectName: "Plomberie", sphereId: "construction", totalTokens: 12_000, totalCostUSD: 1.44, actionCount: 35, meetingCount: 3, avgTokensPerAction: 343, budgetLimit: 25_000, budgetUsedPercent: 48, tokensLast7Days: 3_000, dailyAverage: 400, rank: 4 },
        { projectId: "5", projectName: "Électricité", sphereId: "construction", totalTokens: 8_000, totalCostUSD: 0.96, actionCount: 24, meetingCount: 2, avgTokensPerAction: 333, budgetLimit: 20_000, budgetUsedPercent: 40, tokensLast7Days: 2_000, dailyAverage: 267, rank: 5 },
      ])
      setTrends([
        { period: "2025-01-01", tokens: 3200, costUSD: 0.38, actionCount: 12 },
        { period: "2025-01-02", tokens: 4100, costUSD: 0.49, actionCount: 15 },
        { period: "2025-01-03", tokens: 2800, costUSD: 0.34, actionCount: 10 },
        { period: "2025-01-04", tokens: 5200, costUSD: 0.62, actionCount: 18 },
        { period: "2025-01-05", tokens: 4800, costUSD: 0.58, actionCount: 16 },
        { period: "2025-01-06", tokens: 3500, costUSD: 0.42, actionCount: 13 },
        { period: "2025-01-07", tokens: 6100, costUSD: 0.73, actionCount: 20 },
      ])
      setSuggestions([
        {
          id: "realloc_1",
          type: "project_to_project",
          source: { id: "4", name: "Plomberie", remaining: 13000, usagePercent: 48 },
          target: { id: "3", name: "Toiture", needed: 1568, usagePercent: 95 },
          suggestedAmount: 3250,
          reason: "Projet 'Toiture' à 95% du budget",
          confidence: "high",
          status: "pending"
        }
      ])
      setLoading(false)
    }, 500)
  }, [periodDays, sphereId])

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'projects', label: 'Projets', icon: FolderKanban },
    { id: 'teams', label: 'Équipes', icon: Users },
    { id: 'reallocation', label: 'Réallocation', icon: RefreshCw, badge: suggestions.filter(s => s.status === 'pending').length }
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 Analytics Dashboard</h1>
          <p className="text-gray-400">Analyse des coûts et budgets</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-gray-500" />
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
          >
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>90 derniers jours</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-800/50 rounded-xl w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isActive ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'
              )}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingState />
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab summary={summary} trends={trends} topProjects={topProjects.slice(0, 3)} />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab projects={topProjects} onSelect={onProjectSelect} />
            )}
            {activeTab === 'teams' && (
              <TeamsTab onSelect={onTeamSelect} />
            )}
            {activeTab === 'reallocation' && (
              <ReallocationTab suggestions={suggestions} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// TAB COMPONENTS
// ============================================================

function OverviewTab({ 
  summary, 
  trends, 
  topProjects 
}: { 
  summary: UsageSummary | null
  trends: TrendPoint[]
  topProjects: ProjectCostReport[]
}) {
  if (!summary) return null

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Zap size={20} />}
          label="Tokens utilisés"
          value={summary.totalTokens.toLocaleString()}
          trend={12}
          color="blue"
        />
        <SummaryCard
          icon={<DollarSign size={20} />}
          label="Coût total"
          value={`$${summary.totalCostUSD.toFixed(2)}`}
          trend={8}
          color="green"
        />
        <SummaryCard
          icon={<BarChart3 size={20} />}
          label="Actions"
          value={summary.actionCount.toString()}
          trend={-5}
          color="purple"
        />
        <SummaryCard
          icon={<FolderKanban size={20} />}
          label="Projets actifs"
          value={summary.uniqueProjects.toString()}
          color="orange"
        />
      </div>

      {/* Trends Chart */}
      <div className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/30">
        <h3 className="text-lg font-semibold text-white mb-4">📈 Tendance d'utilisation</h3>
        <TrendsChart data={trends} />
      </div>

      {/* Top Projects Preview */}
      <div className="p-6 rounded-xl border border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">🏆 Top Projets</h3>
          <span className="text-sm text-gray-500">Par tokens</span>
        </div>
        <div className="space-y-3">
          {topProjects.map(project => (
            <TopProjectRow key={project.projectId} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectsTab({ 
  projects, 
  onSelect 
}: { 
  projects: ProjectCostReport[]
  onSelect?: (projectId: string) => void 
}) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800/50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">#</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Projet</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Tokens</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Coût</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Budget</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">7j</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, i) => (
            <tr 
              key={project.projectId}
              className={clsx(
                'border-t border-gray-700/30 hover:bg-gray-800/50 cursor-pointer transition-colors',
                i % 2 === 0 && 'bg-gray-900/20'
              )}
              onClick={() => onSelect?.(project.projectId)}
            >
              <td className="px-4 py-3">
                <span className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  project.rank === 1 && 'bg-yellow-500/20 text-yellow-400',
                  project.rank === 2 && 'bg-gray-500/20 text-gray-300',
                  project.rank === 3 && 'bg-orange-500/20 text-orange-400',
                  project.rank > 3 && 'bg-gray-700/50 text-gray-500'
                )}>
                  {project.rank}
                </span>
              </td>
              <td className="px-4 py-3">
                <p className="text-white font-medium">{project.projectName}</p>
              </td>
              <td className="px-4 py-3 font-mono text-sm text-gray-300">
                {project.totalTokens.toLocaleString()}
              </td>
              <td className="px-4 py-3 font-mono text-sm text-green-400">
                ${project.totalCostUSD.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {project.actionCount}
              </td>
              <td className="px-4 py-3">
                {project.budgetUsedPercent !== null && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={clsx(
                          'h-full rounded-full',
                          project.budgetUsedPercent >= 90 ? 'bg-red-500' :
                          project.budgetUsedPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        )}
                        style={{ width: `${Math.min(100, project.budgetUsedPercent)}%` }}
                      />
                    </div>
                    <span className={clsx(
                      'text-xs font-mono',
                      project.budgetUsedPercent >= 90 ? 'text-red-400' :
                      project.budgetUsedPercent >= 70 ? 'text-yellow-400' : 'text-gray-400'
                    )}>
                      {project.budgetUsedPercent}%
                    </span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {project.tokensLast7Days.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <ChevronRight size={16} className="text-gray-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TeamsTab({ onSelect }: { onSelect?: (teamId: string) => void }) {
  const teams = [
    { id: "1", name: "Équipe Terrain", departmentName: "Construction", members: 8, usagePercent: 65, tokens: 32000 },
    { id: "2", name: "Équipe Bureau", departmentName: "Administration", members: 4, usagePercent: 45, tokens: 18000 },
    { id: "3", name: "Équipe Design", departmentName: "Conception", members: 3, usagePercent: 82, tokens: 41000 },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map(team => (
        <div
          key={team.id}
          onClick={() => onSelect?.(team.id)}
          className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users size={20} className="text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{team.name}</h4>
              <p className="text-xs text-gray-500">{team.departmentName}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Membres</span>
              <span className="text-white">{team.members}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tokens</span>
              <span className="font-mono text-white">{team.tokens.toLocaleString()}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Budget</span>
                <span className={clsx(
                  team.usagePercent >= 80 ? 'text-yellow-400' : 'text-gray-400'
                )}>{team.usagePercent}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={clsx(
                    'h-full rounded-full',
                    team.usagePercent >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                  )}
                  style={{ width: `${team.usagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReallocationTab({ suggestions }: { suggestions: ReallocationSuggestion[] }) {
  const pending = suggestions.filter(s => s.status === 'pending')

  if (pending.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Aucune suggestion</h3>
        <p className="text-gray-500">Tous les budgets sont équilibrés</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pending.map(suggestion => (
        <div
          key={suggestion.id}
          className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <RefreshCw size={20} className="text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Réallocation suggérée</h4>
                <p className="text-sm text-gray-400">{suggestion.reason}</p>
              </div>
            </div>
            <span className={clsx(
              'px-2 py-1 rounded-lg text-xs',
              suggestion.confidence === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            )}>
              Confiance {suggestion.confidence}
            </span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg mb-4">
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-400">Source</p>
              <p className="font-semibold text-white">{suggestion.source.name}</p>
              <p className="text-xs text-green-400">{suggestion.source.remaining.toLocaleString()} dispo</p>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight size={20} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-mono mt-1">
                {suggestion.suggestedAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-400">Cible</p>
              <p className="font-semibold text-white">{suggestion.target.name}</p>
              <p className="text-xs text-red-400">{suggestion.target.usagePercent}% utilisé</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
              <Check size={16} />
              Accepter
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 transition-colors">
              <X size={16} />
              Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function SummaryCard({
  icon,
  label,
  value,
  trend,
  color
}: {
  icon: React.ReactNode
  label: string
  value: string
  trend?: number
  color: string
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400'
  }

  return (
    <div className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/30">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colors[color])}>
        {icon}
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend !== undefined && (
          <span className={clsx(
            'flex items-center text-xs font-medium mb-1',
            trend >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}

function TrendsChart({ data }: { data: TrendPoint[] }) {
  const maxTokens = Math.max(...data.map(d => d.tokens))
  
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((point, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full bg-purple-500/30 rounded-t hover:bg-purple-500/50 transition-colors"
            style={{ height: `${(point.tokens / maxTokens) * 100}%` }}
          />
          <span className="text-xs text-gray-500">
            {point.period.split('-')[2]}
          </span>
        </div>
      ))}
    </div>
  )
}

function TopProjectRow({ project }: { project: ProjectCostReport }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
      <span className={clsx(
        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
        project.rank === 1 && 'bg-yellow-500/20 text-yellow-400',
        project.rank === 2 && 'bg-gray-500/20 text-gray-300',
        project.rank === 3 && 'bg-orange-500/20 text-orange-400'
      )}>
        {project.rank}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{project.projectName}</p>
      </div>
      <span className="font-mono text-sm text-gray-400">
        {project.totalTokens.toLocaleString()}
      </span>
      {project.budgetUsedPercent !== null && project.budgetUsedPercent >= 80 && (
        <AlertTriangle size={14} className="text-yellow-400" />
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin">
        <RefreshCw size={32} className="text-purple-400" />
      </div>
    </div>
  )
}
