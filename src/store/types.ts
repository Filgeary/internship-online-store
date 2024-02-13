import * as modules from './exports';

export type TModules = typeof modules;
export type TDefaultKeysModules = keyof TModules;

export interface IExtendedModules extends TModules {
  separateCatalog: typeof modules.catalog;
}

export type TExtendedKeysModules = keyof IExtendedModules;
// export type TExtendedModules<T extends keyof IExtendedModules> =
//   | T
//   | `${T}-${number}`;

export type TImportModules = IExtendedModules;
export type TKeyModules = keyof TImportModules;

export type TGlobalState = {
  [key in TExtendedKeysModules]: ReturnType<TGlobalActions[key]['initState']>;
};

export type TGlobalActions = {
  [key in TExtendedKeysModules]: InstanceType<TImportModules[key]>;
};
