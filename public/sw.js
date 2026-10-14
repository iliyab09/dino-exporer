// Dino Explorer service worker: offline after the first visit, never stale.
// - The app registers this file as sw.js?v=<build id>. Every build gets a new
//   script URL, so the browser installs a fresh worker and the old cache is dropped.
// - Page loads: network first (4 s timeout), fall back to the cached page.
// - Install: precaches index.html plus every JS/CSS file it references.
// - The app posts all art/icon URLs after load (src/lib/pwa.ts) so everything works offline.
// - Hashed build files (/assets/): cache first. Everything else (art, icons):
//   stale-while-revalidate, so updated art shows on the next visit.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = `dino-explorer-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname;

async function precacheShell() {
  const cache = await caches.open(CACHE);
  const res = await fetch(SCOPE, { cache: 'no-cache' });
  if (!res.ok) return;
  const html = await res.clone().text();
  await cache.put(SCOPE, res);
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|svg|webmanifest|png))"/g)]
    .map((m) => new URL(m[1], self.location.href))
    .filter((u) => u.origin === self.location.origin)
    .map((u) => u.pathname);
  // One missing file must not fail the whole install, so add them one by one.
  await Promise.all([...new Set(assets)].map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith('dino-explorer-') && k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'precache' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        event.data.urls.map((url) =>
          cache.match(url, { ignoreVary: true }).then((hit) => hit || cache.add(url).catch(() => undefined)),
        ),
      ),
    ),
  );
});

const NAV_TIMEOUT_MS = 4000;

/** Network for page loads, but don't leave a kid staring at a blank screen on bad Wi-Fi. */
function networkFirstPage(req) {
  const network = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(SCOPE, copy));
    }
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, NAV_TIMEOUT_MS));
  const cached = () => caches.match(SCOPE);
  return Promise.race([network, timeout.then(cached)])
    .then((res) => res || network)
    .catch(() => cached().then((hit) => hit || network));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirstPage(req));
    return;
  }

  // ignoreVary: module scripts are requested with an Origin header that the
  // precache request did not have; servers often send Vary: Origin.
  const cachedResponse = caches.match(req, { ignoreVary: true });
  const fromNetwork = () =>
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
      }
      return res;
    });

  // Build output under /assets/ is content-hashed and never changes: cache first.
  if (url.pathname.startsWith(`${SCOPE}assets/`)) {
    event.respondWith(cachedResponse.then((hit) => hit || fromNetwork()));
    return;
  }

  // Everything else (dino art, UI art, icons) keeps its name across deploys:
  // serve the cached copy instantly and refresh it in the background.
  event.respondWith(
    cachedResponse.then((hit) => {
      const refresh = fromNetwork();
      if (hit) {
        event.waitUntil(refresh.catch(() => undefined));
        return hit;
      }
      return refresh;
    }),
  );
});
