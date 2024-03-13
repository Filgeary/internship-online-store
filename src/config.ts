import {AllModules, ImportModules, TModulesConfig} from "@src/ww-old-store-postponed-modals/types";
import {number} from "prop-types";


const isProduction = process.env.NODE_ENV === 'production';

// Это конфиг для заполнения с помощью него будут инициализироваться обязательные поля в модулях
const defaultConfig = {
  store: {
    log: !isProduction,
    modules: {
      session: {
        tokenHeader: 'X-Token'
      },
      catalog: {
        entryURLParams: true,
      },
      chat: {
        connectionName: '/chat'
      }
    }
  },
  api: {
    baseUrl: ''
  },
  websocket: {
    baseUrl: 'ws://example.front.ylab.io',
  }
}

// Получаем тип конфига
type TConfig = typeof defaultConfig;
// Тип модулей
type TStoreModules = TConfig['store']['modules'];
// Ключи "существующих" модулей
type TStoreModulesKeys = keyof TStoreModules;
// Ключи модулей, которых нет в конфиге, но они могут существовать
type exceptForConfigurationModules = keyof Omit<ImportModules, TStoreModulesKeys>
// С помощью этого типа можно будет сделать свойства в типе T, которые пересекаются со свойствами в типе K необязательными.
// Omit<T, K> удаляет все свойства из типа T, которые перечислены в типе K. Таким образом, создается новый тип без указанных свойств.
// Pick<T, K> выбирает только указанные свойства из типа T.
// Partial<Pick<T, K>> делает только выбранные свойства необязательными, превращая их в key?: value.
// С помощью & объединяются типы без указанных свойств (сделанных частично необязательными) и только указанных свойств (сделанных частично необязательными).
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Тип, который будет представлять объект модулей, при этом модули которые не присутствуют в конфиге будут помечены как необязательные
export type CurrentModuleConfig = PartialBy<TModulesConfig, exceptForConfigurationModules>

// Тип для всей конфигурации
export interface Config {
  store: {
    log: boolean;
    modules: CurrentModuleConfig;
  };
  api: {
    baseUrl: string;
  };
  websocket: {
    baseUrl: string;
  };
}
const config: Config = defaultConfig;
export default config;
