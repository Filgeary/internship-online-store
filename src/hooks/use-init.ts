import { useEffect, useId } from 'react';
import useServices from './use-services';
import { TUpgradedPromise } from '@src/suspense/types';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
export default function useInit(
  initFunc: TInitFunction,
  depends: unknown[] = [],
  options: TInitOptions = { clientSide: false, backForward: false }
) {
  const promiseId = useId();
  const services = useServices();

  if (!options.clientSide) {
    // Ветка выполнения на сервере
    if (typeof global === 'object') {
      // Чтобы не выполнялся второй раз на сервере
      if (services.suspense.executedPromises.includes(promiseId)) return;

      const promiseRes = initFunc() as TUpgradedPromise;
      promiseRes.promiseId = promiseId;

      services.suspense.appendPromise(promiseRes);
    }
  }

  useEffect(() => {
    if (!window.__SSR_REQUESTS__?.includes(promiseId)) {
      initFunc(false);
    }

    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (options.backForward) {
      window.addEventListener('popstate', initFunc);
      return () => {
        window.removeEventListener('popstate', initFunc);
      };
    }
  }, depends);
}

export type TInitFunction = (e?: Event | boolean) => Promise<unknown>;
export type TInitOptions = {
  clientSide?: boolean;
  backForward?: boolean;
};
