// CHE·NU™ Workspace Layout — Main Application Shell
// Layout principle: Reduce cognitive load, No feature dumping, Context first

import React, { useState } from 'react';
import { CHENU_COLORS, SphereCode, BureauSection, SPHERE_ICONS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  currentSphere: SphereCode;
  currentSection: BureauSection;
  onSphereChange: (sphere: SphereCode) => void;
  onSectionChange: (section: BureauSection) => void;
  showNova?: boolean;
}

interface SphereConfig {
  code: SphereCode;
  name: string;
  icon: string;
  color: string;
}

interface SectionConfig {
  id: BureauSection;
  name: string;
  icon: string;
}

// ============================================================
// CONFIGURATION
// ============================================================

const SPHERES: SphereConfig[] = [
  { code: 'personal', name: 'Personal', icon: '🏠', color: CHENU_COLORS.cenoteTurquoise },
  { code: 'business', name: 'Business', icon: '💼', color: CHENU_COLORS.sacredGold },
  { code: 'government', name: 'Government', icon: '🏛️', color: CHENU_COLORS.ancientStone },
  { code: 'design_studio', name: 'Studio', icon: '🎨', color: CHENU_COLORS.jungleEmerald },
  { code: 'community', name: 'Community', icon: '👥', color: CHENU_COLORS.shadowMoss },
  { code: 'social', name: 'Social', icon: '📱', color: CHENU_COLORS.earthEmber },
  { code: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#E74C3C' },
  { code: 'my_team', name: 'My Team', icon: '🤝', color: CHENU_COLORS.cenoteTurquoise },
];

const SECTIONS: SectionConfig[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'tasks', name: 'Tasks', icon: '✅' },
  { id: 'projects', name: 'Projects', icon: '📁' },
  { id: 'threads', name: 'Threads', icon: '💬' },
  { id: 'meetings', name: 'Meetings', icon: '📅' },
  { id: 'data', name: 'Data', icon: '🗄️' },
  { id: 'agents', name: 'Agents', icon: '🤖' },
  { id: 'reports', name: 'Reports', icon: '📈' },
  { id: 'budget', name: 'Budget', icon: '💰' },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Left Sidebar - Spheres
  sphereSidebar: {
    width: '72px',
    backgroundColor: '#0a0a0b',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px 0',
    gap: '8px',
  },
  logo: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${CHENU_COLORS.sacredGold}, ${CHENU_COLORS.cenoteTurquoise})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
  },
  sphereButton: (isActive: boolean, color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: isActive ? color + '22' : 'transparent',
    color: isActive ? color : CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    position: 'relative' as const,
    transition: 'all 0.2s ease',
  }),
  sphereIndicator: (color: string) => ({
    position: 'absolute' as const,
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '24px',
    backgroundColor: color,
    borderRadius: '0 4px 4px 0',
  }),
  sphereDivider: {
    width: '32px',
    height: '1px',
    backgroundColor: CHENU_COLORS.ancientStone + '44',
    margin: '8px 0',
  },

  // Section Sidebar
  sectionSidebar: {
    width: '220px',
    backgroundColor: '#111113',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sectionHeader: {
    padding: '20px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  sphereTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px 8px',
  },
  sectionButton: (isActive: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '15' : 'transparent',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease',
    marginBottom: '4px',
  }),
  sectionIcon: {
    fontSize: '16px',
    width: '24px',
    textAlign: 'center' as const,
  },
  sectionName: {
    flex: 1,
  },
  sectionBadge: {
    padding: '2px 8px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    borderRadius: '10px',
    fontSize: '10px',
    color: CHENU_COLORS.sacredGold,
    fontWeight: 600,
  },

  // Main Content
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  topBar: {
    height: '56px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },
  breadcrumbSeparator: {
    color: CHENU_COLORS.ancientStone + '66',
  },
  breadcrumbActive: {
    color: CHENU_COLORS.softSand,
    fontWeight: 500,
  },
  topBarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    width: '280px',
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    outline: 'none',
    flex: 1,
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    cursor: 'pointer',
  },
  contentArea: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    backgroundColor: CHENU_COLORS.uiSlate,
  },

  // Nova Panel (Right)
  novaPanel: {
    width: '380px',
    backgroundColor: '#0a0a0b',
    borderLeft: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  novaPanelHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  novaPanelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  novaPanelContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  novaQuickActions: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  quickActionBtn: {
    padding: '12px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center' as const,
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  currentSphere,
  currentSection,
  onSphereChange,
  onSectionChange,
  showNova = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentSphereConfig = SPHERES.find(s => s.code === currentSphere)!;
  const currentSectionConfig = SECTIONS.find(s => s.id === currentSection)!;

  // Mock badges for sections
  const sectionBadges: Partial<Record<BureauSection, number>> = {
    tasks: 5,
    threads: 2,
    meetings: 1,
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar - Spheres */}
      <div style={styles.sphereSidebar}>
        <div style={styles.logo} title="CHE·NU">🏠</div>
        
        {SPHERES.slice(0, 4).map(sphere => (
          <button
            key={sphere.code}
            style={styles.sphereButton(currentSphere === sphere.code, sphere.color)}
            onClick={() => onSphereChange(sphere.code)}
            title={sphere.name}
          >
            {currentSphere === sphere.code && (
              <div style={styles.sphereIndicator(sphere.color)} />
            )}
            {sphere.icon}
          </button>
        ))}

        <div style={styles.sphereDivider} />

        {SPHERES.slice(4).map(sphere => (
          <button
            key={sphere.code}
            style={styles.sphereButton(currentSphere === sphere.code, sphere.color)}
            onClick={() => onSphereChange(sphere.code)}
            title={sphere.name}
          >
            {currentSphere === sphere.code && (
              <div style={styles.sphereIndicator(sphere.color)} />
            )}
            {sphere.icon}
          </button>
        ))}
      </div>

      {/* Section Sidebar */}
      <div style={styles.sectionSidebar}>
        <div style={styles.sectionHeader}>
          <div style={styles.sphereTitle}>
            <span>{currentSphereConfig.icon}</span>
            <span>{currentSphereConfig.name}</span>
          </div>
        </div>

        <div style={styles.sectionList}>
          {SECTIONS.map(section => (
            <button
              key={section.id}
              style={styles.sectionButton(currentSection === section.id)}
              onClick={() => onSectionChange(section.id)}
            >
              <span style={styles.sectionIcon}>{section.icon}</span>
              <span style={styles.sectionName}>{section.name}</span>
              {sectionBadges[section.id] && (
                <span style={styles.sectionBadge}>{sectionBadges[section.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.breadcrumb}>
            <span>{currentSphereConfig.icon} {currentSphereConfig.name}</span>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbActive}>
              {currentSectionConfig.icon} {currentSectionConfig.name}
            </span>
          </div>

          <div style={styles.topBarActions}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone }}>⌘K</span>
            </div>
            <button style={styles.iconButton} title="Notifications">🔔</button>
            <button style={styles.iconButton} title="Paramètres">⚙️</button>
            <div style={styles.userAvatar} title="Profil">JD</div>
          </div>
        </div>

        {/* Content */}
        <div style={styles.contentArea}>
          {children}
        </div>
      </div>

      {/* Nova Panel */}
      {showNova && (
        <div style={styles.novaPanel}>
          <div style={styles.novaPanelHeader}>
            <div style={styles.novaPanelTitle}>
              <span>🌟</span>
              <span>Nova</span>
            </div>
            <button style={{ ...styles.iconButton, fontSize: '14px' }}>✕</button>
          </div>

          <div style={styles.novaPanelContent}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#111113', 
              borderRadius: '12px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌟</div>
              <div style={{ fontSize: '14px', color: CHENU_COLORS.softSand, marginBottom: '8px' }}>
                Nova est toujours présente
              </div>
              <div style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
                Intelligence système • Gouvernance • Mémoire
              </div>
            </div>

            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: CHENU_COLORS.sacredGold + '11', 
              borderRadius: '10px',
              border: `1px solid ${CHENU_COLORS.sacredGold}33`,
              fontSize: '12px',
              color: CHENU_COLORS.softSand,
            }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>💡 Suggestion</div>
              Vous avez 5 tâches en attente dans {currentSphereConfig.name}. 
              Voulez-vous que je vous aide à les prioriser?
            </div>
          </div>

          <div style={styles.novaQuickActions}>
            <button style={styles.quickActionBtn}>✨ Nouvelle idée</button>
            <button style={styles.quickActionBtn}>📝 Quick note</button>
            <button style={styles.quickActionBtn}>✅ Ajouter tâche</button>
            <button style={styles.quickActionBtn}>💬 Nouveau thread</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceLayout;
