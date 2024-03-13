import {useLayoutEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import useStore from "./use-store";
import {AssembledState} from "@src/ww-old-store-postponed-modals/types";

/**
 * Хук для выборки данных из ww-old-store-postponed-modals и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector<T>(selectorFunc: (value: AssembledState) => T): T {
  const store = useStore();

  const [state, setState] = useState<T>(() => selectorFunc(store.getState()));

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState: T = selectorFunc(store.getState());
      setState(prevState => shallowequal(prevState, newState) ? prevState : newState);
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от ww-old-store-postponed-modals при демонтировании компонента
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
