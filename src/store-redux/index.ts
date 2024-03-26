import {applyMiddleware, combineReducers, createStore, compose} from "redux"
import Services from "../services.js"
import thunk from 'redux-thunk'
import * as reducers from './exports'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const composeEnhancers = compose

// export default function createStoreRedux(services: Services, config = {}){
//   return createStore(combineReducers(reducers), undefined, composeEnhancers(applyMiddleware(thunk.withExtraArgument(services))))
// }

export default function createStoreRedux(services: Services, config = {}){
  return createStore(
    combineReducers(reducers), 
    undefined, 
    // applyMiddleware(thunk.withExtraArgument(services))
    );
}
