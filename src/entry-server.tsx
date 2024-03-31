import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';

import App from './app';
import config from './config';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import Services from './services';

const services = new Services(config);
const ssr = services.ssr;
const ctx = {};

// eslint-disable-next-line import/no-named-as-default-member
React.useLayoutEffect = React.useEffect;

export function render({
  url,
  ssrManifest,
  newHtmlTemplate,
  title,
}: {
  url: string;
  ssrManifest: any;
  newHtmlTemplate: string;
  title: string;
}) {
  if (ssrManifest) {
    // TODO: where append ssrManifest?
  }

  if (newHtmlTemplate) {
    console.log('newHtmlTemplate', newHtmlTemplate);
  }

  const html = renderToString(
    newHtmlTemplate || (
      <Provider store={services.redux}>
        <ServicesContext.Provider value={services}>
          <I18nProvider>
            <StaticRouter location={url}>
              <App />
            </StaticRouter>
          </I18nProvider>
        </ServicesContext.Provider>
      </Provider>
    ),
    ctx,
  );

  const head = renderToString(<title>{title}</title>);

  return { html, head, ssr };
}
