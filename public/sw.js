const CACHE_NAME = "muslim-pro-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.ico"];

// Requests that should never be intercepted by the SW
function shouldBypass(url, request) {
  // Non-same-origin or non-GET
  if (request.method !== "GET" || url.origin !== self.location.origin) return true;
  // Next.js internals: HMR, RSC payloads, static chunks
  if (url.pathname.startsWith("/_next/")) return true;
  // API routes — always fetch live, never cache
  if (url.pathname.startsWith("/api/")) return true;
  // Admin routes — never serve stale auth pages
  if (url.pathname.startsWith("/admin")) return true;
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (shouldBypass(url, event.request)) {
    return; // Let the browser handle it normally
  }

  // Navigation requests: network-first, fall back to cache then shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached ?? (await caches.match("/")) ?? Response.error();
        }),
    );
    return;
  }

  // Static assets: cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Only cache valid same-origin responses
          if (!response.ok) return response;
          const copy = response.clone();
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => Response.error());
    }),
  );
});
