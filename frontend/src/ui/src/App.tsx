/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — MAIN APPLICATION
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Root application component orchestrating all pages and navigation.
 */

import React, { useState } from "react";
import type { RootSphere } from "./adapters/universeAdapter";
import { ROOT_SPHERES, getSphereIcon, getSphereLabel } from "./adapters/universeAdapter";
import { DashboardRoot } from "./pages/DashboardRoot";
import { SphereDashboardPage } from "./pages/SphereDashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AboutPage } from "./pages/AboutPage";
import { HelpPage } from "./pages/HelpPage";

type PageType = "dashboard" | "sphere" | "settings" | "about" | "help";

interface AppState {
  currentPage: PageType;
  selectedSphere: RootSphere | null;
  sidebarCollapsed: boolean;
}

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentPage: "dashboard",
    selectedSphere: null,
    sidebarCollapsed: false
  });

  const navigateTo = (page: PageType, sphere?: RootSphere) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      selectedSphere: sphere || null
    }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: state.sidebarCollapsed ? "60px" : "240px"
      }}>
        {/* Logo */}
        <div style={styles.sidebarLogo} onClick={() => navigateTo("dashboard")}>
          <span style={styles.logoIcon}>◈</span>
          {!state.sidebarCollapsed && (
            <span style={styles.logoText}>CHE·NU</span>
          )}
        </div>

        {/* Toggle Button */}
        <button style={styles.toggleButton} onClick={toggleSidebar}>
          {state.sidebarCollapsed ? "→" : "←"}
        </button>

        {/* Navigation */}
        <nav style={styles.nav}>
          {/* Main Nav */}
          <NavItem 
            icon="🏠" 
            label="Dashboard" 
            collapsed={state.sidebarCollapsed}
            active={state.currentPage === "dashboard"}
            onClick={() => navigateTo("dashboard")}
          />

          {/* Spheres Section */}
          {!state.sidebarCollapsed && (
            <div style={styles.navSection}>
              <span style={styles.navSectionTitle}>SPHERES</span>
            </div>
          )}

          {/* Sphere Links */}
          {ROOT_SPHERES.map(sphere => (
            <NavItem 
              key={sphere}
              icon={getSphereIcon(sphere)} 
              label={getSphereLabel(sphere)} 
              collapsed={state.sidebarCollapsed}
              active={state.currentPage === "sphere" && state.selectedSphere === sphere}
              onClick={() => navigateTo("sphere", sphere)}
            />
          ))}

          {/* Divider */}
          <div style={styles.navDivider} />

          {/* System Links */}
          <NavItem 
            icon="⚙️" 
            label="Settings" 
            collapsed={state.sidebarCollapsed}
            active={state.currentPage === "settings"}
            onClick={() => navigateTo("settings")}
          />
          <NavItem 
            icon="ℹ️" 
            label="About" 
            collapsed={state.sidebarCollapsed}
            active={state.currentPage === "about"}
            onClick={() => navigateTo("about")}
          />
          <NavItem 
            icon="❓" 
            label="Help" 
            collapsed={state.sidebarCollapsed}
            active={state.currentPage === "help"}
            onClick={() => navigateTo("help")}
          />
        </nav>

        {/* Footer */}
        <div style={styles.sidebarFooter}>
          <span style={styles.safeModeBadge}>
            🔒 {!state.sidebarCollapsed && "SAFE MODE"}
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbItem} onClick={() => navigateTo("dashboard")}>
              CHE·NU
            </span>
            {state.currentPage !== "dashboard" && (
              <>
                <span style={styles.breadcrumbSeparator}>/</span>
                <span style={styles.breadcrumbCurrent}>
                  {state.currentPage === "sphere" && state.selectedSphere 
                    ? getSphereLabel(state.selectedSphere)
                    : state.currentPage.charAt(0).toUpperCase() + state.currentPage.slice(1)
                  }
                </span>
              </>
            )}
          </div>
          <div style={styles.topBarRight}>
            <span style={styles.readOnlyBadge}>📖 Read-Only</span>
            <span style={styles.versionBadge}>v3.0</span>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          {state.currentPage === "dashboard" && (
            <DashboardRoot 
              onSphereSelect={(sphere) => navigateTo("sphere", sphere)}
            />
          )}
          {state.currentPage === "sphere" && state.selectedSphere && (
            <SphereDashboardPage 
              sphere={state.selectedSphere}
              onBack={() => navigateTo("dashboard")}
            />
          )}
          {state.currentPage === "settings" && (
            <SettingsPage onBack={() => navigateTo("dashboard")} />
          )}
          {state.currentPage === "about" && (
            <AboutPage onBack={() => navigateTo("dashboard")} />
          )}
          {state.currentPage === "help" && (
            <HelpPage onBack={() => navigateTo("dashboard")} />
          )}
        </div>
      </main>
    </div>
  );
};

// Navigation Item Component
const NavItem: React.FC<{
  icon: string;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, collapsed, active, onClick }) => (
  <button 
    style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {}),
      justifyContent: collapsed ? "center" : "flex-start"
    }}
    onClick={onClick}
    title={collapsed ? label : undefined}
  >
    <span style={styles.navIcon}>{icon}</span>
    {!collapsed && <span style={styles.navLabel}>{label}</span>}
  </button>
);

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  sidebar: {
    backgroundColor: "#1E1F22",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.2s ease",
    overflow: "hidden",
    position: "fixed" as const,
    height: "100vh",
    zIndex: 100
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
    cursor: "pointer",
    borderBottom: "1px solid #333"
  },
  logoIcon: {
    fontSize: "28px",
    color: "#D8B26A"
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "1px"
  },
  toggleButton: {
    position: "absolute" as const,
    top: "20px",
    right: "-12px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#1E1F22",
    border: "1px solid #333",
    color: "#8D8371",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    zIndex: 101
  },
  nav: {
    flex: 1,
    padding: "12px",
    overflowY: "auto" as const
  },
  navSection: {
    marginTop: "16px",
    marginBottom: "8px"
  },
  navSectionTitle: {
    fontSize: "10px",
    color: "#666",
    letterSpacing: "1px",
    paddingLeft: "12px"
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#AAA",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.15s",
    marginBottom: "4px"
  },
  navItemActive: {
    backgroundColor: "#3F724930",
    color: "#3EB4A2"
  },
  navIcon: {
    fontSize: "16px"
  },
  navLabel: {
    whiteSpace: "nowrap" as const
  },
  navDivider: {
    height: "1px",
    backgroundColor: "#333",
    margin: "12px 0"
  },
  sidebarFooter: {
    padding: "16px",
    borderTop: "1px solid #333"
  },
  safeModeBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#3F724920",
    borderRadius: "20px",
    fontSize: "11px",
    color: "#3EB4A2",
    fontWeight: 600
  },
  main: {
    flex: 1,
    marginLeft: "240px",
    display: "flex",
    flexDirection: "column",
    transition: "margin-left 0.2s ease"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #E5E5E5"
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  breadcrumbItem: {
    fontSize: "14px",
    color: "#8D8371",
    cursor: "pointer"
  },
  breadcrumbSeparator: {
    fontSize: "14px",
    color: "#CCC"
  },
  breadcrumbCurrent: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  readOnlyBadge: {
    padding: "6px 12px",
    backgroundColor: "#D8B26A20",
    color: "#7A593A",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 500
  },
  versionBadge: {
    padding: "6px 12px",
    backgroundColor: "#F0F0F0",
    color: "#666",
    borderRadius: "16px",
    fontSize: "12px"
  },
  content: {
    flex: 1,
    padding: "32px",
    overflowY: "auto" as const
  }
};

export default App;
