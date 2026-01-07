/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — GOVERNANCE DASHBOARD                            ║
 * ║                    Task B2.6: System oversight and governance display         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  Shield, Activity, AlertTriangle, CheckCircle2, XCircle,
  Eye, Lock, Unlock, Clock, Users, Bot, Sparkles,
  FileText, BarChart3, TrendingUp, Settings, RefreshCw,
  ChevronRight, ExternalLink, Filter
} from 'lucide-react'
import { useGovernanceStore, useAgentsStore } from '@/stores'
import TokenBudget from './TokenBudget'
import { formatDistanceToNow } from '@/utils'

type TabId = 'overview' | 'agents' | 'audit' | 'policies'

export default function GovernanceDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const { policies, auditLog, alerts } = useGovernanceStore()
  const { availableAgents, hiredAgents } = useAgentsStore()

  const tabs = [
    { id: 'overview' as TabId, label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'agents' as TabId, label: 'Agents', icon: Bot },
    { id: 'audit' as TabId, label: 'Audit', icon: FileText },
    { id: 'policies' as TabId, label: 'Politiques', icon: Shield },
  ]

  // Stats
  const stats = {
    activeAgents: hiredAgents.length,
    totalAgents: availableAgents.length,
    pendingApprovals: alerts.filter(a => a.type === 'approval_needed').length,
    violations: alerts.filter(a => a.type === 'violation').length,
    auditEvents: auditLog.length,
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sphere-government/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-sphere-government" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-soft-sand">Gouvernance</h2>
            <p className="text-sm text-ancient-stone">Supervision et contrôle du système</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Rafraîchir
          </button>
          <button className="btn-outline flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Paramètres
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'bg-sphere-government/20 text-sphere-government' 
                : 'text-ancient-stone hover:text-soft-sand'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'policies' && <PoliciesTab />}
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab({ stats }: { stats: Record<string, number> }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Bot}
          label="Agents Actifs"
          value={stats.activeAgents}
          total={stats.totalAgents}
          color="text-jungle-emerald"
          trend="+2"
        />
        <StatCard
          icon={Clock}
          label="En attente"
          value={stats.pendingApprovals}
          color="text-earth-ember"
          alert={stats.pendingApprovals > 0}
        />
        <StatCard
          icon={AlertTriangle}
          label="Violations"
          value={stats.violations}
          color="text-red-400"
          alert={stats.violations > 0}
        />
        <StatCard
          icon={FileText}
          label="Événements"
          value={stats.auditEvents}
          color="text-cenote-turquoise"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Token Budget */}
        <TokenBudget showDetails />

        {/* System Status */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <h3 className="text-lg font-display font-semibold text-soft-sand mb-4">
            État du Système
          </h3>
          <div className="space-y-3">
            <StatusItem label="Nova Intelligence" status="active" />
            <StatusItem label="Encoding Layer" status="active" />
            <StatusItem label="Agent Orchestrator" status="active" />
            <StatusItem label="Memory Engine" status="active" />
            <StatusItem label="Thread Service" status="active" />
            <StatusItem label="External APIs" status="degraded" />
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-soft-sand">
            Alertes Récentes
          </h3>
          <button className="text-sm text-cenote-turquoise hover:underline">
            Voir tout
          </button>
        </div>
        <div className="space-y-2">
          {mockAlerts.slice(0, 5).map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Agents Tab
function AgentsTab() {
  const { availableAgents, hiredAgents } = useAgentsStore()

  return (
    <div className="space-y-6">
      {/* Agent Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-2xl font-display font-semibold text-soft-sand mb-1">
            {availableAgents.length}
          </div>
          <div className="text-xs text-ancient-stone">Total disponibles</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-2xl font-display font-semibold text-jungle-emerald mb-1">
            {hiredAgents.length}
          </div>
          <div className="text-xs text-ancient-stone">Engagés</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-2xl font-display font-semibold text-earth-ember mb-1">
            {hiredAgents.filter(a => a.status === 'active' || a.status === 'busy').length}
          </div>
          <div className="text-xs text-ancient-stone">En activité</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-2xl font-display font-semibold text-sacred-gold mb-1">
            {hiredAgents.reduce((sum, a) => sum + a.cost, 0)}
          </div>
          <div className="text-xs text-ancient-stone">Coût total/req</div>
        </div>
      </div>

      {/* Agent Activity */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-lg font-display font-semibold text-soft-sand">
            Activité des Agents
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {mockAgentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activity.level === 'L0' ? 'bg-sacred-gold/20' :
                activity.level === 'L1' ? 'bg-sphere-studio/20' :
                activity.level === 'L2' ? 'bg-cenote-turquoise/20' : 'bg-jungle-emerald/20'
              }`}>
                {activity.level === 'L0' ? (
                  <Sparkles className="w-5 h-5 text-sacred-gold" />
                ) : (
                  <Bot className={`w-5 h-5 ${
                    activity.level === 'L1' ? 'text-sphere-studio' :
                    activity.level === 'L2' ? 'text-cenote-turquoise' : 'text-jungle-emerald'
                  }`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-soft-sand">{activity.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-ancient-stone">
                    {activity.level}
                  </span>
                </div>
                <p className="text-xs text-ancient-stone">{activity.action}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-soft-sand">{activity.tokens} tk</div>
                <div className="text-xs text-ancient-stone">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Audit Tab
function AuditTab() {
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all')

  const filteredLogs = mockAuditLog.filter(log => 
    filter === 'all' || log.level === filter
  )

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-ancient-stone" />
        {(['all', 'info', 'warning', 'error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-3 py-1.5 rounded-lg text-sm transition-colors
              ${filter === f ? 'bg-white/10 text-soft-sand' : 'text-ancient-stone hover:bg-white/5'}
            `}
          >
            {f === 'all' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] divide-y divide-white/5">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-4 p-4">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${log.level === 'error' ? 'bg-red-500/20' : 
                log.level === 'warning' ? 'bg-earth-ember/20' : 'bg-cenote-turquoise/20'}
            `}>
              {log.level === 'error' ? (
                <XCircle className="w-4 h-4 text-red-400" />
              ) : log.level === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-earth-ember" />
              ) : (
                <Activity className="w-4 h-4 text-cenote-turquoise" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-soft-sand">{log.action}</span>
                <span className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-ancient-stone">
                  {log.category}
                </span>
              </div>
              <p className="text-xs text-ancient-stone">{log.details}</p>
            </div>
            <div className="text-xs text-ancient-stone whitespace-nowrap">
              {formatDistanceToNow(log.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Policies Tab
function PoliciesTab() {
  return (
    <div className="space-y-6">
      {/* Active Policies */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-lg font-display font-semibold text-soft-sand">
            Politiques Actives
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {mockPolicies.map((policy) => (
            <div key={policy.id} className="flex items-center gap-4 p-4">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${policy.enabled ? 'bg-jungle-emerald/20' : 'bg-white/5'}
              `}>
                {policy.enabled ? (
                  <Lock className="w-5 h-5 text-jungle-emerald" />
                ) : (
                  <Unlock className="w-5 h-5 text-ancient-stone" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-soft-sand">{policy.name}</span>
                  <span className={`
                    px-1.5 py-0.5 rounded text-xs
                    ${policy.enabled ? 'bg-jungle-emerald/20 text-jungle-emerald' : 'bg-white/5 text-ancient-stone'}
                  `}>
                    {policy.enabled ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-xs text-ancient-stone">{policy.description}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* R&D Rules Reference */}
      <div className="rounded-2xl border border-sacred-gold/20 bg-sacred-gold/5 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sacred-gold flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-sacred-gold mb-1">
              7 Règles R&D CHE·NU
            </h4>
            <p className="text-xs text-ancient-stone mb-3">
              Toutes les politiques respectent les règles fondamentales de gouvernance.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                Human Sovereignty
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                Autonomy Isolation
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                Sphere Integrity
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                My Team Restrictions
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                Social Restrictions
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                Module Traceability
              </div>
              <div className="flex items-center gap-2 text-ancient-stone">
                <CheckCircle2 className="w-3 h-3 text-jungle-emerald" />
                R&D Continuity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({
  icon: Icon,
  label,
  value,
  total,
  color,
  trend,
  alert,
}: {
  icon: React.ElementType
  label: string
  value: number
  total?: number
  color: string
  trend?: string
  alert?: boolean
}) {
  return (
    <div className={`
      p-4 rounded-xl border bg-white/[0.02]
      ${alert ? 'border-red-500/30' : 'border-white/5'}
    `}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        {trend && (
          <span className="text-xs text-jungle-emerald flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-display font-semibold text-soft-sand">
        {value}
        {total && <span className="text-sm text-ancient-stone font-normal">/{total}</span>}
      </div>
      <div className="text-xs text-ancient-stone">{label}</div>
    </div>
  )
}

function StatusItem({ 
  label, 
  status 
}: { 
  label: string
  status: 'active' | 'degraded' | 'error' 
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ancient-stone">{label}</span>
      <div className={`
        flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
        ${status === 'active' ? 'bg-jungle-emerald/20 text-jungle-emerald' :
          status === 'degraded' ? 'bg-earth-ember/20 text-earth-ember' :
          'bg-red-500/20 text-red-400'}
      `}>
        <div className={`w-1.5 h-1.5 rounded-full ${
          status === 'active' ? 'bg-jungle-emerald' :
          status === 'degraded' ? 'bg-earth-ember' : 'bg-red-400'
        }`} />
        {status === 'active' ? 'Actif' : status === 'degraded' ? 'Dégradé' : 'Erreur'}
      </div>
    </div>
  )
}

function AlertItem({ alert }: { alert: typeof mockAlerts[0] }) {
  return (
    <div className={`
      flex items-start gap-3 p-3 rounded-xl
      ${alert.severity === 'critical' ? 'bg-red-500/10' :
        alert.severity === 'warning' ? 'bg-earth-ember/10' : 'bg-white/5'}
    `}>
      {alert.severity === 'critical' ? (
        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      ) : alert.severity === 'warning' ? (
        <AlertTriangle className="w-4 h-4 text-earth-ember flex-shrink-0 mt-0.5" />
      ) : (
        <Activity className="w-4 h-4 text-cenote-turquoise flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-soft-sand">{alert.message}</p>
        <p className="text-xs text-ancient-stone mt-0.5">{formatDistanceToNow(alert.timestamp)}</p>
      </div>
    </div>
  )
}

// Mock Data
const mockAlerts = [
  { id: '1', type: 'violation', severity: 'warning' as const, message: 'Budget tokens à 82% de la limite', timestamp: '2025-01-02T21:00:00Z' },
  { id: '2', type: 'info', severity: 'info' as const, message: 'Nova a terminé l\'analyse du thread #42', timestamp: '2025-01-02T20:45:00Z' },
  { id: '3', type: 'approval_needed', severity: 'warning' as const, message: 'Approbation requise: Cross-sphere transfer', timestamp: '2025-01-02T20:30:00Z' },
  { id: '4', type: 'info', severity: 'info' as const, message: 'Agent Research engagé dans Business sphere', timestamp: '2025-01-02T20:15:00Z' },
  { id: '5', type: 'info', severity: 'info' as const, message: 'Nouvel encoding batch complété', timestamp: '2025-01-02T20:00:00Z' },
]

const mockAgentActivity = [
  { id: '1', name: 'Nova', level: 'L0', action: 'Analyse contextuelle thread #42', tokens: 1250, time: 'Il y a 5 min' },
  { id: '2', name: 'Research Agent', level: 'L2', action: 'Recherche documentation API', tokens: 3400, time: 'Il y a 12 min' },
  { id: '3', name: 'Writer Agent', level: 'L2', action: 'Rédaction rapport Q4', tokens: 2100, time: 'Il y a 25 min' },
  { id: '4', name: 'Code Agent', level: 'L3', action: 'Génération fonction utilitaire', tokens: 850, time: 'Il y a 1h' },
]

const mockAuditLog = [
  { id: '1', level: 'info' as const, action: 'Agent engagé', category: 'agents', details: 'Research Agent (L2) engagé dans Business sphere', timestamp: '2025-01-02T21:00:00Z' },
  { id: '2', level: 'warning' as const, action: 'Budget alert', category: 'governance', details: 'Seuil 80% atteint sur budget mensuel', timestamp: '2025-01-02T20:45:00Z' },
  { id: '3', level: 'info' as const, action: 'Thread créé', category: 'threads', details: 'Nouveau thread "Rapport Q4 2024" dans Business', timestamp: '2025-01-02T20:30:00Z' },
  { id: '4', level: 'info' as const, action: 'Nova analyse', category: 'nova', details: 'Analyse contextuelle complétée pour thread #42', timestamp: '2025-01-02T20:15:00Z' },
  { id: '5', level: 'error' as const, action: 'API timeout', category: 'system', details: 'External API (OpenAI) timeout après 30s', timestamp: '2025-01-02T20:00:00Z' },
]

const mockPolicies = [
  { id: '1', name: 'Human Approval Required', description: 'Toute action sensible nécessite approbation humaine', enabled: true },
  { id: '2', name: 'Token Budget Limits', description: 'Limites de consommation par agent et par sphère', enabled: true },
  { id: '3', name: 'Cross-Sphere Validation', description: 'Transferts inter-sphères nécessitent validation', enabled: true },
  { id: '4', name: 'Audit Trail Complete', description: 'Toutes les actions sont enregistrées', enabled: true },
  { id: '5', name: 'Agent Orchestration Block', description: 'Agents ne peuvent pas orchestrer d\'autres agents', enabled: true },
]
