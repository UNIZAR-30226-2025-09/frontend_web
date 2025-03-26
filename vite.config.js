import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// NUBE
/*
export default defineConfig({
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
});
*/
// LOCAL

export default defineConfig({
  plugins: [react()],
})
