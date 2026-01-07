/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — THREAD VIEW PAGE                                ║
 * ║                    Task B2.1: Full thread conversation view                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MessageSquare, Bot, User, Send, Paperclip,
  MoreHorizontal, Star, Pin, Tag, Clock, Sparkles,
  ChevronDown, Loader2, Copy, Check, Trash2, Edit2
} from 'lucide-react'
import { useThreadsStore, useAuthStore } from '@/stores'
import { AgentBadge } from '@/components/agents/AgentCard'
import { useToast } from '@/components/ui/Toast'
import { formatDistanceToNow, formatDateTime } from '@/utils'
import type { Thread, Message, Agent } from '@/types'

export default function ThreadViewPage() {
  const { sphereId, threadId } = useParams<{ sphereId: string; threadId: string }>()
  const navigate = useNavigate()
  const { success } = useToast()
  const { user } = useAuthStore()
  const { threads, messages, fetchMessages, sendMessage, isLoading } = useThreadsStore()

  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get current thread
  const thread = threads.find(t => t.id === threadId)
  const threadMessages = messages[threadId || ''] || []

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

  // Fetch messages on mount
  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId)
    }
  }, [threadId, fetchMessages])

  const handleSend = async () => {
    if (!inputValue.trim() || !threadId) return

    setIsSending(true)
    try {
      await sendMessage(threadId, {
        content: inputValue.trim(),
        agent_id: selectedAgent?.id,
      })
      setInputValue('')
      setSelectedAgent(null)
    } catch (error) {
      logger.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-ancient-stone/30 mx-auto mb-4" />
          <h2 className="text-xl font-display text-soft-sand mb-2">Thread introuvable</h2>
          <p className="text-ancient-stone mb-4">Ce thread n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigate(`/sphere/${sphereId}/threads`)}
            className="btn-primary"
          >
            Retour aux threads
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
        <button
          onClick={() => navigate(`/sphere/${sphereId}/threads`)}
          className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-display font-semibold text-soft-sand truncate">
              {thread.title}
            </h1>
            {thread.is_starred && (
              <Star className="w-4 h-4 text-sacred-gold fill-sacred-gold flex-shrink-0" />
            )}
            {thread.is_pinned && (
              <Pin className="w-4 h-4 text-earth-ember flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-ancient-stone">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(thread.updated_at)}
            </span>
            {thread.tags && thread.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {thread.tags.length} tags
              </span>
            )}
          </div>
        </div>

        {/* Agents in thread */}
        {thread.agents && thread.agents.length > 0 && (
          <div className="flex items-center gap-1">
            {thread.agents.slice(0, 3).map((agent) => (
              <AgentBadge key={agent.id} agent={agent} />
            ))}
            {thread.agents.length > 3 && (
              <span className="text-xs text-ancient-stone">
                +{thread.agents.length - 3}
              </span>
            )}
          </div>
        )}

        <button className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-sacred-gold animate-spin" />
          </div>
        ) : threadMessages.length === 0 ? (
          <EmptyThreadState thread={thread} />
        ) : (
          threadMessages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              isOwnMessage={message.sender_id === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-white/5">
        {/* Selected Agent */}
        {selectedAgent && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-ancient-stone">Envoi à:</span>
            <AgentBadge agent={selectedAgent} />
            <button 
              onClick={() => setSelectedAgent(null)}
              className="p-1 rounded hover:bg-white/10 text-ancient-stone"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Agent Picker */}
          <div className="relative">
            <button
              onClick={() => setShowAgentPicker(!showAgentPicker)}
              className={`
                p-3 rounded-xl border transition-colors
                ${showAgentPicker 
                  ? 'bg-jungle-emerald/20 border-jungle-emerald/30 text-jungle-emerald' 
                  : 'border-white/10 hover:bg-white/5 text-ancient-stone'}
              `}
            >
              <Bot className="w-5 h-5" />
            </button>

            {showAgentPicker && thread.agents && (
              <AgentPickerDropdown
                agents={thread.agents}
                onSelect={(agent) => {
                  setSelectedAgent(agent)
                  setShowAgentPicker(false)
                }}
                onClose={() => setShowAgentPicker(false)}
              />
            )}
          </div>

          {/* Attachments */}
          <button className="p-3 rounded-xl border border-white/10 hover:bg-white/5 text-ancient-stone">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              rows={1}
              className="input w-full pr-12 resize-none min-h-[48px] max-h-32"
              style={{ height: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              className={`
                absolute right-2 bottom-2 p-2 rounded-lg transition-colors
                ${inputValue.trim() && !isSending
                  ? 'bg-sacred-gold text-ui-slate hover:bg-sacred-gold/90'
                  : 'bg-white/5 text-ancient-stone cursor-not-allowed'}
              `}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 text-xs text-ancient-stone">
          <span>Raccourcis:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5">Enter</kbd>
          <span>envoyer</span>
          <span className="mx-2">•</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5">Shift+Enter</kbd>
          <span>nouvelle ligne</span>
        </div>
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ 
  message, 
  isOwnMessage 
}: { 
  message: Message
  isOwnMessage: boolean 
}) {
  const [copied, setCopied] = useState(false)
  const isAgent = message.sender_type === 'agent'
  const isNova = message.sender_type === 'nova'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        ${isNova ? 'bg-sacred-gold/20' : isAgent ? 'bg-jungle-emerald/20' : 'bg-cenote-turquoise/20'}
      `}>
        {isNova ? (
          <Sparkles className="w-4 h-4 text-sacred-gold" />
        ) : isAgent ? (
          <Bot className="w-4 h-4 text-jungle-emerald" />
        ) : (
          <User className="w-4 h-4 text-cenote-turquoise" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[75%] ${isOwnMessage ? 'text-right' : ''}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span className={`text-sm font-medium ${
            isNova ? 'text-sacred-gold' : isAgent ? 'text-jungle-emerald' : 'text-soft-sand'
          }`}>
            {message.sender_name || (isNova ? 'Nova' : isAgent ? 'Agent' : 'Vous')}
          </span>
          <span className="text-xs text-ancient-stone">
            {formatDateTime(message.created_at)}
          </span>
        </div>

        {/* Message */}
        <div className={`
          p-4 rounded-2xl
          ${isOwnMessage 
            ? 'bg-cenote-turquoise/20 rounded-tr-md' 
            : isNova 
              ? 'bg-sacred-gold/10 border border-sacred-gold/20 rounded-tl-md'
              : isAgent
                ? 'bg-jungle-emerald/10 border border-jungle-emerald/20 rounded-tl-md'
                : 'bg-white/5 rounded-tl-md'}
        `}>
          <p className="text-soft-sand whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Actions */}
        <div className={`
          flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
          ${isOwnMessage ? 'justify-end' : ''}
        `}>
          <button 
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 text-ancient-stone"
            title="Copier"
          >
            {copied ? <Check className="w-3 h-3 text-jungle-emerald" /> : <Copy className="w-3 h-3" />}
          </button>
          {isOwnMessage && (
            <>
              <button className="p-1 rounded hover:bg-white/10 text-ancient-stone" title="Modifier">
                <Edit2 className="w-3 h-3" />
              </button>
              <button className="p-1 rounded hover:bg-red-500/20 text-red-400" title="Supprimer">
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Empty State
function EmptyThreadState({ thread }: { thread: Thread }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-2xl bg-cenote-turquoise/10 flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-cenote-turquoise/50" />
      </div>
      <h3 className="text-xl font-display font-semibold text-soft-sand mb-2">
        Thread vide
      </h3>
      <p className="text-ancient-stone mb-4 max-w-md">
        Commencez à écrire ou engagez un agent pour démarrer la conversation.
      </p>
      {thread.agents && thread.agents.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ancient-stone">Agents disponibles:</span>
          {thread.agents.map((agent) => (
            <AgentBadge key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}

// Agent Picker Dropdown
function AgentPickerDropdown({
  agents,
  onSelect,
  onClose,
}: {
  agents: Agent[]
  onSelect: (agent: Agent) => void
  onClose: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 z-20 w-64 py-2 rounded-xl bg-ui-slate border border-white/10 shadow-xl">
        <div className="px-3 py-2 text-xs font-medium text-ancient-stone uppercase">
          Envoyer à un agent
        </div>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-jungle-emerald/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-jungle-emerald" />
            </div>
            <div>
              <div className="text-sm text-soft-sand">{agent.name}</div>
              <div className="text-xs text-ancient-stone">{agent.level}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

// Missing import
import { X } from 'lucide-react'
