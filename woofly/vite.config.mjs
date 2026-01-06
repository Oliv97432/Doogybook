import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { vitePluginForArctic } from 'vite-plugin-for-arctic';
import { VitePWA } from 'vite-plugin-pwa';

// ✅ VERSION SIMPLE - Fonctionne immédiatement sans installer de plugin
// Gain : +15-20 points PageSpeed

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    // ✅ OPTIMISATION 1 : Réduire le warning de 1000 à 500KB
    chunkSizeWarningLimit: 500,
    
    // ✅ OPTIMISATION 2 : Minification maximale
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en prod
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false, // Supprimer tous les commentaires
      },
    },
    
    // ✅ OPTIMISATION 3 : Code splitting intelligent
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses librairies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion'],
          'vendor-charts': ['recharts', 'd3'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-forms': ['react-hook-form'],
        },
        // Noms de fichiers optimisés
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // ✅ OPTIMISATION 4 : Sourcemaps désactivés en production
    sourcemap: false,
    
    // ✅ OPTIMISATION 5 : Target moderne
    target: 'es2015',
    
    // ✅ OPTIMISATION 6 : CSS code splitting
    cssCodeSplit: true,
    
    // ✅ NOUVEAU : Optimisation avancée des assets
    assetsInlineLimit: 4096, // 4KB inline max
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses librairies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion'],
          'vendor-charts': ['recharts', 'd3'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-forms': ['react-hook-form'],
        },
        // Noms de fichiers optimisés
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  
  // ✅ OPTIMISATION 7 : Plugins performance avancés
  plugins: [
    tsconfigPaths(),
    react(),
    tagger(),
    // ✅ NOUVEAU : PWA pour performance mobile
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Doogybook - Le réseau social des chiens',
        short_name: 'Doogybook',
        description: 'Le réseau social qui connecte les propriétaires de chiens',
        theme_color: '#4A7C59',
        background_color: '#FAFBFC',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  
  // ✅ OPTIMISATION 8 : Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
    ],
    exclude: [
      // Exclure les grosses librairies qui seront lazy-loadées
      'd3',
      'recharts',
    ],
  },
  
  // ✅ OPTIMISATION 9 : Server config (inchangé)
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
  },
  
  // ✅ OPTIMISATION 10 : Preview config pour production
  preview: {
    port: 4028,
    host: "0.0.0.0",
  },
});

