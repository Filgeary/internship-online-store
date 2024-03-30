import { hydrateRoot } from "react-dom/client";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import Services from "./services";
import config from "./config";

// @ts-ignore
const data = window.__SSR_STATE__
// @ts-ignore
 delete window.__SSR_STATE__


const services = new Services(config);

  hydrateRoot(
    document.getElementById("root") as HTMLElement,

    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  );

