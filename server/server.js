import express from "express";
import fs from "fs/promises";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

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

  const responseCatalog = await fetch(
    `http://example.front.ylab.io/api/v1/articles?limit=10&fields=items%28*%29%2Ccount&sort=order`
  );
  const catalog = await responseCatalog.json();
  /*  const data = `<script>window.__SSR_DATA__=${JSON.stringify(
       catalog.result.items
       )}</script>`   */
  const responseCategories = await fetch(
    "http://example.front.ylab.io/api/v1/categories?fields=_id,title,parent(_id)&limit=*"
  );
  const categories = await responseCategories.json();

  let data = {
    catalog: catalog.result.items,
    categories: categories.result.items,
  };

  const datas = `<script>window.__SSR_DATA__=${JSON.stringify(
    catalog.result.items)}, ${JSON.stringify(categories.result.items)} 
  }</script>`


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

      const renderer = render({ url: url, data: data });
      const html = template.replace(`<!--root-->`, renderer).replace('<!--data-->', datas);
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
