/**
 * ============================================================
 * CHE·NU — DEMO UI INDEX
 * Exports for all demo UI components
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

// ============================================================
// PAGES
// ============================================================

export { DemoArchitectureUniversePage } from './DemoArchitectureUniversePage';
export { DemoBusinessArchitecturePage } from './DemoBusinessArchitecturePage';
export { DemoDemoSuitePage } from './DemoDemoSuitePage';
export { EncodingDemo } from './EncodingDemo';

// ============================================================
// COMPONENTS
// ============================================================

export { DemoCallouts } from './DemoCallouts';
export { MegaDemoPackUI } from './MegaDemoPackUI';

// ============================================================
// ADAPTER
// ============================================================

export {
  // Types
  type DemoScene,
  type DemoPortal,
  type DemoUniverse,
  type DemoDataSpace,
  type DemoWorkSurface,
  type DemoProcess,
  type DemoTool,
  type DemoArchitectureUniverseResult,
  type DemoBusinessArchitectureResult,
  type DemoRegistryItem,
  
  // Mock Data
  getMockArchitectureUniverseDemo,
  getMockBusinessArchitectureDemo,
  getMockArchitectureWorkspaceDemo,
  
  // Registry
  DEMO_REGISTRY,
  getDemoById,
  getDemosByDomain,
  getDemosBySphere,
} from './demoAdapter';

// ============================================================
// XR COMPONENTS (RE-EXPORT)
// ============================================================

export { XRUniverseMapView } from '../xr/XRUniverseMapView';
export { XRSceneListPanel } from '../xr/XRSceneListPanel';
export { XRSceneCardList } from '../xr/XRSceneCardList';

// ============================================================
// ROUTES
// ============================================================

export const DEMO_ROUTES = {
  suite: '/demo/architecture-suite',
  architectureUniverse: '/demo/architecture-universe',
  businessArchitecture: '/demo/business-architecture',
  architectureWorkspace: '/demo/architecture-workspace',
  encoding: '/demo/encoding',
} as const;

// ============================================================
// NAVIGATION
// ============================================================

export interface DemoNavItem {
  id: string;
  name: string;
  route: string;
  icon: string;
}

export const DEMO_NAV_ITEMS: DemoNavItem[] = [
  {
    id: 'suite',
    name: 'Architecture Suite',
    route: DEMO_ROUTES.suite,
    icon: '🚀',
  },
  {
    id: 'architecture_universe',
    name: 'Architecture XR Universe',
    route: DEMO_ROUTES.architectureUniverse,
    icon: '🌀',
  },
  {
    id: 'business_architecture',
    name: 'Business + Architecture',
    route: DEMO_ROUTES.businessArchitecture,
    icon: '🏗️',
  },
  {
    id: 'encoding',
    name: 'Semantic Encoding',
    route: DEMO_ROUTES.encoding,
    icon: '📊',
  },
];
