import { Provider } from "react-redux";
import { ServicesContext } from "../context";
import { I18nProvider } from "../i18n/context";
import App from "../app";
import Services from "../services";
import config from "../config";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

const services = new Services(config);

export function render({url}: {url: string}) {
  const htmlRender = ReactDOMServer.renderToString(
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  );

  return htmlRender;
}
