import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

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

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync("./src/index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);

      const render = (await vite.ssrLoadModule("./src/server/entry-server.tsx")).render;
      const htmlString = render({ url });

      let html = template.replace(`<!--ssr-outlet-->`, htmlString);

      const css = fs.readFileSync(`./dist/assets/index.css`, "utf-8");

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
