
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // Permite accesos externos
    port: 5173,        // Asegura que escuche en este puerto
    strictPort: true,
    hmr: {
      clientPort: 5173, // Permite WebSockets desde la IP del servidor
      host: process.env.VITE_HMR_HOST || "164.90.160.181", // Reemplaza con la IP de tu servidor
    }
  }
})

