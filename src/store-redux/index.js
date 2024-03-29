import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkModule from 'redux-thunk';
import * as reducers from './exports';

const thunk = thunkModule.default || thunkModule;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function createStoreRedux(services, config = {}) {
  return createStore(
    combineReducers(reducers),
    undefined,
    applyMiddleware(thunk.withExtraArgument(services)),
  );
}
