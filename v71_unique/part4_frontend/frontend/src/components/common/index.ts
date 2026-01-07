/**
 * CHE·NU™ Common Components Index
 * 
 * Complete UI Kit - Central export for all reusable UI components.
 * Production-ready component library for CHE·NU V72.
 * 
 * 80+ Components | 17 Files | ~13,000 Lines
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

export { 
  ErrorBoundary,
  PageErrorBoundary,
  SectionErrorBoundary,
  ComponentErrorBoundary,
  DefaultErrorFallback,
  useErrorBoundary,
} from './ErrorBoundary';

export type { 
  ErrorBoundaryProps,
  ErrorFallbackProps,
} from './ErrorBoundary';

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════════════════

export { 
  CommandPalette,
} from './CommandPalette';

export type { 
  CommandPaletteProps,
  CommandItem,
  CommandCategory,
} from './CommandPalette';

// ═══════════════════════════════════════════════════════════════════════════
// OFFLINE STATUS
// ═══════════════════════════════════════════════════════════════════════════

export { 
  OfflineStatusIndicator,
  OfflineStatusDot,
  OfflineBanner,
} from './OfflineStatusIndicator';

export type { 
  OfflineStatusIndicatorProps,
} from './OfflineStatusIndicator';

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS HELP
// ═══════════════════════════════════════════════════════════════════════════

export { 
  KeyboardShortcutsHelp,
} from './KeyboardShortcutsHelp';

export type { 
  KeyboardShortcutsHelpProps,
} from './KeyboardShortcutsHelp';

// ═══════════════════════════════════════════════════════════════════════════
// PWA COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export { 
  PWAInstallPrompt, 
  PWAUpdateBanner, 
  PWAStatus,
} from './PWAComponents';

export type { 
  PWAInstallPromptProps, 
  PWAUpdateBannerProps,
} from './PWAComponents';

// ═══════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

export { 
  ToastContainer, 
  useToast, 
  useToastStore, 
  toast,
} from './Toast';

export type { 
  Toast, 
  ToastType, 
  ToastPosition, 
  ToastOptions,
} from './Toast';

// ═══════════════════════════════════════════════════════════════════════════
// LOADING & SKELETON
// ═══════════════════════════════════════════════════════════════════════════

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonThread,
  SkeletonSphere,
  SkeletonList,
  SkeletonTable,
  Spinner,
  LoadingOverlay,
  ProgressBar,
  PulsingDot,
  LoadingStyles,
} from './Loading';

export type { 
  SkeletonProps, 
  SpinnerProps, 
  LoadingOverlayProps, 
  ProgressBarProps,
} from './Loading';

// ═══════════════════════════════════════════════════════════════════════════
// MODAL & DIALOGS
// ═══════════════════════════════════════════════════════════════════════════

export { 
  Modal, 
  ConfirmDialog, 
  AlertDialog, 
  useConfirm,
  ModalStyles,
} from './Modal';

export type { 
  ModalProps, 
  ModalSize, 
  ModalVariant, 
  ConfirmDialogProps, 
  AlertDialogProps,
} from './Modal';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Button,
  IconButton,
  ButtonGroup,
  LinkButton,
  ButtonStyles,
} from './Button';

export type {
  ButtonVariant,
  ButtonSize,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
  LinkButtonProps,
} from './Button';

// ═══════════════════════════════════════════════════════════════════════════
// FORM INPUTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  FormGroup,
  FormStyles,
} from './Input';

export type {
  InputSize,
  InputVariant,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  SwitchProps,
  FormGroupProps,
} from './Input';

// ═══════════════════════════════════════════════════════════════════════════
// CARDS & BADGES
// ═══════════════════════════════════════════════════════════════════════════

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
  Badge,
  StatusBadge,
  CounterBadge,
  Avatar,
  AvatarGroup,
  CardBadgeStyles,
} from './Card';

export type {
  CardVariant,
  CardSize,
  CardProps,
  CardHeaderProps,
  CardFooterProps,
  BadgeVariant,
  BadgeSize,
  BadgeProps,
  StatusType,
  StatusBadgeProps,
  CounterBadgeProps,
  AvatarSize,
  AvatarProps,
  AvatarGroupProps,
} from './Card';

// ═══════════════════════════════════════════════════════════════════════════
// DROPDOWNS, TOOLTIPS & TABS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Dropdown,
  Tooltip,
  Tabs,
  TabPanel,
  Popover,
  DropdownTooltipTabsStyles,
} from './Dropdown';

export type {
  DropdownItem,
  DropdownProps,
  TooltipPlacement,
  TooltipProps,
  Tab,
  TabsProps,
  TabPanelProps,
  PopoverProps,
} from './Dropdown';

// ═══════════════════════════════════════════════════════════════════════════
// DATA DISPLAY (Tables)
// ═══════════════════════════════════════════════════════════════════════════

export {
  Table,
  Pagination,
  DataGrid,
  TableStyles,
} from './Table';

export type {
  SortDirection,
  Column,
  TableProps,
  PaginationProps,
  DataGridProps,
} from './Table';

// ═══════════════════════════════════════════════════════════════════════════
// ALERTS & STATES
// ═══════════════════════════════════════════════════════════════════════════

export {
  Alert,
  Banner,
  EmptyState,
  Divider,
  Stack,
  Box,
  Text,
  Heading,
  AlertStyles,
} from './Alert';

export type {
  AlertVariant,
  AlertProps,
  BannerProps,
  EmptyStateProps,
  DividerProps,
  StackProps,
  BoxProps,
  TextProps,
  HeadingProps,
} from './Alert';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS & NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

export {
  ProgressCircle,
  Steps,
  Accordion,
  Breadcrumb,
  SidebarNav,
  ProgressNavStyles,
} from './Progress';

export type {
  ProgressCircleProps,
  Step,
  StepsProps,
  AccordionItem,
  AccordionProps,
  BreadcrumbItem,
  BreadcrumbProps,
  NavItem,
  SidebarNavProps,
} from './Progress';

// ═══════════════════════════════════════════════════════════════════════════
// TAGS, TIMELINE, RATING & SLIDER
// ═══════════════════════════════════════════════════════════════════════════

export {
  Tag,
  TagInput,
  Timeline,
  Rating,
  Slider,
  RangeSlider,
  ColorPicker,
  TagTimelineStyles,
} from './TagTimeline';

export type {
  TagVariant,
  TagSize,
  TagProps,
  TagInputProps,
  TimelineItem,
  TimelineProps,
  RatingProps,
  SliderProps,
  RangeSliderProps,
  ColorPickerProps,
} from './TagTimeline';

// ═══════════════════════════════════════════════════════════════════════════
// FILE UPLOAD & IMAGE
// ═══════════════════════════════════════════════════════════════════════════

export {
  FileUpload,
  FileList,
  Image,
  Gallery,
  Lightbox,
  DraggableList,
  FileImageStyles,
} from './FileImage';

export type {
  FileInfo,
  FileUploadProps,
  FileListProps,
  ImageProps,
  GalleryProps,
  LightboxProps,
  DraggableItem,
  DraggableListProps,
} from './FileImage';

// ═══════════════════════════════════════════════════════════════════════════
// CALENDAR & DATE/TIME PICKERS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Calendar,
  DatePicker,
  DateRangePicker,
  TimePicker,
  CalendarStyles,
} from './Calendar';

export type {
  CalendarProps,
  DatePickerProps,
  DateRangePickerProps,
  TimePickerProps,
} from './Calendar';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL UI KIT STYLES COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UIKitStyles - Renders all component CSS in one place.
 * Include this once at the root of your app.
 */
export const UIKitStyles: React.FC = () => (
  <>
    <LoadingStyles />
    <ModalStyles />
    <ButtonStyles />
    <FormStyles />
    <CardBadgeStyles />
    <DropdownTooltipTabsStyles />
    <TableStyles />
    <AlertStyles />
    <ProgressNavStyles />
    <TagTimelineStyles />
    <FileImageStyles />
    <CalendarStyles />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT INVENTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COMPLETE UI KIT INVENTORY
 * 
 * Total: 80+ Components
 * 
 * Layout & Structure (8):
 * - Stack, Box, Divider, Card, CardHeader, CardBody, CardFooter, CardImage
 * 
 * Forms & Inputs (12):
 * - Input, Textarea, Select, Checkbox, Radio, RadioGroup, Switch, FormGroup
 * - TagInput, Slider, RangeSlider, ColorPicker
 * 
 * Buttons (4):
 * - Button, IconButton, ButtonGroup, LinkButton
 * 
 * Data Display (15):
 * - Table, DataGrid, Pagination, Badge, StatusBadge, CounterBadge
 * - Avatar, AvatarGroup, Tag, Timeline, Rating, ProgressCircle, Steps
 * - Image, Gallery
 * 
 * Feedback (10):
 * - Toast, Alert, Banner, EmptyState, Spinner, LoadingOverlay
 * - ProgressBar, Skeleton (8 variants), PulsingDot, Lightbox
 * 
 * Overlays (5):
 * - Modal, ConfirmDialog, AlertDialog, Dropdown, Popover
 * 
 * Navigation (6):
 * - Tabs, TabPanel, Tooltip, Accordion, Breadcrumb, SidebarNav
 * 
 * Typography (2):
 * - Text, Heading
 * 
 * Date/Time (4):
 * - Calendar, DatePicker, DateRangePicker, TimePicker
 * 
 * File Handling (3):
 * - FileUpload, FileList, DraggableList
 * 
 * Utilities (11):
 * - ErrorBoundary (4 variants), CommandPalette, KeyboardShortcutsHelp
 * - OfflineStatus (3 variants), PWAComponents (3)
 */
