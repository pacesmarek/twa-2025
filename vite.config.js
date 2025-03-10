import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    host: 'twa-2025.test',
    port: 5173,
    strictPort: true,
    watch: {
      include: ['src/js/**/*.js', 'src/css/**/*.scss']
    },
    hmr: {
      protocol: 'ws',
      host: 'twa-2025.test',
      clientPort: 5173
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: './src/js/main.js'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  css: {
    devSourcemap: true
  }
});
