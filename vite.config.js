import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Todo local

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['tailwindcss/version.js']
    }
  }
})

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

