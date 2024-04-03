import fs from "node:fs";
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import React from "react";
import ReactDOMServer from "react-dom/server";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dotenv.config({ path: ".env.development" });
}

const port = process.env.VITE_PORT || "5000";

async function createServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use(express.static("./dist/srv/client/assets"));

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // const managerCreator = (await vite.ssrLoadModule("./src/server/manager.ts")).manager;
    // const manager = managerCreator();
    // const services =  await manager.prepareData(url);

    try {
      let template = fs.readFileSync("./src/index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);

      const render = (await vite.ssrLoadModule("./src/server/entry-server.tsx")).render;

      const { app, services } = render({ url });
      let htmlRender = ReactDOMServer.renderToString(app);

      await services.promises.waitPromises();

      htmlRender = ReactDOMServer.renderToString(app);

      const initialState = `<script id="preload">
        window.__STATE_NAMES__=${JSON.stringify(services.promises.names)}
        window.__PRELOADED_STATE__ =${JSON.stringify(services.store.getState())}
        </script>`

      let html = template.replace(`<!--ssr-outlet-->`, `${htmlRender}${initialState}`);

      const css = fs.readFileSync(`./dist/style.css`, "utf-8");

      html = html.replace(`<style></style>`, `<style>${css}</style>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);

    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  app.listen(port, () => console.log(`port ${port}`));
}

createServer().then(() => console.log("Server started"));
