/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — THREAD LIST COMPONENT                           ║
 * ║                    Display and manage threads (.chenu files)                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MessageSquare, Plus, Search, Filter, Clock, Star, 
  MoreHorizontal, Trash2, Archive, Pin, Tag,
  ChevronRight, Bot, User as UserIcon
} from 'lucide-react'
import { useThreadsStore } from '@/stores'
import type { Thread, SphereId } from '@/types'
import { formatDistanceToNow } from '@/utils/date'

interface ThreadListProps {
  sphereId: SphereId
  onThreadSelect?: (thread: Thread) => void
  onCreateThread?: () => void
}

export default function ThreadList({ 
  sphereId, 
  onThreadSelect,
  onCreateThread,
}: ThreadListProps) {
  const navigate = useNavigate()
  const { threads, isLoading, fetchThreads } = useThreadsStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'starred'>('recent')

  // Filter threads for this sphere
  const sphereThreads = useMemo(() => {
    return threads
      .filter(t => t.sphere_id === sphereId)
      .filter(t => {
        if (filterStatus === 'active') return t.status === 'active'
        if (filterStatus === 'archived') return t.status === 'archived'
        return true
      })
      .filter(t => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title)
        if (sortBy === 'starred') return (b.is_starred ? 1 : 0) - (a.is_starred ? 1 : 0)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
  }, [threads, sphereId, searchQuery, filterStatus, sortBy])

  const handleThreadClick = (thread: Thread) => {
    if (onThreadSelect) {
      onThreadSelect(thread)
    } else {
      navigate(`/sphere/${sphereId}/threads/${thread.id}`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ancient-stone" />
          <input
            type="text"
            placeholder="Rechercher un thread..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="input py-2 text-sm"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="archived">Archivés</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input py-2 text-sm"
          >
            <option value="recent">Récents</option>
            <option value="name">Nom</option>
            <option value="starred">Favoris</option>
          </select>

          {/* Create Button */}
          <button
            onClick={onCreateThread}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          <ThreadListSkeleton />
        ) : sphereThreads.length === 0 ? (
          <EmptyState 
            hasSearch={!!searchQuery}
            onCreate={onCreateThread}
          />
        ) : (
          sphereThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => handleThreadClick(thread)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-xs text-ancient-stone flex items-center justify-between">
        <span>{sphereThreads.length} thread{sphereThreads.length !== 1 ? 's' : ''}</span>
        <span>.chenu files</span>
      </div>
    </div>
  )
}

// Thread Card Component
function ThreadCard({ 
  thread, 
  onClick 
}: { 
  thread: Thread
  onClick: () => void 
}) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      onClick={onClick}
      className="group relative flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 cursor-pointer transition-all"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-cenote-turquoise/10 flex items-center justify-center flex-shrink-0">
        <MessageSquare className="w-5 h-5 text-cenote-turquoise" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-soft-sand truncate">{thread.title}</h4>
          {thread.is_starred && (
            <Star className="w-3.5 h-3.5 text-sacred-gold fill-sacred-gold flex-shrink-0" />
          )}
          {thread.is_pinned && (
            <Pin className="w-3.5 h-3.5 text-earth-ember flex-shrink-0" />
          )}
        </div>

        {thread.description && (
          <p className="text-sm text-ancient-stone truncate mt-1">
            {thread.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-xs text-ancient-stone">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(thread.updated_at)}
          </span>
          
          {thread.agents && thread.agents.length > 0 && (
            <span className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              {thread.agents.length} agent{thread.agents.length !== 1 ? 's' : ''}
            </span>
          )}

          {thread.tags && thread.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {thread.tags.length}
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-ancient-stone transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(false)
              }}
            />
            <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 rounded-lg bg-ui-slate border border-white/10 shadow-xl">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft-sand hover:bg-white/5">
                <Star className="w-4 h-4" />
                Favoris
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft-sand hover:bg-white/5">
                <Pin className="w-4 h-4" />
                Épingler
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft-sand hover:bg-white/5">
                <Archive className="w-4 h-4" />
                Archiver
              </button>
              <hr className="my-1 border-white/5" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-ancient-stone/50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

// Empty State
function EmptyState({ 
  hasSearch, 
  onCreate 
}: { 
  hasSearch: boolean
  onCreate?: () => void 
}) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="w-12 h-12 text-ancient-stone/30 mb-4" />
        <p className="text-ancient-stone">Aucun thread trouvé</p>
        <p className="text-xs text-ancient-stone/70 mt-1">Essayez une autre recherche</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cenote-turquoise/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-cenote-turquoise/50" />
      </div>
      <h4 className="text-lg font-medium text-soft-sand mb-2">Aucun thread</h4>
      <p className="text-sm text-ancient-stone mb-4 max-w-xs">
        Les threads sont des fichiers .chenu qui contiennent vos conversations et travaux.
      </p>
      {onCreate && (
        <button onClick={onCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Créer un thread
        </button>
      )}
    </div>
  )
}

// Loading Skeleton
function ThreadListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-white/5" />
          <div className="flex-1">
            <div className="h-4 w-1/3 bg-white/5 rounded mb-2" />
            <div className="h-3 w-2/3 bg-white/5 rounded mb-2" />
            <div className="h-3 w-1/4 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
