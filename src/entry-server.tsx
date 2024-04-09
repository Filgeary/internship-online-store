import {renderToString} from "react-dom/server"
import {StaticRouter} from "react-router-dom/server"
import {Provider} from 'react-redux'
import {ServicesContext} from "./context"
import {I18nProvider} from "./i18n/context"
import App from './app'
import Services from "./services"
import config from "./config"

interface Props {
  path: string
  // services: Services
}

export const render = ({ path }: Props) => {
  console.log('url', path)
  const services = new Services(config)
  
  const app = (
     <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={path}>
            <App />
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
     </Provider>
  )
  return {app, services}
}