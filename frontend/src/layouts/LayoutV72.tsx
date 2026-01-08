/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — MAIN LAYOUT                                 ║
 * ║                                                                              ║
 * ║  Layout principal avec sidebar, header, et content area                      ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NavItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV ITEMS V72
// ═══════════════════════════════════════════════════════════════════════════════

const navItems: NavItem[] = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/sphere', icon: '🌐', label: 'Spheres' },
  { path: '/threads', icon: '🧵', label: 'Threads' },
  { path: '/agents', icon: '🤖', label: 'Agents' },
  { path: '/nova', icon: '✨', label: 'Nova' },
  { path: '/decisions', icon: '⚖️', label: 'Decisions' },
  { path: '/governance', icon: '🛡️', label: 'Governance' },
  { path: '/xr', icon: '🥽', label: 'XR' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  layout: {
    minHeight: '100vh',
    background: '#0a0a0b',
    color: '#e0e0e0',
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,
  
  sidebar: {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    background: '#111113',
    borderRight: '1px solid #1f1f23',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 50,
  } as React.CSSProperties,
  
  sidebarCollapsed: {
    width: 64,
  } as React.CSSProperties,
  
  logo: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderBottom: '1px solid #1f1f23',
    gap: 12,
  } as React.CSSProperties,
  
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #D8B26A 0%, #B8956A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  } as React.CSSProperties,
  
  logoText: {
    fontWeight: 700,
    fontSize: 18,
    color: '#fff',
    letterSpacing: '0.02em',
  } as React.CSSProperties,
  
  nav: {
    flex: 1,
    padding: '16px 8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  } as React.CSSProperties,
  
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 8,
    color: '#888',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  navItemActive: {
    background: '#1a1a1f',
    color: '#D8B26A',
  } as React.CSSProperties,
  
  navItemHover: {
    background: '#151518',
    color: '#fff',
  } as React.CSSProperties,
  
  header: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    left: 240,
    height: 64,
    background: 'rgba(10, 10, 11, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1f1f23',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 40,
  } as React.CSSProperties,
  
  headerCollapsed: {
    left: 64,
  } as React.CSSProperties,
  
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: '#151518',
    borderRadius: 8,
    border: '1px solid #1f1f23',
    width: 320,
  } as React.CSSProperties,
  
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 14,
  } as React.CSSProperties,
  
  searchKbd: {
    padding: '2px 6px',
    background: '#1f1f23',
    borderRadius: 4,
    fontSize: 11,
    color: '#666',
  } as React.CSSProperties,
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as React.CSSProperties,
  
  headerButton: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    transition: 'background 0.15s ease',
  } as React.CSSProperties,
  
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  } as React.CSSProperties,
  
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D8B26A 0%, #B8956A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#000',
  } as React.CSSProperties,
  
  main: {
    marginLeft: 240,
    marginTop: 64,
    minHeight: 'calc(100vh - 64px)',
    padding: 24,
  } as React.CSSProperties,
  
  mainCollapsed: {
    marginLeft: 64,
  } as React.CSSProperties,
  
  toggleButton: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: '#666',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  tokenBar: {
    margin: '0 8px 16px',
    padding: 12,
    background: '#151518',
    borderRadius: 8,
    border: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  tokenLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  } as React.CSSProperties,
  
  tokenProgress: {
    height: 4,
    background: '#1f1f23',
    borderRadius: 2,
    overflow: 'hidden',
  } as React.CSSProperties,
  
  tokenFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #D8B26A, #B8956A)',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Mock token usage
  const tokensUsed = 45000;
  const tokensLimit = 100000;
  const tokenPercent = (tokensUsed / tokensLimit) * 100;
  
  return (
    <aside style={{ ...styles.sidebar, ...(collapsed ? styles.sidebarCollapsed : {}) }}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>◈</div>
        {!collapsed && <span style={styles.logoText}>CHE·NU</span>}
        <div style={{ flex: 1 }} />
        <button 
          onClick={onToggle} 
          style={styles.toggleButton}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      {/* Navigation */}
      <nav style={styles.nav}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const isHovered = hoveredItem === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                ...(isHovered && !isActive ? styles.navItemHover : {}),
              }}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && item.badge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  background: '#dc2626',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Token Usage */}
      {!collapsed && (
        <div style={styles.tokenBar}>
          <div style={styles.tokenLabel}>
            <span>Tokens</span>
            <span>{(tokensUsed / 1000).toFixed(0)}K / {(tokensLimit / 1000).toFixed(0)}K</span>
          </div>
          <div style={styles.tokenProgress}>
            <div style={{ ...styles.tokenFill, width: `${tokenPercent}%` }} />
          </div>
        </div>
      )}
      
      {/* Settings */}
      <div style={{ padding: '0 8px 16px' }}>
        <NavLink
          to="/settings"
          style={{
            ...styles.navItem,
            ...(location.pathname.startsWith('/settings') ? styles.navItemActive : {}),
          }}
          title={collapsed ? 'Settings' : undefined}
        >
          <span style={{ fontSize: 18 }}>⚙️</span>
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const handleSearch = useCallback(() => {
    // TODO: Open GlobalSearchV72
    console.log('Open search (⌘K)');
  }, []);
  
  return (
    <header style={{ ...styles.header, ...(sidebarCollapsed ? styles.headerCollapsed : {}) }}>
      {/* Search */}
      <div style={styles.searchBar} onClick={handleSearch}>
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Search threads, agents, spheres..." 
          style={styles.searchInput}
          readOnly
        />
        <kbd style={styles.searchKbd}>⌘K</kbd>
      </div>
      
      {/* Actions */}
      <div style={styles.headerActions}>
        <button 
          style={styles.headerButton} 
          title="Notifications"
          onClick={() => {}}
        >
          🔔
        </button>
        
        <button 
          style={styles.headerButton} 
          title="Nova"
          onClick={() => navigate('/nova')}
        >
          ✨
        </button>
        
        <button 
          style={styles.userButton}
          onClick={() => navigate('/settings')}
        >
          <div style={styles.avatar}>
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: 14, color: '#ccc' }}>
            {user?.displayName || 'User'}
          </span>
        </button>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT V72 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface LayoutV72Props {
  children?: React.ReactNode;
}

export const LayoutV72: React.FC<LayoutV72Props> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <main style={{ ...styles.main, ...(sidebarCollapsed ? styles.mainCollapsed : {}) }}>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default LayoutV72;
