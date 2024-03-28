import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import { withExtraArgument } from "redux-thunk";
import * as reducers from "./exports";

export default function createStoreRedux(services: any, config = {}) {
  return createStore(
    combineReducers(reducers),
    undefined,
    applyMiddleware(withExtraArgument(services))
  );
}
