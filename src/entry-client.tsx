import { hydrateRoot } from "react-dom/client";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import Services from "./services";
import config from "./config";

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
