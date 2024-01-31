import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk from 'redux-thunk';
import * as reducers from './exports';

export default function createStoreRedux(services, config = {}){
  return createStore(combineReducers(reducers), undefined, applyMiddleware(
    thunk.withExtraArgument(services)
  ));
}
