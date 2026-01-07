/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENT LIST PAGE                                 ║
 * ║                    Task B2.2: Agent management with engagement                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { 
  Bot, Search, Filter, Grid, List, Plus,
  Sparkles, Zap, Shield, Coins, Activity
} from 'lucide-react'
import { useAgentsStore } from '@/stores'
import AgentCard, { NovaCard } from '@/components/agents/AgentCard'
import { useToast } from '@/components/ui/Toast'
import type { SphereId, AgentLevel, AgentStatus, Agent } from '@/types'

interface AgentListPageProps {
  sphereId: SphereId
}

export default function AgentListPage({ sphereId }: AgentListPageProps) {
  const { availableAgents, hiredAgents, hireAgent, fireAgent, isLoading } = useAgentsStore()
  const { success, error } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState<AgentLevel | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<AgentStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showEngageModal, setShowEngageModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Filter agents for this sphere
  const sphereAgents = useMemo(() => {
    return availableAgents
      .filter(agent => 
        agent.sphere_id === sphereId || 
        agent.level === 'L0' || 
        agent.level === 'L1'
      )
      .filter(agent => {
        if (filterLevel !== 'all' && agent.level !== filterLevel) return false
        if (filterStatus !== 'all' && agent.status !== filterStatus) return false
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            agent.name.toLowerCase().includes(query) ||
            agent.description?.toLowerCase().includes(query)
          )
        }
        return true
      })
  }, [availableAgents, sphereId, searchQuery, filterLevel, filterStatus])

  // Group by level
  const agentsByLevel = useMemo(() => {
    const groups: Record<AgentLevel, Agent[]> = {
      L0: [],
      L1: [],
      L2: [],
      L3: [],
    }
    sphereAgents.forEach(agent => {
      groups[agent.level].push(agent)
    })
    return groups
  }, [sphereAgents])

  const handleEngage = async (agent: Agent) => {
    try {
      await hireAgent(agent.id)
      success('Agent engagé', `${agent.name} est maintenant actif`)
    } catch (err) {
      error('Erreur', 'Impossible d\'engager cet agent')
    }
  }

  const handleFire = async (agent: Agent) => {
    try {
      await fireAgent(agent.id)
      success('Agent libéré', `${agent.name} a été désengagé`)
    } catch (err) {
      error('Erreur', 'Impossible de libérer cet agent')
    }
  }

  // Stats
  const stats = {
    total: sphereAgents.length,
    active: sphereAgents.filter(a => a.status === 'active' || a.status === 'busy').length,
    hired: hiredAgents.filter(a => a.sphere_id === sphereId).length,
    totalCost: hiredAgents
      .filter(a => a.sphere_id === sphereId)
      .reduce((sum, a) => sum + a.cost, 0),
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-soft-sand">
              Agents Disponibles
            </h2>
            <p className="text-sm text-ancient-stone">
              Engagez des agents pour accomplir vos tâches
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-soft-sand' : 'text-ancient-stone'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-soft-sand' : 'text-ancient-stone'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            icon={Bot}
            label="Total"
            value={stats.total}
            color="text-cenote-turquoise"
          />
          <StatCard
            icon={Activity}
            label="Actifs"
            value={stats.active}
            color="text-jungle-emerald"
          />
          <StatCard
            icon={Zap}
            label="Engagés"
            value={stats.hired}
            color="text-earth-ember"
          />
          <StatCard
            icon={Coins}
            label="Coût/req"
            value={stats.totalCost}
            suffix=" tk"
            color="text-sacred-gold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ancient-stone" />
            <input
              type="text"
              placeholder="Rechercher un agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-10"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as AgentLevel | 'all')}
            className="input"
          >
            <option value="all">Tous niveaux</option>
            <option value="L0">L0 - Nova</option>
            <option value="L1">L1 - Orchestrator</option>
            <option value="L2">L2 - Specialist</option>
            <option value="L3">L3 - Worker</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AgentStatus | 'all')}
            className="input"
          >
            <option value="all">Tous statuts</option>
            <option value="idle">En attente</option>
            <option value="active">Actif</option>
            <option value="busy">Occupé</option>
            <option value="paused">Pause</option>
          </select>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto">
        {/* Nova Section (L0) - Always first */}
        {agentsByLevel.L0.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-sacred-gold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nova (L0) - Intelligence Système
            </h3>
            <NovaCard />
          </div>
        )}

        {/* Orchestrators (L1) */}
        {agentsByLevel.L1.length > 0 && (
          <AgentSection
            title="Orchestrators (L1)"
            subtitle="Coordinateurs de tâches"
            agents={agentsByLevel.L1}
            viewMode={viewMode}
            onEngage={handleEngage}
            onFire={handleFire}
            color="text-sphere-studio"
          />
        )}

        {/* Specialists (L2) */}
        {agentsByLevel.L2.length > 0 && (
          <AgentSection
            title="Specialists (L2)"
            subtitle="Agents spécialisés"
            agents={agentsByLevel.L2}
            viewMode={viewMode}
            onEngage={handleEngage}
            onFire={handleFire}
            color="text-cenote-turquoise"
          />
        )}

        {/* Workers (L3) */}
        {agentsByLevel.L3.length > 0 && (
          <AgentSection
            title="Workers (L3)"
            subtitle="Agents d'exécution"
            agents={agentsByLevel.L3}
            viewMode={viewMode}
            onEngage={handleEngage}
            onFire={handleFire}
            color="text-jungle-emerald"
          />
        )}

        {/* Empty State */}
        {sphereAgents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-jungle-emerald/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-jungle-emerald/50" />
            </div>
            <h4 className="text-lg font-medium text-soft-sand mb-2">Aucun agent trouvé</h4>
            <p className="text-sm text-ancient-stone max-w-xs">
              {searchQuery 
                ? 'Essayez une autre recherche'
                : 'Aucun agent disponible pour cette sphère'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  color: string
}) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-ancient-stone">{label}</span>
      </div>
      <div className="text-2xl font-display font-semibold text-soft-sand">
        {value}{suffix}
      </div>
    </div>
  )
}

// Agent Section Component
function AgentSection({
  title,
  subtitle,
  agents,
  viewMode,
  onEngage,
  onFire,
  color,
}: {
  title: string
  subtitle: string
  agents: Agent[]
  viewMode: 'grid' | 'list'
  onEngage: (agent: Agent) => void
  onFire: (agent: Agent) => void
  color: string
}) {
  return (
    <div className="mb-6">
      <h3 className={`text-sm font-medium ${color} mb-1`}>{title}</h3>
      <p className="text-xs text-ancient-stone mb-3">{subtitle}</p>
      
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      }>
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            compact={viewMode === 'list'}
            onEngage={() => onEngage(agent)}
            onStop={() => onFire(agent)}
          />
        ))}
      </div>
    </div>
  )
}
