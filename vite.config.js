import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    // Solo activar devtools si estamos en modo 'serve' (desarrollo)
    command === 'serve' ? vueDevTools() : [],
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // 2. Usa esbuild (nativo en Rust/Go) en lugar de Terser
    minify: 'esbuild', 
    
    // 3. Desactiva los sourcemaps para reducir el tiempo de escritura y memoria
    sourcemap: false,
    
    // 4. Aumenta el límite de advertencia de tamaño de chunk si es necesario
    chunkSizeWarningLimit: 1000,
    
    // 5. Optimización de Rollup/Rolldown para agrupar librerías pesadas
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
}))
