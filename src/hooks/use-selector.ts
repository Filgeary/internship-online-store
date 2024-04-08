import { useEffect, useMemo, useState } from "react";
import shallowequal from 'shallowequal';
import useStore from "./use-store";
import { StoreStateType } from "../store/types";

/**
 * Хук для выборки данных из store и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector<T>(selectorFunc: (value: StoreStateType) => T): T {
  const store = useStore();

  const [state, setState] = useState<T>(() => selectorFunc(store.getState()));

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState: T = selectorFunc(store.getState());
      setState(prevState => shallowequal(prevState, newState) ? prevState : newState);
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  useEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
