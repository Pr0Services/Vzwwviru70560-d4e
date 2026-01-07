/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PROFILE PAGE                                    ║
 * ║                    Task B3.5: User profile with stats and preferences         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  User, Mail, Calendar, Shield, Coins, Bot,
  MessageSquare, FileText, Clock, Activity,
  Edit2, Camera, Check, X, Loader2, Star,
  Award, TrendingUp, Zap, Target, ChevronRight,
  Lock, Bell, Palette, Globe, LogOut
} from 'lucide-react'
import { useAuthStore, useGovernanceStore, useAgentsStore, useThreadsStore } from '@/stores'
import { useToast } from '@/components/ui/Toast'
import { TokenBadge } from '@/components/governance/TokenBudget'
import { formatTokens, formatDistanceToNow } from '@/utils'

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore()
  const { tokenBudget } = useGovernanceStore()
  const { hiredAgents } = useAgentsStore()
  const { threads } = useThreadsStore()
  const { success, error } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    display_name: user?.display_name || '',
    email: user?.email || '',
    bio: '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile(editForm)
      success('Profil mis à jour', 'Vos informations ont été sauvegardées')
      setIsEditing(false)
    } catch (err) {
      error('Erreur', 'Impossible de mettre à jour le profil')
    } finally {
      setIsSaving(false)
    }
  }

  // Stats
  const stats = {
    threadsCreated: threads.length,
    agentsHired: hiredAgents.length,
    tokensUsed: tokenBudget?.used || 0,
    tokensRemaining: (tokenBudget?.limit || 100000) - (tokenBudget?.used || 0),
    memberSince: user?.created_at || new Date().toISOString(),
  }

  // Achievements (mock)
  const achievements = [
    { id: '1', name: 'Premier Thread', description: 'Créez votre premier thread', icon: MessageSquare, unlocked: true },
    { id: '2', name: 'Agent Master', description: 'Engagez 5 agents', icon: Bot, unlocked: hiredAgents.length >= 5 },
    { id: '3', name: 'Power User', description: 'Utilisez 10K tokens', icon: Zap, unlocked: stats.tokensUsed >= 10000 },
    { id: '4', name: 'Nova Friend', description: 'Interagissez avec Nova 10 fois', icon: Star, unlocked: false },
  ]

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-cenote-turquoise/30 via-sphere-studio/20 to-sacred-gold/20" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-ui-slate border-4 border-ui-slate flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-display font-semibold text-soft-sand">
                    {(user?.display_name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-cenote-turquoise text-white hover:bg-cenote-turquoise/80">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    className="text-xl font-display font-semibold text-soft-sand bg-transparent border-b border-white/20 focus:border-cenote-turquoise focus:outline-none"
                  />
                ) : (
                  <h1 className="text-xl font-display font-semibold text-soft-sand">
                    {user?.display_name || 'Utilisateur'}
                  </h1>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs bg-sacred-gold/20 text-sacred-gold">
                  Pro
                </span>
              </div>
              <p className="text-sm text-ancient-stone flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={MessageSquare} label="Threads" value={stats.threadsCreated} />
            <StatCard icon={Bot} label="Agents" value={stats.agentsHired} />
            <StatCard icon={Coins} label="Tokens utilisés" value={formatTokens(stats.tokensUsed)} />
            <StatCard icon={Calendar} label="Membre depuis" value={formatMemberSince(stats.memberSince)} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-display font-semibold text-soft-sand mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cenote-turquoise" />
              Activité Récente
            </h2>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-cenote-turquoise hover:underline">
              Voir toute l'activité
            </button>
          </div>

          {/* Achievements */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-display font-semibold text-soft-sand mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-sacred-gold" />
              Accomplissements
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Token Overview */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-sacred-gold" />
              Budget Tokens
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ancient-stone">Utilisés</span>
                <span className="text-sm text-soft-sand">{formatTokens(stats.tokensUsed)}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-sacred-gold rounded-full"
                  style={{ width: `${((stats.tokensUsed) / (tokenBudget?.limit || 100000)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ancient-stone">Restants</span>
                <span className="text-sm text-jungle-emerald">{formatTokens(stats.tokensRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-medium text-soft-sand mb-3">Actions Rapides</h3>
            <div className="space-y-1">
              <QuickAction icon={Lock} label="Sécurité" href="/settings/security" />
              <QuickAction icon={Bell} label="Notifications" href="/settings/notifications" />
              <QuickAction icon={Palette} label="Apparence" href="/settings/appearance" />
              <QuickAction icon={Globe} label="Langue" href="/settings/language" />
              <QuickAction icon={Shield} label="Gouvernance" href="/settings/governance" />
            </div>
          </div>

          {/* Hired Agents */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-medium text-soft-sand mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-jungle-emerald" />
              Agents Engagés ({hiredAgents.length})
            </h3>
            {hiredAgents.length > 0 ? (
              <div className="space-y-2">
                {hiredAgents.slice(0, 3).map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Bot className="w-4 h-4 text-jungle-emerald" />
                    <span className="text-sm text-soft-sand flex-1 truncate">{agent.name}</span>
                    <span className="text-xs text-ancient-stone">{agent.level}</span>
                  </div>
                ))}
                {hiredAgents.length > 3 && (
                  <button className="w-full text-xs text-cenote-turquoise hover:underline">
                    +{hiredAgents.length - 3} autres
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-ancient-stone">Aucun agent engagé</p>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  )
}

// Stat Card
function StatCard({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType
  label: string
  value: string | number 
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5">
      <Icon className="w-4 h-4 text-ancient-stone mb-2" />
      <div className="text-lg font-display font-semibold text-soft-sand">{value}</div>
      <div className="text-xs text-ancient-stone">{label}</div>
    </div>
  )
}

// Activity Item
function ActivityItem({ activity }: { activity: typeof mockActivity[0] }) {
  const typeConfig = {
    thread: { icon: MessageSquare, color: 'text-cenote-turquoise' },
    agent: { icon: Bot, color: 'text-jungle-emerald' },
    token: { icon: Coins, color: 'text-sacred-gold' },
  }

  const config = typeConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-soft-sand">{activity.description}</p>
        <p className="text-xs text-ancient-stone">{formatDistanceToNow(activity.timestamp)}</p>
      </div>
    </div>
  )
}

// Achievement Card
function AchievementCard({ 
  achievement 
}: { 
  achievement: { id: string; name: string; description: string; icon: React.ElementType; unlocked: boolean }
}) {
  const Icon = achievement.icon

  return (
    <div className={`
      p-3 rounded-xl border transition-colors
      ${achievement.unlocked 
        ? 'border-sacred-gold/30 bg-sacred-gold/10' 
        : 'border-white/5 bg-white/[0.02] opacity-50'}
    `}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${achievement.unlocked ? 'bg-sacred-gold/20' : 'bg-white/5'}
        `}>
          <Icon className={`w-5 h-5 ${achievement.unlocked ? 'text-sacred-gold' : 'text-ancient-stone'}`} />
        </div>
        {achievement.unlocked && (
          <Check className="w-4 h-4 text-sacred-gold" />
        )}
      </div>
      <h4 className="text-sm font-medium text-soft-sand mb-1">{achievement.name}</h4>
      <p className="text-xs text-ancient-stone">{achievement.description}</p>
    </div>
  )
}

// Quick Action
function QuickAction({ 
  icon: Icon, 
  label, 
  href 
}: { 
  icon: React.ElementType
  label: string
  href: string 
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <Icon className="w-4 h-4 text-ancient-stone" />
      <span className="text-sm text-soft-sand flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-ancient-stone opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

// Helper
function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const months = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
  
  if (months < 1) return 'Ce mois'
  if (months === 1) return '1 mois'
  if (months < 12) return `${months} mois`
  
  const years = Math.floor(months / 12)
  return years === 1 ? '1 an' : `${years} ans`
}

// Mock Data
const mockActivity = [
  { id: '1', type: 'thread' as const, description: 'Nouveau thread créé: "Rapport Q4 2024"', timestamp: new Date().toISOString() },
  { id: '2', type: 'agent' as const, description: 'Agent Research engagé', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '3', type: 'token' as const, description: '2,500 tokens utilisés', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: '4', type: 'thread' as const, description: 'Message envoyé dans "Planning hebdo"', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
]
