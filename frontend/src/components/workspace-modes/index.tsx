/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — WORKSPACE MODES INDEX                                 ║
 * ║              L3 Workspace Modes — Architecture Gelée                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  8 MODES:                                                                    ║
 * ║  1. 📄 DocumentMode   - Édition de documents                                 ║
 * ║  2. 📋 BoardMode      - Kanban/Agile                                         ║
 * ║  3. 📅 TimelineMode   - Gantt/Roadmap                                        ║
 * ║  4. 📊 SpreadsheetMode - Données tabulaires                                  ║
 * ║  5. 🔀 DiagramMode    - Flowcharts/Mermaid                                   ║
 * ║  6. 🎨 WhiteboardMode - Canvas infini                                        ║
 * ║  7. 🥽 XRLauncherMode - Immersif VR/AR                                       ║
 * ║  8. 🔄 HybridMode     - Multi-modes                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { DocumentMode } from './DocumentMode';
export { BoardMode } from './BoardMode';
export { TimelineMode } from './TimelineMode';

// ═══════════════════════════════════════════════════════════════════════════════
// WORKSPACE MODE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type WorkspaceModeId = 
  | 'document'
  | 'board'
  | 'timeline'
  | 'spreadsheet'
  | 'diagram'
  | 'whiteboard'
  | 'xr'
  | 'hybrid';

export interface WorkspaceModeConfig {
  id: WorkspaceModeId;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  color: string;
  available: boolean;
}

export const WORKSPACE_MODES: Record<WorkspaceModeId, WorkspaceModeConfig> = {
  document: {
    id: 'document',
    name: 'Document',
    nameFr: 'Document',
    icon: '📄',
    description: 'Rich text editing with AI assistance',
    descriptionFr: 'Édition de texte riche avec assistance IA',
    color: '#3b82f6',
    available: true,
  },
  board: {
    id: 'board',
    name: 'Board',
    nameFr: 'Tableau',
    icon: '📋',
    description: 'Kanban and agile task management',
    descriptionFr: 'Gestion des tâches Kanban et agile',
    color: CHENU_COLORS.sacredGold,
    available: true,
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    nameFr: 'Chronologie',
    icon: '📅',
    description: 'Gantt charts and roadmaps',
    descriptionFr: 'Diagrammes Gantt et roadmaps',
    color: CHENU_COLORS.cenoteTurquoise,
    available: true,
  },
  spreadsheet: {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    nameFr: 'Tableur',
    icon: '📊',
    description: 'Tabular data with formulas',
    descriptionFr: 'Données tabulaires avec formules',
    color: CHENU_COLORS.jungleEmerald,
    available: true,
  },
  diagram: {
    id: 'diagram',
    name: 'Diagram',
    nameFr: 'Diagramme',
    icon: '🔀',
    description: 'Flowcharts, mindmaps, and Mermaid',
    descriptionFr: 'Flowcharts, mindmaps et Mermaid',
    color: '#8b5cf6',
    available: true,
  },
  whiteboard: {
    id: 'whiteboard',
    name: 'Whiteboard',
    nameFr: 'Tableau blanc',
    icon: '🎨',
    description: 'Infinite canvas for brainstorming',
    descriptionFr: 'Canvas infini pour brainstorming',
    color: '#ec4899',
    available: true,
  },
  xr: {
    id: 'xr',
    name: 'XR Launcher',
    nameFr: 'Lanceur XR',
    icon: '🥽',
    description: 'Launch immersive VR/AR experiences',
    descriptionFr: 'Lancer des expériences VR/AR immersives',
    color: CHENU_COLORS.earthEmber,
    available: true,
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid',
    nameFr: 'Hybride',
    icon: '🔄',
    description: 'Combine multiple modes simultaneously',
    descriptionFr: 'Combiner plusieurs modes simultanément',
    color: CHENU_COLORS.ancientStone,
    available: true,
  },
};

export const WORKSPACE_MODE_LIST = Object.values(WORKSPACE_MODES);
export const WORKSPACE_MODE_IDS = Object.keys(WORKSPACE_MODES) as WorkspaceModeId[];

// ═══════════════════════════════════════════════════════════════════════════════
// PLACEHOLDER COMPONENTS (pour les modes pas encore implémentés)
// ═══════════════════════════════════════════════════════════════════════════════

interface PlaceholderModeProps {
  sphereId: string;
  modeId: WorkspaceModeId;
}

const PlaceholderMode: React.FC<PlaceholderModeProps> = ({ sphereId, modeId }) => {
  const config = WORKSPACE_MODES[modeId];
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: CHENU_COLORS.uiSlate,
      gap: '20px',
    }}>
      <motion.div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '24px',
          backgroundColor: config.color + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {config.icon}
      </motion.div>
      
      <h2 style={{ 
        color: CHENU_COLORS.softSand, 
        fontSize: '24px', 
        fontWeight: 600,
        margin: 0,
      }}>
        {config.nameFr}
      </h2>
      
      <p style={{ 
        color: CHENU_COLORS.ancientStone, 
        fontSize: '14px',
        margin: 0,
      }}>
        {config.descriptionFr}
      </p>
      
      <div style={{
        padding: '8px 16px',
        backgroundColor: config.color + '22',
        borderRadius: '20px',
        color: config.color,
        fontSize: '12px',
        fontWeight: 600,
      }}>
        🚧 En développement
      </div>
      
      <p style={{ 
        color: CHENU_COLORS.ancientStone, 
        fontSize: '12px',
        marginTop: '20px',
      }}>
        Sphère: {sphereId}
      </p>
    </div>
  );
};

// Spreadsheet Mode
export const SpreadsheetMode: React.FC<{ sphereId: string }> = ({ sphereId }) => (
  <PlaceholderMode sphereId={sphereId} modeId="spreadsheet" />
);

// Diagram Mode
export const DiagramMode: React.FC<{ sphereId: string }> = ({ sphereId }) => (
  <PlaceholderMode sphereId={sphereId} modeId="diagram" />
);

// Whiteboard Mode
export const WhiteboardMode: React.FC<{ sphereId: string }> = ({ sphereId }) => (
  <PlaceholderMode sphereId={sphereId} modeId="whiteboard" />
);

// XR Launcher Mode
export const XRLauncherMode: React.FC<{ sphereId: string }> = ({ sphereId }) => (
  <PlaceholderMode sphereId={sphereId} modeId="xr" />
);

// Hybrid Mode
export const HybridMode: React.FC<{ sphereId: string }> = ({ sphereId }) => (
  <PlaceholderMode sphereId={sphereId} modeId="hybrid" />
);

// ═══════════════════════════════════════════════════════════════════════════════
// WORKSPACE MODE ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

interface WorkspaceModeRouterProps {
  mode: WorkspaceModeId;
  sphereId: string;
  workspaceId?: string;
  domainId?: string;
}

export const WorkspaceModeRouter: React.FC<WorkspaceModeRouterProps> = ({
  mode,
  sphereId,
  workspaceId,
  domainId,
}) => {
  // Import dynamically to avoid circular dependencies
  const DocumentMode = React.lazy(() => import('./DocumentMode'));
  const BoardMode = React.lazy(() => import('./BoardMode'));
  const TimelineMode = React.lazy(() => import('./TimelineMode'));

  const fallback = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: CHENU_COLORS.ancientStone,
    }}>
      Chargement...
    </div>
  );

  return (
    <React.Suspense fallback={fallback}>
      {mode === 'document' && <DocumentMode sphereId={sphereId} domainId={domainId} />}
      {mode === 'board' && <BoardMode sphereId={sphereId} domainId={domainId} />}
      {mode === 'timeline' && <TimelineMode sphereId={sphereId} domainId={domainId} />}
      {mode === 'spreadsheet' && <SpreadsheetMode sphereId={sphereId} />}
      {mode === 'diagram' && <DiagramMode sphereId={sphereId} />}
      {mode === 'whiteboard' && <WhiteboardMode sphereId={sphereId} />}
      {mode === 'xr' && <XRLauncherMode sphereId={sphereId} />}
      {mode === 'hybrid' && <HybridMode sphereId={sphereId} />}
    </React.Suspense>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODE SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ModeSelectorProps {
  currentMode: WorkspaceModeId;
  onModeChange: (mode: WorkspaceModeId) => void;
  compact?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  compact = false,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: compact ? '4px' : '8px',
      flexWrap: 'wrap',
    }}>
      {WORKSPACE_MODE_LIST.map(mode => (
        <motion.button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          style={{
            padding: compact ? '6px 10px' : '8px 14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: currentMode === mode.id 
              ? mode.color + '22' 
              : CHENU_COLORS.ancientStone + '22',
            color: currentMode === mode.id 
              ? mode.color 
              : CHENU_COLORS.softSand,
            fontSize: compact ? '11px' : '13px',
            fontWeight: currentMode === mode.id ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{mode.icon}</span>
          {!compact && <span>{mode.nameFr}</span>}
        </motion.button>
      ))}
    </div>
  );
};

export default WorkspaceModeRouter;
