import express from "express";
import fs from "fs/promises";
import path from "path";
import { ViteDevServer } from "vite";
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 8010;

const app = express();
let vite: ViteDevServer;

if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
} else {
  const apiProxy = createProxyMiddleware({
    target: process.env.API_BASE,
    changeOrigin: true,
    secure: false,
  });

  app.use('/api/v1', apiProxy);

  app.use(express.static(path.resolve("./dist/client"), { index: false }));
}

app.use("*", async (req, res, next) => {
  const url = req.originalUrl;
  let template: string;
  let render: ({path}: {path: string}) => string;
  
  try {
    if (!isProduction) {
      const rootTemplate = await fs.readFile("src/index.html", "utf-8");
      template = await vite.transformIndexHtml(url, rootTemplate);
      render = (await vite.ssrLoadModule("src/entry-server.tsx")).render;
    } else {
      template = await fs.readFile("./dist/client/index.html", "utf-8");
      render = (
        await import("../dist/server/entry-server.js")
      ).render;
    }
    const renderer = render({ path: url });
    const html = template.replace(`<!--ssr-outlet-->`, renderer);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e: unknown) {
    if(e instanceof Error) {
      if(!isProduction) vite?.ssrFixStacktrace(e);
      next(e);
    }
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
