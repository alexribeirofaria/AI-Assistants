import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { environment } from './environments/environment';
import AppServerModule from './main.server';

function resolveApiTarget(): string {
  const baseUrl = (environment.BASE_URL ?? '').trim();
  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl;
  }

  const apiTarget = (process.env['API_TARGET'] ?? '').trim();
  if (/^https?:\/\//i.test(apiTarget)) {
    return apiTarget;
  }

  return 'http://127.0.0.1:5000';
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angularapp/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine({
    allowedHosts: [/* Configure your hosts here */]
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Proxy API calls in SSR mode to keep same behavior as ng serve + proxy.conf.cjs
  server.use(
    '/api',
    createProxyMiddleware({
      target: resolveApiTarget(),
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api': '' }
    }),
  );

  // Serve static files from /browser
  server.use(express.static(distFolder, {
    maxAge: '1y',
    index: false,
  }));

  // All regular routes use the Angular engine
  server.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
      return next();
    }

    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
