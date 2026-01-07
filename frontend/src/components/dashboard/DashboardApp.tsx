/**
 * CHE·NU Dashboard App
 * Standalone entry point for dashboard
 */

import React from 'react';
import { Dashboard } from './Dashboard';
import { UIMode } from './types';

interface DashboardAppProps {
  mode?: UIMode;
  basePath?: string;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({ 
  mode = 'dark_strict',
  basePath = '/dashboard',
}) => {
  // Parse route from URL if in browser
  const getInitialRoute = () => {
    if (typeof window === 'undefined') return 'home';
    
    const path = window.location.pathname;
    if (path.includes('/datasets')) return 'datasets';
    if (path.includes('/relations')) return 'relations';
    if (path.includes('/quality')) return 'quality';
    if (path.includes('/changes')) return 'changes';
    if (path.includes('/export')) return 'export';
    return 'home';
  };

  return (
    <Dashboard 
      initialRoute={getInitialRoute() as any}
      uiMode={mode}
    />
  );
};

export default DashboardApp;
