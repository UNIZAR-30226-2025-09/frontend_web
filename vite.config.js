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

  if (mode === 'cloud') {
    return {
      ...baseConfig,
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

  return baseConfig;
});

// NUBE
/*
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['tailwindcss/version.js']
    }
  }
})
*/
/*
// Frontend local, Backend remoto
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // Permite acceder desde cualquier IP en la red local
    port: 5173,
    strictPort: false, // Permite usar otro puerto si el 5173 está ocupado
    hmr: true,        // Hot Module Replacement activado
    proxy: {
      // Todas las peticiones que comienzan con /request se redirigen al servidor remoto
      '/request': {
        target: 'http://164.90.160.181',
        changeOrigin: true,
        rewrite: (path) => path
      },
    },
  },
  build: {
    sourcemap: true,  // Para facilitar la depuración
    cssCodeSplit: true,
  }
});
*/

