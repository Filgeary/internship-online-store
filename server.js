/* eslint-disable import/no-named-as-default-member */
import express from 'express';
import fs from 'node:fs/promises';
import { renderToString } from 'react-dom/server';

import { logger } from './src/utils/logger';

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
      // eslint-disable-next-line import/no-unresolved
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const { appJSX, headJSX, services } = await render({
      url: originalUrl,
      ssrManifest,
      title: isProduction ? `Prod | SSR React app` : `Dev | SSR React app`,
      initState: {},
    });
    renderToString(appJSX); // initial render
    const headAsString = renderToString(headJSX);

    const ssrService = services.ssr;
    await ssrService.executeAllPromises();
    const initialJobsDump = ssrService.getStateOfPromisesAsDump();
    logger.success('server.js => Jobs Dump is Ready:');
    logger.info(JSON.stringify(initialJobsDump, null, 2));

    const appAsStringWithData = renderToString(appJSX);

    const stateDump = services.store.getState();
    logger.success('server.js => stateDump is Ready');

    const scriptAsStringWithState = `<script id="__INITIAL_STATE__" type="application/json">${JSON.stringify(stateDump)}</script>`;
    const scriptAsStringWithJobsDump = `<script id="__INITIAL_JOBS_DUMP__" type="application/json">${JSON.stringify(initialJobsDump)}</script>`;

    const htmlTemplate = template
      .replace(`<!--app-head-->`, headAsString ?? '')
      .replace(`<!--app-html-->`, appAsStringWithData ?? '')
      .replace(`<!--app-data-->`, scriptAsStringWithState ?? '')
      .replace(`<!--app-jobs-dump-->`, scriptAsStringWithJobsDump ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(htmlTemplate);
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
