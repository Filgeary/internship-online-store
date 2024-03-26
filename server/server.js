import express from "express";
import fs from "fs/promises";
import path from "path";
import { createProxyMiddleware } from 'http-proxy-middleware';


const isDev = process.env.NODE_ENV === "development";
const port = Number(process.env.PORT) || 8010;

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

  let template;

  let render;
  
  try {
    if (isDev) {
      const rootTemplate = await fs.readFile("./src/index.html", "utf-8");
      template = await vite.transformIndexHtml(url, rootTemplate);
      render = (await vite.ssrLoadModule("./entry-server.tsx")).render;
    } else {
      template = await fs.readFile("./dist/client/index.html", "utf-8");
      render = (
        await import("../dist/server/entry-server.js")
      ).render;
    }

    const renderer = render({ url: url });
    const html = template.replace(`<!--root-->`, renderer);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);

  } catch (e) {

    if(e instanceof Error) {

      if(isDev) vite?.ssrFixStacktrace(e);
      
      next(e);
    }
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
}
createServer()