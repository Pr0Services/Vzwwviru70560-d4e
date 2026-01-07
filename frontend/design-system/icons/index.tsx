// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — CUSTOM ICONS
// SVG icons as React components
// ═══════════════════════════════════════════════════════════════════════════════

import React, { forwardRef, type SVGProps } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size */
  size?: number | string;
  
  /** Icon color */
  color?: string;
  
  /** Stroke width */
  strokeWidth?: number;
}

// =============================================================================
// BASE ICON WRAPPER
// =============================================================================

const createIcon = (
  path: React.ReactNode,
  displayName: string,
  defaultProps?: Partial<IconProps>
) => {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`chenu-icon ${className}`}
        {...defaultProps}
        {...props}
      >
        {path}
      </svg>
    )
  );
  Icon.displayName = displayName;
  return Icon;
};

// =============================================================================
// CHE·NU BRAND ICONS
// =============================================================================

/**
 * CHE·NU Logo Icon — Stylized house with neural network
 */
export const IconChenuLogo = createIcon(
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <circle cx="12" cy="14" r="3" />
    <line x1="12" y1="11" x2="12" y2="8" />
    <line x1="9" y1="14" x2="6" y2="14" />
    <line x1="15" y1="14" x2="18" y2="14" />
    <line x1="12" y1="17" x2="12" y2="20" />
  </>,
  'IconChenuLogo'
);

/**
 * Nova AI Icon — Central AI brain
 */
export const IconNova = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.1" stroke="none" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </>,
  'IconNova'
);

/**
 * Agent Icon — Generic AI agent
 */
export const IconAgent = createIcon(
  <>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <circle cx="9" cy="14" r="2" />
    <circle cx="15" cy="14" r="2" />
    <path d="M9 3v5M15 3v5" />
    <path d="M6 3h12" />
  </>,
  'IconAgent'
);

/**
 * Sphere Icon — Orbital sphere representation
 */
export const IconSphere = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="4" ry="10" />
  </>,
  'IconSphere'
);

// =============================================================================
// CONSTRUCTION ICONS
// =============================================================================

/**
 * Hard Hat Icon
 */
export const IconHardHat = createIcon(
  <>
    <path d="M2 18h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
    <path d="M4 18V8c0-4.4 3.6-8 8-8s8 3.6 8 8v10" />
    <line x1="4" y1="13" x2="20" y2="13" />
  </>,
  'IconHardHat'
);

/**
 * Blueprint Icon
 */
export const IconBlueprint = createIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <rect x="12" y="12" width="6" height="6" />
  </>,
  'IconBlueprint'
);

/**
 * Crane Icon
 */
export const IconCrane = createIcon(
  <>
    <path d="M4 21v-17" />
    <path d="M4 4l16 0" />
    <path d="M20 4v4" />
    <path d="M20 8l-4 4v9" />
    <rect x="13" y="17" width="6" height="4" />
    <path d="M4 8h8" />
    <circle cx="4" cy="21" r="2" />
  </>,
  'IconCrane'
);

/**
 * Brick Icon
 */
export const IconBrick = createIcon(
  <>
    <rect x="2" y="4" width="20" height="6" rx="1" />
    <rect x="2" y="14" width="20" height="6" rx="1" />
    <line x1="12" y1="4" x2="12" y2="10" />
    <line x1="7" y1="14" x2="7" y2="20" />
    <line x1="17" y1="14" x2="17" y2="20" />
  </>,
  'IconBrick'
);

/**
 * Hammer Icon
 */
export const IconHammer = createIcon(
  <>
    <path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9" />
    <path d="M17.64 15L22 10.64" />
    <path d="M20.91 11.7l-1.25-1.25a4 4 0 00-5.66 0l-3 3 6.71 6.71" />
    <path d="M10.5 5.5L16 11l4-4" />
  </>,
  'IconHammer'
);

/**
 * Wrench Icon
 */
export const IconWrench = createIcon(
  <>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </>,
  'IconWrench'
);

/**
 * Measure Icon
 */
export const IconMeasure = createIcon(
  <>
    <path d="M21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3" />
    <path d="M21 16v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" />
    <path d="M4 12h16" />
    <path d="M9 8v8M15 8v8" />
  </>,
  'IconMeasure'
);

// =============================================================================
// NAVIGATION ICONS
// =============================================================================

/**
 * Dashboard Icon
 */
export const IconDashboard = createIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </>,
  'IconDashboard'
);

/**
 * Projects Icon
 */
export const IconProjects = createIcon(
  <>
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </>,
  'IconProjects'
);

/**
 * Tasks Icon
 */
export const IconTasks = createIcon(
  <>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </>,
  'IconTasks'
);

/**
 * Calendar Icon
 */
export const IconCalendar = createIcon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>,
  'IconCalendar'
);

/**
 * Team Icon
 */
export const IconTeam = createIcon(
  <>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </>,
  'IconTeam'
);

/**
 * Finance Icon
 */
export const IconFinance = createIcon(
  <>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </>,
  'IconFinance'
);

/**
 * Settings Icon
 */
export const IconSettings = createIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </>,
  'IconSettings'
);

// =============================================================================
// ACTION ICONS
// =============================================================================

/**
 * Plus Icon
 */
export const IconPlus = createIcon(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
  'IconPlus'
);

/**
 * Minus Icon
 */
export const IconMinus = createIcon(
  <line x1="5" y1="12" x2="19" y2="12" />,
  'IconMinus'
);

/**
 * Close Icon
 */
export const IconClose = createIcon(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>,
  'IconClose'
);

/**
 * Check Icon
 */
export const IconCheck = createIcon(
  <polyline points="20 6 9 17 4 12" />,
  'IconCheck'
);

/**
 * Edit Icon
 */
export const IconEdit = createIcon(
  <>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>,
  'IconEdit'
);

/**
 * Trash Icon
 */
export const IconTrash = createIcon(
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>,
  'IconTrash'
);

/**
 * Search Icon
 */
export const IconSearch = createIcon(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>,
  'IconSearch'
);

/**
 * Filter Icon
 */
export const IconFilter = createIcon(
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  'IconFilter'
);

/**
 * Download Icon
 */
export const IconDownload = createIcon(
  <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>,
  'IconDownload'
);

/**
 * Upload Icon
 */
export const IconUpload = createIcon(
  <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>,
  'IconUpload'
);

/**
 * Refresh Icon
 */
export const IconRefresh = createIcon(
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </>,
  'IconRefresh'
);

// =============================================================================
// STATUS ICONS
// =============================================================================

/**
 * Info Icon
 */
export const IconInfo = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>,
  'IconInfo'
);

/**
 * Warning Icon
 */
export const IconWarning = createIcon(
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>,
  'IconWarning'
);

/**
 * Error Icon
 */
export const IconError = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>,
  'IconError'
);

/**
 * Success Icon
 */
export const IconSuccess = createIcon(
  <>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>,
  'IconSuccess'
);

// =============================================================================
// ARROW ICONS
// =============================================================================

export const IconArrowUp = createIcon(<line x1="12" y1="19" x2="12" y2="5" />, 'IconArrowUp');
export const IconArrowDown = createIcon(<line x1="12" y1="5" x2="12" y2="19" />, 'IconArrowDown');
export const IconArrowLeft = createIcon(<line x1="19" y1="12" x2="5" y2="12" />, 'IconArrowLeft');
export const IconArrowRight = createIcon(<line x1="5" y1="12" x2="19" y2="12" />, 'IconArrowRight');

export const IconChevronUp = createIcon(
  <polyline points="18 15 12 9 6 15" />,
  'IconChevronUp'
);
export const IconChevronDown = createIcon(
  <polyline points="6 9 12 15 18 9" />,
  'IconChevronDown'
);
export const IconChevronLeft = createIcon(
  <polyline points="15 18 9 12 15 6" />,
  'IconChevronLeft'
);
export const IconChevronRight = createIcon(
  <polyline points="9 18 15 12 9 6" />,
  'IconChevronRight'
);

// =============================================================================
// MISC ICONS
// =============================================================================

/**
 * Menu Icon
 */
export const IconMenu = createIcon(
  <>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>,
  'IconMenu'
);

/**
 * More Horizontal Icon
 */
export const IconMoreHorizontal = createIcon(
  <>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </>,
  'IconMoreHorizontal'
);

/**
 * More Vertical Icon
 */
export const IconMoreVertical = createIcon(
  <>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </>,
  'IconMoreVertical'
);

/**
 * Bell Icon (Notifications)
 */
export const IconBell = createIcon(
  <>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </>,
  'IconBell'
);

/**
 * User Icon
 */
export const IconUser = createIcon(
  <>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  'IconUser'
);

/**
 * Lock Icon
 */
export const IconLock = createIcon(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </>,
  'IconLock'
);

/**
 * Eye Icon
 */
export const IconEye = createIcon(
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  'IconEye'
);

/**
 * Eye Off Icon
 */
export const IconEyeOff = createIcon(
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </>,
  'IconEyeOff'
);

// =============================================================================
// EXPORT ALL ICONS
// =============================================================================

export const Icons = {
  // Brand
  ChenuLogo: IconChenuLogo,
  Nova: IconNova,
  Agent: IconAgent,
  Sphere: IconSphere,
  
  // Construction
  HardHat: IconHardHat,
  Blueprint: IconBlueprint,
  Crane: IconCrane,
  Brick: IconBrick,
  Hammer: IconHammer,
  Wrench: IconWrench,
  Measure: IconMeasure,
  
  // Navigation
  Dashboard: IconDashboard,
  Projects: IconProjects,
  Tasks: IconTasks,
  Calendar: IconCalendar,
  Team: IconTeam,
  Finance: IconFinance,
  Settings: IconSettings,
  
  // Actions
  Plus: IconPlus,
  Minus: IconMinus,
  Close: IconClose,
  Check: IconCheck,
  Edit: IconEdit,
  Trash: IconTrash,
  Search: IconSearch,
  Filter: IconFilter,
  Download: IconDownload,
  Upload: IconUpload,
  Refresh: IconRefresh,
  
  // Status
  Info: IconInfo,
  Warning: IconWarning,
  Error: IconError,
  Success: IconSuccess,
  
  // Arrows
  ArrowUp: IconArrowUp,
  ArrowDown: IconArrowDown,
  ArrowLeft: IconArrowLeft,
  ArrowRight: IconArrowRight,
  ChevronUp: IconChevronUp,
  ChevronDown: IconChevronDown,
  ChevronLeft: IconChevronLeft,
  ChevronRight: IconChevronRight,
  
  // Misc
  Menu: IconMenu,
  MoreHorizontal: IconMoreHorizontal,
  MoreVertical: IconMoreVertical,
  Bell: IconBell,
  User: IconUser,
  Lock: IconLock,
  Eye: IconEye,
  EyeOff: IconEyeOff,
};

export default Icons;
