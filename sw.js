// Name of the cache
const CACHE_NAME = "my-cache-v1";

// List of assets to cache
const ASSETS = [
  "/", // Cache the root directory
  "/index.html",
  "/styles/index.css",
  "/scripts/script.js",
  "/favicons/favicon.ico",
  "/images/logo.jpg",
  "/images/heroimg.jpg",
  "/images/instagram.png",
  "/images/linkedin.png",
  "/images/facebook.png",
  "/images/twitter.png",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache...", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching...", event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Cache the new resource dynamically
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
