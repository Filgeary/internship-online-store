import { useLayoutEffect, useMemo, useState } from 'react';
import shallowequal from 'shallowequal';
import useStore from './use-store';

import { TGlobalState } from '@src/store/exports';

type TypedUseSelectorHook<TState> = {
  <TSelected>(selector: (state: TState) => TSelected): TSelected;
  <Selected>(selector: (state: TState) => Selected): Selected;
};

/**
 * Хук для выборки данных из store и отслеживания их изменения
 * @param selectorFunc {Function}
 * @return {*}
 */
export default function useSelector<TState, Selected>(
  selectorFunc: (state: TState) => Selected
): Selected {
  const store = useStore();

  const [state, setState] = useState(() =>
    selectorFunc(store.getState() as TState)
  );

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState() as TState);
      setState((prevState: any) =>
        shallowequal(prevState, newState) ? prevState : newState
      );
    });
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}

export const useAppSelector: TypedUseSelectorHook<TGlobalState> = useSelector;
