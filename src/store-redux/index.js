import {applyMiddleware, combineReducers, createStore, compose} from "redux";
import thunk from 'redux-thunk';
import * as reducers from './exports';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default function createStoreRedux(services, config = {}){
//   return createStore(combineReducers(reducers), undefined, applyMiddleware(
//     thunk.withExtraArgument(services)
//   ));
// }

export default function createStoreRedux(services, config = {}){
  return createStore(combineReducers(reducers), undefined, composeEnhancers(applyMiddleware(thunk.withExtraArgument(services))))
}
