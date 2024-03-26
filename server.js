import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'


async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: {middlewareMode: true},
    appType: "custom"
  });

  app.use(vite.middlewares);

  app.use("/", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync('./src/index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      const render  = (await vite.ssrLoadModule('./src/server/entry-server.tsx')).render;
      const test = render({url});

      const html = template.replace(`<!--ssr-outlet-->`, test);

      console.log(html)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);

    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  })

  app.listen(3000, () => console.log("port 3000"));
}

createServer().then(() => console.log("Server started"));
