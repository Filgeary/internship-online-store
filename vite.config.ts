import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: env.BASE_URL,
    root: path.resolve(__dirname, "src"),
    build: {
      outDir: isSsrBuild
        ? path.resolve(__dirname, "dist/server")
        : path.resolve(__dirname, "dist/client"),
      sourcemap: true,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
    server: {
      hmr: true,
      host: true,
      port: Number(env.PORT),
      proxy: {
        "/api/v1": {
          target: env.API_URL,
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };
});
