/**
 * CHE·NU™ - COMPLETE APPLICATION ROUTER
 * Routes for all 8 spheres × 10 bureau sections = 80 routes
 * Plus auth, settings, and special pages
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { SphereId, BureauSectionId, getSphereIds, BUREAU_SECTIONS } from '../config/spheres.config';

// ═══════════════════════════════════════════════════════════════
// LAZY LOADED PAGES
// ═══════════════════════════════════════════════════════════════

// Auth Pages
const LoginPage = lazy(() => import('./auth/LoginPage'));
const RegisterPage = lazy(() => import('./auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./auth/ForgotPasswordPage'));

// Bureau Section Pages
const DashboardSection = lazy(() => import('../components/bureau/DashboardSection').then(m => ({ default: m.DashboardSection })));
const NotesSection = lazy(() => import('../components/bureau/NotesSection').then(m => ({ default: m.NotesSection })));
const TasksSection = lazy(() => import('../components/bureau/TasksSection').then(m => ({ default: m.TasksSection })));
const ProjectsSection = lazy(() => import('../components/bureau/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const ThreadsSection = lazy(() => import('../components/bureau/ThreadsSection').then(m => ({ default: m.ThreadsSection })));
const MeetingsSection = lazy(() => import('../components/bureau/MeetingsSection').then(m => ({ default: m.MeetingsSection })));
const DataSection = lazy(() => import('../components/bureau/DataSection').then(m => ({ default: m.DataSection })));
const AgentsSection = lazy(() => import('../components/bureau/AgentsSection').then(m => ({ default: m.AgentsSection })));
const ReportsSection = lazy(() => import('../components/bureau/ReportsSection').then(m => ({ default: m.ReportsSection })));
const BudgetGovernanceSection = lazy(() => import('../components/bureau/BudgetGovernanceSection').then(m => ({ default: m.BudgetGovernanceSection })));

// Settings Pages
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const ProfilePage = lazy(() => import('./settings/ProfilePage'));

// Other Pages
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// ═══════════════════════════════════════════════════════════════
// LOADING COMPONENT
// ═══════════════════════════════════════════════════════════════

const LoadingScreen: React.FC = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <h1 className="loading-logo">CHE<span>·NU</span></h1>
      <div className="loading-spinner" />
      <p className="loading-text">Loading...</p>
    </div>
    <style>{`
      .loading-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #0a0a0a;
      }
      .loading-content {
        text-align: center;
      }
      .loading-logo {
        font-size: 32px;
        font-weight: 700;
        color: #D8B26A;
        margin-bottom: 24px;
      }
      .loading-logo span {
        color: #8D8371;
        font-weight: 300;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(216, 178, 106, 0.2);
        border-top-color: #D8B26A;
        border-radius: 50%;
        margin: 0 auto 16px;
        animation: spin 1s linear infinite;
      }
      .loading-text {
        color: #666;
        font-size: 14px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SECTION ROUTE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface SectionRouteProps {
  sphereId: SphereId;
  sectionId: BureauSectionId;
}

const SectionRoute: React.FC<SectionRouteProps> = ({ sphereId, sectionId }) => {
  const sectionComponents: Record<BureauSectionId, React.ReactNode> = {
    dashboard: <DashboardSection sphereId={sphereId} />,
    notes: <NotesSection sphereId={sphereId} />,
    tasks: <TasksSection sphereId={sphereId} />,
    projects: <ProjectsSection sphereId={sphereId} />,
    threads: <ThreadsSection sphereId={sphereId} />,
    meetings: <MeetingsSection sphereId={sphereId} />,
    data: <DataSection sphereId={sphereId} />,
    agents: <AgentsSection sphereId={sphereId} />,
    reports: <ReportsSection sphereId={sphereId} />,
    budget: <BudgetGovernanceSection sphereId={sphereId} />,
  };

  return <>{sectionComponents[sectionId]}</>;
};

// ═══════════════════════════════════════════════════════════════
// GENERATE SPHERE ROUTES
// ═══════════════════════════════════════════════════════════════

const generateSphereRoutes = () => {
  const sphereIds = getSphereIds();
  const sectionIds = BUREAU_SECTIONS.map(s => s.id);
  const routes: React.ReactElement[] = [];

  sphereIds.forEach((sphereId) => {
    // Sphere root -> redirect to dashboard
    routes.push(
      <Route
        key={`${sphereId}-root`}
        path={`/${sphereId}`}
        element={<Navigate to={`/${sphereId}/dashboard`} replace />}
      />
    );

    // Sphere section routes
    sectionIds.forEach((sectionId) => {
      routes.push(
        <Route
          key={`${sphereId}-${sectionId}`}
          path={`/${sphereId}/${sectionId}`}
          element={<SectionRoute sphereId={sphereId} sectionId={sectionId} />}
        />
      );
    });
  });

  return routes;
};

// ═══════════════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════════════

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Auth Routes (no shell) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Main App Routes (with shell) */}
          <Route path="/" element={<AppShell />}>
            {/* Root redirect */}
            <Route index element={<Navigate to="/personal/dashboard" replace />} />

            {/* All Sphere Routes (8 spheres × 10 sections) */}
            {generateSphereRoutes()}

            {/* Settings Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/appearance" element={<SettingsPage />} />
            <Route path="/settings/notifications" element={<SettingsPage />} />
            <Route path="/settings/security" element={<SettingsPage />} />
            <Route path="/settings/billing" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROUTE HELPERS
// ═══════════════════════════════════════════════════════════════

export const getRouteForSphere = (sphereId: SphereId, sectionId?: BureauSectionId): string => {
  return `/${sphereId}/${sectionId || 'dashboard'}`;
};

export const parseRoute = (pathname: string): { sphereId?: SphereId; sectionId?: BureauSectionId } => {
  const parts = pathname.split('/').filter(Boolean);
  return {
    sphereId: parts[0] as SphereId | undefined,
    sectionId: parts[1] as BureauSectionId | undefined,
  };
};

export default AppRouter;
