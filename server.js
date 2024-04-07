/* eslint-disable import/no-named-as-default-member */
import express from 'express';
import fs from 'node:fs/promises';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';

import { logger } from './src/utils/logger';
const IS_SSR_MODE = true;

class RenderStream extends Writable {
  chunks = [];
  render = '';

  getRender() {
    return this.render;
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback) {
    this.render = Buffer.concat(this.chunks).toString();
    callback();
  }
}

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : '';
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
/**
 * @type {import('vite').ViteDevServer}
 */
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  const { createProxyMiddleware } = await import('http-proxy-middleware');
  const apiProxy = createProxyMiddleware('/api/v1', {
    target: 'http://example.front.ylab.io',
    secure: false,
    changeOrigin: true,
  });
  app.use(apiProxy);
  app.use(express.json());

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: ['js', 'css', 'ico'] }));
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const originalUrl = req.originalUrl;
    logger.info('originalUrl:', originalUrl);

    let template = '';
    /**
     * @type {import('./src/entry-server.tsx').render}
     */
    let render;

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(originalUrl, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      // @ts-expect-error Unable to resolve type in dist folder
      // eslint-disable-next-line import/no-unresolved
      render = (await import('./dist/server/entry-server.js')).render;
    }

    // send HTML directly if SSR is not active
    if (!IS_SSR_MODE) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(template);
      return;
    }

    const { Root, injections } = await render({
      url: originalUrl,
      ssrManifest,
    });

    // react-dom/server renderToPipeableStream
    const renderStream = new RenderStream();
    const htmlStream = renderToPipeableStream(Root, {
      onShellReady() {
        logger.success('server.js => onShellReady | PIPE STREAM');
      },
      onAllReady() {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        htmlStream.pipe(renderStream);
        logger.success('server.js => onAllReady');
      },
      onError(err) {
        if (err instanceof Error) {
          vite?.ssrFixStacktrace(err);
          logger.error(err.stack);
          res.status(500).end(err.stack);
        }
      },
    });

    renderStream.on('finish', () => {
      logger.success('server.js => on finish | PIPE STREAM');
      const renderStreamResult = renderStream.getRender();
      const stateDump = injections.stateDump();
      const initialJobsDump = injections.initialJobsDump();

      const initialStateString = `<script id="__INITIAL_STATE__">window.__INITIAL_STATE__ = ${JSON.stringify(stateDump)}</script>`;
      const initialJobsDumpString = `<script id="__INITIAL_JOBS_DUMP__">window.__INITIAL_JOBS_DUMP__ = ${JSON.stringify(initialJobsDump)}</script>`;

      const htmlTemplate = template
        .replace('</head>', initialStateString + initialJobsDumpString + '</head>')
        .replace('<!--app-html-->', renderStreamResult);

      res.status(200).set({ 'Content-Type': 'text/html' }).send(htmlTemplate);
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    logger.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  logger.success(`Server started at http://localhost:${port}`);
});
