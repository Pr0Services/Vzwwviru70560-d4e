/**
 * CHE·NU™ — Agents Page
 * Agent marketplace and management
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid3X3, List, Bot, Sparkles, TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge, Modal } from '@/components/ui'
import { AgentCard, AgentGrid, HireAgentModal, AgentStatusBadge } from '@/components/agents'
import { SphereIcon, SPHERE_CONFIGS } from '@/components/spheres'
import { mockAgents, mockSpheres } from '@/mocks/data'
import type { Agent, AgentScope } from '@/components/agents'

export default function AgentsPage() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState(mockAgents)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'hired' | 'available'>('all')
  const [filterSphere, setFilterSphere] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showHireModal, setShowHireModal] = useState(false)

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'hired' && agent.hired) ||
      (filterStatus === 'available' && !agent.hired)
    
    const matchesSphere = !filterSphere || agent.sphereId === filterSphere

    return matchesSearch && matchesStatus && matchesSphere
  })

  const hiredAgents = agents.filter(a => a.hired)
  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'working')

  const handleHireAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowHireModal(true)
  }

  const confirmHire = (scope: AgentScope, budget: number, justification: string) => {
    if (selectedAgent) {
      setAgents(agents.map(a =>
        a.id === selectedAgent.id
          ? { ...a, hired: true, scope, status: 'active' as const, hiredAt: new Date().toISOString() }
          : a
      ))
    }
    setShowHireModal(false)
    setSelectedAgent(null)
  }

  const handlePauseAgent = (agent: Agent) => {
    setAgents(agents.map(a =>
      a.id === agent.id ? { ...a, status: 'paused' as const } : a
    ))
  }

  const handleResumeAgent = (agent: Agent) => {
    setAgents(agents.map(a =>
      a.id === agent.id ? { ...a, status: 'active' as const } : a
    ))
  }

  const handleFireAgent = (agent: Agent) => {
    setAgents(agents.map(a =>
      a.id === agent.id ? { ...a, hired: false, status: 'offline' as const } : a
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Hire and manage your AI agents
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
              <p className="text-xs text-gray-500">Total Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{hiredAgents.length}</p>
              <p className="text-xs text-gray-500">Hired</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAgents.length}</p>
              <p className="text-xs text-gray-500">Active Now</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {agents.reduce((acc, a) => acc + (a.tasksCompleted || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Tasks Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents by name, skill, or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(['all', 'hired', 'available'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                filterStatus === status
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sphere Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterSphere(null)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
            !filterSphere
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          All Spheres
        </button>
        {mockSpheres.map(sphere => {
          const agentCount = agents.filter(a => a.sphereId === sphere.id).length
          return (
            <button
              key={sphere.id}
              onClick={() => setFilterSphere(sphere.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                filterSphere === sphere.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <SphereIcon sphereId={sphere.id} size="xs" />
              {sphere.name}
              <span className="text-xs opacity-70">({agentCount})</span>
            </button>
          )
        })}
      </div>

      {/* Agent Grid/List */}
      {viewMode === 'grid' ? (
        <AgentGrid
          agents={filteredAgents}
          onAgentClick={(agent) => setSelectedAgent(agent)}
          onHireAgent={handleHireAgent}
          onPauseAgent={handlePauseAgent}
          onResumeAgent={handleResumeAgent}
          onFireAgent={handleFireAgent}
          onConfigureAgent={(agent) => logger.debug('Configure:', agent)}
        />
      ) : (
        <Card className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAgents.map((agent, i) => {
            const sphereConfig = SPHERE_CONFIGS[agent.sphereId as keyof typeof SPHERE_CONFIGS]
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {agent.name.charAt(0)}
                  </div>
                  <div className={cn(
                    'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900',
                    agent.status === 'active' && 'bg-green-500',
                    agent.status === 'working' && 'bg-blue-500',
                    agent.status === 'paused' && 'bg-amber-500',
                    agent.status === 'offline' && 'bg-gray-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                    <AgentStatusBadge status={agent.status} />
                    {agent.hired && <Badge variant="success" size="sm">Hired</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{agent.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <SphereIcon sphereId={agent.sphereId} size="xs" />
                      {sphereConfig?.name}
                    </span>
                    <span>Level {agent.level}</span>
                    <span>{agent.costPerTask} tokens/task</span>
                    <span>{agent.tasksCompleted?.toLocaleString()} tasks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {agent.hired ? (
                    <>
                      {agent.status === 'paused' ? (
                        <Button size="sm" variant="secondary" onClick={() => handleResumeAgent(agent)}>
                          Resume
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => handlePauseAgent(agent)}>
                          Pause
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => handleFireAgent(agent)}>
                        Fire
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="primary" onClick={() => handleHireAgent(agent)}>
                      Hire
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </Card>
      )}

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No agents found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Hire Modal */}
      {selectedAgent && (
        <HireAgentModal
          open={showHireModal}
          onClose={() => {
            setShowHireModal(false)
            setSelectedAgent(null)
          }}
          agent={selectedAgent}
          onHire={confirmHire}
        />
      )}
    </div>
  )
}
