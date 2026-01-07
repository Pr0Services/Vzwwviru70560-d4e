/**
 * CHE·NU™ — Thread Detail Page
 * Conversation view with messages and agent interactions
 */

import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Star, Pin, Lock, MoreHorizontal, Edit2, Trash2,
  Archive, Send, Paperclip, Mic, Bot, User, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge, Avatar, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui'
import { SphereIcon, SPHERE_CONFIGS } from '@/components/spheres'
import { AgentAvatar } from '@/components/agents'
import { mockThreads, mockAgents, mockNovaMessages } from '@/mocks/data'

interface Message {
  id: string
  role: 'user' | 'agent' | 'nova' | 'system'
  content: string
  timestamp: string
  agentId?: string
  agentName?: string
  attachments?: { name: string; type: string; url: string }[]
}

// Mock messages for the thread
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Let\'s start planning our Q1 marketing strategy. What are the key areas we should focus on?',
    timestamp: '2024-12-20T10:00:00Z',
  },
  {
    id: 'msg-2',
    role: 'agent',
    content: 'Based on our Q4 performance and market trends, I recommend focusing on these key areas:\n\n1. **Content Marketing** - Our blog traffic grew 45% last quarter\n2. **Social Media** - Instagram engagement is up, let\'s capitalize\n3. **Email Campaigns** - Re-engage dormant subscribers\n4. **Paid Ads** - Test new platforms like TikTok\n\nWould you like me to elaborate on any of these?',
    timestamp: '2024-12-20T10:02:00Z',
    agentId: 'agent-3',
    agentName: 'Sales Analyst',
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Yes, tell me more about the content marketing strategy. What type of content should we create?',
    timestamp: '2024-12-20T10:05:00Z',
  },
  {
    id: 'msg-4',
    role: 'agent',
    content: 'For content marketing, I suggest a mix of:\n\n**Educational Content:**\n- How-to guides and tutorials\n- Industry trend analysis\n- Case studies from successful clients\n\n**Engaging Content:**\n- Behind-the-scenes videos\n- Team spotlights\n- User-generated content\n\n**SEO-Focused:**\n- Long-form pillar content\n- FAQ articles\n- Comparison guides\n\nI can create a content calendar draft if you\'d like.',
    timestamp: '2024-12-20T10:08:00Z',
    agentId: 'agent-2',
    agentName: 'Content Creator',
  },
  {
    id: 'msg-5',
    role: 'nova',
    content: 'I notice you\'re discussing Q1 strategy. Would you like me to pull relevant data from your Business sphere analytics?',
    timestamp: '2024-12-20T10:10:00Z',
  },
]

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Get thread data
  const thread = mockThreads.find(t => t.id === threadId)
  const sphereConfig = thread ? SPHERE_CONFIGS[thread.sphereId as keyof typeof SPHERE_CONFIGS] : null

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!thread || !sphereConfig) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Thread not found</h2>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/threads')}>
          Back to Threads
        </Button>
      </div>
    )
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate agent typing
    setIsTyping(true)
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: 'I\'m processing your request. Let me analyze the data and get back to you with recommendations.',
        timestamp: new Date().toISOString(),
        agentId: 'agent-2',
        agentName: 'Content Creator',
      }
      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)
    }, 2000)
  }

  const getAgent = (agentId?: string) => {
    return mockAgents.find(a => a.id === agentId)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/threads')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <SphereIcon sphereId={thread.sphereId} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {thread.title}
              </h1>
              {thread.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
              {thread.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              {thread.isPrivate && <Lock className="w-4 h-4 text-gray-400" />}
            </div>
            <p className="text-sm text-gray-500">
              {sphereConfig.name} · {messages.length} messages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {thread.tags?.map(tag => (
            <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
          ))}
          <Dropdown>
            <DropdownTrigger>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem icon={<Edit2 className="w-4 h-4" />}>Edit Thread</DropdownItem>
              <DropdownItem icon={<Pin className="w-4 h-4" />}>
                {thread.isPinned ? 'Unpin' : 'Pin'}
              </DropdownItem>
              <DropdownItem icon={<Star className="w-4 h-4" />}>
                {thread.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={<Archive className="w-4 h-4" />}>Archive</DropdownItem>
              <DropdownItem icon={<Trash2 className="w-4 h-4" />} destructive>Delete</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message, i) => {
          const agent = getAgent(message.agentId)
          const isUser = message.role === 'user'
          const isNova = message.role === 'nova'
          const isSystem = message.role === 'system'

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn('flex gap-3', isUser && 'flex-row-reverse')}
            >
              {/* Avatar */}
              {isUser ? (
                <Avatar name="You" size="sm" />
              ) : isNova ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              ) : agent ? (
                <AgentAvatar agent={agent} size="sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-500" />
                </div>
              )}

              {/* Message */}
              <div className={cn('max-w-[70%]', isUser && 'text-right')}>
                {/* Sender Name */}
                <p className="text-xs text-gray-500 mb-1">
                  {isUser ? 'You' : isNova ? 'Nova' : message.agentName || 'Agent'}
                  <span className="mx-1">·</span>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Content */}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3',
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : isNova
                        ? 'bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-tl-sm'
                        : 'bg-gray-100 dark:bg-gray-800 rounded-tl-sm'
                  )}
                >
                  <div className={cn(
                    'text-sm whitespace-pre-wrap',
                    isUser ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}>
                    {message.content}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type a message..."
              className="w-full min-h-[48px] max-h-32 px-4 py-3 pr-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 resize-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Mic className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-12 px-5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
