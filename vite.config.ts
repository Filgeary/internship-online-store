import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: "../build",
    sourcemap: true,
  },
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
