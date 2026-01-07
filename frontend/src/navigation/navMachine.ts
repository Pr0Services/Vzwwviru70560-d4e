// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NAVIGATION STATE MACHINE (XSTATE v5)
// Machine d'état pour la navigation - Context Bureau JAMAIS sauté
// ═══════════════════════════════════════════════════════════════════════════════

import { setup, assign } from 'xstate';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type NavigationLocation = 
  | 'entry'
  | 'context_bureau'
  | 'action_bureau'
  | 'workspace'
  | 'annexe_archives'
  | 'annexe_meeting'
  | 'annexe_backstage'
  | 'annexe_browser';

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team'
  | 'scholars';

export type BureauSectionId = 
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'projects'
  | 'threads'
  | 'meetings'
  | 'data'
  | 'agents'
  | 'reports'
  | 'budget';

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

export interface NavigationContext {
  currentLocation: NavigationLocation;
  previousLocation: NavigationLocation | null;
  sphereId: SphereId;
  sphereCode: string;
  sectionId: BureauSectionId | null;
  workspaceId: string | null;
  documentId: string | null;
  hasUnsavedWork: boolean;
  pendingAgentExecutions: string[];
  searchScope: string | null;
  annexeStack: NavigationLocation[];
  contextLocked: boolean;
}

// ═══════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════

export type NavigationEvent =
  | { type: 'ENTER_BUREAU' }
  | { type: 'SELECT_SECTION'; sectionId: BureauSectionId }
  | { type: 'OPEN_WORKSPACE'; workspaceId: string; documentId?: string }
  | { type: 'EXIT_TO_ENTRY' }
  | { type: 'GO_BACK' }
  | { type: 'SWITCH_SPHERE'; sphereId: SphereId }
  | { type: 'OPEN_ANNEXE'; annexe: NavigationLocation }
  | { type: 'CLOSE_ANNEXE' }
  | { type: 'SET_UNSAVED_WORK'; hasUnsaved: boolean }
  | { type: 'CONFIRM_CONTEXT' }
  | { type: 'CHANGE_CONTEXT' };

// ═══════════════════════════════════════════════════════════════
// STATE MACHINE (XState v5 syntax)
// ═══════════════════════════════════════════════════════════════

export const navMachine = setup({
  types: {
    context: {} as NavigationContext,
    events: {} as NavigationEvent,
  },
  actions: {
    setEntry: assign({
      currentLocation: 'entry' as NavigationLocation,
      sectionId: null,
      workspaceId: null,
      documentId: null,
      contextLocked: false,
    }),
    setContextBureau: assign({
      currentLocation: 'context_bureau' as NavigationLocation,
      contextLocked: false,
    }),
    setActionBureau: assign({
      currentLocation: 'action_bureau' as NavigationLocation,
      contextLocked: true,
    }),
    setWorkspace: assign({
      currentLocation: 'workspace' as NavigationLocation,
    }),
    updateSphere: assign({
      sphereId: ({ event }) => {
        if (event.type === 'SWITCH_SPHERE') {
          return event.sphereId;
        }
        return 'personal';
      },
      sphereCode: ({ event }) => {
        if (event.type === 'SWITCH_SPHERE') {
          return event.sphereId;
        }
        return 'personal';
      },
    }),
    updateSection: assign({
      sectionId: ({ event }) => {
        if (event.type === 'SELECT_SECTION') {
          return event.sectionId;
        }
        return null;
      },
    }),
    lockContext: assign({
      contextLocked: true,
    }),
    unlockContext: assign({
      contextLocked: false,
    }),
  },
}).createMachine({
  id: 'navigation',
  initial: 'entry',
  context: {
    currentLocation: 'entry',
    previousLocation: null,
    sphereId: 'personal',
    sphereCode: 'personal',
    sectionId: null,
    workspaceId: null,
    documentId: null,
    hasUnsavedWork: false,
    pendingAgentExecutions: [],
    searchScope: null,
    annexeStack: [],
    contextLocked: false,
  },
  states: {
    // ─────────────────────────────────────────────────────────────
    // ENTRY - Sphere selection / overview
    // ─────────────────────────────────────────────────────────────
    entry: {
      entry: 'setEntry',
      on: {
        ENTER_BUREAU: {
          target: 'context_bureau',
        },
        SWITCH_SPHERE: {
          target: 'entry',
          actions: 'updateSphere',
          reenter: true,
        },
      },
    },

    // ─────────────────────────────────────────────────────────────
    // CONTEXT BUREAU - Setup context (NEVER SKIPPED)
    // ─────────────────────────────────────────────────────────────
    context_bureau: {
      entry: 'setContextBureau',
      on: {
        CONFIRM_CONTEXT: {
          target: 'action_bureau',
          actions: 'lockContext',
        },
        SWITCH_SPHERE: {
          target: 'context_bureau',
          actions: 'updateSphere',
          reenter: true,
        },
        EXIT_TO_ENTRY: {
          target: 'entry',
        },
      },
    },

    // ─────────────────────────────────────────────────────────────
    // ACTION BUREAU - Main workspace with sections
    // ─────────────────────────────────────────────────────────────
    action_bureau: {
      entry: 'setActionBureau',
      on: {
        SELECT_SECTION: {
          target: 'action_bureau',
          actions: 'updateSection',
          reenter: true,
        },
        OPEN_WORKSPACE: {
          target: 'workspace',
        },
        CHANGE_CONTEXT: {
          target: 'context_bureau',
          actions: 'unlockContext',
        },
        EXIT_TO_ENTRY: {
          target: 'entry',
        },
      },
    },

    // ─────────────────────────────────────────────────────────────
    // WORKSPACE - Deep work mode
    // ─────────────────────────────────────────────────────────────
    workspace: {
      entry: 'setWorkspace',
      on: {
        GO_BACK: {
          target: 'action_bureau',
        },
        CHANGE_CONTEXT: {
          target: 'context_bureau',
          actions: 'unlockContext',
        },
        EXIT_TO_ENTRY: {
          target: 'entry',
        },
      },
    },
  },
});

export default navMachine;
