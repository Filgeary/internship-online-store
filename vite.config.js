import { defineConfig } from 'vite';
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js'
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api/v1/': {
        target: 'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      }
    },
  },

  plugins: [
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});
