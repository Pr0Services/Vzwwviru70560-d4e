import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Cpu, ChevronDown, ChevronRight, Activity, Zap } from 'lucide-react'
import { clsx } from 'clsx'

interface Agent {
  id: string
  name: string
  role: string
  department: string
  status: 'active' | 'idle' | 'busy'
  tasks: number
}

const agentHierarchy = {
  L0: [
    { id: 'nexus-prime', name: 'NEXUS PRIME', role: 'Orchestrateur Principal', department: 'Core', status: 'active' as const, tasks: 12 },
  ],
  L1: [
    { id: 'dir-construction', name: 'Directeur Construction', role: 'Directeur', department: 'Construction', status: 'active' as const, tasks: 8 },
    { id: 'dir-finance', name: 'Directeur Finance', role: 'Directeur', department: 'Finance', status: 'active' as const, tasks: 5 },
    { id: 'dir-hr', name: 'Directeur RH', role: 'Directeur', department: 'RH', status: 'idle' as const, tasks: 2 },
    { id: 'dir-marketing', name: 'Directeur Marketing', role: 'Directeur', department: 'Marketing', status: 'active' as const, tasks: 6 },
    { id: 'dir-tech', name: 'Directeur Tech', role: 'Directeur', department: 'Tech', status: 'busy' as const, tasks: 15 },
  ],
  L2: [
    { id: 'gest-chantier', name: 'Gestionnaire Chantier', role: 'Gestionnaire', department: 'Construction', status: 'active' as const, tasks: 4 },
    { id: 'gest-estimateur', name: 'Gestionnaire Estimation', role: 'Gestionnaire', department: 'Construction', status: 'busy' as const, tasks: 7 },
    { id: 'gest-compta', name: 'Gestionnaire Comptabilité', role: 'Gestionnaire', department: 'Finance', status: 'active' as const, tasks: 3 },
    { id: 'gest-paie', name: 'Gestionnaire Paie', role: 'Gestionnaire', department: 'Finance', status: 'idle' as const, tasks: 1 },
  ],
  L3: [
    { id: 'spec-beton', name: 'Spécialiste Béton', role: 'Spécialiste', department: 'Construction', status: 'active' as const, tasks: 2 },
    { id: 'spec-electrique', name: 'Spécialiste Électrique', role: 'Spécialiste', department: 'Construction', status: 'active' as const, tasks: 3 },
    { id: 'spec-plomberie', name: 'Spécialiste Plomberie', role: 'Spécialiste', department: 'Construction', status: 'idle' as const, tasks: 0 },
    { id: 'spec-rbq', name: 'Spécialiste RBQ', role: 'Spécialiste', department: 'Conformité', status: 'active' as const, tasks: 4 },
    { id: 'spec-ccq', name: 'Spécialiste CCQ', role: 'Spécialiste', department: 'Conformité', status: 'active' as const, tasks: 2 },
    { id: 'spec-cnesst', name: 'Spécialiste CNESST', role: 'Spécialiste', department: 'Conformité', status: 'busy' as const, tasks: 6 },
  ],
}

const statusColors = {
  active: 'success',
  idle: 'default',
  busy: 'warning',
} as const

const levelColors = {
  L0: 'from-purple-500 to-pink-500',
  L1: 'from-chenu-500 to-blue-500',
  L2: 'from-green-500 to-emerald-500',
  L3: 'from-orange-500 to-yellow-500',
}

function AgentCard({ agent, level }: { agent: Agent; level: string }) {
  return (
    <Card variant="glass" padding="sm" className="hover:border-gray-700 transition-all">
      <div className="flex items-center gap-3">
        <div className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
          levelColors[level as keyof typeof levelColors]
        )}>
          <Cpu size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white text-sm truncate">{agent.name}</h4>
            <Badge variant={statusColors[agent.status]} size="sm">
              {agent.status === 'active' && <Activity size={10} className="mr-1" />}
              {agent.status === 'busy' && <Zap size={10} className="mr-1" />}
              {agent.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">{agent.department} • {agent.tasks} tâches</p>
        </div>
      </div>
    </Card>
  )
}

export function Agents() {
  const [expandedLevels, setExpandedLevels] = useState<string[]>(['L0', 'L1', 'L2', 'L3'])

  const toggleLevel = (level: string) => {
    setExpandedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  const totalAgents = Object.values(agentHierarchy).flat().length
  const activeAgents = Object.values(agentHierarchy).flat().filter(a => a.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agents IA</h1>
          <p className="text-gray-400 mt-1">168 agents organisés en 4 niveaux hiérarchiques</p>
        </div>
        <Button variant="primary">
          <Cpu size={18} className="mr-2" />
          Nouvel Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="glass" padding="sm">
          <p className="text-2xl font-bold text-white">168</p>
          <p className="text-sm text-gray-400">Agents Total</p>
        </Card>
        <Card variant="glass" padding="sm">
          <p className="text-2xl font-bold text-green-400">{activeAgents}</p>
          <p className="text-sm text-gray-400">Actifs</p>
        </Card>
        <Card variant="glass" padding="sm">
          <p className="text-2xl font-bold text-chenu-400">4</p>
          <p className="text-sm text-gray-400">Niveaux</p>
        </Card>
        <Card variant="glass" padding="sm">
          <p className="text-2xl font-bold text-orange-400">12</p>
          <p className="text-sm text-gray-400">Départements</p>
        </Card>
      </div>

      {/* Hierarchy */}
      <div className="space-y-4">
        {Object.entries(agentHierarchy).map(([level, agents]) => (
          <Card key={level} variant="glass" padding="sm">
            <button 
              onClick={() => toggleLevel(level)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br',
                  levelColors[level as keyof typeof levelColors]
                )}>
                  {level}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    {level === 'L0' && 'Orchestrateur'}
                    {level === 'L1' && 'Directeurs'}
                    {level === 'L2' && 'Gestionnaires'}
                    {level === 'L3' && 'Spécialistes'}
                  </h3>
                  <p className="text-sm text-gray-500">{agents.length} agents</p>
                </div>
              </div>
              {expandedLevels.includes(level) ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
            </button>

            {expandedLevels.includes(level) && (
              <div className={clsx(
                'grid gap-3 mt-4 pt-4 border-t border-gray-800',
                level === 'L0' && 'grid-cols-1',
                level === 'L1' && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
                level === 'L2' && 'grid-cols-2 md:grid-cols-4',
                level === 'L3' && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
              )}>
                {agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} level={level} />
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
