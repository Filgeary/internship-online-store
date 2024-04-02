import config from "../config";
import Services from "../services";
import qs from "qs"


export default class StoreManager {
  private services: Services;

  constructor() {
    const serverConfig = JSON.parse(JSON.stringify(config));
    serverConfig.store.modules.catalog.changeUrl = false;
    serverConfig.api.baseUrl = "http://example.front.ylab.io";
    this.services = new Services(serverConfig);

    this.services.api
    console.log(this.services);
  }

  async prepareData(url: string) {
    const params = qs.parse(url.slice(2));

    await Promise.all([
      this.services.store.actions.catalog.setParams(params),
      this.services.store.actions.categories.load(),
      this.services.store.actions.countries.load(),
    ]);

    return this.services;
  }
}
