import createStore from '.';

const store = createStore({}, {});
export type TReduxState = ReturnType<typeof store.getState>;
export type TReduxDispatch = typeof store.dispatch;
