/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AGENT WORKSPACE                                 ║
 * ║                    Task B4.3: Dedicated agent workspace with tools           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  Bot, Sparkles, Settings, Play, Pause, RefreshCw,
  Terminal, FileText, MessageSquare, Zap, Activity,
  Clock, Coins, Shield, ChevronRight, ChevronDown,
  Eye, EyeOff, Copy, Check, AlertTriangle, Info,
  Cpu, Database, Globe, Lock, Unlock, Maximize2,
  X, MoreHorizontal, History, Sliders, Code
} from 'lucide-react'
import { type Agent, type SphereId, SPHERE_CONFIG } from '@/types'
import { formatTokens, formatDistanceToNow } from '@/utils'

interface AgentWorkspaceProps {
  agent: Agent
  sphereId: SphereId
  onClose?: () => void
  onConfigure?: () => void
}

export default function AgentWorkspace({
  agent,
  sphereId,
  onClose,
  onConfigure,
}: AgentWorkspaceProps) {
  const sphere = SPHERE_CONFIG[sphereId]
  
  const [activeTab, setActiveTab] = useState<'console' | 'context' | 'history' | 'config'>('console')
  const [isRunning, setIsRunning] = useState(false)
  const [showContext, setShowContext] = useState(true)

  // Mock data
  const agentStats = {
    tokensUsed: 12450,
    tokensLimit: 50000,
    tasksCompleted: 47,
    avgResponseTime: '2.3s',
    uptime: '99.8%',
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  }

  const levelConfig = {
    L0: { name: 'Système', color: 'text-sacred-gold', bg: 'bg-sacred-gold/20' },
    L1: { name: 'Core', color: 'text-sphere-studio', bg: 'bg-sphere-studio/20' },
    L2: { name: 'Specialist', color: 'text-cenote-turquoise', bg: 'bg-cenote-turquoise/20' },
    L3: { name: 'Helper', color: 'text-jungle-emerald', bg: 'bg-jungle-emerald/20' },
  }

  const config = levelConfig[agent.level as keyof typeof levelConfig] || levelConfig.L2

  return (
    <div className="h-full flex flex-col bg-ui-slate rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Agent Avatar */}
          <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}>
            {agent.level === 'L0' ? (
              <Sparkles className={`w-6 h-6 ${config.color}`} />
            ) : (
              <Bot className={`w-6 h-6 ${config.color}`} />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-semibold text-soft-sand">{agent.name}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                {agent.level}
              </span>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-jungle-emerald animate-pulse' : 'bg-ancient-stone'}`} />
            </div>
            <p className="text-sm text-ancient-stone">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Run/Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg transition-colors ${
              isRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-jungle-emerald/20 text-jungle-emerald hover:bg-jungle-emerald/30'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Refresh */}
          <button className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone">
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Configure */}
          <button 
            onClick={onConfigure}
            className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Close */}
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-6 py-3 border-b border-white/5 bg-white/[0.01]">
        <StatItem icon={Coins} label="Tokens" value={formatTokens(agentStats.tokensUsed)} />
        <StatItem icon={Zap} label="Tâches" value={agentStats.tasksCompleted.toString()} />
        <StatItem icon={Clock} label="Réponse" value={agentStats.avgResponseTime} />
        <StatItem icon={Activity} label="Uptime" value={agentStats.uptime} />
        <div className="flex-1" />
        <span className="text-xs text-ancient-stone">
          Actif {formatDistanceToNow(agentStats.lastActive)}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-white/5">
        {[
          { id: 'console', label: 'Console', icon: Terminal },
          { id: 'context', label: 'Contexte', icon: Database },
          { id: 'history', label: 'Historique', icon: History },
          { id: 'config', label: 'Configuration', icon: Sliders },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-cenote-turquoise/20 text-cenote-turquoise'
                : 'text-ancient-stone hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Panel */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'console' && <ConsolePanel isRunning={isRunning} />}
          {activeTab === 'context' && <ContextPanel agent={agent} />}
          {activeTab === 'history' && <HistoryPanel />}
          {activeTab === 'config' && <ConfigPanel agent={agent} />}
        </div>

        {/* Side Panel - Context Summary */}
        {showContext && activeTab === 'console' && (
          <div className="w-80 border-l border-white/5 overflow-auto">
            <ContextSummary agent={agent} sphereId={sphereId} />
          </div>
        )}
      </div>

      {/* Input Bar (for console) */}
      {activeTab === 'console' && (
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Envoyer une commande à ${agent.name}...`}
              className="flex-1 input"
            />
            <button className="btn-primary">
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Stat Item
function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-ancient-stone" />
      <span className="text-sm text-soft-sand">{value}</span>
      <span className="text-xs text-ancient-stone">{label}</span>
    </div>
  )
}

// Console Panel
function ConsolePanel({ isRunning }: { isRunning: boolean }) {
  const logs = [
    { time: '14:32:15', level: 'info', message: 'Agent initialisé avec succès' },
    { time: '14:32:16', level: 'info', message: 'Connexion au contexte thread #42' },
    { time: '14:32:17', level: 'debug', message: 'Chargement des 15 derniers messages' },
    { time: '14:32:18', level: 'info', message: 'Analyse du contexte en cours...' },
    { time: '14:32:20', level: 'success', message: 'Contexte analysé: 3 topics identifiés' },
    { time: '14:32:21', level: 'info', message: 'En attente de requêtes...' },
    { time: '14:35:42', level: 'info', message: 'Requête reçue: "Résume les points clés"' },
    { time: '14:35:43', level: 'debug', message: 'Génération de la réponse (450 tokens estimés)' },
    { time: '14:35:46', level: 'success', message: 'Réponse générée: 423 tokens utilisés' },
  ]

  const levelColors = {
    info: 'text-cenote-turquoise',
    debug: 'text-ancient-stone',
    success: 'text-jungle-emerald',
    warning: 'text-earth-ember',
    error: 'text-red-400',
  }

  return (
    <div className="p-4 font-mono text-xs">
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3">
            <span className="text-ancient-stone">[{log.time}]</span>
            <span className={levelColors[log.level as keyof typeof levelColors]}>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-soft-sand">{log.message}</span>
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-3 animate-pulse">
            <span className="text-ancient-stone">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-cenote-turquoise">[RUNNING]</span>
            <span className="text-soft-sand">Agent actif...</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Context Panel
function ContextPanel({ agent }: { agent: Agent }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['memory', 'capabilities'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const sections = [
    {
      id: 'memory',
      title: 'Mémoire Active',
      icon: Database,
      content: (
        <div className="space-y-2">
          <ContextItem label="Threads actifs" value="3" />
          <ContextItem label="Messages en contexte" value="45" />
          <ContextItem label="Fichiers référencés" value="7" />
          <ContextItem label="Tokens en mémoire" value="12,450" />
        </div>
      ),
    },
    {
      id: 'capabilities',
      title: 'Capacités',
      icon: Zap,
      content: (
        <div className="flex flex-wrap gap-2">
          {['Analyse', 'Recherche', 'Rédaction', 'Résumé', 'Traduction', 'Code'].map((cap) => (
            <span key={cap} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-soft-sand">
              {cap}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'permissions',
      title: 'Permissions',
      icon: Shield,
      content: (
        <div className="space-y-2">
          <PermissionItem label="Lecture threads" granted />
          <PermissionItem label="Écriture threads" granted />
          <PermissionItem label="Accès DataSpace" granted />
          <PermissionItem label="API externes" granted={false} />
          <PermissionItem label="Cross-sphere" granted={false} />
        </div>
      ),
    },
    {
      id: 'limits',
      title: 'Limites',
      icon: AlertTriangle,
      content: (
        <div className="space-y-2">
          <ContextItem label="Tokens/requête" value="4,096 max" />
          <ContextItem label="Requêtes/minute" value="10" />
          <ContextItem label="Contexte window" value="32K tokens" />
          <ContextItem label="Durée session" value="24h" />
        </div>
      ),
    },
  ]

  return (
    <div className="p-4 space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <section.icon className="w-4 h-4 text-cenote-turquoise" />
              <span className="text-sm font-medium text-soft-sand">{section.title}</span>
            </div>
            {expandedSections.includes(section.id) ? (
              <ChevronDown className="w-4 h-4 text-ancient-stone" />
            ) : (
              <ChevronRight className="w-4 h-4 text-ancient-stone" />
            )}
          </button>
          {expandedSections.includes(section.id) && (
            <div className="px-4 pb-4">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Context Item
function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ancient-stone">{label}</span>
      <span className="text-sm text-soft-sand">{value}</span>
    </div>
  )
}

// Permission Item
function PermissionItem({ label, granted }: { label: string; granted: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ancient-stone">{label}</span>
      {granted ? (
        <Check className="w-4 h-4 text-jungle-emerald" />
      ) : (
        <X className="w-4 h-4 text-red-400" />
      )}
    </div>
  )
}

// History Panel
function HistoryPanel() {
  const history = [
    { time: 'Aujourd\'hui 14:35', action: 'Résumé généré', tokens: 423, thread: 'Rapport Q4' },
    { time: 'Aujourd\'hui 12:20', action: 'Analyse données', tokens: 1250, thread: 'Budget 2025' },
    { time: 'Hier 18:45', action: 'Recherche effectuée', tokens: 890, thread: 'Veille marché' },
    { time: 'Hier 15:30', action: 'Traduction document', tokens: 2100, thread: 'Contrat EN' },
    { time: '2 jan 10:15', action: 'Rédaction email', tokens: 340, thread: 'Communication' },
  ]

  return (
    <div className="p-4">
      <div className="space-y-2">
        {history.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-ancient-stone" />
              <div>
                <p className="text-sm text-soft-sand">{item.action}</p>
                <p className="text-xs text-ancient-stone">{item.time} • {item.thread}</p>
              </div>
            </div>
            <span className="text-xs text-sacred-gold">{item.tokens} tokens</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Config Panel
function ConfigPanel({ agent }: { agent: Agent }) {
  return (
    <div className="p-4 space-y-6">
      {/* General Settings */}
      <div>
        <h3 className="text-sm font-medium text-soft-sand mb-3">Général</h3>
        <div className="space-y-3">
          <ConfigRow label="Nom d'affichage" value={agent.name} editable />
          <ConfigRow label="Niveau" value={agent.level} />
          <ConfigRow label="Scope" value="Sphère Business" editable />
        </div>
      </div>

      {/* Token Limits */}
      <div>
        <h3 className="text-sm font-medium text-soft-sand mb-3">Limites Tokens</h3>
        <div className="space-y-3">
          <ConfigRow label="Budget mensuel" value="50,000" editable />
          <ConfigRow label="Max par requête" value="4,096" />
          <ConfigRow label="Alerte à" value="80%" editable />
        </div>
      </div>

      {/* Behavior */}
      <div>
        <h3 className="text-sm font-medium text-soft-sand mb-3">Comportement</h3>
        <div className="space-y-3">
          <ConfigToggle label="Réponses automatiques" enabled />
          <ConfigToggle label="Notifications" enabled />
          <ConfigToggle label="Mode debug" enabled={false} />
        </div>
      </div>
    </div>
  )
}

// Config Row
function ConfigRow({ 
  label, 
  value, 
  editable = false 
}: { 
  label: string
  value: string
  editable?: boolean 
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-sm text-ancient-stone">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-soft-sand">{value}</span>
        {editable && <Settings className="w-3 h-3 text-ancient-stone" />}
      </div>
    </div>
  )
}

// Config Toggle
function ConfigToggle({ label, enabled }: { label: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-sm text-ancient-stone">{label}</span>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`w-10 h-6 rounded-full transition-colors ${
          isEnabled ? 'bg-jungle-emerald' : 'bg-white/20'
        }`}
      >
        <div className={`w-4 h-4 rounded-full bg-white m-1 transition-transform ${
          isEnabled ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}

// Context Summary (Side Panel)
function ContextSummary({ agent, sphereId }: { agent: Agent; sphereId: SphereId }) {
  const sphere = SPHERE_CONFIG[sphereId]

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-soft-sand">Contexte Actuel</h3>

      {/* Active Thread */}
      <div className="p-3 rounded-xl bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-cenote-turquoise" />
          <span className="text-xs text-ancient-stone">Thread actif</span>
        </div>
        <p className="text-sm text-soft-sand">Rapport Q4 2024</p>
        <p className="text-xs text-ancient-stone mt-1">15 messages • 3 participants</p>
      </div>

      {/* Sphere */}
      <div className="p-3 rounded-xl bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: sphere.color }}
          />
          <span className="text-xs text-ancient-stone">Sphère</span>
        </div>
        <p className="text-sm text-soft-sand">{sphere.name}</p>
      </div>

      {/* Recent Files */}
      <div className="p-3 rounded-xl bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-earth-ember" />
          <span className="text-xs text-ancient-stone">Fichiers récents</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-soft-sand">data_q4.xlsx</p>
          <p className="text-xs text-soft-sand">rapport_draft.md</p>
        </div>
      </div>

      {/* Tokens */}
      <div className="p-3 rounded-xl bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-4 h-4 text-sacred-gold" />
          <span className="text-xs text-ancient-stone">Session</span>
        </div>
        <p className="text-sm text-soft-sand">2,340 tokens utilisés</p>
        <div className="h-1 rounded-full bg-white/10 mt-2">
          <div className="h-full w-1/3 rounded-full bg-sacred-gold" />
        </div>
      </div>
    </div>
  )
}
