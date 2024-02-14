import * as modules from './exports';

export type TModules = typeof modules;
export type TDefaultKeysModules = keyof TModules;

export type TExtendedKeysModules = keyof TModules;
export type TExtendedModules<T extends keyof TModules> = T | `${T}-${string}`;

export type TImportModules = TModules;
export type TKeyModules = keyof TImportModules;

export type TGlobalState = {
  [key in TExtendedKeysModules as TExtendedModules<key>]: ReturnType<
    TGlobalActions[key]['initState']
  >;
};

export type TGlobalActions = {
  [key in TExtendedKeysModules as TExtendedModules<key>]: InstanceType<
    TImportModules[key]
  >;
};
