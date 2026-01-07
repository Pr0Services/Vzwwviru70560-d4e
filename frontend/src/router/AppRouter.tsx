/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — APP ROUTER v35 (CORRECTED)
   Governed Intelligence Operating System
   
   CORRECTIONS APPLIED:
   1. All imports use '../pages/' instead of './pages/'
   2. CreativePage → CreativeStudioPage (correct filename)
   3. Obsolete routes /scholar and /ia-lab redirect to correct spheres
   4. 8 SPHERES ONLY (FROZEN)
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ════════════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ════════════════════════════════════════════════════════════════════════════════

const LoadingFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#0c0a09',
    color: '#D8B26A',
    fontSize: '1.2rem',
    fontFamily: 'system-ui, sans-serif',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✧</div>
      <div>Chargement...</div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════
// LAZY LOADED PAGES - 8 SPHERES (FROZEN ARCHITECTURE)
// ════════════════════════════════════════════════════════════════════════════════

// ✅ CORRECTED: Use '../pages/' not './pages/'
// ✅ CORRECTED: CreativeStudioPage not CreativePage

// 1. 🏠 Personal
const PersonalPage = lazy(() => import('../pages/spaces/MaisonPage'));

// 2. 💼 Business
const BusinessPage = lazy(() => import('../pages/spaces/EntreprisePage'));

// 3. 🏛️ Government & Institutions
const GovernmentPage = lazy(() => import('../pages/spaces/GouvernementPage'));

// 4. 🎨 Creative Studio (Studio de création)
const CreativeStudioPage = lazy(() => import('../pages/spaces/CreativeStudioPage'));

// 5. 👥 Community
const CommunityPage = lazy(() => import('../pages/spaces/AssociationsPage'));

// 6. 📱 Social & Media
const SocialPage = lazy(() => import('../pages/modules/SocialPage'));

// 7. 🎬 Entertainment
const EntertainmentPage = lazy(() => import('../pages/spaces/EntertainmentPage'));

// 8. 🤝 My Team (includes IA Labs + Skills & Tools)
const MyTeamPage = lazy(() => import('../pages/spaces/ProjetsPage'));

// ════════════════════════════════════════════════════════════════════════════════
// OTHER PAGES
// ════════════════════════════════════════════════════════════════════════════════

const HomePage = lazy(() => import('../pages/HomePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const XRImmersivePage = lazy(() => import('../pages/XRImmersivePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ════════════════════════════════════════════════════════════════════════════════
// SCREENS (4-STATE NAVIGATION)
// ════════════════════════════════════════════════════════════════════════════════

const EntryScreen = lazy(() => import('../screens/EntryScreen'));
const ContextBureauScreen = lazy(() => import('../screens/ContextBureauScreen'));
const ActionBureauScreen = lazy(() => import('../screens/ActionBureauScreen'));
const WorkspaceScreen = lazy(() => import('../screens/WorkspaceScreen'));

// ════════════════════════════════════════════════════════════════════════════════
// APP ROUTER COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ═══════════════════════════════════════════════════════════════════
            HOME & ENTRY
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/entry" element={<EntryScreen />} />
        <Route path="/welcome" element={<Navigate to="/entry" replace />} />

        {/* ═══════════════════════════════════════════════════════════════════
            4-STATE NAVIGATION SCREENS
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/context" element={<ContextBureauScreen />} />
        <Route path="/action" element={<ActionBureauScreen />} />
        <Route path="/workspace" element={<WorkspaceScreen />} />
        <Route path="/workspace/:workspaceId" element={<WorkspaceScreen />} />

        {/* ═══════════════════════════════════════════════════════════════════
            8 SPHERES — FROZEN ARCHITECTURE
            ═══════════════════════════════════════════════════════════════════ */}
        
        {/* 1. 🏠 Personal */}
        <Route path="/personal/*" element={<PersonalPage />} />
        <Route path="/maison/*" element={<Navigate to="/personal" replace />} />
        
        {/* 2. 💼 Business */}
        <Route path="/business/*" element={<BusinessPage />} />
        <Route path="/entreprise/*" element={<Navigate to="/business" replace />} />
        
        {/* 3. 🏛️ Government & Institutions */}
        <Route path="/government/*" element={<GovernmentPage />} />
        <Route path="/gouvernement/*" element={<Navigate to="/government" replace />} />
        <Route path="/institutions/*" element={<Navigate to="/government" replace />} />
        
        {/* 4. 🎨 Creative Studio (Studio de création) */}
        <Route path="/creative/*" element={<CreativeStudioPage />} />
        <Route path="/studio/*" element={<Navigate to="/creative" replace />} />
        
        {/* 5. 👥 Community */}
        <Route path="/community/*" element={<CommunityPage />} />
        <Route path="/associations/*" element={<Navigate to="/community" replace />} />
        
        {/* 6. 📱 Social & Media */}
        <Route path="/social/*" element={<SocialPage />} />
        <Route path="/media/*" element={<Navigate to="/social" replace />} />
        
        {/* 7. 🎬 Entertainment */}
        <Route path="/entertainment/*" element={<EntertainmentPage />} />
        <Route path="/divertissement/*" element={<Navigate to="/entertainment" replace />} />
        
        {/* 8. 🤝 My Team (includes IA Labs + Skills & Tools) */}
        <Route path="/team/*" element={<MyTeamPage />} />
        <Route path="/myteam/*" element={<Navigate to="/team" replace />} />
        <Route path="/projets/*" element={<Navigate to="/team" replace />} />

        {/* ═══════════════════════════════════════════════════════════════════
            OBSOLETE ROUTES — REDIRECT TO CORRECT SPHERES
            Scholar → Creative Studio
            IA-Lab → My Team
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/scholar/*" element={<Navigate to="/creative" replace />} />
        <Route path="/ia-lab/*" element={<Navigate to="/team" replace />} />
        <Route path="/skills/*" element={<Navigate to="/team" replace />} />

        {/* ═══════════════════════════════════════════════════════════════════
            XR / IMMERSIVE
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/xr/*" element={<XRImmersivePage />} />
        <Route path="/immersive/*" element={<Navigate to="/xr" replace />} />

        {/* ═══════════════════════════════════════════════════════════════════
            SETTINGS & PROFILE
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/profile/*" element={<ProfilePage />} />
        <Route path="/notifications/*" element={<NotificationsPage />} />
        <Route path="/search/*" element={<SearchPage />} />

        {/* ═══════════════════════════════════════════════════════════════════
            404 CATCH-ALL
            ═══════════════════════════════════════════════════════════════════ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

// ════════════════════════════════════════════════════════════════════════════════
// ROUTE HELPERS
// ════════════════════════════════════════════════════════════════════════════════

export type SphereRoute = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'creative' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team';

export const SPHERE_ROUTES: Record<SphereRoute, { path: string; name: string; icon: string }> = {
  personal: { path: '/personal', name: 'Personal', icon: '🏠' },
  business: { path: '/business', name: 'Business', icon: '💼' },
  government: { path: '/government', name: 'Government', icon: '🏛️' },
  creative: { path: '/creative', name: 'Creative Studio', icon: '🎨' },
  community: { path: '/community', name: 'Community', icon: '👥' },
  social: { path: '/social', name: 'Social & Media', icon: '📱' },
  entertainment: { path: '/entertainment', name: 'Entertainment', icon: '🎬' },
  team: { path: '/team', name: 'My Team', icon: '🤝' },
};

export const getSphereRoute = (sphereId: SphereRoute): string => {
  return SPHERE_ROUTES[sphereId]?.path ?? '/';
};
