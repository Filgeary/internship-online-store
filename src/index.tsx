import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {Provider} from 'react-redux'
import {ServicesContext} from "./context"
import {I18nProvider} from "./i18n/context"
import App from './app'
import Services from "./services"
import config from "./config"
import { hydrateRoot } from 'react-dom/client'

// const root = createRoot(document.getElementById('root') as HTMLElement)
// const services = new Services(config)

//Первый рендер приложения
// root.render(
//   <Provider store={services.redux}>
//     <ServicesContext.Provider value={services}>
//       <I18nProvider>
//         <BrowserRouter>
//           <App/>
//         </BrowserRouter>
//       </I18nProvider>
//     </ServicesContext.Provider>
//   </Provider>
// );

// const isServer = typeof window === 'undefined'

// if (isServer) {
//   // Если рендеринг на сервере, используем код из entry-client.tsx
//   import('./entry-client')
// } else {
//   // Если рендеринг на клиенте
//   const services = new Services(config);

//   const root = createRoot(document.getElementById('root') as HTMLElement);

//   // Первый рендер приложения
//   root.render(
//     <Provider store={services.redux}>
//       <ServicesContext.Provider value={services}>
//         <I18nProvider>
//           <BrowserRouter>
//             <App/>
//           </BrowserRouter>
//         </I18nProvider>
//       </ServicesContext.Provider>
//     </Provider>
//   );
// }
