import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    sourcemap: true,
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
  plugins: [viteReact()],
  mode: process.env.NODE_ENV,
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
});
