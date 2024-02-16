import React from 'react';
import Services from "@src/services";

type TService = InstanceType<typeof Services>

/**
 * Контекст для Services
 * @type {React.Context<Services>}
 */
export const ServicesContext: React.Context<TService> = React.createContext({} as TService);
