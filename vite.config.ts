import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@context': resolve(__dirname, './src/context'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Code splitting par route
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'icons': ['react-icons'],
        },
      },
    },
    // Alerte si un chunk dépasse 500kB
    chunkSizeWarningLimit: 500,
  },
  // Optimisations
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
