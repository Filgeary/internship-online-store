import { useEffect, useState } from 'react';
import useStore from './use-store';
import codeGenerator from '@src/utils/code-generator';

const codeGenerate = codeGenerator();
/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param name {String} Основное название нового state
 * @param base {String} Название базового state
 * @param consfig {String} Название config
 */
export default function useNewState(name, base, configName) {
    const store = useStore();
    const [stateName, setStateName] = useState(null);
    const [isCreated, setIsCreated] = useState(false);

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
