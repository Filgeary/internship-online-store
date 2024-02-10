import {useLayoutEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import useStore from "./use-store";
import type { IStoreState } from "@src/store/types";

interface UseSelector {
  <Selected extends object>(
    selectorFunc: (state: IStoreState) => Selected
  ): Selected;
}
// /**
//  * Хук для выборки данных из store и отслеживания их изменения
//  * @param selectorFunc {Function}
//  * @return {*}
//  */

const useSelector: UseSelector = function(selectorFunc) {
  const store = useStore();

  const [state, setState] = useState(() => selectorFunc(store.getState()));

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState());
      setState(prevState => shallowequal(prevState, newState) ? prevState : newState);
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  // @ts-ignore
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}

export default useSelector
