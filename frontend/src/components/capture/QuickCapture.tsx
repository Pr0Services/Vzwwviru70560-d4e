/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — QUICK CAPTURE COMPONENT                         ║
 * ║                    Task B2.3: Fast idea capture with AI enhancement           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect } from 'react'
import { 
  Zap, Send, Mic, MicOff, Image, Link, Tag,
  Sparkles, Loader2, X, ChevronDown, Check,
  FileText, Calendar, ListTodo, MessageSquare
} from 'lucide-react'
import { useThreadsStore, useSpheresStore } from '@/stores'
import { useToast } from '@/components/ui/Toast'
import type { SphereId } from '@/types'

// Capture types
type CaptureType = 'note' | 'task' | 'event' | 'thread' | 'idea'

const captureTypes: { id: CaptureType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'idea', label: 'Idée', icon: Zap, color: 'text-sacred-gold' },
  { id: 'note', label: 'Note', icon: FileText, color: 'text-cenote-turquoise' },
  { id: 'task', label: 'Tâche', icon: ListTodo, color: 'text-jungle-emerald' },
  { id: 'event', label: 'Événement', icon: Calendar, color: 'text-earth-ember' },
  { id: 'thread', label: 'Thread', icon: MessageSquare, color: 'text-sphere-studio' },
]

interface QuickCaptureProps {
  sphereId: SphereId
  onCapture?: (data: CaptureData) => void
  expanded?: boolean
  placeholder?: string
}

interface CaptureData {
  type: CaptureType
  content: string
  tags: string[]
  attachments: string[]
  sphereId: SphereId
}

export default function QuickCapture({
  sphereId,
  onCapture,
  expanded = false,
  placeholder = "Capturez une idée, note, tâche...",
}: QuickCaptureProps) {
  const { success, nova } = useToast()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [isExpanded, setIsExpanded] = useState(expanded)
  const [content, setContent] = useState('')
  const [captureType, setCaptureType] = useState<CaptureType>('idea')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-expand on focus
  const handleFocus = () => {
    setIsExpanded(true)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && content.trim()) {
        handleSave()
      }
      // Escape to collapse
      if (e.key === 'Escape' && isExpanded) {
        handleCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, isExpanded])

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      const data: CaptureData = {
        type: captureType,
        content: content.trim(),
        tags,
        attachments: [],
        sphereId,
      }

      onCapture?.(data)
      success('Capturé!', `${captureTypes.find(t => t.id === captureType)?.label} enregistré`)
      
      // Reset
      setContent('')
      setTags([])
      setIsExpanded(false)
    } catch (error) {
      logger.error('Failed to capture:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setTags([])
    setIsExpanded(false)
  }

  const handleEnhance = async () => {
    if (!content.trim()) return

    setIsEnhancing(true)
    // Simulate Nova enhancement
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add enhancement marker
    setContent(prev => `${prev}\n\n✨ [Nova suggestion: Considérez d'ajouter plus de contexte ou de lier à un thread existant]`)
    nova('Nova', 'Contenu analysé et enrichi')
    setIsEnhancing(false)
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // Stop recording logic
    } else {
      setIsRecording(true)
      // Start recording logic
    }
  }

  const selectedType = captureTypes.find(t => t.id === captureType)!

  return (
    <div className={`
      rounded-2xl border transition-all duration-300
      ${isExpanded 
        ? 'border-sacred-gold/30 bg-sacred-gold/5 shadow-lg shadow-sacred-gold/10' 
        : 'border-white/10 bg-white/[0.02] hover:border-white/20'}
    `}>
      {/* Main Input */}
      <div className="flex items-start gap-3 p-4">
        {/* Type Selector */}
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${isExpanded ? 'bg-sacred-gold/20' : 'bg-white/5 hover:bg-white/10'}
            `}
          >
            <selectedType.icon className={`w-5 h-5 ${selectedType.color}`} />
          </button>

          {showTypeMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTypeMenu(false)} />
              <div className="absolute top-full left-0 mt-2 z-20 w-40 py-1 rounded-xl bg-ui-slate border border-white/10 shadow-xl">
                {captureTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setCaptureType(type.id)
                      setShowTypeMenu(false)
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5
                      ${captureType === type.id ? 'bg-white/5' : ''}
                    `}
                  >
                    <type.icon className={`w-4 h-4 ${type.color}`} />
                    <span className="text-sm text-soft-sand">{type.label}</span>
                    {captureType === type.id && (
                      <Check className="w-4 h-4 ml-auto text-sacred-gold" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            rows={isExpanded ? 3 : 1}
            className={`
              w-full bg-transparent border-none outline-none resize-none
              text-soft-sand placeholder:text-ancient-stone
              ${isExpanded ? 'min-h-[80px]' : 'min-h-[40px]'}
            `}
          />
        </div>

        {/* Quick Actions (collapsed) */}
        {!isExpanded && content.trim() && (
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-sacred-gold text-ui-slate hover:bg-sacred-gold/90"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <>
          {/* Tags */}
          <div className="px-4 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cenote-turquoise/10 text-cenote-turquoise text-xs"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-ancient-stone" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Ajouter tag..."
                  className="bg-transparent border-none outline-none text-xs text-soft-sand placeholder:text-ancient-stone w-24"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              {/* Voice */}
              <button
                onClick={toggleRecording}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isRecording 
                    ? 'bg-red-500/20 text-red-400 animate-pulse' 
                    : 'hover:bg-white/5 text-ancient-stone'}
                `}
                title={isRecording ? 'Arrêter' : 'Enregistrement vocal'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Image */}
              <button
                className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
                title="Ajouter image"
              >
                <Image className="w-4 h-4" />
              </button>

              {/* Link */}
              <button
                className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
                title="Ajouter lien"
              >
                <Link className="w-4 h-4" />
              </button>

              {/* Nova Enhance */}
              <button
                onClick={handleEnhance}
                disabled={!content.trim() || isEnhancing}
                className={`
                  p-2 rounded-lg transition-colors flex items-center gap-1
                  ${content.trim() && !isEnhancing
                    ? 'hover:bg-sacred-gold/10 text-sacred-gold'
                    : 'text-ancient-stone/50 cursor-not-allowed'}
                `}
                title="Enrichir avec Nova"
              >
                {isEnhancing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-ancient-stone hover:text-soft-sand"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Capturer
              </button>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="px-4 pb-3 text-xs text-ancient-stone">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5">⌘</kbd>
            <span className="mx-1">+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5">Enter</kbd>
            <span className="ml-2">pour sauvegarder</span>
          </div>
        </>
      )}
    </div>
  )
}

// Mini Quick Capture (for header/sidebar)
export function QuickCaptureMini({ 
  sphereId,
  onCapture,
}: { 
  sphereId: SphereId
  onCapture?: (data: CaptureData) => void 
}) {
  const [value, setValue] = useState('')
  const { success } = useToast()

  const handleSubmit = () => {
    if (!value.trim()) return
    
    onCapture?.({
      type: 'idea',
      content: value.trim(),
      tags: [],
      attachments: [],
      sphereId,
    })
    
    success('Capturé!', 'Idée enregistrée')
    setValue('')
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-gold" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Capture rapide..."
          className="input w-full pl-10 pr-10"
        />
        {value.trim() && (
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-sacred-gold text-ui-slate"
          >
            <Send className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
