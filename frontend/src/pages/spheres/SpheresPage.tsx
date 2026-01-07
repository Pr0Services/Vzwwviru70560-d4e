/**
 * CHE·NU™ — Spheres Page
 * Grid view of all 9 spheres
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Grid3X3, List, Star, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge } from '@/components/ui'
import { SphereCard, SphereGrid, SphereIcon, SPHERE_CONFIGS } from '@/components/spheres'
import { mockSpheres, mockFavoriteSpheres, mockRecentSpheres } from '@/mocks/data'

export default function SpheresPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'recent'>('all')

  // Filter spheres
  const filteredSpheres = mockSpheres.filter(sphere => {
    const matchesSearch = sphere.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sphere.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedFilter === 'favorites') {
      return matchesSearch && mockFavoriteSpheres.includes(sphere.id)
    }
    if (selectedFilter === 'recent') {
      return matchesSearch && mockRecentSpheres.includes(sphere.id)
    }
    return matchesSearch
  })

  const handleSphereClick = (sphereId: string) => {
    navigate(`/spheres/${sphereId}`)
  }

  const handleToggleFavorite = (sphereId: string) => {
    logger.debug('Toggle favorite:', sphereId)
    // In real app, update store
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Spheres</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Organize your life across 9 distinct domains
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search spheres..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedFilter === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('favorites')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
              selectedFilter === 'favorites'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <Star className="w-4 h-4" />
            Favorites
          </button>
          <button
            onClick={() => setSelectedFilter('recent')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
              selectedFilter === 'recent'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </div>

        {/* View Mode Toggle */}
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

      {/* Spheres Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpheres.map((sphere, i) => (
            <motion.div
              key={sphere.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SphereCard
                sphere={sphere}
                isSelected={false}
                isFavorite={mockFavoriteSpheres.includes(sphere.id)}
                onClick={() => handleSphereClick(sphere.id)}
                onToggleFavorite={() => handleToggleFavorite(sphere.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredSpheres.map((sphere, i) => {
            const config = SPHERE_CONFIGS[sphere.id]
            return (
              <motion.div
                key={sphere.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleSphereClick(sphere.id)}
              >
                <SphereIcon sphereId={sphere.id} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {sphere.name}
                    </h3>
                    {mockFavoriteSpheres.includes(sphere.id) && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                    {sphere.isActive && (
                      <Badge variant="success" size="sm">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {sphere.description}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{sphere.threadCount}</p>
                    <p className="text-xs">Threads</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{sphere.agentCount}</p>
                    <p className="text-xs">Agents</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </Card>
      )}

      {/* Empty State */}
      {filteredSpheres.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No spheres found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          About Spheres
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          CHE·NU organizes your life into 9 distinct spheres, each with its own agents, threads, and data. 
          Spheres maintain integrity boundaries - cross-sphere actions require explicit approval.
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SPHERE_CONFIGS).map(([id, config]) => (
            <div
              key={id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50"
            >
              <config.icon className={cn('w-3 h-3', config.color)} />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{config.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
