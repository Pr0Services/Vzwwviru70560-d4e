/**
 * CHE·NU™ — Sphere Detail Page
 * Bureau view of a single sphere with 6 sections
 */

import { useState } from 'react'
import { logger } from '@/utils/logger';
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Plus, Zap, FolderOpen, MessageSquare, FileText,
  Bot, Calendar, Search, Grid3X3, List, Star, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { SphereIcon, SPHERE_CONFIGS } from '@/components/spheres'
import { ThreadCard, ThreadList } from '@/components/threads'
import { AgentCard, AgentGrid } from '@/components/agents'
import { mockSpheres, mockThreads, mockAgents, mockFavoriteSpheres } from '@/mocks/data'

// Bureau Sections
const BUREAU_SECTIONS = [
  { id: 'quick-capture', label: 'Quick Capture', icon: Zap },
  { id: 'resume', label: 'Resume Workspace', icon: FolderOpen },
  { id: 'threads', label: 'Threads', icon: MessageSquare },
  { id: 'datafiles', label: 'DataFiles', icon: FileText },
  { id: 'agents', label: 'Active Agents', icon: Bot },
  { id: 'meetings', label: 'Meetings', icon: Calendar },
]

export default function SphereDetailPage() {
  const { sphereId } = useParams<{ sphereId: string }>()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('threads')
  const [searchQuery, setSearchQuery] = useState('')

  // Get sphere data
  const sphere = mockSpheres.find(s => s.id === sphereId)
  const sphereConfig = sphereId ? SPHERE_CONFIGS[sphereId as keyof typeof SPHERE_CONFIGS] : null
  const isFavorite = sphereId ? mockFavoriteSpheres.includes(sphereId as any) : false

  // Filter data for this sphere
  const sphereThreads = mockThreads.filter(t => t.sphereId === sphereId)
  const sphereAgents = mockAgents.filter(a => a.sphereId === sphereId && a.hired)

  if (!sphere || !sphereConfig) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sphere not found</h2>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/spheres')}>
          Back to Spheres
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/spheres')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <SphereIcon sphereId={sphere.id} size="xl" variant="filled" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sphere.name}
              </h1>
              {isFavorite && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              )}
              {sphere.isActive && (
                <Badge variant="success">Active</Badge>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {sphere.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{sphereThreads.length}</p>
          <p className="text-sm text-gray-500">Threads</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{sphereAgents.length}</p>
          <p className="text-sm text-gray-500">Active Agents</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{sphere.agentCount}</p>
          <p className="text-sm text-gray-500">Available Agents</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sphereThreads.reduce((acc, t) => acc + (t.messageCount || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </Card>
      </div>

      {/* Bureau Sections */}
      <Card className="p-0 overflow-hidden">
        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {BUREAU_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeSection === section.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="p-5">
          {/* Quick Capture */}
          {activeSection === 'quick-capture' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Quick capture... Press Enter to save"
                  className="flex-1 h-12 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-lg focus:ring-2 focus:ring-blue-500"
                />
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Capture
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Quickly capture thoughts, ideas, or tasks. They'll be organized into the right thread later.
              </p>
            </div>
          )}

          {/* Resume Workspace */}
          {activeSection === 'resume' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Pick up where you left off</h3>
              {sphereThreads.slice(0, 3).map(thread => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  variant="compact"
                  onClick={() => navigate(`/threads/${thread.id}`)}
                />
              ))}
              {sphereThreads.length === 0 && (
                <p className="text-gray-500 text-center py-8">No recent activity in this sphere</p>
              )}
            </div>
          )}

          {/* Threads */}
          {activeSection === 'threads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search threads..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Thread
                </Button>
              </div>
              <ThreadList
                threads={sphereThreads}
                onThreadClick={(thread) => navigate(`/threads/${thread.id}`)}
                onCreateThread={() => logger.debug('Create thread')}
              />
            </div>
          )}

          {/* DataFiles */}
          {activeSection === 'datafiles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">DataFiles</h3>
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Documents', 'Images', 'Audio', 'Data'].map(folder => (
                  <Card
                    key={folder}
                    className="p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <FolderOpen className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium text-gray-900 dark:text-white">{folder}</p>
                    <p className="text-xs text-gray-500">0 files</p>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center py-4">
                No files uploaded yet. Drag and drop or click Upload to add files.
              </p>
            </div>
          )}

          {/* Active Agents */}
          {activeSection === 'agents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Active Agents ({sphereAgents.length})
                </h3>
                <Button variant="primary" size="sm" onClick={() => navigate('/agents')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Hire Agent
                </Button>
              </div>
              {sphereAgents.length > 0 ? (
                <AgentGrid
                  agents={sphereAgents}
                  onAgentClick={(agent) => logger.debug('Agent clicked:', agent)}
                  onHireAgent={(agent) => logger.debug('Hire:', agent)}
                  onPauseAgent={(agent) => logger.debug('Pause:', agent)}
                  onConfigureAgent={(agent) => logger.debug('Configure:', agent)}
                />
              ) : (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500">No agents hired for this sphere yet</p>
                  <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/agents')}>
                    Browse Agents
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Meetings */}
          {activeSection === 'meetings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Meetings</h3>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500">No upcoming meetings</p>
                <Button variant="secondary" size="sm" className="mt-3">
                  Schedule Meeting
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
