import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      },
    },
    hmr: false, // it doesn't work with renderToPipeableStream
  },
  build: {
    target: 'esnext',
  },
});
