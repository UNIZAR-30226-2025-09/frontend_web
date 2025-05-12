import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Todo local

// TEST PRUEBAS
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [react()],
    build: {
      rollupOptions: {
        external: ['tailwindcss/version.js']
      }
    }
  };

  if (mode === 'test') {
    return {
      ...baseConfig,
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.js'
      }
    };
  }

  if (mode === 'nube') {
    return {
      plugins: [react()],
      server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        hmr: {
          clientPort: 5173,
          host: "164.90.160.181",
        },
        proxy: {
          '/request': {
            target: 'http://164.90.160.181/request',
            changeOrigin: true,
          },
        },
      },
    };
  }
  
  if (mode === 'enlocal') {
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          external: ['tailwindcss/version.js']
        }
      }
    };
  }

  return baseConfig;
});

