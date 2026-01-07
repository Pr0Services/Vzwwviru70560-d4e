// ================================
// SURFACE A — NOVA
// Dialogue & Governance Layer
// ================================

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, User, Loader2, Shield, Brain, Zap, ChevronRight } from 'lucide-react'
import type { Sphere, WorkspaceVersion } from '@/pages/app/ChenuApp'
import { clsx } from 'clsx'

interface Message {
  id: string
  role: 'user' | 'nova' | 'system'
  content: string
  timestamp: Date
  action?: {
    type: 'propose' | 'confirm' | 'navigate'
    payload?: unknown
  }
}

interface SurfaceNovaProps {
  activeSphere: Sphere | null
  onPropose: (content: string) => WorkspaceVersion
}

const capabilities = [
  { icon: Shield, label: 'Gouvernance', description: 'Protection de votre intention' },
  { icon: Brain, label: 'Analyse', description: 'Compréhension contextuelle' },
  { icon: Zap, label: 'Action', description: 'Orchestration des agents' },
]

const suggestedPrompts = [
  "Structure ce document pour moi",
  "Analyse les coûts de ce projet",
  "Génère un rapport de conformité RBQ",
  "Aide-moi à planifier ce chantier",
  "Quelles subventions sont disponibles?",
]

export function SurfaceNova({ activeSphere, onPropose }: SurfaceNovaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nova',
      content: `Bonjour, je suis **Nova**, votre interface de gouvernance CHE·NU.

Je suis ici pour:
• **Comprendre** vos intentions et les clarifier
• **Proposer** des structures et solutions adaptées
• **Protéger** l'intégrité de vos décisions
• **Orchestrer** les agents spécialisés selon vos besoins

${activeSphere ? `Vous êtes actuellement dans la sphère **${activeSphere.name}**. Je peux mobiliser ${activeSphere.agentCount} agents spécialisés.` : 'Sélectionnez une sphère pour activer le contexte approprié.'}

Comment puis-je vous aider?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isThinking) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Simulate Nova thinking
    await new Promise(resolve => setTimeout(resolve, 1500))

    const novaResponse: Message = {
      id: crypto.randomUUID(),
      role: 'nova',
      content: generateNovaResponse(messageText, activeSphere),
      timestamp: new Date(),
      action: messageText.toLowerCase().includes('structure') || messageText.toLowerCase().includes('génère')
        ? { type: 'propose' }
        : undefined
    }

    setMessages(prev => [...prev, novaResponse])
    setIsThinking(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex"
    >
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-6">
        {/* Nova Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-chenu-500 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/20 animate-pulse-slow">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Nova
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-normal">
                Gouvernance IA
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Interface de dialogue et protection d'intention</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                message.role === 'nova' 
                  ? 'bg-gradient-to-br from-purple-500 to-chenu-600' 
                  : 'bg-gradient-to-br from-orange-500 to-yellow-500'
              )}>
                {message.role === 'nova' ? <Sparkles size={18} className="text-white" /> : <User size={18} className="text-white" />}
              </div>
              
              <div className={clsx(
                'max-w-[75%] rounded-2xl p-4',
                message.role === 'nova' 
                  ? 'bg-gray-800/80 border border-gray-700' 
                  : 'bg-chenu-600'
              )}>
                <div className="text-white whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                  {message.content.split('**').map((part, i) => 
                    i % 2 === 0 ? part : <strong key={i} className="text-chenu-400">{part}</strong>
                  )}
                </div>
                
                {/* Action Button */}
                {message.action?.type === 'propose' && (
                  <button 
                    onClick={() => onPropose('Structured content from Nova...')}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium"
                  >
                    <Zap size={16} />
                    Voir la proposition dans Workspace
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-chenu-600 flex items-center justify-center">
                <Loader2 size={18} className="text-white animate-spin" />
              </div>
              <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm">Nova réfléchit</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 2 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Parlez à Nova..."
            className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isThinking || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-chenu-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Right Panel - Capabilities */}
      <div className="hidden lg:block w-80 border-l border-gray-800 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Capacités Nova
        </h3>
        <div className="space-y-4">
          {capabilities.map((cap, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <cap.icon size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white">{cap.label}</h4>
                  <p className="text-xs text-gray-500">{cap.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Context */}
        {activeSphere && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Contexte Actif
            </h3>
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{activeSphere.icon}</span>
                <span className="font-medium text-white">{activeSphere.name}</span>
              </div>
              <p className="text-sm text-gray-400">{activeSphere.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {activeSphere.agentCount} agents disponibles
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Helper function to generate Nova responses
function generateNovaResponse(userMessage: string, sphere: Sphere | null): string {
  const msg = userMessage.toLowerCase()
  
  if (msg.includes('structure') || msg.includes('organise')) {
    return `Je comprends que vous souhaitez structurer ce contenu.

**Proposition:**
Je peux créer une version structurée avec:
• Sections logiques identifiées
• Hiérarchie claire des informations
• Formatage professionnel

Voulez-vous que je prépare cette version dans le **Workspace**? Vous pourrez l'examiner et l'accepter ou la modifier.`
  }
  
  if (msg.includes('coût') || msg.includes('budget') || msg.includes('estimation')) {
    return `Pour l'analyse des coûts, je vais mobiliser les agents spécialisés:

• **Agent CCQ** - Calcul des taux horaires par métier
• **Agent Estimateur** - Matériaux et quantités
• **Agent Budget** - Consolidation financière

${sphere?.name === 'Construction' ? '✓ Vous êtes dans le bon contexte.' : '⚠️ Je suggère de basculer vers la sphère **Construction** pour un meilleur résultat.'}

Avez-vous des données spécifiques à analyser?`
  }
  
  if (msg.includes('rbq') || msg.includes('licence') || msg.includes('conformité')) {
    return `Pour la conformité RBQ, je peux:

1. **Valider** un numéro de licence d'entrepreneur
2. **Vérifier** les catégories requises pour votre projet
3. **Générer** un rapport de conformité complet

Quelle action souhaitez-vous effectuer?`
  }
  
  if (msg.includes('subvention') || msg.includes('aide financière')) {
    return `Je vais rechercher les subventions applicables à votre projet.

**Programmes disponibles au Québec:**
• Rénoclimat - Efficacité énergétique
• Novoclimat - Construction neuve
• Chauffez Vert - Conversion énergétique
• LogiRénov - Rénovation résidentielle

Pour une analyse personnalisée, décrivez votre projet ou partagez les détails dans le **Workspace**.`
  }
  
  return `Je comprends votre demande concernant "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}".

${sphere 
  ? `Dans le contexte de la sphère **${sphere.name}**, je peux mobiliser les agents appropriés pour vous aider.`
  : 'Sélectionnez une sphère pour activer le contexte optimal.'}

Comment souhaitez-vous procéder?`
}
