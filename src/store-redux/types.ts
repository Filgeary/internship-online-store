import Services from '@src/services';
import createStore from '.';

const store = createStore({} as Services, {});
export type TReduxState = ReturnType<typeof store.getState>;
export type TReduxDispatch = typeof store.dispatch;
