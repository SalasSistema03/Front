import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),

  ],
  server: {
    proxy: {
      '/imagenes': {
        target: 'http://localhost',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // --- AGREGAMOS ESTO ---
  build: {
    sourcemap: false, // Esto evita que el código original sea legible en la pestaña "Sources"
    outDir: '../../backEnd/public',
    // CAMBIA ESTO A FALSE:
    emptyOutDir: false,
  },
})
