/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — SPHERE PAGE                                 ║
 * ║                                                                              ║
 * ║  6 Bureau Sections: QuickCapture, ResumeWorkspace, Threads,                  ║
 * ║                     DataFiles, ActiveAgents, Meetings                        ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { AgentSuggestionEngine } from '../components/agents/AgentSuggestionEngine';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { SPHERES, type BureauSectionType } from '../hooks/useSpheres';
import type { AgentDefinition } from '../data/agents-catalog';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface QuickCaptureItem {
  id: string;
  content: string;
  type: 'note' | 'task' | 'idea' | 'question';
  created_at: string;
  processed: boolean;
}

interface ResumeItem {
  id: string;
  title: string;
  type: 'thread' | 'decision' | 'document' | 'meeting';
  last_activity: string;
  progress?: number;
}

interface DataFile {
  id: string;
  name: string;
  type: string;
  size: number;
  modified_at: string;
  folder?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration_minutes: number;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const BUREAU_SECTIONS: Record<BureauSectionType, {
  icon: string;
  label: string;
  description: string;
}> = {
  QuickCapture: {
    icon: '⚡',
    label: 'Quick Capture',
    description: 'Capture rapide de notes, tâches et idées',
  },
  ResumeWorkspace: {
    icon: '🔄',
    label: 'Resume Workspace',
    description: 'Reprendre là où vous en étiez',
  },
  Threads: {
    icon: '🧵',
    label: 'Threads',
    description: 'Fils de discussion et projets',
  },
  DataFiles: {
    icon: '📁',
    label: 'Data Files',
    description: 'Documents et fichiers',
  },
  ActiveAgents: {
    icon: '🤖',
    label: 'Active Agents',
    description: 'Agents assignés à cette sphère',
  },
  Meetings: {
    icon: '📅',
    label: 'Meetings',
    description: 'Réunions et rendez-vous',
  },
};

// Mock data generators
const generateMockQuickCaptures = (sphereId: string): QuickCaptureItem[] => [
  {
    id: 'qc-1',
    content: 'Vérifier les permis de construction',
    type: 'task',
    created_at: '2025-01-07T10:00:00Z',
    processed: false,
  },
  {
    id: 'qc-2',
    content: 'Idée: automatiser les rapports mensuels',
    type: 'idea',
    created_at: '2025-01-07T09:30:00Z',
    processed: false,
  },
  {
    id: 'qc-3',
    content: 'Note: Budget approuvé pour Q1',
    type: 'note',
    created_at: '2025-01-06T16:00:00Z',
    processed: true,
  },
];

const generateMockResumeItems = (sphereId: string): ResumeItem[] => [
  {
    id: 'res-1',
    title: 'Thread: Projet Laval',
    type: 'thread',
    last_activity: '2025-01-07T09:45:00Z',
    progress: 58,
  },
  {
    id: 'res-2',
    title: 'Décision: Choix contracteur',
    type: 'decision',
    last_activity: '2025-01-07T08:00:00Z',
  },
  {
    id: 'res-3',
    title: 'Document: Budget 2025',
    type: 'document',
    last_activity: '2025-01-06T17:00:00Z',
  },
];

const generateMockDataFiles = (sphereId: string): DataFile[] => [
  { id: 'file-1', name: 'Budget_2025.xlsx', type: 'xlsx', size: 245000, modified_at: '2025-01-06T17:00:00Z', folder: 'Finance' },
  { id: 'file-2', name: 'Contrat_Laval.pdf', type: 'pdf', size: 1240000, modified_at: '2025-01-05T14:00:00Z', folder: 'Contrats' },
  { id: 'file-3', name: 'Plans_renovation.dwg', type: 'dwg', size: 8500000, modified_at: '2025-01-04T10:00:00Z', folder: 'Plans' },
  { id: 'file-4', name: 'Photos_chantier.zip', type: 'zip', size: 45000000, modified_at: '2025-01-07T08:00:00Z', folder: 'Media' },
];

const generateMockMeetings = (sphereId: string): Meeting[] => [
  {
    id: 'meet-1',
    title: 'Point projet hebdomadaire',
    date: '2025-01-08T10:00:00Z',
    duration_minutes: 60,
    participants: ['Jo', 'Client', 'Architecte'],
    status: 'scheduled',
  },
  {
    id: 'meet-2',
    title: 'Revue budget Q1',
    date: '2025-01-10T14:00:00Z',
    duration_minutes: 90,
    participants: ['Jo', 'Comptable'],
    status: 'scheduled',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const QuickCaptureSection: React.FC<{
  items: QuickCaptureItem[];
  onAdd: (content: string, type: QuickCaptureItem['type']) => void;
  sphereColor: string;
}> = ({ items, onAdd, sphereColor }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<QuickCaptureItem['type']>('note');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim(), selectedType);
      setInputValue('');
    }
  };

  const typeIcons: Record<QuickCaptureItem['type'], string> = {
    note: '📝',
    task: '✅',
    idea: '💡',
    question: '❓',
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {(['note', 'task', 'idea', 'question'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 12px',
                background: selectedType === type ? `${sphereColor}20` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedType === type ? sphereColor : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                color: selectedType === type ? sphereColor : '#6B7B6B',
              }}
            >
              {typeIcons[type]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Capture rapide..."
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#E8F0E8',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              background: `linear-gradient(135deg, ${sphereColor} 0%, ${sphereColor}CC 100%)`,
              border: 'none',
              borderRadius: 8,
              color: '#1A1A1A',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </form>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: item.processed ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
              borderRadius: 8,
              opacity: item.processed ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: 14 }}>{typeIcons[item.type]}</span>
            <span style={{ flex: 1, fontSize: 12, color: '#E8F0E8' }}>{item.content}</span>
            <span style={{ fontSize: 10, color: '#4B5B4B' }}>
              {new Date(item.created_at).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeWorkspaceSection: React.FC<{
  items: ResumeItem[];
  onSelect: (item: ResumeItem) => void;
  sphereColor: string;
}> = ({ items, onSelect, sphereColor }) => {
  const typeIcons: Record<ResumeItem['type'], string> = {
    thread: '🧵',
    decision: '⚡',
    document: '📄',
    meeting: '📅',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${sphereColor}15`,
              borderRadius: 8,
              fontSize: 16,
            }}
          >
            {typeIcons[item.type]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#E8F0E8', marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 10, color: '#6B7B6B' }}>
              Dernière activité: {new Date(item.last_activity).toLocaleString('fr-CA')}
            </div>
          </div>
          {item.progress !== undefined && (
            <div style={{ width: 50, textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: sphereColor, fontWeight: 600 }}>{item.progress}%</div>
              <div
                style={{
                  marginTop: 4,
                  height: 3,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.progress}%`,
                    height: '100%',
                    background: sphereColor,
                  }}
                />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

const DataFilesSection: React.FC<{
  files: DataFile[];
  onFileClick: (file: DataFile) => void;
}> = ({ files, onFileClick }) => {
  const getFileIcon = (type: string): string => {
    const icons: Record<string, string> = {
      xlsx: '📊',
      pdf: '📕',
      dwg: '📐',
      zip: '📦',
      doc: '📄',
      docx: '📄',
      jpg: '🖼️',
      png: '🖼️',
    };
    return icons[type] || '📄';
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => onFileClick(file)}
            style={{
              padding: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{getFileIcon(file.type)}</div>
            <div style={{ fontSize: 12, color: '#E8F0E8', marginBottom: 4, wordBreak: 'break-word' }}>
              {file.name}
            </div>
            <div style={{ fontSize: 10, color: '#6B7B6B' }}>
              {formatSize(file.size)} • {file.folder}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const MeetingsSection: React.FC<{
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  sphereColor: string;
}> = ({ meetings, onMeetingClick, sphereColor }) => {
  const statusConfig: Record<Meeting['status'], { color: string; label: string }> = {
    scheduled: { color: '#3B82F6', label: 'Planifié' },
    in_progress: { color: '#4ADE80', label: 'En cours' },
    completed: { color: '#6B7280', label: 'Terminé' },
    cancelled: { color: '#EF4444', label: 'Annulé' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {meetings.map((meeting) => {
        const status = statusConfig[meeting.status];
        const date = new Date(meeting.date);
        
        return (
          <button
            key={meeting.id}
            onClick={() => onMeetingClick(meeting)}
            style={{
              display: 'flex',
              gap: 14,
              padding: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 50,
                padding: 8,
                background: `${sphereColor}15`,
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: sphereColor }}>
                {date.getDate()}
              </div>
              <div style={{ fontSize: 9, color: '#6B7B6B', textTransform: 'uppercase' }}>
                {date.toLocaleDateString('fr-CA', { month: 'short' })}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#E8F0E8', marginBottom: 4 }}>{meeting.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#6B7B6B' }}>
                  🕐 {date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                  {' • '}{meeting.duration_minutes}min
                </span>
                <span
                  style={{
                    padding: '2px 6px',
                    background: `${status.color}15`,
                    borderRadius: 4,
                    fontSize: 9,
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                {meeting.participants.slice(0, 3).map((p, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 6px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 4,
                      fontSize: 9,
                      color: '#9BA89B',
                    }}
                  >
                    {p}
                  </span>
                ))}
                {meeting.participants.length > 3 && (
                  <span style={{ fontSize: 9, color: '#6B7B6B' }}>
                    +{meeting.participants.length - 3}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const SpherePageV72: React.FC = () => {
  const navigate = useNavigate();
  const { sphereId } = useParams<{ sphereId: string }>();

  // Get sphere data
  const sphere = SPHERES.find(s => s.id === sphereId);
  
  if (!sphere) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#EF4444' }}>
        Sphère non trouvée
      </div>
    );
  }

  // State
  const [activeSection, setActiveSection] = useState<BureauSectionType>('ResumeWorkspace');
  const [quickCaptures, setQuickCaptures] = useState<QuickCaptureItem[]>(generateMockQuickCaptures(sphereId || ''));
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock data
  const resumeItems = useMemo(() => generateMockResumeItems(sphereId || ''), [sphereId]);
  const dataFiles = useMemo(() => generateMockDataFiles(sphereId || ''), [sphereId]);
  const meetings = useMemo(() => generateMockMeetings(sphereId || ''), [sphereId]);

  // Handlers
  const handleAddQuickCapture = useCallback((content: string, type: QuickCaptureItem['type']) => {
    setQuickCaptures(prev => [{
      id: `qc-${Date.now()}`,
      content,
      type,
      created_at: new Date().toISOString(),
      processed: false,
    }, ...prev]);
  }, []);

  const handleResumeSelect = useCallback((item: ResumeItem) => {
    if (item.type === 'thread') navigate(`/thread/${item.id}`);
    else if (item.type === 'decision') navigate(`/decisions`);
  }, [navigate]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action) {
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'nova-chat':
        navigate('/nova');
        break;
      case 'quick-capture':
        setActiveSection('QuickCapture');
        break;
      case 'new-thread':
        navigate('/threads?action=new');
        break;
    }
  }, [navigate]);

  const handleAgentHire = useCallback((agent: AgentDefinition) => {
    navigate(`/agents?hire=${agent.id}`);
  }, [navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'escape') setIsSearchOpen(false);
    },
  });

  // Section content renderer
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'QuickCapture':
        return (
          <QuickCaptureSection
            items={quickCaptures}
            onAdd={handleAddQuickCapture}
            sphereColor={sphere.color}
          />
        );
      case 'ResumeWorkspace':
        return (
          <ResumeWorkspaceSection
            items={resumeItems}
            onSelect={handleResumeSelect}
            sphereColor={sphere.color}
          />
        );
      case 'Threads':
        return (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <button
              onClick={() => navigate(`/threads?sphere=${sphereId}`)}
              style={{
                padding: '14px 28px',
                background: `linear-gradient(135deg, ${sphere.color} 0%, ${sphere.color}CC 100%)`,
                border: 'none',
                borderRadius: 10,
                color: '#1A1A1A',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Voir tous les threads →
            </button>
          </div>
        );
      case 'DataFiles':
        return (
          <DataFilesSection
            files={dataFiles}
            onFileClick={(file) => console.log('Open file:', file)}
          />
        );
      case 'ActiveAgents':
        return (
          <AgentSuggestionEngine
            context={{ sphereId: sphereId || undefined }}
            maxSuggestions={6}
            onHire={handleAgentHire}
          />
        );
      case 'Meetings':
        return (
          <MeetingsSection
            meetings={meetings}
            onMeetingClick={(meeting) => console.log('Open meeting:', meeting)}
            sphereColor={sphere.color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          padding: '32px 24px 24px',
          background: `linear-gradient(180deg, ${sphere.color}15 0%, transparent 100%)`,
          borderBottom: `1px solid ${sphere.color}30`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6B7B6B',
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            ← Retour aux sphères
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${sphere.color}30 0%, ${sphere.color}10 100%)`,
                border: `2px solid ${sphere.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              }}
            >
              {sphere.icon}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#E8F0E8' }}>
                {sphere.name_fr}
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7B6B' }}>
                {sphere.description_fr}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bureau Sections Navigation */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {(Object.keys(BUREAU_SECTIONS) as BureauSectionType[]).map((section) => {
              const config = BUREAU_SECTIONS[section];
              const isActive = activeSection === section;
              
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: isActive ? `${sphere.color}20` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? sphere.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{config.icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      color: isActive ? sphere.color : '#9BA89B',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#E8F0E8' }}>
              {BUREAU_SECTIONS[activeSection].icon} {BUREAU_SECTIONS[activeSection].label}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6B7B6B' }}>
              {BUREAU_SECTIONS[activeSection].description}
            </p>
          </div>

          {/* Section Content */}
          <div
            style={{
              padding: 24,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              minHeight: 300,
            }}
          >
            {renderSectionContent()}
          </div>

          {/* Sphere Stats */}
          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            {[
              { icon: '🧵', label: 'Threads', value: 12 },
              { icon: '⚡', label: 'Décisions', value: 3 },
              { icon: '🤖', label: 'Agents', value: 4 },
              { icon: '📁', label: 'Fichiers', value: dataFiles.length },
              { icon: '📅', label: 'Réunions', value: meetings.length },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: sphere.color }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: '#6B7B6B' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <QuickActionsFAB onAction={handleQuickAction} />

      {/* Search */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => result.path && navigate(result.path)}
        onNavigate={navigate}
      />
    </div>
  );
};

export default SpherePageV72;
