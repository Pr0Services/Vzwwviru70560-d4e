/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MEETING ROOM COMPONENT                          ║
 * ║                    Task B3.1: Virtual meeting room with participants          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react'
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Users, MessageSquare, Share2, Settings, Maximize2,
  Minimize2, MoreHorizontal, Hand, Sparkles, Bot,
  Clock, Calendar, Link2, Copy, Check, ChevronDown,
  Monitor, Grid, User, Crown
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { AgentBadge } from '@/components/agents/AgentCard'
import { formatDistanceToNow } from '@/utils'
import type { SphereId, Agent } from '@/types'

interface Participant {
  id: string
  name: string
  avatar?: string
  type: 'user' | 'agent' | 'nova'
  level?: 'L0' | 'L1' | 'L2' | 'L3'
  isHost: boolean
  isSpeaking: boolean
  isMuted: boolean
  isVideoOn: boolean
  handRaised: boolean
}

interface MeetingRoomProps {
  meetingId: string
  sphereId: SphereId
  title: string
  participants?: Participant[]
  onLeave?: () => void
  onInvite?: () => void
}

export default function MeetingRoom({
  meetingId,
  sphereId,
  title,
  participants: initialParticipants = mockParticipants,
  onLeave,
  onInvite,
}: MeetingRoomProps) {
  const { success, nova } = useToast()

  const [participants, setParticipants] = useState(initialParticipants)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid')
  const [handRaised, setHandRaised] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [copied, setCopied] = useState(false)

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    if (!isScreenSharing) {
      success('Partage d\'écran', 'Partage démarré')
    }
  }

  const toggleHandRaise = () => {
    setHandRaised(!handRaised)
    if (!handRaised) {
      nova('Main levée', 'Les autres participants ont été notifiés')
    }
  }

  const copyMeetingLink = async () => {
    await navigator.clipboard.writeText(`https://che.nu/meeting/${meetingId}`)
    setCopied(true)
    success('Lien copié', 'Lien de réunion copié dans le presse-papier')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLeave = () => {
    onLeave?.()
  }

  // Get speaker (person currently talking or host)
  const speaker = participants.find(p => p.isSpeaking) || participants.find(p => p.isHost) || participants[0]

  return (
    <div className={`
      flex flex-col bg-ui-slate
      ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full rounded-2xl border border-white/5'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sphere-team/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-sphere-team" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-soft-sand">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-ancient-stone">
              <Clock className="w-3 h-3" />
              <span>{formatTime(elapsedTime)}</span>
              <span>•</span>
              <Users className="w-3 h-3" />
              <span>{participants.length} participants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Link */}
          <button
            onClick={copyMeetingLink}
            className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
            title="Copier le lien"
          >
            {copied ? <Check className="w-4 h-4 text-jungle-emerald" /> : <Link2 className="w-4 h-4" />}
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-soft-sand' : 'text-ancient-stone'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('speaker')}
              className={`p-1.5 rounded ${viewMode === 'speaker' ? 'bg-white/10 text-soft-sand' : 'text-ancient-stone'}`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          {viewMode === 'grid' ? (
            <div className={`
              grid gap-3 h-full
              ${participants.length <= 2 ? 'grid-cols-2' : 
                participants.length <= 4 ? 'grid-cols-2 grid-rows-2' :
                participants.length <= 6 ? 'grid-cols-3 grid-rows-2' :
                'grid-cols-4 grid-rows-2'}
            `}>
              {participants.map((participant) => (
                <ParticipantTile 
                  key={participant.id} 
                  participant={participant}
                  isLarge={participants.length <= 2}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col gap-3">
              {/* Main Speaker */}
              <div className="flex-1">
                <ParticipantTile participant={speaker} isLarge />
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {participants.filter(p => p.id !== speaker.id).map((participant) => (
                  <div key={participant.id} className="w-32 h-24 flex-shrink-0">
                    <ParticipantTile participant={participant} isSmall />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Participants */}
        {showParticipants && (
          <div className="w-72 border-l border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5">
              <h4 className="text-sm font-medium text-soft-sand">Participants ({participants.length})</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {participants.map((p) => (
                <ParticipantListItem key={p.id} participant={p} />
              ))}
            </div>
            <div className="p-3 border-t border-white/5">
              <button
                onClick={onInvite}
                className="w-full btn-outline text-sm flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Inviter
              </button>
            </div>
          </div>
        )}

        {/* Sidebar - Chat */}
        {showChat && (
          <div className="w-80 border-l border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5">
              <h4 className="text-sm font-medium text-soft-sand">Chat de réunion</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {mockChatMessages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
            <div className="p-3 border-t border-white/5">
              <input
                type="text"
                placeholder="Envoyer un message..."
                className="input w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/5">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`
              p-3 rounded-xl transition-colors
              ${isMuted 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`
              p-3 rounded-xl transition-colors
              ${!isVideoOn 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`
              p-3 rounded-xl transition-colors
              ${isScreenSharing 
                ? 'bg-jungle-emerald/20 text-jungle-emerald hover:bg-jungle-emerald/30' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Hand Raise */}
          <button
            onClick={toggleHandRaise}
            className={`
              p-3 rounded-xl transition-colors
              ${handRaised 
                ? 'bg-sacred-gold/20 text-sacred-gold hover:bg-sacred-gold/30' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            <Hand className="w-5 h-5" />
          </button>
        </div>

        {/* Center - End Call */}
        <button
          onClick={handleLeave}
          className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
        >
          <PhoneOff className="w-5 h-5" />
          Quitter
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Participants */}
          <button
            onClick={() => { setShowParticipants(!showParticipants); setShowChat(false) }}
            className={`
              p-3 rounded-xl transition-colors
              ${showParticipants 
                ? 'bg-cenote-turquoise/20 text-cenote-turquoise' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Chat */}
          <button
            onClick={() => { setShowChat(!showChat); setShowParticipants(false) }}
            className={`
              p-3 rounded-xl transition-colors
              ${showChat 
                ? 'bg-cenote-turquoise/20 text-cenote-turquoise' 
                : 'bg-white/5 text-soft-sand hover:bg-white/10'}
            `}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button className="p-3 rounded-xl bg-white/5 text-soft-sand hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Participant Tile Component
function ParticipantTile({ 
  participant, 
  isLarge = false,
  isSmall = false,
}: { 
  participant: Participant
  isLarge?: boolean
  isSmall?: boolean
}) {
  const isNova = participant.type === 'nova'
  const isAgent = participant.type === 'agent'

  return (
    <div className={`
      relative rounded-xl overflow-hidden bg-white/5 flex items-center justify-center
      ${participant.isSpeaking ? 'ring-2 ring-jungle-emerald' : ''}
      ${isLarge ? 'min-h-[200px]' : isSmall ? '' : 'min-h-[120px]'}
    `}>
      {/* Video/Avatar */}
      {participant.isVideoOn ? (
        <div className="absolute inset-0 bg-gradient-to-br from-cenote-turquoise/20 to-sphere-studio/20" />
      ) : (
        <div className={`
          rounded-full flex items-center justify-center
          ${isLarge ? 'w-24 h-24' : isSmall ? 'w-12 h-12' : 'w-16 h-16'}
          ${isNova ? 'bg-sacred-gold/20' : isAgent ? 'bg-jungle-emerald/20' : 'bg-cenote-turquoise/20'}
        `}>
          {isNova ? (
            <Sparkles className={`${isLarge ? 'w-12 h-12' : isSmall ? 'w-6 h-6' : 'w-8 h-8'} text-sacred-gold`} />
          ) : isAgent ? (
            <Bot className={`${isLarge ? 'w-12 h-12' : isSmall ? 'w-6 h-6' : 'w-8 h-8'} text-jungle-emerald`} />
          ) : participant.avatar ? (
            <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className={`${isLarge ? 'text-3xl' : isSmall ? 'text-sm' : 'text-xl'} font-medium text-soft-sand`}>
              {participant.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* Name & Status */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
          {participant.isHost && <Crown className="w-3 h-3 text-sacred-gold" />}
          <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white truncate`}>
            {participant.name}
          </span>
          {participant.level && (
            <span className="text-xs text-ancient-stone">{participant.level}</span>
          )}
        </div>
        
        {participant.isMuted && (
          <div className="p-1 rounded-lg bg-red-500/80">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Hand Raised */}
      {participant.handRaised && (
        <div className="absolute top-2 right-2 p-2 rounded-lg bg-sacred-gold/90 animate-bounce">
          <Hand className="w-4 h-4 text-ui-slate" />
        </div>
      )}

      {/* Speaking Indicator */}
      {participant.isSpeaking && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-jungle-emerald/90">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs text-white">Parle</span>
        </div>
      )}
    </div>
  )
}

// Participant List Item
function ParticipantListItem({ participant }: { participant: Participant }) {
  const isNova = participant.type === 'nova'
  const isAgent = participant.type === 'agent'

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center
        ${isNova ? 'bg-sacred-gold/20' : isAgent ? 'bg-jungle-emerald/20' : 'bg-cenote-turquoise/20'}
      `}>
        {isNova ? (
          <Sparkles className="w-4 h-4 text-sacred-gold" />
        ) : isAgent ? (
          <Bot className="w-4 h-4 text-jungle-emerald" />
        ) : (
          <span className="text-sm font-medium text-soft-sand">
            {participant.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-soft-sand truncate">{participant.name}</span>
          {participant.isHost && <Crown className="w-3 h-3 text-sacred-gold" />}
          {participant.level && (
            <span className="text-xs text-ancient-stone">{participant.level}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {participant.isMuted && <MicOff className="w-3 h-3 text-red-400" />}
        {!participant.isVideoOn && <VideoOff className="w-3 h-3 text-red-400" />}
        {participant.handRaised && <Hand className="w-3 h-3 text-sacred-gold" />}
      </div>
    </div>
  )
}

// Chat Message
function ChatMessage({ message }: { message: typeof mockChatMessages[0] }) {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full bg-cenote-turquoise/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-cenote-turquoise">{message.sender.charAt(0)}</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-soft-sand">{message.sender}</span>
          <span className="text-xs text-ancient-stone">{message.time}</span>
        </div>
        <p className="text-sm text-ancient-stone">{message.content}</p>
      </div>
    </div>
  )
}

// Mock Data
const mockParticipants: Participant[] = [
  { id: '1', name: 'Jo', type: 'user', isHost: true, isSpeaking: false, isMuted: false, isVideoOn: true, handRaised: false },
  { id: '2', name: 'Nova', type: 'nova', level: 'L0', isHost: false, isSpeaking: true, isMuted: false, isVideoOn: false, handRaised: false },
  { id: '3', name: 'Research Agent', type: 'agent', level: 'L2', isHost: false, isSpeaking: false, isMuted: true, isVideoOn: false, handRaised: false },
  { id: '4', name: 'Marie', type: 'user', isHost: false, isSpeaking: false, isMuted: false, isVideoOn: true, handRaised: true },
]

const mockChatMessages = [
  { id: '1', sender: 'Nova', content: 'Bienvenue dans cette réunion! Je suis là pour vous assister.', time: '14:30' },
  { id: '2', sender: 'Jo', content: 'Merci Nova. On commence par le point budget?', time: '14:31' },
  { id: '3', sender: 'Marie', content: 'Oui, j\'ai préparé les chiffres.', time: '14:31' },
]

// Mini Meeting Widget (for sidebar)
export function MeetingWidget({ 
  meetingId,
  title,
  participants,
  onClick,
}: {
  meetingId: string
  title: string
  participants: number
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-xl border border-jungle-emerald/30 bg-jungle-emerald/10 hover:bg-jungle-emerald/20 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-jungle-emerald/20 flex items-center justify-center">
          <Video className="w-5 h-5 text-jungle-emerald" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-soft-sand truncate">{title}</p>
          <p className="text-xs text-jungle-emerald">{participants} participants • En cours</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-jungle-emerald animate-pulse" />
      </div>
    </button>
  )
}
