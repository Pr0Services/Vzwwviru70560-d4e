/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — RESUME WORKSPACE SECTION                              ║
 * ║              Bureau Section L2-2: ▶️ Reprendre le Travail                    ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  RÈGLES:                                                                     ║
 * ║  - Affiche les éléments récents                                              ║
 * ║  - Éléments épinglés en priorité                                             ║
 * ║  - Restauration du contexte                                                  ║
 * ║  - Accès rapide aux workspaces L3                                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../constants/colors';
import { BUREAU_SECTIONS } from '../../types/bureau.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type WorkspaceType = 'document' | 'board' | 'timeline' | 'spreadsheet' | 'dashboard' | 'diagram' | 'whiteboard';

interface RecentWorkspace {
  id: string;
  name: string;
  type: WorkspaceType;
  sphereId: string;
  lastOpenedAt: Date;
  isPinned: boolean;
  progress?: number;
  preview?: string;
  tokenCost?: number;
}

interface ResumeWorkspaceSectionProps {
  sphereId: string;
  onOpenWorkspace?: (workspace: RecentWorkspace) => void;
  onPinWorkspace?: (workspaceId: string, pinned: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_CONFIG = BUREAU_SECTIONS.resumeworkspace;

const WORKSPACE_ICONS: Record<WorkspaceType, string> = {
  document: '📄',
  board: '📋',
  timeline: '📅',
  spreadsheet: '📊',
  dashboard: '📈',
  diagram: '🔀',
  whiteboard: '🎨',
};

// Mock data - would come from store
const MOCK_WORKSPACES: RecentWorkspace[] = [
  {
    id: 'ws-1',
    name: 'Rapport Q4 2025',
    type: 'document',
    sphereId: 'business',
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 30),
    isPinned: true,
    progress: 75,
    preview: 'Analyse des performances...',
  },
  {
    id: 'ws-2',
    name: 'Sprint Planning',
    type: 'board',
    sphereId: 'business',
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isPinned: true,
    progress: 40,
  },
  {
    id: 'ws-3',
    name: 'Budget Prévisionnel',
    type: 'spreadsheet',
    sphereId: 'business',
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isPinned: false,
    progress: 90,
  },
  {
    id: 'ws-4',
    name: 'Architecture Système',
    type: 'diagram',
    sphereId: 'business',
    lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isPinned: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  workspaceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  workspaceCard: {
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  cardName: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  cardType: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  pinBtn: (isPinned: boolean) => ({
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isPinned ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: isPinned ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '14px',
  }),
  progressBar: {
    height: '4px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '12px',
  },
  progressFill: (progress: number) => ({
    height: '100%',
    width: `${progress}%`,
    backgroundColor: progress >= 75 
      ? CHENU_COLORS.jungleEmerald 
      : progress >= 50 
        ? CHENU_COLORS.sacredGold 
        : CHENU_COLORS.cenoteTurquoise,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  }),
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  resumeBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
    gap: '12px',
    padding: '40px',
  },
  createBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.sacredGold,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ResumeWorkspaceSection: React.FC<ResumeWorkspaceSectionProps> = ({
  sphereId,
  onOpenWorkspace,
  onPinWorkspace,
}) => {
  const [workspaces, setWorkspaces] = useState<RecentWorkspace[]>(MOCK_WORKSPACES);

  // Separate pinned and recent
  const { pinnedWorkspaces, recentWorkspaces } = useMemo(() => {
    const pinned = workspaces.filter(w => w.isPinned);
    const recent = workspaces
      .filter(w => !w.isPinned)
      .sort((a, b) => b.lastOpenedAt.getTime() - a.lastOpenedAt.getTime());
    return { pinnedWorkspaces: pinned, recentWorkspaces: recent };
  }, [workspaces]);

  // Handlers
  const handleOpen = useCallback((workspace: RecentWorkspace) => {
    if (onOpenWorkspace) {
      onOpenWorkspace(workspace);
    }
  }, [onOpenWorkspace]);

  const handleTogglePin = useCallback((workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceId ? { ...w, isPinned: !w.isPinned } : w
    ));
    if (onPinWorkspace) {
      const workspace = workspaces.find(w => w.id === workspaceId);
      onPinWorkspace(workspaceId, !workspace?.isPinned);
    }
  }, [workspaces, onPinWorkspace]);

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `il y a ${minutes}min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  const renderWorkspaceCard = (workspace: RecentWorkspace) => (
    <motion.div
      key={workspace.id}
      style={styles.workspaceCard}
      whileHover={{ 
        scale: 1.01, 
        borderColor: CHENU_COLORS.sacredGold + '44',
        boxShadow: `0 4px 20px ${CHENU_COLORS.sacredGold}11`,
      }}
      onClick={() => handleOpen(workspace)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>
          <div style={styles.cardIcon}>
            {WORKSPACE_ICONS[workspace.type]}
          </div>
          <div>
            <div style={styles.cardName}>{workspace.name}</div>
            <div style={styles.cardType}>{workspace.type}</div>
          </div>
        </div>
        <motion.button
          style={styles.pinBtn(workspace.isPinned)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => handleTogglePin(workspace.id, e)}
          title={workspace.isPinned ? 'Désépingler' : 'Épingler'}
        >
          📌
        </motion.button>
      </div>

      {workspace.progress !== undefined && (
        <div style={styles.progressBar}>
          <div style={styles.progressFill(workspace.progress)} />
        </div>
      )}

      <div style={styles.cardFooter}>
        <span>{formatTimeAgo(workspace.lastOpenedAt)}</span>
        <motion.button
          style={styles.resumeBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ▶️ Reprendre
        </motion.button>
      </div>
    </motion.div>
  );

  if (workspaces.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>{SECTION_CONFIG.icon}</span>
            <span>{SECTION_CONFIG.nameFr}</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <span style={{ fontSize: '48px' }}>▶️</span>
          <p style={{ fontSize: '16px', color: CHENU_COLORS.softSand }}>
            Aucun workspace récent
          </p>
          <p>Créez votre premier workspace pour commencer</p>
          <motion.button
            style={styles.createBtn}
            whileHover={{ scale: 1.02, backgroundColor: CHENU_COLORS.sacredGold + '11' }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Nouveau Workspace
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
        </div>
      </div>

      {/* Pinned Workspaces */}
      {pinnedWorkspaces.length > 0 && (
        <div>
          <div style={styles.sectionLabel}>
            📌 Épinglés ({pinnedWorkspaces.length})
          </div>
          <div style={styles.workspaceGrid}>
            {pinnedWorkspaces.map(renderWorkspaceCard)}
          </div>
        </div>
      )}

      {/* Recent Workspaces */}
      {recentWorkspaces.length > 0 && (
        <div>
          <div style={styles.sectionLabel}>
            🕐 Récents ({recentWorkspaces.length})
          </div>
          <div style={styles.workspaceGrid}>
            {recentWorkspaces.map(renderWorkspaceCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeWorkspaceSection;
