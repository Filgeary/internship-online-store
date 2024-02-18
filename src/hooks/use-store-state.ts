import { useLayoutEffect, useMemo } from "react";
import useStore from "./use-store";
import codeGenerator from "@src/utils/code-generator";
import {
  TStoreBasicModuleName,
  TStoreModuleConfigName,
  TStoreNewModuleName,
} from "@src/store/types";

const codeGenerate = codeGenerator();

/**
 * @param base Название базового модуля стейта
 * @param configName  Название конфига
 */
export default function useStoreState(
  base: TStoreBasicModuleName,
  configName: TStoreModuleConfigName
): TStoreNewModuleName | TStoreBasicModuleName {
  const store = useStore();

  // Название нового State в Store
  const stateName = useMemo<TStoreNewModuleName>(() => {
    const newStateName = (base + codeGenerate()) as TStoreNewModuleName;
    store.make(newStateName, base, configName);
    return newStateName;
  }, []); // Нет зависимостей - исполнится один раз

  const removeState = useMemo(() => {
    return () => {
      store.delete(stateName);
    };
  }, []); // Нет зависимостей - исполнится один раз

  // Удаление state при демонтировании компонента
  useLayoutEffect(() => removeState, [removeState]);

  return stateName;
}
