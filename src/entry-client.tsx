import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {ServicesContext} from "./context";
import {I18nProvider} from "./i18n/context";
import App from './app';
import Services from "./services";
import config from "./config";
import './global.css';

const services = new Services(config, window.__PRELOADED_STATE__);

const script = document.getElementById("preload");
if(script)
document.body.removeChild(script);
delete window.__PRELOADED_STATE__;

const root = document.getElementById("root") as HTMLElement;
if(!root) throw new Error("Failed to find the root element");
const ROOT = () => (
  <ServicesContext.Provider value={services}>
    <I18nProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </ServicesContext.Provider>
);
// Первый рендер приложения
  hydrateRoot(
    root,
    <ServicesContext.Provider value={services}>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ServicesContext.Provider>
  );
  // createRoot(root).render(<ROOT />)
