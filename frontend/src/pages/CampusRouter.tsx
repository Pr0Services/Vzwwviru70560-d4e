// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — CAMPUS ROUTER
// Routes pour la navigation Campus Map → Sphere → Bureau Section
// ═══════════════════════════════════════════════════════════════════════════════

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Loading Component
const LoadingScreen: React.FC = () => (
  <div style={loadingStyles.container}>
    <div style={loadingStyles.spinner} />
    <p style={loadingStyles.text}>Chargement...</p>
  </div>
);

const loadingStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#030508',
    color: '#E9E4D6',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(216, 178, 106, 0.2)',
    borderTopColor: '#D8B26A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    marginTop: 15,
    fontSize: '0.85rem',
    color: '#8D8371',
  },
};

// Lazy load pages for better performance
const CeibaMapView360 = lazy(() => import('../components/navigation/CeibaMapView360'));
const SphereView = lazy(() => import('../components/spheres/views/SphereView'));
const NovaPage = lazy(() => import('./NovaPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// ═══════════════════════════════════════════════════════════════════════════════
// CAMPUS ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

const CampusRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* ═══════════════════════════════════════════════════════════════════
            ROOT REDIRECT
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/" element={<Navigate to="/map" replace />} />

        {/* ═══════════════════════════════════════════════════════════════════
            CAMPUS MAP (360° View)
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/map" element={<CeibaMapView360 />} />

        {/* ═══════════════════════════════════════════════════════════════════
            SPHERE ROUTES
            /sphere/:sphereId - Vue du bureau de la sphère
            /sphere/:sphereId/:sectionId - Section spécifique du bureau
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/sphere/:sphereId" element={<SphereView />} />
        <Route path="/sphere/:sphereId/:sectionId" element={<SphereView />} />

        {/* ═══════════════════════════════════════════════════════════════════
            NOVA (Central Intelligence)
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/nova" element={<NovaPage />} />

        {/* ═══════════════════════════════════════════════════════════════════
            SETTINGS
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/settings/*" element={<SettingsPage />} />

        {/* ═══════════════════════════════════════════════════════════════════
            404 NOT FOUND
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default CampusRouter;

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const ROUTES = {
  map: '/map',
  nova: '/nova',
  settings: '/settings',
  
  // Sphere routes
  sphere: (sphereId: string) => `/sphere/${sphereId}`,
  sphereSection: (sphereId: string, sectionId: string) => `/sphere/${sphereId}/${sectionId}`,
  
  // Specific spheres
  personal: '/sphere/personal',
  business: '/sphere/business',
  government: '/sphere/government',
  studio: '/sphere/studio',
  community: '/sphere/community',
  social: '/sphere/social',
  entertainment: '/sphere/entertainment',
  team: '/sphere/team',
  scholar: '/sphere/scholar',
};
