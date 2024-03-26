import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ServicesContext } from "../context";
import { I18nProvider } from "../i18n/context";
import App from "../app";
import Services from "../services";
import config from "../config";
import ReactDOM from "react-dom/client";

const services = new Services(config);

ReactDOM.hydrateRoot(
  document.getElementById("root"),
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
