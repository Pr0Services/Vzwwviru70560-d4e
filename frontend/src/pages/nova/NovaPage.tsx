/**
 * CHE·NU™ — Nova Page
 * Full-screen chat interface with Nova system intelligence
 */

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, Send, Paperclip, Mic, Settings, History,
  Lightbulb, Zap, Brain, Target, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge } from '@/components/ui'
import { NovaChat, NovaWelcome, NovaChatInput } from '@/components/nova'
import { mockNovaMessages, mockUser, mockDashboardStats } from '@/mocks/data'
import type { NovaMessage } from '@/components/nova'

// Quick suggestions
const SUGGESTIONS = [
  { icon: Lightbulb, label: 'What should I focus on today?', category: 'productivity' },
  { icon: Zap, label: 'Show me pending approvals', category: 'governance' },
  { icon: Brain, label: 'Analyze my recent threads', category: 'analysis' },
  { icon: Target, label: 'Help me set goals for this week', category: 'goals' },
]

export default function NovaPage() {
  const [messages, setMessages] = useState<NovaMessage[]>(mockNovaMessages)
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: NovaMessage = {
      id: `nova-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate Nova response with streaming
    setIsStreaming(true)

    // Add placeholder for Nova response
    const novaMessageId = `nova-${Date.now() + 1}`
    const novaMessage: NovaMessage = {
      id: novaMessageId,
      role: 'nova',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, novaMessage])

    // Simulate streaming response
    const response = getNovaResponse(content)
    let currentText = ''
    
    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      currentText += response[i]
      setMessages(prev =>
        prev.map(m =>
          m.id === novaMessageId ? { ...m, content: currentText } : m
        )
      )
    }

    // Finalize message
    setMessages(prev =>
      prev.map(m =>
        m.id === novaMessageId
          ? {
              ...m,
              isStreaming: false,
              suggestions: getSuggestionsForResponse(content),
              actions: getActionsForResponse(content),
            }
          : m
      )
    )
    setIsStreaming(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nova</h1>
              <p className="text-sm text-gray-500">Your System Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages or Welcome */}
        <div className="flex-1 overflow-y-auto py-4">
          {messages.length === 0 ? (
            <NovaWelcome onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}
                >
                  {/* Avatar */}
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {mockUser.name.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={cn('max-w-[70%]', message.role === 'user' && 'text-right')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-tl-sm'
                      )}
                    >
                      <div className={cn(
                        'text-sm whitespace-pre-wrap',
                        message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'
                      )}>
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {message.actions.map((action) => (
                          <Button
                            key={action.id}
                            variant={action.variant === 'primary' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <NovaChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isStreaming}
            placeholder="Ask Nova anything..."
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 hidden lg:block">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(suggestion.label)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <suggestion.icon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Active Agents</span>
              <span className="font-medium text-gray-900 dark:text-white">{mockDashboardStats.activeAgents}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Pending Approvals</span>
              <Badge variant={mockDashboardStats.checkpointsPending > 0 ? 'danger' : 'secondary'}>
                {mockDashboardStats.checkpointsPending}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tokens Today</span>
              <span className="font-medium text-gray-900 dark:text-white">{mockDashboardStats.tokensUsedToday}</span>
            </div>
          </Card>
        </div>

        {/* About Nova */}
        <div className="mt-6">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-0">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About Nova</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Nova is your system intelligence - always available, never hired. 
              Nova helps you navigate CHE·NU, answers questions, and provides insights 
              across all your spheres while respecting governance boundaries.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper functions for simulating responses
function getNovaResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('pending') || lowerQuery.includes('approval')) {
    return `I found ${mockDashboardStats.checkpointsPending} pending approvals that need your attention:\n\n1. **Send Marketing Email Campaign** (High Risk) - Content Creator wants to send emails to 5,000 subscribers\n2. **Delete Old Customer Records** (Critical) - Sales Analyst requests deletion of 150 records\n3. **Post to Social Media** (Low Risk) - Scheduled posts ready for publishing\n\nWould you like me to show more details or help you review any of these?`
  }

  if (lowerQuery.includes('focus') || lowerQuery.includes('today')) {
    return `Based on your current threads and pending tasks, here's what I recommend focusing on today:\n\n**Priority 1:** Review the critical checkpoint for deleting customer records\n**Priority 2:** Continue the Q1 Marketing Strategy thread - you have unread messages\n**Priority 3:** Check in with Content Creator who's working on YouTube thumbnails\n\nYou have ${mockDashboardStats.tokensUsedToday} tokens used today out of your daily budget. You're on track!`
  }

  if (lowerQuery.includes('agents') || lowerQuery.includes('working')) {
    return `You currently have ${mockDashboardStats.activeAgents} agents actively working:\n\n• **Content Creator** - Generating thumbnail variations\n• **Task Organizer** - Managing your daily schedule\n• **Social Media Manager** - Monitoring engagement metrics\n• **Research Assistant** - Analyzing literature\n\nAll agents are operating within their defined scopes. Would you like to pause any agents or check their task progress?`
  }

  return `I understand you're asking about "${query}". Let me help you with that.\n\nAs your system intelligence, I can:\n• Search across your threads and data\n• Coordinate with your hired agents\n• Help you navigate governance requirements\n• Provide insights from your activities\n\nCould you be more specific about what you'd like to accomplish?`
}

function getSuggestionsForResponse(query: string): string[] {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('pending') || lowerQuery.includes('approval')) {
    return ['Approve all low-risk items', 'Show critical items only', 'Open Governance page']
  }

  if (lowerQuery.includes('focus') || lowerQuery.includes('today')) {
    return ['Show my calendar', 'Create a task list', 'Summarize pending work']
  }

  return ['Tell me more', 'Show related threads', 'What else can you do?']
}

function getActionsForResponse(query: string): NovaMessage['actions'] {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('pending') || lowerQuery.includes('approval')) {
    return [
      { id: 'go-governance', label: 'Open Governance', variant: 'primary', onClick: () => {} },
    ]
  }

  return undefined
}
