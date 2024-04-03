import { useEffect } from 'react';
import useServices from './use-services';
import isPromise from '@src/utils/is-promise';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
export default function useInit(
  initFunc: (arg?: Event | boolean) => unknown | Promise<unknown>,
  depends: Array<unknown> = [],
  options: Partial<TInitOptions> = {}
) {
  const SSR = useServices().ssr;

  if (import.meta.env.SSR && options.ssrKey) {
    if (!SSR.has(options.ssrKey)) {
      try {
        const promise = initFunc() as Promise<unknown>;
        if (isPromise(promise)) SSR.add(options.ssrKey, promise);
      } catch (e) {
        console.error(e);
      }
    }
  }

  useEffect(() => {
    if ((!options.ssrKey || !SSR.has(options.ssrKey)) && !import.meta.env.SSR) {
      if(!SSR.config.isFirstRender) {
        initFunc(false);
      } else {
        SSR.config.isFirstRender = false;
      }
    } else {
      if (options.ssrKey && SSR.has(options.ssrKey)) SSR.delete(options.ssrKey);
    }
    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (options.backForward) {
      window.addEventListener("popstate", initFunc);
      return () => {
        window.removeEventListener("popstate", initFunc);
      };
    }
  }, depends);
}

type TInitOptions = {
  ssrKey: string;
  backForward: boolean;
}
