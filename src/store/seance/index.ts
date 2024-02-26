import StoreModule from "../module";
import { ConfigWS, InitialStateSeance } from "./type";

class SeanceState extends StoreModule<InitialStateSeance, ConfigWS> {
  initState(): InitialStateSeance {
    return {
      ws: null,
      connection: false,
      messages: []
    };
  }

  initConfig(): ConfigWS {
    return {} as ConfigWS;
  }

  connection() {

  }
}

export default SeanceState
