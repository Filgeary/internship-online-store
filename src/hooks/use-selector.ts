import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import useStore from "./use-store";
// Импортируем тип стора.
// Интересно, что если мы импортируем вместо него непосредственно тип стейта:
//   import type TState from '@src/store';
// то автодополнение не будет работать
import type Store from '@src/store';

// Селектор
type TSelectorFunc = (state: Store['state']) => Record<string, unknown>;

/**
 * Хук для выборки данных из store и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector(selectorFunc: TSelectorFunc) {
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
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
