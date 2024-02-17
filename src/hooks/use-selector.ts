import { useLayoutEffect, useMemo, useState } from 'react';
import shallowequal from 'shallowequal';
import useStore from './use-store';

import type { TRootState } from '@src/store';

export default function useSelector<T>(selectorFunc: (state: TRootState) => T): T {
  const store = useStore();

  const [state, setState] = useState<T>(() => selectorFunc(store.getState()));

  const unsubscribe = useMemo(() => {
    // Подписка. Возврат функции для отписки
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState());
      setState(prevState => (shallowequal(prevState, newState) ? prevState : newState));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Нет зависимостей - исполнится один раз

  // Отписка от store при демонтировании компонента
  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
