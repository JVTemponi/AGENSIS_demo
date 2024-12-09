import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Permite acesso externo no Docker
    port: 5173, // Porta usada pelo Vite
    watch: {
      usePolling: true, // Garante que mudanças sejam detectadas no Docker
    },
  },
})
