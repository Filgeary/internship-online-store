import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlPurge from "vite-plugin-purgecss";
import { createHtmlPlugin } from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    htmlPurge(),
    tsconfigPaths(),
    createHtmlPlugin({
      entry: "index.tsx",
      template: "index.html",
      inject: {
        data: {
          title: "Simple SPA",
          injectScript: `<script type='module' src="./inject.tsx"></script>`,
        },
      },
    }),
  ],
  root: "src",
  build: {
    outDir: "../build",
    sourceMap: true,
  },
  mode: process.env.NODE_ENV,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
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
