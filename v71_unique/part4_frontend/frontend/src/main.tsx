/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ V51 — MAIN ENTRY POINT
 * ═══════════════════════════════════════════════════════════════════════════
 * Governed Intelligence Operating System
 * Clarté > Fonctionnalités | Gouvernance > Exécution
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppCanonical } from './components/AppCanonical';
import './styles/global.css';

// Get user ID from session or generate temporary
const getUserId = (): string => {
  const stored = localStorage.getItem('chenu_user_id');
  if (stored) return stored;
  
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('chenu_user_id', newId);
  return newId;
};

// Get language preference
const getLanguage = (): 'en' | 'fr' => {
  const stored = localStorage.getItem('chenu_language');
  if (stored === 'en' || stored === 'fr') return stored;
  
  // Detect from browser
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('fr') ? 'fr' : 'en';
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppCanonical 
      userId={getUserId()}
      language={getLanguage()}
    />
  </React.StrictMode>
);
