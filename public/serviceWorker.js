var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/index.html'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
        //consoole.log('Opened cache');
        return cache.addAll(urlsToCache);
        })
    );
    //ver
    self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
    .then(function(response) {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }))
});

// Update a service worker
/*
self.addEventListener('activate', event => {
  var cacheWhitelist = ['pwa-task-manager'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});*/