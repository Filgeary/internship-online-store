import {applyMiddleware, combineReducers, createStore, compose, AnyAction, StoreEnhancer} from "redux"
import Services from "../services.js"
import thunk, { ThunkDispatch } from 'redux-thunk'
import * as reducers from './exports'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

 let composeEnhancers: (arg0: StoreEnhancer<{ dispatch: ThunkDispatch<any, Services, AnyAction> }, {}>) => StoreEnhancer<unknown, {}> | undefined

if (process.env.IS_SERVER !== 'true') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
} else {
  composeEnhancers = compose
}

//  const composeEnhancers = window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//  const composeEnhancers = compose

// export default function createStoreRedux(services: Services, config = {}){
//   return createStore(combineReducers(reducers), undefined, composeEnhancers(applyMiddleware(thunk.withExtraArgument(services))))
// }

export default function createStoreRedux(services: Services, config = {}){
  return createStore(
    combineReducers(reducers), 
    undefined, 
    applyMiddleware(thunk.withExtraArgument(services))
    )
}
