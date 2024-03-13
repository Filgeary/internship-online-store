import {createRoot, Root} from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {ServicesContext} from "./context";
import {I18nProvider} from "@src/ww-old-i18n-postponed/context";
import App from './ww-old-app-postponed';
import Services from "./services";
import config from "./config";
import React from "react";

const services: Services = new Services(config);

const root: Root = createRoot(document.getElementById('root') as Element);

// Первый рендер приложения
root.render(
    <ServicesContext.Provider value={services}>
        <I18nProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </I18nProvider>
    </ServicesContext.Provider>
);


