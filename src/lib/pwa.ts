// Registers the offline service worker (public/sw.js) in production builds only,
// so the dev server never serves stale code.

/** Unique per build (see vite.config.ts `define`). */
declare const __BUILD_ID__: string;

/** Files in public/ (besides dino art) the app needs offline. Kept in sync with public/ui by pwa.test.ts. */
export const UI_FILES = [
  'backdrop-cretaceous.svg',
  'backdrop-jurassic.svg',
  'backdrop-triassic.svg',
  'badge-level-1.svg',
  'badge-level-2.svg',
  'badge-level-3.svg',
  'egg-crack-1.svg',
  'egg-crack-2.svg',
  'egg.svg',
  'hero-trex-blink.svg',
  'levelup-burst.svg',
  'star-empty.svg',
  'star.svg',
  'sticker-book.svg',
];

const APP_FILES = ['manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.svg'];

/** Every non-bundled URL to precache, relative to the deploy base. */
export function offlineUrls(base: string, dinoIds: string[]): string[] {
  return [
    ...APP_FILES.map((f) => `${base}${f}`),
    ...UI_FILES.map((f) => `${base}ui/${f}`),
    `${base}dinos/_placeholder.svg`,
    ...dinoIds.map((id) => `${base}dinos/${id}.svg`),
  ];
}

export function registerServiceWorker(precacheUrls: string[] = []): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const url = `${import.meta.env.BASE_URL}sw.js?v=${encodeURIComponent(__BUILD_ID__)}`;
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
