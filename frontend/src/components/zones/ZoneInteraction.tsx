/**
 * CHE·NU — ZONE INTERACTION
 * ============================================================
 * Nova · Dialogue · Gouvernance
 * 
 * Cette zone est le point de contact principal avec Nova.
 * L'utilisateur peut dialoguer, poser des questions, et
 * recevoir des explications sur les actions proposées.
 * 
 * @version 27.0.0
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff, Sparkles, Shield, AlertCircle, CheckCircle } from 'lucide-react'

interface ZoneInteractionProps {
  nova: unknown
  voice: unknown
  orchestrator: unknown
}

export function ZoneInteraction({ nova, voice, orchestrator }: ZoneInteractionProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'nova'
    content: string
    timestamp: Date
    governanceLevel?: 'info' | 'warning' | 'confirmation'
  }>>([
    {
      id: '1',
      role: 'nova',
      content: 'Bonjour! Je suis Nova, votre assistant de gouvernance. Je suis là pour vous aider à comprendre et valider chaque action. Comment puis-je vous aider?',
      timestamp: new Date(),
      governanceLevel: 'info'
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }])

    // Simulate Nova response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_nova`,
        role: 'nova',
        content: `Je comprends votre demande. Avant de procéder, voici ce que je propose:\n\n1. Analyser le contexte actuel\n2. Préparer les recommandations\n3. Vous présenter les options\n\nVoulez-vous que je continue?`,
        timestamp: new Date(),
        governanceLevel: 'confirmation'
      }])
    }, 1000)

    setInput('')
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-950 to-purple-950/20">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Zone Interaction</h1>
            <p className="text-sm text-purple-300">Nova · Dialogue · Gouvernance</p>
          </div>
        </div>
        
        {/* Governance Banner */}
        <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <p className="text-sm text-purple-200">
            <strong>Gouvernance Active:</strong> Toute action requiert votre confirmation explicite.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              message.role === 'user' 
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              {message.role === 'nova' && message.governanceLevel && (
                <div className={`flex items-center gap-2 mb-2 text-xs ${
                  message.governanceLevel === 'info' ? 'text-blue-400' :
                  message.governanceLevel === 'warning' ? 'text-amber-400' :
                  'text-green-400'
                }`}>
                  {message.governanceLevel === 'confirmation' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message.governanceLevel === 'confirmation' ? 'Confirmation requise' : 'Information'}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => voice?.toggle?.()}
            className={`p-3 rounded-xl transition-colors ${
              voice?.isListening
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {voice?.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question à Nova..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ZoneInteraction
