import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      hooks: path.resolve(__dirname, './src/hooks'),
      utils: path.resolve(__dirname, './src/utils'),
      contexts: path.resolve(__dirname, './src/contexts'),
      lib: path.resolve(__dirname, './src/lib')
    }
  },
  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks optimisés
          if (id.includes('node_modules')) {
            // PDF libraries - LAZY LOAD FORCÉ
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf-lazy';
            }
            // Charts - LAZY LOAD
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts-lazy';
            }
            // React core - CRITICAL
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            // Router - CRITICAL
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Supabase - CRITICAL
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // UI libraries - Splittées
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            // Form libraries
            if (id.includes('react-hook-form')) {
              return 'vendor-forms';
            }
            // Redux
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'vendor-state';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'vendor-dates';
            }
            // Autres vendors
            return 'vendor-misc';
          }
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
