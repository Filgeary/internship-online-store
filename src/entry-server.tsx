import { renderToPipeableStream, renderToString } from "react-dom/server";
import App from "./app";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import Services from "./services";
import config from "./config";

type TProps = {
  url: string;
};

export function render({ url }: TProps) {
  const services = new Services(config);

  return renderToPipeableStream(
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
}
