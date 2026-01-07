/**
 * CHE·NU™ Bureau System v2
 * 5-Level Bureau Hierarchy with 6-Section Sphere Bureau
 * 
 * FROZEN ARCHITECTURE - DO NOT MODIFY STRUCTURE
 * 
 * L0: Global Bureau (5 sections)
 * L1: Identity Bureau (4 sections)
 * L2: Sphere Bureau (6 sections MAX) ← HARD LIMIT
 * L3: Project Bureau (4 sections)
 * L4: Agent Bureau (4 sections)
 * 
 * @module bureau-v2
 * @version 33.0
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES & ENUMS
// ═══════════════════════════════════════════════════════════════

export type BureauLevel = 'global' | 'identity' | 'sphere' | 'project' | 'agent';

export type SphereCode = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'creative_studio' 
  | 'community' 
  | 'social_media' 
  | 'entertainment' 
  | 'my_team';

export type SphereBureauSectionType = 
  | 'quick_capture' 
  | 'resume_workspace' 
  | 'threads' 
  | 'data_files' 
  | 'active_agents' 
  | 'meetings';

export interface BureauSection {
  id: string;
  sectionType: string;
  title: string;
  position: number;
  collapsed?: boolean;
}

export interface Bureau {
  id: string;
  level: BureauLevel;
  name: string;
  sphereId?: SphereCode;
  identityId?: string;
  projectId?: string;
  agentId?: string;
  sections: BureauSection[];
}

export interface BureauNavigationState {
  level: BureauLevel;
  identityId?: string;
  sphereId?: SphereCode;
  projectId?: string;
  agentId?: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const SPHERES: Record<SphereCode, { name: string; emoji: string }> = {
  personal: { name: 'Personal', emoji: '🏠' },
  business: { name: 'Business', emoji: '💼' },
  government: { name: 'Government & Institutions', emoji: '🏛️' },
  creative_studio: { name: 'Studio de création', emoji: '🎨' },
  community: { name: 'Community', emoji: '👥' },
  social_media: { name: 'Social & Media', emoji: '📱' },
  entertainment: { name: 'Entertainment', emoji: '🎬' },
  my_team: { name: 'My Team', emoji: '🤝' },
};

export const SPHERE_BUREAU_SECTIONS: Record<SphereBureauSectionType, { title: string; icon: string; description: string }> = {
  quick_capture: { 
    title: 'Quick Capture', 
    icon: '📝', 
    description: 'Capture rapide de notes et idées (500 char max)' 
  },
  resume_workspace: { 
    title: 'Resume Work', 
    icon: '▶️', 
    description: 'Reprendre le travail en cours' 
  },
  threads: { 
    title: 'Threads', 
    icon: '💬', 
    description: 'Conversations et fichiers .chenu' 
  },
  data_files: { 
    title: 'Data/Files', 
    icon: '📁', 
    description: 'Documents et fichiers' 
  },
  active_agents: { 
    title: 'Active Agents', 
    icon: '🤖', 
    description: 'Agents actifs dans cette sphère' 
  },
  meetings: { 
    title: 'Meetings', 
    icon: '📅', 
    description: 'Réunions et calendrier' 
  },
};

// ═══════════════════════════════════════════════════════════════
// BUREAU PROPS
// ═══════════════════════════════════════════════════════════════

interface BureauSystemProps {
  initialState?: BureauNavigationState;
  userId: string;
  onNavigate?: (state: BureauNavigationState) => void;
  onOpenWorkspace?: (workspaceId: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// SECTION COMPONENTS (L2 - SPHERE BUREAU)
// ═══════════════════════════════════════════════════════════════

// Section 1: Quick Capture
const QuickCaptureSection: React.FC<{ sphereId: SphereCode }> = ({ sphereId }) => {
  const [text, setText] = useState('');
  const maxLength = 500;
  
  const handleSave = () => {
    if (text.trim()) {
      console.log('Quick capture saved:', { sphereId, text });
      setText('');
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <span>📝</span>
          <span>Quick Capture</span>
        </h3>
        <span className={`text-xs ${text.length > maxLength * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
          {text.length}/{maxLength}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        placeholder="Capturez rapidement une idée, une note, une tâche..."
        className="w-full h-24 bg-slate-700/50 rounded-lg p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/50"
      />
      <div className="flex justify-end mt-2">
        <button 
          onClick={handleSave}
          disabled={!text.trim()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

// Section 2: Resume Workspace
const ResumeWorkspaceSection: React.FC<{ 
  sphereId: SphereCode;
  onOpenWorkspace?: (id: string) => void;
}> = ({ sphereId, onOpenWorkspace }) => {
  const [recentWorkspaces] = useState([
    { id: 'ws-1', name: 'Projet Rénovation Q1', lastAccess: '2025-01-15T10:30:00', progress: 65 },
    { id: 'ws-2', name: 'Rapport Financier', lastAccess: '2025-01-14T16:45:00', progress: 30 },
    { id: 'ws-3', name: 'Estimation Client ABC', lastAccess: '2025-01-14T09:00:00', progress: 90 },
  ]);
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <span>▶️</span>
        <span>Resume Work</span>
      </h3>
      <div className="space-y-2">
        {recentWorkspaces.map(ws => (
          <div 
            key={ws.id}
            onClick={() => onOpenWorkspace?.(ws.id)}
            className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex-1">
              <div className="font-medium text-sm">{ws.name}</div>
              <div className="text-xs text-slate-400">
                {new Date(ws.lastAccess).toLocaleString('fr-CA', { 
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${ws.progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{ws.progress}%</span>
            </div>
            <span className="text-slate-400">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 3: Threads
const ThreadsSection: React.FC<{ sphereId: SphereCode }> = ({ sphereId }) => {
  const [threads] = useState([
    { id: 'th-1', name: 'discussion-projet-a.chenu', messages: 24, unread: 3, lastUpdate: '10 min' },
    { id: 'th-2', name: 'analyse-marché.chenu', messages: 12, unread: 0, lastUpdate: '2h' },
    { id: 'th-3', name: 'brainstorm-produit.chenu', messages: 45, unread: 0, lastUpdate: '1j' },
  ]);
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <span>💬</span>
          <span>Threads</span>
        </h3>
        <button className="text-xs text-amber-400 hover:text-amber-300">+ Nouveau</button>
      </div>
      <div className="space-y-2">
        {threads.map(thread => (
          <div 
            key={thread.id}
            className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <span className="text-slate-400">📄</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{thread.name}</div>
              <div className="text-xs text-slate-500">{thread.messages} messages • {thread.lastUpdate}</div>
            </div>
            {thread.unread > 0 && (
              <span className="bg-amber-500 text-xs px-2 py-0.5 rounded-full">{thread.unread}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 4: Data/Files
const DataFilesSection: React.FC<{ sphereId: SphereCode }> = ({ sphereId }) => {
  const [files] = useState([
    { id: 'f-1', name: 'Budget_2025.xlsx', type: 'spreadsheet', size: '245 KB' },
    { id: 'f-2', name: 'Contrat_ABC.pdf', type: 'document', size: '1.2 MB' },
    { id: 'f-3', name: 'Photos_Projet/', type: 'folder', items: 24 },
  ]);
  
  const typeIcons: Record<string, string> = {
    spreadsheet: '📊',
    document: '📄',
    folder: '📁',
    image: '🖼️'
  };
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <span>📁</span>
          <span>Data/Files</span>
        </h3>
        <button className="text-xs text-amber-400 hover:text-amber-300">Voir tout →</button>
      </div>
      <div className="space-y-2">
        {files.map(file => (
          <div 
            key={file.id}
            className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <span>{typeIcons[file.type] || '📄'}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{file.name}</div>
              <div className="text-xs text-slate-500">
                {file.size || `${file.items} éléments`}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Storage indicator */}
      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Stockage utilisé</span>
          <span>2.4 GB / 10 GB</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
        </div>
      </div>
    </div>
  );
};

// Section 5: Active Agents
const ActiveAgentsSection: React.FC<{ sphereId: SphereCode }> = ({ sphereId }) => {
  const [agents] = useState([
    { id: 'a-1', name: 'Agent Finance', status: 'running', task: 'Analyse des dépenses Q4', progress: 67 },
    { id: 'a-2', name: 'Agent Recherche', status: 'idle', task: null, progress: 0 },
    { id: 'a-3', name: 'Agent Rédaction', status: 'waiting', task: 'En attente de validation', progress: 100 },
  ]);
  
  const statusColors: Record<string, string> = {
    running: 'bg-emerald-500',
    idle: 'bg-slate-500',
    waiting: 'bg-amber-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <span>🤖</span>
          <span>Active Agents</span>
        </h3>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
          {agents.filter(a => a.status === 'running').length} actif
        </span>
      </div>
      <div className="space-y-2">
        {agents.map(agent => (
          <div 
            key={agent.id}
            className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg"
          >
            <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{agent.name}</div>
              <div className="text-xs text-slate-500 truncate">
                {agent.task || 'En attente de tâche'}
              </div>
            </div>
            {agent.status === 'running' && (
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full animate-pulse"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{agent.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Section 6: Meetings
const MeetingsSection: React.FC<{ sphereId: SphereCode }> = ({ sphereId }) => {
  const [meetings] = useState([
    { id: 'm-1', title: 'Revue Projet Q1', time: '10:00', date: 'Aujourd\'hui', participants: 4 },
    { id: 'm-2', title: 'Point Client ABC', time: '14:30', date: 'Demain', participants: 2 },
    { id: 'm-3', title: 'Brainstorm Produit', time: '09:00', date: '20 Jan', participants: 6 },
  ]);
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <span>📅</span>
          <span>Meetings</span>
        </h3>
        <button className="text-xs text-amber-400 hover:text-amber-300">+ Planifier</button>
      </div>
      <div className="space-y-2">
        {meetings.map((meeting, i) => (
          <div 
            key={meeting.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              i === 0 ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-slate-700/50'
            }`}
          >
            <div className="text-center">
              <div className="text-xs text-slate-400">{meeting.date}</div>
              <div className="font-semibold text-sm">{meeting.time}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{meeting.title}</div>
              <div className="text-xs text-slate-500">{meeting.participants} participants</div>
            </div>
            {i === 0 && (
              <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-xs">
                Rejoindre
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPHERE BUREAU (L2)
// ═══════════════════════════════════════════════════════════════

const SphereBureau: React.FC<{
  sphereId: SphereCode;
  onOpenWorkspace?: (id: string) => void;
  onNavigateToProject?: (projectId: string) => void;
}> = ({ sphereId, onOpenWorkspace, onNavigateToProject }) => {
  const sphere = SPHERES[sphereId];
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{sphere.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{sphere.name}</h1>
          <p className="text-slate-400">Bureau • Niveau 2 • 6 sections</p>
        </div>
      </div>
      
      {/* 6 Sections Grid (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickCaptureSection sphereId={sphereId} />
        <ResumeWorkspaceSection sphereId={sphereId} onOpenWorkspace={onOpenWorkspace} />
        <ThreadsSection sphereId={sphereId} />
        <DataFilesSection sphereId={sphereId} />
        <ActiveAgentsSection sphereId={sphereId} />
        <MeetingsSection sphereId={sphereId} />
      </div>
      
      {/* Footer - Navigation hint */}
      <div className="mt-6 text-center text-sm text-slate-500">
        ⚠️ MAXIMUM 6 SECTIONS — STRUCTURE FIGÉE
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// GLOBAL BUREAU (L0)
// ═══════════════════════════════════════════════════════════════

const GlobalBureau: React.FC<{
  onSelectIdentity: (identityId: string) => void;
}> = ({ onSelectIdentity }) => {
  const [identities] = useState([
    { id: 'id-personal', name: 'Jo Rodrigue (Personnel)', type: 'personal' },
    { id: 'id-business', name: 'Pr0 Services Inc.', type: 'business' },
  ]);
  
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🌐 CHE·NU™</h1>
        <p className="text-slate-400">Global Bureau • Niveau 0</p>
      </div>
      
      <div className="max-w-2xl mx-auto grid gap-4">
        {/* Section 1: Identity Selector */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">👤 Sélectionner Identité</h3>
          <div className="space-y-2">
            {identities.map(identity => (
              <button
                key={identity.id}
                onClick={() => onSelectIdentity(identity.id)}
                className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <span className="text-2xl">{identity.type === 'personal' ? '🏠' : '🏢'}</span>
                <span className="font-medium">{identity.name}</span>
                <span className="ml-auto">→</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Section 2: Recent Activity */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">📊 Activité Récente</h3>
          <p className="text-slate-400 text-sm">5 tâches en cours • 2 agents actifs</p>
        </div>
        
        {/* Section 3: Pinned Workspaces */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">📌 Workspaces Épinglés</h3>
          <p className="text-slate-400 text-sm">Aucun workspace épinglé</p>
        </div>
        
        {/* Section 4: Notifications */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-3">🔔 Notifications</h3>
          <p className="text-slate-400 text-sm">3 nouvelles notifications</p>
        </div>
        
        {/* Section 5: Nova Entry */}
        <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 rounded-xl border border-amber-700/50 p-4">
          <h3 className="font-semibold mb-3">✨ Nova</h3>
          <p className="text-amber-200 text-sm">Besoin d'aide? Parlez à Nova</p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// IDENTITY BUREAU (L1)
// ═══════════════════════════════════════════════════════════════

const IdentityBureau: React.FC<{
  identityId: string;
  onSelectSphere: (sphereId: SphereCode) => void;
  onBack: () => void;
}> = ({ identityId, onSelectSphere, onBack }) => {
  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 text-slate-400 hover:text-white">
        ← Global Bureau
      </button>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">👤 Identity Bureau</h1>
        <p className="text-slate-400">Niveau 1 • {identityId}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Section 1: Identity Summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-2">📋 Résumé Identité</h3>
          <p className="text-slate-400 text-sm">8 sphères • 12 projets actifs</p>
        </div>
        
        {/* Section 2: Budget Overview */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h3 className="font-semibold mb-2">🪙 Budget Tokens</h3>
          <p className="text-amber-400 font-semibold">12,450 tokens disponibles</p>
        </div>
      </div>
      
      {/* Section 3: Active Spheres Grid */}
      <h3 className="font-semibold mb-4">🌐 Sphères Actives</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(SPHERES).map(([code, sphere]) => (
          <button
            key={code}
            onClick={() => onSelectSphere(code as SphereCode)}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-amber-500/50 p-4 text-center transition-all"
          >
            <span className="text-3xl block mb-2">{sphere.emoji}</span>
            <span className="text-sm font-medium">{sphere.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN BUREAU SYSTEM
// ═══════════════════════════════════════════════════════════════

const BureauSystem: React.FC<BureauSystemProps> = ({
  initialState = { level: 'global' },
  userId,
  onNavigate,
  onOpenWorkspace
}) => {
  const [navState, setNavState] = useState<BureauNavigationState>(initialState);
  
  const handleNavigate = (newState: Partial<BureauNavigationState>) => {
    const updated = { ...navState, ...newState };
    setNavState(updated);
    onNavigate?.(updated);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={() => handleNavigate({ level: 'global', identityId: undefined, sphereId: undefined })}
            className={navState.level === 'global' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}
          >
            🌐 Global
          </button>
          {navState.identityId && (
            <>
              <span className="text-slate-600">/</span>
              <button 
                onClick={() => handleNavigate({ level: 'identity', sphereId: undefined })}
                className={navState.level === 'identity' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}
              >
                👤 Identity
              </button>
            </>
          )}
          {navState.sphereId && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400">
                {SPHERES[navState.sphereId].emoji} {SPHERES[navState.sphereId].name}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Content */}
      {navState.level === 'global' && (
        <GlobalBureau 
          onSelectIdentity={(id) => handleNavigate({ level: 'identity', identityId: id })} 
        />
      )}
      
      {navState.level === 'identity' && navState.identityId && (
        <IdentityBureau
          identityId={navState.identityId}
          onSelectSphere={(sphereId) => handleNavigate({ level: 'sphere', sphereId })}
          onBack={() => handleNavigate({ level: 'global', identityId: undefined })}
        />
      )}
      
      {navState.level === 'sphere' && navState.sphereId && (
        <SphereBureau
          sphereId={navState.sphereId}
          onOpenWorkspace={onOpenWorkspace}
        />
      )}
    </div>
  );
};

export default BureauSystem;
