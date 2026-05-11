const CACHE_NAME = 'pos-app-v1'
const URLS_TO_CACHE = [
  '/pos/',
  '/pos/index.html',
  '/pos/manifest.json',
]

// Install - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  self.clients.claim()
})

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip API calls - always go to network
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) return response
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      })
      .catch(() => {
        // Return a fallback response when offline
        if (event.request.destination === 'document') {
          return caches.match('/pos/index.html')
        }
      })
  )
})
