import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import config from './config';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import Root from './root';
import Services from './services';

const services = new Services(config, window.__INITIAL_STATE__);
services.ssr.initWithStateDump(window.__INITIAL_JOBS_DUMP__);

const isProduction = process.env.NODE_ENV === 'production';
const head = <title>{isProduction ? `Prod | SSR React app` : `Dev | SSR React app`}</title>;

// remove scripts starts with id __INITIAL
setTimeout(() => {
  document.querySelectorAll('script[id^="__INITIAL"]').forEach(script => script.remove());
}, 0);

hydrateRoot(
  document,
  <Root
    app={
      <Provider store={services.redux}>
        <ServicesContext.Provider value={services}>
          <I18nProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </I18nProvider>
        </ServicesContext.Provider>
      </Provider>
    }
    head={head}
  />,
);
