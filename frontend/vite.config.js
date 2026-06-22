import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
