import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import fs from 'node:fs/promises';
import path from 'node:path';

import qs from 'query-string';

import type { ViteDevServer } from 'vite';
import type { TMethod, TParams } from './types';

import { API_URL, WS_CHAT_URL } from './config';

import { catalogController, categoriesController } from './controllers';

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log({ isDev, isProd });

async function createServer() {
  const app = express();
  let vite: ViteDevServer | null = null;
  let render: ({ path }: { path: string; initialState: object }) => string | null = null;
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

    const params = qs.parse(url.slice(2)) as TParams;

    // Запросы за каталогом и категориями - только на корне
    if (url === '/') {
      // Обработка запросов для инициализации стора каталога
      const catalog = await catalogController(params, method);
      ssrData = {
        ...ssrData,
        ...catalog,
      };

      // Запрос за категориями
      const categories = await categoriesController(params, method);
      console.log({ categories });
      ssrData = {
        ...ssrData,
        ...categories,
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

      const jsonSsrData = JSON.stringify(ssrData);
      const appendedScript = `<script>window.__SSR_DATA__=${jsonSsrData}</script>`;
      const appHtml = render({ path: url, initialState: ssrData }); // @TODO прокидывать data

      const resHtml = template
        .replace('<!-- ROOT -->', appHtml)
        .replace('<!-- SSR_DATA -->', appendedScript);

      res.status(200).set({ 'Content-type': 'text/html' }).end(resHtml);
    } catch (error) {
      if (isDev) {
        vite.ssrFixStacktrace(error);
      }
      next(error);
    }
  });

  app.listen(5000, () => {
    console.log('Started');
  });
}

createServer();
