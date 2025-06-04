import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Base path para subdominio - se puede cambiar antes de build
      base: mode === 'production' ? '/' : '/',
      
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // Optimizaciones para producción
      build: {
        target: 'esnext',
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              icons: ['@heroicons/react']
            }
          }
        }
      },
      
      // Server optimizations
      server: {
        hmr: {
          overlay: false
        }
      },
      
      // Preview mode para testing
      preview: {
        port: 5173,
        host: true
      }
    };
});
