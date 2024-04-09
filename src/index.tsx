import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {Provider} from 'react-redux'
import {ServicesContext} from "./context"
import {I18nProvider} from "./i18n/context"
import { hydrateRoot } from 'react-dom/client'
import App from './app'
import Services from "./services"
import config from "./config"


const data = window.__SSR_DATA__

const services = new Services(config, data)

delete window.__SSR_DATA__

if (process.env.IS_SERVER === 'true') {
  // Если рендеринг на сервере, используем код из entry-client.tsx
hydrateRoot(
    document.getElementById?.("root") as HTMLElement,
     <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </I18nProvider>
      </ServicesContext.Provider>
     </Provider>
  )
} else {
  // Если рендеринг на клиенте
  const root = createRoot(document.getElementById('root') as HTMLElement);

  // Первый рендер приложения
  root.render(
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  )
}
