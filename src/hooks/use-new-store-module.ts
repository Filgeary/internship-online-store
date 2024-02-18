import { useEffect, useState } from "react";
import useStore from "./use-store";
import codeGenerator from "@src/utils/code-generator";
import {
  TStoreBasicModuleName,
  TStoreModuleConfigName,
  TStoreNewModuleName,
} from "@src/store/types";

const codeGenerate = codeGenerator();
/**
 * @deprecated
 * **Рекомендуется использовать `useStoreState` метод**
 * @param name {String} Основное название нового state
 * @param base {String} Название базового state
 * @param configName {String} Название config
 */
export default function useNewStoreModule(
  name: TStoreBasicModuleName,
  base: TStoreBasicModuleName,
  configName: TStoreModuleConfigName
) {
  const store = useStore();
  const [stateName, setStateName] = useState<string>();
  const [isCreated, setIsCreated] = useState<boolean>(false);

  useEffect(() => {
    const newStateName = (name + codeGenerate()) as TStoreNewModuleName;
    store.make(newStateName, base, configName);
    setStateName(newStateName);
    setIsCreated(true);

    return () => {
      store.delete(newStateName);
    };
  }, []);

  return [stateName, isCreated];
}
