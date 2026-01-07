/**
 * ============================================================
 * CHE·NU — XR ROUTES CONFIGURATION
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from 'react';

// ============================================================
// TYPES
// ============================================================

export interface XRRoute {
  id: string;
  path: string;
  name: string;
  icon: string;
  description: string;
  component: string;
  category: 'main' | 'tools' | 'admin' | 'social';
  requiresVR?: boolean;
  beta?: boolean;
}

export interface XRRouteCategory {
  id: string;
  name: string;
  icon: string;
  routes: XRRoute[];
}

// ============================================================
// ROUTES
// ============================================================

export const XR_ROUTES: XRRoute[] = [
  // Main Routes
  {
    id: 'xr-dashboard',
    path: '/xr',
    name: 'XR Dashboard',
    icon: '🌐',
    description: 'XR system overview and quick access',
    component: 'XRDashboardPage',
    category: 'main',
  },
  {
    id: 'xr-scenes',
    path: '/xr/scenes',
    name: 'Scene Browser',
    icon: '🎬',
    description: 'Browse and enter XR scenes',
    component: 'XRSceneBrowserPage',
    category: 'main',
  },
  {
    id: 'xr-avatar',
    path: '/xr/avatar',
    name: 'Avatar Designer',
    icon: '👤',
    description: 'Customize your XR avatar',
    component: 'XRAvatarDesignerPage',
    category: 'main',
  },
  {
    id: 'xr-settings',
    path: '/xr/settings',
    name: 'XR Settings',
    icon: '⚙️',
    description: 'Configure XR experience settings',
    component: 'XRSettingsPage',
    category: 'main',
  },

  // Tools Routes
  {
    id: 'xr-world-builder',
    path: '/xr/builder',
    name: 'World Builder',
    icon: '🔧',
    description: 'Create and edit XR scenes',
    component: 'XRWorldBuilderPage',
    category: 'tools',
    beta: true,
  },
  {
    id: 'xr-portals',
    path: '/xr/portals',
    name: 'Portal Manager',
    icon: '🌀',
    description: 'Manage navigation portals',
    component: 'XRPortalManagerPage',
    category: 'tools',
  },
  {
    id: 'xr-spatial',
    path: '/xr/spatial',
    name: 'Spatial Map',
    icon: '🗺️',
    description: 'View and edit spatial layout',
    component: 'XRSpatialMapPage',
    category: 'tools',
  },
  {
    id: 'xr-interactions',
    path: '/xr/interactions',
    name: 'Interactions',
    icon: '🎮',
    description: 'Configure gestures and controls',
    component: 'XRInteractionsPage',
    category: 'tools',
  },

  // Social Routes
  {
    id: 'xr-meeting',
    path: '/xr/meeting',
    name: 'Meeting Room',
    icon: '👥',
    description: 'Join or host XR meetings',
    component: 'XRMeetingRoomPage',
    category: 'social',
  },
  {
    id: 'xr-gallery',
    path: '/xr/gallery',
    name: 'Gallery',
    icon: '🖼️',
    description: 'View shared XR content',
    component: 'XRGalleryPage',
    category: 'social',
  },
  {
    id: 'xr-events',
    path: '/xr/events',
    name: 'Events',
    icon: '📅',
    description: 'Upcoming XR events',
    component: 'XREventsPage',
    category: 'social',
  },

  // Admin Routes
  {
    id: 'xr-analytics',
    path: '/xr/admin/analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'XR usage analytics',
    component: 'XRAnalyticsPage',
    category: 'admin',
  },
  {
    id: 'xr-devices',
    path: '/xr/admin/devices',
    name: 'Devices',
    icon: '🥽',
    description: 'Manage connected devices',
    component: 'XRDevicesPage',
    category: 'admin',
  },
];

// ============================================================
// CATEGORIES
// ============================================================

export const XR_ROUTE_CATEGORIES: XRRouteCategory[] = [
  {
    id: 'main',
    name: 'Main',
    icon: '🏠',
    routes: XR_ROUTES.filter(r => r.category === 'main'),
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: '🛠️',
    routes: XR_ROUTES.filter(r => r.category === 'tools'),
  },
  {
    id: 'social',
    name: 'Social',
    icon: '👥',
    routes: XR_ROUTES.filter(r => r.category === 'social'),
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: '🔐',
    routes: XR_ROUTES.filter(r => r.category === 'admin'),
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getXRRouteById(id: string): XRRoute | undefined {
  return XR_ROUTES.find(r => r.id === id);
}

export function getXRRouteByPath(path: string): XRRoute | undefined {
  return XR_ROUTES.find(r => r.path === path);
}

export function getXRRoutesByCategory(category: string): XRRoute[] {
  return XR_ROUTES.filter(r => r.category === category);
}

export function getMainXRRoutes(): XRRoute[] {
  return XR_ROUTES.filter(r => r.category === 'main');
}

export function getBetaXRRoutes(): XRRoute[] {
  return XR_ROUTES.filter(r => r.beta);
}

export function getVRRequiredRoutes(): XRRoute[] {
  return XR_ROUTES.filter(r => r.requiresVR);
}

// ============================================================
// BREADCRUMBS
// ============================================================

export interface XRBreadcrumb {
  name: string;
  path: string;
  icon?: string;
}

export function getXRBreadcrumbs(currentPath: string): XRBreadcrumb[] {
  const breadcrumbs: XRBreadcrumb[] = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'XR', path: '/xr', icon: '🌐' },
  ];

  const route = getXRRouteByPath(currentPath);
  if (route && route.path !== '/xr') {
    breadcrumbs.push({
      name: route.name,
      path: route.path,
      icon: route.icon,
    });
  }

  return breadcrumbs;
}

// ============================================================
// NAVIGATION
// ============================================================

export interface XRNavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  badge?: string | number;
  active?: boolean;
  children?: XRNavItem[];
}

export function buildXRNavigation(currentPath: string): XRNavItem[] {
  return XR_ROUTE_CATEGORIES.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    path: '',
    children: category.routes.map(route => ({
      id: route.id,
      name: route.name,
      icon: route.icon,
      path: route.path,
      badge: route.beta ? 'BETA' : undefined,
      active: route.path === currentPath,
    })),
  }));
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  routes: XR_ROUTES,
  categories: XR_ROUTE_CATEGORIES,
  getRouteById: getXRRouteById,
  getRouteByPath: getXRRouteByPath,
  getRoutesByCategory: getXRRoutesByCategory,
  getMainRoutes: getMainXRRoutes,
  getBetaRoutes: getBetaXRRoutes,
  getBreadcrumbs: getXRBreadcrumbs,
  buildNavigation: buildXRNavigation,
};
