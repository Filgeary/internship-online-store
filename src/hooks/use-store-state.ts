import { useLayoutEffect, useMemo } from "react";
import useStore from "./use-store";
import codeGenerator from "@src/utils/code-generator";
import {
  BasicStoreModuleKeys,
  StoreCopyModuleKeys,
} from "@src/store/types";
import { StoreConfigModulesKeys } from "@src/types";

const codeGenerate = codeGenerator();

/**
 * Хук для **создания** `State` на основе имеющегося в `Store`.
 * Возвращает **название** нового `State` в `Store`
 * @param base {String} Название базового state
 * @param configName {String} Название config
 */
export default function useStoreState(base: BasicStoreModuleKeys, configName: StoreConfigModulesKeys): string {
  const store = useStore();

  // Название нового State в Store
  const stateName = useMemo<StoreCopyModuleKeys>(() => {
    const newStateName = base + codeGenerate() as StoreCopyModuleKeys;
    store.make(newStateName, base, configName);
    return newStateName;
  }, []); // Нет зависимостей - исполнится один раз

  const removeState = useMemo(() => {
    return () => {
      store.remove(stateName);
    };
  }, []); // Нет зависимостей - исполнится один раз

  // Удаление state при демонтировании компонента
  useLayoutEffect(() => removeState, [removeState]);

  return stateName;
}
