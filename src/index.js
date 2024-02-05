import {createRoot} from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {ServicesContext} from "./context";
import App from './app';
import Services from "./services";
import config from "./config";

const services = new Services(config);

const root = createRoot(document.getElementById('root'));

// Первый рендер приложения
root.render(
  <ServicesContext.Provider value={services}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ServicesContext.Provider>
);
