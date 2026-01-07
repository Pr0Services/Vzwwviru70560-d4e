/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NAVIGATION ROUTER                               ║
 * ║                    Système de Navigation Universel                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Ce système gère TOUS les chemins de navigation dans CHE·NU:
 * - Universe ↔ Sphere ↔ Bureau ↔ Section
 * - Map ↔ Territory
 * - Nova (accessible partout)
 * - Chemins cross-sphères
 * 
 * RÈGLE: Tous les chemins doivent se rendre à destination
 * 
 * @version 51.0
 */

import {
  SphereId,
  BureauSectionId,
  ViewType,
  NavigationState,
  NavigationHistoryEntry,
  SPHERE_IDS,
  ALL_BUREAU_SECTIONS,
  getSphereConfig,
  getSectionConfig,
  isValidSphereId,
  isValidSectionId,
} from '../types/spheres.types';

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration d'une route
 */
export interface RouteConfig {
  path: string;
  view: ViewType;
  sphere?: SphereId;
  section?: BureauSectionId;
  title: string;
  titleFr: string;
  breadcrumbs: Breadcrumb[];
  permissions?: string[];
}

/**
 * Breadcrumb pour la navigation
 */
export interface Breadcrumb {
  label: string;
  labelFr: string;
  path: string;
  icon?: string;
}

/**
 * Paramètres de navigation
 */
export interface NavigationParams {
  view: ViewType;
  sphere?: SphereId;
  section?: BureauSectionId;
  params?: Record<string, string>;
}

/**
 * Résultat de navigation
 */
export interface NavigationResult {
  success: boolean;
  route: RouteConfig | null;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Routes de base
 */
export const BASE_ROUTES: Record<string, RouteConfig> = {
  // Universe view
  '/': {
    path: '/',
    view: 'universe',
    title: 'Universe',
    titleFr: 'Univers',
    breadcrumbs: [
      { label: 'Universe', labelFr: 'Univers', path: '/', icon: '🌌' },
    ],
  },
  '/universe': {
    path: '/universe',
    view: 'universe',
    title: 'Universe',
    titleFr: 'Univers',
    breadcrumbs: [
      { label: 'Universe', labelFr: 'Univers', path: '/universe', icon: '🌌' },
    ],
  },
  // Map view
  '/map': {
    path: '/map',
    view: 'map',
    title: 'Map',
    titleFr: 'Carte',
    breadcrumbs: [
      { label: 'Universe', labelFr: 'Univers', path: '/', icon: '🌌' },
      { label: 'Map', labelFr: 'Carte', path: '/map', icon: '🗺️' },
    ],
  },
  // Nova
  '/nova': {
    path: '/nova',
    view: 'nova',
    title: 'Nova',
    titleFr: 'Nova',
    breadcrumbs: [
      { label: 'Nova', labelFr: 'Nova', path: '/nova', icon: '✨' },
    ],
  },
};

/**
 * Génère les routes pour toutes les sphères et sections
 */
export function generateSphereRoutes(): Record<string, RouteConfig> {
  const routes: Record<string, RouteConfig> = {};

  // Pour chaque sphère
  for (const sphereId of SPHERE_IDS) {
    const sphereConfig = getSphereConfig(sphereId);
    const spherePath = `/sphere/${sphereId}`;

    // Route de la sphère (bureau)
    routes[spherePath] = {
      path: spherePath,
      view: 'sphere',
      sphere: sphereId,
      title: sphereConfig.name,
      titleFr: sphereConfig.nameFr,
      breadcrumbs: [
        { label: 'Universe', labelFr: 'Univers', path: '/', icon: '🌌' },
        { label: sphereConfig.name, labelFr: sphereConfig.nameFr, path: spherePath, icon: sphereConfig.icon },
      ],
    };

    // Pour chaque section du bureau
    for (const sectionId of ALL_BUREAU_SECTIONS) {
      const sectionConfig = getSectionConfig(sectionId);
      const sectionPath = `${spherePath}/${sectionId}`;

      routes[sectionPath] = {
        path: sectionPath,
        view: 'section',
        sphere: sphereId,
        section: sectionId,
        title: `${sphereConfig.name} - ${sectionConfig.name}`,
        titleFr: `${sphereConfig.nameFr} - ${sectionConfig.nameFr}`,
        breadcrumbs: [
          { label: 'Universe', labelFr: 'Univers', path: '/', icon: '🌌' },
          { label: sphereConfig.name, labelFr: sphereConfig.nameFr, path: spherePath, icon: sphereConfig.icon },
          { label: sectionConfig.name, labelFr: sectionConfig.nameFr, path: sectionPath, icon: sectionConfig.icon },
        ],
      };
    }
  }

  return routes;
}

/**
 * Toutes les routes combinées
 */
export const ALL_ROUTES: Record<string, RouteConfig> = {
  ...BASE_ROUTES,
  ...generateSphereRoutes(),
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * État initial de navigation
 */
export const initialNavigationState: NavigationState = {
  currentView: 'universe',
  activeSphere: null,
  activeSection: null,
  previousView: null,
  history: [],
};

/**
 * Actions de navigation
 */
export type NavigationAction =
  | { type: 'NAVIGATE_TO_UNIVERSE' }
  | { type: 'NAVIGATE_TO_MAP' }
  | { type: 'NAVIGATE_TO_SPHERE'; payload: SphereId }
  | { type: 'NAVIGATE_TO_SECTION'; payload: { sphere: SphereId; section: BureauSectionId } }
  | { type: 'OPEN_NOVA' }
  | { type: 'CLOSE_NOVA' }
  | { type: 'GO_BACK' }
  | { type: 'GO_FORWARD' }
  | { type: 'RESET_NAVIGATION' };

/**
 * Reducer de navigation
 */
export function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  const timestamp = new Date().toISOString();

  switch (action.type) {
    case 'NAVIGATE_TO_UNIVERSE': {
      const entry: NavigationHistoryEntry = {
        view: 'universe',
        sphere: null,
        section: null,
        timestamp,
      };
      return {
        ...state,
        currentView: 'universe',
        activeSphere: null,
        activeSection: null,
        previousView: state.currentView,
        history: [...state.history, entry],
      };
    }

    case 'NAVIGATE_TO_MAP': {
      const entry: NavigationHistoryEntry = {
        view: 'map',
        sphere: null,
        section: null,
        timestamp,
      };
      return {
        ...state,
        currentView: 'map',
        activeSphere: null,
        activeSection: null,
        previousView: state.currentView,
        history: [...state.history, entry],
      };
    }

    case 'NAVIGATE_TO_SPHERE': {
      const entry: NavigationHistoryEntry = {
        view: 'sphere',
        sphere: action.payload,
        section: null,
        timestamp,
      };
      return {
        ...state,
        currentView: 'sphere',
        activeSphere: action.payload,
        activeSection: null,
        previousView: state.currentView,
        history: [...state.history, entry],
      };
    }

    case 'NAVIGATE_TO_SECTION': {
      const entry: NavigationHistoryEntry = {
        view: 'section',
        sphere: action.payload.sphere,
        section: action.payload.section,
        timestamp,
      };
      return {
        ...state,
        currentView: 'section',
        activeSphere: action.payload.sphere,
        activeSection: action.payload.section,
        previousView: state.currentView,
        history: [...state.history, entry],
      };
    }

    case 'OPEN_NOVA': {
      const entry: NavigationHistoryEntry = {
        view: 'nova',
        sphere: state.activeSphere,
        section: state.activeSection,
        timestamp,
      };
      return {
        ...state,
        previousView: state.currentView,
        history: [...state.history, entry],
      };
    }

    case 'CLOSE_NOVA': {
      return {
        ...state,
        // Revenir à la vue précédente
      };
    }

    case 'GO_BACK': {
      if (state.history.length < 2) return state;
      const previousEntry = state.history[state.history.length - 2];
      return {
        ...state,
        currentView: previousEntry.view,
        activeSphere: previousEntry.sphere,
        activeSection: previousEntry.section,
        history: state.history.slice(0, -1),
      };
    }

    case 'RESET_NAVIGATION': {
      return initialNavigationState;
    }

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Résout une route à partir d'un chemin
 */
export function resolveRoute(path: string): RouteConfig | null {
  // Exact match
  if (ALL_ROUTES[path]) {
    return ALL_ROUTES[path];
  }

  // Pattern matching pour les routes dynamiques
  const sphereMatch = path.match(/^\/sphere\/([^/]+)$/);
  if (sphereMatch && isValidSphereId(sphereMatch[1])) {
    return ALL_ROUTES[`/sphere/${sphereMatch[1]}`];
  }

  const sectionMatch = path.match(/^\/sphere\/([^/]+)\/([^/]+)$/);
  if (sectionMatch && isValidSphereId(sectionMatch[1]) && isValidSectionId(sectionMatch[2])) {
    return ALL_ROUTES[`/sphere/${sectionMatch[1]}/${sectionMatch[2]}`];
  }

  return null;
}

/**
 * Génère un chemin de navigation
 */
export function generatePath(params: NavigationParams): string {
  switch (params.view) {
    case 'universe':
      return '/';
    case 'map':
      return '/map';
    case 'nova':
      return '/nova';
    case 'sphere':
      if (!params.sphere) return '/';
      return `/sphere/${params.sphere}`;
    case 'section':
      if (!params.sphere || !params.section) return '/';
      return `/sphere/${params.sphere}/${params.section}`;
    default:
      return '/';
  }
}

/**
 * Vérifie si une navigation est valide
 */
export function isValidNavigation(from: NavigationParams, to: NavigationParams): boolean {
  // Toutes les navigations vers l'univers sont valides
  if (to.view === 'universe') return true;

  // Toutes les navigations vers Nova sont valides
  if (to.view === 'nova') return true;

  // Pour naviguer vers une section, il faut spécifier la sphère
  if (to.view === 'section' && !to.sphere) return false;

  // Valider les IDs
  if (to.sphere && !isValidSphereId(to.sphere)) return false;
  if (to.section && !isValidSectionId(to.section)) return false;

  return true;
}

/**
 * Calcule le chemin le plus court entre deux vues
 */
export function getNavigationPath(from: NavigationParams, to: NavigationParams): NavigationParams[] {
  const path: NavigationParams[] = [];

  // Si on va à l'univers, direct
  if (to.view === 'universe') {
    path.push({ view: 'universe' });
    return path;
  }

  // Si on change de sphère, passer par l'univers (optionnel)
  if (from.sphere !== to.sphere && to.sphere) {
    // path.push({ view: 'universe' }); // Décommenter si transition obligatoire
    path.push({ view: 'sphere', sphere: to.sphere });
  }

  // Si on va à une section
  if (to.view === 'section' && to.sphere && to.section) {
    if (!path.find(p => p.sphere === to.sphere)) {
      path.push({ view: 'sphere', sphere: to.sphere });
    }
    path.push({ view: 'section', sphere: to.sphere, section: to.section });
  }

  return path;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-SPHERE NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Connexions entre sphères (quelles sphères peuvent communiquer directement)
 */
export const SPHERE_CONNECTIONS: Record<SphereId, SphereId[]> = {
  personal: ['business', 'my_team', 'scholars', 'entertainment'],
  business: ['personal', 'government', 'design_studio', 'team'],
  government: ['business', 'community'],
  studio: ['business', 'entertainment', 'social'],
  community: ['personal', 'social', 'government'],
  social: ['community', 'entertainment', 'studio'],
  entertainment: ['personal', 'social', 'studio'],
  team: ['personal', 'business', 'scholar'],
  scholar: ['personal', 'team'],
};

/**
 * Vérifie si deux sphères sont connectées
 */
export function areSpheresConnected(sphere1: SphereId, sphere2: SphereId): boolean {
  return SPHERE_CONNECTIONS[sphere1]?.includes(sphere2) ?? false;
}

/**
 * Trouve le chemin le plus court entre deux sphères
 */
export function findSpherePath(from: SphereId, to: SphereId): SphereId[] {
  if (from === to) return [from];
  if (areSpheresConnected(from, to)) return [from, to];

  // BFS pour trouver le chemin le plus court
  const visited = new Set<SphereId>();
  const queue: { sphere: SphereId; path: SphereId[] }[] = [{ sphere: from, path: [from] }];

  while (queue.length > 0) {
    const { sphere, path } = queue.shift()!;
    
    if (sphere === to) return path;
    
    if (!visited.has(sphere)) {
      visited.add(sphere);
      
      for (const connected of SPHERE_CONNECTIONS[sphere] || []) {
        if (!visited.has(connected)) {
          queue.push({ sphere: connected, path: [...path, connected] });
        }
      }
    }
  }

  // Pas de chemin trouvé (ne devrait pas arriver)
  return [from, to];
}

// ═══════════════════════════════════════════════════════════════════════════════
// URL HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse une URL en paramètres de navigation
 */
export function parseUrl(url: string): NavigationParams {
  const route = resolveRoute(url);
  
  if (!route) {
    return { view: 'universe' };
  }

  return {
    view: route.view,
    sphere: route.sphere,
    section: route.section,
  };
}

/**
 * Génère une URL à partir de paramètres
 */
export function buildUrl(params: NavigationParams): string {
  return generatePath(params);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP LINKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration de deep link
 */
export interface DeepLinkConfig {
  scheme: string;
  host: string;
}

export const DEEP_LINK_CONFIG: DeepLinkConfig = {
  scheme: 'chenu',
  host: 'app.chenu.io',
};

/**
 * Génère un deep link
 */
export function generateDeepLink(params: NavigationParams): string {
  const path = generatePath(params);
  return `${DEEP_LINK_CONFIG.scheme}://${DEEP_LINK_CONFIG.host}${path}`;
}

/**
 * Parse un deep link
 */
export function parseDeepLink(link: string): NavigationParams | null {
  try {
    const url = new URL(link);
    if (url.protocol !== `${DEEP_LINK_CONFIG.scheme}:`) return null;
    return parseUrl(url.pathname);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ALL_ROUTES,
  BASE_ROUTES,
  initialNavigationState,
  navigationReducer,
  resolveRoute,
  generatePath,
  isValidNavigation,
  getNavigationPath,
  SPHERE_CONNECTIONS,
  areSpheresConnected,
  findSpherePath,
  parseUrl,
  buildUrl,
  generateDeepLink,
  parseDeepLink,
};
