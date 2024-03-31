import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Services from './services';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import { ChatProvider } from './chat/context';
import config from './config';
import App from './app';

declare global {
  interface Window {
    __SSR_DATA__: object; // Состояние с сервера
    __SSR_REQUESTS__: Array<string>; // Запросы с сервера
  }
}

const ssrData = window.__SSR_DATA__;
delete window.__SSR_DATA__;

console.log('ssrData:', ssrData);

const services = new Services(config, { ...ssrData });

export const root = hydrateRoot(
  document.getElementById?.('root') as HTMLElement,
  <Provider store={services.redux}>
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <ChatProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChatProvider>
      </I18nProvider>
    </ServicesContext.Provider>
  </Provider>
);
