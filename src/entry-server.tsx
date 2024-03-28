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
  data: any
}

export const render = ({ path, data }: Props) => {
  const services = new Services(config, data)
  console.log('в entry-server data===', data)
  
  return renderToString(
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
}