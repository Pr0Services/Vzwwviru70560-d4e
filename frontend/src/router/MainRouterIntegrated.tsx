/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MAIN ROUTER V2                                  ║
 * ║                    Intégré avec MainLayout + 9 Sphères                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURE (GELÉE):
 * - 9 Sphères: Personal, Business, Government, Studio, Community, 
 *              Social, Entertainment, Team, Scholar
 * - 6 Sections Bureau par sphère: Dashboard, Notes, Tasks, Projects, Threads, Meetings
 * - Layout 4 zones: MapView, TopBar, Workspace, Communication
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SphereProvider } from '../contexts/SphereContext';
import { MainLayout } from '../layouts/MainLayoutIntegrated';

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════════════════════

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Public Pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const OnboardingPage = lazy(() => import('../pages/public/OnboardingPage'));

// Nova Onboarding
const NovaOnboardingPage = lazy(() => import('../pages/nova/NovaOnboardingPage'));

// Sphere Pages (main app)
const SpherePage = lazy(() => 
  import('../pages/spheres/SpherePage').then(m => ({ default: m.SpherePage }))
);

// Bureau Section Pages
const DashboardSection = lazy(() => import('../pages/bureau/DashboardSection'));
const NotesSection = lazy(() => import('../pages/bureau/NotesSection'));
const TasksSection = lazy(() => import('../pages/bureau/TasksSection'));
const ProjectsSection = lazy(() => import('../pages/bureau/ProjectsSection'));
const ThreadsSection = lazy(() => import('../pages/bureau/ThreadsSection'));
const MeetingsSection = lazy(() => import('../pages/bureau/MeetingsSection'));

// Settings & Other Pages
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Overview (Centre de Commandement)
const OverviewPage = lazy(() => import('../pages/OverviewPage'));

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #D8B26A, #3EB4A2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      animation: 'pulse 2s ease-in-out infinite'
    }}>
      <span style={{ fontSize: '24px', fontWeight: 700 }}>C·N</span>
    </div>
    <p style={{ color: '#666', fontSize: '14px' }}>Loading CHE·NU...</p>
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROTECTED ROUTE WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // TODO: Implement actual auth check with useAuth hook
  const isAuthenticated = true; // Replace with actual auth state
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE CONTENT WRAPPER (Renders the correct section)
// ═══════════════════════════════════════════════════════════════════════════════

interface SphereContentProps {
  sphereId: string;
}

const SphereContent: React.FC<SphereContentProps> = ({ sphereId }) => {
  return (
    <Suspense fallback={<SectionLoadingFallback />}>
      <Outlet />
    </Suspense>
  );
};

const SectionLoadingFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666',
  }}>
    Chargement...
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SECTION PAGES (Fallback components)
// ═══════════════════════════════════════════════════════════════════════════════

const DefaultDashboard: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>📊 Dashboard</h2>
    <p style={{ color: '#8D8371' }}>Tableau de bord de la sphère</p>
  </div>
);

const DefaultNotes: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>📝 Notes</h2>
    <p style={{ color: '#8D8371' }}>Vos notes et références</p>
  </div>
);

const DefaultTasks: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>✅ Tasks</h2>
    <p style={{ color: '#8D8371' }}>Vos tâches à accomplir</p>
  </div>
);

const DefaultProjects: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>📁 Projects</h2>
    <p style={{ color: '#8D8371' }}>Vos projets organisés</p>
  </div>
);

const DefaultThreads: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>💬 Threads (.chenu)</h2>
    <p style={{ color: '#8D8371' }}>Vos fils de discussion persistants</p>
  </div>
);

const DefaultMeetings: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>📅 Meetings</h2>
    <p style={{ color: '#8D8371' }}>Vos réunions et rendez-vous</p>
  </div>
);

const DefaultOverview: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>🏝️ Centre de Commandement</h2>
    <p style={{ color: '#8D8371', marginBottom: 24 }}>
      Bienvenue dans CHE·NU. Sélectionnez une sphère pour commencer.
    </p>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: 16,
      maxWidth: 800,
    }}>
      {[
        { emoji: '🏠', name: 'Personal', color: '#3EB4A2' },
        { emoji: '💼', name: 'Business', color: '#D8B26A' },
        { emoji: '🏛️', name: 'Government', color: '#8D8371' },
        { emoji: '🎨', name: 'Studio', color: '#E07B53' },
        { emoji: '👥', name: 'Community', color: '#3F7249' },
        { emoji: '📱', name: 'Social', color: '#5B8DEE' },
        { emoji: '🎬', name: 'Entertainment', color: '#9B59B6' },
        { emoji: '🤝', name: 'Team', color: '#7A593A' },
        { emoji: '📚', name: 'Scholar', color: '#2F4C39' },
      ].map(sphere => (
        <div
          key={sphere.name}
          style={{
            padding: 16,
            backgroundColor: `${sphere.color}10`,
            border: `1px solid ${sphere.color}40`,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 32 }}>{sphere.emoji}</span>
          <p style={{ color: sphere.color, marginTop: 8, fontSize: 14 }}>{sphere.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const DefaultSettings: React.FC = () => (
  <div style={{ padding: 24, color: '#E9E4D6' }}>
    <h2>⚙️ Paramètres</h2>
    <p style={{ color: '#8D8371' }}>Configuration de votre compte CHE·NU</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION ROUTES HELPER
// ═══════════════════════════════════════════════════════════════════════════════

const SectionRoutes: React.FC = () => (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DefaultDashboard />} />
    <Route path="notes" element={<DefaultNotes />} />
    <Route path="tasks" element={<DefaultTasks />} />
    <Route path="projects" element={<DefaultProjects />} />
    <Route path="threads" element={<DefaultThreads />} />
    <Route path="meetings" element={<DefaultMeetings />} />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

export const MainRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* ═══════════════════════════════════════════════════════════════════
              PUBLIC ROUTES (No Auth Required)
              ═══════════════════════════════════════════════════════════════════ */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/nova-onboarding" element={<NovaOnboardingPage />} />

          {/* ═══════════════════════════════════════════════════════════════════
              PROTECTED ROUTES (Auth Required) — Wrapped in MainLayout
              ═══════════════════════════════════════════════════════════════════ */}
          <Route
            element={
              <ProtectedRoute>
                <SphereProvider>
                  <MainLayout />
                </SphereProvider>
              </ProtectedRoute>
            }
          >
            {/* Overview / Centre de Commandement */}
            <Route path="/" element={<DefaultOverview />} />
            <Route path="/overview" element={<DefaultOverview />} />

            {/* ═══════════════════════════════════════════════════════════════
                9 SPHÈRES (ARCHITECTURE GELÉE)
                Chaque sphère a 6 sections bureau
                ═══════════════════════════════════════════════════════════════ */}
            
            {/* 🏠 PERSONAL SPHERE */}
            <Route path="/personal">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 💼 BUSINESS SPHERE */}
            <Route path="/business">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 🏛️ GOVERNMENT SPHERE */}
            <Route path="/government">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 🎨 STUDIO (Creative Studio) SPHERE */}
            <Route path="/studio">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 👥 COMMUNITY SPHERE */}
            <Route path="/community">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 📱 SOCIAL & MEDIA SPHERE */}
            <Route path="/social">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 🎬 ENTERTAINMENT SPHERE */}
            <Route path="/entertainment">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 🤝 MY TEAM SPHERE (includes IA Labs & Skills) */}
            <Route path="/team">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* 📚 SCHOLAR SPHERE */}
            <Route path="/scholar">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DefaultDashboard />} />
              <Route path="notes" element={<DefaultNotes />} />
              <Route path="tasks" element={<DefaultTasks />} />
              <Route path="projects" element={<DefaultProjects />} />
              <Route path="threads" element={<DefaultThreads />} />
              <Route path="meetings" element={<DefaultMeetings />} />
            </Route>

            {/* ═══════════════════════════════════════════════════════════════
                SETTINGS & UTILITIES
                ═══════════════════════════════════════════════════════════════ */}
            <Route path="/settings" element={<DefaultSettings />} />
            <Route path="/settings/:tab" element={<DefaultSettings />} />
          </Route>

          {/* ═══════════════════════════════════════════════════════════════════
              404 FALLBACK
              ═══════════════════════════════════════════════════════════════════ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default MainRouter;
