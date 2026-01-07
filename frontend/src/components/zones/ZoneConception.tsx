/**
 * CHE·NU — ZONE CONCEPTION
 * ============================================================
 * Workspace · Documents · Travail
 * 
 * Zone de travail principale où l'utilisateur peut:
 * - Éditer des documents
 * - Gérer des versions
 * - Collaborer avec les agents
 * - Participer à des meetings
 * 
 * @version 27.0.0
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Clock, 
  GitBranch, 
  Save, 
  Download,
  Users,
  MessageSquare,
  Layers,
  ChevronRight,
  File,
  FolderOpen
} from 'lucide-react'

interface ZoneConceptionProps {
  isExpertMode: boolean
  isMeetingActive: boolean
}

interface Document {
  id: string
  name: string
  type: 'document' | 'spreadsheet' | 'presentation' | 'code'
  lastModified: Date
  version: number
  status: 'draft' | 'review' | 'approved'
}

const RECENT_DOCUMENTS: Document[] = [
  { id: '1', name: 'Devis Rénovation Cuisine', type: 'document', lastModified: new Date(), version: 3, status: 'draft' },
  { id: '2', name: 'Budget Projet Maison', type: 'spreadsheet', lastModified: new Date(Date.now() - 3600000), version: 5, status: 'review' },
  { id: '3', name: 'Présentation Client', type: 'presentation', lastModified: new Date(Date.now() - 86400000), version: 2, status: 'approved' },
  { id: '4', name: 'API Integration', type: 'code', lastModified: new Date(Date.now() - 172800000), version: 12, status: 'draft' },
]

export function ZoneConception({ isExpertMode, isMeetingActive }: ZoneConceptionProps) {
  const [activeDocument, setActiveDocument] = useState<string | null>('1')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-full flex bg-gradient-to-b from-gray-950 to-blue-950/20">
      
      {/* Sidebar - Documents */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="border-r border-gray-800 bg-gray-900/50 overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Documents</h2>
            <button className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors">
              <File className="w-3 h-3" /> Nouveau
            </button>
            <button className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors">
              <FolderOpen className="w-3 h-3" /> Ouvrir
            </button>
          </div>
        </div>
        
        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-gray-500 px-2 py-1 mb-1">Récents</p>
          {RECENT_DOCUMENTS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocument(doc.id)}
              className={`w-full p-3 rounded-xl text-left transition-all mb-1 ${
                activeDocument === doc.id
                  ? 'bg-blue-600/20 border border-blue-500/30'
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className={`w-4 h-4 mt-0.5 ${
                  activeDocument === doc.id ? 'text-blue-400' : 'text-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>v{doc.version}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      doc.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      doc.status === 'review' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Layers className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-800" />
            
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">Devis Rénovation Cuisine</span>
              <span className="px-2 py-0.5 rounded bg-gray-800 text-xs text-gray-400">v3</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" title="Historique">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" title="Versions">
              <GitBranch className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" title="Collaborateurs">
              <Users className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-800" />
            
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Document Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Devis Rénovation Cuisine</h1>
              <p className="text-gray-400">Client: Famille Tremblay | Projet #2024-045</p>
            </div>
            
            {/* Document Content Placeholder */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 min-h-[500px]">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-4">1. Description du projet</h2>
                <p className="text-gray-300 mb-4">
                  Rénovation complète de la cuisine incluant le remplacement des armoires, 
                  comptoirs, et électroménagers. Surface totale: 150 pi².
                </p>
                
                <h2 className="text-xl font-semibold text-white mb-4 mt-8">2. Détails des travaux</h2>
                <ul className="text-gray-300 space-y-2">
                  <li>Démolition des armoires existantes</li>
                  <li>Installation nouvelles armoires en érable</li>
                  <li>Comptoirs en quartz (Silestone)</li>
                  <li>Dosseret en céramique</li>
                  <li>Plomberie et électricité</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-white mb-4 mt-8">3. Budget estimé</h2>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Main d'œuvre</span>
                    <span className="text-white font-medium">12,500 $</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Matériaux</span>
                    <span className="text-white font-medium">18,750 $</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Électroménagers</span>
                    <span className="text-white font-medium">8,200 $</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span className="text-white">TOTAL</span>
                    <span className="text-blue-400">39,450 $</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Mode Indicator */}
        {isExpertMode && (
          <div className="h-8 border-t border-gray-800 bg-amber-500/10 flex items-center justify-center gap-2 text-xs text-amber-400">
            <span className="font-bold">MODE EXPERT</span>
            <span>|</span>
            <span>⌘K pour commandes</span>
          </div>
        )}
      </main>

      {/* Meeting Panel */}
      {isMeetingActive && (
        <aside className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium text-white">Meeting en cours</span>
            </div>
          </div>
          <div className="flex-1 p-4">
            <p className="text-sm text-gray-400">Participants: 3</p>
          </div>
        </aside>
      )}
    </div>
  )
}

export default ZoneConception
