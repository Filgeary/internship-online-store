import {AllModules, ImportModules} from "@src/store/types";


const isProduction = process.env.NODE_ENV === 'production';

const compositeConfig = {
  store: {
    log: !isProduction,
    modules: {
      session: {
        tokenHeader: 'X-Token'
      },
      catalog: {
        entryURLParams: true,
      },
    }
  },
  api: {
    baseUrl: ''
  }
}

type TConfig = typeof compositeConfig;
type TStoreModules = TConfig['store']['modules'];
type TStoreModulesKeys = keyof TStoreModules;
type exceptForConfigurationModules = keyof Omit<ImportModules, TStoreModulesKeys>

type ModuleConfigExt<Module> = Module extends TStoreModulesKeys ? TStoreModules[Module] : {};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Объединим типы для всех модулей
export type ModuleConfig = {
  [key in AllModules]: ModuleConfigExt<key>;
};

export type CurrentModuleConfig = PartialBy<ModuleConfig, exceptForConfigurationModules>

// Тип для всей конфигурации
export interface Config {
  store: {
    log: boolean;
    modules: CurrentModuleConfig;
  };
  api: {
    baseUrl: string;
  };
}

const config: Config = compositeConfig;
export default config;
