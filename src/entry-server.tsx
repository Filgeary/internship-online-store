import { renderToString } from "react-dom/server";
import App from "./app";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import { ServicesContext } from "./context";
import { I18nProvider } from "./i18n/context";
import Services from "./services";
import config from "./config";

type TProps = {
  url: string;
  data: any;
};

export function render({ url, data }: TProps) {
  const services = new Services(config);
  services.store.actions.catalog.setState({
    list: [...data.catalog],
    params: {
      page: 0,
      limit: 0,
      sort: null,
      query: null,
      category: undefined,
      madeIn: null,
    },
    count: 0,
    selectedItems: [],
    waiting: false,
  });
  services.store.actions.categories.setState({
    list: [...data.categories],
    waiting: false,
  });

  return renderToString(
    <Provider store={services.redux}>
      <ServicesContext.Provider value={services}>
        <I18nProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </I18nProvider>
      </ServicesContext.Provider>
    </Provider>
  );
}
