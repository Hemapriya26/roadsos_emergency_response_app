const CACHE_NAME = 'roadsos-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event - Pre-cache core shell resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core App Shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing Old Cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic routing and live API exemptions
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // EXEMPTIONS: Dynamic external services (Firebase, OpenStreetMap, Overpass API, Scraper Endpoint)
  // These should ALWAYS be live network-first without local storage caching to maintain 100% real-time GPS & data stability.
  const isDynamicAPI = 
    requestUrl.hostname.includes('overpass-api.de') || 
    requestUrl.hostname.includes('firebase') || 
    requestUrl.hostname.includes('googleapis') || 
    requestUrl.pathname.includes('/api/fetch-phone') ||
    requestUrl.pathname.includes('/.netlify/functions/fetch-phone') ||
    requestUrl.hostname.includes('tile.openstreetmap.org') ||
    event.request.method !== 'GET';

  if (isDynamicAPI) {
    // Return live network fetch directly
    return event.respondWith(fetch(event.request));
  }

  // STANDARD RESOURCE ROUTING: Network-first, fallback to cache for shell assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the freshly loaded valid assets in the background
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is down/offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If completely offline and not in cache, fallback to main index.html for React routing
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
