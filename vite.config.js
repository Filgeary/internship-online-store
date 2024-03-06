import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlPurge from "vite-plugin-purgecss";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../build",
    sourceMap: true,
  },
  plugins: [react(), htmlPurge(), tsconfigPaths()],

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
