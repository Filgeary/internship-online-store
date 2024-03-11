/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
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
  test: {
    include: ['**/*.spec.ts', '**/*.spec.tsx'],
    globals: true,
  },
  server: {
    hmr: true,
    port: 5000,

    proxy: {
      '/api/v1': {
        target: 'http://example.front.ylab.io',
        changeOrigin: true,
        secure: false,
      },
      '/chat/v1': {
        target: 'ws://example.front.ylab.io/chat',
        ws: true,
      },
    },
  },
  preview: {
    port: 5000,
  },
});
