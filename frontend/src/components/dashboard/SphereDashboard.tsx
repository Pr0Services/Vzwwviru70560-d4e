/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — SPHERE DASHBOARD                                ║
 * ║                    Task B4.1: Customizable sphere dashboard with widgets      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { 
  LayoutGrid, Plus, Settings, Maximize2, Minimize2,
  MessageSquare, Bot, FileText, Calendar, TrendingUp,
  Clock, Star, Zap, Users, Coins, Activity, Target,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, GripVertical, X, ChevronRight, Sparkles
} from 'lucide-react'
import { SPHERE_CONFIG, type SphereId } from '@/types'
import { useThreadsStore, useAgentsStore, useGovernanceStore } from '@/stores'
import { formatTokens, formatDistanceToNow } from '@/utils'

interface Widget {
  id: string
  type: WidgetType
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
}

type WidgetType = 
  | 'threads-recent' 
  | 'agents-active' 
  | 'tokens-usage' 
  | 'activity-chart'
  | 'quick-stats'
  | 'calendar-upcoming'
  | 'files-recent'
  | 'nova-insights'

interface SphereDashboardProps {
  sphereId: SphereId
  onNavigate?: (path: string) => void
}

export default function SphereDashboard({
  sphereId,
  onNavigate,
}: SphereDashboardProps) {
  const sphere = SPHERE_CONFIG[sphereId]
  const { threads } = useThreadsStore()
  const { hiredAgents } = useAgentsStore()
  const { tokenBudget } = useGovernanceStore()

  const [widgets, setWidgets] = useState<Widget[]>(getDefaultWidgets(sphereId))
  const [isEditing, setIsEditing] = useState(false)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  // Filter data for this sphere
  const sphereThreads = threads.filter(t => t.sphere_id === sphereId)
  const sphereAgents = hiredAgents.filter(a => a.sphere_id === sphereId)

  // Stats
  const stats = useMemo(() => ({
    totalThreads: sphereThreads.length,
    activeThreads: sphereThreads.filter(t => t.status === 'active').length,
    totalAgents: sphereAgents.length,
    tokensUsed: tokenBudget?.used || 0,
    tokensLimit: tokenBudget?.limit || 100000,
  }), [sphereThreads, sphereAgents, tokenBudget])

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type,
      title: getWidgetTitle(type),
      size: 'medium',
      position: { x: 0, y: widgets.length },
    }
    setWidgets([...widgets, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id))
  }

  const resizeWidget = (id: string, size: Widget['size']) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, size } : w))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${sphere.color}20` }}
          >
            <LayoutGrid className="w-5 h-5" style={{ color: sphere.color }} />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-soft-sand">
              Dashboard {sphere.name}
            </h1>
            <p className="text-xs text-ancient-stone">
              {stats.activeThreads} threads actifs • {stats.totalAgents} agents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              btn-outline flex items-center gap-2
              ${isEditing ? 'bg-cenote-turquoise/20 border-cenote-turquoise/50 text-cenote-turquoise' : ''}
            `}
          >
            <Settings className="w-4 h-4" />
            {isEditing ? 'Terminer' : 'Personnaliser'}
          </button>
          {isEditing && (
            <button
              onClick={() => {/* Open widget picker */}}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Widget
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/5">
        <QuickStatCard
          icon={MessageSquare}
          label="Threads"
          value={stats.totalThreads}
          change={+12}
          color={sphere.color}
        />
        <QuickStatCard
          icon={Bot}
          label="Agents"
          value={stats.totalAgents}
          change={+2}
          color="#27AE60"
        />
        <QuickStatCard
          icon={Coins}
          label="Tokens"
          value={formatTokens(stats.tokensUsed)}
          subValue={`/ ${formatTokens(stats.tokensLimit)}`}
          color="#F4D03F"
        />
        <QuickStatCard
          icon={Activity}
          label="Activité"
          value="Haute"
          color="#1ABC9C"
        />
      </div>

      {/* Widget Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-4 auto-rows-min">
          {widgets.map((widget) => (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              sphereId={sphereId}
              isEditing={isEditing}
              isExpanded={expandedWidget === widget.id}
              onExpand={() => setExpandedWidget(expandedWidget === widget.id ? null : widget.id)}
              onRemove={() => removeWidget(widget.id)}
              onResize={(size) => resizeWidget(widget.id, size)}
              onNavigate={onNavigate}
            />
          ))}

          {/* Add Widget Button (when editing) */}
          {isEditing && (
            <AddWidgetCard onAdd={addWidget} />
          )}
        </div>
      </div>
    </div>
  )
}

// Quick Stat Card
function QuickStatCard({
  icon: Icon,
  label,
  value,
  subValue,
  change,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  subValue?: string
  change?: number
  color: string
}) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" style={{ color }} />
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-jungle-emerald' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-display font-semibold text-soft-sand">
        {value}
        {subValue && <span className="text-sm text-ancient-stone ml-1">{subValue}</span>}
      </div>
      <div className="text-xs text-ancient-stone">{label}</div>
    </div>
  )
}

// Widget Container
function WidgetContainer({
  widget,
  sphereId,
  isEditing,
  isExpanded,
  onExpand,
  onRemove,
  onResize,
  onNavigate,
}: {
  widget: Widget
  sphereId: SphereId
  isEditing: boolean
  isExpanded: boolean
  onExpand: () => void
  onRemove: () => void
  onResize: (size: Widget['size']) => void
  onNavigate?: (path: string) => void
}) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
  }

  return (
    <div className={`
      rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden
      ${sizeClasses[widget.size]}
      ${isEditing ? 'ring-2 ring-cenote-turquoise/30 ring-dashed' : ''}
      ${isExpanded ? 'fixed inset-8 z-50 col-span-1 row-span-1' : ''}
    `}>
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        {isEditing && (
          <GripVertical className="w-4 h-4 text-ancient-stone cursor-grab mr-2" />
        )}
        <span className="text-sm font-medium text-soft-sand flex-1">{widget.title}</span>
        <div className="flex items-center gap-1">
          {!isEditing && (
            <button
              onClick={onExpand}
              className="p-1 rounded hover:bg-white/5 text-ancient-stone"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
          {isEditing && (
            <>
              <select
                value={widget.size}
                onChange={(e) => onResize(e.target.value as Widget['size'])}
                className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-ancient-stone"
              >
                <option value="small">Petit</option>
                <option value="medium">Moyen</option>
                <option value="large">Grand</option>
              </select>
              <button
                onClick={onRemove}
                className="p-1 rounded hover:bg-red-500/20 text-ancient-stone hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        <WidgetContent 
          type={widget.type} 
          sphereId={sphereId} 
          size={widget.size}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  )
}

// Widget Content Router
function WidgetContent({
  type,
  sphereId,
  size,
  onNavigate,
}: {
  type: WidgetType
  sphereId: SphereId
  size: Widget['size']
  onNavigate?: (path: string) => void
}) {
  switch (type) {
    case 'threads-recent':
      return <RecentThreadsWidget sphereId={sphereId} onNavigate={onNavigate} />
    case 'agents-active':
      return <ActiveAgentsWidget sphereId={sphereId} />
    case 'tokens-usage':
      return <TokenUsageWidget />
    case 'activity-chart':
      return <ActivityChartWidget />
    case 'quick-stats':
      return <QuickStatsWidget sphereId={sphereId} />
    case 'calendar-upcoming':
      return <CalendarWidget />
    case 'files-recent':
      return <RecentFilesWidget />
    case 'nova-insights':
      return <NovaInsightsWidget sphereId={sphereId} />
    default:
      return <div className="text-ancient-stone">Widget non trouvé</div>
  }
}

// Recent Threads Widget
function RecentThreadsWidget({ 
  sphereId, 
  onNavigate 
}: { 
  sphereId: SphereId
  onNavigate?: (path: string) => void 
}) {
  const { threads } = useThreadsStore()
  const sphereThreads = threads
    .filter(t => t.sphere_id === sphereId)
    .slice(0, 5)

  return (
    <div className="space-y-2">
      {sphereThreads.length === 0 ? (
        <p className="text-sm text-ancient-stone">Aucun thread récent</p>
      ) : (
        sphereThreads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onNavigate?.(`/sphere/${sphereId}/thread/${thread.id}`)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left group"
          >
            <MessageSquare className="w-4 h-4 text-cenote-turquoise" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-soft-sand truncate">{thread.title}</p>
              <p className="text-xs text-ancient-stone">{formatDistanceToNow(thread.updated_at)}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-ancient-stone opacity-0 group-hover:opacity-100" />
          </button>
        ))
      )}
    </div>
  )
}

// Active Agents Widget
function ActiveAgentsWidget({ sphereId }: { sphereId: SphereId }) {
  const { hiredAgents } = useAgentsStore()
  const sphereAgents = hiredAgents
    .filter(a => a.sphere_id === sphereId || a.level === 'L1')
    .slice(0, 4)

  return (
    <div className="space-y-2">
      {sphereAgents.length === 0 ? (
        <p className="text-sm text-ancient-stone">Aucun agent actif</p>
      ) : (
        sphereAgents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <Bot className="w-4 h-4 text-jungle-emerald" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-soft-sand truncate">{agent.name}</p>
              <p className="text-xs text-ancient-stone">{agent.level}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-jungle-emerald animate-pulse" />
          </div>
        ))
      )}
    </div>
  )
}

// Token Usage Widget
function TokenUsageWidget() {
  const { tokenBudget } = useGovernanceStore()
  const used = tokenBudget?.used || 0
  const limit = tokenBudget?.limit || 100000
  const percentage = (used / limit) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-display font-semibold text-soft-sand">
          {formatTokens(used)}
        </span>
        <span className="text-sm text-ancient-stone">/ {formatTokens(limit)}</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-earth-ember' : 'bg-sacred-gold'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-soft-sand">{Math.round(percentage)}%</p>
          <p className="text-xs text-ancient-stone">Utilisé</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-jungle-emerald">{formatTokens(limit - used)}</p>
          <p className="text-xs text-ancient-stone">Restant</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-cenote-turquoise">~15j</p>
          <p className="text-xs text-ancient-stone">Estimé</p>
        </div>
      </div>
    </div>
  )
}

// Activity Chart Widget (Simplified)
function ActivityChartWidget() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const data = [65, 80, 45, 90, 70, 30, 20]
  const maxValue = Math.max(...data)

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between h-24 gap-1">
        {data.map((value, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t bg-cenote-turquoise/60 hover:bg-cenote-turquoise transition-colors"
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-ancient-stone">{days[idx]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-ancient-stone">
        <span>Cette semaine</span>
        <span className="text-jungle-emerald">+23% vs semaine dernière</span>
      </div>
    </div>
  )
}

// Quick Stats Widget
function QuickStatsWidget({ sphereId }: { sphereId: SphereId }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 rounded-lg bg-white/5">
        <Target className="w-4 h-4 text-sacred-gold mb-2" />
        <p className="text-lg font-semibold text-soft-sand">12</p>
        <p className="text-xs text-ancient-stone">Tâches complétées</p>
      </div>
      <div className="p-3 rounded-lg bg-white/5">
        <Clock className="w-4 h-4 text-cenote-turquoise mb-2" />
        <p className="text-lg font-semibold text-soft-sand">4.5h</p>
        <p className="text-xs text-ancient-stone">Temps actif</p>
      </div>
      <div className="p-3 rounded-lg bg-white/5">
        <Star className="w-4 h-4 text-earth-ember mb-2" />
        <p className="text-lg font-semibold text-soft-sand">8</p>
        <p className="text-xs text-ancient-stone">Favoris</p>
      </div>
      <div className="p-3 rounded-lg bg-white/5">
        <Users className="w-4 h-4 text-jungle-emerald mb-2" />
        <p className="text-lg font-semibold text-soft-sand">3</p>
        <p className="text-xs text-ancient-stone">Collaborateurs</p>
      </div>
    </div>
  )
}

// Calendar Widget
function CalendarWidget() {
  const events = [
    { id: '1', title: 'Réunion équipe', time: '14:00', type: 'meeting' },
    { id: '2', title: 'Review Q4', time: '16:30', type: 'review' },
    { id: '3', title: 'Deadline rapport', time: '18:00', type: 'deadline' },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs text-ancient-stone mb-3">Aujourd'hui</p>
      {events.map((event) => (
        <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
          <div className={`
            w-1 h-8 rounded-full
            ${event.type === 'meeting' ? 'bg-cenote-turquoise' : 
              event.type === 'review' ? 'bg-sacred-gold' : 'bg-red-500'}
          `} />
          <div className="flex-1">
            <p className="text-sm text-soft-sand">{event.title}</p>
            <p className="text-xs text-ancient-stone">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Recent Files Widget
function RecentFilesWidget() {
  const files = [
    { id: '1', name: 'rapport_q4.pdf', type: 'pdf', size: '2.4 MB' },
    { id: '2', name: 'budget_2025.xlsx', type: 'excel', size: '1.1 MB' },
    { id: '3', name: 'notes.md', type: 'markdown', size: '45 KB' },
  ]

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
          <FileText className="w-4 h-4 text-earth-ember" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-soft-sand truncate">{file.name}</p>
            <p className="text-xs text-ancient-stone">{file.size}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Nova Insights Widget
function NovaInsightsWidget({ sphereId }: { sphereId: SphereId }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20">
        <Sparkles className="w-5 h-5 text-sacred-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-soft-sand mb-1">Suggestion Nova</p>
          <p className="text-xs text-ancient-stone">
            Basé sur votre activité, vous pourriez bénéficier de l'agent "Research" 
            pour accélérer vos analyses.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-3 rounded-lg bg-cenote-turquoise/10 border border-cenote-turquoise/20">
        <TrendingUp className="w-5 h-5 text-cenote-turquoise flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-soft-sand mb-1">Tendance</p>
          <p className="text-xs text-ancient-stone">
            Votre productivité a augmenté de 23% cette semaine.
          </p>
        </div>
      </div>
    </div>
  )
}

// Add Widget Card
function AddWidgetCard({ onAdd }: { onAdd: (type: WidgetType) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const widgetTypes: { type: WidgetType; label: string; icon: React.ElementType }[] = [
    { type: 'threads-recent', label: 'Threads récents', icon: MessageSquare },
    { type: 'agents-active', label: 'Agents actifs', icon: Bot },
    { type: 'tokens-usage', label: 'Usage tokens', icon: Coins },
    { type: 'activity-chart', label: 'Activité', icon: BarChart3 },
    { type: 'quick-stats', label: 'Stats rapides', icon: Target },
    { type: 'calendar-upcoming', label: 'Calendrier', icon: Calendar },
    { type: 'files-recent', label: 'Fichiers récents', icon: FileText },
    { type: 'nova-insights', label: 'Nova Insights', icon: Sparkles },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-40 rounded-xl border-2 border-dashed border-white/20 hover:border-cenote-turquoise/50 flex flex-col items-center justify-center gap-2 text-ancient-stone hover:text-cenote-turquoise transition-colors"
      >
        <Plus className="w-8 h-8" />
        <span className="text-sm">Ajouter un widget</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-white/10 bg-ui-slate shadow-xl z-20 overflow-hidden">
            <div className="p-2 border-b border-white/5">
              <span className="text-xs text-ancient-stone">Choisir un widget</span>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {widgetTypes.map((w) => (
                <button
                  key={w.type}
                  onClick={() => { onAdd(w.type); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-left"
                >
                  <w.icon className="w-4 h-4 text-cenote-turquoise" />
                  <span className="text-sm text-soft-sand">{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Helper functions
function getDefaultWidgets(sphereId: SphereId): Widget[] {
  return [
    { id: '1', type: 'threads-recent', title: 'Threads récents', size: 'medium', position: { x: 0, y: 0 } },
    { id: '2', type: 'agents-active', title: 'Agents actifs', size: 'small', position: { x: 1, y: 0 } },
    { id: '3', type: 'tokens-usage', title: 'Budget tokens', size: 'medium', position: { x: 2, y: 0 } },
    { id: '4', type: 'nova-insights', title: 'Nova Insights', size: 'large', position: { x: 0, y: 1 } },
  ]
}

function getWidgetTitle(type: WidgetType): string {
  const titles: Record<WidgetType, string> = {
    'threads-recent': 'Threads récents',
    'agents-active': 'Agents actifs',
    'tokens-usage': 'Budget tokens',
    'activity-chart': 'Activité',
    'quick-stats': 'Stats rapides',
    'calendar-upcoming': 'Calendrier',
    'files-recent': 'Fichiers récents',
    'nova-insights': 'Nova Insights',
  }
  return titles[type]
}
