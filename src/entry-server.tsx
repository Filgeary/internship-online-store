import { StaticRouter } from "react-router-dom/server";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import App from "./app";
import Services from "./services";
import config from "./config";

if (!global.window) {
  global.window = {} as Window & typeof globalThis;
}

type PropsRender = {
  path: string
}

export const render = ({ path }: PropsRender) => {
  const services = new Services(config);
  const app = (
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </I18nProvider>
    </ServicesContext.Provider>
  );

  return {app, services}
};
