import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { assistantService } from '@/services'
import { Send, Cpu, User, Loader2, Sparkles, Building2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
}

const suggestedQuestions = [
  "Valide la licence RBQ 5678-1234-56",
  "Calcule le coût pour 40h d'électricien",
  "Quelles subventions pour l'isolation?",
  "EPI requis pour travaux en hauteur",
  "Obligations CNESST pour 15 travailleurs",
]

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour! Je suis l'assistant CHE·NU, spécialisé en gestion de projets de construction au Québec. Je peux vous aider avec:\n\n• Validation de licences RBQ\n• Calculs de coûts CCQ\n• Exigences CNESST\n• Recherche de subventions\n• Rapports de projet\n\nComment puis-je vous aider aujourd'hui?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await assistantService.chat(
        messageText,
        undefined,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        model: response.model,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-chenu-400" size={24} />
            Assistant CHE·NU
          </h1>
          <p className="text-gray-400 text-sm">Propulsé par Claude 3.5 Sonnet</p>
        </div>
        <Badge variant="success">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
          En ligne
        </Badge>
      </div>

      <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                message.role === 'assistant' 
                  ? 'bg-gradient-to-br from-chenu-500 to-chenu-700' 
                  : 'bg-gradient-to-br from-orange-500 to-yellow-500'
              )}>
                {message.role === 'assistant' ? <Cpu size={16} className="text-white" /> : <User size={16} className="text-white" />}
              </div>
              <div className={clsx(
                'max-w-[80%] rounded-2xl p-4',
                message.role === 'assistant' 
                  ? 'bg-gray-800' 
                  : 'bg-chenu-600'
              )}>
                <p className="text-white whitespace-pre-wrap">{message.content}</p>
                {message.model && (
                  <p className="text-xs text-gray-500 mt-2">{message.model}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chenu-500 to-chenu-700 flex items-center justify-center">
                <Loader2 size={16} className="text-white animate-spin" />
              </div>
              <div className="bg-gray-800 rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Questions suggérées:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-3">
            <Input
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
