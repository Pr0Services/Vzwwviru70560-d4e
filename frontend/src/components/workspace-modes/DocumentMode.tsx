/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — DOCUMENT MODE                                         ║
 * ║              Workspace Mode L3: 📄 Édition de Documents                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  CAPABILITIES:                                                               ║
 * ║  - Rich text editing with semantic formatting                                ║
 * ║  - Domain-specific templates                                                 ║
 * ║  - AI-assisted drafting                                                      ║
 * ║  - Real-time agent annotations                                               ║
 * ║  - Version control                                                           ║
 * ║  - Export to PDF, DOCX, MD                                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type DocumentType = 'report' | 'contract' | 'specification' | 'note' | 'plan' | 'script';
type ExportFormat = 'pdf' | 'docx' | 'md' | 'html';

interface DocumentVersion {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  changesSummary: string;
}

interface AgentAnnotation {
  id: string;
  agentId: string;
  agentName: string;
  type: 'suggestion' | 'warning' | 'info' | 'correction';
  text: string;
  position: { start: number; end: number };
  resolved: boolean;
}

interface DocumentModeProps {
  documentId?: string;
  sphereId: string;
  domainId?: string;
  initialContent?: string;
  documentType?: DocumentType;
  onSave?: (content: string) => void;
  onExport?: (format: ExportFormat) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const DOCUMENT_TYPES: Record<DocumentType, { label: string; icon: string; template?: string }> = {
  report: { label: 'Rapport', icon: '📊', template: '# Rapport\n\n## Résumé\n\n## Analyse\n\n## Conclusions' },
  contract: { label: 'Contrat', icon: '📜', template: '# Contrat\n\n## Parties\n\n## Clauses\n\n## Signatures' },
  specification: { label: 'Spécification', icon: '📋', template: '# Spécification\n\n## Objectifs\n\n## Exigences\n\n## Critères' },
  note: { label: 'Note', icon: '📝', template: '' },
  plan: { label: 'Plan', icon: '🗺️', template: '# Plan\n\n## Objectifs\n\n## Étapes\n\n## Ressources' },
  script: { label: 'Script', icon: '🎬', template: '# Script\n\n## Scène 1\n\n## Scène 2' },
};

const TOOLBAR_ITEMS = [
  { id: 'bold', icon: 'B', label: 'Gras', shortcut: '⌘B' },
  { id: 'italic', icon: 'I', label: 'Italique', shortcut: '⌘I' },
  { id: 'heading', icon: 'H', label: 'Titre', shortcut: '⌘H' },
  { id: 'list', icon: '•', label: 'Liste', shortcut: '⌘L' },
  { id: 'link', icon: '🔗', label: 'Lien', shortcut: '⌘K' },
  { id: 'code', icon: '</>', label: 'Code', shortcut: '⌘E' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolbarCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    padding: '4px',
    borderRadius: '8px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toolBtn: (isActive: boolean = false) => ({
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 700 : 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  docTypeSelect: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  },
  aiBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  saveBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  mainArea: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  editorPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  editor: {
    flex: 1,
    padding: '40px 60px',
    overflowY: 'auto' as const,
    backgroundColor: '#0d0d0f',
  },
  editorContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  textarea: {
    width: '100%',
    minHeight: '500px',
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.softSand,
    fontSize: '16px',
    lineHeight: 1.8,
    fontFamily: 'Georgia, serif',
    resize: 'none' as const,
    outline: 'none',
  },
  sidePanel: {
    width: '280px',
    backgroundColor: '#111113',
    borderLeft: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidePanelHeader: {
    padding: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sidePanelContent: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto' as const,
  },
  annotationCard: (type: AgentAnnotation['type']) => {
    const colors = {
      suggestion: CHENU_COLORS.cenoteTurquoise,
      warning: CHENU_COLORS.sacredGold,
      info: CHENU_COLORS.ancientStone,
      correction: '#ef4444',
    };
    return {
      backgroundColor: colors[type] + '11',
      border: `1px solid ${colors[type]}33`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
    };
  },
  annotationType: (type: AgentAnnotation['type']) => {
    const colors = {
      suggestion: CHENU_COLORS.cenoteTurquoise,
      warning: CHENU_COLORS.sacredGold,
      info: CHENU_COLORS.ancientStone,
      correction: '#ef4444',
    };
    return {
      fontSize: '10px',
      fontWeight: 600,
      color: colors[type],
      marginBottom: '6px',
      textTransform: 'uppercase' as const,
    };
  },
  annotationText: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.4,
  },
  annotationAgent: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  versionItem: {
    padding: '10px 12px',
    borderRadius: '6px',
    backgroundColor: CHENU_COLORS.ancientStone + '11',
    marginBottom: '6px',
    cursor: 'pointer',
  },
  versionNumber: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  versionMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    backgroundColor: '#0a0a0b',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  exportMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: '#1a1a1c',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '8px',
    padding: '4px',
    minWidth: '140px',
    zIndex: 100,
  },
  exportItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_ANNOTATIONS: AgentAnnotation[] = [
  {
    id: 'ann-1',
    agentId: 'agent-writer',
    agentName: 'Agent Rédaction',
    type: 'suggestion',
    text: 'Considérez reformuler ce paragraphe pour plus de clarté.',
    position: { start: 100, end: 200 },
    resolved: false,
  },
  {
    id: 'ann-2',
    agentId: 'nova',
    agentName: 'Nova',
    type: 'info',
    text: 'Ce document sera lié au DataSpace "Projet Q1".',
    position: { start: 0, end: 0 },
    resolved: false,
  },
];

const MOCK_VERSIONS: DocumentVersion[] = [
  { id: 'v3', version: 3, createdAt: new Date(), createdBy: 'Vous', changesSummary: 'Révision conclusion' },
  { id: 'v2', version: 2, createdAt: new Date(Date.now() - 3600000), createdBy: 'Agent Rédaction', changesSummary: 'Corrections orthographe' },
  { id: 'v1', version: 1, createdAt: new Date(Date.now() - 86400000), createdBy: 'Vous', changesSummary: 'Version initiale' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const DocumentMode: React.FC<DocumentModeProps> = ({
  documentId,
  sphereId,
  domainId,
  initialContent = '',
  documentType = 'note',
  onSave,
  onExport,
}) => {
  // State
  const [content, setContent] = useState(initialContent || DOCUMENT_TYPES[documentType].template || '');
  const [docType, setDocType] = useState<DocumentType>(documentType);
  const [activePanel, setActivePanel] = useState<'annotations' | 'versions' | null>('annotations');
  const [annotations] = useState<AgentAnnotation[]>(MOCK_ANNOTATIONS);
  const [versions] = useState<DocumentVersion[]>(MOCK_VERSIONS);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useMemo(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Handlers
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave?.(content);
    setIsSaving(false);
  }, [content, onSave]);

  const handleExport = useCallback((format: ExportFormat) => {
    onExport?.(format);
    setShowExportMenu(false);
  }, [onExport]);

  const handleAIAssist = useCallback(() => {
    // TODO: Trigger AI assistance
    logger.debug('AI Assist triggered');
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <select
            style={styles.docTypeSelect}
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
          >
            {Object.entries(DOCUMENT_TYPES).map(([key, { label, icon }]) => (
              <option key={key} value={key}>{icon} {label}</option>
            ))}
          </select>
        </div>

        <div style={styles.toolbarCenter}>
          {TOOLBAR_ITEMS.map(item => (
            <motion.button
              key={item.id}
              style={styles.toolBtn()}
              whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '33' }}
              whileTap={{ scale: 0.95 }}
              title={`${item.label} (${item.shortcut})`}
            >
              {item.icon}
            </motion.button>
          ))}
        </div>

        <div style={styles.toolbarRight}>
          <motion.button
            style={styles.aiBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAIAssist}
          >
            ✦ Assistance IA
          </motion.button>
          
          <div style={{ position: 'relative' }}>
            <motion.button
              style={{ ...styles.toolBtn(), width: 'auto', padding: '6px 12px' }}
              whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '33' }}
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              ⬇️ Export
            </motion.button>
            
            {showExportMenu && (
              <div style={styles.exportMenu}>
                {(['pdf', 'docx', 'md', 'html'] as ExportFormat[]).map(format => (
                  <motion.button
                    key={format}
                    style={styles.exportItem}
                    whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                    onClick={() => handleExport(format)}
                  >
                    {format === 'pdf' && '📕'}
                    {format === 'docx' && '📘'}
                    {format === 'md' && '📝'}
                    {format === 'html' && '🌐'}
                    {format.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <motion.button
            style={styles.saveBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
          </motion.button>
        </div>
      </div>

      {/* Main Area */}
      <div style={styles.mainArea}>
        {/* Editor */}
        <div style={styles.editorPane}>
          <div style={styles.editor}>
            <div style={styles.editorContent}>
              <textarea
                ref={editorRef}
                style={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Commencez à écrire..."
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div style={styles.sidePanel}>
            <div style={styles.sidePanelHeader}>
              <motion.button
                style={styles.toolBtn(activePanel === 'annotations')}
                onClick={() => setActivePanel('annotations')}
              >
                💬
              </motion.button>
              <motion.button
                style={styles.toolBtn(activePanel === 'versions')}
                onClick={() => setActivePanel('versions')}
              >
                📜
              </motion.button>
              <span style={{ flex: 1, marginLeft: '8px' }}>
                {activePanel === 'annotations' ? 'Annotations' : 'Versions'}
              </span>
              <motion.button
                style={styles.toolBtn()}
                onClick={() => setActivePanel(null)}
              >
                ✕
              </motion.button>
            </div>

            <div style={styles.sidePanelContent}>
              {activePanel === 'annotations' && (
                annotations.length > 0 ? (
                  annotations.map(ann => (
                    <div key={ann.id} style={styles.annotationCard(ann.type)}>
                      <div style={styles.annotationType(ann.type)}>
                        {ann.type === 'suggestion' && '💡 Suggestion'}
                        {ann.type === 'warning' && '⚠️ Attention'}
                        {ann.type === 'info' && 'ℹ️ Info'}
                        {ann.type === 'correction' && '✏️ Correction'}
                      </div>
                      <p style={styles.annotationText}>{ann.text}</p>
                      <div style={styles.annotationAgent}>
                        <span>🤖 {ann.agentName}</span>
                        <motion.button
                          style={{ ...styles.toolBtn(), width: '24px', height: '24px', fontSize: '12px' }}
                          whileHover={{ backgroundColor: CHENU_COLORS.jungleEmerald + '22' }}
                        >
                          ✓
                        </motion.button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: CHENU_COLORS.ancientStone, textAlign: 'center', padding: '20px' }}>
                    Aucune annotation
                  </p>
                )
              )}

              {activePanel === 'versions' && (
                versions.map(ver => (
                  <motion.div
                    key={ver.id}
                    style={styles.versionItem}
                    whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                  >
                    <div style={styles.versionNumber}>Version {ver.version}</div>
                    <div style={styles.versionMeta}>
                      {ver.createdBy} • {formatTime(ver.createdAt)}
                    </div>
                    <div style={{ ...styles.versionMeta, marginTop: '4px' }}>
                      {ver.changesSummary}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div>
          {DOCUMENT_TYPES[docType].icon} {DOCUMENT_TYPES[docType].label} • {wordCount} mots
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>📍 {sphereId}</span>
          <span>💾 Sauvegardé automatiquement</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentMode;
