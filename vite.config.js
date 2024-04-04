import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src",
  base: "/",
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  build: {
    outDir: "../dist",
   // assetsDir: "./",
    emptyOutDir: true,
   // ssrEmitAssets: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
/*   ssr: {
    // Названия пакетов, которые нужно добавить в сборку при SSR вместо импорта из node_modules
    noExternal: ["redux-thunk"],
  }, */
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
