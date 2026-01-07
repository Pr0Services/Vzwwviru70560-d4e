// ============================================================
// CHE·NU - Surface C: Workspace (Éditeur & Versioning)
// ============================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Wand2, 
  Check, 
  X, 
  History,
  GitBranch,
  Save,
  Eye,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function SurfaceWorkspace() {
  const {
    workspaceVersions,
    activeVersionId,
    workspaceDraft,
    isProposing,
    setWorkspaceDraft,
    proposeVersion,
    acceptVersion,
    rejectVersion,
    setIsProposing,
    activeSphereId,
    spheres
  } = useAppStore()

  const [showHistory, setShowHistory] = useState(false)
  const [proposedContent, setProposedContent] = useState<string | null>(null)
  const [proposedId, setProposedId] = useState<string | null>(null)

  const activeVersion = workspaceVersions.find(v => v.id === activeVersionId)
  const proposedVersions = workspaceVersions.filter(v => v.status === 'proposed')
  const archivedVersions = workspaceVersions.filter(v => v.status === 'archived').slice(-5)
  const activeSphere = spheres.find(s => s.id === activeSphereId)

  const handleAskOrchestrator = async () => {
    if (!workspaceDraft.trim()) return
    
    setIsProposing(true)
    
    // Simuler traitement par l'orchestrateur
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Générer une proposition structurée
    const structured = `# Document Structuré\n\n## Contexte\n${workspaceDraft.slice(0, 100)}...\n\n## Points Clés\n- Point 1: Analyse initiale\n- Point 2: Recommandations\n- Point 3: Prochaines étapes\n\n## Conclusion\nCe document a été structuré par l'Orchestrateur CHE·NU.\n\n---\n*Généré automatiquement • Sphère: ${activeSphere?.name || 'Construction'}*`
    
    const id = proposeVersion(structured, 'orchestrator')
    setProposedContent(structured)
    setProposedId(id)
    setIsProposing(false)
  }

  const handleAccept = () => {
    if (proposedId) {
      acceptVersion(proposedId)
      setProposedContent(null)
      setProposedId(null)
    }
  }

  const handleReject = () => {
    if (proposedId) {
      rejectVersion(proposedId)
      setProposedContent(null)
      setProposedId(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Workspace</h2>
            <p className="text-sm text-gray-400">
              Éditeur • {workspaceVersions.length} version{workspaceVersions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Sphere Context */}
          {activeSphere && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
              <span>{activeSphere.icon}</span>
              <span className="text-sm text-gray-300">{activeSphere.name}</span>
            </div>
          )}
          
          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl transition-colors',
              showHistory 
                ? 'bg-chenu-500/20 text-chenu-400' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            )}
          >
            <History size={18} />
            <span className="text-sm">Historique</span>
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-800 overflow-hidden"
          >
            <div className="p-4 bg-gray-900/50">
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <GitBranch size={14} />
                Versions précédentes
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {archivedVersions.length === 0 ? (
                  <p className="text-sm text-gray-600">Aucune version archivée</p>
                ) : (
                  archivedVersions.map(version => (
                    <div 
                      key={version.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'w-2 h-2 rounded-full',
                          version.author === 'orchestrator' ? 'bg-purple-500' : 'bg-green-500'
                        )} />
                        <span className="text-sm text-gray-300 truncate max-w-[200px]">
                          {version.content.slice(0, 50)}...
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(version.createdAt, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Document actif</span>
            <div className="flex items-center gap-2">
              {activeVersion?.author === 'orchestrator' && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">
                  <Sparkles size={12} />
                  Orchestrateur
                </span>
              )}
            </div>
          </div>
          
          <textarea
            value={workspaceDraft}
            onChange={(e) => setWorkspaceDraft(e.target.value)}
            placeholder="Écrivez ou collez votre contenu ici..."
            className="flex-1 w-full p-4 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all font-mono text-sm leading-relaxed"
          />

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
                <Save size={16} />
                <span className="text-sm">Sauvegarder</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
                <Eye size={16} />
                <span className="text-sm">Prévisualiser</span>
              </button>
            </div>
            
            <button
              onClick={handleAskOrchestrator}
              disabled={!workspaceDraft.trim() || isProposing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              {isProposing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Wand2 size={18} />
              )}
              <span>Ask Orchestrator</span>
            </button>
          </div>
        </div>

        {/* Proposed Version Panel */}
        <AnimatePresence>
          {proposedContent && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-800 flex flex-col bg-gray-900/50"
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-purple-400">
                  <Sparkles size={18} />
                  <h3 className="font-semibold">Version Proposée</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Par l'Orchestrateur CHE·NU
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {proposedContent}
                </pre>
              </div>

              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                  >
                    <Check size={18} />
                    Accepter
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                  >
                    <X size={18} />
                    Rejeter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>
          {workspaceDraft.length} caractères • {workspaceDraft.split(/\s+/).filter(Boolean).length} mots
        </span>
        <span>
          Auto-save activé
        </span>
      </div>
    </div>
  )
}
