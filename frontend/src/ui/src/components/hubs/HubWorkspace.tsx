/**
 * CHE·NU™ — Hub Workspace (Right)
 * 
 * Hub d'exécution IA contrôlée.
 * Contient:
 * - 📄 Documents (création/édition)
 * - ✏️ Éditeurs (code, texte, tableur)
 * - 🌐 Browser intégré
 * - 🔧 Projets actifs
 * 
 * ⚠️ ALL AI EXECUTION HAPPENS HERE
 * Via le Governed Execution Pipeline (10 étapes)
 */

'use client';

import React, { useState } from 'react';
import { useChenuStore } from '../../hooks/useChenuStore';
import { getSphereById } from '../../config/spheres.config';

type WorkspaceView = 'document' | 'browser' | 'project' | 'empty';
type TabType = { id: string; title: string; type: WorkspaceView; icon: string };

interface HubWorkspaceProps {
  className?: string;
}

export function HubWorkspace({ className = '' }: HubWorkspaceProps) {
  const [tabs, setTabs] = useState<TabType[]>([
    { id: '1', title: 'Nouveau document', type: 'document', icon: '📄' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const { 
    pipelineStage, 
    selectedSphereId, 
    activeThreadId,
    threads 
  } = useChenuStore();

  const currentSphere = getSphereById(selectedSphereId as any);
  const activeThread = threads.find(t => t.id === activeThreadId);
  const isPipelineActive = !['IDLE', 'COMPLETED', 'FAILED'].includes(pipelineStage);

  const addTab = (type: WorkspaceView) => {
    const newTab: TabType = {
      id: Date.now().toString(),
      title: type === 'document' ? 'Nouveau document' : 
             type === 'browser' ? 'Browser' : 'Projet',
      type,
      icon: type === 'document' ? '📄' : 
            type === 'browser' ? '🌐' : '🔧',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <main 
      className={`
        hub-workspace
        flex-1
        bg-[#1E1F22]
        flex flex-col
        overflow-hidden
        ${className}
      `}
    >
      {/* ═══════════════════════════════════════════════════════════════
          TAB BAR (Browser-like)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center bg-[#2A2B2F] border-b border-[#3A3B3F]">
        {/* Tabs */}
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                flex items-center gap-2
                px-3 py-2
                min-w-[120px] max-w-[200px]
                cursor-pointer
                border-r border-[#3A3B3F]
                ${activeTabId === tab.id 
                  ? 'bg-[#1E1F22] text-[#E9E4D6]' 
                  : 'bg-[#2A2B2F] text-[#8D8371] hover:bg-[#3A3B3F]'
                }
              `}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-xs truncate flex-1">{tab.title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="text-xs hover:text-red-400 ml-1"
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Add Tab Button */}
          <button 
            onClick={() => addTab('document')}
            className="px-3 py-2 text-[#8D8371] hover:text-[#E9E4D6] hover:bg-[#3A3B3F]"
          >
            +
          </button>
        </div>

        {/* Workspace Actions */}
        <div className="flex items-center gap-1 px-2">
          <button 
            onClick={() => addTab('browser')}
            className="p-1.5 rounded hover:bg-[#3A3B3F] text-sm"
            title="Nouveau Browser"
          >
            🌐
          </button>
          <button 
            onClick={() => addTab('project')}
            className="p-1.5 rounded hover:bg-[#3A3B3F] text-sm"
            title="Nouveau Projet"
          >
            🔧
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PIPELINE STATUS BAR (visible when active)
          ═══════════════════════════════════════════════════════════════ */}
      {isPipelineActive && (
        <div className="flex items-center gap-3 px-4 py-2 bg-[#1A1B1E] border-b border-[#3A3B3F]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-blue-400 font-medium">
              Pipeline: {pipelineStage}
            </span>
          </div>
          <div className="flex-1 h-1 bg-[#2A2B2F] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-[#D8B26A] transition-all"
              style={{ 
                width: `${getPipelineProgress(pipelineStage)}%` 
              }}
            />
          </div>
          <button className="text-xs text-red-400 hover:text-red-300">
            Annuler
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden">
        {activeTab?.type === 'document' && (
          <DocumentView threadId={activeThread?.id} sphereColor={currentSphere?.color} />
        )}

        {activeTab?.type === 'browser' && (
          <BrowserView />
        )}

        {activeTab?.type === 'project' && (
          <ProjectView />
        )}

        {!activeTab && (
          <EmptyWorkspace onAddTab={addTab} />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EXECUTION FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1B1E] border-t border-[#3A3B3F]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#8D8371]">
            🔒 Governed Execution
          </span>
          {currentSphere && (
            <span 
              className="text-[10px]"
              style={{ color: currentSphere.color }}
            >
              {currentSphere.emoji} {currentSphere.nameFr}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8D8371]">
            Version: Auto-saved
          </span>
          <button className="px-2 py-1 bg-[#2A2B2F] rounded text-[10px] text-[#8D8371] hover:text-[#E9E4D6]">
            Historique
          </button>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function DocumentView({ 
  threadId, 
  sphereColor 
}: { 
  threadId?: string; 
  sphereColor?: string;
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3A3B3F]">
        <button className="px-2 py-1 text-xs text-[#8D8371] hover:bg-[#2A2B2F] rounded">
          Bold
        </button>
        <button className="px-2 py-1 text-xs text-[#8D8371] hover:bg-[#2A2B2F] rounded">
          Italic
        </button>
        <div className="w-px h-4 bg-[#3A3B3F]" />
        <button className="px-2 py-1 text-xs text-[#8D8371] hover:bg-[#2A2B2F] rounded">
          H1
        </button>
        <button className="px-2 py-1 text-xs text-[#8D8371] hover:bg-[#2A2B2F] rounded">
          H2
        </button>
        <div className="flex-1" />
        <button 
          className="px-3 py-1 rounded text-xs font-medium text-white"
          style={{ backgroundColor: sphereColor || '#D8B26A' }}
        >
          Exécuter via Pipeline
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Titre du document..."
            className="
              w-full text-2xl font-bold text-[#E9E4D6]
              bg-transparent border-none outline-none
              placeholder:text-[#3A3B3F]
              mb-4
            "
          />
          <textarea
            placeholder="Commencez à écrire... L'exécution IA passera par le Governed Pipeline."
            className="
              w-full min-h-[400px] text-sm text-[#E9E4D6]
              bg-transparent border-none outline-none resize-none
              placeholder:text-[#3A3B3F]
              leading-relaxed
            "
          />
        </div>
      </div>
    </div>
  );
}

function BrowserView() {
  const [url, setUrl] = useState('chenu://home');

  return (
    <div className="h-full flex flex-col">
      {/* URL Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3A3B3F]">
        <button className="p-1 text-[#8D8371] hover:text-[#E9E4D6]">←</button>
        <button className="p-1 text-[#8D8371] hover:text-[#E9E4D6]">→</button>
        <button className="p-1 text-[#8D8371] hover:text-[#E9E4D6]">↻</button>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="
            flex-1 
            bg-[#2A2B2F] 
            border border-[#3A3B3F] 
            rounded-lg 
            px-3 py-1.5 
            text-xs text-[#E9E4D6]
            focus:outline-none focus:border-[#D8B26A]
          "
        />
        <button className="p-1 text-[#8D8371] hover:text-[#E9E4D6]">⭐</button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 flex items-center justify-center bg-[#1A1B1E]">
        <div className="text-center">
          <div className="text-4xl mb-4">🌐</div>
          <div className="text-sm text-[#8D8371]">Browser CHE·NU intégré</div>
          <div className="text-xs text-[#3A3B3F] mt-2">
            Supporte chenu:// et https://
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectView() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#3A3B3F]">
        <span className="text-sm text-[#E9E4D6]">🔧 Gestionnaire de Projets</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔧</div>
          <div className="text-sm text-[#8D8371]">Gestion de projets actifs</div>
        </div>
      </div>
    </div>
  );
}

function EmptyWorkspace({ 
  onAddTab 
}: { 
  onAddTab: (type: WorkspaceView) => void;
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">💼</div>
        <h2 className="text-xl font-semibold text-[#E9E4D6] mb-2">
          Hub Workspace
        </h2>
        <p className="text-sm text-[#8D8371] mb-6">
          Espace d'exécution IA contrôlée. Toute opération passe par le 
          Governed Execution Pipeline (10 étapes).
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => onAddTab('document')}
            className="px-4 py-2 bg-[#D8B26A] rounded-lg text-sm text-white font-medium hover:opacity-90"
          >
            📄 Nouveau Document
          </button>
          <button 
            onClick={() => onAddTab('browser')}
            className="px-4 py-2 bg-[#2A2B2F] rounded-lg text-sm text-[#8D8371] hover:text-[#E9E4D6]"
          >
            🌐 Browser
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function
function getPipelineProgress(stage: string): number {
  const stages = [
    'INTENT_CAPTURE',
    'SEMANTIC_ENCODING',
    'ENCODING_VALIDATION',
    'COST_ESTIMATION',
    'SCOPE_LOCKING',
    'BUDGET_VERIFICATION',
    'ACM_CHECK',
    'EXECUTION',
    'RESULT_CAPTURE',
    'THREAD_UPDATE',
    'COMPLETED',
  ];
  const index = stages.indexOf(stage);
  if (index === -1) return 0;
  return ((index + 1) / stages.length) * 100;
}

export default HubWorkspace;
