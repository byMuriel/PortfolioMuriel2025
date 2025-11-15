import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    //vueDevTools()
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://murielvitale.com',
  //       changeOrigin: true,
  //       secure: true,
  //       // rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
