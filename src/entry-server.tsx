import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import App from "./app";
import Services from "./services";
import config from "./config";

const services = new Services(config);
if (!global.window) {
  global.window = {} as Window & typeof globalThis;
}

if (!global.document) {
  global.document = {} as Document;
}

type PropsRender = {
  path: string
}
// React.useLayoutEffect = React.useEffect

export const render = ({ path }: PropsRender) => {
  return renderToString(
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </I18nProvider>
    </ServicesContext.Provider>
  );};
