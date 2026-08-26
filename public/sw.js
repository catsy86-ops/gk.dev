// GK.dev Advanced PWA Service Worker v2.0
// High-Performance Multi-Tier Caching & Offline Resilience

const CACHE_VERSION = "v2";
const CACHE_NAMES = {
  core: `gkdev-core-${CACHE_VERSION}`,
  assets: `gkdev-assets-${CACHE_VERSION}`,
  runtime: `gkdev-runtime-${CACHE_VERSION}`,
};

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.svg",
  "/icon-512.svg",
];

// Max items for dynamic caches to prevent unbounded storage consumption
const MAX_RUNTIME_ITEMS = 60;

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
}

// 1. Install Event: Pre-cache application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAMES.core)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Purge obsolete cache tiers
self.addEventListener("activate", (event) => {
  const currentCaches = Object.values(CACHE_NAMES);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (!currentCaches.includes(cache)) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent multi-strategy caching
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension or chrome-extension schemes
  if (request.method !== "GET" || !url.protocol.startsWith("http")) return;

  // A. Navigation requests (HTML pages): Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAMES.core).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          const fallbackShell = await caches.match("/index.html");
          return fallbackShell || Response.error();
        })
    );
    return;
  }

  // B. Static Assets (Vite Bundles, Styles, SVGs, WOFF2 Fonts): Cache-First + Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff2") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAMES.assets).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // C. Dynamic & API requests: Network-First with Runtime Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAMES.runtime).then((cache) => {
            cache.put(request, responseClone);
            trimCache(CACHE_NAMES.runtime, MAX_RUNTIME_ITEMS);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ offline: true, message: "Offline mode active" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      })
  );
});

// 4. Message Event: Remote control (skipWaiting, cache clear)
self.addEventListener("message", (event) => {
  if (event.data) {
    if (event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
    if (event.data.type === "CLEAR_CACHE") {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
});
