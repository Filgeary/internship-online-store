import express from "express";
import fs from "fs/promises";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import ReactDOMServer from "react-dom/server";

const isDev = process.env.NODE_ENV === "development";
const port = Number(process.env.PORT) || 8010;
const apiBase = process.env.API_BASE || "http://example.front.ylab.io";

async function createServer() {
  const app = express();
  let vite;

  if (isDev) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("./dist/client"), { index: false }));
  }

  const apiProxy = createProxyMiddleware({
    target: apiBase,
    changeOrigin: true,
    secure: false,
  });

  app.use("/api/v1", apiProxy);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    let template;
    let render;

    try {
      if (isDev) {
        const rootTemplate = await fs.readFile("./src/index.html", "utf-8");
        template = await vite.transformIndexHtml(url, rootTemplate);
        render = (await vite.ssrLoadModule("./entry-server.tsx")).render;
      } else {
        template = await fs.readFile("./dist/client/index.html", "utf-8");
        render = (await import("../dist/server/entry-server.js")).render;
      }

      const { app, services } = render({ url });
      ReactDOMServer.renderToString(app);
      await services.ssrPromises.donePromises();
      const htmlRenderSecond = ReactDOMServer.renderToString(app);

     /*  const initialState = `<script id="preload">
        window.__SSR_STATE__ =${JSON.stringify(services.store.getState())}
        </script>`; */

      let html = template
        .replace(`<!--root-->`, htmlRenderSecond)
        //.replace(`<!--data-->`, initialState);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (e instanceof Error) {
        if (isDev) vite?.ssrFixStacktrace(e);
        next(e);
      }
    }
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}
createServer();
