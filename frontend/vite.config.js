import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // ── PWA / offline support ──────────────────────────────────────────
    // Generates a Workbox service worker that precaches the built app shell
    // (HTML + all JS/CSS chunks, including the lazy route chunks) so the user
    // navbar pages render with no network, and adds runtime caching so the last
    // data a user saw is replayed offline.
    //
    // The service worker is registered at scope '/'. The Firebase Cloud
    // Messaging worker is registered separately at the narrower
    // '/firebase-cloud-messaging-push-scope' (see src/services/push.js) so the
    // two never replace each other — two registrations at the same scope clobber
    // one another.
    VitePWA({
      registerType: 'autoUpdate', // SW updates itself; new version applies on next load
      injectRegister: 'auto', // injects the registration code + manifest link
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Buy Together',
        short_name: 'Buy Together',
        description: 'Group buying — band together to unlock bulk deals.',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          // SVG icon scales to every required size (modern browsers accept this).
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        // Precache every built asset the app shell needs to boot offline.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ico}'],
        // The Firebase messaging worker is its OWN service worker (registered at
        // a separate scope) — don't let Workbox precache/own it.
        globIgnores: ['**/firebase-messaging-sw.js'],
        // SPA fallback: serve index.html for offline navigations so React Router
        // can render any route. Exclude API, the FCM worker, and its push scope.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api/,
          /\/firebase-messaging-sw\.js$/,
          /^\/firebase-cloud-messaging-push-scope/,
          /^\/socket\.io/,
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // REST API GETs (matches both the dev proxy '/api' and the prod VPS
            // origin, which also carries '/api' in the path). NetworkFirst =
            // fresh when online, last cached copy when offline.
            urlPattern: ({ url, request }) =>
              request.method === 'GET' && url.pathname.includes('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 4, // fall back to cache if the network stalls
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Images (Cloudinary + any remote) — serve instantly from cache.
            urlPattern: ({ request, url }) =>
              request.destination === 'image' || /res\.cloudinary\.com/.test(url.href),
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Keep the SW off during `vite dev` (it interferes with HMR). Test
        // offline behaviour with `npm run build && npm run preview`.
        enabled: false,
      },
    }),
  ],
  // Dev only: proxy /api to the backend so the browser treats API calls as
  // same-origin and skips the CORS preflight (OPTIONS) that otherwise doubles
  // every request. Active when the app calls a relative '/api' base — i.e. when
  // VITE_API_URL is left unset in development.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
