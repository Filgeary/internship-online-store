import React from 'react';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import Services from './services';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import { ChatProvider } from './chat/context';
import config from './config';
import App from './app';
import createStoreRedux from './store-redux';

type TProps = {
  path: string;
  initialState: object;
};

// React.useLayoutEffect = React.useEffect;
if (!global.window) {
  global.window = {} as Window & typeof globalThis;
}

if (!global.document) {
  global.document = {} as Document;
}

export const render = ({ path, initialState }: TProps) => {
  const services = new Services(config, { ...initialState });

  // const htmlRender = renderToString(
  const app = (
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <ChatProvider>
            <StaticRouter location={path}>
              <App />
            </StaticRouter>
          </ChatProvider>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  );

  return { app, services };
};
