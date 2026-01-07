/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — WEB APPLICATION                                       ║
 * ║              Governed Intelligence Operating System                          ║
 * ║              GOUVERNANCE > EXÉCUTION                                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  FLOW:                                                                       ║
 * ║  1. NOT AUTHENTICATED → Public Pages (Landing, Login, Signup)                ║
 * ║  2. AUTHENTICATED     → App Flow (Entry → Context → Action → Workspace)     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useMachine } from "@xstate/react";
import { navMachine } from "@/navigation/navMachine";
import { MOCK_DATA } from "./utils/mockData";

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════════════════
import { PublicRoutes } from "./pages/public/PublicRouter";

// ═══════════════════════════════════════════════════════════════════════════════
// APP SCREENS (Authenticated)
// ═══════════════════════════════════════════════════════════════════════════════
import { SetupScreen } from "./screens/SetupScreen";
import { EntryScreen } from "./screens/EntryScreen";
import { ContextBureauScreen } from "./screens/ContextBureauScreen";
import { ActionBureauScreen } from "./screens/ActionBureauScreen";
import { WorkspaceScreen } from "./screens/WorkspaceScreen";
import { AdminDashboard } from "./screens/AdminDashboard";

// Components
import { OrbitalMinimap } from "@/components/minimap/OrbitalMinimap";
import { NovaWidget } from "./NovaWidget";

// Types
import type { NavContext, DiamondState } from "@shared/types";

// Styles
import "./styles/global.css";

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION HOOK
// ═══════════════════════════════════════════════════════════════════════════════

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('chenu_token');
    const setupComplete = localStorage.getItem('chenu-setup-complete');
    
    setIsAuthenticated(!!token || setupComplete === 'true');
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('chenu_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('chenu_token');
    localStorage.removeItem('chenu-setup-complete');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ServicesBarProps {
  userName: string;
  tokenBalance: number;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

const ServicesBar: React.FC<ServicesBarProps> = ({ 
  userName, 
  tokenBalance,
  onAdminClick,
  onLogout
}) => {
  return (
    <div className="services-bar">
      <div className="services-left">
        <div className="chenu-logo">
          <span className="logo-diamond">◆</span>
          <span className="logo-text">CHE·NU</span>
        </div>
        <button className="admin-btn" onClick={onAdminClick}>
          ⚙️ Admin
        </button>
      </div>
      
      <div className="services-center">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher dans CHE·NU..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="services-right">
        <div className="token-display">
          <span className="token-icon">⬡</span>
          <span className="token-amount">{tokenBalance.toLocaleString()}</span>
        </div>
        <div className="notifications-btn">🔔</div>
        <div className="user-menu">
          <span className="user-avatar">👤</span>
          <span className="user-name">{userName}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Déconnexion">
          🚪
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNICATION BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CommunicationBar: React.FC = () => {
  return (
    <div className="communication-bar">
      <div className="comm-links">
        <button className="comm-btn">
          <span className="comm-icon">💬</span>
          <span className="comm-label">Messages</span>
          <span className="comm-badge">5</span>
        </button>
        <button className="comm-btn">
          <span className="comm-icon">📋</span>
          <span className="comm-label">Threads actifs</span>
          <span className="comm-badge">3</span>
        </button>
        <button className="comm-btn">
          <span className="comm-icon">📅</span>
          <span className="comm-label">Réunions</span>
          <span className="comm-badge">1</span>
        </button>
        <button className="comm-btn">
          <span className="comm-icon">📞</span>
          <span className="comm-label">Appels</span>
        </button>
      </div>
      
      <div className="comm-actions">
        <button className="comm-action-btn">🎙️ Voice</button>
        <button className="comm-action-btn">+ Thread</button>
        <button className="comm-action-btn">+ Réunion</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD NAV CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

function buildNavContext(machineContext: unknown, data: typeof MOCK_DATA): NavContext {
  return {
    currentState: machineContext.currentLocation || 'entry',
    selection: {
      identityId: 'jo-personal',
      sphereId: machineContext.sphereId || 'personal',
      projectId: null,
    },
    prefilled: { identity: true, sphere: true, project: false },
    data: data,
    contextSummary: { urgentTasks: 3, upcomingMeetings: 1, alerts: 0 },
    contextLocked: machineContext.contextLocked || false,
    diamond: {
      identity: data.identities[0],
      sphere: data.spheresByIdentity['jo-personal']?.find(s => s.key === machineContext.sphereId) || null,
      project: null,
    },
    visibleHubs: ['communication'],
    actionSuggestions: [],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION (Authenticated)
// ═══════════════════════════════════════════════════════════════════════════════

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  // ALL HOOKS MUST BE CALLED FIRST
  const [state, send] = useMachine(navMachine);
  const machineCtx = state.context;
  const [novaOpen, setNovaOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const currentLocation = typeof state.value === 'string' 
    ? state.value 
    : machineCtx.currentLocation;

  const ctx = useMemo(
    () => buildNavContext(machineCtx, MOCK_DATA),
    [machineCtx]
  );

  // Show Admin Dashboard if requested
  if (showAdmin) {
    return (
      <AdminDashboard 
        apiUrl="/api/v1"
        onClose={() => setShowAdmin(false)}
      />
    );
  }

  const showChrome = currentLocation !== 'entry';

  const renderScreen = () => {
    switch (currentLocation) {
      case "entry":
        return (
          <EntryScreen 
            onEnter={() => send({ type: "ENTER_BUREAU" })} 
          />
        );

      case "context_bureau":
        return (
          <ContextBureauScreen
            ctx={ctx}
            onSelectIdentity={(id) => logger.debug('Select identity:', id)}
            onSelectSphere={(id) => send({ type: "SWITCH_SPHERE", sphereId: id as any })}
            onSelectProject={(id) => logger.debug('Select project:', id)}
            onClearProject={() => logger.debug('Clear project')}
            onConfirm={() => send({ type: "CONFIRM_CONTEXT" })}
          />
        );

      case "action_bureau":
        return (
          <ActionBureauScreen
            ctx={ctx}
            onOpenWorkspace={(id) => send({ type: "OPEN_WORKSPACE", workspaceId: id })}
            onCreateNote={() => logger.debug('Create note')}
            onCreateTask={() => logger.debug('Create task')}
            onStartMeeting={() => logger.debug('Start meeting')}
            onChangeContext={() => send({ type: "CHANGE_CONTEXT" })}
          />
        );

      case "workspace":
        return (
          <WorkspaceScreen
            ctx={ctx}
            onBack={() => send({ type: "GO_BACK" })}
            onChangeContext={() => send({ type: "CHANGE_CONTEXT" })}
          />
        );

      default:
        return (
          <EntryScreen 
            onEnter={() => send({ type: "ENTER_BUREAU" })} 
          />
        );
    }
  };

  return (
    <div className={`chenu-app ${showChrome ? 'with-chrome' : 'entry-mode'}`}>
      {/* TOP: SERVICES BAR */}
      {showChrome && (
        <header className="chenu-header">
          <ServicesBar 
            userName={ctx.diamond.identity?.name || 'Utilisateur'} 
            tokenBalance={12500}
            onAdminClick={() => setShowAdmin(true)}
            onLogout={onLogout}
          />
        </header>
      )}

      {/* MAIN LAYOUT */}
      <div className="chenu-main">
        {/* LEFT: MINIMAP */}
        {showChrome && (
          <aside className="chenu-sidebar">
            <OrbitalMinimap
              spheres={ctx.data.spheresByIdentity['jo-personal'] || []}
              activeSphereId={ctx.selection.sphereId}
              onSphereClick={(id) => send({ type: "SWITCH_SPHERE", sphereId: id as any })}
            />
          </aside>
        )}

        {/* CENTER: MAIN CONTENT */}
        <main className="chenu-content">
          {renderScreen()}
        </main>
      </div>

      {/* BOTTOM: COMMUNICATION BAR */}
      {showChrome && (
        <footer className="chenu-footer">
          <CommunicationBar />
          <NovaWidget 
            isOpen={novaOpen} 
            onToggle={() => setNovaOpen(!novaOpen)} 
          />
        </footer>
      )}

      {/* DEV INDICATOR */}
      <div className="dev-indicator">
        <span className="dev-badge">{currentLocation.toUpperCase()}</span>
        {ctx.contextLocked && <span className="lock-badge">🔒</span>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-diamond">◆</span>
          <h1 className="loading-title">CHE·NU</h1>
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  // Check if on public route
  const publicPaths = ['/', '/login', '/signup', '/services', '/features', '/pricing', '/demo', '/faq', '/investor', '/privacy', '/terms', '/security', '/forgot-password', '/onboarding'];
  const isPublicRoute = publicPaths.some(path => location.pathname === path || location.pathname.startsWith('/onboarding'));

  // Not authenticated → Show public pages
  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  // Authenticated but on public route → Redirect to app
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/app" replace />;
  }

  // Authenticated → Show main app
  return (
    <Routes>
      <Route path="/app/*" element={<MainApp onLogout={handleLogout} />} />
      <Route path="/admin" element={<AdminDashboard apiUrl="/api/v1" onClose={() => navigate('/app')} />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}

export default App;
