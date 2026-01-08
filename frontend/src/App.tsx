/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — APP ENTRY POINT                             ║
 * ║                    Governed Intelligence Operating System                     ║
 * ║                    GOUVERNANCE > EXÉCUTION                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * LAYOUT CANONIQUE:
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ TOP BAR (Services · Identité · Gouvernance)                              │
 * ├───────────┬───────────────────────────────────────────────────┬─────────┤
 * │ ◀ QUICK   │              WORKSPACE (BUREAU)                   │  HUB    │
 * │   NAV     │   9 Sphères × 6 Sections                          │  PANEL  │
 * │ (AUTO)    │                                                   │ (opt.)  │
 * ├───────────┴───────────────────────────────────────────────────┴─────────┤
 * │ BOTTOM BAR (Nova · Communication Hub · Notifications)                    │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ROUTES:
 * - /login                        → Login Page (public)
 * - /                             → Redirect to /personal/quickcapture
 * - /:sphere/:section             → Bureau Layout with section content
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Providers
import { AuthProvider, ProtectedRoute, PublicRoute } from './providers/AuthProvider';
import { SphereProvider } from './providers/SphereProvider';
import { ToastProvider } from './components/toast/ToastProvider';

// Error Handling
import { ErrorBoundary } from './components/errors/ErrorBoundary';

// Shell (Layout canonique)
import { AppShell } from './components/shell';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SpherePage } from './pages/SpherePage';

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY CLIENT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Constants
import { SPHERES_LIST } from './constants/CANON';

// ═══════════════════════════════════════════════════════════════════════════════
// APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider maxToasts={5}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* PUBLIC ROUTES */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* PROTECTED ROUTES */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          
          {/* Root redirect */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/personal/quickcapture" replace />
              </ProtectedRoute>
            } 
          />
          
          {/* Sphere routes - /:sphere/:section */}
          <Route
            path="/:sphere/:section"
            element={
              <ProtectedRoute>
                <SphereProvider>
                  <AppShell>
                    <SpherePage />
                  </AppShell>
                </SphereProvider>
              </ProtectedRoute>
            }
          />
          
          {/* Sphere without section - redirect to quickcapture */}
          <Route
            path="/:sphere"
            element={
              <ProtectedRoute>
                <SphereRedirect />
              </ProtectedRoute>
            }
          />
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* CATCH-ALL */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE REDIRECT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function SphereRedirect() {
  const sphere = window.location.pathname.split('/')[1];
  
  // Validate sphere
  const isValidSphere = SPHERES_LIST.some(s => s.id === sphere);
  
  if (isValidSphere) {
    return <Navigate to={`/${sphere}/quickcapture`} replace />;
  }
  
  // Invalid sphere, go to default
  return <Navigate to="/personal/quickcapture" replace />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default App;
