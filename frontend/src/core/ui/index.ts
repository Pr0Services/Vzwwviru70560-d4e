/**
 * CHE·NU™ — Core UI Components Index
 * 
 * Système de labels et composants UI canoniques
 */

// Labels & Constants
export * from './labels';

// Components
export { Tooltip } from './Tooltip';
export { NavigationBar, type NavigationMode, type NavigationBarProps } from './NavigationBar';
export { CommunicationBar, type CommunicationBarProps } from './CommunicationBar';
export {
  MiniMapView,
  ClarificationBanner,
  WindowTitleBar,
  AgentAccessBadge,
  type MiniMapViewProps,
  type ClarificationBannerProps,
  type WindowTitleBarProps,
  type AgentAccessBadgeProps,
} from './ContextComponents';

// Default export
export default {
  // Lazy loading
  Tooltip: () => import('./Tooltip'),
  NavigationBar: () => import('./NavigationBar'),
  CommunicationBar: () => import('./CommunicationBar'),
  ContextComponents: () => import('./ContextComponents'),
};
