/**
 * Exotic Expenditures Service Worker
 * Provides offline functionality and performance improvements
 */

const CACHE_NAME = 'exotic-expenditures-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/faq.html',
  '/membership.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/contributions/setup.html',
  '/contributions/manage.html',
  '/css/bundle.min.css',
  '/css/contributions.css',
  '/css/dashboard.css',
  '/js/bundle.min.js',
  '/js/visual-animations.js',
  '/js/gallery.js',
  '/js/contributions.js',
  '/js/dashboard.js',
  '/assets/favicons/site.webmanifest',
  '/assets/favicons/favicon.ico',
  '/assets/favicons/apple-touch-icon.png',
  '/assets/favicons/favicon-32x32.png',
  '/assets/favicons/favicon-16x16.png',
  '/assets/world-map.svg'
];

// Installation - Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests and Google Analytics
  if (event.request.method !== 'GET' || 
      event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('google-analytics.com')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Update cache with fresh content
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If the request is for an image, return a fallback
            if (event.request.url.match(/\.(jpe?g|png|gif|svg|webp)$/)) {
              return caches.match('/assets/images/placeholder.jpg');
            }
            
            // For HTML pages, return the 404 page
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/404.html');
            }
            
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for forms
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    event.waitUntil(syncForms());
  }
});

// Handle queued form submissions when back online
async function syncForms() {
  try {
    const dbName = 'exotic-expenditures-forms';
    const storeName = 'formData';
    
    // Open the database
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onerror = reject;
      request.onsuccess = event => resolve(event.target.result);
      
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
    
    // Get all stored form submissions
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const formDataList = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = reject;
      request.onsuccess = event => resolve(event.target.result);
    });
    
    // Process each form submission
    for (const formData of formDataList) {
      try {
        // Send the form data to the server
        const response = await fetch(formData.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.data)
        });
        
        if (response.ok) {
          // If successful, remove the item from IndexedDB
          store.delete(formData.id);
        }
      } catch (error) {
        console.error('Failed to sync form data:', error);
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to sync forms:', error);
    return Promise.reject(error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New adventure update!',
    icon: '/assets/favicons/android-chrome-192x192.png',
    badge: '/assets/favicons/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Exotic Expenditures', options)
  );
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        const url = event.notification.data.url;
        
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});