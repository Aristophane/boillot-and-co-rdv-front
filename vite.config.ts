import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888', // Change this to your backend server URL
        changeOrigin: true,
        rewrite: (path: string) => path.replace('', ''),
      },
    },
  }
})
