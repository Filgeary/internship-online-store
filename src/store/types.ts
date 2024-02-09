import * as modules from './exports';

type TModules = typeof modules;
export type TDefaultKeysModules = keyof TModules;

export interface IExtendedModules extends TModules {
  separateCatalog: typeof modules.catalog;
}

export type TImportModules = IExtendedModules;
export type TKeyModules = keyof TImportModules;

export type TGlobalState = {
  [key in TKeyModules]: ReturnType<TGlobalActions[key]['initState']>;
};

export type TGlobalActions = {
  [key in TKeyModules]: InstanceType<TImportModules[key]>;
};
