// ============================================================
// CHE·NU - Token History Panel
// ============================================================
// Calm, readable, exportable
// No hidden costs - full transparency
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Zap,
  DollarSign,
  Clock,
  FileText,
  Users,
  MessageSquare,
  MousePointer2,
  FolderOpen
} from 'lucide-react'
import { clsx } from 'clsx'

export interface TokenEvent {
  id: string
  timestamp: number
  userId: string
  contextType: 'action' | 'meeting' | 'chat'
  contextId: string
  scope: 'selection' | 'document' | 'workspace' | 'meeting'
  model: 'small' | 'medium' | 'large'
  tokens: number
  costUSD: number
  sphereId?: string
  description?: string
}

interface TokenHistoryPanelProps {
  events: TokenEvent[]
  loading?: boolean
  onExport?: () => void
  onFilter?: (filter: HistoryFilter) => void
  compact?: boolean
}

export interface HistoryFilter {
  contextType?: string
  scope?: string
  from?: number
  to?: number
}

const contextIcons = {
  action: FileText,
  meeting: Users,
  chat: MessageSquare
}

const scopeIcons = {
  selection: MousePointer2,
  document: FileText,
  workspace: FolderOpen,
  meeting: Users
}

const scopeColors = {
  selection: 'text-green-400',
  document: 'text-blue-400',
  workspace: 'text-orange-400',
  meeting: 'text-purple-400'
}

export function TokenHistoryPanel({
  events,
  loading = false,
  onExport,
  onFilter,
  compact = false
}: TokenHistoryPanelProps) {
  const [expanded, setExpanded] = useState(!compact)
  const [showFilters, setShowFilters] = useState(false)

  // Calculate totals
  const totalTokens = events.reduce((sum, e) => sum + e.tokens, 0)
  const totalCost = events.reduce((sum, e) => sum + e.costUSD, 0)

  if (events.length === 0 && !loading) {
    return (
      <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-center">
        <History size={24} className="mx-auto text-gray-500 mb-2" />
        <p className="text-gray-500 text-sm">Aucun historique de tokens</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <History size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Historique Tokens</h3>
            <p className="text-xs text-gray-500">{events.length} événements</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Zap size={14} />
              <span className="font-mono">{totalTokens.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <DollarSign size={14} />
              <span className="font-mono">${totalCost.toFixed(4)}</span>
            </div>
          </div>
          
          {/* Toggle */}
          {expanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {/* Actions Bar */}
            <div className="px-4 py-2 border-t border-b border-gray-700/50 flex items-center justify-between bg-gray-900/30">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters) }}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  showFilters ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
                )}
              >
                <Filter size={14} />
                Filtres
              </button>
              
              {onExport && (
                <button
                  onClick={(e) => { e.stopPropagation(); onExport() }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              )}
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-3 border-b border-gray-700/50 bg-gray-900/50"
                >
                  <div className="flex flex-wrap gap-3">
                    <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300">
                      <option value="">Tous les types</option>
                      <option value="action">Actions</option>
                      <option value="meeting">Meetings</option>
                      <option value="chat">Chats</option>
                    </select>
                    <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300">
                      <option value="">Tous les scopes</option>
                      <option value="selection">Selection</option>
                      <option value="document">Document</option>
                      <option value="workspace">Workspace</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 text-sm mt-2">Chargement...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/30">
                  {events.map((event) => (
                    <TokenEventRow key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>

            {/* Summary Footer */}
            <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-900/30 grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-white">{events.length}</p>
                <p className="text-xs text-gray-500">événements</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-400">{totalTokens.toLocaleString()}</p>
                <p className="text-xs text-gray-500">tokens</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-400">${totalCost.toFixed(4)}</p>
                <p className="text-xs text-gray-500">coût total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-400">
                  {events.length > 0 ? Math.round(totalTokens / events.length) : 0}
                </p>
                <p className="text-xs text-gray-500">moy/event</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// SUB-COMPONENT: Token Event Row
// ============================================================
function TokenEventRow({ event }: { event: TokenEvent }) {
  const ContextIcon = contextIcons[event.contextType]
  const ScopeIcon = scopeIcons[event.scope]
  
  const timeAgo = getTimeAgo(event.timestamp)
  
  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Context Icon */}
        <div className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          event.contextType === 'action' && 'bg-blue-500/20',
          event.contextType === 'meeting' && 'bg-purple-500/20',
          event.contextType === 'chat' && 'bg-green-500/20'
        )}>
          <ContextIcon size={16} className={clsx(
            event.contextType === 'action' && 'text-blue-400',
            event.contextType === 'meeting' && 'text-purple-400',
            event.contextType === 'chat' && 'text-green-400'
          )} />
        </div>
        
        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium">
              {event.description || event.contextId.slice(0, 8)}
            </span>
            <span className={clsx('text-xs flex items-center gap-1', scopeColors[event.scope])}>
              <ScopeIcon size={10} />
              {event.scope}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={10} />
            {timeAgo}
            <span className="text-gray-600">•</span>
            <span className="font-mono">{event.model}</span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="text-right">
        <p className="text-sm font-mono text-white">{event.tokens.toLocaleString()} tok</p>
        <p className="text-xs font-mono text-gray-500">${event.costUSD.toFixed(4)}</p>
      </div>
    </div>
  )
}

// ============================================================
// HELPER: Time Ago
// ============================================================
function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}m`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}
