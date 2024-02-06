import React from 'react';
import Services from './services';

/**
 * Контекст для Services
 * @type {React.Context<Services>}
 */
export const ServicesContext: React.Context<Services | null> = React.createContext<Services | null>(null);
