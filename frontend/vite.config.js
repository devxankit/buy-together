import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Split big, rarely-changing third-party libs into their own chunks so they
    // cache independently of app code and download in parallel. Firebase in
    // particular is large and should not sit in the main bundle.
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) expects a function form. Bucket heavy deps by the
        // path segment in node_modules so each lands in its own cacheable chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux';
          if (id.includes('axios') || id.includes('socket.io')) return 'net';
          if (
            id.includes('react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
          return 'vendor';
        },
      },
    },
    // Raise the warning threshold a touch; real chunks are now well under it.
    chunkSizeWarningLimit: 700,
  },
});
