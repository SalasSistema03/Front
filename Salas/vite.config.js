import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],

  server: {
    

    proxy: {
      '/imagenes': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    sourcemap: false,

    // Vue está en un proyecto separado de Laravel.
    // Salimos del proyecto Vue y entramos en backEnd/public.
    outDir: '../../backEnd/public',

    // IMPORTANTE:
    // No borrar todo public/, porque Laravel puede tener
    // otros archivos que no pertenecen a Vue.
    emptyOutDir: false,

    rollupOptions: {
      output: {
        // Hash para evitar que el navegador utilice
        // un JS viejo desde la caché.
        entryFileNames: 'assets/index-[hash].js',

        // Los chunks también tendrán hash.
        chunkFileNames: 'assets/index-[name]-[hash].js',

        // CSS, imágenes, fuentes, etc.
        assetFileNames: 'assets/index-[hash][extname]',
      },
    },
  },
})