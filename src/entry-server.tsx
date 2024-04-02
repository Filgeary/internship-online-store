/* eslint-disable import/default */
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';

import App from './app';
import config from './config';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import Services from './services';

// eslint-disable-next-line import/no-named-as-default-member
React.useLayoutEffect = React.useEffect;

export async function render({
  url,
  ssrManifest,
  title,
  initState,
}: {
  url: string;
  ssrManifest: any;
  title: string;
  initState: object;
}) {
  if (ssrManifest) {
    // TODO: where append ssrManifest?
  }

  const services = new Services(config, initState);

  const appJSX = (
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  );

  const headJSX = <title>{title}</title>;

  return { appJSX, headJSX, services };
}
