// CHE·NU™ Router — Complete Application Routing

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { CHENU_COLORS } from '../types';

// ============================================================
// LAZY LOADED PAGES
// ============================================================

const LoginPage = lazy(() => import('./auth/LoginPage'));
const RegisterPage = lazy(() => import('./auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./bureau/DashboardPage'));
const BureauPage = lazy(() => import('./bureau/BureauPage'));
const ThreadsPage = lazy(() => import('./bureau/ThreadsPage'));
const ThreadDetailPage = lazy(() => import('./bureau/ThreadDetailPage'));
const AgentsPage = lazy(() => import('./bureau/AgentsPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const ProfilePage = lazy(() => import('./settings/ProfilePage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// ============================================================
// LOADING COMPONENT
// ============================================================

const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
  }}>
    <h1 style={{ color: CHENU_COLORS.sacredGold, fontSize: '32px', marginBottom: '16px' }}>CHE·NU™</h1>
    <div style={{
      width: '40px',
      height: '40px',
      border: `3px solid ${CHENU_COLORS.sacredGold}33`,
      borderTopColor: CHENU_COLORS.sacredGold,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ============================================================
// PROTECTED ROUTE
// ============================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ============================================================
// PUBLIC ROUTE (redirect if authenticated)
// ============================================================

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// ============================================================
// MAIN ROUTER
// ============================================================

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPasswordPage /></PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          
          {/* Sphere/Bureau Routes */}
          <Route path="/sphere/:sphereCode" element={
            <ProtectedRoute><BureauPage /></ProtectedRoute>
          } />
          <Route path="/sphere/:sphereCode/:section" element={
            <ProtectedRoute><BureauPage /></ProtectedRoute>
          } />
          
          {/* Thread Routes */}
          <Route path="/threads" element={
            <ProtectedRoute><ThreadsPage /></ProtectedRoute>
          } />
          <Route path="/threads/:threadId" element={
            <ProtectedRoute><ThreadDetailPage /></ProtectedRoute>
          } />
          
          {/* Agent Routes */}
          <Route path="/agents" element={
            <ProtectedRoute><AgentsPage /></ProtectedRoute>
          } />
          
          {/* Settings Routes */}
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
          <Route path="/settings/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
