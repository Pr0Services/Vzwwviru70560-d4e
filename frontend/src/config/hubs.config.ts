/**
 * CHE·NU™ - HUB ARCHITECTURE
 * 
 * COMPLIANCE CHECKLIST COMPLIANT (v1-freeze)
 * 
 * EXACTLY 3 HUBS:
 * 1. Communication Hub - Nova, Chat, Threads
 * 2. Navigation Hub - Spheres, Bureau sections
 * 3. Workspace Hub - Create, Transform, Version
 * 
 * RULES:
 * - Max 2 hubs visible at once
 * - Nova always accessible
 * - Hidden execution NOT allowed
 * - Workspace is the ONLY place where data is edited
 */

// ═══════════════════════════════════════════════════════════════
// HUB TYPES
// ═══════════════════════════════════════════════════════════════

export type HubId = 'communication' | 'navigation' | 'workspace';

export interface Hub {
  id: HubId;
  name: string;
  icon: string;
  description: string;
  position: 'left' | 'center' | 'right' | 'bottom';
  isCollapsible: boolean;
  defaultVisible: boolean;
}

export interface HubState {
  activeHubs: HubId[];
  expandedHub: HubId | null;
  novaAccessible: boolean;
}

// ═══════════════════════════════════════════════════════════════
// HUB CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const HUBS: Record<HubId, Hub> = {
  communication: {
    id: 'communication',
    name: 'Communication',
    icon: '💬',
    description: 'Nova, Chat, Threads - All communication flows',
    position: 'left',
    isCollapsible: true,
    defaultVisible: true,
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation',
    icon: '🧭',
    description: 'Spheres, Bureau sections - System navigation',
    position: 'bottom',
    isCollapsible: true,
    defaultVisible: true,
  },
  workspace: {
    id: 'workspace',
    name: 'Workspace',
    icon: '📝',
    description: 'Create, Transform, Version - Data editing',
    position: 'center',
    isCollapsible: false,
    defaultVisible: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// HUB RULES - FROZEN
// ═══════════════════════════════════════════════════════════════

export const HUB_RULES = {
  MAX_VISIBLE_HUBS: 2,
  NOVA_ALWAYS_ACCESSIBLE: true,
  HIDDEN_EXECUTION_ALLOWED: false,
  WORKSPACE_ONLY_EDITING: true,
  DEFAULT_VISIBLE: ['navigation', 'workspace'] as HubId[],
  VALID_COMBINATIONS: [
    ['communication', 'workspace'],
    ['navigation', 'workspace'],
    ['communication', 'navigation'],
  ] as [HubId, HubId][],
} as const;

// ═══════════════════════════════════════════════════════════════
// WORKSPACE CAPABILITIES - FROM COMPLIANCE CHECKLIST
// ═══════════════════════════════════════════════════════════════

export const WORKSPACE_CAPABILITIES = [
  'create',
  'transform',
  'export',
  'import',
  'share_to_agent',
  'versioning',
  'diff',
] as const;

export type WorkspaceCapability = typeof WORKSPACE_CAPABILITIES[number];

export function isValidHubCombination(hubs: HubId[]): boolean {
  if (hubs.length > HUB_RULES.MAX_VISIBLE_HUBS) return false;
  if (hubs.length === 2) {
    return HUB_RULES.VALID_COMBINATIONS.some(
      ([a, b]) => (hubs.includes(a) && hubs.includes(b))
    );
  }
  return true;
}

export const DEFAULT_HUB_STATE: HubState = {
  activeHubs: HUB_RULES.DEFAULT_VISIBLE,
  expandedHub: 'workspace',
  novaAccessible: true,
};

export default HUBS;
