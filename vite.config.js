import { defineConfig } from "vite";
import simpleHtmlPlugin from "vite-plugin-simple-html";
import react from "@vitejs/plugin-react";
import path from "path";
import css from "vite-plugin-css";

export default defineConfig({
  root: "src",
  build: {
    cssCodeSplit: true,
    outDir: "./dist",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api/v1/": {
        target: "http://example.front.ylab.io",
        secure: false,
        changeOrigin: true,
      },
    },
  },

  plugins: [
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: "**/*.{jsx,tsx}",
    }),
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },

  mode: process.env.NODE_ENV,
  define: {
    'process.env': {},
  },

  ssr: {
    // Названия пакетов, которые нужно добавить в сборку при SSR вместо импорта из node_modules
    noExternal: [
      'redux-thunk'
    ]
  },
});
