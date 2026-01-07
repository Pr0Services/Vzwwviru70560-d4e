/**
 * CHE·NU™ — Thread Components
 * Threads (.chenu) as first-class objects
 */

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Plus, ChevronRight, ChevronDown, Pin, PinOff,
  Star, StarOff, Archive, Trash2, MoreHorizontal, Edit, Copy,
  Share, Lock, Unlock, Users, Clock, Tag, Folder, Search,
  SortAsc, SortDesc, Filter, Grid, List, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Badge, Avatar, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui'
import { SphereIcon, type SphereId } from '@/components/spheres/SphereComponents'

// ============================================================================
// TYPES
// ============================================================================

export type ThreadStatus = 'active' | 'archived' | 'draft'
export type ThreadPriority = 'urgent' | 'high' | 'normal' | 'low'

export interface Thread {
  id: string
  title: string
  description?: string
  sphereId: SphereId
  status: ThreadStatus
  priority: ThreadPriority
  isPinned: boolean
  isFavorite: boolean
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  messageCount: number
  participantCount: number
  tags: string[]
  lastMessage?: {
    content: string
    author: string
    timestamp: string
  }
  unreadCount?: number
}

// ============================================================================
// THREAD CARD
// ============================================================================

export interface ThreadCardProps extends HTMLAttributes<HTMLDivElement> {
  thread: Thread
  selected?: boolean
  onSelect?: () => void
  onPin?: () => void
  onFavorite?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onEdit?: () => void
  variant?: 'default' | 'compact' | 'list'
}

export const ThreadCard = forwardRef<HTMLDivElement, ThreadCardProps>(
  ({ className, thread, selected, onSelect, onPin, onFavorite, onArchive, onDelete, onEdit, variant = 'default', ...props }, ref) => {
    const priorityColors: Record<ThreadPriority, string> = {
      urgent: 'border-l-red-500',
      high: 'border-l-orange-500',
      normal: 'border-l-blue-500',
      low: 'border-l-gray-400',
    }

    if (variant === 'list') {
      return (
        <div
          ref={ref}
          onClick={onSelect}
          className={cn(
            'flex items-center gap-3 p-3 cursor-pointer transition-colors',
            'border-l-4',
            priorityColors[thread.priority],
            selected
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            className
          )}
          {...props}
        >
          <SphereIcon sphereId={thread.sphereId} size="xs" variant="outline" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {thread.isPinned && <Pin className="w-3 h-3 text-blue-500" />}
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {thread.title}
              </span>
              {thread.isPrivate && <Lock className="w-3 h-3 text-gray-400" />}
            </div>
            {thread.lastMessage && (
              <p className="text-xs text-gray-500 truncate">
                {thread.lastMessage.author}: {thread.lastMessage.content}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{thread.messageCount}</span>
            <MessageSquare className="w-3 h-3" />
          </div>
          {thread.unreadCount && thread.unreadCount > 0 && (
            <Badge variant="primary" size="sm">
              {thread.unreadCount}
            </Badge>
          )}
        </div>
      )
    }

    if (variant === 'compact') {
      return (
        <motion.div
          ref={ref}
          whileHover={{ x: 4 }}
          onClick={onSelect}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors',
            'bg-white dark:bg-gray-900 border',
            selected
              ? 'border-blue-500 shadow-md'
              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300',
            className
          )}
          {...props}
        >
          <SphereIcon sphereId={thread.sphereId} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {thread.title}
            </p>
            <p className="text-xs text-gray-500">
              {thread.messageCount} messages · {new Date(thread.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      )
    }

    // Default variant
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        onClick={onSelect}
        className={cn(
          'p-4 rounded-2xl cursor-pointer transition-all',
          'bg-white dark:bg-gray-900 border',
          'border-l-4',
          priorityColors[thread.priority],
          selected
            ? 'border-blue-500 shadow-lg'
            : 'border-gray-200 dark:border-gray-800 hover:shadow-md',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <SphereIcon sphereId={thread.sphereId} size="md" variant="filled" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {thread.title}
              </h3>
              {thread.isPrivate && <Lock className="w-4 h-4 text-gray-400" />}
              {thread.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            </div>
            {thread.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {thread.description}
              </p>
            )}
          </div>
          <Dropdown>
            <DropdownTrigger onClick={e => e.stopPropagation()}>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem icon={<Edit className="w-4 h-4" />} onClick={onEdit}>
                Edit
              </DropdownItem>
              <DropdownItem
                icon={thread.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                onClick={onPin}
              >
                {thread.isPinned ? 'Unpin' : 'Pin'}
              </DropdownItem>
              <DropdownItem
                icon={thread.isFavorite ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                onClick={onFavorite}
              >
                {thread.isFavorite ? 'Remove favorite' : 'Add to favorites'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={<Archive className="w-4 h-4" />} onClick={onArchive}>
                Archive
              </DropdownItem>
              <DropdownItem icon={<Trash2 className="w-4 h-4" />} onClick={onDelete} destructive>
                Delete
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Tags */}
        {thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {thread.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" size="sm">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {thread.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{thread.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Last Message */}
        {thread.lastMessage && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 mb-3">
            <p className="text-xs text-gray-500 mb-1">
              {thread.lastMessage.author} · {new Date(thread.lastMessage.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {thread.lastMessage.content}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {thread.messageCount}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {thread.participantCount}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(thread.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Unread Badge */}
        {thread.unreadCount && thread.unreadCount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="primary">{thread.unreadCount} new</Badge>
          </div>
        )}
      </motion.div>
    )
  }
)

ThreadCard.displayName = 'ThreadCard'

// ============================================================================
// THREAD LIST
// ============================================================================

export interface ThreadListProps {
  threads: Thread[]
  selectedId?: string
  onSelect?: (thread: Thread) => void
  onPin?: (thread: Thread) => void
  onFavorite?: (thread: Thread) => void
  onArchive?: (thread: Thread) => void
  onDelete?: (thread: Thread) => void
  variant?: 'default' | 'compact' | 'list'
  emptyMessage?: string
}

export function ThreadList({
  threads,
  selectedId,
  onSelect,
  onPin,
  onFavorite,
  onArchive,
  onDelete,
  variant = 'default',
  emptyMessage = "No threads yet",
}: ThreadListProps) {
  const pinned = threads.filter(t => t.isPinned)
  const unpinned = threads.filter(t => !t.isPinned)

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        <Button variant="primary" className="mt-4">
          <Plus className="w-4 h-4 mr-1" />
          Create Thread
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Pin className="w-3 h-3" /> Pinned
          </h3>
          <div className={cn(
            variant === 'list' ? 'divide-y divide-gray-100 dark:divide-gray-800' : 'space-y-2'
          )}>
            {pinned.map(thread => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                selected={thread.id === selectedId}
                onSelect={() => onSelect?.(thread)}
                onPin={() => onPin?.(thread)}
                onFavorite={() => onFavorite?.(thread)}
                onArchive={() => onArchive?.(thread)}
                onDelete={() => onDelete?.(thread)}
                variant={variant}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Threads */}
      <div>
        {pinned.length > 0 && (
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            All Threads
          </h3>
        )}
        <div className={cn(
          variant === 'list' ? 'divide-y divide-gray-100 dark:divide-gray-800' : 'space-y-2'
        )}>
          {unpinned.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              selected={thread.id === selectedId}
              onSelect={() => onSelect?.(thread)}
              onPin={() => onPin?.(thread)}
              onFavorite={() => onFavorite?.(thread)}
              onArchive={() => onArchive?.(thread)}
              onDelete={() => onDelete?.(thread)}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// THREAD TOOLBAR
// ============================================================================

export interface ThreadToolbarProps {
  onSearch?: (query: string) => void
  onSort?: (sort: 'date' | 'name' | 'priority') => void
  onFilter?: (filter: string) => void
  onViewChange?: (view: 'grid' | 'list') => void
  onCreate?: () => void
  view?: 'grid' | 'list'
  sortBy?: 'date' | 'name' | 'priority'
  className?: string
}

export function ThreadToolbar({
  onSearch,
  onSort,
  onFilter,
  onViewChange,
  onCreate,
  view = 'grid',
  sortBy = 'date',
  className,
}: ThreadToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            onSearch?.(e.target.value)
          }}
          placeholder="Search threads..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        />
      </div>

      {/* Sort */}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" size="sm">
            {sortBy === 'date' ? <Calendar className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            Sort
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem onClick={() => onSort?.('date')}>
            <Calendar className="w-4 h-4 mr-2" /> Date
          </DropdownItem>
          <DropdownItem onClick={() => onSort?.('name')}>
            <SortAsc className="w-4 h-4 mr-2" /> Name
          </DropdownItem>
          <DropdownItem onClick={() => onSort?.('priority')}>
            <Filter className="w-4 h-4 mr-2" /> Priority
          </DropdownItem>
        </DropdownContent>
      </Dropdown>

      {/* View Toggle */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 p-0.5">
        <button
          onClick={() => onViewChange?.('grid')}
          className={cn(
            'p-1.5 rounded',
            view === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''
          )}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewChange?.('list')}
          className={cn(
            'p-1.5 rounded',
            view === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''
          )}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Create */}
      <Button variant="primary" size="sm" onClick={onCreate}>
        <Plus className="w-4 h-4 mr-1" />
        New Thread
      </Button>
    </div>
  )
}

// ============================================================================
// CREATE THREAD FORM
// ============================================================================

export interface CreateThreadFormProps {
  sphereId?: SphereId
  onSubmit: (data: { title: string; description?: string; sphereId: SphereId; tags: string[]; isPrivate: boolean }) => void
  onCancel: () => void
  loading?: boolean
}

export function CreateThreadForm({ sphereId, onSubmit, onCancel, loading }: CreateThreadFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSphere, setSelectedSphere] = useState<SphereId>(sphereId || 'personal')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title, description, sphereId: selectedSphere, tags, isPrivate })
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Thread title..."
          className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Description
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="w-full h-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Tags
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" size="sm" removable onRemove={() => setTags(tags.filter(t => t !== tag))}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className="flex-1 h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTag}>
            Add
          </Button>
        </div>
      </div>

      {/* Private Toggle */}
      <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={e => setIsPrivate(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
            <Lock className="w-4 h-4" /> Private Thread
          </p>
          <p className="text-xs text-gray-500">Only you can see this thread</p>
        </div>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          Create Thread
        </Button>
      </div>
    </form>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ThreadComponents = {
  ThreadCard,
  ThreadList,
  ThreadToolbar,
  CreateThreadForm,
}
