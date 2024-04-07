import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import config from './config';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import Services from './services';

const services = new Services(config, window.__INITIAL_STATE__);
services.ssr.initWithStateDump(window.__INITIAL_JOBS_DUMP__);

// remove scripts starts with id __INITIAL
setTimeout(() => {
  document.querySelectorAll('script[id^="__INITIAL"]').forEach(script => script.remove());
}, 0);

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={services.redux}>
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ServicesContext.Provider>
  </Provider>,
);
