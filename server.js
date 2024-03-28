import fs from "fs"
import path from "path"
import express from "express"
import fetch from "node-fetch"

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
      (await import("serve-static")).default(path.resolve("src/dist/client"), {
        index: false,
      }),
    ) // Использование статических ресурсов из директории сборки
  }

  app.use("*", async (req, res, next) => {  // Middleware для обработки всех запросов
    const url = req.originalUrl
    let template, render

    try {
      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("/src/index.html"), "utf-8")  // Чтение шаблона в режиме разработки

        template = await vite.transformIndexHtml(url, template)  // Преобразование шаблона с использованием Vite

        render = (await vite.ssrLoadModule("src/entry-server.tsx")).render  // Загрузка и рендеринг серверного кода с использованием Vite
      } else {
        template = fs.readFileSync(
          path.resolve("src/dist/client/index.html"),
          "utf-8"
        )
        render = (await import("./src/dist/server/entry-server.js")).render  // Загрузка и рендеринг серверного кода в продакшене
      }

      const response = await fetch(`http://example.front.ylab.io/api/v1/articles?limit=10&skip=20`)
      const result = await response.json()

      const appHtml = await render({path: url, data: result.result.items})  // Рендеринг HTML контента с использованием серверного кода
      const data = `<script>window.__SSR_DATA__=${JSON.stringify(
        result.result.items
      )}</script>`  // Подготовка данных для передачи на клиент

      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)  // Замена метки на HTML контент
        .replace(`<!--ssr-data-->`, data)   // Вставка данных о контенте

      res.status(200).set({"Content-Type": "text/html"}).end(html)   // Отправка ответа с HTML контентом
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        vite.ssrFixStacktrace(error)  // Исправление стека вызовов в режиме разработки
      }
      next(error)  // Передача ошибки на обработку следующему middleware
    }
  })

  app.listen(5174)  // Запуск сервера на порту 5174
}

createServer().then(() => {
  console.log("http://localhost:5174")
})