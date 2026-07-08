// Minimal service worker for repeat-visit speed on the static export.
//
// Strategy (intentionally simple — this is a portfolio site, not an offline app):
//  - /_next/static/*  → cache-first. These URLs are content-hashed by Next.js, so a
//                        cached response is never stale: a code change always ships
//                        under a new hash/URL.
//  - HTML documents    → network-first with a cache fallback, so a fresh deploy is
//                        picked up immediately when online, while offline/flaky
//                        connections still get the last-seen page instead of an error.
//  - everything else   → stale-while-revalidate (fonts, icons, images): instant from
//                        cache, refreshed in the background for next time.
//
// Bump CACHE_VERSION whenever this strategy changes to drop old caches on activate.

const CACHE_VERSION = "v2";
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
            )
            .then(() => self.clients.claim())
    );
});

function isNextStaticAsset(url) {
    return url.pathname.startsWith("/_next/static/");
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
    }
    return response;
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw err;
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(() => undefined);
    return cached || (await networkPromise) || fetch(request);
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (isNextStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
        event.respondWith(networkFirst(request));
        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});
