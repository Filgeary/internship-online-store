import React from 'react';
import Services from './services';
import config from './config';

/**
 * Контекст для Services
 * @type {React.Context<Services>}
 */
export const ServicesContext = React.createContext<Services>(new Services(config));
