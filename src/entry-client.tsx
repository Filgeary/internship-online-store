import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import config from './config';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import Services from './services';

const initialState = window.__INITIAL_STATE__.textContent;
const initialJobsDump = window.__INITIAL_JOBS_DUMP__.textContent;

const services = new Services(config, JSON.parse(initialState || '{}'));
services.ssr.initWithStateDump(JSON.parse(initialJobsDump || '{}'));

window.__INITIAL_STATE__ = null;
window.__INITIAL_JOBS_DUMP__ = null;

// remove script tags with __INITIAL_STATE__ and __INITIAL_JOBS_DUMP__
setTimeout(() => {
  const scripts = document.querySelectorAll('script[id^="__INITIAL_"]');
  scripts.forEach(script => script.remove());
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
