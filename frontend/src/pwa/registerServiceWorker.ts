/**
 * CHE·NU™ - PWA Service Worker Registration
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          logger.debug('SW registered:', registration);
        })
        .catch((error) => {
          logger.error('SW registration failed:', error);
        });
    });
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return await Notification.requestPermission();
}
