import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import ReactDOMServer from 'react-dom/server';

import fs from 'node:fs/promises';
import path from 'node:path';

import type { ViteDevServer } from 'vite';

import { API_URL, PORT, WS_CHAT_URL } from './config';

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
    app.use(express.static(path.resolve(process.cwd(), 'dist', 'client'), { index: false }));
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

    console.log({ window: global.window });
    // Блокировка чтобы не потерять window у другого пользователя
    await new Promise((resolve) => {
      const started = performance.now();

      setInterval(() => {
        if (!global.window) resolve(null);
        const step = performance.now();

        if (started - step > 1500) resolve(null);
      }, 10);
    });
    global.window = {
      location: {
        search: url.slice(1),
      },
    } as Window & typeof globalThis;

    console.log({ url });

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

      const jsonSsrData = JSON.stringify(services.store.getState());
      const jsonRequestsOnSsrData = JSON.stringify(services.suspense.executedPromises);

      console.log({ jsonSsrData });

      const appendedScript = `<script>window.__SSR_DATA__=${jsonSsrData};window.__SSR_REQUESTS__=${jsonRequestsOnSsrData}</script>`;

      const resHtml = template
        .replace('<!-- ROOT -->', htmlWithData)
        .replace('<!-- SSR_DATA -->', appendedScript);

      res.status(200).set({ 'Content-type': 'text/html' }).end(resHtml);

      delete global.window;
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
