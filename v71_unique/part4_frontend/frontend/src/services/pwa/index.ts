/**
 * CHE·NU™ PWA Services
 * 
 * Service Worker, Push Notifications, Background Sync, and Installation.
 * 
 * @version V72.0
 */

export {
  // Registration
  registerServiceWorker,
  unregisterServiceWorker,
  checkForUpdates,
  skipWaiting,
  onUpdate,
  
  // Installation
  initPWAInstall,
  canInstall,
  isInstalled,
  promptInstall,
  onInstallAvailable,
  
  // Cache
  clearCache,
  getCacheSize,
  precacheUrls,
  
  // Push Notifications
  requestNotificationPermission,
  subscribeToPush,
  getPushSubscription,
  unsubscribeFromPush,
  
  // Background Sync
  registerBackgroundSync,
  registerPeriodicSync,
  
  // Utilities
  formatCacheSize,
  getServiceWorkerStatus,
  
  // Initialization
  initPWA,
} from './pwa.service';

export type {
  SWRegistrationResult,
  PWAInstallPromptEvent,
  SWUpdateCallback,
  PWAInstallCallback,
} from './pwa.service';
