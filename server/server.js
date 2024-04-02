import fs from "fs"
import path from "path"
import express from "express"
import fetch from "node-fetch"
import ReactDOMServer from "react-dom/server"
import { createProxyMiddleware } from "http-proxy-middleware"

const apiBase = process.env.API_BASE || "http://example.front.ylab.io"

const createServer = async () => {
  const app = express()
  let vite

  if (process.env.NODE_ENV === "development") {
    vite = await (
      await import("vite") // Динамический импорт Vite для сервера разработки
    ).createServer({
      server: { middlewareMode: true },
      appType: "custom",
    })
    app.use(vite.middlewares) // Использование middleware сервера Vite
  } else {
    app.use((await import("compression")).default()) // Использование сжатия для статических ресурсов
    app.use(
      (await import("serve-static")).default(path.resolve("dist/client"), {
        index: false,
      }),
    ) // Использование статических ресурсов из директории сборки
  }

  const apiProxy = createProxyMiddleware({
    target: apiBase,
    changeOrigin: true,
    secure: false,
  });

  app.use("/api/v1", apiProxy);


  app.use("*", async (req, res, next) => {  // Middleware для обработки всех запросов
    const url = req.originalUrl
    let template, render

    console.log('url', url)

    try {
      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("src/index.html"), "utf-8")  // Чтение шаблона в режиме разработки

        template = await vite.transformIndexHtml(url, template)  // Преобразование шаблона с использованием Vite

        render = (await vite.ssrLoadModule("src/entry-server.tsx")).render  // Загрузка и рендеринг серверного кода с использованием Vite

      } else {
        template = fs.readFileSync(
          path.resolve("dist/client/index.html"),
          "utf-8"
        )
        render = (await import("../dist/server/entry-server.js")).render  // Загрузка и рендеринг серверного кода в продакшене
      }

      // const responseForCatalog = await fetch(`http://example.front.ylab.io/api/v1/articles?limit=10&skip=0`)
      // const resultForCatalog = await responseForCatalog.json()

      // const allResult = {catalog: {list: resultForCatalog.result.items}} 

      // const appHtml = await render({path: url, data: allResult})  // Рендеринг HTML контента с использованием серверного кода
      // const data = `<script>window.__SSR_DATA__=${JSON.stringify(
      //  allResult
      // )}</script>`  // Подготовка данных для передачи на клиент

      const { app, services } = render({ url })

      ReactDOMServer.renderToString(app)

      await services.server.awaitPromises()

      const htmlRenderSecond = ReactDOMServer.renderToString(app)

      // const initialState = `<script id="preload">
      //   window.__SSR_DATA__ =${JSON.stringify(services.store.getState())}
      //   </script>`


      const html = template
        .replace(`<!--ssr-outlet-->`, `${htmlRenderSecond}${initialState}`)  // Замена метки на HTML контент
        //.replace(`<!--ssr-data-->`, data)   // Вставка данных о контенте

      res.status(200).set({"Content-Type": "text/html"}).end(html)   // Отправка ответа с HTML контентом
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        vite.ssrFixStacktrace(error)  // Исправление стека вызовов в режиме разработки
      }
      next(error)  // Передача ошибки на обработку следующему middleware
    }
  })

  app.listen(8010)  // Запуск сервера на порту 5174
}

createServer().then(() => {
  console.log("http://localhost:8010")
})