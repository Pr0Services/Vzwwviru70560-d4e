/**
 * ============================================================
 * CHE·NU — WORKSURFACE UI INDEX
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Unified WorkSurface UI System - Complete exports
 */

// ============================================================
// STYLES
// ============================================================
export {
  CHENU_COLORS,
  MODE_COLORS,
  baseStyles,
  worksurfaceStyles,
  mergeStyles,
  getModeColor,
  createHoverStyle,
} from './worksurfaceStyles';

// ============================================================
// MAIN COMPONENTS
// ============================================================
export {
  WorkSurfaceShell,
  type WorkSurfaceData,
  type WorkSurfaceShellProps,
  type WorkSurfaceMode,
  type WorkSurfaceControlMode,
  type WorkSurfaceState,
  type WorkSurfaceContent,
} from './WorkSurfaceShell';

export {
  WorkSurfacePage,
  type WorkSurfacePageProps,
} from './WorkSurfacePage';

// ============================================================
// CONTROL COMPONENTS
// ============================================================
export {
  WorkSurfaceModeSwitcher,
  type WorkSurfaceModeSwitcherProps,
} from './WorkSurfaceModeSwitcher';

export {
  WorkSurfaceToolbar,
  WorkSurfaceToolbarCompact,
  type WorkSurfaceToolbarProps,
  type WorkSurfaceToolbarCompactProps,
  type ContextInfo,
} from './WorkSurfaceToolbar';

export {
  WorkSurfaceStatusBar,
  WorkSurfaceStatusBarCompact,
  type WorkSurfaceStatusBarProps,
  type WorkSurfaceStatusBarCompactProps,
} from './WorkSurfaceStatusBar';

// ============================================================
// VIEW COMPONENTS
// ============================================================
export {
  WorkSurfaceTextView,
  type WorkSurfaceTextViewProps,
} from './WorkSurfaceTextView';

export {
  WorkSurfaceTableView,
  type WorkSurfaceTableViewProps,
  type TablePreview,
} from './WorkSurfaceTableView';

export {
  WorkSurfaceBlocksView,
  type WorkSurfaceBlocksViewProps,
  type ContentBlock,
} from './WorkSurfaceBlocksView';

export {
  WorkSurfaceDiagramView,
  type WorkSurfaceDiagramViewProps,
  type DiagramNode,
  type DiagramLink,
  type DiagramStructure,
} from './WorkSurfaceDiagramView';

export {
  WorkSurfaceSummaryView,
  type WorkSurfaceSummaryViewProps,
} from './WorkSurfaceSummaryView';

export {
  WorkSurfaceXRLayoutView,
  type WorkSurfaceXRLayoutViewProps,
  type XRSceneRef,
} from './WorkSurfaceXRLayoutView';

export {
  WorkSurfaceFinalView,
  type WorkSurfaceFinalViewProps,
} from './WorkSurfaceFinalView';

// ============================================================
// MODULE INFO
// ============================================================
export const WORKSURFACE_UI_INFO = {
  name: 'CHE·NU WorkSurface UI',
  version: '1.0.0',
  status: 'COMPLETE',
  safe: true,
  autonomous: false,
  representational: true,
  components: [
    // Main
    'WorkSurfaceShell',
    'WorkSurfacePage',
    // Controls
    'WorkSurfaceModeSwitcher',
    'WorkSurfaceToolbar',
    'WorkSurfaceStatusBar',
    // Views
    'WorkSurfaceTextView',
    'WorkSurfaceTableView',
    'WorkSurfaceBlocksView',
    'WorkSurfaceDiagramView',
    'WorkSurfaceSummaryView',
    'WorkSurfaceXRLayoutView',
    'WorkSurfaceFinalView',
  ],
  totalComponents: 12,
};
