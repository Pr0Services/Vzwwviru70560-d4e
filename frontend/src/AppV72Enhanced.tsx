/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V75 — MAIN APPLICATION
 * ═══════════════════════════════════════════════════════════════════════════
 * Governed Intelligence Operating System
 * GOUVERNANCE > EXÉCUTION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './providers/AuthProvider';

// ═══════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════════════════

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage || m.default })));
const DashboardPage = lazy(() => import('./pages/DashboardV72').then(m => ({ default: m.DashboardV72 || m.default })).catch(() => ({ default: () => <DefaultDashboard /> })));
const ThreadsPage = lazy(() => import('./pages/ThreadsPageV72').then(m => ({ default: m.ThreadsPageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Threads" /> })));
const NovaPage = lazy(() => import('./pages/NovaPageV72').then(m => ({ default: m.NovaPageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Nova" /> })));
const AgentsPage = lazy(() => import('./pages/AgentsPageV72').then(m => ({ default: m.AgentsPageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Agents" /> })));
const GovernancePage = lazy(() => import('./pages/GovernancePageV72').then(m => ({ default: m.GovernancePageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Governance" /> })));
const SpherePage = lazy(() => import('./pages/SpherePageV72').then(m => ({ default: m.SpherePageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Sphere" /> })));
const DecisionsPage = lazy(() => import('./pages/DecisionPointsPageV72').then(m => ({ default: m.DecisionPointsPageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="Decisions" /> })));
const XRPage = lazy(() => import('./pages/XRPageV72').then(m => ({ default: m.XRPageV72 || m.default })).catch(() => ({ default: () => <ComingSoon title="XR Mode" /> })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage || m.default })).catch(() => ({ default: () => <ComingSoon title="Settings" /> })));

// ═══════════════════════════════════════════════════════════════════════════
// QUERY CLIENT
// ═══════════════════════════════════════════════════════════════════════════

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// LOADING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
    color: '#D8B26A'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔱</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CHE·NU™</div>
    <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
      Chargement...
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMING SOON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ComingSoon = ({ title }: { title: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
    color: '#fff'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</div>
    <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
      Coming Soon...
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const DefaultDashboard = () => {
  const { user, logout } = useAuth();
  
  const spheres = [
    { id: 'personnel', name: 'Personnel', icon: '🏠', color: '#8BCDFF' },
    { id: 'entreprises', name: 'Entreprises', icon: '💼', color: '#FFD966' },
    { id: 'gouvernement', name: 'Gouvernement', icon: '🏛️', color: '#D08FFF' },
    { id: 'creative', name: 'Creative Studio', icon: '🎨', color: '#FF8BAA' },
    { id: 'skills', name: 'Skills & Tools', icon: '🛠️', color: '#59D0C6' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#FFB04D' },
    { id: 'community', name: 'Community', icon: '🤝', color: '#22C55E' },
    { id: 'social', name: 'Social & Media', icon: '📱', color: '#66D06F' },
    { id: 'ia_labs', name: 'IA Labs', icon: '🤖', color: '#FF5FFF' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
      color: '#fff',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(216, 178, 106, 0.3)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            color: '#D8B26A',
            margin: 0
          }}>
            🔱 CHE·NU™ V75
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            opacity: 0.7,
            margin: '0.25rem 0 0 0'
          }}>
            Governed Intelligence Operating System
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#D8B26A' }}>👤 {user?.displayName || 'User'}</span>
          <button 
            onClick={() => logout()}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.5rem',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Governance Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(216, 178, 106, 0.2) 0%, rgba(216, 178, 106, 0.05) 100%)',
        border: '1px solid rgba(216, 178, 106, 0.3)',
        borderRadius: '0.75rem',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
        <div>
          <div style={{ fontWeight: 'bold', color: '#D8B26A' }}>GOUVERNANCE {'>'} EXÉCUTION</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            Toute action IA nécessite une approbation humaine
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <QuickAction icon="💬" title="Nova Chat" href="/nova" />
        <QuickAction icon="📋" title="Threads" href="/threads" />
        <QuickAction icon="🤖" title="Agents" href="/agents" />
        <QuickAction icon="⚖️" title="Governance" href="/governance" />
      </div>

      {/* Spheres Grid */}
      <h2 style={{ 
        fontSize: '1.25rem', 
        marginBottom: '1rem',
        color: '#D8B26A'
      }}>
        🌍 9 Sphères
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {spheres.map(sphere => (
          <a
            key={sphere.id}
            href={`/sphere/${sphere.id}`}
            style={{
              background: `linear-gradient(135deg, ${sphere.color}22 0%, ${sphere.color}11 100%)`,
              border: `1px solid ${sphere.color}44`,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{sphere.icon}</div>
            <div style={{ fontWeight: '500', color: sphere.color }}>{sphere.name}</div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.875rem'
      }}>
        CHE·NU™ V75 — © 2025 Pro Service
      </footer>
    </div>
  );
};

const QuickAction = ({ icon, title, href }: { icon: string; title: string; href: string }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '0.75rem',
      textDecoration: 'none',
      color: '#fff',
      transition: 'background 0.2s'
    }}
  >
    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
    <span style={{ fontWeight: '500' }}>{title}</span>
  </a>
);

// ═══════════════════════════════════════════════════════════════════════════
// PROTECTED ROUTE
// ═══════════════════════════════════════════════════════════════════════════

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ═══════════════════════════════════════════════════════════════════════════
// APP ROUTES (Inside AuthProvider)
// ═══════════════════════════════════════════════════════════════════════════

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/threads" element={
          <ProtectedRoute>
            <ThreadsPage />
          </ProtectedRoute>
        } />
        <Route path="/nova" element={
          <ProtectedRoute>
            <NovaPage />
          </ProtectedRoute>
        } />
        <Route path="/agents" element={
          <ProtectedRoute>
            <AgentsPage />
          </ProtectedRoute>
        } />
        <Route path="/governance" element={
          <ProtectedRoute>
            <GovernancePage />
          </ProtectedRoute>
        } />
        <Route path="/sphere/:sphereId" element={
          <ProtectedRoute>
            <SpherePage />
          </ProtectedRoute>
        } />
        <Route path="/decisions" element={
          <ProtectedRoute>
            <DecisionsPage />
          </ProtectedRoute>
        } />
        <Route path="/xr" element={
          <ProtectedRoute>
            <XRPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const AppV72Enhanced = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default AppV72Enhanced;
