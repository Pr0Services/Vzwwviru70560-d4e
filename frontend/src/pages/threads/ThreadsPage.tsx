/**
 * CHE·NU™ — Threads Page
 * List of all threads with filtering and creation
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Modal } from '@/components/ui'
import { ThreadList, ThreadToolbar, CreateThreadForm } from '@/components/threads'
import { SphereIcon, SPHERE_CONFIGS } from '@/components/spheres'
import { mockThreads, mockSpheres } from '@/mocks/data'
import type { Thread, ThreadPriority } from '@/components/threads'

export default function ThreadsPage() {
  const navigate = useNavigate()
  const [threads, setThreads] = useState(mockThreads)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'priority'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null)

  // Filter and sort threads
  const filteredThreads = threads
    .filter(thread => {
      const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSphere = !selectedSphere || thread.sphereId === selectedSphere
      return matchesSearch && matchesSphere
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return 0
    })

  const handleCreateThread = (data: {
    title: string
    description?: string
    tags: string[]
    isPrivate: boolean
    sphereId: string
    priority: ThreadPriority
  }) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: data.title,
      description: data.description,
      sphereId: data.sphereId as any,
      status: 'active',
      priority: data.priority,
      isPinned: false,
      isFavorite: false,
      isPrivate: data.isPrivate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      participantCount: 1,
      tags: data.tags,
    }
    setThreads([newThread, ...threads])
    setShowCreateModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Threads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredThreads.length} thread{filteredThreads.length !== 1 ? 's' : ''}
            {selectedSphere && ` in ${SPHERE_CONFIGS[selectedSphere as keyof typeof SPHERE_CONFIGS]?.name}`}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Sphere Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSphere(null)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
            !selectedSphere
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          All Spheres
        </button>
        {mockSpheres.map(sphere => {
          const threadCount = threads.filter(t => t.sphereId === sphere.id).length
          return (
            <button
              key={sphere.id}
              onClick={() => setSelectedSphere(sphere.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                selectedSphere === sphere.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <SphereIcon sphereId={sphere.id} size="xs" />
              {sphere.name}
              <span className="text-xs opacity-70">({threadCount})</span>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <ThreadToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateThread={() => setShowCreateModal(true)}
      />

      {/* Thread List */}
      <Card className="p-0 overflow-hidden">
        {viewMode === 'list' ? (
          <ThreadList
            threads={filteredThreads}
            onThreadClick={(thread) => navigate(`/threads/${thread.id}`)}
            onCreateThread={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredThreads.map((thread, i) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => navigate(`/threads/${thread.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <SphereIcon sphereId={thread.sphereId} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {thread.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {thread.description || thread.lastMessage?.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{thread.messageCount} messages</span>
                        <span>·</span>
                        <span>{new Date(thread.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Thread Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Thread"
        size="md"
      >
        <CreateThreadForm
          spheres={mockSpheres}
          onSubmit={handleCreateThread}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  )
}
