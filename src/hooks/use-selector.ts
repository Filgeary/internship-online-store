import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import shallowequal from "shallowequal";
import useStore from "./use-store";
import { TState } from "@src/store/types";

type TSelectorFunc<T> = (state: TState) => T;
/**
 * Хук для выборки данных из store и отслеживания их изменения
 */
export default function useSelector<T>(selectorFunc: TSelectorFunc<T>) {
  const store = useStore();

  const [state, setState] = useState(() => selectorFunc(store.getState()));

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState());
      setState((prevState) =>
        shallowequal(prevState, newState) ? prevState : newState
      );
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
