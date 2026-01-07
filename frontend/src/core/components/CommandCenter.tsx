/**
 * ╔══════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                  ║
 * ║     CHE·NU™ — DASHBOARD (CENTRE DE COMMANDEMENT)                                 ║
 * ║                                                                                  ║
 * ║     RÔLE UNIQUE: Organiser · Décider · Accéder                                   ║
 * ║     JAMAIS PRODUIRE                                                              ║
 * ║                                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  DASHBOARD_SECTIONS,
  DASHBOARD_WIDGETS,
  DashboardSectionId,
  DashboardSection,
  DashboardWidget,
  determineActionLocation,
  type DashboardAction,
} from '../architecture/dashboard-bureau.architecture';

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════════

interface DashboardProps {
  sphereId: string;
  sphereName: string;
  onNavigateToBureau: (windowId: string) => void;
  onActionBlocked?: (action: string, reason: string) => void;
}

interface DashboardState {
  activeSection: DashboardSectionId | null;
  isExpanded: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--chenu-bg, #1E1F22)',
    color: 'var(--chenu-text, #E9E4D6)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--chenu-gold, #D8B26A)',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  widgetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    padding: '24px',
    overflowY: 'auto',
  },
  widget: {
    background: 'var(--chenu-surface, #2A2B2E)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    transition: 'border-color 0.2s ease, transform 0.2s ease',
  },
  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  widgetTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--chenu-text, #E9E4D6)',
  },
  widgetIcon: {
    fontSize: '18px',
  },
  sectionsNav: {
    display: 'flex',
    gap: '8px',
    padding: '12px 24px',
    borderBottom: '1px solid var(--chenu-border, #3A3B3E)',
    overflowX: 'auto',
  },
  sectionTab: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--chenu-text-muted, #8D8371)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  sectionTabActive: {
    background: 'var(--chenu-accent-subtle, rgba(62, 180, 162, 0.15))',
    color: 'var(--chenu-accent, #3EB4A2)',
  },
  sectionContent: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
  sectionHeader: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  sectionDescription: {
    fontSize: '14px',
    color: 'var(--chenu-text-muted, #8D8371)',
    marginBottom: '12px',
  },
  restrictions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  restrictionBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'var(--chenu-warning-subtle, rgba(217, 178, 106, 0.15))',
    color: 'var(--chenu-warning, #D8B26A)',
    fontSize: '11px',
  },
  actionsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--chenu-border, #3A3B3E)',
    background: 'var(--chenu-surface, #2A2B2E)',
    color: 'var(--chenu-text, #E9E4D6)',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  actionButtonPrimary: {
    background: 'var(--chenu-accent, #3EB4A2)',
    color: 'white',
    border: 'none',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════════

interface WidgetCardProps {
  widget: DashboardWidget;
  onClick?: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.widget,
        borderColor: isHovered ? 'var(--chenu-accent, #3EB4A2)' : undefined,
        transform: isHovered ? 'translateY(-2px)' : undefined,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={styles.widgetHeader}>
        <div style={styles.widgetTitle}>
          <span style={styles.widgetIcon}>
            {widget.id === 'priorities' && '🎯'}
            {widget.id === 'tasks_global' && '✅'}
            {widget.id === 'workspaces_recent' && '📂'}
            {widget.id === 'messages_preview' && '💬'}
            {widget.id === 'agents_status' && '🤖'}
          </span>
          {widget.nameFr}
        </div>
        {widget.maxItems && (
          <span style={styles.badge}>Top {widget.maxItems}</span>
        )}
      </div>
      <div style={{ color: 'var(--chenu-text-muted, #8D8371)', fontSize: '13px' }}>
        {widget.description}
      </div>
    </div>
  );
};

interface SectionViewProps {
  section: DashboardSection;
  onAction: (action: DashboardAction) => void;
  onOpenInBureau: () => void;
}

const SectionView: React.FC<SectionViewProps> = ({ section, onAction, onOpenInBureau }) => {
  const actionLabels: Record<DashboardAction, string> = {
    view: '👁️ Voir',
    modify_note: '✏️ Modifier note',
    mark_decision: '✓ Marquer décision',
    archive: '📥 Archiver',
    create_task: '➕ Créer tâche',
    modify_priority: '🔺 Modifier priorité',
    open_in_bureau: '📝 Ouvrir dans Bureau',
    rename: '✏️ Renommer',
    duplicate: '📋 Dupliquer',
    view_permissions: '🔒 Voir permissions',
    modify_access: '🔐 Modifier accès',
    revoke: '🚫 Révoquer',
    view_logs: '📋 Voir logs',
    export_audit: '📤 Exporter audit',
  };

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {section.icon} {section.nameFr}
        </h2>
        <p style={styles.sectionDescription}>{section.description}</p>
        
        {section.restrictions.length > 0 && (
          <div style={styles.restrictions}>
            {section.restrictions.map((r, i) => (
              <span key={i} style={styles.restrictionBadge}>{r}</span>
            ))}
          </div>
        )}
      </div>

      <div style={styles.actionsList}>
        {section.actions.map((action) => (
          <button
            key={action}
            style={{
              ...styles.actionButton,
              ...(action === 'open_in_bureau' ? styles.actionButtonPrimary : {}),
            }}
            onClick={() => {
              if (action === 'open_in_bureau') {
                onOpenInBureau();
              } else {
                onAction(action);
              }
            }}
          >
            {actionLabels[action]}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════

export const CommandCenter: React.FC<DashboardProps> = ({
  sphereId,
  sphereName,
  onNavigateToBureau,
  onActionBlocked,
}) => {
  const [state, setState] = useState<DashboardState>({
    activeSection: null,
    isExpanded: false,
  });

  const handleSectionClick = useCallback((sectionId: DashboardSectionId) => {
    setState(prev => ({
      ...prev,
      activeSection: prev.activeSection === sectionId ? null : sectionId,
    }));
  }, []);

  const handleAction = useCallback((action: DashboardAction) => {
    // Log action for audit
    logger.debug(`[Dashboard] Action: ${action}`);
    
    // Check if action should go to Bureau
    const location = determineActionLocation('ACTION');
    if (location === 'BUREAU') {
      onActionBlocked?.(action, 'Cette action doit être effectuée dans le Bureau');
      return;
    }
    
    // Handle action
    // TODO: Implement action handlers
  }, [onActionBlocked]);

  const activeSection = useMemo(() => {
    if (!state.activeSection) return null;
    return DASHBOARD_SECTIONS.find(s => s.id === state.activeSection);
  }, [state.activeSection]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <div>
            <h1 style={styles.title}>🎛️ Centre de Commandement</h1>
            <p style={styles.subtitle}>Organiser · Décider · Accéder</p>
          </div>
        </div>
        <div>
          <span style={styles.badge}>{sphereName}</span>
        </div>
      </header>

      {/* Sections Navigation */}
      <nav style={styles.sectionsNav}>
        {DASHBOARD_SECTIONS.map((section) => (
          <button
            key={section.id}
            style={{
              ...styles.sectionTab,
              ...(state.activeSection === section.id ? styles.sectionTabActive : {}),
            }}
            onClick={() => handleSectionClick(section.id)}
          >
            <span>{section.icon}</span>
            {section.nameFr}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={styles.content}>
        {state.activeSection && activeSection ? (
          <div style={styles.sectionContent}>
            <SectionView
              section={activeSection}
              onAction={handleAction}
              onOpenInBureau={() => onNavigateToBureau(state.activeSection!)}
            />
          </div>
        ) : (
          <div style={styles.widgetsGrid}>
            {DASHBOARD_WIDGETS.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onClick={() => {
                  // Map widget to section
                  const sectionMap: Record<string, DashboardSectionId> = {
                    priorities: 'CONTEXTE',
                    tasks_global: 'TACHES_PRIORITES',
                    workspaces_recent: 'WORKSPACES',
                    messages_preview: 'COMMUNICATION',
                    agents_status: 'AGENTS_GESTION',
                  };
                  const sectionId = sectionMap[widget.id];
                  if (sectionId) {
                    handleSectionClick(sectionId);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
