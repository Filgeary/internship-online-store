import StoreModule from "../module";
import { InitialStateCountries } from "./type";

class CountriesState extends StoreModule<InitialStateCountries> {
  initState(): InitialStateCountries {
    return {
      list: [],
      waiting: false,
    };
  }
}
