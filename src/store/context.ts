import React from 'react';
import Store from '.';

/**
 * Контекст для Store
 * @type {React.Context<Store>}
 */
export const StoreContext = React.createContext<Store>(null);
