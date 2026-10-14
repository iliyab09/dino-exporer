import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // '/' locally; '/dino-exporer/' for GitHub Pages (set by the Pages workflow).
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
