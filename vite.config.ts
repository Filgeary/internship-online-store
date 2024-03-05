import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: true,
    port: 5000,

    proxy: {
      '/api': {
        target: 'http://example.front.ylab.io',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'ws://example.front.ylab.io',
        ws: true,
      },
    },
  },
});
