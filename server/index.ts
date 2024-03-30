import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import ReactDOMServer from 'react-dom/server';

import fs from 'node:fs/promises';
import path from 'node:path';

import qs from 'query-string';

import type { ViteDevServer } from 'vite';
import type { TMethod, TParams } from './types';

import { API_URL, PORT, WS_CHAT_URL } from './config';

import { catalogController, categoriesController, articleController } from './controllers';

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log({ isDev, isProd });

async function createServer() {
  const app = express();
  let vite: ViteDevServer | null = null;
  let render: ({ path }: { path: string; initialState: object }) => Record<string, any> = null;
  let template: string = '';

  if (isDev) {
    vite = await (
      await import('vite')
    ).createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist', 'client')));
  }

  const apiProxy = createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    secure: false,
  });
  const chatProxy = createProxyMiddleware({
    target: WS_CHAT_URL,
    ws: true,
  });

  app.use('/api/v1', apiProxy);
  app.use('/chat/v1', chatProxy);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    const method = req.method.toLowerCase() as TMethod;
    let ssrData = {};

    console.log({ url });

    const params = qs.parse(url.slice(2)) as TParams;
    const paramsKeys = Object.keys(params);
    const rootParams = ['query', 'sort', 'category', 'countries'];

    // Запросы за каталогом и категориями - только на корне
    if (url === '/' || paramsKeys.some((val) => rootParams.includes(val))) {
      // Обработка запросов для инициализации стора каталога
      const catalog = await catalogController(params, method);
      ssrData = {
        ...ssrData,
        ...catalog,
      };

      // Запрос за категориями
      const categories = await categoriesController(params, method);
      ssrData = {
        ...ssrData,
        ...categories,
      };
    }

    // Запросы за товаром - на странице товара
    if (/.+\/.+/i.test(url)) {
      const articleId = url.split('/').at(-1);
      const updatedParams = {
        ...params,
        articleId,
      };
      const article = await articleController(updatedParams, method);
      ssrData = {
        ...ssrData,
        ...article,
      };
    }

    try {
      if (isDev) {
        template = (await fs.readFile(path.resolve(process.cwd(), 'src', 'index.html'))).toString();
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('../src/entry-server.tsx')).render;
      } else {
        template = (
          await fs.readFile(path.resolve(process.cwd(), 'dist', 'client', 'index.html'))
        ).toString();
        render = (await import(path.resolve(process.cwd(), 'dist', 'server', 'entry-server.js')))
          .render;
      }

      const { app, services } = render({ path: url, initialState: {} });

      const htmlWithoutData = ReactDOMServer.renderToString(app);

      await services.suspense.execAllPromises();

      const htmlWithData = ReactDOMServer.renderToString(app);
      console.log(htmlWithData);

      const jsonSsrData = JSON.stringify(services.store.getState());
      let t = services.store.getState();
      setTimeout(() => {
        console.log('finally:', t);
      }, 1000);
      const jsonRequestsOnSsrData = JSON.stringify(services.suspense.executedPromises);
      const appendedScript = `<script>window.__SSR_DATA__=${jsonSsrData};window.__SSR_REQUESTS__=${jsonRequestsOnSsrData}</script>`;

      const resHtml = template
        .replace('<!-- ROOT -->', htmlWithData)
        .replace('<!-- SSR_DATA -->', appendedScript);

      res.status(200).set({ 'Content-type': 'text/html' }).end(resHtml);
    } catch (error) {
      if (isDev) {
        vite.ssrFixStacktrace(error);
      }
      next(error);
    }
  });

  app.listen(PORT, () => {
    console.log('Started');
  });
}

process.on('unhandledRejection', () => {});

createServer();
