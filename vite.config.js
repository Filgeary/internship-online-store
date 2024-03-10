import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from 'vite-plugin-svgr';



export default defineConfig({
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
    assetsDir: "./",
    emptyOutDir: true,
  },

  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    svgr()
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 8010,
    proxy: {
      "/api/v1": {
        target: "http://example.front.ylab.io",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
