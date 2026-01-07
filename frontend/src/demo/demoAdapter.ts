/**
 * ============================================================
 * CHE·NU — DEMO ADAPTER
 * Bridge from backend demo to UI
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

// ============================================================
// TYPES
// ============================================================

export interface DemoScene {
  id: string;
  name: string;
  domain: string;
  sphere?: string;
  sectors?: number;
  objects?: number;
  icon?: string;
  description?: string;
}

export interface DemoPortal {
  id: string;
  fromScene: string;
  toScene: string;
  direction?: 'forward' | 'back' | 'left' | 'right';
}

export interface DemoUniverse {
  id: string;
  name: string;
  scenes: DemoScene[];
  portals: DemoPortal[];
}

export interface DemoDataSpace {
  id: string;
  name: string;
  type: string;
  entries: number;
}

export interface DemoWorkSurface {
  id: string;
  profile: string;
  primaryMode: string;
  controlMode: string;
}

export interface DemoProcess {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'pending' | 'complete';
}

export interface DemoTool {
  id: string;
  name: string;
  domain: string;
  active: boolean;
}

export interface DemoArchitectureUniverseResult {
  workspaceId: string;
  workspaceName: string;
  domain: string;
  sphere: string;
  dataspaceIds: string[];
  dataspaces: DemoDataSpace[];
  worksurfaceId: string;
  worksurface: DemoWorkSurface;
  universe: DemoUniverse;
}

export interface DemoBusinessArchitectureResult {
  workspaceId: string;
  workspaceName: string;
  domain: string;
  sphere: string;
  dataspaceIds: string[];
  dataspaces: DemoDataSpace[];
  worksurfaceId: string;
  worksurface: DemoWorkSurface;
  xrScenes: DemoScene[];
  processes: DemoProcess[];
  tools: DemoTool[];
}

// ============================================================
// MOCK DATA: ARCHITECTURE UNIVERSE DEMO
// ============================================================

export function getMockArchitectureUniverseDemo(): DemoArchitectureUniverseResult {
  return {
    workspaceId: 'ws_archi_universe_demo',
    workspaceName: 'Architecture Universe Workspace',
    domain: 'Architecture',
    sphere: 'Creative',
    dataspaceIds: ['ds_notes_archi', 'ds_res_archi', 'ds_arch_archi'],
    dataspaces: [
      { id: 'ds_notes_archi', name: 'Notes', type: 'notes', entries: 3 },
      { id: 'ds_res_archi', name: 'Resources', type: 'resources', entries: 2 },
      { id: 'ds_arch_archi', name: 'Archive', type: 'archive', entries: 1 },
    ],
    worksurfaceId: 'wsf_archi_demo',
    worksurface: {
      id: 'wsf_archi_demo',
      profile: 'architecture',
      primaryMode: 'diagram',
      controlMode: 'assisted',
    },
    universe: {
      id: 'xu_archi_universe',
      name: 'Architecture Universe XR',
      scenes: [
        {
          id: 'scene_concept',
          name: 'Concept Room',
          domain: 'Architecture',
          sphere: 'Creative',
          sectors: 3,
          objects: 6,
          icon: '💡',
          description: 'Notes & ideas, Blocks diagram, Conceptual map',
        },
        {
          id: 'scene_blueprint',
          name: 'Blueprint Room',
          domain: 'Architecture',
          sphere: 'Creative',
          sectors: 3,
          objects: 8,
          icon: '📐',
          description: 'Blueprint Wall, Floor Grid, Symbolic dimensions',
        },
        {
          id: 'scene_zoning',
          name: 'Zoning & Flow Room',
          domain: 'Architecture',
          sphere: 'Creative',
          sectors: 3,
          objects: 9,
          icon: '◻️',
          description: 'Public / Private / Circulation zones, Movement arrows, Flow nodes',
        },
        {
          id: 'scene_structural',
          name: 'Structural Volume Room',
          domain: 'Architecture',
          sphere: 'Creative',
          sectors: 3,
          objects: 9,
          icon: '🔗',
          description: 'Volumes, Heights, Symbolic structural blocks',
        },
        {
          id: 'scene_layout',
          name: 'XR Layout Room',
          domain: 'Architecture',
          sphere: 'Creative',
          sectors: 3,
          objects: 9,
          icon: '🎯',
          description: 'Final spatial composition, XR positioning',
        },
      ],
      portals: [
        { id: 'p1', fromScene: 'scene_concept', toScene: 'scene_blueprint', direction: 'forward' },
        { id: 'p2', fromScene: 'scene_blueprint', toScene: 'scene_concept', direction: 'back' },
        { id: 'p3', fromScene: 'scene_blueprint', toScene: 'scene_zoning', direction: 'forward' },
        { id: 'p4', fromScene: 'scene_zoning', toScene: 'scene_blueprint', direction: 'back' },
        { id: 'p5', fromScene: 'scene_zoning', toScene: 'scene_structural', direction: 'forward' },
        { id: 'p6', fromScene: 'scene_structural', toScene: 'scene_zoning', direction: 'back' },
        { id: 'p7', fromScene: 'scene_structural', toScene: 'scene_layout', direction: 'forward' },
        { id: 'p8', fromScene: 'scene_layout', toScene: 'scene_structural', direction: 'back' },
      ],
    },
  };
}

// ============================================================
// MOCK DATA: BUSINESS + ARCHITECTURE DEMO
// ============================================================

export function getMockBusinessArchitectureDemo(): DemoBusinessArchitectureResult {
  return {
    workspaceId: 'ws_business_archi_demo',
    workspaceName: 'Construction Project Workspace',
    domain: 'Architecture & Construction',
    sphere: 'Business',
    dataspaceIds: ['ds_notes_ba', 'ds_res_ba', 'ds_arch_ba', 'ds_budget_ba'],
    dataspaces: [
      { id: 'ds_notes_ba', name: 'Project Notes', type: 'notes', entries: 3 },
      { id: 'ds_res_ba', name: 'Resources & Materials', type: 'resources', entries: 3 },
      { id: 'ds_arch_ba', name: 'Project Archive', type: 'archive', entries: 2 },
      { id: 'ds_budget_ba', name: 'Budget & Finance', type: 'finance', entries: 2 },
    ],
    worksurfaceId: 'wsf_ba_demo',
    worksurface: {
      id: 'wsf_ba_demo',
      profile: 'architecture_business',
      primaryMode: 'table',
      controlMode: 'assisted',
    },
    xrScenes: [
      {
        id: 'scene_industrial',
        name: 'Industrial Layout Room',
        domain: 'Architecture & Construction',
        sphere: 'Business',
        sectors: 4,
        objects: 13,
        icon: '🏭',
        description: 'Floor grid, Machinery placeholders, Circulation nodes, Safety zones',
      },
      {
        id: 'scene_overview',
        name: 'Construction Overview Room',
        domain: 'Architecture & Construction',
        sphere: 'Business',
        sectors: 4,
        objects: 12,
        icon: '📊',
        description: 'Timeline board, Phase panel, Resource matrix, Status dashboard',
      },
      {
        id: 'scene_management',
        name: 'Project Management Room',
        domain: 'Architecture & Construction',
        sphere: 'Business',
        sectors: 3,
        objects: 9,
        icon: '📋',
        description: 'Task board, Team allocation, Document center',
      },
    ],
    processes: [
      { id: 'proc_1', name: 'Budget Planning', type: 'Financial', status: 'active' },
      { id: 'proc_2', name: 'Resource Allocation', type: 'Planning', status: 'active' },
      { id: 'proc_3', name: 'Timeline Management', type: 'Scheduling', status: 'active' },
      { id: 'proc_4', name: 'Risk Assessment', type: 'Analysis', status: 'pending' },
      { id: 'proc_5', name: 'Quality Control', type: 'Compliance', status: 'pending' },
    ],
    tools: [
      { id: 'tool_1', name: 'Phase Tracker', domain: 'Architecture & Construction', active: true },
      { id: 'tool_2', name: 'Resource Matrix', domain: 'Business', active: true },
      { id: 'tool_3', name: 'Blueprint Viewer', domain: 'Architecture', active: true },
      { id: 'tool_4', name: 'Budget Calculator', domain: 'Business', active: true },
      { id: 'tool_5', name: 'Timeline Builder', domain: 'Business', active: true },
      { id: 'tool_6', name: 'Zoning Mapper', domain: 'Architecture', active: false },
    ],
  };
}

// ============================================================
// MOCK DATA: ARCHITECTURE WORKSPACE v1 (Simple)
// ============================================================

export function getMockArchitectureWorkspaceDemo() {
  return {
    workspaceId: 'ws_archi_simple_demo',
    workspaceName: 'Architecture Concept Demo Workspace',
    domain: 'Architecture',
    sphere: 'Creative',
    dataspaces: [
      { id: 'ds_notes_simple', name: 'Notes', type: 'notes', entries: 2 },
      { id: 'ds_res_simple', name: 'Resources', type: 'resources', entries: 2 },
      { id: 'ds_arch_simple', name: 'Archive', type: 'archive', entries: 1 },
    ],
    worksurface: {
      id: 'wsf_simple_demo',
      profile: 'architecture',
      primaryMode: 'diagram',
      controlMode: 'assisted',
    },
    xrScene: {
      id: 'scene_archi_simple',
      name: 'Architectural Concept Room',
      domain: 'Architecture',
      sectors: 4,
      objects: 4,
      icon: '🏛️',
    },
  };
}

// ============================================================
// DEMO REGISTRY
// ============================================================

export interface DemoRegistryItem {
  id: string;
  name: string;
  version: string;
  description: string;
  sphere: string;
  domain: string;
  icon: string;
  route: string;
  features: string[];
}

export const DEMO_REGISTRY: DemoRegistryItem[] = [
  {
    id: 'architecture_v1',
    name: 'Architecture Workspace v1',
    version: '1.0.0',
    description: 'Basic architectural workspace with WorkSurface and single XR scene',
    sphere: 'Creative',
    domain: 'Architecture',
    icon: '🏛️',
    route: '/demo/architecture-workspace',
    features: [
      'Project Workspace',
      '3 DataSpaces',
      'Architecture WorkSurface Profile',
      'Single XR Scene',
    ],
  },
  {
    id: 'architecture_universe_v2',
    name: 'Architecture XR Universe v2',
    version: '2.0.0',
    description: 'Multi-room XR Universe with portal navigation',
    sphere: 'Creative',
    domain: 'Architecture',
    icon: '🌀',
    route: '/demo/architecture-universe',
    features: [
      '5-Room XR Universe',
      'Portal Navigation',
      'Navigation Map',
      'Concept → Layout Flow',
    ],
  },
  {
    id: 'business_architecture',
    name: 'Business + Architecture',
    version: '1.0.0',
    description: 'Construction project combining Business sphere with Architecture domain',
    sphere: 'Business',
    domain: 'Architecture & Construction',
    icon: '🏗️',
    route: '/demo/business-architecture',
    features: [
      '3 Industrial XR Rooms',
      '5 Business Processes',
      '6 Project Tools',
      '4 Enterprise DataSpaces',
    ],
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getDemoById(id: string): DemoRegistryItem | undefined {
  return DEMO_REGISTRY.find(d => d.id === id);
}

export function getDemosByDomain(domain: string): DemoRegistryItem[] {
  return DEMO_REGISTRY.filter(d => 
    d.domain.toLowerCase().includes(domain.toLowerCase())
  );
}

export function getDemosBySphere(sphere: string): DemoRegistryItem[] {
  return DEMO_REGISTRY.filter(d => d.sphere === sphere);
}
