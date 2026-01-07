/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — BUREAU SECTIONS v37 (CANONICAL 6 SECTIONS)
   ═══════════════════════════════════════════════════════════════════════════════
   
   ⚠️ ARCHITECTURE GELÉE - 6 SECTIONS UNIQUEMENT
   
   1. QUICK_CAPTURE     → Capture rapide (500 car. max)
   2. RESUME_WORKSPACE  → Reprendre le travail en cours
   3. THREADS           → Fils persistants (.chenu)
   4. DATA_FILES        → Données et fichiers
   5. ACTIVE_AGENTS     → Agents actifs (observation)
   6. MEETINGS          → Réunions
   
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useCallback, useMemo } from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'QUICK_CAPTURE'
  | 'RESUME_WORKSPACE'
  | 'THREADS'
  | 'DATA_FILES'
  | 'ACTIVE_AGENTS'
  | 'MEETINGS';

export interface BureauSectionConfig {
  id: BureauSectionId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  maxItems?: number;
}

export interface QuickCaptureItem {
  id: string;
  content: string;
  timestamp: Date;
  type: 'note' | 'voice' | 'image' | 'link';
  sphereId?: string;
}

export interface WorkspaceItem {
  id: string;
  title: string;
  type: 'document' | 'thread' | 'project' | 'meeting';
  lastModified: Date;
  progress?: number;
  sphereId: string;
}

export interface ThreadItem {
  id: string;
  title: string;
  participants: number;
  unread: number;
  status: 'active' | 'resolved' | 'archived';
  lastMessage: Date;
  tokenBudget: number;
  tokensUsed: number;
}

export interface DataFileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  modified: Date;
  shared: boolean;
}

export interface AgentItem {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  status: 'idle' | 'working' | 'waiting' | 'paused';
  currentTask?: string;
  progress?: number;
}

export interface MeetingItem {
  id: string;
  title: string;
  startTime: Date;
  duration: number; // minutes
  participants: string[];
  status: 'scheduled' | 'live' | 'completed';
  hasRecording: boolean;
}

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  borderColor: 'rgba(141, 131, 113, 0.15)',
};

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION DES 6 SECTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS_CONFIG: BureauSectionConfig[] = [
  {
    id: 'QUICK_CAPTURE',
    name: 'Quick Capture',
    nameFr: 'Capture rapide',
    icon: '📥',
    description: 'Notes rapides, captures vocales (500 car. max)',
    maxItems: 5,
  },
  {
    id: 'RESUME_WORKSPACE',
    name: 'Resume',
    nameFr: 'Reprendre',
    icon: '▶️',
    description: 'Continuer le travail en cours',
    maxItems: 8,
  },
  {
    id: 'THREADS',
    name: 'Threads',
    nameFr: 'Fils',
    icon: '💬',
    description: 'Conversations .chenu gouvernées',
  },
  {
    id: 'DATA_FILES',
    name: 'Data & Files',
    nameFr: 'Données',
    icon: '📁',
    description: 'Fichiers et données structurées',
  },
  {
    id: 'ACTIVE_AGENTS',
    name: 'Agents',
    nameFr: 'Agents',
    icon: '🤖',
    description: 'Statut des agents (observation)',
  },
  {
    id: 'MEETINGS',
    name: 'Meetings',
    nameFr: 'Réunions',
    icon: '📅',
    description: 'Planification et enregistrements',
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// STYLES PARTAGÉS
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  section: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${COLORS.borderColor}`,
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${COLORS.borderColor}`,
  } as React.CSSProperties,
  
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.softSand,
  } as React.CSSProperties,
  
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: COLORS.sacredGold,
    color: COLORS.uiSlate,
    fontWeight: 600,
  } as React.CSSProperties,
  
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: COLORS.sacredGold,
    color: COLORS.uiSlate,
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  
  secondaryButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: `1px solid ${COLORS.ancientStone}`,
    backgroundColor: 'transparent',
    color: COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.borderColor}`,
    backgroundColor: COLORS.background,
    color: COLORS.softSand,
    fontSize: '14px',
    resize: 'none' as const,
  } as React.CSSProperties,
  
  progressBar: {
    height: '4px',
    backgroundColor: COLORS.borderColor,
    borderRadius: '2px',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.cenoteTurquoise,
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
  
  status: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 500,
  } as React.CSSProperties,
  
  emptyState: {
    textAlign: 'center' as const,
    padding: '24px',
    color: COLORS.ancientStone,
    fontSize: '13px',
  } as React.CSSProperties,
};

// ════════════════════════════════════════════════════════════════════════════════
// 1. QUICK CAPTURE SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface QuickCaptureSectionProps {
  captures?: QuickCaptureItem[];
  onCapture?: (content: string, type: QuickCaptureItem['type']) => void;
  onOpenInWorkspace?: (item: QuickCaptureItem) => void;
  maxLength?: number;
}

export const QuickCaptureSection: React.FC<QuickCaptureSectionProps> = ({
  captures = [],
  onCapture,
  onOpenInWorkspace,
  maxLength = 500,
}) => {
  const [content, setContent] = useState('');
  const remaining = maxLength - content.length;

  const handleCapture = useCallback(() => {
    if (content.trim() && onCapture) {
      onCapture(content.trim(), 'note');
      setContent('');
    }
  }, [content, onCapture]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleCapture();
    }
  }, [handleCapture]);

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📥</span>
          <span>Capture rapide</span>
        </div>
        <span style={{
          ...styles.badge,
          backgroundColor: remaining < 50 ? COLORS.earthEmber : COLORS.ancientStone,
        }}>
          {remaining}
        </span>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '16px' }}>
        <textarea
          style={styles.input}
          placeholder="Capturez une idée rapidement... (⌘+Enter pour sauvegarder)"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.button} onClick={handleCapture} disabled={!content.trim()}>
            Capturer
          </button>
          <button style={styles.secondaryButton}>🎤 Vocal</button>
          <button style={styles.secondaryButton}>📷 Image</button>
        </div>
      </div>

      {/* Recent captures */}
      {captures.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: COLORS.ancientStone, marginBottom: '8px' }}>
            Captures récentes
          </div>
          {captures.slice(0, 5).map((item) => (
            <div
              key={item.id}
              style={styles.listItem}
              onClick={() => onOpenInWorkspace?.(item)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: COLORS.softSand }}>
                  {item.content.length > 60 ? `${item.content.slice(0, 60)}...` : item.content}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.ancientStone, marginTop: '4px' }}>
                  {item.type === 'voice' ? '🎤' : item.type === 'image' ? '📷' : '📝'} 
                  {' '}{new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <button style={{ ...styles.secondaryButton, padding: '4px 8px' }}>
                Ouvrir →
              </button>
            </div>
          ))}
        </div>
      )}

      {captures.length === 0 && (
        <div style={styles.emptyState}>
          Aucune capture récente
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// 2. RESUME WORKSPACE SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface ResumeWorkspaceSectionProps {
  workspaces?: WorkspaceItem[];
  onResume?: (item: WorkspaceItem) => void;
}

export const ResumeWorkspaceSection: React.FC<ResumeWorkspaceSectionProps> = ({
  workspaces = [],
  onResume,
}) => {
  const sortedWorkspaces = useMemo(() => 
    [...workspaces].sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    ).slice(0, 8),
    [workspaces]
  );

  const getTypeIcon = (type: WorkspaceItem['type']) => {
    switch (type) {
      case 'document': return '📄';
      case 'thread': return '💬';
      case 'project': return '📊';
      case 'meeting': return '📅';
      default: return '📁';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>▶️</span>
          <span>Reprendre le travail</span>
        </div>
        <span style={styles.badge}>{sortedWorkspaces.length}</span>
      </div>

      {sortedWorkspaces.length > 0 ? (
        <div>
          {sortedWorkspaces.map((item) => (
            <div
              key={item.id}
              style={styles.listItem}
              onClick={() => onResume?.(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '20px' }}>{getTypeIcon(item.type)}</span>
                <div>
                  <div style={{ fontSize: '13px', color: COLORS.softSand, fontWeight: 500 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.ancientStone }}>
                    {formatTime(item.lastModified)}
                  </div>
                </div>
              </div>
              
              {item.progress !== undefined && (
                <div style={{ width: '60px' }}>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${item.progress}%` }} />
                  </div>
                  <div style={{ fontSize: '10px', color: COLORS.ancientStone, textAlign: 'right', marginTop: '2px' }}>
                    {item.progress}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          Aucun travail en cours
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// 3. THREADS SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface ThreadsSectionProps {
  threads?: ThreadItem[];
  onOpenThread?: (thread: ThreadItem) => void;
  onNewThread?: () => void;
}

export const ThreadsSection: React.FC<ThreadsSectionProps> = ({
  threads = [],
  onOpenThread,
  onNewThread,
}) => {
  const getStatusStyle = (status: ThreadItem['status']) => {
    switch (status) {
      case 'active':
        return { backgroundColor: COLORS.jungleEmerald, color: '#fff' };
      case 'resolved':
        return { backgroundColor: COLORS.ancientStone, color: '#fff' };
      case 'archived':
        return { backgroundColor: COLORS.borderColor, color: COLORS.ancientStone };
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>💬</span>
          <span>Threads .chenu</span>
        </div>
        <button style={styles.button} onClick={onNewThread}>+ Nouveau</button>
      </div>

      {threads.length > 0 ? (
        <div>
          {threads.map((thread) => (
            <div
              key={thread.id}
              style={styles.listItem}
              onClick={() => onOpenThread?.(thread)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: COLORS.softSand, fontWeight: 500 }}>
                    {thread.title}
                  </span>
                  {thread.unread > 0 && (
                    <span style={{
                      ...styles.badge,
                      backgroundColor: COLORS.cenoteTurquoise,
                      fontSize: '10px',
                      padding: '1px 6px',
                    }}>
                      {thread.unread}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <span style={{ ...styles.status, ...getStatusStyle(thread.status) }}>
                    {thread.status}
                  </span>
                  <span style={{ fontSize: '11px', color: COLORS.ancientStone }}>
                    👥 {thread.participants}
                  </span>
                  <span style={{ fontSize: '11px', color: COLORS.ancientStone }}>
                    ⚡ {thread.tokensUsed}/{thread.tokenBudget}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ marginBottom: '8px' }}>Aucun thread actif</div>
          <button style={styles.button} onClick={onNewThread}>
            Créer un thread
          </button>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// 4. DATA FILES SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface DataFilesSectionProps {
  files?: DataFileItem[];
  onOpenFile?: (file: DataFileItem) => void;
  onUpload?: () => void;
  storageUsed?: number;
  storageTotal?: number;
}

export const DataFilesSection: React.FC<DataFilesSectionProps> = ({
  files = [],
  onOpenFile,
  onUpload,
  storageUsed = 0,
  storageTotal = 100,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📕';
    if (type.includes('image')) return '🖼️';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('doc')) return '📄';
    if (type.includes('video')) return '🎬';
    return '📁';
  };

  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📁</span>
          <span>Données & Fichiers</span>
        </div>
        <button style={styles.button} onClick={onUpload}>↑ Upload</button>
      </div>

      {/* Storage indicator */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: COLORS.ancientStone, marginBottom: '4px' }}>
          <span>Stockage</span>
          <span>{formatSize(storageUsed * 1024 * 1024)} / {formatSize(storageTotal * 1024 * 1024)}</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${storagePercent}%`,
            backgroundColor: storagePercent > 80 ? COLORS.earthEmber : COLORS.cenoteTurquoise,
          }} />
        </div>
      </div>

      {files.length > 0 ? (
        <div>
          {files.slice(0, 10).map((file) => (
            <div
              key={file.id}
              style={styles.listItem}
              onClick={() => onOpenFile?.(file)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '20px' }}>{getFileIcon(file.type)}</span>
                <div>
                  <div style={{ fontSize: '13px', color: COLORS.softSand }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '11px', color: COLORS.ancientStone }}>
                    {formatSize(file.size)} • {new Date(file.modified).toLocaleDateString()}
                    {file.shared && ' • 🔗 Partagé'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ marginBottom: '8px' }}>Aucun fichier</div>
          <button style={styles.button} onClick={onUpload}>
            Ajouter un fichier
          </button>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// 5. ACTIVE AGENTS SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface ActiveAgentsSectionProps {
  agents?: AgentItem[];
  onViewAgent?: (agent: AgentItem) => void;
}

export const ActiveAgentsSection: React.FC<ActiveAgentsSectionProps> = ({
  agents = [],
  onViewAgent,
}) => {
  const getStatusStyle = (status: AgentItem['status']) => {
    switch (status) {
      case 'working':
        return { backgroundColor: COLORS.jungleEmerald, color: '#fff' };
      case 'waiting':
        return { backgroundColor: COLORS.sacredGold, color: COLORS.uiSlate };
      case 'paused':
        return { backgroundColor: COLORS.earthEmber, color: '#fff' };
      default:
        return { backgroundColor: COLORS.ancientStone, color: '#fff' };
    }
  };

  const getLevelColor = (level: AgentItem['level']) => {
    switch (level) {
      case 'L0': return COLORS.ancientStone;
      case 'L1': return COLORS.cenoteTurquoise;
      case 'L2': return COLORS.sacredGold;
      case 'L3': return COLORS.jungleEmerald;
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🤖</span>
          <span>Agents actifs</span>
          <span style={{ fontSize: '10px', color: COLORS.ancientStone, fontWeight: 400 }}>
            (observation)
          </span>
        </div>
        <span style={styles.badge}>
          {agents.filter(a => a.status === 'working').length} actifs
        </span>
      </div>

      {agents.length > 0 ? (
        <div>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={styles.listItem}
              onClick={() => onViewAgent?.(agent)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: getLevelColor(agent.level),
                    color: '#fff',
                    fontWeight: 600,
                  }}>
                    {agent.level}
                  </span>
                  <span style={{ fontSize: '13px', color: COLORS.softSand, fontWeight: 500 }}>
                    {agent.name}
                  </span>
                  <span style={{ ...styles.status, ...getStatusStyle(agent.status) }}>
                    {agent.status}
                  </span>
                </div>
                
                {agent.currentTask && (
                  <div style={{ fontSize: '11px', color: COLORS.ancientStone, marginTop: '6px' }}>
                    📋 {agent.currentTask}
                  </div>
                )}
                
                {agent.progress !== undefined && agent.status === 'working' && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${agent.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          Aucun agent actif dans cette sphère
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// 6. MEETINGS SECTION
// ════════════════════════════════════════════════════════════════════════════════

interface MeetingsSectionProps {
  meetings?: MeetingItem[];
  onJoinMeeting?: (meeting: MeetingItem) => void;
  onViewRecording?: (meeting: MeetingItem) => void;
  onSchedule?: () => void;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({
  meetings = [],
  onJoinMeeting,
  onViewRecording,
  onSchedule,
}) => {
  const now = new Date();
  
  const upcoming = meetings.filter(m => m.status === 'scheduled' && new Date(m.startTime) > now);
  const live = meetings.filter(m => m.status === 'live');
  const recent = meetings.filter(m => m.status === 'completed').slice(0, 3);

  const formatMeetingTime = (date: Date) => {
    const meetingDate = new Date(date);
    const isToday = meetingDate.toDateString() === now.toDateString();
    const time = meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Aujourd'hui ${time}` : `${meetingDate.toLocaleDateString()} ${time}`;
  };

  const getTimeUntil = (date: Date) => {
    const diff = new Date(date).getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `dans ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    return `dans ${hours}h`;
  };

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📅</span>
          <span>Réunions</span>
        </div>
        <button style={styles.button} onClick={onSchedule}>+ Planifier</button>
      </div>

      {/* Live meetings */}
      {live.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {live.map((meeting) => (
            <div
              key={meeting.id}
              style={{
                ...styles.listItem,
                backgroundColor: COLORS.jungleEmerald + '20',
                border: `1px solid ${COLORS.jungleEmerald}`,
              }}
              onClick={() => onJoinMeeting?.(meeting)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.jungleEmerald,
                    animation: 'pulse 1.5s infinite',
                  }} />
                  <span style={{ fontSize: '13px', color: COLORS.softSand, fontWeight: 600 }}>
                    {meeting.title}
                  </span>
                  <span style={{ ...styles.status, backgroundColor: COLORS.jungleEmerald, color: '#fff' }}>
                    EN COURS
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: COLORS.ancientStone, marginTop: '4px' }}>
                  👥 {meeting.participants.length} participants
                </div>
              </div>
              <button style={styles.button}>
                Rejoindre →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: COLORS.ancientStone, marginBottom: '8px' }}>
            À venir
          </div>
          {upcoming.slice(0, 3).map((meeting) => (
            <div key={meeting.id} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: COLORS.softSand, fontWeight: 500 }}>
                  {meeting.title}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.ancientStone, marginTop: '4px' }}>
                  {formatMeetingTime(meeting.startTime)} • {meeting.duration}min • 👥 {meeting.participants.length}
                </div>
              </div>
              <span style={{ fontSize: '11px', color: COLORS.cenoteTurquoise }}>
                {getTimeUntil(meeting.startTime)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent with recordings */}
      {recent.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: COLORS.ancientStone, marginBottom: '8px' }}>
            Récentes
          </div>
          {recent.map((meeting) => (
            <div
              key={meeting.id}
              style={styles.listItem}
              onClick={() => meeting.hasRecording && onViewRecording?.(meeting)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: COLORS.softSand }}>
                  {meeting.title}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.ancientStone, marginTop: '4px' }}>
                  {new Date(meeting.startTime).toLocaleDateString()}
                </div>
              </div>
              {meeting.hasRecording && (
                <button style={styles.secondaryButton}>
                  🎥 Revoir
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {meetings.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ marginBottom: '8px' }}>Aucune réunion</div>
          <button style={styles.button} onClick={onSchedule}>
            Planifier une réunion
          </button>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU GRID COMPONENT (6 SECTIONS)
// ════════════════════════════════════════════════════════════════════════════════

interface BureauGridProps {
  sphereId: string;
  captures?: QuickCaptureItem[];
  workspaces?: WorkspaceItem[];
  threads?: ThreadItem[];
  files?: DataFileItem[];
  agents?: AgentItem[];
  meetings?: MeetingItem[];
  onCapture?: (content: string, type: QuickCaptureItem['type']) => void;
  onOpenWorkspace?: (item: WorkspaceItem) => void;
  onOpenThread?: (thread: ThreadItem) => void;
  onOpenFile?: (file: DataFileItem) => void;
  onViewAgent?: (agent: AgentItem) => void;
  onJoinMeeting?: (meeting: MeetingItem) => void;
}

export const BureauGrid: React.FC<BureauGridProps> = ({
  sphereId,
  captures,
  workspaces,
  threads,
  files,
  agents,
  meetings,
  onCapture,
  onOpenWorkspace,
  onOpenThread,
  onOpenFile,
  onViewAgent,
  onJoinMeeting,
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '16px',
      padding: '16px',
    }}>
      {/* Row 1: Quick Capture + Resume */}
      <QuickCaptureSection
        captures={captures}
        onCapture={onCapture}
      />
      <ResumeWorkspaceSection
        workspaces={workspaces}
        onResume={onOpenWorkspace}
      />
      
      {/* Row 2: Threads + Data */}
      <ThreadsSection
        threads={threads}
        onOpenThread={onOpenThread}
      />
      <DataFilesSection
        files={files}
        onOpenFile={onOpenFile}
      />
      
      {/* Row 3: Agents + Meetings */}
      <ActiveAgentsSection
        agents={agents}
        onViewAgent={onViewAgent}
      />
      <MeetingsSection
        meetings={meetings}
        onJoinMeeting={onJoinMeeting}
      />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default BureauGrid;
