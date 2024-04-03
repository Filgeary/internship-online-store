import { renderToString } from "react-dom/server";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { ViteDevServer } from "vite";
import * as dotenv from 'dotenv';
import { TRender } from './type.ts';
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 8010;
const base = process.env.BASE_URL || "/"

const app = express();
let vite: ViteDevServer;

if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base
  });
  app.use(vite.middlewares);
} else {
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: process.env.API_URL,
      changeOrigin: true,
      secure: false,
    })
  );
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv(path.resolve("./dist/client"), { extensions: [] }));
}

app.use(express.json());

app.use("/*", async (req, res, next) => {
  const url = req.originalUrl;
  let template: string;
  let render: TRender;

  try {
    if (!isProduction) {
      const rootTemplate = await fs.readFile("src/index.html", "utf-8");
      template = await vite.transformIndexHtml(url, rootTemplate);
      render = (await vite.ssrLoadModule("src/entry-server.tsx")).render;
    } else {
      template = await fs.readFile("./dist/client/index.html", "utf-8");
      //@ts-ignore
      render = (
        await import("../dist/server/entry-server.js")
        ).render;
      }

      const { app, services } = render({ path: url });

      services.ssr.setPath(req._parsedUrl?.search);

      renderToString(app);
      await services.ssr.execute();
      const renderer = renderToString(app);

      const store = services.store.getState();
      const initialState = `<script id="preload">window.__PRELOADED_STATE__ = ${JSON.stringify(store).replace(
        /</g,
        "\\u003c"
        )}</script>`;

      const html = template.replace(`<!--ssr-outlet-->`, renderer).replace(`<!--ssr-preload-->`, initialState);

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
