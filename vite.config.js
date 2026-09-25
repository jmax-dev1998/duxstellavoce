import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // Only enable vue-devtools in development to reduce prod payload ~ 0
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    sourcemap: false,
    // Reduce enormous payload warning threshold after optimization
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'firebase'
          if (id.includes('node_modules/bootstrap')) return 'bootstrap'
          if (id.includes('node_modules/vue-router') || id.includes('node_modules/pinia') || id.includes('node_modules/vue')) return 'vue-vendor'
          if (id.includes('node_modules')) return 'vendor'
        },
        // Hash assets for efficient caching (Cache-Control immutable)
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
}))
