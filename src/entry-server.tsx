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

const services = new Services(config)

export const render = ({ path, data }: Props) => {
  return renderToString(
     <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={path}>
            <App goods={data}/>
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
     </Provider>
  )
}