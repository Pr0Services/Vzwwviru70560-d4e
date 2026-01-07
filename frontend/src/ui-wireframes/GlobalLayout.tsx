// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — GLOBAL LAYOUT
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface SphereInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}

interface GlobalLayoutProps {
  currentSphere: SphereInfo;
  user: UserInfo;
  children: ReactNode;
  onNavigate: (route: string) => void;
  onNovaClick?: () => void;
  activeRoute?: string;
}

type NavItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
};

// =============================================================================
// CONSTANTS
// =============================================================================

const NAV_ITEMS: NavItem[] = [
  { id: 'universe', label: 'Universe View', icon: '🌐', route: '/universe' },
  { id: 'my_team', label: 'My Team', icon: '👥', route: '/team' },
  { id: 'inbox', label: 'Inbox', icon: '📥', route: '/inbox' },
  { id: 'tasks', label: 'Tasks', icon: '📋', route: '/tasks' },
  { id: 'meetings', label: 'Meetings', icon: '🎯', route: '/meetings' },
  { id: 'memory', label: 'Memory', icon: '🧠', route: '/memory' },
];

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    background: '#fafafa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    padding: '0 1rem',
    background: '#1a1a1a',
    color: 'white',
    borderBottom: '1px solid #333',
  },
  
  sphereInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  sphereIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
  },
  
  sphereName: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  novaButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid #444',
    borderRadius: '20px',
    color: '#d8b26a',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 200ms ease',
  },
  
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  
  sidebar: {
    width: '220px',
    background: 'white',
    borderRight: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1rem 0',
  },
  
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    color: '#525252',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: '0.9375rem',
  },
  
  navItemActive: {
    background: '#f0f7ff',
    color: '#0066cc',
    borderRight: '3px solid #0066cc',
  },
  
  navIcon: {
    fontSize: '1.125rem',
    width: '24px',
    textAlign: 'center' as const,
  },
  
  mainContent: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  currentSphere,
  user,
  children,
  onNavigate,
  onNovaClick,
  activeRoute = '/inbox',
}) => {
  const [isNovaHovered, setIsNovaHovered] = useState(false);

  return (
    <div style={styles.container}>
      {/* TOP BAR */}
      <header style={styles.topBar}>
        {/* Sphere Info (Left) */}
        <div style={styles.sphereInfo}>
          <div style={{
            ...styles.sphereIcon,
            background: currentSphere.color,
          }}>
            {currentSphere.icon}
          </div>
          <span style={styles.sphereName}>{currentSphere.name}</span>
        </div>

        {/* Nova & User (Right) */}
        <div style={styles.topBarRight}>
          {/* Nova Button - Always visible but passive */}
          <button
            style={{
              ...styles.novaButton,
              background: isNovaHovered ? 'rgba(216, 178, 106, 0.1)' : 'transparent',
              borderColor: isNovaHovered ? '#d8b26a' : '#444',
            }}
            onClick={onNovaClick}
            onMouseEnter={() => setIsNovaHovered(true)}
            onMouseLeave={() => setIsNovaHovered(false)}
          >
            <span>✧</span>
            <span>Nova</span>
          </button>

          {/* User */}
          <button style={styles.userButton}>
            <div style={styles.userAvatar}>
              {user.avatar || user.name.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </header>

      {/* BODY: SIDEBAR + MAIN */}
      <div style={styles.body}>
        {/* SIDEBAR - Stable navigation */}
        <nav style={styles.sidebar}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.route)}
              style={{
                ...styles.navItem,
                ...(activeRoute === item.route ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* MAIN CONTENT - Context-aware */}
        <main style={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  }}>
    <div>
      <h1 style={{
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1a1a1a',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          margin: '0.25rem 0 0',
          fontSize: '0.875rem',
          color: '#737373',
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {actions}
      </div>
    )}
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default GlobalLayout;
