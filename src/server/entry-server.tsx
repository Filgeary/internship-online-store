import { Provider } from "react-redux";
import { ServicesContext } from "../context";
import { I18nProvider } from "../i18n/context";
import App from "../app";
import Services from "../services";
import baseConfig from "../config";
import { StaticRouter } from "react-router-dom/server";


export function render({url}: {url: string}) {
  const config = JSON.parse(JSON.stringify(baseConfig));
  config.store.modules.catalog.changeUrl = false;
  config.api.baseUrl = "http://example.front.ylab.io";
  const services = new Services({config, SSR: true});

    const app = (
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
    )

  return { app , services};
}
