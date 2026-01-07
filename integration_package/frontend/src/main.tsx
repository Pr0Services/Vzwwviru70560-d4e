/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V72 — MAIN ENTRY POINT
 * ═══════════════════════════════════════════════════════════════════════════
 * Governed Intelligence Operating System
 * GOUVERNANCE > EXÉCUTION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppV72Enhanced } from './AppV72Enhanced';
import './styles/global.css';

// Initialize auth store with dev bypass if needed
import { useAuthStore } from './stores/auth.store';

// Auto-login for development
const initDevAuth = () => {
  const DEV_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  
  if (DEV_BYPASS) {
    const store = useAuthStore.getState();
    if (!store.isAuthenticated) {
      store.setUser({
        id: 'dev-user-1',
        email: 'jo@chenu.dev',
        username: 'Jo',
        displayName: 'Jo',
        created_at: new Date().toISOString(),
      });
    }
  }
};

initDevAuth();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppV72Enhanced />
  </React.StrictMode>
);
