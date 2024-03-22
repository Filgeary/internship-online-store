import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import fs from 'fs/promises';
import path from 'path';

import type { ViteDevServer } from 'vite';

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log({ isDev, isProd });

async function createServer() {
  const app = express();
  let vite: ViteDevServer | null = null;
  let render: ({ path }: { path: string }) => string | null = null;
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

    const apiProxy = createProxyMiddleware({
      target: 'http://example.front.ylab.io',
      changeOrigin: true,
      secure: false,
    });
    const chatProxy = createProxyMiddleware({
      target: 'ws://example.front.ylab.io/chat',
      ws: true,
    });

    app.use('/api/v1', apiProxy);
    app.use('/chat/v1', chatProxy);
  }

  app.get('/', async (req, res, next) => {
    const url = req.originalUrl;

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

      const appHtml = render({ path: url });
      const resHtml = template.replace('<!-- Root -->', appHtml);

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
