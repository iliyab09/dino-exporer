import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // '/' locally; '/dino-exporer/' for GitHub Pages (set by the Pages workflow).
  base: process.env.VITE_BASE ?? '/',
  define: {
    // Changes on every build (commit SHA in CI), so even art-only deploys
    // install a fresh service worker. See src/lib/pwa.ts.
    __BUILD_ID__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 8) ?? Date.now().toString(36)),
  },
  plugins: [react()],
})
