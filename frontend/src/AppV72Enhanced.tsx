/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — APP ROUTER ENHANCED                         ║
 * ║                    Governed Intelligence Operating System                     ║
 * ║                    GOUVERNANCE > EXÉCUTION                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * V72 ENHANCED ROUTES:
 * All routes now use V72-enhanced pages with:
 * - LayoutV72 (sidebar, header, notifications)
 * - GlobalSearchV72 (⌘K)
 * - QuickActionsFAB
 * - NotificationCenter
 * - AgentSuggestionEngine
 * - Full keyboard shortcuts
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { globalStyles, colors } from './styles/theme';

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED V72 PAGES
// ═══════════════════════════════════════════════════════════════════════════════

// Auth Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// V72 ENHANCED Pages
const DashboardV72 = lazy(() => import('./pages/DashboardV72'));
const ThreadsPageV72 = lazy(() => import('./pages/ThreadsPageV72'));
const NovaPageV72 = lazy(() => import('./pages/NovaPageV72'));
const AgentsPageV72 = lazy(() => import('./pages/AgentsPageV72'));
const DecisionPointsPageV72 = lazy(() => import('./pages/DecisionPointsPageV72'));
const GovernancePageV72 = lazy(() => import('./pages/GovernancePageV72'));
const SpherePageV72 = lazy(() => import('./pages/SpherePageV72'));
const XRPageV72 = lazy(() => import('./pages/XRPageV72'));

// Legacy Pages (kept for compatibility)
const ThreadDetailPage = lazy(() => import('./pages/ThreadDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Layout
const LayoutV72 = lazy(() => import('./layouts/LayoutV72'));

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH GUARD
// ═══════════════════════════════════════════════════════════════════════════════

import { useAuthStore } from './stores/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const DEV_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  
  if (!isAuthenticated && !DEV_BYPASS) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const LoadingScreen: React.FC = () => (
  <div
    style={{
      height: '100vh',
      background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#D8B26A',
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 24, animation: 'pulse 2s infinite' }}>✨</div>
    <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>CHE·NU™</div>
    <div style={{ fontSize: 14, color: '#6B7B6B' }}>Chargement V72...</div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROTECTED LAYOUT WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

const ProtectedLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const DEV_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  
  if (!isAuthenticated && !DEV_BYPASS) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <LayoutV72>
      <Outlet />
    </LayoutV72>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export function AppV72Enhanced() {
  return (
    <>
      {/* Global Styles */}
      <style>{globalStyles}</style>

      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* PUBLIC ROUTES (no layout)                                            */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* V72 ENHANCED ROUTES (with LayoutV72)                                 */}
            {/* ═══════════════════════════════════════════════════════════════════ */}

            <Route element={<ProtectedLayout />}>
              {/* Dashboard — Stats, Spheres, Quick Actions, Notifications */}
              <Route index element={<DashboardV72 />} />
              <Route path="dashboard" element={<DashboardV72 />} />

              {/* Sphere — 6 Bureau Sections */}
              <Route path="sphere/:sphereId" element={<SpherePageV72 />} />

              {/* Threads — Maturity, Founding Intent */}
              <Route path="threads" element={<ThreadsPageV72 />} />
              <Route path="thread/:threadId" element={<ThreadDetailPage />} />

              {/* Nova — Chat with Checkpoints */}
              <Route path="nova" element={<NovaPageV72 />} />

              {/* Agents — 226 Agent Marketplace */}
              <Route path="agents" element={<AgentsPageV72 />} />

              {/* Decisions — Aging System */}
              <Route path="decisions" element={<DecisionPointsPageV72 />} />
              <Route path="decision-points" element={<Navigate to="/decisions" replace />} />

              {/* Governance — CEA Dashboard */}
              <Route path="governance" element={<GovernancePageV72 />} />

              {/* XR — Immersive View */}
              <Route path="xr" element={<XRPageV72 />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Legacy redirects */}
            <Route path="/checkpoints" element={<Navigate to="/nova?tab=checkpoints" replace />} />

            {/* 404 — Redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default AppV72Enhanced;
