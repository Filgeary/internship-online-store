import {hydrateRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import {Provider} from 'react-redux'
import {ServicesContext} from "./context"
import {I18nProvider} from "./i18n/context"
import App from './app'
import Services from "./services"
import config from "./config"

// @ts-ignore
 const data = window.__SSR_DATA__
// @ts-ignore
 delete window.__SSR_DATA__

const services = new Services(config, data)

// export const root = hydrateRoot(
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
