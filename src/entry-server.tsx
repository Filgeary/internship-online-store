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

const services = new Services(config);

type TProps = {
  path: string;
};

React.useLayoutEffect = React.useEffect;
if (!global.window) {
  global.window = {} as Window & typeof globalThis;
}

if (!global.document) {
  global.document = {} as Document;
}

export const render = ({ path }: TProps) => {
  return renderToString(
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
};
