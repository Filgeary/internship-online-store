import createStore from '.';

const store = createStore({}, {});
export type TReduxStoreRoot = ReturnType<typeof store.getState>;
