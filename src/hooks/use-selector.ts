import { useLayoutEffect, useMemo, useState } from "react";
import shallowequal from "shallowequal";
import useStore from "./use-store";
import { TStoreState } from "@src/store/types";


/**
 * Хук для выборки данных из store и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector(
  selectorFunc: (arg: TStoreState) => any
): any {
  const store = useStore();

  const [state, setState] = useState(() => selectorFunc(store.getState()));

  const unsubscribe: any = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState());
      setState((prevState: any) =>
        shallowequal(prevState, newState) ? prevState : newState
      );
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
