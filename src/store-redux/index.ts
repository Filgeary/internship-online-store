import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import thunk from "redux-thunk";
import * as reducers from "./exports";
import Services from "@src/services";

export default function createStoreRedux(services: Services, config = {}) {
  return createStore(
    combineReducers(reducers),
    undefined,
    applyMiddleware(thunk.withExtraArgument(services))
  );
}
