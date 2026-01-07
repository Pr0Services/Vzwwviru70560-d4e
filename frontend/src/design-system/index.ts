// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — MAIN EXPORT
// Central export point for all design system components and utilities
// ═══════════════════════════════════════════════════════════════════════════════
//
// Usage:
// import { Button, Card, useTheme, tokens } from '@/design-system';
//
// ═══════════════════════════════════════════════════════════════════════════════

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export {
  tokens,
  colors,
  typography,
  spacing,
  sizing,
  borders,
  shadows,
  animation,
  breakpoints,
  zIndex,
  type DesignTokens,
} from './tokens';

// =============================================================================
// THEME SYSTEM
// =============================================================================

export {
  ThemeProvider,
  useTheme,
  useIsDark,
  useCurrentSphere,
  useThemeColors,
  ThemeToggle,
  SphereSelector,
  type ThemeMode,
  type SphereId,
  type ThemeContextValue,
  type ThemeProviderProps,
  type ThemeToggleProps,
  type SphereSelectorProps,
} from './theme/ThemeProvider';

// =============================================================================
// PRIMITIVE COMPONENTS
// =============================================================================

// Button
export {
  Button,
  ButtonGroup,
  IconButton,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
  type ButtonGroupProps,
  type IconButtonProps,
} from './components/Button';

// Input
export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type SelectOption,
  type CheckboxProps,
  type RadioProps,
  type InputVariant,
  type InputSize,
  type InputState,
} from './components/Input';

// Card
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
  StatCard,
  type CardProps,
  type CardVariant,
  type CardElevation,
  type CardPadding,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardImageProps,
  type StatCardProps,
} from './components/Card';

// Avatar
export {
  Avatar,
  AgentAvatar,
  AvatarGroup,
  AgentAvatarGroup,
  type AvatarProps,
  type AvatarSize,
  type AvatarShape,
  type AgentAvatarProps,
  type AgentLevel,
  type AgentStatus,
  type AvatarGroupProps,
  type AgentAvatarGroupProps,
} from './components/Avatar';

// Badge
export {
  Badge,
  StatusBadge,
  AgentLevelBadge,
  NotificationBadge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
  type StatusBadgeProps,
  type AgentLevelBadgeProps,
  type NotificationBadgeProps,
} from './components/Badge';

// Tooltip
export {
  Tooltip,
  type TooltipProps,
  type TooltipPosition,
} from './components/Tooltip';

// =============================================================================
// FEEDBACK COMPONENTS
// =============================================================================

// Modal / Dialog / Drawer
export {
  Modal,
  ConfirmDialog,
  Drawer,
  type ModalProps,
  type ModalSize,
  type ModalPosition,
  type ConfirmDialogProps,
  type DrawerProps,
} from './components/Modal';

// Toast / Alert
export {
  ToastProvider,
  useToast,
  Alert,
  type ToastProviderProps,
  type ToastContextValue,
  type Toast,
  type ToastOptions,
  type ToastType,
  type ToastPosition,
  type AlertProps,
} from './components/Toast';

// Loading / Progress / Skeleton
export {
  Spinner,
  LoadingOverlay,
  Progress,
  CircularProgress,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  type SpinnerProps,
  type SpinnerSize,
  type LoadingOverlayProps,
  type ProgressProps,
  type ProgressVariant,
  type CircularProgressProps,
  type SkeletonProps,
} from './components/Loading';

// =============================================================================
// NAVIGATION COMPONENTS
// =============================================================================

export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Breadcrumb,
  Pagination,
  type TabsProps,
  type TabListProps,
  type TabProps,
  type TabPanelProps,
  type TabsVariant,
  type TabsSize,
  type TabsOrientation,
  type BreadcrumbProps,
  type BreadcrumbItem,
  type PaginationProps,
} from './components/Navigation';

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export {
  AppShell,
  Sidebar,
  SidebarItem,
  SidebarGroup,
  SidebarToggle,
  MobileMenuButton,
  useSidebar,
  PageHeader,
  Container,
  Section,
  Grid,
  type AppShellProps,
  type SidebarProps,
  type SidebarItemProps,
  type SidebarGroupProps,
  type SidebarContextValue,
  type PageHeaderProps,
  type ContainerProps,
  type SectionProps,
  type GridProps,
} from './layouts';

// =============================================================================
// AGENT COMPONENTS (CHE·NU SPECIFIC)
// =============================================================================

export {
  AgentCard,
  ChatMessageBubble,
  ChatInput,
  AgentChat,
  OrbitalIndicator,
  AgentHierarchy,
  type Agent,
  type AgentLevel,
  type AgentStatus,
  type AgentCardProps,
  type ChatMessage,
  type ChatMessageProps,
  type ChatInputProps,
  type AgentChatProps,
  type OrbitalIndicatorProps,
  type AgentNode,
  type AgentHierarchyProps,
} from './components/Agent';

// =============================================================================
// DATA DISPLAY COMPONENTS
// =============================================================================

export {
  DataTable,
  StatCard,
  KPIGrid,
  EmptyState,
  MetricComparison,
  ProgressList,
  type Column,
  type TableProps,
  type StatCardProps,
  type KPI,
  type KPIGridProps,
  type EmptyStateProps,
  type MetricComparisonProps,
  type ProgressItem,
  type ProgressListProps,
} from './components/DataDisplay';

// =============================================================================
// ICONS
// =============================================================================

export {
  Icons,
  IconChenuLogo,
  IconNova,
  IconAgent,
  IconSphere,
  IconHardHat,
  IconBlueprint,
  IconCrane,
  IconBrick,
  IconHammer,
  IconWrench,
  IconMeasure,
  IconDashboard,
  IconProjects,
  IconTasks,
  IconCalendar,
  IconTeam,
  IconFinance,
  IconSettings,
  IconPlus,
  IconMinus,
  IconClose,
  IconCheck,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconInfo,
  IconWarning,
  IconError,
  IconSuccess,
  IconArrowUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconMenu,
  IconMoreHorizontal,
  IconMoreVertical,
  IconBell,
  IconUser,
  IconLock,
  IconEye,
  IconEyeOff,
  type IconProps,
} from './icons';

// =============================================================================
// CSS IMPORTS
// =============================================================================

// Import CSS variables (should be imported at app root)
// import '@/design-system/styles/variables.css';

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create responsive values object
 */
export function responsive<T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): Record<string, T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined)
  ) as Record<string, T>;
}

/**
 * Generate CSS custom property string
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`;
}

/**
 * Check if we're in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  // Re-export commonly used types for convenience
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
