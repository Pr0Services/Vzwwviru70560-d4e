/**
 * CHE·NU Service Worker
 * 
 * Provides offline support for the application:
 * - Cache-first for static assets
 * - Network-first for API calls with fallback
 * - Background sync for pending actions
 * - Push notifications support
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `chenu-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `chenu-dynamic-${CACHE_VERSION}`;
const API_CACHE = `chenu-api-${CACHE_VERSION}`;

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache for offline
const CACHEABLE_API_PATTERNS = [
  /\/api\/v1\/spheres$/,
  /\/api\/v1\/agents$/,
  /\/api\/v1\/threads$/,
  /\/api\/v1\/dashboard\/stats$/,
  /\/api\/v1\/auth\/me$/
];

// API endpoints that should never be cached
const NO_CACHE_API_PATTERNS = [
  /\/api\/v1\/auth\/login$/,
  /\/api\/v1\/auth\/logout$/,
  /\/api\/v1\/checkpoints/,
  /\/api\/v1\/nova/
];

// ============================================================================
// INSTALL EVENT
// ============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Precaching failed:', error);
      })
  );
});

// ============================================================================
// ACTIVATE EVENT
// ============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                name.startsWith('chenu-') &&
                name !== STATIC_CACHE &&
                name !== DYNAMIC_CACHE &&
                name !== API_CACHE
              );
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// ============================================================================
// FETCH EVENT
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests for caching
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }
  
  // Default: network-first with cache fallback
  event.respondWith(handleDynamicRequest(request));
});

// ============================================================================
// REQUEST HANDLERS
// ============================================================================

/**
 * Handle API requests with network-first strategy
 */
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this endpoint should never be cached
  if (NO_CACHE_API_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    return fetch(request);
  }
  
  // Check if this endpoint is cacheable
  const isCacheable = CACHEABLE_API_PATTERNS.some((pattern) => 
    pattern.test(url.pathname)
  );
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses for cacheable endpoints
    if (response.ok && isCacheable) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache:', url.pathname);
    
    // Try cache fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add header to indicate offline data
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-From-Cache', 'true');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers
      });
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'You are offline. This data is not available.',
        cached: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle static assets with cache-first strategy
 */
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    return new Response('Asset not available offline', { status: 503 });
  }
}

/**
 * Handle navigation requests
 */
async function handleNavigation(request) {
  try {
    // Try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] Navigation failed, serving offline page');
    
    // Try to serve cached index.html
    const cachedIndex = await caches.match('/index.html');
    if (cachedIndex) {
      return cachedIndex;
    }
    
    // Fallback to offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    return new Response(
      '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

/**
 * Handle dynamic requests with network-first strategy
 */
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Not available offline', { status: 503 });
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json'
  ];
  
  return staticExtensions.some((ext) => url.pathname.endsWith(ext));
}

// ============================================================================
// BACKGROUND SYNC
// ============================================================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(syncPendingActions());
  }
});

/**
 * Sync pending actions when back online
 */
async function syncPendingActions() {
  // Get pending actions from IndexedDB
  // For now, just log - implement with IndexedDB later
  console.log('[SW] Syncing pending actions...');
  
  // Notify clients that sync is complete
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      timestamp: Date.now()
    });
  });
}

// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'CHE·NU',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Open app or focus existing window
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if available
      const existingClient = clients.find((client) => {
        return client.url.includes(self.location.origin);
      });
      
      if (existingClient) {
        return existingClient.focus();
      }
      
      // Open new window
      const url = event.notification.data?.url || '/';
      return self.clients.openWindow(url);
    })
  );
});

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((names) => {
          return Promise.all(names.map((name) => caches.delete(name)));
        }).then(() => {
          event.source.postMessage({ type: 'CACHE_CLEARED' });
        })
      );
      break;
      
    case 'GET_CACHE_STATUS':
      event.waitUntil(
        getCacheStatus().then((status) => {
          event.source.postMessage({ type: 'CACHE_STATUS', status });
        })
      );
      break;
  }
});

/**
 * Get current cache status
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }
  
  return status;
}

console.log('[SW] Service Worker loaded');
