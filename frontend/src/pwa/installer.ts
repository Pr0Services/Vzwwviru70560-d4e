/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — PWA INSTALLER
 * Phase 9: Mobile & PWA
 * ═══════════════════════════════════════════════════════════════════════════
 */

export class PWAInstaller {
  private deferredPrompt: unknown = null;
  private isInstalled = false;

  constructor() {
    this.init();
  }

  private init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => logger.debug('[PWA] Service worker registered', reg))
        .catch((err) => logger.error('[PWA] Service worker error', err));
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      logger.debug('[PWA] Install prompt available');
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      logger.debug('[PWA] App installed');
    });
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      logger.debug('[PWA] No install prompt available');
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    logger.debug('[PWA] User choice:', outcome);
    this.deferredPrompt = null;

    return outcome === 'accepted';
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
}

export const pwaInstaller = new PWAInstaller();
