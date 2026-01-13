/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V71 — COMPLETE APPLICATION                        ║
 * ║                    Governed Intelligence Operating System                     ║
 * ║                    GOUVERNANCE > EXÉCUTION                                   ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  USER JOURNEY:                                                               ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐    ║
 * ║  │  PUBLIC PAGES (Pre-Login)                                           │    ║
 * ║  │  / → /services → /demo → /pricing → /signup                         │    ║
 * ║  └─────────────────────────────────────────────────────────────────────┘    ║
 * ║                              ↓                                               ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐    ║
 * ║  │  AUTHENTICATION                                                     │    ║
 * ║  │  /signup → /login → /forgot-password                                │    ║
 * ║  └─────────────────────────────────────────────────────────────────────┘    ║
 * ║                              ↓                                               ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐    ║
 * ║  │  ONBOARDING (First-time users)                                      │    ║
 * ║  │  /onboarding → /onboarding/complete                                 │    ║
 * ║  └─────────────────────────────────────────────────────────────────────┘    ║
 * ║                              ↓                                               ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐    ║
 * ║  │  PROTECTED APP (Post-Login)                                         │    ║
 * ║  │  /{sphere}/{section} → 10 Sphères × 6 Sections = 60 Routes         │    ║
 * ║  │  /settings/* → User settings                                        │    ║
 * ║  │  /nova → Nova AI Assistant                                          │    ║
 * ║  └─────────────────────────────────────────────────────────────────────┘    ║
 * ║                                                                              ║
 * ║  10 SPHÈRES: Personal, Business, Government, Studio, Community,             ║
 * ║              Social, Entertainment, My Team, Scholar, AT-OM Mapping         ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { Suspense, lazy, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * Les 10 Sphères Canoniques CHE·NU™ — COULEURS OFFICIELLES (FROZEN)
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * BRAND_COLORS:
 * - sacredGold:       #D8B26A (Personal)
 * - cenoteTurquoise:  #3EB4A2 (My Team)
 * - ancientStone:     #8D8371 (Business)
 * - uiSlate:          #1E1F22 (Government)
 * - earthEmber:       #7A593A (Design Studio)
 * - shadowMoss:       #2F4C39 (Community)
 * - jungleEmerald:    #3F7249 (Social)
 * - purple:           #9B4DCA (Entertainment)
 * - softSand:         #E9E4D6 (Scholars)
 * - cosmicIndigo:     #3D5A80 (AT-OM Mapping)
 * 
 * Note: AT-OM Mapping est l'encyclopédie causale de l'histoire humaine.
 * C'est un moteur de mapping historique et symbolique, PAS mystique.
 */
export const BRAND_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  purple: '#9B4DCA',
  cosmicIndigo: '#3D5A80',
} as const;

export const SPHERES = [
  { id: 'personal', name: 'Personnel', nameEn: 'Personal', icon: '🏠', color: BRAND_COLORS.sacredGold },
  { id: 'my_team', name: 'Mon Équipe', nameEn: 'My Team', icon: '🤝', color: BRAND_COLORS.cenoteTurquoise },
  { id: 'business', name: 'Entreprise', nameEn: 'Business', icon: '💼', color: BRAND_COLORS.ancientStone },
  { id: 'government', name: 'Gouvernement', nameEn: 'Government', icon: '🏛️', color: BRAND_COLORS.uiSlate },
  { id: 'design_studio', name: 'Studio Créatif', nameEn: 'Creative Studio', icon: '🎨', color: BRAND_COLORS.earthEmber },
  { id: 'community', name: 'Communauté', nameEn: 'Community', icon: '👥', color: BRAND_COLORS.shadowMoss },
  { id: 'social', name: 'Social & Médias', nameEn: 'Social & Media', icon: '📱', color: BRAND_COLORS.jungleEmerald },
  { id: 'entertainment', name: 'Divertissement', nameEn: 'Entertainment', icon: '🎬', color: BRAND_COLORS.purple },
  { id: 'scholars', name: 'Érudition', nameEn: 'Scholars', icon: '📚', color: BRAND_COLORS.softSand },
  { id: 'atom_mapping', name: 'AT-OM Mapping', nameEn: 'AT-OM Mapping', icon: '🔮', color: BRAND_COLORS.cosmicIndigo },
] as const;

export type SphereId = typeof SPHERES[number]['id'];

/**
 * Les 6 Sections Bureau Canoniques
 */
export const BUREAU_SECTIONS = [
  { id: 'quickcapture', name: 'Capture Rapide', nameEn: 'Quick Capture', icon: '⚡' },
  { id: 'resumeworkspace', name: 'Espace de Travail', nameEn: 'Resume Workspace', icon: '📋' },
  { id: 'threads', name: 'Threads', nameEn: 'Threads', icon: '💬' },
  { id: 'datafiles', name: 'Données & Fichiers', nameEn: 'Data & Files', icon: '📁' },
  { id: 'activeagents', name: 'Agents Actifs', nameEn: 'Active Agents', icon: '🤖' },
  { id: 'meetings', name: 'Réunions', nameEn: 'Meetings', icon: '📅' },
] as const;

export type SectionId = typeof BUREAU_SECTIONS[number]['id'];

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  preferredSphere?: SphereId;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('chenu_token');
        if (token) {
          // TODO: Validate token with backend
          const savedUser = localStorage.getItem('chenu_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Real API call
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      onboardingCompleted: true,
      plan: 'pro',
      preferredSphere: 'personal',
    };
    setUser(mockUser);
    localStorage.setItem('chenu_token', 'mock_token');
    localStorage.setItem('chenu_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('chenu_token');
    localStorage.removeItem('chenu_user');
  };

  const signup = async (email: string, password: string, name: string) => {
    // TODO: Real API call
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      onboardingCompleted: false, // New users need onboarding
      plan: 'free',
    };
    setUser(newUser);
    localStorage.setItem('chenu_token', 'mock_token');
    localStorage.setItem('chenu_user', JSON.stringify(newUser));
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('chenu_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      signup,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE GUARDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Public Route - Redirects to app if already logged in
 */
const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  
  if (isAuthenticated) {
    // If user hasn't completed onboarding, send to onboarding
    if (user && !user.onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    // Otherwise go to default sphere
    return <Navigate to={`/${user?.preferredSphere || 'personal'}/quickcapture`} replace />;
  }
  
  return <>{children}</>;
};

/**
 * Protected Route - Requires authentication
 */
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  if (isLoading) return <LoadingScreen />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if onboarding is needed (but not on onboarding page itself)
  if (user && !user.onboardingCompleted && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Onboarding Route - Only for users who haven't completed onboarding
 */
const OnboardingRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.onboardingCompleted) {
    return <Navigate to={`/${user.preferredSphere || 'personal'}/quickcapture`} replace />;
  }
  
  return <>{children}</>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0a0a0a',
    flexDirection: 'column',
  }}>
    <div style={{
      fontSize: '32px',
      fontWeight: 700,
      color: '#D8B26A',
      marginBottom: '24px',
    }}>
      CHE<span style={{ color: '#8D8371', fontWeight: 300 }}>·NU</span>
    </div>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(216, 178, 106, 0.2)',
      borderTopColor: '#D8B26A',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES — PUBLIC
// ═══════════════════════════════════════════════════════════════════════════════

const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const DemoPage = lazy(() => import('./pages/public/DemoPage').then(m => ({ default: m.DemoPage })));
const InvestorPage = lazy(() => import('./pages/public/InvestorPage').then(m => ({ default: m.InvestorPage })));
const FAQPage = lazy(() => import('./pages/public/FAQPage').then(m => ({ default: m.FAQPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then(m => ({ default: m.PricingPage })));
const TutorialsPage = lazy(() => import('./pages/public/TutorialsPage').then(m => ({ default: m.TutorialsPage })));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/public/TermsPage').then(m => ({ default: m.TermsPage })));
const SecurityPage = lazy(() => import('./pages/public/SecurityPage').then(m => ({ default: m.SecurityPage })));

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES — AUTH
// ═══════════════════════════════════════════════════════════════════════════════

const LoginPage = lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/public/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES — ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

const OnboardingFlow = lazy(() => import('./pages/onboarding/OnboardingFlow').then(m => ({ default: m.OnboardingFlow })));

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES — PROTECTED
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const NovaPage = lazy(() => import('./pages/nova/NovaPage').then(m => ({ default: m.NovaPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL (Protected Layout)
// ═══════════════════════════════════════════════════════════════════════════════

const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="app-shell">
      {/* Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      {/* Main Content */}
      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <AppTopBar />
        
        {/* Content Area */}
        <div className="app-content">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </div>
        
        {/* Bottom Bar */}
        <AppBottomBar />
      </main>
      
      <style>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
        }
        .app-main {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }
        .app-main.sidebar-collapsed {
          margin-left: 70px;
        }
        .app-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .app-main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP SIDEBAR — Navigation des 9 Sphères
// ═══════════════════════════════════════════════════════════════════════════════

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSphere, setExpandedSphere] = useState<string | null>(null);
  
  // Get current sphere from URL
  const currentSphere = location.pathname.split('/')[1];
  const currentSection = location.pathname.split('/')[2];
  
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏠</span>
          {!collapsed && <span className="logo-text">CHE·NU</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Sphere Navigation */}
      <nav className="sidebar-nav">
        {SPHERES.map((sphere) => (
          <div key={sphere.id} className="sphere-group">
            {/* Sphere Header */}
            <button
              className={`sphere-header ${currentSphere === sphere.id ? 'active' : ''}`}
              onClick={() => {
                if (collapsed) {
                  window.location.href = `/${sphere.id}/quickcapture`;
                } else {
                  setExpandedSphere(expandedSphere === sphere.id ? null : sphere.id);
                }
              }}
              style={{ '--sphere-color': sphere.color } as React.CSSProperties}
            >
              <span className="sphere-icon">{sphere.icon}</span>
              {!collapsed && (
                <>
                  <span className="sphere-name">{sphere.name}</span>
                  <span className={`sphere-chevron ${expandedSphere === sphere.id ? 'expanded' : ''}`}>
                    ▶
                  </span>
                </>
              )}
            </button>
            
            {/* Section Sub-menu */}
            {!collapsed && expandedSphere === sphere.id && (
              <div className="sections-menu">
                {BUREAU_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`/${sphere.id}/${section.id}`}
                    className={`section-item ${currentSphere === sphere.id && currentSection === section.id ? 'active' : ''}`}
                  >
                    <span className="section-icon">{section.icon}</span>
                    <span className="section-name">{section.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Divider */}
        <div className="sidebar-divider" />
        
        {/* Nova AI */}
        <a href="/nova" className={`menu-item nova-item ${location.pathname === '/nova' ? 'active' : ''}`}>
          <span className="menu-icon">🤖</span>
          {!collapsed && <span className="menu-label">Nova AI</span>}
        </a>
        
        {/* Settings */}
        <a href="/settings" className={`menu-item ${location.pathname.startsWith('/settings') ? 'active' : ''}`}>
          <span className="menu-icon">⚙️</span>
          {!collapsed && <span className="menu-label">Paramètres</span>}
        </a>
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0] || '👤'}</div>
          {!collapsed && (
            <div className="user-details">
              <div className="user-name">{user?.name || 'Utilisateur'}</div>
              <div className="user-plan">{user?.plan?.toUpperCase() || 'FREE'}</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="logout-btn" onClick={logout} title="Déconnexion">
            🚪
          </button>
        )}
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          background: #121614;
          border-right: 1px solid #2a2a2a;
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: width 0.3s ease;
        }
        .sidebar.collapsed { width: 70px; }
        
        .sidebar-header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #2a2a2a;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon { font-size: 24px; }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #D8B26A;
        }
        .toggle-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: #2a2a2a;
          color: #6b6560;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn:hover {
          background: #4ade80;
          color: #000;
        }
        
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
        }
        
        .sphere-group {
          margin-bottom: 4px;
        }
        .sphere-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #a8a29e;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .sphere-header:hover {
          background: #1e2420;
          color: #e8e4dc;
        }
        .sphere-header.active {
          background: var(--sphere-color, #4ade80);
          color: #000;
        }
        .sphere-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }
        .sphere-name { flex: 1; font-size: 14px; }
        .sphere-chevron {
          font-size: 10px;
          transition: transform 0.2s;
        }
        .sphere-chevron.expanded {
          transform: rotate(90deg);
        }
        
        .sections-menu {
          padding-left: 36px;
          margin-bottom: 8px;
        }
        .section-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          color: #6b6560;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;
        }
        .section-item:hover {
          background: #1e2420;
          color: #a8a29e;
        }
        .section-item.active {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
        }
        .section-icon { font-size: 14px; }
        
        .sidebar-divider {
          height: 1px;
          background: #2a2a2a;
          margin: 12px 0;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #a8a29e;
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 4px;
        }
        .menu-item:hover {
          background: #1e2420;
          color: #e8e4dc;
        }
        .menu-item.active {
          background: #4ade80;
          color: #000;
        }
        .menu-item.nova-item {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: #fff;
        }
        .menu-item.nova-item:hover {
          transform: scale(1.02);
        }
        .menu-icon { font-size: 18px; width: 24px; text-align: center; }
        .menu-label { font-size: 14px; }
        
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #e8e4dc;
        }
        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #e8e4dc;
        }
        .user-plan {
          font-size: 11px;
          color: #4ade80;
        }
        .logout-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .logout-btn:hover { opacity: 1; }
        
        .sidebar.collapsed .sphere-header { justify-content: center; padding: 12px; }
        .sidebar.collapsed .menu-item { justify-content: center; padding: 12px; }
        
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP TOP BAR
// ═══════════════════════════════════════════════════════════════════════════════

const AppTopBar: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSphere = SPHERES.find(s => s.id === pathParts[0]);
  const currentSection = BUREAU_SECTIONS.find(s => s.id === pathParts[1]);
  
  return (
    <header className="top-bar">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        {currentSphere && (
          <>
            <span className="breadcrumb-sphere" style={{ color: currentSphere.color }}>
              {currentSphere.icon} {currentSphere.name}
            </span>
            {currentSection && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-section">
                  {currentSection.icon} {currentSection.name}
                </span>
              </>
            )}
          </>
        )}
        {!currentSphere && pathParts[0] && (
          <span className="breadcrumb-page">{pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1)}</span>
        )}
      </div>
      
      {/* Actions */}
      <div className="top-bar-actions">
        <button className="action-btn" title="Rechercher">🔍</button>
        <button className="action-btn" title="Notifications">🔔</button>
        <button className="action-btn" title="Aide">❓</button>
      </div>
      
      <style>{`
        .top-bar {
          height: 56px;
          background: #121614;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .breadcrumb-sphere { font-weight: 600; }
        .breadcrumb-separator { color: #6b6560; }
        .breadcrumb-section { color: #a8a29e; }
        .breadcrumb-page { color: #e8e4dc; font-weight: 500; }
        
        .top-bar-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
        }
        .action-btn:hover { background: #2a2a2a; }
      `}</style>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP BOTTOM BAR
// ═══════════════════════════════════════════════════════════════════════════════

const AppBottomBar: React.FC = () => {
  return (
    <footer className="bottom-bar">
      {/* Nova Quick Access */}
      <button className="nova-quick">
        🤖 <span>Nova</span>
      </button>
      
      {/* Status */}
      <div className="status-info">
        <span className="status-dot" />
        <span>Connecté</span>
      </div>
      
      <style>{`
        .bottom-bar {
          height: 48px;
          background: #121614;
          border-top: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .nova-quick {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: transform 0.2s;
        }
        .nova-quick:hover { transform: scale(1.05); }
        
        .status-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b6560;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
        }
      `}</style>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SpherePage: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const sphereId = pathParts[0] as SphereId;
  const sectionId = pathParts[1] as SectionId;
  
  const sphere = SPHERES.find(s => s.id === sphereId);
  const section = BUREAU_SECTIONS.find(s => s.id === sectionId);
  
  if (!sphere || !section) {
    return <Navigate to="/personal/quickcapture" replace />;
  }
  
  return (
    <div className="sphere-page">
      {/* Section Tabs */}
      <div className="section-tabs">
        {BUREAU_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`/${sphereId}/${s.id}`}
            className={`section-tab ${s.id === sectionId ? 'active' : ''}`}
          >
            {s.icon} {s.name}
          </a>
        ))}
      </div>
      
      {/* Section Content */}
      <div className="section-content">
        <SectionContent sphereId={sphereId} sectionId={sectionId} />
      </div>
      
      <style>{`
        .sphere-page {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .section-tabs {
          display: flex;
          gap: 4px;
          padding: 16px 0;
          border-bottom: 1px solid #2a2a2a;
          overflow-x: auto;
        }
        .section-tab {
          padding: 10px 16px;
          border-radius: 8px;
          color: #a8a29e;
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .section-tab:hover {
          background: #1e2420;
          color: #e8e4dc;
        }
        .section-tab.active {
          background: #4ade80;
          color: #000;
        }
        .section-content {
          flex: 1;
          padding-top: 24px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION CONTENT — Dynamic content per section
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionContentProps {
  sphereId: SphereId;
  sectionId: SectionId;
}

const SectionContent: React.FC<SectionContentProps> = ({ sphereId, sectionId }) => {
  const sphere = SPHERES.find(s => s.id === sphereId)!;
  const section = BUREAU_SECTIONS.find(s => s.id === sectionId)!;
  
  // TODO: Replace with actual section components
  return (
    <div className="section-placeholder">
      <div className="placeholder-icon" style={{ color: sphere.color }}>
        {section.icon}
      </div>
      <h2>{section.name}</h2>
      <p>Sphère: {sphere.name}</p>
      <p className="placeholder-hint">
        Contenu de la section {section.nameEn} pour la sphère {sphere.nameEn}
      </p>
      
      <style>{`
        .section-placeholder {
          text-align: center;
          padding: 60px 20px;
          color: #e8e4dc;
        }
        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }
        .section-placeholder h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .section-placeholder p {
          color: #a8a29e;
          margin-bottom: 8px;
        }
        .placeholder-hint {
          margin-top: 24px;
          padding: 16px;
          background: #1e2420;
          border-radius: 8px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* ════════════════════════════════════════════════════════════════ */}
              {/* PUBLIC ROUTES — Pre-Login                                        */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              {/* Home */}
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
              
              {/* Services & Info */}
              <Route path="/services" element={<PublicRoute><ServicesPage /></PublicRoute>} />
              <Route path="/features" element={<Navigate to="/services" replace />} />
              <Route path="/demo" element={<PublicRoute><DemoPage /></PublicRoute>} />
              <Route path="/investor" element={<PublicRoute><InvestorPage /></PublicRoute>} />
              <Route path="/investors" element={<Navigate to="/investor" replace />} />
              
              {/* Help & Info */}
              <Route path="/faq" element={<PublicRoute><FAQPage /></PublicRoute>} />
              <Route path="/pricing" element={<PublicRoute><PricingPage /></PublicRoute>} />
              <Route path="/tutorials" element={<PublicRoute><TutorialsPage /></PublicRoute>} />
              
              {/* Legal */}
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              
              {/* ════════════════════════════════════════════════════════════════ */}
              {/* AUTH ROUTES                                                      */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
              <Route path="/register" element={<Navigate to="/signup" replace />} />
              <Route path="/join" element={<Navigate to="/signup" replace />} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              
              {/* ════════════════════════════════════════════════════════════════ */}
              {/* ONBOARDING ROUTES                                                */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              <Route path="/onboarding" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              <Route path="/onboarding/*" element={<OnboardingRoute><OnboardingFlow /></OnboardingRoute>} />
              
              {/* ════════════════════════════════════════════════════════════════ */}
              {/* PROTECTED ROUTES — Post-Login                                    */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                {/* Default redirect */}
                <Route index element={<Navigate to="/personal/quickcapture" replace />} />
                
                {/* Sphere routes — 9 spheres × 6 sections = 54 routes */}
                {SPHERES.map((sphere) => (
                  <React.Fragment key={sphere.id}>
                    {/* Sphere root redirects to quickcapture */}
                    <Route 
                      path={`/${sphere.id}`} 
                      element={<Navigate to={`/${sphere.id}/quickcapture`} replace />} 
                    />
                    
                    {/* All sections */}
                    {BUREAU_SECTIONS.map((section) => (
                      <Route
                        key={`${sphere.id}-${section.id}`}
                        path={`/${sphere.id}/${section.id}`}
                        element={<SpherePage />}
                      />
                    ))}
                  </React.Fragment>
                ))}
                
                {/* Nova AI */}
                <Route path="/nova" element={<NovaPage />} />
                
                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/*" element={<SettingsPage />} />
              </Route>
              
              {/* ════════════════════════════════════════════════════════════════ */}
              {/* FALLBACK                                                         */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
