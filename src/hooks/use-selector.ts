import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import shallowequal from 'shallowequal';
import useStore from "./use-store";
// Тут была ошибка с импортом, которую заметил не сразу: я забыл поставить фигурные скобки `{ ... }`
// и вместо типа стейта импортился тип класса стора по дефолтному экспорту.
import { type TState } from '@src/store';

/**
 * Хук для выборки данных из store и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector<T>(selectorFunc: (state: TState) => T) {
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
