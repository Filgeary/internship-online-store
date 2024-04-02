import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ServicesContext } from "../context";
import { I18nProvider } from "../i18n/context";
import App from "../app";
import Services from "../services";
import config from "../config";
import ReactDOM from "react-dom/client";

//@ts-ignore
const storeState = window.__PRELOADED_STATE__;
//@ts-ignore
const initials = window.__STATE_NAMES__;
const services = new Services({config, storeState, initials});
const script = document.getElementById("preload");
console.log(initials)
console.log(storeState);
script.parentNode.removeChild(script);

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
