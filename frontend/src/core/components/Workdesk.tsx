/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — BUREAU (BUREAU DE TRAVAIL)                                         ║
 * ║                                                                                  ║
 * ║     RÔLE UNIQUE: Produire · Collaborer · Exécuter                                ║
 * ║     JAMAIS DÉCIDER GLOBALEMENT                                                   ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  BUREAU_WINDOWS,
  BureauWindowId,
  BureauWindow,
  determineActionLocation,
  type BureauAction,
} from '../architecture/dashboard-bureau.architecture';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

interface BureauProps {
  sphereId: string;
  sphereName: string;
  initialWindowId?: BureauWindowId;
  onNavigateToDashboard: () => void;
  onActionBlocked?: (action: string, reason: string) => void;
}

interface WindowState {
  id: BureauWindowId;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface BureauState {
  openWindows: WindowState[];
  activeWindowId: BureauWindowId | null;
  focusMode: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--chenu-bg-deep, #16171A)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--chenu-text, #E9E4D6)',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--chenu-text-muted, #8D8371)',
    margin: 0,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    background: 'var(--chenu-accent-subtle, rgba(62, 180, 162, 0.15))',
    color: 'var(--chenu-accent, #3EB4A2)',
    fontSize: '12px',
    fontWeight: 500,
  },
  dashboardLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  toolbar: {
    display: 'flex',
    gap: '4px',
    padding: '8px 20px',
    borderBottom: '1px solid var(--chenu-border-subtle, #2A2B2E)',
    background: 'var(--chenu-surface, #2A2B2E)',
    overflowX: 'auto',
  },
  windowTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  windowTabActive: {
    background: 'var(--chenu-bg, #1E1F22)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  windowTabHover: {
    background: 'var(--chenu-surface-hover, #3A3B3E)',
  },
  workspace: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  windowContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--chenu-bg, #1E1F22)',
    margin: '16px',
    borderRadius: '12px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    overflow: 'hidden',
  },
  windowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
  },
  windowTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: 500,
  },
  windowControls: {
    display: 'flex',
    gap: '8px',
  },
  windowControlBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  actionsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'transparent',
    color: 'var(--chenu-text, #E9E4D6)',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionButtonPrimary: {
    background: 'var(--chenu-accent, #3EB4A2)',
    color: 'white',
    border: 'none',
  },
  restriction: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: 'var(--chenu-warning-subtle, rgba(217, 178, 106, 0.1))',
    color: 'var(--chenu-warning, #D8B26A)',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: 'var(--chenu-text-muted, #8D8371)',
  },
  emptyStateIcon: {
    fontSize: '48px',
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: '14px',
  },
  quickLaunch: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    maxWidth: '800px',
    width: '100%',
    padding: '24px',
  },
  quickLaunchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// ACTION LABELS
// ═══════════════════════════════════════════════════════════════════════════════════

const actionLabels: Record<BureauAction, string> = {
  create: '➕ Créer',
  edit: '✏️ Éditer',
  comment: '💬 Commenter',
  view_history: '📜 Historique',
  link_task: '🔗 Lier à tâche',
  link_agent: '🤖 Lier à agent',
  export: '📤 Exporter',
  mark_complete: '✓ Terminer',
  assign_agent: '👤 Assigner',
  transform: '🔄 Transformer',
  reply: '↩️ Répondre',
  request_summary: '📋 Résumé IA',
  request_draft: '✍️ Brouillon IA',
  classify: '📁 Classer',
  link_workspace: '🔗 Lier workspace',
  execute_agent: '▶️ Exécuter',
  choose_scope: '🎯 Choisir scope',
  view_result: '👁️ Voir résultat',
  revoke_access: '🚫 Révoquer',
};

// ═══════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════════

interface WindowViewProps {
  window: BureauWindow;
  onAction: (action: BureauAction) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const WindowView: React.FC<WindowViewProps> = ({
  window,
  onAction,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div style={styles.windowContainer}>
      {/* Window Header */}
      <div style={styles.windowHeader}>
        <div style={styles.windowTitle}>
          <span>{window.icon}</span>
          <span>{window.nameFr}</span>
        </div>
        <div style={styles.windowControls}>
          <button style={styles.windowControlBtn} onClick={onMinimize} title="Minimiser">
            −
          </button>
          <button style={styles.windowControlBtn} onClick={onMaximize} title="Maximiser">
            □
          </button>
          <button style={styles.windowControlBtn} onClick={onClose} title="Fermer">
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div style={styles.windowContent}>
        <p style={{ color: 'var(--chenu-text-muted)', marginBottom: '16px' }}>
          {window.description}
        </p>
        
        {/* Placeholder content based on window type */}
        {window.id === 'WORKSPACE_ACTIF' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p>Glissez-déposez des documents ici ou créez-en un nouveau</p>
          </div>
        )}
        
        {window.id === 'NOTES_PRODUCTION' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📓</div>
            <p>Commencez à écrire vos notes...</p>
          </div>
        )}
        
        {window.id === 'TACHES_OPERATIONNELLES' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>☑️</div>
            <p>Créez des sous-tâches et des checklists</p>
          </div>
        )}
        
        {window.id === 'MESSAGES' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p>Vos conversations complètes apparaîtront ici</p>
          </div>
        )}
        
        {window.id === 'COURRIEL' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <p>Connectez votre boîte mail pour commencer</p>
          </div>
        )}
        
        {window.id === 'BASE_DONNEES_EDITION' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗃️</div>
            <p>Créez ou éditez vos tables de données</p>
          </div>
        )}
        
        {window.id === 'AGENTS_EXECUTION' && (
          <div style={{ textAlign: 'center', padding: '48px', opacity: 0.5 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <p>Sélectionnez un agent et définissez sa portée</p>
          </div>
        )}
        
        {window.id === 'DASHBOARD_MODE_GESTION' && (
          <div style={{ 
            padding: '16px', 
            background: 'var(--chenu-surface)', 
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <p style={{ color: 'var(--chenu-gold)', fontWeight: 500, marginBottom: '8px' }}>
              Centre de Commandement — Mode Gestion
            </p>
            <p style={{ color: 'var(--chenu-text-muted)', fontSize: '13px' }}>
              Vue en lecture seule du Dashboard. Aucune action de modification disponible.
            </p>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      {window.actions.length > 0 && (
        <div style={styles.actionsBar}>
          {window.actions.map((action, i) => (
            <button
              key={action}
              style={{
                ...styles.actionButton,
                ...(i === 0 ? styles.actionButtonPrimary : {}),
              }}
              onClick={() => onAction(action)}
            >
              {actionLabels[action]}
            </button>
          ))}
          
          {window.restrictions.length > 0 && (
            <div style={styles.restriction}>
              ⚠️ {window.restrictions[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const Workdesk: React.FC<BureauProps> = ({
  sphereId,
  sphereName,
  initialWindowId,
  onNavigateToDashboard,
  onActionBlocked,
}) => {
  const [state, setState] = useState<BureauState>({
    openWindows: initialWindowId
      ? [{ id: initialWindowId, isMaximized: false, position: { x: 0, y: 0 }, size: { width: 800, height: 600 } }]
      : [],
    activeWindowId: initialWindowId || null,
    focusMode: false,
  });

  const openWindow = useCallback((windowId: BureauWindowId) => {
    setState(prev => {
      const isAlreadyOpen = prev.openWindows.some(w => w.id === windowId);
      if (isAlreadyOpen) {
        return { ...prev, activeWindowId: windowId };
      }
      return {
        ...prev,
        openWindows: [
          ...prev.openWindows,
          { id: windowId, isMaximized: false, position: { x: 50, y: 50 }, size: { width: 800, height: 600 } },
        ],
        activeWindowId: windowId,
      };
    });
  }, []);

  const closeWindow = useCallback((windowId: BureauWindowId) => {
    setState(prev => {
      const newWindows = prev.openWindows.filter(w => w.id !== windowId);
      return {
        ...prev,
        openWindows: newWindows,
        activeWindowId: newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null,
      };
    });
  }, []);

  const handleAction = useCallback((action: BureauAction) => {
    // Log action for audit
    logger.debug(`[Bureau] Action: ${action}`);
    
    // Check if action is a decision (should go to Dashboard)
    const location = determineActionLocation('DECISION');
    if (location === 'DASHBOARD') {
      onActionBlocked?.(action, 'Cette décision doit être prise dans le Centre de Commandement');
      return;
    }
    
    // Handle action
    // TODO: Implement action handlers
  }, [onActionBlocked]);

  const activeWindow = useMemo(() => {
    if (!state.activeWindowId) return null;
    return BUREAU_WINDOWS.find(w => w.id === state.activeWindowId);
  }, [state.activeWindowId]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <div>
            <h1 style={styles.title}>📝 Bureau de Travail</h1>
            <p style={styles.subtitle}>Produire · Collaborer · Exécuter</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={styles.badge}>{sphereName}</span>
          <button style={styles.dashboardLink} onClick={onNavigateToDashboard}>
            🎛️ Centre de Commandement
          </button>
        </div>
      </header>

      {/* Window Tabs Toolbar */}
      <div style={styles.toolbar}>
        {BUREAU_WINDOWS.map((window) => {
          const isOpen = state.openWindows.some(w => w.id === window.id);
          const isActive = state.activeWindowId === window.id;
          
          return (
            <button
              key={window.id}
              style={{
                ...styles.windowTab,
                ...(isActive ? styles.windowTabActive : {}),
                opacity: isOpen ? 1 : 0.6,
              }}
              onClick={() => openWindow(window.id)}
            >
              <span>{window.icon}</span>
              {window.nameFr}
              {isOpen && <span style={{ opacity: 0.5 }}>●</span>}
            </button>
          );
        })}
      </div>

      {/* Workspace Area */}
      <div style={styles.workspace}>
        {activeWindow ? (
          <WindowView
            window={activeWindow}
            onAction={handleAction}
            onClose={() => closeWindow(activeWindow.id)}
            onMinimize={() => {/* TODO */}}
            onMaximize={() => {/* TODO */}}
          />
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🖥️</div>
            <div style={styles.emptyStateText}>
              Sélectionnez une fenêtre pour commencer à travailler
            </div>
            <div style={styles.quickLaunch}>
              {BUREAU_WINDOWS.slice(0, 4).map((window) => (
                <div
                  key={window.id}
                  style={styles.quickLaunchItem}
                  onClick={() => openWindow(window.id)}
                >
                  <span style={{ fontSize: '24px' }}>{window.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{window.nameFr}</div>
                    <div style={{ fontSize: '12px', color: 'var(--chenu-text-muted)' }}>
                      {window.description.slice(0, 40)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workdesk;
