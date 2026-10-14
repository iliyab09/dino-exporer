// Registers the offline service worker (public/sw.js) in production builds only,
// so the dev server never serves stale code.

/**
 * A per-build id: the content hash in this bundle's own file name
 * (e.g. /assets/index-DmjRUJp5.js -> "DmjRUJp5"). New build, new id, new worker.
 */
export function buildId(moduleUrl: string): string {
  const match = /-([A-Za-z0-9_-]{6,})\.js$/.exec(new URL(moduleUrl).pathname);
  return match ? match[1] : 'dev';
}

export function registerServiceWorker(precacheUrls: string[] = []): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const url = `${import.meta.env.BASE_URL}sw.js?v=${buildId(import.meta.url)}`;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(url)
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => reg.active?.postMessage({ type: 'precache', urls: precacheUrls }))
      .catch(() => {
        // Offline support is a bonus; the app works without it.
      });
  });
}
