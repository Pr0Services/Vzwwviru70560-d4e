/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — CREATE THREAD MODAL                             ║
 * ║                    Modal for creating new .chenu thread files                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react'
import { 
  X, MessageSquare, Tag, Bot, Sparkles, 
  ChevronDown, Check, Loader2
} from 'lucide-react'
import { useThreadsStore, useAgentsStore } from '@/stores'
import type { SphereId, AgentLevel } from '@/types'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
  sphereId: SphereId
  onSuccess?: (threadId: string) => void
}

export default function CreateThreadModal({
  isOpen,
  onClose,
  sphereId,
  onSuccess,
}: CreateThreadModalProps) {
  const { createThread, isLoading } = useThreadsStore()
  const { availableAgents } = useAgentsStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [showAgentPicker, setShowAgentPicker] = useState(false)
  const [error, setError] = useState('')

  // Filter agents for this sphere
  const sphereAgents = availableAgents.filter(
    agent => agent.sphere_id === sphereId || agent.level === 'L0' || agent.level === 'L1'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Le titre est requis')
      return
    }

    try {
      const thread = await createThread({
        title: title.trim(),
        description: description.trim() || undefined,
        sphere_id: sphereId,
        tags,
        agents: selectedAgents,
      })

      onSuccess?.(thread.id)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setTags([])
    setTagInput('')
    setSelectedAgents([])
    setError('')
    onClose()
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

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50">
        <div className="h-full md:h-auto glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cenote-turquoise/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-cenote-turquoise" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-soft-sand">
                  Nouveau Thread
                </h2>
                <p className="text-xs text-ancient-stone">.chenu file</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/5 text-ancient-stone"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-soft-sand mb-2">
                Titre <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom du thread..."
                className="input w-full"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-soft-sand mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description optionnelle..."
                rows={3}
                className="input w-full resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-soft-sand mb-2">
                Tags
              </label>
              
              {/* Tag Input */}
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ancient-stone" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Ajouter un tag..."
                    className="input w-full pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-outline"
                >
                  Ajouter
                </button>
              </div>

              {/* Tag List */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cenote-turquoise/10 text-cenote-turquoise text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="p-0.5 rounded hover:bg-white/10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Agents */}
            <div>
              <label className="block text-sm font-medium text-soft-sand mb-2">
                Agents à engager
              </label>

              {/* Selected Agents Preview */}
              {selectedAgents.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedAgents.map((agentId) => {
                    const agent = sphereAgents.find(a => a.id === agentId)
                    if (!agent) return null
                    return (
                      <span
                        key={agentId}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-jungle-emerald/10 text-jungle-emerald text-sm"
                      >
                        <Bot className="w-3 h-3" />
                        {agent.name}
                        <button
                          type="button"
                          onClick={() => toggleAgent(agentId)}
                          className="p-0.5 rounded hover:bg-white/10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Agent Picker Toggle */}
              <button
                type="button"
                onClick={() => setShowAgentPicker(!showAgentPicker)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 text-left"
              >
                <div className="flex items-center gap-2 text-ancient-stone">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedAgents.length === 0 
                      ? 'Sélectionner des agents...'
                      : `${selectedAgents.length} agent${selectedAgents.length !== 1 ? 's' : ''} sélectionné${selectedAgents.length !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-ancient-stone transition-transform ${showAgentPicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Agent List */}
              {showAgentPicker && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-shadow-moss/50">
                  {sphereAgents.length === 0 ? (
                    <div className="p-4 text-center text-sm text-ancient-stone">
                      Aucun agent disponible
                    </div>
                  ) : (
                    sphereAgents.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => toggleAgent(agent.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left
                          hover:bg-white/5 transition-colors
                          ${selectedAgents.includes(agent.id) ? 'bg-jungle-emerald/10' : ''}
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${selectedAgents.includes(agent.id) ? 'bg-jungle-emerald/20' : 'bg-white/5'}
                        `}>
                          <Bot className={`w-4 h-4 ${selectedAgents.includes(agent.id) ? 'text-jungle-emerald' : 'text-ancient-stone'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-soft-sand">{agent.name}</div>
                          <div className="text-xs text-ancient-stone">{agent.level} • {agent.cost} tokens/req</div>
                        </div>
                        {selectedAgents.includes(agent.id) && (
                          <Check className="w-4 h-4 text-jungle-emerald" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Nova Suggestion */}
            <div className="p-4 rounded-xl bg-sacred-gold/5 border border-sacred-gold/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sacred-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-soft-sand font-medium">Suggestion Nova</p>
                  <p className="text-xs text-ancient-stone mt-1">
                    Nova peut vous suggérer les agents les plus pertinents pour votre thread après sa création.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
            <button
              type="button"
              onClick={handleClose}
              className="btn-outline"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Créer le thread
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
