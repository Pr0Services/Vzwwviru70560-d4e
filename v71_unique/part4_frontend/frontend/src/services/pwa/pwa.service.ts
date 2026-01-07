/**
 * CHE·NU™ Service Worker Registration & PWA Utilities
 * 
 * Handles SW registration, updates, and PWA installation.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SWRegistrationResult {
  success: boolean;
  registration?: ServiceWorkerRegistration;
  error?: Error;
}

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type SWUpdateCallback = (registration: ServiceWorkerRegistration) => void;
export type PWAInstallCallback = (event: PWAInstallPromptEvent) => void;

// ═══════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════

let swRegistration: ServiceWorkerRegistration | null = null;
let deferredInstallPrompt: PWAInstallPromptEvent | null = null;
const updateCallbacks: Set<SWUpdateCallback> = new Set();
const installCallbacks: Set<PWAInstallCallback> = new Set();

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE WORKER REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<SWRegistrationResult> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker not supported');
    return { success: false, error: new Error('Service Worker not supported') };
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    swRegistration = registration;
    console.log('[PWA] Service Worker registered:', registration.scope);

    // Check for updates on registration
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('[PWA] New version available');
            updateCallbacks.forEach(cb => cb(registration));
          }
        });
      }
    });

    // Listen for controller change (SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Controller changed, reloading...');
      window.location.reload();
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return { success: true, registration };
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return { success: false, error: error as Error };
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    
    if (result) {
      console.log('[PWA] Service Worker unregistered');
      swRegistration = null;
    }
    
    return result;
  } catch (error) {
    console.error('[PWA] Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Check for service worker updates
 */
export async function checkForUpdates(): Promise<boolean> {
  if (!swRegistration) {
    return false;
  }

  try {
    await swRegistration.update();
    return true;
  } catch (error) {
    console.error('[PWA] Update check failed:', error);
    return false;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(): void {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Register callback for service worker updates
 */
export function onUpdate(callback: SWUpdateCallback): () => void {
  updateCallbacks.add(callback);
  return () => updateCallbacks.delete(callback);
}

// ═══════════════════════════════════════════════════════════════════════════
// PWA INSTALLATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize PWA install prompt listener
 */
export function initPWAInstall(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e as PWAInstallPromptEvent;
    console.log('[PWA] Install prompt captured');
    
    installCallbacks.forEach(cb => cb(deferredInstallPrompt!));
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredInstallPrompt = null;
  });
}

/**
 * Check if PWA can be installed
 */
export function canInstall(): boolean {
  return deferredInstallPrompt !== null;
}

/**
 * Check if app is already installed
 */
export function isInstalled(): boolean {
  // Check display mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check iOS standalone
  if ((navigator as any).standalone === true) {
    return true;
  }

  // Check if launched from home screen (PWA)
  if (document.referrer.includes('android-app://')) {
    return true;
  }

  return false;
}

/**
 * Prompt user to install PWA
 */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredInstallPrompt) {
    console.warn('[PWA] Install prompt not available');
    return 'unavailable';
  }

  try {
    await deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    
    console.log('[PWA] Install prompt result:', result.outcome);
    
    if (result.outcome === 'accepted') {
      deferredInstallPrompt = null;
    }
    
    return result.outcome;
  } catch (error) {
    console.error('[PWA] Install prompt failed:', error);
    return 'unavailable';
  }
}

/**
 * Register callback for install prompt availability
 */
export function onInstallAvailable(callback: PWAInstallCallback): () => void {
  installCallbacks.add(callback);
  
  // Call immediately if already available
  if (deferredInstallPrompt) {
    callback(deferredInstallPrompt);
  }
  
  return () => installCallbacks.delete(callback);
}

// ═══════════════════════════════════════════════════════════════════════════
// CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Clear all service worker caches
 */
export async function clearCache(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.success ?? false);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );
  });
}

/**
 * Get total cache size
 */
export async function getCacheSize(): Promise<number> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(0);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.size ?? 0);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [messageChannel.port2]
    );
  });
}

/**
 * Precache specific URLs
 */
export async function precacheUrls(urls: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.success ?? false);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CACHE_URLS', urls },
      [messageChannel.port2]
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log('[PWA] Notification permission:', permission);
  return permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!swRegistration) {
    console.error('[PWA] Service Worker not registered');
    return null;
  }

  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('[PWA] Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('[PWA] Push subscription failed:', error);
    return null;
  }
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!swRegistration) {
    return null;
  }

  return swRegistration.pushManager.getSubscription();
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  const subscription = await getPushSubscription();
  
  if (!subscription) {
    return true;
  }

  try {
    const result = await subscription.unsubscribe();
    console.log('[PWA] Push unsubscription:', result);
    return result;
  } catch (error) {
    console.error('[PWA] Push unsubscription failed:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND SYNC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register background sync
 */
export async function registerBackgroundSync(tag: string = 'chenu-sync'): Promise<boolean> {
  if (!swRegistration || !('sync' in swRegistration)) {
    console.warn('[PWA] Background Sync not supported');
    return false;
  }

  try {
    await (swRegistration as any).sync.register(tag);
    console.log('[PWA] Background Sync registered:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Background Sync registration failed:', error);
    return false;
  }
}

/**
 * Register periodic background sync
 */
export async function registerPeriodicSync(
  tag: string = 'chenu-periodic-sync',
  minInterval: number = 60 * 60 * 1000 // 1 hour
): Promise<boolean> {
  if (!swRegistration || !('periodicSync' in swRegistration)) {
    console.warn('[PWA] Periodic Sync not supported');
    return false;
  }

  try {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    });

    if (status.state !== 'granted') {
      console.warn('[PWA] Periodic Sync permission not granted');
      return false;
    }

    await (swRegistration as any).periodicSync.register(tag, { minInterval });
    console.log('[PWA] Periodic Sync registered:', tag);
    return true;
  } catch (error) {
    console.error('[PWA] Periodic Sync registration failed:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Format cache size for display
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get service worker status
 */
export function getServiceWorkerStatus(): {
  supported: boolean;
  registered: boolean;
  active: boolean;
  waiting: boolean;
} {
  return {
    supported: 'serviceWorker' in navigator,
    registered: swRegistration !== null,
    active: swRegistration?.active !== null,
    waiting: swRegistration?.waiting !== null,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize all PWA features
 */
export async function initPWA(): Promise<void> {
  console.log('[PWA] Initializing CHE·NU PWA...');
  
  // Register service worker
  const result = await registerServiceWorker();
  
  if (result.success) {
    // Initialize install prompt listener
    initPWAInstall();
    
    // Register background sync
    await registerBackgroundSync();
    
    // Try periodic sync
    await registerPeriodicSync();
    
    console.log('[PWA] CHE·NU PWA initialized successfully');
  } else {
    console.warn('[PWA] CHE·NU PWA initialization failed');
  }
}

export default {
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
  
  // Push
  requestNotificationPermission,
  subscribeToPush,
  getPushSubscription,
  unsubscribeFromPush,
  
  // Sync
  registerBackgroundSync,
  registerPeriodicSync,
  
  // Utils
  formatCacheSize,
  getServiceWorkerStatus,
  
  // Init
  initPWA,
};
