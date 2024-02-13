import React from 'react';
import Store from '.';
import Services from '@src/services';
import config from '@src/config';

/**
 * Контекст для Store
 * @type {React.Context<Store>}
 */
export const StoreContext = React.createContext<Store>(new Store(new Services(config), config.store));
