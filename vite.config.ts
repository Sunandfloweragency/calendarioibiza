import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
      resolve: {
        alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivar sourcemaps en producción para mejor rendimiento
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['@heroicons/react'],
              router: ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
      server: {
    port: 5176,
    host: true,
    open: true,
  },
      preview: {
    port: 5177,
    host: true,
  },
  define: {
    // Definir variables globales para optimización
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      'react-router-dom',
      'date-fns',
    ],
  },
})
