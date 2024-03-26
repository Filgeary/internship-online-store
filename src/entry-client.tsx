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
    __SSR_DATA__: object;
  }
}

const ssrData = window.__SSR_DATA__;
delete window.__SSR_DATA__;

console.log('ssrData:', ssrData);

// const services = new Services(
//   config,
//   JSON.parse(
//     `{"_id":"65f8322cf3360f03347a6bdf","_key":"1","name":"article-2","title":"Книга про React","description":"Благодаря компактному размеру гирлянду можно взять с собой и создать праздничную атмосферу в любом месте. Уникальным преимуществом изделия является возможность использовать его при создании декоративных букетов из конфет, фруктов, игрушек, а также живых цветов. Мягкий свет добавит волшебства и сказочности в композицию.","price":210.84,"madeIn":{"_id":"65f8321cf3360f03347a611a","_type":"country"},"edition":2020,"category":{"_id":"65f8322bf3360f03347a6bda","_type":"category"},"order":1,"isNew":true,"proto":{},"_type":"article","dateCreate":"2024-03-18T12:23:08.002Z","dateUpdate":"2024-03-18T12:23:08.002Z","isDeleted":false,"isFavorite":false}`
//   )
// );

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
