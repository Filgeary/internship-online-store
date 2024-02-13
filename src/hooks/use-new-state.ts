import { useEffect, useState } from 'react';
import useStore from './use-store';
import codeGenerator from '@src/utils/code-generator';
import { BasicStoreModuleKeys, storeConfigModulesKeys } from '@src/store/types';

const codeGenerate = codeGenerator();
/**
 * @deprecated 
 * **Рекомендуется использовать `useStoreState` метод**
 * @param name {String} Основное название нового state
 * @param base {String} Название базового state
 * @param configName {String} Название config
 */
export default function useNewState(name: string, base: BasicStoreModuleKeys, configName: storeConfigModulesKeys) {
    const store = useStore();
    const [stateName, setStateName] = useState<string>();
    const [isCreated, setIsCreated] = useState<boolean>(false);

  useEffect(() => {
    const newStateName = name + codeGenerate();
    store.make(newStateName, base, configName);
    setStateName(newStateName);
    setIsCreated(true);

    return () => {
      store.remove(newStateName);
    }
  }, []);

  return [stateName, isCreated]
}
