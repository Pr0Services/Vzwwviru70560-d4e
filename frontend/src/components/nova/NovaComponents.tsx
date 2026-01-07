/**
 * CHE·NU™ — Nova Components
 * Nova: System Intelligence (never hired, always available)
 */

import { forwardRef, useState, useRef, useEffect, type HTMLAttributes, type ReactNode, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Send, Mic, MicOff, Paperclip, Image, FileText,
  ChevronDown, ChevronUp, Maximize2, Minimize2, X, Copy,
  ThumbsUp, ThumbsDown, RotateCcw, Loader2, Wand2, Brain,
  Lightbulb, HelpCircle, Command, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Badge, Avatar, Tooltip } from '@/components/ui'

// ============================================================================
// TYPES
// ============================================================================

export type NovaMessageRole = 'user' | 'nova' | 'system'
export type NovaMessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export interface NovaMessage {
  id: string
  role: NovaMessageRole
  content: string
  timestamp: string
  status?: NovaMessageStatus
  attachments?: NovaAttachment[]
  suggestions?: string[]
  actions?: NovaAction[]
}

export interface NovaAttachment {
  id: string
  type: 'image' | 'file' | 'thread' | 'agent'
  name: string
  url?: string
  preview?: string
}

export interface NovaAction {
  id: string
  label: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick: () => void
}

// ============================================================================
// NOVA AVATAR
// ============================================================================

export interface NovaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
}

export function NovaAvatar({ size = 'md', animated = false, className }: NovaAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  return (
    <div
      className={cn(
        sizes[size],
        'relative rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
        'flex items-center justify-center shadow-lg',
        animated && 'animate-pulse',
        className
      )}
    >
      <Sparkles className={cn(
        'text-white',
        size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-10 h-10'
      )} />
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  )
}

// ============================================================================
// NOVA MESSAGE BUBBLE
// ============================================================================

export interface NovaMessageBubbleProps {
  message: NovaMessage
  onCopy?: () => void
  onRetry?: () => void
  onFeedback?: (positive: boolean) => void
}

export function NovaMessageBubble({ message, onCopy, onRetry, onFeedback }: NovaMessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const isNova = message.role === 'nova'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {message.content}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 group', isNova ? 'justify-start' : 'justify-end')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isNova && <NovaAvatar size="sm" animated={message.status === 'streaming'} />}

      <div className={cn('max-w-[80%]', isNova ? '' : 'order-first')}>
        {/* Message Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl',
            isNova
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
              : 'bg-blue-600 text-white rounded-tr-sm'
          )}
        >
          {message.status === 'streaming' ? (
            <div className="flex items-center gap-2">
              <span>{message.content}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ▊
              </motion.span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {message.status === 'error' && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <X className="w-3 h-3" /> Failed to send
            </p>
          )}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
              >
                {att.type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                <span className="truncate max-w-[120px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {isNova && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        {isNova && message.actions && message.actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {message.actions.map(action => (
              <Button
                key={action.id}
                size="sm"
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        <AnimatePresence>
          {showActions && message.status !== 'streaming' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex gap-1 mt-1',
                isNova ? 'justify-start' : 'justify-end'
              )}
            >
              {onCopy && (
                <Tooltip content="Copy">
                  <button
                    onClick={onCopy}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </Tooltip>
              )}
              {isNova && onFeedback && (
                <>
                  <Tooltip content="Helpful">
                    <button
                      onClick={() => onFeedback(true)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Not helpful">
                    <button
                      onClick={() => onFeedback(false)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </Tooltip>
                </>
              )}
              {message.status === 'error' && onRetry && (
                <Tooltip content="Retry">
                  <button
                    onClick={onRetry}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </Tooltip>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <p className={cn(
          'text-xs text-gray-400 mt-1',
          isNova ? 'text-left' : 'text-right'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// NOVA CHAT INPUT
// ============================================================================

export interface NovaChatInputProps {
  onSend: (content: string, attachments?: File[]) => void
  onVoice?: () => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

export function NovaChatInput({
  onSend,
  onVoice,
  placeholder = "Ask Nova anything...",
  disabled,
  loading,
}: NovaChatInputProps) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim() && attachments.length === 0) return
    onSend(content, attachments)
    setContent('')
    setAttachments([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [content])

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1 rounded bg-white dark:bg-gray-700 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button
                type="button"
                onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
        {/* Attach Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 bg-transparent resize-none outline-none',
            'text-gray-900 dark:text-gray-100 placeholder:text-gray-400',
            'min-h-[24px] max-h-[200px]'
          )}
        />

        {/* Voice Button */}
        {onVoice && (
          <button
            type="button"
            onClick={() => {
              setIsRecording(!isRecording)
              onVoice()
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isRecording
                ? 'bg-red-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gray-500" />}
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || loading || (!content.trim() && attachments.length === 0)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'bg-blue-600 text-white hover:bg-blue-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  )
}

// ============================================================================
// NOVA CHAT
// ============================================================================

export interface NovaChatProps {
  messages: NovaMessage[]
  onSendMessage: (content: string, attachments?: File[]) => void
  onCopy?: (message: NovaMessage) => void
  onRetry?: (message: NovaMessage) => void
  onFeedback?: (message: NovaMessage, positive: boolean) => void
  loading?: boolean
  className?: string
}

export function NovaChat({
  messages,
  onSendMessage,
  onCopy,
  onRetry,
  onFeedback,
  loading,
  className,
}: NovaChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <NovaWelcome />
        ) : (
          messages.map(message => (
            <NovaMessageBubble
              key={message.id}
              message={message}
              onCopy={() => onCopy?.(message)}
              onRetry={() => onRetry?.(message)}
              onFeedback={(positive) => onFeedback?.(message, positive)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <NovaChatInput onSend={onSendMessage} loading={loading} />
      </div>
    </div>
  )
}

// ============================================================================
// NOVA WELCOME
// ============================================================================

export function NovaWelcome() {
  const suggestions = [
    { icon: <Wand2 className="w-4 h-4" />, text: "Help me draft a proposal" },
    { icon: <Brain className="w-4 h-4" />, text: "Analyze my recent tasks" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "Generate creative ideas" },
    { icon: <HelpCircle className="w-4 h-4" />, text: "How do I use CHE·NU?" },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <NovaAvatar size="xl" animated />
      <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Hello! I'm Nova
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
        Your system intelligence. I can help you navigate CHE·NU,
        manage your spheres, and get things done.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-8 max-w-md">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <span className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              {suggestion.icon}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400 flex items-center gap-1">
        <Command className="w-3 h-3" /> + K to open command palette
      </p>
    </div>
  )
}

// ============================================================================
// NOVA FLOATING BUTTON
// ============================================================================

export interface NovaFloatingButtonProps {
  onClick: () => void
  unreadCount?: number
  className?: string
}

export function NovaFloatingButton({ onClick, unreadCount, className }: NovaFloatingButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-2xl',
        'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
        'flex items-center justify-center',
        'shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40',
        'transition-shadow',
        className
      )}
    >
      <Sparkles className="w-6 h-6 text-white" />
      {unreadCount && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </motion.button>
  )
}

// ============================================================================
// NOVA MINI PANEL
// ============================================================================

export interface NovaMiniPanelProps {
  open: boolean
  onClose: () => void
  onExpand: () => void
  messages: NovaMessage[]
  onSendMessage: (content: string) => void
  loading?: boolean
}

export function NovaMiniPanel({
  open,
  onClose,
  onExpand,
  messages,
  onSendMessage,
  loading,
}: NovaMiniPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <NovaAvatar size="sm" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Nova</h3>
                <p className="text-xs text-gray-500">System Intelligence</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onExpand}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Chat */}
          <NovaChat
            messages={messages}
            onSendMessage={onSendMessage}
            loading={loading}
            className="flex-1"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export const NovaComponents = {
  NovaAvatar,
  NovaMessageBubble,
  NovaChatInput,
  NovaChat,
  NovaWelcome,
  NovaFloatingButton,
  NovaMiniPanel,
}
