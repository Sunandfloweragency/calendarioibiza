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
        minify: 'esbuild',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              icons: ['@heroicons/react']
            }
          },
          onwarn(warning, warn) {
            // Ignorar advertencias específicas
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
            if (warning.code === 'CIRCULAR_DEPENDENCY') return;
            warn(warning);
          }
        }
      },
      
      // Configuración ESBuild para ignorar errores TS en build
      esbuild: {
        logOverride: { 
          'this-is-undefined-in-esm': 'silent',
          'empty-import-meta': 'silent'
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
