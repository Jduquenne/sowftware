import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from https://<user>.github.io/sowftware/ on GitHub Pages — base and
// the PWA start_url/scope must match the repo name or every asset 404s.
const base = '/sowftware/'

export default defineConfig({
  base,
  // WSL2 + Windows-mounted path (/mnt/e/...): inotify events don't propagate
  // through drvfs, so chokidar misses file changes without polling.
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Jardin Planner',
        short_name: 'Jardin',
        description: 'Planifiez semis, récoltes, disposition et arrosage de votre jardin.',
        lang: 'fr',
        theme_color: '#166534',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
