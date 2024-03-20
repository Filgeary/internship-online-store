import {createRoot, Root} from 'react-dom/client';
import {ServicesContext} from "./context";
import App from '@src/app/index';
import Services from "./services";
import config from "@src/config";
import React from "react";
import {I18nProvider} from "@src/shared/i18n/context";

const services: Services = new Services(config);

const root: Root = createRoot(document.getElementById('root') as Element);

// Первый рендер приложения
root.render(
  <ServicesContext.Provider value={services}>
    <I18nProvider>
      <App/>
    </I18nProvider>
  </ServicesContext.Provider>
);


