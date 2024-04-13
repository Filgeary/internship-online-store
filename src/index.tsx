// import './entry-client';

/*
  It is uncommon to call root.render on a hydrated root. Usually, you’ll update state inside one of the components instead.
  https://react.dev/reference/react-dom/client/hydrateRoot#root-render

  ---

  Dan Abramov: There is no need for a further render call.
  https://github.com/facebook/react/issues/24610
*/

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Services from './services';
import { ServicesContext } from './context';
import { I18nProvider } from './i18n/context';
import { ChatProvider } from './chat/context';
import config from './config';
import App from './app';

import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

const root = createRoot(document.getElementById('root')!);

const services = new Services(config);

root.render(
  <Provider store={services.redux}>
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <ChatProvider>
          <BrowserRouter>
            <ConfigProvider locale={ruRU}>
              <App />
            </ConfigProvider>
          </BrowserRouter>
        </ChatProvider>
      </I18nProvider>
    </ServicesContext.Provider>
  </Provider>
);
