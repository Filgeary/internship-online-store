import fs from "fs"
import path from "path"
import express from "express"
import fetch from "node-fetch"

const createServer = async () => {
  const app = express()
  let vite

  if (process.env.NODE_ENV === "development") {
    vite = await (
      await import("vite")
    ).createServer({
      server: { middlewareMode: true },
      appType: "custom",
    })
    app.use(vite.middlewares)
  } else {
    app.use((await import("compression")).default())
    app.use(
      (await import("serve-static")).default(path.resolve("src/dist/client"), {
        index: false,
      }),
    )
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl
    let template, render

    try {
      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("/src/index.html"), "utf-8")

        template = await vite.transformIndexHtml(url, template)

        render = (await vite.ssrLoadModule("src/entry-server.tsx")).render
      } else {
        template = fs.readFileSync(
          path.resolve("src/dist/client/index.html"),
          "utf-8"
        )
        render = (await import("./src/dist/server/entry-server.js")).render
      }

      const response = await fetch(`http://example.front.ylab.io/api/v1/articles?limit=10&skip=20`)
      const result = await response.json()

      const appHtml = await render({path: url, data: result.result.items})
      const data = `<script>window.__SSR_DATA__=${JSON.stringify(
        result.result.items
      )}</script>`

      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--ssr-data-->`, data)

      res.status(200).set({"Content-Type": "text/html"}).end(html)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        vite.ssrFixStacktrace(error)
      }
      next(error)
    }
  })

  app.listen(5174)
}

createServer().then(() => {
  console.log("http://localhost:5174")
})