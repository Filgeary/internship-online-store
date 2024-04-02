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

// FIXME: don't work it
delete window.__INITIAL_STATE__;
delete window.__INITIAL_JOBS_DUMP__;

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
